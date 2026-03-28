# Domain Pitfalls

**Domain:** Community-driven recipe website (Astro → React Router v7 migration)
**Researched:** 2026-03-23

---

## Critical Pitfalls

Mistakes that cause rewrites, deployment failures, or fundamental architecture breakage.

---

### Pitfall 1: "Remix Alpha" Is a Dead Target — It's React Router v7 Now

**What goes wrong:** The project scopes the migration as "Astro → Remix (alpha)." But Remix as a standalone framework no longer exists. In November 2024, Remix merged into React Router v7 (stable). Cloudflare's own docs now say: *"Remix is no longer recommended for new projects by the authors and its successor React Router should be used instead."* Building on `@remix-run/*` packages means building on a legacy namespace that's actively being migrated away from.

**Why it happens:** The project was conceived when Remix was still a distinct brand. The merger happened quietly and many developers still say "Remix" colloquially when they mean React Router v7 framework mode.

**Consequences:**
- All `@remix-run/*` packages are maintenance-mode — new features land in `react-router` only
- Cloudflare's deployment guides, templates, and CLI (`create-cloudflare --framework=react-router`) target React Router v7, not Remix
- Community resources, tutorials, and Stack Overflow answers will increasingly reference React Router v7 APIs
- Future migration from Remix v2 → React Router v7 adds unnecessary work if you start on Remix now

**Warning signs:**
- Documentation sends you to `v2.remix.run` (legacy) instead of `reactrouter.com`
- `@remix-run/dev` package hasn't had new features since the v7 release
- Cloudflare `deploy-a-remix-site` page redirects you to the React Router Workers guide

**Prevention:** Start the project on React Router v7 in framework mode from day one. Use `npx create-react-router@latest` or `npm create cloudflare@latest -- --framework=react-router`. All Remix concepts (loaders, actions, nested routes, SSR) exist identically in React Router v7 — it's the same codebase, just repackaged. Update PROJECT.md to reflect "React Router v7" not "Remix."

**Detection:** `package.json` contains any `@remix-run/*` dependency.

**Confidence:** HIGH — verified via Cloudflare official docs, React Router official docs, and Remix blog announcement.

**Phase mapping:** Must be resolved in Phase 1 (project scaffolding). Every subsequent phase depends on correct framework choice.

---

### Pitfall 2: Cloudflare Workers Runtime Has No File System — Flat Files Don't Work at SSR Time

