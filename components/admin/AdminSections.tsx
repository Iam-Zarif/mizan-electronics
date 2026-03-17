"use client";

import {
  BadgeCheck,
  BellRing,
  LayoutDashboard,
  PhoneCall,
  Users,
  Wrench,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import {
  allUsers,
  completedMatches,
  pendingBookings,
  quickAlerts,
  topCards,
  monthlyRevenue,
  weeklyProfit,
} from "@/lib/admin-dashboard";

export function AdminSurface({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] bg-white px-4 py-5 shadow-[0_30px_70px_-45px_rgba(31,38,56,0.3)] dark:bg-[#101729] lg:px-6 lg:py-6">
      {children}
    </div>
  );
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
      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#6f7c98]">
        {locale === "en" ? "Dashboard" : "ড্যাশবোর্ড"}
      </p>
      <h2 className="mt-2 text-3xl font-extrabold text-[#1f2638] dark:text-white">
        {locale === "en" ? titleEn : titleBn}
      </h2>
    </div>
  );
}

export function AlertWidgets() {
  const { locale } = useLanguage();
  const toneClasses = {
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-800",
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
                  {alert.count}
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

export function TopMetricCards() {
  const { locale } = useLanguage();

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
              {card.value}
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

export function RevenuePanels() {
  const { locale } = useLanguage();

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
                ? "Booking-to-payment trend for the current cycle."
                : "বর্তমান সাইকেলের বুকিং-টু-পেমেন্ট ট্রেন্ড।"}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f3f6fd] px-3 py-1 text-xs font-semibold text-[#5c6cff] dark:bg-white/8 dark:text-[#aab5ff]">
            <LayoutDashboard size={14} />
            {locale === "en" ? "This Month" : "এই মাস"}
          </div>
        </div>

        <div className="relative h-[320px] overflow-hidden rounded-[22px] bg-linear-to-b from-[#f8fbff] to-[#eef3fb] p-5 dark:from-[#141d32] dark:to-[#101729]">
          <div className="absolute inset-x-5 top-5 bottom-5 grid grid-cols-12 gap-0">
            {monthlyRevenue.map((_, index) => (
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
            {monthlyRevenue.map((value, index) => (
              <div key={index} className="flex-1">
                <div
                  className="rounded-t-[16px] bg-linear-to-t from-[#5d7bff] to-[#8ec5ff]"
                  style={{ height: `${value * 3.6}px` }}
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
                {locale === "en" ? "Current week" : "চলতি সপ্তাহ"}
              </p>
            </div>
            <span className="text-xs font-semibold text-[#6f7c98]">
              {locale === "en" ? "This week" : "এই সপ্তাহ"}
            </span>
          </div>

          <div className="flex h-[220px] items-end justify-between gap-3 rounded-[20px] bg-[#f8fbff] p-4 dark:bg-[#11192c]">
            {weeklyProfit.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-end justify-center gap-1">
                  <div
                    className="w-3 rounded-t-full bg-[#9db1ff]"
                    style={{ height: `${Math.max(value - 12, 18)}px` }}
                  />
                  <div
                    className="w-3 rounded-t-full bg-[#4f6bff]"
                    style={{ height: `${value}px` }}
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

export function UsersSection() {
  const { locale } = useLanguage();

  return (
    <div className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
      <div className="mb-4 flex items-center gap-3">
        <span className="rounded-2xl bg-[#f3f6fd] p-2 text-[#5c6cff] dark:bg-white/8 dark:text-[#9cabff]">
          <Users size={18} />
        </span>
        <div>
          <p className="text-lg font-bold text-[#1f2638] dark:text-white">
            {locale === "en" ? "All Users" : "সকল ইউজার"}
          </p>
          <p className="text-sm text-[#7f8ba3]">
            {locale === "en"
              ? "User list with verification and done-service count."
              : "ভেরিফিকেশন ও সম্পন্ন সার্ভিস কাউন্টসহ ইউজার লিস্ট।"}
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[1.1fr_1.1fr_0.9fr_0.8fr_0.7fr] gap-3 rounded-2xl bg-[#f8fbff] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7f8ba3] dark:bg-[#11192c]">
            <span>{locale === "en" ? "User" : "ইউজার"}</span>
            <span>{locale === "en" ? "Email" : "ইমেইল"}</span>
            <span>{locale === "en" ? "Phone" : "ফোন"}</span>
            <span>{locale === "en" ? "Status" : "স্ট্যাটাস"}</span>
            <span>{locale === "en" ? "Done" : "ডান"}</span>
          </div>
          <div className="mt-3 space-y-3">
            {allUsers.map((item) => (
              <div
                key={item.email}
                className="grid grid-cols-[1.1fr_1.1fr_0.9fr_0.8fr_0.7fr] gap-3 rounded-2xl border border-[#e8edf7] px-4 py-4 dark:border-white/10"
              >
                <p className="truncate font-semibold text-[#1f2638] dark:text-white">
                  {locale === "en" ? item.nameEn : item.name}
                </p>
                <p className="truncate text-sm text-[#60708d] dark:text-[#a7b3c9]">
                  {item.email}
                </p>
                <p className="text-sm text-[#60708d] dark:text-[#a7b3c9]">
                  {item.phone}
                </p>
                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      item.verified
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.verified
                      ? locale === "en"
                        ? "Verified"
                        : "ভেরিফাইড"
                      : locale === "en"
                        ? "Pending"
                        : "পেন্ডিং"}
                  </span>
                </div>
                <p className="font-bold text-[#1f2638] dark:text-white">
                  {item.completedServices}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookingsSection() {
  const { locale } = useLanguage();

  return (
    <div className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
      <div className="mb-4 flex items-center gap-3">
        <span className="rounded-2xl bg-[#f3f6fd] p-2 text-[#5c6cff] dark:bg-white/8 dark:text-[#9cabff]">
          <PhoneCall size={18} />
        </span>
        <div>
          <p className="text-lg font-bold text-[#1f2638] dark:text-white">
            {locale === "en" ? "Requested Bookings" : "রিকুয়েস্টেড বুকিং"}
          </p>
          <p className="text-sm text-[#7f8ba3]">
            {locale === "en"
              ? "Incoming booking request queue."
              : "ইনকামিং বুকিং রিকুয়েস্ট কিউ।"}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {pendingBookings.map((booking, index) => (
          <div
            key={`${booking.phone}-${index}`}
            className="rounded-2xl bg-[#f8fbff] px-4 py-4 dark:bg-[#11192c]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-[#1f2638] dark:text-white">
                  {locale === "en" ? booking.nameEn : booking.name}
                </p>
                <p className="mt-1 text-sm text-[#60708d] dark:text-[#a7b3c9]">
                  {booking.phone}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#5c6cff] shadow-sm dark:bg-[#1a2440] dark:text-[#aab5ff]">
                {locale === "en" ? booking.statusEn : booking.statusBn}
              </span>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#4f6bff] shadow-sm dark:bg-[#1a2440] dark:text-[#aab5ff]">
              <Wrench size={13} />
              {locale === "en" ? booking.serviceEn : booking.serviceBn}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MatchingSection() {
  const { locale } = useLanguage();

  return (
    <div className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
      <div className="mb-4 flex items-center gap-3">
        <span className="rounded-2xl bg-[#f3f6fd] p-2 text-[#5c6cff] dark:bg-white/8 dark:text-[#9cabff]">
          <BadgeCheck size={18} />
        </span>
        <div>
          <p className="text-lg font-bold text-[#1f2638] dark:text-white">
            {locale === "en" ? "Service Matching" : "সার্ভিস ম্যাচিং"}
          </p>
          <p className="text-sm text-[#7f8ba3]">
            {locale === "en"
              ? "Profiles that can be linked after invoice completion."
              : "ইনভয়েস সম্পন্ন হলে যেগুলো ইউজার প্রোফাইলে লিঙ্ক করা যাবে।"}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {completedMatches.map((item) => (
          <div
            key={item.phone}
            className="rounded-2xl bg-[#f8fbff] px-4 py-4 dark:bg-[#11192c]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-[#1f2638] dark:text-white">
                  {locale === "en" ? item.nameEn : item.nameBn}
                </p>
                <p className="mt-1 text-sm text-[#60708d] dark:text-[#a7b3c9]">
                  {item.phone}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#4f6bff] shadow-sm dark:bg-[#1a2440] dark:text-[#aab5ff]">
                {locale === "en" ? item.serviceEn : item.serviceBn}
              </span>
            </div>
            <p className="mt-3 text-sm font-medium leading-6 text-[#60708d] dark:text-[#a7b3c9]">
              {locale === "en" ? item.stateEn : item.stateBn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlaceholderSection({
  titleBn,
  titleEn,
  descriptionBn,
  descriptionEn,
}: {
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
}) {
  const { locale } = useLanguage();

  return (
    <div className="rounded-[24px] border border-[#e8edf7] bg-white p-6 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
      <p className="text-xl font-bold text-[#1f2638] dark:text-white">
        {locale === "en" ? titleEn : titleBn}
      </p>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#7f8ba3]">
        {locale === "en" ? descriptionEn : descriptionBn}
      </p>
    </div>
  );
}
