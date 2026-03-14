"use client";

import { useEffect, useState } from "react";
import { serviceItems } from "@/lib/services";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default function TopServicesSection() {
  const top = serviceItems.slice(0, 3);

  return (
    <section className="py-14" id="top-services">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#2160ba]">সর্বাধিক বুকড সার্ভিস</p>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">আমাদের জনপ্রিয় এসি সার্ভিসগুলো</h2>
          </div>

          <Link
            href="#all-services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2160ba] hover:underline"
          >
            সব সার্ভিস দেখুন
            <ArrowRightCircle size={18} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {top.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -6 }}
              className="rounded-3xl border border-white/20 bg-white/80 p-4 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.35)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/70"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-2xl">
                <Image src={service.images[0]} alt={service.title} fill className="object-cover" />
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{service.title}</h3>
                  <span className="rounded-full bg-[#2160ba]/10 px-3 py-1 text-xs font-semibold text-[#2160ba]">
                    {service.price}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">{service.summary}</p>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#7b3dc8] hover:underline"
                >
                  বিস্তারিত
                  <ArrowRightCircle size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
