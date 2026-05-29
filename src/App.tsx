import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Component, lazy, Suspense, useEffect, type ReactNode } from "react";
import { initAttribution } from "@/lib/affiliate";
// v168: lazy-with-auto-reload — wraps every dynamic import so stale chunks
// after a deploy force a hard reload instead of white-screening. THE fix.
import { lazyWithReload } from "@/lib/lazyWithReload";

// Critical / above-the-fold routes — eager.
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Start from "./pages/Start";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import AiChat from "@/components/AiChat";
import ExitIntent from "@/components/ExitIntent";
import LeadMagnetModal from "@/components/LeadMagnetModal";
import CookieConsent from "@/components/CookieConsent";
import { getConsent, onConsentChange } from "@/lib/consent";
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
const Dashboard           = lazyWithReload(() => import("./pages/Dashboard"));
const NicheSiteTemplate   = lazyWithReload(() => import("./pages/NicheSiteTemplate"));
const TemplateGallery     = lazyWithReload(() => import("./pages/admin/TemplateGallery"));
const Websites            = lazyWithReload(() => import("./pages/Websites"));
const Share               = lazyWithReload(() => import("./pages/Share"));
const Cnnct               = lazyWithReload(() => import("./pages/Cnnct"));
const AdminSetup          = lazyWithReload(() => import("./pages/admin/Setup"));
const AdminCockpit        = lazyWithReload(() => import("./pages/admin/Cockpit"));
const HQ                  = lazyWithReload(() => import("./pages/HQ"));
const NicheLanding        = lazyWithReload(() => import("./pages/NicheLanding"));
const Vertical            = lazyWithReload(() => import("./pages/VerticalPage"));
const LocationPage        = lazyWithReload(() => import("./pages/LocationPage"));
const SalesToolkit        = lazyWithReload(() => import("./pages/SalesToolkit"));
const Settings            = lazyWithReload(() => import("./pages/Settings"));
const Resources           = lazyWithReload(() => import("./pages/Resources"));
const ResourceArticle     = lazyWithReload(() => import("./pages/ResourceArticle"));
const Demos               = lazyWithReload(() => import("./pages/Demos"));
const About               = lazyWithReload(() => import("./pages/About"));
const Team                = lazyWithReload(() => import("./pages/Team"));
const Security            = lazyWithReload(() => import("./pages/Security"));
const Technology          = lazyWithReload(() => import("./pages/Technology"));
const ResearchPartners    = lazyWithReload(() => import("./pages/ResearchPartners"));
const Solutions           = lazyWithReload(() => import("./pages/Solutions"));
const Integrations        = lazyWithReload(() => import("./pages/Integrations"));
// v76-D: legacy single-file legal pages (./pages/Privacy.tsx, Terms.tsx,
// CookiePolicy.tsx) are preserved in source for reference but no longer routed
// — the canonical surface is now /legal/*. Legacy URLs redirect via
// LegalRedirect (imported above).

// v76-D: complete legal surface — 11 docs + index, all under /legal/*.
const LegalIndex          = lazyWithReload(() => import("./pages/legal/Index"));
const LegalTerms          = lazyWithReload(() => import("./pages/legal/Terms"));
const LegalPrivacy        = lazyWithReload(() => import("./pages/legal/Privacy"));
const LegalCookies        = lazyWithReload(() => import("./pages/legal/Cookies"));
const LegalDpa            = lazyWithReload(() => import("./pages/legal/Dpa"));
const LegalAup            = lazyWithReload(() => import("./pages/legal/Aup"));
const LegalRefund         = lazyWithReload(() => import("./pages/legal/Refund"));
const LegalAiUse          = lazyWithReload(() => import("./pages/legal/AiUse"));
const LegalSla            = lazyWithReload(() => import("./pages/legal/Sla"));
const LegalSubProcessors  = lazyWithReload(() => import("./pages/legal/SubProcessors"));
const LegalGdpr           = lazyWithReload(() => import("./pages/legal/Gdpr"));
const LegalCcpa           = lazyWithReload(() => import("./pages/legal/Ccpa"));
const Comparisons         = lazyWithReload(() => import("./pages/Comparisons"));
const CaseStudies         = lazyWithReload(() => import("./pages/CaseStudies"));
const DemoRequest         = lazyWithReload(() => import("./pages/DemoRequest"));
const SolutionConfigurator= lazyWithReload(() => import("./pages/SolutionConfigurator"));
const DemoVideo           = lazyWithReload(() => import("./pages/DemoVideo"));
const AgencyPartner       = lazyWithReload(() => import("./pages/AgencyPartner"));
const SolutionDetail      = lazyWithReload(() => import("./pages/SolutionDetail"));
const VersusPage          = lazyWithReload(() => import("./pages/VersusPage"));
const Vs                  = lazyWithReload(() => import("./pages/Vs"));
const Apply               = lazyWithReload(() => import("./pages/Apply"));
const AlternativeFor      = lazyWithReload(() => import("./pages/AlternativeFor"));
const Admin               = lazyWithReload(() => import("./pages/Admin"));

