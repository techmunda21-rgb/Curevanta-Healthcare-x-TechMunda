import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const PUBLIC = new Set(["/", "/onboarding", "/login", "/unauthorized"]);

function homeForRole(role?: string, email?: string | null) {
  const e = (email ?? "").toLowerCase();
  if (e.includes("patient") || role === "CLIENT") return "/patient/home";
  if (e.includes("doctor")) return "/doctor";
  return "/dashboard";
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/live") ||
    pathname.startsWith("/api/mobile")
  ) {
    return NextResponse.next();
  }

  if (PUBLIC.has(pathname)) {
    if (isLoggedIn && (pathname === "/login" || pathname === "/")) {
      return NextResponse.redirect(
        new URL(
          homeForRole(req.auth?.user?.role as string | undefined, req.auth?.user?.email),
          req.url,
        ),
      );
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
