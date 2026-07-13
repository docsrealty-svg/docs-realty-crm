import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Docs Realty CRM"' },
  });
}

function hasValidAuth(request: NextRequest) {
  const user = process.env.CRM_BASIC_USER || "docs";
  const password = process.env.CRM_BASIC_PASSWORD || "DocsRealty2026!";
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;

  const decoded = atob(header.slice(6));
  return decoded === `${user}:${password}`;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const isDocsCrm = host.includes("docs-realty-crm");
  const isAeCrm = host.includes("automatizaciones-express-crm");
  const isCrmHost = isDocsCrm || isAeCrm;

  if (isDocsCrm && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/crm", request.url));
  }

  const protectedPath =
    request.nextUrl.pathname.startsWith("/crm") ||
    request.nextUrl.pathname.startsWith("/api/whatsapp-qr");

  if (!isCrmHost && protectedPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isCrmHost && protectedPath && !hasValidAuth(request)) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/crm/:path*", "/api/whatsapp-qr/:path*"],
};
