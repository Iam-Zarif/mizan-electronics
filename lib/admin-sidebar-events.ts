"use client";

export const ADMIN_SIDEBAR_REFRESH_EVENT = "admin-sidebar-refresh";

export const dispatchAdminSidebarRefresh = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ADMIN_SIDEBAR_REFRESH_EVENT));
};

