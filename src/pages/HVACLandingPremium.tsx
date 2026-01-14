import { IndustryLandingTemplate } from "@/components/premium/IndustryLandingTemplate";
import { industryConfigs } from "@/config/industryConfigs";

const HVACLandingPremium = () => {
  return <IndustryLandingTemplate config={industryConfigs.hvac} />;
};

export default HVACLandingPremium;
