"use client";

import {
  AdminPageHeader,
  AdminSurface,
  PlaceholderSection,
} from "@/components/admin/AdminSections";

export default function DashboardSettingsPage() {
  return (
    <AdminSurface>
      <AdminPageHeader titleBn="সেটিংস" titleEn="Settings" />
      <PlaceholderSection
        titleBn="সেটিংস"
        titleEn="Settings"
        descriptionBn="এখানে অ্যাডমিন প্রেফারেন্স, সার্ভিস কনফিগ, নোটিফিকেশন রুলস এবং ব্র্যান্ড সেটিংস কনফিগার করা হবে।"
        descriptionEn="This page will configure admin preferences, service settings, notification rules, and brand settings."
      />
    </AdminSurface>
  );
}
