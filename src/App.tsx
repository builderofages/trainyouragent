import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import NicheLanding from "./pages/NicheLanding";
import Vertical from "./pages/VerticalPage";
import SalesToolkit from "./pages/SalesToolkit";
import Settings from "./pages/Settings";
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
import NotFound from "./pages/NotFound";
import AiChat from "@/components/AiChat";
// v29: Blog + Newsletter
import BlogIndex from "./pages/blog/BlogIndex";
import BlogPost from "./pages/blog/BlogPost";
import BlogCategory from "./pages/blog/BlogCategory";
import BlogTag from "./pages/blog/BlogTag";
import Newsletter from "./pages/Newsletter";

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
          <Route path="/solutions" element={<Vertical />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AiChat />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
