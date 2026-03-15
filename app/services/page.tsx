"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { GoArrowUpRight } from "react-icons/go";
import { Search } from "lucide-react";
import { serviceCategories, serviceItems, serviceEnText } from "@/lib/services";
import { useLanguage } from "@/lib/i18n";

const whatsappBase = "https://wa.me/8801949397234?text=";
const messengerBase = "https://www.facebook.com/messages/t/61583720444800?message=";

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
            <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white">সব সার্ভিস</h1>
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

        <div className="grid gap-2.5 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
  const link = `https://mizanelectronics.vercel.app/services/category/${service.categoryId}`;
  const waText = encodeURIComponent(`${link}\nআমি ${title} বুক করতে চাই`);
  const msText = encodeURIComponent(`${link}\nআমি ${title} বুক করতে চাই`);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="cursor-pointer rounded-3xl border border-white/15 bg-white shadow-[0_25px_60px_-40px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-neutral-900"
    >
      <div className="relative h-56 w-full overflow-hidden rounded-t-3xl">
        <Image src={service.images[0]} alt={service.title} fill className="object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#2160ba] shadow">
          {service.price}
        </span>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-lg font-bold text-neutral-900 dark:text-white">{title}</h4>
            <p className="hidden sm:block mt-1 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">{summary}</p>
          </div>
        </div>

        <div className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-300">
          {service.process.slice(0, 3).map((step, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ec4899]" />
              {step}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <a
            href={`${messengerBase}${msText}`}
            target="_blank"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#6366f1]/40 px-3 py-2 text-xs font-semibold text-[#6366f1] cursor-pointer"
          >
            মেসেঞ্জার (কুয়েরি)
            <GoArrowUpRight className="text-base" />
          </a>
          <a
            href={`${whatsappBase}${waText}`}
            target="_blank"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-4 py-2 text-xs font-semibold text-white shadow cursor-pointer"
          >
            বুক করুন
            <GoArrowUpRight className="text-base" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
