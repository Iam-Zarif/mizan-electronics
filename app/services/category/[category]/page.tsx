"use client";

import { notFound } from "next/navigation";
import CategoryClient from "@/components/services/CategoryClient";
import { ApiErrorState, ApiSkeletonBlock } from "@/components/shared/ApiState";
import { getPublicServiceCatalog } from "@/lib/dashboard-api";
import { useApiQuery } from "@/hooks/use-api-query";
import { useLanguage } from "@/lib/i18n";

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { locale } = useLanguage();
  const { data, isLoading, error, refresh } = useApiQuery(getPublicServiceCatalog, []);

  const category = data?.categories.find((item) => item.id === params.category);
  const items = data?.services.filter((item) => item.categoryId === params.category) ?? [];

  if (!isLoading && !error && data && !category) {
    return notFound();
  }

  return (
    <>
      {isLoading ? <ApiSkeletonBlock rows={4} /> : null}
      {!isLoading && error ? (
        <section className="relative pt-24 pb-14">
          <div className="mx-auto max-w-7xl px-4">
            <ApiErrorState
              title={locale === "en" ? "Category failed to load" : "ক্যাটাগরি লোড হয়নি"}
              description={error}
              onRetry={() => void refresh()}
            />
          </div>
        </section>
      ) : null}
      {!isLoading && !error && category ? <CategoryClient category={category} items={items} /> : null}
    </>
  );
}
