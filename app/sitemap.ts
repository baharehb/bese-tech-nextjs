import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://besetech.ca/",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
