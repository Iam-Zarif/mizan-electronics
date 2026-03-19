"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ReusableServiceCard from "@/components/services/ServiceCard";
import { ApiErrorState, ApiSkeletonBlock } from "@/components/shared/ApiState";
import {
  getPublicServiceCatalog,
  type PublicServiceCatalogResponse,
} from "@/lib/dashboard-api";
import { useApiQuery } from "@/hooks/use-api-query";
import { useLanguage } from "@/lib/i18n";

export default function ServicesPageClient({
  initialData = null,
}: {
  initialData?: PublicServiceCatalogResponse | null;
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"az" | "za" | "price-asc" | "price-desc">("az");
  const [category, setCategory] = useState<string>("all");
  const { locale } = useLanguage();
  const { data, isLoading, error, refresh } = useApiQuery(
    getPublicServiceCatalog,
    [],
    initialData === null,
    initialData,
  );

  const filtered = useMemo(() => {
    if (!data) return [];

    const term = search.toLowerCase();
    const parsePrice = (price: string) => {
      const nums = [...price.matchAll(/\d+/g)].map((n) => Number(n[0]));
      if (!nums.length) return 0;
      return nums.reduce((a, b) => a + b, 0) / nums.length;
    };

    const list = data.services.filter((service) => {
      if (category !== "all" && service.categoryId !== category) return false;
      const haystack = [
        service.title,
        service.summary,
        service.titleEn,
        service.summaryEn,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });

    return list.sort((a, b) => {
      if (sort === "price-asc" || sort === "price-desc") {
        const diff = parsePrice(a.price) - parsePrice(b.price);
        return sort === "price-asc" ? diff : -diff;
      }

      const aTitle = locale === "en" ? a.titleEn : a.title;
      const bTitle = locale === "en" ? b.titleEn : b.title;
      return sort === "az" ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
    });
  }, [category, data, locale, search, sort]);

  return (
    <section className="relative pt-24 pb-14">
      <div className="mx-auto max-w-7xl px-4 space-y-10">
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-white lg:text-3xl">
              {locale === "en" ? "All Services" : "সব সার্ভিস"}
            </h1>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/80 px-3 py-2 shadow dark:bg-neutral-900/70">
                <Search size={16} className="text-neutral-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    locale === "en"
                      ? "Search in Bangla or English..."
                      : "বাংলা বা ইংরেজিতে সার্চ করুন..."
                  }
                  className="w-48 bg-transparent text-sm outline-none sm:w-72"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-sm shadow dark:bg-neutral-900/70"
              >
                <option value="all">{locale === "en" ? "All categories" : "সকল ক্যাটাগরি"}</option>
                {(data?.categories ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {locale === "en" ? item.nameEn : item.name}
                  </option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-sm shadow dark:bg-neutral-900/70"
              >
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
                <option value="price-asc">
                  {locale === "en" ? "Price: low to high" : "মূল্য: কম থেকে বেশি"}
                </option>
                <option value="price-desc">
                  {locale === "en" ? "Price: high to low" : "মূল্য: বেশি থেকে কম"}
                </option>
              </select>
            </div>
          </div>

          {isLoading ? <ApiSkeletonBlock rows={4} /> : null}
          {!isLoading && error ? (
            <ApiErrorState
              title={locale === "en" ? "Services failed to load" : "সার্ভিস লোড হয়নি"}
              description={error}
              onRetry={() => void refresh()}
            />
          ) : null}

          {!isLoading && !error ? (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((service, index) => {
                const categoryName =
                  data?.categories.find((item) => item.id === service.categoryId)?.[
                    locale === "en" ? "nameEn" : "name"
                  ] ?? "";

                return (
                  <ReusableServiceCard
                    key={service._id}
                    service={service}
                    title={locale === "en" ? service.titleEn : service.title}
                    summary={locale === "en" ? service.summaryEn : service.summary}
                    categoryName={categoryName}
                    showProcess
                    imagePriority={index < 4}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
