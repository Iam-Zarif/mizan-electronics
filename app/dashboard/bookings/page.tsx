"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown, ListFilter, Mail, MapPin, PhoneCall, Search, Wrench, X } from "lucide-react";
import { AdminPageHeader, AdminSurface } from "@/components/admin/AdminSections";
import { ApiErrorState, ApiSkeletonBlock } from "@/components/shared/ApiState";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { getAdminBookings, updateAdminBookingStatus } from "@/lib/dashboard-api";
import { getErrorMessage } from "@/lib/api";
import { useLanguage } from "@/lib/i18n";
import { useApiQuery } from "@/hooks/use-api-query";

type SortKey = "latest" | "oldest" | "alphabetical" | "service";
type StatusFilter = "all" | "pending" | "ongoing" | "work_done" | "cancelled";
type BookingStatus = Exclude<StatusFilter, "all">;
type PaymentStatus = "paid" | "partial" | "unpaid";

export default function DashboardBookingsPage() {
  const { locale } = useLanguage();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("latest");
  const [page, setPage] = useState(1);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, sortBy]);

  const { data, isLoading, error, refresh, setData } = useApiQuery(
    () =>
      getAdminBookings({
        search: query,
        status: statusFilter,
        sort: sortBy,
        page,
        limit: 12,
      }),
    [query, statusFilter, sortBy, page],
  );

  const selectedBooking =
    data?.rows.find((booking) => booking._id === selectedBookingId) ?? null;

  const handleStatusChange = async (
    bookingId: string,
    nextStatus: BookingStatus,
    paymentStatus?: PaymentStatus,
  ) => {
    setStatusError(null);
    setStatusUpdatingId(bookingId);

    try {
      const response = await updateAdminBookingStatus(bookingId, {
        status: nextStatus,
        paymentStatus,
      });
      const updated = response.data;

      setData((current) => {
        if (!current) return current;
        const shouldRemoveFromRequested =
          updated.status === "work_done" &&
          (updated.paymentStatus ?? paymentStatus) === "paid";

        const nextRows = shouldRemoveFromRequested
          ? current.rows.filter((booking) => booking._id !== bookingId)
          : current.rows.map((booking) =>
              booking._id === bookingId
                ? {
                    ...booking,
                    status: updated.status,
                    paymentStatus: updated.paymentStatus ?? booking.paymentStatus,
                    invoiceNo: updated.invoiceNo ?? booking.invoiceNo,
                    completedServiceId: updated.completedServiceId ?? booking.completedServiceId,
                  }
                : booking,
            );

        if (shouldRemoveFromRequested && selectedBookingId === bookingId) {
          setSelectedBookingId(null);
        }

        return {
          ...current,
          rows: nextRows,
          pagination: {
            ...current.pagination,
            totalItems: shouldRemoveFromRequested
              ? Math.max(0, current.pagination.totalItems - 1)
              : current.pagination.totalItems,
          },
        };
      });
    } catch (nextError) {
      setStatusError(getErrorMessage(nextError));
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handlePaymentStatusChange = async (
    bookingId: string,
    nextPaymentStatus: PaymentStatus,
  ) => {
    const booking = data?.rows.find((row) => row._id === bookingId);
    if (!booking) return;
    await handleStatusChange(bookingId, booking.status, nextPaymentStatus);
  };

  return (
    <AdminSurface>
      <AdminPageHeader titleBn="রিকুয়েস্টেড বুকিং" titleEn="Requested Bookings" />

      {isLoading ? <ApiSkeletonBlock rows={4} /> : null}
      {!isLoading && error ? (
        <ApiErrorState
          title={locale === "en" ? "Bookings failed to load" : "বুকিং ডেটা লোড হয়নি"}
          description={error}
          onRetry={() => void refresh()}
        />
      ) : null}

      {!isLoading && !error && data ? (
        <div className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex w-full items-center gap-2 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 text-sm text-[#6f7c98] dark:border-white/10 dark:bg-[#11192c] dark:text-[#a7b3c9] xl:max-w-[360px]">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  locale === "en"
                    ? "Search by customer, phone or service"
                    : "কাস্টমার, ফোন বা সার্ভিস দিয়ে সার্চ করুন"
                }
                className="w-full bg-transparent outline-none placeholder:text-[#8a96ad] dark:placeholder:text-[#70809c]"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-[420px] xl:flex-none">
              <label className="flex items-center gap-2 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 text-sm text-[#6f7c98] dark:border-white/10 dark:bg-[#11192c] dark:text-[#a7b3c9]">
                <ListFilter size={16} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="all">{locale === "en" ? "All status" : "সব স্ট্যাটাস"}</option>
                  <option value="pending">{locale === "en" ? "Pending" : "পেন্ডিং"}</option>
                  <option value="ongoing">{locale === "en" ? "Ongoing" : "অনগোয়িং"}</option>
                  <option value="work_done">{locale === "en" ? "Work done" : "কাজ সম্পন্ন"}</option>
                  <option value="cancelled">{locale === "en" ? "Cancelled" : "ক্যানসেলড"}</option>
                </select>
              </label>

              <label className="flex items-center gap-2 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 text-sm text-[#6f7c98] dark:border-white/10 dark:bg-[#11192c] dark:text-[#a7b3c9]">
                <ArrowUpDown size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="latest">{locale === "en" ? "Newest to oldest" : "নতুন থেকে পুরোনো"}</option>
                  <option value="oldest">{locale === "en" ? "Oldest to newest" : "পুরোনো থেকে নতুন"}</option>
                  <option value="alphabetical">{locale === "en" ? "Alphabet A-Z" : "বর্ণানুক্রম A-Z"}</option>
                  <option value="service">{locale === "en" ? "Service name" : "সার্ভিস নাম"}</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-3 text-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f3f6fd] px-4 py-2 font-medium text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]">
              <PhoneCall size={14} />
              {locale === "en" ? "Requests" : "রিকুয়েস্ট"}: {data.rows.length}
            </div>
          </div>

          {statusError ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              {statusError}
            </div>
          ) : null}

          <div className="space-y-3">
            {data.rows.map((booking) => (
              <div
                key={booking._id}
                className="rounded-2xl bg-[#f8fbff] px-4 py-4 dark:bg-[#11192c]"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a96ad] dark:text-[#70809c]">
                      {locale === "en" ? "Customer" : "কাস্টমার"}
                    </p>
                    <p className="mt-2 font-semibold text-[#1f2638] dark:text-white">
                      {booking.customerName}
                    </p>
                    <p className="mt-1 text-sm text-[#60708d] dark:text-[#a7b3c9]">
                      {booking.customerPhone}
                    </p>
                    <p className="mt-1 text-xs text-[#8a96ad] dark:text-[#70809c]">
                      {new Date(booking.requestedAt).toLocaleDateString(
                        locale === "en" ? "en-GB" : "bn-BD",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-[#5c6cff] shadow-sm dark:bg-[#1a2440] dark:text-[#aab5ff]">
                      {booking.status}
                    </span>
                    <select
                      value={booking.status}
                      onChange={(event) =>
                        void handleStatusChange(
                          booking._id,
                          event.target.value as BookingStatus,
                          booking.paymentStatus,
                        )
                      }
                      disabled={statusUpdatingId === booking._id}
                      className="rounded-full border border-[#d7e1f0] bg-white px-3 py-1 text-xs font-semibold text-[#2160ba] outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#1a2440] dark:text-[#aab5ff]"
                    >
                      <option value="pending">{locale === "en" ? "Pending" : "পেন্ডিং"}</option>
                      <option value="ongoing">{locale === "en" ? "Ongoing" : "অনগোয়িং"}</option>
                      <option value="work_done">{locale === "en" ? "Work done" : "কাজ সম্পন্ন"}</option>
                      <option value="cancelled">{locale === "en" ? "Cancelled" : "ক্যানসেলড"}</option>
                    </select>
                    <select
                      value={booking.paymentStatus}
                      onChange={(event) =>
                        void handlePaymentStatusChange(
                          booking._id,
                          event.target.value as PaymentStatus,
                        )
                      }
                      disabled={statusUpdatingId === booking._id}
                      className="rounded-full border border-[#d7e1f0] bg-white px-3 py-1 text-xs font-semibold text-[#0f8a63] outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#1a2440] dark:text-[#87e4c0]"
                    >
                      <option value="paid">{locale === "en" ? "Paid" : "পেইড"}</option>
                      <option value="partial">{locale === "en" ? "Partial" : "পার্শিয়াল"}</option>
                      <option value="unpaid">{locale === "en" ? "Unpaid" : "আনপেইড"}</option>
                    </select>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#4f6bff] shadow-sm dark:bg-[#1a2440] dark:text-[#aab5ff]">
                      <Wrench size={13} />
                      {locale === "en" ? booking.serviceTitleEn : booking.serviceTitleBn}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedBookingId(booking._id)}
                      className="rounded-full border border-[#d7e1f0] bg-white px-3 py-1 text-xs font-semibold text-[#2160ba] shadow-sm transition hover:bg-[#f3f6fd] dark:border-white/10 dark:bg-[#1a2440] dark:text-[#aab5ff] dark:hover:bg-[#223052]"
                    >
                      {locale === "en" ? "Details" : "ডিটেইলস"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!data.rows.length ? (
              <div className="rounded-2xl border border-dashed border-[#dbe4f4] px-4 py-10 text-center text-sm text-[#7f8ba3] dark:border-white/10 dark:text-[#a7b3c9]">
                {locale === "en"
                  ? "No bookings matched the current search or sorting filters."
                  : "বর্তমান সার্চ বা ফিল্টারের সাথে কোনো বুকিং মেলেনি।"}
              </div>
            ) : null}
          </div>

          <div className="mt-5">
            <PaginationControls pagination={data.pagination} onPageChange={setPage} />
          </div>
        </div>
      ) : null}

      {selectedBooking ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] dark:bg-[#161f36]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-bold text-[#1f2638] dark:text-white">
                  {selectedBooking.customerName}
                </p>
                <p className="mt-1 text-sm text-[#7f8ba3]">
                  {locale === "en"
                    ? "Requested booking details"
                    : "রিকুয়েস্টেড বুকিং ডিটেইলস"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingId(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.95fr,1.05fr]">
              <div className="space-y-3">
                {[
                  {
                    icon: PhoneCall,
                    label: locale === "en" ? "Phone" : "ফোন",
                    value: selectedBooking.customerPhone || "—",
                  },
                  {
                    icon: Mail,
                    label: locale === "en" ? "Email" : "ইমেইল",
                    value: selectedBooking.customerEmail || "—",
                  },
                  {
                    icon: MapPin,
                    label: locale === "en" ? "Address" : "ঠিকানা",
                    value:
                      locale === "en"
                        ? selectedBooking.addressEn || "—"
                        : selectedBooking.addressBn || "—",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl bg-[#f8fbff] px-4 py-4 dark:bg-[#11192c]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#4f6bff] shadow-sm dark:bg-white/8 dark:text-[#aab5ff]">
                          <Icon size={17} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                            {item.label}
                          </p>
                          <p className="mt-2 break-words text-sm font-semibold text-[#1f2638] dark:text-white">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 rounded-2xl bg-[#f8fbff] p-4 dark:bg-[#11192c]">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#e5ebf7] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#161f36]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                      {locale === "en" ? "Service" : "সার্ভিস"}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#1f2638] dark:text-white">
                      {locale === "en"
                        ? selectedBooking.serviceTitleEn
                        : selectedBooking.serviceTitleBn}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#e5ebf7] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#161f36]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                      {locale === "en" ? "Status" : "স্ট্যাটাস"}
                    </p>
                    <div className="mt-2">
                      <select
                        value={selectedBooking.status}
                        onChange={(event) =>
                          void handleStatusChange(
                            selectedBooking._id,
                            event.target.value as BookingStatus,
                            selectedBooking.paymentStatus,
                          )
                        }
                        disabled={statusUpdatingId === selectedBooking._id}
                        className="w-full rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-3 py-2 text-sm font-semibold text-[#1f2638] outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                      >
                        <option value="pending">{locale === "en" ? "Pending" : "পেন্ডিং"}</option>
                        <option value="ongoing">{locale === "en" ? "Ongoing" : "অনগোয়িং"}</option>
                        <option value="work_done">{locale === "en" ? "Work done" : "কাজ সম্পন্ন"}</option>
                        <option value="cancelled">{locale === "en" ? "Cancelled" : "ক্যানসেলড"}</option>
                      </select>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#e5ebf7] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#161f36]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                      {locale === "en" ? "Payment" : "পেমেন্ট"}
                    </p>
                    <div className="mt-2">
                      <select
                        value={selectedBooking.paymentStatus}
                        onChange={(event) =>
                          void handlePaymentStatusChange(
                            selectedBooking._id,
                            event.target.value as PaymentStatus,
                          )
                        }
                        disabled={statusUpdatingId === selectedBooking._id}
                        className="w-full rounded-2xl border border-[#d7e1f0] bg-[#f8fbff] px-3 py-2 text-sm font-semibold text-[#1f2638] outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#11192c] dark:text-white"
                      >
                        <option value="paid">{locale === "en" ? "Paid" : "পেইড"}</option>
                        <option value="partial">{locale === "en" ? "Partial" : "পার্শিয়াল"}</option>
                        <option value="unpaid">{locale === "en" ? "Unpaid" : "আনপেইড"}</option>
                      </select>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#e5ebf7] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#161f36]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                      {locale === "en" ? "Channel" : "চ্যানেল"}
                    </p>
                    <p className="mt-2 text-sm font-semibold capitalize text-[#1f2638] dark:text-white">
                      {selectedBooking.channel}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#e5ebf7] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#161f36]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                      {locale === "en" ? "Request ID" : "রিকোয়েস্ট আইডি"}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#1f2638] dark:text-white">
                      {selectedBooking.requestCode}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#e5ebf7] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#161f36]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                      {locale === "en" ? "Invoice no" : "ইনভয়েস নং"}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#1f2638] dark:text-white">
                      {selectedBooking.invoiceNo || "—"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e5ebf7] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#161f36]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                    {locale === "en" ? "Requested at" : "রিকোয়েস্ট সময়"}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#1f2638] dark:text-white">
                    {new Date(selectedBooking.requestedAt).toLocaleString(
                      locale === "en" ? "en-GB" : "bn-BD",
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e5ebf7] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#161f36]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                    {locale === "en" ? "Note" : "নোট"}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#60708d] dark:text-[#a7b3c9]">
                    {(locale === "en" ? selectedBooking.noteEn : selectedBooking.noteBn) || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminSurface>
  );
}
