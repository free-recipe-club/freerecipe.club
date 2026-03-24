# Phase 3: Cooking Mode - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can enter a focused, step-by-step cooking experience optimized for kitchen use. This covers the cooking mode view (`/recipes/:slug/cook`), wake lock, step navigation, ingredient-step highlighting, and the visual treatment of cooking mode. The normal recipe display page (Phase 2) is untouched except for adding a "Start Cooking" button. Themed packs (Phase 4), annotations (Phase 6), and any interactive features beyond cooking mode are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Entry & Exit
- **D-01:** Separate URL — cooking mode lives at `/recipes/:slug/cook`. Allows bookmarking and sharing the cooking view directly.
- **D-02:** A "Start Cooking" button on the recipe detail page navigates to the cooking mode URL.
- **D-03:** Exit via a small exit button in the corner of cooking mode. Navigates back to the recipe page.
- **D-04:** Graceful no-JS fallback — cooking mode still renders with large text and step display, but wake lock is unavailable. The "Start Cooking" button still appears on the recipe page regardless of JS availability.

### Step Navigation
- **D-05:** One step at a time (card view) — each step fills the viewport for maximum focus. No scrolling through steps.
- **D-06:** Prev/Next buttons for step navigation. Large tap targets (48px+) at the bottom of the viewport. No swipe gestures.
- **D-07:** Step counter ("Step 3 of 8") plus a thin progress bar at the top for orientation.

### Ingredient-Step Linking
- **D-08:** Auto-match via pattern matching — parse step text for words matching ingredient names from the components list at render time. Zero YAML schema changes. Works for existing recipes.
- **D-09:** Ingredient panel per step — matched ingredients shown in a dedicated panel alongside the step text (e.g., above or below the step on mobile). Not inline text highlighting.

### Visual Treatment
- **D-10:** Follow system preference for dark/light mode. Users with system dark mode get a dark cooking mode (dark background, light text); others get light.
- **D-11:** Fully stripped chrome — no nav bar, no header. Only step content, ingredient panel, prev/next buttons, progress bar, and exit button.
- **D-12:** Extra large text — step text at 24px+ (1.5rem+) for readability at arm's length. Ingredient panel slightly smaller but still large.

### Agent's Discretion
- Dark mode color palette (specific dark background, text colors, accent handling)
- Light mode cooking adjustments from the existing cream palette
- Exact progress bar styling and placement
- How the ingredient auto-matching handles edge cases (partial matches, plurals, etc.)
- "Start Cooking" button styling and placement on the recipe page
- Wake Lock API implementation details and error handling
- Step card layout proportions and spacing

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-Level
- `.planning/PROJECT.md` — Vision, constraints, analog ethos, kitchen accessibility requirement
- `.planning/REQUIREMENTS.md` — Phase 3 maps to DISP-09, DISP-10
- `.planning/ROADMAP.md` — Phase 3 goal and success criteria

### Prior Phase Context
- `.planning/phases/01-foundation-data-layer/01-CONTEXT.md` — Framework decisions (alpha Remix), zero third-party scripts
- `.planning/phases/02-recipe-display-seo/02-CONTEXT.md` — Recipe page layout decisions, ephemeral checkboxes, native HTML checkboxes, print stylesheet patterns

### Existing Code
- `app/controllers/recipes/show.tsx` — Current recipe detail page (cooking mode entry point, ingredient rendering, step rendering)
- `app/controllers/render.tsx` — HTML render helper (will need a cooking mode variant or extension)
- `app/data/recipe-schema.ts` — Zod schema: `components` is `string[][]` (grouped ingredients), `directions` is `string[]`
- `app/data/recipes.ts` — `loadRecipe(slug)`, `getRecipeFilename()` functions
- `app/routes.ts` — Route definitions (need to add cooking mode route)
- `app/router.ts` — Router setup (need to wire cooking mode controller)
- `app/styles/input.css` — Tailwind v4 config with brand colors, print styles

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `loadRecipe(slug)` / `getRecipeFilename()` — Recipe loading for the cooking mode route
- `render()` helper — Can be extended or a parallel cooking mode render function created
- `escapeHtml()` — Available in both `render.tsx` and `show.tsx`
- `renderIngredients()` / `renderDirections()` — Existing renderers (cooking mode needs its own but can reference these)
- Tailwind v4 theme variables (`--color-brand-green`, `--color-brand-cream`) — basis for cooking mode palette

### Established Patterns
- Controller pattern: function receives `Request`, returns `Response` via `render()`
- Server-side rendering with no client JS currently — cooking mode introduces the first client-side JavaScript
- Static files served from `public/` — any cooking mode JS will live here
- Routes defined in `routes.ts`, wired in `router.ts`

### Integration Points
- Add `/recipes/:slug/cook` route to `routes.ts`
- Wire new cooking mode controller in `router.ts`
- Add "Start Cooking" button to the existing recipe show page (`show.tsx`)
- Client-side JS file for wake lock + step navigation (first JS file in the project)
- Extend `input.css` with cooking mode styles, dark mode media query, and large-text utilities

</code_context>

<specifics>
## Specific Ideas

- This is the first client-side JavaScript in the project — sets the pattern for future JS enhancements
- Wake Lock API is the standard browser API (`navigator.wakeLock.request('screen')`) — no third-party library needed
- Pattern matching for ingredients should extract ingredient names from the `components` array (second element onwards in each group) and match against step text
- The cooking mode URL (`/recipes/:slug/cook`) means the server renders the cooking mode HTML — client JS enhances with wake lock and potentially smoother transitions
- System dark/light preference via `prefers-color-scheme` media query — no manual toggle needed
- Progress bar + step counter keeps the user oriented without needing to see all steps

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-cooking-mode*
*Context gathered: 2026-03-24*
