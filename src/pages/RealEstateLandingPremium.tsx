import { IndustryLandingTemplate } from "@/components/premium/IndustryLandingTemplate";
import { industryConfigs } from "@/config/industryConfigs";

const RealEstateLandingPremium = () => {
  return <IndustryLandingTemplate config={industryConfigs["real-estate"]} />;
};

export default RealEstateLandingPremium;
