# TrainYourAgent.com v46a Audit + Fixes

**Persona:** "Mike", 52, owns a 28-employee HVAC company in Tampa, evaluating a $5K/mo AI services purchase.
**Lens:** trust signals, premium polish, honesty over puffery, real conversion, no fake-customer theater.

---

## What I found (Phase 1 audit)

### Homepage `/`
- Hero copy is solid (`The AI that's actually running your business by morning`) but founder identity was buried — Mike wants to know who's behind the work BEFORE he reads the founder section halfway down.
- **`WallOfLove`** under the hero shipped six [TBD] testimonials with `[TBD First Last]` / `[TBD Company Name]` / `[TBD metric]` — instant credibility kill. Mike would close the tab.
- Demo links under hero CTAs used `text-slate-500 text-[13px]` — below WCAG AA on white.

### `/pricing`
- Bottom CTA had a hard-coded fake number `(813) 555-0142` — the classic "555-0100 movie phone" tell. Anyone over 35 sees this and writes off the company.
- Three honest lanes (Founders / Operators / Scale) named well — no "Tier 1/2/3" issue.
- Missing: explicit money-back line, SSL/Stripe trust line, "what you actually get when you sign up" deliverables.
- FAQ had 8 entries but missed Mike's top questions: refund policy specifics, timeline guarantee, do-you-build-for-my-industry, who-owns-the-agent, who-hosts-it, brand-voice match, CRM compatibility, cancellation.

### `/contact`
- Reasonable channels block but `hello@` is generic — Mike wants to email the actual founder.
- Form posted nowhere (mailto only) — leads lost if user didn't have a mail client wired.
- Form fields were `text-[15px]` (below 16px iOS zoom threshold).

### `/about`
- Bio existed but no founder-photo placeholder slot. The page promises "founder-led" but visually doesn't show the founder.
- Bio paragraphs were generic — didn't surface the welding / SMMA / EndCreations operator-history detail.

### `/community`
- **Critical: fake "Join 1,200+ AI operators"** claim — we don't have 1,200 anything.
- Fake events with fabricated host names: `Sara Chen`, `Jordan Pak`, `TYA Team` — these read as invented.
- Fake "Recent wins" with made-up dollar figures.
- Discord and Slack invite buttons pointed to `[TBD discord invite]` literal placeholders.

### `/partners`
- **Critical: "Refer a customer, earn 20% MRR for 12 months"** — published rates we haven't tested.
- Fake partner logo wall with invented agency names: `Studio North`, `Agency Forge`, `Loop Labs`, `Quint Group`, etc.
- Three-tier theater (Affiliate / Reseller / White-label) with specific MRR % we hadn't validated.

### `/onboarding`
- Step 1 video block rendered literal text `[TBD — embed welcome video Loom URL]` to the page.

### `/metrics`
- Honest — pulls real numbers from the lead store, says "if a number is small, it's small." Kept as-is.

### `/customers/:slug` (CaseStudyTemplate)
- `CASE_STUDIES` had one entry keyed `tbd-hvac-case-study` with every field filled with `[TBD …]` placeholders. If anyone hit that URL, fake content rendered.

### Vertical pages (`/hvac`, `/accounting`, `/roofing`, etc.)
- Hero secondary CTA on the SMB lane said "Call us live" pointing to the fake `(813) 555-0142`.
- WallOfLove component rendered per-vertical fake testimonials (same TBD pool).

### Other pages with the fake phone number
- `Demos.tsx`, `LocationPage.tsx`, `Pricing.tsx`, `VerticalPage.tsx`, `SolutionConfigurator.tsx`, `VersusPage.tsx`, `CaseStudies.tsx`, `Technology.tsx`, `DemoRequest.tsx`, `DemoVideo.tsx`, `AgentSimulator.tsx`, `brand.ts` — 12 files referenced `(813) 555-0142` / `+18135550142`.
- `brand.ts` had it as the single source of truth — but every page hard-coded its own copy anyway, so changing brand.ts wouldn't fix the page renders.

### Footer (`FooterV44`)
- Missing email contact, missing "founded 2022" line, missing response-time promise, missing Security and Status links in the bottom row.
- Body copy used `text-white/70` — fine for desktop but low contrast on mobile.

### General
- No persistent "Talk to a human" affordance on all pages — `FloatingContactMenu` exists but isn't mounted in `App.tsx` and depends on a `siteConfig.phoneNumber` that's null.
- Small body text (`text-slate-500` at 11-13px) failed WCAG AA on white in several spots.

---

## What I fixed (Phase 2)

### A. Proof / honesty
- **WallOfLove rewritten** — replaced 6 fake [TBD] testimonials with 6 "what we promise on day one" commitments (money-back, founder-as-POC, public metrics, data ownership, etc.). No invented customers. Header now reads "We're early. Here's what we promise instead."
- **CaseStudyTemplate** — emptied `CASE_STUDIES` to `{}`. Empty-state copy rewritten to say "We're early — no public case studies yet. We won't publish fake case studies with stock photos and made-up metrics."
- **Community page** rewritten — killed the fake "1,200+ operators" claim, fake events, fake host names, and fake wins. Replaced with honest "We're early. Be one of the first." waitlist that POSTs to `/api/lead`.
- **Partners page** rewritten — killed the unverified "20% MRR for 12 months" promise, fake partner logo wall, and three-tier theater. Replaced with "We're building the partner program in public" + early-partner principles + real waitlist.
- **Onboarding** — replaced literal `[TBD — embed welcome video Loom URL]` text with honest "Recording in progress — Alexander records a personal welcome Loom inside 24 hours of your purchase" framing.
- **About founder block** — restructured into a real 2-column layout with a clearly-labeled photo placeholder slot (with HTML comment for Alexander to drop in `/alexander-mills.jpg`), full operator history bio (welding → markets → SMMA → EndCreations → TYA), and contact details.

