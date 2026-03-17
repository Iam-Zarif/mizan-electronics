"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Lock, LockOpen } from "lucide-react";
import { z } from "zod";
import { api, getErrorMessage } from "@/lib/api";
import logo from "@/public/mizan.png";

const emailSchema = z.object({
  email: z.email("Valid email is required"),
});

const resetSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const parsed = emailSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your email");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      setSuccess("OTP sent to your email");
      setStep("reset");
    } catch (submissionError) {
      setError(getErrorMessage(submissionError));
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
      setError(parsed.error.issues[0]?.message ?? "Please check your input");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      setSuccess("Password updated successfully");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (submissionError) {
      setError(getErrorMessage(submissionError));
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
      <Image
        src={logo}
        alt="Mizan AC Servicing"
        width={48}
        height={48}
        className="mx-auto"
      />
      <h1 className="mt-3 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-center text-3xl font-extrabold text-transparent">
        Forgot Password
      </h1>
      <p className="mt-2 text-center text-sm text-neutral-500">
        {step === "email"
          ? "Enter your email to receive an OTP."
          : "Enter the OTP and set a new password."}
      </p>

      {step === "email" ? (
        <form onSubmit={handleSendOtp} className="mt-8 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
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
            {loading ? "Sending OTP..." : "Send OTP"}
          </motion.button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="mt-8 space-y-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit OTP"
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
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
            {loading ? "Updating..." : "Reset Password"}
          </motion.button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-neutral-500">
        Remembered your password?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-indigo-500 hover:underline"
        >
          Back to login
        </Link>
      </p>
    </motion.div>
  );
}
