import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = [
  "/dashboard",
  "/medicines",
  "/inventory",
  "/sales",
  "/reports",
];

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  // Public page
  if (!isProtected) {
    return NextResponse.next();
  }

  // No token
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );

    await jwtVerify(token, secret);

    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/medicines/:path*",
    "/inventory/:path*",
    "/sales/:path*",
    "/reports/:path*"
  ],
};