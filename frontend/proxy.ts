import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "@/lib/cookie";

const authPages = ['/', '/login', '/register', '/forget-password', '/reset-password'];
const adminRoutes = ['/admin'];
const userRoutes = ['/user'];

const getHomeByRole = (role?: string) =>
  role === 'admin' ? '/admin' : '/user/home';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getAuthToken();
  const user = token ? await getUserData() : null;

  const isAuthPage = authPages.includes(pathname);
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isUserRoute = userRoutes.some(route => pathname.startsWith(route));

  // 1️⃣ Logged-in users → block auth & landing pages
  if (token && isAuthPage) {
    return NextResponse.redirect(
      new URL(getHomeByRole(user?.role), request.url)
    );
  }

  // 2️⃣ Logged-out users → block protected routes
  if (!token && (isAdminRoute || isUserRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3️⃣ Role-based strict separation
  if (token && user) {
    // Admin only
    if (isAdminRoute && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/user/home', request.url));
    }

    // User only
    if (isUserRoute && user.role !== 'user') {
      return NextResponse.redirect(
        new URL(getHomeByRole(user.role), request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/forget-password',
    '/reset-password',
    '/admin/:path*',
    '/user/:path*'
  ],
};
