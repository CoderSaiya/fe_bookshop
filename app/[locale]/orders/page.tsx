"use client";

import { useState, useEffect } from "react";
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
    Eye,
    ShoppingBag,
    Calendar,
    CreditCard,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    paymentMethod: string;
    total: number;
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
        };
    }>;
}

interface OrdersResponse {
    orders: Order[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin?callbackUrl=/orders");
        }
    }, [status, router]);

    // Fetch orders
    useEffect(() => {
        if (status === "authenticated") {
            fetchOrders();
        }
    }, [status, page]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/orders?page=${page}&limit=10`);

            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data: OrdersResponse = await response.json();
            setOrders(data.orders);
            setTotalPages(data.pagination.totalPages);
        } catch (err) {
            setError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return <Clock className="h-4 w-4" />;
            case "confirmed":
                return <CheckCircle className="h-4 w-4" />;
            case "processing":
                return <Package className="h-4 w-4" />;
            case "shipped":
                return <Truck className="h-4 w-4" />;
            case "delivered":
                return <CheckCircle className="h-4 w-4" />;
            default:
                return <Package className="h-4 w-4" />;
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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        My Orders
                    </h1>
                    <p className="text-gray-600">
                        Track and manage your orders
                    </p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : error ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                    <Package className="h-8 w-8 text-red-600" />
                                </div>
                                <h2 className="text-xl font-semibold">
                                    Error Loading Orders
                                </h2>
                                <p className="text-gray-600">{error}</p>
                                <Button onClick={fetchOrders}>Try Again</Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : orders.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                                </div>
                                <h2 className="text-xl font-semibold">
                                    No Orders Yet
                                </h2>
                                <p className="text-gray-600">
                                    You haven't placed any orders yet. Start
                                    shopping to see your orders here.
                                </p>
                                <Button asChild>
                                    <Link href="/products">Start Shopping</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Orders List */}
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <Card key={order.id}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    Order #{order.orderNumber}
                                                </CardTitle>
                                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>
                                                            {new Date(
                                                                order.createdAt
                                                            ).toLocaleDateString(
                                                                "vi-VN"
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <CreditCard className="h-4 w-4" />
                                                        <span className="capitalize">
                                                            {order.paymentMethod ===
                                                            "cod"
                                                                ? "Cash on Delivery"
                                                                : order.paymentMethod}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge
                                                    className={`${getStatusColor(
                                                        order.status
                                                    )} flex items-center space-x-1`}
                                                >
                                                    {getStatusIcon(
                                                        order.status
                                                    )}
                                                    <span className="capitalize">
                                                        {order.status}
                                                    </span>
                                                </Badge>
                                                <div className="text-lg font-bold mt-1">
                                                    {order.total.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    ₫
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Order Items */}
                                        <div className="space-y-3 mb-4">
                                            {order.items
                                                .slice(0, 3)
                                                .map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center space-x-3"
                                                    >
                                                        <div className="relative h-12 w-12 overflow-hidden rounded">
                                                            <Image
                                                                src={
                                                                    item.book
                                                                        .coverImage ||
                                                                    "/placeholder/300x300.svg"
                                                                }
                                                                alt={
                                                                    item.book
                                                                        .title
                                                                }
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-sm truncate">
                                                                {
                                                                    item.book
                                                                        .title
                                                                }
                                                            </h4>
                                                            <p className="text-xs text-gray-600">
                                                                Quantity:{" "}
                                                                {item.quantity}
                                                            </p>
                                                        </div>
                                                        <div className="text-sm font-medium">
                                                            {item.price.toLocaleString(
                                                                "vi-VN"
                                                            )}
                                                            ₫
                                                        </div>
                                                    </div>
                                                ))}

                                            {order.items.length > 3 && (
                                                <div className="text-sm text-gray-600 text-center py-2">
                                                    +{order.items.length - 3}{" "}
                                                    more items
                                                </div>
                                            )}
                                        </div>

                                        <Separator className="my-4" />

                                        {/* Actions */}
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-600">
                                                {order.items.length} item
                                                {order.items.length > 1
                                                    ? "s"
                                                    : ""}
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/orders/${order.id}`}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </Link>
                                                </Button>
                                                {order.status.toLowerCase() ===
                                                    "delivered" && (
                                                    <Button size="sm">
                                                        Leave Review
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center space-x-2 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <span className="flex items-center px-4 text-sm text-gray-600">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.min(totalPages, p + 1)
                                        )
                                    }
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
