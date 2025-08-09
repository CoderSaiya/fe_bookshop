import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const bookId = searchParams.get("bookId");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const rating = searchParams.get("rating");
        const sortBy = searchParams.get("sortBy") || "newest";

        const skip = (page - 1) * limit;

        const where: any = {};

        if (bookId) {
            where.bookId = bookId;
        }

        if (rating) {
            where.rating = parseInt(rating);
        }

        const orderBy: any = {};
        switch (sortBy) {
            case "oldest":
                orderBy.createdAt = "asc";
                break;
            case "rating-high":
                orderBy.rating = "desc";
                break;
            case "rating-low":
                orderBy.rating = "asc";
                break;
            default:
                orderBy.createdAt = "desc";
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    book: {
                        select: {
                            id: true,
                            title: true,
                            coverImage: true,
                        },
                    },
                },
            }),
            prisma.review.count({ where }),
        ]);

        return NextResponse.json({
            reviews,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { bookId, rating, comment } = await request.json();

        if (!bookId || !rating) {
            return NextResponse.json(
                { error: "Book ID and rating are required" },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        // Check if book exists
        const book = await prisma.book.findUnique({
            where: { id: bookId },
        });

        if (!book) {
            return NextResponse.json(
                { error: "Book not found" },
                { status: 404 }
            );
        }

        // Check if user has already reviewed this book
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_bookId: {
                    userId: session.user.id,
                    bookId: bookId,
                },
            },
        });

        if (existingReview) {
            return NextResponse.json(
                { error: "You have already reviewed this book" },
                { status: 400 }
            );
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                userId: session.user.id,
                bookId: bookId,
                rating: rating,
                comment: comment,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                book: {
                    select: {
                        id: true,
                        title: true,
                        coverImage: true,
                    },
                },
            },
        });

        // Update book average rating
        const avgRating = await prisma.review.aggregate({
            where: { bookId: bookId },
            _avg: { rating: true },
            _count: { rating: true },
        });

        // Note: Book model doesn't have averageRating field, so we skip this update
        // await prisma.book.update({
        //     where: { id: bookId },
        //     data: {
        //         averageRating: avgRating._avg.rating || 0,
        //         reviewCount: avgRating._count.rating,
        //     },
        // });

        return NextResponse.json(review);
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
