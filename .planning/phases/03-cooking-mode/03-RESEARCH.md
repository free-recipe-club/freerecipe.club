# Phase 3: Cooking Mode — Research

**Researched:** 2026-03-24
**Discovery Level:** 2 (Standard Research — first client-side JavaScript, Wake Lock API, ingredient auto-matching algorithm)

## Executive Summary

Phase 3 adds cooking mode — the first client-side JavaScript in the project. The cooking mode view lives at `/recipes/:slug/cook`, renders server-side with large-text step cards and an ingredient panel, and is enhanced client-side with step navigation (show/hide), Wake Lock API, and keyboard shortcuts. The ingredient-step auto-matching runs server-side at render time by parsing ingredient names from the `components` array and matching them against step text.

**Key findings:**
1. Wake Lock API is well-supported (Chrome 84+, Edge 84+, Safari 16.4+) and requires zero dependencies — just `navigator.wakeLock.request('screen')`
2. Ingredient auto-matching can be done server-side with simple text parsing — strip quantity/unit prefixes, match remaining ingredient name against step text
3. The existing controller pattern (`Request → Response` via server-rendered HTML) extends naturally — cooking mode is a new controller at a new route
4. Client-side JS will be a single vanilla JS file served from `public/` — no bundler, no framework, no build step needed

## Technical Approach

### 1. Route & Controller (`/recipes/:slug/cook`)

**Pattern:** Same controller pattern as `recipeShow` in `show.tsx`.

```typescript
// app/controllers/recipes/cook.tsx
import { render } from '../render.tsx'
import { loadRecipe, getRecipeFilename } from '../../data/recipes.ts'

export function recipeCook(request: Request): Response {
  let url = new URL(request.url)
  // Extract slug: /recipes/pumpkin-doughnut/cook → pumpkin-doughnut
  let parts = url.pathname.split('/')
  let slug = parts[parts.length - 2] // second-to-last segment
  let filename = getRecipeFilename(slug)
  // ...load recipe, render cooking mode HTML
}
```

**Route definition in `routes.ts`:** Add `cook: '/recipes/:slug/cook'` to the recipes section.

**Router wiring in `router.ts`:** `router.get(routes.recipes.cook, recipeCook)` — must be registered BEFORE `recipes.show` to prevent `/recipes/:slug/cook` being caught by `/recipes/:slug` where slug="pumpkin-doughnut/cook".

**Error handling:** Same as `recipeShow` — if recipe not found, return 404 with the existing 404 page pattern. Use the `not-found.tsx` controller or inline the HTML.

### 2. Cooking Mode HTML Structure

The server renders the full cooking mode page. Per D-05 and D-11, this is a full-viewport immersive view with stripped chrome (no nav bar).

**Render approach:** The cooking mode needs a different HTML shell than the regular `render()` helper — no nav bar, different body class, cooking-mode-specific CSS variables, and a `<script>` tag for client JS. Two options:

1. **New `renderCookingMode()` function** — purpose-built render helper for cooking mode
2. **Extend existing `render()` with options** — add flags like `{ noNav: true, scripts: [...], bodyClass: '...' }`

**Recommendation:** New `renderCookingMode()` function. The cooking mode HTML shell is fundamentally different (no nav, different body class, script tag, cook-mode CSS variables). Trying to make `render()` handle both cases adds complexity for a one-off need.

**Server-rendered HTML (no-JS fallback per D-04):** All steps rendered in the HTML as visible elements. Client JS then hides all steps except the current one. Without JS, user sees all steps in a vertical scroll layout — still usable.

```html
<!-- Server renders all steps with data attributes -->
<div class="cook-step" data-step="1">
  <!-- ingredient panel for step 1 -->
  <!-- step text -->
</div>
<div class="cook-step" data-step="2">
  <!-- ingredient panel for step 2 -->
  <!-- step text -->
</div>
<!-- ... -->
```

### 3. Ingredient-Step Auto-Matching Algorithm (D-08, D-09)

**Runs server-side at render time.** No YAML schema changes needed.

**Step 1 — Extract ingredient names from `components` array:**

The `components` field is `string[][]`. Each sub-array: first element is group name ("Doughnuts", "Topping"), remaining are ingredient strings like "2 c all-purpose flour", "3 lg eggs".

**Parsing strategy:** Strip leading quantity and unit to extract the ingredient name:
- Pattern: `^[\d\s/]+\s*(c|tsp|tbsp|oz|lb|lg|sm|med|cup|cups|can|pkg|pt|qt|gal|ml|g|kg|inch|clove|cloves|bunch|head|stick|sticks|pinch|dash|slice|slices)s?\b\s*`
- Example: "2 c all-purpose flour" → "all-purpose flour"
- Example: "3 lg eggs" → "eggs"
- Example: "1 15 oz can pumpkin puree" → "pumpkin puree"
- Example: "1 tsp vanilla extract" → "vanilla extract"
- Fallback: If no unit match, use the string after the first space (assume first token is quantity)

**Step 2 — Match ingredient names against step text:**

For each step, iterate through all extracted ingredient names. Case-insensitive substring match.

