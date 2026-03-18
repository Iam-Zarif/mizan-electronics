"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import ServiceCard from "@/components/services/ServiceCard";
import { useLandingServiceCatalog } from "@/components/home/ServiceCatalogProvider";
import {
  ApiEmptyState,
  ApiSkeletonBlock,
} from "@/components/shared/ApiState";

export default function AllServicesSection() {
  const { t, locale } = useLanguage();
  const { data, isLoading, error } = useLandingServiceCatalog();
  const items = (data?.services ?? []).slice(0, 8);
  const shouldShowSkeleton = isLoading || Boolean(error);

  return (
    <section className="py-8 lg:py-14" id="all-services">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6">
          <p className="text-xl lg:text-3xl font-semibold text-[#7b3dc8]">{t("sections.allTitle")}</p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{t("sections.allSubtitle")}</p>
        </div>

        {shouldShowSkeleton ? <ApiSkeletonBlock rows={4} /> : null}
        {!shouldShowSkeleton && items.length === 0 ? (
          <ApiEmptyState
            title={locale === "en" ? "No services found" : "কোনো সার্ভিস পাওয়া যায়নি"}
            description={
              locale === "en"
                ? "Services will appear here once the service catalog is available."
                : "সার্ভিস ক্যাটালগ তৈরি হলে সার্ভিস এখানে দেখা যাবে।"
            }
          />
        ) : null}
        {!shouldShowSkeleton && items.length > 0 ? (
          <div className="grid gap-2.5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((service) => {
              const title = locale === "en" ? service.titleEn : service.title;
              const summary = locale === "en" ? service.summaryEn : service.summary;
              const categoryName =
                data?.categories.find((c) => c.id === service.categoryId)?.name ?? "";
              return (
                <ServiceCard
                  key={service._id}
                  service={service}
                  title={title}
                  summary={summary}
                  categoryName={categoryName}
                  className="border-white/20"
                />
              );
            })}
          </div>
        ) : null}

        <div className="mt-6 flex justify-center">
          <Link
            href="/services"
            className="cursor-pointer rounded-full bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-5 py-2 text-sm font-semibold text-white shadow"
          >
            {t("sections.allShowMore")}
          </Link>
        </div>
      </div>
    </section>
  );
}
