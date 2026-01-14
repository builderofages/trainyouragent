import { IndustryLandingTemplate } from "@/components/premium/IndustryLandingTemplate";
import { industryConfigs } from "@/config/industryConfigs";

const LogisticsLandingPremium = () => {
  return <IndustryLandingTemplate config={industryConfigs.logistics} />;
};

export default LogisticsLandingPremium;
