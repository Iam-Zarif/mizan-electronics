"use client";

import {
  AdminPageHeader,
  AdminSurface,
  PlaceholderSection,
} from "@/components/admin/AdminSections";

export default function DashboardCalendarPage() {
  return (
    <AdminSurface>
      <AdminPageHeader titleBn="ক্যালেন্ডার" titleEn="Calendar" />
      <PlaceholderSection
        titleBn="ক্যালেন্ডার"
        titleEn="Calendar"
        descriptionBn="এখানে সার্ভিস স্লট, টেকনিশিয়ান শিডিউল এবং বুকিং-টু-ভিজিট ক্যালেন্ডার ভিউ দেখানো হবে।"
        descriptionEn="This page will show service slots, technician schedules, and booking-to-visit calendar views."
      />
    </AdminSurface>
  );
}
