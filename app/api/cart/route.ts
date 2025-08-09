import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const cartItems = await prisma.cartItem.findMany({
            where: { userId: session.user.id },
            include: {
                book: {
                    include: {
                        authors: true,
                        category: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const total = cartItems.reduce(
            (sum: number, item: any) => sum + item.book.price * item.quantity,
            0
        );

        return NextResponse.json({
            items: cartItems,
            total,
            count: cartItems.reduce(
                (sum: number, item: any) => sum + item.quantity,
                0
            ),
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { bookId, quantity = 1 } = await request.json();

        // Check if book exists and has stock
        const book = await prisma.book.findUnique({
            where: { id: bookId },
        });

        if (!book) {
            return NextResponse.json(
                { error: "Book not found" },
                { status: 404 }
            );
        }

        if (book.stock < quantity) {
            return NextResponse.json(
                { error: "Insufficient stock" },
                { status: 400 }
            );
        }

        // Check if item already exists in cart
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                userId_bookId: {
                    userId: session.user.id,
                    bookId: bookId,
                },
            },
        });

        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;

            if (book.stock < newQuantity) {
                return NextResponse.json(
                    { error: "Insufficient stock" },
                    { status: 400 }
                );
            }

            const updatedItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
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
        } else {
            // Create new cart item
            const cartItem = await prisma.cartItem.create({
                data: {
                    userId: session.user.id,
                    bookId: bookId,
                    quantity: quantity,
                },
                include: {
                    book: {
                        include: {
                            authors: true,
                            category: true,
                        },
                    },
                },
            });

            return NextResponse.json(cartItem);
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await prisma.cartItem.deleteMany({
            where: { userId: session.user.id },
        });

        return NextResponse.json({ message: "Cart cleared" });
    } catch (error) {
        console.error("Error clearing cart:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
