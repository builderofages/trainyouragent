// src/lib/og.ts
// Single helper to build /api/og URLs for every page.
// Keeps the OG meta-injection pattern consistent.
//
// Usage:
//   const url = ogUrl({ title: "Pricing", subtitle: "Sub", type: "page" });
//   <meta property="og:image" content={url} />

export type OgType = "page" | "post" | "tool" | "local" | "trust";

export interface OgUrlOptions {
  title: string;
  subtitle?: string;
  type?: OgType;
  badge?: string;
}

const SITE_URL = "https://trainyouragent.com";

function clip(s: string | undefined, n = 120): string {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export function ogUrl(opts: OgUrlOptions): string {
  const params = new URLSearchParams();
  params.set("title", clip(opts.title));
  if (opts.subtitle) params.set("subtitle", clip(opts.subtitle));
  if (opts.type) params.set("type", opts.type);
  if (opts.badge) params.set("badge", clip(opts.badge, 24));
  return `${SITE_URL}/api/og?${params.toString()}`;
}

// Lightweight helper to inject all the OG / Twitter meta in one call,
// matching the pattern used across the site.
export function injectOgMeta(args: {
  title: string;
  description?: string;
  url: string;
  ogImage: string;
  ogType?: string;
}) {
  if (typeof document === "undefined") return;
  const { title, description, url, ogImage, ogType = "website" } = args;
  document.title = title;

  const setM = (sel: string, attr: "name" | "property", key: string, value: string) => {
    let el = document.querySelector(sel) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value);
  };

  if (description) setM(`meta[name='description']`, "name", "description", description);
  setM(`meta[property='og:title']`, "property", "og:title", title);
  if (description) setM(`meta[property='og:description']`, "property", "og:description", description);
  setM(`meta[property='og:url']`, "property", "og:url", url);
  setM(`meta[property='og:type']`, "property", "og:type", ogType);
  setM(`meta[property='og:image']`, "property", "og:image", ogImage);
  setM(`meta[property='og:image:width']`, "property", "og:image:width", "1200");
  setM(`meta[property='og:image:height']`, "property", "og:image:height", "630");
  setM(`meta[name='twitter:card']`, "name", "twitter:card", "summary_large_image");
  setM(`meta[name='twitter:title']`, "name", "twitter:title", title);
  if (description) setM(`meta[name='twitter:description']`, "name", "twitter:description", description);
  setM(`meta[name='twitter:image']`, "name", "twitter:image", ogImage);

  // canonical
  let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
}
