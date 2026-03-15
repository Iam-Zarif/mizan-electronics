"use client";

import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";

type Locale = "bn" | "en";

interface TranslationDict {
  [key: string]: string | TranslationDict;
}

const translations: Record<Locale, TranslationDict> = {
  bn: {
    nav: {
      home: "হোম",
      services: "সার্ভিস",
      account: "অ্যাকাউন্ট",
      login: "লগইন",
      language: "ভাষা",
    },
    footer: {
      tagline: "বিশ্বস্ত এসি বিক্রয়, ইনস্টলেশন ও সার্ভিসিং একসাথে।",
      navigation: "ন্যাভিগেশন",
      follow: "ফলো করুন",
      rights: "সকল অধিকার সংরক্ষিত।",
    },
    hero: {
      badge: "১০+ বছরের অভিজ্ঞতা",
      title: "ঢাকায় প্রফেশনাল এসি সার্ভিসিং",
      subtitle:
        "অফিস, বাসা ও বাণিজ্যিক জায়গার জন্য প্রশিক্ষিত টেকনিশিয়ান, দ্রুত সাড়া ও গ্যারান্টি সহ পরিষেবা।",
      primary: "সার্ভিস বুক করুন",
      secondary: "হোয়াটসঅ্যাপে যোগাযোগ",
      stats_services: "সম্পন্ন সার্ভিস",
      stats_clients: "ক্লায়েন্ট",
      stats_rating: "গড় রেটিং",
    },
    sections: {
      categoriesTitle: "এসি সার্ভিসিং ক্যাটাগরি",
      categoriesSubtitle: "ক্যাটাগরি অনুযায়ী সার্ভিস বেছে নিন",
      topTitle: "আমাদের জনপ্রিয় এসি সার্ভিসগুলো",
      allTitle: "সব সার্ভিস এক ক্লিকে বুক করুন",
      allSubtitle: "এলাকা ভেদে দাম কম-বেশি হতে পারে।",
      allShowMore: "সব সার্ভিস দেখুন",
      testimonialsTitle: "গ্রাহকদের অভিজ্ঞতা",
      testimonialsSubtitle: "অনুমোদিত রিভিউ ও ফিডব্যাক—আপনার বিশ্বাসই আমাদের শক্তি।",
    },
  },
  en: {
    nav: {
      home: "Home",
      services: "Services",
      account: "Account",
      login: "Login",
      language: "Language",
    },
    footer: {
      tagline: "Trusted AC sales, installation and servicing together.",
      navigation: "Navigation",
      follow: "Follow Us",
      rights: "All rights reserved.",
    },
    hero: {
      badge: "10+ years experience",
      title: "Professional AC Servicing in Dhaka",
      subtitle:
        "Trained technicians for homes and offices with quick response and guaranteed quality.",
      primary: "Book Service",
      secondary: "Chat on WhatsApp",
      stats_services: "Services done",
      stats_clients: "Clients",
      stats_rating: "Avg rating",
    },
    sections: {
      categoriesTitle: "AC Servicing Categories",
      categoriesSubtitle: "Pick the right service category for your need",
      topTitle: "Popular AC Services",
      allTitle: "Book any service in one click",
      allSubtitle: "Prices may vary by area.",
      allShowMore: "View all services",
      testimonialsTitle: "Customer Experiences",
      testimonialsSubtitle: "Approved reviews and feedback—your trust is our strength.",
    },
  },
};

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getNested(path: string, dict: TranslationDict): string {
  return path.split(".").reduce<string | TranslationDict>((acc, key) => {
    if (typeof acc === "string") return acc;
    return acc[key] ?? path;
  }, dict) as string;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("bn");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("mizan-lang");
    if (stored === "bn" || stored === "en") {
      setTimeout(() => setLocale(stored as Locale), 0);
    }
    setTimeout(() => setHydrated(true), 0);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hydrated) return;
    localStorage.setItem("mizan-lang", locale);
    document.documentElement.lang = locale;
  }, [locale, hydrated]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (path: string) => getNested(path, translations[locale]),
    }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
