"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingBag, CreditCard, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
    isCashOnDelivery,
    getPaymentMethodLabel,
    type PaymentMethodKey,
} from "@/lib/payment-utils";

interface ShippingInfo {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    postalCode: string;
    notes?: string;
}

interface BillingInfo extends ShippingInfo {
    sameAsShipping: boolean;
}

export default function CheckoutPage() {
    const t = useTranslations("checkout");
    const { data: session, status } = useSession();
    const router = useRouter();
    const { items, clearCart } = useCart();

    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>("cod"); // cod or vnpay
    const [isLoading, setIsLoading] = useState(false);

    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        fullName: "",
        email: session?.user?.email || "",
        phone: "",
        address: "",
        city: "",
        district: "",
        ward: "",
        postalCode: "",
        notes: "",
    });

    const [billingInfo, setBillingInfo] = useState<BillingInfo>({
        ...shippingInfo,
        sameAsShipping: true,
    });

    // Calculate totals
    const subtotal = items.reduce((total, item) => total + item.price, 0);
    const shippingCost = 30000; // 30,000 VND flat rate
    const tax = 0;
    const total = subtotal + shippingCost + tax;

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin?callbackUrl=/checkout");
        }
    }, [status, router]);

    // Redirect if cart is empty
    useEffect(() => {
        if (items.length === 0) {
            router.push("/products");
        }
    }, [items.length, router]);

    // Handle payment method change with proper typing
    const handlePaymentMethodChange = (value: string) => {
        setPaymentMethod(value as PaymentMethodKey);
    };

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(3);
    };

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        try {
            // Prepare order data
            const orderData = {
                items: items.map((item) => ({
                    bookId: item.id,
                    quantity: 1, // Assuming quantity 1 for now
                })),
                paymentMethod,
                shippingAddress: shippingInfo,
                billingAddress: billingInfo.sameAsShipping
                    ? shippingInfo
                    : billingInfo,
            };

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create order");
            }

            const order = await response.json();

            if (isCashOnDelivery(paymentMethod)) {
                // Cash on Delivery - redirect to success page
                clearCart();
                router.push(`/checkout/success?orderId=${order.id}`);
            } else if (paymentMethod === "vnpay") {
                // VNPay - redirect to payment gateway (TODO: implement VNPay)
                // For now, show coming soon message
                alert(
                    "VNPay integration coming soon! Please use Cash on Delivery for now."
                );
                handlePaymentMethodChange("cod");
                return;
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Error placing order. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/products"
                        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Continue Shopping
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Checkout
                    </h1>

                    {/* Progress Indicator */}
                    <div className="mt-6 flex items-center">
                        <div
                            className={`flex items-center ${
                                step >= 1 ? "text-blue-600" : "text-gray-400"
                            }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full border-2 ${
                                    step >= 1
                                        ? "border-blue-600 bg-blue-600 text-white"
                                        : "border-gray-300"
                                } flex items-center justify-center text-sm font-medium`}
                            >
                                1
                            </div>
                            <span className="ml-2 text-sm font-medium">
                                Shipping
                            </span>
                        </div>
                        <div
                            className={`w-16 h-1 mx-4 ${
                                step >= 2 ? "bg-blue-600" : "bg-gray-300"
                            }`}
                        ></div>
                        <div
                            className={`flex items-center ${
                                step >= 2 ? "text-blue-600" : "text-gray-400"
                            }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full border-2 ${
                                    step >= 2
                                        ? "border-blue-600 bg-blue-600 text-white"
                                        : "border-gray-300"
                                } flex items-center justify-center text-sm font-medium`}
                            >
                                2
                            </div>
                            <span className="ml-2 text-sm font-medium">
                                Payment
                            </span>
                        </div>
                        <div
                            className={`w-16 h-1 mx-4 ${
                                step >= 3 ? "bg-blue-600" : "bg-gray-300"
                            }`}
                        ></div>
                        <div
                            className={`flex items-center ${
                                step >= 3 ? "text-blue-600" : "text-gray-400"
                            }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full border-2 ${
                                    step >= 3
                                        ? "border-blue-600 bg-blue-600 text-white"
                                        : "border-gray-300"
                                } flex items-center justify-center text-sm font-medium`}
                            >
                                3
                            </div>
                            <span className="ml-2 text-sm font-medium">
                                Review
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Step 1: Shipping Information */}
                        {step === 1 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Truck className="h-5 w-5 mr-2" />
                                        Shipping Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handleShippingSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="fullName">
                                                    Full Name *
                                                </Label>
                                                <Input
                                                    id="fullName"
                                                    value={
                                                        shippingInfo.fullName
                                                    }
                                                    onChange={(e) =>
                                                        setShippingInfo({
                                                            ...shippingInfo,
                                                            fullName:
                                                                e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">
                                                    Email *
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={shippingInfo.email}
                                                    onChange={(e) =>
                                                        setShippingInfo({
                                                            ...shippingInfo,
                                                            email: e.target
                                                                .value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="phone">
                                                    Phone Number *
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    value={shippingInfo.phone}
                                                    onChange={(e) =>
                                                        setShippingInfo({
                                                            ...shippingInfo,
                                                            phone: e.target
                                                                .value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="city">
                                                    City *
                                                </Label>
                                                <Input
                                                    id="city"
                                                    value={shippingInfo.city}
                                                    onChange={(e) =>
                                                        setShippingInfo({
                                                            ...shippingInfo,
                                                            city: e.target
                                                                .value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="district">
                                                    District *
                                                </Label>
                                                <Input
                                                    id="district"
                                                    value={
                                                        shippingInfo.district
                                                    }
                                                    onChange={(e) =>
                                                        setShippingInfo({
                                                            ...shippingInfo,
                                                            district:
                                                                e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="ward">
                                                    Ward *
                                                </Label>
                                                <Input
                                                    id="ward"
                                                    value={shippingInfo.ward}
                                                    onChange={(e) =>
                                                        setShippingInfo({
                                                            ...shippingInfo,
                                                            ward: e.target
                                                                .value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="address">
                                                Address *
                                            </Label>
                                            <Input
                                                id="address"
                                                value={shippingInfo.address}
                                                onChange={(e) =>
                                                    setShippingInfo({
                                                        ...shippingInfo,
                                                        address: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="postalCode">
                                                Postal Code
                                            </Label>
                                            <Input
                                                id="postalCode"
                                                value={shippingInfo.postalCode}
                                                onChange={(e) =>
                                                    setShippingInfo({
                                                        ...shippingInfo,
                                                        postalCode:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="notes">
                                                Delivery Notes
                                            </Label>
                                            <Textarea
                                                id="notes"
                                                value={shippingInfo.notes}
                                                onChange={(e) =>
                                                    setShippingInfo({
                                                        ...shippingInfo,
                                                        notes: e.target.value,
                                                    })
                                                }
                                                placeholder="Special delivery instructions..."
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full"
                                        >
                                            Continue to Payment
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 2: Payment Method */}
                        {step === 2 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <CreditCard className="h-5 w-5 mr-2" />
                                        Payment Method
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handlePaymentSubmit}
                                        className="space-y-6"
                                    >
                                        <RadioGroup
                                            value={paymentMethod}
                                            onValueChange={
                                                handlePaymentMethodChange
                                            }
                                        >
                                            {/* Cash on Delivery */}
                                            <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                                <RadioGroupItem
                                                    value="cod"
                                                    id="cod"
                                                />
                                                <Label
                                                    htmlFor="cod"
                                                    className="flex-1 cursor-pointer"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="font-medium">
                                                                Cash on Delivery
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                Pay when you
                                                                receive your
                                                                order
                                                            </p>
                                                        </div>
                                                        <Truck className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                </Label>
                                            </div>

                                            {/* VNPay */}
                                            <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
                                                <RadioGroupItem
                                                    value="vnpay"
                                                    id="vnpay"
                                                    disabled
                                                />
                                                <Label
                                                    htmlFor="vnpay"
                                                    className="flex-1 cursor-not-allowed"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="font-medium">
                                                                VNPay
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                Pay online with
                                                                VNPay (Coming
                                                                Soon)
                                                            </p>
                                                        </div>
                                                        <CreditCard className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                </Label>
                                            </div>
                                        </RadioGroup>

                                        <div className="flex space-x-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setStep(1)}
                                                className="flex-1"
                                            >
                                                Back to Shipping
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="flex-1"
                                            >
                                                Review Order
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 3: Order Review */}
                        {step === 3 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Review</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Shipping Information Review */}
                                    <div>
                                        <h3 className="font-medium mb-2">
                                            Shipping Information
                                        </h3>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>{shippingInfo.fullName}</p>
                                            <p>{shippingInfo.email}</p>
                                            <p>{shippingInfo.phone}</p>
                                            <p>{shippingInfo.address}</p>
                                            <p>
                                                {shippingInfo.ward},{" "}
                                                {shippingInfo.district},{" "}
                                                {shippingInfo.city}
                                            </p>
                                            {shippingInfo.postalCode && (
                                                <p>{shippingInfo.postalCode}</p>
                                            )}
                                            {shippingInfo.notes && (
                                                <p className="italic">
                                                    Notes: {shippingInfo.notes}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => setStep(1)}
                                            className="p-0 h-auto text-blue-600"
                                        >
                                            Edit
                                        </Button>
                                    </div>

                                    <Separator />

                                    {/* Payment Method Review */}
                                    <div>
                                        <h3 className="font-medium mb-2">
                                            Payment Method
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {getPaymentMethodLabel(
                                                paymentMethod
                                            )}
                                        </p>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => setStep(2)}
                                            className="p-0 h-auto text-blue-600"
                                        >
                                            Edit
                                        </Button>
                                    </div>

                                    <Separator />

                                    {/* Order Items Review */}
                                    <div>
                                        <h3 className="font-medium mb-2">
                                            Order Items
                                        </h3>
                                        <div className="space-y-3">
                                            {items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-3"
                                                >
                                                    <div className="relative h-16 w-16 overflow-hidden rounded">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-sm">
                                                            {item.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            Quantity: 1
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
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep(2)}
                                            className="flex-1"
                                        >
                                            Back to Payment
                                        </Button>
                                        <Button
                                            onClick={handlePlaceOrder}
                                            disabled={isLoading}
                                            className="flex-1"
                                        >
                                            {isLoading
                                                ? "Placing Order..."
                                                : "Place Order"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Items */}
                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-3"
                                        >
                                            <div className="relative h-12 w-12 overflow-hidden rounded">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm truncate">
                                                    {item.name}
                                                </h4>
                                                <p className="text-xs text-gray-600">
                                                    Qty: 1
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
                                </div>

                                <Separator />

                                {/* Totals */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>
                                            Subtotal ({items.length} items)
                                        </span>
                                        <span>
                                            {subtotal.toLocaleString("vi-VN")}₫
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Shipping</span>
                                        <span>
                                            {shippingCost.toLocaleString(
                                                "vi-VN"
                                            )}
                                            ₫
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Tax</span>
                                        <span>
                                            {tax.toLocaleString("vi-VN")}₫
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-medium">
                                        <span>Total</span>
                                        <span>
                                            {total.toLocaleString("vi-VN")}₫
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Method Info */}
                                {step >= 2 && (
                                    <div className="pt-4 border-t">
                                        <div className="flex items-center space-x-2 text-sm">
                                            {isCashOnDelivery(paymentMethod) ? (
                                                <>
                                                    <Truck className="h-4 w-4" />
                                                    <span>
                                                        Cash on Delivery
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className="h-4 w-4" />
                                                    <span>VNPay</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
