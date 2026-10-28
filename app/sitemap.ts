import type { MetadataRoute } from "next";

const baseUrl = "https://kandidluxury.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${baseUrl}/images/pearl.png`],
    },
  ];
}
