import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BellDot,
  BellRing,
  Blocks,
  ClipboardList,
  DollarSign,
  FileText,
  Gift,
  LayoutDashboard,
  PhoneCall,
  Settings2,
  ShoppingBag,
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
      },
      {
        href: "/dashboard/users",
        labelBn: "সকল ইউজার",
        labelEn: "All Users",
        icon: Users,
      },
      {
        href: "/dashboard/matching",
        labelBn: "সার্ভিস নেওয়া কাস্টমার",
        labelEn: "Purchased Customers",
        icon: BadgeCheck,
      },
      {
        href: "/dashboard/services",
        labelBn: "মোট সার্ভিস",
        labelEn: "Total Services",
        icon: Blocks,
      },
      {
        href: "/dashboard/packages",
        labelBn: "কম্বো প্যাকেজ",
        labelEn: "Combo Packages",
        icon: Gift,
      },
    ],
  },
  {
    titleBn: "ম্যানেজ",
    titleEn: "Manage",
    items: [
      {
        href: "/dashboard/invoices",
        labelBn: "ইনভয়েস",
        labelEn: "Invoice",
        icon: FileText,
      },
      {
        href: "/dashboard/notifications",
        labelBn: "নোটিফিকেশন",
        labelEn: "Notifications",
        icon: BellDot,
      },
      {
        href: "/dashboard/contact-clicks",
        labelBn: "কল হিস্টোরি",
        labelEn: "Call History",
        icon: PhoneCall,
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
    requestedAt: "2026-03-18T09:30:00.000Z",
  },
  {
    name: "নুসরাত জাহান",
    nameEn: "Nusrat Jahan",
    phone: "01711-220011",
    serviceBn: "ডিপ এসি ক্লিনিং",
    serviceEn: "Deep AC Cleaning",
    statusBn: "রিভিউ অপেক্ষমাণ",
    statusEn: "Waiting review",
    requestedAt: "2026-03-17T15:10:00.000Z",
  },
  {
    name: "আরিফুল ইসলাম",
    nameEn: "Ariful Islam",
    phone: "01816-880044",
    serviceBn: "এসি শিফটিং সার্ভিস",
    serviceEn: "AC Shifting Service",
    statusBn: "লোকেশন কনফার্ম বাকি",
    statusEn: "Awaiting location confirmation",
    requestedAt: "2026-03-16T11:45:00.000Z",
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

export const userPurchaseHistory = {
  "sumon@gmail.com": [
    {
      id: "sumon-1",
      serviceBn: "স্প্লিট এসি ইনস্টলেশন",
      serviceEn: "Split AC Installation",
      invoiceNo: "INV-101",
      amount: "৳4,500",
      paymentStatus: "paid",
      purchasedAt: "2026-03-15T11:30:00.000Z",
      addressBn: "উত্তরা সেক্টর ৭, ঢাকা",
      addressEn: "Uttara Sector 7, Dhaka",
    },
    {
      id: "sumon-2",
      serviceBn: "ডিপ এসি ক্লিনিং",
      serviceEn: "Deep AC Cleaning",
      invoiceNo: "INV-118",
      amount: "৳2,200",
      paymentStatus: "paid",
      purchasedAt: "2026-03-16T15:00:00.000Z",
      addressBn: "উত্তরা সেক্টর ৭, ঢাকা",
      addressEn: "Uttara Sector 7, Dhaka",
    },
    {
      id: "sumon-3",
      serviceBn: "এসি পারফরম্যান্স চেক",
      serviceEn: "AC Performance Check",
      invoiceNo: "INV-126",
      amount: "৳1,800",
      paymentStatus: "partial",
      purchasedAt: "2026-03-18T18:20:00.000Z",
      addressBn: "উত্তরা সেক্টর ৭, ঢাকা",
      addressEn: "Uttara Sector 7, Dhaka",
    },
  ],
  "nusrat@gmail.com": [],
  "ariful@gmail.com": [
    {
      id: "ariful-1",
      serviceBn: "এসি শিফটিং সার্ভিস",
      serviceEn: "AC Shifting Service",
      invoiceNo: "INV-132",
      amount: "৳3,200",
      paymentStatus: "due",
      purchasedAt: "2026-03-16T12:15:00.000Z",
      addressBn: "মিরপুর ডিওএইচএস, ঢাকা",
      addressEn: "Mirpur DOHS, Dhaka",
    },
  ],
  "sadia@gmail.com": [
    {
      id: "sadia-1",
      serviceBn: "জেট ওয়াশ এসি ক্লিনিং",
      serviceEn: "Jet Wash AC Cleaning",
      invoiceNo: "INV-204",
      amount: "৳2,800",
      paymentStatus: "partial",
      purchasedAt: "2026-03-14T19:10:00.000Z",
      addressBn: "বসুন্ধরা আর-এ, ঢাকা",
      addressEn: "Bashundhara R/A, Dhaka",
    },
    {
      id: "sadia-2",
      serviceBn: "এসি গ্যাস রিফিল",
      serviceEn: "AC Gas Refill",
      invoiceNo: "INV-211",
      amount: "৳3,600",
      paymentStatus: "paid",
      purchasedAt: "2026-03-17T16:40:00.000Z",
      addressBn: "বসুন্ধরা আর-এ, ঢাকা",
      addressEn: "Bashundhara R/A, Dhaka",
    },
  ],
} as const;

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
};

export const adminNotifications = [
  {
    id: "notif-1",
    tone: "indigo",
    sectionBn: "বুকিং আপডেট",
    sectionEn: "Booking Updates",
    titleBn: "নতুন বুকিং রিকুয়েস্ট এসেছে",
    titleEn: "New booking request received",
    bodyBn: "সুমন আহমেদ স্প্লিট এসি ইনস্টলেশনের জন্য বুকিং পাঠিয়েছেন।",
    bodyEn: "Sumon Ahmed submitted a booking for split AC installation.",
    actionBn: "বুকিং খুলুন",
    actionEn: "Open booking",
    time: "5 min ago",
    unread: true,
  },
  {
    id: "notif-2",
    tone: "emerald",
    sectionBn: "ইনভয়েস",
    sectionEn: "Invoices",
    titleBn: "ইনভয়েস ইউজার প্রোফাইলে যুক্ত হয়েছে",
    titleEn: "Invoice linked to user profile",
    bodyBn: "INV-211 এখন সাদিয়া ইসলামের সার্ভিস হিস্টরিতে দেখা যাচ্ছে।",
    bodyEn: "INV-211 is now visible in Sadia Islam's service history.",
    actionBn: "ইনভয়েস দেখুন",
    actionEn: "View invoice",
    time: "18 min ago",
    unread: true,
  },
  {
    id: "notif-3",
    tone: "amber",
    sectionBn: "ভেরিফিকেশন",
    sectionEn: "Verification",
    titleBn: "২৪ ঘণ্টার মধ্যে অ্যাকাউন্ট মেয়াদ শেষ হবে",
    titleEn: "Accounts will expire in 24 hours",
    bodyBn: "৪ জন নট-ভেরিফাইড ইউজারকে রিমাইন্ডার পাঠানো প্রয়োজন।",
    bodyEn: "4 non-verified users need a final reminder before expiration.",
    actionBn: "রিমাইন্ডার পাঠান",
    actionEn: "Send reminder",
    time: "32 min ago",
    unread: true,
  },
  {
    id: "notif-4",
    tone: "rose",
    sectionBn: "সিকিউরিটি",
    sectionEn: "Security",
    titleBn: "গিটহাব অ্যাক্সেসে অস্বাভাবিক চেষ্টা ধরা পড়েছে",
    titleEn: "Suspicious GitHub access attempt detected",
    bodyBn: "নতুন ডিভাইস থেকে একাধিক ফেলড সাইন-ইন লোগ রিভিউ করা উচিত।",
    bodyEn: "Multiple failed sign-ins from a new device should be reviewed.",
    actionBn: "লগ দেখুন",
    actionEn: "Review logs",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: "notif-5",
    tone: "sky",
    sectionBn: "কাস্টমার সার্ভিস",
    sectionEn: "Customer Service",
    titleBn: "সার্ভিস সম্পন্ন নোটিফিকেশন পাঠানো বাকি",
    titleEn: "Completed-service notice pending",
    bodyBn: "আরিফুল ইসলামের সার্ভিস সম্পন্ন হয়েছে, কাস্টমার নোটিফিকেশন পাঠান।",
    bodyEn: "Ariful Islam's service is completed. Send the customer notification.",
    actionBn: "নোটিফিকেশন পাঠান",
    actionEn: "Send notification",
    time: "2 hours ago",
    unread: false,
  },
  {
    id: "notif-7",
    tone: "slate",
    sectionBn: "সিস্টেম",
    sectionEn: "System",
    titleBn: "রিয়েলটাইম নোটিফিকেশন চ্যানেল প্রস্তুত",
    titleEn: "Realtime notifications channel is ready",
    bodyBn: "ওয়েবসকেট সংযোগ সক্রিয় হলেই লাইভ ইভেন্ট এই তালিকায় যুক্ত হবে।",
    bodyEn: "Live events will appear in this list once the websocket connection is enabled.",
    actionBn: "সেটআপ দেখুন",
    actionEn: "View setup",
    time: "Just now",
    unread: false,
  },
] as const;
