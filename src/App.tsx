import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import NicheLanding from "./pages/NicheLanding";
// Premium Industry Landing Pages
import AccountingLandingPremium from "./pages/AccountingLandingPremium";
import RoofingLandingPremium from "./pages/RoofingLandingPremium";
import LegalLandingPremium from "./pages/LegalLandingPremium";
import HealthcareLandingPremium from "./pages/HealthcareLandingPremium";
import LogisticsLandingPremium from "./pages/LogisticsLandingPremium";
import RestaurantsLandingPremium from "./pages/RestaurantsLandingPremium";
import BarsNightclubsLandingPremium from "./pages/BarsNightclubsLandingPremium";
import HVACLandingPremium from "./pages/HVACLandingPremium";
import SpasLandingPremium from "./pages/SpasLandingPremium";
import HotelsLandingPremium from "./pages/HotelsLandingPremium";
import AutomotiveLandingPremium from "./pages/AutomotiveLandingPremium";
import RealEstateLandingPremium from "./pages/RealEstateLandingPremium";
import SolarLandingPremium from "./pages/SolarLandingPremium";
import GymLandingPremiumNew from "./pages/GymLandingPremiumNew";
import SalesToolkit from "./pages/SalesToolkit";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Resources from "./pages/Resources";
import ResourceArticle from "./pages/ResourceArticle";
import Demos from "./pages/Demos";
import About from "./pages/About";
import Team from "./pages/Team";
import Security from "./pages/Security";
import Technology from "./pages/Technology";
import ResearchPartners from "./pages/ResearchPartners";
import Solutions from "./pages/Solutions";
import Integrations from "./pages/Integrations";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import CookiePolicy from "./pages/CookiePolicy";
import Comparisons from "./pages/Comparisons";
import CaseStudies from "./pages/CaseStudies";
import DemoRequest from "./pages/DemoRequest";
import SolutionConfigurator from "./pages/SolutionConfigurator";
import Contact from "./pages/Contact";
import DemoVideo from "./pages/DemoVideo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/accounting" element={<AccountingLandingPremium />} />
          <Route path="/roofing" element={<RoofingLandingPremium />} />
          <Route path="/legal" element={<LegalLandingPremium />} />
          <Route path="/healthcare" element={<HealthcareLandingPremium />} />
          <Route path="/logistics" element={<LogisticsLandingPremium />} />
          <Route path="/restaurants" element={<RestaurantsLandingPremium />} />
          <Route path="/bars-nightclubs" element={<BarsNightclubsLandingPremium />} />
          <Route path="/hvac" element={<HVACLandingPremium />} />
          <Route path="/spas" element={<SpasLandingPremium />} />
          <Route path="/hotels" element={<HotelsLandingPremium />} />
          <Route path="/automotive" element={<AutomotiveLandingPremium />} />
          <Route path="/real-estate" element={<RealEstateLandingPremium />} />
          <Route path="/solar" element={<SolarLandingPremium />} />
          <Route path="/gym" element={<GymLandingPremiumNew />} />
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
          <Route path="/solutions" element={<Solutions />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
