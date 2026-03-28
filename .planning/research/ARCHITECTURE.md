# Architecture Patterns

**Domain:** Community-driven recipe website (no-DB, flat-file, SSR)
**Researched:** 2026-03-23

## Critical Framework Note

**Remix has merged into React Router v7.** The official Remix v2 docs state "React Router v7 has been released" and recommend upgrading. React Router v7 in "framework mode" IS Remix — same concepts (loaders, actions, nested routes, SSR), newer API, stable release. The PROJECT.md refers to "Remix" but the correct framework to use is **React Router v7 (framework mode)**, installed via `npx create-react-router@latest`.

**Confidence: HIGH** — Verified via official reactrouter.com docs and remix-run/react-router-templates repo (actively maintained, 7.13.2 as of March 2026).

---

## Recommended Architecture

### Hybrid Pre-render + SSR on Cloudflare Pages

Since all content lives in the repo as flat files, every page can be **pre-rendered at build time** for instant delivery. React Router v7's `prerender` config handles this natively. Cloudflare Pages Workers provide SSR fallback at zero cost (free tier: 100K requests/day, 500 builds/month).

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages CDN                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │  Static HTML  │    │  .data files │    │   Assets     │   │
│  │  (pre-render) │    │  (navigation)│    │  (img/css/js)│   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│         │ miss               │ miss                          │
│         ▼                    ▼                               │
│  ┌──────────────────────────────────────┐                   │
│  │     Cloudflare Worker (SSR fallback) │                   │
│  └──────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │ build
┌─────────────────────────────────────────────────────────────┐
│               React Router v7 Build (Vite)                  │
│                                                             │
│  content/recipes/*.yml  ──→  loader()  ──→  Pre-rendered    │
│  content/annotations/*.yml ──→         ──→  HTML + .data    │
│  content/packs/*.yml    ──→                                 │
└─────────────────────────────────────────────────────────────┘
```

### Why This Pattern

| Concern | Decision | Rationale |
|---------|----------|-----------|
| Runtime | Pre-render + SSR fallback | All content is static at build time; SSR catches misses |
| Hosting | Cloudflare Pages | Free, SSR-capable (Workers), official RR7 template exists, GitHub integration |
| Data | YAML flat files in repo | Already established, human-readable, PR-friendly, structured data |
| Interactivity | Progressive enhancement | Recipes readable without JS; cooking mode enhances with JS |

---

## Component Boundaries

### System Components

| Component | Responsibility | Talks To | Server/Client |
|-----------|---------------|----------|---------------|
| **Content Layer** | Parse YAML files into typed objects | File system (Node/Cloudflare) | Server only |
| **Route Loaders** | Load + shape data for each page | Content Layer | Server only |
| **Route Layouts** | Shared chrome (nav, footer, theme) | Child routes via `<Outlet />` | Both |
| **Recipe Views** | Display recipe in different modes | Route data (loaderData) | Both |
| **Cooking Mode** | Interactive step-by-step with wake lock | Client state only | Client only |
| **Theme Engine** | Apply pack-specific CSS variables | Root layout, pack data | Both (CSS vars SSR, JS enhances) |
| **Annotation Display** | Render inline tips on recipe parts | Annotation data from loader | Both |

### Boundary Rules

- **Content Layer** (`*.server.ts` files) — NEVER imported on client. Uses `fs` or Cloudflare-compatible file reads. The `.server.ts` suffix guarantees tree-shaking from client bundles.
- **Route Loaders** — run on server during SSR and at build time during pre-render. Return serializable data only.
- **Cooking Mode** — pure client-side. Uses Wake Lock API, localStorage for progress, no server calls.
- **Theme Engine** — CSS custom properties set in root layout at SSR time. No runtime theme switching needed (theme tied to active pack).

---

## Data Flow

### Recipe Content Pipeline

```
content/recipes/pumpkin-doughnut.yml
        │
        ▼
┌─────────────────────┐
│  content.server.ts  │  ← reads YAML, validates against schema, returns typed Recipe
│  (Content Layer)    │
└────────┬────────────┘
         │ Recipe[]
         ▼
┌─────────────────────┐
│  Route Loader       │  ← shapes data for the view (list vs detail vs cook mode)
│  (recipes.$slug)    │
└────────┬────────────┘
         │ loaderData: { recipe, annotations }
         ▼
┌─────────────────────┐
│  Route Component    │  ← renders with loaderData prop (type-safe via +types/)
│  (RecipeDetail)     │
└────────┬────────────┘
         │ user interaction
         ▼
┌─────────────────────┐
│  Client Components  │  ← Cooking mode, checkbox state (localStorage)
│  (CookingMode)      │     No server round-trips needed
└─────────────────────┘
```

### Data Format: YAML (Keep It)

**Recommendation:** Keep YAML. Recipes are structured data, not prose. YAML is already established, human-readable, PR-diff-friendly, and trivially parsed.

**Enhanced Recipe Schema:**

```yaml
# content/recipes/pumpkin-doughnut.yml
slug: pumpkin-doughnut
title: Pumpkin Doughnut
version: 1
parent: null                    # null for originals, slug for community versions
byline: Michelle
location: Michigan
tags: [baking, fall, pumpkin, doughnuts]
prep_time: 15                   # minutes
cook_time: 15                   # minutes
servings: 12
components:
  - name: Doughnuts
    ingredients:
      - quantity: "2"
        unit: c
        item: all-purpose flour
      - quantity: "2"
        unit: tsp
        item: pumpkin pie spice
      # ...
  - name: Topping
    ingredients:
      - quantity: "3/4"
        unit: c
        item: sugar
      # ...
directions:
  - step: Preheat oven to 350 °F.
    time: null
  - step: Whisk flour, pumpkin pie spice, baking powder, and salt in a bowl.
    time: null
  - step: Bake doughnuts about 15 minutes. Check with toothpick.
    time: 15                    # minutes — cooking mode can auto-detect
background: >
  Our family really loves doughnuts! With it being fall, I needed to find
  a pumpkin recipe. They came out delicious!
links:
  - text: Recipe Source
    url: https://www.foodnetwork.com/recipes/valerie-bertinelli/baked-pumpkin-doughnuts-3514394
flavor: Pumpkin spice season is coming.
image: pumpkin-doughnut.jpg     # relative to public/recipes/
```

**Annotation Schema (separate files):**

```yaml
# content/annotations/pumpkin-doughnut.yml
recipe: pumpkin-doughnut
annotations:
  - id: ann-001
    target:
      type: ingredient          # ingredient | step | general
      component: 0              # which component group
      index: 5                  # which ingredient/step (0-indexed)
    text: "Coconut oil works as a substitute for a slightly nuttier flavor"
    author: "github:janedoe"
    date: 2026-01-15
  - id: ann-002
    target:
      type: step
      index: 3
    text: "Don't overmix — a few lumps are fine"
    author: "github:cookmaster42"
    date: 2026-02-01
```

**Themed Pack Schema:**

```yaml
# content/packs/fall-2026.yml
slug: fall-2026
name: "Fall Favorites"
description: "Warm up your kitchen with these autumn classics"
active: true
recipes:
  - pumpkin-doughnut
  - apple-crisp
  - butternut-soup
theme:
  primary: "#D2691E"
  secondary: "#8B4513"
  accent: "#FFD700"
  background: "#FFF8DC"
  font-heading: "'Playfair Display', serif"
```

---

## Routing Pattern

### Route Configuration (config-based, not file-convention)

React Router v7 supports both file-convention routing and explicit `routes.ts` config. **Use explicit config** because:
- Clearer than dot-delimited filenames (`recipes.$slug.cook.tsx`)
- Easier to reason about the full route tree in one place
- Better for a content-driven site with predictable structure

```typescript
// app/routes.ts
import { type RouteConfig, route, index, layout, prefix } from "@react-router/dev/routes";

export default [
  // Landing page
  index("./routes/home.tsx"),

  // Recipe routes
  layout("./routes/recipes/layout.tsx", [
    ...prefix("recipes", [
      index("./routes/recipes/index.tsx"),           // /recipes
      route(":slug", "./routes/recipes/detail.tsx"),  // /recipes/pumpkin-doughnut
      route(":slug/cook", "./routes/recipes/cook.tsx"), // /recipes/pumpkin-doughnut/cook
    ]),
  ]),

  // Themed packs
  ...prefix("packs", [
    index("./routes/packs/index.tsx"),               // /packs
    route(":packSlug", "./routes/packs/detail.tsx"),  // /packs/fall-2026
  ]),

  // Static pages
  route("contribute", "./routes/contribute.tsx"),     // /contribute
  route("about", "./routes/about.tsx"),               // /about
] satisfies RouteConfig;
```

### Pre-render Configuration

```typescript
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,  // Keep SSR worker as fallback
  async prerender({ getStaticPaths }) {
    // Read all recipe slugs from content directory
    const recipeSlugs = await getRecipeSlugs();
    const packSlugs = await getPackSlugs();

    return [
      ...getStaticPaths(),  // /, /recipes, /packs, /contribute, /about
      ...recipeSlugs.map(s => `/recipes/${s}`),
      ...recipeSlugs.map(s => `/recipes/${s}/cook`),
      ...packSlugs.map(s => `/packs/${s}`),
    ];
  },
} satisfies Config;
```

### Nested Layout Structure

```
root.tsx
├── <html>, <head>, <Links/>, <Meta/>
├── <ThemeProvider>           ← injects CSS vars from active pack
├── <Header/>                 ← site nav, current pack indicator
├── <Outlet/>                 ← child routes render here
└── <Footer/>                 ← contributor links, license

  recipes/layout.tsx          ← shared recipe chrome (breadcrumbs, search?)
  ├── <Outlet/>
  │
  ├── recipes/index.tsx       ← recipe grid with cards
  ├── recipes/detail.tsx      ← full recipe with annotations
  └── recipes/cook.tsx        ← cooking mode (full-screen, minimal chrome)
```

---

## Directory Structure

```
app/
├── root.tsx                          # Root layout, theme provider
├── routes.ts                         # Explicit route config
├── routes/
│   ├── home.tsx                      # Landing page (/)
│   ├── about.tsx                     # About page
│   ├── contribute.tsx                # Contribution guide
│   ├── recipes/
│   │   ├── layout.tsx                # Shared recipe layout (breadcrumbs)
│   │   ├── index.tsx                 # Recipe grid (/recipes)
│   │   ├── detail.tsx                # Recipe detail (/recipes/:slug)
│   │   └── cook.tsx                  # Cooking mode (/recipes/:slug/cook)
│   └── packs/
│       ├── index.tsx                 # Pack listing (/packs)
│       └── detail.tsx                # Pack detail (/packs/:packSlug)
├── data/
│   ├── recipes.server.ts             # Recipe YAML parser + loader utils
│   ├── annotations.server.ts         # Annotation parser
│   ├── packs.server.ts               # Pack parser + theme resolver
│   └── types.ts                      # Shared TypeScript types (Recipe, Annotation, Pack)
├── components/
│   ├── recipe/
│   │   ├── RecipeCard.tsx            # Card for grid view
│   │   ├── IngredientList.tsx        # Shopping-view ingredient display
│   │   ├── DirectionList.tsx         # Step-by-step directions
│   │   ├── CookingMode.tsx           # Full-screen interactive cooking
│   │   ├── AnnotationBadge.tsx       # Inline annotation indicator
│   │   └── AnnotationPopover.tsx     # Annotation detail popover
│   ├── layout/
│   │   ├── Header.tsx                # Site header + nav
│   │   ├── Footer.tsx                # Site footer
│   │   └── Breadcrumbs.tsx           # Recipe breadcrumb trail
│   └── ui/
│       ├── Checkbox.tsx              # Cooking mode step checkbox
│       └── Timer.tsx                 # Auto-detected step timer
├── lib/
│   ├── wake-lock.ts                  # Wake Lock API wrapper (client)
│   └── theme.ts                      # CSS variable injection utilities
content/
├── recipes/
│   ├── pumpkin-doughnut.yml
│   └── ...
├── annotations/
│   ├── pumpkin-doughnut.yml
│   └── ...
└── packs/
    ├── fall-2026.yml
    └── ...
public/
├── recipes/
│   ├── pumpkin-doughnut.jpg
│   └── ...
└── favicon.ico
```

**Key convention:** `content/` lives at project root (sibling to `app/`), not inside `app/`. This keeps content files accessible for contributors who only touch YAML, never React code.

---

## Patterns to Follow

### Pattern 1: Server-Only Content Layer

All file system reads happen in `.server.ts` files, guaranteeing they're stripped from client bundles.

```typescript
// app/data/recipes.server.ts
import fs from "node:fs/promises";
import path from "node:path";
import yaml from "yaml";
import type { Recipe } from "./types";

const RECIPES_DIR = path.join(process.cwd(), "content/recipes");

export async function getAllRecipes(): Promise<Recipe[]> {
  const files = await fs.readdir(RECIPES_DIR);
  const recipes = await Promise.all(
    files
      .filter(f => f.endsWith(".yml"))
      .map(async (f) => {
        const raw = await fs.readFile(path.join(RECIPES_DIR, f), "utf-8");
        return yaml.parse(raw) as Recipe;
      })
  );
  return recipes;
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const filePath = path.join(RECIPES_DIR, `${slug}.yml`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return yaml.parse(raw) as Recipe;
  } catch {
    return null;
  }
}
```

### Pattern 2: Loader → Component Data Flow

Route loaders call the content layer and return shaped data. Components receive it via typed `loaderData` prop.

```typescript
// app/routes/recipes/detail.tsx
import type { Route } from "./+types/detail";
import { getRecipeBySlug } from "~/data/recipes.server";
import { getAnnotationsForRecipe } from "~/data/annotations.server";

export async function loader({ params }: Route.LoaderArgs) {
  const recipe = await getRecipeBySlug(params.slug);
  if (!recipe) throw new Response("Not Found", { status: 404 });

  const annotations = await getAnnotationsForRecipe(params.slug);
  return { recipe, annotations };
}

export default function RecipeDetail({ loaderData }: Route.ComponentProps) {
  const { recipe, annotations } = loaderData;
  return (
    <article>
      <h1>{recipe.title}</h1>
      <IngredientList components={recipe.components} annotations={annotations} />
      <DirectionList directions={recipe.directions} annotations={annotations} />
    </article>
  );
}
```

### Pattern 3: Progressive Enhancement for Cooking Mode

Cooking mode works without JS (checkboxes are native HTML) but enhances with JS (wake lock, timer, local storage persistence).

```typescript
// app/routes/recipes/cook.tsx — Cooking mode route
// Loader provides the recipe data (SSR renders the steps)
// Client-side JS enhances with Wake Lock, localStorage progress, timers
// If JS fails to load, user still sees all steps with native checkboxes
```

### Pattern 4: CSS Theme Variables from Packs

Themes are CSS custom properties set on `:root` via the root loader. No runtime JS theme switching.

```typescript
// app/root.tsx loader
export async function loader() {
  const activePack = await getActivePack();
  return { theme: activePack?.theme ?? defaultTheme };
}

// In the component: inject as inline style on <html>
// <html style={themeToCSS(loaderData.theme)}>
```

```css
/* Tailwind config or global CSS references these variables */
:root {
  --color-primary: var(--theme-primary, #1a1a1a);
  --color-secondary: var(--theme-secondary, #4a4a4a);
  --color-accent: var(--theme-accent, #e65100);
  --color-bg: var(--theme-bg, #fafafa);
}
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Client-Side Data Fetching for Content

**What:** Using `clientLoader` or `useEffect` + `fetch` to load recipe content.
**Why bad:** Content is static — all data is known at build time. Client fetching adds latency and JS dependency.
**Instead:** Use server `loader` + pre-rendering. Content loads at build time and ships as static HTML + `.data` files.

### Anti-Pattern 2: Single Monolithic Recipe Component

**What:** One massive component that handles list view, detail view, cooking mode, and annotations.
**Why bad:** Huge bundle, impossible to code-split, hard to maintain.
**Instead:** Separate route modules per view. React Router v7 automatically code-splits per route.

### Anti-Pattern 3: Database for Content Storage

**What:** Moving recipes into SQLite, Turso, D1, or any database.
**Why bad:** Violates the core constraint (flat files in repo), breaks GitHub PR contribution flow, adds operational complexity.
**Instead:** YAML files in `content/`. The repo IS the database. Git IS the version history.

### Anti-Pattern 4: Runtime File System Reads on Every Request

**What:** Reading YAML files from disk on every SSR request in production.
**Why bad:** Slow, especially on edge runtimes like Cloudflare Workers where `fs` access may be emulated or unavailable.
**Instead:** Pre-render everything. The build reads files once and generates static HTML. SSR fallback should only handle unexpected paths (404s).

### Anti-Pattern 5: Wake Lock Without Progressive Enhancement

**What:** Making cooking mode depend on Wake Lock API availability.
**Why bad:** Wake Lock is not available on all browsers. Without fallback, cooking mode breaks.
**Instead:** Wake Lock is an enhancement. Cooking mode works without it — user just needs to keep tapping the screen occasionally on unsupported browsers.

---

## Cloudflare Pages Deployment Architecture

### Why Cloudflare Pages

| Factor | Cloudflare Pages | Vercel Free | Netlify Free |
|--------|-----------------|-------------|-------------|
| SSR support | Workers (edge) | Serverless functions | Edge functions |
| Free tier builds | 500/month | 6000 min/month | 300 min/month |
| Bandwidth | Unlimited | 100GB/month | 100GB/month |
| RR7 template | Official (`cloudflare`) | Community | Community |
| GitHub integration | Native | Native | Native |
| Custom domains | Yes (free) | Yes (free) | Yes (free) |

**Recommendation: Cloudflare Pages** — unlimited bandwidth, official React Router v7 template, edge SSR via Workers, generous free tier.

### Build + Deploy Pipeline

```
GitHub Push
    │
    ▼
GitHub Actions (or Cloudflare native build)
    │
    ├── Install deps (npm ci)
    ├── Build (react-router build)
    │   ├── Vite client build → build/client/
    │   ├── Pre-render all routes → build/client/**/*.html + *.data
    │   └── SSR worker bundle → build/server/
    │
    ▼
Cloudflare Pages Deploy
    ├── Static assets → CDN (global edge cache)
    └── Worker → SSR fallback (runs at edge)
```

### Cloudflare-Specific Considerations

- **No `node:fs` in Workers runtime.** Content must be read at BUILD time (pre-rendering), not at request time. This reinforces the pre-render-everything strategy.
- **Use the `cloudflare` template** from `remix-run/react-router-templates/cloudflare`.
- **Wrangler** handles local dev with Workers runtime emulation.

---

## Recipe Versioning Architecture

Versions are separate YAML files that reference a parent:

```
content/recipes/
├── pumpkin-doughnut.yml              # version: 1, parent: null
├── pumpkin-doughnut--v2.yml          # version: 2, parent: pumpkin-doughnut
└── pumpkin-doughnut--vegan.yml       # version: 1, parent: pumpkin-doughnut
```

The content layer resolves the version tree:

```typescript
// Loader returns recipe + its versions
{
  recipe: Recipe,
  versions: { slug: string, title: string, version: number }[],
  annotations: Annotation[]
}
```

The detail page shows a "Community Versions" section linking to variants. Each version is a standalone page with its own URL.

---

## Build Order (Dependencies)

Components build on each other. This is the recommended phase sequence:

```
Phase 1: Scaffolding ──────────────────────────────┐
  React Router v7 + Cloudflare template,            │
  Tailwind CSS, TypeScript, project structure        │
                                                     │
Phase 2: Content Layer ◄────────────────────────────┘
  YAML parser, Recipe/Pack types, .server.ts          │
  utilities, pre-render config                        │
                                                      │
Phase 3: Recipe Display ◄─────────────────────────────┘
  Recipe list, recipe detail, basic layout,            │
  responsive design                                    │
          │                                            │
          ├──────────┬────────────┬───────────────┐    │
          ▼          ▼            ▼               ▼    │
Phase 4: Cooking  Phase 5:    Phase 6:     Phase 7:   │
  Mode     Annotations  Themed Packs  Versioning      │
  (client)  (display)   (CSS themes)  (file links)    │
                                                       │
Phase 8: Contribution Flow ◄───────────────────────────┘
  PR templates, issue templates, CONTRIBUTING.md,
  recipe submission guide

Phase 9: Deployment Pipeline
  GitHub Actions, Cloudflare Pages, custom domain
```

**Critical path:** 1 → 2 → 3 (must be sequential — each depends on the last).

**Parallelizable after Phase 3:** Phases 4–7 are independent of each other. Cooking mode, annotations, packs, and versioning don't depend on each other.

**Phase 8** (contribution flow) can start after Phase 3 but benefits from having the data format finalized (Phase 2).

**Phase 9** (deployment) can start as early as Phase 1 (deploy a skeleton) and be refined throughout.

---

## Scalability Considerations

| Concern | At 50 recipes | At 500 recipes | At 5000 recipes |
|---------|--------------|----------------|-----------------|
| Build time | <30s | 1-3 min | 5-15 min (consider incremental) |
| Bundle size | Negligible | Negligible (code-split per route) | Negligible |
| Recipe index | All in memory | Paginate or filter server-side | Pre-computed index JSON |
| Search | Client filter | Client filter with pre-built index | Pre-built search index (Fuse.js/Pagefind) |
| Git repo size | Fine | Fine with image optimization | Consider Git LFS for images |

At current scale (2 recipes), none of this matters. Design for 500 (medium-term target), don't over-engineer for 5000.

---

## Sources

- **React Router v7 Routing** — https://reactrouter.com/start/framework/routing (HIGH confidence, official docs)
- **React Router v7 Data Loading** — https://reactrouter.com/start/framework/data-loading (HIGH confidence, official docs)
- **React Router v7 Route Module** — https://reactrouter.com/start/framework/route-module (HIGH confidence, official docs)
- **React Router v7 Pre-Rendering** — https://reactrouter.com/how-to/pre-rendering (HIGH confidence, official docs)
- **React Router v7 Templates** — https://github.com/remix-run/react-router-templates (HIGH confidence, official repo, Cloudflare template available)
- **Remix v2 Data Flow** — https://v2.remix.run/docs/discussion/data-flow (HIGH confidence, official docs — concepts carry forward to RR7)
- **Remix v2 Route Configuration** — https://v2.remix.run/docs/discussion/routes (HIGH confidence, official docs)
- **Cloudflare Pages free tier** — training data (MEDIUM confidence, verify current limits at deployment time)
