# BFIX — landing page (Astro + GSAP)

Desktop main page `d_mainpage` from the BFIX_V2 Figma file, built on the UI-kit tokens.

## Run

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Structure

- `src/styles/tokens.css` — UI-kit colors and sizes as CSS variables
- `src/styles/global.css` — text styles (`.t-display`, `.t-h1`, `.t-h2`, `.t-h3`, `.t-body`, `.t-label`), chamfer helper `.cut`
- `src/components/` — one component per section, plus `Button`, `IconTile`, `BrushCard`, `Bricks`
- `src/data/content.ts` — services, projects, reviews, articles, before/after slides
- `src/scripts/animations.ts` — GSAP + ScrollTrigger reveal animations
- `public/img/` — images exported from Figma (WebP, 2×)
- `src/icons/` — SVG icons exported from Figma

## Notes

- The services block (`Services.astro`) has a sticky left card; the right column scrolls through all six services.
- Before/after slider: drag with mouse or touch, arrow keys on the handle, arrows below switch projects.
  All six slides use the same photo pair for now; swap the paths in `compareSlides` in `src/data/content.ts`.
- The contact form only validates and shows a message; it does not send anything yet.
- Animations are disabled automatically when the system "reduce motion" setting is on.
