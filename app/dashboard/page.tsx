"use client";

import {
  AdminPageHeader,
  AdminSurface,
  AlertWidgets,
  RevenuePanels,
  TopMetricCards,
} from "@/components/admin/AdminSections";
import { ApiErrorState, ApiSkeletonBlock } from "@/components/shared/ApiState";
import { getAdminOverview } from "@/lib/dashboard-api";
import { useApiQuery } from "@/hooks/use-api-query";
import { useLanguage } from "@/lib/i18n";

export default function DashboardPage() {
  const { locale } = useLanguage();
  const { data, isLoading, error, refresh } = useApiQuery(getAdminOverview, []);

  return (
    <AdminSurface>
      <AdminPageHeader titleBn="ড্যাশবোর্ড" titleEn="Dashboard" />
      <div className="space-y-5">
        {isLoading ? <ApiSkeletonBlock rows={4} /> : null}
        {!isLoading && error ? (
          <ApiErrorState
            title={locale === "en" ? "Dashboard data failed to load" : "ড্যাশবোর্ড ডেটা লোড হয়নি"}
            description={error}
            onRetry={() => void refresh()}
          />
        ) : null}
        {!isLoading && !error && data ? (
          <>
            <AlertWidgets overview={data} />
            <TopMetricCards overview={data} />
            <RevenuePanels overview={data} />
          </>
        ) : null}
      </div>
    </AdminSurface>
  );
}
