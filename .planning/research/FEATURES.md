# Feature Landscape

**Domain:** Community-driven recipe website (anti-bloat, no-account, git-native)
**Researched:** 2026-03-23
**Comparable sites:** based.cooking (git-based, no-ads), Cooklang ecosystem (plain-text recipes, scaling, version control)

---

## Table Stakes

Features users expect from any recipe site. Missing = users leave or the site feels broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Clean recipe display** — title, ingredients, steps, attribution, image. No life story preamble. | This is literally the anti-pattern the site exists to fight. Recipe-first layout is the core promise. | Low | Existing YAML has title, byline, components, directions, background, links, flavor. Needs prep/cook time, yield, cuisine, category added. |
| **Structured ingredient lists** — grouped by component (e.g. "Doughnuts", "Topping"), with quantities and units parsed | Every recipe site does this. Grouping by component is essential for multi-part recipes. | Medium | Current YAML has `components` as string arrays grouped by name. Need structured quantity/unit/ingredient parsing for scaling & shopping views. |
| **Numbered/checkable steps** — directions displayed as discrete, numbered steps users can track progress through | Users need to know where they are in a recipe. Checking off steps is table stakes for digital recipes. | Low | Current YAML `directions` is a string array — maps directly to numbered steps. |
| **Recipe images** — at least one appetizing photo per recipe | Visual confirmation of what you're making. Google rich results require images (multiple aspect ratios recommended: 16:9, 4:3, 1:1). | Low | Already have static images in `public/recipes/`. Need to standardize naming and aspect ratio support. |
| **Mobile-responsive layout** — readable on phone screens without horizontal scrolling or tiny text | Most recipe browsing happens on phones. Kitchen use is mobile-first. | Medium | Tailwind already in stack. Needs deliberate mobile-first design, not just responsive breakpoints. |
| **Recipe browsing/discovery** — browse all recipes, filter/search by tag, cuisine, ingredient, category | Users need to find recipes. based.cooking does tag-based browsing effectively. | Medium | Need tag/category taxonomy in recipe data. Current YAML has no tags. |
| **SEO: JSON-LD structured data** — Schema.org/Recipe markup on every recipe page | Google rich results (image carousel, cook time, ratings) drive organic traffic. Without this, recipes are invisible in search. | Medium | Must emit `@type: Recipe` with `name`, `image`, `recipeIngredient`, `recipeInstructions` (as `HowToStep`), `author`, `prepTime`, `cookTime`, `totalTime`, `recipeYield`, `recipeCategory`, `recipeCuisine`, `keywords`. Google requires image + name minimum. |
| **SEO: clean URLs** — `/recipes/pumpkin-doughnut` not `/recipes?id=123` | URL structure matters for both users and search. Remix nested routing makes this natural. | Low | Remix file-based routing handles this. Recipe slug derived from filename. |
| **SEO: meta tags** — Open Graph, Twitter cards, canonical URLs per recipe | Social sharing drives recipe site traffic. A shared recipe link needs a preview image and title. | Low | Standard meta tag generation per recipe page. |
| **Print-friendly view** — clean print stylesheet that shows recipe without navigation/chrome | People still print recipes. Print CSS that strips nav, keeps ingredients and steps. | Low | CSS `@media print` rules. Minimal effort, high value. |
| **Accessible text** — proper heading hierarchy, semantic HTML, sufficient color contrast, alt text on images | WCAG compliance is table stakes for any public site. Kitchen accessibility (wet hands, bright light, small screens) adds constraints. | Medium | Use semantic `<article>`, `<section>`, `<ol>` for steps, `<ul>` for ingredients. Alt text from recipe title + image source. |
| **Fast page loads** — sub-second render, minimal JavaScript for recipe reading | Recipe sites are notorious for bloat. Speed is part of the brand promise. | Medium | Remix SSR helps. Recipes should render without JS. No third-party scripts (no ads, no analytics). Progressive enhancement only. |
| **Attribution/source links** — credit original recipe source and image source | Existing data has `links` with source URLs plus `byline`/`location`. Legal and ethical requirement. | Low | Already in data model. Display prominently. |
| **Sitemap generation** — XML sitemap for search engine indexing | Standard SEO. Recipes need to be discoverable by crawlers. | Low | Auto-generate from recipe file list at build time or on-demand. |

