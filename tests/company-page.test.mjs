import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const companyUrl = new URL('../company.html', import.meta.url);
const companyCssUrl = new URL('../company.css', import.meta.url);
const company = existsSync(companyUrl) ? readFileSync(companyUrl, 'utf8') : '';
const companyCss = existsSync(companyCssUrl) ? readFileSync(companyCssUrl, 'utf8') : '';
const pages = ['index.html', 'research.html', 'developers.html'];

test('Company page contains the requested vision copy and local visual', () => {
  assert.match(company, /Company vision/);
  assert.match(company, /ツールの限界を、クリエイティブの限界にしない。/);
  assert.match(company, /私たちは、発想をツールのできる範囲に収めるのではなく、/);
  assert.match(company, /実現するための方法そのものをつくります。/);
  assert.match(company, /既存の技術を深く理解し、組み合わせ、拡張し、/);
  assert.match(company, /必要であれば、新しい仕組みからつくる。/);
  assert.match(company, /「できること」から考えるのではなく、/);
  assert.match(company, /「つくりたいもの」から、できることを広げていく。/);
  assert.match(company, /クリエイターの想像力が、/);
  assert.match(company, /技術や環境の都合で小さくならない世界へ。/);
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
