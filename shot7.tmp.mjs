import { chromium } from "playwright";
import fs from "node:fs";
const OUT = "D:/tools/scratch/p7";
fs.mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3100";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
// dismiss consent so it doesn't cover screenshots
await page.goto(BASE + "/fr", { waitUntil: "load" });
await page.evaluate(() => localStorage.setItem("sbai-consent-v1", "denied"));

for (const [name, url] of [["contact", "/fr/contact"], ["home", "/fr"], ["delcosta", "/fr/projets/del-costa"]]) {
  await page.goto(BASE + url, { waitUntil: "load" });
  await page.waitForTimeout(1400);
  await page.evaluate(async () => {
    await new Promise((r) => { let y=0; const s=()=>{y+=700;window.scrollTo(0,y); if(y<document.body.scrollHeight) setTimeout(s,80); else {window.scrollTo(0,0); setTimeout(r,400);} }; s(); });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log("ok", name);
}
// banner shot
const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p2 = await ctx2.newPage();
await p2.goto(BASE + "/fr", { waitUntil: "load" });
await p2.waitForTimeout(1800);
await p2.screenshot({ path: `${OUT}/banner.png` });
console.log("ok banner");
await browser.close();
