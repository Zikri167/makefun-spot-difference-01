// Tiny static server for local play-testing of Lantern Lane.
// Serves game/ at http://localhost:8080 — no build step, no network.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const gameRoot = resolve(join(fileURLToPath(import.meta.url), "..", "game"));
const port = Number(process.env.PORT || 8080);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", "http://localhost");
    let path = decodeURIComponent(url.pathname);
    if (path === "/") path = "/index.html";
    const file = resolve(join(gameRoot, normalize(path)));
    if (!file.startsWith(gameRoot)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    const body = await readFile(file);
    response.writeHead(200, {
      "content-type": mimeTypes[extname(file)] || "application/octet-stream",
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`Lantern Lane served at http://localhost:${port}`);
});
