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

const registerSchema = z
  .object({
    f_name: z.string().min(2, "Name is required"),
    phone: z.string().min(11, "Phone is required"),
    email: z.email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    rememberMe: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, loginWithGoogle } = useProvider();
  const [form, setForm] = useState({
    f_name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: true,
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";
  const loginHref = `/auth/login?redirect=${encodeURIComponent(redirectTo)}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your input");
      return;
    }

    try {
      setLoading(true);
      await register(
        form.f_name,
        form.phone,
        form.email,
        form.password,
        form.rememberMe,
      );
      router.push(redirectTo);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Registration failed",
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
      className="w-full max-w-lg rounded-3xl border border-black/5 p-4 backdrop-blur-xl lg:max-w-[28rem] lg:bg-white/70 lg:p-8 lg:shadow-[0_30px_80px_-35px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-black/60"
    >
        <Image
          src={logo}
          alt="Mizan AC Servicing"
          width={48}
          height={48}
          className="mx-auto"
        />

        <h1 className="mt-3 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-center text-3xl font-extrabold text-transparent">
          Create Account
        </h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            name="f_name"
            value={form.f_name}
            onChange={handleChange}
            type="text"
            placeholder="Full name"
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email address"
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="tel"
            placeholder="Phone number"
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
          />

          <div className="relative">
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-0 inline-flex cursor-pointer items-center justify-center px-4 text-neutral-500"
            >
              {showPassword ? <LockOpen size={18} /> : <Lock size={18} />}
            </button>
          </div>

          <div className="relative">
            <input
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute inset-y-0 right-0 inline-flex cursor-pointer items-center justify-center px-4 text-neutral-500"
            >
              {showConfirmPassword ? (
                <LockOpen size={18} />
              ) : (
                <Lock size={18} />
              )}
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-neutral-500">
            <input
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
              type="checkbox"
              className="accent-indigo-500"
            />
            Remember me
          </label>

          {error ? (
            <p className="text-sm font-medium text-red-500">{error}</p>
          ) : null}

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>
        </form>

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
          Already have an account?{" "}
          <Link
            href={loginHref}
            className="font-semibold text-indigo-500 hover:underline"
          >
            Login
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
      rounded-xl border border-neutral-100 cursor-pointer
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
