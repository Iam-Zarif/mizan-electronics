"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GoArrowUpRight } from "react-icons/go";
import { useProvider } from "@/Providers/AuthProviders";
import { createProfileBooking } from "@/lib/dashboard-api";

type Props = {
  categoryId: string;
  categoryName: string;
  serviceTitle: string;
  serviceSlug?: string;
  stacked?: boolean;
};

const whatsappBase = "https://wa.me/8801949397234?text=";
const siteBaseUrl = "https://mizan-ac-servicing.vercel.app";

export default function ServiceBookingActions({
  categoryId,
  categoryName,
  serviceTitle,
  serviceSlug,
  stacked = true,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthLoading } = useProvider();
  const wrapperClass = stacked ? "flex flex-col gap-2" : "flex flex-wrap gap-2";
  const buttonWidthClass = stacked ? "w-full" : "flex-1";

  const categoryLink = `${siteBaseUrl}/services/category/${categoryId}`;
  const userName = user?.f_name?.trim() || "N/A";
  const userPhone = user?.phone?.trim() || "N/A";
  const message = `${categoryLink}\nক্যাটাগরি: ${categoryName}\nসার্ভিস: ${serviceTitle}\nইউজারের নাম: ${userName}\nফোন: ${userPhone}`;

  const getBookingRedirect = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("book", "whatsapp");
    params.set("bookCategory", categoryId);
    params.set("bookService", serviceTitle);
    if (serviceSlug) {
      params.set("bookSlug", serviceSlug);
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [categoryId, pathname, searchParams, serviceSlug, serviceTitle]);

  const openWhatsapp = useCallback(() => {
    window.open(
      `${whatsappBase}${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }, [message]);

  const submitAndOpen = useCallback(async () => {
    if (serviceSlug) {
      try {
        await createProfileBooking({
          serviceSlug,
          channel: "whatsapp",
        });
      } catch {
        // Preserve the user flow even if the admin-side write fails temporarily.
      }
    }

    openWhatsapp();
  }, [openWhatsapp, serviceSlug]);

  const guardAndOpen = () => {
    if (isAuthLoading) return;
    const redirectPath = getBookingRedirect();

    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }
    if (!user.phone?.trim()) {
      router.push(
        `/profile?required=phone&redirect=${encodeURIComponent(redirectPath)}`,
      );
      return;
    }
    if (!user.isVerified) {
      router.push(
        `/profile?required=verification&redirect=${encodeURIComponent(
          redirectPath,
        )}`,
      );
      return;
    }

    void submitAndOpen();
  };

  useEffect(() => {
    if (isAuthLoading || !user?.phone?.trim() || !user.isVerified) {
      return;
    }

    const channel = searchParams.get("book");
    const targetCategory = searchParams.get("bookCategory");
    const targetService = searchParams.get("bookService");
    const targetSlug = searchParams.get("bookSlug");

    if (
      channel !== "whatsapp" ||
      targetCategory !== categoryId ||
      targetService !== serviceTitle ||
      (serviceSlug && targetSlug !== serviceSlug)
    ) {
      return;
    }

    const onceKey = `booking:${pathname}:${categoryId}:${serviceTitle}:${serviceSlug ?? "no-slug"}`;
    if (window.sessionStorage.getItem(onceKey) === "done") {
      return;
    }

    window.sessionStorage.setItem(onceKey, "done");
    void submitAndOpen();

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("book");
    nextParams.delete("bookCategory");
    nextParams.delete("bookService");
    nextParams.delete("bookSlug");
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }, [
    categoryId,
    isAuthLoading,
    pathname,
    router,
    searchParams,
    serviceSlug,
    serviceTitle,
    submitAndOpen,
    user,
  ]);

  return (
    <div className={wrapperClass}>
      <button
        type="button"
        onClick={guardAndOpen}
        className={`inline-flex ${buttonWidthClass} items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-4 py-2 text-xs font-semibold text-white shadow cursor-pointer`}
      >
        বুক করুন
        <GoArrowUpRight className="text-base" />
      </button>
    </div>
  );
}
