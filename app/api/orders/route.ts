import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    paymentMethodToEnum,
    type PaymentMethodKey,
} from "@/lib/payment-utils";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const status = searchParams.get("status");

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {
            userId: session.user.id,
        };

        if (status) {
            where.status = status;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
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
                                },
                            },
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.order.count({ where }),
        ]);

        return NextResponse.json({
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
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

        const body = await request.json();
        const { items, paymentMethod, shippingAddress, billingAddress } = body;

        // Validate and convert payment method
        if (!["cod", "vnpay"].includes(paymentMethod)) {
            return NextResponse.json(
                {
                    error: `Invalid payment method: ${paymentMethod}. Supported methods: cod, vnpay`,
                },
                { status: 400 }
            );
        }

        const normalizedPaymentMethod = paymentMethodToEnum(
            paymentMethod as PaymentMethodKey
        );

        // Calculate totals
        let subtotal = 0;
        const orderItems: any[] = [];

        for (const item of items) {
            const book = await prisma.book.findUnique({
                where: { id: item.bookId },
            });

            if (!book) {
                return NextResponse.json(
                    { error: `Book not found: ${item.bookId}` },
                    { status: 400 }
                );
            }

            if (book.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for book: ${book.title}` },
                    { status: 400 }
                );
            }

            const price = book.salePrice || book.price;
            subtotal += price * item.quantity;

            orderItems.push({
                bookId: item.bookId,
                quantity: item.quantity,
                price,
            });
        }

        const shippingCost = 30000; // 30,000 VND flat rate
        const tax = 0; // No tax for now
        const total = subtotal + shippingCost + tax;

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;

        // Create order
        const order = await prisma.$transaction(async (tx: any) => {
            const newOrder = await tx.order.create({
                data: {
                    orderNumber,
                    userId: session.user.id,
                    paymentMethod: normalizedPaymentMethod,
                    subtotal,
                    shippingCost,
                    tax,
                    total,
                    shippingAddress,
                    billingAddress,
                    items: {
                        create: orderItems,
                    },
                },
                include: {
                    items: {
                        include: {
                            book: true,
                        },
                    },
                },
            });

            // Update book stock
            for (const item of items) {
                await tx.book.update({
                    where: { id: item.bookId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            // Clear user's cart
            await tx.cartItem.deleteMany({
                where: {
                    userId: session.user.id,
                    bookId: {
                        in: items.map((item: any) => item.bookId),
                    },
                },
            });

            return newOrder;
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
