"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/lib/i18n";
import { useApiQuery } from "@/hooks/use-api-query";
import { getPublicReviews, type PublicReviewsResponse } from "@/lib/dashboard-api";

const clients = [
  "/brands/walton.png",
  "/brands/gree.webp",
  "/brands/lg.png",
  "/brands/singer.png",
  "/brands/haier.png",
];

export default function TestimonialsClients({
  initialData = null,
}: {
  initialData?: PublicReviewsResponse | null;
}) {
  const { t, locale } = useLanguage();
  const [index, setIndex] = useState(0);
  const { data } = useApiQuery(getPublicReviews, [], initialData === null, initialData);
  const testimonialData = data?.rows ?? [];
  const viewportWidth = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => undefined;
      }

      window.addEventListener("resize", onStoreChange);
      return () => window.removeEventListener("resize", onStoreChange);
    },
    () => (typeof window === "undefined" ? 1280 : window.innerWidth),
    () => 1280,
  );
  const perView = viewportWidth < 640 ? 1 : viewportWidth < 1024 ? 2 : 3;
  const safeIndex =
    testimonialData.length > 0 ? index % testimonialData.length : 0;

  useEffect(() => {
    if (!testimonialData.length) return;
    const t = setInterval(() => {
      setIndex((p) => (p + perView) % testimonialData.length);
    }, 4800);
    return () => clearInterval(t);
  }, [perView, testimonialData.length]);

  if (testimonialData.length === 0) {
    return null;
  }

  const visible = Array.from({ length: perView }).map(
    (_, i) => testimonialData[(safeIndex + i) % testimonialData.length],
  );

  const totalTabs = Math.ceil(testimonialData.length / perView);
  const activeTab = Math.floor(safeIndex / perView);

  return (
    <section className="relative py-14 overflow-hidden">
      <motion.div
        className="absolute -z-10 left-[-25%] top-[10%] h-[32.5rem] w-[32.5rem] rounded-full bg-indigo-500/20 blur-[160px]"
        animate={{ x: [0, 120, 0], y: [0, -80, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute -z-10 right-[-25%] bottom-[0%] h-[32.5rem] w-[32.5rem] rounded-full bg-[#e18b94]/20 blur-[160px]"
        animate={{ x: [0, -120, 0], y: [0, 80, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-4 py-1.5 text-sm font-medium text-white shadow-lg">
            <Quote className="h-4 w-4" />
            {t("sections.testimonialsTitle")}
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold">
            {t("sections.testimonialsSubtitle")}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={safeIndex}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid gap-2.5 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center"
          >
            {visible.map((t, i) => {
              const comment = locale === "en" && t.messageEn ? t.messageEn : t.messageBn;
              const location = locale === "en" && t.customerLocationEn ? t.customerLocationEn : t.customerLocationBn;
              return (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="
                  relative rounded-3xl p-8
                  bg-white/70 dark:bg-neutral-900/50
                  backdrop-blur-xl
                  border border-black/5 dark:border-white/10
                  shadow-[0_25px_70px_-35px_rgba(0,0,0,0.35)]
                "
              >
                <Quote className="absolute right-6 top-6 h-7 w-7 text-indigo-500/20" />

                <div className="mb-5 flex items-center gap-5">
                  <div className="relative h-16 w-16 rounded-full bg-linear-to-br from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] p-0.5 overflow-hidden">
                    {t.avatarUrl ? (
                      <Image
                        src={t.avatarUrl}
                        alt={t.customerName}
                        fill
                        className="rounded-full object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-bold text-[#2160ba]">
                        {t.customerName.slice(0, 2)}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xl font-bold">{t.customerName}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{location}</p>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400" />
                  ))}
                  <span className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    {t.rating}
                  </span>
                </div>

                <p className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  “{comment}”
                </p>
              </motion.div>
            );
            })}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalTabs }).map((_, i) => {
            const active =
              i === activeTab &&
              (i % 3 === 0
                ? "bg-pink-500 shadow-[0_0_16px_rgba(236,72,153,0.9)]"
                : i % 3 === 1
                ? "bg-indigo-500 shadow-[0_0_16px_rgba(99,102,241,0.9)]"
                : "bg-[#e18b94] shadow-[0_0_16px_rgba(225,139,148,0.9)]");

            return (
              <div
                key={i}
                className={`
                  h-1.5 rounded-full transition-all duration-500
                  ${i === activeTab ? "w-10" : "w-5 bg-neutral-400/40"}
                  ${active ?? ""}
                `}
              />
            );
          })}
        </div>

        <div className="mt-20">
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
            {locale === "en" ? "Trusted by leading brands" : "বিশ্বস্ত ব্র্যান্ডের আস্থা"}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-10 opacity-80">
            {clients.map((logo, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08 }}
                className="relative h-10 w-28 grayscale transition hover:grayscale-0"
              >
                <Image
                  src={logo}
                  alt="Client Logo"
                  fill
                  sizes="112px"
                  className="object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
