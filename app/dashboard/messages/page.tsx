"use client";

import {
  AdminPageHeader,
  AdminSurface,
  PlaceholderSection,
} from "@/components/admin/AdminSections";

export default function DashboardMessagesPage() {
  return (
    <AdminSurface>
      <AdminPageHeader titleBn="মেসেজেস" titleEn="Messages" />
      <PlaceholderSection
        titleBn="মেসেজেস"
        titleEn="Messages"
        descriptionBn="এখানে হোয়াটসঅ্যাপ, মেসেঞ্জার ও বুকিং রেসপন্সের জন্য কনভারসেশন শর্টকাট এবং সাপোর্ট মেসেজ কিউ দেখানো হবে।"
        descriptionEn="This page will show conversation shortcuts and support message queues for WhatsApp, Messenger, and booking responses."
      />
    </AdminSurface>
  );
}
