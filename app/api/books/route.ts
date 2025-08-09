import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const category = searchParams.get("category");
        const author = searchParams.get("author");
        const search = searchParams.get("search");
        const sort = searchParams.get("sort") || "createdAt";
        const order = searchParams.get("order") || "desc";

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {
            status: "ACTIVE",
        };

        if (category) {
            where.categoryId = category;
        }

        if (author) {
            where.authors = {
                some: {
                    authorId: author,
                },
            };
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { titleVi: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { isbn: { contains: search, mode: "insensitive" } },
            ];
        }

        const [books, total] = await Promise.all([
            prisma.book.findMany({
                where,
                include: {
                    category: true,
                    publisher: true,
                    authors: {
                        include: {
                            author: true,
                        },
                    },
                    reviews: {
                        select: {
                            rating: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: {
                    [sort]: order as "asc" | "desc",
                },
            }),
            prisma.book.count({ where }),
        ]);

        // Calculate average rating for each book
        const booksWithRating = books.map((book: any) => ({
            ...book,
            averageRating:
                book.reviews.length > 0
                    ? book.reviews.reduce(
                          (sum: number, review: any) => sum + review.rating,
                          0
                      ) / book.reviews.length
                    : 0,
            reviewCount: book.reviews.length,
        }));

        return NextResponse.json({
            books: booksWithRating,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            title,
            titleVi,
            isbn,
            description,
            descriptionVi,
            price,
            salePrice,
            coverImage,
            images,
            pageCount,
            language,
            publishedDate,
            weight,
            dimensions,
            stock,
            categoryId,
            publisherId,
            authorIds,
            featured,
        } = body;

        // Create book with authors
        const book = await prisma.book.create({
            data: {
                title,
                titleVi,
                isbn,
                description,
                descriptionVi,
                price: parseFloat(price),
                salePrice: salePrice ? parseFloat(salePrice) : null,
                coverImage,
                images,
                pageCount: pageCount ? parseInt(pageCount) : null,
                language,
                publishedDate: publishedDate ? new Date(publishedDate) : null,
                weight: weight ? parseFloat(weight) : null,
                dimensions,
                stock: parseInt(stock),
                categoryId,
                publisherId,
                featured: Boolean(featured),
                authors: {
                    create: authorIds.map((authorId: string) => ({
                        authorId,
                    })),
                },
            },
            include: {
                category: true,
                publisher: true,
                authors: {
                    include: {
                        author: true,
                    },
                },
            },
        });

        return NextResponse.json(book, { status: 201 });
    } catch (error) {
        console.error("Error creating book:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
