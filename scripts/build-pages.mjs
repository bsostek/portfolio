// Builds the static GitHub Pages version of the site and copies it into the
// bsostek.github.io repo next to this one. Commit and push that repo to publish.
//
// The Pages repo also hosts other things (e.g. /backyard-blitz), so this only
// ever deletes files it copied in on a previous run, as recorded in MANIFEST.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const VERCEL_URL = "https://mysite-pi-jet.vercel.app";
const MANIFEST = ".portfolio-sync-manifest";
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

function listFiles(dir, base = dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory()
      ? listFiles(full, base)
      : [path.relative(base, full).split(path.sep).join("/")];
  });
}

const manifestPath = path.join(pagesRepo, MANIFEST);
const previous = new Set(
  existsSync(manifestPath) ? readFileSync(manifestPath, "utf8").split("\n").filter(Boolean) : []
);
const next = listFiles(outDir);

// Refuse to overwrite anything this script didn't put there.
const conflicts = next.filter((f) => !previous.has(f) && existsSync(path.join(pagesRepo, f)));
if (conflicts.length) {
  console.error(
    `Stopping: these files in ${pagesRepo} weren't created by this script and would be overwritten:\n  ` +
      conflicts.join("\n  ") +
      `\nRemove or rename them there, or add them to ${MANIFEST} if they're safe to replace.`
  );
  process.exit(1);
}

for (const file of previous) {
  rmSync(path.join(pagesRepo, file), { force: true });
}
cpSync(outDir, pagesRepo, { recursive: true });
writeFileSync(manifestPath, next.join("\n") + "\n");

// Drop directories emptied by removing stale build files (e.g. old _next chunks).
function pruneEmptyDirs(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    pruneEmptyDirs(full);
    if (readdirSync(full).length === 0) rmSync(full, { recursive: true });
  }
}
pruneEmptyDirs(pagesRepo);

console.log(`Copied the static site into ${pagesRepo}. Commit and push there to publish.`);
