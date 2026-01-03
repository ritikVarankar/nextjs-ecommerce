import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { USER_DASHBOARD, WEBSITE_LOGIN } from './routes/WebsiteRoute';
import { jwtVerify } from 'jose';
import { ADMIN_DASHBOARD } from './routes/AdminPanelRoute';

export async function middleware(request: NextRequest) {
    try {
        const pathname = request.nextUrl.pathname;

        const tokenCookie = request.cookies.get('access_token');
        const hasToken = !!tokenCookie;

        // User NOT logged in
        if (!hasToken) {
            if (!pathname.startsWith('/auth')) {
                return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
            }
            return NextResponse.next();
        }

        // extract token value
        const accessToken = tokenCookie.value;

        // verify token
        const { payload } = await jwtVerify(
            accessToken,
            new TextEncoder().encode(process.env.SECRET_KEY)
        );

        const role = payload.role;

        // Logged-in user should not access /auth pages
        if (pathname.startsWith('/auth')) {
            return NextResponse.redirect(
                new URL(role === 'admin' ? ADMIN_DASHBOARD : USER_DASHBOARD, request.url)
            );
        }

        // Protect admin routes
        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
        }

        // Protect user routes
        if (pathname.startsWith('/my-account') && role !== 'user') {
            return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
        }

        return NextResponse.next();

    } catch (error) {
        console.error("Middleware error:", error);
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
    }
}

export const config = {
    matcher: ['/admin/:path*', '/my-account/:path*', '/auth/:path*'],
}
