import type { MetadataRoute } from "next";

const baseUrl = "https://kandidluxury.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/login/", "/test/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
