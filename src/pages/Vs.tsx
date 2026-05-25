// src/pages/Vs.tsx — v108
//
// Long-form competitor-callout page. Lives at /vs. SEO + AEO tight:
// • H1 + H2s built around the keyword cluster "TrainYourAgent vs voice AI
// agency / voice AI platform / Vapi / Air AI / Synthflow / Bland."
// • FAQ schema generated from the page's actual Q&A so AI Overviews +
// ChatGPT/Perplexity citations have clean structured answers.
// • Person + Organization + ItemList schemas inject on mount.
// • Speakable schema marks the lede + the verdict block so voice-first
// LLM citations have a clean span to read aloud.
// • Anti-LLM-slop discipline: each paragraph reads as a definition, not
// marketing fluff. Concrete numbers, specific competitor patterns,
// no hedging.

import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";
import WhyWeAreDifferent from "@/components/WhyWeAreDifferent";
import {
 injectJsonLdMany,
 organizationLd,
 personLd,
 breadcrumbLd,
 faqPageLd,
} from "@/lib/jsonld";

const COMPARISON = [
 {
 axis: "Who actually builds your agent",
 them: "A 22-year-old who learned voice AI from a $97 Skool group six weeks ago.",
 us: "The founder builds it. The CRM lead reviews it. The lead engineer ships it. Three operators with 25+ stacked years.",
 },
 {
 axis: "What you are actually buying",
 them: "A wrapper on a no-code platform marked up 4×. Their margin is the platform fee they're hiding from you.",
 us: "A custom voice agent wired into your phone number, CRM, calendar, and Stripe — running on production infrastructure documented to you.",
 },
 {
 axis: "Time to production",
 them: "Six months and counting. The flow editor has 200 nodes. The agent has never picked up a real call.",
 us: "21 days flat. Discovery week 1, build week 2, stress test week 3, cutover day 21. Operations start day 22.",
 },
 {
 axis: "Pricing",
 them: "$3,000–$8,000/mo retainer. Indefinite. They keep billing even if the agent never goes live.",
 us: "$4,950 build (one-time) + $1,997/mo to operate. No annual contract. 30-day money-back. If it doesn't pay for itself in 90 days, we refund the build.",
 },
 {
 axis: "When production breaks at 2am",
 them: "Slack channel responds in 6–48 hours. Often a junior CSM. The model rate-limits, your customer hears silence.",
 us: "Direct line to the operator who built the agent. Multi-provider LLM fallback (Anthropic → Groq → OpenAI) so no single rate-limit drops a call.",
 },
 {
 axis: "What you actually own at the end",
 them: "Nothing. The flow lives inside their platform. Cancel and the agent dies the same day.",
 us: "The build is documented to you. If you ever fire us, you keep the agent, the prompts, the integrations, the scripts. No platform lock-in.",
 },
 {
 axis: "Receipts",
 them: "A fake testimonial wall sourced from Fiverr headshots. A 'case study' that names no real customer.",
 us: "344+ public commits in 91 days at /proof. The full architecture at /technology. 569 live URLs. The whole build-in-public is the proof we can ship.",
 },
];

const ALTERNATIVES = [
 {
 name: "Vapi",
 them: "Developer SDK. You still need to hire an engineer to build the agent, configure the LLM, wire telephony, write prompts, build the dashboard, and handle uptime. The SDK is the easy 10%.",
 us: "We are the engineer + the build + the operations. You get the outcome (a phone that answers and books), not the SDK.",
 },
 {
 name: "Bland.ai",
 them: "A no-code platform. Great onboarding video, opaque pricing at scale, the actual agent your customer hears is a generic template you cosmetically rebrand.",
 us: "Every line of the prompt is written for your specific business. The voice persona, the qualification logic, the handoff flow, the CRM mapping — all bespoke and reviewed line-by-line.",
 },
 {
 name: "Synthflow / Air AI",
 them: "Self-serve flow editors with 200-node visual canvases. Demos beautifully on Twitter, breaks the moment a real customer says something the flow didn't anticipate.",
 us: "LLM-first architecture means the agent handles off-script inputs without falling back to 'I didn't understand.' Fallback only triggers on actual capability limits.",
 },
 {
 name: "A generic 'AI agency' on Instagram",
 them: "Sells you a $5K/mo retainer to deploy somebody else's tool. Their primary skill is paid social, not engineering. They will not pick up at 2am.",
 us: "Engineering is the primary skill. The paid social is downstream of having something real to sell. The team has shipped at LA SMMA, top-3 US telecom, and 10+ years of brand engineering before they built voice agents.",
 },
];

