// Compile + run the sitemap edge function and count <url> entries.
import { execSync } from "child_process";
import fs from "fs";

// Inline-import via dynamic eval using esbuild? Simpler: just count <url>...</url>
// by reading the static-pages array literally + adding generated counts.

const src = fs.readFileSync("api/sitemap.xml.ts", "utf8");

// 1. STATIC_PAGES — count `path:` occurrences inside the array.
const staticBlock = src.match(/const STATIC_PAGES[\s\S]*?\];/)?.[0] || "";
const staticCount = (staticBlock.match(/path:\s*"/g) || []).length;

// 2. VERTICAL_SLUGS — count quoted strings inside the array.
function countArr(name) {
  const m = src.match(new RegExp(`const ${name}\\s*=\\s*\\[([\\s\\S]*?)\\];`));
  if (!m) return 0;
  return (m[1].match(/"[^"]+"/g) || []).length;
}

const verticals = countArr("VERTICAL_SLUGS");
const solutions = countArr("SOLUTIONS_PILLARS");
const vs = countArr("VS_COMPETITORS");
const blog = countArr("BLOG_SLUGS");
const locVert = countArr("LOCATION_VERTICALS");
const locCity = countArr("LOCATION_CITIES");
const altC = countArr("ALT_COMPETITORS");
const altV = countArr("ALT_VERTICALS");
const localCities = countArr("LOCAL_CITIES");
const localVerticals = countArr("LOCAL_VERTICALS");
const docs = countArr("DOC_SLUGS");

const total = staticCount + verticals + solutions + vs + blog
            + (locVert * locCity) + (altC * altV)
            + 1 + (localCities * localVerticals)
            + docs;

console.log({
  staticCount, verticals, solutions, vs, blog,
  location: locVert * locCity,
  alternatives: altC * altV,
  local: 1 + (localCities * localVerticals),
  docs, total,
});
