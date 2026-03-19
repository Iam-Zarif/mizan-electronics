"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowUpDown,
  BadgeCheck,
  CircleDollarSign,
  Eye,
  FilePlus2,
  Search,
  Mail,
  MapPin,
  PhoneCall,
  ReceiptText,
  X,
} from "lucide-react";
import { AdminPageHeader, AdminSurface } from "@/components/admin/AdminSections";
import { ApiErrorState, ApiSkeletonBlock } from "@/components/shared/ApiState";
import { PaginationControls } from "@/components/shared/PaginationControls";
import {
  createAdminCompletedService,
  getAdminBookings,
  getAdminCustomers,
  getAdminServices,
  getAdminUsers,
} from "@/lib/dashboard-api";
import { getErrorMessage } from "@/lib/api";
import { dispatchAdminSidebarRefresh } from "@/lib/admin-sidebar-events";
import { getValueOrEmpty } from "@/lib/display";
import { useLanguage } from "@/lib/i18n";
import { useApiQuery } from "@/hooks/use-api-query";

type PaymentStatus = "paid" | "partial" | "unpaid";
type CustomerSortKey = "latest" | "oldest" | "alphabetical" | "amount_high" | "amount_low" | "most_purchases";
type ServiceLine = {
  serviceSlug: string;
  qty: number;
};

type AddCustomerForm = {
  requestId: string;
  customerName: string;
  phone: string;
  email: string;
  serviceItems: ServiceLine[];
  invoiceNo: string;
  amountPaid: string;
  paymentStatus: PaymentStatus;
  note: string;
};

const emptyForm: AddCustomerForm = {
  requestId: "",
  customerName: "",
  phone: "",
  email: "",
  serviceItems: [{ serviceSlug: "", qty: 1 }],
  invoiceNo: "",
  amountPaid: "",
  paymentStatus: "paid",
  note: "",
};

const getNextInvoiceSerial = (invoiceNumbers: string[]) => {
  const maxNumber = invoiceNumbers.reduce((currentMax, invoiceNo) => {
    const matches = invoiceNo.match(/\d+/g);
    if (!matches?.length) return currentMax;
    const lastNumber = Number(matches[matches.length - 1]);
    if (!Number.isFinite(lastNumber)) return currentMax;
    return Math.max(currentMax, lastNumber);
  }, 0);

  return String(maxNumber + 1).padStart(2, "0");
};

const parsePriceFloor = (priceText: string) => {
  const numbers = priceText
    .replace(/[^\d-]/g, "")
    .split("-")
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= 0);

  return numbers[0] ?? 0;
};

