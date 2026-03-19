"use client";

import { useMemo, useState } from "react";
import { Mail, PhoneCall, UserRound, X } from "lucide-react";
import {
  AdminPageHeader,
  AdminSurface,
  AlertWidgets,
  RevenuePanels,
  TopMetricCards,
} from "@/components/admin/AdminSections";
import { ApiErrorState, ApiSkeletonBlock } from "@/components/shared/ApiState";
import { getAdminOverview } from "@/lib/dashboard-api";
import { getValueOrEmpty } from "@/lib/display";
import { useApiQuery } from "@/hooks/use-api-query";
import { useLanguage } from "@/lib/i18n";

export default function DashboardPage() {
  const { locale } = useLanguage();
  const { data, isLoading, error, refresh } = useApiQuery(getAdminOverview, []);
  const [terminateModalOpen, setTerminateModalOpen] = useState(false);
  const terminateUsers = useMemo(() => data?.terminateUsers ?? [], [data]);

  return (
    <AdminSurface>
      <AdminPageHeader titleBn="ড্যাশবোর্ড" titleEn="Dashboard" />
      <div className="space-y-5">
        {isLoading ? <ApiSkeletonBlock rows={4} /> : null}
        {!isLoading && error ? (
          <ApiErrorState
            title={locale === "en" ? "Dashboard data failed to load" : "ড্যাশবোর্ড ডেটা লোড হয়নি"}
            description={error}
            onRetry={() => void refresh()}
          />
        ) : null}
        {!isLoading && !error && data ? (
          <>
            <AlertWidgets
              overview={data}
              onOpenTerminateUsers={() => setTerminateModalOpen(true)}
            />
            <TopMetricCards overview={data} />
            <RevenuePanels overview={data} />
          </>
        ) : null}
      </div>

      {terminateModalOpen && data ? (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] dark:bg-[#161f36]">
            <div className="flex items-start justify-between gap-4 border-b border-[#e6edf8] px-5 py-5 dark:border-white/10">
              <div>
                <p className="text-xl font-bold text-[#1f2638] dark:text-white">
                  {locale === "en" ? "Terminate In 24 Hours" : "২৪ ঘণ্টায় টার্মিনেট"}
                </p>
                <p className="mt-1 text-sm text-[#7f8ba3] dark:text-[#9aa8c0]">
                  {locale === "en"
                    ? `${terminateUsers.length} unverified users are near expiry`
                    : `${terminateUsers.length} জন আনভেরিফায়েড ইউজার এক্সপায়ারির কাছে আছে`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTerminateModalOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[calc(88vh-96px)] overflow-auto p-5">
              {terminateUsers.length ? (
                <div className="overflow-hidden rounded-[24px] border border-[#e6edf8] dark:border-white/10">
                  <div className="grid grid-cols-[1.2fr,1.2fr,0.9fr,0.8fr] gap-4 border-b border-[#e6edf8] bg-[#f8fbff] px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#7f8ba3] dark:border-white/10 dark:bg-[#11192c] dark:text-[#8ea0bf]">
                    <span>{locale === "en" ? "Customer" : "কাস্টমার"}</span>
                    <span>{locale === "en" ? "Email" : "ইমেইল"}</span>
                    <span>{locale === "en" ? "Phone" : "ফোন"}</span>
                    <span>{locale === "en" ? "Joined" : "জয়েন"}</span>
                  </div>
                  <div className="divide-y divide-[#edf2fa] dark:divide-white/6">
                    {terminateUsers.map((user) => (
                      <div
                        key={user.id}
                        className="grid grid-cols-[1.2fr,1.2fr,0.9fr,0.8fr] gap-4 px-4 py-4 text-sm text-[#1f2638] dark:text-white"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 font-semibold">
                            <UserRound size={15} className="text-[#5c6cff]" />
                            <span className="truncate">{user.name}</span>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[#60708d] dark:text-[#a7b3c9]">
                            <Mail size={14} className="shrink-0 text-[#7f8ba3]" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[#60708d] dark:text-[#a7b3c9]">
                            <PhoneCall size={14} className="shrink-0 text-[#7f8ba3]" />
                            <span className="truncate">
                              {getValueOrEmpty(user.phone, locale, "Phone", "ফোন")}
                            </span>
                          </div>
                        </div>
                        <div className="text-[#60708d] dark:text-[#a7b3c9]">
                          {new Date(user.joinedAt).toLocaleDateString(
                            locale === "en" ? "en-GB" : "bn-BD",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-[#dbe4f4] px-4 py-12 text-center text-sm text-[#7f8ba3] dark:border-white/10 dark:text-[#a7b3c9]">
                  {locale === "en"
                    ? "No users are scheduled to expire in the next 24 hours."
                    : "আগামী ২৪ ঘণ্টার মধ্যে টার্মিনেট হওয়ার মতো কোনো ইউজার নেই।"}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </AdminSurface>
  );
}
