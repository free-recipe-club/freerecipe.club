# Phase 2: Recipe Display & SEO — Research

**Researched:** 2026-03-24
**Discovery Level:** 1 (Quick Verification — extending established codebase patterns)

## Executive Summary

Phase 2 extends the established alpha Remix 3 patterns from Phase 1. The app uses a fetch-router with controller functions returning HTML `Response` objects — no React SSR, no loaders. All Phase 2 work follows this same pattern: new controllers for recipe pages, sitemap, and listing; Tailwind CSS for styling and print; existing data layer for recipe loading.

**Key finding:** No new dependencies needed. Everything builds on Phase 1's controller pattern, `render()` helper, Tailwind v4, and Zod-validated recipe data.

## Technical Approach

### 1. Recipe Detail Page (`/recipes/:slug`)

**Pattern:** Same controller pattern as `home/controller.tsx`.

```typescript
// app/controllers/recipes/show.tsx
import { loadRecipe } from '../../data/recipes.ts'
import { render } from '../render.tsx'

export function recipeShow(request: Request): Response {
  let url = new URL(request.url)
  let slug = url.pathname.split('/').pop()!
  let recipe = loadRecipe(slug)
  return render(recipe.title, buildRecipeHtml(recipe))
}
```

**Route wiring:** `router.get(routes.recipes.show, recipeShow)` in `router.ts`. The route `/recipes/:slug` is already defined in `routes.ts` — the router passes matched params via the URL pathname.

**Slug extraction:** Alpha Remix fetch-router doesn't inject params into the handler signature. Extract slug from `request.url` pathname instead. The `loadRecipe()` function expects the YAML filename format (underscores), but URL slugs use hyphens. Need a reverse slug→filename converter: `slug.replace(/-/g, '_')`.

**Error handling:** If `loadRecipe()` throws (recipe not found), return a 404 Response.

**Recipe HTML structure (per CONTEXT.md D-01 through D-04):**
1. Compact header: small thumbnail + title + byline
2. Ingredient groups (from `components` field)
3. Numbered steps with checkboxes
4. Background/flavor in muted footer section
5. Attribution (links) at bottom

### 2. Recipe Listing Page (`/recipes`)

**Pattern:** Controller loads all recipes, renders as simple text list (D-05, D-06).

```typescript
// Each recipe shows: title (as link) + byline + flavor text
let recipes = loadRecipes()
```

**Need:** `loadRecipes()` returns `Recipe[]` but doesn't include slugs. Need to pair recipes with their slugs for URL generation. Options:
- Load slugs via `listRecipeSlugs()` and zip with recipes
- Modify `loadRecipes()` to return `{ recipe, slug }[]` (cleaner)
- Or load file list, derive slugs, and load recipes together

**Recommended:** Create a `loadRecipesWithSlugs()` helper that returns `{ recipe: Recipe, slug: string }[]`. This avoids coupling slug derivation to the display layer.

### 3. Checkboxes for Steps (DISP-04)

**CSS-only approach (per D-07, D-08, D-09):**

```html
<li>
  <label>
    <input type="checkbox" class="peer sr-only">
    <span class="peer-checked:line-through peer-checked:text-gray-400">
      Step text here
    </span>
  </label>
</li>
```

**Key insight:** Tailwind v4's `peer` variant works with `:checked` pseudo-class. The checkbox is visually hidden (`sr-only`) but functional. The `peer-checked:` modifier applies strikethrough to sibling elements. This works without JavaScript — pure CSS.

**Accessibility:** The `<label>` wrapping makes the entire step text clickable. Screen readers announce the checkbox state. Adding `role="list"` on the `<ol>` is not needed (semantic HTML suffices).

### 4. Print Stylesheet (DISP-06)

**Approach:** Add `@media print` rules to `app/styles/input.css`.

```css
@media print {
  /* Hide nav, images, checkboxes, background story */
  nav, .recipe-image, .recipe-background, input[type="checkbox"] { display: none; }
  /* Reset colors for printing */
  body { background: white; color: black; }
  /* Clean typography */
  a { text-decoration: none; color: black; }
  a[href]::after { content: " (" attr(href) ")"; font-size: 0.8em; }
}
```

**Per D-10:** Print includes title, ingredients, steps, flavor, and attribution. Excludes image and background story. Tailwind's `print:` variant can also be used inline: `class="print:hidden"` on elements to hide.

**Recommendation:** Use a mix of both — Tailwind `print:hidden` for element-level control, and `@media print` in `input.css` for global resets (background color, link styling).

### 5. Sitemap (`/sitemap.xml`) (SEO-02)

**Approach:** A route handler that returns XML.

