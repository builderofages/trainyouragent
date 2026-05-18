// src/components/BuiltInPublic.tsx
// v65: Built-in-public timeline — pulls commits through /api/github-velocity
// proxy (cached, rate-limit-safe) instead of api.github.com directly.
// Refreshes every 60s. Caches in sessionStorage so navigating around the
// site doesn't re-burn API quota.
//
// Parses commit messages matching `vN[a-z]?: {description}` and renders a
// vertical timeline (date · ship version · description). Skips merge commits
// and anything without a v-prefix so the timeline reads as a real ship log.

import { useEffect, useState } from "react";

const REPO_API = "/api/github-velocity";
// v66: bumped cache key to v4 — sessionStorage shape carried over; bumping
// guarantees a fresh fetch off the new /api/github-velocity payload shape.
const CACHE_KEY = "tya:bip:commits:v4";
const CACHE_TTL_MS = 60 * 1000;

export type BipCommit = {
  sha: string;
  date: string;
  url: string;
  version: string;       // e.g. "v36c"
  description: string;   // e.g. "fix Vercel build — add .js to ./_lib imports"
  rawMessage: string;
};

type CachedPayload = { ts: number; items: BipCommit[] };

function readCache(): CachedPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as CachedPayload;
    if (Date.now() - p.ts > CACHE_TTL_MS) return null;
    return p;
  } catch { return null; }
}

function writeCache(items: BipCommit[]) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), items }));
  } catch {}
}

// Accepts "v36c: fix Vercel build …", "v34: trust pages …", "v38: …"
const V_RE = /^(v\d+[a-z]?)\s*:\s*(.+)$/i;

// Accepts either the raw GitHub commit shape OR the trimmed shape returned
// by /api/github-velocity (sha, shortSha, message, date, url, author).
export function parseCommits(raw: any[]): BipCommit[] {
  if (!Array.isArray(raw)) return [];
  const out: BipCommit[] = [];
  for (const c of raw) {
    // Trimmed shape from /api/github-velocity has top-level `message` / `date`
    // / `url`. Raw GitHub shape has `commit.message` / `commit.author.date` /
    // `html_url`. Support both for forward/backward compat.
    const msgRaw: string =
      (typeof c?.message === "string" ? c.message : undefined) ??
      (c?.commit?.message ?? "");
    const firstLine = msgRaw.split("\n")[0]?.trim() ?? "";
    // skip merges
    if (/^merge /i.test(firstLine)) continue;
    const m = firstLine.match(V_RE);
    if (!m) continue;
    const sha = String(c?.sha ?? "");
    const date =
      (typeof c?.date === "string" ? c.date : undefined) ??
      c?.commit?.author?.date ??
      c?.commit?.committer?.date ??
      "";
    const url =
      (typeof c?.url === "string" ? c.url : undefined) ??
      c?.html_url ??
      `https://github.com/builderofages/trainyouragent/commit/${sha}`;
    out.push({
      sha: sha.slice(0, 7),
      date,
      url,
      version: m[1],
      description: m[2].trim(),
      rawMessage: firstLine,
    });
  }
  return out;
}

function fmtDate(iso: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return iso.slice(0, 10); }
}

type Props = {
  title?: string;
  eyebrow?: string;
  limit?: number;
  className?: string;
};

export default function BuiltInPublic({
  title = "Built in public.",
  eyebrow = "Ship log",
  limit = 10,
  className = "",
}: Props) {
  const [items, setItems] = useState<BipCommit[]>(() => readCache()?.items ?? []);
  const [loading, setLoading] = useState<boolean>(items.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const cached = readCache();
        if (cached && cached.items.length) {
          setItems(cached.items);
          setLoading(false);
          // Still refresh in the background after using cache
        }
        const r = await fetch(REPO_API, { headers: { Accept: "application/json" } });
        if (!r.ok) throw new Error(`velocity ${r.status}`);
        const data = await r.json();
        if (cancelled) return;
        // Server-side proxy returns { commits: [...trimmed], ... }
        const commits = Array.isArray(data?.commits) ? data.commits : data;
        const parsed = parseCommits(commits);
        setItems(parsed);
        setError(null);
        writeCache(parsed);
      } catch (e: any) {
        if (cancelled) return;
        setError(String(e?.message || e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const id = window.setInterval(load, CACHE_TTL_MS);
    return () => { cancelled = true; window.clearInterval(id); };
  }, []);

  const list = items.slice(0, limit);

  return (
    <section className={`px-5 sm:px-8 py-16 ${className}`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-[12px] uppercase tracking-[0.18em] text-[#185FA5] font-semibold mb-3">{eyebrow}</div>
        <h2 className="text-[26px] sm:text-[36px] leading-tight font-semibold text-[#042C53] mb-2">
          {title}
        </h2>
        <p className="text-[14px] text-slate-600 mb-8">
          Every ship is pushed to{" "}
          <a
            href="https://github.com/builderofages/trainyouragent"
            target="_blank"
            rel="noopener"
            className="text-[#185FA5] hover:text-[#042C53] underline decoration-[#185FA5]/30"
          >
            github.com/builderofages/trainyouragent
          </a>
          . Pulled live from the repo every 60 seconds.
        </p>

        {loading && list.length === 0 && (
          <div className="text-[13px] text-slate-600">Loading ship log…</div>
        )}
        {!loading && error && list.length === 0 && (
          <div className="text-[13px] text-slate-600">
            Couldn't reach GitHub right now — the ship log will reload on the next try.
          </div>
        )}

        <ol className="relative pl-6 border-l border-slate-200 space-y-6">
          {list.map((c) => (
            <li key={c.sha} className="relative">
              <span
                className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-white"
                style={{ background: "#185FA5", boxShadow: "0 0 0 1px #CBDDF1" }}
                aria-hidden="true"
              />
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-[11px] uppercase tracking-[0.14em] text-slate-400 tabular-nums">
                  {fmtDate(c.date)}
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#185FA5]">
                  {c.version}
                </span>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener"
                  className="text-[10px] text-slate-300 hover:text-[#185FA5] tabular-nums"
                  aria-label={`Open commit ${c.sha} on GitHub`}
                >
                  {c.sha}
                </a>
              </div>
              <div className="text-[15px] text-[#042C53] leading-snug mt-1">{c.description}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
