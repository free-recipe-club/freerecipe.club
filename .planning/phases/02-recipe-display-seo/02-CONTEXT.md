# Phase 2: Recipe Display & SEO - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can browse and read recipes in a clean, responsive, recipe-first layout with proper SEO and SSR. This covers the recipe detail page (`/recipes/:slug`), the recipe listing page (`/recipes`), print stylesheet, sitemap, and meta tags. Cooking mode (Phase 3), themed packs (Phase 4), and annotations (Phase 6) are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Recipe Page Layout
- **D-01:** Compact header with thumbnail — small image beside the title, then full-width ingredients and steps below. De-emphasizes the photo, puts recipe content first.
- **D-02:** Simple linear flow — no sticky sidebar for ingredients. Single column throughout, scrolls naturally on all devices.
- **D-03:** Background and flavor text shown below the recipe steps in a muted section — present but secondary. Not a preamble.
- **D-04:** Attribution (byline, location, source links) as a footer section at the bottom after background/flavor — clear credit without competing with the recipe.

### Recipe Listing Page
- **D-05:** Simple text list — not a card grid. Recipe titles as links with supporting text.
- **D-06:** Each recipe shows title + byline + flavor text. Enough context to browse without visual clutter.

### Step Checkboxes & Interaction
- **D-07:** Ephemeral checkboxes — no persistence between page visits. Pure session enhancement.
- **D-08:** Checked steps get strikethrough text + a check icon.
- **D-09:** Native HTML checkboxes (`<input type="checkbox">`) — functional without JavaScript. Aligns with DISP-08 (JS enhances but isn't required to read). The strikethrough/icon styling can be CSS-only (`:checked` selector).

### Print Stylesheet
- **D-10:** Print includes title, ingredients, steps, flavor text, and attribution. No image and no background story in print. Text-only output (no nav chrome).

### SEO & Sitemap
- **D-11:** Meta description sourced from the `flavor` field. Consider making `flavor` a required schema field (currently optional with empty string default).
- **D-12:** Static build-time sitemap — `sitemap.xml` generated during CI/build from the recipe slug list, not on each request.

### Agent's Discretion
- Page title format for recipe pages (e.g., "Pumpkin Doughnut — freerecipe.club")
- Typography sizing and spacing for kitchen readability (DISP-07)
- Responsive breakpoints and tap target sizing (CORE-03)
- robots.txt content (if needed)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-Level
- `.planning/PROJECT.md` — Vision, constraints, anti-patterns (no preamble, no scroll-to-recipe syndrome)
- `.planning/REQUIREMENTS.md` — Phase 2 maps to DISP-01–08, SEO-01–02, CORE-03
- `.planning/ROADMAP.md` — Phase 2 goal and success criteria

### Phase 1 Context
- `.planning/phases/01-foundation-data-layer/01-CONTEXT.md` — Framework decisions (alpha Remix, not RR7), data loading patterns, CI/CD setup

### Existing Code
- `app/routes.ts` — Route definitions already include `/recipes` (index) and `/recipes/:slug` (show)
- `app/router.ts` — Router setup with static file middleware; only home route currently wired
- `app/data/recipe-schema.ts` — Zod schema for recipe validation (components, directions, links, etc.)
- `app/data/recipes.ts` — `loadRecipe(slug)`, `loadRecipes()`, `listRecipeSlugs()`, `getRecipeSlug()` all implemented
- `app/controllers/render.tsx` — HTML render helper (title, content → full HTML Response with Tailwind)
- `app/controllers/home/controller.tsx` — Home page controller pattern to follow
- `app/styles/input.css` — Tailwind v4 config with brand colors (green #2d5016, cream #fdf6e3)
- `data/recipes/pumpkin_doughnut.yml` — Sample recipe for testing all display features

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `loadRecipe(slug)` / `loadRecipes()` — Recipe data loading already works with Zod validation
- `listRecipeSlugs()` — Returns all available slugs, useful for sitemap generation and listing page
- `getRecipeSlug()` — Converts YAML filenames to URL slugs (underscore → hyphen)
- `render(title, content)` — HTML page generation with Tailwind CSS inclusion
- Route definitions in `routes.ts` — `/recipes` and `/recipes/:slug` already declared

### Established Patterns
- Controller pattern: function returns `render(title, htmlContent)` — see `home/controller.tsx`
- Router pattern: `router.get(routes.X, handler)` in `router.ts`
- Static files served from `public/` with `staticFiles` middleware
- Tailwind v4 CSS-first config with `@theme` custom properties
- Server-side rendering via Node.js HTTP server + `createRequestListener`

### Integration Points
- Wire new controllers into `router.ts` for `/recipes` and `/recipes/:slug`
- Recipe images in `public/recipes/` directory (matched by recipe slug/filename)
- Tailwind styles compiled from `app/styles/input.css` to `public/styles/output.css`
- Build script in `package.json` for CSS compilation (`build:css`)

</code_context>

<specifics>
## Specific Ideas

- User wants the recipe page to de-emphasize the photo (compact thumbnail, not hero image) — this is a deliberate anti-pattern to mainstream recipe sites
- "No preamble" is a core principle from PROJECT.md — recipe content leads, background story is secondary
- Native HTML checkboxes for steps — works without JS, can use CSS `:checked` pseudo-class for strikethrough styling
- Print output is text-focused: no image, no background story, but includes flavor text and attribution
- User mentioned wanting a small pack icon (like MTG set symbols) in print to indicate which themed pack a recipe belongs to — this is a Phase 4 concern, noted as deferred

</specifics>

<deferred>
## Deferred Ideas

- **Pack icon in print:** Small emoji/representative icon (like MTG set symbols) indicating which themed pack a recipe belongs to, included in print output. → Phase 4 (Themed Packs)
- **Making `flavor` a required schema field:** Currently defaults to empty string. If adopted, would need a migration check on existing recipes. → Could be done in Phase 2 planning or deferred to a schema cleanup pass.

</deferred>

---

*Phase: 02-recipe-display-seo*
*Context gathered: 2026-03-24*
