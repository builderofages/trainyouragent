import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";
import path from "path";
import { componentTagger } from "lovable-tagger";
import rssPlugin from "./vite-plugin-rss";

/**
 * Replaces the `__META_PIXEL_ID__` placeholder in index.html (and any other
 * served HTML) with the value of the META_PIXEL_ID env var at build time. If
 * the env var is unset we leave the placeholder in place — the inline gate in
 * index.html short-circuits and no pixel network requests fire (no broken
 * pixel, no 404 noscript image in the network tab).
 */
function metaPixelHtmlPlugin() {
  const id = process.env.META_PIXEL_ID || "";
  return {
    name: "tya-meta-pixel-html",
    transformIndexHtml(html: string) {
      if (!id) return html;
      return html.split("__META_PIXEL_ID__").join(id);
    },
  };
}

/**
 * v97: GA4 placeholder replacement — same pattern as Meta Pixel.
 * Set GA4_MEASUREMENT_ID env var in Vercel (e.g. G-XXXXXXXXXX) and
 * the wrapper in index.html will pick it up at build time. When unset,
 * placeholder stays and the inline boot script short-circuits cleanly.
 */
function ga4HtmlPlugin() {
  const id = process.env.GA4_MEASUREMENT_ID || "";
  return {
    name: "tya-ga4-html",
    transformIndexHtml(html: string) {
      if (!id) return html;
      return html.split("__GA4_MEASUREMENT_ID__").join(id);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    // MDX must run before react() so .mdx files become JSX before SWC sees them.
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: "frontmatter" }],
          remarkGfm,
        ],
        providerImportSource: "@mdx-js/react",
      }),
    },
    react(),
    mode === "development" && componentTagger(),
    metaPixelHtmlPlugin(),
    ga4HtmlPlugin(),
    rssPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Mirror the HTML-side pixel ID into the JS bundle so app code can call
    // fbq() with confidence. Empty string when unset.
    "import.meta.env.VITE_META_PIXEL_ID": JSON.stringify(process.env.META_PIXEL_ID || ""),
    // v97: same for GA4 — lets SPA route changes call window.gtag('event',...)
    "import.meta.env.VITE_GA4_MEASUREMENT_ID": JSON.stringify(process.env.GA4_MEASUREMENT_ID || ""),
  },
  // v41: manual chunks — keep the main entry small.
  // v274: split heavy vendor libs into dedicated chunks so no chunk exceeds
  // the 500kb warning threshold. Each lazy route only loads what it needs.
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // v274: blog posts — one chunk per MDX file so /blog/:slug only
          // ships the body the visitor is actually reading (was 800kb monolith).
          if (id.includes("/src/content/blog/") && id.endsWith(".mdx")) {
            const m = id.match(/\/src\/content\/blog\/([^/]+)\.mdx$/);
            if (m) return `blog-post-${m[1]}`;
          }
          if (!id.includes("node_modules")) return;
          // React core — eager on every page
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router") ||
            id.includes("/scheduler/")
          ) return "vendor-react";
          // Charting — only loaded by /metrics, /admin/*, dashboards
          if (id.includes("recharts") || id.includes("/d3-")) return "vendor-recharts";
          // Animation — Framer is used widely; GSAP only on a handful of pages
          if (id.includes("framer-motion")) return "vendor-framer";
          if (id.includes("/gsap/") || id.includes("@gsap/")) return "vendor-gsap";
          // 3D — only on /architecture and a couple of demo pages
          if (id.includes("/three/") || id.includes("@react-three")) return "vendor-three";
          // Voice agent demo
          if (id.includes("@vapi-ai")) return "vendor-vapi";
          // Icons + small UI primitives
          if (id.includes("lucide-react")) return "vendor-icons";
          // Radix UI primitives — used by shadcn components
          if (id.includes("@radix-ui")) return "vendor-radix";
          // PDF generation — only triggered by lead-magnet downloads
          if (id.includes("jspdf")) return "vendor-pdf";
          // Supabase client — used by portal + admin
          if (id.includes("@supabase")) return "vendor-supabase";
          // Tanstack query — shared infra
          if (id.includes("@tanstack")) return "vendor-tanstack";
          // Toaster stack
          if (id.includes("/sonner/") || id.includes("react-hot-toast")) return "vendor-toast";
          // Date / time helpers
          if (id.includes("date-fns")) return "vendor-date";
          // Locomotive scroll + react-spring + canvas-confetti + embla — heavier UX libs
          if (id.includes("locomotive-scroll")) return "vendor-locomotive";
          if (id.includes("react-spring") || id.includes("@react-spring")) return "vendor-spring";
          if (id.includes("canvas-confetti")) return "vendor-confetti";
          if (id.includes("embla-carousel")) return "vendor-embla";
          // Form + helpers
          if (id.includes("react-hook-form") || id.includes("@hookform")) return "vendor-form";
          if (id.includes("react-helmet")) return "vendor-helmet";
          // Catch-all node_modules bucket so misc small libs don't end up in main entry
          return "vendor-misc";
        },
      },
    },
  },
}));
