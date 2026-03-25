---
phase: 06-annotations-versioning
plan: 02
status: complete
started: 2026-03-24
completed: 2026-03-24
---

# Plan 06-02 Summary: Annotation Display + Per-Step Make Mode

## What Was Built

Annotation rendering on recipe pages (substitution toggle cards, tip disclosures), client-side interaction with URL persistence, and a refactored make mode that server-renders one step per page — fully functional without JavaScript.

## Tasks Completed

| # | Task | Status |
|---|------|--------|
| 1 | Annotation rendering in show.tsx + annotation CSS + annotations.ts client script | ✓ Complete |
| 2 | Make mode refactored to per-step server-rendered pages | ✓ Complete (deviation from plan) |
| 3 | Human verification checkpoint | ✓ Approved |

## Key Files

### Created
- `app/scripts/annotations.ts` — TypeScript client for annotation toggle state, URL persistence, share/reset
- `public/annotations.js` — Built bundle from annotations.ts
- `dist/recipes/pumpkin-doughnut/make/{2..8}/index.html` — Per-step static pages

### Modified
- `app/controllers/recipes/show.tsx` — Annotation rendering (substitution cards, tip disclosures, selection bar)
- `app/controllers/recipes/make.tsx` — Refactored to render one step per page with `<a>` nav links
- `app/scripts/make.ts` — Simplified to wake lock + keyboard shortcuts only
- `app/styles/input.css` — Annotation CSS custom properties, make-btn flex centering
- `app/routes.ts` — Added `makeStep: '/recipes/:slug/make/:step'` route
- `app/router.ts` — Registered makeStep route
- `app/data/recipes.ts` — Added `countSteps()` helper
- `scripts/build-static.ts` — Generates per-step make pages in static build

## Deviations

- **Make mode architecture change**: Plan specified JS-driven step hiding/showing. User requested server-rendered per-step pages instead (works without JavaScript). Each step is its own URL (`/recipes/:slug/make/2`, etc.) with Previous/Next as plain `<a>` links. JS now only provides wake lock and keyboard shortcuts. This is a strict improvement — fully functional no-JS experience.

## Verification

- `npx tsc --noEmit` — only pre-existing router.ts type mismatches (no new errors)
- `npx tsx scripts/validate-recipes.ts` — all recipes validate
- `npx tsx scripts/build-static.ts` — generates 14 pages including 8 per-step make pages
- Human verification: approved — annotations display, toggle, persist in URL, carry to make mode
