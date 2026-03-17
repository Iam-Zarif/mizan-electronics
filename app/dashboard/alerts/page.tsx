"use client";

import {
  AdminPageHeader,
  AdminSurface,
  AlertWidgets,
} from "@/components/admin/AdminSections";

export default function DashboardAlertsPage() {
  return (
    <AdminSurface>
      <AdminPageHeader titleBn="অ্যালার্ট" titleEn="Alerts" />
      <AlertWidgets />
    </AdminSurface>
  );
}
