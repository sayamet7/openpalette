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
  assert.match(company, /Company vision/);
  assert.match(company, /Never let the limits of tools become the limits of creativity\./);
  assert.match(company, /We don't constrain ideas to what tools can do/);
  assert.match(company, /we create the means to make them real\./);
  assert.match(company, /We deeply understand existing technologies, combine them, and extend them\./);
  assert.match(company, /When necessary, we build entirely new systems from the ground up\./);
  assert.match(company, /We don't start from “what is possible\.”/);
  assert.match(company, /We start from “what we want to make,” then expand what is possible\./);
  assert.match(company, /a world where creators' imaginations never become smaller/);
  assert.match(company, /because of technology or environment\./);
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
