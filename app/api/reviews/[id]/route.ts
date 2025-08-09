import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: reviewId } = await params;

        const review = await prisma.review.findUnique({
            where: { id: reviewId },
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

        if (!review) {
            return NextResponse.json(
                { error: "Review not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(review);
    } catch (error) {
        console.error("Error fetching review:", error);
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
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: reviewId } = await params;
        const { rating, comment } = await request.json();

        if (!rating) {
            return NextResponse.json(
                { error: "Rating is required" },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        // Check if review exists and belongs to user
        const existingReview = await prisma.review.findUnique({
            where: { id: reviewId },
        });

        if (!existingReview) {
            return NextResponse.json(
                { error: "Review not found" },
                { status: 404 }
            );
        }

        if (existingReview.userId !== session.user.id) {
            return NextResponse.json(
                { error: "You can only edit your own reviews" },
                { status: 403 }
            );
        }

        // Update review
        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: {
                rating,
                comment,
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
            where: { bookId: existingReview.bookId },
            _avg: { rating: true },
            _count: { rating: true },
        });

        // Note: Book model doesn't have averageRating field, so we skip this update
        // await prisma.book.update({
        //     where: { id: existingReview.bookId },
        //     data: {
        //         averageRating: avgRating._avg.rating || 0,
        //         reviewCount: avgRating._count.rating,
        //     },
        // });

        return NextResponse.json(updatedReview);
    } catch (error) {
        console.error("Error updating review:", error);
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
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: reviewId } = await params;

        // Check if review exists and belongs to user
        const review = await prisma.review.findUnique({
            where: { id: reviewId },
        });

        if (!review) {
            return NextResponse.json(
                { error: "Review not found" },
                { status: 404 }
            );
        }

        if (
            review.userId !== session.user.id &&
            session.user.role !== "ADMIN"
        ) {
            return NextResponse.json(
                { error: "You can only delete your own reviews" },
                { status: 403 }
            );
        }

        // Delete review
        await prisma.review.delete({
            where: { id: reviewId },
        });

        // Update book average rating
        const avgRating = await prisma.review.aggregate({
            where: { bookId: review.bookId },
            _avg: { rating: true },
            _count: { rating: true },
        });

        // Note: Book model doesn't have averageRating field, so we skip this update
        // await prisma.book.update({
        //     where: { id: review.bookId },
        //     data: {
        //         averageRating: avgRating._avg.rating || 0,
        //         reviewCount: avgRating._count.rating,
        //     },
        // });

        return NextResponse.json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