**Plural handling (simple):** Compare both the original and de-pluralized form (strip trailing "s"). Also try adding "s" to singular forms. This handles "egg" matching "eggs" and vice versa.

**Example with step "Whisk flour, pumpkin pie spice, baking powder, and salt in a bowl.":**
- "all-purpose flour" → match "flour" ✓ (substring)
- "pumpkin pie spice" → match "pumpkin pie spice" ✓
- "baking powder" → match "baking powder" ✓
- "kosher salt" → match "salt" ✓ (substring)
- "pumpkin puree" → no match ✗
- "sugar" → no match ✗
- "vegetable oil" → no match ✗
- "unsalted butter, melted" → no match ✗ (step doesn't mention butter)
- "vanilla extract" → no match ✗
- "eggs" → no match ✗

**Edge case — "butter" matching "butter" in "unsalted butter, melted":** The ingredient name extraction should yield "unsalted butter, melted". When matching, search for significant words within the ingredient name — try matching just key nouns. Simplest approach: match the longest word (≥4 chars) in the ingredient name, then do a whole-word match in step text.

**Recommended approach — two-pass matching:**
1. First pass: exact substring match of full ingredient name (works for "baking powder", "pumpkin pie spice")
2. Second pass for unmatched ingredients: match significant words (≥4 chars, not common words like "large", "fresh", "ground") in step text

**Output per step:** Array of `{ group: string, ingredient: string }[]` — full ingredient string and parent group name, for display in the ingredient panel.

### 4. Client-Side JavaScript (`public/cook.js`)

**This is the first client-side JS file in the project.** Sets the pattern for future JS enhancements.

**Approach:** Single vanilla JS file, no framework, no build step. Loaded via `<script src="/cook.js" defer></script>` in the cooking mode HTML.

**Responsibilities:**
1. **Step navigation:** Hide all `.cook-step` elements except current. Show/hide on prev/next click.
2. **Progress bar update:** Set width of `.cook-progress-fill` to `(currentStep / totalSteps) * 100%`.
3. **Button state:** Hide "Previous" on step 1, change "Next" label to "Finish Cooking" on last step.
4. **Keyboard navigation:** Left arrow = previous, Right arrow = next, Escape = exit.
5. **Wake Lock:** Request on load, release on visibilitychange hidden, re-acquire on visible.
6. **Focus management:** On step change, focus the step text area for screen reader announcements.

**Progressive enhancement pattern:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Only enhance if JS is available
  let steps = document.querySelectorAll('.cook-step')
  if (steps.length === 0) return

  // Hide all steps except first
  steps.forEach((step, i) => {
    if (i > 0) step.hidden = true
  })

  // Step navigation state
  let currentStep = 0
  let totalSteps = steps.length

  // ... button handlers, keyboard, wake lock
})
```

### 5. Wake Lock API

**API:** `navigator.wakeLock.request('screen')` — returns a `WakeLockSentinel`.

**Lifecycle:**
1. **Acquire on page load:** Inside `DOMContentLoaded`, call `requestWakeLock()`.
2. **Release on tab hidden:** Listen to `document.visibilitychange`. When `hidden`, release the sentinel.
3. **Re-acquire on tab visible:** When `visible`, request a new lock.
4. **Release on navigation:** The lock is automatically released when the page unloads.

**Error handling:** Wrap in try/catch. If the API doesn't exist (`navigator.wakeLock === undefined`) or the request fails (permission denied, low battery on some browsers), silently skip. No user-facing error.

```javascript
let wakeLock = null

async function requestWakeLock() {
  if (!('wakeLock' in navigator)) return
  try {
    wakeLock = await navigator.wakeLock.request('screen')
  } catch {
    // Silent — wake lock unavailable or permission denied
  }
}

document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible') {
    await requestWakeLock()
  }
})
```

**Browser support:** Chrome 84+, Edge 84+, Safari 16.4+, Firefox 126+. Covers all modern browsers. Older browsers get cooking mode without wake lock — degraded but functional.

### 6. Dark/Light Mode (D-10)

**Approach:** CSS custom properties scoped to `.cook-mode` class, overridden by `@media (prefers-color-scheme: dark)`.

**Implementation location:** `app/styles/input.css` — add cooking mode CSS variables and dark mode override.

**Key detail:** Dark mode applies ONLY to cooking mode. The rest of the site (recipe page, listing, home) stays cream. This is achieved by scoping variables to `.cook-mode` and using the `prefers-color-scheme` media query inside that scope.

**Reduced motion support:** Progress bar transition (`width 200ms ease`) respects `prefers-reduced-motion: reduce` — set `transition: none`.

### 7. "Start Cooking" Button on Recipe Page

**Location:** Add to `app/controllers/recipes/show.tsx`, between the header and the "Ingredients" section.

```html
<a href="/recipes/${slug}/cook"
   class="block w-full py-3 text-center text-xl font-bold text-white bg-brand-green rounded-lg hover:opacity-90 print:hidden">
  Start Cooking
