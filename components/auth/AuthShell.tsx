"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import logo from "@/public/mizan.png";

type AuthShellProps = {
  title: string;
  children: ReactNode;
};

export function AuthShell({ title, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center lg:px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl border border-black/5 p-4 backdrop-blur-xl lg:w-[32rem] lg:max-w-[32rem] lg:bg-white/70 lg:p-8 lg:shadow-[0_30px_80px_-35px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-black/60"
      >
        <Image
          src={logo}
          alt="Mizan AC Servicing"
          width={48}
          height={48}
          className="mx-auto"
        />

        <h1 className="mt-3 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-center text-3xl font-extrabold text-transparent">
          {title}
        </h1>

        {children}
      </motion.div>
    </div>
  );
}
