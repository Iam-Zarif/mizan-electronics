import type { Metadata } from "next";
import ServicesPageClient from "@/components/services/ServicesPageClient";
import { getSiteUrl, getServerPublicServiceCatalog } from "@/lib/server/public-content";

export const metadata: Metadata = {
  title: "AC Services in Dhaka",
  description:
    "Explore AC cleaning, installation, repair, gas refill, shifting and compressor services in Dhaka from Mizan AC Servicing.",
  alternates: {
    canonical: `${getSiteUrl()}/services`,
  },
  openGraph: {
    title: "AC Services in Dhaka | Mizan AC Servicing",
    description:
      "AC cleaning, installation, repair, gas refill and maintenance services in Dhaka.",
    url: `${getSiteUrl()}/services`,
    type: "website",
  },
};

export default async function ServicesPage() {
  const catalog = await getServerPublicServiceCatalog();

  return <ServicesPageClient initialData={catalog} />;
}
