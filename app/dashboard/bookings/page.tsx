"use client";

import {
  AdminPageHeader,
  AdminSurface,
  BookingsSection,
} from "@/components/admin/AdminSections";

export default function DashboardBookingsPage() {
  return (
    <AdminSurface>
      <AdminPageHeader titleBn="রিকুয়েস্টেড বুকিং" titleEn="Requested Bookings" />
      <BookingsSection />
    </AdminSurface>
  );
}
