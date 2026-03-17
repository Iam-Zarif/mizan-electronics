"use client";

import { useMemo, useState } from "react";
import { ListFilter, Search, ShieldCheck, ShieldX, Users } from "lucide-react";
import { AdminPageHeader, AdminSurface } from "@/components/admin/AdminSections";
import { allUsers } from "@/lib/admin-dashboard";
import { useLanguage } from "@/lib/i18n";

type VerificationFilter = "all" | "verified" | "unverified";
type SortKey =
  | "alphabetical-asc"
  | "alphabetical-desc"
  | "newest"
  | "oldest"
  | "services-desc"
  | "services-asc";

export default function DashboardUsersPage() {
  const { locale } = useLanguage();
  const [query, setQuery] = useState("");
  const [verification, setVerification] = useState<VerificationFilter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const searched = allUsers.filter((user) => {
      const haystack = [
        user.name,
        user.nameEn,
        user.email,
        user.phone,
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = normalizedQuery
        ? haystack.includes(normalizedQuery)
        : true;

      const matchesVerification =
        verification === "all"
          ? true
          : verification === "verified"
            ? user.verified
            : !user.verified;

      return matchesQuery && matchesVerification;
    });

    return [...searched].sort((a, b) => {
      switch (sortBy) {
        case "alphabetical-asc":
          return a.nameEn.localeCompare(b.nameEn);
        case "alphabetical-desc":
          return b.nameEn.localeCompare(a.nameEn);
        case "oldest":
          return (
            new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
          );
        case "services-desc":
          return b.completedServices - a.completedServices;
        case "services-asc":
          return a.completedServices - b.completedServices;
        case "newest":
        default:
          return (
            new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
          );
      }
    });
  }, [query, sortBy, verification]);

  return (
    <AdminSurface>
      <AdminPageHeader titleBn="সকল ইউজার" titleEn="All Users" />

      <div className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div />

          <div className="flex flex-col gap-3 xl:min-w-[760px] xl:flex-row xl:items-center xl:justify-end">
            <label className="flex w-full items-center gap-2 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 text-sm text-[#6f7c98] dark:border-white/10 dark:bg-[#11192c] dark:text-[#a7b3c9] xl:max-w-[360px] xl:flex-1">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  locale === "en"
                    ? "Search by name, email or phone"
                    : "নাম, ইমেইল বা ফোন দিয়ে সার্চ করুন"
                }
                className="w-full bg-transparent outline-none placeholder:text-[#8a96ad] dark:placeholder:text-[#70809c]"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-[380px] xl:flex-none">
              <label className="flex items-center gap-2 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 text-sm text-[#6f7c98] dark:border-white/10 dark:bg-[#11192c] dark:text-[#a7b3c9]">
                <ListFilter size={16} />
                <select
                  value={verification}
                  onChange={(e) =>
                    setVerification(e.target.value as VerificationFilter)
                  }
                  className="w-full bg-transparent outline-none"
                >
                  <option value="all">
                    {locale === "en" ? "All status" : "সব স্ট্যাটাস"}
                  </option>
                  <option value="verified">
                    {locale === "en" ? "Verified" : "ভেরিফাইড"}
                  </option>
                  <option value="unverified">
                    {locale === "en" ? "Not verified" : "নট ভেরিফাইড"}
                  </option>
                </select>
              </label>

              <label className="flex items-center gap-2 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 text-sm text-[#6f7c98] dark:border-white/10 dark:bg-[#11192c] dark:text-[#a7b3c9]">
                <ListFilter size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="newest">
                    {locale === "en" ? "Newest to oldest" : "নতুন থেকে পুরোনো"}
                  </option>
                  <option value="oldest">
                    {locale === "en" ? "Oldest to newest" : "পুরোনো থেকে নতুন"}
                  </option>
                  <option value="alphabetical-asc">
                    {locale === "en" ? "Alphabet A-Z" : "বর্ণানুক্রম A-Z"}
                  </option>
                  <option value="alphabetical-desc">
                    {locale === "en" ? "Alphabet Z-A" : "বর্ণানুক্রম Z-A"}
                  </option>
                  <option value="services-desc">
                    {locale === "en"
                      ? "Most purchased services"
                      : "সবচেয়ে বেশি সার্ভিস ক্রয়"}
                  </option>
                  <option value="services-asc">
                    {locale === "en"
                      ? "Least purchased services"
                      : "সবচেয়ে কম সার্ভিস ক্রয়"}
                  </option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-3 text-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f3f6fd] px-4 py-2 font-medium text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]">
            <Users size={14} />
            {locale === "en" ? "Results" : "রেজাল্ট"}: {filteredUsers.length}
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 font-medium text-green-700">
            <ShieldCheck size={14} />
            {locale === "en" ? "Verified" : "ভেরিফাইড"}:{" "}
            {filteredUsers.filter((user) => user.verified).length}
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 font-medium text-red-700">
            <ShieldX size={14} />
            {locale === "en" ? "Not verified" : "নট ভেরিফাইড"}:{" "}
            {filteredUsers.filter((user) => !user.verified).length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[920px]">
            <div className="grid grid-cols-[1.05fr_1.15fr_0.9fr_0.7fr_0.7fr_0.7fr] gap-3 rounded-2xl bg-[#f8fbff] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7f8ba3] dark:bg-[#11192c]">
              <span>{locale === "en" ? "User" : "ইউজার"}</span>
              <span>{locale === "en" ? "Email" : "ইমেইল"}</span>
              <span>{locale === "en" ? "Phone" : "ফোন"}</span>
              <span>{locale === "en" ? "Status" : "স্ট্যাটাস"}</span>
              <span>{locale === "en" ? "Services" : "সার্ভিস"}</span>
              <span>{locale === "en" ? "Joined" : "জয়েন"}</span>
            </div>

            <div className="mt-3 space-y-3">
              {filteredUsers.map((item) => (
                <div
                  key={item.email}
                  className="grid grid-cols-[1.05fr_1.15fr_0.9fr_0.7fr_0.7fr_0.7fr] gap-3 rounded-2xl border border-[#e8edf7] px-4 py-4 dark:border-white/10"
                >
                  <div>
                    <p className="truncate font-semibold text-[#1f2638] dark:text-white">
                      {locale === "en" ? item.nameEn : item.name}
                    </p>
                    <p className="mt-1 text-xs text-[#8a96ad] dark:text-[#70809c]">
                      {locale === "en"
                        ? `Spent ৳${item.totalSpent.toLocaleString()}`
                        : `খরচ ৳${item.totalSpent.toLocaleString()}`}
                    </p>
                  </div>
                  <p className="truncate text-sm text-[#60708d] dark:text-[#a7b3c9]">
                    {item.email}
                  </p>
                  <p className="text-sm text-[#60708d] dark:text-[#a7b3c9]">
                    {item.phone}
                  </p>
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        item.verified
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.verified
                        ? locale === "en"
                          ? "Verified"
                          : "ভেরিফাইড"
                        : locale === "en"
                          ? "Not verified"
                          : "নট ভেরিফাইড"}
                    </span>
                  </div>
                  <p className="font-bold text-[#1f2638] dark:text-white">
                    {item.completedServices}
                  </p>
                  <p className="text-sm text-[#60708d] dark:text-[#a7b3c9]">
                    {new Date(item.joinedAt).toLocaleDateString(
                      locale === "en" ? "en-GB" : "bn-BD",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              ))}

              {!filteredUsers.length ? (
                <div className="rounded-2xl border border-dashed border-[#dbe4f4] px-4 py-10 text-center text-sm text-[#7f8ba3] dark:border-white/10 dark:text-[#a7b3c9]">
                  {locale === "en"
                    ? "No users matched the current search or sorting filters."
                    : "বর্তমান সার্চ বা ফিল্টারের সাথে কোনো ইউজার মেলেনি।"}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </AdminSurface>
  );
}
