import Link from "next/link";
import NewContactForm from "./NewContactForm";

export const metadata = { title: "Add contact | RHM Cards" };

export default function NewContact() {
  return (
    <div>
      <div className="page-head">
        <div>
          <Link href="/contacts" className="small">Back to contacts</Link>
          <h1 style={{ marginTop: 6 }}>Add a contact</h1>
        </div>
      </div>
      <NewContactForm />
    </div>
  );
}
