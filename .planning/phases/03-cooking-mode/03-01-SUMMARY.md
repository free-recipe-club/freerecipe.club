---
phase: 03-cooking-mode
plan: 01
subsystem: ui
tags: [server-rendering, ingredient-matching, cooking-mode, accessibility]

requires:
  - phase: 02-recipe-display-seo
    provides: Recipe display page, recipe data layer, route/controller patterns

provides:
  - Server-rendered cooking mode at /recipes/:slug/cook
  - Ingredient-step auto-matching algorithm
  - Cooking mode HTML structure (DOM contract for Plan 02 JS/CSS)

affects: [03-02, cooking-mode-enhancements]

tech-stack:
  added: []
  patterns:
    - Standalone HTML shell (no shared render() wrapper) for immersive full-viewport pages
    - Ingredient extraction and step matching via regex + word-boundary search

key-files:
  created:
    - app/controllers/recipes/cook.tsx
  modified:
    - app/routes.ts
    - app/router.ts

key-decisions:
  - "Cooking mode uses its own HTML shell (not render() helper) — no nav bar, standalone document"
  - "Cook route registered before show route in router.ts to prevent :slug matching 'pumpkin-doughnut/cook'"
  - "Ingredient matching: two-pass (exact substring then significant-word) with simple plural handling"

patterns-established:
  - "Immersive page pattern: standalone HTML document without shared nav/header for focused experiences"
  - "Ingredient extraction: strip leading quantity+unit from ingredient strings via regex"

requirements-completed: [DISP-09, DISP-10]

duration: 8min
completed: 2026-03-24
---

# Plan 03-01: Cooking Mode Route & Server-Rendered HTML Summary

**Server-rendered cooking mode at `/recipes/:slug/cook` with ingredient-step auto-matching and full accessibility markup.**

## Performance

- **Duration:** ~8 min
- **Tasks:** 1 completed
- **Files modified:** 3

## Accomplishments
- Created cooking mode controller with ingredient extraction and step-matching algorithm
- Wired `/recipes/:slug/cook` route before show route to prevent slug conflicts
- Server-rendered HTML includes progress bar, step counter, navigation buttons, ingredient panels, and aria attributes
- No-JS fallback: all steps visible in vertical layout without JavaScript
- 404 handling for nonexistent recipe slugs

## Task Commits

1. **Task 1: Cooking mode route, controller, and ingredient-matched HTML** - `90f2cb8` (feat)

## Files Created/Modified
- `app/controllers/recipes/cook.tsx` - Cooking mode controller with escapeHtml, extractIngredientName, matchIngredientsToStep, renderCookingMode, recipeCook
- `app/routes.ts` - Added cook: '/recipes/:slug/cook' route before show
- `app/router.ts` - Imported recipeCook, wired before recipeShow

## Decisions Made
- Used standalone HTML shell instead of shared render() helper — cooking mode has no nav bar per D-11
- Ingredient name extraction strips quantity and common units (c, tsp, tbsp, oz, lb, etc.)
- Two-pass matching: exact substring first, then significant words (≥4 chars, excluding common adjectives)
- Simple plural handling with trailing "s" add/strip

## Deviations from Plan
None - plan executed as specified.

## Issues Encountered
None.
