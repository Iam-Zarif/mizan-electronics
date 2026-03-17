"use client";

import {
  AdminPageHeader,
  AdminSurface,
  PlaceholderSection,
} from "@/components/admin/AdminSections";

export default function DashboardInvoicesPage() {
  return (
    <AdminSurface>
      <AdminPageHeader titleBn="ইনভয়েস" titleEn="Invoices" />
      <PlaceholderSection
        titleBn="ইনভয়েস"
        titleEn="Invoices"
        descriptionBn="এখানে জেনারেটেড ইনভয়েস, পেমেন্ট স্ট্যাটাস, ডাউনলোড এবং ইউজার প্রোফাইলে ইনভয়েস লিঙ্কিং ম্যানেজ করা হবে।"
        descriptionEn="This page will manage generated invoices, payment status, downloads, and invoice linking to user profiles."
      />
    </AdminSurface>
  );
}
