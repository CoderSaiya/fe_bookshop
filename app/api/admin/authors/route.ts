import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const authors = await prisma.author.findMany({
            include: {
                _count: {
                    select: { books: true },
                },
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(authors);
    } catch (error) {
        console.error("Error fetching authors:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { name, bio } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        // Check if author with same name exists
        const existingAuthor = await prisma.author.findFirst({
            where: { name },
        });

        if (existingAuthor) {
            return NextResponse.json(
                { error: "Author with this name already exists" },
                { status: 400 }
            );
        }

        const author = await prisma.author.create({
            data: {
                name,
                bio,
            },
        });

        return NextResponse.json(author);
    } catch (error) {
        console.error("Error creating author:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
