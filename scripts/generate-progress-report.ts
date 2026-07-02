import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(SCRIPT_DIR, "..");
const OUTPUT_DIRS = ["/Users/bittu/Downloads", "/Users/bittu/Desktop"];
const LOGO_PATH = join(PROJECT_ROOT, "public/brand/logo1.png");

const REPORT_DATE = "26 June 2026";
const PRODUCTION_URL = "foodrush-merchant.vercel.app";
const DONE = "✓ Done";

const logoBase64 = readFileSync(LOGO_PATH).toString("base64");
const LOGO_DATA_URI = `data:image/png;base64,${logoBase64}`;

type ReportRow = readonly [feature: string, notes: string];

function renderTable(rows: readonly ReportRow[]): string {
  const body = rows
    .map(
      ([feature, notes]) =>
        `<tr><td>${feature}</td><td class="done status-cell">${DONE}</td><td class="notes-cell">${notes}</td></tr>`,
    )
    .join("\n");

  return `<table class="report-table">
  <thead>
    <tr><th class="th-feature">Feature</th><th class="th-status">Status</th><th class="th-notes">Notes</th></tr>
  </thead>
  <tbody>
${body}
  </tbody>
</table>`;
}

const MERCHANT_AUTH: ReportRow[] = [
  ["Production deployment (Vercel)", `Live at ${PRODUCTION_URL}; auto-deploy from master branch`],
  [
    "Login page (split layout, hero illustration)",
    "Food Rush brand theme; stable split layout with no shift on load",
  ],
  ["Sign up &amp; forgot password", "Firebase Email/Password authentication flows"],
  [
    "Session splash &amp; auth gate",
    "Branded first-visit splash; dashboard routes blocked until auth resolves",
  ],
  ["Profile sheet (edit name, logout)", "Right-side sheet opened from dashboard header"],
  [
    "Firebase connection status",
    "Settings shows connected project ID when Firebase env is configured",
  ],
];

const MERCHANT_ORDERS: ReportRow[] = [
  ["Real-time Firestore order listener", "<code>onSnapshot</code> on shared orders collection"],
  ["Incoming order modal (accept / reject)", "Modal with accept/reject actions; audio chime on new order"],
  ["Preparing / Ready / Picked up tabs", "Tabbed order queues with live counts, search, and sort"],
  ["Order detail (items, customer, billing)", "Multi-column detail view with items, customer, and totals"],
  ["Mark ready &amp; dispatch rider", "Updates Firestore status and writes rider name/phone fields"],
  ["Simulate order &amp; urgent order", "Demo orders from sidebar shortcut and simulator route"],
  ["Need more time modal", "Merchant can extend prep time before marking ready"],
  [
    "Merchant online/offline status",
    "Synced to Firestore; smart rules keep store open while active orders exist",
  ],
];

const MERCHANT_HISTORY: ReportRow[] = [
  ["Order list with status badges", "Delivered, rejected, and rated orders with color-coded badges"],
  ["Date range picker (calendar)", "Quick presets plus custom calendar date range"],
  ["Status filter &amp; search", "Filter by status; search by order ID, customer, or items"],
  ["Order detail panel &amp; timeline", "Right panel with customer info, items, and status timeline"],
  ["Export CSV", "Download currently filtered order list as CSV"],
];

const MERCHANT_MENU: ReportRow[] = [
  ["Menu editor (categories, items)", "Full editor backed by Firestore inventory collection"],
  [
    "Punjabi menu catalog",
    "150 items across 15+ Punjabi categories; seed and reseed scripts included",
  ],
  ["Manage inventory (stock toggle)", "In-stock / out-of-stock toggle with restock modal"],
  ["Add / edit menu items", "Photo, pricing, variants, addons, and category assignment"],
  ["Search, filter &amp; image search", "Toolbar filters; Unsplash/Pexels image search integration"],
  ["Addon groups management", "Global addon group editor shared across menu items"],
];

const MERCHANT_SETTINGS: ReportRow[] = [
  ["Sidebar navigation", "Orders, history, menu, reviews, and complaints routes"],
  ["Dark / light theme", "Theme toggle persisted in localStorage"],
  ["Notifications &amp; settings sheets", "Volume, ringtone, and order notification preferences"],
  ["Food Rush brand theme", "Palette aligned with customer app primary color (#D4543C)"],
];

