"use client";

import { CheckCircle2 } from "lucide-react";

type SuccessToastProps = {
  message: string | null;
};

export function SuccessToast({ message }: SuccessToastProps) {
  if (!message) return null;

  return (
    <div className="fixed right-5 top-24 z-[140] max-w-sm">
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-[0_18px_35px_-24px_rgba(16,185,129,0.55)] dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/80 text-emerald-600 dark:bg-white/10 dark:text-emerald-300">
          <CheckCircle2 size={15} />
        </span>
        <p>{message}</p>
      </div>
    </div>
  );
}
