import { defineConfig } from 'astro/config';

// On GitHub Pages the site lives in /<repo-name>/; the deploy workflow passes it in BASE_PATH.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  server: { port: 4321 },
});
