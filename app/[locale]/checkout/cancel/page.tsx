"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RotateCcw, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const reason = searchParams.get("reason") || "Payment was cancelled";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Cancel Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="h-12 w-12 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Payment Cancelled
                    </h1>
                    <p className="text-lg text-gray-600">
                        Your payment was not processed. You can try again or
                        choose a different payment method.
                    </p>
                </div>

                {/* Cancel Details Card */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>What happened?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        Payment Cancelled
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {reason}
                                    </p>
                                </div>
                            </div>

                            {orderId && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">
                                            Order ID:
                                        </span>{" "}
                                        {orderId}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Your order has been cancelled and no
                                        payment was charged.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Action Options */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>What would you like to do?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <Button asChild className="w-full justify-start">
                                <Link href="/checkout">
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Try Payment Again
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                asChild
                                className="w-full justify-start"
                            >
                                <Link href="/products">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Continue Shopping
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                asChild
                                className="w-full justify-start"
                            >
                                <Link href="/contact">
                                    <HelpCircle className="h-4 w-4 mr-2" />
                                    Contact Support
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Common Issues */}
                <Card>
                    <CardHeader>
                        <CardTitle>Common Issues</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    Payment was cancelled by user
                                </h4>
                                <p className="text-gray-600 mt-1">
                                    You cancelled the payment process. You can
                                    try again with the same or different payment
                                    method.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900">
                                    Insufficient funds
                                </h4>
                                <p className="text-gray-600 mt-1">
                                    Your payment method may not have sufficient
                                    funds. Please check your account balance or
                                    try a different payment method.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900">
                                    Technical issues
                                </h4>
                                <p className="text-gray-600 mt-1">
                                    There may have been a temporary technical
                                    issue. Please try again in a few minutes.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900">
                                    Payment method declined
                                </h4>
                                <p className="text-gray-600 mt-1">
                                    Your payment method may have been declined.
                                    Please contact your bank or try a different
                                    payment method.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Support Info */}
                <div className="text-center mt-8 p-6 bg-white rounded-lg border">
                    <h3 className="font-medium text-gray-900 mb-2">
                        Need Help?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        If you're experiencing issues with your payment, our
                        support team is here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/contact">Contact Support</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <a href="mailto:support@bookshop.com">Email Us</a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
