"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileText, Receipt, Wallet } from "lucide-react";
import { AdminSurface } from "@/components/admin/AdminSections";
import { ApiEmptyState, ApiErrorState, ApiSkeletonBlock } from "@/components/shared/ApiState";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { useApiQuery } from "@/hooks/use-api-query";
import { getAdminInvoices } from "@/lib/dashboard-api";
import { useLanguage } from "@/lib/i18n";

const currencyFormatter = new Intl.NumberFormat("bn-BD");

const formatTaka = (value: number) => `৳${currencyFormatter.format(Math.round(value))}`;

const paymentStatusTone = {
  paid: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300",
  partial: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  unpaid: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300",
} as const;

export default function DashboardInvoicesPage() {
  const { locale } = useLanguage();
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [sort]);

  const { data, isLoading, error, refresh } = useApiQuery(
    () => getAdminInvoices({ sort, page, limit: 12 }),
    [sort, page],
  );

  const invoiceStats = useMemo(
    () =>
      data
        ? [
            {
              value: String(data.stats.totalInvoices),
              bn: "মোট ইনভয়েস",
              en: "Total Invoices",
              icon: FileText,
            },
            {
              value: formatTaka(data.stats.totalBilling),
              bn: "মোট বিলিং",
              en: "Total Billing",
              icon: Wallet,
            },
            {
              value: formatTaka(data.stats.outstanding),
              bn: "বকেয়া",
              en: "Outstanding",
              icon: Receipt,
            },
          ]
        : [],
    [data],
  );

  const paymentSplit = useMemo(
    () =>
      data
        ? [
            {
              labelBn: "পেইড",
              labelEn: "Paid",
              value: `${data.paymentSplit.paid.percent}%`,
              width: `${data.paymentSplit.paid.percent}%`,
            },
            {
              labelBn: "পার্শিয়াল",
              labelEn: "Partial",
              value: `${data.paymentSplit.partial.percent}%`,
              width: `${data.paymentSplit.partial.percent}%`,
            },
            {
              labelBn: "ডিউ",
              labelEn: "Due",
              value: `${data.paymentSplit.unpaid.percent}%`,
              width: `${data.paymentSplit.unpaid.percent}%`,
            },
          ]
        : [],
    [data],
  );

  return (
    <AdminSurface>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1f2638] dark:text-white">
            {locale === "en" ? "Invoices" : "ইনভয়েস"}
          </h1>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-11 min-w-[190px] rounded-2xl border border-[#dbe4f4] bg-white px-4 text-sm font-medium text-[#1f2638] outline-hidden transition focus:border-[#2160ba] dark:border-white/10 dark:bg-[#161f36] dark:text-white"
          >
            <option value="latest">{locale === "en" ? "Newest first" : "নতুন আগে"}</option>
            <option value="oldest">{locale === "en" ? "Oldest first" : "পুরোনো আগে"}</option>
            <option value="amount_high">
              {locale === "en" ? "Amount high to low" : "বেশি এমাউন্ট আগে"}
            </option>
            <option value="amount_low">
              {locale === "en" ? "Amount low to high" : "কম এমাউন্ট আগে"}
            </option>
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <ApiSkeletonBlock rows={1} />
              <ApiSkeletonBlock rows={1} />
              <ApiSkeletonBlock rows={1} />
            </div>
            <ApiSkeletonBlock rows={2} />
          </div>
        ) : error ? (
          <ApiErrorState
            title={locale === "en" ? "Invoices could not be loaded" : "ইনভয়েস লোড করা যায়নি"}
            description={
              locale === "en"
                ? "The invoice feed did not return correctly. Retry the request."
                : "ইনভয়েস ডেটা ঠিকভাবে আসেনি। আবার চেষ্টা করুন।"
            }
            onRetry={refresh}
          />
        ) : !data || data.rows.length === 0 ? (
          <ApiEmptyState
            title={locale === "en" ? "No invoices found" : "কোনো ইনভয়েস পাওয়া যায়নি"}
            description={
              locale === "en"
                ? "Completed service invoices will appear here once admin records them."
                : "অ্যাডমিন সম্পন্ন সার্ভিস ইনভয়েস যোগ করলে এখানে দেখা যাবে।"
            }
          />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {invoiceStats.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.en}
                    className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#5c6cff] dark:bg-white/8 dark:text-[#9cabff]">
                      <Icon size={18} />
                    </span>
                    <p className="mt-4 text-[28px] font-extrabold text-[#1f2638] dark:text-white">
                      {card.value}
                    </p>
                    <p className="mt-1 text-sm text-[#7f8ba3]">
                      {locale === "en" ? card.en : card.bn}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.15fr,0.85fr]">
              <div className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-2xl bg-[#f3f6fd] p-2 text-[#5c6cff] dark:bg-white/8 dark:text-[#9cabff]">
                    <FileText size={18} />
                  </span>
                  <div>
                    <p className="text-lg font-bold text-[#1f2638] dark:text-white">
                      {locale === "en" ? "Recent Invoices" : "সাম্প্রতিক ইনভয়েস"}
                    </p>
                    <p className="text-sm text-[#7f8ba3]">
                      {locale === "en"
                        ? "Latest invoice records with payment state and due amount."
                        : "পেমেন্ট স্টেট ও বকেয়া এমাউন্টসহ সর্বশেষ ইনভয়েস রেকর্ড।"}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <div className="grid grid-cols-[0.8fr_1fr_1.15fr_0.75fr_0.7fr_0.7fr] gap-3 rounded-2xl bg-[#f8fbff] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7f8ba3] dark:bg-[#11192c]">
                      <span>{locale === "en" ? "Invoice" : "ইনভয়েস"}</span>
                      <span>{locale === "en" ? "Customer" : "কাস্টমার"}</span>
                      <span>{locale === "en" ? "Service" : "সার্ভিস"}</span>
                      <span>{locale === "en" ? "Amount" : "এমাউন্ট"}</span>
                      <span>{locale === "en" ? "Due" : "বকেয়া"}</span>
                      <span>{locale === "en" ? "Status" : "স্ট্যাটাস"}</span>
                    </div>
                    <div className="mt-3 space-y-3">
                      {data.rows.map((row) => (
                        <div
                          key={row._id}
                          className="grid grid-cols-[0.8fr_1fr_1.15fr_0.75fr_0.7fr_0.7fr] gap-3 rounded-2xl border border-[#e8edf7] px-4 py-4 dark:border-white/10"
                        >
                          <div>
                            <span className="font-semibold text-[#1f2638] dark:text-white">
                              {row.invoiceNo}
                            </span>
                            <p className="mt-1 text-xs text-[#7f8ba3]">
                              {new Date(row.completedAt).toLocaleDateString(
                                locale === "en" ? "en-US" : "bn-BD",
                              )}
                            </p>
                          </div>
                          <span className="text-[#60708d] dark:text-[#a7b3c9]">
                            {row.customerName}
                          </span>
                          <span className="text-[#60708d] dark:text-[#a7b3c9]">
                            {locale === "en" ? row.serviceTitleEn : row.serviceTitleBn}
                          </span>
                          <span className="font-semibold text-[#1f2638] dark:text-white">
                            {formatTaka(row.subtotal)}
                          </span>
                          <span className="font-semibold text-[#1f2638] dark:text-white">
                            {formatTaka(row.due)}
                          </span>
                          <span
                            className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-center text-xs font-semibold capitalize ${paymentStatusTone[row.paymentStatus]}`}
                          >
                            {row.paymentStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <PaginationControls pagination={data.pagination} onPageChange={setPage} />
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
                  <p className="text-lg font-bold text-[#1f2638] dark:text-white">
                    {locale === "en" ? "Invoice Template" : "ইনভয়েস টেমপ্লেট"}
                  </p>
                  <div className="mt-4 rounded-[22px] border border-dashed border-[#dbe4f4] bg-[#f8fbff] p-5 dark:border-white/10 dark:bg-[#11192c]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#1f2638] dark:text-white">
                          Mizan AC Servicing
                        </p>
                        <p className="mt-1 text-sm text-[#7f8ba3]">
                          {locale === "en"
                            ? "Current template block stays ready for invoice PDF flow."
                            : "ইনভয়েস পিডিএফ ফ্লোর জন্য বর্তমান টেমপ্লেট ব্লক প্রস্তুত আছে।"}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#2160ba] px-4 py-2 text-sm font-semibold text-white"
                      >
                        <Download size={16} />
                        PDF
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-[#f8fbff] p-4 dark:bg-[#11192c]">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7f8ba3]">
                        {locale === "en" ? "Collected" : "সংগৃহীত"}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-[#1f2638] dark:text-white">
                        {formatTaka(data.stats.totalCollected)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#f8fbff] p-4 dark:bg-[#11192c]">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7f8ba3]">
                        {locale === "en" ? "Outstanding" : "বকেয়া"}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-[#1f2638] dark:text-white">
                        {formatTaka(data.stats.outstanding)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
                  <p className="text-lg font-bold text-[#1f2638] dark:text-white">
                    {locale === "en" ? "Payment Split" : "পেমেন্ট স্প্লিট"}
                  </p>
                  <div className="mt-4 space-y-3">
                    {paymentSplit.map((item) => (
                      <div key={item.labelEn}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-[#60708d] dark:text-[#a7b3c9]">
                            {locale === "en" ? item.labelEn : item.labelBn}
                          </span>
                          <span className="font-semibold text-[#1f2638] dark:text-white">
                            {item.value}
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-[#edf3ff] dark:bg-[#11192c]">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81]"
                            style={{ width: item.width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminSurface>
  );
}
