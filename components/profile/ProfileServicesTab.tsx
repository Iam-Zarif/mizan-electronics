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
import { staticProfileServices } from "@/lib/profile-static";

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

export function ProfileServicesTab() {
  const { locale, t } = useLanguage();
  const { user } = useProvider();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (serviceId: string) => {
    if (!user) return;

    const service = staticProfileServices.find((item) => item.id === serviceId);
    if (!service || service.invoice === "—") return;

    try {
      setDownloadingId(serviceId);
      await downloadInvoicePdf(service, user, locale);
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
        <p className="mt-1 text-sm text-neutral-500">
          {t("profile.servicesSubtitle")}
        </p>
      </div>

      {staticProfileServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 px-4 py-8 text-center dark:border-neutral-700">
          <p className="text-base font-semibold text-neutral-900 dark:text-white">
            {t("profile.noServicesTitle")}
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            {t("profile.noServicesDescription")}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {staticProfileServices.map((service) => {
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
                key={service.id}
                className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      <Wrench size={14} />
                      {locale === "en" ? service.titleEn : service.titleBn}
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
                    <span>{locale === "en" ? service.dateEn : service.dateBn}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={15} />
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {t("profile.serviceInvoice")}:
                    </span>
                    <span>{service.invoice}</span>
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
                    {locale === "en" ? service.noteEn : service.noteBn}
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleDownload(service.id)}
                    disabled={service.invoice === "—" || downloadingId === service.id}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {downloadingId === service.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    {downloadingId === service.id
                      ? t("profile.invoiceDownloading")
                      : t("profile.downloadPdf")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
