import { Product, Category, Book, BooksResponse } from "./types";

// Legacy fake data for backward compatibility
const products: Product[] = [
    {
        id: "1",
        name: "Minimal Desk Lamp",
        description: "A sleek, adjustable desk lamp with minimalist design.",
        price: 49.99,
        image: "/placeholder/400x400.svg",
        category: "Home Decor",
    },
    {
        id: "2",
        name: "Ergonomic Office Chair",
        description:
            "Comfortable office chair with lumbar support and adjustable height.",
        price: 199.99,
        image: "/placeholder/400x400.svg",
        category: "Furniture",
    },
    {
        id: "3",
        name: "Wireless Earbuds",
        description: "Premium wireless earbuds with noise cancellation.",
        price: 129.99,
        image: "/placeholder/400x400.svg",
        category: "Electronics",
    },
    {
        id: "4",
        name: "Ceramic Coffee Mug",
        description: "Handcrafted ceramic mug with minimalist design.",
        price: 24.99,
        image: "/placeholder/400x400.svg",
        category: "Kitchen",
    },
    {
        id: "5",
        name: "Leather Wallet",
        description: "Genuine leather wallet with multiple card slots.",
        price: 59.99,
        image: "/placeholder/400x400.svg",
        category: "Accessories",
    },
    {
        id: "6",
        name: "Smart Watch",
        description:
            "Feature-rich smartwatch with health tracking capabilities.",
        price: 249.99,
        image: "/placeholder/400x400.svg",
        category: "Electronics",
    },
];

const legacyCategories: Category[] = [
    {
        id: "1",
        name: "Electronics",
        slug: "electronics",
        image: "/placeholder/300x300.svg",
    },
    {
        id: "2",
        name: "Furniture",
        slug: "furniture",
        image: "/placeholder/300x300.svg",
    },
    {
        id: "3",
        name: "Home Decor",
        slug: "home-decor",
        image: "/placeholder/300x300.svg",
    },
    {
        id: "4",
        name: "Kitchen",
        slug: "kitchen",
        image: "/placeholder/300x300.svg",
    },
];

// API fetch functions for real data
const getApiBaseUrl = () => {
    // Check if we're running on the client side
    if (typeof window !== "undefined") {
        return process.env.NEXT_PUBLIC_API_URL || "/api";
    }
    // Server-side: use absolute URL
    return (
        process.env.NEXT_PUBLIC_API_URL ||
        `http://localhost:${process.env.PORT || 3000}/api`
    );
};

export async function fetchCategories(): Promise<Category[]> {
    try {
        const response = await fetch(`${getApiBaseUrl()}/admin/categories`, {
            cache: "no-store", // Always fetch fresh data
        });

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export async function fetchBooks(params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    featured?: boolean;
    search?: string;
}): Promise<{ books: Book[]; pagination?: any }> {
    try {
        const searchParams = new URLSearchParams();

        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.limit)
            searchParams.append("limit", params.limit.toString());
        if (params?.categoryId)
            searchParams.append("categoryId", params.categoryId);
        if (params?.featured) searchParams.append("featured", "true");
        if (params?.search) searchParams.append("search", params.search);

        const response = await fetch(
            `${getApiBaseUrl()}/books?${searchParams.toString()}`,
            {
                cache: "no-store", // Always fetch fresh data
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }

        const data: BooksResponse = await response.json();
        return {
            books: data.books,
            pagination: data.pagination,
        };
    } catch (error) {
        console.error("Error fetching books:", error);
        return { books: [] };
    }
}

export async function fetchFeaturedBooks(): Promise<Book[]> {
    const { books } = await fetchBooks({ featured: true, limit: 8 });
    return books;
}

export async function fetchBooksByCategory(
    categoryId: string
): Promise<Book[]> {
    const { books } = await fetchBooks({ categoryId, limit: 20 });
    return books;
}

export async function fetchCategoryBySlug(
    slug: string
): Promise<Category | null> {
    try {
        const response = await fetch(
            `${getApiBaseUrl()}/admin/categories/slug/${slug}`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            return null;
        }

        const category = await response.json();
        return category;
    } catch (error) {
        console.error("Error fetching category by slug:", error);
        return null;
    }
}

export async function fetchBooksByCategorySlug(slug: string): Promise<Book[]> {
    try {
        // First get the category to get its ID
        const category = await fetchCategoryBySlug(slug);
        if (!category) {
            return [];
        }

        // Then fetch books by category ID
        const { books } = await fetchBooks({
            categoryId: category.id,
            limit: 20,
        });
        return books;
    } catch (error) {
        console.error("Error fetching books by category slug:", error);
        return [];
    }
}

export async function fetchBookById(id: string): Promise<Book | null> {
    try {
        const response = await fetch(`${getApiBaseUrl()}/books/${id}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        const book = await response.json();
        return book;
    } catch (error) {
        console.error("Error fetching book:", error);
        return null;
    }
}

export async function searchBooks(query: string): Promise<Book[]> {
    try {
        const { books } = await fetchBooks({ search: query, limit: 20 });
        return books;
    } catch (error) {
        console.error("Error searching books:", error);
        return [];
    }
}

// Legacy functions for backward compatibility
export function getAllCategories(): Category[] {
    return legacyCategories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
    return legacyCategories.find((category) => category.slug === slug);
}

export function getAllProducts(): Product[] {
    return products;
}

export function getFeaturedProducts(): Product[] {
    return products.slice(0, 4);
}

export function getProductsByCategory(category: string): Product[] {
    return products.filter((product) => product.category === category);
}

export function getProductById(id: string): Product | undefined {
    return products.find((product) => product.id === id);
}

export function searchProducts(query: string): Product[] {
    return products.filter(
        (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
    );
}
