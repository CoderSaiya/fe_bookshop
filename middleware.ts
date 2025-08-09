import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    // Skip internationalization for API routes
    if (request.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    // Apply internationalization to other routes
    return intlMiddleware(request);
}

export const config = {
    // Only apply middleware to pages, not API routes or static files
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
    ],
};
