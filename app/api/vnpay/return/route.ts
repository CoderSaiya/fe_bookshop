import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Get VNPay parameters
        const vnp_Params: any = {};
        for (const [key, value] of searchParams.entries()) {
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
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment/error?message=Invalid signature`
            );
        }

        const vnp_ResponseCode = vnp_Params["vnp_ResponseCode"];
        const vnp_TxnRef = vnp_Params["vnp_TxnRef"];

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

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?orderNumber=${vnp_TxnRef}`
            );
        } else {
            // Payment failed
            await prisma.order.update({
                where: { orderNumber: vnp_TxnRef },
                data: {
                    paymentStatus: "FAILED",
                },
            });

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment/error?orderNumber=${vnp_TxnRef}`
            );
        }
    } catch (error) {
        console.error("Error processing VNPay return:", error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/payment/error?message=Processing error`
        );
    }
}
