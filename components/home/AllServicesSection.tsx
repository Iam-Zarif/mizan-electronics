"use client";

import { serviceEnText, serviceItems } from "@/lib/services";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";
import { useLanguage } from "@/lib/i18n";

export default function AllServicesSection() {
  const { t, locale } = useLanguage();
  const whatsappBase = "https://wa.me/8801949397234?text=";
  const messengerBase = "https://www.facebook.com/messages/t/61583720444800?message=";
  return (
    <section className="py-14" id="all-services">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#2160ba]">{t("sections.allTitle")}</p>
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">{t("sections.allTitle")}</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{t("sections.allSubtitle")}</p>
        </div>

        <div className="grid gap-2.5 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {serviceItems.slice(0, 8).map((service) => {
            const en = serviceEnText[service.slug];
            const title = locale === "en" && en ? en.title : service.title;
            const summary = locale === "en" && en ? en.summary : service.summary;
            const serviceLink = `https://mizan-electronics.vercel.app/services/${service.slug}`;
            const waText = encodeURIComponent(`${serviceLink}\nI want to book ${title}`);
            const msText = encodeURIComponent(`${serviceLink}\nI want to book ${title}`);
            return (
              <motion.div
                key={service.id}
                whileHover={{ y: -4 }}
                className="cursor-pointer rounded-3xl border border-white/20 bg-white shadow-[0_25px_60px_-40px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-neutral-900"
              >
                <div className="relative h-56 w-full overflow-hidden cursor-pointer">
                  <Image
                    src={service.images[0]}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#2160ba] shadow">
                    {service.price}
                  </span>
                </div>

                <div className="space-y-2 px-4 py-4">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {title}
                  </h3>

                  <p className="hidden sm:block text-sm text-neutral-600 dark:text-neutral-300">
                    {summary}
                  </p>

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
