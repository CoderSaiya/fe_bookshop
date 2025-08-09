"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("orderNumber");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Successful!
                </h1>
                <p className="text-gray-600 mb-6">
                    Your payment has been processed successfully.
                </p>
                {orderNumber && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-500">Order Number</p>
                        <p className="font-mono font-bold text-lg">
                            {orderNumber}
                        </p>
                    </div>
                )}
                <div className="space-y-3">
                    <Link
                        href="/orders"
                        className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        View Orders
                    </Link>
                    <Link
                        href="/"
                        className="block w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
