import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Critical / above-the-fold routes — eager.
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Start from "./pages/Start";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import AiChat from "@/components/AiChat";
import ExitIntent from "@/components/ExitIntent";
import LeadMagnetModal from "@/components/LeadMagnetModal";
import LiveActivity from "@/components/LiveActivity";

// v41: everything else is lazy-loaded to keep main entry chunk small.
const Dashboard           = lazy(() => import("./pages/Dashboard"));
const NicheLanding        = lazy(() => import("./pages/NicheLanding"));
const Vertical            = lazy(() => import("./pages/VerticalPage"));
const LocationPage        = lazy(() => import("./pages/LocationPage"));
const SalesToolkit        = lazy(() => import("./pages/SalesToolkit"));
const Settings            = lazy(() => import("./pages/Settings"));
const Resources           = lazy(() => import("./pages/Resources"));
const ResourceArticle     = lazy(() => import("./pages/ResourceArticle"));
const Demos               = lazy(() => import("./pages/Demos"));
const About               = lazy(() => import("./pages/About"));
const Team                = lazy(() => import("./pages/Team"));
const Security            = lazy(() => import("./pages/Security"));
const Technology          = lazy(() => import("./pages/Technology"));
const ResearchPartners    = lazy(() => import("./pages/ResearchPartners"));
const Solutions           = lazy(() => import("./pages/Solutions"));
const Integrations        = lazy(() => import("./pages/Integrations"));
const Privacy             = lazy(() => import("./pages/Privacy"));
const Terms               = lazy(() => import("./pages/Terms"));
const CookiePolicy        = lazy(() => import("./pages/CookiePolicy"));
const Comparisons         = lazy(() => import("./pages/Comparisons"));
const CaseStudies         = lazy(() => import("./pages/CaseStudies"));
const DemoRequest         = lazy(() => import("./pages/DemoRequest"));
const SolutionConfigurator= lazy(() => import("./pages/SolutionConfigurator"));
const DemoVideo           = lazy(() => import("./pages/DemoVideo"));
const AgencyPartner       = lazy(() => import("./pages/AgencyPartner"));
const SolutionDetail      = lazy(() => import("./pages/SolutionDetail"));
const VersusPage          = lazy(() => import("./pages/VersusPage"));
const AlternativeFor      = lazy(() => import("./pages/AlternativeFor"));
const Admin               = lazy(() => import("./pages/Admin"));

// Blog (lazy)
const BlogIndex      = lazy(() => import("./pages/blog/BlogIndex"));
const BlogPost       = lazy(() => import("./pages/blog/BlogPost"));
const BlogCategory   = lazy(() => import("./pages/blog/BlogCategory"));
const BlogTag        = lazy(() => import("./pages/blog/BlogTag"));
const Newsletter     = lazy(() => import("./pages/Newsletter"));

// v34: trust + academy + exit intent
const Learn     = lazy(() => import("./pages/Learn"));
const Status    = lazy(() => import("./pages/Status"));
const Careers   = lazy(() => import("./pages/Careers"));
const Press     = lazy(() => import("./pages/Press"));

// v38: trust + conversion infrastructure
const Customers        = lazy(() => import("./pages/Customers"));
const CaseStudyTemplate= lazy(() => import("@/components/CaseStudyTemplate"));
const Trial            = lazy(() => import("./pages/Trial"));
const Testimonials     = lazy(() => import("./pages/Testimonials"));
const Onboarding       = lazy(() => import("./pages/Onboarding"));

// v41: new pages
const Community         = lazy(() => import("./pages/Community"));
const Partners          = lazy(() => import("./pages/Partners"));
const ToolsIndex        = lazy(() => import("./pages/tools/ToolsIndex"));
const CostEstimator     = lazy(() => import("./pages/tools/CostEstimator"));
const RoiCalculator     = lazy(() => import("./pages/tools/RoiCalculator"));
const PromptCritic      = lazy(() => import("./pages/tools/PromptCritic"));
const ScenarioGenerator = lazy(() => import("./pages/tools/ScenarioGenerator"));
const LatencySimulator  = lazy(() => import("./pages/tools/LatencySimulator"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div
    role="status"
    aria-live="polite"
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#185FA5",
      fontFamily: "'Inter Tight', system-ui, sans-serif",
      fontSize: 14,
    }}
  >
    Loading…
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/start" element={<Start />} />
            <Route path="/settings" element={<Settings />} />
            {/* All vertical landing pages route through the unified VerticalPage template */}
            <Route path="/accounting" element={<Vertical />} />
            <Route path="/roofing" element={<Vertical />} />
            <Route path="/legal" element={<Vertical />} />
            <Route path="/healthcare" element={<Vertical />} />
            <Route path="/logistics" element={<Vertical />} />
            <Route path="/bars-nightclubs" element={<Vertical />} />
            <Route path="/hvac" element={<Vertical />} />
            <Route path="/spas" element={<Vertical />} />
            <Route path="/hotels" element={<Vertical />} />
            <Route path="/automotive" element={<Vertical />} />
            <Route path="/real-estate" element={<Vertical />} />
            <Route path="/solar" element={<Vertical />} />
            <Route path="/gym" element={<Vertical />} />
            <Route path="/ecommerce" element={<Vertical />} />
            <Route path="/hospitality" element={<Vertical />} />
            {/* /solutions */}
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/solutions/:slug" element={<SolutionDetail />} />
            <Route path="/agency-partner" element={<AgencyPartner />} />
            <Route path="/vs/:competitor" element={<VersusPage />} />
            <Route path="/alternatives/:slug" element={<AlternativeFor />} />
            <Route path="/admin" element={<Admin />} />
            {/* Supporting pages */}
            <Route path="/sales-toolkit" element={<SalesToolkit />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:slug" element={<ResourceArticle />} />
            <Route path="/demos" element={<Demos />} />
            <Route path="/calculators" element={<Demos />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/security" element={<Security />} />
            <Route path="/technology" element={<Technology />} />
            <Route path="/research" element={<ResearchPartners />} />
            <Route path="/solutions/configurator" element={<SolutionConfigurator />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/comparisons" element={<Comparisons />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/demo-request" element={<DemoRequest />} />
            <Route path="/demo-video" element={<DemoVideo />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/niche/:nicheId" element={<NicheLanding />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* v29: Blog + Newsletter */}
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/category/:category" element={<BlogCategory />} />
            <Route path="/blog/tag/:tag" element={<BlogTag />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/newsletter" element={<Newsletter />} />
            {/* v34: trust + academy */}
            <Route path="/learn" element={<Learn />} />
            <Route path="/status" element={<Status />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            {/* v38: trust + conversion infrastructure */}
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:slug" element={<CaseStudyTemplate />} />
            <Route path="/trial" element={<Trial />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/onboarding" element={<Onboarding />} />
            {/* v41: community + partners + tools */}
            <Route path="/community" element={<Community />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/tools" element={<ToolsIndex />} />
            <Route path="/tools/cost-estimator" element={<CostEstimator />} />
            <Route path="/tools/roi-calculator" element={<RoiCalculator />} />
            <Route path="/tools/prompt-critic" element={<PromptCritic />} />
            <Route path="/tools/scenario-generator" element={<ScenarioGenerator />} />
            <Route path="/tools/latency-simulator" element={<LatencySimulator />} />
            {/* v33a: programmatic SEO — /:vertical/:city */}
            <Route path="/:vertical/:city" element={<LocationPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <AiChat />
        <ExitIntent>
          {({ open, close }) => <LeadMagnetModal open={open} onClose={close} />}
        </ExitIntent>
        <LiveActivity />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
