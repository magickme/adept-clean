import puppeteer from 'puppeteer';

async function takeScreenshots() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const url = 'http://localhost:5173';

  // Laptop 1080p (1920x1080)
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'laptop-screenshot.png', fullPage: true });

  // iPad 9.7 (768x1024)
  await page.setViewport({ width: 768, height: 1024 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'ipad-screenshot.png', fullPage: true });

  // iPhone 11 (414x896)
  await page.setViewport({ width: 414, height: 896 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'iphone-screenshot.png', fullPage: true });

  await browser.close();
}

takeScreenshots().catch(console.error); 