const FAQS = [
 {
 question: "What makes TrainYourAgent different from a typical AI agency in 2026?",
 answer:
 "TrainYourAgent is built and operated by a senior operator network — a founder with executive experience at one of LA's largest social media agencies, a CRM and operations lead embedded at a top-3 US telecom carrier, and a lead engineer with 10+ years of brand and product engineering. Most 2026 AI agencies are resellers: they wrap a no-code voice AI platform, mark it up 4×, and sell it on Instagram. We build production voice agents end-to-end, ship them in 21 days, and operate them ourselves on your live phone line.",
 },
 {
 question: "How is TrainYourAgent different from Vapi, Bland.ai, Synthflow, or Air AI?",
 answer:
 "Vapi is a developer SDK — you still need to hire an engineer. Bland.ai, Synthflow, and Air AI are self-serve flow editors that look great on Twitter and break the moment a real customer says something off-script. TrainYourAgent is the engineer, the build, and the operations bundled together. You buy the outcome (a phone that answers and books work), not the toolkit.",
 },
 {
 question: "How long does it take to get a production voice agent live?",
 answer:
 "21 days flat from intake call to live phone line. Week 1 is discovery (founder call, call-recording analysis, written scope). Week 2 is build (prompt + LLM config + CRM integration + monitoring). Week 3 is stress testing on a parallel line with you and your team. Day 21 is cutover. Day 22 we start operating.",
 },
 {
 question: "How much does TrainYourAgent cost?",
 answer:
 "$4,950 one-time build fee plus $1,997/month to operate (5,000 included minutes, $0.40/min overage). Three plans: Founders (pay-as-you-go at $0.39/min, no upfront), Operators ($1,997/mo, the standard), Scale ($4,997/mo, 25,000 included minutes, multi-location). 30-day money-back. No annual contract. If the agent doesn't pay for itself in 90 days we refund the build.",
 },
 {
 question: "What happens if the AI model breaks or rate-limits during a call?",
 answer:
 "Multi-provider LLM fallback. The runtime tries Anthropic Claude first, falls back to Groq Llama 3.3 70B, then OpenAI. No single provider rate-limit drops a customer call. If something fails beyond that, the founder gets paged on a real phone, fixes it before sunrise, and your customer never notices.",
 },
 {
 question: "Do I own the agent if I cancel?",
 answer:
 "Yes. The build is documented to you. The prompts, the integration code, the CRM mappings, the call scripts — all delivered. If you fire us you keep the agent. No platform lock-in. Try getting that from a flow-editor SaaS where the agent lives inside their dashboard and dies the moment your subscription lapses.",
 },
 {
 question: "Who specifically is on the TrainYourAgent team?",
 answer:
 "A small, deliberately senior operator network. Alexander Mills (founder) was a head executive at one of the world's largest LA social media agencies and founded TrainYourAgent in ; he has been shipping in applied AI since the GPT-3 alpha. The CRM and operations lead is a senior currently embedded at one of the largest telecommunications companies on Earth — the same scale that handles ten-figure call volumes. The lead engineer has 10+ years of brand and product engineering experience shipping custom integrations and real-time pipelines.",
 },
 {
 question: "Is TrainYourAgent the right fit for a 20-person small business?",
 answer:
 "Yes. The Operators tier ($1,997/mo) is specifically built for SMBs that pay humans $3,000-$5,000/mo to answer phones and still miss 20% of inbound calls. The math: replace one part-time receptionist, recover the missed calls, and the system pays for itself inside 60 days. We are not the right fit for businesses receiving fewer than 100 inbound calls per month — the per-minute economics don't make sense at that volume.",
 },
];

