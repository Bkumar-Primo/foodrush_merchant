import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(SCRIPT_DIR, "..");
const OUTPUT_DIR = "/Users/bittu/Desktop";
const HTML_FILE = join(OUTPUT_DIR, "FoodRush-Progress-Report.html");
const PDF_FILE = join(OUTPUT_DIR, "FoodRush-Progress-Report.pdf");
const LOGO_PATH = join(PROJECT_ROOT, "public/brand/logo1.png");

const REPORT_DATE = "25 June 2026";

const logoBase64 = readFileSync(LOGO_PATH).toString("base64");
const LOGO_DATA_URI = `data:image/png;base64,${logoBase64}`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>FoodRush Progress Report</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      color: #1c1c1e;
      line-height: 1.38;
      font-size: 10px;
      margin: 0;
      padding: 0;
    }
    .print-page { page-break-after: always; }
    .print-page:last-child { page-break-after: auto; }
    .cover {
      background: linear-gradient(135deg, #faf8f5 0%, #f4e8e4 100%);
      border: 1px solid #e8e4de;
      border-radius: 10px;
      padding: 18px 22px;
      margin-bottom: 14px;
    }
    .cover-top { display: flex; align-items: center; gap: 16px; }
    .cover-logo { height: 48px; width: auto; flex-shrink: 0; }
    .cover h1 { margin: 0 0 2px; font-size: 22px; color: #d4543c; font-weight: 700; }
    .cover .subtitle { font-size: 12px; color: #6b6b70; }
    .meta { font-size: 9px; color: #6b6b70; margin-top: 10px; }
    .meta strong { color: #1c1c1e; }
    .section-banner {
      background: linear-gradient(135deg, #d4543c 0%, #b8433a 100%);
      color: #fff;
      border-radius: 8px;
      padding: 10px 14px;
      margin: 0 0 10px;
      page-break-inside: avoid;
    }
    .section-banner h2 {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      color: #fff;
    }
    .section-banner p { margin: 3px 0 0; font-size: 9.5px; opacity: 0.92; }
    h2 {
      font-size: 13px;
      color: #d4543c;
      border-bottom: 2px solid #f4a99a;
      padding-bottom: 2px;
      margin: 0 0 6px;
      page-break-after: avoid;
    }
    h3 {
      font-size: 10.5px;
      margin: 10px 0 4px;
      color: #1c1c1e;
      page-break-after: avoid;
    }
    h3:first-child { margin-top: 0; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0 0 8px;
      font-size: 9.5px;
      page-break-inside: avoid;
    }
    th, td { border: 1px solid #e8e4de; padding: 4px 6px; text-align: left; vertical-align: top; }
    th { background: #faf8f5; font-weight: 600; }
    .done { color: #2d6a4f; font-weight: 600; }
    .partial { color: #d97706; font-weight: 600; }
    .pending { color: #9ca3af; font-weight: 600; }
    .legend { font-size: 9px; color: #6b6b70; margin: 6px 0 10px; }
    ul { margin: 2px 0 6px; padding-left: 14px; }
    li { margin-bottom: 2px; }
    .feature-block { page-break-inside: avoid; margin-bottom: 2px; }
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      page-break-inside: avoid;
    }
    .sync-flow {
      background: #faf8f5;
      border: 1px solid #e8e4de;
      border-radius: 6px;
      padding: 7px 10px;
      margin: 0 0 6px;
      font-size: 9px;
      page-break-inside: avoid;
    }
    .sync-flow strong { color: #d4543c; }
    .roadmap-card {
      border: 1px solid #e8e4de;
      border-radius: 6px;
      padding: 7px 9px;
      background: #fff;
      page-break-inside: avoid;
    }
    .roadmap-card h3 { margin: 0 0 4px; color: #d4543c; font-size: 10px; }
    .doc-footer {
      margin-top: 10px;
      padding-top: 6px;
      border-top: 1px solid #e8e4de;
      font-size: 8px;
      color: #9ca3af;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      page-break-inside: avoid;
    }
    .doc-footer img { height: 13px; width: auto; }
    p { margin: 0 0 6px; }
  </style>
</head>
<body>

<!-- PAGE 1: Cover + Merchant Dashboard (Auth & Orders) -->
<section class="print-page">
  <div class="cover">
    <div class="cover-top">
      <img src="${LOGO_DATA_URI}" alt="FoodRush" class="cover-logo" />
      <div>
        <h1>Progress Report</h1>
        <div class="subtitle">Merchant Dashboard &amp; Customer Mobile App</div>
      </div>
    </div>
    <div class="meta"><strong>Date:</strong> ${REPORT_DATE}</div>
  </div>

  <h2>Executive Summary</h2>
  <p>FoodRush is a food-delivery platform with a <strong>merchant dashboard</strong> (web) and a <strong>customer mobile app</strong> (iOS &amp; Android), connected through Firebase. Completed features and next steps are listed separately for each product.</p>
  <p class="legend"><span class="done">✓ Done</span> &nbsp; <span class="partial">◐ Partial / Demo</span> &nbsp; <span class="pending">○ Not started</span></p>

  <div class="section-banner">
    <h2>Merchant Dashboard</h2>
    <p>Web app for restaurant owners — orders, menu, history, and settings</p>
  </div>

  <div class="feature-block">
    <h3>Authentication &amp; Onboarding</h3>
    <table>
      <tr><th>Feature</th><th>Status</th><th>Notes</th></tr>
      <tr><td>Login page (split layout, hero, brand theme)</td><td class="done">✓ Done</td><td>FoodRush coral primary (#D4543C)</td></tr>
      <tr><td>Sign up &amp; forgot password</td><td class="done">✓ Done</td><td>Firebase Email/Password</td></tr>
      <tr><td>Google sign-in UI</td><td class="partial">◐ Partial</td><td>Needs Firebase Console setup</td></tr>
      <tr><td>Auth gate &amp; animated splash</td><td class="done">✓ Done</td><td>Protected routes; once-per-session splash</td></tr>
      <tr><td>Profile sheet (edit name, logout)</td><td class="done">✓ Done</td><td>Right-side sheet from header</td></tr>
    </table>
  </div>

  <div class="feature-block">
    <h3>Orders Tab</h3>
    <table>
      <tr><th>Feature</th><th>Status</th><th>Notes</th></tr>
      <tr><td>Real-time Firestore order listener</td><td class="done">✓ Done</td><td><code>onSnapshot</code> on orders</td></tr>
      <tr><td>Incoming order modal (accept / reject)</td><td class="done">✓ Done</td><td>Audio chime on new order</td></tr>
      <tr><td>Preparing / Ready / Picked up tabs</td><td class="done">✓ Done</td><td>Tab counts, search, sort</td></tr>
      <tr><td>Order detail (items, customer, billing)</td><td class="done">✓ Done</td><td>Multi-column layout</td></tr>
      <tr><td>Mark ready &amp; dispatch rider</td><td class="done">✓ Done</td><td>Firestore status updates</td></tr>
      <tr><td>Simulate order &amp; urgent order</td><td class="done">✓ Done</td><td>Demo orders via sidebar</td></tr>
      <tr><td>Need more time modal</td><td class="done">✓ Done</td><td>Extend prep time</td></tr>
      <tr><td>Merchant online/offline status</td><td class="done">✓ Done</td><td>Header toggle with alert</td></tr>
      <tr><td>Rider tracking &amp; map</td><td class="partial">◐ Partial</td><td>Simulated rider; Leaflet placeholder</td></tr>
    </table>
  </div>
</section>

<!-- PAGE 2: Merchant Dashboard (continued) -->
<section class="print-page">
  <div class="section-banner">
    <h2>Merchant Dashboard</h2>
    <p>Continued — history, menu, reviews, and settings</p>
  </div>

  <div class="feature-block">
    <h3>Order History Tab</h3>
    <table>
      <tr><th>Feature</th><th>Status</th><th>Notes</th></tr>
      <tr><td>Order list with status badges</td><td class="done">✓ Done</td><td>Delivered, rejected, ratings</td></tr>
      <tr><td>Date range picker (calendar)</td><td class="done">✓ Done</td><td>Presets + custom range</td></tr>
      <tr><td>Status filter &amp; search</td><td class="done">✓ Done</td><td>By ID, customer, items</td></tr>
      <tr><td>Order detail panel &amp; timeline</td><td class="done">✓ Done</td><td>Customer info, items</td></tr>
      <tr><td>Export CSV</td><td class="done">✓ Done</td><td>Download filtered orders</td></tr>
    </table>
  </div>

  <div class="feature-block">
    <h3>Menu Tab</h3>
    <table>
      <tr><th>Feature</th><th>Status</th><th>Notes</th></tr>
      <tr><td>Menu editor (categories, items)</td><td class="done">✓ Done</td><td>Firestore inventory collection</td></tr>
      <tr><td>Manage inventory (stock toggle)</td><td class="done">✓ Done</td><td>In-stock / out-of-stock</td></tr>
      <tr><td>Add / edit menu items</td><td class="done">✓ Done</td><td>Photo, pricing, variants, addons</td></tr>
      <tr><td>Search, filter &amp; image search</td><td class="done">✓ Done</td><td>Toolbar filters; Unsplash/Pexels API</td></tr>
      <tr><td>Addon groups management</td><td class="done">✓ Done</td><td>Local addon group state</td></tr>
      <tr><td>Taxes &amp; charges tabs</td><td class="partial">◐ Partial</td><td>UI shell only</td></tr>
      <tr><td>Auto-seed &amp; reseed inventory</td><td class="done">✓ Done</td><td><code>bun run reseed:inventory</code></td></tr>
    </table>
  </div>

  <div class="feature-block">
    <h3>Reviews, Complaints &amp; Settings</h3>
    <table>
      <tr><th>Feature</th><th>Status</th><th>Notes</th></tr>
      <tr><td>Customer reviews list</td><td class="partial">◐ Partial</td><td>Mock data; reply UI works locally</td></tr>
      <tr><td>Rating distribution chart</td><td class="partial">◐ Partial</td><td>Mock data</td></tr>
      <tr><td>Customer complaints / tickets</td><td class="partial">◐ Partial</td><td>Mock data</td></tr>
      <tr><td>Sidebar, dark/light theme</td><td class="done">✓ Done</td><td>Persisted in localStorage</td></tr>
      <tr><td>Notifications &amp; settings sheets</td><td class="done">✓ Done</td><td>Volume, ringtone, order prefs</td></tr>
      <tr><td>Firebase connection status</td><td class="done">✓ Done</td><td>Shows project ID when connected</td></tr>
      <tr><td>FoodRush brand theme</td><td class="done">✓ Done</td><td>Aligned with mobile app palette</td></tr>
    </table>
  </div>
</section>

<!-- PAGE 3: Customer Mobile App + Sync + Next Steps -->
<section class="print-page">
  <div class="section-banner">
    <h2>Customer Mobile App</h2>
    <p>iOS &amp; Android — browse menu, order food, and track delivery</p>
  </div>

  <div class="two-col">
    <div>
      <div class="feature-block">
        <h3>Auth &amp; Onboarding</h3>
        <table>
          <tr><th>Feature</th><th>Status</th></tr>
          <tr><td>Welcome / phone / OTP flow</td><td class="done">✓ Done</td></tr>
          <tr><td>Name &amp; personalize screens</td><td class="done">✓ Done</td></tr>
          <tr><td>Terms, privacy, location picker</td><td class="done">✓ Done</td></tr>
          <tr><td>Firebase Phone Auth</td><td class="pending">○ Not started</td></tr>
        </table>
      </div>
      <div class="feature-block">
        <h3>Orders &amp; Tracking</h3>
        <table>
          <tr><th>Feature</th><th>Status</th></tr>
          <tr><td>Orders tab (active + history)</td><td class="done">✓ Done</td></tr>
          <tr><td>Order tracking timeline</td><td class="done">✓ Done</td></tr>
          <tr><td>Order detail screen</td><td class="done">✓ Done</td></tr>
        </table>
      </div>
    </div>
    <div>
      <div class="feature-block">
        <h3>Home &amp; Discovery</h3>
        <table>
          <tr><th>Feature</th><th>Status</th></tr>
          <tr><td>Home, search, restaurant detail</td><td class="done">✓ Done</td></tr>
          <tr><td>Product detail &amp; categories</td><td class="done">✓ Done</td></tr>
          <tr><td>Live menu from Firebase</td><td class="done">✓ Done</td></tr>
          <tr><td>Mock restaurants fallback</td><td class="done">✓ Done</td></tr>
        </table>
      </div>
      <div class="feature-block">
        <h3>Cart, Checkout &amp; Platform</h3>
        <table>
          <tr><th>Feature</th><th>Status</th></tr>
          <tr><td>Floating cart &amp; bottom sheet</td><td class="done">✓ Done</td></tr>
          <tr><td>Checkout screen</td><td class="done">✓ Done</td></tr>
          <tr><td>Razorpay integration</td><td class="partial">◐ Partial</td></tr>
          <tr><td>Write order to Firestore</td><td class="done">✓ Done</td></tr>
          <tr><td>Design system &amp; profile</td><td class="done">✓ Done</td></tr>
          <tr><td>Android / iOS native build</td><td class="partial">◐ Partial</td></tr>
        </table>
      </div>
    </div>
  </div>

  <div class="two-col" style="margin-top:10px;">
    <div>
      <h2>Firebase &amp; Cross-App Sync</h2>
      <div class="sync-flow">
        <strong>Data flow:</strong> Merchant edits inventory → Customer app listens live → Customer places order → Merchant dashboard receives → Status updates sync to tracking.
      </div>
      <table>
        <tr><th>Integration</th><th>Status</th></tr>
        <tr><td>Shared Firebase project</td><td class="done">✓ Done</td></tr>
        <tr><td>Inventory → customer catalog</td><td class="done">✓ Done</td></tr>
        <tr><td>Customer order → merchant dashboard</td><td class="done">✓ Done</td></tr>
        <tr><td>Merchant accept → customer tracking</td><td class="done">✓ Done</td></tr>
        <tr><td>Firestore security rules</td><td class="partial">◐ Partial</td></tr>
        <tr><td>Team env setup documented</td><td class="done">✓ Done</td></tr>
      </table>
    </div>
    <div>
      <h2>Next Steps</h2>
      <div class="roadmap-card">
        <h3>Phase 1 — Team &amp; Sync</h3>
        <ul>
          <li>○ Share Firebase config securely with team</li>
          <li>○ Add <code>.env</code> files on every machine</li>
          <li>○ Verify end-to-end menu → order → dashboard flow</li>
          <li>○ Run <code>bun run reseed:inventory</code> if needed</li>
        </ul>
      </div>
      <div class="roadmap-card" style="margin-top:8px;">
        <h3>Phase 2 — Auth &amp; Payments</h3>
        <ul>
          <li>○ Firebase Phone Auth in customer app</li>
          <li>○ Google sign-in in Firebase Console</li>
          <li>○ Production Razorpay keys</li>
          <li>○ Lock down Firestore security rules</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="doc-footer">
    <img src="${LOGO_DATA_URI}" alt="FoodRush" />
    <span>FoodRush Progress Report · ${REPORT_DATE} · Confidential — internal team use</span>
  </div>
</section>

</body>
</html>`;

const headerTemplate = `
  <div style="width:100%;margin:0 10mm;padding-bottom:4px;border-bottom:1px solid #e8e4de;display:flex;align-items:center;justify-content:space-between;font-size:8px;color:#9ca3af;font-family:-apple-system,sans-serif;">
    <img src="${LOGO_DATA_URI}" style="height:16px;width:auto;" />
    <span>FoodRush Progress Report · ${REPORT_DATE}</span>
  </div>
`;

const footerTemplate = `
  <div style="width:100%;margin:0 10mm;padding-top:4px;font-size:8px;color:#9ca3af;text-align:center;font-family:-apple-system,sans-serif;">
    Page <span class="pageNumber"></span> of <span class="totalPages"></span>
  </div>
`;

async function main(): Promise<void> {
  writeFileSync(HTML_FILE, html, "utf8");
  console.log(`Wrote ${HTML_FILE}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`file://${HTML_FILE}`, { waitUntil: "networkidle" });
  await page.pdf({
    path: PDF_FILE,
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate,
    footerTemplate,
    margin: { top: "22mm", bottom: "16mm", left: "10mm", right: "10mm" },
  });
  await browser.close();

  console.log(`Saved PDF to ${PDF_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
