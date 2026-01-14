import { IndustryLandingTemplate } from "@/components/premium/IndustryLandingTemplate";
import { industryConfigs } from "@/config/industryConfigs";

const SolarLandingPremium = () => {
  return <IndustryLandingTemplate config={industryConfigs.solar} />;
};

export default SolarLandingPremium;