// Blog (lazy)
const BlogIndex      = lazyWithReload(() => import("./pages/blog/BlogIndex"));
const BlogPost       = lazyWithReload(() => import("./pages/blog/BlogPost"));
const BlogCategory   = lazyWithReload(() => import("./pages/blog/BlogCategory"));
const BlogTag        = lazyWithReload(() => import("./pages/blog/BlogTag"));
const Newsletter     = lazyWithReload(() => import("./pages/Newsletter"));

// v34: trust + academy + exit intent
const Learn     = lazyWithReload(() => import("./pages/Learn"));
const Status    = lazyWithReload(() => import("./pages/Status"));
const Careers   = lazyWithReload(() => import("./pages/Careers"));
const Press     = lazyWithReload(() => import("./pages/Press"));

// v38: trust + conversion infrastructure
const Customers        = lazyWithReload(() => import("./pages/Customers"));
const CaseStudyTemplate= lazyWithReload(() => import("@/components/CaseStudyTemplate"));
const Trial            = lazyWithReload(() => import("./pages/Trial"));
const Testimonials     = lazyWithReload(() => import("./pages/Testimonials"));
const Onboarding       = lazyWithReload(() => import("./pages/Onboarding"));

// v41: new pages
const Community         = lazyWithReload(() => import("./pages/Community"));
const Partners          = lazyWithReload(() => import("./pages/Partners"));
const ToolsIndex        = lazyWithReload(() => import("./pages/tools/ToolsIndex"));
const CostEstimator     = lazyWithReload(() => import("./pages/tools/CostEstimator"));
const RoiCalculator     = lazyWithReload(() => import("./pages/tools/RoiCalculator"));
const PromptCritic      = lazyWithReload(() => import("./pages/tools/PromptCritic"));
const ScenarioGenerator = lazyWithReload(() => import("./pages/tools/ScenarioGenerator"));
const LatencySimulator  = lazyWithReload(() => import("./pages/tools/LatencySimulator"));

// v42: live AI demos
const SalesObjectionHandler = lazyWithReload(() => import("./pages/demos/SalesObjectionHandler"));
const SopWriter             = lazyWithReload(() => import("./pages/demos/SopWriter"));
const SeoCluster            = lazyWithReload(() => import("./pages/demos/SeoCluster"));

// v42: lead-magnet report page
const StateOfAiOps2026  = lazyWithReload(() => import("./pages/StateOfAiOps2026"));

// v44: three new tools + public metrics dashboard
const PromptLibrary     = lazyWithReload(() => import("./pages/tools/PromptLibrary"));
const ModelSelector     = lazyWithReload(() => import("./pages/tools/ModelSelector"));
const AutomationRoi     = lazyWithReload(() => import("./pages/tools/AutomationRoi"));
const Metrics           = lazyWithReload(() => import("./pages/Metrics"));

// v47A: trust + authority infrastructure
const Speaking          = lazyWithReload(() => import("./pages/Speaking"));
const PodcastGuest      = lazyWithReload(() => import("./pages/PodcastGuest"));
const Compliance        = lazyWithReload(() => import("./pages/Compliance"));
const Accessibility     = lazyWithReload(() => import("./pages/Accessibility"));
const TrustCenter       = lazyWithReload(() => import("./pages/TrustCenter"));
const Uptime            = lazyWithReload(() => import("./pages/Uptime"));
const MediaKit          = lazyWithReload(() => import("./pages/MediaKit"));

