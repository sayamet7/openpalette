import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const pages = ['index.html', 'research.html', 'developers.html', 'company.html'];

for (const page of pages) {
  test(`${page} omits the removed footer slogans`, () => {
    const html = readFileSync(new URL(`../${page}`, import.meta.url), 'utf8');

    assert.doesNotMatch(html, /Keep your/i);
    assert.doesNotMatch(html, /Creative tools/i);
    assert.doesNotMatch(html, /class="footer-top/);
    if (page === 'developers.html') {
      assert.doesNotMatch(html, /弊社関連製品のバグ報告はこちらにお願いします/);
    }
  });
}
