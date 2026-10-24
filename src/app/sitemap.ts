import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/accessibility`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
