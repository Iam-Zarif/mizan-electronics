"use client";

import { motion } from "motion/react";
import BrandLogo from "@/components/shared/BrandLogo";

export default function Loading() {
  return (
   <div className="fixed inset-0 z-9999 flex pt-[35vh] justify-center bg-white dark:bg-black">
      <div className="relative flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-60"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
          />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-black shadow-xl">
            <BrandLogo size={48} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          className="text-sm font-semibold tracking-widest bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          MIZAN AC SERVICING
        </motion.div>
      </div>
    </div>
  );
}
