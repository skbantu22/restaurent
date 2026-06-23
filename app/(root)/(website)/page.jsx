import EmblaSlider from "@/components/ui/Application/website/EmblaSlider";

import dynamic from "next/dynamic";

import MenProducts from "@/components/ui/Application/website/men";
import ShowCategoryList from "@/components/ui/Application/website/ShowCategoryList";
import BottomCategoryList from "@/components/ui/Application/website/bottomcategory";

import Mobilefooter from "@/components/ui/Application/website/mobilefooter";
import TrustSection from "@/components/ui/Application/website/TrustSection";
import BurgerHero from "@/components/ui/Application/website/Bigbanner";
import WhySmashed from "@/components/ui/Application/website/banner2";
import FooterPromo from "@/components/ui/Application/website/Banner3";
import BurgerBanner from "@/components/ui/Application/website/ownway";
import MostLovedMenu from "@/components/ui/Application/website/FeatureOrder";
import PremiumMealBuilder from "@/components/ui/Application/website/customorders";

// ✅ Lazy load heavy sections
const Featuredproducts = dynamic(
  () => import("@/components/ui/Application/website/Featuredproducts"),
  {
    loading: () => <div className="min-h-[200px]" />,
  },
);

const Womenproducts = dynamic(
  () => import("@/components/ui/Application/website/women"),
  {
    loading: () => <div className="min-h-[200px]" />,
  },
);

const Home = () => {
  return (
    <div>
      {/* ✅ LCP element should load first */}

      <BurgerHero />

      <MostLovedMenu />

      <BurgerBanner />

      <PremiumMealBuilder />

      <WhySmashed />

      <ShowCategoryList />
      <FooterPromo />
    </div>
  );
};

export default Home;
