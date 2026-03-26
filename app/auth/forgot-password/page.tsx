"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Lock, LockOpen } from "lucide-react";
import { z } from "zod";
import BrandLogo from "@/components/shared/BrandLogo";
import { api, getErrorMessage } from "@/lib/api";
import {
  emailSchema,
  passwordSchema,
  translateAuthError,
} from "@/lib/auth-validation";
import { useLanguage } from "@/lib/i18n";

const forgotEmailSchema = z.object({
  email: emailSchema,
});

const resetSchema = z.object({
  otp: z.string().length(6, "OTP অবশ্যই ৬ সংখ্যার হতে হবে"),
  newPassword: passwordSchema,
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const copy =
    locale === "en"
      ? {
          title: "Forgot Password",
          emailStep: "Enter your email to receive an OTP.",
          resetStep: "Enter the OTP and set a new password.",
          email: "Email address",
          sendOtp: "Send OTP",
          sendingOtp: "Sending OTP...",
          otp: "6-digit OTP",
          newPassword: "New password",
          resetPassword: "Reset Password",
          updating: "Updating...",
          successOtp: "OTP sent to your email",
          successReset: "Password updated successfully",
          back: "Back to login",
          remember: "Remembered your password?",
          invalidEmail: "Please check your email",
          invalidInput: "Please check your input",
        }
      : {
          title: "পাসওয়ার্ড ভুলে গেছেন",
          emailStep: "OTP পাওয়ার জন্য আপনার ইমেইল দিন।",
          resetStep: "OTP দিন এবং নতুন পাসওয়ার্ড সেট করুন।",
          email: "ইমেইল ঠিকানা",
          sendOtp: "OTP পাঠান",
          sendingOtp: "OTP পাঠানো হচ্ছে...",
          otp: "৬ সংখ্যার OTP",
          newPassword: "নতুন পাসওয়ার্ড",
          resetPassword: "পাসওয়ার্ড রিসেট করুন",
          updating: "আপডেট হচ্ছে...",
          successOtp: "আপনার ইমেইলে OTP পাঠানো হয়েছে",
          successReset: "পাসওয়ার্ড সফলভাবে আপডেট হয়েছে",
          back: "লগইনে ফিরে যান",
          remember: "পাসওয়ার্ড মনে পড়েছে?",
          invalidEmail: "ইমেইল ঠিক আছে কি না যাচাই করুন",
          invalidInput: "ইনপুট ঠিক আছে কি না যাচাই করুন",
        };

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const parsed = forgotEmailSchema.safeParse({ email });
    if (!parsed.success) {
      setError(
        translateAuthError(
          parsed.error.issues[0]?.message ?? copy.invalidEmail,
        ),
      );
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      setSuccess(copy.successOtp);
      setStep("reset");
    } catch (submissionError) {
      setError(translateAuthError(getErrorMessage(submissionError)));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const parsed = resetSchema.safeParse({ otp, newPassword });
    if (!parsed.success) {
      setError(
        translateAuthError(
          parsed.error.issues[0]?.message ?? copy.invalidInput,
        ),
      );
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      setSuccess(copy.successReset);
      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (submissionError) {
      setError(translateAuthError(getErrorMessage(submissionError)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg rounded-3xl border border-black/5 p-4 backdrop-blur-xl lg:max-w-md lg:bg-white/70 lg:p-8 lg:shadow-[0_30px_80px_-35px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-black/60"
    >
      <div className="flex justify-center">
        <BrandLogo size={48} />
      </div>
      <h1 className="mt-3 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-center text-3xl font-extrabold text-transparent">
        {copy.title}
      </h1>
      <p className="mt-2 text-center text-sm text-neutral-500">
        {step === "email"
          ? copy.emailStep
          : copy.resetStep}
      </p>

      {step === "email" ? (
        <form onSubmit={handleSendOtp} className="mt-8 space-y-4">
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.email}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />

          {error ? (
            <p className="text-sm font-medium text-red-500">{error}</p>
          ) : null}

          {success ? (
            <p className="text-sm font-medium text-green-600">{success}</p>
          ) : null}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full rounded-xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-60"
          >
            {loading ? copy.sendingOtp : copy.sendOtp}
          </motion.button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="mt-8 space-y-4">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder={copy.otp}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={copy.newPassword}
              className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-4 text-neutral-500"
            >
              {showPassword ? <LockOpen size={18} /> : <Lock size={18} />}
            </button>
          </div>

          {error ? (
            <p className="text-sm font-medium text-red-500">{error}</p>
          ) : null}

          {success ? (
            <p className="text-sm font-medium text-green-600">{success}</p>
          ) : null}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full rounded-xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-60"
          >
            {loading ? copy.updating : copy.resetPassword}
          </motion.button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-neutral-500">
        {copy.remember}{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-indigo-500 hover:underline"
        >
          {copy.back}
        </Link>
      </p>
    </motion.div>
  );
}
