/**
 * @file tests/filters.test.mjs
 * @purpose Regression checks for combined paper filters and valid BibTeX output.
 * @maintain Run npm test; add behavior cases when changing lib/filters.ts.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesPaper, toBibtex } from '../src/lib/filters.ts';

const paper = { title: 'Prompt Injection in Tool-Using Agents', authors: ['René Chen', 'Rui Zhang'], year: 2026, venue: 'IEEE Symposium on Security and Privacy', venueShort: 'IEEE S&P' };
const all = { query: '', year: '', conference: '' };
test('empty filters show every paper', () => assert.equal(matchesPaper(paper, all), true));
test('title search is case insensitive and requires every word', () => {
  assert.equal(matchesPaper(paper, { ...all, query: ' AGENTS prompt ' }), true);
  assert.equal(matchesPaper(paper, { ...all, query: 'agents robotics' }), false);
});
test('authors and conference aliases are searchable without accents', () => {
  assert.equal(matchesPaper(paper, { ...all, query: 'rene' }), true);
  assert.equal(matchesPaper(paper, { ...all, query: 'IEEE S&P' }), true);
});
test('year, conference and query are combined, not alternatives', () => {
  assert.equal(matchesPaper(paper, { query: 'Rui', year: '2026', conference: 'IEEE S&P' }), true);
  assert.equal(matchesPaper(paper, { query: 'Rui', year: '2025', conference: 'IEEE S&P' }), false);
  assert.equal(matchesPaper(paper, { query: '', year: '2026', conference: 'CCS' }), false);
});
test('non-Latin author names remain searchable', () => assert.equal(matchesPaper({ ...paper, authors: ['张瑞'] }, { ...all, query: '张瑞' }), true));
test('BibTeX escapes special characters and separates authors correctly', () => {
  const bib = toBibtex('paper/key', { ...paper, title: 'Tools & {Agents}' });
  assert.match(bib, /@inproceedings\{paper-key,/);
  assert.ok(bib.includes('title = {Tools \\& \\{Agents\\}}'));
  assert.ok(bib.includes('René Chen and Rui Zhang'));
  assert.ok(bib.includes('year = {2026}'));
});
