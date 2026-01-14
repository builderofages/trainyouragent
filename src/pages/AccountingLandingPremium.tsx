import { IndustryLandingTemplate } from "@/components/premium/IndustryLandingTemplate";
import { industryConfigs } from "@/config/industryConfigs";

const AccountingLandingPremium = () => {
  return <IndustryLandingTemplate config={industryConfigs.accounting} />;
};

export default AccountingLandingPremium;
