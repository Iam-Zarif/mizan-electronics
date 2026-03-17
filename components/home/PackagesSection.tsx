"use client";

import { motion } from "motion/react";
import ServiceBookingActions from "@/components/services/ServiceBookingActions";
import { serviceCategories } from "@/lib/services";

const packages = [
  {
    title: "ডিপ ক্লিন + গ্যাস টপ-আপ",
    price: "৳ ৩,৫০০ - ৪,২০০",
    includes: ["ইনডোর/আউটডোর জেট ওয়াশ", "ড্রেন স্যানিটাইজ", "গ্যাস প্রেসার টিউন"],
    categoryId: "cleaning-maintenance",
  },
  {
    title: "ইনস্টলেশন + ফার্স্ট চেকআপ",
    price: "৳ ৫,৫০০ - ৬,৫০০",
    includes: ["স্প্লিট ইনস্টলেশন", "ভ্যাকুয়াম + লিক টেস্ট", "৩০ দিনের ভিতর ফ্রি চেকআপ"],
    categoryId: "installation",
  },
  {
    title: "শিফটিং প্যাক",
    price: "৳ ৪,৫০০ - ৫,৫০০",
    includes: ["ডিসম্যান্টল + ট্রান্সপোর্ট", "রিইনস্টল", "বেসিক ক্লিন"],
    categoryId: "shifting",
  },
  {
    title: "রিপেয়ার + স্পেয়ার চেক",
    price: "৳ ৩,২০০ - ৪,৮০০",
    includes: ["কুলিং/ওয়াটার লিক ডায়াগনস্টিক", "পার্টস কস্ট এস্টিমেট", "বেসিক টিউন-আপ"],
    categoryId: "repair",
  },
  {
    title: "ইনস্টল + ডিপ ক্লিন বান্ডল",
    price: "৳ ৭,৮০০ - ৯,২০০",
    includes: ["স্প্লিট ইনস্টলেশন", "ডিপ ক্লিন (৩০ দিনের ভিতর)", "ভ্যাকুয়াম + লিক টেস্ট"],
    categoryId: "installation",
  },
];

export default function PackagesSection() {
  return (
    <section className="py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xl lg:text-3xl font-semibold text-[#7b3dc8]">কম্বো প্যাকেজ</p>
            <h2 className="text-base lg:text-lg font-medium text-neutral-700 dark:text-neutral-300">বেশি সেভিংস, একবারেই সমাধান</h2>
          </div>
        </div>

        <div className="grid gap-2.5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pack) => (
            <motion.div
              key={pack.title}
              whileHover={{ y: -4 }}
              className="relative flex h-full flex-col rounded-3xl border border-white/15 bg-white/85 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.35)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/70 p-6 space-y-4 overflow-hidden"
            >
              <span className="absolute right-0 top-0  rounded-xl bg-[#ecaa81] px-4 py-1 text-xs font-bold text-white shadow">
                {pack.price}
              </span>

              <h3 className="text-xl font-bold">{pack.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">বেশি সার্ভিস এক প্যাকে</p>

              <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300 flex-1">
                {pack.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#6366f1]" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <ServiceBookingActions
                  categoryId={pack.categoryId}
                  categoryName={
                    serviceCategories.find((item) => item.id === pack.categoryId)
                      ?.name ?? pack.title
                  }
                  serviceTitle={pack.title}
                  stacked={false}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
