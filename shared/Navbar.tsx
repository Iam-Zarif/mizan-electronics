"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { Languages, Sun, Moon, ChevronDown, UserRound, Wrench, Plug, Snowflake, Truck, Cog, Settings } from "lucide-react";
import { GoArrowUpRight } from "react-icons/go";
import { HiMenu, HiX } from "react-icons/hi";
import { HiOutlineHome, HiHome } from "react-icons/hi";
import { MdHomeRepairService, MdOutlineHomeRepairService } from "react-icons/md";
import logo from "@/public/mizan.png";
import { useLanguage } from "@/lib/i18n";

const serviceLinks = [
  { href: "/services", bn: "সব সার্ভিস", en: "All Services", icon: MdOutlineHomeRepairService },
  { href: "/services/category/cleaning-maintenance", bn: "এসি পরিষ্কার ও রক্ষণাবেক্ষণ", en: "AC Cleaning & Maintenance", icon: Wrench },
  { href: "/services/category/installation", bn: "এসি ইনস্টলেশন ও রি-ইনস্টলেশন", en: "AC Installation & Re-Installation", icon: Plug },
  { href: "/services/category/repair", bn: "এসি মেরামত", en: "AC Repair & Troubleshooting", icon: Cog },
  { href: "/services/category/gas", bn: "এসি গ্যাস ও কুলিং সিস্টেম", en: "AC Gas & Cooling System", icon: Snowflake },
  { href: "/services/category/shifting", bn: "এসি শিফটিং ও আনইনস্টল", en: "AC Shifting & Removal", icon: Truck },
  { href: "/services/category/spares", bn: "এসি কম্প্রেসর ও স্পেয়ার পার্টস", en: "AC Compressor & Spares", icon: Settings },
];

