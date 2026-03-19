"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, BellRing, CheckCheck, FileCheck, ShieldAlert, Trash2, Wrench } from "lucide-react";
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

const notificationIconMap = {
  service: Wrench,
  billing: FileCheck,
  verification: ShieldAlert,
  invoice: FileCheck,
  security: ShieldAlert,
  booking: Wrench,
  message: Bell,
  system: Bell,
};

export function NotificationDropdown() {
  const { user } = useProvider();
  const { locale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const { data, setData } = useApiQuery(getProfileNotifications, [], Boolean(user));

  const notifications = useMemo(() => data?.rows ?? [], [data]);
  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications],
  );

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
    if (!open || unreadCount === 0) return;
    void markAllRead();
  }, [markAllRead, open, unreadCount]);

  useEffect(() => {
    if (!actionSuccess) return;
    const timer = window.setTimeout(() => setActionSuccess(null), 2200);
    return () => window.clearTimeout(timer);
  }, [actionSuccess]);

  if (!user) {
    return null;
  }

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
    setIsDeleting(true);
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
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative inline-flex items-center justify-center rounded-full bg-white/60 p-2 text-neutral-700 shadow-sm backdrop-blur transition hover:bg-white/80 dark:bg-white/10 dark:text-neutral-100"
        aria-label={t("nav.notifications")}
      >
        {unreadCount > 0 ? <BellRing size={19} /> : <Bell size={19} />}
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-[22rem] rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-neutral-900">
          <div className="px-3 pb-2 pt-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                {t("nav.notifications")}
              </p>
              {notifications.length > 0 ? (
                <button
                  type="button"
                  onClick={() => void markAllRead()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300"
                >
                  <CheckCheck size={14} />
                  {locale === "en" ? "Mark all" : "সব রিড"}
                </button>
              ) : null}
            </div>
            {actionSuccess ? (
              <p className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                {actionSuccess}
              </p>
            ) : null}
          </div>

          <div className="max-h-[26rem] space-y-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-neutral-500">
                {t("nav.noNotifications")}
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon =
                  notificationIconMap[
                    notification.type as keyof typeof notificationIconMap
                  ] ?? Bell;
                return (
                  <div
                    key={notification._id}
                    className={`flex gap-3 rounded-xl border px-3 py-3 transition ${
                      notification.unread
                        ? "border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/12 dark:hover:bg-indigo-500/18"
                        : "border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {locale === "en" ? notification.titleEn : notification.titleBn}
                        </p>
                        <span className="shrink-0 text-[11px] text-neutral-400">
                          {notification.createdAtLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-300">
                        {locale === "en" ? notification.bodyEn : notification.bodyBn}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        {notification.actionHref ? (
                          <Link
                            href={notification.actionHref || "/profile"}
                            onClick={() => {
                              setOpen(false);
                              if (notification.unread && notification._id !== "verify-warning") {
                                void markOneRead(notification._id);
                              }
                            }}
                            className="inline-flex text-xs font-semibold text-indigo-600 dark:text-indigo-300"
                          >
                            {t("nav.viewDetails")}
                          </Link>
                        ) : <span />}
                        {notification._id !== "verify-warning" ? (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              void deleteOne(notification._id);
                            }}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-300"
                          >
                            <Trash2 size={13} />
                            {locale === "en" ? "Delete" : "ডিলিট"}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
