  "use client";

  import Link from "next/link";
  import { motion } from "motion/react";
  import { FaGoogle, FaFacebookF } from "react-icons/fa";
  import Image from "next/image";
  import logo from "@/public/mizan.png";

  export default function RegisterPage() {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/60 backdrop-blur-xl p-8 shadow-[0_30px_80px_-35px_rgba(0,0,0,0.35)]"
        >
          <Image
            src={logo}
            alt="Mizan Electronics"
            width={48}
            height={48}
            className="mx-auto h-auto w-auto"
          />
          <h1 className="text-center mt-3 text-3xl font-extrabold bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Create Account
          </h1>

          <form className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Full name"
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <label className="flex items-center gap-2 text-xs text-neutral-500">
              <input type="checkbox" className="accent-indigo-500" />I agree to
              the Terms & Conditions
            </label>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95"
            >
              Register
            </motion.button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            <span className="text-xs text-neutral-500">OR</span>
            <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          </div>

          <div className="flex gap-4">
            <SocialButton
              icon={<FaGoogle />}
              label="Google"
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
              href="/auth/login"
              className="font-semibold text-indigo-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  const SocialButton = ({
    icon,
    label,
    className,
  }: {
    icon: React.ReactNode;
    label: string;
    className: string;
  }) => (
    <button
      className={`
        flex flex-1 items-center justify-center gap-2
        rounded-xl  border border-neutral-200 cursor-pointer
        py-3 text-sm font-medium
        transition-all duration-300
        hover:-translate-y-0.5
        ${className}
      `}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
