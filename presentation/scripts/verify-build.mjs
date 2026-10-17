// Proves dist/index.html is one self-contained file: no external script, style, font, image or fetch.
import fs from "node:fs";

const html = fs.readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const files = fs.readdirSync(new URL("../dist/", import.meta.url));
const failures = [];
if (files.length !== 1) failures.push(`dist must contain only index.html, found: ${files.join(", ")}`);
if (/<script[^>]+\bsrc=/i.test(html)) failures.push("external <script src>");
if (/<link[^>]+rel=["']?(stylesheet|preload|modulepreload|icon)/i.test(html)) failures.push("external <link>");
const urlRefs = [...html.matchAll(/url\(\s*["']?(?!data:|#)([^"')]+)/g)].map((m) => m[1]);
if (urlRefs.length) failures.push(`non-inlined CSS url(): ${urlRefs.slice(0, 5).join(", ")}`);
const srcRefs = [...html.matchAll(/\bsrc=["'](?!data:)([^"']+)/g)].map((m) => m[1]);
if (srcRefs.length) failures.push(`non-inlined src: ${srcRefs.slice(0, 5).join(", ")}`);
// JFM-203: the whole presentation ships as one file under a hard 1 MB budget.
const MAX_BYTES = 1024 * 1024;
const bytes = Buffer.byteLength(html);
if (bytes > MAX_BYTES) failures.push(`dist/index.html is ${(bytes / 1024).toFixed(0)} KB, over the ${MAX_BYTES / 1024} KB budget`);
if (!html.includes("Content-Security-Policy")) failures.push("missing offline Content-Security-Policy");
for (const required of ["THE NEW PM OPERATING SYSTEM", "Customer Order Exception Agent", "A.G.E.N.T.S. PRODUCTIZATION KIT"])
  if (!html.includes(required)) failures.push(`missing content: ${required}`);
if (failures.length) { console.error(`VERIFY_BUILD_FAIL\n- ${failures.join("\n- ")}`); process.exit(1); }
console.log(`VERIFY_BUILD_PASS dist/index.html ${(html.length / 1024).toFixed(0)} KB, self-contained`);
