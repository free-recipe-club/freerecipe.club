---
phase: 06-annotations-versioning
plan: 01
status: complete
started: 2026-03-24
completed: 2026-03-24
---

# Plan 06-01 Summary: Schema & Data Layer for Annotations

## What Was Built

Evolved the recipe schema to support inline annotations (substitutions and tips) on ingredients and steps, added a deterministic annotation ID helper, and created a sample annotated recipe.

## Tasks Completed

| # | Task | Status |
|---|------|--------|
| 1 | Evolve Zod schema with annotation union types | ✓ Complete |
| 2 | Add collectAnnotations helper and annotate pumpkin_doughnut.yml | ✓ Complete |

## Key Files

### Created
- (none — all modifications to existing files)

### Modified
- `app/data/recipe-schema.ts` — Added AnnotationSchema, AnnotatedItemSchema, IngredientItemSchema, DirectionItemSchema unions, variant_of field, exported Annotation/AnnotatedItem types
- `app/data/recipes.ts` — Added CollectedAnnotation type and collectAnnotations() function
- `data/recipes/pumpkin_doughnut.yml` — Added substitution annotation on flour ingredient, tip annotation on bake step
- `app/controllers/recipes/show.tsx` — Updated renderIngredients/flattenDirections to handle union types
- `app/controllers/recipes/cook.tsx` — Updated flattenDirections to handle union types

## Verification

- `npx tsx scripts/validate-recipes.ts` — ✓ passes (annotated recipe validates)
- `npx tsc --noEmit` — ✓ no new errors (only pre-existing router.ts type mismatches)
- Backward compatibility — plain string recipes continue to parse unchanged

## Deviations

- Updated show.tsx and cook.tsx helpers to extract plain text from annotated items, ensuring TypeScript compilation succeeds. Plan 06-02 will replace these with full annotation rendering.
