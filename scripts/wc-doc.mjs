// scripts/wc-doc.mjs — count words inside the body backtick literal of a doc file
import fs from "fs";

const path = process.argv[2];
if (!path) { console.error("usage: node wc-doc.mjs <file>"); process.exit(1); }

const f = fs.readFileSync(path, "utf8");
const m = f.match(/body:\s*`([\s\S]*?)`\.trim\(\)/);
if (!m) { console.error("no body in", path); process.exit(1); }
const body = m[1]
  .replace(/```[\s\S]*?```/g, "") // drop fenced code blocks
  .replace(/^##.*$/gm, " ")        // drop headings
  .replace(/^#.*$/gm, " ")
  .replace(/[`*_>#-]+/g, " ");
const words = body.split(/\s+/).filter(Boolean).length;
console.log(`${path}: ${words}`);
