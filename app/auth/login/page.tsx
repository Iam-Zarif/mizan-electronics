"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, LockOpen } from "lucide-react";
import { z } from "zod";
import { useProvider } from "@/Providers/AuthProviders";
import logo from "@/public/mizan.png";

const loginSchema = z.object({
  email: z.email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle } = useProvider();
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your input");
      return;
    }

    try {
      setLoading(true);
      await login(form.email, form.password, form.rememberMe);
      router.push(redirectTo);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Login failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setGoogleLoading(true);
      await loginWithGoogle(form.rememberMe);
      router.push(redirectTo);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Google login failed",
      );
    } finally {
      setGoogleLoading(false);
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
          Welcome Back
        </h1>
        <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) =>
              setForm((current) => ({ ...current, email: e.target.value }))
            }
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm((current) => ({ ...current, password: e.target.value }))
              }
              className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-4 text-neutral-500 cursor-pointer"
            >
              {showPassword ? <LockOpen size={18} /> : <Lock size={18} />}
            </button>
          </div>

          {error ? (
            <p className="text-sm font-medium text-red-500">{error}</p>
          ) : null}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full rounded-xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
        <div className="mt-2 flex w-full items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-neutral-500">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  rememberMe: e.target.checked,
                }))
              }
              className="accent-indigo-500"
            />
            Remember me
          </label>

          <Link
            href="/auth/forgot-password"
            className="font-medium text-indigo-500 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          <span className="text-xs text-neutral-500">OR</span>
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        </div>

        <div className="flex gap-4">
          <SocialButton
            onClick={() => void handleGoogleLogin()}
            disabled={googleLoading}
            icon={<FaGoogle />}
            label={googleLoading ? "Connecting..." : "Google"}
            className="text-red-500 shadow-[0_4px_6px_rgba(239,68,68,0.10)] hover:shadow-[0_6px_18px_rgba(239,68,68,0.45)]"
          />
          <SocialButton
            icon={<FaFacebookF />}
            label="Facebook"
            className="text-blue-600 shadow-[0_4px_6px_rgba(59,130,246,0.10)] hover:shadow-[0_6px_18px_rgba(59,130,246,0.45)]"
          />
        </div>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Don’t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-indigo-500 hover:underline"
          >
            Register
          </Link>
        </p>
    </motion.div>
  );
}

const SocialButton = ({
  icon,
  label,
  className,
  onClick,
  disabled,
}: {
  icon: ReactNode;
  label: string;
  className: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`
      flex flex-1 items-center justify-center gap-2
      rounded-xl border border-neutral-200 cursor-pointer
      py-3 text-sm font-medium
      transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60
      hover:-translate-y-0.5
      ${className}
    `}
  >
    <span className="text-lg">{icon}</span>
    {label}
  </button>
);
