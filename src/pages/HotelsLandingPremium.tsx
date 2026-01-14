import { IndustryLandingTemplate } from "@/components/premium/IndustryLandingTemplate";
import { industryConfigs } from "@/config/industryConfigs";

const HotelsLandingPremium = () => {
  return <IndustryLandingTemplate config={industryConfigs.hotels} />;
};

export default HotelsLandingPremium;
