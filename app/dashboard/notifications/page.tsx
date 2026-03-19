"use client";

import { useEffect, useMemo, useState } from "react";
import { BellDot, CheckCheck, ChevronRight, Loader2, Trash2 } from "lucide-react";
import { AdminSurface } from "@/components/admin/AdminSections";
import {
  ApiEmptyState,
  ApiErrorState,
  ApiSkeletonBlock,
} from "@/components/shared/ApiState";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { SuccessToast } from "@/components/shared/SuccessToast";
import { dispatchAdminSidebarRefresh } from "@/lib/admin-sidebar-events";
import {
  deleteAdminNotification,
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  type AdminNotificationRow,
} from "@/lib/dashboard-api";
import { useLanguage } from "@/lib/i18n";
import { useApiQuery } from "@/hooks/use-api-query";
import { useNotificationSocket } from "@/lib/realtime/notification-socket";

type NotificationTone =
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "sky"
  | "violet"
  | "slate";

const toneClassMap: Record<NotificationTone, string> = {
  indigo:
    "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-200",
  emerald:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200",
  amber:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200",
  rose:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200",
  sky:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200",
  violet:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200",
  slate:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-500/20 dark:bg-slate-500/10 dark:text-slate-200",
};

export default function DashboardNotificationsPage() {
  const { locale } = useLanguage();
  const [viewFilter, setViewFilter] = useState<"all" | "unread">("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [viewFilter, sortOrder]);

  useEffect(() => {
    if (!actionSuccess) return;
    const timer = window.setTimeout(() => setActionSuccess(null), 2400);
    return () => window.clearTimeout(timer);
  }, [actionSuccess]);

  const { data, isLoading, error, refresh, setData } = useApiQuery(
    () => getAdminNotifications({ filter: viewFilter, sort: sortOrder, page, limit: 12 }),
    [viewFilter, sortOrder, page],
  );

  const grouped = useMemo(() => {
    return (data?.rows ?? []).reduce<Record<string, AdminNotificationRow[]>>((acc, item) => {
      const key = locale === "en" ? item.sectionEn : item.sectionBn;
      acc[key] ??= [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [data?.rows, locale]);

  useNotificationSocket<AdminNotificationRow>({
    enabled: true,
    onCreatedOrUpdated: () => {
      void refresh();
    },
    onDeleted: () => {
      void refresh();
    },
  });

  const markAllRead = async () => {
    await markAllAdminNotificationsRead();
    setData((current) =>
      current
        ? {
            rows: current.rows.map((item) => ({ ...item, unread: false })),
            counts: { total: current.rows.length, unread: 0 },
            pagination: current.pagination,
          }
        : current,
    );
    dispatchAdminSidebarRefresh();
  };

  const markOneRead = async (notificationId: string) => {
    const { data: updated } = await markAdminNotificationRead(notificationId);
    setData((current) => {
      if (!current) return current;
      const nextRows = current.rows.map((item) => (item._id === notificationId ? updated : item));
      return {
        rows: nextRows,
        counts: {
          total: nextRows.length,
          unread: nextRows.filter((item) => item.unread).length,
        },
        pagination: current.pagination,
      };
    });
    dispatchAdminSidebarRefresh();
  };

  const deleteOne = async (notificationId: string) => {
    setDeletingId(notificationId);
    try {
      await deleteAdminNotification(notificationId);
      setData((current) => {
        if (!current) return current;
        const nextRows = current.rows.filter((item) => item._id !== notificationId);
        return {
          rows: nextRows,
          counts: {
            total: nextRows.length,
            unread: nextRows.filter((item) => item.unread).length,
          },
          pagination: current.pagination,
        };
      });
      setActionSuccess(
        locale === "en"
          ? "Notification deleted successfully."
          : "নোটিফিকেশন সফলভাবে ডিলিট হয়েছে।",
      );
      dispatchAdminSidebarRefresh();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminSurface>
      <div className="space-y-5">
        <SuccessToast message={actionSuccess} />
        {isLoading ? <ApiSkeletonBlock rows={4} /> : null}
        {!isLoading && error ? (
          <ApiErrorState
            title={locale === "en" ? "Notifications failed to load" : "নোটিফিকেশন লোড হয়নি"}
            description={error}
            onRetry={() => void refresh()}
          />
        ) : null}

        {!isLoading && !error && data ? (
          <>
            <div className="flex flex-col gap-3 rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36] lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-[#eef3ff] p-2 text-[#4f6bff] dark:bg-white/8 dark:text-[#9cabff]">
                  <BellDot size={18} />
                </span>
                <h2 className="text-3xl font-extrabold text-[#1f2638] dark:text-white">
                  {locale === "en" ? "Notifications" : "নোটিফিকেশন"} ({data.counts.total})
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <select
                  value={viewFilter}
                  onChange={(event) => setViewFilter(event.target.value as "all" | "unread")}
                  className="rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-2 text-sm font-semibold text-[#2160ba] outline-none dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                >
                  <option value="all">{locale === "en" ? "All" : "সব"}</option>
                  <option value="unread">{locale === "en" ? "Unread" : "আনরিড"}</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value as "latest" | "oldest")}
                  className="rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-2 text-sm font-semibold text-[#2160ba] outline-none dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                >
                  <option value="latest">{locale === "en" ? "Latest first" : "নতুন আগে"}</option>
                  <option value="oldest">{locale === "en" ? "Oldest first" : "পুরোনো আগে"}</option>
                </select>
                <button
                  type="button"
                  onClick={markAllRead}
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-2 text-sm font-semibold text-[#2160ba] dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                >
                  <CheckCheck size={16} />
                  {locale === "en" ? "Mark all read" : "সব রিড করুন"}
                </button>
                <button
                  type="button"
                  onClick={() => void refresh()}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#2160ba] px-4 py-2 text-sm font-semibold text-white"
                >
                  <BellDot size={16} />
                  {locale === "en" ? "Refresh" : "রিফ্রেশ"}
                </button>
              </div>
            </div>

            {data.rows.length === 0 ? (
              <ApiEmptyState
                title={
                  locale === "en"
                    ? "No notifications found"
                    : "কোনো নোটিফিকেশন পাওয়া যায়নি"
                }
                description={
                  locale === "en"
                    ? "New booking, invoice, security, or system updates will appear here."
                    : "নতুন বুকিং, ইনভয়েস, সিকিউরিটি বা সিস্টেম আপডেট এখানে দেখাবে।"
                }
              />
            ) : (
              <div className="space-y-5">
                {Object.entries(grouped).map(([section, sectionItems]) => (
                  <div
                    key={section}
                    className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-bold text-[#1f2638] dark:text-white">{section}</p>
                        <p className="text-sm text-[#7f8ba3]">
                          {sectionItems.length} {locale === "en" ? "items" : "আইটেম"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {sectionItems.map((item) => (
                        <div
                          key={item._id}
                          className={`rounded-[20px] border p-4 ${
                            item.unread
                              ? "border-[#d7e5ff] bg-[#edf4ff] dark:border-[#3656a8] dark:bg-[#182441]"
                              : "border-[#edf1f7] bg-[#fbfdff] dark:border-white/10 dark:bg-[#11192c]"
                          }`}
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${toneClassMap[item.tone as NotificationTone]}`}
                                >
                                  {locale === "en" ? item.sectionEn : item.sectionBn}
                                </span>
                              </div>

                              <p className="mt-3 text-base font-bold text-[#1f2638] dark:text-white">
                                {locale === "en" ? item.titleEn : item.titleBn}
                              </p>
                              <p className="mt-1 text-sm leading-6 text-[#60708d] dark:text-[#a7b3c9]">
                                {locale === "en" ? item.bodyEn : item.bodyBn}
                              </p>
                            </div>

                            <p className="shrink-0 text-xs font-semibold text-[#8a96ad]">
                              {item.createdAtLabel}
                            </p>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (item.unread) {
                                  void markOneRead(item._id);
                                }
                                if (item.actionHref) {
                                  window.location.href = item.actionHref;
                                }
                              }}
                              className="inline-flex items-center gap-2 rounded-2xl bg-[#2160ba] px-4 py-2 text-sm font-semibold text-white"
                            >
                              <ChevronRight size={16} />
                              {locale === "en" ? item.actionEn : item.actionBn}
                            </button>
                            <button
                              type="button"
                              onClick={() => void deleteOne(item._id)}
                              disabled={deletingId === item._id}
                              className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200"
                            >
                              {deletingId === item._id ? (
                                <>
                                  <Loader2 size={16} className="animate-spin" />
                                  {locale === "en" ? "Deleting..." : "ডিলিট হচ্ছে..."}
                                </>
                              ) : (
                                <>
                                  <Trash2 size={16} />
                                  {locale === "en" ? "Delete" : "ডিলিট"}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <PaginationControls
              pagination={data.pagination}
              onPageChange={setPage}
              className="rounded-[24px] border border-[#e8edf7] bg-white px-5 py-4 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]"
            />
          </>
        ) : null}
      </div>
    </AdminSurface>
  );
}
