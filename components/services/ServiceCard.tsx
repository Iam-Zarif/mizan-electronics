"use client";

import Image from "next/image";
import { motion } from "motion/react";
import ServiceBookingActions from "@/components/services/ServiceBookingActions";

export type ServiceCardItem = {
  id: string;
  categoryId: string;
  title: string;
  summary: string;
  price: string;
  slug: string;
  images: string[];
  process: string[];
};

type Props = {
  service: ServiceCardItem;
  title: string;
  summary: string;
  categoryName: string;
  imageHeightClass?: string;
  showProcess?: boolean;
  summaryHiddenOnMobile?: boolean;
  className?: string;
};

export default function ServiceCard({
  service,
  title,
  summary,
  categoryName,
  imageHeightClass = "h-56",
  showProcess = false,
  summaryHiddenOnMobile = true,
  className = "",
}: Props) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`cursor-pointer rounded-3xl border border-white/15 bg-white shadow-[0_25px_60px_-40px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-neutral-900 ${className}`}
    >
      <div className={`relative w-full overflow-hidden rounded-t-3xl ${imageHeightClass}`}>
        <Image src={service.images[0]} alt={service.title} fill className="object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#2160ba] shadow">
          {service.price}
        </span>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-lg font-bold text-neutral-900 dark:text-white">{title}</h4>
            <p
              className={`${summaryHiddenOnMobile ? "hidden sm:block" : "block"} mt-1 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2`}
            >
              {summary}
            </p>
          </div>
        </div>

        {showProcess ? (
          <div className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-300">
            {service.process.slice(0, 3).map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ec4899]" />
                {step}
              </div>
            ))}
          </div>
        ) : null}

        <ServiceBookingActions
          categoryId={service.categoryId}
          categoryName={categoryName}
          serviceTitle={title}
          serviceSlug={service.slug}
        />
      </div>
    </motion.div>
  );
}
