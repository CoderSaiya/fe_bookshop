"use client";

import { useState, useEffect } from "react";
import { fetchFeaturedBooks } from "@/lib/data";
import { Book } from "@/lib/types";
import ProductCard from "./product-card";
import { useTranslations } from "next-intl";

/**
 * FeaturedProducts component displays a grid of featured products.
 * It retrieves the featured products from the data source and renders
 * them using the ProductCard component.
 *
 * @returns {JSX.Element} The rendered FeaturedProducts component.
 */
function FeaturedProducts() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const t = useTranslations("featured");

    useEffect(() => {
        async function loadFeaturedBooks() {
            setLoading(true);
            try {
                const fetchedBooks = await fetchFeaturedBooks();
                setBooks(fetchedBooks);
            } catch (error) {
                console.error("Error loading featured books:", error);
            } finally {
                setLoading(false);
            }
        }

        loadFeaturedBooks();
    }, []);

    if (loading) {
        return (
            <section className="w-full py-12">
                <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
                    <h2 className="text-2xl font-bold tracking-tight mb-6">
                        {t("title")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Loading skeleton */}
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse bg-gray-200 rounded-lg h-96"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full py-12">
            <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
                {/* Section heading */}
                <h2 className="text-2xl font-bold tracking-tight mb-6">
                    {t("title")}
                </h2>
                {/* Grid layout for featured products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {books.map((book) => (
                        // Render a ProductCard for each featured product
                        <ProductCard key={book.id} product={book} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeaturedProducts;
