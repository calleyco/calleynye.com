// One-off console audit: loads each route in headless Chromium and captures
// EVERYTHING DevTools would show — JS console API messages, page errors,
// failed requests, AND browser-emitted entries (preload/violation/deprecation/
// rendering/security) via a raw CDP Log session. Run against a running server:
//   node scripts/console-audit.mjs http://127.0.0.1:4188
import { chromium } from "@playwright/test";

const base = process.argv[2] || "http://127.0.0.1:4188";
const routes = [
  "/",
  "/writing",
  "/writing/congratulations-on-your-promotion",
  "/writing/compressive-images-revisited",
  "/writing/which-model-of-disability-is-your-ai-product-operating-from",
  "/lab",
  "/lab/live-regions",
  "/accessibility",
];

const browser = await chromium.launch();
let grandTotal = 0;

for (const route of routes) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const entries = [];

  page.on("console", (msg) => {
    const t = msg.type();
    if (t === "error" || t === "warning") entries.push(`[console.${t}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => entries.push(`[pageerror] ${err.message}`));
  page.on("requestfailed", (req) =>
    entries.push(`[requestfailed] ${req.url()} — ${req.failure()?.errorText}`),
  );
  page.on("response", (res) => {
    if (res.status() >= 400) entries.push(`[http ${res.status()}] ${res.url()}`);
  });

  // Browser-emitted entries (the category console hooks miss).
  const client = await ctx.newCDPSession(page);
  await client.send("Log.enable");
  client.on("Log.entryAdded", (e) => {
    const { level, source, text, url } = e.entry;
    if (level === "error" || level === "warning")
      entries.push(`[browser ${source}/${level}] ${text}${url ? ` (${url})` : ""}`);
  });

  await page.goto(base + route, { waitUntil: "load" });
  // Trigger lazy/IO-gated content and give delayed warnings (preload, violations) time to fire.
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
  });
  await page.waitForTimeout(5000);

  const unique = [...new Set(entries)];
  grandTotal += unique.length;
  console.log(`\n=== ${route} === (${unique.length})`);
  for (const e of unique) console.log("  " + e);

  await ctx.close();
}

console.log(`\nGRAND TOTAL across ${routes.length} routes: ${grandTotal}`);
await browser.close();
