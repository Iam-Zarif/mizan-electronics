"use client";

import { useLanguage } from "@/lib/i18n";
import Image from "next/image";
import ServiceCard from "@/components/services/ServiceCard";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";
import type { PublicServiceCategory, PublicServiceItem } from "@/lib/dashboard-api";

type Props = {
  category: PublicServiceCategory;
  items: PublicServiceItem[];
};

export default function CategoryClient({ category, items }: Props) {
  const { locale } = useLanguage();
  const categoryTitle = locale === "en" ? category.nameEn : category.name;

  return (
    <section className="relative pt-24 pb-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr] items-center">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#ec4899] via-[#6366f1] to-[#e18b94] px-4 py-1.5 text-sm font-semibold text-white shadow">
              {categoryTitle}
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white">{categoryTitle}</h1>
            <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300">{category.description}</p>
          </div>

          <div className="relative h-64 w-full overflow-hidden rounded-2xl">
            <Image
              src={getOptimizedCloudinaryUrl(category.image, { width: 1200, crop: "fill" })}
              alt={category.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </div>

        <div className="grid gap-2.5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((service) => {
            const title = locale === "en" ? service.titleEn : service.title;
            const summary = locale === "en" ? service.summaryEn : service.summary;
            return (
              <ServiceCard
                key={service._id}
                service={service}
                title={title}
                summary={summary}
                categoryName={categoryTitle}
                imageHeightClass="h-48"
                className="bg-white/85 backdrop-blur dark:bg-neutral-900/70"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
