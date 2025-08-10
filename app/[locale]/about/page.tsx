import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Award, Heart, Target, Zap } from "lucide-react";

export default function AboutPage() {
    const stats = [
        { label: "Books Available", value: "10,000+", icon: BookOpen },
        { label: "Happy Customers", value: "50,000+", icon: Users },
        { label: "Years Experience", value: "15+", icon: Award },
        { label: "Customer Satisfaction", value: "98%", icon: Heart },
    ];

    const team = [
        {
            name: "John Smith",
            role: "Founder & CEO",
            bio: "Passionate book lover with 20+ years in publishing industry.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
        },
        {
            name: "Sarah Johnson",
            role: "Head of Curation",
            bio: "Literature expert specializing in discovering hidden gems.",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
        },
        {
            name: "Michael Chen",
            role: "Technology Director",
            bio: "Building the future of online book shopping experience.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
        },
    ];

    const values = [
        {
            title: "Quality First",
            description:
                "We curate only the finest books from trusted publishers and authors.",
            icon: Target,
        },
        {
            title: "Customer Focus",
            description:
                "Your reading journey is our priority. We're here to help you discover your next favorite book.",
            icon: Heart,
        },
        {
            title: "Innovation",
            description:
                "Constantly improving our platform to make book discovery easier and more enjoyable.",
            icon: Zap,
        },
    ];

    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            About Our Bookstore
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Connecting readers with exceptional books since 2009
                        </p>
                        <Badge className="bg-white text-blue-600 text-lg px-6 py-2">
                            Your Literary Journey Starts Here
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <Card key={index} className="text-center">
                                <CardContent className="p-6">
                                    <stat.icon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-600">
                                        {stat.label}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Our Story
                            </h2>
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    Founded in 2009 by a group of passionate
                                    bibliophiles, our bookstore began as a small
                                    local shop with a simple mission: to connect
                                    readers with books that would change their
                                    lives.
                                </p>
                                <p>
                                    Over the years, we&apos;ve evolved from a
                                    single storefront to a comprehensive online
                                    platform, but our core values remain
                                    unchanged. We believe that every book has
                                    the power to educate, inspire, and
                                    transform.
                                </p>
                                <p>
                                    Today, we proudly serve readers worldwide,
                                    offering carefully curated collections
                                    across all genres. From bestselling novels
                                    to academic texts, from children&apos;s
                                    books to rare collectibles – we&apos;re your
                                    trusted partner in the wonderful world of
                                    books.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
                                <Image
                                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop"
                                    alt="Bookstore interior"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
