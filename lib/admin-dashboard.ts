import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BellRing,
  CalendarDays,
  ClipboardList,
  DollarSign,
  FileText,
  LayoutDashboard,
  MailCheck,
  MessageSquareText,
  Settings2,
  ShoppingBag,
  Table2,
  Users,
} from "lucide-react";

export type DashboardLocale = "bn" | "en";

export const topCards = [
  {
    key: "earnings",
    bnTitle: "মোট আয়",
    enTitle: "Total Earnings",
    value: "৳8,500",
    change: "+12.4%",
    icon: DollarSign,
  },
  {
    key: "bookings",
    bnTitle: "মোট বুকিং",
    enTitle: "Total Bookings",
    value: "45",
    change: "+4.3%",
    icon: ShoppingBag,
  },
  {
    key: "services",
    bnTitle: "সম্পন্ন সার্ভিস",
    enTitle: "Completed Services",
    value: "24",
    change: "+2.5%",
    icon: ClipboardList,
  },
  {
    key: "users",
    bnTitle: "মোট ইউজার",
    enTitle: "Total Users",
    value: "124",
    change: "+0.9%",
    icon: Users,
  },
] as const;

export const quickAlerts = [
  {
    key: "terminate",
    tone: "amber",
    count: 4,
    bnLabel: "২৪ ঘণ্টায় টার্মিনেট",
    enLabel: "Terminate in 24h",
    icon: BellRing,
  },
  {
    key: "invoice-links",
    tone: "indigo",
    count: 3,
    bnLabel: "ইনভয়েস লিঙ্ক রেডি",
    enLabel: "Invoice links ready",
    icon: FileText,
  },
] as const;

export const sidebarSections: Array<{
  titleBn: string;
  titleEn: string;
  items: Array<{
    href: string;
    labelBn: string;
    labelEn: string;
    icon: LucideIcon;
    count?: number;
  }>;
}> = [
  {
    titleBn: "মেনু",
    titleEn: "Menu",
    items: [
      {
        href: "/dashboard",
        labelBn: "ড্যাশবোর্ড",
        labelEn: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        href: "/dashboard/bookings",
        labelBn: "রিকুয়েস্টেড বুকিং",
        labelEn: "Requested Bookings",
        icon: ShoppingBag,
        count: 3,
      },
      {
        href: "/dashboard/users",
        labelBn: "সকল ইউজার",
        labelEn: "All Users",
        icon: Users,
        count: 4,
      },
      {
        href: "/dashboard/matching",
        labelBn: "সার্ভিস নেওয়া কাস্টমার",
        labelEn: "Purchased Customers",
        icon: BadgeCheck,
        count: 3,
      },
    ],
  },
  {
    titleBn: "ম্যানেজ",
    titleEn: "Manage",
    items: [
      {
        href: "/dashboard/calendar",
        labelBn: "ক্যালেন্ডার",
        labelEn: "Calendar",
        icon: CalendarDays,
      },
      {
        href: "/dashboard/tables",
        labelBn: "টেবিলস",
        labelEn: "Tables",
        icon: Table2,
      },
      {
        href: "/dashboard/invoices",
        labelBn: "ইনভয়েস",
        labelEn: "Invoice",
        icon: FileText,
      },
      {
        href: "/dashboard/messages",
        labelBn: "মেসেজেস",
        labelEn: "Messages",
        icon: MessageSquareText,
      },
    ],
  },
  {
    titleBn: "সিস্টেম",
    titleEn: "System",
    items: [
      {
        href: "/dashboard/alerts",
        labelBn: "অ্যালার্ট",
        labelEn: "Alerts",
        icon: BellRing,
      },
      {
        href: "/dashboard/settings",
        labelBn: "সেটিংস",
        labelEn: "Settings",
        icon: Settings2,
      },
    ],
  },
];

export const monthlyRevenue = [32, 25, 38, 33, 49, 41, 56, 44, 52, 39, 46, 58];
export const weeklyProfit = [54, 63, 58, 70, 37, 66, 78];

