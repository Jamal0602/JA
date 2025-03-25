import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Check if the request is for the admin area
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const sessionId = request.cookies.get("session_id")?.value

    // If no session, redirect to login
    if (!sessionId) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // For API routes, we'll check the session in the route handler
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

