import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/me"];
const authPaths = ["/login", "/register"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const sesstionToken = request.cookies.get("sesstionToken");

  // Check private paths
  if (privatePaths.includes(pathName) && !sesstionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (authPaths.includes(pathName) && sesstionToken) {
    return NextResponse.redirect(new URL("/me", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [...privatePaths, ...authPaths],
};
