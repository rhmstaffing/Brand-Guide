import Link from "next/link";
import { ocrConfigured } from "@/lib/ocr";
import Scanner from "./Scanner";

export const metadata = { title: "Scan | RHM Cards" };

export default function ScanPage() {
  return (
    <div>
      <div className="page-head">
        <div>
          <Link href="/contacts" className="small">Back to contacts</Link>
          <h1 style={{ marginTop: 6 }}>Scan a document</h1>
          <p className="muted" style={{ marginTop: 6 }}>Business cards, resumes, sign-in sheets or handwritten notes. You'll review everything before it goes to Salesforce.</p>
        </div>
      </div>
      {!ocrConfigured() && <div className="alert warn" style={{ marginBottom: 16 }}>Scanning is not turned on yet. An admin needs to add the ANTHROPIC_API_KEY setting.</div>}
      <Scanner />
    </div>
  );
}
