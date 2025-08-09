"use client";

import { useState, useEffect } from "react";
import { fetchCategories } from "@/lib/data";
import { Category } from "@/lib/types";
import CategoryCard from "./category-card";
import { useTranslations } from "next-intl";

/**
 * The Categories component displays a list of categories.
 */
function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const t = useTranslations("categories");

    useEffect(() => {
        async function loadCategories() {
            setLoading(true);
            try {
                const fetchedCategories = await fetchCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Error loading categories:", error);
            } finally {
                setLoading(false);
            }
        }

        loadCategories();
    }, []);

    if (loading) {
        return (
            <section className="w-full py-12">
                <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
                    <h2 className="text-3xl font-bold mb-8">{t("title")}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* Loading skeleton */}
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse bg-gray-200 rounded-lg h-40"
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
                <h2 className="text-3xl font-bold mb-8">{t("title")}</h2>
                {/* Display the categories in a grid. */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Categories;
