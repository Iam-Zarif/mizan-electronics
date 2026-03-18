"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useProvider } from "@/Providers/AuthProviders";
import { isAdminUser } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { adminLabels, sidebarSections } from "@/lib/admin-dashboard";
import {
  getAdminBookings,
  getAdminCustomers,
  getAdminNotifications,
  getAdminPackages,
  getAdminServices,
  getAdminUsers,
} from "@/lib/dashboard-api";
import { useApiQuery } from "@/hooks/use-api-query";
import { useNotificationSocket } from "@/lib/realtime/notification-socket";
import type { AdminNotificationRow } from "@/lib/dashboard-api";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthLoading, logout } = useProvider();
  const { locale } = useLanguage();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAdminUser(user)) {
      router.replace("/");
    }
  }, [isAuthLoading, router, user]);

  const { data: usersData } = useApiQuery(
    () => getAdminUsers({ search: "", verification: "all", sort: "newest" }),
    [],
    Boolean(user && isAdminUser(user)),
  );
  const { data: bookingsData } = useApiQuery(
    () => getAdminBookings({ search: "", status: "all", sort: "latest" }),
    [],
    Boolean(user && isAdminUser(user)),
  );
  const { data: customersData } = useApiQuery(
    getAdminCustomers,
    [],
    Boolean(user && isAdminUser(user)),
  );
  const { data: notificationsData, setData: setNotificationsData } = useApiQuery(
    () => getAdminNotifications({ filter: "unread", sort: "latest" }),
    [],
    Boolean(user && isAdminUser(user)),
  );
  const { data: servicesData } = useApiQuery(
    () => getAdminServices({ search: "" }),
    [],
    Boolean(user && isAdminUser(user)),
  );
  const { data: packagesData } = useApiQuery(
    () => getAdminPackages({ search: "" }),
    [],
    Boolean(user && isAdminUser(user)),
  );

  useNotificationSocket<AdminNotificationRow>({
    enabled: Boolean(user && isAdminUser(user)),
    onCreatedOrUpdated: (notification) => {
      setNotificationsData((current) => {
        if (!current) return current;
        const unreadOnly = current.rows.filter((item) => item.unread);
        if (!notification.unread) {
          const nextRows = unreadOnly.filter((item) => item._id !== notification._id);
          return {
            rows: nextRows,
            counts: {
              total: nextRows.length,
              unread: nextRows.length,
            },
            pagination: current.pagination,
          };
        }

        const nextRows = unreadOnly.some((item) => item._id === notification._id)
          ? unreadOnly.map((item) => (item._id === notification._id ? notification : item))
          : [notification, ...unreadOnly];

        return {
          rows: nextRows,
          counts: {
            total: nextRows.length,
            unread: nextRows.length,
          },
          pagination: current.pagination,
        };
      });
    },
    onDeleted: (notificationId) => {
      setNotificationsData((current) => {
        if (!current) return current;
        const nextRows = current.rows.filter((item) => item._id !== notificationId);
        return {
          rows: nextRows,
          counts: {
            total: nextRows.length,
            unread: nextRows.length,
          },
          pagination: current.pagination,
        };
      });
    },
  });

  if (isAuthLoading || !isAdminUser(user)) {
    return null;
  }

  const adminUser = user!;

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const sidebarCounts: Record<string, number | undefined> = {
    "/dashboard/bookings": bookingsData?.pagination.totalItems,
    "/dashboard/users": usersData?.counts.total,
    "/dashboard/matching": customersData?.pagination.totalItems,
    "/dashboard/services": servicesData?.counts.totalServices,
    "/dashboard/packages": packagesData?.counts.totalPackages,
    "/dashboard/notifications": notificationsData?.counts.unread,
  };

  return (
    <section className="min-h-screen bg-[#eef3fb] pt-24 pb-10 dark:bg-[#0b1020]">
      <div className="mx-auto flex max-w-7xl gap-5 px-4 lg:px-0">
        <aside className="hidden w-67.5 shrink-0 rounded-[26px] border border-[#e8edf7] bg-white p-5 text-[#1f2638] shadow-[0_30px_70px_-40px_rgba(31,38,56,0.22)] dark:border-white/10 dark:bg-[#1f2638] dark:text-white dark:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.7)] lg:flex lg:h-[calc(100vh-7.5rem)] lg:flex-col lg:sticky lg:top-24">
          <div className="mb-3">
            <h1 className="text-2xl font-extrabold">
              {locale === "en"
                ? adminLabels.shellTitle.en
                : adminLabels.shellTitle.bn}
            </h1>
          </div>

          <div className="space-y-6">
            {sidebarSections.map((section) => (
              <div key={section.titleEn}>
                <div className="mb-3 h-px bg-[#e8edf7] dark:bg-white/10" />
                <div className="space-y-1.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                          active
                            ? "bg-[#eef3fb] text-[#2160ba] dark:bg-white/8 dark:text-white"
                            : "text-[#60708d] hover:bg-[#f5f8fe] hover:text-[#1f2638] dark:text-white/65 dark:hover:bg-white/6 dark:hover:text-white"
                        }`}
                      >
                        <Icon size={16} />
                        <span className="flex-1">
                          {locale === "en" ? item.labelEn : item.labelBn}
                        </span>
                        {typeof sidebarCounts[item.href] === "number" &&
                        sidebarCounts[item.href]! > 0 ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              active
                                ? "bg-[#dbe7ff] text-[#2160ba] dark:bg-white/15 dark:text-white"
                                : "bg-[#f3f6fd] text-[#60708d] dark:bg-white/8 dark:text-white/75"
                            }`}
                          >
                            {sidebarCounts[item.href]}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto space-y-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-[18px] bg-red-500 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <LogOut size={16} />
              <span>{locale === "en" ? "Logout" : "লগআউট"}</span>
            </button>

            <div className="rounded-xl border border-[#e8edf7] bg-[#f8fbff] p-2 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-3">
                {adminUser.avatar?.url ? (
                  <Image
                    src={adminUser.avatar.url}
                    alt={adminUser.f_name}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] text-sm font-bold text-white">
                    {adminUser.f_name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1f2638] dark:text-white">
                    {adminUser.f_name}
                  </p>
                  <p className="truncate text-xs text-[#7f8ba3] dark:text-white/50">
                    {adminUser.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">

          {children}
        </div>
      </div>
    </section>
  );
}
