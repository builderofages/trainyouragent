// src/components/legal/LegalRedirect.tsx
// v76-D: client-side redirect from legacy /privacy, /terms, /cookie-policy to /legal/*.
// Also emits a canonical link to the new URL and a meta refresh as a fallback
// for crawlers that don't execute JS.

import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

export default function LegalRedirect({ to }: { to: string }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace: true });
  }, [navigate, to]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center text-[14px] text-slate-500">
      <Helmet>
        <link rel="canonical" href={`https://trainyouragent.com${to}`} />
        <meta httpEquiv="refresh" content={`0; url=${to}`} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      Redirecting to <a href={to} className="ml-1 underline">{to}</a>…
    </div>
  );
}
