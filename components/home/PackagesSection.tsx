"use client";

import { motion } from "motion/react";
import { ApiEmptyState, ApiSkeletonBlock } from "@/components/shared/ApiState";
import { useApiQuery } from "@/hooks/use-api-query";
import { getLandingPackages, type PublicPackagesResponse } from "@/lib/dashboard-api";
import { useLanguage } from "@/lib/i18n";
import PackageBookingActions from "@/components/home/PackageBookingActions";

export default function PackagesSection({
  initialData = null,
}: {
  initialData?: PublicPackagesResponse | null;
}) {
  const { locale } = useLanguage();
  const { data, isLoading, error } = useApiQuery(
    getLandingPackages,
    [],
    initialData === null,
    initialData,
  );
  const shouldShowSkeleton = isLoading || Boolean(error);

  return (
    <section className="py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xl lg:text-3xl font-semibold text-[#7b3dc8]">কম্বো প্যাকেজ</p>
            <h2 className="text-base lg:text-lg font-medium text-neutral-700 dark:text-neutral-300">বেশি সেভিংস, একবারেই সমাধান</h2>
          </div>
        </div>

        {shouldShowSkeleton ? <ApiSkeletonBlock rows={3} /> : null}
        {!shouldShowSkeleton && (!data || data.rows.length === 0) ? (
          <ApiEmptyState
            title={locale === "en" ? "No packages available" : "কোনো প্যাকেজ নেই"}
            description={
              locale === "en"
                ? "Combo packages will appear here once admin adds them."
                : "অ্যাডমিন কম্বো প্যাকেজ যোগ করলে এখানে দেখা যাবে।"
            }
          />
        ) : null}
        {!shouldShowSkeleton && data?.rows.length ? (
          <div className="grid gap-2.5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {data.rows.map((pack) => (
              <motion.div
                key={pack._id}
                whileHover={{ y: -4 }}
                className="relative flex h-full flex-col rounded-3xl border border-white/15 bg-white/85 p-6 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.35)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/70"
              >
                <span className="absolute right-0 top-0 rounded-xl bg-[#9f4b16] px-4 py-1 text-xs font-bold text-white shadow">
                  {pack.price}
                </span>

                <h3 className="pr-18 text-xl font-bold">
                  {locale === "en" ? pack.titleEn : pack.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                  {locale === "en" ? pack.summaryEn : pack.summary}
                </p>

                <ul className="mt-4 flex-1 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                  {(locale === "en" ? pack.includesEn : pack.includes).map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#6366f1]" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <PackageBookingActions
                    packageId={pack._id}
                    packageTitle={locale === "en" ? pack.titleEn : pack.title}
                    categoryName={locale === "en" ? pack.categoryNameEn : pack.categoryName}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
