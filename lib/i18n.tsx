"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useProvider } from "@/Providers/AuthProviders";

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
      dashboard: "ড্যাশবোর্ড",
      notifications: "নোটিফিকেশন",
      noNotifications: "এখনও কোনো নোটিফিকেশন নেই",
      viewDetails: "ডিটেইলস দেখুন",
      language: "ভাষা",
    },
    footer: {
      tagline: "বিশ্বস্ত এসি বিক্রয়, ইনস্টলেশন ও সার্ভিসিং একসাথে।",
      navigation: "ন্যাভিগেশন",
      follow: "ফলো করুন",
      rights: "সকল অধিকার সংরক্ষিত।",
    },
    profile: {
      title: "আমার অ্যাকাউন্ট",
      verified: "ভেরিফাইড",
      notVerified: "নট-ভেরিফাইড",
      admin: "অ্যাডমিন",
      account: "অ্যাকাউন্ট",
      email: "ইমেইল",
      phone: "ফোন",
      addPhone: "আপনার ফোন নম্বর যোগ করুন",
      editProfile: "প্রোফাইল এডিট করুন",
      cancel: "বাতিল",
      logout: "লগআউট",
      fullName: "পূর্ণ নাম",
      phoneNumber: "ফোন নম্বর",
      darkMode: "ডার্ক মোড",
      lightMode: "লাইট মোড",
      saveChanges: "পরিবর্তন সেভ করুন",
      saving: "সেভ হচ্ছে...",
      confirmPhoto: "ছবি নিশ্চিত করুন",
      cancelPreview: "প্রিভিউ বাতিল",
      uploading: "আপলোড হচ্ছে...",
      uploadImageSuccess: "প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে",
      updateProfileSuccess: "প্রোফাইল সফলভাবে আপডেট হয়েছে",
      updateProfileFailed: "প্রোফাইল আপডেট করা যায়নি",
      uploadAvatarFailed: "প্রোফাইল ছবি আপলোড করা যায়নি",
      logoutFailed: "লগআউট করা যায়নি",
      savedAddresses: "সংরক্ষিত ঠিকানা",
      addressSubtitle: "আপনার সার্ভিস লোকেশন ও যোগাযোগের তথ্য ম্যানেজ করুন।",
      noAddresses: "এখনও কোনো ঠিকানা সংরক্ষণ করা হয়নি।",
      newAddress: "নতুন ঠিকানা",
      default: "ডিফল্ট",
      openMap: "ম্যাপ খুলুন",
      edit: "এডিট",
      remove: "মুছুন",
      addAddress: "ঠিকানা যোগ করুন",
      editAddress: "ঠিকানা এডিট করুন",
      addressHelper:
        "সঠিক সার্ভিস কভারেজের জন্য ঢাকা বিভাগের জেলা ও এরিয়া নির্বাচন করুন।",
      addressLabel: "ঠিকানার নাম",
      addressLabelPlaceholder: "বাসা / অফিস / সার্ভিস পয়েন্ট",
      addressType: "ঠিকানার ধরন",
      home: "বাসা",
      office: "অফিস",
      other: "অন্যান্য",
      division: "বিভাগ",
      district: "জেলা",
      area: "এরিয়া / উপজেলা",
      loadingDistricts: "জেলা লোড হচ্ছে...",
      selectDistrict: "জেলা নির্বাচন করুন",
      loadingAreas: "এরিয়া লোড হচ্ছে...",
      selectArea: "এরিয়া নির্বাচন করুন",
      detailedAddress: "বিস্তারিত ঠিকানা",
      detailedAddressPlaceholder: "বাড়ি, রোড, ব্লক, ল্যান্ডমার্ক",
      mapLink: "গুগল ম্যাপ লিংক (অপশনাল)",
      setDefaultAddress: "ডিফল্ট ঠিকানা হিসেবে সেট করুন",
      saveAddress: "ঠিকানা সেভ করুন",
      updateAddress: "ঠিকানা আপডেট করুন",
      addressAdded: "ঠিকানা সফলভাবে যোগ হয়েছে",
      addressUpdated: "ঠিকানা সফলভাবে আপডেট হয়েছে",
      addressRemoved: "ঠিকানা সফলভাবে মুছে ফেলা হয়েছে",
      addressSaveFailed: "ঠিকানা সেভ করা যায়নি",
      addressDeleteFailed: "ঠিকানা মুছে ফেলা যায়নি",
      completeAddressFields: "প্রয়োজনীয় সব ঠিকানার তথ্য পূরণ করুন",
      loadDhakaDistrictsFailed: "ঢাকা বিভাগের জেলা লোড করা যায়নি",
      loadAreasFailed: "এরিয়া লোড করা যায়নি",
      loadAddressLocationFailed: "ঠিকানার লোকেশন ডাটা লোড করা যায়নি",
      phoneRequiredForBooking:
        "সার্ভিস বুক করার আগে প্রোফাইল থেকে আপনার ফোন নম্বর যোগ করুন।",
      verificationRequiredForBooking:
        "সার্ভিস বুক করার আগে আপনার ইমেইল ভেরিফাই করুন।",
      verificationBanner:
        "ইমেইল ভেরিফাই করুন। ১০ দিনের মধ্যে ভেরিফাই না করলে অ্যাকাউন্ট স্বয়ংক্রিয়ভাবে মুছে যাবে।",
      verifyNow: "ভেরিফাই করুন",
      verificationModalTitle: "ইমেইল ভেরিফিকেশন",
      verificationModalSubtitle:
        "এই কোডটি পাঠানো হয়েছে",
      verificationCode: "ওটিপি কোড",
      verificationCodePlaceholder: "৬ সংখ্যার কোড লিখুন",
      verificationSent: "ভেরিফিকেশন কোড পাঠানো হয়েছে",
      verificationResent: "নতুন ভেরিফিকেশন কোড পাঠানো হয়েছে",
      verificationTimer: "সময় বাকি",
      verificationExpired: "কোডের সময় শেষ হয়েছে",
      resendCode: "আবার পাঠান",
      verifying: "ভেরিফাই হচ্ছে...",
      verifySubmit: "ভেরিফাই সাবমিট",
      verificationSuccess: "ইমেইল সফলভাবে ভেরিফাই হয়েছে",
      verificationFailed: "ইমেইল ভেরিফাই করা যায়নি",
      sendVerificationFailed: "ভেরিফিকেশন কোড পাঠানো যায়নি",
      profileTab: "প্রোফাইল ইনফরমেশন",
      servicesTab: "আমার সার্ভিসসমূহ",
      servicesTitle: "আমার সার্ভিসসমূহ",
      servicesSubtitle:
        "সম্পন্ন সার্ভিস, ইনভয়েস ও পরবর্তী রক্ষণাবেক্ষণের তথ্য এখানে দেখা যাবে।",
      noServicesTitle: "এখনও কোনো সার্ভিস যুক্ত হয়নি",
      noServicesDescription:
        "অ্যাডমিন সম্পন্ন সার্ভিস যুক্ত করলে এটি আপনার প্রোফাইলে দেখা যাবে।",
      serviceStatusCompleted: "সম্পন্ন",
      serviceStatusUpcoming: "আসন্ন রিমাইন্ডার",
      serviceStatusPending: "অপেক্ষমাণ",
      serviceInvoice: "ইনভয়েস",
      serviceDate: "তারিখ",
      serviceNote: "নোট",
      paymentStatus: "পেমেন্ট স্ট্যাটাস",
      paymentPaid: "পেইড",
      paymentPartial: "আংশিক পেইড",
      paymentUnpaid: "আনপেইড",
      amountPaid: "পরিশোধিত",
      dueAmount: "বাকি",
      downloadPdf: "PDF ডাউনলোড",
      invoiceDownloading: "PDF তৈরি হচ্ছে...",
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
      dashboard: "Dashboard",
      notifications: "Notifications",
      noNotifications: "No notifications yet",
      viewDetails: "View details",
      language: "Language",
    },
    footer: {
      tagline: "Trusted AC sales, installation and servicing together.",
      navigation: "Navigation",
      follow: "Follow Us",
      rights: "All rights reserved.",
    },
    profile: {
      title: "My Account",
      verified: "Verified",
      notVerified: "Not Verified",
      admin: "Admin",
      account: "Account",
      email: "Email",
      phone: "Phone",
      addPhone: "Add your phone number",
      editProfile: "Edit Profile",
      cancel: "Cancel",
      logout: "Logout",
      fullName: "Full name",
      phoneNumber: "Phone number",
      darkMode: "Dark mode",
      lightMode: "Light mode",
      saveChanges: "Save Changes",
      saving: "Saving...",
      confirmPhoto: "Confirm Photo",
      cancelPreview: "Cancel Preview",
      uploading: "Uploading...",
      uploadImageSuccess: "Profile image updated successfully",
      updateProfileSuccess: "Profile updated successfully",
      updateProfileFailed: "Failed to update profile",
      uploadAvatarFailed: "Failed to upload avatar",
      logoutFailed: "Failed to logout",
      savedAddresses: "Saved Addresses",
      addressSubtitle: "Manage your service locations and contact details.",
      noAddresses: "No addresses saved yet.",
      newAddress: "New Address",
      default: "Default",
      openMap: "Open map",
      edit: "Edit",
      remove: "Remove",
      addAddress: "Add Address",
      editAddress: "Edit Address",
      addressHelper:
        "Select Dhaka division district and area for accurate service coverage.",
      addressLabel: "Address label",
      addressLabelPlaceholder: "Home / Office / Service point",
      addressType: "Address type",
      home: "Home",
      office: "Office",
      other: "Other",
      division: "Division",
      district: "District",
      area: "Area / Upazila",
      loadingDistricts: "Loading districts...",
      selectDistrict: "Select district",
      loadingAreas: "Loading areas...",
      selectArea: "Select area",
      detailedAddress: "Detailed address",
      detailedAddressPlaceholder: "House, road, block, landmark",
      mapLink: "Google Maps link (optional)",
      setDefaultAddress: "Set as default address",
      saveAddress: "Save Address",
      updateAddress: "Update Address",
      addressAdded: "Address added successfully",
      addressUpdated: "Address updated successfully",
      addressRemoved: "Address removed successfully",
      addressSaveFailed: "Failed to save address",
      addressDeleteFailed: "Failed to delete address",
      completeAddressFields: "Please complete all required address fields",
      loadDhakaDistrictsFailed: "Failed to load Dhaka districts",
      loadAreasFailed: "Failed to load areas",
      loadAddressLocationFailed: "Failed to load address location data",
      phoneRequiredForBooking:
        "Please add your phone number in profile before booking a service.",
      verificationRequiredForBooking:
        "Please verify your email before booking a service.",
      verificationBanner:
        "Verify your email. Unverified accounts are automatically deleted after 10 days.",
      verifyNow: "Verify now",
      verificationModalTitle: "Email Verification",
      verificationModalSubtitle: "A code has been sent to",
      verificationCode: "OTP code",
      verificationCodePlaceholder: "Enter the 6-digit code",
      verificationSent: "Verification code sent",
      verificationResent: "Verification code resent",
      verificationTimer: "Time left",
      verificationExpired: "Code expired",
      resendCode: "Resend code",
      verifying: "Verifying...",
      verifySubmit: "Submit verification",
      verificationSuccess: "Email verified successfully",
      verificationFailed: "Failed to verify email",
      sendVerificationFailed: "Failed to send verification code",
      profileTab: "Profile Information",
      servicesTab: "My Services",
      servicesTitle: "My Services",
      servicesSubtitle:
        "Completed services, invoices, and future maintenance details will appear here.",
      noServicesTitle: "No services added yet",
      noServicesDescription:
        "Once admin links a completed service, it will appear in your profile here.",
      serviceStatusCompleted: "Completed",
      serviceStatusUpcoming: "Upcoming reminder",
      serviceStatusPending: "Pending",
      serviceInvoice: "Invoice",
      serviceDate: "Date",
      serviceNote: "Note",
      paymentStatus: "Payment status",
      paymentPaid: "Paid",
      paymentPartial: "Partial paid",
      paymentUnpaid: "Unpaid",
      amountPaid: "Amount paid",
      dueAmount: "Due amount",
      downloadPdf: "Download PDF",
      invoiceDownloading: "Generating PDF...",
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
  setLocale: (locale: Locale) => Promise<void>;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const GUEST_LANGUAGE_EVENT = "mizan:guest-language";

function getNested(path: string, dict: TranslationDict): string {
  return path.split(".").reduce<string | TranslationDict>((acc, key) => {
    if (typeof acc === "string") return acc;
    return acc[key] ?? path;
  }, dict) as string;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user, languagePreference, setLanguagePreference } = useProvider();
  const guestLocale = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => undefined;
      }

      const handleStorage = (event: StorageEvent) => {
        if (event.key === "mizan-lang") {
          onStoreChange();
        }
      };
      const handleGuestLanguage = () => onStoreChange();

      window.addEventListener("storage", handleStorage);
      window.addEventListener(GUEST_LANGUAGE_EVENT, handleGuestLanguage);
      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(GUEST_LANGUAGE_EVENT, handleGuestLanguage);
      };
    },
    (): Locale => (window.localStorage.getItem("mizan-lang") === "en" ? "en" : "bn"),
    (): Locale => "bn",
  );
  const locale = user ? (languagePreference === "en" ? "en" : "bn") : guestLocale;

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("mizan-lang", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const handleSetLocale = useCallback(async (nextLocale: Locale) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mizan-lang", nextLocale);
      window.dispatchEvent(new Event(GUEST_LANGUAGE_EVENT));
    }

    if (user) {
      await setLanguagePreference(nextLocale);
    }
  }, [setLanguagePreference, user]);

  const value = useMemo(
    () => ({
      locale,
      setLocale: handleSetLocale,
      t: (path: string) => getNested(path, translations[locale]),
    }),
    [handleSetLocale, locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
