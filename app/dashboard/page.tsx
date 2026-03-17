"use client";

import {
  AdminPageHeader,
  AdminSurface,
  AlertWidgets,
  RevenuePanels,
  TopMetricCards,
} from "@/components/admin/AdminSections";

export default function DashboardPage() {
  return (
    <AdminSurface>
      <AdminPageHeader titleBn="ড্যাশবোর্ড" titleEn="Dashboard" />
      <div className="space-y-5">
        <AlertWidgets />
        <TopMetricCards />
        <RevenuePanels />
      </div>
    </AdminSurface>
  );
}
