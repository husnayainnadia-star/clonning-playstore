import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/auth/signin?callbackUrl=/admin", req.url));
    }
    if ((req.auth.user as any)?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
