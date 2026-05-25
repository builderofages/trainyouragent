import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { initAttribution } from "@/lib/affiliate";

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
import LiveActivityTicker from "@/components/LiveActivityTicker";
import PageTransition from "@/components/PageTransition";
import TalkToHumanButton from "@/components/TalkToHumanButton";
// v57A: ensure Meta Pixel base code is mounted client-side (idempotent w/ index.html)
import MetaPixel from "@/components/MetaPixel";
// v53: shared floating-widget mutex + visitor personalization context
import { FloatersProvider } from "@/lib/floaters";
import { VisitorProvider } from "@/lib/visitorContext";
import ContextPill from "@/components/ContextPill";
// v76-D: tiny redirect helper for legacy legal URLs (/privacy, /terms, /cookie-policy → /legal/*)
import LegalRedirect from "@/components/legal/LegalRedirect";

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
// v76-D: legacy single-file legal pages (./pages/Privacy.tsx, Terms.tsx,
// CookiePolicy.tsx) are preserved in source for reference but no longer routed
// — the canonical surface is now /legal/*. Legacy URLs redirect via
// LegalRedirect (imported above).

// v76-D: complete legal surface — 11 docs + index, all under /legal/*.
const LegalIndex          = lazy(() => import("./pages/legal/Index"));
const LegalTerms          = lazy(() => import("./pages/legal/Terms"));
const LegalPrivacy        = lazy(() => import("./pages/legal/Privacy"));
const LegalCookies        = lazy(() => import("./pages/legal/Cookies"));
const LegalDpa            = lazy(() => import("./pages/legal/Dpa"));
const LegalAup            = lazy(() => import("./pages/legal/Aup"));
const LegalRefund         = lazy(() => import("./pages/legal/Refund"));
const LegalAiUse          = lazy(() => import("./pages/legal/AiUse"));
const LegalSla            = lazy(() => import("./pages/legal/Sla"));
const LegalSubProcessors  = lazy(() => import("./pages/legal/SubProcessors"));
const LegalGdpr           = lazy(() => import("./pages/legal/Gdpr"));
const LegalCcpa           = lazy(() => import("./pages/legal/Ccpa"));
const Comparisons         = lazy(() => import("./pages/Comparisons"));
const CaseStudies         = lazy(() => import("./pages/CaseStudies"));
const DemoRequest         = lazy(() => import("./pages/DemoRequest"));
const SolutionConfigurator= lazy(() => import("./pages/SolutionConfigurator"));
const DemoVideo           = lazy(() => import("./pages/DemoVideo"));
const AgencyPartner       = lazy(() => import("./pages/AgencyPartner"));
const SolutionDetail      = lazy(() => import("./pages/SolutionDetail"));
const VersusPage          = lazy(() => import("./pages/VersusPage"));
const Vs                  = lazy(() => import("./pages/Vs"));
const Apply               = lazy(() => import("./pages/Apply"));
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

// v42: live AI demos
const SalesObjectionHandler = lazy(() => import("./pages/demos/SalesObjectionHandler"));
const SopWriter             = lazy(() => import("./pages/demos/SopWriter"));
const SeoCluster            = lazy(() => import("./pages/demos/SeoCluster"));

// v42: lead-magnet report page
const StateOfAiOps2026  = lazy(() => import("./pages/StateOfAiOps2026"));

// v44: three new tools + public metrics dashboard
const PromptLibrary     = lazy(() => import("./pages/tools/PromptLibrary"));
const ModelSelector     = lazy(() => import("./pages/tools/ModelSelector"));
const AutomationRoi     = lazy(() => import("./pages/tools/AutomationRoi"));
const Metrics           = lazy(() => import("./pages/Metrics"));

// v47A: trust + authority infrastructure
const Speaking          = lazy(() => import("./pages/Speaking"));
const PodcastGuest      = lazy(() => import("./pages/PodcastGuest"));
const Compliance        = lazy(() => import("./pages/Compliance"));
const Accessibility     = lazy(() => import("./pages/Accessibility"));
const TrustCenter       = lazy(() => import("./pages/TrustCenter"));
const Uptime            = lazy(() => import("./pages/Uptime"));
const MediaKit          = lazy(() => import("./pages/MediaKit"));

