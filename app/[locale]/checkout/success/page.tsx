"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    CheckCircle,
    Package,
    Truck,
    ArrowRight,
    Download,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { isCashOnDelivery, getPaymentMethodLabel } from "@/lib/payment-utils";

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    paymentMethod: string;
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    shippingAddress: any;
    createdAt: string;
    items: Array<{
        id: string;
        quantity: number;
        price: number;
        book: {
            id: string;
            title: string;
            titleVi: string;
            coverImage: string;
            price: number;
        };
    }>;
}

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setError("Order ID not found");
            setLoading(false);
            return;
        }

        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/${orderId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch order");
                }
                const orderData = await response.json();
                setOrder(orderData);
            } catch (err) {
                setError("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <Package className="h-8 w-8 text-red-600" />
                            </div>
                            <h2 className="text-xl font-semibold">
                                Order Not Found
                            </h2>
                            <p className="text-gray-600">
                                {error ||
                                    "We couldn't find your order. Please check your order number."}
                            </p>
                            <Button asChild>
                                <Link href="/products">Continue Shopping</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-lg text-gray-600">
                        Thank you for your purchase. Your order #
                        {order.orderNumber} has been confirmed.
                    </p>
                </div>

                {/* Order Status Card */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Order Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium">
                                        Order Confirmed
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Your order has been received and is
                                        being processed
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">
                                    Order Number
                                </p>
                                <p className="font-mono font-medium">
                                    {order.orderNumber}
                                </p>
                            </div>
                        </div>

                        {/* Order Progress */}
                        <div className="mt-6">
                            <div className="flex items-center">
                                {/* Confirmed */}
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-green-600">
                                        Confirmed
                                    </span>
                                </div>

                                {/* Processing */}
                                <div className="flex items-center ml-8">
                                    <div className="w-16 h-1 bg-gray-300 mx-2"></div>
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        <Package className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-400">
                                        Processing
                                    </span>
                                </div>

                                {/* Shipping */}
                                <div className="flex items-center ml-8">
                                    <div className="w-16 h-1 bg-gray-300 mx-2"></div>
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        <Truck className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-400">
                                        Shipping
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Estimate */}
                        {isCashOnDelivery(order.paymentMethod as any) && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <Truck className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <h4 className="font-medium text-blue-900">
                                            {getPaymentMethodLabel(
                                                order.paymentMethod as any
                                            )}
                                        </h4>
                                        <p className="text-sm text-blue-700">
                                            Estimated delivery: 2-5 business
                                            days. You'll pay when you receive
                                            your order.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center space-x-4"
                                        >
                                            <div className="relative h-16 w-16 overflow-hidden rounded">
                                                <Image
                                                    src={
                                                        item.book.coverImage ||
                                                        "/placeholder/300x300.svg"
                                                    }
                                                    alt={item.book.title}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">
                                                    {item.book.title}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Quantity: {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    {item.price.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    ₫
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toLocaleString("vi-VN")}
                                                    ₫ total
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1 text-sm">
                                    <p className="font-medium">
                                        {order.shippingAddress.fullName}
                                    </p>
                                    <p>{order.shippingAddress.address}</p>
                                    <p>
                                        {order.shippingAddress.ward},{" "}
                                        {order.shippingAddress.district},{" "}
                                        {order.shippingAddress.city}
                                    </p>
                                    {order.shippingAddress.postalCode && (
                                        <p>
                                            {order.shippingAddress.postalCode}
                                        </p>
                                    )}
                                    <p>{order.shippingAddress.phone}</p>
                                    <p>{order.shippingAddress.email}</p>
                                    {order.shippingAddress.notes && (
                                        <p className="italic text-gray-600 mt-2">
                                            Notes: {order.shippingAddress.notes}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>
                                            Subtotal ({order.items.length}{" "}
                                            items)
                                        </span>
                                        <span>
                                            {order.subtotal.toLocaleString(
                                                "vi-VN"
                                            )}
                                            ₫
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Shipping</span>
                                        <span>
                                            {order.shippingCost.toLocaleString(
                                                "vi-VN"
                                            )}
                                            ₫
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Tax</span>
                                        <span>
                                            {order.tax.toLocaleString("vi-VN")}₫
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-medium">
                                        <span>Total</span>
                                        <span>
                                            {order.total.toLocaleString(
                                                "vi-VN"
                                            )}
                                            ₫
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Payment Method</span>
                                        <span className="capitalize">
                                            {getPaymentMethodLabel(
                                                order.paymentMethod as any
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Order Date</span>
                                        <span>
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString("vi-VN")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Status</span>
                                        <span className="capitalize text-green-600">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    <Button asChild className="w-full">
                                        <Link href="/products">
                                            Continue Shopping
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Invoice
                                    </Button>
                                </div>

                                {/* Customer Support */}
                                <div className="pt-4 border-t text-center">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Need help with your order?
                                    </p>
                                    <Button variant="link" size="sm" asChild>
                                        <Link href="/contact">
                                            Contact Support
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
