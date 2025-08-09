import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Simple health check - you can add more sophisticated checks here
        // like database connectivity, external service availability, etc.

        return NextResponse.json(
            {
                status: "healthy",
                timestamp: new Date().toISOString(),
                service: "bookstore-api",
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                status: "unhealthy",
                timestamp: new Date().toISOString(),
                service: "bookstore-api",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 503 }
        );
    }
}
