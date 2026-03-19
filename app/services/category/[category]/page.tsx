import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryPageClient from "@/components/services/CategoryPageClient";
import { getSiteUrl, getServerPublicServiceCatalog } from "@/lib/server/public-content";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const catalog = await getServerPublicServiceCatalog();
  return (catalog?.categories ?? []).map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categoryId } = await params;
  const catalog = await getServerPublicServiceCatalog();
  const category = catalog?.categories.find((item) => item.id === categoryId);

  if (!category) {
    return {
      title: "Category Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${category.nameEn} in Dhaka`;
  const description = `${category.description} Browse ${category.nameEn.toLowerCase()} from Mizan AC Servicing in Dhaka.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${getSiteUrl()}/services/category/${category.id}`,
    },
    openGraph: {
      title: `${title} | Mizan AC Servicing`,
      description,
      url: `${getSiteUrl()}/services/category/${category.id}`,
      type: "website",
      images: category.image ? [{ url: category.image, alt: category.nameEn }] : undefined,
    },
    keywords: [category.nameEn, "AC service Dhaka", "Mizan AC Servicing"],
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: categoryId } = await params;
  const catalog = await getServerPublicServiceCatalog();

  if (catalog && !catalog.categories.some((item) => item.id === categoryId)) {
    notFound();
  }

  return <CategoryPageClient categoryId={categoryId} initialData={catalog} />;
}
