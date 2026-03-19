"use client";

import { useState } from "react";
import { ArrowUpDown, ListFilter, MapPin, PhoneCall, Search } from "lucide-react";
import { AdminPageHeader, AdminSurface } from "@/components/admin/AdminSections";
import { ApiErrorState, ApiEmptyState, ApiSkeletonBlock } from "@/components/shared/ApiState";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { getAdminContactClicks } from "@/lib/dashboard-api";
import { getValueOrEmpty } from "@/lib/display";
import { useLanguage } from "@/lib/i18n";
import { useApiQuery } from "@/hooks/use-api-query";

type ContactChannelFilter = "all" | "phone" | "whatsapp" | "messenger";
type SortOrder = "latest" | "oldest";

export default function DashboardContactClicksPage() {
  const { locale } = useLanguage();
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState<ContactChannelFilter>("all");
  const [sort, setSort] = useState<SortOrder>("latest");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refresh } = useApiQuery(
    () =>
      getAdminContactClicks({
        search: query,
        channel,
        sort,
        page,
        limit: 12,
      }),
    [query, channel, sort, page],
  );

  return (
    <AdminSurface>
      <AdminPageHeader titleBn="কল হিস্টোরি" titleEn="Call History" />

      {isLoading ? <ApiSkeletonBlock rows={4} /> : null}
      {!isLoading && error ? (
        <ApiErrorState
          title={locale === "en" ? "Call history failed to load" : "কল হিস্টোরি লোড হয়নি"}
          description={error}
          onRetry={() => void refresh()}
        />
      ) : null}

      {!isLoading && !error && data ? (
        <div className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex w-full items-center gap-2 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 text-sm text-[#6f7c98] dark:border-white/10 dark:bg-[#11192c] dark:text-[#a7b3c9] xl:max-w-[360px]">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={
                  locale === "en"
                    ? "Search by user, phone or location"
                    : "ইউজার, ফোন বা লোকেশন দিয়ে সার্চ করুন"
                }
                className="w-full bg-transparent outline-none placeholder:text-[#8a96ad] dark:placeholder:text-[#70809c]"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-[420px] xl:flex-none">
              <label className="flex items-center gap-2 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 text-sm text-[#6f7c98] dark:border-white/10 dark:bg-[#11192c] dark:text-[#a7b3c9]">
                <ListFilter size={16} />
                <select
                  value={channel}
                  onChange={(e) => {
                    setChannel(e.target.value as ContactChannelFilter);
                    setPage(1);
                  }}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="all">{locale === "en" ? "All channels" : "সব চ্যানেল"}</option>
                  <option value="phone">{locale === "en" ? "Phone" : "ফোন"}</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="messenger">Messenger</option>
                </select>
              </label>

              <label className="flex items-center gap-2 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 text-sm text-[#6f7c98] dark:border-white/10 dark:bg-[#11192c] dark:text-[#a7b3c9]">
                <ArrowUpDown size={16} />
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as SortOrder);
                    setPage(1);
                  }}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="latest">{locale === "en" ? "Newest to oldest" : "নতুন থেকে পুরোনো"}</option>
                  <option value="oldest">{locale === "en" ? "Oldest to newest" : "পুরোনো থেকে নতুন"}</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-3 text-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f3f6fd] px-4 py-2 font-medium text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]">
              <PhoneCall size={14} />
              {locale === "en" ? "Logged clicks" : "লগড ক্লিক"}: {data.pagination.totalItems}
            </div>
          </div>

          {data.rows.length === 0 ? (
            <ApiEmptyState
              title={locale === "en" ? "No call history found" : "কোনো কল হিস্টোরি পাওয়া যায়নি"}
              description={
                locale === "en"
                  ? "Floating contact icon clicks will appear here."
                  : "ফ্লোটিং কন্টাক্ট আইকনের ক্লিকগুলো এখানে দেখা যাবে।"
              }
            />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#edf1f7] dark:border-white/10">
              <table className="min-w-full divide-y divide-[#edf1f7] text-sm dark:divide-white/10">
                <thead className="bg-[#f8fbff] dark:bg-[#11192c]">
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad] dark:text-[#70809c]">
                    <th className="px-4 py-3">{locale === "en" ? "User" : "ইউজার"}</th>
                    <th className="px-4 py-3">{locale === "en" ? "Phone" : "ফোন"}</th>
                    <th className="px-4 py-3">{locale === "en" ? "Location" : "লোকেশন"}</th>
                    <th className="px-4 py-3">{locale === "en" ? "Channel" : "চ্যানেল"}</th>
                    <th className="px-4 py-3">{locale === "en" ? "Source page" : "সোর্স পেজ"}</th>
                    <th className="px-4 py-3">{locale === "en" ? "Time" : "সময়"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf1f7] bg-white dark:divide-white/10 dark:bg-[#161f36]">
                  {data.rows.map((row) => {
                    const locationText = [row.actorArea, row.actorDistrict, row.actorDivision]
                      .filter(Boolean)
                      .join(", ");
                    const coordinateText =
                      typeof row.latitude === "number" && typeof row.longitude === "number"
                        ? `${row.latitude.toFixed(5)}, ${row.longitude.toFixed(5)}`
                        : "";

                    return (
                      <tr key={row._id} className="align-top">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-[#1f2638] dark:text-white">
                            {getValueOrEmpty(
                              row.actorName,
                              locale,
                              "Name",
                              "নাম",
                            )}
                          </p>
                          <p className="mt-1 text-xs text-[#60708d] dark:text-[#a7b3c9]">
                            {getValueOrEmpty(
                              row.actorEmail,
                              locale,
                              "Email",
                              "ইমেইল",
                            )}
                          </p>
                        </td>
                        <td className="px-4 py-4 font-medium text-[#1f2638] dark:text-white">
                          {getValueOrEmpty(
                            row.actorPhone,
                            locale,
                            "Phone",
                            "ফোন",
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-start gap-2 text-[#60708d] dark:text-[#a7b3c9]">
                            <MapPin size={14} className="mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm">
                                {getValueOrEmpty(
                                  locationText,
                                  locale,
                                  "Location",
                                  "লোকেশন",
                                )}
                              </p>
                              <p className="mt-1 text-xs">
                                {getValueOrEmpty(
                                  row.actorAddress,
                                  locale,
                                  "Address",
                                  "ঠিকানা",
                                )}
                              </p>
                              {coordinateText ? (
                                <p className="mt-1 text-[11px] text-[#8a96ad] dark:text-[#70809c]">
                                  GPS: {coordinateText}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold capitalize text-[#2160ba] dark:bg-white/8 dark:text-[#aab5ff]">
                            {row.channel}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[#60708d] dark:text-[#a7b3c9]">
                          {getValueOrEmpty(
                            row.pagePath,
                            locale,
                            "Page",
                            "পেজ",
                          )}
                        </td>
                        <td className="px-4 py-4 text-[#60708d] dark:text-[#a7b3c9]">
                          {new Date(row.clickedAt).toLocaleString(
                            locale === "en" ? "en-GB" : "bn-BD",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <PaginationControls
            pagination={data.pagination}
            onPageChange={setPage}
            className="mt-5 rounded-[24px] border border-[#e8edf7] bg-white px-5 py-4 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]"
          />
        </div>
      ) : null}
    </AdminSurface>
  );
}
