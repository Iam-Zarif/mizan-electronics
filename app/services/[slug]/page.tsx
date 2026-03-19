"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import ServiceBookingActions from "@/components/services/ServiceBookingActions";
import { ApiErrorState, ApiSkeletonBlock } from "@/components/shared/ApiState";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";
import { getPublicServiceCatalog } from "@/lib/dashboard-api";
import { useApiQuery } from "@/hooks/use-api-query";
import { useLanguage } from "@/lib/i18n";

type Props = { params: { slug: string } };

export default function ServiceDetail({ params }: Props) {
  const { locale } = useLanguage();
  const { data, isLoading, error, refresh } = useApiQuery(getPublicServiceCatalog, []);

  const service = data?.services.find((item) => item.slug === params.slug);
  const category = service
    ? data?.categories.find((item) => item.id === service.categoryId)
    : null;

  if (!isLoading && !error && data && !service) {
    return notFound();
  }

  return (
    <section className="relative pt-24 pb-14">
      <div className="mx-auto max-w-6xl px-4 space-y-8">
        {isLoading ? <ApiSkeletonBlock rows={3} /> : null}
        {!isLoading && error ? (
          <ApiErrorState
            title={locale === "en" ? "Service failed to load" : "সার্ভিস লোড হয়নি"}
            description={error}
            onRetry={() => void refresh()}
          />
        ) : null}

        {!isLoading && !error && service ? (
          <>
            <header className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#ec4899] via-[#6366f1] to-[#e18b94] px-4 py-1.5 text-sm font-semibold text-white shadow">
                {category ? (locale === "en" ? category.nameEn : category.name) : service.categoryId}
              </p>
              <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white md:text-4xl">
                {locale === "en" ? service.titleEn : service.title}
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 md:text-base">
                {locale === "en" ? service.summaryEn : service.summary}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-[#ecaa81]/20 px-3 py-1 text-xs font-semibold text-[#ecaa81]">
                  {service.price}
                </span>
                {category ? (
                  <div className="w-full max-w-sm">
                    <ServiceBookingActions
                      categoryId={service.categoryId}
                      categoryName={locale === "en" ? category.nameEn : category.name}
                      serviceTitle={locale === "en" ? service.titleEn : service.title}
                      serviceSlug={service.slug}
                      stacked={false}
                    />
                  </div>
                ) : null}
              </div>
            </header>

            <div className="grid items-start gap-6 md:grid-cols-[1.4fr,1fr]">
              <div className="space-y-4">
                <div className="relative h-72 w-full overflow-hidden rounded-2xl">
                  <Image
                    src={getOptimizedCloudinaryUrl(service.images[0], {
                      width: 1400,
                      crop: "fill",
                    })}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">
                    {locale === "en" ? "Service Process" : "সার্ভিস প্রসেস"}
                  </h3>
                  <ul className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                    {service.process.map((step) => (
                      <li key={step} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#6366f1]" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/80 p-4 shadow dark:bg-neutral-900/70">
                <h3 className="text-lg font-bold">
                  {locale === "en" ? "Why choose us" : "কেন আমাদের নিবেন"}
                </h3>
                <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <li>
                    {locale === "en"
                      ? "Licensed technicians"
                      : "লাইসেন্সধারী টেকনিশিয়ান"}
                  </li>
                  <li>
                    {locale === "en"
                      ? "Vacuum and pressure check included"
                      : "ভ্যাকুয়াম ও প্রেসার চেক অন্তর্ভুক্ত"}
                  </li>
                  <li>
                    {locale === "en"
                      ? "Transparent pricing and fast support"
                      : "স্বচ্ছ মূল্য ও দ্রুত সাপোর্ট"}
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
