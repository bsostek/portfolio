// Builds the static GitHub Pages version of the site and copies it into the
// bsostek.github.io repo next to this one. Commit and push that repo to publish.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const VERCEL_URL = "https://mysite-pi-jet.vercel.app";
const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "out");
const pagesRepo = path.resolve(root, "..", "bsostek.github.io");

const build = spawnSync("npx", ["next", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: { ...process.env, GITHUB_PAGES: "1", NEXT_PUBLIC_API_BASE: VERCEL_URL },
});
if (build.status !== 0) process.exit(build.status ?? 1);

// Without this, GitHub Pages runs Jekyll and drops the _next folder.
writeFileSync(path.join(outDir, ".nojekyll"), "");

if (!existsSync(path.join(pagesRepo, ".git"))) {
  console.log(`Built to ${outDir}. No repo at ${pagesRepo}, so nothing was copied.`);
  process.exit(0);
}

for (const entry of readdirSync(pagesRepo)) {
  if (entry !== ".git") rmSync(path.join(pagesRepo, entry), { recursive: true, force: true });
}
cpSync(outDir, pagesRepo, { recursive: true });
console.log(`Copied the static site into ${pagesRepo}. Commit and push there to publish.`);
