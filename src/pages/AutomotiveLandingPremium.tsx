import { IndustryLandingTemplate } from "@/components/premium/IndustryLandingTemplate";
import { industryConfigs } from "@/config/industryConfigs";

const AutomotiveLandingPremium = () => {
  return <IndustryLandingTemplate config={industryConfigs.automotive} />;
};

export default AutomotiveLandingPremium;
