import { chromium } from "playwright";
const BASE = "http://localhost:3100";
const browser = await chromium.launch();
// Fresh incognito-equivalent context: no storage, no prior consent
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const thirdParty = new Set();
const cookiesSeen = new Set();
page.on("request", (r) => {
  const u = new URL(r.url());
  if (u.hostname !== "localhost") thirdParty.add(`${u.hostname}${u.pathname.slice(0, 40)}`);
});

const PAGES = ["/fr", "/fr/projets/del-costa", "/fr/contact", "/fr/notre-histoire", "/fr/espace-mre", "/fr/mentions-legales"];
for (const p of PAGES) {
  await page.goto(BASE + p, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  await page.evaluate(async () => {
    await new Promise((r) => { let y=0; const s=()=>{y+=800;window.scrollTo(0,y); if(y<document.body.scrollHeight) setTimeout(s,80); else setTimeout(r,300);}; s(); });
  });
  await page.waitForTimeout(1200);
}
for (const c of await ctx.cookies()) cookiesSeen.add(`${c.domain} ${c.name}`);

console.log("THIRD-PARTY REQUESTS:", thirdParty.size ? [...thirdParty].join("\n  ") : "NONE ✅");
console.log("COOKIES SET:", cookiesSeen.size ? [...cookiesSeen].join(", ") : "NONE ✅");

// consent banner behaviour
await page.goto(BASE + "/fr", { waitUntil: "load" });
await page.waitForTimeout(1500);
const banner = await page.getByRole("dialog", { name: /vos données/i }).isVisible().catch(() => false);
console.log("consent banner visible on first visit:", banner);
const btns = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  if (!d) return null;
  return [...d.querySelectorAll("button")].map((b) => {
    const r = b.getBoundingClientRect();
    return { text: b.textContent.trim(), w: Math.round(r.width), h: Math.round(r.height) };
  });
});
console.log("banner buttons (equal weight required):", JSON.stringify(btns));
await page.getByRole("button", { name: "Refuser" }).click();
await page.waitForTimeout(600);
const stored = await page.evaluate(() => localStorage.getItem("sbai-consent-v1"));
console.log("stored consent after Refuser:", stored);
await page.reload({ waitUntil: "load" });
await page.waitForTimeout(1500);
const again = await page.locator('[role="dialog"]').count();
console.log("banner reappears after choice:", again > 0, "(expected false)");

await browser.close();
