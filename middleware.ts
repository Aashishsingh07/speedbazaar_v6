import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/checkout", "/orders", "/profile", "/seller", "/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"));
  if (!isProtected) return NextResponse.next();

  const session = req.cookies.get("sbz_session")?.value;
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/profile/:path*", "/seller/:path*", "/admin/:path*"],
};
