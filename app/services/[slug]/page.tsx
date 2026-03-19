import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailClient from "@/components/services/ServiceDetailClient";
import { getSiteUrl, getServerPublicServiceCatalog } from "@/lib/server/public-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const catalog = await getServerPublicServiceCatalog();
  return (catalog?.services ?? []).map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await getServerPublicServiceCatalog();
  const service = catalog?.services.find((item) => item.slug === slug);
  const category = service
    ? catalog?.categories.find((item) => item.id === service.categoryId)
    : null;

  if (!service) {
    return {
      title: "Service Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${service.titleEn} in Dhaka`;
  const description = `${service.summaryEn} Book ${service.titleEn.toLowerCase()} from Mizan AC Servicing in Dhaka.`;
  const image = service.images[0];

  return {
    title,
    description,
    alternates: {
      canonical: `${getSiteUrl()}/services/${service.slug}`,
    },
    openGraph: {
      title: `${title} | Mizan AC Servicing`,
      description,
      url: `${getSiteUrl()}/services/${service.slug}`,
      type: "website",
      images: image ? [{ url: image, alt: service.titleEn }] : undefined,
    },
    keywords: [
      service.titleEn,
      category?.nameEn ?? "",
      "AC service Dhaka",
      "AC repair Dhaka",
      "Mizan AC Servicing",
    ].filter(Boolean),
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const catalog = await getServerPublicServiceCatalog();

  if (catalog && !catalog.services.some((item) => item.slug === slug)) {
    notFound();
  }

  return <ServiceDetailClient slug={slug} initialData={catalog} />;
}
