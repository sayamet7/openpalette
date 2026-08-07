import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

test('Tool cards remove the old feature list and next-tool prompt', () => {
  assert.doesNotMatch(html, /G2 Curvature|Fairness Check|SVG Ready/);
  assert.doesNotMatch(html, /What should we\s*make\s*next\?/);
  assert.doesNotMatch(html, /class="feature-list/);
  assert.doesNotMatch(html, /class="next-tool/);
});

test('Tool cards separate the upcoming macOS analysis tool from Adobe purchase actions', () => {
  assert.match(html, /Analysis Tool/);
  assert.match(html, /For macOS/);
  assert.match(html, /class="product-action product-action-coming-soon"/);
  assert.match(html, /aria-label="Analysis Tool for macOS, coming soon"/);
  assert.match(html, /class="coming-soon-label">Coming soon/);
  assert.doesNotMatch(html, /href="#contact"/);
  assert.match(html, /<strong>Buy on Adobe Exchange<\/strong>/);
  assert.match(html, /<small>Native plug-in for Illustrator<\/small>/);
  assert.match(html, /class="macos-mark"/);
  assert.match(css, /\.product-actions\s*\{[^}]*display:\s*grid/s);
  assert.match(css, /\.macos-mark\s+svg\s*\{[^}]*width:/s);
  assert.match(css, /a\.product-action:hover\s*\{[^}]*transform:/s);
  assert.match(css, /a\.product-action:focus-visible\s*\{[^}]*outline:/s);
  assert.match(css, /\.product-action-coming-soon\s*\{[^}]*cursor:\s*default/s);
});

test('Both Adobe plug-ins link to their live purchase pages', () => {
  assert.match(html, /href="https:\/\/exchange\.adobe\.com\/apps\/cc\/205682\/harmony-lines"/);
  assert.match(html, /href="https:\/\/exchange\.adobe\.com\/apps\/cc\/205730\/harmony-gradient"/);
  assert.match(html, /aria-label="Buy Harmony Lines on Adobe Exchange \(opens in a new tab\)"/);
  assert.match(html, /aria-label="Buy Harmony Gradient on Adobe Exchange \(opens in a new tab\)"/);
  assert.equal((html.match(/target="_blank" rel="noopener noreferrer"/g) || []).length, 2);
});

test('Both products use their current Adobe first-view artwork', () => {
  assert.match(html, /src="\.\/assets\/harmony-lines-fv\.jpg"/);
  assert.match(html, /src="\.\/assets\/harmony-gradient-fv\.jpg"/);
  assert.match(html, /class="product-fv product-fv-lines"/);
  assert.match(html, /class="product-fv product-fv-gradient"/);
  assert.doesNotMatch(html, /Preview unavailable|class="line-visual"/);
  assert.match(css, /\.product-fv\s*\{[^}]*aspect-ratio:\s*17\s*\/\s*10/s);
});

test('Product copy stays concise and reflects the current release state', () => {
  assert.match(html, /Create smooth, G2-continuous corners in Illustrator\./);
  assert.match(html, /Beautiful gradients, made simple\./);
  assert.equal((html.match(/class="status available"/g) || []).length, 2);
  assert.doesNotMatch(html, /Submitted for review|Adobe review in progress|In development/);
});
