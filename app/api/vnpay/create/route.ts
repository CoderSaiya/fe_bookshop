import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

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
        const { orderId } = body;

        // Get order details
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        book: true,
                    },
                },
            },
        });

        if (!order || order.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // TODO: VNPay Integration
        // This is a placeholder for VNPay payment integration
        // Complete VNPay integration would require:
        // 1. Valid VNPay merchant account and credentials
        // 2. Proper VNPay API implementation
        // 3. Security measures and hash validation
        // 4. Webhook handling for payment status updates

        return NextResponse.json(
            {
                error: "VNPay integration is not yet implemented",
                message:
                    "Please use Cash on Delivery for now. VNPay integration coming soon!",
            },
            { status: 501 } // Not Implemented
        );

        /* 
        // VNPay configuration (commented out for TODO)
        const vnp_TmnCode = process.env.VNPAY_TMN_CODE!;
        const vnp_HashSecret = process.env.VNPAY_HASH_SECRET!;
        const vnp_Url = process.env.VNPAY_URL!;
        const vnp_ReturnUrl = process.env.VNPAY_RETURN_URL!;

        // Create VNPay payment URL
        const vnp_TxnRef = order.orderNumber;
        const vnp_OrderInfo = `Thanh toan don hang ${order.orderNumber}`;
        const vnp_Amount = Math.round(order.total * 100); // VNPay requires amount in VND cents
        const vnp_Locale = "vn";
        const vnp_CurrCode = "VND";
        const vnp_CreateDate = new Date()
            .toISOString()
            .replace(/[-:T.]/g, "")
            .slice(0, 14);
        const vnp_IpAddr =
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "127.0.0.1";

        // Build VNPay parameters
        const vnpParams: any = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode,
            vnp_Amount,
            vnp_CreateDate,
            vnp_CurrCode,
            vnp_IpAddr,
            vnp_Locale,
            vnp_OrderInfo,
            vnp_OrderType: "other",
            vnp_ReturnUrl,
            vnp_TxnRef,
        };

        // Sort parameters
        const sortedParams = Object.keys(vnpParams)
            .sort()
            .reduce((result: any, key) => {
                result[key] = vnpParams[key];
                return result;
            }, {});

        // Create query string
        const query = new URLSearchParams(sortedParams).toString();

        // Create secure hash
        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const vnp_SecureHash = hmac.update(query, "utf-8").digest("hex");

        // Final payment URL
        const paymentUrl = `${vnp_Url}?${query}&vnp_SecureHash=${vnp_SecureHash}`;

        // Update order with VNPay reference
        await prisma.order.update({
            where: { id: orderId },
            data: {
                vnpayTxnRef: vnp_TxnRef,
                vnpayOrderInfo: vnp_OrderInfo,
            },
        });

        return NextResponse.json({ paymentUrl });
        */
    } catch (error) {
        console.error("Error creating VNPay payment:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
