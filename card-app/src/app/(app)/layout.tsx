import { requireUser } from "@/lib/auth";
import { Nav } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const name = `${user.firstName} ${user.lastName}`.trim() || user.email;
  return (
    <div className="shell">
      <Nav isAdmin={user.role === "ADMIN"} name={name} />
      <main className="main">{children}</main>
    </div>
  );
}
