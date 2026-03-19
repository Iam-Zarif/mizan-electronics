"use client";

import CategoryClient from "@/components/services/CategoryClient";
import { ApiErrorState, ApiSkeletonBlock } from "@/components/shared/ApiState";
import {
  getPublicServiceCatalog,
  type PublicServiceCatalogResponse,
} from "@/lib/dashboard-api";
import { useApiQuery } from "@/hooks/use-api-query";
import { useLanguage } from "@/lib/i18n";

export default function CategoryPageClient({
  categoryId,
  initialData = null,
}: {
  categoryId: string;
  initialData?: PublicServiceCatalogResponse | null;
}) {
  const { locale } = useLanguage();
  const { data, isLoading, error, refresh } = useApiQuery(
    getPublicServiceCatalog,
    [],
    initialData === null,
    initialData,
  );

  const category = data?.categories.find((item) => item.id === categoryId);
  const items = data?.services.filter((item) => item.categoryId === categoryId) ?? [];

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
