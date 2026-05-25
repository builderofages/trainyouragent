import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// v163: Chunk-load auto-recovery. When we deploy a new build, the user's
// already-loaded index.html references the OLD chunk hashes. Their next
// navigation tries to fetch /assets/index-OLD-HASH.js which Vercel has
// replaced — the chunk 404s and the route renders blank. The fix:
// intercept dynamic-import errors and force a hard reload to pick up the
// fresh index.html with current chunk references. Single-shot per session
// so we don't infinite-loop if the reload also fails.
(function installChunkReloadGuard() {
 if (typeof window === "undefined") return;
 const RELOAD_FLAG = "tya:chunk-recover-fired";
 const onChunkFail = (msg: string) => {
 try {
 if (sessionStorage.getItem(RELOAD_FLAG)) return;
 sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
 } catch { /* private mode — proceed anyway */ }
 // eslint-disable-next-line no-console
 console.warn("[chunk-recover] forcing hard reload —", msg);
 // Cache-bust so the new index.html is fetched, not served from disk cache
 const url = new URL(window.location.href);
 url.searchParams.set("_r", String(Date.now()));
 window.location.replace(url.toString());
 };
 window.addEventListener("error", (e) => {
 const tag = (e.target as HTMLElement | null)?.tagName;
 if (tag === "SCRIPT" || tag === "LINK") {
 const src = (e.target as HTMLScriptElement | HTMLLinkElement | null);
 const url = (src && ("src" in src ? src.src : src.href)) || "";
 if (url.includes("/assets/") || url.includes(".js") || url.includes(".css")) {
 onChunkFail("asset 404: " + url);
 }
 }
 }, true);
 window.addEventListener("unhandledrejection", (e) => {
 const m = String(e.reason?.message || e.reason || "");
 if (/Loading chunk|ChunkLoadError|Failed to fetch dynamically imported|Importing a module script failed/i.test(m)) {
 onChunkFail("dynamic-import: " + m.slice(0, 120));
 }
 });
})();

createRoot(document.getElementById("root")!).render(<App />);
