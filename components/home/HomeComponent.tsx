import type {
  PublicPackagesResponse,
  PublicReviewsResponse,
  PublicServiceCatalogResponse,
} from "@/lib/dashboard-api";
import Hero from "./Hero";
import { ServiceCatalogProvider } from "./ServiceCatalogProvider";
import ServiceCategoriesSection from "./ServiceCategoriesSection";
import TopServicesSection from "./TopServicesSection";
import AllServicesSection from "./AllServicesSection";
import TestimonialsClients from "./TestimonialsClients";
import PackagesSection from "./PackagesSection";

const HomeComponent = ({
  catalog,
  packages,
  reviews,
}: {
  catalog: PublicServiceCatalogResponse | null;
  packages: PublicPackagesResponse | null;
  reviews: PublicReviewsResponse | null;
}) => {
  return (
    <>
      <Hero />
      <ServiceCatalogProvider initialData={catalog}>
        <ServiceCategoriesSection />
        <TopServicesSection />
        <PackagesSection initialData={packages} />
        <AllServicesSection />
      </ServiceCatalogProvider>
      <TestimonialsClients initialData={reviews} />
    </>
  );
};

export default HomeComponent;
