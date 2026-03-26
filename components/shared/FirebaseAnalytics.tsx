"use client";

import { useEffect } from "react";
import { getFirebaseAnalytics } from "@/lib/firebase";

export default function FirebaseAnalytics() {
  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = () => {
      if (cancelled) return;
      void getFirebaseAnalytics();
    };

    const idleCallbackId =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? window.requestIdleCallback(() => {
            window.setTimeout(loadAnalytics, 8000);
          })
        : null;

    const timeoutId =
      idleCallbackId === null ? window.setTimeout(loadAnalytics, 8000) : null;

    return () => {
      cancelled = true;
      if (idleCallbackId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return null;
}
