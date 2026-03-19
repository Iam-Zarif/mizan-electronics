"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  Bug,
  DatabaseZap,
  Github,
  Globe,
  Lock,
  ShieldAlert,
  TerminalSquare,
} from "lucide-react";
import { AdminPageHeader, AdminSurface } from "@/components/admin/AdminSections";
import {
  ApiEmptyState,
  ApiErrorState,
  ApiSkeletonBlock,
} from "@/components/shared/ApiState";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { getAdminAlerts, type AdminAlertRow } from "@/lib/dashboard-api";
import { useApiQuery } from "@/hooks/use-api-query";
import { useLanguage } from "@/lib/i18n";

type AlertActionKey = "secure" | "block" | "logs" | "review" | "quarantine";

const actionMeta = {
  secure: {
    labelBn: "সিকিউর করুন",
    labelEn: "Secure Now",
    icon: Lock,
    className: "bg-[#215fba] text-white hover:bg-[#184f9d]",
  },
  block: {
    labelBn: "আইপি ব্লক",
    labelEn: "Block IP",
    icon: Ban,
    className: "bg-red-500 text-white hover:bg-red-600",
  },
  logs: {
    labelBn: "লগ দেখুন",
    labelEn: "Review Logs",
    icon: TerminalSquare,
    className:
      "bg-white text-[#215fba] ring-1 ring-[#dbe4f4] hover:bg-[#f5f8fe] dark:bg-[#11192c] dark:text-[#aab5ff] dark:ring-white/10 dark:hover:bg-[#18233d]",
  },
  review: {
    labelBn: "রিভিউ করুন",
    labelEn: "Review Access",
    icon: ShieldAlert,
    className:
      "bg-white text-[#215fba] ring-1 ring-[#dbe4f4] hover:bg-[#f5f8fe] dark:bg-[#11192c] dark:text-[#aab5ff] dark:ring-white/10 dark:hover:bg-[#18233d]",
  },
  quarantine: {
    labelBn: "কোয়ারান্টাইন",
    labelEn: "Quarantine",
    icon: AlertTriangle,
    className: "bg-[#7b3dc8] text-white hover:bg-[#6b33b2]",
  },
} as const;

const toneClasses: Record<AdminAlertRow["tone"], string> = {
  red: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200",
  amber:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200",
  violet:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200",
  sky: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200",
  slate:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-500/20 dark:bg-slate-500/10 dark:text-slate-200",
};

const alertIconMap: Record<AdminAlertRow["type"], typeof DatabaseZap> = {
  database: DatabaseZap,
  github: Github,
  website: Bug,
  security: ShieldAlert,
  system: Globe,
};

