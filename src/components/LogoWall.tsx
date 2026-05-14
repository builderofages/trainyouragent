// src/components/LogoWall.tsx
// Auto-scrolling logo marquee. Replace `LOGOS` with real customer logos as you collect releases.
// Currently shows neutral integration logos so the section never looks empty.

const LOGOS = [
  { name: "Twilio" }, { name: "Cal.com" }, { name: "ServiceTitan" }, { name: "HubSpot" },
  { name: "Salesforce" }, { name: "Stripe" }, { name: "Clio" }, { name: "Mindbody" },
  { name: "Athena" }, { name: "Zapier" }, { name: "n8n" }, { name: "Notion" },
  { name: "Slack" }, { name: "Vercel" }, { name: "Supabase" },
];

export default function LogoWall({
  eyebrow = "Wired into the stacks our customers already pay for",
  caption = "More real customer logos land here as releases come in.",
}: { eyebrow?: string; caption?: string }) {
  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...LOGOS, ...LOGOS];
  return (
    <section className="px-0 py-12 border-y border-slate-200 bg-white overflow-hidden" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-6 flex items-center justify-between flex-wrap gap-2">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold">{eyebrow}</div>
        <div className="text-[11px] text-slate-500">{caption}</div>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #fff 0%, rgba(255,255,255,0) 100%)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #fff 0%, rgba(255,255,255,0) 100%)" }} />
        <div className="flex gap-12 animate-[marquee_36s_linear_infinite]" style={{ width: "max-content" }}>
          {loop.map((l, i) => (
            <div key={i} className="flex items-center justify-center px-6 py-3 rounded-2xl bg-[#F6FAFE] border border-slate-200/70 min-w-[160px]">
              <span className="text-[15px] font-semibold text-[#042C53] tracking-tight whitespace-nowrap">{l.name}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}
