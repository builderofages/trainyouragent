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
  },
  // v41: manual chunks — keep the main entry small. React + router into
  // `vendor-react`, lucide-react / framer-motion into `vendor-ui`.
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return;
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router") ||
            id.includes("/scheduler/")
          ) return "vendor-react";
          if (
            id.includes("lucide-react") ||
            id.includes("framer-motion")
          ) return "vendor-ui";
        },
      },
    },
  },
}));
