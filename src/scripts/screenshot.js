import puppeteer from 'puppeteer';

async function takeScreenshot() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // iPhone 11 dimensions
  await page.setViewport({
    width: 400,
    height: 853,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  await page.goto('http://localhost:5173', { 
    waitUntil: 'networkidle0' 
  });
  
  await page.screenshot({
    path: './screenshots/iphone11.png',
    fullPage: true
  });

  await browser.close();
}

takeScreenshot(); 