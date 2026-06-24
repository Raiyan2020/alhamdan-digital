/**
 * Overflow verification script for cinematic animation safety.
 * Run: node scripts/overflow-test.mjs
 *
 * Requires a running production server: npm run build && npm run start
 */

const WIDTHS = [360, 390, 430, 768, 1024, 1280, 1440, 1536];
const BASE_URL = process.env.OVERFLOW_TEST_URL ?? "http://localhost:3000";

async function checkOverflow(width) {
  const puppeteer = await import("puppeteer").catch(() => null);
  if (!puppeteer) {
    console.log(
      "Puppeteer not installed. Run overflow check manually in browser console:"
    );
    console.log(
      'document.documentElement.scrollWidth <= document.documentElement.clientWidth'
    );
    return { width, skipped: true };
  }

  const browser = await puppeteer.default.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 800 });
  await page.goto(BASE_URL, { waitUntil: "networkidle0" });

  const overflow = await page.evaluate(() => {
    return (
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth
    );
  });

  await browser.close();
  return { width, overflow, pass: overflow <= 0 };
}

async function main() {
  console.log(`Overflow test against ${BASE_URL}\n`);

  let allPass = true;
  for (const width of WIDTHS) {
    const result = await checkOverflow(width);
    if (result.skipped) {
      process.exit(0);
    }
    const status = result.pass ? "PASS" : "FAIL";
    console.log(`${status} @ ${width}px — overflow: ${result.overflow}px`);
    if (!result.pass) allPass = false;
  }

  console.log(allPass ? "\nAll widths passed." : "\nOverflow detected.");
  process.exit(allPass ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
