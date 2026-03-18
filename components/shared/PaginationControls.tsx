"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/lib/dashboard-api";
import { useLanguage } from "@/lib/i18n";

type PaginationControlsProps = {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
};

const buildVisiblePages = (page: number, totalPages: number) => {
  const candidates = [1, page - 1, page, page + 1, totalPages]
    .filter((value) => value >= 1 && value <= totalPages);

  return [...new Set(candidates)].sort((a, b) => a - b);
};

export function PaginationControls({
  pagination,
  onPageChange,
  className = "",
}: PaginationControlsProps) {
  const { locale } = useLanguage();

  if (pagination.totalPages <= 1) return null;

  const visiblePages = buildVisiblePages(pagination.page, pagination.totalPages);
  const from = pagination.totalItems === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const to = Math.min(pagination.page * pagination.pageSize, pagination.totalItems);

  return (
    <div
      className={`flex flex-col gap-3 border-t border-[#e8edf7] pt-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between ${className}`.trim()}
    >
      <p className="text-sm text-[#7f8ba3] dark:text-[#9aa7c1]">
        {locale === "en"
          ? `Showing ${from}-${to} of ${pagination.totalItems}`
          : `${from}-${to} / ${pagination.totalItems} দেখানো হচ্ছে`}
      </p>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={!pagination.hasPreviousPage}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#dbe4f4] bg-white text-[#33415c] transition disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-[#11192c] dark:text-white"
        >
          <ChevronLeft size={16} />
        </button>

        {visiblePages.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onPageChange(value)}
            className={`inline-flex h-10 min-w-10 items-center justify-center rounded-2xl px-3 text-sm font-semibold transition ${
              value === pagination.page
                ? "bg-[#2160ba] text-white"
                : "border border-[#dbe4f4] bg-white text-[#33415c] dark:border-white/10 dark:bg-[#11192c] dark:text-white"
            }`}
          >
            {value}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!pagination.hasNextPage}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#dbe4f4] bg-white text-[#33415c] transition disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-[#11192c] dark:text-white"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