const CUSTOMER_AUTH: ReportRow[] = [
  ["Welcome screen with branded assets", "Bundled food imagery with Food Rush branding on first launch"],
  ["Phone / OTP flow (demo)", "Demo OTP flow for development and test builds"],
  ["Name &amp; personalize screens", "Post sign-in onboarding to capture user name and preferences"],
  ["Terms, privacy, location picker", "Legal screens and delivery location selection during onboarding"],
];

const CUSTOMER_ORDERS: ReportRow[] = [
  ["Orders tab (active + history)", "Single tab listing in-progress and completed orders"],
  ["Order tracking timeline", "Step-by-step timeline synced from merchant status updates"],
  ["Cancelled order status in timeline", "Rejected and cancelled orders shown correctly in timeline"],
  ["Order detail screen", "Full breakdown of items, billing, and delivery details"],
  ["Live ETA &amp; tracking map", "Dynamic ETA calculation with map and simulated rider position"],
];

const CUSTOMER_HOME: ReportRow[] = [
  ["Home, search, restaurant detail", "Restaurant browse, search, and detail screens"],
  ["Product detail &amp; categories", "Item detail with variants, addons, and veg/non-veg labels"],
  ["Live menu from Firebase", "Real-time menu loaded from merchant Firestore inventory"],
  ["Promo banner carousel", "Swipeable promotional banners on home screen"],
  ["Best offers &amp; collections grid", "Curated offer and collection sections on home"],
  ["Top picks full-bleed cards", "Featured items shown in full-bleed card layout"],
];

const CUSTOMER_CHECKOUT: ReportRow[] = [
  ["Floating cart &amp; bottom sheet", "Persistent cart accessible from any screen via bottom sheet"],
  ["Checkout screen", "Delivery address, line items, fees, and order total review"],
  ["Razorpay payment step", "Razorpay checkout runs before order is written to Firestore"],
  ["Write order to Firestore", "Placed orders appear instantly on merchant dashboard"],
  [
    "Merchant offline banner &amp; checkout block",
    "Customer app reads merchant online status and blocks checkout when offline",
  ],
  ["Design system &amp; profile", "Food Rush theme tokens; profile screen and app settings"],
];

