import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
// v38: trust signals
import BuiltInPublic from "@/components/BuiltInPublic";
import FounderBlock from "@/components/FounderBlock"; // v161
import ShipsCounter from "@/components/ShipsCounter";
// v166: LocalBusiness JSON-LD for Tampa SEO + aggregate rating placeholder
import { injectJsonLd, localBusinessLd, aggregateRatingLd } from "@/lib/jsonld";

const CAL_URL = "https://cal.com/trainyouragent/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/agentmills/";

function BrainLogo({ size = 40 }: { size?: number }) {
 return (
 <span className="inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, color: "#042C53" }} aria-hidden="true">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden="true">
 <g strokeWidth="4">
 <path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" />
 </g>
 <g strokeWidth="2.4">
 <path d="M 32 6 L 32 58" />
 <path d="M 6 32 L 58 32" />
 </g>
 <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
 </svg>
 </span>
 );
}

const About = () => {
 const [navScrolled, setNavScrolled] = useState(false);
 const [mobileOpen, setMobileOpen] = useState(false);

 useEffect(() => {
 const onScroll = () => setNavScrolled(window.scrollY > 20);
 window.addEventListener("scroll", onScroll);
 return () => window.removeEventListener("scroll", onScroll);
 }, []);

 useEffect(() => {
 if (typeof document === "undefined") return;
 if (!document.getElementById("tya-fonts")) {
 const l = document.createElement("link");
 l.id = "tya-fonts";
 l.rel = "stylesheet";
 l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter+Tight:wght@400;500;600;700&display=swap";
 document.head.appendChild(l);
 }
 document.title = "About — TrainYourAgent";

 // v33a: Person + Organization schema for About page.
 const id = "tya-schema-about";
 document.getElementById(id)?.remove();
 const s = document.createElement("script");
 s.id = id;
 s.type = "application/ld+json";
 s.textContent = JSON.stringify({
 "@context": "https://schema.org",
 "@graph": [
 {
 "@type": "Person",
 "@id": "https://trainyouragent.com/about#alexander-mills",
 name: "Alexander Mills",
 jobTitle: "Founder",
 url: "https://trainyouragent.com/about",
 sameAs: [
 "https://www.linkedin.com/in/agentmills/",
 ],
 worksFor: { "@id": "https://trainyouragent.com/#org" },
 address: {
 "@type": "PostalAddress",
 addressLocality: "Tampa Bay",
 addressRegion: "FL",
 addressCountry: "US",
 },
 },
 {
 "@type": "AboutPage",
 "@id": "https://trainyouragent.com/about#page",
 url: "https://trainyouragent.com/about",
 name: "About — TrainYourAgent",
 isPartOf: { "@id": "https://trainyouragent.com/#website" },
 about: { "@id": "https://trainyouragent.com/about#alexander-mills" },
 publisher: { "@id": "https://trainyouragent.com/#org" },
 },
 ],
 });
 document.head.appendChild(s);
 // v166: LocalBusiness JSON-LD for Tampa local SEO + AggregateRating placeholder
 injectJsonLd("about-local-business", localBusinessLd({ areaServed: "United States" }));
 injectJsonLd("about-aggregate-rating", aggregateRatingLd());
 return () => {
   document.getElementById(id)?.remove();
   document.getElementById("tya-jsonld-about-local-business")?.remove();
   document.getElementById("tya-jsonld-about-aggregate-rating")?.remove();
 };
 }, []);

 return (
 <div className="min-h-screen bg-[#FAFBFC] text-[#042C53] antialiased selection:bg-[#185FA5] selection:text-white overflow-x-hidden"
 style={{ fontFamily: "'Inter Tight', 'Inter', system-ui, -apple-system, sans-serif" }}>

 {/* NAV — canonical service nav */}
 <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#042C53] focus:text-white focus:font-semibold focus:shadow-lg">Skip to main content</a>
 <SiteNav active="about" />
 <span id="main" tabIndex={-1} aria-hidden="true" />

 <main>
 <header className="pt-40 pb-16 relative overflow-hidden">
 <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(900px 500px at 80% -10%, rgba(133,183,235,0.25), transparent 60%)" }} />
 <div className="max-w-[900px] mx-auto px-6 relative">
 <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-4">About</div>
 <h1 className="text-[clamp(42px,6.5vw,96px)] leading-[1] tracking-[-0.025em] mb-8" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
 We build AI <em className="italic font-normal" style={{ color: "#185FA5" }}>that actually runs</em> your phones.
 </h1>
 <p className="text-slate-600 text-[19px] leading-relaxed max-w-2xl">
 Not another demo. Not another platform you have to wire up yourself. One operator who designs, trains, deploys and operates voice and chat agents on your live phone line — in days, not quarters. Direct line to me. No SDR, no account manager, no delivery team between you and the build.
 </p>
 </div>
 </header>

 <section className="py-20 bg-white border-y border-slate-200">
 <div className="max-w-[900px] mx-auto px-6">
 <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-4">Why this exists</div>
 <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.025em] mb-8" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
 The gap between <em className="italic font-normal" style={{ color: "#185FA5" }}>AI demo</em> and AI that runs your business.
 </h2>
 <div className="text-[#042C53] text-[17px] leading-[1.7] space-y-5">
 <p>I watched the same pattern play out a hundred times. A roofing company, an HVAC outfit, a clinic, a law firm sees a voice-AI demo at a conference. The demo is beautiful. They sign up. They open the platform. They see a flow editor with 200 nodes, settings tabs, webhooks, prompt engineering, a documentation site, and a Slack support channel. Six months later the agent never went live.</p>
 <p>The product gap isn't capability. The models are good enough. The product gap is <em>labor.</em> Building, training, monitoring and refreshing a production voice agent is a real engineering job, not a no-code project. Regional service businesses don't have an AI team. They have a phone line that rings.</p>
 <p>TrainYourAgent exists to close that gap. I am the engineer you'd hire if hiring one was actually possible — except I charge a monthly retainer instead of an FTE salary, and the engagement starts shipping in week one.</p>
 </div>
 </div>
 </section>

 <section className="py-20">
 <div className="max-w-[900px] mx-auto px-6">
 <div className="text-[11px] tracking-[0.2em] uppercase text-[#185FA5] font-mono mb-4">How we work</div>
 <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.025em] mb-10" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
 Five steps. <em className="italic font-normal" style={{ color: "#185FA5" }}>One operator. No layers.</em>
 </h2>
 <div className="space-y-8">
 {[
 { k: "01", t: "Discovery", b: "30 minutes with the founder. We listen to call recordings if you have them, look at your call flow, and write the scope back to you in writing the same day." },
 { k: "02", t: "Build", b: "We script the agent, configure the model, wire CRM and calendar integrations, and stand up monitoring. You see drafts the same week." },
 { k: "03", t: "Stress test", b: "You and your team call in. I watch transcripts in real time and turn every failure case into a permanent guardrail." },
 { k: "04", t: "Cutover", b: "Number port or SIP redirect. The agent goes live on your real phone line. You get a dashboard for every call, transcript, and booking." },
 { k: "05", t: "Run", b: "Weekly model refresh, monthly review with the founder, no account-manager layer. The number of people between you and the build is one." },
 ].map((s) => (
 <div key={s.k} className="grid grid-cols-[60px,1fr] gap-6 items-start">
 <div className="text-[#185FA5] font-mono text-[13px] tracking-wide pt-1">{s.k}</div>
 <div>
 <h3 className="text-[22px] tracking-tight mb-2 font-medium">{s.t}</h3>
 <p className="text-slate-600 text-[16px] leading-relaxed">{s.b}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* v161: founder block — shared component used here AND under the
 homepage hero so the bio + credentials live in one place. */}
 <FounderBlock variant="page" />
 <section className="px-6 py-8 max-w-[1080px] mx-auto">
 <ShipsCounter variant="hero" />
 </section>

 {/* v38: built-in-public timeline pulled live from GitHub */}
 <BuiltInPublic
 className="bg-white border-b border-slate-200"
 title="What we shipped this week."
 eyebrow="Built in public"
 />

 <section className="py-24 relative overflow-hidden">
 <div className="absolute inset-0" style={{ background: "radial-gradient(800px 400px at 50% 50%, rgba(133,183,235,0.4), transparent 65%)" }} />
 <div className="max-w-[900px] mx-auto px-6 text-center relative">
 <h2 className="text-[clamp(36px,5vw,72px)] leading-[1.02] tracking-[-0.025em] mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
 Want to <em className="italic font-normal" style={{ color: "#185FA5" }}>see it?</em>
 </h2>
 <p className="text-slate-600 text-[18px] max-w-xl mx-auto mb-10 leading-relaxed">30-minute discovery call. We figure out what's worth automating, what isn't, and a real timeline — before you spend a dollar.</p>
 <a href={CAL_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-8 py-4 text-[15px] font-semibold text-white bg-[#185FA5] hover:bg-[#0C447C] transition rounded-full shadow-[0_18px_50px_-12px_rgba(24,95,165,0.55)]">
 Book on Cal.com →
 </a>
 </div>
 </section>
 </main>

 <footer className="py-14 bg-[#FAFBFC] border-t border-slate-200">
 <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
 <Link to="/" className="flex items-center gap-3">
 <BrainLogo size={36} />
 <div>
 <div className="text-[15px] font-semibold tracking-tight text-[#042C53]">TrainYourAgent</div>
 <div className="text-slate-600 text-[12px]">AI that thinks like your business. Tampa Bay, FL.</div>
 </div>
 </Link>
 <div className="flex gap-6 text-[13px] text-slate-600 flex-wrap">
 <Link to="/" className="hover:text-[#042C53] transition">Home</Link>
 <Link to="/#niches" className="hover:text-[#042C53] transition">Verticals</Link>
 <Link to="/#pricing" className="hover:text-[#042C53] transition">Pricing</Link>
 <Link to="/security" className="hover:text-[#042C53] transition">Security</Link>
 <Link to="/contact" className="hover:text-[#042C53] transition">Contact</Link>
 <a href={CAL_URL} target="_blank" rel="noopener" className="hover:text-[#042C53] transition">Book a call</a>
 <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="hover:text-[#042C53] transition">LinkedIn</a>
 </div>
 <div className="text-slate-400 text-[12px]">© 2026 TrainYourAgent LLC</div>
 </div>
 </footer>
 </div>
 );
};

export default About;
