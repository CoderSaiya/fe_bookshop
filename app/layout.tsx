import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/hooks/use-cart";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = {
    title: "The Modern Bookstore",
    description: "A Next.js clean ecommerce app.",
};

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <CartProvider>{children}</CartProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
