"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  BadgeCheck,
  CalendarDays,
  Download,
  FileText,
  Loader2,
  Wallet,
  Wrench,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useProvider } from "@/Providers/AuthProviders";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";
import { ApiErrorState, ApiEmptyState, ApiSkeletonBlock } from "@/components/shared/ApiState";
import { getProfileServices, type ProfileService } from "@/lib/dashboard-api";
import { getEmptyFieldText, getValueOrEmpty } from "@/lib/display";
import { useApiQuery } from "@/hooks/use-api-query";
import type { ProfileServiceHistory } from "@/lib/profile-static";

const statusClasses = {
  completed: "bg-green-100 text-green-700",
  upcoming: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
};

const paymentClasses = {
  paid: "bg-emerald-100 text-emerald-700",
  partial: "bg-amber-100 text-amber-700",
  unpaid: "bg-rose-100 text-rose-700",
};

const toHistoryShape = (service: ProfileService): ProfileServiceHistory => ({
  id: service._id,
  titleBn: service.serviceTitleBn,
  titleEn: service.serviceTitleEn,
  status: service.status,
  dateBn: new Date(service.completedAt).toLocaleDateString("bn-BD"),
  dateEn: new Date(service.completedAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
  invoice: getValueOrEmpty(service.invoiceNo, "en", "Invoice", "ইনভয়েস"),
  noteBn: service.noteBn,
  noteEn: service.noteEn,
  paymentStatus: service.paymentStatus,
  amountPaid: service.amountPaid,
  subtotal: service.subtotal,
  due: service.due,
  addressBn: service.addressBn,
  addressEn: service.addressEn,
  dueDateBn: service.dueDate
    ? new Date(service.dueDate).toLocaleDateString("bn-BD")
    : getEmptyFieldText("bn", "Due date", "ডিউ ডেট"),
  dueDateEn: service.dueDate
    ? new Date(service.dueDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : getEmptyFieldText("en", "Due date", "ডিউ ডেট"),
  items: service.items,
});

export function ProfileServicesTab() {
  const { locale, t } = useLanguage();
  const { user } = useProvider();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { data, isLoading, error, refresh } = useApiQuery(
    getProfileServices,
    [],
    Boolean(user),
  );

  const handleDownload = async (service: ProfileService) => {
    if (!user || !service.invoiceNo) return;

    try {
      setDownloadingId(service._id);
      await downloadInvoicePdf(toHistoryShape(service), user);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-4 shadow dark:bg-neutral-900 lg:p-6"
    >
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          {t("profile.servicesTitle")}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">{t("profile.servicesSubtitle")}</p>
      </div>

      {isLoading ? <ApiSkeletonBlock rows={3} /> : null}
      {!isLoading && error ? (
        <ApiErrorState
          title={locale === "en" ? "Services failed to load" : "সার্ভিস হিস্ট্রি লোড হয়নি"}
          description={error}
          onRetry={() => void refresh()}
        />
      ) : null}
      {!isLoading && !error && data && data.rows.length === 0 ? (
        <ApiEmptyState
          title={t("profile.noServicesTitle")}
          description={t("profile.noServicesDescription")}
        />
      ) : null}

      {!isLoading && !error && data && data.rows.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.rows.map((service) => {
            const statusText =
              service.status === "completed"
                ? t("profile.serviceStatusCompleted")
                : service.status === "upcoming"
                  ? t("profile.serviceStatusUpcoming")
                  : t("profile.serviceStatusPending");
            const paymentText =
              service.paymentStatus === "paid"
                ? t("profile.paymentPaid")
                : service.paymentStatus === "partial"
                  ? t("profile.paymentPartial")
                  : t("profile.paymentUnpaid");

            return (
              <div
                key={service._id}
                className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      <Wrench size={14} />
                      {locale === "en" ? service.serviceTitleEn : service.serviceTitleBn}
                    </div>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[service.status]}`}
                  >
                    <BadgeCheck size={13} />
                    {statusText}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={15} />
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {t("profile.serviceDate")}:
                    </span>
                    <span>
                      {new Date(service.completedAt).toLocaleDateString(
                        locale === "en" ? "en-GB" : "bn-BD",
                        { day: "2-digit", month: "short", year: "numeric" },
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={15} />
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {t("profile.serviceInvoice")}:
                    </span>
                    <span>{getValueOrEmpty(service.invoiceNo, locale, "Invoice", "ইনভয়েস")}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Wallet size={15} />
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {t("profile.paymentStatus")}:
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${paymentClasses[service.paymentStatus]}`}
                    >
                      {paymentText}
                    </span>
                  </div>
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div className="rounded-xl bg-neutral-50 px-3 py-3 dark:bg-neutral-800/80">
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {t("profile.amountPaid")}:
                      </span>{" "}
                      ৳ {service.amountPaid}
                    </div>
                    <div className="rounded-xl bg-neutral-50 px-3 py-3 dark:bg-neutral-800/80">
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {t("profile.dueAmount")}:
                      </span>{" "}
                      ৳ {service.due}
                    </div>
                  </div>
                  <p className="rounded-xl bg-neutral-50 px-3 py-3 text-sm leading-6 text-neutral-600 dark:bg-neutral-800/80 dark:text-neutral-300">
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {t("profile.serviceNote")}:
                    </span>{" "}
                    {getValueOrEmpty(
                      locale === "en" ? service.noteEn : service.noteBn,
                      locale,
                      "Note",
                      "নোট",
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleDownload(service)}
                    disabled={!service.invoiceNo || downloadingId === service._id}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {downloadingId === service._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    {downloadingId === service._id
                      ? t("profile.invoiceDownloading")
                      : t("profile.downloadPdf")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </motion.div>
  );
}
