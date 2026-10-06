import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in | RHM Cards" };

export default async function LoginPage() {
  if (await getSession()) redirect("/dashboard");
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--gradient-deep)", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <img src="/brand/rhm-horizontal-white.png" alt="RHM Staffing Solutions" style={{ width: 240, display: "block", margin: "0 auto 32px" }} />
        <div className="card" style={{ padding: 28 }}>
          <LoginForm />
        </div>
        <p className="small" style={{ color: "#C9D6E6", textAlign: "center", marginTop: 16 }}>
          For RHM Staffing Solutions team members only.
        </p>
      </div>
    </div>
  );
}
