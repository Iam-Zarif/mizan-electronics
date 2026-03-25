"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useLanguage } from "@/lib/i18n";
import ServiceCard from "@/components/services/ServiceCard";
import { useLandingServiceCatalog } from "@/components/home/ServiceCatalogProvider";
import { ApiEmptyState, ApiSkeletonBlock } from "@/components/shared/ApiState";

export default function TopServicesSection() {
  const { t, locale } = useLanguage();
  const { data, isLoading, error } = useLandingServiceCatalog();
  const shouldShowSkeleton = isLoading || Boolean(error);
  const top = useMemo(() => (data?.services ?? []).slice(0, 8), [data]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: top.length > 4,
    dragFree: false,
    skipSnaps: false,
  });

  const updateSelected = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateSelected);
    emblaApi.on("reInit", updateSelected);
    return () => {
      emblaApi.off("select", updateSelected);
      emblaApi.off("reInit", updateSelected);
    };
  }, [emblaApi, updateSelected]);

  useEffect(() => {
    if (!emblaApi || top.length <= 1) return;
    const timer = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 5200);
    return () => window.clearInterval(timer);
  }, [emblaApi, top.length]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const snapCount = emblaApi?.scrollSnapList().length ?? 0;

  return (
    <section className="py-8 lg:py-14" id="top-services">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xl font-semibold text-[#7b3dc8] lg:text-3xl">{t("sections.topTitle")}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollPrev}
              className="rounded-full border border-white/30 bg-white/70 p-2 shadow-sm backdrop-blur hover:border-[#6366f1]/60 dark:border-white/10 dark:bg-neutral-900"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="rounded-full border border-white/30 bg-white/70 p-2 shadow-sm backdrop-blur hover:border-[#6366f1]/60 dark:border-white/10 dark:bg-neutral-900"
            >
              <ChevronRight size={18} />
            </button>
            <Link
              href="#all-services"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#2160ba]/30 px-3 py-1.5 text-sm font-semibold text-[#2160ba] hover:border-[#2160ba] hover:bg-[#2160ba]/5"
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
          <div className="space-y-4">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex touch-pan-y -ml-4">
                {top.map((service) => {
                  const title = locale === "en" ? service.titleEn : service.title;
                  const summary = locale === "en" ? service.summaryEn : service.summary;
                  const categoryName =
                    data?.categories.find((category) => category.id === service.categoryId)?.name ?? "";

                  return (
                    <div
                      key={service._id}
                      className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_25%]"
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
              </div>
            </div>

            {snapCount > 1 ? (
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: snapCount }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      selectedIndex === index
                        ? "w-8 bg-[#2160ba]"
                        : "w-2.5 bg-[#cbd5e1] dark:bg-white/20"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
