#!/usr/bin/env python3
import json, sys, os, urllib.request
TOKEN = os.environ.get("V_TOK", "")
req = urllib.request.Request(
    "https://api.vercel.com/v9/projects/trainyouragent/env?decrypt=true",
    headers={"Authorization": f"Bearer {TOKEN}"},
)
data = json.load(urllib.request.urlopen(req))
envs = data.get("envs", [])
keys_of_interest = {
    "STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET",
    "ELEVENLABS_API_KEY", "OPENAI_API_KEY", "RESEND_API_KEY", "RESEND_FROM_EMAIL",
    "VITE_META_PIXEL_ID", "META_ACCESS_TOKEN", "VAPI_API_KEY", "FB_ACCESS_TOKEN",
    "STRIPE_PRICE_SAAS_AGENT_BUILDER", "STRIPE_PRICE_OPERATOR", "STRIPE_PRICE_SCALE",
    "GA4_MEASUREMENT_ID", "VITE_GA4_MEASUREMENT_ID",
}
print(f"total_envs: {len(envs)}")
print()
for e in envs:
    k = e["key"]
    if k in keys_of_interest:
        v = e.get("value") or ""
        head = v[:18]
        tail = v[-6:] if len(v) > 24 else ""
        sep = "..." if tail else ""
        target = ",".join(e.get("target", []))
        print(f"{k:36s} = {head}{sep}{tail}  | {target}")
print("---missing---")
have = {e["key"] for e in envs}
for k in keys_of_interest:
    if k not in have:
        print(f"  MISSING: {k}")
