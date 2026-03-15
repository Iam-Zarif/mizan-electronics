"use client";

import { useEffect, useMemo, useState } from "react";
import { serviceEnText, serviceItems, serviceCategories } from "@/lib/services";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { GoArrowUpRight } from "react-icons/go";

export default function TopServicesSection() {
  const top = serviceItems.slice(0, 8);
  const [perView, setPerView] = useState(4);
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { t, locale } = useLanguage();
  const whatsappBase = "https://wa.me/8801949397234?text=";
  const messengerBase = "https://www.facebook.com/messages/t/61583720444800?message=";

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

  const maxIndex = useMemo(() => Math.max(0, Math.ceil(top.length - Math.ceil(perView))), [top.length, perView]);

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
              className="rounded-full border border-white/30 bg-white/70 p-2 shadow-sm backdrop-blur hover:border-[#6366f1]/60 dark:border-white/10 dark:bg-neutral-900"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setIndex((p) => (p >= maxIndex ? 0 : p + 1))}
              className="rounded-full border border-white/30 bg-white/70 p-2 shadow-sm backdrop-blur hover:border-[#6366f1]/60 dark:border-white/10 dark:bg-neutral-900"
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
              const en = serviceEnText[service.slug];
              const title = locale === "en" && en ? en.title : service.title;
              const summary = locale === "en" && en ? en.summary : service.summary;
              const categoryLink = `https://mizan-ac-servicing.vercel.app/services/category/${service.categoryId}`;
              const categoryName = serviceCategories.find((c) => c.id === service.categoryId)?.name ?? "";
              const waText = encodeURIComponent(
                `${categoryLink}\nক্যাটাগরি: ${categoryName}\nসার্ভিস: ${title}`
              );
              const msText = encodeURIComponent(
                `${categoryLink}\nক্যাটাগরি: ${categoryName}\nসার্ভিস: ${title}`
              );
              return (
              <div
                key={service.id}
                className="cursor-pointer px-2"
                style={{ flex: `0 0 ${cardBasis}` }}
              >
                <motion.div whileHover={{ y: -4 }} className="h-full overflow-hidden rounded-2xl border border-white/20 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900 cursor-pointer">
                  <div className="relative h-52 w-full">
                    <Image src={service.images[0]} alt={service.title} fill className="object-cover" />
                    <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#2160ba] shadow">{service.price}</div>
                  </div>
                  <div className="space-y-2 px-4 py-4">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">{title}</h3>
                    <p className="hidden sm:block text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">{summary}</p>
                    <div className="flex flex-col gap-2 pt-1">
                      <Link
                        href={`${messengerBase}${msText}`}
                        target="_blank"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#6366f1]/40 px-3 py-2 text-xs font-semibold text-[#6366f1] cursor-pointer"
                      >
                        মেসেঞ্জার (কুয়েরি)
                        <GoArrowUpRight className="text-base" />
                      </Link>
                      <Link
                        href={`${whatsappBase}${waText}`}
                        target="_blank"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-4 py-2 text-xs font-semibold text-white shadow cursor-pointer"
                      >
                        বুক করুন
                        <GoArrowUpRight className="text-base" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
