import type { MetadataRoute } from "next";
import { OFFICIAL_CATEGORIES } from "@/types/offer";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://garimpeirodoprecinho.com.br";

  const lastMod = "2026-10-15T00:00:00.000Z";

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: lastMod,
      changeFrequency: "hourly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cupons`,
      lastModified: lastMod,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: lastMod,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  const categoryRoutes = OFFICIAL_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/categorias/${cat.slug}`,
    lastModified: lastMod,
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes];
}
