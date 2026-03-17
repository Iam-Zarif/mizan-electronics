"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bell, BellRing, FileCheck, ShieldAlert, Wrench } from "lucide-react";
import { useProvider } from "@/Providers/AuthProviders";
import { useLanguage } from "@/lib/i18n";
import { getProfileNotifications } from "@/lib/profile-static";

const notificationIconMap = {
  service: Wrench,
  billing: FileCheck,
  verification: ShieldAlert,
};

export function NotificationDropdown() {
  const { user } = useProvider();
  const { locale, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const notifications = useMemo(() => getProfileNotifications(user), [user]);
  const unreadCount = notifications.filter((item) => item.unread).length;

  if (!user) {
    return null;
  }

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
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
              {t("nav.notifications")}
            </p>
          </div>

          <div className="max-h-[26rem] space-y-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-neutral-500">
                {t("nav.noNotifications")}
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = notificationIconMap[notification.type];
                return (
                  <Link
                    key={notification.id}
                    href={notification.href ?? "/profile"}
                    onClick={() => setOpen(false)}
                    className="flex gap-3 rounded-xl px-3 py-3 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {locale === "en"
                            ? notification.titleEn
                            : notification.titleBn}
                        </p>
                        <span className="shrink-0 text-[11px] text-neutral-400">
                          {locale === "en"
                            ? notification.timeEn
                            : notification.timeBn}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-300">
                        {locale === "en"
                          ? notification.messageEn
                          : notification.messageBn}
                      </p>
                      {notification.href ? (
                        <span className="mt-2 inline-flex text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                          {t("nav.viewDetails")}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