**What goes wrong:** The current codebase reads recipe YAML files with `fs.readdirSync()` and `yaml.parse()` at request time. Cloudflare Workers runs a V8 isolate — there is no `fs` module, no file system, and no Node.js runtime (unless using `nodejs_compat` flag, which still doesn't provide `fs`). Any code that reads files at request time will crash in production.

**Why it happens:** Developers assume SSR hosting means "a Node.js server with disk access." Edge runtimes (Cloudflare Workers, Vercel Edge Functions) don't have this. Even Vercel's Node.js serverless functions have read-only access with limitations.

**Consequences:**
- Deployment fails silently or throws runtime errors on first request
- Architecture has to be redesigned after deployment attempts fail
- Data loading strategy must be determined before any recipe rendering code is written

**Warning signs:**
- Import statements for `fs`, `path`, or `node:fs` outside of build scripts
- Loader functions that reference file system operations
- YAML parsing happening in route loaders rather than at build time

**Prevention:** Two viable strategies for flat-file recipe data on Cloudflare Workers:

1. **Pre-render all recipe pages at build time** — React Router v7 supports `prerender()` in config to generate static HTML. Recipe data is read during `npm run build` (Node.js context), and served as static assets (free, unlimited on CF Workers). **However:** Cloudflare's Vite plugin currently does NOT support pre-rendering. This may change — check `@cloudflare/vite-plugin` release notes.

2. **Embed data at build time** — Use a Vite plugin or build script to transform YAML files into importable JSON/TS modules that get bundled into the Worker. Loaders import the data module rather than reading the file system. This works on all runtimes.

3. **Hybrid approach** — Pre-render recipe pages as static HTML via React Router's `prerender()` on a Node.js-based host (Vercel), and serve SSR for dynamic features (annotations, search).

**Detection:** Run `wrangler dev` early. If recipes don't load locally with Wrangler, they won't deploy.

**Confidence:** HIGH — verified via Cloudflare Workers docs and runtime model.

**Phase mapping:** Must be resolved in data architecture phase (Phase 2–3). Blocks all recipe rendering work.

---

### Pitfall 3: Recipe YAML Format Doesn't Map to Schema.org — Invisible to Google Rich Results

**What goes wrong:** The existing YAML schema has `title`, `byline`, `components`, `directions`, `background`, `links`, `flavor`. Google's Recipe rich results require: `name`, `image` (3 aspect ratios), `author`, `recipeIngredient` (flat list), `recipeInstructions` (HowToStep array), `cookTime`, `prepTime`, `totalTime`, `recipeYield`, `recipeCategory`, `recipeCuisine`, `keywords`, `nutrition`, and `datePublished`. The current format is missing **9+ required/recommended fields** and uses non-standard field names. Without schema.org Recipe structured data, the site is invisible to Google's recipe carousel — the primary discovery mechanism for recipe sites.

**Why it happens:** The YAML was designed for human readability and internal rendering, not for SEO or structured data compliance. Many recipe site builders skip schema.org until after launch, then discover their content never appears in recipe search results.

**Consequences:**
- Zero presence in Google recipe rich results (the carousel cards with images, ratings, and cook times)
- Competing recipe sites with structured data completely dominate search visibility
- Retrofitting schema.org fields into existing recipes requires touching every recipe file
- The `components` field uses section-grouped formatting (`- Doughnuts\n  - 2 c flour`) that doesn't map to schema.org's flat `recipeIngredient` array

**Warning signs:**
- Recipe pages don't show a recipe card in Google Search Console's Rich Results Test
- Google Search Console shows "missing field" errors for Recipe structured data
- No `<script type="application/ld+json">` in rendered HTML containing `@type: Recipe`

**Prevention:**
- Design the recipe data schema with schema.org as the primary constraint from day one
- Add required fields to the YAML/data format: `prepTime`, `cookTime`, `totalTime`, `servings` (recipeYield), `category`, `cuisine`, `keywords`, `datePublished`
- Separate ingredient sections (for UI grouping) from a flat ingredient list (for schema.org)
- Generate `application/ld+json` in the route's `<head>` using React Router's `meta` or a `<script>` in the layout
- Validate against Google's Rich Results Test during development

**Confidence:** HIGH — verified via Google's Recipe structured data documentation (updated Dec 2025) and schema.org v30.0 (March 2026).

**Phase mapping:** Data schema design phase. Must happen before recipe import/creation workflow is built.

---

### Pitfall 4: Cloudflare Workers Free Tier Limits — 100K Requests/Day with 10ms CPU Cap

**What goes wrong:** The project requires "free hosting tied to GitHub." Cloudflare Workers Free tier allows 100,000 requests/day and only 10ms of CPU time per invocation. React Router v7 SSR involves rendering React components to HTML on every request — complex recipe pages with structured data, annotations, and related recipes can easily exceed 10ms CPU time on the free tier, causing requests to be terminated.

**Why it happens:** Edge runtime CPU limits are much tighter than traditional server hosting. 10ms sounds like a lot until you're doing React SSR with JSON-LD generation, markdown parsing, and component rendering. Additionally, 100K requests/day (~3.3K/hour) is fine for a small site but could be hit during viral traffic or Hacktoberfest.

**Consequences:**
- Requests terminated mid-render → users see error pages
- Must upgrade to Workers Paid ($5/month) which defeats "free hosting" goal — though this buys 10M requests/month and 30 million CPU-ms
- Alternatively, Vercel free tier has 100GB bandwidth and serverless function limits

**Warning signs:**
- `wrangler tail` shows requests hitting CPU time limits
- Intermittent 503 errors in production under light load
- SSR response times creeping above 10ms in local Wrangler testing

**Prevention:**
- **Pre-render recipe pages as static HTML** — static asset requests on Cloudflare are free and unlimited with no CPU limits. This is the best match for a recipe site where content changes only on git push.
- If pre-rendering blocked by Cloudflare Vite plugin limitations, consider **Vercel free tier** as an alternative: SSR Node.js functions with 100GB bandwidth/month, generous serverless limits, and excellent React Router v7 support.
- Keep React Server rendering minimal: avoid heavy computation in loaders, cache rendered HTML
- Monitor CPU metrics via Cloudflare dashboard from day one

**Confidence:** HIGH — verified via Cloudflare Workers pricing page (updated March 2026).

**Phase mapping:** Hosting/deployment architecture phase. Decision impacts every SSR-related design choice.

---

### Pitfall 5: Server Code Leaking into Client Bundles

**What goes wrong:** React Router v7 (inherited from Remix) uses tree-shaking to strip server-only code (`loader`, `action`) from client bundles. But if you import a server-only module (like a YAML parser, `fs`, or a data processing library) at the top level of a route module, the import gets included in the client bundle. This causes either build errors, runtime crashes in the browser, or bloated client bundles.

**Why it happens:** JavaScript bundlers can't always tell if a top-level import has side effects. If a package's `package.json` doesn't include `"sideEffects": false`, the bundler keeps the import even when the exported `loader` is tree-shaken. This is documented as a known gotcha in Remix/React Router docs.

**Consequences:**
- `TypeError: Cannot read properties of undefined (reading 'root')` at runtime
- Client bundle includes server-only code, increasing download size
- Subtle bugs that only appear in production (dev mode often masks this)

**Warning signs:**
- Browser console shows errors about undefined Node.js modules
- React hydration mismatches
- Client bundle size unexpectedly large

**Prevention:**
- Put server-only utilities in `*.server.ts` files (e.g., `utils/recipes.server.ts`)
- Never import YAML parsers, data processing, or file utilities at route module top level
- Use `vite-env-only` or similar to enforce server/client boundaries
- Add bundle analysis to CI to catch unexpected client bundle growth

**Confidence:** HIGH — explicitly documented in React Router v7 / Remix gotchas page.

**Phase mapping:** Enforced from initial project scaffolding. Code architecture decision.

---

## Moderate Pitfalls

Mistakes that cause significant rework, poor UX, or missed opportunities.

---

### Pitfall 6: Cooking Mode Without Wake Lock = Screen Goes Dark Mid-Recipe

**What goes wrong:** "Cooking mode" is a core feature — step-by-step guidance while cooking. But mobile devices lock their screens after 30–60 seconds of inactivity. A user's hands are covered in dough, they glance at the phone, and the screen is black. They have to wash hands, unlock, find their place again. This is the #1 complaint about recipe apps.

**Why it happens:** Developers test with screen timeout disabled or constantly touch the screen. They never experience the actual cooking context where hands are occupied for minutes at a time.

**Prevention:**
- Implement the [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API) (`navigator.wakeLock.request('screen')`) when cooking mode is active
- Wake Lock is supported in Chrome, Edge, and Safari (since 16.4) — covers ~95% of mobile users
- Release the lock when exiting cooking mode or navigating away
- Show a visible indicator (🔒 icon) that screen-on mode is active
- Handle the `visibilitychange` event to re-acquire the lock when the user returns to the tab
- Provide a fallback message for unsupported browsers: "Tip: disable screen timeout in your device settings while cooking"

**Warning signs:** Any cooking mode feature plan that doesn't mention Wake Lock API.

**Confidence:** HIGH — Wake Lock API is well-documented, widely supported standard.

**Phase mapping:** Cooking mode implementation phase. Must be included in initial cooking mode design.

---

### Pitfall 7: Touch Targets Too Small for Kitchen Use — Wet/Floury Hands Need 48px+ Targets

**What goes wrong:** Standard web design uses 44px touch targets (Apple's recommendation) or 48px (Material Design). In a kitchen context, hands are wet, sticky, covered in flour, or using knuckles instead of fingertips. Standard touch targets become impossible to hit reliably. Users end up tapping wrong buttons, accidentally skipping steps, or scrolling past their current step.

**Why it happens:** Responsive design testing happens on clean hands in a clean office. The kitchen context — messy hands, device propped at odd angles, one-handed operation — is fundamentally different from standard mobile UX.

**Prevention:**
- Minimum 48px touch targets, ideally 56–64px for primary cooking mode controls
- "Previous step" and "Next step" should be large, full-width buttons — not small arrows
- Add generous padding between interactive elements (at least 16px gaps)
- Consider making the entire step area tappable for "next" (tap anywhere to advance)
- Avoid swipe gestures as primary navigation (unreliable with wet hands) — use them as enhancement only
- Test with gloves or wet hands during development
- Use CSS `@media (pointer: coarse)` to enlarge targets on touch devices

**Warning signs:** UI mockups with standard-sized buttons in cooking mode. Any design that requires precise tapping.

**Confidence:** MEDIUM — based on UX research patterns and kitchen app design literature. No single authoritative source.

**Phase mapping:** UI/UX design phase for cooking mode. Must inform the UI spec before implementation.

---

### Pitfall 8: YAML Recipe Format Is Error-Prone for Community Contributors

**What goes wrong:** The project depends on community contributions via GitHub PRs. But YAML is notoriously hostile to casual contributors: invisible indentation errors, colon-in-values requiring quoting (`title: "Hey: A Recipe"`), no validation until build time, and multiline strings need special syntax. A contributor submits a recipe PR, CI fails with an opaque YAML parse error, and they give up.

**Why it happens:** YAML is great for machine-readable config but terrible for human authoring at scale. Recipe content often contains colons (ratios like "1:2"), special characters (°F, fractions like ½), and multiline text (background stories). Every one of these trips YAML's parser.

**Consequences:**
- High contributor friction → fewer recipes → less community engagement
- Maintainers spend time debugging contributor YAML instead of reviewing recipe content
- Hacktoberfest contributions bounce off YAML validation failures
- Contributors may introduce subtle YAML errors that pass parsing but produce wrong data (e.g., a missing `-` makes two ingredients merge into one string)

**Current format issues with existing YAML:**
- `components` field uses a non-standard nesting pattern that's ambiguous about section names vs. ingredients
- No runtime validation (`as Recipe` type assertion provides zero safety)
- Special characters in recipe text (°F, 1/3 c, quotes in bylines) need careful quoting

**Warning signs:**
- First-time contributors requesting help with "build failed" on recipe PRs
- Recipe PRs requiring multiple rounds of YAML formatting fixes
- Different contributors formatting the same fields differently

**Prevention:**
- Provide a GitHub Issue template or web form that generates properly formatted data files
- If keeping YAML: add a Zod/JSON Schema validator that runs in CI with human-readable error messages
- Consider MDX instead: frontmatter for structured fields (title, author, times) + markdown body for directions — more forgiving and familiar to non-developers
- Provide a recipe submission template with inline comments explaining each field
- Add a `npm run validate` script that validates all recipe files locally before push
- Consider a `/contribute` page on the site itself that generates the file content

**Confidence:** HIGH — YAML parsing issues are well-documented across the ecosystem.

**Phase mapping:** Data format design phase AND contributor workflow phase. Must be decided early as it affects all recipe content.

---

### Pitfall 9: Annotation System on Flat Files — Scaling and Merge Conflict Nightmare

**What goes wrong:** The project envisions inline annotations (substitution tips, modifications) pinned to specific recipe lines. If annotations are stored alongside recipe data in flat files (YAML/MDX), every annotation creates a git commit. Multiple people annotating the same recipe = merge conflicts. If annotations are stored in separate files with line-number references, recipe edits invalidate annotation anchors.

**Why it happens:** Git is excellent for content versioning but terrible for concurrent collaborative annotations. It's a version control system, not a database. The annotation model tries to use it as both.

**Consequences:**
- Merge conflicts on popular recipes where multiple annotations arrive simultaneously
- Recipe edits (fixing a typo, reordering steps) break all annotation references
- No way to "soft-delete" or moderate annotations — requires git revert
- Annotation history is buried in git log, not surfaceable in UI
- Annotation-to-step linking is fragile if using line numbers or string matching

**Warning signs:**
- Architecture plans that store annotations as inline YAML properties on recipe steps
- Annotation references using line numbers or string matching
- No consideration of concurrent PR merging

**Prevention:**
- Decouple annotations from recipe files: store them in separate `annotations/[recipe-slug]/` directories
- Use stable identifiers for steps (e.g., `step-1`, `step-2`) rather than line numbers
- Consider a lightweight external store (GitHub Discussions, GitHub Issues with labels, or a Cloudflare KV/D1 store) for annotations — keeps the recipe files clean
- If annotations must be in-repo: use a CODEOWNERS-style protection on recipe files and batch annotation PRs
- Accept that annotations won't scale purely on git — design for eventual migration to a data store
- Start with a simpler model: recipe-level annotations (not step-pinned) as a first pass

**Confidence:** MEDIUM — architecture pattern analysis. No direct precedent for git-based annotation systems at scale.

**Phase mapping:** Annotation architecture phase. Should be carefully designed before implementation, possibly deferred to a later milestone.

---

### Pitfall 10: Progressive Enhancement Failure — Recipe Content Requires JavaScript

**What goes wrong:** The project states "no mandatory JavaScript for reading recipes" (analog ethos). But React Router v7 in framework/SSR mode renders HTML on the server, then hydrates on the client. If hydration fails or JS doesn't load (slow connection, browser restriction, disabled JS), interactive features break. More critically: if the page depends on client-side data fetching or if error boundaries require JS, even reading a recipe might fail.

**Why it happens:** React-based frameworks assume hydration. The SSR HTML is usually complete and readable, but navigation between pages requires JavaScript. Many developers don't test the no-JS experience.

**Consequences:**
- Users on slow kitchen Wi-Fi get a flash of content then a blank page if hydration fails
- Saved/bookmarked recipe URLs work (SSR) but clicking any link requires JS
- Screen readers and assistive technology may encounter issues with un-hydrated interactive elements

**Warning signs:**
- Disabling JavaScript in browser DevTools shows broken navigation or missing content
- Links use client-side routing only (no server-side fallback)
- Interactive elements (cooking mode toggle, step navigation) have no HTML-only fallback

**Prevention:**
- Test every recipe page with JavaScript disabled — the full recipe content should be readable
- Use standard `<a href>` links — React Router v7 progressively enhances these, so they work without JS
- For cooking mode: provide a print-friendly / simplified view as HTML fallback
- Pre-render recipe pages as static HTML (best approach for this site's content model)
- Avoid `clientLoader` for critical recipe data — use server loaders that produce complete HTML
- Add `<noscript>` fallback messages for interactive-only features

**Confidence:** HIGH — React Router v7's SSR model produces full HTML, but only if loaders are server-side and links are standard `<a>` tags.

**Phase mapping:** Applies to all UI implementation phases. Should be a testing criterion in every phase's UAT.

---

## Minor Pitfalls

Mistakes that cause friction, bugs, or polish issues.

---

### Pitfall 11: Missing Image Optimization — Recipe Photos Dominate Page Weight

**What goes wrong:** Recipe sites are image-heavy. The current setup stores images in `public/recipes/` as raw files. Without responsive image generation (`srcset`), lazy loading, and modern formats (WebP/AVIF), recipe pages will be slow — especially on kitchen phones using Wi-Fi at the edge of range.

**Prevention:**
- Use a Vite image optimization plugin or Cloudflare Image Resizing (paid) to generate responsive variants
- Implement `<img srcset>` with multiple sizes (thumbnail for card, medium for recipe page, large for hero)
- Lazy-load images below the fold with `loading="lazy"`
- Require images in WebP or AVIF format for contributions, with JPEG fallback
- Provide recipe page images in the 3 aspect ratios Google requires: 16:9, 4:3, 1:1

**Phase mapping:** Asset pipeline / build configuration phase.

---

### Pitfall 12: Hacktoberfest Spam Without Proper Labeling and Templates

**What goes wrong:** Hacktoberfest attracts spam PRs (trivial changes, copied content, AI-generated nonsense) that overwhelm maintainers. Without proper repo setup, you spend October moderating instead of building.

**Prevention:**
- Add `hacktoberfest` topic to the repo
- Use the `hacktoberfest-accepted` label (requires manual maintainer approval per PR)
- Create issue templates with `good first issue` labels for legitimate contribution paths
- Add a `CONTRIBUTING.md` with explicit instructions for recipe submissions
- Provide a recipe PR template that validates structure
- Set up GitHub Actions to auto-validate recipe file format on PR

**Phase mapping:** Contributor workflow / repo setup phase. Must be in place before Hacktoberfest (October).

---

### Pitfall 13: Seasonal Theme Switching Without CSS Architecture = Specificity Hell

**What goes wrong:** Themed recipe packs with matching site visual themes (seasonal editions) sounds simple until you try to implement it with Tailwind CSS. Tailwind's utility classes don't natively support "theme A overrides base, theme B overrides base" without careful planning. Developers end up with complex conditional class logic, `!important` overrides, or a theme system that only changes a few colors.

**Prevention:**
- Use Tailwind CSS v4's native CSS custom properties (`--color-*`) as the theming mechanism
- Define theme tokens (colors, typography, spacing accents) as CSS variables on `:root` or a theme class
- Swap themes by changing the CSS variable set — no Tailwind class changes needed
- Keep seasonal themes to color palette + accent imagery — don't try to change layout per theme
- Pre-build theme CSS files and swap via `<link>` or class on `<html>` element

**Phase mapping:** Theming / design system phase.

---

### Pitfall 14: Accessibility Beyond WCAG Basics — Cooking-Specific A11y

**What goes wrong:** Standard WCAG compliance checks (alt text, color contrast, keyboard navigation) don't cover the unique accessibility needs of cooking contexts: voice control for hands-free use, temporal cognitive load (can't re-read while stirring), and progressive disclosure of complex multi-component recipes.

**Prevention:**
- Ensure proper ARIA landmarks and heading hierarchy so screen readers can navigate recipe sections efficiently
- Keep ingredient and step text concise and literal — avoid ambiguous descriptions
- For cooking mode: announce step transitions to screen readers via `aria-live` regions
- Support keyboard shortcuts for step navigation (arrow keys) — usable with elbow or knuckle
- High contrast mode for recipe text (flour-dusted screen + kitchen lighting is low contrast)
- Don't rely solely on color to distinguish recipe sections or completion status (use icons + color)
- Consider `prefers-reduced-motion` for any cooking mode animations/transitions
- Provide text sizing controls within cooking mode (not just browser zoom)

**Phase mapping:** Every UI phase, but especially cooking mode. Include a11y testing in UAT criteria.

---

### Pitfall 15: Recipe Data Versioning + Annotations = Schema Migration Headaches

**What goes wrong:** The project wants both recipe versioning (substantial annotation sets become standalone versions) AND evolution of the recipe data format (adding schema.org fields, changing structure). Every recipe data format change means migrating all existing recipe files + all annotation references. Without a versioned data schema, old recipes break when the format evolves.

**Prevention:**
- Define a recipe data schema version field from day one: `schemaVersion: 1`
- Write migration scripts (not manual edits) for schema changes
- Keep the schema minimal initially — adding fields is cheap, renaming/restructuring is expensive
- When an annotation set "graduates" to a recipe version, generate a new file rather than forking the original
- Version recipe slugs carefully: `pumpkin-doughnut` (original) vs `pumpkin-doughnut-v2-vegan` (derived)

**Phase mapping:** Data schema design phase. Must be considered from the start.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Framework scaffolding | Using `@remix-run/*` instead of `react-router` | Use `create-react-router` or `create-cloudflare --framework=react-router` |
| Data architecture | `fs.readFileSync` in loaders | Embed data at build time via Vite, or pre-render |
| Hosting setup | Cloudflare Workers 10ms CPU limit | Pre-render static pages OR evaluate Vercel free tier |
| Recipe schema design | Missing schema.org fields | Design schema around Google's Recipe structured data requirements |
| Contributor workflow | YAML format friction | Validation CI + issue templates + consider MDX |
| Cooking mode | Screen timeout kills experience | Wake Lock API from the start |
| Responsive design | Standard touch targets in kitchen | 48px+ targets, full-width step navigation buttons |
| Annotation system | Git-based annotations don't scale | Decouple from recipe files, use stable step IDs |
| SEO implementation | Schema.org JSON-LD omitted or incomplete | Generate in route meta/head, validate with Rich Results Test |
| Theming | CSS specificity conflicts | CSS custom properties as theme tokens |
| Accessibility | Cooking-specific needs overlooked | Voice-friendly structure, `aria-live` regions, high contrast |
| Deployment pipeline | GitHub Actions → Cloudflare Workers config gap | Use `wrangler deploy` with auto-detection or official template |

## Sources

- React Router v7 official docs — https://reactrouter.com/upgrading/remix (verified 2026-03-23)
- Remix → React Router v7 announcement — https://remix.run/blog/react-router-v7 (Nov 2024)
- Cloudflare Workers pricing — https://developers.cloudflare.com/workers/platform/pricing/ (verified 2026-03-23)
- Cloudflare Pages limits — https://developers.cloudflare.com/pages/platform/limits/ (verified 2026-03-23)
- Cloudflare React Router deployment guide — https://developers.cloudflare.com/workers/framework-guides/web-apps/react-router (verified 2026-03-23)
- Cloudflare Remix deprecation notice — https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/ (verified 2026-03-23)
- Google Recipe structured data — https://developers.google.com/search/docs/appearance/structured-data/recipe (updated Dec 2025)
- Schema.org Recipe type — https://schema.org/Recipe (v30.0, March 2026)
- React Router v7 rendering strategies — https://reactrouter.com/start/framework/rendering (verified 2026-03-23)
- Remix/React Router gotchas — https://v2.remix.run/docs/guides/gotchas (verified 2026-03-23)
- Screen Wake Lock API — https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
