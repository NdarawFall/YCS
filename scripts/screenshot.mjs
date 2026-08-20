// Capture d'écran d'une page de l'app, pour vérifier un rendu de visu.
//
// Le serveur de dev doit tourner (npm run dev).
//
//   npm run screenshot                                  -> accueil, pleine page
//   npm run screenshot auth/login connexion             -> une autre route
//   npm run screenshot . logo --selector "a[href='/']"  -> un seul élément
//   npm run screenshot . mobile --width 390             -> autre largeur
//
// Sous Git Bash, écris les routes SANS slash initial (auth/login, pas
// /auth/login) : MSYS convertit « /auth/login » en chemin Windows. Le script
// rattrape le cas, mais autant l'éviter. Utilise « . » pour l'accueil.
//
// Sortie dans screenshots/ (ignoré par git).

import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith("--"));

function flag(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}

/**
 * Git Bash (MSYS) réécrit tout argument commençant par « / » en chemin Windows :
 * « / » arrive comme « C:/Program Files/Git/ ». On récupère ce qui suit.
 */
function normalizeRoute(raw) {
  if (!raw || raw === ".") return "/";

  const mangled = raw.match(/^[A-Za-z]:[\\/].*?[\\/]Git[\\/](.*)$/);
  if (mangled) return `/${mangled[1]}`;
  if (/^[A-Za-z]:[\\/]/.test(raw)) return "/";

  return raw.startsWith("/") ? raw : `/${raw}`;
}

const route = normalizeRoute(positional[0]);
const name = positional[1] ?? "page";
const selector = flag("selector", null);
const width = Number(flag("width", 1440));
const height = Number(flag("height", 900));
const baseUrl = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";

const outDir = "screenshots";
await mkdir(outDir, { recursive: true });
const outPath = `${outDir}/${name}.png`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });

try {
  const url = new URL(route, baseUrl).href;
  const response = await page.goto(url, { waitUntil: "networkidle" });

  if (!response?.ok()) {
    console.error(`✗ ${url} a répondu ${response?.status() ?? "aucune réponse"}`);
    process.exitCode = 1;
  }

  if (selector) {
    const target = page.locator(selector).first();
    await target.waitFor({ state: "visible", timeout: 10_000 });
    await target.screenshot({ path: outPath });
  } else {
    await page.screenshot({ path: outPath, fullPage: flag("viewport", null) === null });
  }

  console.log(`✓ ${outPath}  (${url}${selector ? `  sélecteur: ${selector}` : ""})`);
} catch (err) {
  console.error(`✗ échec de la capture : ${err.message}`);
  process.exitCode = 1;
} finally {
  await browser.close();
}
