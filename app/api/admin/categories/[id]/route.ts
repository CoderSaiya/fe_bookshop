import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: categoryId } = await params;

        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                _count: {
                    select: { books: true },
                },
            },
        });

        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error("Error fetching category:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: categoryId } = await params;
        const { name, description, slug } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        // Check if category exists
        const existingCategory = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!existingCategory) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        // Check if another category with same name or slug exists
        const duplicateCategory = await prisma.category.findFirst({
            where: {
                AND: [
                    { id: { not: categoryId } },
                    {
                        OR: [{ name }, { slug }],
                    },
                ],
            },
        });

        if (duplicateCategory) {
            return NextResponse.json(
                {
                    error: "Another category with this name or slug already exists",
                },
                { status: 400 }
            );
        }

        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: {
                name,
                description,
                slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
            },
        });

        return NextResponse.json(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: categoryId } = await params;

        // Check if category exists
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                _count: {
                    select: { books: true },
                },
            },
        });

        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        // Check if category has books
        if (category._count.books > 0) {
            return NextResponse.json(
                {
                    error: "Cannot delete category with books. Move books to another category first.",
                },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id: categoryId },
        });

        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
