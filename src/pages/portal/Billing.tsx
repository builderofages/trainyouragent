// src/pages/portal/Billing.tsx
// v76-a: Current plan, next invoice, payment method, history, Stripe portal CTA.

import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { portalFetch, type Customer, TIER_LABEL } from "@/lib/portal";
import { ExternalLink } from "lucide-react";

const NAVY = "#042C53";
const CREAM = "#FAF6EE";

type Ctx = { customer: Customer | null; email: string };

export default function PortalBilling() {
  const { customer } = useOutletContext<Ctx>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openStripePortal() {
    setLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/portal/billing-portal", { method: "POST" });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string; message?: string };
      if (res.ok && j.url) {
        window.location.href = j.url;
      } else {
        setError(j.message || j.error || "Couldn't open Stripe portal.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const tier = customer?.subscription_tier ? TIER_LABEL[customer.subscription_tier] : "Trial";
  const status = customer?.subscription_status || "trial";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[26px] leading-tight tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
          Billing
        </h1>
        <p className="mt-2 text-[14px]" style={{ color: "rgba(4,44,83,0.65)" }}>
          Plan, payment method, and invoice history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(4,44,83,0.1)" }}>
          <div className="text-[11.5px] uppercase tracking-[0.14em]" style={{ color: "rgba(4,44,83,0.55)" }}>Current plan</div>
          <div className="mt-2 text-[18px] tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>{tier}</div>
          <div className="mt-1 text-[12px]" style={{ color: "rgba(4,44,83,0.6)" }}>Status: {status}</div>
        </div>
        <div className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(4,44,83,0.1)" }}>
          <div className="text-[11.5px] uppercase tracking-[0.14em]" style={{ color: "rgba(4,44,83,0.55)" }}>Next invoice</div>
          <div className="mt-2 text-[18px] tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>—</div>
          <div className="mt-1 text-[12px]" style={{ color: "rgba(4,44,83,0.6)" }}>Managed by Stripe</div>
        </div>
        <div className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(4,44,83,0.1)" }}>
          <div className="text-[11.5px] uppercase tracking-[0.14em]" style={{ color: "rgba(4,44,83,0.55)" }}>Payment method</div>
          <div className="mt-2 text-[18px] tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>•••• ••••</div>
          <div className="mt-1 text-[12px]" style={{ color: "rgba(4,44,83,0.6)" }}>Update in Stripe portal</div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 mb-6" style={{ borderColor: "rgba(4,44,83,0.1)" }}>
        <div className="text-[15px] font-medium tracking-tight mb-2" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>Billing history</div>
        <div className="text-[13px]" style={{ color: "rgba(4,44,83,0.6)" }}>
          No invoices yet. Full history (PDFs, line items) is available in the Stripe billing portal.
        </div>
      </div>

      <button
        onClick={openStripePortal}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-[13.5px] font-medium disabled:opacity-60"
        style={{ background: NAVY, color: CREAM, fontFamily: "Inter Tight, system-ui, sans-serif" }}
      >
        <ExternalLink size={14} strokeWidth={1.75} />
        {loading ? "Opening…" : "Manage billing in Stripe Customer Portal"}
      </button>
      {error && (
        <div className="mt-3 text-[12.5px]" style={{ color: "#b91c1c" }}>{error}</div>
      )}
    </div>
  );
}
