import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../research.html', import.meta.url), 'utf8');
const researchCss = readFileSync(new URL('../research.css', import.meta.url), 'utf8');
const globalCss = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

const tocTargets = [
  'overview',
  'g0',
  'g1',
  'g2',
  'importance',
  'perception',
  'manual-adjustment',
  'design-intent',
];

test('research page keeps the left-hand section navigation', () => {
  assert.match(html, /class="research-article-shell"/);
  assert.match(html, /<nav class="research-toc" aria-label="In this research">/);

  for (const target of tocTargets) {
    assert.match(html, new RegExp(`href="#${target}"`));
    assert.match(html, new RegExp(`id="${target}"`));
  }
});

test('research navigation remains a sticky left rail on desktop', () => {
  assert.match(
    researchCss,
    /\.research-page \.research-article-shell\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:/s,
  );
  assert.match(
    researchCss,
    /\.research-page \.research-toc\s*\{[^}]*position:\s*sticky[^}]*top:/s,
  );
});

test('the site-wide heading scale is capped at 45px', () => {
  assert.match(globalCss, /:where\(h1,h2,h3,h4,h5,h6\)[^{]*\{[^}]*45px[^}]*!important/s);
});

test('research typography follows the English OpenAI article scale', () => {
  assert.match(researchCss, /\.research-document h1\s*\{[^}]*font-size:\s*45px\s*!important/s);
  assert.match(researchCss, /\.research-document h2\s*\{[^}]*font-size:\s*28px\s*!important/s);
  assert.match(researchCss, /\.research-document p\s*\{[^}]*font-size:\s*17px/s);
  assert.match(researchCss, /\.research-page \.research-toc a\s*\{[^}]*font-size:\s*12px[^}]*line-height:\s*15px/s);
});
