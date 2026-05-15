// vite-plugin-rss.ts
// Generates rss.xml and appends blog entries to sitemap.xml at build time.
// Reads MDX frontmatter directly from disk — no React rendering needed.

import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

type Frontmatter = {
  title?: string;
  slug?: string;
  date?: string;
  author?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
};

const SITE = "https://trainyouragent.com";
const BLOG_DIR = path.resolve(__dirname, "src/content/blog");
const PUBLIC_DIR = path.resolve(__dirname, "public");
const OUT_DIR = path.resolve(__dirname, "dist");

function parseFrontmatter(raw: string): Frontmatter {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm: Frontmatter = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1] as keyof Frontmatter;
    let val: string = m[2].trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key === "tags") {
      // Naive parse of inline list: ["a","b"]
      try {
        (fm as Record<string, unknown>).tags = JSON.parse(val.replace(/'/g, '"'));
      } catch {
        (fm as Record<string, unknown>).tags = [];
      }
    } else {
      (fm as Record<string, unknown>)[key] = val;
    }
  }
  return fm;
}

function loadPosts(): Frontmatter[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => parseFrontmatter(fs.readFileSync(path.join(BLOG_DIR, f), "utf8")))
    .filter((p) => p.slug && p.title && p.date)
    .sort((a, b) => (a.date! < b.date! ? 1 : -1));
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildRss(posts: Frontmatter[]): string {
  const items = posts.map((p) => `
    <item>
      <title>${escapeXml(p.title!)}</title>
      <link>${SITE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date!).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt || "")}</description>
      ${p.category ? `<category>${escapeXml(p.category)}</category>` : ""}
      ${p.author ? `<author>${escapeXml(p.author)}</author>` : ""}
    </item>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Train Your Agent — Blog</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Real builds, real numbers. AI voice, AI marketing, AI infrastructure for vertical SMB.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;
}

function mergeSitemap(posts: Frontmatter[]) {
  const sourceSitemap = path.join(PUBLIC_DIR, "sitemap.xml");
  const distSitemap = path.join(OUT_DIR, "sitemap.xml");
  if (!fs.existsSync(distSitemap)) return;
  const current = fs.readFileSync(distSitemap, "utf8");

  const blogEntries = posts.map((p) => `
  <url>
    <loc>${SITE}/blog/${p.slug}</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("");

  const blogIndex = `
  <url>
    <loc>${SITE}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

  // Insert before closing </urlset>
  const merged = current.replace("</urlset>", `${blogIndex}${blogEntries}\n</urlset>`);
  fs.writeFileSync(distSitemap, merged, "utf8");
  // also keep public/sitemap.xml in sync for dev
  if (fs.existsSync(sourceSitemap)) {
    // no-op; we only mutate the build output
  }
}

export default function rssPlugin(): Plugin {
  return {
    name: "vite-plugin-rss",
    apply: "build",
    closeBundle() {
      const posts = loadPosts();
      if (!posts.length) return;
      // Write rss.xml
      if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
      fs.writeFileSync(path.join(OUT_DIR, "rss.xml"), buildRss(posts), "utf8");
      // Append to sitemap
      try {
        mergeSitemap(posts);
      } catch (e) {
        // Sitemap merge is best-effort; don't fail the build.
        // eslint-disable-next-line no-console
        console.warn("[rss] sitemap merge skipped:", (e as Error).message);
      }
      // eslint-disable-next-line no-console
      console.log(`[rss] wrote rss.xml (${posts.length} posts) and merged sitemap.xml`);
    },
  };
}
