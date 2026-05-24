"""Niche data for v147 Hormozi-style ad renders. Single-source-of-truth
for all dollar numbers, headlines, badges, and receipts. Edit here to
re-roll any copy."""

NICHES = {
  "hvac": {
    "bg": "#0a0a0a", "accent": "#FFD60A", "badge": "LIVE · TAMPA BAY",
    "niche_tag": "HVAC OPERATORS",
    "eyebrow": "psst, you in this stat?",
    "headline": 'YOU&rsquo;RE LOSING <span class="hl">$22,889</span><br>EVERY MONTH.',
    "label_1": "MISSED CALLS (LAST 30 DAYS)", "val_1": "47", "val_1_class": "neg",
    "label_2": "REVENUE WALKED", "val_2": "$22,889", "val_2_class": "neg",
    "receipt_1": "Same techs", "receipt_2": "Same trucks",
    "receipt_3": "Stop dropping calls",
  },
  "legal": {
    "bg": "#0a0a0a", "accent": "#FFD60A", "badge": "LIVE · INTAKE QUEUE",
    "niche_tag": "SOLO + SMALL FIRM",
    "eyebrow": "for partners only",
    "headline": 'STOP <span class="strike">DOING INTAKE</span><br>AT <span class="hl">$400/HR.</span>',
    "label_1": "PARTNER HOURS ON PHONES", "val_1": "48 / WEEK", "val_1_class": "neg",
    "label_2": "BILLABLE $ LOST", "val_2": "$76,800", "val_2_class": "neg",
    "receipt_1": "Conflict check in 47 sec", "receipt_2": "Bar-compliant",
    "receipt_3": "Margins doubled",
  },
  "restaurants": {
    "bg": "#0a0a0a", "accent": "#FF003C", "badge": "LIVE · DINNER RUSH",
    "niche_tag": "INDEPENDENT F+B",
    "eyebrow": "every. single. night.",
    "headline": 'PHONE RINGS <span class="hl">47&times;</span><br>HOST PICKS UP <span class="strike">6.</span>',
    "label_1": "DROPPED INBOUND CALLS", "val_1": "41 / NIGHT", "val_1_class": "neg",
    "label_2": "LOST COVERS / MONTH", "val_2": "$6,052", "val_2_class": "neg",
    "receipt_1": "OpenTable native", "receipt_2": "Catering captured",
    "receipt_3": "Host runs service",
  },
  "healthcare": {
    "bg": "#0a0a0a", "accent": "#5EE18A", "badge": "LIVE · PATIENT QUEUE",
    "niche_tag": "DENTAL + MEDICAL",
    "eyebrow": "empty chair = $487",
    "headline": '30% OF NEW PATIENT<br>CALLS GO TO <span class="hl">VOICEMAIL.</span>',
    "label_1": "NEW PATIENT CALLS LOST", "val_1": "38 / MONTH", "val_1_class": "neg",
    "label_2": "REVENUE OPPORTUNITY", "val_2": "$23,256", "val_2_class": "neg",
    "receipt_1": "HIPAA-aligned", "receipt_2": "BAA per customer",
    "receipt_3": "Insurance verified",
  },
  "plumbing": {
    "bg": "#0a0a0a", "accent": "#FFD60A", "badge": "LIVE · 11:47 PM",
    "niche_tag": "EMERGENCY DISPATCH",
    "eyebrow": "burst pipe doesn&rsquo;t care it&rsquo;s late",
    "headline": 'WHO ANSWERS<br>AT <span class="hl">11:47 PM?</span>',
    "label_1": "AFTER-HOURS EMERGENCIES", "val_1": "52 / MO", "val_1_class": "neg",
    "label_2": "LOST TO COMPETITORS", "val_2": "$21,424", "val_2_class": "neg",
    "receipt_1": "Real dispatch", "receipt_2": "Not just voicemail",
    "receipt_3": "On-site in 24 min",
  },
  "roofing": {
    "bg": "#0a0a0a", "accent": "#FF003C", "badge": "LIVE · STORM SURGE",
    "niche_tag": "ROOFING CONTRACTORS",
    "eyebrow": "next hurricane is 18 days out",
    "headline": 'YOU JUST LOST<br><span class="hl">$40K</span> IN INSPECTIONS.',
    "label_1": "CALLS DROPPED DURING SURGE", "val_1": "73%", "val_1_class": "neg",
    "label_2": "MONTHLY OPPORTUNITY", "val_2": "$52,200", "val_2_class": "neg",
    "receipt_1": "38 inspections / 72 hrs", "receipt_2": "Last hurricane proof",
    "receipt_3": "Capture rate 95%",
  },
  "realestate": {
    "bg": "#0a0a0a", "accent": "#FFD60A", "badge": "LIVE · OPEN HOUSE",
    "niche_tag": "RESIDENTIAL BROKERAGES",
    "eyebrow": "the lead you missed bought the listing next door",
    "headline": 'BUYER CALLS AT <span class="hl">7:42 PM.</span><br>YOU RESPOND <span class="strike">TOMORROW.</span>',
    "label_1": "AVG RESPONSE TIME", "val_1": "11 HRS", "val_1_class": "neg",
    "label_2": "DEAD LEADS / MONTH", "val_2": "$48,300", "val_2_class": "neg",
    "receipt_1": "Reply in 47 sec", "receipt_2": "Showings booked 24/7",
    "receipt_3": "MLS native",
  },
  "solar": {
    "bg": "#0a0a0a", "accent": "#FFD60A", "badge": "LIVE · REBATE WINDOW",
    "niche_tag": "SOLAR INSTALLERS",
    "eyebrow": "every door knock = $14",
    "headline": 'YOUR <span class="strike">REPS QUIT.</span><br>YOUR AI <span class="hl">DOESN&rsquo;T.</span>',
    "label_1": "LEADS LOST TO SLOW FOLLOW-UP", "val_1": "62%", "val_1_class": "neg",
    "label_2": "MONTHLY PIPELINE BLEED", "val_2": "$94,600", "val_2_class": "neg",
    "receipt_1": "Qualifies in 4 questions", "receipt_2": "Books site survey",
    "receipt_3": "Rebate-aware",
  },
  "accounting": {
    "bg": "#0a0a0a", "accent": "#5EE18A", "badge": "LIVE · TAX SEASON",
    "niche_tag": "CPA + BOOKKEEPING",
    "eyebrow": "Q1 you stop answering the phone",
    "headline": 'PARTNER BILLS <span class="hl">$425/HR.</span><br>ANSWERING <span class="strike">RECEPTIONIST</span> CALLS.',
    "label_1": "BILLABLE HRS LOST / WK", "val_1": "31", "val_1_class": "neg",
    "label_2": "REVENUE LEAK / YR", "val_2": "$685,400", "val_2_class": "neg",
    "receipt_1": "Engagement letters", "receipt_2": "Doc collection",
    "receipt_3": "Calendar booked",
  },
  "automotive": {
    "bg": "#0a0a0a", "accent": "#FF003C", "badge": "LIVE · SERVICE BAY",
    "niche_tag": "DEALERSHIP + SHOP",
    "eyebrow": "every ring that hits voicemail",
    "headline": 'SERVICE CALLS GO TO <span class="hl">VOICEMAIL.</span><br>CUSTOMERS GO TO <span class="strike">JIFFY LUBE.</span>',
    "label_1": "DROPPED SERVICE CALLS / MO", "val_1": "184", "val_1_class": "neg",
    "label_2": "RO REVENUE LOST", "val_2": "$71,760", "val_2_class": "neg",
    "receipt_1": "DMS-integrated", "receipt_2": "Books bay slots",
    "receipt_3": "Recall-aware",
  },
  "gyms": {
    "bg": "#0a0a0a", "accent": "#5EE18A", "badge": "LIVE · NEW YEAR RUSH",
    "niche_tag": "GYMS + STUDIOS",
    "eyebrow": "January 2nd · phones meltdown",
    "headline": 'NEW YEAR LEADS <span class="strike">GHOST.</span><br><span class="hl">$340</span> MEMBERSHIPS LOST.',
    "label_1": "TRIAL SIGN-UPS MISSED", "val_1": "94 / MO", "val_1_class": "neg",
    "label_2": "ANNUALIZED LIFETIME VALUE", "val_2": "$319,600", "val_2_class": "neg",
    "receipt_1": "Tour booked in 22 sec", "receipt_2": "Mindbody synced",
    "receipt_3": "Trainer auto-matched",
  },
  "bars": {
    "bg": "#0a0a0a", "accent": "#FF003C", "badge": "LIVE · FRIDAY 10 PM",
    "niche_tag": "BARS + NIGHTLIFE",
    "eyebrow": "bachelorette party of 14 · gone",
    "headline": 'BIG GROUP TEXTS <span class="hl">10 BARS.</span><br>ONLY 3 REPLY.',
    "label_1": "GROUP RESERVATIONS LOST / WK", "val_1": "11", "val_1_class": "neg",
    "label_2": "BAR TAB OPPORTUNITY", "val_2": "$18,920", "val_2_class": "neg",
    "receipt_1": "Books bottle service", "receipt_2": "Pre-auths card",
    "receipt_3": "Sends location pin",
  },
  "property-mgmt": {
    "bg": "#0a0a0a", "accent": "#FFD60A", "badge": "LIVE · 2:14 AM",
    "niche_tag": "PROPERTY MANAGERS",
    "eyebrow": "leak in unit 4B doesn&rsquo;t wait",
    "headline": 'TENANT FLOODED.<br>YOU&rsquo;RE <span class="strike">ASLEEP.</span> AI <span class="hl">DISPATCHED.</span>',
    "label_1": "AFTER-HOURS EMERGENCIES / MO", "val_1": "68", "val_1_class": "neg",
    "label_2": "TURNOVER COST AVOIDED", "val_2": "$112,000", "val_2_class": "pos",
    "receipt_1": "Vendor dispatched in 90 sec", "receipt_2": "Tenant calmed",
    "receipt_3": "Photos collected",
  },
  "pest-control": {
    "bg": "#0a0a0a", "accent": "#5EE18A", "badge": "LIVE · ANT SEASON",
    "niche_tag": "PEST + LAWN CARE",
    "eyebrow": "spring = phones explode",
    "headline": 'PHONE LINE <span class="hl">JAMMED.</span><br>NEIGHBOR USES <span class="strike">TERMINIX.</span>',
    "label_1": "OVERFLOW CALLS / DAY", "val_1": "42", "val_1_class": "neg",
    "label_2": "CONTRACT REVENUE LOST", "val_2": "$31,500", "val_2_class": "neg",
    "receipt_1": "Quotes in 38 sec", "receipt_2": "Annual contracts upsold",
    "receipt_3": "Route-optimized booking",
  },
  "saas": {
    "bg": "#0a0a0a", "accent": "#FFD60A", "badge": "LIVE · DEMO QUEUE",
    "niche_tag": "B2B SaaS · SERIES A+",
    "eyebrow": "your SDR sleeps · prospects don&rsquo;t",
    "headline": 'INBOUND DEMO REQUEST.<br>RESPONSE TIME: <span class="hl">14 HRS.</span>',
    "label_1": "MQL → SQL CONVERSION", "val_1": "8%", "val_1_class": "neg",
    "label_2": "PIPELINE LEFT ON TABLE / Q", "val_2": "$1.2M", "val_2_class": "neg",
    "receipt_1": "Qualifies BANT in 47 sec", "receipt_2": "Books AE calendar",
    "receipt_3": "HubSpot synced",
  },
  "insurance": {
    "bg": "#0a0a0a", "accent": "#FF003C", "badge": "LIVE · RENEWAL CYCLE",
    "niche_tag": "INSURANCE AGENCIES",
    "eyebrow": "policy lapses while you sleep",
    "headline": 'QUOTE REQUEST AT <span class="hl">9 PM.</span><br>CLIENT BINDS WITH <span class="strike">GEICO</span> BY 9 AM.',
    "label_1": "AFTER-HOURS QUOTE REQUESTS", "val_1": "57 / WK", "val_1_class": "neg",
    "label_2": "WRITTEN PREMIUM LOST", "val_2": "$148,200", "val_2_class": "neg",
    "receipt_1": "Quotes auto-generated", "receipt_2": "EZLynx synced",
    "receipt_3": "Compliance logged",
  },
}