const Navbar = () => {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const { locale, setLocale, t } = useLanguage();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <>
      <div className="fixed top-1 lg:top-6 z-50 w-full px-4">
        <div className="mx-auto max-w-7xl">
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between rounded-full  border border-neutral-100 dark:border-white/10 lg:py-2.5 pt-3 pb-2 bg-white/60 px-4 backdrop-blur-xl shadow-lg dark:bg-black/50"
          >
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <Image src={logo} alt="Mizan AC Servicing" width={48} height={48} className="h-auto w-auto" />
              <span className="hidden sm:block font-extrabold tracking-wide bg-linear-to-r from-[#ec4899] via-[#6366f1] to-[#e18b94] bg-clip-text text-transparent">
                Mizan AC Servicing
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 px-5 text-sm">
              <NavItem href="/" label={t("nav.home")} active={pathname === "/"} icon={pathname === "/" ? <HiHome /> : <HiOutlineHome />} />

              <div className="relative">
                <button
                  onClick={() => setOpenServices((p) => !p)}
                  className={`group flex items-center gap-1 rounded-xl px-3 py-2 cursor-pointer transition ${
                    pathname.startsWith("/services")
                      ? "font-extrabold tracking-wide"
                      : "text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  <MdOutlineHomeRepairService className="text-[18px]" />
                  <span>{t("nav.services")}</span>
                  <ChevronDown size={16} className={`transition ${openServices ? "rotate-180" : ""}`} />
                </button>

                {openServices && (
                  <div className="absolute left-0 mt-2 w-120 rounded-2xl border border-neutral-200 bg-white shadow-xl backdrop-blur dark:border-white/10 dark:bg-neutral-900">
                    <div className="p-2 grid gap-1 grid-cols-2">
                      {serviceLinks.map(({ href, bn, en, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                        >
                          <Icon className="text-2xl text-[#6366f1]" />
                          <div className="flex items-center justify-between w-full">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-gray-100">
                              {locale === "en" ? en : bn}
                            </span>
                            <GoArrowUpRight
                              className="text-gray-400 text-lg transition transform group-hover:-rotate-12 group-hover:scale-110"
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setOpenLang((p) => !p)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-gray-700 transition hover:text-black dark:text-gray-200 cursor-pointer"
                >
                  <span>{locale === "bn" ? "🇧🇩 বাংলা" : "🇬🇧 English"}</span>
                  <ChevronDown size={16} className={`transition ${openLang ? "rotate-180" : ""}`} />
                </button>
                {openLang && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-neutral-100/80 bg-white/95 shadow-xl backdrop-blur dark:border-white/10 dark:bg-neutral-900">
                    <button
                      onClick={() => {
                        setLocale("bn");
                        setOpenLang(false);
                      }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                        locale === "bn" ? "font-semibold text-[#6366f1]" : ""
                      }`}
                    >
                      🇧🇩 বাংলা {locale === "bn" ? "✓" : ""}
                    </button>
                    <button
                      onClick={() => {
                        setLocale("en");
                        setOpenLang(false);
                      }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                        locale === "en" ? "font-semibold text-[#6366f1]" : ""
                      }`}
                    >
                      🇬🇧 English {locale === "en" ? "✓" : ""}
                    </button>
                  </div>
                )}
              </div>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth/login"
                className="hidden sm:flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-4 py-2 text-sm font-semibold text-white shadow-sm"
              >
                {t("nav.login")}
              </Link>

              <button
                onClick={() => setDark(!dark)}
                className="rounded-full bg-white/60 p-2 backdrop-blur transition hover:bg-white/80 dark:bg-white/10"
              >
                {dark ? <Sun size={20} className="cursor-pointer" /> : <Moon size={20} className="cursor-pointer" />}
              </button>
            </div>
            <button
              onClick={() => setOpenMobile(true)}
              className={`md:hidden inline-flex items-center justify-center rounded-xl p-2 text-gray-700 hover:text-black dark:text-gray-200 ${
                pathname === "/" ? "bg-[#2160ba]/10" : ""
              }`}
              aria-label="Open menu"
            >
              <HiMenu size={22} />
            </button>
          </motion.header>
        </div>
      </div>


      {openMobile && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden">
          <div className="absolute top-0 right-0 h-full w-72 bg-white dark:bg-neutral-900 shadow-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">মেনু</span>
              <button onClick={() => setOpenMobile(false)} aria-label="Close menu" className="p-2">
                <HiX size={22} />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <Link
                href="/"
                onClick={() => setOpenMobile(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  pathname === "/" ? "border border-[#2160ba]/30 bg-[#2160ba]/5 font-semibold" : ""
                }`}
              >
                {pathname === "/" ? <HiHome className="text-[18px]" /> : <HiOutlineHome className="text-[18px]" />}
                {t("nav.home")}
              </Link>
              {serviceLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpenMobile(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                    pathname.startsWith(item.href) ? "border border-[#2160ba]/30 bg-[#2160ba]/5 font-semibold" : ""
                  }`}
                >
                  <item.icon className="text-[18px]" />
                  {locale === "en" ? item.en : item.bn}
                </Link>
              ))}
              <Link
                href="/auth/login"
                onClick={() => setOpenMobile(false)}
                className="block rounded-lg px-3 py-2 text-center bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] text-white font-semibold hover:opacity-90"
              >
                {t("nav.login")}
              </Link>
              <button
                onClick={() => {
                  setDark(!dark);
                  setOpenMobile(false);
                }}
                className="flex items-center gap-2 w-full rounded-lg px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
                <span>{dark ? (locale === "en" ? "Light mode" : "লাইট মোড") : (locale === "en" ? "Dark mode" : "ডার্ক মোড")}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => {
                  setLocale("bn");
                  setOpenMobile(false);
                }}
                className={`w-full text-left rounded-lg px-3 py-2 ${locale === "bn" ? "bg-neutral-100 dark:bg-neutral-800 font-semibold" : ""}`}
              >
                🇧🇩 বাংলা
              </button>
              <button
                onClick={() => {
                  setLocale("en");
                  setOpenMobile(false);
                }}
                className={`w-full text-left rounded-lg px-3 py-2 ${locale === "en" ? "bg-neutral-100 dark:bg-neutral-800 font-semibold" : ""}`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

const NavItem = ({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) => (
  <Link
    href={href}
    className={`group flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer transition ${
      active ? "font-semibold text-[#6366f1]" : "text-gray-700 hover:text-black dark:text-gray-200"
    }`}
  >
    <span className="text-[18px]">{icon}</span>
    <span className="text-sm">{label}</span>
  </Link>
);
