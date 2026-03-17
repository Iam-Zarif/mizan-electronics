import type { AuthUser } from "@/lib/auth";

export type ServiceHistoryStatus = "completed" | "upcoming" | "pending";
export type PaymentStatus = "paid" | "partial" | "unpaid";

export type InvoiceLineItem = {
  descriptionBn: string;
  descriptionEn: string;
  qty: number;
  unitPrice: number;
  total: number;
};

export type ProfileServiceHistory = {
  id: string;
  titleBn: string;
  titleEn: string;
  status: ServiceHistoryStatus;
  dateBn: string;
  dateEn: string;
  invoice: string;
  noteBn: string;
  noteEn: string;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  subtotal: number;
  due: number;
  addressBn: string;
  addressEn: string;
  dueDateBn: string;
  dueDateEn: string;
  items: InvoiceLineItem[];
};

export type ProfileNotification = {
  id: string;
  type: "service" | "billing" | "verification";
  titleBn: string;
  titleEn: string;
  messageBn: string;
  messageEn: string;
  timeBn: string;
  timeEn: string;
  href?: string;
  unread?: boolean;
};

export const staticProfileServices: ProfileServiceHistory[] = [
  {
    id: "svc-1",
    titleBn: "ডিপ এসি ক্লিনিং",
    titleEn: "Deep AC Cleaning",
    status: "completed",
    dateBn: "12 মার্চ 2026",
    dateEn: "12 Mar 2026",
    invoice: "INV-2026-0142",
    noteBn: "পরবর্তী সার্ভিস রিমাইন্ডার ৪ মাস পর দেখানো হবে।",
    noteEn: "Next maintenance reminder will appear after 4 months.",
    paymentStatus: "paid",
    amountPaid: 2800,
    subtotal: 2800,
    due: 0,
    addressBn: "উত্তরা সেক্টর ৭, ঢাকা",
    addressEn: "Uttara Sector 7, Dhaka",
    dueDateBn: "12 মার্চ 2026",
    dueDateEn: "12 Mar 2026",
    items: [
      {
        descriptionBn: "ডিপ এসি ক্লিনিং ও ব্লোয়ার সার্ভিস",
        descriptionEn: "Deep AC Cleaning and blower service",
        qty: 1,
        unitPrice: 2800,
        total: 2800,
      },
    ],
  },
  {
    id: "svc-2",
    titleBn: "এসি গ্যাস রিফিল",
    titleEn: "AC Gas Refill",
    status: "completed",
    dateBn: "03 জানুয়ারি 2026",
    dateEn: "03 Jan 2026",
    invoice: "INV-2026-0026",
    noteBn: "পারফরম্যান্স স্থিতিশীল। প্রেশার চেক সম্পন্ন হয়েছে।",
    noteEn: "Performance is stable. Pressure check completed.",
    paymentStatus: "partial",
    amountPaid: 1500,
    subtotal: 2600,
    due: 1100,
    addressBn: "মিরপুর ১০, ঢাকা",
    addressEn: "Mirpur 10, Dhaka",
    dueDateBn: "05 জানুয়ারি 2026",
    dueDateEn: "05 Jan 2026",
    items: [
      {
        descriptionBn: "গ্যাস রিফিল ও প্রেসার ক্যালিব্রেশন",
        descriptionEn: "Gas refill and pressure calibration",
        qty: 1,
        unitPrice: 2600,
        total: 2600,
      },
    ],
  },
  {
    id: "svc-3",
    titleBn: "বেসিক এসি মেইনটেন্যান্স",
    titleEn: "Basic AC Maintenance",
    status: "upcoming",
    dateBn: "আগামী মাস",
    dateEn: "Next month",
    invoice: "—",
    noteBn: "এই অংশটি পরে অ্যাডমিন-লিঙ্কড সার্ভিস হিস্ট্রি থেকে পূরণ হবে।",
    noteEn: "This section will later be populated from admin-linked service history.",
    paymentStatus: "unpaid",
    amountPaid: 0,
    subtotal: 1200,
    due: 1200,
    addressBn: "বনানী, ঢাকা",
    addressEn: "Banani, Dhaka",
    dueDateBn: "সার্ভিস শেষে",
    dueDateEn: "After service",
    items: [
      {
        descriptionBn: "বেসিক মেইনটেন্যান্স",
        descriptionEn: "Basic maintenance",
        qty: 1,
        unitPrice: 1200,
        total: 1200,
      },
    ],
  },
];

export const getProfileNotifications = (
  user: AuthUser | null | undefined,
): ProfileNotification[] => {
  const notifications: ProfileNotification[] = [
    {
      id: "notif-service-complete",
      type: "service",
      titleBn: "সার্ভিস সম্পন্ন হয়েছে",
      titleEn: "Service completed",
      messageBn:
        "আপনার ডিপ এসি ক্লিনিং সম্পন্ন হয়েছে। ডিটেইলস দেখতে আমার সার্ভিসসমূহ ভিজিট করুন।",
      messageEn:
        "Your Deep AC Cleaning is complete. Visit My Services to view the details.",
      timeBn: "২ ঘণ্টা আগে",
      timeEn: "2 hours ago",
      href: "/profile",
      unread: true,
    },
    {
      id: "notif-invoice-added",
      type: "billing",
      titleBn: "নতুন ইনভয়েস যোগ হয়েছে",
      titleEn: "New invoice added",
      messageBn:
        "এসি গ্যাস রিফিল সার্ভিসের ইনভয়েস যোগ করা হয়েছে। চাইলে এখনই PDF ডাউনলোড করতে পারেন।",
      messageEn:
        "An invoice was added for your AC Gas Refill service. You can download the PDF now.",
      timeBn: "আজ",
      timeEn: "Today",
      href: "/profile",
    },
  ];

  if (user && !user.isVerified) {
    notifications.unshift({
      id: "notif-verify-warning",
      type: "verification",
      titleBn: "ইমেইল ভেরিফিকেশন জরুরি",
      titleEn: "Email verification required",
      messageBn:
        "আপনার অ্যাকাউন্ট ভেরিফাই করতে ২৪ ঘণ্টা বাকি। এরপর অ্যাকাউন্ট মুছে যেতে পারে।",
      messageEn:
        "You have 24 hours left to verify your account before it may be removed.",
      timeBn: "এখনই",
      timeEn: "Now",
      href: "/profile",
      unread: true,
    });
  }

  return notifications;
};
