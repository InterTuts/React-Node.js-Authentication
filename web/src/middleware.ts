// System Utils
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export function middleware(req: NextRequest) {
    // Get the cookies
    const cookieStore = cookies();
    // Get the jwt token
    const token = cookieStore.get('jwt_token'); 
    if (req.nextUrl.pathname.startsWith('/user')) {
        // Verify if the token exists
        if ( !token?.value ) {
            return NextResponse.redirect(new URL('/auth/signin', req.url));
        }
    } else if (req.nextUrl.pathname.startsWith('/auth')) {
        // Verify if the token exists
        if ( token?.value ) {
            return NextResponse.redirect(new URL('/user/dashboard', req.url))
        }
    }
}