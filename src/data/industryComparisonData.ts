export interface IndustryComparisonData {
  aiAgentCost: string;
  humanStaffCost: string;
  setupTime: string;
  averageROI: string;
  paybackPeriod: string;
}

export const industryComparisonData: Record<string, IndustryComparisonData> = {
  hvac: {
    aiAgentCost: "$299-$799",
    humanStaffCost: "$4,200+",
    setupTime: "3-7 days",
    averageROI: "385%",
    paybackPeriod: "18 days"
  },
  legal: {
    aiAgentCost: "$499-$999",
    humanStaffCost: "$5,500+",
    setupTime: "5-7 days",
    averageROI: "510%",
    paybackPeriod: "12 days"
  },
  healthcare: {
    aiAgentCost: "$399-$899",
    humanStaffCost: "$4,800+",
    setupTime: "5-7 days",
    averageROI: "445%",
    paybackPeriod: "15 days"
  },
  accounting: {
    aiAgentCost: "$399-$799",
    humanStaffCost: "$4,500+",
    setupTime: "3-5 days",
    averageROI: "420%",
    paybackPeriod: "14 days"
  },
  restaurants: {
    aiAgentCost: "$299-$699",
    humanStaffCost: "$3,800+",
    setupTime: "3-5 days",
    averageROI: "340%",
    paybackPeriod: "21 days"
  },
  roofing: {
    aiAgentCost: "$399-$899",
    humanStaffCost: "$4,500+",
    setupTime: "3-7 days",
    averageROI: "465%",
    paybackPeriod: "16 days"
  },
  logistics: {
    aiAgentCost: "$399-$799",
    humanStaffCost: "$4,200+",
    setupTime: "5-7 days",
    averageROI: "395%",
    paybackPeriod: "17 days"
  },
  bars: {
    aiAgentCost: "$299-$699",
    humanStaffCost: "$3,500+",
    setupTime: "3-5 days",
    averageROI: "360%",
    paybackPeriod: "19 days"
  }
};