// v47B: programmatic local SEO (30 cities x 4 verticals = 120 pages)
const LocalIndex        = lazy(() => import("./pages/LocalIndex"));
const LocalPage         = lazy(() => import("./pages/LocalPage"));

// v48: polished booking page wrapping Cal.com embed
const Book              = lazy(() => import("./pages/Book"));

// v49: docs, api-docs, mission, invest, affiliate
const DocsPage             = lazy(() => import("./pages/DocsPage"));
const ApiDocsPage          = lazy(() => import("./pages/ApiDocsPage"));
const MissionPage          = lazy(() => import("./pages/MissionPage"));
const InvestPage           = lazy(() => import("./pages/InvestPage"));
// v80: AffiliateProgramPage import removed — /affiliate-program now
// redirects to /affiliates (the canonical v76-c page).

// v50A: customer portal + public roadmap
// v76-a: customer portal layout + 8 sub-pages (auth-gated)
const PortalLayout         = lazy(() => import("./components/portal/PortalLayout"));
const PortalLogin          = lazy(() => import("./pages/portal/Login"));
const PortalAuthCallback   = lazy(() => import("./pages/portal/AuthCallback"));
const PortalOverview       = lazy(() => import("./pages/portal/Overview"));
const PortalTrainingProgress = lazy(() => import("./pages/portal/TrainingProgress"));
const PortalAgentSettings  = lazy(() => import("./pages/portal/AgentSettings"));
const PortalConversations  = lazy(() => import("./pages/portal/Conversations"));
const PortalAnalytics      = lazy(() => import("./pages/portal/Analytics"));
const PortalBilling        = lazy(() => import("./pages/portal/Billing"));
const PortalDocuments      = lazy(() => import("./pages/portal/Documents"));
const PortalSupport        = lazy(() => import("./pages/portal/Support"));
const Roadmap              = lazy(() => import("./pages/Roadmap"));

// v51B: niche playbook system — /playbooks hub + /playbooks/:slug (15 niches)
const PlaybooksIndex       = lazy(() => import("./pages/PlaybooksIndex"));
const PlaybookPage         = lazy(() => import("./pages/PlaybookPage"));

// v52a: free in-browser voice agent demo + branded 500 page
const VoiceDemo            = lazy(() => import("./pages/VoiceDemo"));
const ServerError          = lazy(() => import("./pages/ServerError"));

// v52B: vendor matrix + founder log + glossary + whitelabel + reseller + data room
const VendorMatrix         = lazy(() => import("./pages/tools/VendorMatrix"));
const FounderLog           = lazy(() => import("./pages/FounderLog"));
const Glossary             = lazy(() => import("./pages/Glossary"));
const Whitelabel           = lazy(() => import("./pages/Whitelabel"));
const Reseller             = lazy(() => import("./pages/Reseller"));
const DataRoom             = lazy(() => import("./pages/DataRoom"));

// v57A: internal — Resend domain verification helper
const VerifyEmailDomain    = lazy(() => import("./pages/VerifyEmailDomain"));

// v58: proof reframe — cornerstone trust pages
const Proof                = lazy(() => import("./pages/Proof"));
const HowWeWin             = lazy(() => import("./pages/HowWeWin"));

// v59: AI website audit tool + public real-time event stream
const WebsiteAudit         = lazy(() => import("./pages/tools/WebsiteAudit"));
const AgentBuilder         = lazy(() => import("./pages/tools/AgentBuilder"));
const Live                 = lazy(() => import("./pages/Live"));

// v67A: case-study renderer + per-niche /build/{niche} + 3 Groq-powered tools
const CaseStudyDetail        = lazy(() => import("./pages/CaseStudy"));
const CaseStudiesIndexNew    = lazy(() => import("./pages/CaseStudiesIndex"));
const BuildLanding           = lazy(() => import("./pages/BuildLanding"));
const VoiceScriptGenerator   = lazy(() => import("./pages/tools/VoiceScriptGenerator"));
const ColdDmGenerator        = lazy(() => import("./pages/tools/ColdDmGenerator"));
const DiagnoseWizard         = lazy(() => import("./pages/tools/DiagnoseWizard"));

