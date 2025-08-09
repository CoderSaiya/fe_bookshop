// Database types matching our Prisma schema
export interface Category {
    id: string;
    name: string;
    nameVi?: string;
    slug: string;
    description?: string;
    image?: string;
    _count?: {
        books: number;
    };
}

export interface Author {
    id: string;
    name: string;
    nameVi?: string;
    bio?: string;
    image?: string;
    nationality?: string;
}

export interface Publisher {
    id: string;
    name: string;
    nameVi?: string;
    description?: string;
    website?: string;
    address?: string;
}

export interface Book {
    id: string;
    title: string;
    titleVi?: string;
    isbn?: string;
    description?: string;
    descriptionVi?: string;
    price: number;
    salePrice?: number;
    coverImage?: string;
    images?: string[];
    pageCount?: number;
    language: string;
    publishedDate?: string;
    stock: number;
    status: string;
    featured: boolean;
    averageRating?: number;
    reviewCount?: number;
    category: Category;
    publisher: Publisher;
    authors: Array<{
        author: Author;
    }>;
    createdAt: string;
    updatedAt: string;
}

// Legacy Product interface for backward compatibility
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

// API Response types
export interface BooksResponse {
    books: Book[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface CategoriesResponse {
    categories: Category[];
}
