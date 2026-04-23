import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/adminAuth";

/**
 * Gatekeeper for all admin routes (pages + API).
 *
 * Pages under /admin/**  → redirect to /admin/login if no valid cookie.
 * APIs under /api/admin/** → return 401 JSON if no valid cookie.
 *
 * We keep the comparison here simple (cookie value equals ADMIN_PASSWORD)
 * because middleware runs on the Edge runtime where Node APIs are limited.
 * Same timing-safety is enforced inside each API route via `requireAdmin()`.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const expected = process.env.ADMIN_PASSWORD ?? "";
  const token = req.cookies.get(ADMIN_COOKIE)?.value ?? "";
  const authed = expected.length > 0 && token === expected;

  // Login page and its API are always accessible
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Protect admin API
  if (pathname.startsWith("/api/admin/")) {
    if (!authed) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Protect admin pages
  if (pathname.startsWith("/admin")) {
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
