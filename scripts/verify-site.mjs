/**
 * @file scripts/verify-site.mjs
 * @purpose Check generated routes, local assets, anchor targets and source headers.
 * @maintain Runs after build locally and in CI; add deliberate generated-file exceptions here.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}
const files = await walk('dist');
const exactFilePaths = new Set(files);
const publicFiles = await walk('public');
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
      // macOS may resolve wrong-case paths; GitHub Pages runs on case-sensitive Linux.
      if (!exactFilePaths.has(target)) throw new Error('file path capitalization does not match');
      if ((await stat(target)).size === 0) throw new Error('empty asset');
      assetTargets.add(target);
      if (url.hash && target.endsWith('.html')) {
        const targetHtml = await readFile(target, 'utf8');
        if (!targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)) throw new Error('missing anchor');
      }
    } catch (error) {
      if (/^\/(images|files)\//.test(url.pathname)) {
        // Point editors to source assets, not dist (which is regenerated each build).
        const expected = `public${decodeURIComponent(url.pathname)}`;
        const alternatives = publicFiles.filter((candidate) => path.basename(candidate).toLowerCase() === path.basename(expected).toLowerCase());
        const hint = alternatives.length
          ? `\n  发现同名文件：${alternatives.join('、')}。如果使用这个文件，请把资料中的路径改成 ${alternatives[0].replace(/^public/, '')}。`
          : '\n  请把文件放到上面的位置，或修正资料中的 photo/下载链接。文件名和大小写必须一致。';
        errors.push(`${file}\n  找不到资源：${raw}\n  代码中应有文件：${expected}${hint}`);
      } else {
        errors.push(`${file}: broken local reference ${raw} (${error.message})`);
      }
    }
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
if (errors.length) {
  console.error(`网站检查未通过，共 ${errors.length} 项：\n\n${errors.join('\n\n')}\n\n请修改源文件后重新运行 npm run verify；不要修改 dist/。\n维护步骤：docs/maintenance.md`);
  process.exit(1);
}
console.log(`Verified ${htmlFiles.length} HTML routes, ${assetTargets.size} local link/asset targets and ${sources.length} source headers.`);
