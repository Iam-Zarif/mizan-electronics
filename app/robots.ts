import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/auth/", "/profile/"],
    },
    sitemap: "https://mizan-ac-servicing.vercel.app/sitemap.xml",
    host: "https://mizan-ac-servicing.vercel.app",
  };
}
