// One-time, SHA-pinned vendoring of the portfolio PDMA-2 presentation into this repository.
// The resulting source and images are committed here; forks and releases never need the portfolio host.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.resolve(here, "..");
const sourceSha = "3dc6ac3aa95149c2cabaf21701abcff75af33e87";
const work = fs.mkdtempSync(path.join(os.tmpdir(), "pdma-vendor-"));
const upstream = path.join(work, "portfolio");
const run = (command, args, cwd) => {
  const r = spawnSync(command, args, { cwd, encoding: "utf8", stdio: "inherit" });
  if (r.status !== 0) throw new Error(`${command} exited ${r.status}`);
};
const original = (...p) => path.join(upstream, ...p);
const target = (...p) => path.join(app, ...p);

function copyFile(rel) {
  if (!fs.existsSync(original(rel))) throw new Error(`Missing upstream dependency: ${rel}`);
  fs.mkdirSync(path.dirname(target(rel)), { recursive: true });
  fs.cpSync(original(rel), target(rel), { recursive: true, force: false, errorOnExist: false });
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

try {
  run("git", ["clone", "--depth=1", "--filter=blob:none", "--sparse", "--branch=main", "https://github.com/jimmarkunas/portfolio.git", upstream]);
  // A later portfolio commit must not change which deck we migrate.
  run("git", ["fetch", "--depth=1", "origin", sourceSha], upstream);
  run("git", ["checkout", "--detach", sourceSha], upstream);
  run("git", ["sparse-checkout", "set", "src", "public/pdma2026-2", "public/pdma2026-templates", "public/pdma2026-templates-lab"], upstream);
  const rev = spawnSync("git", ["rev-parse", "HEAD"], { cwd: upstream, encoding: "utf8" }).stdout.trim();
  if (rev !== sourceSha) throw new Error(`Pinned source moved: expected ${sourceSha}, found ${rev}. Stop instead of silently importing another revision.`);

  for (const rel of [
    "src/app/pdma2026-2",
    "src/content/pdma2026-2",
    "src/components/presentation",
    "src/components/pbds/orb",
    "src/hooks/usePresentationFullscreen.ts",
    "src/hooks/usePresentationInsets.ts",
    "src/hooks/usePresentationNavigation.ts",
    "src/lib/presentation.ts",
    "public/pdma2026-2",
    "public/pdma2026-templates",
    "public/pdma2026-templates-lab",
  ]) copyFile(rel);

  // Pull transitive aliased source dependencies, without copying unrelated portfolio routes.
  const pattern = /(?:from\s*|import\s*\(|import\s*)["'](@\/[^"']+)["']/g;
  let added = true;
  let rounds = 0;
  while (added) {
    added = false;
    if (++rounds > 20) throw new Error("Unexpected circular dependency discovery");
    for (const file of walk(target("src")).filter(f => /\.(tsx?|jsx?)$/.test(f))) {
      const src = fs.readFileSync(file, "utf8");
      for (const match of src.matchAll(pattern)) {
        const rel = "src/" + match[1].slice(2);
        const candidates = [rel, ...[".tsx", ".ts", ".jsx", ".js", ".css", ".json", ".svg"].map(ext => rel + ext),
          ...["index.tsx", "index.ts", "index.jsx", "index.js"].map(ext => path.join(rel, ext))];
        const found = candidates.find(x => fs.existsSync(original(x)) && fs.statSync(original(x)).isFile());
        if (!found) throw new Error(`Unresolved source alias ${match[1]} from ${file}`);
        if (!fs.existsSync(target(found))) { copyFile(found); added = true; }
      }
    }
  }

  // Every URL remains relative to index.html, so the same build works on GitHub Pages,
  // an arbitrary website folder, file:// from a ZIP, and inside Electron.
  for (const file of walk(target("src")).filter(f => /\.(tsx?|jsx?|css)$/.test(f))) {
    let content = fs.readFileSync(file, "utf8");
    content = content.replaceAll("/pdma2026-templates-lab/", "./pdma2026-templates-lab/")
      .replaceAll("/pdma2026-templates/", "./pdma2026-templates/")
      .replaceAll("/pdma2026-2/", "./pdma2026-2/")
      .replaceAll("/pdma2026/", "./pdma2026-2/");
    content = content.replace('export const PDMA_EXERCISE_ROUTE = "./pdma2026-2/exercise";', 'export const PDMA_EXERCISE_ROUTE = "#exercise";');
    content = content.replace('export const PDMA_EXERCISE_ROUTE = "/pdma2026/exercise";', 'export const PDMA_EXERCISE_ROUTE = "#exercise";');
    fs.writeFileSync(file, content);
  }
  // Next.js route wrappers are not executable inside Vite. The standalone App owns routing.
  for (const rel of ["src/app/pdma2026-2/page.tsx", "src/app/pdma2026-2/layout.tsx", "src/app/pdma2026-2/exercise/page.tsx"])
    fs.rmSync(target(rel), { force: true });

  if (!fs.existsSync(target("public/pdma2026-2/slide-01/canonical-asterisk.svg")))
    throw new Error("Slide 01 assets were not vendored");
  const manifest = fs.readFileSync(target("src/app/pdma2026-2/presentation/pdma2026Manifest.tsx"), "utf8");
  if (!manifest.includes("PDMA2026_SLIDE_COUNT = 16"))
    throw new Error("Expected 16-slide presentation");
  console.log(`VENDOR_IMPORT_PASS source=${sourceSha} slides=16 file_count=${walk(target("src")).length + walk(target("public")).length}`);
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}
