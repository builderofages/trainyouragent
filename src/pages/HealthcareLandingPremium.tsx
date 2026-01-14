import { IndustryLandingTemplate } from "@/components/premium/IndustryLandingTemplate";
import { industryConfigs } from "@/config/industryConfigs";

const HealthcareLandingPremium = () => {
  return <IndustryLandingTemplate config={industryConfigs.healthcare} />;
};

export default HealthcareLandingPremium;
