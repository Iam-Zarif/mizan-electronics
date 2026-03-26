"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, LockOpen } from "lucide-react";
import { useProvider } from "@/Providers/AuthProviders";
import { AuthShell } from "@/components/auth/AuthShell";
import {
  bangladeshPhoneSchema,
  emailSchema,
  getFieldError,
  nameSchema,
  normalizeBangladeshPhone,
  passwordSchema,
  registerSchema,
} from "@/lib/auth-validation";

type RegisterForm = {
  f_name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
};

type RegisterErrors = Record<keyof Omit<RegisterForm, "rememberMe">, string>;

const inputBaseClassName =
  "w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition focus:ring-2 dark:border-white/10";

const getInputClassName = (error: string, touched: boolean) => {
  if (error && touched) {
    return `${inputBaseClassName} border-red-300 focus:ring-red-400`;
  }

  return `${inputBaseClassName} border-black/10 focus:ring-indigo-500`;
};

const getRegisterFieldErrors = (form: RegisterForm): RegisterErrors => ({
  f_name: getFieldError(nameSchema, form.f_name),
  phone: getFieldError(bangladeshPhoneSchema, form.phone),
  email: getFieldError(emailSchema, form.email),
  password: getFieldError(passwordSchema, form.password),
  confirmPassword:
    !form.confirmPassword
      ? "Please confirm your password"
      : form.password !== form.confirmPassword
        ? "Passwords do not match"
        : "",
});

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, loginWithGoogle } = useProvider();
  const [form, setForm] = useState<RegisterForm>({
    f_name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: true,
  });
  const [touched, setTouched] = useState<
    Record<keyof Omit<RegisterForm, "rememberMe">, boolean>
  >({
    f_name: false,
    phone: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeField, setActiveField] = useState<keyof RegisterErrors | null>(
    null,
  );

  const fieldErrors = useMemo(() => getRegisterFieldErrors(form), [form]);
  const redirectTo = searchParams.get("redirect") || "/";
  const loginHref = `/auth/login?redirect=${encodeURIComponent(redirectTo)}`;

  const handleFieldChange = (name: keyof RegisterForm, value: string | boolean) => {
    setForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "phone" && typeof value === "string") {
        next.phone = normalizeBangladeshPhone(value);
      }

      return next;
    });
  };

  const handleBlur = (name: keyof RegisterErrors) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setActiveField((current) => (current === name ? null : current));
  };

  const getActiveMessage = (name: keyof RegisterErrors) => {
    if (activeField !== name) return "";
    return fieldErrors[name];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setTouched({
      f_name: true,
      phone: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your input");
      return;
    }

    try {
      setLoading(true);
      await register(
        form.f_name.trim(),
        normalizeBangladeshPhone(form.phone),
        form.email.trim().toLowerCase(),
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
    <AuthShell title="Create Account" imageSide="left">
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <input
            name="f_name"
            value={form.f_name}
            onChange={(e) => handleFieldChange("f_name", e.target.value)}
            onFocus={() => setActiveField("f_name")}
            onBlur={() => handleBlur("f_name")}
            type="text"
            placeholder="Full name"
            className={getInputClassName(fieldErrors.f_name, touched.f_name)}
          />
          {getActiveMessage("f_name") ? (
            <p className="mt-1 text-xs font-medium text-red-500">
              {getActiveMessage("f_name")}
            </p>
          ) : null}
        </div>

        <div>
          <input
            name="email"
            value={form.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            onFocus={() => setActiveField("email")}
            onBlur={() => handleBlur("email")}
            type="email"
            placeholder="Email address"
            className={getInputClassName(fieldErrors.email, touched.email)}
          />
          {getActiveMessage("email") ? (
            <p className="mt-1 text-xs font-medium text-red-500">
              {getActiveMessage("email")}
            </p>
          ) : null}
        </div>

        <div>
          <input
            name="phone"
            value={form.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            onFocus={() => setActiveField("phone")}
            onBlur={() => handleBlur("phone")}
            type="tel"
            inputMode="numeric"
            placeholder="Bangladesh phone number"
            className={getInputClassName(fieldErrors.phone, touched.phone)}
          />
          {getActiveMessage("phone") ? (
            <p className="mt-1 text-xs font-medium text-red-500">
              {getActiveMessage("phone")}
            </p>
          ) : null}
        </div>

        <div>
          <div className="relative">
            <input
              name="password"
              value={form.password}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              onFocus={() => setActiveField("password")}
              onBlur={() => handleBlur("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`${getInputClassName(fieldErrors.password, touched.password)} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-4 text-neutral-500"
            >
              {showPassword ? <LockOpen size={18} /> : <Lock size={18} />}
            </button>
          </div>
          {getActiveMessage("password") ? (
            <p className="mt-1 text-xs font-medium text-red-500">
              {getActiveMessage("password")}
            </p>
          ) : null}
        </div>

        <div>
          <div className="relative">
            <input
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={(e) =>
                handleFieldChange("confirmPassword", e.target.value)
              }
              onFocus={() => setActiveField("confirmPassword")}
              onBlur={() => handleBlur("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className={`${getInputClassName(fieldErrors.confirmPassword, touched.confirmPassword)} pr-12`}
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
          {getActiveMessage("confirmPassword") ? (
            <p className="mt-1 text-xs font-medium text-red-500">
              {getActiveMessage("confirmPassword")}
            </p>
          ) : null}
        </div>

        <label className="flex items-center gap-2 text-xs text-neutral-500">
          <input
            name="rememberMe"
            checked={form.rememberMe}
            onChange={(e) => handleFieldChange("rememberMe", e.target.checked)}
            type="checkbox"
            className="accent-indigo-500"
          />
          Remember me
        </label>

        {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}

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
