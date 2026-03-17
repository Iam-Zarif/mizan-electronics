"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { ProfileDetails } from "@/components/profile/ProfileDetails";
import { ProfileAddressBook } from "@/components/profile/ProfileAddressBook";
import { useProvider } from "@/Providers/AuthProviders";
import { useLanguage } from "@/lib/i18n";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthLoading } = useProvider();
  const { t } = useLanguage();
  const hasShownBookingRequirement = useRef(false);
  const [showPhoneRequiredModal, setShowPhoneRequiredModal] = useState(false);
  const [showVerificationRequiredModal, setShowVerificationRequiredModal] =
    useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/auth/login?redirect=/profile");
    }
  }, [isAuthLoading, router, user]);

  useEffect(() => {
    const required = searchParams.get("required");
    if (
      isAuthLoading ||
      !user ||
      (required !== "phone" && required !== "verification") ||
      hasShownBookingRequirement.current
    ) {
      return;
    }

    hasShownBookingRequirement.current = true;
    if (required === "phone") {
      setShowPhoneRequiredModal(true);
    } else {
      setShowVerificationRequiredModal(true);
    }
    router.replace("/profile");
  }, [isAuthLoading, router, searchParams, t, user]);

  return (
    <>
      <section className="pt-24 pb-20 lg:pt-25 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-4 text-[1.7rem] font-extrabold tracking-wide text-transparent bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text lg:mb-6 lg:text-3xl">
            {t("profile.title")}
          </h1>

          <div className="mt-4">
            <ProfileDetails />
            <ProfileAddressBook />
          </div>
        </div>
      </section>

      {showPhoneRequiredModal ? (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-neutral-900">
            <button
              type="button"
              onClick={() => setShowPhoneRequiredModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="space-y-3">
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {t("profile.phone")}
              </p>
              <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                {t("profile.phoneRequiredForBooking")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPhoneRequiredModal(false)}
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-4 py-3 text-sm font-semibold text-white shadow"
            >
              {t("profile.editProfile")}
            </button>
          </div>
        </div>
      ) : null}

      {showVerificationRequiredModal ? (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-neutral-900">
            <button
              type="button"
              onClick={() => setShowVerificationRequiredModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="space-y-3">
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {t("profile.verifyNow")}
              </p>
              <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                {t("profile.verificationRequiredForBooking")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowVerificationRequiredModal(false)}
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-4 py-3 text-sm font-semibold text-white shadow"
            >
              {t("profile.verifyNow")}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
