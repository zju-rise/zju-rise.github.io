/**
 * @file scripts/verify-site.mjs
 * @purpose Check generated routes, local assets, anchor targets and source headers.
 * @maintain Runs after build locally and in CI; add deliberate generated-file exceptions here.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}
const files = await walk('dist');
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const errors = [];
const assetTargets = new Set();
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (!html.includes('<html lang="en"')) errors.push(`${file}: missing English language declaration`);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) errors.push(`${file}: expected exactly one h1`);
  if (!html.includes('name="viewport"')) errors.push(`${file}: missing responsive viewport`);
  if (/figma\.com\/api\/mcp\/asset\//.test(html)) errors.push(`${file}: temporary Figma asset reference`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${file}: duplicate HTML IDs`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]*)"/g)) {
    const raw = match[1].replaceAll('&amp;', '&');
    if (!raw || /^(https?:|mailto:|data:)/.test(raw)) continue;
    const base = `https://zju-rise.github.io/${path.relative('dist', file)}`;
    const url = new URL(raw, base);
    let target = path.join('dist', decodeURIComponent(url.pathname));
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      assert.ok((await stat(target)).size > 0, 'empty asset');
      assetTargets.add(target);
      if (url.hash && target.endsWith('.html')) {
        const targetHtml = await readFile(target, 'utf8');
        if (!targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)) throw new Error('missing anchor');
      }
    } catch (error) { errors.push(`${file}: broken local reference ${raw} (${error.message})`); }
  }
}
for (const required of ['index.html', 'research/index.html', 'publications/index.html', 'people/index.html', '404.html']) {
  if (!files.includes(`dist/${required}`)) errors.push(`Missing required output: ${required}`);
}
// Handwritten files carry self-description; generated lockfiles and binary media cannot carry comments.
const sources = [...await walk('src'), ...await walk('scripts'), ...await walk('tests'), ...await walk('docs'), ...await walk('.github')];
for (const file of sources) {
  const content = await readFile(file, 'utf8');
  if (file.endsWith('.md') && file.startsWith('src/content/')) {
    if (!content.startsWith('---\npurpose:') || !content.includes('\nmaintain:')) errors.push(`${file}: missing content header`);
  } else if (!content.slice(0, 700).includes('@purpose') || !content.slice(0, 700).includes('@maintain')) {
    errors.push(`${file}: missing file self-description`);
  }
}
assert.equal(errors.length, 0, `Site verification failed:\n${errors.join('\n')}`);
console.log(`Verified ${htmlFiles.length} HTML routes, ${assetTargets.size} local link/asset targets and ${sources.length} source headers.`);