export default function DashboardMatchingPage() {
  const { locale } = useLanguage();
  const pageSize = 12;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [activeField, setActiveField] = useState<"customerName" | "phone" | "email" | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<CustomerSortKey>("latest");
  const [page, setPage] = useState(1);

  const { data: allCustomersData, isLoading, error, refresh: refreshAllCustomers } = useApiQuery(
    () => getAdminCustomers({ page: 1, limit: 500 }),
    [],
  );
  const { data: usersData } = useApiQuery(
    () => getAdminUsers({ search: "", verification: "all", sort: "newest", page: 1, limit: 200 }),
    [],
  );
  const { data: servicesData } = useApiQuery(
    () => getAdminServices({ search: "", page: 1, limit: 100 }),
    [],
  );
  const { data: bookingsData } = useApiQuery(
    () => getAdminBookings({ search: "", status: "all", sort: "latest", page: 1, limit: 200 }),
    [],
  );

  const totals = useMemo(() => {
    const rows = allCustomersData?.rows ?? [];
    const purchases = rows.flatMap((row) => row.purchases);

    return {
      total: purchases.length,
      paid: purchases.filter((item) => item.paymentStatus === "paid").length,
      pending: purchases.filter((item) => item.paymentStatus !== "paid").length,
    };
  }, [allCustomersData]);

  const nextInvoiceNo = useMemo(() => {
    const invoiceNumbers =
      allCustomersData?.rows.flatMap((row) => row.purchases.map((purchase) => purchase.invoiceNo)) ?? [];
    return getNextInvoiceSerial(invoiceNumbers);
  }, [allCustomersData]);

  const serviceOptions = useMemo(
    () =>
      (servicesData?.rows ?? []).flatMap((category) =>
        category.services.map((service) => ({
          value: service.slug,
          label: locale === "en" ? service.titleEn : service.title,
          categoryLabel: locale === "en" ? category.nameEn : category.name,
          price: service.price,
        })),
      ),
    [locale, servicesData],
  );

  const selectedServiceTotal = useMemo(() => {
    const bySlug = new Map(
      serviceOptions.map((service) => [service.value, parsePriceFloor(service.price)]),
    );

    return form.serviceItems.reduce((sum, item) => {
      if (!item.serviceSlug) return sum;
      return sum + (bySlug.get(item.serviceSlug) ?? 0) * Math.max(1, item.qty || 1);
    }, 0);
  }, [form.serviceItems, serviceOptions]);

  useEffect(() => {
    setPage(1);
  }, [query, sortBy]);

  useEffect(() => {
    setForm((current) => {
      if (current.paymentStatus === "paid") {
        const nextAmount = String(selectedServiceTotal || "");
        return current.amountPaid === nextAmount ? current : { ...current, amountPaid: nextAmount };
      }

      if (current.paymentStatus === "unpaid") {
        return current.amountPaid === "0" ? current : { ...current, amountPaid: "0" };
      }

      return current;
    });
  }, [selectedServiceTotal, form.paymentStatus]);

  const filteredCustomers = useMemo(() => {
    const rows = [...(allCustomersData?.rows ?? [])];
    const normalizedQuery = query.trim().toLowerCase();

    const searched = normalizedQuery
      ? rows.filter((customer) => {
          const looksLikePhone = /^[\d+\-\s()]+$/.test(normalizedQuery);
          const looksLikeEmail = normalizedQuery.includes("@");
          const looksLikeInvoice = /\d/.test(normalizedQuery) && !looksLikePhone;

          if (looksLikeEmail) {
            return (customer.customerEmail ?? "").toLowerCase().includes(normalizedQuery);
          }

          if (looksLikePhone) {
            return (customer.customerPhone ?? "").toLowerCase().includes(normalizedQuery);
          }

          if (looksLikeInvoice) {
            return customer.purchases.some((purchase) =>
              purchase.invoiceNo.toLowerCase().includes(normalizedQuery),
            );
          }

          return customer.customerName.toLowerCase().includes(normalizedQuery);
        })
      : rows;

    searched.sort((a, b) => {
      const aLatest = new Date(a.purchases[0]?.completedAt ?? 0).getTime();
      const bLatest = new Date(b.purchases[0]?.completedAt ?? 0).getTime();
      const aTotal = a.purchases.reduce((sum, item) => sum + item.subtotal, 0);
      const bTotal = b.purchases.reduce((sum, item) => sum + item.subtotal, 0);

      switch (sortBy) {
        case "oldest":
          return aLatest - bLatest;
        case "alphabetical":
          return a.customerName.localeCompare(b.customerName);
        case "amount_high":
          return bTotal - aTotal;
        case "amount_low":
          return aTotal - bTotal;
        case "most_purchases":
          return b.purchases.length - a.purchases.length;
        case "latest":
        default:
          return bLatest - aLatest;
      }
    });

    return searched;
  }, [allCustomersData, query, sortBy]);

  const pagination = useMemo(() => {
    const totalItems = filteredCustomers.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;

    return {
      rows: filteredCustomers.slice(start, start + pageSize),
      meta: {
        page: safePage,
        pageSize,
        totalItems,
        totalPages,
        hasPreviousPage: safePage > 1,
        hasNextPage: safePage < totalPages,
      },
    };
  }, [filteredCustomers, page]);

  useEffect(() => {
    if (page !== pagination.meta.page) {
      setPage(pagination.meta.page);
    }
  }, [page, pagination.meta.page]);

  const selectedCustomer = useMemo(() => {
    if (!selectedKey) return null;
    return (
      (allCustomersData?.rows ?? []).find(
        (item) => (item.customerEmail || item.customerPhone || item.customerName) === selectedKey,
      ) ?? null
    );
  }, [allCustomersData, selectedKey]);

  const userSuggestions = useMemo(() => {
    if (!activeField || !usersData?.rows.length) return [];

    const rawValue = form[activeField]?.trim().toLowerCase();
    if (rawValue.length < 2) return [];

    const matched = usersData.rows.filter((user) => {
      if (activeField === "customerName") {
        return user.name.toLowerCase().includes(rawValue);
      }

      if (activeField === "phone") {
        return user.phone.toLowerCase().startsWith(rawValue);
      }

      return user.email.toLowerCase().includes(rawValue);
    });

    return matched.slice(0, 6);
  }, [activeField, form, usersData]);

  const requestOptions = useMemo(
    () =>
      (bookingsData?.rows ?? [])
        .filter((booking) => !booking.completedServiceId)
        .map((booking) => ({
          value: booking._id,
          label: `${booking.requestCode} • ${
            locale === "en" ? booking.serviceTitleEn : booking.serviceTitleBn
          }`,
          customerName: booking.customerName,
          customerPhone: booking.customerPhone,
          customerEmail: booking.customerEmail,
          serviceSlug: booking.serviceSlug,
          note: locale === "en" ? booking.addressEn || booking.noteEn : booking.addressBn || booking.noteBn,
          paymentStatus: booking.paymentStatus,
        })),
    [bookingsData, locale],
  );

  const handleClose = () => {
    setIsOpen(false);
    setForm(emptyForm);
    setActiveField(null);
    setSubmitError(null);
    setIsSubmitting(false);
  };

  const handleOpen = () => {
    setForm({
      ...emptyForm,
      invoiceNo: nextInvoiceNo,
    });
    setActionFieldReset();
    setIsOpen(true);
  };

  const setActionFieldReset = () => {
    setActiveField(null);
  };

  const fillUserSuggestion = (user: NonNullable<typeof usersData>["rows"][number]) => {
    setForm((current) => ({
      ...current,
      customerName: user.name,
      phone: user.phone || current.phone,
      email: user.email,
      note: user.primaryAddress || current.note,
    }));
    setActiveField(null);
  };

  const fillBookingRequest = (requestId: string) => {
    const selectedRequest = requestOptions.find((option) => option.value === requestId);
    setForm((current) => ({
      ...current,
      requestId,
      customerName: selectedRequest?.customerName || current.customerName,
      phone: selectedRequest?.customerPhone || current.phone,
      email: selectedRequest?.customerEmail || current.email,
      serviceItems: selectedRequest?.serviceSlug
        ? [{ serviceSlug: selectedRequest.serviceSlug, qty: 1 }]
        : current.serviceItems,
      paymentStatus: selectedRequest?.paymentStatus || current.paymentStatus,
      note: selectedRequest?.note || current.note,
    }));
  };

  const updateServiceItem = (index: number, patch: Partial<ServiceLine>) => {
    setForm((current) => ({
      ...current,
      serviceItems: current.serviceItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }));
  };

  const addServiceItemRow = () => {
    setForm((current) => ({
      ...current,
      serviceItems: [...current.serviceItems, { serviceSlug: "", qty: 1 }],
    }));
  };

  const removeServiceItemRow = (index: number) => {
    setForm((current) => ({
      ...current,
      serviceItems:
        current.serviceItems.length > 1
          ? current.serviceItems.filter((_, itemIndex) => itemIndex !== index)
          : current.serviceItems,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const amountPaid = Number(form.amountPaid.replace(/[^\d]/g, "")) || 0;

      await createAdminCompletedService({
        requestId: form.requestId || undefined,
        customerName: form.customerName.trim(),
        customerEmail: form.email.trim(),
        customerPhone: form.phone.trim(),
        serviceItems: form.serviceItems
          .filter((item) => item.serviceSlug)
          .map((item) => ({
            serviceSlug: item.serviceSlug,
            qty: Math.max(1, item.qty || 1),
          })),
        invoiceNo: form.invoiceNo.trim(),
        paymentStatus: form.paymentStatus,
        amountPaid,
        note: form.note.trim(),
      });

      await refreshAllCustomers();
      dispatchAdminSidebarRefresh();
      handleClose();
    } catch (submitError) {
      setSubmitError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
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

        {isLoading ? <ApiSkeletonBlock rows={4} /> : null}
        {!isLoading && error ? (
          <ApiErrorState
            title={locale === "en" ? "Purchased customers failed to load" : "কাস্টমার ডেটা লোড হয়নি"}
            description={error}
            onRetry={() => void refreshAllCustomers()}
          />
        ) : null}

        {!isLoading && !error && allCustomersData ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex w-full items-center gap-2 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 text-sm text-[#6f7c98] dark:border-white/10 dark:bg-[#11192c] dark:text-[#a7b3c9] xl:max-w-[360px]">
                <Search size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={
                    locale === "en"
                      ? "Search by customer, phone, email or invoice"
                      : "কাস্টমার, ফোন, ইমেইল বা ইনভয়েস দিয়ে সার্চ করুন"
                  }
                  className="w-full bg-transparent outline-none placeholder:text-[#8a96ad] dark:placeholder:text-[#70809c]"
                />
              </div>

              <label className="flex items-center gap-2 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 text-sm text-[#6f7c98] dark:border-white/10 dark:bg-[#11192c] dark:text-[#a7b3c9] xl:w-[260px] xl:flex-none">
                <ArrowUpDown size={16} />
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as CustomerSortKey)}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="latest">{locale === "en" ? "Newest to oldest" : "নতুন থেকে পুরোনো"}</option>
                  <option value="oldest">{locale === "en" ? "Oldest to newest" : "পুরোনো থেকে নতুন"}</option>
                  <option value="alphabetical">{locale === "en" ? "Alphabet A-Z" : "বর্ণানুক্রম A-Z"}</option>
                  <option value="amount_high">{locale === "en" ? "Amount high to low" : "অ্যামাউন্ট বেশি থেকে কম"}</option>
                  <option value="amount_low">{locale === "en" ? "Amount low to high" : "অ্যামাউন্ট কম থেকে বেশি"}</option>
                  <option value="most_purchases">{locale === "en" ? "Most purchases" : "সবচেয়ে বেশি সার্ভিস"}</option>
                </select>
              </label>
            </div>

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

            <div className="overflow-hidden rounded-[24px] border border-[#e8edf7] bg-white shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
              <div className="max-h-[68vh] overflow-auto">
                <table className="min-w-full text-left">
                  <thead className="sticky top-0 z-10 bg-[#f8fbff] dark:bg-[#11192c]">
                    <tr className="border-b border-[#e8edf7] dark:border-white/10">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                        {locale === "en" ? "Customer" : "কাস্টমার"}
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                        {locale === "en" ? "Latest service" : "সর্বশেষ সার্ভিস"}
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                        {locale === "en" ? "Invoice no" : "ইনভয়েস নং"}
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                        {locale === "en" ? "Total amount" : "মোট পরিমাণ"}
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                        {locale === "en" ? "Purchases" : "সার্ভিস সংখ্যা"}
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                        {locale === "en" ? "Action" : "অ্যাকশন"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagination.rows.map((customer) => {
                      const key =
                        customer.customerEmail || customer.customerPhone || customer.customerName;
                      const latestPurchase = customer.purchases[0];
                      const totalAmount = customer.purchases.reduce(
                        (sum, item) => sum + item.subtotal,
                        0,
                      );

                      return (
                        <tr
                          key={key}
                          className="border-b border-[#edf1f7] last:border-b-0 hover:bg-[#fbfcff] dark:border-white/10 dark:hover:bg-[#11192c]"
                        >
                          <td className="px-5 py-4 align-top">
                            <div>
                              <p className="font-semibold text-[#1f2638] dark:text-white">
                                {customer.customerName}
                              </p>
                            </div>
                          </td>
                          <td className="px-5 py-4 align-top text-sm font-medium text-[#1f2638] dark:text-white">
                            {locale === "en"
                              ? latestPurchase?.serviceTitleEn
                              : latestPurchase?.serviceTitleBn}
                          </td>
                          <td className="px-5 py-4 align-top text-sm font-medium text-[#1f2638] dark:text-white">
                            {getValueOrEmpty(
                              latestPurchase?.invoiceNo,
                              locale,
                              "Invoice",
                              "ইনভয়েস",
                            )}
                          </td>
                          <td className="px-5 py-4 align-top text-sm font-medium text-[#1f2638] dark:text-white">
                            ৳{totalAmount.toLocaleString()}
                          </td>
                          <td className="px-5 py-4 align-top">
                            <span className="rounded-full bg-[#f3f6fd] px-3 py-1 text-xs font-semibold text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]">
                              {locale === "en"
                                ? `${customer.purchases.length} purchases`
                                : `${customer.purchases.length}টি সার্ভিস`}
                            </span>
                          </td>
                          <td className="px-5 py-4 align-top text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedKey(key)}
                              className="inline-flex items-center gap-2 rounded-full bg-[#f3f6fd] px-3 py-2 text-xs font-semibold text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]"
                            >
                              <Eye size={14} />
                              {locale === "en" ? "Details" : "ডিটেইলস"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <PaginationControls pagination={pagination.meta} onPageChange={setPage} />
          </div>
        ) : null}
      </AdminSurface>

      {isOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] dark:bg-[#161f36]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-bold text-[#1f2638] dark:text-white">
                  {locale === "en" ? "Add Completed Service" : "সম্পন্ন সার্ভিস যোগ করুন"}
                </p>
                <p className="mt-1 text-sm text-[#7f8ba3]">
                  {locale === "en"
                    ? "Add customer invoice details directly from the purchased customer page."
                    : "সার্ভিস নেওয়া কাস্টমার পেজ থেকেই কাস্টমার ইনভয়েস ডিটেইলস যোগ করুন।"}
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
              <label className="grid min-w-0 gap-2 text-sm font-medium text-[#1f2638] dark:text-white md:col-span-2">
                <span>{locale === "en" ? "Request ID (optional)" : "রিকোয়েস্ট আইডি (অপশনাল)"}</span>
                <select
                  value={form.requestId}
                  onChange={(e) => fillBookingRequest(e.target.value)}
                  className="w-full min-w-0 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                >
                  <option value="">
                    {locale === "en"
                      ? "Select request from requested bookings"
                      : "রিকোয়েস্টেড বুকিং থেকে রিকোয়েস্ট সিলেক্ট করুন"}
                  </option>
                  {requestOptions.map((request) => (
                    <option key={request.value} value={request.value}>
                      {request.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[#7f8ba3]">
                  {locale === "en"
                    ? "Selecting a request auto-fills customer, service, payment, and address fields."
                    : "রিকোয়েস্ট সিলেক্ট করলে কাস্টমার, সার্ভিস, পেমেন্ট ও ঠিকানা অটো সেট হবে।"}
                </p>
              </label>

              {[
                ["customerName", locale === "en" ? "Customer name" : "কাস্টমার নাম"],
                ["phone", locale === "en" ? "Phone number" : "ফোন নম্বর"],
                ["email", locale === "en" ? "Email" : "ইমেইল"],
                ["amountPaid", locale === "en" ? "Amount paid" : "পরিশোধিত অ্যামাউন্ট"],
              ].map(([key, label]) => {
                const typedKey = key as keyof AddCustomerForm;
                const isSuggestField =
                  typedKey === "customerName" || typedKey === "phone" || typedKey === "email";

                return (
                  <label
                    key={key}
                    className="relative min-w-0 grid gap-2 text-sm font-medium text-[#1f2638] dark:text-white"
                  >
                    <span>{label}</span>
                    <input
                      required={key !== "email"}
                      value={form[typedKey] as string}
                      onFocus={() =>
                        isSuggestField
                          ? setActiveField(typedKey as "customerName" | "phone" | "email")
                          : setActiveField(null)
                      }
                      onBlur={() => {
                        window.setTimeout(() => setActiveField(null), 120);
                      }}
                      onChange={(e) =>
                        setForm((current) => ({ ...current, [key]: e.target.value }))
                      }
                      className="w-full min-w-0 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                    />

                    {isSuggestField &&
                    activeField === typedKey &&
                    userSuggestions.length > 0 ? (
                      <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-[#e3eaf6] bg-white shadow-[0_25px_60px_-40px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-[#161f36]">
                        {userSuggestions.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onMouseDown={(event) => {
                              event.preventDefault();
                              fillUserSuggestion(user);
                            }}
                            className="flex w-full items-start justify-between gap-3 border-b border-[#edf1f7] px-4 py-3 text-left last:border-b-0 hover:bg-[#f8fbff] dark:border-white/10 dark:hover:bg-[#11192c]"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-[#1f2638] dark:text-white">
                                {user.name}
                              </p>
                              <p className="mt-1 truncate text-xs text-[#7f8ba3]">
                                {user.email}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-sm font-medium text-[#60708d] dark:text-[#a7b3c9]">
                                {getValueOrEmpty(user.phone, locale, "Phone", "ফোন")}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </label>
                );
              })}

              <label className="relative min-w-0 grid gap-2 text-sm font-medium text-[#1f2638] dark:text-white">
                <span>{locale === "en" ? "Invoice no" : "ইনভয়েস নং"}</span>
                <input
                  value={form.invoiceNo}
                  readOnly
                  aria-readonly="true"
                  className="w-full min-w-0 cursor-not-allowed rounded-2xl border border-[#e3eaf6] bg-[#eef3fb] px-4 py-3 text-[#60708d] outline-none dark:border-white/10 dark:bg-[#0f1728] dark:text-[#a7b3c9]"
                />
              </label>

              <div className="grid gap-3 md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-[#1f2638] dark:text-white">
                    {locale === "en" ? "Available services" : "এভেইলেবল সার্ভিসসমূহ"}
                  </span>
                  <button
                    type="button"
                    onClick={addServiceItemRow}
                    className="rounded-full bg-[#f3f6fd] px-3 py-1.5 text-xs font-semibold text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]"
                  >
                    {locale === "en" ? "Add more service" : "আরও সার্ভিস যোগ করুন"}
                  </button>
                </div>

                <div className="space-y-3">
                  {form.serviceItems.map((item, index) => (
                    <div
                      key={`${index}-${item.serviceSlug}`}
                      className="grid gap-3 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] p-3 dark:border-white/10 dark:bg-[#11192c] md:grid-cols-[1fr_auto]"
                    >
                      <select
                        required
                        value={item.serviceSlug}
                        onChange={(event) =>
                          updateServiceItem(index, { serviceSlug: event.target.value })
                        }
                        className="w-full min-w-0 rounded-2xl border border-[#d9e3f2] bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-[#161f36]"
                      >
                        <option value="">
                          {locale === "en" ? "Select service" : "সার্ভিস সিলেক্ট করুন"}
                        </option>
                        {serviceOptions.map((service) => (
                          <option key={`${service.categoryLabel}-${service.value}`} value={service.value}>
                            {service.label}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => removeServiceItemRow(index)}
                        disabled={form.serviceItems.length === 1}
                        className="rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-45 dark:border-red-500/30 dark:bg-[#161f36] dark:text-red-300"
                      >
                        {locale === "en" ? "Remove" : "বাদ দিন"}
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-[#7f8ba3]">
                  {locale === "en"
                    ? "One invoice can contain multiple services."
                    : "একটি ইনভয়েসে একাধিক সার্ভিস যোগ করা যাবে।"}
                </p>
              </div>

              <label className="grid gap-2 text-sm font-medium text-[#1f2638] dark:text-white">
                <span>{locale === "en" ? "Subtotal" : "সাবটোটাল"}</span>
                <input
                  value={`৳${selectedServiceTotal.toLocaleString()}`}
                  readOnly
                  aria-readonly="true"
                  className="w-full min-w-0 cursor-not-allowed rounded-2xl border border-[#e3eaf6] bg-[#eef3fb] px-4 py-3 text-[#60708d] outline-none dark:border-white/10 dark:bg-[#0f1728] dark:text-[#a7b3c9]"
                />
              </label>

              <label className="grid min-w-0 gap-2 text-sm font-medium text-[#1f2638] dark:text-white">
                <span>{locale === "en" ? "Payment status" : "পেমেন্ট স্ট্যাটাস"}</span>
                <select
                  value={form.paymentStatus}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, paymentStatus: e.target.value as PaymentStatus }))
                  }
                  className="w-full min-w-0 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                >
                  <option value="paid">{locale === "en" ? "Paid" : "পেইড"}</option>
                  <option value="partial">{locale === "en" ? "Partial" : "পার্শিয়াল"}</option>
                  <option value="unpaid">{locale === "en" ? "Unpaid" : "আনপেইড"}</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-[#1f2638] dark:text-white md:col-span-2">
                <span>{locale === "en" ? "Note / address" : "নোট / ঠিকানা"}</span>
                <textarea
                  rows={4}
                  value={form.note}
                  onChange={(e) => setForm((current) => ({ ...current, note: e.target.value }))}
                  className="rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 outline-none dark:border-white/10 dark:bg-[#11192c]"
                />
              </label>

              {submitError ? (
                <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  {submitError}
                </div>
              ) : null}

              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-4 py-3 text-sm font-semibold text-[#2160ba] dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                >
                  {locale === "en" ? "Cancel" : "বাতিল"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl bg-[#2160ba] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting
                    ? locale === "en"
                      ? "Saving..."
                      : "সেভ হচ্ছে..."
                    : locale === "en"
                      ? "Save customer"
                      : "কাস্টমার সেভ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {selectedCustomer ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] dark:bg-[#161f36]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-bold text-[#1f2638] dark:text-white">
                  {selectedCustomer.customerName}
                </p>
                <p className="mt-1 text-sm text-[#7f8ba3]">
                  {locale === "en" ? "Customer profile and purchased invoices." : "কাস্টমার প্রোফাইল ও কেনা ইনভয়েস।"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedKey(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.9fr,1.1fr]">
              <div className="space-y-3">
                {[
                  { icon: Mail, label: locale === "en" ? "Email" : "ইমেইল", value: getValueOrEmpty(selectedCustomer.customerEmail, locale, "Email", "ইমেইল") },
                  { icon: PhoneCall, label: locale === "en" ? "Phone" : "ফোন", value: getValueOrEmpty(selectedCustomer.customerPhone, locale, "Phone", "ফোন") },
                  { icon: MapPin, label: locale === "en" ? "Address" : "ঠিকানা", value: locale === "en" ? selectedCustomer.addressEn : selectedCustomer.addressBn },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl bg-[#f8fbff] px-4 py-4 dark:bg-[#11192c]">
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#4f6bff] shadow-sm dark:bg-white/8 dark:text-[#aab5ff]">
                          <Icon size={17} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">{item.label}</p>
                          <p className="mt-2 break-words text-sm font-semibold text-[#1f2638] dark:text-white">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl bg-[#f8fbff] p-4 dark:bg-[#11192c]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-[#1f2638] dark:text-white">
                      {locale === "en" ? "Purchased Services" : "কেনা সার্ভিস"}
                    </p>
                    <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-[#eaf0ff] px-2.5 py-1 text-xs font-semibold text-[#4f6bff] dark:bg-white/10 dark:text-[#aab5ff]">
                      {selectedCustomer.purchases.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedCustomer.purchases.map((purchase) => (
                    <div
                      key={purchase.invoiceNo}
                      className="rounded-2xl border border-[#e5ebf7] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#161f36]"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="font-semibold text-[#1f2638] dark:text-white">
                            {locale === "en" ? purchase.serviceTitleEn : purchase.serviceTitleBn}
                          </p>
                          <p className="mt-1 text-xs text-[#8a96ad]">{purchase.invoiceNo}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentTone(purchase.paymentStatus)}`}>
                          {purchase.paymentStatus}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-[#60708d] dark:text-[#a7b3c9] sm:grid-cols-4">
                        <p>{locale === "en" ? "Paid" : "পরিশোধ"}: ৳{purchase.amountPaid.toLocaleString()}</p>
                        <p>{locale === "en" ? "Subtotal" : "মোট"}: ৳{purchase.subtotal.toLocaleString()}</p>
                        <p>{locale === "en" ? "Due" : "বাকি"}: ৳{purchase.due.toLocaleString()}</p>
                        <p>{new Date(purchase.completedAt).toLocaleDateString(locale === "en" ? "en-GB" : "bn-BD")}</p>
                      </div>

                      {purchase.items.length ? (
                        <div className="mt-4 rounded-2xl bg-[#f8fbff] p-3 dark:bg-[#11192c]">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                            {locale === "en" ? "Invoice items" : "ইনভয়েস আইটেম"}
                          </p>
                          <div className="mt-3 space-y-2">
                            {purchase.items.map((item, itemIndex) => (
                              <div
                                key={`${purchase.invoiceNo}-${itemIndex}`}
                                className="flex flex-col gap-2 rounded-xl border border-[#e5ebf7] bg-white px-3 py-3 text-sm dark:border-white/10 dark:bg-[#161f36] sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div className="min-w-0">
                                  <p className="font-medium text-[#1f2638] dark:text-white">
                                    {locale === "en" ? item.descriptionEn : item.descriptionBn}
                                  </p>
                                  <p className="mt-1 text-xs text-[#8a96ad]">
                                    {locale === "en" ? "Qty" : "পরিমাণ"}: {item.qty}
                                  </p>
                                </div>
                                <div className="text-sm font-medium text-[#60708d] dark:text-[#a7b3c9]">
                                  ৳{item.total.toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
