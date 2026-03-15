import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GoArrowUpRight } from "react-icons/go";
import { serviceItems, serviceCategories, categoryEnLabels, serviceEnText } from "@/lib/services";
import type { Metadata } from "next";

type Props = { params: { slug: string } };

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = serviceItems.find((s) => s.slug === params.slug);
  if (!service) return {};
  const url = `https://mizanelectronics.vercel.app/services/category/${service.categoryId}`;
  const image = service.images?.[0];
  return {
    title: `AC Service | ${service.title}`,
    description: service.summary,
    openGraph: {
      title: `AC Service | ${service.title}`,
      description: service.summary,
      url,
      images: image ? [{ url: image, width: 1200, height: 630, alt: service.title }] : undefined,
    },
    alternates: { canonical: url },
  };
  
}

export function generateStaticParams() {
  return serviceItems.map((s) => ({ slug: s.slug }));
}

export default function ServiceDetail({ params }: Props) {
  const service = serviceItems.find((s) => s.slug === params.slug);
  if (!service) return notFound();

  const category = serviceCategories.find((c) => c.id === service.categoryId);
  const en = serviceEnText[service.slug];
  const title = en ? en.title : service.title;
  const summary = en ? en.summary : service.summary;
  const categoryLink = `https://mizanelectronics.vercel.app/services/category/${service.categoryId}`;
  const whatsappText = encodeURIComponent(
    `${categoryLink}\nক্যাটাগরি: ${category ? category.name : ""}\nসার্ভিস: ${service.title}`
  );
  const messengerText = encodeURIComponent(
    `${categoryLink}\nক্যাটাগরি: ${category ? category.name : ""}\nসার্ভিস: ${service.title}`
  );
  const whatsappBase = "https://wa.me/8801949397234?text=";
  const messengerBase = "https://www.facebook.com/messages/t/61583720444800?message=";

  return (
    <section className="relative pt-24 pb-14">
      <div className="mx-auto max-w-6xl px-4 space-y-8">
        <header className="space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#ec4899] via-[#6366f1] to-[#e18b94] px-4 py-1.5 text-sm font-semibold text-white shadow">
            {category ? category.name : service.categoryId}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white">{title}</h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300">{summary}</p>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-[#ecaa81]/20 px-3 py-1 text-xs font-semibold text-[#ecaa81]">{service.price}</span>
            <Link
              href={`${whatsappBase}${whatsappText}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#2160ba] via-[#7b3dc8] to-[#ecaa81] px-4 py-2 text-xs font-semibold text-white shadow cursor-pointer"
            >
              বুক করুন
              <GoArrowUpRight className="text-base" />
            </Link>
            <Link
              href={`${messengerBase}${messengerText}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/40 px-3 py-2 text-xs font-semibold text-[#6366f1] cursor-pointer"
            >
              মেসেঞ্জার (কুয়েরি)
              <GoArrowUpRight className="text-base" />
            </Link>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-[1.4fr,1fr] items-start">
          <div className="space-y-4">
            <div className="relative h-72 w-full overflow-hidden rounded-2xl">
              <Image src={service.images[0]} alt={service.title} fill className="object-cover" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">সার্ভিস প্রসেস</h3>
              <ul className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                {service.process.map((step, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#6366f1]" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/80 p-4 shadow dark:bg-neutral-900/70">
            <h3 className="text-lg font-bold">কেন আমাদের নিবেন</h3>
            <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
              <li>লাইসেন্সধারী টেকনিশিয়ান</li>
              <li>ভ্যাকুয়াম ও প্রেসার চেক অন্তর্ভুক্ত</li>
              <li>স্বচ্ছ মূল্য ও দ্রুত সাপোর্ট</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
