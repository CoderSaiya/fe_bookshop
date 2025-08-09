import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
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

        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: {
                id: id,
            },
            include: {
                items: {
                    include: {
                        book: {
                            select: {
                                id: true,
                                title: true,
                                titleVi: true,
                                coverImage: true,
                                price: true,
                                salePrice: true,
                            },
                        },
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Check if user owns the order
        if (order.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Unauthorized - Order does not belong to user" },
                { status: 403 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
