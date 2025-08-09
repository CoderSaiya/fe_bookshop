import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    images: {
        // domains: ["via.placeholder.com", "placehold.co"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
                pathname: "/photo-**",
            },
            {
                protocol: "https",
                hostname: "tse1.mm.bing.net",
                port: "",
                pathname: "/th/**",
            },
            {
                protocol: "https",
                hostname: "tse2.mm.bing.net",
                port: "",
                pathname: "/th/**",
            },
            {
                protocol: "https",
                hostname: "tse3.mm.bing.net",
                port: "",
                pathname: "/th/**",
            },
            {
                protocol: "https",
                hostname: "th.bing.com",
                port: "",
                pathname: "/th/**",
            },
            {
                protocol: "https",
                hostname: "bloody-disgusting.com",
                port: "",
                pathname: "/wp-content/**",
            },
        ],
    },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
export default withNextIntl(nextConfig);
