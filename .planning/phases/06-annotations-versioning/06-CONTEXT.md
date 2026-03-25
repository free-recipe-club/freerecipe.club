# Phase 6: Annotations & Versioning - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Community members can contribute contextual tips and substitutions on recipes, pinned to specific ingredients or steps, and popular annotation sets can graduate to standalone recipe variants (forks). This covers: annotation data model (inline in recipe YAML), annotation display with toggle-based selection, annotation persistence via URL params, cooking mode integration with selected annotations, contribution workflow (PR + issue template), CI validation of annotations, and variant forking with cross-linking. No new recipe display features, no accounts, no database — everything stays in YAML flat files contributed via GitHub PRs.

</domain>

<decisions>
## Implementation Decisions

### Annotation Data Model
- **D-01:** Annotations live inside the recipe YAML file, nested directly under the ingredient or step they annotate. No separate annotation files.
- **D-02:** Schema evolution — annotated ingredients and steps become objects with `text` + `annotations` fields. Plain strings remain valid as shorthand for items without annotations (union type: `string | { text: string, annotations: [...] }`).
- **D-03:** Two annotation types: **substitutions** (replace/swap content, toggleable) and **tips** (informational advice, non-replacing). A `type` field differentiates them.
- **D-04:** Each annotation includes contributor attribution (GitHub username or display name) stored alongside the tip text.

### Annotation Display
- **D-05:** Toggle switches on annotated elements — substitutions can be toggled on/off to swap the ingredient or step text in place. Tips displayed as informational markers (always visible or expandable).
- **D-06:** Selected annotation toggles persisted via URL parameters (e.g., `?ann=1,3,5`) — shareable links encode a user's customized version of the recipe. No localStorage, no accounts.
- **D-07:** Cooking mode reflects selected annotations — when a user enters cooking mode with annotation selections active, the cooking view shows the modified recipe with substitutions applied.

### Contribution Workflow
- **D-08:** Both contribution paths — technical contributors edit recipe YAML directly via PR; non-technical contributors use a dedicated annotation issue template (maintainer adds to YAML).
- **D-09:** CI validation extended to check annotation structure — valid targets, required fields (text, type, contributor), proper nesting under existing elements.
- **D-10:** New GitHub issue template for annotation submissions — contributor specifies recipe, target element, annotation type (substitution/tip), and the annotation text.

### Variant Forking
- **D-11:** Variant creation is a manual maintainer decision or community-requested (via issue). Annotation count can serve as a signal for when to consider forking, but no automatic trigger.
- **D-12:** Variants are full independent YAML files — a complete copy of the recipe with selected annotations baked in. Not a diff/overlay.
- **D-13:** A `variant_of` field in the variant's YAML references the parent recipe slug. The parent recipe page computes and displays cross-links to its variants.
- **D-14:** Variants are discoverable both ways — listed normally in recipe index like any other recipe AND cross-linked from the original recipe page (e.g., "See also: Gluten-Free Pumpkin Doughnut").

### Agent's Discretion
- Exact YAML structure for annotated ingredients/steps (field names, nesting format)
- Annotation toggle UI design (switch styling, indicator placement)
- URL parameter encoding scheme for annotation selections
- How tips vs substitutions render differently in the UI
- Issue template exact wording and fields
- Validation script enhancement details (what constitutes a valid annotation target)
- Cross-link display design on recipe pages (placement, styling)
- How annotations render in print view (if at all)
- Variant naming conventions for YAML files and URL slugs

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-Level
- `.planning/PROJECT.md` — Vision, constraints, annotation model philosophy (pinned to recipe lines, not flat comments), no accounts, no database
- `.planning/REQUIREMENTS.md` — Phase 6 maps to COMM-04, COMM-05
- `.planning/ROADMAP.md` — Phase 6 goal and success criteria

