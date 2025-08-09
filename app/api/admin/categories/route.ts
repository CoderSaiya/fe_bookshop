import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { books: true },
                },
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
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

        const { name, description, slug } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        // Check if category with same name or slug exists
        const existingCategory = await prisma.category.findFirst({
            where: {
                OR: [{ name }, { slug }],
            },
        });

        if (existingCategory) {
            return NextResponse.json(
                { error: "Category with this name or slug already exists" },
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name,
                description,
                slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
