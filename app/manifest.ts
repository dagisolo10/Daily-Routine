import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Strivin",
        short_name: "Strivin",
        description: "A personal routine progression app that tracks daily completions and builds long-term achievements",
        dir: "auto",
        lang: "en-US",
        scope: "/",
        start_url: "/",
        display: "standalone",
        theme_color: "#0f172a",
        orientation: "portrait",
        background_color: "#0f172a",
        categories: ["productivity", "lifestyle"],
        // icons: [
        //     { src: "/icons/icon512_maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        //     { src: "/icons/icon512_rounded.png", sizes: "512x512", type: "image/png", purpose: "any" },
        // ],
        icons: [
            { src: "/new/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "/new/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
        ],
    };
}
