import { API_BASE_URL } from "@/lib/api";
import type { AuthUser } from "@/lib/auth";

type ContactChannel = "phone" | "whatsapp" | "messenger";

type TrackContactClickInput = {
  source: "floating";
  channel: ContactChannel;
  targetValue: string;
  user: AuthUser | null;
};

export const trackContactClick = async ({
  source,
  channel,
  targetValue,
  user,
}: TrackContactClickInput) => {
  if (typeof window === "undefined") return;

  const payload = {
    actorAddressLabel: user?.addresses?.find((address) => address.isDefault)?.label ?? user?.addresses?.[0]?.label ?? "",
    actorAddress: user?.addresses?.find((address) => address.isDefault)?.address ?? user?.addresses?.[0]?.address ?? "",
    actorArea: user?.addresses?.find((address) => address.isDefault)?.area ?? user?.addresses?.[0]?.area ?? "",
    actorDistrict: user?.addresses?.find((address) => address.isDefault)?.district ?? user?.addresses?.[0]?.district ?? "",
    actorDivision: user?.addresses?.find((address) => address.isDefault)?.division ?? user?.addresses?.[0]?.division ?? "",
    source,
    channel,
    targetValue,
    pagePath: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    referrer: document.referrer || "",
    actorName: user?.f_name ?? "",
    actorEmail: user?.email ?? "",
    actorPhone: user?.phone ?? "",
    latitude: null,
    longitude: null,
  };

  const url = `${API_BASE_URL}/services/contact-clicks`;
  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      const sent = navigator.sendBeacon(url, blob);
      if (sent) {
        return;
      }
    }

    void fetch(url, {
      method: "POST",
      credentials: "include",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
  } catch {
    // Intentionally ignore tracking failures so contact actions never break.
  }
};