// v47B: programmatic local SEO (30 cities x 4 verticals = 120 pages)
const LocalIndex        = lazyWithReload(() => import("./pages/LocalIndex"));
const LocalPage         = lazyWithReload(() => import("./pages/LocalPage"));

// v48: polished booking page wrapping Cal.com embed
const Book              = lazyWithReload(() => import("./pages/Book"));

// v49: docs, api-docs, mission, invest, affiliate
const DocsPage             = lazyWithReload(() => import("./pages/DocsPage"));
const ApiDocsPage          = lazyWithReload(() => import("./pages/ApiDocsPage"));
const MissionPage          = lazyWithReload(() => import("./pages/MissionPage"));
const InvestPage           = lazyWithReload(() => import("./pages/InvestPage"));
// v80: AffiliateProgramPage import removed — /affiliate-program now
// redirects to /affiliates (the canonical v76-c page).

// v50A: customer portal + public roadmap
// v76-a: customer portal layout + 8 sub-pages (auth-gated)
const PortalLayout         = lazyWithReload(() => import("./components/portal/PortalLayout"));
const PortalLogin          = lazyWithReload(() => import("./pages/portal/Login"));
const PortalAuthCallback   = lazyWithReload(() => import("./pages/portal/AuthCallback"));
const PortalOverview       = lazyWithReload(() => import("./pages/portal/Overview"));
const PortalTrainingProgress = lazyWithReload(() => import("./pages/portal/TrainingProgress"));
const PortalAgentSettings  = lazyWithReload(() => import("./pages/portal/AgentSettings"));
const PortalConversations  = lazyWithReload(() => import("./pages/portal/Conversations"));
const PortalAnalytics      = lazyWithReload(() => import("./pages/portal/Analytics"));
const PortalBilling        = lazyWithReload(() => import("./pages/portal/Billing"));
const PortalDocuments      = lazyWithReload(() => import("./pages/portal/Documents"));
const PortalSupport        = lazyWithReload(() => import("./pages/portal/Support"));
const Roadmap              = lazyWithReload(() => import("./pages/Roadmap"));

// v51B: niche playbook system — /playbooks hub + /playbooks/:slug (15 niches)
const PlaybooksIndex       = lazyWithReload(() => import("./pages/PlaybooksIndex"));
const PlaybookPage         = lazyWithReload(() => import("./pages/PlaybookPage"));

// v52a: free in-browser voice agent demo + branded 500 page
const VoiceDemo            = lazyWithReload(() => import("./pages/VoiceDemo"));
const ServerError          = lazyWithReload(() => import("./pages/ServerError"));

// v52B: vendor matrix + founder log + glossary + whitelabel + reseller + data room
const VendorMatrix         = lazyWithReload(() => import("./pages/tools/VendorMatrix"));
const FounderLog           = lazyWithReload(() => import("./pages/FounderLog"));
const Glossary             = lazyWithReload(() => import("./pages/Glossary"));
const Whitelabel           = lazyWithReload(() => import("./pages/Whitelabel"));
const Reseller             = lazyWithReload(() => import("./pages/Reseller"));
const DataRoom             = lazyWithReload(() => import("./pages/DataRoom"));

// v57A: internal — Resend domain verification helper
const VerifyEmailDomain    = lazyWithReload(() => import("./pages/VerifyEmailDomain"));

// v58: proof reframe — cornerstone trust pages
const Proof                = lazyWithReload(() => import("./pages/Proof"));
const HowWeWin             = lazyWithReload(() => import("./pages/HowWeWin"));

// v59: AI website audit tool + public real-time event stream
const WebsiteAudit         = lazyWithReload(() => import("./pages/tools/WebsiteAudit"));
const AgentBuilder         = lazyWithReload(() => import("./pages/tools/AgentBuilder"));
const Live                 = lazyWithReload(() => import("./pages/Live"));

