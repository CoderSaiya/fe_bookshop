import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import { fetchCategoryBySlug, fetchBooksByCategorySlug } from "@/lib/data";
import { notFound } from "next/navigation";

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const category = await fetchCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const books = await fetchBooksByCategorySlug(slug);

    return (
        <>
            <Navbar />
            <section className="w-full py-12">
                <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
                    <h1 className="text-3xl font-bold mb-8">{category.name}</h1>

                    {books.length === 0 ? (
                        <div className="text-center py-12">
                            <h2 className="text-xl font-medium">
                                No products found in this category
                            </h2>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {books.map((book) => (
                                <ProductCard key={book.id} product={book} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
}

export default CategoryPage;
