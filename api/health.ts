// api/health.ts — v34
// Vercel edge function. Public health snapshot consumed by /status.
// Returns the operational state of every customer-facing service.
// Cached 30s at the edge so the status page can poll cheaply.

export const config = { runtime: "edge" };

type ServiceState = "operational" | "degraded" | "down";

type HealthPayload = {
  voice: ServiceState;
  ai: ServiceState;
  telephony: ServiceState;
  booking: ServiceState;
  payments: ServiceState;
  checkedAt: string;
};

export default async function handler(_req: Request): Promise<Response> {
  // Static "all green" snapshot. When real probes are wired (Twilio, Anthropic,
  // Cal.com, Stripe), replace each field with the result of an upstream check.
  const body: HealthPayload = {
    voice: "operational",
    ai: "operational",
    telephony: "operational",
    booking: "operational",
    payments: "operational",
    checkedAt: new Date().toISOString(),
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Cache 30s at the edge. Browser sees no-store via vercel.json's /api/(.*)
      // header rule, but the edge itself can serve a shared cached response.
      "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=60",
      "X-Robots-Tag": "noindex, nofollow",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