export const pendingBookings = [
  {
    name: "সুমন আহমেদ",
    nameEn: "Sumon Ahmed",
    phone: "01949-397234",
    serviceBn: "স্প্লিট এসি ইনস্টলেশন",
    serviceEn: "Split AC Installation",
    statusBn: "কলব্যাক বাকি",
    statusEn: "Need callback",
  },
  {
    name: "নুসরাত জাহান",
    nameEn: "Nusrat Jahan",
    phone: "01711-220011",
    serviceBn: "ডিপ এসি ক্লিনিং",
    serviceEn: "Deep AC Cleaning",
    statusBn: "রিভিউ অপেক্ষমাণ",
    statusEn: "Waiting review",
  },
  {
    name: "আরিফুল ইসলাম",
    nameEn: "Ariful Islam",
    phone: "01816-880044",
    serviceBn: "এসি শিফটিং সার্ভিস",
    serviceEn: "AC Shifting Service",
    statusBn: "লোকেশন কনফার্ম বাকি",
    statusEn: "Awaiting location confirmation",
  },
] as const;

export const allUsers = [
  {
    name: "সুমন আহমেদ",
    nameEn: "Sumon Ahmed",
    email: "sumon@gmail.com",
    phone: "01949-397234",
    verified: true,
    completedServices: 3,
    joinedAt: "2026-03-15T10:30:00.000Z",
    totalSpent: 8500,
  },
  {
    name: "নুসরাত জাহান",
    nameEn: "Nusrat Jahan",
    email: "nusrat@gmail.com",
    phone: "01711-220011",
    verified: false,
    completedServices: 0,
    joinedAt: "2026-03-17T14:20:00.000Z",
    totalSpent: 0,
  },
  {
    name: "আরিফুল ইসলাম",
    nameEn: "Ariful Islam",
    email: "ariful@gmail.com",
    phone: "01816-880044",
    verified: true,
    completedServices: 1,
    joinedAt: "2026-03-16T08:15:00.000Z",
    totalSpent: 3200,
  },
  {
    name: "সাদিয়া ইসলাম",
    nameEn: "Sadia Islam",
    email: "sadia@gmail.com",
    phone: "01610-300400",
    verified: true,
    completedServices: 2,
    joinedAt: "2026-03-14T18:45:00.000Z",
    totalSpent: 6400,
  },
] as const;

export const completedMatches = [
  {
    phone: "01888-552244",
    nameBn: "মো. রাশেদ",
    nameEn: "Md. Rashed",
    serviceBn: "এসি গ্যাস রিফিল",
    serviceEn: "AC Gas Refill",
    stateBn: "প্রোফাইলে লিঙ্ক করা যাবে",
    stateEn: "Can link to profile",
  },
  {
    phone: "01610-300400",
    nameBn: "সাদিয়া ইসলাম",
    nameEn: "Sadia Islam",
    serviceBn: "জেট ওয়াশ এসি ক্লিনিং",
    serviceEn: "Jet Wash AC Cleaning",
    stateBn: "ইমেইল/ফোন মিলিয়ে দেখা বাকি",
    stateEn: "Awaiting email/phone match",
  },
  {
    phone: "01722-662211",
    nameBn: "নাইম হোসেন",
    nameEn: "Naim Hossain",
    serviceBn: "ডিপ এসি ক্লিনিং",
    serviceEn: "Deep AC Cleaning",
    stateBn: "ইনভয়েস তৈরি হলে ইউজারের সার্ভিসে যোগ হবে",
    stateEn: "Will attach to user once invoice is generated",
  },
] as const;

export const overviewMetrics = [
  {
    bnTitle: "ভেরিফাইড ইউজার",
    enTitle: "Verified Users",
    value: "89 / 124",
  },
  {
    bnTitle: "পেন্ডিং বুকিং",
    enTitle: "Pending Bookings",
    value: "18",
  },
  {
    bnTitle: "কালেকশন রেট",
    enTitle: "Collection Rate",
    value: "89%",
  },
] as const;

export const adminLabels = {
  shellTitle: { bn: "অ্যাডমিন প্যানেল", en: "Admin Panel" },
  shellSubtitle: {
    bn: "বাম নেভিগেশন থেকে প্রতিটি অ্যাডমিন সেকশন আলাদা পেজে দেখা যাবে।",
    en: "Every admin section is available as a separate page from the left navigation.",
  },
};
