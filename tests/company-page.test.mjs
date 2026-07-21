import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const companyUrl = new URL('../company.html', import.meta.url);
const companyCssUrl = new URL('../company.css', import.meta.url);
const company = existsSync(companyUrl) ? readFileSync(companyUrl, 'utf8') : '';
const companyCss = existsSync(companyCssUrl) ? readFileSync(companyCssUrl, 'utf8') : '';
const pages = ['index.html', 'research.html', 'developers.html'];

test('Company page contains the requested vision copy and local visual', () => {
  assert.match(company, /<html lang="en">/);
  assert.match(company, /We exist for the last 8%/);
  assert.match(company, /Most tools get you through the first 92%\./);
  assert.match(company, /the stretch that carries an idea all the way to 100%\./);
  assert.match(company, /see what is almost right, refine what is easy to miss/);
  assert.match(company, /without losing your intent\./);
  assert.match(company, /The last 8% is not a finishing touch\./);
  assert.match(company, /where craft turns a good result into your result\./);
  assert.match(company, /stay with you to the end/);
  assert.match(company, /every line, curve, and detail feels complete\./);
  assert.doesNotMatch(company, /ツールの限界|クリエイティブの限界/);
  assert.match(company, /assets\/company-vision-v1\.png/);
  assert.ok(existsSync(new URL('../assets/company-vision-v1.png', import.meta.url)));
});

test('Company page has its own page styles and current navigation state', () => {
  assert.match(company, /<body class="company-page">/);
  assert.match(company, /company\.css/);
  assert.match(company, /href="\.\/company\.html"[^>]*aria-current="page"/);
  assert.match(companyCss, /\.company-page/);
  assert.match(companyCss, /font-size:[^;]*45px/);
});

for (const page of pages) {
  test(`${page} links Company to the standalone page`, () => {
    const html = readFileSync(new URL(`../${page}`, import.meta.url), 'utf8');
    assert.match(html, /href="\.\/company\.html"[^>]*>Company</);
  });
}
