"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GoArrowUpRight } from "react-icons/go";
import { useProvider } from "@/Providers/AuthProviders";

type Props = {
  categoryId: string;
  categoryName: string;
  serviceTitle: string;
  stacked?: boolean;
};

const whatsappBase = "https://wa.me/8801949397234?text=";
const messengerBase = "https://m.me/mizanACservicing?ref=booking&message=";
const siteBaseUrl = "https://mizan-ac-servicing.vercel.app";

export default function ServiceBookingActions({
  categoryId,
  categoryName,
  serviceTitle,
  stacked = true,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthLoading } = useProvider();

  const categoryLink = `${siteBaseUrl}/services/category/${categoryId}`;
  const userName = user?.f_name?.trim() || "N/A";
  const userPhone = user?.phone?.trim() || "N/A";
  const message = `${categoryLink}\nক্যাটাগরি: ${categoryName}\nসার্ভিস: ${serviceTitle}\nইউজারের নাম: ${userName}\nফোন: ${userPhone}`;
  const wrapperClass = stacked ? "flex flex-col gap-2" : "flex flex-wrap gap-2";
  const buttonWidthClass = stacked ? "w-full" : "flex-1";

  const getBookingRedirect = (channel: "messenger" | "whatsapp") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("book", channel);
    params.set("bookCategory", categoryId);
    params.set("bookService", serviceTitle);
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const openBooking = (baseUrl: string) => {
    window.open(
      `${baseUrl}${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const guardAndOpen = (
    channel: "messenger" | "whatsapp",
    baseUrl: string,
  ) => {
    if (isAuthLoading) return;
    const redirectPath = getBookingRedirect(channel);

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
        `/profile?required=verification&redirect=${encodeURIComponent(redirectPath)}`,
      );
      return;
    }

    openBooking(baseUrl);
  };

  useEffect(() => {
    if (isAuthLoading || !user?.phone?.trim() || !user.isVerified) {
      return;
    }

    const channel = searchParams.get("book");
    const targetCategory = searchParams.get("bookCategory");
    const targetService = searchParams.get("bookService");

    if (
      (channel !== "messenger" && channel !== "whatsapp") ||
      targetCategory !== categoryId ||
      targetService !== serviceTitle
    ) {
      return;
    }

    const onceKey = `booking:${pathname}:${channel}:${categoryId}:${serviceTitle}`;
    if (window.sessionStorage.getItem(onceKey) === "done") {
      return;
    }

    window.sessionStorage.setItem(onceKey, "done");
    openBooking(channel === "messenger" ? messengerBase : whatsappBase);

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("book");
    nextParams.delete("bookCategory");
    nextParams.delete("bookService");
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }, [
    categoryId,
    isAuthLoading,
    pathname,
    router,
    searchParams,
    serviceTitle,
    user,
  ]);

  return (
    <div className={wrapperClass}>
      <button
        type="button"
        onClick={() => guardAndOpen("messenger", messengerBase)}
        className={`inline-flex ${buttonWidthClass} items-center justify-center gap-2 rounded-full border border-[#6366f1]/40 px-3 py-2 text-xs font-semibold text-[#6366f1] cursor-pointer`}
      >
        মেসেঞ্জার (কুয়েরি)
        <GoArrowUpRight className="text-base" />
      </button>
      <button
        type="button"
        onClick={() => guardAndOpen("whatsapp", whatsappBase)}
        className={`inline-flex ${buttonWidthClass} items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-4 py-2 text-xs font-semibold text-white shadow cursor-pointer`}
      >
        বুক করুন
        <GoArrowUpRight className="text-base" />
      </button>
    </div>
  );
}
