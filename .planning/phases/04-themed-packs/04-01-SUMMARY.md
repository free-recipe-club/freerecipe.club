---
phase: 04-themed-packs
plan: 01
status: complete
started: "2026-03-24"
completed: "2026-03-24"
---

# Plan 04-01 Summary: CSS Theme System Foundation

## What Was Built

Pack data model (Zod schema + YAML files + loaders) and CSS custom property theme system that replaces all hardcoded green/cream brand colors across every page.

## Key Files

### Created
- `app/data/pack-schema.ts` — Zod schemas for pack and active pack validation
- `app/data/packs.ts` — Pack loader functions (loadPack, loadPacks, getActivePack, getActiveThemeClass, loadRecipesByPack)
- `data/packs/autumn-harvest.yml` — First pack with full theme definition
- `data/packs/_active.yml` — Active pack configuration

### Modified
- `app/data/recipe-schema.ts` — Added optional `pack` field to RecipeSchema
- `data/recipes/pumpkin_doughnut.yml` — Added `pack: autumn-harvest`
- `app/styles/input.css` — Added theme custom property system (.theme-autumn-harvest with 17 site-wide + 7 cooking mode properties), dark mode cooking support
- `app/controllers/render.tsx` — Imports getActiveThemeClass, body uses theme class, nav uses CSS variables, added Packs nav link, accepts themeClass option
- `app/controllers/home/controller.tsx` — Replaced brand color classes with CSS variables
- `app/controllers/recipes/show.tsx` — Replaced brand color classes with CSS variables
- `app/controllers/recipes/index.tsx` — Replaced brand color classes with CSS variables
- `app/controllers/recipes/cook.tsx` — Added theme class to cooking mode body, updated error page
- `app/controllers/not-found.tsx` — Replaced brand color classes with CSS variables

## Deviations

None — implementation follows plan exactly.

## Self-Check: PASSED

- [x] Pack data model validates and loads correctly
- [x] getActiveThemeClass() returns "theme-autumn-harvest"
- [x] CSS builds without errors
- [x] No hardcoded brand colors remain in any controller
- [x] All existing tests pass
- [x] Recipe validation passes with new pack field
