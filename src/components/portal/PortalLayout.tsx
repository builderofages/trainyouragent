// src/components/portal/PortalLayout.tsx
// v76-a: Authenticated layout for /portal/*. Sidebar (md+) collapses into a
// hamburger sheet on mobile. Auth guard redirects to /portal/login.

import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { fetchMe, type Customer } from "@/lib/portal";
import { Menu, X, Home, Activity, Settings, MessageSquare, BarChart3, CreditCard, FileText, LifeBuoy, LogOut } from "lucide-react";

const NAVY = "#042C53";
const NAVY_DARK = "#031f3a";
const CREAM = "#FAF6EE";

const NAV = [
  { to: "/portal", label: "Overview", icon: Home, end: true },
  { to: "/portal/training", label: "Training Progress", icon: Activity },
  { to: "/portal/agent", label: "Agent Settings", icon: Settings },
  { to: "/portal/conversations", label: "Conversations", icon: MessageSquare },
  { to: "/portal/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/portal/billing", label: "Billing", icon: CreditCard },
  { to: "/portal/documents", label: "Documents", icon: FileText },
  { to: "/portal/support", label: "Support", icon: LifeBuoy },
];

function StatusPill({ status }: { status: string | null | undefined }) {
  const label = status || "intake";
  const isLive = label === "production";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{
        background: isLive ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.1)",
        color: isLive ? "#16a34a" : "rgba(255,255,255,0.85)",
        border: `1px solid ${isLive ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.18)"}`,
      }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: isLive ? "#22c55e" : "rgba(255,255,255,0.6)" }}
      />
      {label.replace("-", " ")}
    </span>
  );
}

export default function PortalLayout() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [email, setEmail] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (cancelled) return;
      if (!session) {
        nav("/portal/login", { replace: true });
        return;
      }
      setAuthed(true);
      setEmail(session.user.email || "");
      // Best-effort: pull customer row. If the table or env isn't ready yet
      // (pre-launch) we still render the shell with email only.
      try {
        const me = await fetchMe();
        if (!cancelled) setCustomer(me);
      } catch {
        /* ignore */
      }
      if (!cancelled) setLoading(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) nav("/portal/login", { replace: true });
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [nav]);

  async function signOut() {
    await supabase.auth.signOut();
    nav("/portal/login", { replace: true });
  }

  if (loading && !authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: CREAM }}>
        <div className="text-sm" style={{ color: NAVY, fontFamily: "Inter Tight, system-ui, sans-serif" }}>
          Loading portal…
        </div>
      </div>
    );
  }
  if (!authed) return null;

  const businessName = customer?.business_name || "Your business";
  const sidebarBody = (
    <>
      <div className="px-5 py-6">
        <Link to="/" className="flex items-center gap-2.5" style={{ color: CREAM }}>
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <g strokeWidth="4"><path d="M 32 6 L 58 32 L 32 58 L 6 32 Z" /></g>
            <g strokeWidth="2.4"><path d="M 32 6 L 32 58" /><path d="M 6 32 L 58 32" /></g>
            <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
          </svg>
          <span className="text-[15px] font-medium tracking-tight" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
            TrainYourAgent
          </span>
        </Link>
        <div className="mt-1 text-[11px] uppercase tracking-[0.14em]" style={{ color: "rgba(250,246,238,0.55)" }}>
          Customer portal
        </div>
      </div>
      <nav className="flex-1 px-2.5 pb-4 space-y-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-[13.5px] transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"
                }`
              }
              style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}
            >
              <Icon size={15} strokeWidth={1.75} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 mt-4 rounded-md text-[13.5px] text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}
        >
          <LogOut size={15} strokeWidth={1.75} />
          <span>Sign out</span>
        </button>
      </nav>
      <div className="px-5 py-4 border-t border-white/10 text-[11px]" style={{ color: "rgba(250,246,238,0.45)" }}>
        Need help? <a className="underline" href="mailto:alexander@trainyouragent.com">alexander@trainyouragent.com</a>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: CREAM, color: NAVY }}>
      {/* Desktop sidebar — enhanced dark glass */}
      <aside
        className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 glass-panel"
        style={{ background: NAVY_DARK, borderRight: "1px solid rgba(103,232,249,0.12)" }}
      >
        {sidebarBody}
      </aside>

      {/* Mobile sidebar (sheet) */}
      {mobileOpen && (
        <>
          <button
            aria-label="Close menu"
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="md:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col glass-panel"
            style={{ background: NAVY_DARK }}
          >
            {sidebarBody}
          </aside>
        </>
      )}

      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Top bar — premium glass + Trinity orbs */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3 border-b glass-panel"
          style={{ background: "rgba(250,246,238,0.92)", backdropFilter: "blur(12px)", borderColor: "rgba(4,44,83,0.08)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              aria-label="Open menu"
              className="md:hidden p-1.5 rounded-md hover:bg-black/5"
              onClick={() => setMobileOpen(true)}
              style={{ color: NAVY }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="min-w-0">
              <div className="text-[14px] font-medium leading-tight truncate flex items-center gap-1.5" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
                <span className="trinity-orb" aria-hidden style={{ background: NAVY, boxShadow: '0 0 4px #22d3ee' }} />
                {businessName}
              </div>
              <div className="text-[11.5px] leading-tight truncate title-mono" style={{ color: "rgba(4,44,83,0.55)" }}>
                {email}
              </div>
            </div>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full btn-glass"
            style={{ background: NAVY, color: CREAM, borderColor: 'rgba(103,232,249,0.3)' }}
          >
            <span className="text-[10.5px] uppercase tracking-[0.14em] opacity-70 title-mono">Agent</span>
            <StatusPill status={customer?.agent_status} />
          </div>
        </header>

        <main className="flex-1 px-4 md:px-8 py-8 max-w-6xl w-full mx-auto">
          <Outlet context={{ customer, email }} />
        </main>

        {/* Health/branding footer note in shell */}
        <div className="px-4 md:px-8 pb-4 text-[10px] brand-note text-center md:text-left opacity-60">
          100% REAL OPERATOR BUILDS • NO SYNTHETIC • HEALTH CHECKS 72H • TRINITY CYAN PROTOCOL
        </div>
      </div>
    </div>
  );
}

// Helper hook so child pages can read the layout context without re-fetching
export function usePortalContext() {
  // re-export so pages can use `useOutletContext<...>()` directly with proper typing
  // (kept as a thin pass-through for now; pages call useOutletContext themselves)
  return null;
}
