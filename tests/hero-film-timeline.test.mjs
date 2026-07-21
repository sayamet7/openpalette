import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

test('FV exposes the six requested visual states', () => {
  assert.match(html, /data-film-kv/);
  assert.match(html, /data-film-words/);
  assert.match(html, /data-film-split/);
  assert.match(html, /data-film-slide/);
  assert.match(html, /data-film-triptych/);
  assert.match(html, /data-film-statement/);
  assert.match(html, /Comb-Assisted(?:<br\s*\/?>|\s)+Evaluation of G2(?:<br\s*\/?>|\s)+\(Curvature Continuity\)(?:<br\s*\/?>|\s)+for Clearer Bump Detection/s);
});

test('FV opens with the pre-revision hero image', () => {
  assert.match(
    html,
    /<figure class="film-state film-state-kv"[^>]*data-film-kv>\s*<img[^>]+src="\.\/assets\/creative-worktable-type\.png"/,
  );
});

test('FV runs six three-second phases in an 18-second loop', () => {
  assert.match(script, /const loopDuration = 18/);
  assert.match(script, /\[0, 'kv'\][\s\S]*\[3, 'words'\][\s\S]*\[6, 'split'\][\s\S]*\[9, 'slide'\][\s\S]*\[12, 'triptych'\][\s\S]*\[15, 'statement'\]/);
  assert.doesNotMatch(script, /const loopDuration = 28/);
});

test('FV has explicit styling hooks for each state and keeps the final state accessible', () => {
  for (const phase of ['kv', 'words', 'split', 'slide', 'triptych', 'statement']) {
    assert.match(css, new RegExp(`\\.film-stage\\.phase-${phase}`));
  }
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]*phase-statement/);
});
