import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const book = await prisma.book.findUnique({
            where: { id },
            include: {
                category: true,
                publisher: true,
                authors: {
                    include: {
                        author: true,
                    },
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        if (!book) {
            return NextResponse.json(
                { error: "Book not found" },
                { status: 404 }
            );
        }

        // Calculate average rating
        const averageRating =
            book.reviews.length > 0
                ? book.reviews.reduce(
                      (sum: number, review: any) => sum + review.rating,
                      0
                  ) / book.reviews.length
                : 0;

        const bookWithRating = {
            ...book,
            averageRating,
            reviewCount: book.reviews.length,
        };

        return NextResponse.json(bookWithRating);
    } catch (error) {
        console.error("Error fetching book:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
            status,
        } = body;

        // Update book and replace authors
        const book = await prisma.$transaction(async (tx: any) => {
            // Delete existing author relations
            await tx.bookAuthor.deleteMany({
                where: { bookId: id },
            });

            // Update book with new author relations
            return tx.book.update({
                where: { id },
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
                    publishedDate: publishedDate
                        ? new Date(publishedDate)
                        : null,
                    weight: weight ? parseFloat(weight) : null,
                    dimensions,
                    stock: parseInt(stock),
                    categoryId,
                    publisherId,
                    featured: Boolean(featured),
                    status,
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
        });

        return NextResponse.json(book);
    } catch (error) {
        console.error("Error updating book:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.book.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error deleting book:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