## Differentiators

Features that set freerecipe.club apart. Not expected, but create competitive advantage.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Cooking mode** — full-screen, step-by-step view with large text, wake lock, step navigation, ingredient highlighting per step | The "someone actually cooks from this" promise. Most recipe sites stop at displaying text. Cooking mode makes the phone a kitchen tool. | High | Screen Wake Lock API has full browser support (Chrome 84+, Firefox 126+, Safari 16.4+). Needs: large tap targets for wet hands, high-contrast text, swipe/tap to advance steps, current-step ingredient highlighting, optional voice readback (stretch). |
| **Community annotations** — inline tips, substitutions, and modifications pinned to specific ingredients or steps | The best content in recipe comments is substitution tips ("I used almond flour instead"). Pinning to specific lines makes tips discoverable in context instead of buried in a comment section. | High | Novel UI pattern. Needs: annotation anchoring to recipe lines (ingredient or step), display as inline callouts or expandable tips, voting/curation mechanism (without accounts — maybe PR-based?), contributor attribution via git. |
| **Recipe versioning** — significant annotation sets graduate to standalone recipe variants (forks) | When enough people substitute the same ingredients, that's a new recipe. Git fork model maps naturally. | Medium | Data model: recipe `isBasedOn` field pointing to parent recipe. Display as "Variations" section. Each version is its own file in the repo. Git history provides automatic versioning. |
| **Git-native contribution workflow** — submit recipes via GitHub PR with template, review process, CI validation | Developer audience + Hacktoberfest alignment. based.cooking proves this model works (200+ contributors). | Medium | Needs: recipe PR template (YAML/MDX scaffold), GitHub Actions CI to validate recipe format, contributor guide, good-first-issue labels, recipe linting. |
| **Non-technical contribution path** — email/letter submissions converted to GitHub issues by maintainers | Accessibility beyond developers. The analog ethos. "Anyone who can write a recipe can contribute." | Low | Process, not code. Document the flow: email → maintainer creates GitHub issue → recipe added via PR. Provide email address and mailing address on contribution page. |
| **Themed recipe packs** — seasonal/holiday curated collections with matching site visual themes | Transforms the site from a static database to a living, seasonal experience. "Halloween Pack" = orange/black theme + curated spooky recipes. | High | Needs: theme system (CSS custom properties switchable per pack), pack curation metadata (which recipes belong), pack landing pages, seasonal auto-switching or manual toggle. Each pack = a data file (recipes list + theme config). |
| **Shopping view** — ingredients reorganized by category (produce, dairy, pantry) across selected recipes | Jump from "what to cook" to "what to buy" without manual transcription. Cooklang ecosystem validates demand for this feature. | High | Requires structured ingredient parsing (quantity, unit, ingredient name, category). Ingredient categorization is the hard part — needs a mapping table or heuristic. Aggregate across multiple selected recipes. |
| **Ingredient scaling** — adjust servings, quantities update proportionally | Cooklang's most popular feature. Users rarely cook for the exact yield in the recipe. | Medium | Requires structured quantity/unit data (not just strings). Some quantities are fixed (e.g., "1 tsp salt" might not scale linearly). Need `scalable: true/false` per ingredient or smart defaults. |
| **No-JavaScript recipe reading** — recipes render fully from SSR, JS enhances but isn't required | Progressive enhancement. If JS fails (kitchen, slow connection), the recipe is still readable. Cooking mode requires JS, but basic reading doesn't. | Medium | Remix SSR handles this naturally. Cooking mode and annotations are JS-enhanced features on top of static content. |
| **Contributor profiles (git-derived)** — show recipes by contributor, auto-generated from git history | Community recognition without accounts. "See all 12 recipes by Michelle." | Low | Derived from `byline` field in recipe data. No authentication needed — just an index page grouped by author. |
| **Recipe component dependencies** — dough references a base recipe, sauce references another | Complex recipes share components (e.g., "use the basic pie crust from [Pie Crust recipe]"). Cooklang validates this pattern. | Medium | Data model: `dependsOn: [recipe-slug]` field. Display linked sub-recipes inline or as expandable sections. |
| **Offline support** — service worker caches viewed recipes for offline kitchen use | Kitchen Wi-Fi is unreliable. Caching a recipe you've opened means it's still there when the oven is going. | Medium | Service worker with cache-first strategy for recipe pages. Remix can support this. Don't over-engineer — cache what's been visited, not proactive sync. |

