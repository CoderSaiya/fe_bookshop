import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { quantity } = await request.json();
        const { id: itemId } = await params;

        if (quantity < 1) {
            return NextResponse.json(
                { error: "Quantity must be at least 1" },
                { status: 400 }
            );
        }

        // Check if cart item exists and belongs to user
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { book: true },
        });

        if (!cartItem || cartItem.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Cart item not found" },
                { status: 404 }
            );
        }

        // Check stock availability
        if (cartItem.book.stock < quantity) {
            return NextResponse.json(
                { error: "Insufficient stock" },
                { status: 400 }
            );
        }

        // Update quantity
        const updatedItem = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
            include: {
                book: {
                    include: {
                        authors: true,
                        category: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error("Error updating cart item:", error);
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

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: itemId } = await params;

        // Check if cart item exists and belongs to user
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
        });

        if (!cartItem || cartItem.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Cart item not found" },
                { status: 404 }
            );
        }

        // Delete cart item
        await prisma.cartItem.delete({
            where: { id: itemId },
        });

        return NextResponse.json({ message: "Item removed from cart" });
    } catch (error) {
        console.error("Error removing cart item:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
