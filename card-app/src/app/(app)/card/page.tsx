import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { appUrl } from "@/lib/config";
import CardForm from "./CardForm";

export const metadata = { title: "My card | RHM Cards" };

export default async function CardPage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const user = await requireUser();
  const offices = await db.office.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
  const welcome = (await searchParams).welcome === "1";
  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">My card</p>
          <h1 style={{ marginTop: 6 }}>{welcome ? "Set up your card" : "Edit your card"}</h1>
          {welcome && <p className="muted" style={{ marginTop: 6 }}>Fill this out once. Your QR code and link are made for you when you save.</p>}
        </div>
      </div>
      <CardForm
        base={`${appUrl()}/c/`}
        offices={offices}
        initial={{
          firstName: user.firstName,
          lastName: user.lastName,
          pronouns: user.pronouns ?? "",
          title: user.title ?? "",
          jobRole: user.jobRole ?? "",
          officeId: user.officeId ?? "",
          phone: user.phone ?? "",
          mobile: user.mobile ?? "",
          bio: user.bio ?? "",
          photo: user.photo ?? "",
          website: user.website ?? "",
          linkedin: user.linkedin ?? "",
          calendarUrl: user.calendarUrl ?? "",
          slug: user.slug,
          links: (user.links as { label: string; url: string }[]) ?? [],
          email: user.email,
        }}
      />
    </div>
  );
}
