"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product-card";
import { fetchBooks } from "@/lib/data";
import { Book } from "@/lib/types";

/**
 * The Products component displays a list of all products.
 */
function Products() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBooks() {
            setLoading(true);
            try {
                const response = await fetchBooks();
                setBooks(response.books);
            } catch (error) {
                console.error("Error loading books:", error);
            } finally {
                setLoading(false);
            }
        }

        loadBooks();
    }, []);

    if (loading) {
        return (
            <section className="w-full py-12">
                <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
                    <h1 className="text-3xl font-bold mb-8">All Products</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* Loading skeleton */}
                        {Array.from({ length: 8 }).map((_, index) => (
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
                <h1 className="text-3xl font-bold mb-8">All Products</h1>

                {/* Display the products in a responsive grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {books.map((book) => (
                        <ProductCard key={book.id} product={book} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Products;
