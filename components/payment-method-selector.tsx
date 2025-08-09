"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    CreditCard,
    Truck,
    CheckCircle,
    AlertCircle,
    Clock,
    Shield,
} from "lucide-react";

interface PaymentMethodProps {
    selectedMethod: string;
    onMethodChange: (method: string) => void;
    onSubmit: () => void;
    isLoading?: boolean;
    total: number;
}

export default function PaymentMethodSelector({
    selectedMethod,
    onMethodChange,
    onSubmit,
    isLoading = false,
    total,
}: PaymentMethodProps) {
    const paymentMethods = [
        {
            id: "cod",
            name: "Cash on Delivery",
            description: "Pay when you receive your order",
            icon: Truck,
            available: true,
            processingTime: "2-5 business days",
            benefits: [
                "No upfront payment required",
                "Inspect before payment",
                "Secure and trusted",
            ],
            note: "Available for orders up to 5,000,000₫",
        },
        {
            id: "vnpay",
            name: "VNPay",
            description: "Pay securely with VNPay gateway",
            icon: CreditCard,
            available: false,
            processingTime: "Instant",
            benefits: [
                "Instant payment confirmation",
                "Multiple payment options",
                "Bank-level security",
            ],
            note: "Coming soon - Currently under development",
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <RadioGroup
                    value={selectedMethod}
                    onValueChange={onMethodChange}
                >
                    {paymentMethods.map((method) => (
                        <div key={method.id} className="relative">
                            <div
                                className={`
                flex items-start space-x-3 p-4 border rounded-lg transition-all
                ${
                    method.available
                        ? "hover:border-blue-300 cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                }
                ${
                    selectedMethod === method.id && method.available
                        ? "border-blue-500 bg-blue-50"
                        : ""
                }
              `}
                            >
                                <RadioGroupItem
                                    value={method.id}
                                    id={method.id}
                                    disabled={!method.available}
                                    className="mt-1"
                                />
                                <Label
                                    htmlFor={method.id}
                                    className={`flex-1 ${
                                        method.available
                                            ? "cursor-pointer"
                                            : "cursor-not-allowed"
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <method.icon className="h-5 w-5" />
                                                <h3 className="font-medium">
                                                    {method.name}
                                                </h3>
                                                {!method.available && (
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                                        Coming Soon
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">
                                                {method.description}
                                            </p>

                                            {/* Processing Time */}
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    Processing:{" "}
                                                    {method.processingTime}
                                                </span>
                                            </div>

                                            {/* Benefits */}
                                            <div className="space-y-1 mb-3">
                                                {method.benefits.map(
                                                    (benefit, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                                            <span className="text-xs text-gray-600">
                                                                {benefit}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                            {/* Note */}
                                            <div className="flex items-start space-x-2">
                                                {method.available ? (
                                                    <AlertCircle className="h-3 w-3 text-blue-500 mt-0.5" />
                                                ) : (
                                                    <AlertCircle className="h-3 w-3 text-yellow-500 mt-0.5" />
                                                )}
                                                <span
                                                    className={`text-xs ${
                                                        method.available
                                                            ? "text-blue-600"
                                                            : "text-yellow-600"
                                                    }`}
                                                >
                                                    {method.note}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Label>
                            </div>

                            {/* Selected Method Details */}
                            {selectedMethod === method.id &&
                                method.available && (
                                    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Shield className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-900">
                                                Secure Payment
                                            </span>
                                        </div>
                                        {method.id === "cod" ? (
                                            <div className="space-y-2 text-sm text-blue-800">
                                                <p>
                                                    • You will pay{" "}
                                                    {total.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    ₫ when your order is
                                                    delivered
                                                </p>
                                                <p>
                                                    • Our delivery partner will
                                                    collect the payment
                                                </p>
                                                <p>
                                                    • You can inspect your order
                                                    before making payment
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 text-sm text-blue-800">
                                                <p>
                                                    • You will be redirected to
                                                    VNPay secure payment gateway
                                                </p>
                                                <p>
                                                    • Multiple payment options
                                                    available (ATM, Credit Card,
                                                    QR Code)
                                                </p>
                                                <p>
                                                    • Your payment information
                                                    is encrypted and secure
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                        </div>
                    ))}
                </RadioGroup>

                <Separator />

                {/* Total Summary */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Total Amount</span>
                        <span className="text-lg font-bold">
                            {total.toLocaleString("vi-VN")}₫
                        </span>
                    </div>
                    {selectedMethod === "cod" && (
                        <p className="text-sm text-gray-600">
                            💡 You'll pay this amount when your order is
                            delivered
                        </p>
                    )}
                </div>

                {/* Payment Button */}
                <Button
                    onClick={onSubmit}
                    disabled={
                        isLoading ||
                        !selectedMethod ||
                        !paymentMethods.find((m) => m.id === selectedMethod)
                            ?.available
                    }
                    className="w-full"
                >
                    {isLoading
                        ? "Processing..."
                        : selectedMethod === "cod"
                        ? "Confirm Order (Cash on Delivery)"
                        : selectedMethod === "vnpay"
                        ? "Pay with VNPay"
                        : "Select Payment Method"}
                </Button>

                {/* Security Notice */}
                <div className="text-center pt-4 border-t">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <Shield className="h-4 w-4" />
                        <span>
                            Your payment information is secure and encrypted
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
