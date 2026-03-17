"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { serviceCategories, serviceItems, serviceEnText } from "@/lib/services";
import { useLanguage } from "@/lib/i18n";
import ReusableServiceCard from "@/components/services/ServiceCard";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"az" | "za" | "price-asc" | "price-desc">("az");
  const [category, setCategory] = useState<string>("all");
  const { locale } = useLanguage();

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    const filterCategory = category;

    const parsePrice = (price: string) => {
      const nums = [...price.matchAll(/\d+/g)].map((n) => Number(n[0]));
      if (!nums.length) return 0;
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      return avg;
    };

    const list = serviceItems.filter((s) => {
      if (filterCategory !== "all" && s.categoryId !== filterCategory) return false;
      const en = serviceEnText[s.slug];
      const haystack = [s.title, s.summary, en?.title ?? "", en?.summary ?? ""].join(" ").toLowerCase();
      return haystack.includes(term);
    });

    return list.sort((a, b) => {
      if (sort === "price-asc" || sort === "price-desc") {
        const diff = parsePrice(a.price) - parsePrice(b.price);
        return sort === "price-asc" ? diff : -diff;
      }
      return sort === "az" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    });
  }, [search, sort, category]);

  return (
    <section className="relative pt-24 pb-14">
      <div className="mx-auto max-w-7xl px-4 space-y-10">
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl lg:text-3xl font-semibold text-neutral-900 dark:text-white">সব সার্ভিস</h1>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/80 px-3 py-2 shadow dark:bg-neutral-900/70">
                <Search size={16} className="text-neutral-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="বাংলা বা ইংরেজিতে সার্চ করুন..."
                  className="w-48 sm:w-72 bg-transparent text-sm outline-none"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-sm shadow dark:bg-neutral-900/70"
              >
                <option value="all">সকল ক্যাটাগরি</option>
                {serviceCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-sm shadow dark:bg-neutral-900/70"
              >
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
                <option value="price-asc">মূল্য: কম থেকে বেশি</option>
                <option value="price-desc">মূল্য: বেশি থেকে কম</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2.5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((service) => (
              <ServiceCard key={service.id} service={service} locale={locale} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, locale }: { service: (typeof serviceItems)[number]; locale: string }) {
  const en = serviceEnText[service.slug];
  const title = locale === "en" && en ? en.title : service.title;
  const summary = locale === "en" && en ? en.summary : service.summary;
  const categoryName = serviceCategories.find((c) => c.id === service.categoryId)?.name ?? "";

  return (
    <ReusableServiceCard
      service={service}
      title={title}
      summary={summary}
      categoryName={categoryName}
      showProcess
    />
  );
}