const FIREBASE_SYNC: ReportRow[] = [
  [
    "Shared Firebase project (foodrush-1c40b)",
    "One Firebase project shared by merchant web app and customer mobile app",
  ],
  ["Inventory → customer catalog", "Customer app listens live to merchant inventory changes"],
  [
    "Customer order → merchant dashboard",
    "Orders collection write from customer; merchant receives real-time incoming modal",
  ],
  [
    "Merchant accept → customer tracking",
    "Merchant status fields drive customer order tracking timeline steps",
  ],
  [
    "Merchant status → customer app",
    "Merchant online/offline flag controls banner and checkout availability",
  ],
  ["Team env setup documented", "Firebase config and environment setup instructions in repository"],
];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Food Rush Progress Report</title>
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
    table.report-table {
      width: 100%;
      border-collapse: collapse;
      margin: 0 0 8px;
      font-size: 9.5px;
      page-break-inside: avoid;
      table-layout: fixed;
    }
    .report-table th,
    .report-table td {
      border: 1px solid #e8e4de;
      padding: 4px 6px;
      text-align: left;
      vertical-align: top;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    .report-table th { background: #faf8f5; font-weight: 600; }
    .report-table .th-feature,
    .report-table td:first-child { width: 28%; }
    .report-table .th-status,
    .report-table td:nth-child(2) { width: 12%; }
    .report-table .th-notes,
    .report-table .notes-cell { width: 60%; }
    td.status-cell { white-space: nowrap; }
    .done { color: #2d6a4f; font-weight: 600; }
    .legend { font-size: 9px; color: #6b6b70; margin: 6px 0 10px; }
    .feature-block { page-break-inside: avoid; margin-bottom: 6px; }
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
    .highlight {
      background: #e8f5ee;
      border: 1px solid #b7e4c7;
      border-radius: 6px;
      padding: 8px 10px;
      margin: 0 0 10px;
      font-size: 9.5px;
    }
  </style>
</head>
<body>

<section class="print-page">
  <div class="cover">
    <div class="cover-top">
      <img src="${LOGO_DATA_URI}" alt="Food Rush" class="cover-logo" />
      <div>
        <h1>Progress Report</h1>
        <div class="subtitle">Merchant Dashboard &amp; Customer Mobile App</div>
      </div>
    </div>
    <div class="meta"><strong>Date:</strong> ${REPORT_DATE}</div>
  </div>

  <h2>Executive Summary</h2>
  <p>Food Rush is a food-delivery platform with a <strong>merchant dashboard</strong> (web) and a <strong>customer mobile app</strong> (iOS &amp; Android), connected through Firebase. This report lists completed capabilities delivered to date.</p>
  <div class="highlight">
    <strong>Production:</strong> Merchant dashboard is live at <strong>${PRODUCTION_URL}</strong> (Vercel). Firebase authentication is configured for the production domain.
  </div>
  <p class="legend"><span class="done">✓ Done</span> — shipped and available in the current build</p>

  <div class="section-banner">
    <h2>Merchant Dashboard</h2>
    <p>Web app for restaurant owners — orders, menu, history, and settings</p>
  </div>

  <div class="feature-block">
    <h3>Deployment &amp; Authentication</h3>
    ${renderTable(MERCHANT_AUTH)}
  </div>

  <div class="feature-block">
    <h3>Orders Tab</h3>
    ${renderTable(MERCHANT_ORDERS)}
  </div>
</section>

<section class="print-page">
  <div class="section-banner">
    <h2>Merchant Dashboard</h2>
    <p>Continued — history, menu, and settings</p>
  </div>

  <div class="feature-block">
    <h3>Order History Tab</h3>
    ${renderTable(MERCHANT_HISTORY)}
  </div>

  <div class="feature-block">
    <h3>Menu Tab</h3>
    ${renderTable(MERCHANT_MENU)}
  </div>

  <div class="feature-block">
    <h3>Settings &amp; Platform</h3>
    ${renderTable(MERCHANT_SETTINGS)}
  </div>
</section>

<section class="print-page">
  <div class="section-banner">
    <h2>Customer Mobile App</h2>
    <p>iOS &amp; Android — browse menu, order food, and track delivery</p>
  </div>

  <div class="feature-block">
    <h3>Auth &amp; Onboarding</h3>
    ${renderTable(CUSTOMER_AUTH)}
  </div>

  <div class="feature-block">
    <h3>Home &amp; Discovery</h3>
    ${renderTable(CUSTOMER_HOME)}
  </div>

  <div class="feature-block">
    <h3>Orders &amp; Tracking</h3>
    ${renderTable(CUSTOMER_ORDERS)}
  </div>

  <div class="feature-block">
    <h3>Cart, Checkout &amp; Platform</h3>
    ${renderTable(CUSTOMER_CHECKOUT)}
  </div>
</section>

<section class="print-page">
  <h2>Firebase &amp; Cross-App Sync</h2>
  <div class="sync-flow">
    <strong>Data flow:</strong> Merchant edits inventory → Customer app listens live → Customer places order → Merchant dashboard receives → Status updates sync to customer tracking → Merchant online/offline reflected in customer app.
  </div>

  <div class="feature-block">
    ${renderTable(FIREBASE_SYNC)}
  </div>

  <div class="doc-footer">
    <img src="${LOGO_DATA_URI}" alt="Food Rush" />
    <span>Food Rush Progress Report · ${REPORT_DATE} · Confidential — internal team use</span>
  </div>
</section>

</body>
</html>`;

const headerTemplate = `
  <div style="width:100%;margin:0 10mm;padding-bottom:4px;border-bottom:1px solid #e8e4de;display:flex;align-items:center;justify-content:space-between;font-size:8px;color:#9ca3af;font-family:-apple-system,sans-serif;">
    <img src="${LOGO_DATA_URI}" style="height:16px;width:auto;" />
    <span>Food Rush Progress Report · ${REPORT_DATE}</span>
  </div>
`;

const footerTemplate = `
  <div style="width:100%;margin:0 10mm;padding-top:4px;font-size:8px;color:#9ca3af;text-align:center;font-family:-apple-system,sans-serif;">
    Page <span class="pageNumber"></span> of <span class="totalPages"></span>
  </div>
`;

async function main(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const outputDir of OUTPUT_DIRS) {
    const htmlFile = join(outputDir, "FoodRush-Progress-Report.html");
    const pdfFile = join(outputDir, "FoodRush-Progress-Report.pdf");

    writeFileSync(htmlFile, html, "utf8");
    console.log(`Wrote ${htmlFile}`);

    await page.goto(`file://${htmlFile}`, { waitUntil: "networkidle" });
    await page.pdf({
      path: pdfFile,
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
      margin: { top: "22mm", bottom: "16mm", left: "10mm", right: "10mm" },
    });
    console.log(`Saved PDF to ${pdfFile}`);
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
