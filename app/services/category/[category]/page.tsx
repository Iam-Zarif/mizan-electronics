import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";
import { serviceCategories, serviceItems } from "@/lib/services";

export function generateStaticParams() {
  return serviceCategories.map((cat) => ({ category: cat.id }));
}

export const dynamicParams = true;

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = await params;

  const category = serviceCategories.find((c) => c.id === categoryId);
  const items = serviceItems.filter((s) => s.categoryId === categoryId);
  const whatsappBase = "https://wa.me/8801949397234?text=";
  const messengerBase = "https://www.facebook.com/messages/t/61583720444800?message=";

  if (!category) return notFound();

  return (
    <section className="relative pt-24 pb-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr] items-center">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#ec4899] via-[#6366f1] to-[#e18b94] px-4 py-1.5 text-sm font-semibold text-white shadow">
              {category.name}
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white">
              {category.name}
            </h1>
            <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300">{category.description}</p>
          </div>

          <div className="relative h-64 w-full overflow-hidden rounded-2xl">
            <Image src={category.image} alt={category.name} fill className="object-cover" />
          </div>
        </div>

        <div className="grid gap-2.5 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((service) => {
            const link = `https://mizan-electronics.vercel.app/services/${service.slug}`;
            const waText = encodeURIComponent(`I want to book ${service.title}\n${link}`);
            const msText = encodeURIComponent(`I want to book ${service.title}\n${link}`);
            return (
              <div
                key={service.id}
                className="rounded-3xl border border-white/15 bg-white/85 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.35)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/70"
              >
                <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
                  <Image src={service.images[0]} alt={service.title} fill className="object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[#2160ba]">
                    {service.price}
                  </span>
                </div>

                <div className="space-y-3 px-4 py-4">
                  <h4 className="text-lg font-bold text-neutral-900 dark:text-white">{service.title}</h4>
                  <p className="hidden sm:block text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">{service.summary}</p>

                  <div className="flex flex-col gap-2 pt-1">
                    <Link
                      href={`${messengerBase}${msText}`}
                      target="_blank"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#6366f1]/40 px-3 py-2 text-xs font-semibold text-[#6366f1] cursor-pointer"
                    >
                      মেসেঞ্জার (কুয়েরি)
                      <GoArrowUpRight className="text-base" />
                    </Link>
                    <Link
                      href={`${whatsappBase}${encodeURIComponent(`আমি ${service.title} বুক করতে চাই - লিংক: https://mizan-electronics.vercel.app/services/${service.slug}`)}`}
                      target="_blank"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-4 py-2 text-xs font-semibold text-white shadow cursor-pointer"
                    >
                      বুক করুন
                      <GoArrowUpRight className="text-base" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
