"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2, MailCheck, X } from "lucide-react";
import { useProvider } from "@/Providers/AuthProviders";
import { useLanguage } from "@/lib/i18n";

const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;

  const visibleLocal = local.slice(0, 2);
  const visibleDomain = domain.slice(-6);
  return `${visibleLocal}****${visibleDomain}`;
};

const formatRemaining = (remainingMs: number) => {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function EmailVerificationBanner() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, isAuthLoading, sendVerificationOtp, verifyEmail } = useProvider();

  const [isBannerHidden, setIsBannerHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!open || !expiresAt) return;

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [open, expiresAt]);

  useEffect(() => {
    setIsBannerHidden(false);
  }, [user?.id, user?.isVerified]);

  const remainingMs = expiresAt ? Math.max(0, expiresAt - now) : 0;
  const hasExpired = Boolean(expiresAt) && remainingMs === 0;

  const canShowBanner = useMemo(
    () =>
      !isAuthLoading &&
      Boolean(user) &&
      !user?.isVerified &&
      !isBannerHidden &&
      !pathname.startsWith("/auth"),
    [isAuthLoading, isBannerHidden, pathname, user],
  );

  if (!canShowBanner || !user) {
    return null;
  }

  const handleOpen = async () => {
    setOpen(true);
    setError("");
    setSuccess("");
    setOtp("");
    setNow(Date.now());

    try {
      setIsSending(true);
      const expiry = await sendVerificationOtp();
      setExpiresAt(expiry ? new Date(expiry).getTime() : Date.now());
      setSuccess(t("profile.verificationSent"));
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : t("profile.sendVerificationFailed"),
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setOtp("");
    setNow(Date.now());

    try {
      setIsSending(true);
      const expiry = await sendVerificationOtp();
      setExpiresAt(expiry ? new Date(expiry).getTime() : Date.now());
      setSuccess(t("profile.verificationResent"));
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : t("profile.sendVerificationFailed"),
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setSuccess("");

    try {
      setIsVerifying(true);
      await verifyEmail(otp.trim());
      setSuccess(t("profile.verificationSuccess"));
      setOpen(false);
      setOtp("");
      setExpiresAt(null);
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : t("profile.verificationFailed"),
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[70] border-b border-amber-200 bg-amber-50/95 px-4 py-2 text-[11px] text-amber-900 backdrop-blur sm:text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <MailCheck size={14} className="shrink-0" />
            <p className="truncate font-medium">{t("profile.verificationBanner")}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => void handleOpen()}
              className="rounded-full border border-amber-300 px-3 py-1 font-semibold text-amber-900 transition hover:bg-amber-100"
            >
              {t("profile.verifyNow")}
            </button>
            <button
              type="button"
              onClick={() => setIsBannerHidden(true)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-amber-300 text-amber-900 transition hover:bg-amber-100"
              aria-label="Hide verification banner"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-neutral-900">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {t("profile.verificationModalTitle")}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {t("profile.verificationModalSubtitle")}{" "}
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {maskEmail(user.email)}
                </span>
              </p>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  {t("profile.verificationCode")}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder={t("profile.verificationCodePlaceholder")}
                  className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
                />
              </label>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">
                  {t("profile.verificationTimer")}
                </span>
                <span
                  className={`font-semibold ${
                    hasExpired ? "text-red-500" : "text-neutral-900 dark:text-white"
                  }`}
                >
                  {hasExpired
                    ? t("profile.verificationExpired")
                    : formatRemaining(remainingMs)}
                </span>
              </div>

              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              {success ? <p className="text-sm text-green-600">{success}</p> : null}

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void handleResend()}
                  disabled={isSending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-60"
                >
                  {isSending ? <Loader2 size={16} className="animate-spin" /> : null}
                  {t("profile.resendCode")}
                </button>
                <button
                  type="button"
                  onClick={() => void handleVerify()}
                  disabled={isVerifying || otp.trim().length !== 6 || hasExpired}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-4 py-3 text-sm font-semibold text-white shadow disabled:opacity-60"
                >
                  {isVerifying ? <Loader2 size={16} className="animate-spin" /> : null}
                  {isVerifying ? t("profile.verifying") : t("profile.verifySubmit")}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
