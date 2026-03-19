import type { MetadataRoute } from "next";
import { API_BASE_URL } from "@/lib/api";

const BASE_URL = "https://mizan-ac-servicing.vercel.app";

type CatalogResponse = {
  categories: Array<{ id: string }>;
  services: Array<{ slug: string; id: string }>;
};

const getCatalog = async (): Promise<CatalogResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/catalog`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as { data?: CatalogResponse };
    return payload.data ?? null;
  } catch {
    return null;
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const catalog = await getCatalog();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/auth/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/auth/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  if (!catalog) return staticRoutes;

  const categoryRoutes: MetadataRoute.Sitemap = catalog.categories.map((category) => ({
    url: `${BASE_URL}/services/category/${category.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = catalog.services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...serviceRoutes];
}
