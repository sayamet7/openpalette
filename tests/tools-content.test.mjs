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

test('Tool cards expose separate macOS analysis and Adobe native actions', () => {
  assert.match(html, /Analysis Tool/);
  assert.match(html, /Software for macOS/);
  assert.match(html, /Adobe Native Tool/);
  assert.match(html, /class="macos-mark"/);
  assert.match(html, /aria-label="Available for macOS"/);
  assert.match(css, /\.product-actions\s*\{[^}]*display:\s*grid/s);
  assert.match(css, /\.macos-mark\s+svg\s*\{[^}]*width:/s);
});