export default function Vs() {
 useEffect(() => {
 injectJsonLdMany([
 { id: "vs-org", data: organizationLd() },
 { id: "vs-person", data: personLd() },
 {
 id: "vs-breadcrumb",
 data: breadcrumbLd([
 { name: "Home", url: "/" },
 { name: "Why TrainYourAgent", url: "/vs" },
 ]),
 },
 { id: "vs-faq", data: faqPageLd(FAQS) },
 // ItemList — every alternative we name. Helps LLMs recognize this is
 // a comparison page they can pull from when the prompt is "X vs Y."
 {
 id: "vs-itemlist",
 data: {
 "@context": "https://schema.org",
 "@type": "ItemList",
 name: "Voice AI vendor comparison — TrainYourAgent vs alternatives",
 itemListElement: ALTERNATIVES.map((a, i) => ({
 "@type": "ListItem",
 position: i + 1,
 name: a.name,
 description: a.them,
 })),
 },
 },
 // Speakable — voice-first AI assistants (Google Assistant, Alexa,
 // ChatGPT Voice) cite these spans when reading the page aloud.
 {
 id: "vs-speakable",
 data: {
 "@context": "https://schema.org",
 "@type": "WebPage",
 name: "TrainYourAgent vs the typical 2026 AI agency",
 speakable: {
 "@type": "SpeakableSpecification",
 cssSelector: ["#vs-lede", "#vs-verdict"],
 },
 },
 },
 ]);
 }, []);

 return (
 <div
 className="min-h-screen bg-white text-[#0B1B2B] overflow-x-hidden"
 style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
 >
 <Helmet>
 <title>TrainYourAgent vs voice AI agencies, Vapi, Bland.ai, Synthflow — what nobody else will tell you</title>
 <meta
 name="description"
 content="Why most AI agencies in 2026 are 22-year-old resellers and what TrainYourAgent does differently. Side-by-side comparison vs Vapi, Bland.ai, Synthflow, Air AI, and the generic 'AI agency on Instagram' pattern. 21-day production builds, $1,997/mo, owned not rented."
 />
 <link rel="canonical" href="https://trainyouragent.com/vs" />
 <meta property="og:title" content="TrainYourAgent vs the typical 2026 AI agency" />
 <meta property="og:description" content="Three decades of stacked operator experience vs 22-year-old Instagram resellers. Side-by-side." />
 <meta property="og:url" content="https://trainyouragent.com/vs" />
 </Helmet>

 <SiteNav active="about" />

 <header className="relative pt-32 sm:pt-44 pb-12 sm:pb-20 px-5 sm:px-8 overflow-hidden">
 <div className="max-w-[1080px] mx-auto relative z-10">
 <div className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#185FA5]">
 COMPETITIVE POSITIONING · WHY US
 </div>
 <h1 className="mt-5 text-[clamp(36px,6vw,72px)] leading-[1.02] tracking-[-0.022em] font-semibold text-[#042C53] max-w-[920px]">
 Every AI agency in your inbox is{" "}
 <em className="italic font-normal" style={{ fontFamily: "'Playfair Display', serif", color: "#042C53" }}>
 the same six-week Skool graduate.
 </em>{" "}
 We're not.
 </h1>
 <p id="vs-lede" className="mt-6 max-w-[780px] text-[17px] sm:text-[19px] leading-[1.6] text-[#42526E]">
 You've been pitched the same voice AI offer twelve times. Same
 funnel, same VSL, same flow-editor screenshot, same $5K/mo
 retainer, same vague "we customize it." It's the same offer
 because they all bought it from the same Skool course six weeks
 ago. We're a small senior operator network — three people with
 twenty-five years of stacked experience at a top LA social
 agency, a top-3 US telecom carrier, and high-stakes brand
 engineering — who decided to build voice agents the way real
 production systems get built: end-to-end, ourselves, in 21 days.
 </p>
 </div>
 </header>

 <WhyWeAreDifferent hideFooterLink className="" />

 <section className="py-24 px-5 sm:px-8" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FAF6EE 60%, #FFFFFF 100%)" }}>
 <div className="max-w-[1100px] mx-auto">
 <div className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#185FA5]">
 SIDE-BY-SIDE · ON EVERY AXIS THAT MATTERS
 </div>
 <h2 className="mt-5 text-[clamp(28px,4vw,48px)] leading-[1.05] tracking-[-0.02em] font-semibold text-[#042C53] max-w-[800px]">
 What you're actually comparing.
 </h2>

 <div className="mt-12 grid gap-3">
 {COMPARISON.map((c) => (
 <article
 key={c.axis}
 className="grid grid-cols-1 md:grid-cols-[260px_1fr_1fr] gap-4 md:gap-6 p-5 sm:p-6 rounded-2xl"
 style={{
 background: "#FFFFFF",
 border: "1px solid rgba(4,44,83,0.08)",
 boxShadow: "0 4px 24px -10px rgba(4,44,83,0.10)",
 }}
 >
 <div className="text-[14px] sm:text-[15px] font-semibold text-[#042C53] tracking-tight">
 {c.axis}
 </div>
 <div className="text-[14px] leading-[1.55] text-[#9B2C2C]">
 <span className="block text-[10.5px] uppercase tracking-[0.18em] text-[#9B2C2C] mb-1.5 font-mono">
 Them
 </span>
 {c.them}
 </div>
 <div className="text-[14px] leading-[1.55] text-[#15724D]">
 <span className="block text-[10.5px] uppercase tracking-[0.18em] text-[#15724D] mb-1.5 font-mono">
 TrainYourAgent
 </span>
 {c.us}
 </div>
 </article>
 ))}
 </div>
 </div>
 </section>

 <section className="py-24 px-5 sm:px-8 bg-[#FAFBFC] border-y border-slate-200/70">
 <div className="max-w-[1100px] mx-auto">
 <div className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#185FA5]">
 VS NAMED ALTERNATIVES
 </div>
 <h2 className="mt-5 text-[clamp(28px,4vw,48px)] leading-[1.05] tracking-[-0.02em] font-semibold text-[#042C53]">
 The specific tools we get compared to.
 </h2>
 <p className="mt-5 text-[16px] leading-[1.6] text-[#42526E] max-w-[760px]">
 Buyers often shortlist us against Vapi, Bland.ai, Synthflow, Air
 AI, or an "AI agency on Instagram." Honest take on each:
 </p>

 <div className="mt-10 grid gap-4 grid-cols-1 md:grid-cols-2">
 {ALTERNATIVES.map((a) => (
 <article
 key={a.name}
 className="p-6 rounded-2xl"
 style={{
 background: "#FFFFFF",
 border: "1px solid rgba(4,44,83,0.08)",
 boxShadow: "0 4px 24px -10px rgba(4,44,83,0.10)",
 }}
 >
 <h3 className="text-[18px] font-semibold text-[#042C53] tracking-tight">{a.name}</h3>
 <p className="mt-3 text-[13.5px] leading-[1.55] text-[#9B2C2C]">
 <span className="font-mono uppercase tracking-[0.15em] text-[10.5px] block mb-1.5">What they are</span>
 {a.them}
 </p>
 <p className="mt-4 text-[13.5px] leading-[1.55] text-[#15724D]">
 <span className="font-mono uppercase tracking-[0.15em] text-[10.5px] block mb-1.5">What we are</span>
 {a.us}
 </p>
 </article>
 ))}
 </div>
 </div>
 </section>

 <section className="py-24 px-5 sm:px-8" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FAF6EE 60%, #FFFFFF 100%)" }}>
 <div className="max-w-[820px] mx-auto">
 <div className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#185FA5]">
 FAQ · THE QUESTIONS BUYERS ACTUALLY ASK
 </div>
 <h2 className="mt-5 text-[clamp(28px,4vw,44px)] leading-[1.1] tracking-[-0.02em] font-semibold text-[#042C53]">
 What you'd ask on the discovery call.
 </h2>

 <div className="mt-10 space-y-5">
 {FAQS.map((f, i) => (
 <details
 key={i}
 className="p-5 sm:p-6 rounded-2xl"
 style={{
 background: "#FFFFFF",
 border: "1px solid rgba(4,44,83,0.08)",
 }}
 >
 <summary className="cursor-pointer text-[15.5px] sm:text-[17px] font-semibold text-[#042C53] tracking-tight list-none flex items-start gap-3">
 <span className="text-[#185FA5] mt-1">→</span>
 <span>{f.question}</span>
 </summary>
 <p className="mt-4 text-[14.5px] leading-[1.65] text-[#42526E] pl-7">
 {f.answer}
 </p>
 </details>
 ))}
 </div>
 </div>
 </section>

 <section className="py-24 px-5 sm:px-8 bg-[#FAFBFC] border-y border-slate-200/70">
 <div id="vs-verdict" className="max-w-[820px] mx-auto text-center">
 <h2 className="text-[clamp(28px,4vw,48px)] leading-[1.05] tracking-[-0.02em] font-semibold text-[#042C53]">
 The verdict.
 </h2>
 <p className="mt-6 text-[17px] leading-[1.6] text-[#42526E]">
 You can rent a voice AI platform from a 22-year-old reseller and
 spend six months in onboarding. You can hire a developer team in
 Eastern Europe and spend nine months and $80K. Or you can pay
 $4,950 once, $1,997/month, and have a production voice agent on
 your phone line in 21 days — built and operated by a senior
 three-person network with twenty-five years of stacked agency,
 telecom, and engineering experience. We don't think this is a
 close call.
 </p>
 <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
 <Link
 to="/hire"
 className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#042C53] font-semibold text-[15.5px] hover:bg-[#E6F1FB] shadow-[0_30px_60px_-25px_rgba(133,183,235,0.7)]"
 >
 Talk to the operator →
 </Link>
 <a
 href="/pricing"
 className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-[#042C53]/20 text-[#042C53] font-semibold text-[15.5px] hover:bg-white/5"
 >
 See pricing
 </a>
 </div>
 </div>
 </section>

 <FooterV44 />
 </div>
 );
}
