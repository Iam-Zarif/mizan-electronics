import { Bell, FileCheck, ShieldAlert, Wrench } from "lucide-react";

export const notificationIconMap = {
  service: Wrench,
  billing: FileCheck,
  verification: ShieldAlert,
  invoice: FileCheck,
  security: ShieldAlert,
  booking: Wrench,
  message: Bell,
  system: Bell,
} as const;

export const getNotificationIcon = (type: string) =>
  notificationIconMap[type as keyof typeof notificationIconMap] ?? Bell;
