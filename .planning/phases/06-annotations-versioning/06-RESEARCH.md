# Phase 6: Annotations & Versioning — Research

**Researched:** 2026-03-24
**Phase requirements:** COMM-04, COMM-05

## Executive Summary

Phase 6 adds community annotations (substitutions and tips) pinned to recipe ingredients and steps, plus variant forking for recipes with significant annotation sets. The core challenge is evolving the YAML schema and Zod types to support annotated elements while maintaining backward compatibility with plain-string items. All state lives in the URL (`?ann=` params) — no accounts, no database. Client JS handles toggle interaction and URL persistence; SSR renders the base recipe with annotation markup for progressive enhancement.

## Standard Stack

Everything in this phase uses established project patterns — no new dependencies needed.

| Concern | Approach | Rationale |
|---------|----------|-----------|
| Schema evolution | Zod union types (string \| AnnotatedItem) | `directions` already uses `z.union([z.string(), z.array(z.string())])` — exact same pattern |
| Client JS | Vanilla JS file in `public/` | Matches `public/cook.js` precedent — no build step, no framework |
| Toggle state persistence | URL search params (`?ann=1,3,5`) | No accounts, no localStorage — URL IS the customization. `history.replaceState` for no-reload updates |
| Annotation rendering | Server-rendered HTML with `data-*` attributes | SSR-first pattern — JS enhances toggles, recipe is readable without JS |
| Variant files | Full independent YAML copies | Per D-12 — not diff/overlay. Simple, no merge logic needed |
| CI validation | Extend existing `validate-recipes.ts` | Already validates schema + content quality; add annotation-specific checks |
| Issue templates | New `.github/ISSUE_TEMPLATE/annotation_submission.md` | Matches existing `recipe_submission.md` pattern |

## Architecture Patterns

### 1. Schema Evolution — Union Type Pattern

The current schema uses `string[][]` for components and `(string | string[])[]` for directions. Annotations require evolving individual items from plain strings to objects.

**Annotated ingredient item:**
```typescript
const AnnotationSchema = z.object({
  text: z.string().min(1),
  type: z.enum(['substitution', 'tip']),
  contributor: z.string().min(1),
})

// An ingredient can be a plain string OR an annotated object
const IngredientItemSchema = z.union([
  z.string(),
  z.object({
    text: z.string().min(1),
    annotations: z.array(AnnotationSchema).min(1),
  }),
])
```

**Component group evolution:**
- Current: `string[]` where `[0]` is the group name, rest are ingredients
- New: `(string | { text: string, annotations: [...] })[]` where `[0]` is still the group name (always a plain string), items at `[1+]` can be either

**Direction item evolution:**
- Flat string steps: `string` → `string | { text: string, annotations: [...] }`
- Grouped steps: `string[]` where `[0]` is section name, rest are steps → same union on the step items

**Key insight:** Group headers (component name, section name) are always at index 0 and should NEVER have annotations. Only items at index 1+ can be annotated. This simplifies validation.

### 2. Annotation ID Scheme

Each annotation needs a deterministic numeric ID for URL params. The scheme must be stable across page loads and not depend on rendering order.

**Proposed: Positional encoding**
- Walk components and directions in YAML order
- Assign IDs sequentially: annotation 1, 2, 3, ... across the entire recipe
- A recipe with 3 annotated ingredients and 2 annotated steps has IDs 1-N where N = total annotation count
- The server-side renderer assigns `data-ann-id="N"` to each annotation's toggle element

**Why sequential works:** Annotations are in YAML flat files — they don't change between requests. Adding a new annotation shifts IDs for subsequent ones, but that's fine because:
1. Shared URLs (`?ann=1,3`) are ephemeral — not persisted in a database
2. If someone adds a new annotation via PR, old shared links may select different annotations — acceptable tradeoff

### 3. Progressive Enhancement Strategy

**Without JS (SSR baseline):**
- Recipe renders with original text only
- Annotation toggles are hidden (CSS: `.ann-toggle { display: none }` as base, JS adds `.ann-js-ready` to body to show them)
- Tip disclosure buttons are hidden
- Recipe is fully readable — annotations are an enhancement

**With JS:**
1. On load: parse `?ann=` URL params, restore toggle state
2. Toggle click: swap text display, update `?ann=` via `history.replaceState`
3. Tip expand: toggle `aria-expanded`, show/hide tip body
4. "Share this version": `navigator.clipboard.writeText(window.location.href)`
5. "Reset": clear all toggles, remove `?ann=` param

**Client JS file:** `public/annotations.js` — separate from `cook.js` since they run on different pages

### 4. Cooking Mode Integration

The cook page (`/recipes/:slug/cook`) needs to read `?ann=` params from the URL and render substituted text in place of originals for active substitutions.

**Approach:**
- `recipeCook()` in `cook.tsx` reads `request.url` search params
- Parse annotation IDs from `?ann=`
- When building cook steps, if a step has an active substitution, use the substitution text instead
- Tips are NOT shown in cooking mode (per D-07 / UI-SPEC)
- The "Start Cooking" link on the recipe page must forward `?ann=` params to the cook URL

