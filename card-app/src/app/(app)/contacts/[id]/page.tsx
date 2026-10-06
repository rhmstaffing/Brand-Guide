import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { contactFor } from "@/lib/contacts";
import { sfRecordUrl } from "@/lib/salesforce";
import { ContactEditor } from "@/components/ContactEditor";

export const metadata = { title: "Contact | RHM Cards" };

export default async function ContactPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ u?: string }> }) {
  const user = await requireUser();
  const c = await contactFor(user, (await params).id);
  if (!c) notFound();
  const uncertain = ((await searchParams).u || "").split(",").filter(Boolean);
  return (
    <div>
      <div className="page-head">
        <div>
          <Link href="/contacts" className="small">Back to contacts</Link>
          <h1 style={{ marginTop: 6 }}>{c.status === "DRAFT" ? "Review and fix" : `${c.firstName} ${c.lastName}`.trim() || "Contact"}</h1>
          {c.status === "DRAFT" && <p className="muted" style={{ marginTop: 6 }}>Fix anything the scan got wrong, then send it to Salesforce.</p>}
        </div>
      </div>
      <ContactEditor
        uncertain={uncertain}
        initial={{
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email ?? "",
          phone: c.phone ?? "",
          company: c.company ?? "",
          title: c.title ?? "",
          website: c.website ?? "",
          address: c.address ?? "",
          notes: c.notes ?? "",
          rawText: c.rawText ?? "",
          kind: c.kind,
          tags: c.tags,
          scanImage: c.scanImage ?? "",
          status: c.status,
          source: c.source,
          sfError: c.sfError ?? "",
          sfUrl: sfRecordUrl(c) ?? "",
        }}
      />
    </div>
  );
}
