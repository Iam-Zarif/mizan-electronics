"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import ServiceCard from "@/components/services/ServiceCard";
import { useLandingServiceCatalog } from "@/components/home/ServiceCatalogProvider";
import {
  ApiEmptyState,
  ApiSkeletonBlock,
} from "@/components/shared/ApiState";

export default function TopServicesSection() {
  const [perView, setPerView] = useState(4);
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { t, locale } = useLanguage();
  const { data, isLoading, error } = useLandingServiceCatalog();
  const shouldShowSkeleton = isLoading || Boolean(error);

  const top = useMemo(() => (data?.services ?? []).slice(0, 8), [data]);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setPerView(1);
      else if (window.innerWidth < 1024) setPerView(3);
      else setPerView(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = useMemo(
    () => Math.max(0, Math.ceil(top.length - Math.ceil(perView))),
    [top.length, perView],
  );

  useEffect(() => {
    if (isDragging) return;
    const t = setInterval(() => setIndex((p) => (p >= maxIndex ? 0 : p + 1)), 5200);
    return () => clearInterval(t);
  }, [maxIndex, isDragging]);

  const translate = `translateX(-${(index * 100) / perView}%)`;
  const cardBasis = `${100 / perView}%`;

  return (
    <section className="py-8 lg:py-14" id="top-services">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xl lg:text-3xl font-semibold text-[#7b3dc8]">{t("sections.topTitle")}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIndex((p) => (p <= 0 ? maxIndex : p - 1))}
              className="rounded-full cursor-pointer border border-white/30 bg-white/70 p-2 shadow-sm backdrop-blur hover:border-[#6366f1]/60 dark:border-white/10 dark:bg-neutral-900"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setIndex((p) => (p >= maxIndex ? 0 : p + 1))}
              className="rounded-full cursor-pointer border border-white/30 bg-white/70 p-2 shadow-sm backdrop-blur hover:border-[#6366f1]/60 dark:border-white/10 dark:bg-neutral-900"
            >
              <ChevronRight size={18} />
            </button>
            <Link
              href="#all-services"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#2160ba] px-3 py-1.5 rounded-full border border-[#2160ba]/30 hover:border-[#2160ba] hover:bg-[#2160ba]/5"
            >
              {t("sections.allShowMore")}
            </Link>
          </div>
        </div>

        {shouldShowSkeleton ? <ApiSkeletonBlock rows={3} /> : null}
        {!shouldShowSkeleton && top.length === 0 ? (
          <ApiEmptyState
            title={locale === "en" ? "No services found" : "কোনো সার্ভিস পাওয়া যায়নি"}
            description={
              locale === "en"
                ? "Top services will appear here once the service catalog is available."
                : "সার্ভিস ক্যাটালগ তৈরি হলে টপ সার্ভিস এখানে দেখা যাবে।"
            }
          />
        ) : null}
        {!shouldShowSkeleton && top.length > 0 ? (
        <div className="relative overflow-hidden ">
          <motion.div
            className="flex transition-transform duration-500 gap-2"
            style={{ transform: translate }}
            drag="x"
            dragConstraints={{ left: -300, right: 300 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(_, info) => {
              setIsDragging(false);
              if (info.offset.x < -50) setIndex((p) => (p >= maxIndex ? 0 : p + 1));
              if (info.offset.x > 50) setIndex((p) => (p <= 0 ? maxIndex : p - 1));
            }}
          >
            {top.map((service) => {
              const title = locale === "en" ? service.titleEn : service.title;
              const summary = locale === "en" ? service.summaryEn : service.summary;
              const categoryName =
                data?.categories.find((c) => c.id === service.categoryId)?.name ?? "";
              return (
              <div
                key={service._id}
                className="cursor-pointer px-2"
                style={{ flex: `0 0 ${cardBasis}` }}
              >
                <ServiceCard
                  service={service}
                  title={title}
                  summary={summary}
                  categoryName={categoryName}
                  imageHeightClass="h-52"
                  className="h-full border-white/20 shadow-sm"
                />
              </div>
            );
            })}
          </motion.div>
        </div>
        ) : null}
      </div>
    </section>
  );
}
