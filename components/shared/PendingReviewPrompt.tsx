"use client";

import { useEffect, useMemo, useState } from "react";
import { Star, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useProvider } from "@/Providers/AuthProviders";
import { useLanguage } from "@/lib/i18n";
import {
  dismissPendingProfileReview,
  getPendingProfileReview,
  submitProfileReview,
  type PendingProfileReview,
} from "@/lib/dashboard-api";

const hiddenPrefixes = ["/dashboard", "/auth"];

export function PendingReviewPrompt() {
  const { user } = useProvider();
  const { locale } = useLanguage();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [reviewTarget, setReviewTarget] = useState<PendingProfileReview | null>(null);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const reviewQueryId = searchParams.get("review")?.trim() || "";
  const shouldHide = !user || hiddenPrefixes.some((prefix) => pathname.startsWith(prefix));

  const labels = useMemo(
    () =>
      locale === "en"
        ? {
            title: "How was your service?",
            subtitle: "Please rate your completed service. A short message is optional, but recommended.",
            stars: "Star rating",
            message: "Message (optional)",
            messagePlaceholder: "Tell us what went well or what should improve.",
            skip: "Close for now",
            submit: "Submit review",
            submitting: "Submitting...",
            required: "Please select a star rating.",
            success: "Review submitted successfully.",
          }
        : {
            title: "সার্ভিসটি কেমন হয়েছে?",
            subtitle: "সম্পন্ন সার্ভিসটির রেটিং দিন। একটি ছোট মেসেজ অপশনাল, তবে দিলে ভালো হয়।",
            stars: "স্টার রেটিং",
            message: "মেসেজ (অপশনাল)",
            messagePlaceholder: "কি ভালো হয়েছে বা কোথায় উন্নতি দরকার লিখুন।",
            skip: "এখন বন্ধ করুন",
            submit: "রিভিউ সাবমিট করুন",
            submitting: "সাবমিট হচ্ছে...",
            required: "স্টার রেটিং দেওয়া বাধ্যতামূলক।",
            success: "রিভিউ সফলভাবে সাবমিট হয়েছে।",
          },
    [locale],
  );

  useEffect(() => {
    if (shouldHide) {
      setReviewTarget(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    void getPendingProfileReview(reviewQueryId || undefined)
      .then((data) => {
        if (!cancelled) {
          setReviewTarget(data.row);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReviewTarget(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [shouldHide, reviewQueryId]);

  const clearReviewQuery = () => {
    if (!reviewQueryId) return;
    const next = new URLSearchParams(searchParams.toString());
    next.delete("review");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleDismiss = async () => {
    if (!reviewTarget) return;
    try {
      await dismissPendingProfileReview(reviewTarget.completedServiceId);
    } finally {
      setReviewTarget(null);
      clearReviewQuery();
    }
  };

  const handleSubmit = async () => {
    if (!reviewTarget) return;
    if (rating < 1) {
      setFeedback(labels.required);
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    try {
      await submitProfileReview({
        completedServiceId: reviewTarget.completedServiceId,
        rating,
        message,
      });
      setFeedback(labels.success);
      window.setTimeout(() => {
        setReviewTarget(null);
        setRating(0);
        setMessage("");
        setFeedback(null);
        clearReviewQuery();
      }, 900);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : labels.required);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (shouldHide || isLoading || !reviewTarget) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-[#0f172a]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
              {reviewTarget.invoiceNo}
            </p>
            <h3 className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
              {labels.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-300">
              {labels.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleDismiss()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/10"
            aria-label={labels.skip}
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-neutral-50 px-4 py-4 dark:bg-white/5">
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
            {locale === "en" ? reviewTarget.serviceTitleEn : reviewTarget.serviceTitleBn}
          </p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {new Date(reviewTarget.completedAt).toLocaleDateString(locale === "en" ? "en-GB" : "bn-BD", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">{labels.stars}</p>
          <div className="mt-3 flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => {
              const value = index + 1;
              const active = value <= rating;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 transition hover:scale-[1.03] dark:border-white/10"
                >
                  <Star
                    size={22}
                    className={active ? "fill-amber-400 text-amber-400" : "text-neutral-300 dark:text-neutral-500"}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">{labels.message}</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            placeholder={labels.messagePlaceholder}
            className="mt-3 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 dark:border-white/10 dark:bg-[#111827] dark:text-white"
          />
        </label>

        {feedback ? (
          <p className="mt-4 text-sm font-semibold text-rose-600 dark:text-rose-300">{feedback}</p>
        ) : null}

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => void handleDismiss()}
            className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-white/10 dark:text-neutral-100 dark:hover:bg-white/10"
          >
            {labels.skip}
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? labels.submitting : labels.submit}
          </button>
        </div>
      </div>
    </div>
  );
}
