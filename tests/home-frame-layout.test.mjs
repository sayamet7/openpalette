import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');

test('top page exposes stable home layout hooks without changing the FV structure', () => {
  assert.match(html, /<body class="home-page">/);
  assert.match(html, /<main class="home-main">/);
  assert.match(html, /<section class="hero hero-film" id="top"/);
});

test('home header keeps its logo and navigation visible over the opening FV image', () => {
  assert.match(html, /<header class="site-header"[^>]*data-header>/);
  assert.doesNotMatch(script, /lightHeaderPhases|hero-light/);
  assert.match(css, /\.home-page \.site-header\s*,\s*\.home-page \.site-header\.scrolled\s*\{[^}]*background:\s*#171717/s);
  assert.match(css, /\.home-page \.site-header\s*,\s*\.home-page \.site-header\.scrolled\s*\{[^}]*color:\s*#f5f2ea/s);
  assert.match(css, /\.home-page \.site-header\s*,\s*\.home-page \.site-header\.scrolled\s*\{[^}]*text-shadow:\s*none/s);
  assert.match(css, /\.home-page \.site-header \.brand-logo-light\s*\{[^}]*opacity:\s*1/s);
  assert.match(css, /\.home-page \.site-header \.brand-logo-dark\s*\{[^}]*opacity:\s*0/s);
});

test('only the major sections below the FV receive individual frames', () => {
  assert.match(css, /\.home-page \.home-main\s*>\s*\.tools\s*\{[^}]*width:\s*min\(/s);
  assert.match(css, /\.home-page \.home-main\s*>\s*\.tools\s*\{[^}]*margin:\s*[^;]*auto/s);
  assert.match(css, /\.home-page \.home-main\s*>\s*\.tools\s*\{[^}]*border:\s*1px/s);
  assert.match(css, /\.home-page \.home-main\s*>\s*\.tools\s*\{[^}]*border-radius:/s);
  assert.match(css, /\.home-page \.home-main\s*>\s*\.news-section\s*\{[^}]*border:\s*1px/s);
  assert.match(css, /\.home-page \.home-main\s*>\s*\.news-section\s*\{[^}]*border-radius:/s);
  assert.doesNotMatch(css, /\.home-page \.home-main\s*>\s*\.hero[^\{]*\{[^}]*border:/s);
});

test('products become compact side-by-side cards below the FV', () => {
  assert.match(css, /\.home-page \.home-main\s*>\s*\.tools\s*\{[^}]*grid-template-columns:\s*repeat\(2/s);
  assert.match(css, /\.home-page \.home-main\s*>\s*\.tools\s*>\s*\.product\s*\{[^}]*display:\s*flex/s);
  assert.match(css, /\.home-page \.home-main\s*>\s*\.tools\s*>\s*\.product\s*\{[^}]*flex-direction:\s*column/s);
  assert.match(css, /\.home-page \.tools-heading\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s);
  assert.match(css, /\.home-page \.product\s*\{[^}]*min-height:\s*560px/s);
});

test('news is stacked as bordered blocks below the product cards', () => {
  assert.match(css, /\.home-page \.news-list\s*\{[^}]*display:\s*grid/s);
  assert.match(css, /\.home-page \.news-list\s*\{[^}]*gap:/s);
  assert.match(css, /\.home-page \.news-item\s*\{[^}]*border:\s*1px/s);
  assert.match(css, /\.home-page \.news-item\s*\{[^}]*border-radius:/s);
});