## Anti-Features

Things to deliberately NOT build. Each one is a conscious rejection of mainstream recipe site patterns.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **User accounts / login** | Adds complexity, privacy liability, and exclusion. The whole point is zero-friction recipe access. No login walls, no saved favorites requiring auth. | Git-native identity for contributors (GitHub username). Readers are anonymous. If "save" is needed later, use browser localStorage bookmarks — no server state. |
| **Ratings / star reviews** | Incentivizes SEO gaming, creates social pressure, and most recipe ratings are meaningless (5 stars: "haven't made it yet!"). | Community annotations provide richer signal than a number. Quality curation happens through the PR review process. |
| **Comment sections** | Flat comment sections on recipe sites are 90% noise. Life stories, "I substituted everything and it was bad", off-topic. | Community annotations pinned to specific recipe lines. Higher signal, better context. Submitted as PRs, reviewed by maintainers. |
| **Ads / monetization** | Core brand promise. Ads are the #1 reason recipe sites are unusable. Every ad makes the site worse. | Fund via donations if needed (based.cooking uses Monero/Bitcoin). Keep hosting costs near zero with free tier hosting. |
| **Analytics / tracking** | No cookies, no surveillance. Privacy is a feature, not a compromise. No Google Analytics, no Hotjar, no third-party scripts. | If traffic data is needed, use server-side log analysis or privacy-respecting alternatives (Plausible self-hosted). But honestly, just don't track. |
| **Email newsletter signup popups** | Dark pattern. Interrupts recipe reading. | If there's a newsletter, it's a single link in the footer. No popups, no modals, no "subscribe before you can read". |
| **Infinite scroll / pagination tricks** | Respect the user's attention. Show recipes, let them browse. | Simple paginated list or tag-filtered grid. Load all recipes if the collection is small enough. |
| **AI-generated recipes** | Undermines the community/human-sourced ethos. AI slop is the opposite of "someone's grandmother's recipe." | All recipes are human-contributed with real attribution and provenance. |
| **Social features (likes, follows, feeds)** | Scope creep toward social media. Not the product. | The "social" layer is GitHub: PRs, issues, discussions. Keep the site focused on recipes. |
| **Video-first / autoplay media** | Bloat. Recipe video autoplay is a plague. | Static images. If a contributor wants to link a video, it's an external link, not embedded. |
| **Native mobile app** | Maintenance burden for a small project. Responsive web is the right call. | Progressive web features (service worker, wake lock, add-to-homescreen) give app-like experience without an app store. |
| **Server-side database** | Recipes live in the repo as flat files. Database adds ops burden, hosting cost, and a single point of failure. | File-based data (YAML/MDX in git). The repo IS the database. SSR reads from files. |
| **Mandatory JavaScript for reading** | Breaks in kitchens, on slow connections, with ad blockers that break JS. | SSR renders full recipe content. JS enhances (cooking mode, annotations, scaling) but isn't required to read. |
| **Recipe paywalls / "premium" content** | Every recipe is free. No tiering. | All content is open source, contributed freely, available freely. |

## Feature Dependencies

