"use client";

import { GoArrowUpRight } from "react-icons/go";
import { useRouter } from "next/navigation";
import { useProvider } from "@/Providers/AuthProviders";
import { createProfilePackageBooking } from "@/lib/dashboard-api";

type Props = {
  packageId: string;
  packageTitle: string;
  categoryName: string;
};

const whatsappBase = "https://wa.me/8801949397234?text=";
const siteBaseUrl = "https://mizan-ac-servicing.vercel.app";

export default function PackageBookingActions({
  packageId,
  packageTitle,
  categoryName,
}: Props) {
  const router = useRouter();
  const { user, isAuthLoading } = useProvider();

  const handleBooking = async () => {
    if (isAuthLoading) return;

    const redirectPath = "/#combo-packages";

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

    await createProfilePackageBooking({
      packageId,
      channel: "whatsapp",
    });

    const message = `${siteBaseUrl}\nপ্যাকেজ: ${packageTitle}\nক্যাটাগরি: ${categoryName}\nইউজারের নাম: ${
      user.f_name
    }\nফোন: ${user.phone}`;

    window.open(
      `${whatsappBase}${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <button
      type="button"
      onClick={() => void handleBooking()}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-4 py-2 text-xs font-semibold text-white shadow"
    >
      বুক করুন
      <GoArrowUpRight className="text-base" />
    </button>
  );
}