```typescript
// app/controllers/sitemap.ts
import { listRecipeSlugs } from '../data/recipes.ts'

export function sitemap(request: Request): Response {
  let slugs = listRecipeSlugs()
  let origin = new URL(request.url).origin
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc></url>
  <url><loc>${origin}/recipes</loc></url>
  ${slugs.map(s => `<url><loc>${origin}/recipes/${s}</loc></url>`).join('\n  ')}
</urlset>`
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
```

**Route:** Need to add `/sitemap.xml` to `routes.ts` and wire in `router.ts`. This is a dynamic route returning XML, not a static file.

**Per D-12:** Build-time generation was mentioned, but since the site runs on Fly.io with SSR (not static export), a dynamic route is simpler and always up-to-date. Build-time would require a script + static file approach — unnecessary complexity for the current architecture.

### 6. Meta Description & SEO (SEO-01)

**Recipe page titles:** `render()` already formats as `{title} — freerecipe.club`.

**Meta description:** Needs the `render()` function to accept an optional description parameter. The `flavor` field is the natural source (per D-11).

**Enhanced `render()` signature:**
```typescript
export function render(title: string, content: string, options?: { description?: string }): Response
```

Add `<meta name="description" content="...">` to the `<head>` when description is provided.

### 7. Mobile-Responsive Design (DISP-07, CORE-03)

**Approach:** Tailwind mobile-first responsive utilities.

Key considerations for kitchen use:
- Base font size: 16px minimum (Tailwind default)
- Tap targets: 44px+ minimum (WCAG), 48px+ preferred (per Phase 3 requirement)
- Ingredient text: `text-lg` on mobile for readability
- Step text: `text-lg` on mobile, generous line height
- Max content width: `max-w-2xl` (consistent with home page)
- Padding: `px-4` on mobile, more on desktop

### 8. SSR Without JavaScript (DISP-08)

**Already handled:** The entire app is server-rendered HTML strings. No client-side JavaScript is shipped. The `render()` function returns complete HTML. Checkboxes work via native HTML + CSS `:checked`. The only JS is the checkbox enhancement (strikethrough), which works with CSS-only `peer-checked:` — no JS needed.

**Verification:** Disable JavaScript in browser → recipe should be fully readable with all content visible. Checkboxes will still toggle (native browser behavior).

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Slug extraction | Parse from URL pathname | Alpha Remix fetch-router doesn't provide params; simple string split |
| Sitemap delivery | Dynamic route (not build-time) | SSR architecture makes dynamic simpler; always current |
| Checkbox approach | CSS `:checked` + Tailwind `peer` | No JavaScript needed; works without JS; accessible |
| Print styling | Mix of `@media print` + Tailwind `print:` | Global resets in CSS, element-level control inline |
| Meta descriptions | Extend `render()` with options | Minimal change to existing pattern; backward compatible |
| Recipe listing data | New `loadRecipesWithSlugs()` helper | Clean separation; pairs recipe data with URL-ready slugs |

## Dependencies

**No new npm dependencies.** Everything uses:
- `remix` (fetch-router, routes, static-middleware) — already installed
- `yaml` + `zod` — already installed for recipe loading
- `tailwindcss` + `@tailwindcss/cli` — already installed

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Slug/filename mismatch | 404 on valid recipes | Centralize slug↔filename conversion in `recipes.ts` |
| Large recipe count slowing listing | Slow listing page | Not a v1 concern — small recipe count. Pagination if needed later |
| Print CSS conflicts with Tailwind | Broken print output | Test print preview during development; `@media print` overrides Tailwind |

## Validation Architecture

### Recipe Display Validation
- **Property:** Recipe page renders all required sections (title, image, ingredients, steps, attribution)
- **Test:** Load `/recipes/pumpkin-doughnut` → verify each section present in HTML response
- **Boundary:** `loadRecipe()` throws on missing slug → controller catches and returns 404

### SSR Validation
- **Property:** Full recipe content in initial HTML (no client-side hydration needed)
- **Test:** `curl /recipes/pumpkin-doughnut` → HTML contains recipe title, all ingredients, all steps
- **Boundary:** Zero `<script>` tags in output (no JS shipped)

### Sitemap Validation
- **Property:** All recipe slugs appear in sitemap XML
- **Test:** `curl /sitemap.xml` → valid XML with all recipe URLs
- **Boundary:** Sitemap updates automatically when recipes added (dynamic generation)

### Print Validation
- **Property:** Print output includes recipe content, excludes nav/image/background
- **Test:** Check `@media print` rules exist in CSS; `print:hidden` classes on excluded elements

---

*Phase: 02-recipe-display-seo*
*Researched: 2026-03-24*
