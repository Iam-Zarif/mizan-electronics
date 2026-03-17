"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BellRing, LayoutDashboard, LogOut, Search } from "lucide-react";
import { useProvider } from "@/Providers/AuthProviders";
import { isAdminUser } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { adminLabels, sidebarSections } from "@/lib/admin-dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
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

  if (isAuthLoading || !isAdminUser(user)) {
    return null;
  }

  const adminUser = user!;

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <section className="min-h-screen bg-[#eef3fb] pt-24 pb-10 dark:bg-[#0b1020]">
      <div className="mx-auto flex max-w-[1500px] gap-5 px-4 lg:px-5">
        <aside className="hidden w-[270px] shrink-0 rounded-[26px] bg-[#1f2638] p-5 text-white shadow-[0_30px_70px_-40px_rgba(0,0,0,0.7)] lg:flex lg:h-[calc(100vh-7.5rem)] lg:flex-col lg:sticky lg:top-24">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold">
              {locale === "en"
                ? adminLabels.shellTitle.en
                : adminLabels.shellTitle.bn}
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/60">
              {locale === "en"
                ? adminLabels.shellSubtitle.en
                : adminLabels.shellSubtitle.bn}
            </p>
          </div>

          <div className="space-y-6">
            {sidebarSections.map((section) => (
              <div key={section.titleEn}>
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  {locale === "en" ? section.titleEn : section.titleBn}
                </p>
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
                            ? "bg-white/8 text-white"
                            : "text-white/65 hover:bg-white/6 hover:text-white"
                        }`}
                      >
                        <Icon size={16} />
                        <span className="flex-1">
                          {locale === "en" ? item.labelEn : item.labelBn}
                        </span>
                        {item.count ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              active
                                ? "bg-white/15 text-white"
                                : "bg-white/8 text-white/75"
                            }`}
                          >
                            {item.count}
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
              className="flex w-full items-center gap-3 rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white/80 transition hover:bg-white/8 hover:text-white"
            >
              <LogOut size={16} />
              <span>{locale === "en" ? "Logout" : "লগআউট"}</span>
            </button>

            <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] text-sm font-bold text-white">
                {adminUser.f_name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {adminUser.f_name}
                </p>
                <p className="truncate text-xs text-white/50">{adminUser.email}</p>
              </div>
            </div>
          </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between gap-4 rounded-[24px] bg-white px-5 py-4 shadow-[0_22px_55px_-40px_rgba(31,38,56,0.35)] dark:bg-[#101729]">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef3fb] text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]">
                <LayoutDashboard size={18} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-[#1f2638] dark:text-white">
                  {locale === "en" ? "Admin Panel" : "অ্যাডমিন প্যানেল"}
                </p>
                <p className="truncate text-sm text-[#7f8ba3] dark:text-[#a7b3c9]">
                  {locale === "en"
                    ? "Manage bookings, users, invoices and alerts."
                    : "বুকিং, ইউজার, ইনভয়েস ও অ্যালার্ট ম্যানেজ করুন।"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full bg-[#f5f8fe] px-4 py-2.5 text-[#8a96ad] dark:bg-white/8 dark:text-[#a7b3c9] lg:flex">
                <Search size={16} />
                <span className="text-sm">
                  {locale === "en" ? "Search panel" : "প্যানেল সার্চ"}
                </span>
              </div>
              <Link
                href="/"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5f8fe] text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]"
              >
                <BellRing size={18} />
              </Link>
            </div>
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}
