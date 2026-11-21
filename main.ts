// Lantern Lane — entrypoint for the make.fun program/v1 harness.
// Copies game/ and screenshots/ next to this file into the output directory
// (MAKEFUN_OUTPUT_DIR, or /output on the grader) and writes dossier.json
// there with buildDossier from the kit's vendored library. Node 22 stdlib
// only, no network, and fully deterministic: two runs write the same bytes.

import { cp, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-game.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

const gameSource = join(repoRoot, "game");
const screenshotsSource = join(repoRoot, "screenshots");
const gameOut = join(outputDir, "game");
const screenshotsOut = join(outputDir, "screenshots");

await mkdir(outputDir, { recursive: true });
await cp(gameSource, gameOut, { recursive: true });
await cp(screenshotsSource, screenshotsOut, { recursive: true });

const dossier = await buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots_max: 4,
  screenshot_max_bytes: 262144,
  game_max_files: 993,
  game_max_bytes: 50331648,
  path_max_bytes: 1000,
});

await writeFile(join(outputDir, "dossier.json"), Buffer.from(dossier));
console.log(`Lantern Lane: wrote ${outputDir}/dossier.json`);
