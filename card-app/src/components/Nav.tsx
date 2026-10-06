"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

type Item = { href: string; label: string; icon: string; short?: string };

export function Nav({ isAdmin, name }: { isAdmin: boolean; name: string }) {
  const path = usePathname();
  const items: Item[] = [
    { href: "/dashboard", label: "My dashboard", short: "Home", icon: "home" },
    { href: "/card", label: "My card", short: "Card", icon: "card" },
    { href: "/share", label: "Share and QR", short: "Share", icon: "qr" },
    { href: "/contacts", label: "Contacts", short: "Contacts", icon: "users" },
    { href: "/contacts/scan", label: "Scan a document", short: "Scan", icon: "scan" },
    { href: "/team", label: "Company dashboard", icon: "chart" },
  ];
  if (isAdmin) items.push({ href: "/admin", label: "Admin", icon: "shield" });
  const on = (href: string) => (href === "/contacts" ? path === "/contacts" || /^\/contacts\/(?!scan)/.test(path) : path.startsWith(href));
  const tabs = items.filter((i) => i.short);
  return (
    <>
      <aside className="side">
        <img src="/brand/rhm-horizontal-white.png" alt="RHM Staffing Solutions" />
        {items.map((i) => (
          <Link key={i.href} href={i.href} className={on(i.href) ? "on" : ""}>
            <Icon name={i.icon} size={18} /> {i.label}
          </Link>
        ))}
        <div className="who">
          <div style={{ color: "#fff" }}>{name}</div>
          <form action="/api/auth/logout" method="post" style={{ marginTop: 8 }}>
            <button className="btn outlineInverse sm" style={{ background: "transparent", color: "#C9D6E6", padding: 0, height: "auto" }}>
              <Icon name="logout" size={16} /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <header className="topbar">
        <img src="/brand/rhm-horizontal-white.png" alt="RHM Staffing Solutions" />
        <div className="row" style={{ gap: 16 }}>
          <Link href="/team">Company</Link>
          {isAdmin && <Link href="/admin">Admin</Link>}
          <form action="/api/auth/logout" method="post">
            <button style={{ background: "none", border: 0, color: "#fff", font: "inherit", fontSize: 14, padding: 0 }}>Sign out</button>
          </form>
        </div>
      </header>
      <nav className="tabbar">
        {tabs.map((i) => (
          <Link key={i.href} href={i.href} className={on(i.href) ? "on" : ""}>
            <Icon name={i.icon} size={22} />
            {i.short}
          </Link>
        ))}
      </nav>
    </>
  );
}
