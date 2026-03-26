"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import BrandLogo from "@/components/shared/BrandLogo";

type AuthShellProps = {
  title: string;
  imageSide: "left" | "right";
  subtitle?: string;
  children: ReactNode;
};

const authImageSrc = "/auth/mizan electronics auth.png";

export function AuthShell({
  title,
  imageSide,
  subtitle,
  children,
}: AuthShellProps) {
  const desktopBorderClass =
    imageSide === "left" ? "lg:border-l lg:border-r-0" : "lg:border-r lg:border-l-0";

  const imagePanel = (
    <div className="relative hidden overflow-hidden rounded-[2rem] bg-linear-to-br from-[#1f3d9d] via-[#592db0] to-[#dd835f] lg:block lg:min-h-screen lg:rounded-none">
      <Image
        src={authImageSrc}
        alt="Mizan AC Servicing auth visual"
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 0vw"
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#07132f]/40 via-transparent to-transparent" />
    </div>
  );

  const formPanel = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full rounded-[2rem] border border-black/5 bg-white/80 p-5 shadow-[0_30px_80px_-35px_rgba(0,0,0,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-black/60 lg:flex lg:min-h-screen lg:items-center lg:rounded-none lg:border-y-0 lg:p-8 ${desktopBorderClass}`}
    >
      <div className="mx-auto w-full max-w-[25rem]">
        <div className="flex justify-center">
          <BrandLogo size={48} />
        </div>

        <h1 className="mt-3 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-center text-3xl font-extrabold text-transparent">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 text-center text-sm text-neutral-500 dark:text-neutral-300">
            {subtitle}
          </p>
        ) : null}

        {children}
      </div>
    </motion.div>
  );

  return (
    <div className="relative w-full px-4 py-8 lg:h-screen lg:max-w-none lg:px-0 lg:py-0">
      <div className="grid items-stretch gap-6 lg:min-h-screen lg:grid-cols-2 lg:gap-0">
        {imageSide === "left" ? imagePanel : formPanel}
        {imageSide === "left" ? formPanel : imagePanel}
      </div>
    </div>
  );
}
