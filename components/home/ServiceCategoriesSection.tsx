"use client";

import React from "react";
import { categoryEnLabels, serviceCategories } from "@/lib/services";
import { motion } from "motion/react";
import Image from "next/image";
import { Wrench, Plug, Snowflake, Cog, Hammer, Package } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  "cleaning-maintenance": Wrench,
  installation: Plug,
  gas: Snowflake,
  repair: Cog,
  shifting: Hammer,
  spares: Package,
};

export default function ServiceCategoriesSection() {
  const { t, locale } = useLanguage();
  return (
    <section className="relative py-14" id="categories">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#7b3dc8]">{t("sections.categoriesTitle")}</p>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">{t("sections.categoriesSubtitle")}</h2>
          </div>
        </div>

        <div className="grid gap-2.5 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {serviceCategories.map((cat) => {
            const Icon = iconMap[cat.id] ?? Wrench;
            return (
              <motion.a
                key={cat.id}
                href={`/services/category/${cat.id}`}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/70 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.35)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/70 cursor-pointer"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/25 to-transparent" />
                  <div className="absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-[#6366f1] shadow">
                    <Icon size={16} />
                    {locale === "en" ? categoryEnLabels[cat.id] ?? cat.name : cat.name}
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
