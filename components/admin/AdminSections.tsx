"use client";

import { useMemo, type ReactNode } from "react";
import { LayoutDashboard } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { quickAlerts, topCards } from "@/lib/admin-dashboard";
import type { DashboardOverview } from "@/lib/dashboard-api";

export function AdminSurface({ children }: { children: ReactNode }) {
  return <div className="rounded-[28px] dark:bg-[#101729]">{children}</div>;
}

export function AdminPageHeader({
  titleBn,
  titleEn,
}: {
  titleBn: string;
  titleEn: string;
}) {
  const { locale } = useLanguage();

  return (
    <div className="mb-5">
      <h2 className="mt-2 text-3xl font-extrabold text-[#1f2638] dark:text-white">
        {locale === "en" ? titleEn : titleBn}
      </h2>
    </div>
  );
}

export function AlertWidgets({ overview }: { overview: DashboardOverview }) {
  const { locale } = useLanguage();
  const toneClasses = {
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-800",
  } as const;

  const counts = {
    terminate: overview.quickAlerts.expiresIn24h,
    "invoice-links": overview.quickAlerts.invoiceLinksReady,
  };

  return (
    <div className="flex flex-wrap gap-4">
      {quickAlerts.map((alert) => {
        const Icon = alert.icon;
        return (
          <div
            key={alert.key}
            className={`min-h-[148px] w-full max-w-[220px] rounded-[22px] border px-4 py-4 ${toneClasses[alert.tone]}`}
          >
            <div className="flex h-full flex-col justify-between gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70">
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-[30px] font-extrabold leading-none">
                  {counts[alert.key as keyof typeof counts]}
                </p>
                <p className="mt-2 text-sm font-semibold leading-5">
                  {locale === "en" ? alert.enLabel : alert.bnLabel}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TopMetricCards({ overview }: { overview: DashboardOverview }) {
  const { locale } = useLanguage();

  const values = {
    earnings: `৳${overview.topCards.earnings.toLocaleString()}`,
    bookings: overview.topCards.bookings.toLocaleString(),
    services: overview.topCards.completedServices.toLocaleString(),
    users: overview.topCards.users.toLocaleString(),
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {topCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="rounded-[22px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.4)] dark:border-white/10 dark:bg-[#161f36]"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#5c6cff] dark:bg-white/8 dark:text-[#9cabff]">
                <Icon size={18} />
              </span>
              <span className="text-xs font-semibold text-emerald-500">
                {card.change}
              </span>
            </div>
            <p className="mt-4 text-[28px] font-extrabold text-[#1f2638] dark:text-white">
              {values[card.key as keyof typeof values]}
            </p>
            <p className="mt-1 text-sm text-[#7f8ba3]">
              {locale === "en" ? card.enTitle : card.bnTitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function RevenuePanels({ overview }: { overview: DashboardOverview }) {
  const { locale } = useLanguage();
  const monthlyRevenue = overview.charts.monthlyRevenue;
  const weeklyProfit = overview.charts.weeklyProfit;
  const monthlyChart = useMemo(() => {
    const maxValue = Math.max(...monthlyRevenue, 1);
    return monthlyRevenue.map((value) => ({
      value,
      height: Math.max(14, Math.round((value / maxValue) * 208)),
    }));
  }, [monthlyRevenue]);
  const weeklyChart = useMemo(() => {
    const maxValue = Math.max(...weeklyProfit, 1);
    return weeklyProfit.map((value) => {
      const primaryHeight = Math.max(18, Math.round((value / maxValue) * 148));
      const secondaryHeight = Math.max(12, Math.round(primaryHeight * 0.72));
      return {
        value,
        primaryHeight,
        secondaryHeight,
      };
    });
  }, [weeklyProfit]);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.45fr,0.85fr]">
      <div className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-[#1f2638] dark:text-white">
              {locale === "en" ? "Revenue Flow" : "রেভিনিউ ফ্লো"}
            </p>
            <p className="mt-1 text-sm text-[#7f8ba3]">
              {locale === "en"
                ? `Collection rate ${overview.overviewMetrics.collectionRate}`
                : `কলেকশন রেট ${overview.overviewMetrics.collectionRate}`}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f3f6fd] px-3 py-1 text-xs font-semibold text-[#5c6cff] dark:bg-white/8 dark:text-[#aab5ff]">
            <LayoutDashboard size={14} />
            {locale === "en" ? "This Month" : "এই মাস"}
          </div>
          </div>

        <div className="relative h-80 overflow-hidden rounded-[22px] bg-linear-to-b from-[#f8fbff] to-[#eef3fb] p-5 dark:from-[#141d32] dark:to-[#101729]">
          <div className="absolute inset-x-5 top-5 bottom-5 grid grid-cols-12 gap-0">
            {monthlyChart.map((_, index) => (
              <div
                key={index}
                className="border-l border-dashed border-[#dbe4f4]/90 dark:border-white/8"
              />
            ))}
          </div>
          <div className="absolute inset-x-5 top-5 bottom-5 grid grid-rows-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="border-t border-dashed border-[#dbe4f4]/90 dark:border-white/8"
              />
            ))}
          </div>
          <div className="absolute inset-x-5 bottom-14 flex items-end gap-3">
            {monthlyChart.map((item, index) => (
              <div key={index} className="flex-1">
                <div
                  className="rounded-t-[16px] bg-linear-to-t from-[#5d7bff] to-[#8ec5ff]"
                  style={{ height: `${item.height}px` }}
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-x-5 bottom-5 flex justify-between text-[11px] font-medium text-[#8a96ad]">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
              (month) => (
                <span key={month}>{month}</span>
              ),
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-[#1f2638] dark:text-white">
                {locale === "en" ? "Weekly Profit" : "সাপ্তাহিক প্রফিট"}
              </p>
              <p className="text-sm text-[#7f8ba3]">
                {locale === "en"
                  ? `${overview.overviewMetrics.verifiedUsers} verified users`
                  : `${overview.overviewMetrics.verifiedUsers} ভেরিফাইড ইউজার`}
              </p>
            </div>
            <span className="text-xs font-semibold text-[#6f7c98]">
              {locale === "en" ? "This week" : "এই সপ্তাহ"}
            </span>
          </div>

          <div className="flex h-[220px] items-end justify-between gap-3 rounded-[20px] bg-[#f8fbff] p-4 dark:bg-[#11192c]">
            {weeklyChart.map((item, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-end justify-center gap-1">
                  <div
                    className="w-3 rounded-t-full bg-[#9db1ff]"
                    style={{ height: `${item.secondaryHeight}px` }}
                  />
                  <div
                    className="w-3 rounded-t-full bg-[#4f6bff]"
                    style={{ height: `${item.primaryHeight}px` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-[#8a96ad]">
                  {["M", "T", "W", "T", "F", "S", "S"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
