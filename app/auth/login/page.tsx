"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { FaGoogle } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle, Lock, LockOpen } from "lucide-react";
import { useProvider } from "@/Providers/AuthProviders";
import { AuthShell } from "@/components/auth/AuthShell";
import {
  emailSchema,
  getFieldError,
  loginSchema,
  translateAuthError,
} from "@/lib/auth-validation";
import { useLanguage } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLanguage();
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
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [activeField, setActiveField] = useState<"email" | "password" | null>(
    null,
  );

  const redirectTo = searchParams.get("redirect") || "/";
  const registerHref = `/auth/register?redirect=${encodeURIComponent(redirectTo)}`;
  const emailError = getFieldError(emailSchema, form.email);
  const passwordError = !form.password ? "পাসওয়ার্ড দিতে হবে" : "";
  const copy =
    locale === "en"
      ? {
          title: "Welcome Back",
          email: "Email address",
          password: "Password",
          loading: "Logging in...",
          submit: "Login",
          remember: "Remember me",
          forgot: "Forgot password?",
          divider: "OR",
          google: "Google",
          connecting: "Connecting...",
          noAccount: "Don’t have an account?",
          register: "Register",
        }
      : {
          title: "আবার স্বাগতম",
          email: "ইমেইল ঠিকানা",
          password: "পাসওয়ার্ড",
          loading: "লগইন হচ্ছে...",
          submit: "লগইন",
          remember: "আমাকে মনে রাখুন",
          forgot: "পাসওয়ার্ড ভুলে গেছেন?",
          divider: "অথবা",
          google: "গুগল",
          connecting: "সংযোগ হচ্ছে...",
          noAccount: "অ্যাকাউন্ট নেই?",
          register: "রেজিস্টার করুন",
          invalidInput: "ইনপুট ঠিক আছে কি না যাচাই করুন",
        };
  const activeMessage =
    activeField === "email"
      ? emailError
      : activeField === "password"
        ? passwordError
        : "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setTouched({
      email: true,
      password: true,
    });

    const parsed = loginSchema.safeParse(form);
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
      await login(form.email, form.password, form.rememberMe);
      router.push(redirectTo);
      router.refresh();
    } catch (submissionError) {
      setError(
        translateAuthError(
          submissionError instanceof Error
            ? submissionError.message
            : "Login failed",
        ),
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
        translateAuthError(
          submissionError instanceof Error
            ? submissionError.message
            : "Google login failed",
        ),
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      title={copy.title}
      imageSide="right"
    >
        <div className="mx-auto w-full max-w-[27rem]">
        <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
          <input
            type="email"
            autoComplete="email"
            placeholder={copy.email}
            value={form.email}
            onFocus={() => setActiveField("email")}
            onBlur={() => {
              setTouched((current) => ({ ...current, email: true }));
              setActiveField((current) => (current === "email" ? null : current));
            }}
            onChange={(e) =>
              setForm((current) => ({ ...current, email: e.target.value }))
            }
            className={`w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 dark:border-white/10 ${
              emailError && touched.email
                ? "border-red-300 focus:ring-red-400"
                : "border-black/10 focus:ring-indigo-500"
            }`}
          />
          {activeField === "email" && activeMessage ? (
            <p className="mt-1 text-xs font-medium text-red-500">
              {activeMessage}
            </p>
          ) : null}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={copy.password}
              value={form.password}
              onFocus={() => setActiveField("password")}
              onBlur={() => {
                setTouched((current) => ({ ...current, password: true }));
                setActiveField((current) =>
                  current === "password" ? null : current,
                );
              }}
              onChange={(e) =>
                setForm((current) => ({ ...current, password: e.target.value }))
              }
              className={`w-full rounded-xl border bg-transparent px-4 py-3 pr-12 text-sm outline-none focus:ring-2 dark:border-white/10 ${
                passwordError && touched.password
                  ? "border-red-300 focus:ring-red-400"
                  : "border-black/10 focus:ring-indigo-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-4 text-neutral-500 cursor-pointer"
            >
              {showPassword ? <LockOpen size={18} /> : <Lock size={18} />}
            </button>
          </div>
          {activeField === "password" && activeMessage ? (
            <p className="mt-1 text-xs font-medium text-red-500">
              {activeMessage}
            </p>
          ) : null}

          {error ? (
            <p className="text-sm font-medium text-red-500">{error}</p>
          ) : null}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                <span>{copy.loading}</span>
              </>
            ) : (
              copy.submit
            )}
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
            {copy.remember}
          </label>

          <Link
            href="/auth/forgot-password"
            className="font-medium text-indigo-500 hover:underline"
          >
            {copy.forgot}
          </Link>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          <span className="text-xs text-neutral-500">{copy.divider}</span>
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        </div>

        <div className="flex gap-4">
          <SocialButton
            onClick={() => void handleGoogleLogin()}
            disabled={googleLoading}
            icon={<FaGoogle />}
            label={googleLoading ? copy.connecting : copy.google}
            className="text-red-500 shadow-[0_4px_6px_rgba(239,68,68,0.10)] hover:shadow-[0_6px_18px_rgba(239,68,68,0.45)]"
          />
        </div>

        <p className="mt-6 text-center text-sm text-neutral-500">
          {copy.noAccount}{" "}
          <Link
            href={registerHref}
            className="font-semibold text-indigo-500 hover:underline"
          >
            {copy.register}
          </Link>
        </p>
        </div>
    </AuthShell>
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
