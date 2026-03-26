import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Browser ki cookies se token nikalna
    const token = request.cookies.get('admin_token')?.value;

    const path = request.nextUrl.pathname;

    // 2. Raston (Routes) ki pehchan karna
    const isProtectedRoute = path.startsWith('/crm-dashboard'); 
    const isPublicRoute = path === '/login' || path === '/signup';

    // 🛑 CONDITION 1: Bina Token ke Dashboard access karne ki koshish
    if (isProtectedRoute && !token) {
        // Token nahi hai, toh seedha Login page par bhej do
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 🛑 CONDITION 2: Token hone ke baad wapas Login/Signup page kholne ki koshish
    if (isPublicRoute && token) {
        // Agar already logged in hai, toh wapas Dashboard par bhej do
        return NextResponse.redirect(new URL('/crm-dashboard', request.url));
    }

    // ✅ CONDITION 3: Rasta clear hai (Let them pass)
    return NextResponse.next();
}

// 🎯 MATCHER: Ye bouncer sirf inhi raston par duty dega
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images (public images)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
};