"use client";

export type AdminRealtimeStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "unsupported";

export type AdminRealtimeNotificationEvent = {
  type:
    | "booking.created"
    | "invoice.linked"
    | "user.verification.warning"
    | "security.alert"
    | "message.pending";
  payload: Record<string, unknown>;
  createdAt: string;
};

type AdminRealtimeOptions = {
  url?: string;
  onStatusChange?: (status: AdminRealtimeStatus) => void;
  onNotification?: (event: AdminRealtimeNotificationEvent) => void;
  onError?: (error: Event) => void;
};

export function createAdminRealtimeClient(options: AdminRealtimeOptions = {}) {
  const url = options.url ?? process.env.NEXT_PUBLIC_ADMIN_WS_URL;
  let socket: WebSocket | null = null;

  const setStatus = (status: AdminRealtimeStatus) => {
    options.onStatusChange?.(status);
  };

  const connect = () => {
    if (typeof window === "undefined") return;

    if (!("WebSocket" in window)) {
      setStatus("unsupported");
      return;
    }

    if (!url) {
      setStatus("idle");
      return;
    }

    if (socket && socket.readyState <= WebSocket.OPEN) {
      return;
    }

    setStatus("connecting");
    socket = new WebSocket(url);

    socket.addEventListener("open", () => {
      setStatus("connected");
    });

    socket.addEventListener("message", (event) => {
      try {
        const parsed = JSON.parse(event.data) as AdminRealtimeNotificationEvent;
        options.onNotification?.(parsed);
      } catch {
        // Ignore non-JSON events so future backend changes do not break the UI shell.
      }
    });

    socket.addEventListener("close", () => {
      setStatus("disconnected");
    });

    socket.addEventListener("error", (error) => {
      setStatus("disconnected");
      options.onError?.(error);
    });
  };

  const disconnect = () => {
    socket?.close();
    socket = null;
    setStatus("idle");
  };

  return {
    connect,
    disconnect,
    isConfigured: Boolean(url),
  };
}
