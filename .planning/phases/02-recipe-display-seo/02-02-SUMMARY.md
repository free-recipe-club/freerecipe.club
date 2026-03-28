---
phase: 02-recipe-display-seo
plan: 02
subsystem: ui
tags: [jsx, tailwind, ssr, sitemap, seo]

requires:
  - phase: 01-project-skeleton
    provides: Bun server, recipe data layer, render helper
provides:
  - Recipe listing page at /recipes
  - XML sitemap at /sitemap.xml
  - Reusable 404 handler
  - Sitemap route definition
affects: [02-03, seo, future-pages]

tech-stack:
  added: []
  patterns: [dynamic-sitemap, text-list-layout]

key-files:
  created:
    - app/controllers/recipes/index.tsx
    - app/controllers/sitemap.ts
    - app/controllers/not-found.tsx
  modified:
    - app/routes.ts
    - app/router.ts

key-decisions:
  - "Dynamic sitemap generated per-request (not build-time) since SSR architecture makes it trivial"
  - "Listing uses text list with divide-y separators, not card grid, per D-05"

patterns-established:
  - "Block-level anchors for full-width tap targets (py-4 achieves 44px+)"

requirements-completed: [DISP-01, DISP-05, DISP-07, SEO-01, SEO-02, CORE-03]

duration: 5min
completed: 2026-03-24
---

# Plan 02-02: Recipe Listing, Sitemap & 404 Summary

**Recipe listing at /recipes shows all recipes as a text list, /sitemap.xml exposes all URLs for search engines, and a reusable 404 handler catches unmatched routes.**

## Performance

- **Tasks:** 2 completed
- **Files modified:** 5

## Accomplishments

- Recipe listing page with title links, byline, location, and flavor text
- Block-level anchor elements provide 44px+ tap targets for mobile
- Empty state handled with friendly message
- XML sitemap dynamically lists home, /recipes, and all recipe URLs
- Reusable 404 handler with link to recipe listing
- Sitemap route added to route definitions

## Task Commits

1. **Task 1: Recipe listing page and router wiring** - `a8f10dc` (feat)
2. **Task 2: Sitemap XML, 404 handler, routes** - `eeb1fec` (feat)

## Files Created/Modified
- `app/controllers/recipes/index.tsx` - Recipe listing page controller
- `app/controllers/sitemap.ts` - Dynamic XML sitemap generator
- `app/controllers/not-found.tsx` - Reusable 404 page
- `app/routes.ts` - Added sitemap route definition
- `app/router.ts` - Wired recipesIndex and sitemap routes

## Decisions Made
- recipes.index route registered BEFORE recipes.show in router to avoid /recipes matching as a slug

## Deviations from Plan
None - plan executed exactly as written

## Issues Encountered
None
