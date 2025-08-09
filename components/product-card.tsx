"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { Product, Book } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
    product: Product | Book;
}

/**
 * ProductCard component displays the product's image, name, category, price,
 * and an "Add to Cart" button. It links to the product's detailed page.
 *
 * @param {ProductCardProps} props - Props containing the product details.
 * @returns {JSX.Element} The rendered ProductCard component.
 */
function ProductCard({ product }: ProductCardProps) {
    // Get the addToCart function from the useCart hook
    const { addToCart } = useCart();
    const t = useTranslations("product");

    // Helper function to check if product is a Book
    const isBook = (item: Product | Book): item is Book => {
        return "title" in item;
    };

    // Get display properties based on product type
    const displayName = isBook(product) ? product.title : product.name;
    const displayImage = isBook(product)
        ? product.images?.[0] ||
          product.coverImage ||
          "/placeholder/300x300.svg"
        : product.image;
    const displayCategory = isBook(product)
        ? product.category?.name
        : product.category;

    // Convert Book to Product format for cart compatibility
    const handleAddToCart = () => {
        if (isBook(product)) {
            const productForCart: Product = {
                id: product.id,
                name: product.title,
                description: product.description || "",
                price: product.price,
                image: product.coverImage || "",
                category: product.category?.name || "",
            };
            addToCart(productForCart);
        } else {
            addToCart(product);
        }
    };

    return (
        <Card className="overflow-hidden py-0 gap-0">
            {/* Link to the product's detail page */}
            <Link href={`/products/${product.id}`}>
                <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800 group-hover:opacity-75">
                    <Image
                        src={displayImage || "/placeholder/300x300.svg"}
                        alt={displayName}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                </div>
            </Link>
            <CardContent className="px-4">
                {/* Product name linking to its detail page */}
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-medium mt-2 text-lg line-clamp-2">
                        {displayName}
                    </h3>
                </Link>
                {/* Product category */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {displayCategory}
                </p>
                {/* Author names for books */}
                {isBook(product) &&
                    product.authors &&
                    product.authors.length > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            by{" "}
                            {product.authors
                                .map((a) => a.author.name)
                                .join(", ")}
                        </p>
                    )}
                {/* Product price */}
                <div className="mt-2">
                    {isBook(product) &&
                    product.salePrice &&
                    product.salePrice < product.price ? (
                        <div className="flex items-center gap-2">
                            <p className="font-medium text-lg text-red-600">
                                {formatPrice(product.salePrice)}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}
                            </p>
                        </div>
                    ) : (
                        <p className="font-medium text-lg">
                            {formatPrice(product.price)}
                        </p>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-4">
                {/* Button to add the product to the cart */}
                <Button
                    onClick={handleAddToCart}
                    className="w-full"
                    variant="outline"
                    disabled={isBook(product) && product.stock === 0}
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {isBook(product) && product.stock === 0
                        ? "Out of Stock"
                        : t("addToCart")}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ProductCard;
