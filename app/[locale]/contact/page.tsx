"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    MessageCircle,
    Send,
    CheckCircle,
} from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSubmitted(true);
        setIsLoading(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: "Visit Our Store",
            details: [
                "123 Book Street",
                "Literary District",
                "Ho Chi Minh City, Vietnam 70000",
            ],
        },
        {
            icon: Phone,
            title: "Call Us",
            details: [
                "+84 (0) 123 456 789",
                "+84 (0) 987 654 321",
                "Toll-free: 1800 BOOKS",
            ],
        },
        {
            icon: Mail,
            title: "Email Us",
            details: [
                "info@bookstore.com",
                "support@bookstore.com",
                "orders@bookstore.com",
            ],
        },
        {
            icon: Clock,
            title: "Business Hours",
            details: [
                "Monday - Friday: 9:00 AM - 8:00 PM",
                "Saturday: 9:00 AM - 6:00 PM",
                "Sunday: 10:00 AM - 5:00 PM",
            ],
        },
    ];

    const faqItems = [
        {
            question: "How long does shipping take?",
            answer: "Standard shipping takes 3-5 business days within Vietnam. Express shipping is available for next-day delivery.",
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for books in original condition. Digital downloads are not eligible for returns.",
        },
        {
            question: "Do you offer international shipping?",
            answer: "Yes, we ship worldwide. International shipping typically takes 7-14 business days depending on the destination.",
        },
        {
            question: "Can I track my order?",
            answer: "Absolutely! Once your order ships, you'll receive a tracking number via email to monitor your package.",
        },
    ];

    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
                <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Get In Touch
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-green-100">
                            We&apos;d love to hear from you. Send us a message
                            and we&apos;ll respond as soon as possible.
                        </p>
                        <div className="flex items-center justify-center space-x-2">
                            <MessageCircle className="h-6 w-6" />
                            <span className="text-lg">
                                Available 24/7 for your questions
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Send className="h-6 w-6 text-blue-600" />
                                    <span>Send us a Message</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isSubmitted ? (
                                    <div className="text-center py-8">
                                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Message Sent Successfully!
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Thank you for contacting us.
                                            We&apos;ll get back to you within 24
                                            hours.
                                        </p>
                                        <Button
                                            onClick={() =>
                                                setIsSubmitted(false)
                                            }
                                            variant="outline"
                                        >
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="name">
                                                    Full Name *
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Your full name"
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">
                                                    Email Address *
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="your.email@example.com"
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="subject">
                                                Subject *
                                            </Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                type="text"
                                                required
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                placeholder="What is this regarding?"
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="message">
                                                Message *
                                            </Label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                required
                                                rows={5}
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                placeholder="Tell us how we can help you..."
                                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Contact Information
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                                {contactInfo.map((info, index) => (
                                    <Card key={index}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start space-x-4">
                                                <div className="bg-blue-100 p-3 rounded-lg">
                                                    <info.icon className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-2">
                                                        {info.title}
                                                    </h3>
                                                    {info.details.map(
                                                        (
                                                            detail,
                                                            detailIndex
                                                        ) => (
                                                            <p
                                                                key={
                                                                    detailIndex
                                                                }
                                                                className="text-gray-600 text-sm"
                                                            >
                                                                {detail}
                                                            </p>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                    <Separator className="mb-8" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {faqItems.map((faq, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {faq.question}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        {faq.answer}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-16">
                    <Separator className="mb-8" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Find Our Store
                    </h2>
                    <Card>
                        <CardContent className="p-0">
                            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">
                                        Interactive map would be integrated here
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        (Google Maps, Mapbox, etc.)
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Footer />
        </>
    );
}
