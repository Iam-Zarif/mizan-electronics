"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import {
  BadgeCheck,
  Camera,
  Loader2,
  LogOut,
  Mail,
  MailCheck,
  Phone,
  ShieldCheck,
  Upload,
  User,
  X,
} from "lucide-react";
import { useProvider } from "@/Providers/AuthProviders";
import { useLanguage } from "@/lib/i18n";
import { isAdminUser } from "@/lib/auth";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

export function ProfileDetails() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const {
    user,
    isAuthLoading,
    updateProfile,
    uploadAvatar,
    logout,
    sendVerificationOtp,
    verifyEmail,
  } =
    useProvider();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showVerificationNotice, setShowVerificationNotice] = useState(true);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationOtp, setVerificationOtp] = useState("");
  const [verificationExpiresAt, setVerificationExpiresAt] = useState<number | null>(null);
  const [verificationNow, setVerificationNow] = useState(Date.now());
  const [isSendingVerificationOtp, setIsSendingVerificationOtp] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    f_name: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      f_name: user.f_name,
      phone: user.phone ?? "",
    });
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  useEffect(() => {
    setShowVerificationNotice(true);
  }, [user?.id, user?.isVerified]);

  useEffect(() => {
    if (!isVerificationModalOpen || !verificationExpiresAt) return;

    const timer = window.setInterval(() => {
      setVerificationNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isVerificationModalOpen, verificationExpiresAt]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setIsSaving(true);
      await updateProfile(form);
      setSuccess(t("profile.updateProfileSuccess"));
      setIsEditing(false);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : t("profile.updateProfileFailed"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }

    setAvatarFile(file);
    setAvatarPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleAvatarConfirm = async () => {
    if (!avatarFile) return;

    setError("");
    setSuccess("");

    try {
      setIsUploading(true);
      await uploadAvatar(avatarFile);
      setSuccess(t("profile.uploadImageSuccess"));
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
      setAvatarFile(null);
      setAvatarPreviewUrl(null);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : t("profile.uploadAvatarFailed"),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const clearAvatarSelection = () => {
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }
    setAvatarPreviewUrl(null);
    setAvatarFile(null);
    setError("");
    setSuccess("");
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.replace("/");
    } catch {
      setError(t("profile.logoutFailed"));
    }
  };

  const handleOpenVerificationModal = async () => {
    setVerificationError("");
    setVerificationSuccess("");
    setVerificationOtp("");
    const initialExpiry = Date.now() + 5 * 60 * 1000;
    setVerificationNow(Date.now());
    setVerificationExpiresAt(initialExpiry);
    setIsVerificationModalOpen(true);

    try {
      setIsSendingVerificationOtp(true);
      const expiresAt = await sendVerificationOtp();
      setVerificationExpiresAt(
        expiresAt ? new Date(expiresAt).getTime() : initialExpiry,
      );
      setVerificationSuccess(t("profile.verificationSent"));
    } catch (sendError) {
      setVerificationError(
        sendError instanceof Error
          ? sendError.message
          : t("profile.sendVerificationFailed"),
      );
    } finally {
      setIsSendingVerificationOtp(false);
    }
  };

  const handleResendVerificationOtp = async () => {
    setVerificationError("");
    setVerificationSuccess("");
    setVerificationOtp("");
    const initialExpiry = Date.now() + 5 * 60 * 1000;
    setVerificationNow(Date.now());
    setVerificationExpiresAt(initialExpiry);

    try {
      setIsSendingVerificationOtp(true);
      const expiresAt = await sendVerificationOtp();
      setVerificationExpiresAt(
        expiresAt ? new Date(expiresAt).getTime() : initialExpiry,
      );
      setVerificationSuccess(t("profile.verificationResent"));
    } catch (sendError) {
      setVerificationError(
        sendError instanceof Error
          ? sendError.message
          : t("profile.sendVerificationFailed"),
      );
    } finally {
      setIsSendingVerificationOtp(false);
    }
  };

  const handleVerifyEmail = async () => {
    setVerificationError("");
    setVerificationSuccess("");

    try {
      setIsVerifyingEmail(true);
      await verifyEmail(verificationOtp.trim());
      setVerificationSuccess(t("profile.verificationSuccess"));
      setIsVerificationModalOpen(false);
      setVerificationOtp("");
      setVerificationExpiresAt(null);
    } catch (verificationError) {
      setVerificationError(
        verificationError instanceof Error
          ? verificationError.message
          : t("profile.verificationFailed"),
      );
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow dark:bg-neutral-900 lg:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-16 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-5 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-60 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-12 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-12 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    );
  }

  if (!user) return null;
  const isAdmin = isAdminUser(user);

  const remainingVerificationMs = verificationExpiresAt
    ? Math.max(0, verificationExpiresAt - verificationNow)
    : 0;
  const isVerificationExpired =
    Boolean(verificationExpiresAt) && remainingVerificationMs === 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-4 shadow dark:bg-neutral-900 lg:p-5"
      >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col items-start gap-3 lg:flex-row lg:gap-4">
          <div className="relative self-center lg:self-auto">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              {avatarPreviewUrl ? (
                <Image
                  src={avatarPreviewUrl}
                  alt={`${user.f_name} ${locale === "en" ? "preview" : "প্রিভিউ"}`}
                  fill
                  className="object-cover"
                />
              ) : user.avatar?.url ? (
                <Image
                  src={getOptimizedCloudinaryUrl(user.avatar.url, {
                    width: 160,
                    height: 160,
                    crop: "fill",
                  })}
                  alt={user.f_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-500">
                  <User size={28} />
                </div>
              )}
            </div>

            {isAdmin ? (
              <motion.span
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(99,102,241,0.15)",
                    "0 0 22px rgba(99,102,241,0.5)",
                    "0 0 0 rgba(99,102,241,0.15)",
                  ],
                  scale: [1, 1.04, 1],
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-1 -left-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-indigo-200 bg-white text-indigo-600"
                title={t("profile.admin")}
              >
                <BadgeCheck size={15} />
              </motion.span>
            ) : null}

            <label className="absolute -bottom-1 -right-1 inline-flex cursor-pointer items-center justify-center rounded-full bg-indigo-600 p-2 text-white shadow">
              <Camera size={14} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="min-w-0 w-full space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-2 text-center lg:justify-start lg:text-left">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {user.f_name}
              </h2>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  user.isVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <ShieldCheck size={12} />
                {user.isVerified ? t("profile.verified") : t("profile.notVerified")}
              </span>
            </div>
            <InfoInline icon={<Mail size={16} />} label={t("profile.email")} value={user.email} />
            <InfoInline
              icon={<Phone size={16} />}
              label={t("profile.phone")}
              value={user.phone || t("profile.addPhone")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:gap-3">
          <button
            type="button"
            onClick={() => {
              setIsEditing((current) => !current);
              setError("");
              setSuccess("");
            }}
            className="w-full rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 sm:w-auto"
          >
            {isEditing ? t("profile.cancel") : t("profile.editProfile")}
          </button>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50/70 px-3.5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/35 sm:w-auto"
          >
            <LogOut size={15} />
            {t("profile.logout")}
          </button>
        </div>
      </div>

      {avatarPreviewUrl ? (
        <div className="mt-4 space-y-3 rounded-2xl border border-indigo-200/70 bg-indigo-50/70 p-4 dark:border-indigo-500/20 dark:bg-indigo-950/20">
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            {locale === "en"
              ? "Preview your new profile photo, then confirm the upload."
              : "নতুন প্রোফাইল ছবি প্রিভিউ দেখুন, তারপর আপলোড নিশ্চিত করুন।"}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:gap-3">
            <button
              type="button"
              onClick={() => void handleAvatarConfirm()}
              disabled={isUploading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 px-5 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-60 sm:w-auto"
            >
              {isUploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              {isUploading ? t("profile.uploading") : t("profile.confirmPhoto")}
            </button>
            <button
              type="button"
              onClick={clearAvatarSelection}
              disabled={isUploading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 sm:w-auto"
            >
              <X size={16} />
              {t("profile.cancelPreview")}
            </button>
          </div>
        </div>
      ) : null}

      {isEditing || error || success ? (
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {isEditing ? (
            <>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
                {t("profile.fullName")}
                <input
                  type="text"
                  value={form.f_name}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, f_name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
                {t("profile.phoneNumber")}
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, phone: e.target.value }))
                  }
                  className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
                />
              </label>
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            {success ? <p className="text-sm text-green-600">{success}</p> : null}

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSaving ? t("profile.saving") : t("profile.saveChanges")}
              </button>
            </div>
            </>
          ) : null}

          {!isEditing && (error || success) ? (
            <div className="space-y-2">
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              {success ? <p className="text-sm text-green-600">{success}</p> : null}
            </div>
          ) : null}
        </form>
      ) : null}

      {!user.isVerified && showVerificationNotice ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-1.5 text-xs text-amber-900">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span className="mt-0.5 rounded-full bg-amber-100 p-2 text-amber-700">
                <MailCheck size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className=" leading-6 text-amber-800">
                    {t("profile.verificationBanner")}
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleOpenVerificationModal()}
                    className="inline-flex shrink-0 items-center justify-center rounded-xl border border-amber-300 bg-white px-4 py-2 font-semibold text-amber-900 transition hover:bg-amber-100"
                  >
                    {t("profile.verifyNow")}
                  </button>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowVerificationNotice(false)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-300 text-amber-900 transition hover:bg-amber-100"
              aria-label="Hide verification notice"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : null}
      </motion.div>

      {isVerificationModalOpen ? (
        <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-neutral-900">
            <button
              type="button"
              onClick={() => setIsVerificationModalOpen(false)}
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
                  value={verificationOtp}
                  onChange={(event) =>
                    setVerificationOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
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
                    isVerificationExpired
                      ? "text-red-500"
                      : "text-neutral-900 dark:text-white"
                  }`}
                >
                  {isVerificationExpired
                    ? t("profile.verificationExpired")
                    : formatRemaining(remainingVerificationMs)}
                </span>
              </div>

              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              {success ? <p className="text-sm text-green-600">{success}</p> : null}

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void handleResendVerificationOtp()}
                  disabled={isSendingVerificationOtp}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-60"
                >
                  {isSendingVerificationOtp ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  {t("profile.resendCode")}
                </button>
                <button
                  type="button"
                  onClick={() => void handleVerifyEmail()}
                  disabled={
                    isVerifyingEmail ||
                    verificationOtp.trim().length !== 6 ||
                    isVerificationExpired
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-4 py-3 text-sm font-semibold text-white shadow disabled:opacity-60"
                >
                  {isVerifyingEmail ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  {isVerifyingEmail
                    ? t("profile.verifying")
                    : t("profile.verifySubmit")}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return `${local.slice(0, 2)}****${domain.slice(-6)}`;
}

function formatRemaining(remainingMs: number) {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function InfoInline({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-neutral-200 px-3 py-2 text-center dark:border-neutral-800 lg:flex-row lg:items-center lg:gap-2 lg:text-left">
      <span className="text-indigo-500">{icon}</span>
      <p className="text-xs text-neutral-500">{label}:</p>
      <p className="break-all text-sm font-semibold text-neutral-900 dark:text-white lg:break-normal">
        {value}
      </p>
    </div>
  );
}