// v71: /hire direct-hire page + /saas product catalog + /saas/agent-builder paid tier
const Hire                   = lazy(() => import("./pages/Hire"));
const Saas                   = lazy(() => import("./pages/Saas"));
const SaasAgentBuilder       = lazy(() => import("./pages/SaasAgentBuilder"));

// v73-FINAL: flagship /train method page + /everything-ai category map +
// 10 cornerstone /capabilities/:slug deep playbook pages.
const Train                  = lazy(() => import("./pages/Train"));
const EverythingAI           = lazy(() => import("./pages/EverythingAI"));
const CapabilityDetail       = lazy(() => import("./pages/CapabilityDetail"));

// v76-c: /train/intake discovery questionnaire + /affiliates landing
const TrainIntake            = lazy(() => import("./pages/TrainIntake"));
const Affiliates             = lazy(() => import("./pages/Affiliates"));
const AffiliatesPortal       = lazy(() => import("./pages/AffiliatesPortal"));

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

const App = () => {
  useEffect(() => { initAttribution(); }, []);
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <VisitorProvider>
        <FloatersProvider>
        <MetaPixel />
        <ContextPill />
        <Suspense fallback={<RouteFallback />}>
          <PageTransition>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/start" element={<Start />} />
            <Route path="/settings" element={<Settings />} />
            {/* All vertical landing pages route through the unified VerticalPage template */}
            <Route path="/accounting" element={<Vertical />} />
            <Route path="/roofing" element={<Vertical />} />
            {/* v76-D: /legal is now the legal-document index. The legal-services
                vertical lives at /legal-services (VerticalPage normalizes the
                path back to /legal for content lookup). */}
            <Route path="/legal-services" element={<Vertical />} />
            <Route path="/healthcare" element={<Vertical />} />
            <Route path="/logistics" element={<Vertical />} />
            <Route path="/bars-nightclubs" element={<Vertical />} />
            <Route path="/bars" element={<Navigate to="/bars-nightclubs" replace />} />
            <Route path="/hvac" element={<Vertical />} />
            <Route path="/spas" element={<Vertical />} />
            <Route path="/hotels" element={<Vertical />} />
            <Route path="/automotive" element={<Vertical />} />
            <Route path="/real-estate" element={<Vertical />} />
            <Route path="/realestate" element={<Navigate to="/real-estate" replace />} />
            <Route path="/solar" element={<Vertical />} />
            <Route path="/gym" element={<Vertical />} />
            <Route path="/gyms" element={<Navigate to="/gym" replace />} />
            <Route path="/property-mgmt" element={<Navigate to="/property-management" replace />} />
            <Route path="/ecommerce" element={<Vertical />} />
            <Route path="/hospitality" element={<Vertical />} />
            {/* v96: 6 missing industry routes audit found returning 404
                despite being linked from NicheDirectory, PathwayRouter,
                Start, and searchIndex. All route through VerticalPage
                which falls back to a generic-but-on-brand layout when
                config data isn't present. */}
            <Route path="/restaurants" element={<Vertical />} />
            <Route path="/plumbing" element={<Vertical />} />
            <Route path="/electrical" element={<Vertical />} />
            <Route path="/landscaping" element={<Vertical />} />
            <Route path="/property-management" element={<Vertical />} />
            <Route path="/pest-control" element={<Vertical />} />
            {/* /solutions */}
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/solutions/:slug" element={<SolutionDetail />} />
            <Route path="/agency-partner" element={<AgencyPartner />} />
            <Route path="/vs" element={<Vs />} />
            <Route path="/apply" element={<Apply />} />
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
            {/* v76-D: legacy legal URLs — client-side redirect to the new
                canonical paths under /legal/*. The page components remain in
                src/pages/ for reference but are no longer routed. */}
            <Route path="/privacy" element={<LegalRedirect to="/legal/privacy" />} />
            <Route path="/terms" element={<LegalRedirect to="/legal/terms" />} />
            <Route path="/cookie-policy" element={<LegalRedirect to="/legal/cookies" />} />
            <Route path="/cookies" element={<LegalRedirect to="/legal/cookies" />} />
            <Route path="/dpa" element={<LegalRedirect to="/legal/dpa" />} />
            {/* v76-D: complete /legal/* surface. */}
            <Route path="/legal" element={<LegalIndex />} />
            <Route path="/legal/terms" element={<LegalTerms />} />
            <Route path="/legal/privacy" element={<LegalPrivacy />} />
            <Route path="/legal/cookies" element={<LegalCookies />} />
            <Route path="/legal/dpa" element={<LegalDpa />} />
            <Route path="/legal/aup" element={<LegalAup />} />
            <Route path="/legal/refund" element={<LegalRefund />} />
            <Route path="/legal/ai-use" element={<LegalAiUse />} />
            <Route path="/legal/sla" element={<LegalSla />} />
            <Route path="/legal/sub-processors" element={<LegalSubProcessors />} />
            <Route path="/legal/gdpr" element={<LegalGdpr />} />
            <Route path="/legal/ccpa" element={<LegalCcpa />} />
            <Route path="/comparisons" element={<Comparisons />} />
            {/* v67A: replaced hand-coded CaseStudies with JSON-driven index;
                 the old page is preserved at /case-studies-legacy for fallback. */}
            <Route path="/case-studies" element={<CaseStudiesIndexNew />} />
            <Route path="/case-studies-legacy" element={<CaseStudies />} />
            <Route path="/case-study/:slug" element={<CaseStudyDetail />} />
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
            {/* v44: three new client-side tools */}
            <Route path="/tools/prompt-library" element={<PromptLibrary />} />
            <Route path="/tools/model-selector" element={<ModelSelector />} />
            <Route path="/tools/automation-roi" element={<AutomationRoi />} />
            {/* v44: public metrics — built-in-public */}
            {/* v159: /metrics gated — pre-revenue "2 leads, 0 purchases"
                publicly displayed kills SMB buyer trust. Hormozi audit.
                Founder-only view moved to /admin/metrics. Public /metrics
                redirects to /proof which highlights demos + capabilities. */}
            <Route path="/metrics" element={<Navigate to="/proof" replace />} />
            <Route path="/admin/metrics" element={<Metrics />} />
            {/* v42: live AI demos */}
            <Route path="/demos/sales-objection-handler" element={<SalesObjectionHandler />} />
            <Route path="/demos/sop-writer" element={<SopWriter />} />
            <Route path="/demos/seo-cluster" element={<SeoCluster />} />
            {/* v42: report (lead magnet) */}
            <Route path="/report/state-of-ai-ops-2026" element={<StateOfAiOps2026 />} />
            {/* v47A: trust + authority infrastructure */}
            <Route path="/speaking" element={<Speaking />} />
            <Route path="/podcast-guest" element={<PodcastGuest />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/trust-center" element={<TrustCenter />} />
            <Route path="/uptime" element={<Uptime />} />
            <Route path="/media-kit" element={<MediaKit />} />
            {/* v47B: programmatic local SEO — /local hub + /local/:citySlug/:verticalSlug */}
            <Route path="/local" element={<LocalIndex />} />
            <Route path="/local/:citySlug/:verticalSlug" element={<LocalPage />} />
            {/* v48: dedicated booking page */}
            <Route path="/book" element={<Book />} />
            {/* v49: docs, api-docs, mission, invest, affiliate */}
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/docs/:slug" element={<DocsPage />} />
            <Route path="/api-docs" element={<ApiDocsPage />} />
            <Route path="/mission" element={<MissionPage />} />
            <Route path="/invest" element={<InvestPage />} />
            {/* v80: legacy /affiliate-program redirects to canonical /affiliates
                (the v76-c page). Keeps inbound links and old indexed URLs alive
                while consolidating two competing affiliate pages into one. */}
            <Route path="/affiliate-program" element={<Navigate to="/affiliates" replace />} />

            {/* v50A: customer portal + public roadmap */}
            {/* v76-a: customer portal */}
            <Route path="/portal/login" element={<PortalLogin />} />
            <Route path="/portal/auth-callback" element={<PortalAuthCallback />} />
            <Route path="/portal" element={<PortalLayout />}>
              <Route index element={<PortalOverview />} />
              <Route path="training" element={<PortalTrainingProgress />} />
              <Route path="agent" element={<PortalAgentSettings />} />
              <Route path="conversations" element={<PortalConversations />} />
              <Route path="analytics" element={<PortalAnalytics />} />
              <Route path="billing" element={<PortalBilling />} />
              <Route path="documents" element={<PortalDocuments />} />
              <Route path="support" element={<PortalSupport />} />
            </Route>
            <Route path="/roadmap" element={<Roadmap />} />
            {/* v51B: niche playbook system — /playbooks hub + 15 niche playbooks */}
            <Route path="/playbooks" element={<PlaybooksIndex />} />
            <Route path="/playbooks/:slug" element={<PlaybookPage />} />
            {/* v52a: free voice agent demo + branded 500 page */}
            <Route path="/voice-demo" element={<VoiceDemo />} />
            <Route path="/500" element={<ServerError />} />
            {/* v52B: vendor matrix + founder log + glossary + whitelabel + reseller + data room */}
            <Route path="/tools/vendor-matrix" element={<VendorMatrix />} />
            <Route path="/founder-log" element={<FounderLog />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/whitelabel" element={<Whitelabel />} />
            <Route path="/reseller" element={<Reseller />} />
            <Route path="/data-room" element={<DataRoom />} />
            {/* v57A: internal — Resend domain verification helper */}
            <Route path="/verify-email-domain" element={<VerifyEmailDomain />} />
            {/* v58: proof reframe — cornerstone trust pages */}
            <Route path="/proof" element={<Proof />} />
            <Route path="/how-we-win-without-testimonials" element={<HowWeWin />} />
            {/* v59: AI website audit + live public event stream */}
            <Route path="/tools/website-audit" element={<WebsiteAudit />} />
            <Route path="/tools/agent-builder" element={<AgentBuilder />} />
            <Route path="/live" element={<Live />} />
            {/* v67A: 3 new Groq-powered free tools */}
            <Route path="/tools/voice-script-generator" element={<VoiceScriptGenerator />} />
            <Route path="/tools/cold-dm-generator" element={<ColdDmGenerator />} />
            <Route path="/tools/diagnose" element={<DiagnoseWizard />} />
            {/* v67A: per-niche conversion landing pages — MUST come before
                 /:vertical/:city catchall or it will be swallowed. */}
            <Route path="/build/:niche" element={<BuildLanding />} />
            {/* v71: hire-the-operator page + SaaS product catalog + paid agent builder */}
            <Route path="/hire" element={<Hire />} />
            <Route path="/saas" element={<Saas />} />
            <Route path="/saas/agent-builder" element={<SaasAgentBuilder />} />
            {/* v148: bounce stale /saas-agent + /changelog hits to canonical
                routes. /saas-agent was 404'ing for bots / old marketing
                material. /changelog was referenced in LiveKpiStrip with no
                Route registered. */}
            <Route path="/saas-agent" element={<Navigate to="/saas/agent-builder" replace />} />
            <Route path="/changelog" element={<Navigate to="/roadmap" replace />} />
            {/* v73-FINAL: flagship /train method + /everything-ai category map +
                 10 cornerstone capability playbooks at /capabilities/:slug */}
            <Route path="/train" element={<Train />} />
            <Route path="/train/intake" element={<TrainIntake />} />
            <Route path="/everything-ai" element={<EverythingAI />} />
            <Route path="/capabilities/:slug" element={<CapabilityDetail />} />
            {/* v76-c: /affiliates landing + portal stub */}
            <Route path="/affiliates" element={<Affiliates />} />
            <Route path="/affiliates/portal" element={<AffiliatesPortal />} />
            {/* v33a: programmatic SEO — /:vertical/:city */}
            <Route path="/:vertical/:city" element={<LocationPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </PageTransition>
        </Suspense>
        <AiChat />
        <ExitIntent>
          {({ open, close }) => <LeadMagnetModal open={open} onClose={close} />}
        </ExitIntent>
        <LiveActivity />
        <LiveActivityTicker />
        <TalkToHumanButton />
        </FloatersProvider>
        </VisitorProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
