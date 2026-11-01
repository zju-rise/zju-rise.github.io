/**
 * @file astro.config.mjs
 * @purpose Build a static site for the organization's root GitHub Pages domain.
 * @maintain Change site when moving domain; set base only for a project subpath.
 */
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://zju-rise.github.io',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  build: { format: 'directory' },
});