```
Clean recipe display ──────────────┐
                                    ├── Cooking mode (needs structured steps)
Structured ingredient lists ───────┤
                                    ├── Ingredient scaling (needs parsed quantities)
                                    ├── Shopping view (needs parsed + categorized ingredients)
                                    └── Recipe component dependencies (needs ingredient references)

Recipe browsing/discovery ─────────── Tag/category taxonomy in recipe data

Community annotations ─────────────── Recipe versioning (significant annotations → forks)

Git-native contribution workflow ──── Recipe PR template + CI validation
                                    └── Non-technical contribution path (email → issue → PR)

Themed recipe packs ───────────────── CSS theme system + pack curation metadata
                                    └── Recipe browsing/discovery (packs are curated subsets)

SEO: JSON-LD structured data ──────── Structured ingredient lists (recipeIngredient)
                                    └── Prep/cook time fields in recipe data

Offline support ───────────────────── Service worker
                                    └── Clean recipe display (cache-worthy pages)

Cooking mode ──────────────────────── Screen Wake Lock API
                                    └── Step-by-step navigation
                                    └── Community annotations (show tips per step)
```

## MVP Recommendation

**Prioritize (Phase 1-2):**
1. Clean recipe display with structured data (table stakes — the entire site promise)
2. Mobile-responsive layout (kitchen use is the primary context)
3. Recipe browsing by tag/category (users need to find recipes)
4. SEO: JSON-LD, meta tags, sitemap, clean URLs (discoverability drives adoption)
5. Print-friendly CSS (low effort, high value)
6. Git-native contribution workflow with PR template (enables community growth)

**Build next (Phase 3-4):**
7. Cooking mode with wake lock and large text (the killer differentiator)
8. Structured ingredient parsing (unlocks scaling and shopping)
9. Ingredient scaling (high demand once parsing exists)
10. Community annotations (novel, high complexity — needs design iteration)

**Defer:**
- **Shopping view**: Requires robust ingredient categorization — hard to get right. Build after scaling works.
- **Themed packs**: Exciting but cosmetic. Build after core recipe experience is solid.
- **Recipe versioning**: Depends on annotations having traction. Build when annotation data exists.
- **Offline support**: Nice to have. Service worker is easy to add later, hard to debug now.
- **Recipe component dependencies**: Edge case for complex recipes. Add when recipe count justifies it.
- **Contributor profiles**: Low effort but low priority. Auto-generate from git data when there are enough contributors.

## Data Model Implications

The current recipe YAML needs these additions for table stakes:
- `prepTime`, `cookTime`, `totalTime` (ISO 8601 duration strings for Schema.org)
- `recipeYield` / `servings` (number, for scaling and structured data)
- `recipeCategory` (e.g., "dessert", "main course")
- `recipeCuisine` (e.g., "American", "Italian")
- `tags` / `keywords` (array, for browsing and SEO)
- Structured ingredients: `{ quantity, unit, ingredient, group, scalable? }` instead of string arrays

The existing `components` (grouped string arrays), `directions` (string array), `byline`, `location`, `background`, `links`, and `flavor` fields map well to the target feature set.

## Sources

- **Schema.org/Recipe** (https://schema.org/Recipe) — Industry-standard recipe structured data vocabulary. Confidence: HIGH.
- **Google Recipe Structured Data** (https://developers.google.com/search/docs/appearance/structured-data/recipe) — Required/recommended fields for Google rich results. Updated 2025-12-10. Confidence: HIGH.
- **based.cooking** (https://based.cooking) — Git-based community recipe site with no ads, similar philosophy. ~200+ contributors, markdown files, tag browsing. Confidence: HIGH (direct comparable).
- **Cooklang ecosystem** (https://cooklang.org) — Recipe markup language with scaling, shopping lists, git version control, recipe dependencies. Validates demand for structured recipe data. Confidence: HIGH.
- **Screen Wake Lock API** (https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API) — Browser API for keeping screen on during cooking. Baseline 2025, full support across major browsers. Confidence: HIGH.
