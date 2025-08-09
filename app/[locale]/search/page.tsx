"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchCategories, searchBooks, fetchBooks } from "@/lib/data";
import { Book, Category } from "@/lib/types";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SearchIcon, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import FilterSidebar from "@/components/filter-sidebar";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function Search() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Load initial data
    useEffect(() => {
        async function loadInitialData() {
            setLoading(true);
            try {
                const [categoriesData, booksData] = await Promise.all([
                    fetchCategories(),
                    fetchBooks({ limit: 50 }),
                ]);

                setCategories(categoriesData);
                setBooks(booksData.books);

                // Set price range based on actual book prices
                if (booksData.books.length > 0) {
                    const prices = booksData.books.map((book) => book.price);
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    setPriceRange([minPrice, maxPrice]);
                }
            } catch (error) {
                console.error("Error loading initial data:", error);
            } finally {
                setLoading(false);
            }
        }

        loadInitialData();
    }, []);

    // Filter books based on search and filters
    useEffect(() => {
        let results = [...books];

        if (searchQuery) {
            results = results.filter(
                (book) =>
                    book.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    book.description
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    book.authors.some((author) =>
                        author.author.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                    )
            );
        }

        // Apply Category Filter
        if (selectedCategories.length > 0) {
            results = results.filter((book) => {
                return selectedCategories.includes(book.category.name);
            });
        }

        // Apply price range filter
        results = results.filter(
            (book) => book.price >= priceRange[0] && book.price <= priceRange[1]
        );

        setFilteredBooks(results);
    }, [searchQuery, priceRange, selectedCategories, books]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prev) => {
            if (prev.includes(category)) {
                return prev.filter((c) => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        if (books.length > 0) {
            const prices = books.map((book) => book.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            setPriceRange([minPrice, maxPrice]);
        }
        setSearchQuery("");
    };

    const handlePriceChange = (range: [number, number]) => {
        setPriceRange(range);
    };

    // Get min and max prices from current books
    const minPrice =
        books.length > 0 ? Math.min(...books.map((book) => book.price)) : 0;
    const maxPrice =
        books.length > 0 ? Math.max(...books.map((book) => book.price)) : 500;

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="py-8">
                    <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-96 bg-gray-200 rounded-lg"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="py-8">
                <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
                    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:gap-6">
                        {/* Mobile Filter Button */}
                        <div className="flex md:hidden justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold">
                                Search Products
                            </h1>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                                        Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="w-[300px] sm:w-[400px]"
                                >
                                    <div className="py-4">
                                        <FilterSidebar
                                            categories={categories}
                                            selectedCategories={
                                                selectedCategories
                                            }
                                            priceRange={priceRange}
                                            minPrice={minPrice}
                                            maxPrice={maxPrice}
                                            onCategoryChange={
                                                handleCategoryChange
                                            }
                                            onPriceChange={handlePriceChange}
                                            onClearFilters={clearAllFilters}
                                        />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Desktop Sidebar */}
                        <div className="hidden md:block w-1/4 min-w-[250px]">
                            <FilterSidebar
                                categories={categories}
                                selectedCategories={selectedCategories}
                                priceRange={priceRange}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                onCategoryChange={handleCategoryChange}
                                onPriceChange={handlePriceChange}
                                onClearFilters={clearAllFilters}
                            />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="md:hidden">
                                <form
                                    onSubmit={handleSearch}
                                    className="flex w-full mb-6"
                                >
                                    <Input
                                        type="search"
                                        placeholder="Search products..."
                                        className="w-full"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                    <Button type="submit" className="ml-2">
                                        <SearchIcon className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>

                            <div className="hidden md:block mb-6">
                                <h1 className="text-2xl font-bold mb-4">
                                    Search Products
                                </h1>
                                <form
                                    onSubmit={handleSearch}
                                    className="flex w-full"
                                >
                                    <Input
                                        type="search"
                                        placeholder="Search products..."
                                        className="w-full"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                    <Button type="submit" className="ml-2">
                                        <SearchIcon className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>

                            {/* Results Count */}
                            <div className="mb-4 text-sm text-gray-500">
                                {filteredBooks.length}{" "}
                                {filteredBooks.length === 1 ? "book" : "books"}{" "}
                                found
                            </div>

                            {/* Results */}
                            {filteredBooks.length === 0 ? (
                                <div className="text-center py-12">
                                    <h2 className="text-xl font-medium">
                                        No books found
                                    </h2>
                                    <p className="text-gray-500 mt-2">
                                        Try adjusting your search or filter
                                        criteria
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={clearAllFilters}
                                    >
                                        Clear all filters
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredBooks.map((book) => (
                                        <ProductCard
                                            key={book.id}
                                            product={book}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Search;
