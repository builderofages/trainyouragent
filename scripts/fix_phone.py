#!/usr/bin/env python3
# v46a: scrub fake (813) 555-0142 from all pages.
import re, pathlib

FILES = [
    "src/components/AgentSimulator.tsx",
    "src/pages/Demos.tsx",
    "src/pages/LocationPage.tsx",
    "src/pages/Pricing.tsx",
    "src/pages/VerticalPage.tsx",
    "src/pages/SolutionConfigurator.tsx",
    "src/pages/VersusPage.tsx",
    "src/pages/CaseStudies.tsx",
    "src/pages/Technology.tsx",
    "src/pages/DemoRequest.tsx",
    "src/pages/DemoVideo.tsx",
]
ROOT = pathlib.Path(__file__).resolve().parent.parent

def fix(path):
    p = ROOT / path
    src = p.read_text()
    orig = src

    # 1. Constants — repoint to Cal.com.
    src = src.replace(
        'const HERO_PHONE_DISPLAY = "(813) 555-0142";',
        'const HERO_PHONE_DISPLAY = "Book a 15-min Zoom";',
    )
    src = src.replace(
        'const HERO_PHONE_TEL = "+18135550142";',
        'const HERO_PHONE_TEL = "https://cal.com/trainyouragent/30min";',
    )

    # 2. tel: anchor template — strip tel: prefix and add target/rel.
    #    href={`tel:${HERO_PHONE_TEL}`}  ->  href={HERO_PHONE_TEL} target="_blank" rel="noopener"
    src = re.sub(
        r'href=\{`tel:\$\{HERO_PHONE_TEL\}`\}',
        'href={HERO_PHONE_TEL} target="_blank" rel="noopener"',
        src,
    )
    # Edge: href={`tel:${HERO_PHONE_TEL}`} without {} delimit
    src = re.sub(
        r'`tel:\$\{HERO_PHONE_TEL\}`',
        'HERO_PHONE_TEL',
        src,
    )

    # 3. AgentSimulator inline string.
    src = src.replace(
        'or call us — (813) 555-0142.',
        'or book a 15-min Zoom at cal.com/trainyouragent/30min.',
    )

    # 4. LocationPage telephone schema field — drop fake number entirely
    src = src.replace(
        'telephone: HERO_PHONE_TEL,',
        '// telephone omitted until real number is published',
    )

    # 5. "Call us at ..." aria/text adjustments.
    src = src.replace(
        'aria-label={`Call us at ${HERO_PHONE_DISPLAY}`}',
        'aria-label="Book a 15-min Zoom"',
    )
    src = src.replace(
        '`Call us: ${HERO_PHONE_DISPLAY}`',
        'HERO_PHONE_DISPLAY',
    )
    src = src.replace(
        'Or call us: {HERO_PHONE_DISPLAY}',
        '{HERO_PHONE_DISPLAY}',
    )
    src = src.replace(
        'Call us: {HERO_PHONE_DISPLAY}',
        '{HERO_PHONE_DISPLAY}',
    )

    if src != orig:
        p.write_text(src)
        print(f"FIXED: {path}")
    else:
        print(f"UNCHANGED: {path}")

for f in FILES:
    fix(f)
