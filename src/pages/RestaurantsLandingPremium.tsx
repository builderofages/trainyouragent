import { IndustryLandingTemplate } from "@/components/premium/IndustryLandingTemplate";
import { industryConfigs } from "@/config/industryConfigs";

const RestaurantsLandingPremium = () => {
  return <IndustryLandingTemplate config={industryConfigs.restaurants} />;
};

export default RestaurantsLandingPremium;
