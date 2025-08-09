import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const params = new URLSearchParams(body);

        // Get VNPay parameters
        const vnp_Params: any = {};
        for (const [key, value] of params.entries()) {
            vnp_Params[key] = value;
        }

        const vnp_SecureHash = vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        // Sort parameters
        const sortedParams = Object.keys(vnp_Params)
            .sort()
            .reduce((result: any, key) => {
                result[key] = vnp_Params[key];
                return result;
            }, {});

        // Verify signature
        const vnp_HashSecret = process.env.VNPAY_HASH_SECRET!;
        const query = new URLSearchParams(sortedParams).toString();
        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const checkSum = hmac.update(query, "utf-8").digest("hex");

        if (vnp_SecureHash !== checkSum) {
            return NextResponse.json({
                RspCode: "97",
                Message: "Invalid signature",
            });
        }

        const vnp_ResponseCode = vnp_Params["vnp_ResponseCode"];
        const vnp_TxnRef = vnp_Params["vnp_TxnRef"];
        const vnp_Amount = vnp_Params["vnp_Amount"];

        // Check if order exists
        const order = await prisma.order.findUnique({
            where: { orderNumber: vnp_TxnRef },
        });

        if (!order) {
            return NextResponse.json({
                RspCode: "01",
                Message: "Order not found",
            });
        }

        // Check amount
        const orderAmount = Math.round(order.total * 100);
        if (parseInt(vnp_Amount) !== orderAmount) {
            return NextResponse.json({
                RspCode: "04",
                Message: "Amount invalid",
            });
        }

        // Check if already processed
        if (order.paymentStatus === "PAID") {
            return NextResponse.json({
                RspCode: "02",
                Message: "Order already confirmed",
            });
        }

        if (vnp_ResponseCode === "00") {
            // Payment successful
            await prisma.order.update({
                where: { orderNumber: vnp_TxnRef },
                data: {
                    paymentStatus: "PAID",
                    paymentMethod: "VNPAY",
                    // Note: VNPay fields not in Order schema yet
                    // vnpayTransactionNo: vnp_Params["vnp_TransactionNo"],
                    // vnpayBankCode: vnp_Params["vnp_BankCode"],
                    // vnpayPayDate: vnp_Params["vnp_PayDate"],
                },
            });

            return NextResponse.json({
                RspCode: "00",
                Message: "Success",
            });
        } else {
            // Payment failed
            await prisma.order.update({
                where: { orderNumber: vnp_TxnRef },
                data: {
                    paymentStatus: "FAILED",
                },
            });

            return NextResponse.json({
                RspCode: "00",
                Message: "Success",
            });
        }
    } catch (error) {
        console.error("Error processing VNPay IPN:", error);
        return NextResponse.json({
            RspCode: "99",
            Message: "Unknown error",
        });
    }
}
