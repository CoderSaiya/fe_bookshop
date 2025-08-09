// Payment method utilities
export type PaymentMethodKey = "cod" | "vnpay";
export type PaymentMethodEnum = "CASH_ON_DELIVERY" | "VNPAY";

export const PAYMENT_METHODS = {
    cod: {
        key: "cod" as PaymentMethodKey,
        enum: "CASH_ON_DELIVERY" as PaymentMethodEnum,
        label: "Cash on Delivery",
        labelVi: "Thanh toán khi nhận hàng",
    },
    vnpay: {
        key: "vnpay" as PaymentMethodKey,
        enum: "VNPAY" as PaymentMethodEnum,
        label: "VNPay",
        labelVi: "VNPay",
    },
} as const;

/**
 * Convert frontend payment method key to database enum value
 */
export function paymentMethodToEnum(
    method: PaymentMethodKey
): PaymentMethodEnum {
    return PAYMENT_METHODS[method].enum;
}

/**
 * Convert database enum value to frontend payment method key
 */
export function paymentMethodFromEnum(
    method: PaymentMethodEnum
): PaymentMethodKey {
    switch (method) {
        case "CASH_ON_DELIVERY":
            return "cod";
        case "VNPAY":
            return "vnpay";
        default:
            throw new Error(`Unknown payment method enum: ${method}`);
    }
}

/**
 * Get payment method display label
 */
export function getPaymentMethodLabel(
    method: PaymentMethodKey | PaymentMethodEnum,
    locale: "en" | "vi" = "en"
): string {
    // If it's an enum value, convert it first
    const key =
        typeof method === "string" && method.includes("_")
            ? paymentMethodFromEnum(method as PaymentMethodEnum)
            : (method as PaymentMethodKey);

    const paymentMethod = PAYMENT_METHODS[key];
    if (!paymentMethod) {
        return method; // Fallback to the original value
    }

    return locale === "vi" ? paymentMethod.labelVi : paymentMethod.label;
}

/**
 * Check if payment method is Cash on Delivery
 */
export function isCashOnDelivery(
    method: PaymentMethodKey | PaymentMethodEnum
): boolean {
    return method === "cod" || method === "CASH_ON_DELIVERY";
}

/**
 * Check if payment method is VNPay
 */
export function isVNPay(method: PaymentMethodKey | PaymentMethodEnum): boolean {
    return method === "vnpay" || method === "VNPAY";
}
