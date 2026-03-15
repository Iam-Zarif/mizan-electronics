import { notFound } from "next/navigation";
import { serviceCategories, serviceItems } from "@/lib/services";
import CategoryClient from "@/components/services/CategoryClient";
import type { Metadata } from "next";

export const dynamicParams = true;

export function generateStaticParams() {
  return serviceCategories.map((cat) => ({ category: cat.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await params;
  const cat = serviceCategories.find((c) => c.id === category);
  if (!cat) return {};
  const url = `https://mizanelectronics.vercel.app/services/category/${category}`;
  return {
    title: cat.name,
    description: cat.description,
    openGraph: {
      title: cat.name,
      description: cat.description,
      url,
      images: [{ url: cat.image, width: 1200, height: 630, alt: cat.name }],
    },
    alternates: { canonical: url },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = await params;
  const category = serviceCategories.find((c) => c.id === categoryId);
  if (!category) return notFound();
  const items = serviceItems.filter((s) => s.categoryId === categoryId);
  return <CategoryClient category={category} items={items} />;
}