### 5. Variant Forking

Variants are full independent YAML files (D-12). They need:
- A `variant_of` field linking back to the parent recipe slug
- The parent recipe page shows "See Also" cross-links to its variants
- Variants appear in the normal recipe index

**Detection of variants at load time:**
- `loadRecipes()` already loads all recipes — filter for `variant_of: slug` to find variants of a given recipe
- No separate index needed; the filesystem IS the index
- Add `variant_of` as optional string field in `RecipeSchema`

### 6. Rendering Changes

**`renderIngredients()` in `show.tsx`:**
- Currently maps `string[][]` — each group is `string[]`
- Needs to handle items that are `{ text, annotations }` objects
- For each annotated item: render the original text + annotation toggle markup with `data-ann-id`
- Each substitution gets a `<button role="switch">` toggle
- Each tip gets a `<button aria-expanded>` disclosure

**`renderDirections()` in `show.tsx`:**
- Currently maps flattened steps as strings
- Same union handling: string stays as-is, object gets annotation markup
- Step checkboxes (existing) wrap the potentially-annotated step text

**`flattenDirections()` in `cook.tsx`:**
- Currently returns `CookStep[]` with `{ text, section }`
- Needs to resolve annotations: if step has an active substitution (from URL params), use substitution text
- Return type unchanged — cooking mode doesn't show annotation UI, just the resolved text

## Don't Hand-Roll

| Concern | Use | Don't |
|---------|-----|-------|
| Toggle accessible switch | `<button role="switch" aria-checked>` | Custom `<div>` with click handler |
| Disclosure pattern | `<button aria-expanded>` controlling `<div>` | Custom show/hide without ARIA |
| URL param parsing | `URLSearchParams` API | Manual string splitting on `?` and `&` |
| Clipboard copy | `navigator.clipboard.writeText()` | `document.execCommand('copy')` (deprecated) |
| Focus management | `focus()` on step text after toggle | No focus management |

## Common Pitfalls

1. **Breaking existing recipes:** Schema changes must be backward-compatible. Plain string items (no annotations) must continue to work unchanged. The Zod union type handles this — `z.union([z.string(), z.object({...})])` accepts both.

2. **Annotation IDs shifting:** When a new annotation is added via PR, the positional IDs change. Shared URLs with `?ann=` params will select different annotations. This is an acceptable tradeoff documented in the codebase — annotations are a community feature, not a permanent link contract.

3. **Cook mode forgetting annotations:** The "Start Cooking" link must include `?ann=` params. If it doesn't, the cook page renders the original recipe without substitutions. The link href needs to be set by JS when annotations are active.

4. **Type narrowing in renderers:** When processing `string | { text, annotations }`, always check `typeof item === 'string'` first. The Zod schema guarantees the union, but TypeScript needs explicit narrowing in the render functions.

5. **Validation script false positives:** The existing `validate-recipes.ts` will fail on annotated recipes because `RecipeSchema` won't match the new structure until the schema is updated. Schema update MUST happen first.

6. **Print view regression:** Active substitutions should print as-is (whatever text is currently displayed). But annotation UI chrome (toggles, badges, indicators) must be `print:hidden`. The print CSS in `input.css` already hides interactive elements.

## Validation Architecture

### Test Boundaries

| Boundary | What to Test |
|----------|-------------|
| Schema parsing | Annotated YAML parses correctly; plain YAML still parses; malformed annotations rejected |
| Annotation ID assignment | IDs are deterministic and sequential across components + directions |
| Toggle URL encoding | `?ann=1,3,5` correctly parsed; empty params = no selections; invalid IDs ignored |
| Variant cross-linking | `variant_of` field detected; parent shows variant links; variant shows "Based on" link |
| CI validation | Annotated recipe passes; malformed annotation fails with clear error |

### Existing Test Infrastructure

The project has test files at root: `_test_index.ts`, `_test_print.ts`, `_test_render.ts`, `_test_show.ts`, `_test_sitemap.ts`. These follow the pattern of importing controllers and asserting on Response content. The validation script (`scripts/validate-recipes.ts`) runs as a standalone Node script.

## Research Summary

| Area | Recommendation | Confidence |
|------|---------------|------------|
| Schema evolution | Zod union types — exact pattern already used in directions | High |
| Client JS | Vanilla JS in `public/annotations.js` — matches cook.js | High |
| Toggle state | URL params + `history.replaceState` — no accounts needed | High |
| SSR progressive enhancement | Hidden toggles without JS, body class gate | High |
| Variant forking | Full YAML copies with `variant_of` field | High |
| Annotation IDs | Sequential positional — simple, deterministic | High |
| CI validation | Extend existing `validate-recipes.ts` | High |

No new dependencies required. All patterns follow established codebase conventions.

---

## RESEARCH COMPLETE
