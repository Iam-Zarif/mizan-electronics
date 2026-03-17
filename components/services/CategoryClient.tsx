"use client";

import { categoryEnLabels, serviceEnText, type ServiceCategory, type ServiceItem } from "@/lib/services";
import { useLanguage } from "@/lib/i18n";
import Image from "next/image";
import ServiceCard from "@/components/services/ServiceCard";

type Props = {
  category: ServiceCategory;
  items: ServiceItem[];
};

export default function CategoryClient({ category, items }: Props) {
  const { locale } = useLanguage();
  const categoryTitle = locale === "en" ? categoryEnLabels[category.id] ?? category.name : category.name;

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
            <Image src={category.image} alt={category.name} fill className="object-cover" />
          </div>
        </div>

        <div className="grid gap-2.5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((service) => {
            const en = serviceEnText[service.slug];
            const title = locale === "en" && en ? en.title : service.title;
            const summary = locale === "en" && en ? en.summary : service.summary;
            return (
              <ServiceCard
                key={service.id}
                service={service}
                title={title}
                summary={summary}
                categoryName={category.name}
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
