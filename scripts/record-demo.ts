import { renameSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const BASE_URL = process.env.DEMO_BASE_URL ?? "http://localhost:3000";
const OUTPUT_DIR = "/Users/bittu/Desktop";
const OUTPUT_FILE = "FoodRush-Merchant-Demo-2026-06-22.webm";
const SPLASH_KEY = "foodrush-splash-seen";
const DEMO_EMAIL = process.env.DEMO_MERCHANT_EMAIL;
const DEMO_PASSWORD = process.env.DEMO_MERCHANT_PASSWORD;

async function pause(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function recordAuthPages(page: import("playwright").Page): Promise<void> {
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForSelector("form", { timeout: 30_000 });
  await pause(3500);

  await page.goto(`${BASE_URL}/signup`, { waitUntil: "networkidle", timeout: 60_000 });
  await pause(2500);

  await page.goto(`${BASE_URL}/forgot-password`, { waitUntil: "networkidle", timeout: 60_000 });
  await pause(2500);

  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle", timeout: 60_000 });
  await pause(1500);
}

async function tryLogin(page: import("playwright").Page): Promise<boolean> {
  if (!DEMO_EMAIL || !DEMO_PASSWORD) {
    return false;
  }

  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.getByPlaceholder(/email/i).fill(DEMO_EMAIL);
  await page.getByPlaceholder(/password/i).fill(DEMO_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForSelector("[data-dashboard-shell]", { timeout: 60_000 });
  return true;
}

async function recordDashboardTour(page: import("playwright").Page): Promise<void> {
  await pause(2500);

  await page.getByRole("button", { name: "Menu" }).click();
  await pause(2000);
  await page.mouse.wheel(0, 900);
  await pause(1500);

  await page.getByRole("button", { name: "Orders" }).click();
  await pause(1500);

  const simulate = page.getByRole("button", { name: "Simulate Order" });
  if (await simulate.isVisible().catch(() => false)) {
    await simulate.click();
    const accept = page.getByRole("button", { name: /Accept order/i });
    await accept.waitFor({ timeout: 30_000 });
    await pause(1000);
    await accept.click();
    await pause(2500);
  }

  const settings = page.getByTitle("Open Settings");
  if (await settings.isVisible().catch(() => false)) {
    await settings.click();
    await pause(2000);
    await page.keyboard.press("Escape");
    await pause(800);
  }

  const history = page.getByRole("button", { name: "Order history" });
  if (await history.isVisible().catch(() => false)) {
    await history.click();
    await pause(2500);
  }

  const notifications = page.getByTitle("Open Notifications");
  if (await notifications.isVisible().catch(() => false)) {
    await notifications.click();
    await pause(2000);
    await page.keyboard.press("Escape");
    await pause(1000);
  }
}

async function main(): Promise<void> {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUTPUT_DIR, size: { width: 1440, height: 900 } },
  });

  const page = await context.newPage();

  console.log(`Recording demo from ${BASE_URL}...`);

  // Splash animation (once per fresh context)
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await pause(5000);
  await context.addInitScript((key) => {
    sessionStorage.setItem(key, "1");
  }, SPLASH_KEY);

  const loggedIn = await tryLogin(page);

  if (loggedIn) {
    console.log("Logged in — recording dashboard tour...");
    await recordDashboardTour(page);
  } else {
    console.log("No demo credentials — recording auth pages with new theme...");
    await recordAuthPages(page);
  }

  const video = page.video();
  await context.close();
  await browser.close();

  if (video) {
    const recordedPath = await video.path();
    const finalPath = join(OUTPUT_DIR, OUTPUT_FILE);
    renameSync(recordedPath, finalPath);
    console.log(`Saved demo recording to ${finalPath}`);
  } else {
    throw new Error("No video was recorded.");
  }
}

main().catch((error) => {
  console.error("Demo recording failed:", error);
  process.exit(1);
});
