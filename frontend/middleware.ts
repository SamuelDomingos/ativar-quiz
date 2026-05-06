import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/api/auth/",
  "/api/public/",
  "/favicon.ico",
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_ROUTES.some((publicPath) => pathname.startsWith(publicPath))) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (token) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/login", req.url)
  loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon\\.ico).*)",
}
