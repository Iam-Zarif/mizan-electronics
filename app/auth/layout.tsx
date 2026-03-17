"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useProvider } from "@/Providers/AuthProviders";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthLoading } = useProvider();

  useEffect(() => {
    if (!isAuthLoading && user) {
      router.replace("/");
    }
  }, [isAuthLoading, router, user]);

  if (isAuthLoading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-neutral-50 dark:bg-black" />
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-neutral-50 dark:bg-black">
      <motion.div
        className="absolute -z-10 left-[-30%] top-[-30%] h-130 w-130 rounded-full bg-indigo-500/25 blur-[180px]"
        animate={{ x: [0, 120, 0], y: [0, 80, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute -z-10 right-[-30%] bottom-[-30%] h-130 w-130 rounded-full bg-[#e18b94]/25 blur-[180px]"
        animate={{ x: [0, -120, 0], y: [0, -80, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      {children}
    </div>
  );
}
