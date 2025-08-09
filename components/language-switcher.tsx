"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();

    const toggleLanguage = () => {
        const newLocale = currentLocale === "en" ? "vi" : "en";

        // Remove current locale from pathname if it exists
        let newPathname = pathname;
        if (pathname.startsWith(`/${currentLocale}`)) {
            newPathname = pathname.slice(`/${currentLocale}`.length) || "/";
        }

        // Add new locale prefix - both locales get explicit paths
        const finalPath = `/${newLocale}${
            newPathname === "/" ? "" : newPathname
        }`;

        router.push(finalPath);
    };

    console.log({ currentLocale, pathname });

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            title={currentLocale === "en" ? "Tiếng Việt" : "English"}
        >
            <Languages className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle language</span>
        </Button>
    );
}