// v67A: case-study renderer + per-niche /build/{niche} + 3 Groq-powered tools
const CaseStudyDetail        = lazyWithReload(() => import("./pages/CaseStudy"));
const CaseStudiesIndexNew    = lazyWithReload(() => import("./pages/CaseStudiesIndex"));
const BuildLanding           = lazyWithReload(() => import("./pages/BuildLanding"));
const VoiceScriptGenerator   = lazyWithReload(() => import("./pages/tools/VoiceScriptGenerator"));
const ColdDmGenerator        = lazyWithReload(() => import("./pages/tools/ColdDmGenerator"));
const DiagnoseWizard         = lazyWithReload(() => import("./pages/tools/DiagnoseWizard"));

// v71: /hire direct-hire page + /saas product catalog + /saas/agent-builder paid tier
const Hire                   = lazyWithReload(() => import("./pages/Hire"));
const Saas                   = lazyWithReload(() => import("./pages/Saas"));
const SaasAgentBuilder       = lazyWithReload(() => import("./pages/SaasAgentBuilder"));

// v73-FINAL: flagship /train method page + /everything-ai category map +
// 10 cornerstone /capabilities/:slug deep playbook pages.
const Train                  = lazyWithReload(() => import("./pages/Train"));
const EverythingAI           = lazyWithReload(() => import("./pages/EverythingAI"));
const CapabilityDetail       = lazyWithReload(() => import("./pages/CapabilityDetail"));

// v76-c: /train/intake discovery questionnaire + /affiliates landing
const TrainIntake            = lazyWithReload(() => import("./pages/TrainIntake"));
const Affiliates             = lazyWithReload(() => import("./pages/Affiliates"));
const AffiliatesPortal       = lazyWithReload(() => import("./pages/AffiliatesPortal"));

const queryClient = new QueryClient();

// v163: Branded RouteFallback — eliminates the perceived "white screen"
// during React Router lazy-chunk fetch (2-3s gap between click + render).
// Earlier "Loading…" text on white background was indistinguishable from
// a broken page. This version shows a centered brand mark, a name, a
// shimmer progress bar, AND a top-of-page indeterminate progress strip
// so the user knows the click registered and something is happening.
const RouteFallback = () => (
  <>
    {/* Top progress strip — always visible at very top of viewport */}
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "linear-gradient(90deg, transparent 0%, #185FA5 30%, #042C53 60%, #185FA5 80%, transparent 100%)",
        backgroundSize: "200% 100%",
        animation: "tya-loader-strip 1.2s linear infinite",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading next page"
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        background: "#FAFBFC",
        fontFamily: "'Inter Tight', system-ui, sans-serif",
      }}
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 64 64"
        fill="none"
        stroke="#042C53"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animation: "tya-loader-pulse 1.6s ease-in-out infinite" }}
        aria-hidden="true"
      >
        <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
        <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
        <circle cx="32" cy="32" r="3" fill="#042C53" stroke="none" />
      </svg>
      <div style={{ color: "#042C53", fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>
        TrainYourAgent
      </div>
      <div style={{ color: "#6B7B8F", fontSize: 13, letterSpacing: "0.04em" }}>
        Loading next page…
      </div>
      <style>{`
        @keyframes tya-loader-strip {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @keyframes tya-loader-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.92); }
        }
      `}</style>
    </div>
  </>
);

// v163: Route-level error boundary — catches any thrown error inside a
// lazy-loaded route (chunk-load failure, render exception, etc.) and shows
// a branded "let's reload" card instead of a white screen + blank console.
class RouteErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; err?: Error }> {
  constructor(props: { children: ReactNode }) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(err: Error) { return { hasError: true, err }; }
  componentDidCatch(err: Error, info: unknown) {
    // Log to console (Vercel will capture) + best-effort to /api/event
    console.error("[RouteErrorBoundary]", err, info);
    try {
      void fetch("/api/event", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          event_type: "route_render_error",
          source: "error-boundary",
          meta: { message: err.message?.slice(0, 200), path: window.location.pathname },
        }),
        keepalive: true,
      });
    } catch {}
  }
  reset = () => { this.setState({ hasError: false, err: undefined }); window.location.reload(); };
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{
        minHeight: "80vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16,
        background: "#FAFBFC", padding: 24, textAlign: "center",
        fontFamily: "'Inter Tight', system-ui, sans-serif",
      }}>
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none" stroke="#042C53" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
          <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
          <circle cx="32" cy="32" r="3" fill="#042C53" stroke="none" />
        </svg>
        <div style={{ fontSize: 19, fontWeight: 600, color: "#042C53" }}>
          This page hiccupped on the way in.
        </div>
        <div style={{ fontSize: 14, color: "#6B7B8F", maxWidth: 480, lineHeight: 1.5 }}>
          Usually a slow chunk fetch. Hit reload and it'll come up. If it keeps happening, email alexander@trainyouragent.com — we want to fix it.
        </div>
        <button
          onClick={this.reset}
          style={{
            marginTop: 8, padding: "10px 22px", borderRadius: 999,
            background: "#042C53", color: "#fff", fontSize: 14, fontWeight: 600,
            border: "none", cursor: "pointer",
          }}
        >
          Reload this page
        </button>
        <a href="/" style={{ marginTop: 4, fontSize: 12, color: "#185FA5" }}>
          Or back to home →
        </a>
      </div>
    );
  }
}

