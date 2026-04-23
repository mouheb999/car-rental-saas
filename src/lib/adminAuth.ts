import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Cookie name holding the admin session token. Set HTTP-only so client JS
 * (and any XSS injection) cannot read or exfiltrate it.
 */
export const ADMIN_COOKIE = "alia-admin-session";

/**
 * Check that the current request has a valid admin cookie matching
 * the server-side ADMIN_PASSWORD. Returns true if authorized.
 *
 * ⚠ Uses constant-time comparison to avoid timing attacks.
 */
export function isAdminRequestAuthorized(): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return timingSafeEqual(token, expected);
}

/**
 * Helper for API routes: returns a 401 JSON response if unauthorized,
 * otherwise null (caller can proceed).
 */
export function requireAdmin(): NextResponse | null {
  if (!isAdminRequestAuthorized()) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  return null;
}

/**
 * Constant-time string comparison. Avoids leaking password length/content
 * through wall-clock timing on ===.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
