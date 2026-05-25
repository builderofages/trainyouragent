// src/lib/lazyWithReload.ts — v168
//
// THE definitive fix for "white screen on every click after a deploy."
//
// The bug: React.lazy() wraps dynamic imports. When a deploy lands, the
// user's index.html still references OLD chunk hashes. Their next nav
// fires `import('/assets/Pricing-OLD-HASH.js')` → 404 → throws.
// React Suspense CATCHES the throw and renders the fallback indefinitely
// because the import is never retried — so `window.unhandledrejection`
// never fires, and the chunk-recovery listener in main.tsx never sees it.
//
// Fix: wrap every lazy() call. On import failure, retry once after 600ms
// (handles transient CDN blips). If it still fails, force a hard reload
// with a cache-bust so the browser fetches fresh index.html and the
// current chunk hashes. Single-shot guard via sessionStorage so we never
// infinite-loop if the reload also fails.

import { lazy, type ComponentType } from "react";

const RELOAD_GUARD = "tya:lazy-reload-fired";

export function lazyWithReload<T extends ComponentType<unknown>>(
  loader: () => Promise<{ default: T }>,
): ReturnType<typeof lazy<T>> {
  return lazy(async () => {
    try {
      return await loader();
    } catch (err) {
      // Retry once after 600ms — handles transient network/CDN blips
      await new Promise((r) => setTimeout(r, 600));
      try {
        return await loader();
      } catch (err2) {
        // Both attempts failed → almost certainly a stale chunk after deploy.
        // Force hard reload with cache-bust so the browser pulls fresh
        // index.html + current chunk hashes.
        if (typeof window !== "undefined") {
          try {
            if (sessionStorage.getItem(RELOAD_GUARD)) {
              // Reload already fired this session — don't infinite-loop.
              // Let the error propagate to the route ErrorBoundary which
              // shows the "this page hiccupped" card with a reload button.
              throw err2;
            }
            sessionStorage.setItem(RELOAD_GUARD, String(Date.now()));
          } catch {}
          // eslint-disable-next-line no-console
          console.warn("[lazyWithReload] chunk load failed twice, hard-reloading", err2);
          const url = new URL(window.location.href);
          url.searchParams.set("_r", String(Date.now()));
          window.location.replace(url.toString());
          // Return a never-resolving promise so React keeps the fallback
          // visible during the reload (instead of flashing an error).
          return new Promise<{ default: T }>(() => {});
        }
        throw err2;
      }
    }
  });
}
