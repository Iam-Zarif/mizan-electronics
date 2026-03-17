"use client";

import {
  AdminPageHeader,
  AdminSurface,
  PlaceholderSection,
} from "@/components/admin/AdminSections";

export default function DashboardTablesPage() {
  return (
    <AdminSurface>
      <AdminPageHeader titleBn="টেবিলস" titleEn="Tables" />
      <PlaceholderSection
        titleBn="টেবিলস"
        titleEn="Tables"
        descriptionBn="এখানে সব সার্ভিস, ইনভয়েস, ইউজার এবং কাস্টম রিপোর্ট টেবিল আকারে ম্যানেজ করা হবে।"
        descriptionEn="This page will manage all services, invoices, users, and custom reports in table form."
      />
    </AdminSurface>
  );
}
