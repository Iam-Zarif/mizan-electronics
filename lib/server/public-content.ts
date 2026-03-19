import { cache } from "react";
import type {
  PublicPackagesResponse,
  PublicReviewsResponse,
  PublicServiceCatalogResponse,
} from "@/lib/dashboard-api";

const SITE_URL = "https://mizan-ac-servicing.vercel.app";

const normalizeApiBaseUrl = (value?: string) => {
  const fallback = "https://mizan-electronics-backend.vercel.app/api";
  if (!value) return fallback;

  const trimmed = value.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

const fetchPublicData = async <T>(path: string, revalidate = 600): Promise<T | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { data?: T };
    return payload.data ?? null;
  } catch {
    return null;
  }
};

export const getSiteUrl = () => SITE_URL;

export const getServerPublicServiceCatalog = cache(async () => {
  return fetchPublicData<PublicServiceCatalogResponse>("/services/catalog");
});

export const getServerLandingPackages = cache(async () => {
  return fetchPublicData<PublicPackagesResponse>("/services/packages");
});

export const getServerPublicReviews = cache(async () => {
  return fetchPublicData<PublicReviewsResponse>("/services/reviews");
});
