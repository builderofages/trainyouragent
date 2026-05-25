"""editorial-2030-data.py — v166
Niche data for the editorial-2030 ad template.
6 niches × 3 aspects = 18 ads. Output: ads/static/editorial-2030/
Each entry carries the new fields the editorial template requires:
device mockup metadata, named testimonial line + attribution,
big dollar number + label.
"""

NICHES = {
  "hvac": {
    "bg": "#0a0a0a",
    "accent": "#FFD60A",
    "badge": "BREAKING · TAMPA BAY",
    "niche_tag": "HVAC OPERATORS",
    "eyebrow": "after-hours · weekend storm",
    "headline_plain": "WHILE YOU SLEEP,\nYOUR COMPETITOR\nIS BOOKING\nYOUR LEADS.",
    "device_who": "Mrs. Carter — AC out",
    "device_num": "(813) 555-0142",
    "device_initial": "MC",
    "dollar": "$22,889",
    "dollar_label": "median monthly leak · 12 ops audited",
    "testimonial_line": "We were missing 47 emergency calls a month. The AI agent picked up the first one at 11:47 PM and booked a $1,400 callout. The build paid for itself in week one.",
    "testimonial_attr": "— MIKE, HVAC OPERATOR, TAMPA BAY",
  },
  "legal": {
    "bg": "#0a0a0a",
    "accent": "#FFD60A",
    "badge": "LIVE · INTAKE QUEUE",
    "niche_tag": "SOLO + SMALL FIRM",
    "eyebrow": "partners on phones · billable bleed",
    "headline_plain": "STOP RUNNING\nINTAKE AT\n$400/HOUR.",
    "device_who": "New matter · MVA inquiry",
    "device_num": "(813) 555-0188",
    "device_initial": "AP",
    "dollar": "$76,800",
    "dollar_label": "annual partner-hour leak · solo firm",
    "testimonial_line": "I was eating two hours of intake every day. The agent runs conflict check, qualifies, books the consult. I haven't taken an intake call in 60 days.",
    "testimonial_attr": "— SARAH, MANAGING PARTNER, ORLANDO",
  },
  "healthcare": {
    "bg": "#0a0a0a",
    "accent": "#5EE18A",
    "badge": "LIVE · PATIENT QUEUE",
    "niche_tag": "DENTAL + MEDICAL",
    "eyebrow": "30% of new patients · voicemail",
    "headline_plain": "THIRTY PERCENT\nOF YOUR NEW\nPATIENTS GO\nTO VOICEMAIL.",
    "device_who": "New patient · cleaning",
    "device_num": "(727) 555-0103",
    "device_initial": "JR",
    "dollar": "$23,256",
    "dollar_label": "monthly opportunity · 4-op practice",
    "testimonial_line": "We were losing one new patient a day to voicemail. The agent books and verifies insurance in 47 seconds. Our chair utilization is up 18%.",
    "testimonial_attr": "— DR. KIM, DSO, ST. PETERSBURG",
  },
  "restaurants": {
    "bg": "#0a0a0a",
    "accent": "#FF003C",
    "badge": "LIVE · DINNER RUSH",
    "niche_tag": "INDEPENDENT F+B",
    "eyebrow": "host can't answer · every night",
    "headline_plain": "PHONE RINGS\nFORTY-SEVEN\nTIMES. HOST\nPICKS UP SIX.",
    "device_who": "Party of 8 · 8pm Friday",
    "device_num": "(813) 555-0177",
    "device_initial": "AT",
    "dollar": "$6,052",
    "dollar_label": "monthly lost covers · independent",
    "testimonial_line": "We were turning into OpenTable's voicemail every Friday. Now the agent books parties, runs catering inquiries, sends the location pin. Host stays on the floor.",
    "testimonial_attr": "— JAMES, OWNER, YBOR CITY",
  },
  "plumbing": {
    "bg": "#0a0a0a",
    "accent": "#FFD60A",
    "badge": "BREAKING · 11:47 PM",
    "niche_tag": "EMERGENCY DISPATCH",
    "eyebrow": "burst pipe doesn't care · it's late",
    "headline_plain": "WHO ANSWERS\nYOUR PHONE\nAT ELEVEN\nFORTY-SEVEN PM?",
    "device_who": "BURST PIPE · master bath",
    "device_num": "(813) 555-0199",
    "device_initial": "RG",
    "dollar": "$21,424",
    "dollar_label": "after-hours bleed · monthly",
    "testimonial_line": "I'm a 2-truck operator. I was the on-call guy. Now the agent qualifies, dispatches my apprentice for the easy stuff, only wakes me for the real ones.",
    "testimonial_attr": "— DAVE, PLUMBING OWNER, BRANDON",
  },
  "roofing": {
    "bg": "#0a0a0a",
    "accent": "#FF003C",
    "badge": "BREAKING · STORM SURGE",
    "niche_tag": "ROOFING CONTRACTORS",
    "eyebrow": "next hurricane · 18 days out",
    "headline_plain": "LAST STORM\nYOU LOST\nFORTY GRAND\nIN INSPECTIONS.",
    "device_who": "Storm damage · inspection",
    "device_num": "(813) 555-0156",
    "device_initial": "TS",
    "dollar": "$52,200",
    "dollar_label": "monthly opportunity · storm season",
    "testimonial_line": "Hurricane Milton hit and we got 41× our normal call volume in 72 hours. The agent captured 95% of it. Our crew booked 38 inspections in three days.",
    "testimonial_attr": "— TONY, ROOFING OWNER, ST. PETE",
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
  # Convert headline newlines to <br> so it renders in HTML
  headline = data["headline_plain"].replace("\n", "<br>")
  placeholders = {
    "$BG_COLOR": data["bg"],
    "$ACCENT_COLOR": data["accent"],
    "$BADGE": data["badge"],
    "$NICHE_TAG": data["niche_tag"],
    "$EYEBROW": data["eyebrow"],
    "$HEADLINE_PLAIN": headline,
    "$DEVICE_WHO": data["device_who"],
    "$DEVICE_NUM": data["device_num"],
    "$DEVICE_INITIAL": data["device_initial"],
    "$DOLLAR": data["dollar"],
    "$DOLLAR_LABEL": data["dollar_label"],
    "$TESTIMONIAL_LINE": data["testimonial_line"],
    "$TESTIMONIAL_ATTR": data["testimonial_attr"],
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
  out_dir = os.environ.get("OUT_DIR", "ads/static/editorial-2030")
  template = os.path.join(os.path.dirname(__file__), "ad-templates", "editorial-2030.html")
  chrome = os.environ.get("CHROME_BIN", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
  niches_env = os.environ.get("NICHES", "").strip().split()
  aspects_env = os.environ.get("ASPECTS", "").strip().split()
  niches = niches_env if niches_env else list(NICHES.keys())
  aspects = aspects_env if aspects_env else list(ASPECT_DIMS.keys())

  os.makedirs(out_dir, exist_ok=True)
  print(f"==> v166 editorial-2030: rendering {len(niches)} niches × {len(aspects)} aspects = {len(niches)*len(aspects)} ads")
  if not os.path.exists(chrome):
    print(f"  ! Chrome binary not found at {chrome}. Set CHROME_BIN env to override.")
    print(f"    HTML still emitted into {out_dir}/_html for manual review.")
    html_only = True
  else:
    html_only = False

  for n in niches:
    if n not in NICHES:
      print(f"  ! skip unknown niche: {n}")
      continue
    for a in aspects:
      html_str, w, h = build_html(template, n, a)
      with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as f:
        f.write(html_str); html_path = f.name
      out_path = os.path.join(out_dir, f"TYA_{n}_editorial-2030_{a}.png")
      if html_only:
        os.makedirs(os.path.join(out_dir, "_html"), exist_ok=True)
        debug_html = os.path.join(out_dir, "_html", f"TYA_{n}_editorial-2030_{a}.html")
        with open(debug_html, "w") as f:
          f.write(html_str)
        print(f"  · html-only mode: {debug_html}")
        os.unlink(html_path)
        continue
      subprocess.run([
        chrome, "--headless=new", "--disable-gpu", "--no-sandbox",
        f"--window-size={w},{h}", "--hide-scrollbars",
        f"--screenshot={out_path}", "--default-background-color=00000000",
        f"file://{html_path}",
      ], capture_output=True)
      os.unlink(html_path)
      ok = os.path.exists(out_path) and os.path.getsize(out_path) > 1000
      print(f"  {'OK' if ok else 'FAIL'} {out_path}")
  print("==> done")
