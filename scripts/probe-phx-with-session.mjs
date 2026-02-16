import { chromium } from 'playwright';

const permits = ['LPRM-2600756', 'LPRM-2600514'];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

for (const permit of permits) {
  const pageUrl = `https://apps-secure.phoenix.gov/PDD/Search/PlanReviews?permitNum=${encodeURIComponent(permit)}`;
  await page.goto(pageUrl, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(1200);

  for (const ep of ['_GetPermitData', '_GetPlanReviews']) {
    const data = await page.evaluate(async ({ ep, permit }) => {
      const res = await fetch(`/PDD/Search/PlanReviews/${ep}?permitNum=${encodeURIComponent(permit)}`, {
        credentials: 'include'
      });
      const text = await res.text();
      return { status: res.status, text };
    }, { ep, permit });

    const compact = String(data.text || '').replace(/\s+/g, ' ').trim();
    console.log(`\n${permit} ${ep} status=${data.status} len=${compact.length}`);
    console.log(compact.slice(0, 1200));
  }
}

await context.close();
await browser.close();
