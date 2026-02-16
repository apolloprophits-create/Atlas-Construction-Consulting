import { chromium } from 'playwright';

const keys = ['LPRM-2600756', 'LPRM-2600514', '819 E BUCKEYE RD', '7400 W BUCKEYE RD'];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

for (const key of keys) {
  await page.goto('https://shapephx.phoenix.gov/s/pdd-case-search', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const selectors = [
    'input[type="search"]',
    'input[placeholder*="Search" i]',
    'input[aria-label*="Search" i]',
    'input[name*="search" i]',
    'input[id*="search" i]'
  ];
  let ok = false;
  for (const sel of selectors) {
    const el = await page.$(sel);
    if (!el) continue;
    await el.fill('');
    await el.type(key, { delay: 20 });
    await page.keyboard.press('Enter').catch(() => {});
    ok = true;
    break;
  }

  await page.waitForTimeout(5000);
  const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
  const links = await page.evaluate(() => Array.from(document.querySelectorAll('a[href]')).map((a) => a.href));
  const shapeLinks = links.filter((h) => /shapephx\.phoenix\.gov|recordId=|permit-standard-detail|case/i.test(h));

  console.log(`\nKEY=${key} inputFound=${ok} url=${page.url()}`);
  console.log(body.slice(0, 1200));
  console.log('links:', shapeLinks.slice(0, 30).join(' | '));
}

await context.close();
await browser.close();
