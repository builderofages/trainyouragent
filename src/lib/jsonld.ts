// src/lib/jsonld.ts — v47A
// Helpers for emitting JSON-LD structured data into <head>.
// Usage:
//   useEffect(() => injectJsonLd("org-home", organizationLd()), []);

const SITE_URL = "https://trainyouragent.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/alexandermillsai";

export type Json = Record<string, unknown> | Array<Record<string, unknown>>;

/** Inject (or replace) a <script type="application/ld+json" id={id}> tag into document.head. */
export function injectJsonLd(id: string, data: Json) {
  if (typeof document === "undefined") return;
  const fullId = `tya-jsonld-${id}`;
  let el = document.getElementById(fullId) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = fullId;
    document.head.appendChild(el);
  }
  try {
    el.textContent = JSON.stringify(data);
  } catch {
    /* noop */
  }
}

/** Inject multiple JSON-LD blocks at once. */
export function injectJsonLdMany(blocks: Array<{ id: string; data: Json }>) {
  for (const b of blocks) injectJsonLd(b.id, b.data);
}

/* ------------------------------------------------------------------ */
/*  Schema.org helpers                                                */
/* ------------------------------------------------------------------ */

export function organizationLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TrainYourAgent",
    legalName: "TrainYourAgent LLC",
    url: SITE_URL,
    logo: `${SITE_URL}/og.png`,
    foundingDate: "2022",
    founder: {
      "@type": "Person",
      name: "Alexander Mills",
      url: LINKEDIN_URL,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tampa",
      addressRegion: "FL",
      addressCountry: "US",
    },
    sameAs: [LINKEDIN_URL],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@trainyouragent.com",
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        contactType: "press",
        email: "press@trainyouragent.com",
      },
      {
        "@type": "ContactPoint",
        contactType: "security",
        email: "security@trainyouragent.com",
      },
    ],
  };
}

export function personLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alexander Mills",
    jobTitle: "Founder, TrainYourAgent",
    url: `${SITE_URL}/about`,
    sameAs: [LINKEDIN_URL],
    worksFor: {
      "@type": "Organization",
      name: "TrainYourAgent",
      url: SITE_URL,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tampa",
      addressRegion: "FL",
      addressCountry: "US",
    },
    knowsAbout: [
      "Artificial Intelligence",
      "Voice Agents",
      "Conversational AI",
      "SMB Automation",
      "AI Agency Operations",
      "Anthropic Claude",
      "Generative AI for Business",
    ],
  };
}

export function breadcrumbLd(items: Array<{ name: string; url: string }>): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

export function faqPageLd(faqs: Array<{ question: string; answer: string }>): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export type ArticleLdInput = {
  title: string;
  slug: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  authorName?: string;
};

export function articleLd(post: ArticleLdInput): Json {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image ? [post.image] : undefined,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      "@type": "Person",
      name: post.authorName || "Alexander Mills",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "TrainYourAgent",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
  };
}
