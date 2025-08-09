import { fetchBookById, fetchBooksByCategory } from "@/lib/data";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Star,
    BookOpen,
    Calendar,
    Globe,
    Package,
    Users,
    MessageCircle,
} from "lucide-react";
import ProductCard from "@/components/product-card";
import { formatPrice } from "@/lib/utils";

interface Params {
    id: string;
}

/**
 * The product page component
 * @param {Params} params The route params
 * @returns {JSX.Element} The component
 */
export default async function SingleProductPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { id } = await params;

    const book = await fetchBookById(id);

    // If there is no book with the given id, return a 404
    if (!book) return notFound();

    // Fetch related books from the same category
    const relatedBooks = await fetchBooksByCategory(book.category.id);
    const filteredRelatedBooks = relatedBooks
        .filter((b) => b.id !== book.id)
        .slice(0, 4);

    return (
        <>
            {/* The navbar component */}
            <Navbar />

            {/* The main content */}
            <div className="bg-gray-50 min-h-screen py-8">
                <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* The book image */}
                        <div className="space-y-4">
                            <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
                                <Image
                                    src={
                                        book.images?.[0] ||
                                        "/placeholder/400x400.svg"
                                    }
                                    alt={book.title}
                                    fill
                                    className="object-cover rounded-lg shadow-lg"
                                    priority
                                />
                                {book.featured && (
                                    <Badge className="absolute top-4 left-4 bg-red-500">
                                        Featured
                                    </Badge>
                                )}
                                {book.salePrice &&
                                    book.salePrice < book.price && (
                                        <Badge className="absolute top-4 right-4 bg-green-500">
                                            Sale
                                        </Badge>
                                    )}
                            </div>

                            {/* Additional images */}
                            {book.images && book.images.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {book.images
                                        .slice(0, 3)
                                        .map((image, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-square"
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`${book.title} image ${
                                                        index + 1
                                                    }`}
                                                    fill
                                                    className="object-cover rounded-md"
                                                />
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* The book details */}
                        <div className="space-y-6">
                            {/* The book title */}
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                    {book.title}
                                </h1>
                                {book.titleVi && (
                                    <h2 className="text-xl text-gray-600 mb-4">
                                        {book.titleVi}
                                    </h2>
                                )}
                            </div>

                            {/* Authors */}
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-gray-500" />
                                <span className="text-lg text-gray-700">
                                    by{" "}
                                    {book.authors
                                        .map((a) => a.author.name)
                                        .join(", ")}
                                </span>
                            </div>

                            {/* Category and Publisher */}
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">
                                    {book.category.name}
                                </Badge>
                                <Badge variant="outline">
                                    {book.publisher.name}
                                </Badge>
                                {book.language && (
                                    <Badge variant="outline">
                                        <Globe className="h-3 w-3 mr-1" />
                                        {book.language.toUpperCase()}
                                    </Badge>
                                )}
                            </div>

                            {/* Rating (if available) */}
                            {book.averageRating && (
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-5 w-5 ${
                                                    i <
                                                    Math.floor(
                                                        book.averageRating!
                                                    )
                                                        ? "text-yellow-400 fill-current"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-gray-600">
                                        {book.averageRating.toFixed(1)} (
                                        {book.reviewCount || 0} reviews)
                                    </span>
                                </div>
                            )}

                            {/* Price */}
                            <div className="space-y-2">
                                {book.salePrice &&
                                book.salePrice < book.price ? (
                                    <div className="flex items-center space-x-3">
                                        <span className="text-3xl font-bold text-red-600">
                                            {formatPrice(book.salePrice)}
                                        </span>
                                        <span className="text-xl text-gray-500 line-through">
                                            {formatPrice(book.price)}
                                        </span>
                                        <Badge className="bg-red-500">
                                            {Math.round(
                                                ((book.price - book.salePrice) /
                                                    book.price) *
                                                    100
                                            )}
                                            % OFF
                                        </Badge>
                                    </div>
                                ) : (
                                    <span className="text-3xl font-bold text-gray-900">
                                        {formatPrice(book.price)}
                                    </span>
                                )}
                            </div>

                            {/* Stock status */}
                            <div className="flex items-center space-x-2">
                                <Package className="h-5 w-5 text-gray-500" />
                                <span
                                    className={`font-medium ${
                                        book.stock > 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {book.stock > 0
                                        ? `${book.stock} in stock`
                                        : "Out of stock"}
                                </span>
                            </div>

                            {/* Book details card */}
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Book Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        {book.isbn && (
                                            <div>
                                                <span className="font-medium text-gray-700">
                                                    ISBN:
                                                </span>
                                                <span className="ml-2 text-gray-600">
                                                    {book.isbn}
                                                </span>
                                            </div>
                                        )}
                                        {book.pageCount && (
                                            <div className="flex items-center">
                                                <BookOpen className="h-4 w-4 mr-1 text-gray-500" />
                                                <span className="font-medium text-gray-700">
                                                    Pages:
                                                </span>
                                                <span className="ml-2 text-gray-600">
                                                    {book.pageCount}
                                                </span>
                                            </div>
                                        )}
                                        {book.publishedDate && (
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                                <span className="font-medium text-gray-700">
                                                    Published:
                                                </span>
                                                <span className="ml-2 text-gray-600">
                                                    {new Date(
                                                        book.publishedDate
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-medium text-gray-700">
                                                Language:
                                            </span>
                                            <span className="ml-2 text-gray-600 capitalize">
                                                {book.language}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Add to cart button */}
                            <AddToCartButton
                                product={{
                                    id: book.id,
                                    name: book.title,
                                    description: book.description || "",
                                    price: book.salePrice || book.price,
                                    image: book.coverImage || "",
                                    category: book.category.name,
                                }}
                            />

                            {/* Description */}
                            <div className="space-y-4">
                                <Separator />
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        Description
                                    </h3>
                                    <div className="prose prose-gray max-w-none">
                                        <p className="text-gray-700 leading-relaxed">
                                            {book.description}
                                        </p>
                                        {book.descriptionVi && (
                                            <>
                                                <h4 className="text-lg font-medium mt-4 mb-2">
                                                    Mô tả (Tiếng Việt)
                                                </h4>
                                                <p className="text-gray-700 leading-relaxed">
                                                    {book.descriptionVi}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Author information */}
                            <div className="space-y-4">
                                <Separator />
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        About the Author
                                        {book.authors.length > 1 ? "s" : ""}
                                    </h3>
                                    {book.authors.map(
                                        (authorRelation, index) => (
                                            <div
                                                key={index}
                                                className="mb-4 last:mb-0"
                                            >
                                                <h4 className="font-medium text-gray-900 mb-2">
                                                    {authorRelation.author.name}
                                                </h4>
                                                {authorRelation.author.bio && (
                                                    <p className="text-gray-700 text-sm leading-relaxed">
                                                        {
                                                            authorRelation
                                                                .author.bio
                                                        }
                                                    </p>
                                                )}
                                                {authorRelation.author
                                                    .nationality && (
                                                    <p className="text-gray-500 text-sm mt-1">
                                                        Nationality:{" "}
                                                        {
                                                            authorRelation
                                                                .author
                                                                .nationality
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Books Section */}
                    {filteredRelatedBooks.length > 0 && (
                        <div className="mt-16">
                            <Separator className="mb-8" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                More books in {book.category.name}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {filteredRelatedBooks.map((relatedBook) => (
                                    <ProductCard
                                        key={relatedBook.id}
                                        product={relatedBook}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reviews Section */}
                    <div className="mt-16">
                        <Separator className="mb-8" />
                        <div className="flex items-center space-x-2 mb-6">
                            <MessageCircle className="h-6 w-6 text-gray-600" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                Customer Reviews
                            </h2>
                            {book.reviewCount && book.reviewCount > 0 && (
                                <Badge variant="secondary">
                                    {book.reviewCount} reviews
                                </Badge>
                            )}
                        </div>

                        {book.averageRating &&
                        book.reviewCount &&
                        book.reviewCount > 0 ? (
                            <div className="space-y-6">
                                {/* Review Summary */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-3">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-5 w-5 ${
                                                            i <
                                                            Math.floor(
                                                                book.averageRating!
                                                            )
                                                                ? "text-yellow-400 fill-current"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-lg">
                                                {book.averageRating.toFixed(1)}{" "}
                                                out of 5
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600">
                                            Based on {book.reviewCount} customer
                                            review
                                            {book.reviewCount !== 1 ? "s" : ""}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Individual Reviews Placeholder */}
                                <Card>
                                    <CardContent className="p-6">
                                        <p className="text-gray-600 text-center py-8">
                                            Individual reviews will be displayed
                                            here when the review system is fully
                                            implemented.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-gray-600 text-center py-8">
                                        No reviews yet. Be the first to review
                                        this book!
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* The footer component */}
            <Footer />
        </>
    );
}
