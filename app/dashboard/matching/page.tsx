"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CircleDollarSign,
  FilePlus2,
  ReceiptText,
  X,
} from "lucide-react";
import { AdminPageHeader, AdminSurface } from "@/components/admin/AdminSections";
import { allUsers, completedMatches } from "@/lib/admin-dashboard";
import { useLanguage } from "@/lib/i18n";

type PaymentStatus = "paid" | "partial" | "due";

type CompletedInvoice = {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  serviceName: string;
  invoiceNo: string;
  amount: string;
  paymentStatus: PaymentStatus;
  note: string;
};

const initialInvoices: CompletedInvoice[] = completedMatches.map((item, index) => {
  const matchedUser = allUsers.find((user) => user.phone === item.phone);

  return {
    id: `${item.phone}-${index}`,
    customerName: matchedUser ? matchedUser.name : item.nameBn,
    phone: item.phone,
    email: matchedUser?.email ?? "",
    serviceName: item.serviceBn,
    invoiceNo: `INV-10${index + 1}`,
    amount: index === 0 ? "৳3,200" : index === 1 ? "৳2,800" : "৳1,800",
    paymentStatus: index === 0 ? "paid" : index === 1 ? "partial" : "due",
    note: item.stateBn,
  };
});

const emptyForm = {
  customerName: "",
  phone: "",
  email: "",
  serviceName: "",
  invoiceNo: "",
  amount: "",
  paymentStatus: "paid" as PaymentStatus,
  note: "",
};

export default function DashboardMatchingPage() {
  const { locale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [form, setForm] = useState(emptyForm);

  const totals = useMemo(() => {
    return {
      total: invoices.length,
      paid: invoices.filter((item) => item.paymentStatus === "paid").length,
      pending: invoices.filter((item) => item.paymentStatus !== "paid").length,
    };
  }, [invoices]);

  const handleOpen = () => {
    setForm(emptyForm);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setInvoices((current) => [
      {
        id: `${form.phone}-${Date.now()}`,
        ...form,
      },
      ...current,
    ]);

    handleClose();
  };

  const paymentTone = (status: PaymentStatus) => {
    if (status === "paid") return "bg-green-100 text-green-700";
    if (status === "partial") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <>
      <AdminSurface>
        <AdminPageHeader titleBn="সার্ভিস নেওয়া কাস্টমার" titleEn="Purchased Customers" />

        <div className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-[#f3f6fd] px-4 py-3 text-sm font-medium text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]">
                <BadgeCheck size={16} />
                {locale === "en" ? "Completed" : "সম্পন্ন"}: {totals.total}
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <CircleDollarSign size={16} />
                {locale === "en" ? "Paid" : "পেইড"}: {totals.paid}
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                <ReceiptText size={16} />
                {locale === "en" ? "Pending" : "পেন্ডিং"}: {totals.pending}
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-5 py-3 text-sm font-semibold text-white shadow-sm"
            >
              <FilePlus2 size={16} />
              {locale === "en" ? "Add Customer" : "কাস্টমার যোগ করুন"}
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-[#1f2638] dark:text-white">
                      {invoice.customerName}
                    </p>
                    <p className="mt-1 text-sm text-[#60708d] dark:text-[#a7b3c9]">
                      {invoice.phone}
                    </p>
                    <p className="text-sm text-[#60708d] dark:text-[#a7b3c9]">
                      {invoice.email || (locale === "en" ? "No email" : "ইমেইল নেই")}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f3f6fd] px-3 py-1 text-xs font-semibold text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]">
                    {invoice.invoiceNo}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#f8fbff] px-4 py-3 dark:bg-[#11192c]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                      {locale === "en" ? "Service" : "সার্ভিস"}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#1f2638] dark:text-white">
                      {invoice.serviceName}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#f8fbff] px-4 py-3 dark:bg-[#11192c]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                      {locale === "en" ? "Amount" : "এমাউন্ট"}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#1f2638] dark:text-white">
                      {invoice.amount}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-[#60708d] dark:text-[#a7b3c9]">
                    {invoice.note}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentTone(invoice.paymentStatus)}`}
                  >
                    {invoice.paymentStatus === "paid"
                      ? locale === "en"
                        ? "Paid"
                        : "পেইড"
                      : invoice.paymentStatus === "partial"
                        ? locale === "en"
                          ? "Partial"
                          : "পার্শিয়াল"
                        : locale === "en"
                          ? "Due"
                          : "ডিউ"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminSurface>

      {isOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[28px] bg-white p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] dark:bg-[#161f36]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-bold text-[#1f2638] dark:text-white">
                  {locale === "en" ? "Add Completed Service" : "সম্পন্ন সার্ভিস যোগ করুন"}
                </p>
                <p className="mt-1 text-sm text-[#7f8ba3]">
                  {locale === "en"
                    ? "Add customer invoice details directly from the service matching page."
                    : "সার্ভিস ম্যাচিং পেজ থেকেই কাস্টমার ইনভয়েস ডিটেইলস যোগ করুন।"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-[#1f2638] dark:text-white">
                <span>{locale === "en" ? "Customer name" : "কাস্টমার নাম"}</span>
                <input
                  required
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, customerName: e.target.value }))
                  }
                  className="rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-[#1f2638] dark:text-white">
                <span>{locale === "en" ? "Phone number" : "ফোন নম্বর"}</span>
                <input
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, phone: e.target.value }))
                  }
                  className="rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-[#1f2638] dark:text-white">
                <span>{locale === "en" ? "Email" : "ইমেইল"}</span>
                <input
                  value={form.email}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, email: e.target.value }))
                  }
                  className="rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-[#1f2638] dark:text-white">
                <span>{locale === "en" ? "Service name" : "সার্ভিস নাম"}</span>
                <input
                  required
                  value={form.serviceName}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, serviceName: e.target.value }))
                  }
                  className="rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-[#1f2638] dark:text-white">
                <span>{locale === "en" ? "Invoice no" : "ইনভয়েস নম্বর"}</span>
                <input
                  required
                  value={form.invoiceNo}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, invoiceNo: e.target.value }))
                  }
                  className="rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-[#1f2638] dark:text-white">
                <span>{locale === "en" ? "Amount" : "এমাউন্ট"}</span>
                <input
                  required
                  value={form.amount}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, amount: e.target.value }))
                  }
                  className="rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-[#1f2638] dark:text-white">
                <span>{locale === "en" ? "Payment status" : "পেমেন্ট স্ট্যাটাস"}</span>
                <select
                  value={form.paymentStatus}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      paymentStatus: e.target.value as PaymentStatus,
                    }))
                  }
                  className="rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                >
                  <option value="paid">{locale === "en" ? "Paid" : "পেইড"}</option>
                  <option value="partial">{locale === "en" ? "Partial" : "পার্শিয়াল"}</option>
                  <option value="due">{locale === "en" ? "Due" : "ডিউ"}</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-[#1f2638] dark:text-white md:col-span-2">
                <span>{locale === "en" ? "Note" : "নোট"}</span>
                <textarea
                  value={form.note}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, note: e.target.value }))
                  }
                  rows={4}
                  className="rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>

              <div className="md:col-span-2 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-2xl border border-[#dbe4f4] px-5 py-3 text-sm font-semibold text-[#60708d] dark:border-white/10 dark:text-[#a7b3c9]"
                >
                  {locale === "en" ? "Cancel" : "বাতিল"}
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-5 py-3 text-sm font-semibold text-white"
                >
                  {locale === "en" ? "Save Invoice" : "ইনভয়েস সেভ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
