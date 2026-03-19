"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useProvider } from "@/Providers/AuthProviders";
import { useLanguage } from "@/lib/i18n";
import {
  deleteProfileNotification,
  getProfileNotifications,
  markAllProfileNotificationsRead,
  markProfileNotificationRead,
  type ProfileNotification,
} from "@/lib/dashboard-api";
import { useApiQuery } from "@/hooks/use-api-query";
import { useNotificationSocket } from "@/lib/realtime/notification-socket";
import { getNotificationIcon } from "@/lib/notification-icons";

export default function NotificationsPage() {
  const { user, isAuthLoading } = useProvider();
  const { locale, t } = useLanguage();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const { data, isLoading, error, setData, refresh } = useApiQuery(
    getProfileNotifications,
    [],
    Boolean(user),
  );

  const notifications = useMemo(() => data?.rows ?? [], [data]);

  useNotificationSocket<ProfileNotification>({
    enabled: Boolean(user),
    onCreatedOrUpdated: (notification) => {
      setData((current) => {
        if (!current) return current;
        const nextRows = current.rows.some((item) => item._id === notification._id)
          ? current.rows.map((item) => (item._id === notification._id ? notification : item))
          : [notification, ...current.rows];
        return { rows: nextRows };
      });
    },
    onDeleted: (notificationId) => {
      setData((current) =>
        current
          ? { rows: current.rows.filter((item) => item._id !== notificationId) }
          : current,
      );
    },
  });

  const markAllRead = useCallback(async () => {
    await markAllProfileNotificationsRead();
    setData((current) =>
      current
        ? {
            rows: current.rows.map((item) =>
              item._id === "verify-warning" ? item : { ...item, unread: false },
            ),
          }
        : current,
    );
  }, [setData]);

  useEffect(() => {
    if (!user || notifications.length === 0) return;
    const hasUnread = notifications.some((item) => item.unread && item._id !== "verify-warning");
    if (!hasUnread) return;
    void markAllRead();
  }, [markAllRead, notifications, user]);

  useEffect(() => {
    if (!actionSuccess) return;
    const timer = window.setTimeout(() => setActionSuccess(null), 2200);
    return () => window.clearTimeout(timer);
  }, [actionSuccess]);

  const markOneRead = async (notificationId: string) => {
    if (notificationId === "verify-warning") return;
    const { data: updated } = await markProfileNotificationRead(notificationId);
    setData((current) =>
      current
        ? {
            rows: current.rows.map((item) => (item._id === notificationId ? updated : item)),
          }
        : current,
    );
  };

  const deleteOne = async (notificationId: string) => {
    if (notificationId === "verify-warning") return;
    setDeleteTargetId(notificationId);
    try {
      await deleteProfileNotification(notificationId);
      setData((current) =>
        current
          ? { rows: current.rows.filter((item) => item._id !== notificationId) }
          : current,
      );
      setActionSuccess(
        locale === "en"
          ? "Notification deleted successfully."
          : "নোটিফিকেশন সফলভাবে ডিলিট হয়েছে।",
      );
    } finally {
      setDeleteTargetId(null);
    }
  };

  if (isAuthLoading) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-4 pb-16 pt-28">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-[24px] bg-slate-100 dark:bg-slate-800"
            />
          ))}
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-4 pb-16 pt-28">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-[#11192c]">
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {locale === "en" ? "Login required" : "লগইন প্রয়োজন"}
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            {locale === "en"
              ? "Sign in to view your notifications."
              : "আপনার নোটিফিকেশন দেখতে লগইন করুন।"}
          </p>
          <Link
            href="/auth/login"
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-[#2160ba] px-4 py-2 text-sm font-semibold text-white"
          >
            {locale === "en" ? "Go to login" : "লগইনে যান"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 pb-16 pt-28">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11192c]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
              <Bell size={20} />
            </span>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                {t("nav.notifications")}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                {locale === "en"
                  ? "Your service, booking and invoice updates."
                  : "আপনার সার্ভিস, বুকিং ও ইনভয়েস আপডেট।"}
              </p>
            </div>
          </div>
          {notifications.length > 0 ? (
            <button
              type="button"
              onClick={() => void markAllRead()}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/12 dark:text-indigo-300"
            >
              <CheckCheck size={14} />
              {locale === "en" ? "Mark all read" : "সব রিড"}
            </button>
          ) : null}
        </div>

        {actionSuccess ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
            {actionSuccess}
          </p>
        ) : null}

        {isLoading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-[22px] bg-slate-100 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="mt-4 rounded-[24px] border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            <p className="font-semibold">
              {locale === "en" ? "Notifications failed to load" : "নোটিফিকেশন লোড হয়নি"}
            </p>
            <p className="mt-1">{error}</p>
            <button
              type="button"
              onClick={() => void refresh()}
              className="mt-3 inline-flex rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white"
            >
              {locale === "en" ? "Retry" : "আবার চেষ্টা করুন"}
            </button>
          </div>
        ) : null}

        {!isLoading && !error && notifications.length === 0 ? (
          <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-[#0f172a] dark:text-slate-300">
            {t("nav.noNotifications")}
          </div>
        ) : null}

        {!isLoading && !error && notifications.length > 0 ? (
          <div className="mt-4 space-y-3">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);

              return (
                <div
                  key={notification._id}
                  className={`rounded-[24px] border px-4 py-4 ${
                    notification.unread
                      ? "border-indigo-200 bg-indigo-50/80 dark:border-indigo-500/30 dark:bg-indigo-500/12"
                      : "border-slate-200 bg-white dark:border-white/10 dark:bg-[#11192c]"
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm dark:bg-[#1a2440] dark:text-indigo-300">
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {locale === "en" ? notification.titleEn : notification.titleBn}
                        </p>
                        <span className="shrink-0 text-[11px] text-slate-400">
                          {notification.createdAtLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300">
                        {locale === "en" ? notification.bodyEn : notification.bodyBn}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        {notification.actionHref ? (
                          <Link
                            href={notification.actionHref || "/profile"}
                            onClick={() => {
                              if (notification.unread && notification._id !== "verify-warning") {
                                void markOneRead(notification._id);
                              }
                            }}
                            className="inline-flex text-xs font-semibold text-indigo-600 dark:text-indigo-300"
                          >
                            {t("nav.viewDetails")}
                          </Link>
                        ) : (
                          <span />
                        )}
                        {notification._id !== "verify-warning" ? (
                          <button
                            type="button"
                            onClick={() => void deleteOne(notification._id)}
                            disabled={deleteTargetId === notification._id}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 disabled:opacity-60 dark:text-rose-300"
                          >
                            <Trash2 size={13} />
                            {deleteTargetId === notification._id
                              ? locale === "en"
                                ? "Deleting..."
                                : "ডিলিট হচ্ছে..."
                              : locale === "en"
                                ? "Delete"
                                : "ডিলিট"}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </main>
  );
}
