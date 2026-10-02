---
plan: 06-03
status: complete
commit: 5f0f9ab
---

## What Was Done

### Task 1: Variant cross-links on recipe pages
- Added `findVariants()` helper to `app/data/recipes.ts` — scans all recipe slugs to find recipes whose `variant_of` matches a given parent slug
- Updated `renderRecipe()` in `app/controllers/recipes/show.tsx`:
  - **"See Also" section**: When variants exist for a recipe, a grid of links to variant recipes appears after the links footer
  - **"Based on" back-link**: When a recipe has `variant_of` set, a link back to the parent recipe is shown above the "Start Making" button
- Variants appear in the normal recipe index since they're standard YAML files — no extra wiring needed

### Task 2: Annotation issue template + extended CI validation
- Created `.github/ISSUE_TEMPLATE/annotation_submission.md` with fields: Recipe, Element, Annotation Type (substitution/tip checkboxes), Your Suggestion, Your Name
- Extended `scripts/validate-recipes.ts` with:
  - **Annotation quality checks**: empty text, invalid type, empty contributor on both component and direction annotations
  - **Variant reference validation**: warns if `variant_of` references a slug whose YAML file doesn't exist

## Deviations

None.

## Artifacts
| File | Role |
|------|------|
| `app/data/recipes.ts` | `findVariants()` helper |
| `app/controllers/recipes/show.tsx` | "See Also" section + "Based on" back-link |
| `.github/ISSUE_TEMPLATE/annotation_submission.md` | Annotation contribution template |
| `scripts/validate-recipes.ts` | Extended validation with annotation + variant checks |
