// src/pages/portal/AuthCallback.tsx
// v76-a: Handle Supabase email-OTP redirect. Supabase puts the tokens in the
// URL fragment (#access_token=...&refresh_token=...). We hand them to the
// client and bounce to /portal.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";

const NAVY = "#042C53";
const CREAM = "#FAF6EE";

export default function PortalAuthCallback() {
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      const err = params.get("error_description");

      if (err) {
        setError(err);
        return;
      }
      if (!access_token || !refresh_token) {
        // Maybe Supabase already restored the session from storage (e.g. user
        // refreshed). Check before sending them back.
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          nav("/portal", { replace: true });
          return;
        }
        setError("Missing tokens. The sign-in link may have expired.");
        return;
      }

      const { error: setErr } = await supabase.auth.setSession({ access_token, refresh_token });
      if (setErr) {
        setError(setErr.message);
        return;
      }
      // Clean the hash so the tokens don't linger in browser history.
      window.history.replaceState(null, "", "/portal");
      nav("/portal", { replace: true });
    })();
  }, [nav]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: CREAM, color: NAVY }}>
      <Helmet>
        <title>Signing in… · TrainYourAgent</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="text-center">
        {error ? (
          <>
            <div className="text-[16px] font-medium mb-2" style={{ fontFamily: "Inter Tight, system-ui, sans-serif" }}>
              Sign-in failed
            </div>
            <p className="text-[13.5px] max-w-sm" style={{ color: "rgba(4,44,83,0.7)" }}>
              {error}
            </p>
            <a href="/portal/login" className="inline-block mt-4 text-[13px] underline" style={{ color: NAVY }}>
              Try again
            </a>
          </>
        ) : (
          <div className="text-[14px]" style={{ color: "rgba(4,44,83,0.7)", fontFamily: "Inter Tight, system-ui, sans-serif" }}>
            Signing you in…
          </div>
        )}
      </div>
    </div>
  );
}
