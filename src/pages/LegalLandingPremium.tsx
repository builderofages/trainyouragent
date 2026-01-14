import { IndustryLandingTemplate } from "@/components/premium/IndustryLandingTemplate";
import { industryConfigs } from "@/config/industryConfigs";

const LegalLandingPremium = () => {
  return <IndustryLandingTemplate config={industryConfigs.legal} />;
};

export default LegalLandingPremium;