ASPECT_DIMS = {
  "9x16": (1080, 1920),
  "4x5":  (1080, 1350),
  "1x1":  (1080, 1080),
}


def build_html(template_path, niche_key, aspect):
  data = NICHES[niche_key]
  w, h = ASPECT_DIMS[aspect]
  placeholders = {
    "$BG_COLOR": data["bg"], "$ACCENT_COLOR": data["accent"],
    "$BADGE": data["badge"], "$NICHE_TAG": data["niche_tag"],
    "$EYEBROW": data["eyebrow"], "$HEADLINE": data["headline"],
    "$LABEL_1": data["label_1"], "$VAL_1": data["val_1"],
    "$VAL_1_CLASS": data["val_1_class"],
    "$LABEL_2": data["label_2"], "$VAL_2": data["val_2"],
    "$VAL_2_CLASS": data["val_2_class"],
    "$RECEIPT_1": data["receipt_1"], "$RECEIPT_2": data["receipt_2"],
    "$RECEIPT_3": data["receipt_3"],
    "$W": str(w), "$H": str(h), "$WPX": str(w), "$HPX": str(h), "$ASPECT": aspect,
  }
  with open(template_path) as f:
    s = f.read()
  # Sort by key length descending so $WIDTH replaces before $W etc.
  for k in sorted(placeholders.keys(), key=len, reverse=True):
    s = s.replace(k, placeholders[k])
  return s, w, h


