
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/auth/dashboard") && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (pathname === "/auth" && token) {
    return NextResponse.redirect(new URL("/auth/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*"],
};