const App = () => {
  useEffect(() => { initAttribution(); }, []);

  // v229: Hydrate consent mirror onto window so tracking.ts can gate sync.
  // Also subscribe to changes so the next event after Accept-All fires.
  useEffect(() => {
    const apply = (c: ReturnType<typeof getConsent>) => {
      try { (window as any).__TYA_CONSENT__ = c || { essential: true, analytics: false, marketing: false, personalize: false }; } catch {}
    };
    apply(getConsent());
    const unsub = onConsentChange((c) => apply(c));
    return unsub;
  }, []);

  // v229: Global error catcher → POST to /api/log-error so we stop flying blind.
  // Captures uncaught exceptions + unhandled promise rejections. Rate-limited
  // to 5 errors per page-load to avoid spamming the endpoint.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let n = 0;
    const send = (kind: string, msg: string, stack?: string) => {
      if (n++ > 5) return;
      try {
        fetch("/api/log-error", {
          method: "POST",
          headers: { "content-type": "application/json" },
          keepalive: true,
          body: JSON.stringify({ kind, msg, stack: stack?.slice(0, 1800), url: location.href, ua: navigator.userAgent.slice(0, 220), ts: Date.now() }),
        }).catch(() => {});
      } catch {}
    };
    const onErr = (e: ErrorEvent) => send("error", e.message || "unknown", (e.error && e.error.stack) || "");
    const onRej = (e: PromiseRejectionEvent) => send("unhandled-rejection", String((e.reason && (e.reason.message || e.reason)) || "unknown"), e.reason && e.reason.stack);
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRej);
    return () => {
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRej);
    };
  }, []);
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
          <RouteErrorBoundary>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/start" element={<Start />} />
            <Route path="/settings" element={<Settings />} />
            {/* All vertical landing pages route through the unified VerticalPage template */}
            {/* v180: niche "free website" template engine + admin gallery */}
            <Route path="/template/:niche" element={<NicheSiteTemplate />} />
            <Route path="/admin/templates" element={<TemplateGallery />} />
            {/* v209: public, indexable directory of every niche template */}
            <Route path="/websites" element={<Websites />} />
            {/* v213: operator one-click share tool */}
            <Route path="/share" element={<Share />} />
            {/* v203: one-page setup wizard with copy buttons + live health check */}
            <Route path="/admin/setup" element={<AdminSetup />} />
            {/* v231: unified ops cockpit — single pane for everything operational */}
            <Route path="/admin/cockpit" element={<AdminCockpit />} />
            <Route path="/admin/ops" element={<AdminCockpit />} />
            {/* v197: discrete sister-site nod — intentionally NOT in main nav */}
            <Route path="/cnnct" element={<Cnnct />} />
            {/* v181: unified TYA-HQ ops dashboard (overview/leads/sites/outreach/ventures) */}
            <Route path="/hq" element={<HQ />} />
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
          </RouteErrorBoundary>
          </PageTransition>
        </Suspense>
        <AiChat />
        <ExitIntent>
          {({ open, close }) => <LeadMagnetModal open={open} onClose={close} />}
        </ExitIntent>
        <LiveActivity />
        <LiveActivityTicker />
        <TalkToHumanButton />
        {/* v229: GDPR/CCPA cookie consent banner — gates GA4 + Meta Pixel until consent */}
        <CookieConsent />
        </FloatersProvider>
        </VisitorProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
