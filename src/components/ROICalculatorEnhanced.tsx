import { useState, useEffect } from "react";
import { GlassCard } from "@/components/enhanced/GlassCard";
import { AnimatedCounter } from "@/components/enhanced/AnimatedCounter";
import { MagneticButton } from "@/components/enhanced/MagneticButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, DollarSign, Users, Sparkles, XCircle, CheckCircle, Download, Share2, Link as LinkIcon, Loader2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { use3DCard } from "@/hooks/use3DCard";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { trackEvent, conversions } from "@/lib/tracking";
import { siteConfig } from "@/config/site";
import { ResultsDisclaimer } from "@/components/ResultsDisclaimer";
import { TimelineEstimatorCTA } from "@/components/TimelineEstimatorCTA";
import { getVariant, type VariantId, type ExperimentId } from "@/lib/ab-testing";

const ResultCard = ({ icon: Icon, label, value, color, delay }: any) => {
  const { ref, style, onMouseMove, onMouseLeave } = use3DCard(8);

  return (
    <motion.div
      ref={ref as any}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring" }}
      className="perspective-1000"
    >
      <GlassCard hover className={`p-6 hover-lift ${color}`}>
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="text-4xl font-bold">
          {value}
        </div>
      </GlassCard>
    </motion.div>
  );
};

interface ROICalculatorEnhancedProps {
  defaultIndustry?: string;
}

