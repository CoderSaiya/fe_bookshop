"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Package,
    Clock,
    CheckCircle,
    Truck,
    ArrowLeft,
    Download,
    MapPin,
    Phone,
    Mail,
    Calendar,
    CreditCard,
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
    shippingAddress: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        district: string;
        ward: string;
        postalCode?: string;
        notes?: string;
    };
    billingAddress: any;
    createdAt: string;
    updatedAt: string;
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

export default function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const { data: session, status } = useSession();
    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin?callbackUrl=/orders");
        }
    }, [status, router]);

    // Fetch order details
    useEffect(() => {
        if (status === "authenticated" && resolvedParams.id) {
            fetchOrder();
        }
    }, [status, resolvedParams.id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/orders/${resolvedParams.id}`);

            if (!response.ok) {
                if (response.status === 404) {
                    setError("Order not found");
                } else if (response.status === 403) {
                    setError("You do not have permission to view this order");
                } else {
                    setError("Failed to fetch order details");
                }
                return;
            }

            const orderData = await response.json();
            setOrder(orderData);
        } catch (err) {
            setError("Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return <Clock className="h-5 w-5" />;
            case "confirmed":
                return <CheckCircle className="h-5 w-5" />;
            case "processing":
                return <Package className="h-5 w-5" />;
            case "shipped":
                return <Truck className="h-5 w-5" />;
            case "delivered":
                return <CheckCircle className="h-5 w-5" />;
            default:
                return <Package className="h-5 w-5" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "confirmed":
                return "bg-blue-100 text-blue-800";
            case "processing":
                return "bg-purple-100 text-purple-800";
            case "shipped":
                return "bg-orange-100 text-orange-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null; // Will redirect
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="h-64 bg-gray-200 rounded"></div>
                                <div className="h-64 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-96 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                    <Package className="h-8 w-8 text-red-600" />
                                </div>
                                <h2 className="text-xl font-semibold">
                                    Order Not Found
                                </h2>
                                <p className="text-gray-600">{error}</p>
                                <div className="flex space-x-2 justify-center">
                                    <Button asChild variant="outline">
                                        <Link href="/orders">
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Back to Orders
                                        </Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href="/products">
                                            Continue Shopping
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/orders"
                        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Orders
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Order #{order.orderNumber}
                            </h1>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        Placed on{" "}
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString("vi-VN")}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <CreditCard className="h-4 w-4" />
                                    <span className="capitalize">
                                        {getPaymentMethodLabel(
                                            order.paymentMethod as any
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <Badge
                                className={`${getStatusColor(
                                    order.status
                                )} flex items-center space-x-2 text-base px-3 py-1`}
                            >
                                {getStatusIcon(order.status)}
                                <span className="capitalize">
                                    {order.status}
                                </span>
                            </Badge>
                            <div className="text-2xl font-bold mt-2">
                                {order.total.toLocaleString("vi-VN")}₫
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Status Timeline */}
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                                <CheckCircle className="h-5 w-5 text-white" />
                                            </div>
                                            <span className="ml-3 text-sm font-medium text-green-600">
                                                Order Confirmed
                                            </span>
                                        </div>

                                        <div className="flex items-center ml-8">
                                            <div className="w-16 h-1 bg-green-600 mx-2"></div>
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    [
                                                        "processing",
                                                        "shipped",
                                                        "delivered",
                                                    ].includes(
                                                        order.status.toLowerCase()
                                                    )
                                                        ? "bg-green-600"
                                                        : "bg-gray-300"
                                                }`}
                                            >
                                                <Package className="h-5 w-5 text-white" />
                                            </div>
                                            <span
                                                className={`ml-3 text-sm font-medium ${
                                                    [
                                                        "processing",
                                                        "shipped",
                                                        "delivered",
                                                    ].includes(
                                                        order.status.toLowerCase()
                                                    )
                                                        ? "text-green-600"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                Processing
                                            </span>
                                        </div>

                                        <div className="flex items-center ml-8">
                                            <div
                                                className={`w-16 h-1 mx-2 ${
                                                    [
                                                        "shipped",
                                                        "delivered",
                                                    ].includes(
                                                        order.status.toLowerCase()
                                                    )
                                                        ? "bg-green-600"
                                                        : "bg-gray-300"
                                                }`}
                                            ></div>
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    [
                                                        "shipped",
                                                        "delivered",
                                                    ].includes(
                                                        order.status.toLowerCase()
                                                    )
                                                        ? "bg-green-600"
                                                        : "bg-gray-300"
                                                }`}
                                            >
                                                <Truck className="h-5 w-5 text-white" />
                                            </div>
                                            <span
                                                className={`ml-3 text-sm font-medium ${
                                                    [
                                                        "shipped",
                                                        "delivered",
                                                    ].includes(
                                                        order.status.toLowerCase()
                                                    )
                                                        ? "text-green-600"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                Shipped
                                            </span>
                                        </div>

                                        <div className="flex items-center ml-8">
                                            <div
                                                className={`w-16 h-1 mx-2 ${
                                                    order.status.toLowerCase() ===
                                                    "delivered"
                                                        ? "bg-green-600"
                                                        : "bg-gray-300"
                                                }`}
                                            ></div>
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    order.status.toLowerCase() ===
                                                    "delivered"
                                                        ? "bg-green-600"
                                                        : "bg-gray-300"
                                                }`}
                                            >
                                                <CheckCircle className="h-5 w-5 text-white" />
                                            </div>
                                            <span
                                                className={`ml-3 text-sm font-medium ${
                                                    order.status.toLowerCase() ===
                                                    "delivered"
                                                        ? "text-green-600"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                Delivered
                                            </span>
                                        </div>
                                    </div>

                                    {/* Payment Method Info */}
                                    {isCashOnDelivery(
                                        order.paymentMethod as any
                                    ) && (
                                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <Truck className="h-5 w-5 text-blue-600" />
                                                <div>
                                                    <h4 className="font-medium text-blue-900">
                                                        Cash on Delivery
                                                    </h4>
                                                    <p className="text-sm text-blue-700">
                                                        You'll pay{" "}
                                                        {order.total.toLocaleString(
                                                            "vi-VN"
                                                        )}
                                                        ₫ when you receive your
                                                        order.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Order Items ({order.items.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center space-x-4 p-4 border rounded-lg"
                                        >
                                            <div className="relative h-20 w-20 overflow-hidden rounded">
                                                <Image
                                                    src={
                                                        item.book.coverImage ||
                                                        "/placeholder/300x300.svg"
                                                    }
                                                    alt={item.book.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">
                                                    {item.book.title}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Quantity: {item.quantity}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Unit Price:{" "}
                                                    {item.price.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    ₫
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toLocaleString("vi-VN")}
                                                    ₫
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
                                <CardTitle className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
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

                                    <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <Phone className="h-4 w-4" />
                                            <span>
                                                {order.shippingAddress.phone}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Mail className="h-4 w-4" />
                                            <span>
                                                {order.shippingAddress.email}
                                            </span>
                                        </div>
                                    </div>

                                    {order.shippingAddress.notes && (
                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm">
                                                <strong>Delivery Notes:</strong>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {order.shippingAddress.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary Sidebar */}
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

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Order Number</span>
                                        <span className="font-mono">
                                            {order.orderNumber}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Order Date</span>
                                        <span>
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString("vi-VN")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Payment Method</span>
                                        <span className="capitalize">
                                            {getPaymentMethodLabel(
                                                order.paymentMethod as any
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Status</span>
                                        <span
                                            className={`capitalize ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Invoice
                                    </Button>

                                    {order.status.toLowerCase() ===
                                        "delivered" && (
                                        <Button className="w-full">
                                            Leave a Review
                                        </Button>
                                    )}

                                    <Button asChild className="w-full">
                                        <Link href="/products">
                                            Continue Shopping
                                        </Link>
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
