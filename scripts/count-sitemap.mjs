// scripts/count-sitemap.mjs
// Roughly count how many URLs the sitemap handler will emit, by inspecting the source constants.

import fs from "fs";

const src = fs.readFileSync("api/sitemap.xml.ts", "utf8");

function arrLen(name) {
  const re = new RegExp(`const ${name}[^=]*=\\s*\\[([\\s\\S]*?)\\];`, "m");
  const m = src.match(re);
  if (!m) return 0;
  return (m[1].match(/"/g) || []).length / 2 || 0;
}
function staticLen() {
  const re = /const STATIC_PAGES[\s\S]*?\[([\s\S]*?)\];/;
  const m = src.match(re);
  if (!m) return 0;
  return (m[1].match(/path:/g) || []).length;
}

const stat = staticLen();
const verticals = arrLen("VERTICAL_SLUGS");
const solutions = arrLen("SOLUTIONS_PILLARS");
const vs = arrLen("VS_COMPETITORS");
const blog = arrLen("BLOG_SLUGS");
const locVerticals = arrLen("LOCATION_VERTICALS");
const locCities = arrLen("LOCATION_CITIES");
const altC = arrLen("ALT_COMPETITORS");
const altV = arrLen("ALT_VERTICALS");
const localCities = arrLen("LOCAL_CITIES");
const localVerticals = arrLen("LOCAL_VERTICALS");
const docs = arrLen("DOC_SLUGS");

const total = stat + verticals + solutions + vs + blog
            + (locVerticals * locCities)
            + (altC * altV)
            + 1 /* /local hub */ + (localCities * localVerticals)
            + docs;

console.log({ stat, verticals, solutions, vs, blog,
              location: locVerticals * locCities,
              alternatives: altC * altV,
              local: 1 + (localCities * localVerticals),
              docs, total });
