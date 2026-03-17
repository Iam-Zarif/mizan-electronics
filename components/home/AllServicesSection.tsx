"use client";

import { serviceEnText, serviceItems, serviceCategories } from "@/lib/services";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import ServiceCard from "@/components/services/ServiceCard";

export default function AllServicesSection() {
  const { t, locale } = useLanguage();
  return (
    <section className="py-8 lg:py-14" id="all-services">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6">
          <p className="text-xl lg:text-3xl font-semibold text-[#7b3dc8]">{t("sections.allTitle")}</p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{t("sections.allSubtitle")}</p>
        </div>

        <div className="grid gap-2.5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {serviceItems.slice(0, 8).map((service) => {
            const en = serviceEnText[service.slug];
            const title = locale === "en" && en ? en.title : service.title;
            const summary = locale === "en" && en ? en.summary : service.summary;
            const categoryName = serviceCategories.find((c) => c.id === service.categoryId)?.name ?? "";
            return (
              <ServiceCard
                key={service.id}
                service={service}
                title={title}
                summary={summary}
                categoryName={categoryName}
                className="border-white/20"
              />
            );
          })}
        </div>

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