export default function DashboardAlertsPage() {
  const { locale } = useLanguage();
  const [status, setStatus] = useState("active");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refresh } = useApiQuery(
    () => getAdminAlerts({ status, sort, page, limit: 12 }),
    [status, sort, page],
  );

  const summaryCards = useMemo(
    () =>
      data
        ? [
            {
              key: "active",
              icon: ShieldAlert,
              value: data.counts.active,
              bn: "অ্যাকটিভ ইনসিডেন্ট",
              en: "Active Incidents",
            },
            {
              key: "critical",
              icon: DatabaseZap,
              value: data.counts.critical,
              bn: "ক্রিটিক্যাল ঝুঁকি",
              en: "Critical Risk",
            },
            {
              key: "github",
              icon: Github,
              value: data.counts.github,
              bn: "গিটহাব অ্যালার্ট",
              en: "GitHub Alerts",
            },
            {
              key: "website",
              icon: Bug,
              value: data.counts.website,
              bn: "ওয়েবসাইট হিট",
              en: "Website Hits",
            },
          ]
        : [],
    [data],
  );

  return (
    <AdminSurface>
      <AdminPageHeader titleBn="অ্যালার্ট" titleEn="Alerts" />

      {isLoading ? <ApiSkeletonBlock rows={4} /> : null}
      {!isLoading && error ? (
        <ApiErrorState
          title={locale === "en" ? "Alerts failed to load" : "অ্যালার্ট লোড হয়নি"}
          description={error}
          onRetry={() => void refresh()}
        />
      ) : null}

      {!isLoading && !error && data ? (
        <div className="space-y-5">
          <div className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-end gap-3">
                <select
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                    setPage(1);
                  }}
                  className="rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-3 text-sm font-medium text-[#33415c] outline-none dark:border-white/10 dark:bg-[#11192c] dark:text-[#d8e1f1]"
                >
                  <option value="active">{locale === "en" ? "Active only" : "শুধু অ্যাকটিভ"}</option>
                  <option value="resolved">{locale === "en" ? "Resolved only" : "শুধু রিজলভড"}</option>
                  <option value="all">{locale === "en" ? "All alerts" : "সব অ্যালার্ট"}</option>
                </select>
                <select
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value);
                    setPage(1);
                  }}
                  className="rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-3 text-sm font-medium text-[#33415c] outline-none dark:border-white/10 dark:bg-[#11192c] dark:text-[#d8e1f1]"
                >
                  <option value="latest">{locale === "en" ? "Latest first" : "নতুন আগে"}</option>
                  <option value="oldest">{locale === "en" ? "Oldest first" : "পুরনো আগে"}</option>
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.key}
                      className="rounded-[20px] border border-[#edf1f7] bg-[#fbfdff] p-4 dark:border-white/10 dark:bg-[#11192c]"
                    >
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#5c6cff] dark:bg-white/8 dark:text-[#9cabff]">
                        <Icon size={18} />
                      </span>
                      <p className="mt-4 text-[28px] font-extrabold text-[#1f2638] dark:text-white">
                        {card.value}
                      </p>
                      <p className="mt-1 text-sm text-[#7f8ba3]">
                        {locale === "en" ? card.en : card.bn}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {data.rows.length === 0 ? (
            <ApiEmptyState
              title={locale === "en" ? "No alerts found" : "কোনো অ্যালার্ট পাওয়া যায়নি"}
              description={
                locale === "en"
                  ? "Security, database, GitHub and website incidents will appear here."
                  : "সিকিউরিটি, ডেটাবেজ, গিটহাব ও ওয়েবসাইট ইনসিডেন্ট এখানে দেখা যাবে।"
              }
            />
          ) : (
            <div className="space-y-4">
              {data.rows.map((alert) => {
                const Icon = alertIconMap[alert.type];
                const toneClass = toneClasses[alert.tone];

                return (
                  <div
                    key={alert._id}
                    className="rounded-[22px] border border-[#e8edf7] bg-white p-4 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="flex items-start gap-3">
                        <span
                          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${toneClass}`}
                        >
                          <Icon size={18} />
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-base font-bold text-[#1f2638] dark:text-white">
                              {locale === "en" ? alert.titleEn : alert.titleBn}
                            </p>
                            <span
                              className={`rounded-full border px-3 py-1 text-[11px] font-semibold capitalize ${toneClass}`}
                            >
                              {alert.level}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-[#60708d] dark:text-[#a7b3c9]">
                            {locale === "en" ? alert.summaryEn : alert.summaryBn}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-[#8a96ad] dark:text-[#70809c]">
                            <span>{locale === "en" ? alert.sourceEn : alert.sourceBn}</span>
                            <span>
                              {locale === "en"
                                ? alert.createdAtLabelEn
                                : alert.createdAtLabelBn}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {alert.actions.map((actionKey) => {
                          const action = actionMeta[actionKey as AlertActionKey];
                          const ActionIcon = action.icon;

                          return (
                            <button
                              key={actionKey}
                              type="button"
                              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${action.className}`}
                            >
                              <ActionIcon size={15} />
                              {locale === "en" ? action.labelEn : action.labelBn}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <PaginationControls pagination={data.pagination} onPageChange={setPage} />
        </div>
      ) : null}
    </AdminSurface>
  );
}