</a>
```

**Per UI-SPEC:** Full content width, 48px height, brand-green background, white text, 20px bold, centered, 8px border radius, print:hidden.

### 8. Route Registration Order

**Critical:** The cooking mode route `/recipes/:slug/cook` must be registered BEFORE the recipe show route `/recipes/:slug` in the router. Otherwise, the `:slug` parameter in `/recipes/:slug` will match "pumpkin-doughnut/cook" as the slug.

In `routes.ts`:
```typescript
recipes: {
  index: '/recipes',
  cook: '/recipes/:slug/cook',  // BEFORE show
  show: '/recipes/:slug',
},
```

In `router.ts`, wire `recipeCook` before `recipeShow`:
```typescript
router.get(routes.recipes.cook, recipeCook)
router.get(routes.recipes.show, recipeShow)
```

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Render helper | New `renderCookingMode()` function | Cooking mode HTML shell fundamentally different from normal pages (no nav, script tag, different body class) |
| Client JS | Single vanilla `public/cook.js`, no build step | First JS file — keep minimal; no bundler needed for one file |
| Ingredient matching | Server-side at render time | Zero client JS needed for this; simpler; works in no-JS fallback |
| Matching algorithm | Two-pass: exact substring then significant words | Handles compound ingredients ("baking powder") and simple ones ("salt") |
| Dark mode scope | `.cook-mode` class + `prefers-color-scheme` | Isolates dark mode to cooking view only |
| Wake Lock | `navigator.wakeLock.request('screen')` | Native API, zero dependencies, perfect browser support for target audience |
| Route order | Cook before show in router | Prevents `:slug` from matching "slug/cook" as a single param |
| No-JS fallback | All steps visible in vertical scroll | Progressive enhancement — server renders complete page, JS enhances it |

## Dependencies

**No new npm dependencies.** Everything uses:
- Existing controller pattern and `render()` helper from Phase 1/2
- Existing `loadRecipe()` / `getRecipeFilename()` from data layer
- Tailwind v4 CSS with new cooking-mode variables
- Native Wake Lock API (browser built-in)
- Vanilla JavaScript (no framework/library)

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Ingredient matching false positives | Wrong ingredients shown for a step | Two-pass matching with word boundaries; test with actual recipe data |
| Ingredient matching false negatives | Missing ingredients for a step | Acceptable — panel simply doesn't show for that step; better than wrong matches |
| Wake Lock API permission denied | Screen turns off while cooking | Silent fallback — cooking mode still fully functional without wake lock |
| Route order mistake | Cook route unreachable (caught by show) | Register cook route first; test URL directly |
| Long step text overflow | Text exceeds viewport height | CSS overflow-y: auto on step text area (per UI-SPEC) |
| Dark mode colors inaccessible | Low contrast | UI-SPEC already verified all pairs meet WCAG AA |

## Validation Architecture

### Cooking Mode Route Validation
- **Property:** `/recipes/:slug/cook` returns 200 for valid recipe, 404 for invalid
- **Test:** `curl /recipes/pumpkin-doughnut/cook` → 200 with HTML containing `cook-mode` class
- **Boundary:** Route registered before show route; 404 on invalid slug

### Ingredient Matching Validation
- **Property:** Steps mentioning ingredients show correct ingredient panel; steps without matches show no panel
- **Test:** Parse pumpkin doughnut recipe — step 2 ("Whisk flour, pumpkin pie spice, baking powder, and salt") should match flour, pumpkin pie spice, baking powder, salt from Doughnuts group
- **Boundary:** No false matches from Topping group in step 2; step 8 ("Serve warm or room temperature") should match no ingredients

### Wake Lock Validation
- **Property:** Wake Lock acquired on page load in supported browsers, silently skipped in unsupported
- **Test:** Open cooking mode in Chrome → check `navigator.getWakeLock` is not null (dev tools)
- **Boundary:** No console errors in browsers without Wake Lock support

### Step Navigation Validation
- **Property:** Only one step visible at a time; prev/next buttons update step; keyboard arrows work
- **Test:** Load cooking mode → only step 1 visible → click Next → step 2 visible, step 1 hidden → progress bar updated
- **Boundary:** Previous hidden on step 1; "Finish Cooking" label on last step; Escape exits to recipe page

### Dark Mode Validation
- **Property:** System dark mode preference applies dark cooking mode colors; light users see cream palette
- **Test:** Toggle system dark mode → cooking mode background changes from `#fdf6e3` to `#1c1917`
- **Boundary:** Dark mode ONLY on cooking mode page — recipe page stays cream

### No-JS Fallback Validation
- **Property:** With JavaScript disabled, all steps visible in vertical scroll layout
- **Test:** Disable JS in browser → load `/recipes/pumpkin-doughnut/cook` → all steps visible, each with ingredient panel
- **Boundary:** Navigation buttons not shown without JS; Wake Lock unavailable (silent)

### Print Exclusion Validation
- **Property:** "Start Cooking" button hidden in print output
- **Test:** Print recipe detail page → button not visible in print preview
- **Boundary:** Only affects recipe detail page; cooking mode page has no print-specific styles

---

*Phase: 03-cooking-mode*
*Researched: 2026-03-24*
