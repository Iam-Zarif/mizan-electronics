"use client";

import { useEffect, useMemo, useState } from "react";
import { Cpu, Database, HardDrive, Mail, PhoneCall, UserRound, X } from "lucide-react";
import {
  AdminPageHeader,
  AdminSurface,
  AlertWidgets,
  DatabaseMonitorPanel,
  RevenuePanels,
  TopMetricCards,
} from "@/components/admin/AdminSections";
import { ApiErrorState, ApiSkeletonBlock } from "@/components/shared/ApiState";
import { getAdminOverview, getAdminSystemMonitor } from "@/lib/dashboard-api";
import { getValueOrEmpty } from "@/lib/display";
import { useApiQuery } from "@/hooks/use-api-query";
import { useLanguage } from "@/lib/i18n";

export default function DashboardPage() {
  const { locale } = useLanguage();
  const { data, isLoading, error, refresh } = useApiQuery(getAdminOverview, []);
  const {
    data: monitor,
    isLoading: isMonitorLoading,
    error: monitorError,
    refresh: refreshMonitor,
  } = useApiQuery(getAdminSystemMonitor, []);
  const [terminateModalOpen, setTerminateModalOpen] = useState(false);
  const [monitorModalOpen, setMonitorModalOpen] = useState(false);
  const terminateUsers = useMemo(() => data?.terminateUsers ?? [], [data]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refreshMonitor();
    }, 30000);

    return () => window.clearInterval(timer);
  }, [refreshMonitor]);

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
            {isMonitorLoading ? <ApiSkeletonBlock rows={1} /> : null}
            {!isMonitorLoading && monitorError ? (
              <ApiErrorState
                title={locale === "en" ? "Database monitor failed to load" : "ডেটাবেজ মনিটর লোড হয়নি"}
                description={monitorError}
                onRetry={() => void refreshMonitor()}
              />
            ) : null}
            {!isMonitorLoading && !monitorError && monitor ? (
              <DatabaseMonitorPanel
                monitor={monitor}
                onOpenDetails={() => setMonitorModalOpen(true)}
              />
            ) : null}
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

      {monitorModalOpen && monitor ? (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] dark:bg-[#161f36]">
            <div className="flex items-start justify-between gap-4 border-b border-[#e6edf8] px-5 py-5 dark:border-white/10">
              <div>
                <p className="text-xl font-bold text-[#1f2638] dark:text-white">
                  {locale === "en" ? "Database & System Monitor" : "ডেটাবেজ ও সিস্টেম মনিটর"}
                </p>
                <p className="mt-1 text-sm text-[#7f8ba3] dark:text-[#9aa8c0]">
                  {locale === "en"
                    ? `Last updated ${new Date(monitor.timestamp).toLocaleString("en-GB")}`
                    : `সর্বশেষ আপডেট ${new Date(monitor.timestamp).toLocaleString("bn-BD")}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMonitorModalOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[calc(88vh-96px)] space-y-5 overflow-auto p-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <MonitorBox
                  icon={<Database size={16} />}
                  label={locale === "en" ? "Database" : "ডেটাবেজ"}
                  value={monitor.database.name}
                  meta={`${monitor.database.mongoVersion} • ${monitor.database.storageEngine}`}
                />
                <MonitorBox
                  icon={<HardDrive size={16} />}
                  label={locale === "en" ? "Used / Free" : "ব্যবহৃত / ফ্রি"}
                  value={`${monitor.database.storageSizeMB.toLocaleString()} MB / ${
                    monitor.database.freeStorageMB === null
                      ? locale === "en"
                        ? "Not available"
                        : "নেই"
                      : `${monitor.database.freeStorageMB.toLocaleString()} MB`
                  }`}
                  meta={`${locale === "en" ? "Index" : "ইনডেক্স"} ${monitor.database.indexSizeMB.toLocaleString()} MB`}
                />
                <MonitorBox
                  icon={<Cpu size={16} />}
                  label={locale === "en" ? "Node / Redis" : "Node / Redis"}
                  value={`${monitor.process.nodeVersion} / ${monitor.redis.status}`}
                  meta={`${locale === "en" ? "Host" : "হোস্ট"} ${monitor.database.host}`}
                />
              </div>

              <div className="overflow-hidden rounded-[24px] border border-[#e6edf8] dark:border-white/10">
                <div className="grid grid-cols-[1.2fr,1fr] border-b border-[#e6edf8] bg-[#f8fbff] px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#7f8ba3] dark:border-white/10 dark:bg-[#11192c] dark:text-[#8ea0bf]">
                  <span>{locale === "en" ? "Metric" : "মেট্রিক"}</span>
                  <span>{locale === "en" ? "Value" : "ভ্যালু"}</span>
                </div>
                <div className="divide-y divide-[#edf2fa] dark:divide-white/6 text-sm">
                  {[
                    [locale === "en" ? "Collections" : "কলেকশন", monitor.database.collections.toLocaleString()],
                    [locale === "en" ? "Views" : "ভিউ", monitor.database.views.toLocaleString()],
                    [locale === "en" ? "Objects" : "অবজেক্ট", monitor.database.objects.toLocaleString()],
                    [locale === "en" ? "Data Size" : "ডাটা সাইজ", `${monitor.database.dataSizeMB.toLocaleString()} MB`],
                    [locale === "en" ? "Storage Size" : "স্টোরেজ সাইজ", `${monitor.database.storageSizeMB.toLocaleString()} MB`],
                    [locale === "en" ? "Filesystem Total" : "মোট স্টোরেজ", monitor.database.fsTotalSizeMB === null ? (locale === "en" ? "Not available" : "নেই") : `${monitor.database.fsTotalSizeMB.toLocaleString()} MB`],
                    [locale === "en" ? "Filesystem Used" : "ব্যবহৃত ফাইলসিস্টেম", monitor.database.usedStorageMB === null ? (locale === "en" ? "Not available" : "নেই") : `${monitor.database.usedStorageMB.toLocaleString()} MB`],
                    [locale === "en" ? "Indexes" : "ইনডেক্স", monitor.database.indexes.toLocaleString()],
                    [locale === "en" ? "Avg Object Size" : "গড় অবজেক্ট সাইজ", `${monitor.database.avgObjSizeKB.toLocaleString()} KB`],
                    [locale === "en" ? "Connections" : "কানেকশন", `${monitor.database.connections.current} / ${monitor.database.connections.available}`],
                    [locale === "en" ? "CPU Cores" : "CPU কোর", monitor.system.cpuCores.toLocaleString()],
                    [locale === "en" ? "Memory Usage" : "মেমরি ব্যবহার", `${monitor.memory.usedMB.toLocaleString()} MB / ${monitor.memory.totalMB.toLocaleString()} MB (${monitor.memory.usagePercent}%)`],
                    [locale === "en" ? "Process RSS" : "প্রসেস RSS", `${monitor.process.memoryUsageMB.rss.toLocaleString()} MB`],
                    [locale === "en" ? "WiredTiger Cache" : "WiredTiger ক্যাশ", monitor.database.cacheBytesMB === null ? (locale === "en" ? "Not available" : "নেই") : `${monitor.database.cacheBytesMB.toLocaleString()} MB`],
                  ].map(([label, value]) => (
                    <div
                      key={String(label)}
                      className="grid grid-cols-[1.2fr,1fr] gap-4 px-4 py-3 text-[#1f2638] dark:text-white"
                    >
                      <span className="font-semibold">{label}</span>
                      <span className="text-[#60708d] dark:text-[#a7b3c9]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminSurface>
  );
}

function MonitorBox({
  icon,
  label,
  value,
  meta,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  meta: string;
}) {
  return (
    <div className="rounded-[20px] border border-[#e8edf7] bg-[#f8fbff] p-4 dark:border-white/8 dark:bg-[#11192c]">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]">
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7f8ba3] dark:text-[#8ea0bf]">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold text-[#1f2638] dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-[#7f8ba3] dark:text-[#9aa8c0]">{meta}</p>
    </div>
  );
}
