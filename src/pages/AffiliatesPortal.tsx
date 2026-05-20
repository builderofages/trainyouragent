// src/pages/AffiliatesPortal.tsx — v76-c
// Coming-soon stub for the approved-affiliate portal. The full gated portal
// (tracking link generation, click + conversion stats, payout history) lands
// in v77. Linked from /affiliates.

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import SiteNav from "@/components/SiteNav";
import FooterV44 from "@/components/FooterV44";

export default function AffiliatesPortal() {
  return (
    <div
      className="min-h-screen bg-white text-[#0B1B2B]"
      style={{ fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif" }}
    >
      <Helmet>
        <title>Affiliate portal — TrainYourAgent</title>
        <meta name="robots" content="noindex,follow" />
        <link rel="canonical" href="https://www.trainyouragent.com/affiliates/portal" />
      </Helmet>
      <SiteNav active="about" />

      <section className="pt-32 pb-24 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-4">
            Affiliate portal
          </div>
          <h1 className="text-[36px] sm:text-[48px] leading-tight font-semibold text-[#042C53] tracking-tight mb-5">
            Coming soon.
          </h1>
          <p className="text-[16px] text-slate-700 leading-relaxed mb-7">
            We're building the approved-affiliate portal — tracking link generation, real-time click + conversion stats, and Stripe Connect payout history. Lands in the v77 release window.
          </p>
          <p className="text-[14px] text-slate-600 leading-relaxed mb-7">
            In the meantime: if you've been approved and need your custom tracking link, reply to your approval email or hit{" "}
            <a href="mailto:alexander@trainyouragent.com" className="text-[#185FA5] hover:underline">
              alexander@trainyouragent.com
            </a>{" "}
            directly.
          </p>
          <Link
            to="/affiliates"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-300 bg-white text-[#042C53] text-[14px] font-semibold hover:border-[#185FA5]"
          >
            ← Back to /affiliates
          </Link>
        </div>
      </section>

      <FooterV44 />
    </div>
  );
}
