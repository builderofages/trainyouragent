import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import NicheLanding from "./pages/NicheLanding";
import AccountingLanding from "./pages/AccountingLanding";
import RoofingLanding from "./pages/RoofingLanding";
import LegalLanding from "./pages/LegalLanding";
import HealthcareLanding from "./pages/HealthcareLanding";
import LogisticsLanding from "./pages/LogisticsLanding";
import RestaurantsLanding from "./pages/RestaurantsLanding";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

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
          <Route path="/accounting" element={<AccountingLanding />} />
          <Route path="/roofing" element={<RoofingLanding />} />
          <Route path="/legal" element={<LegalLanding />} />
          <Route path="/healthcare" element={<HealthcareLanding />} />
          <Route path="/logistics" element={<LogisticsLanding />} />
          <Route path="/restaurants" element={<RestaurantsLanding />} />
          {/* <Route path="/pricing" element={<Pricing />} /> */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/niche/:nicheId" element={<NicheLanding />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
