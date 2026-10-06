import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

// Reads business cards, resumes, sign-in sheets and handwritten notes from photos.
// Returns the full transcription plus best-guess contact fields for the person to review.

export const ScanResult = z.object({
  fullText: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  company: z.string(),
  title: z.string(),
  website: z.string(),
  address: z.string(),
  notes: z.string(),
  kind: z.enum(["CANDIDATE", "CLIENT", "OTHER"]),
  uncertain: z.array(z.string()),
});
export type ScanResult = z.infer<typeof ScanResult>;

const SYSTEM = `You digitize photos for recruiters and account executives at a staffing company.
The photo may be a business card, a resume, a sign-in sheet, a form, or handwritten notes.

1. fullText: transcribe every readable word, keeping line breaks and reading order. Transcribe handwriting as written. Mark words you cannot read as [illegible].
2. Fill the contact fields for the main person on the page. Leave a field as an empty string when it is not on the page. Never invent values.
3. phone: format US numbers as (555) 555-5555. Keep extensions.
4. notes: anything useful that is not a contact field (skills, availability, pay rate, follow-up asks, handwritten comments).
5. kind: CANDIDATE if this looks like a job seeker (resume, application, skills list), CLIENT if it looks like a business contact or hiring company, otherwise OTHER.
6. uncertain: list the names of fields you were unsure about (for example a hard to read email), so the user knows to double check them.`;

export function ocrConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function scanImages(images: { data: string; mediaType: "image/jpeg" | "image/png" | "image/webp" }[]) {
  const client = new Anthropic();
  const content: Anthropic.ContentBlockParam[] = [
    ...images.map(
      (img): Anthropic.ContentBlockParam => ({
        type: "image",
        source: { type: "base64", media_type: img.mediaType, data: img.data },
      }),
    ),
    {
      type: "text",
      text: images.length > 1 ? `These ${images.length} photos are pages of the same document.` : "Digitize this photo.",
    },
  ];
  const response = await client.messages.parse({
    model: process.env.OCR_MODEL || "claude-opus-5-5",
    max_tokens: 16000,
    output_config: { effort: "low", format: zodOutputFormat(ScanResult) },
    system: SYSTEM,
    messages: [{ role: "user", content }],
  });
  if (response.stop_reason === "refusal") throw new Error("The scan could not be read. Try another photo.");
  if (!response.parsed_output) throw new Error("The scan came back empty. Try a clearer photo.");
  return response.parsed_output;
}