if __name__ == "__main__":
  import sys, subprocess, os, tempfile
  out_dir = os.environ.get("OUT_DIR", "ads/static")
  template = os.path.join(os.path.dirname(__file__), "ad-templates", "hormozi-2030.html")
  chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  niches_env = os.environ.get("NICHES", "").strip().split()
  aspects_env = os.environ.get("ASPECTS", "").strip().split()
  niches = niches_env if niches_env else list(NICHES.keys())
  aspects = aspects_env if aspects_env else list(ASPECT_DIMS.keys())

  os.makedirs(out_dir, exist_ok=True)
  print(f"==> v147: rendering {len(niches)} niches × {len(aspects)} aspects = {len(niches)*len(aspects)} ads")
  for n in niches:
    if n not in NICHES:
      print(f"  ! skip unknown niche: {n}")
      continue
    for a in aspects:
      html_str, w, h = build_html(template, n, a)
      with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as f:
        f.write(html_str); html_path = f.name
      out_path = os.path.join(out_dir, f"TYA_{n}_hormozi-2030_{a}.png")
      subprocess.run([
        chrome, "--headless=new", "--disable-gpu", "--no-sandbox",
        f"--window-size={w},{h}", "--hide-scrollbars",
        f"--screenshot={out_path}", "--default-background-color=00000000",
        f"file://{html_path}",
      ], capture_output=True)
      os.unlink(html_path)
      ok = os.path.exists(out_path) and os.path.getsize(out_path) > 1000
      print(f"  {'✓' if ok else '✗'} {out_path}")
  print("==> done")
