"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

/**
 * Footer component.
 *
 * This component renders the footer of the application.
 *
 * @returns {JSX.Element}
 */
function Footer() {
    const t = useTranslations("footer");

    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-8 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company */}
                    <div>
                        <h3 className="font-semibold mb-4">{t("company")}</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/about"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {t("about")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/careers"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {t("careers")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/press"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {t("press")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold mb-4">{t("support")}</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/help"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {t("help")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {t("faq")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {t("contact")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold mb-4">{t("legal")}</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {t("privacy")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {t("terms")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold mb-4">
                            {t("newsletter")}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {t("subscribe")}
                        </p>
                    </div>
                </div>

                <div className="border-t mt-8 pt-6">
                    <p className="text-center text-sm text-muted-foreground">
                        &copy; 2025 Store. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
