"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

/**
 * The hero section of the homepage, which displays a title, a
 * descriptive paragraph, and a call-to-action button.
 */
const HeroSection = () => {
    const t = useTranslations("hero");

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-100 dark:bg-blue-900/20">
            {/* The content container */}
            <div className="flex flex-col items-center gap-4 text-center">
                {/* The heading and paragraph */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                        {t("title")}
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                        {t("subtitle")}
                    </p>
                </div>

                {/* The call-to-action button */}
                <div>
                    <Button asChild size="lg">
                        <Link href="/products">{t("shopNow")}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
