import {
  getServerLandingPackages,
  getServerPublicReviews,
  getServerPublicServiceCatalog,
} from "@/lib/server/public-content";
import HomeComponent from "@/components/home/HomeComponent";

export default async function Home() {
  const [catalog, packages, reviews] = await Promise.all([
    getServerPublicServiceCatalog(),
    getServerLandingPackages(),
    getServerPublicReviews(),
  ]);

  return <HomeComponent catalog={catalog} packages={packages} reviews={reviews} />;
}
