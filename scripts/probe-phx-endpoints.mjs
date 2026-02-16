const permits = ['LPRM-2600756', 'LPRM-2600514'];

for (const permit of permits) {
  for (const ep of ['_GetPermitData', '_GetPlanReviews']) {
    const url = `https://apps-secure.phoenix.gov/PDD/Search/PlanReviews/${ep}?permitNum=${encodeURIComponent(permit)}`;
    const res = await fetch(url);
    const text = await res.text();
    const compact = text.replace(/\s+/g, ' ').trim();
    const links = [...compact.matchAll(/href=["']([^"']+)["']/gi)].map((m) => m[1]);

    console.log(`\n${permit} ${ep} status=${res.status} len=${text.length}`);
    console.log(compact.slice(0, 900));
    if (links.length) console.log(`links: ${links.slice(0, 20).join(' | ')}`);
  }
}
