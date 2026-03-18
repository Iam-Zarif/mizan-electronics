import Hero from "./Hero";
import { ServiceCatalogProvider } from "./ServiceCatalogProvider";
import ServiceCategoriesSection from "./ServiceCategoriesSection";
import TopServicesSection from "./TopServicesSection";
import AllServicesSection from "./AllServicesSection";
import TestimonialsClients from "./TestimonialsClients";
import PackagesSection from "./PackagesSection";

const HomeComponent = () => {
  return (
    <>
      <Hero />
      <ServiceCatalogProvider>
        <ServiceCategoriesSection />
        <TopServicesSection />
        <PackagesSection />
        <AllServicesSection />
      </ServiceCatalogProvider>
      <TestimonialsClients />
    </>
  );
};

export default HomeComponent;