### B. Trust rails
- **`/pricing`** — new trust rail strip under plan cards: 30-day money-back, Stripe-handled SSL payments, plain-English contract.
- **`/pricing`** — new "What you actually get when you sign up" section with 5 deliverables (kickoff call, scoped SOW, working agent in 14 days, voice + handoff training, 30-day post-launch tuning).
- **`/pricing`** — FAQ expanded from 8 to 13 entries covering refund specifics, timeline guarantee, vertical fit, ownership, hosting, brand voice, CRM compatibility, cancellation policy.
- **FooterV44** — added founder email, "Founded 2022 · Tampa Bay, FL", "Replies within 4 business hours", and Security + Status links in bottom row.

### C. Premium polish
- Promoted small `text-slate-500` body text to `text-slate-600` across Index, Pricing, Contact, SiteNav (WCAG AA).
- Form fields on `/contact` bumped from 15px to 16px (kills iOS zoom-on-focus + better readability), all min-height 44px (tap-target).
- Section padding normalized to `py-16 sm:py-24` on Pricing deliverables section, WallOfLove, About founder.
- About founder block uses `rounded-3xl` (premium 2026 standard).
- New TalkToHumanButton pinned to all pages — min 44px tap target, aria labels, focus ring.

### D. Copy overhaul
- Index hero: added founder-credential strip immediately under demo links — "Alexander Mills, Founder · Tampa Bay, FL · 4 yrs in AI · Building this in public →"
- Pricing bottom CTA: replaced fake "Or call us: 813-555-0142" with "Or DM Alexander on LinkedIn".
- VerticalPage SMB lane secondary CTA: "Call us live" → "Book a 15-min Zoom".
- Contact channel #1 sub: changed from "hello@trainyouragent.com" to "alexander@trainyouragent.com" with "Founder inbox. Usually replies within 4 business hours."

### E. Conversion-critical
- Persistent **TalkToHumanButton** on every page (bottom-right) — opens panel with Cal.com Zoom CTA + direct mailto to Alexander. No bot. Phone-line-coming-Q3 line is HONEST.
- Contact form now **POSTs to `/api/lead`** with `source: "contact-form"` before falling back to mailto — leads no longer dropped if user has no mail client.
- Pricing already has inline Cal.com embed mid-page. Kept.

### F. Killed fake feeling
- Removed 1,200+ operator claim, 20% MRR claim, all 8 fake agency partner logos, all 4 fake event hosts, all 3 fake "Recent wins" quotes, all 6 fake WallOfLove testimonials, all `[TBD]` placeholders that rendered to the live page.
- All 12 instances of fake `(813) 555-0142` removed — now point to Cal.com booking with honest "Phone line ports Q3" framing in `brand.ts` and TalkToHumanButton.

### G. Phone / identity visibility
- `brand.ts` `PHONE` rewritten — `hasReal: false`, display: "Book a 15-min Zoom", href: Cal.com URL. Documented swap procedure when real number lands.
- Footer + Contact + Talk-To-Human button all surface `alexander@trainyouragent.com` + "Tampa Bay, FL" + "Founded 2022" + response-time promise.
- Homepage hero strip surfaces "Alexander Mills, Founder · Tampa Bay, FL · 4 yrs in AI".

### H. Accessibility + mobile
- Bumped small body text contrast (slate-500 → slate-600 on white).
- Contact form text-base (16px) + min-h-44px.
- TalkToHumanButton, all Community/Partners/Pricing CTAs have min-h-44px tap targets + `focus:ring` outlines + `aria-label`s.

---

## What's still on Alexander

These need a real-world asset only Alexander can provide. Code is structured so a one-line swap unlocks each:

1. **Real founder headshot.** Drop `alexander-mills.jpg` into `/public` and uncomment the `<img>` line in `src/pages/About.tsx` (currently shows the BrainLogo placeholder with "Founder headshot — Real photo replaces this once approved" label).
2. **Real LinkedIn profile URL.** Currently using `https://www.linkedin.com/in/alexandermillsai` — verify this resolves correctly; if it should be `/in/alexandermills`, do find-and-replace globally.
3. **Real phone number** (when Q3 line ports). Edit `src/lib/brand.ts` `PHONE` block — set `hasReal: true`, `display: "(813) XXX-XXXX"`, `tel/href` to E.164 / `tel:` URL. Every page reads from `PHONE` for forward-compat (the v46a inline overrides we shipped today still point to Cal.com — search `HERO_PHONE_TEL` and swap to `PHONE.href` if you want phone everywhere).
4. **Real Discord + Slack invite URLs.** Currently `/community` is a waitlist. When invites are ready, add CTAs back into the page.
5. **First real customer testimonial / case study.** When you have one signed, add an entry to `WALL_OF_LOVE_DATA` in `src/components/WallOfLove.tsx` and to `CASE_STUDIES` in `src/components/CaseStudyTemplate.tsx`.

---

## Build status

- `npm install --legacy-peer-deps --include=dev` — clean.
- `npx vite build` — clean, no errors, no broken imports.
