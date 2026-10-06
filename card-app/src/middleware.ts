import { NextResponse, type NextRequest } from "next/server";

const PUBLIC = [/^\/login/, /^\/c\//, /^\/r\//, /^\/api\/auth\//, /^\/api\/public\//, /^\/api\/integrations\//, /^\/api\/cron\//, /^\/manifest/, /^\/sw\.js$/, /^\/fonts\//, /^\/brand\//];

// Cheap cookie check only. The real check (revoked session, archived user)
// happens on the server for every page and API call.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.some((r) => r.test(pathname))) return NextResponse.next();
  if (!req.cookies.get("rhm_session")) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/|favicon.ico).*)"] };