### Prior Phase Context
- `.planning/phases/01-foundation-data-layer/01-CONTEXT.md` — Framework (alpha Remix), YAML format can evolve, Zod validation with hard fail, CI pipeline
- `.planning/phases/02-recipe-display-seo/02-CONTEXT.md` — Recipe page layout (compact thumbnail, linear flow), ephemeral checkboxes, SSR-first, render() pattern
- `.planning/phases/03-cooking-mode/03-CONTEXT.md` — Cooking mode at `/recipes/:slug/cook`, step navigation, ingredient auto-matching, dark/light system preference, first client JS
- `.planning/phases/04-themed-packs/04-CONTEXT.md` — Pack field in recipe YAML, CSS custom properties, theme-aware cooking mode
- `.planning/phases/05-community-contributions/05-CONTEXT.md` — PR/issue templates, CI validation enhancements, CONTRIBUTING.md, Hacktoberfest setup

### Existing Code (annotation-relevant)
- `app/data/recipe-schema.ts` — Zod schema: `components` is `string[][]`, `directions` is `(string | string[])[]` — both need union types added for annotation support
- `app/data/recipes.ts` — `loadRecipe()`, `loadRecipes()`, `listRecipeSlugs()` — recipe loading functions
- `app/controllers/recipes/show.tsx` — Recipe detail page with `renderIngredients()`, `renderDirections()` — annotation display integrates here
- `app/controllers/recipes/cook.tsx` — Cooking mode controller with `flattenDirections()` — needs annotation-aware rendering
- `app/routes.ts` — Route definitions (no new routes needed, but cook route needs to accept annotation params)
- `scripts/validate-recipes.ts` — Validation script to extend with annotation checks
- `data/recipes/pumpkin_doughnut.yml` — Reference recipe to add sample annotations to

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `renderIngredients()` in `show.tsx` — Renders `string[][]` components; needs extension to handle annotated ingredient objects
- `renderDirections()` in `show.tsx` — Renders `(string | string[])[]` directions; needs extension for annotated step objects
- `flattenDirections()` in `cook.tsx` — Flattens direction groups for cooking mode; needs annotation-aware version
- `RecipeSchema` in `recipe-schema.ts` — Zod schema to extend with annotation union types
- `validate-recipes.ts` — Validation script to extend with annotation structure checks
- `escapeHtml()` — Available in both show.tsx and cook.tsx for safe rendering

### Established Patterns
- Controller pattern: function receives Request, returns Response via `render()`
- SSR-first: recipes render fully without JS, JS enhances (toggle interaction needs client JS)
- Client JS precedent: `public/cook.js` exists for cooking mode — annotation toggles follow same pattern
- Zod union types: `directions` already uses `z.union([z.string(), z.array(z.string())])` — same pattern for annotated items
- CSS custom properties via Tailwind v4 `@theme` — annotation styling can use theme-aware variables

### Integration Points
- `recipe-schema.ts` — Add annotation types and extend component/direction schemas with union types
- `show.tsx` — Add annotation toggle rendering to `renderIngredients()` and `renderDirections()`
- `cook.tsx` — Read URL params for annotation selections, render modified recipe in cooking mode
- `public/` — New client JS for annotation toggle interaction and URL param management
- `.github/ISSUE_TEMPLATE/` — New annotation submission issue template
- `scripts/validate-recipes.ts` — Add annotation validation checks

</code_context>

<specifics>
## Specific Ideas

- Annotations as inline YAML nested under elements mirrors the philosophy of "annotations pin to specific recipe lines" from PROJECT.md — the data structure reflects the display intent
- URL param sharing ("my version" links) aligns with the no-accounts, no-database constraint — state lives in the URL, not on a server
- Cooking mode + annotations creates a personalized cooking experience without any user accounts — the URL IS the user's customization
- The toggle UX for substitutions vs info display for tips gives each annotation type a distinct, purpose-matched interaction
- Contributors who "just want to share a tip" get the issue template path; experienced contributors edit YAML directly — matches the dual-path philosophy from Phase 5

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-annotations-versioning*
*Context gathered: 2026-03-24*
