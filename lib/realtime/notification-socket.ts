"use client";

import { useEffect, useRef } from "react";
import { WS_BASE_URL } from "@/lib/api";

type NotificationEventPayload<T> =
  | { event: "notification.created" | "notification.updated"; audience: "admin" | "user"; notification: T }
  | { event: "notification.deleted"; audience: "admin" | "user"; notificationId: string };

export function useNotificationSocket<T>(input: {
  enabled: boolean;
  onCreatedOrUpdated: (notification: T) => void;
  onDeleted: (notificationId: string) => void;
}) {
  const createdOrUpdatedRef = useRef(input.onCreatedOrUpdated);
  const deletedRef = useRef(input.onDeleted);

  useEffect(() => {
    createdOrUpdatedRef.current = input.onCreatedOrUpdated;
    deletedRef.current = input.onDeleted;
  }, [input.onCreatedOrUpdated, input.onDeleted]);

  useEffect(() => {
    if (!input.enabled || typeof window === "undefined") return;

    const socket = new WebSocket(`${WS_BASE_URL}/ws/notifications`);

    socket.addEventListener("message", (event) => {
      try {
        const parsed = JSON.parse(event.data) as NotificationEventPayload<T>;
        if (parsed.event === "notification.deleted") {
          deletedRef.current(parsed.notificationId);
          return;
        }

        createdOrUpdatedRef.current(parsed.notification);
      } catch {
        // Ignore malformed websocket payloads so the UI remains stable.
      }
    });

    return () => {
      socket.close();
    };
  }, [input.enabled]);
}