const ROICalculatorEnhanced = ({ defaultIndustry }: ROICalculatorEnhancedProps = {}) => {
  const [industry, setIndustry] = useState(defaultIndustry || "hvac");
  const [monthlyLeads, setMonthlyLeads] = useState(100);
  const [conversionRate, setConversionRate] = useState(7);
  const [avgJobValue, setAvgJobValue] = useState(500);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // A/B Testing variants
  const [headlineVariant, setHeadlineVariant] = useState<VariantId>('control');
  const [ctaVariant, setCtaVariant] = useState<VariantId>('control');

  // Assign A/B test variants on mount
  useEffect(() => {
    const headline = getVariant('roi_headline');
    const cta = getVariant('roi_cta_copy');
    setHeadlineVariant(headline);
    setCtaVariant(cta);
    
    // Track variant views
    trackEvent('ab_variant_viewed', { 
      experiment_id: 'roi_headline',
      variant_id: headline 
    });
    trackEvent('ab_variant_viewed', { 
      experiment_id: 'roi_cta_copy',
      variant_id: cta 
    });
  }, []);

  // Update industry when defaultIndustry prop changes
  useEffect(() => {
    if (defaultIndustry) {
      const selected = industries.find(i => i.id === defaultIndustry);
      if (selected) {
        setIndustry(defaultIndustry);
        setAvgJobValue(selected.defaultJobValue);
      }
    }
  }, [defaultIndustry]);

  // Headline variants
  const headlineVariants: Record<VariantId, string> = {
    control: "ROI Calculator",
    variant_a: "Calculate Your Revenue Increase",
    variant_b: "See What You're Losing to Missed Calls",
    variant_c: "Your Monthly ROI in 60 Seconds",
  };

  // CTA copy variants
  const ctaVariants: Record<VariantId, string> = {
    control: "Calculate My ROI",
    variant_a: "Show Me My Numbers",
    variant_b: "Calculate Lost Revenue",
    variant_c: "See My Potential",
  };

  const industries = [
    { 
      id: "hvac", 
      name: "HVAC", 
      defaultJobValue: 500,
      missedLeadRate: 58,
      recoveryRate: 88,
      avgConversionRate: 18,
      afterHoursRate: 65,
      source: "CallRail 2024 Home Services Report & ACCA Industry Data"
    },
    { 
      id: "legal", 
      name: "Legal Services", 
      defaultJobValue: 3000,
      missedLeadRate: 48,
      recoveryRate: 92,
      avgConversionRate: 15,
      afterHoursRate: 40,
      source: "Legal Marketing Association 2024 & Clio Legal Trends Report"
    },
    { 
      id: "healthcare", 
      name: "Healthcare", 
      defaultJobValue: 1500,
      missedLeadRate: 54,
      recoveryRate: 91,
      avgConversionRate: 22,
      afterHoursRate: 50,
      source: "Healthcare IT News 2024 & Medical Group Management Association"
    },
    { 
      id: "accounting", 
      name: "Accounting", 
      defaultJobValue: 2000,
      missedLeadRate: 52,
      recoveryRate: 89,
      avgConversionRate: 25,
      afterHoursRate: 45,
      source: "Accounting Today 2024 & AICPA Practice Management Survey"
    },
    { 
      id: "restaurants", 
      name: "Restaurants", 
      defaultJobValue: 300,
      missedLeadRate: 65,
      recoveryRate: 82,
      avgConversionRate: 35,
      afterHoursRate: 60,
      source: "Restaurant Business Online 2024 & National Restaurant Association"
    },
    { 
      id: "roofing", 
      name: "Roofing", 
      defaultJobValue: 8000,
      missedLeadRate: 70,
      recoveryRate: 85,
      avgConversionRate: 12,
      afterHoursRate: 55,
      source: "Roofing Contractor Magazine 2024 & NRCA Industry Data"
    },
    { 
      id: "logistics", 
      name: "Logistics", 
      defaultJobValue: 1000,
      missedLeadRate: 62,
      recoveryRate: 87,
      avgConversionRate: 20,
      afterHoursRate: 70,
      source: "Logistics Management 2024 & Council of Supply Chain Management"
    },
    { 
      id: "bars", 
      name: "Bars & Nightclubs", 
      defaultJobValue: 600,
      missedLeadRate: 68,
      recoveryRate: 80,
      avgConversionRate: 30,
      afterHoursRate: 75,
      source: "Nightclub & Bar Magazine 2024 & National Bar & Restaurant Association"
    },
  ];

  const handleIndustryChange = (industryId: string) => {
    setIndustry(industryId);
    const selected = industries.find(i => i.id === industryId);
    if (selected) {
      setAvgJobValue(selected.defaultJobValue);
    }
    trackEvent('calculator_industry_selected', { industry: industryId });
  };

  const handleCalculate = async () => {
    sessionStorage.setItem('calculator_opened', 'true');
    setIsCalculating(true);
    setShowResults(false);
    
    // Simulate calculation time for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    sessionStorage.setItem('calculator_completed', 'true');
    setIsCalculating(false);
    setShowResults(true);
    
    trackEvent('calculator_completed', {
      industry,
      monthly_leads: monthlyLeads,
      conversion_rate: conversionRate,
      avg_job_value: avgJobValue,
      projected_roi: monthlyROI
    });
  };

  // Core calculations using industry-specific data
  const selectedIndustry = industries.find(i => i.id === industry) || industries[0];
  const currentMissedLeads = Math.round((monthlyLeads * selectedIndustry.missedLeadRate) / 100);
  const recoveredLeads = Math.round(currentMissedLeads * (selectedIndustry.recoveryRate / 100));
  const additionalConversions = Math.round((recoveredLeads * conversionRate) / 100);
  const monthlyROI = additionalConversions * avgJobValue;
  const yearlyROI = monthlyROI * 12;
  const costPerMonth = 97;
  const netMonthlyProfit = monthlyROI - costPerMonth;
  const roiMultiplier = Math.round(netMonthlyProfit / costPerMonth);
  const lostMonthlyRevenue = Math.round(currentMissedLeads * conversionRate / 100 * avgJobValue);
  const lostYearlyRevenue = lostMonthlyRevenue * 12;

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246);
    doc.text('Your ROI Analysis Report', 20, 30);
    
    // Company info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Generated by TrainYourAgent AI', 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Business inputs section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Your Business Inputs', 20, 60);
    
    doc.setFontSize(12);
    doc.text(`Industry: ${selectedIndustry.name}`, 30, 70);
    doc.text(`Monthly Leads: ${monthlyLeads}`, 30, 78);
    doc.text(`Conversion Rate: ${conversionRate}%`, 30, 86);
    doc.text(`Average Job Value: $${avgJobValue.toLocaleString()}`, 30, 94);
    
    // Industry-Specific Data Section
    let yPos = 110;
    doc.setFontSize(16);
    doc.text(`${selectedIndustry.name} Industry Data`, 20, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.text(`Based on ${selectedIndustry.source}:`, 25, yPos);
    yPos += 7;
    doc.text(`${selectedIndustry.missedLeadRate}% of leads are typically missed or call after hours`, 30, yPos);
    yPos += 6;
    doc.text(`AI voice agents can recover ${selectedIndustry.recoveryRate}% of missed opportunities`, 30, yPos);
    yPos += 6;
    doc.text(`${selectedIndustry.afterHoursRate}% of calls occur outside standard business hours`, 30, yPos);
    yPos += 6;
    doc.text(`Industry average conversion rate: ${selectedIndustry.avgConversionRate}%`, 30, yPos);
    yPos += 12;
    
    // Results section
    doc.setFontSize(16);
    doc.text('Your ROI Projection', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text(`Recovered Leads per Month: ${recoveredLeads}`, 30, yPos);
    yPos += 8;
    doc.text(`Additional Customers per Month: ${additionalConversions}`, 30, yPos);
    yPos += 8;
    
    // Highlight monthly revenue
    doc.setFillColor(59, 130, 246);
    doc.rect(25, yPos, 160, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(`Monthly Revenue Increase: $${monthlyROI.toLocaleString()}`, 30, yPos + 12);
    yPos += 25;
    
    // Annual projection
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Annual Revenue Increase: $${yearlyROI.toLocaleString()}`, 30, yPos);
    yPos += 8;
    doc.text(`ROI Multiple: ${roiMultiplier}x Return`, 30, yPos);
    yPos += 15;
    
    // Implementation timeline
    doc.setFontSize(16);
    doc.text('Implementation Timeline', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.text('Discovery Call: Day 1 - Understanding your business and requirements', 30, yPos);
    yPos += 8;
    doc.text('Planning Call: Day 2-3 - Review custom timeline and training plan', 30, yPos);
    yPos += 8;
    doc.text('Agent Training: Day 3-5 - Custom configuration for your services', 30, yPos);
    yPos += 8;
    doc.text('Testing & Refinement: Day 4-6 - Quality assurance before launch', 30, yPos);
    yPos += 8;
    doc.text('Go Live: Day 5-7+ - Full deployment with ongoing optimization', 30, yPos);
    yPos += 15;
    
    // Next steps
    doc.setFontSize(16);
    doc.text('Next Steps', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.text('1. Book a free strategy session: cal.com/trainyouragent', 30, yPos);
    yPos += 8;
    doc.text('2. Try our live voice demo: trainyouragentai.com', 30, yPos);
    yPos += 8;
    doc.text('3. Questions? Email: sales@trainyouragent.com', 30, yPos);
    
    // Save PDF
    doc.save(`ROI-Analysis-${industry}-${Date.now()}.pdf`);
  };

  const handleEmailCapture = async () => {
    if (!email || !name) {
      toast.error('Please enter your name and email');
      return;
    }
    
    setIsGeneratingPDF(true);
    
    // Send to Apollo.io for lead nurture
    try {
      const { sendToApollo, getUTMParameters } = await import('@/lib/apollo-integration');
      const utmParams = getUTMParameters();
      
      await sendToApollo({
        name: name.trim(),
        email: email.trim(),
        industry,
        source: 'ROI Calculator PDF Request',
        tags: ['ROI Calculator', 'Lead Magnet', 'Website Lead'],
        notes: `ROI Calculator Results: Monthly ROI: $${monthlyROI.toLocaleString()}, Annual ROI: $${yearlyROI.toLocaleString()}, ROI Multiple: ${roiMultiplier}x`,
        custom_fields: {
          ...utmParams,
          monthly_leads: monthlyLeads,
          conversion_rate: conversionRate,
          avg_job_value: avgJobValue,
          projected_monthly_roi: monthlyROI,
          projected_annual_roi: yearlyROI,
          roi_multiple: roiMultiplier,
          calculator_type: 'roi',
        },
      });
      
      // Track in analytics
      trackEvent('lead_magnet_download', {
        type: 'roi_report',
        industry,
        projected_roi: monthlyROI
      });
      
      // Generate and download PDF
      generatePDF();
      
      toast.success('PDF downloaded! Check your email for follow-up resources.');
      setShowEmailCapture(false);
      setEmail('');
      setName('');
    } catch (error) {
      console.error('Failed to capture email:', error);
      toast.error('Failed to send. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/calculators?industry=${industry}&leads=${monthlyLeads}&conversion=${conversionRate}&jobValue=${avgJobValue}`
    : '';

  const shareOnLinkedIn = () => {
    const text = `I just calculated that AI voice agents could generate $${monthlyROI.toLocaleString()}/month for my ${industry} business. That's a ${roiMultiplier}x return! 🚀`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(text)}`);
    
    trackEvent('social_share', {
      platform: 'linkedin',
      content: 'roi_calculator',
      industry,
      roi_value: monthlyROI
    });
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My AI ROI Analysis',
        text: `Check out my ROI: $${monthlyROI.toLocaleString()}/month with AI voice agents!`,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    }
    
    trackEvent('calculator_share', { industry, method: 'clipboard' });
  };

  return (
    <div id="roi-calculator" className="max-w-6xl mx-auto scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="inline-block mb-4"
        >
          <span className="px-4 py-2 rounded-full glass-card text-sm font-medium shadow-glow-sm">
            <Sparkles className="inline w-4 h-4 mr-2" />
            Calculate Your Returns
          </span>
        </motion.div>
        <h3 className="text-4xl md:text-5xl font-bold mb-4">
          {headlineVariants[headlineVariant].includes('ROI') ? (
            <>ROI <span className="text-gradient">Calculator</span></>
          ) : (
            <span className="text-gradient">{headlineVariants[headlineVariant]}</span>
          )}
        </h3>
        <p className="text-xl text-muted-foreground">
          See how much revenue you're leaving on the table
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Inputs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-8 shadow-dramatic">
            <h4 className="text-xl font-bold mb-6">Your Business Metrics</h4>
            
            {/* Industry Selector */}
            <div className="mb-8 p-4 glass-card rounded-xl">
              <Label className="text-base mb-3 block font-semibold">
                Select Your Industry
              </Label>
              <Select value={industry} onValueChange={handleIndustryChange}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-xl">
                  {industries.map((ind) => (
                    <SelectItem key={ind.id} value={ind.id} className="cursor-pointer">
                      {ind.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-8">
              <div>
                <Label className="text-base mb-3 block font-semibold">
                  Monthly Leads: <span className="text-primary">{monthlyLeads}</span>
                </Label>
                <Slider
                  value={[monthlyLeads]}
                  onValueChange={(v) => setMonthlyLeads(v[0])}
                  min={10}
                  max={500}
                  step={10}
                  className="mb-3"
                />
                <Input
                  type="number"
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                  className="glass-card border-glass-border h-12 text-lg"
                />
              </div>

              <div>
                <Label className="text-base mb-3 block font-semibold">
                  Conversion Rate: <span className="text-primary">{conversionRate}%</span>
                </Label>
                <Slider
                  value={[conversionRate]}
                  onValueChange={(v) => setConversionRate(v[0])}
                  min={1}
                  max={20}
                  step={0.5}
                  className="mb-3"
                />
                <Input
                  type="number"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="glass-card border-glass-border h-12 text-lg"
                />
              </div>

              <div>
                <Label className="text-base mb-3 block font-semibold">
                  Average Job Value: <span className="text-primary">${avgJobValue}</span>
                </Label>
                <Slider
                  value={[avgJobValue]}
                  onValueChange={(v) => setAvgJobValue(v[0])}
                  min={100}
                  max={10000}
                  step={100}
                  className="mb-3"
                />
                <Input
                  type="number"
                  value={avgJobValue}
                  onChange={(e) => setAvgJobValue(Number(e.target.value))}
                  className="glass-card border-glass-border h-12 text-lg"
                />
              </div>

              <MagneticButton onClick={handleCalculate} size="lg" className="w-full gap-2">
                <Sparkles className="w-5 h-5" />
                {ctaVariants[ctaVariant]}
              </MagneticButton>
            </div>
          </GlassCard>
        </motion.div>

        {/* Results */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {isCalculating && (
              <motion.div
                key="calculating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-lg font-medium">Calculating your ROI...</p>
                <p className="text-sm text-muted-foreground">Analyzing industry data</p>
              </motion.div>
            )}

            {showResults && !isCalculating && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Visual Comparison - 3 Columns */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Column 1: WITHOUT AI */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                  >
                    <h4 className="text-sm font-bold text-red-500 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Without AI
                    </h4>
                    
                    <GlassCard className="p-4 border-red-500/20 bg-red-500/5">
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Missed/Month</span>
                          <span className="font-bold text-red-500">{currentMissedLeads}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lost/Month</span>
                          <span className="font-bold text-red-500">${lostMonthlyRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lost/Year</span>
                          <span className="font-bold text-red-500">${lostYearlyRevenue.toLocaleString()}</span>
                        </div>
                        
                        {/* Declining graph */}
                        <div className="pt-3">
                          <div className="h-12 flex items-end gap-0.5">
                            {[100, 85, 70, 55, 40].map((height, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ delay: 0.4 + idx * 0.1 }}
                                className="flex-1 bg-gradient-to-t from-red-500 to-red-300 rounded-t"
                              />
                            ))}
                          </div>
                          <p className="text-[10px] text-center text-red-500 mt-1">Declining</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>

                  {/* Column 2: WITH AI */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                  >
                    <h4 className="text-sm font-bold text-green-500 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      With AI
                    </h4>
                    
                    <GlassCard className="p-4 border-green-500/20 bg-green-500/5">
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Recovered</span>
                          <span className="font-bold text-green-500">+{recoveredLeads}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">New/Month</span>
                          <span className="font-bold text-green-500">+${monthlyROI.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">New/Year</span>
                          <span className="font-bold text-green-500">+${yearlyROI.toLocaleString()}</span>
                        </div>
                        
                        {/* Growing graph */}
                        <div className="pt-3">
                          <div className="h-12 flex items-end gap-0.5">
                            {[40, 55, 70, 85, 100].map((height, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ delay: 0.6 + idx * 0.1 }}
                                className="flex-1 bg-gradient-to-t from-green-500 to-green-300 rounded-t"
                              />
                            ))}
                          </div>
                          <p className="text-[10px] text-center text-green-500 mt-1">Growing</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>

                  {/* Column 3: NET GAIN */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="space-y-3"
                  >
                    <h4 className="text-sm font-bold text-gradient flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Net Gain
                    </h4>
                    
                    <GlassCard className="p-4 border-primary/30 bg-gradient-to-br from-primary/20 to-accent/20 shadow-glow">
                      <div className="space-y-3">
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground mb-1">Monthly Profit</p>
                          <p className="text-2xl font-bold text-gradient">
                            $<AnimatedCounter end={netMonthlyProfit} />
                          </p>
                        </div>
                        
                        <div className="text-center pt-2 border-t border-primary/20">
                          <p className="text-[10px] text-muted-foreground mb-1">ROI Multiple</p>
                          <p className="text-xl font-bold text-primary">
                            <AnimatedCounter end={roiMultiplier} />x
                          </p>
                        </div>
                        
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-center text-2xl"
                        >
                          🎉
                        </motion.div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </div>

                {/* Larger Result Cards */}
                <ResultCard
                  icon={Users}
                  label="Recovered Leads/Month"
                  value={<AnimatedCounter end={recoveredLeads} prefix="+" />}
                  color="text-blue-500"
                  delay={0.8}
                />

                <ResultCard
                  icon={TrendingUp}
                  label="Additional Customers/Month"
                  value={<AnimatedCounter end={additionalConversions} prefix="+" />}
                  color="text-green-500"
                  delay={0.9}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  <GlassCard className="p-8 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 border-2 border-primary/30 shadow-glow hover:shadow-glow transition-all duration-500">
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <DollarSign className="w-8 h-8 text-primary" />
                      </motion.div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Additional Monthly Revenue
                      </span>
                    </div>
                    <div className="text-5xl font-bold text-gradient mb-2">
                      $<AnimatedCounter end={monthlyROI} />
                    </div>
                    <div className="text-lg text-muted-foreground">
                      $<AnimatedCounter end={yearlyROI} />/year
                    </div>
                  </GlassCard>
                </motion.div>

                {/* PDF Report Generation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="mt-6"
                >
                  <GlassCard className="p-6 text-center">
                    <h4 className="text-xl font-bold mb-3">Want Your Personalized Report?</h4>
                    <p className="text-sm text-muted-foreground mb-6">
                      Get a detailed PDF with your ROI analysis, industry benchmarks, and implementation roadmap
                    </p>
                    
                    {!showEmailCapture ? (
                      <div className="space-y-3">
                        <MagneticButton
                          onClick={() => setShowEmailCapture(true)}
                          size="lg"
                          className="gap-2"
                        >
                          <Download className="w-5 h-5" />
                          Email Me This Report
                        </MagneticButton>
                        
                        {/* Social Sharing */}
                        <div className="flex gap-3 justify-center pt-3 border-t border-border/50">
                          <MagneticButton
                            variant="outline"
                            size="sm"
                            onClick={shareOnLinkedIn}
                            className="gap-2"
                          >
                            <Share2 className="w-4 h-4" />
                            Share on LinkedIn
                          </MagneticButton>
                          
                          <MagneticButton
                            variant="outline"
                            size="sm"
                            onClick={shareResults}
                            className="gap-2"
                          >
                            <LinkIcon className="w-4 h-4" />
                            Copy Link
                          </MagneticButton>
                        </div>

                        {/* Timeline Estimator CTA After Results */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mt-6 pt-6 border-t border-border"
                        >
                          <TimelineEstimatorCTA 
                            industryId={industry}
                            variant="inline"
                            location="roi_calculator_results"
                          />
                          <p className="text-xs text-muted-foreground text-center mt-3">
                            Want to know how long implementation takes? Get your personalized timeline.
                          </p>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="max-w-md mx-auto space-y-4">
                        <Input
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-12"
                        />
                        <Input
                          type="email"
                          placeholder="Your Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12"
                        />
                        <MagneticButton
                          onClick={handleEmailCapture}
                          size="lg"
                          className="w-full gap-2"
                          disabled={isGeneratingPDF}
                        >
                          {isGeneratingPDF ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Download className="w-5 h-5" />
                              Generate My Report
                            </>
                          )}
                        </MagneticButton>
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showResults && (
        <>
          {/* Industry-Specific Benchmarks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0 }}
            className="mt-8"
          >
            <GlassCard className="p-6 bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold text-lg">
                  {selectedIndustry.name} Industry Benchmarks
                </h4>
              </div>
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-muted-foreground text-sm mb-1">Missed Lead Rate</div>
                  <div className="text-2xl font-bold text-blue-500">
                    {selectedIndustry.missedLeadRate}%
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm mb-1">AI Recovery Rate</div>
                  <div className="text-2xl font-bold text-blue-500">
                    {selectedIndustry.recoveryRate}%
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm mb-1">After-Hours Calls</div>
                  <div className="text-2xl font-bold text-blue-500">
                    {selectedIndustry.afterHoursRate}%
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm mb-1">Avg Conversion Rate</div>
                  <div className="text-2xl font-bold text-blue-500">
                    {selectedIndustry.avgConversionRate}%
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Based on {selectedIndustry.source}
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 }}
            className="mt-8"
          >
            <ResultsDisclaimer context="roi" variant="compact" />
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ROICalculatorEnhanced;
