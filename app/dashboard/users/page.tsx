"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  ListFilter,
  Mail,
  MapPin,
  PhoneCall,
  Search,
  ShieldCheck,
  ShieldX,
  Users,
  X,
} from "lucide-react";
import { AdminPageHeader, AdminSurface } from "@/components/admin/AdminSections";
import { ApiErrorState, ApiSkeletonBlock } from "@/components/shared/ApiState";
import { PaginationControls } from "@/components/shared/PaginationControls";
import {
  getAdminCustomers,
  getAdminUsers,
  type AdminCustomerRow,
} from "@/lib/dashboard-api";
import { getValueOrEmpty } from "@/lib/display";
import { useLanguage } from "@/lib/i18n";
import { useApiQuery } from "@/hooks/use-api-query";

type VerificationFilter = "all" | "verified" | "unverified";
type SortKey =
  | "alphabetical"
  | "alphabetical_desc"
  | "newest"
  | "oldest"
  | "most_services"
  | "least_services";

export default function DashboardUsersPage() {
  const { locale } = useLanguage();
  const [query, setQuery] = useState("");
  const [verification, setVerification] = useState<VerificationFilter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [query, verification, sortBy]);

  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
    refresh: refreshUsers,
  } = useApiQuery(
    () =>
      getAdminUsers({
        search: query,
        verification,
        sort: sortBy,
        page,
        limit: 12,
      }),
    [query, verification, sortBy, page],
  );

  const {
    data: customersData,
    isLoading: isCustomersLoading,
    error: customersError,
    refresh: refreshCustomers,
  } = useApiQuery(() => getAdminCustomers({ page, limit: 12 }), [page]);

  const selectedUser = useMemo(() => {
    if (!selectedEmail) return null;
    return usersData?.rows.find((user) => user.email === selectedEmail) ?? null;
  }, [selectedEmail, usersData]);

  const customerByEmail = useMemo(() => {
    const map = new Map<string, AdminCustomerRow>();

    for (const row of customersData?.rows ?? []) {
      if (row.customerEmail) {
        map.set(row.customerEmail, row);
      }
    }

    return map;
  }, [customersData]);

  const selectedPurchases = useMemo(() => {
    if (!selectedUser) return [];
    return customerByEmail.get(selectedUser.email)?.purchases ?? [];
  }, [customerByEmail, selectedUser]);

  const isLoading = isUsersLoading || isCustomersLoading;
  const error = usersError ?? customersError;

  return (
    <>
      <AdminSurface>
        <AdminPageHeader titleBn="সকল ইউজার" titleEn="All Users" />

        {isLoading ? <ApiSkeletonBlock rows={5} /> : null}
        {!isLoading && error ? (
          <ApiErrorState
            title={locale === "en" ? "Users failed to load" : "ইউজার ডেটা লোড হয়নি"}
            description={error}
            onRetry={() => {
              void refreshUsers();
              void refreshCustomers();
            }}
          />
        ) : null}

        {!isLoading && !error && usersData ? (
          <div className="rounded-[24px] border border-[#e8edf7] bg-white p-5 shadow-[0_18px_35px_-28px_rgba(63,94,160,0.35)] dark:border-white/10 dark:bg-[#161f36]">
            <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="xl:flex-1">
                <label className="flex w-full items-center gap-2 rounded-2xl border border-[#e3eaf6] bg-[#f8fbff] px-4 py-3 text-sm text-[#6f7c98] dark:border-white/10 dark:bg-[#11192c] dark:text-[#a7b3c9] xl:max-w-[360px]">
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
              </div>

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
                    <option value="alphabetical">
                      {locale === "en" ? "Alphabet A-Z" : "বর্ণানুক্রম A-Z"}
                    </option>
                    <option value="alphabetical_desc">
                      {locale === "en" ? "Alphabet Z-A" : "বর্ণানুক্রম Z-A"}
                    </option>
                    <option value="most_services">
                      {locale === "en" ? "Most purchased services" : "সবচেয়ে বেশি সার্ভিস ক্রয়"}
                    </option>
                    <option value="least_services">
                      {locale === "en" ? "Least purchased services" : "সবচেয়ে কম সার্ভিস ক্রয়"}
                    </option>
                  </select>
                </label>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-3 text-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f3f6fd] px-4 py-2 font-medium text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]">
                <Users size={14} />
                {locale === "en" ? "Results" : "রেজাল্ট"}: {usersData.counts.total}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 font-medium text-green-700">
                <ShieldCheck size={14} />
                {locale === "en" ? "Verified" : "ভেরিফাইড"}: {usersData.counts.verified}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 font-medium text-red-700">
                <ShieldX size={14} />
                {locale === "en" ? "Not verified" : "নট ভেরিফাইড"}: {usersData.counts.unverified}
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
                  {usersData.rows.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1.05fr_1.15fr_0.9fr_0.7fr_0.7fr_0.7fr_auto] gap-3 rounded-2xl border border-[#e8edf7] px-4 py-4 dark:border-white/10"
                    >
                      <div>
                        <p className="truncate font-semibold text-[#1f2638] dark:text-white">
                          {item.name}
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
                        {getValueOrEmpty(item.phone, locale, "Phone", "ফোন")}
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
                      <button
                        type="button"
                        onClick={() => setSelectedEmail(item.email)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#f3f6fd] px-3 py-2 text-xs font-semibold text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]"
                      >
                        <Eye size={14} />
                        {locale === "en" ? "Details" : "ডিটেইলস"}
                      </button>
                    </div>
                  ))}

                  {!usersData.rows.length ? (
                    <div className="rounded-2xl border border-dashed border-[#dbe4f4] px-4 py-10 text-center text-sm text-[#7f8ba3] dark:border-white/10 dark:text-[#a7b3c9]">
                      {locale === "en"
                        ? "No users matched the current search or sorting filters."
                        : "বর্তমান সার্চ বা ফিল্টারের সাথে কোনো ইউজার মেলেনি।"}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <PaginationControls
              pagination={usersData.pagination}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </AdminSurface>

      {selectedUser ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-[28px] bg-white p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] dark:bg-[#161f36]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-bold text-[#1f2638] dark:text-white">
                  {selectedUser.name}
                </p>
                <p className="mt-1 text-sm text-[#7f8ba3]">
                  {locale === "en"
                    ? "User profile details and purchased services."
                    : "ইউজারের প্রোফাইল ডিটেইলস ও কেনা সার্ভিস।"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f6fd] text-[#4f6bff] dark:bg-white/8 dark:text-[#aab5ff]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.88fr,1.12fr]">
              <div className="space-y-3">
                {[
                  {
                    icon: Mail,
                    labelEn: "Email",
                    labelBn: "ইমেইল",
                    value: selectedUser.email,
                  },
                  {
                    icon: PhoneCall,
                    labelEn: "Phone",
                    labelBn: "ফোন",
                    value: getValueOrEmpty(selectedUser.phone, locale, "Phone", "ফোন"),
                  },
                  {
                    icon: MapPin,
                    labelEn: "Primary Address",
                    labelBn: "প্রাইমারি ঠিকানা",
                    value: getValueOrEmpty(
                      selectedUser.primaryAddress,
                      locale,
                      "Primary address",
                      "প্রাইমারি ঠিকানা",
                    ),
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.labelEn}
                      className="rounded-2xl bg-[#f8fbff] px-4 py-4 dark:bg-[#11192c]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#4f6bff] shadow-sm dark:bg-white/8 dark:text-[#aab5ff]">
                          <Icon size={17} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a96ad]">
                            {locale === "en" ? item.labelEn : item.labelBn}
                          </p>
                          <p className="mt-2 break-words text-sm font-semibold text-[#1f2638] dark:text-white">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl bg-[#f8fbff] p-4 dark:bg-[#11192c]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-[#1f2638] dark:text-white">
                      {locale === "en" ? "Purchased Services" : "কেনা সার্ভিস"}
                    </p>
                    <p className="text-sm text-[#7f8ba3]">
                      {selectedPurchases.length} {locale === "en" ? "entries" : "এন্ট্রি"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      selectedUser.verified
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedUser.verified
                      ? locale === "en"
                        ? "Verified"
                        : "ভেরিফাইড"
                      : locale === "en"
                        ? "Not verified"
                        : "নট ভেরিফাইড"}
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedPurchases.length ? (
                    selectedPurchases.map((purchase) => (
                      <div
                        key={purchase.invoiceNo}
                        className="rounded-2xl border border-[#e5ebf7] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#161f36]"
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <p className="font-semibold text-[#1f2638] dark:text-white">
                              {locale === "en" ? purchase.serviceTitleEn : purchase.serviceTitleBn}
                            </p>
                            <p className="mt-1 text-xs text-[#8a96ad]">
                              {purchase.invoiceNo}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              purchase.paymentStatus === "paid"
                                ? "bg-green-100 text-green-700"
                                : purchase.paymentStatus === "partial"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {purchase.paymentStatus}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 text-sm text-[#60708d] dark:text-[#a7b3c9] sm:grid-cols-3">
                          <p>
                            {locale === "en" ? "Paid" : "পরিশোধ"}: ৳{purchase.amountPaid.toLocaleString()}
                          </p>
                          <p>
                            {locale === "en" ? "Subtotal" : "মোট"}: ৳{purchase.subtotal.toLocaleString()}
                          </p>
                          <p>
                            {locale === "en" ? "Due" : "বাকি"}: ৳{purchase.due.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#dbe4f4] px-4 py-8 text-center text-sm text-[#7f8ba3] dark:border-white/10 dark:text-[#a7b3c9]">
                      {locale === "en"
                        ? "No purchased services found for this user yet."
                        : "এই ইউজারের জন্য এখনো কোনো কেনা সার্ভিস পাওয়া যায়নি।"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
