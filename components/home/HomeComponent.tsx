import Hero from "./Hero";
import ServiceCategoriesSection from "./ServiceCategoriesSection";
import TopServicesSection from "./TopServicesSection";
import AllServicesSection from "./AllServicesSection";
import TestimonialsClients from "./TestimonialsClients";
import PackagesSection from "./PackagesSection";

const HomeComponent = () => {
  return (
    <>
      <Hero />
      <ServiceCategoriesSection />
      <TopServicesSection />
      <PackagesSection />
      <AllServicesSection />
      <TestimonialsClients />
    </>
  );
};

export default HomeComponent;
