# Phase 1: Foundation & Data Layer — Research

**Researched:** 2026-03-23
**Status:** Complete

## Executive Summary

Remix 3 (alpha) is a fundamentally new framework — NOT an evolution of Remix v2/React Router v7. It uses a composable middleware architecture built on web standards (Fetch API), with explicit routing via `remix/fetch-router` (no file-based routing), TSX server rendering, and no bundler dependency. Tailwind v4 CLI provides CSS building without Vite. Hosting requires a Node.js-capable provider since Remix 3 runs a persistent HTTP server.

## Standard Stack

| Concern | Package | Version | Notes |
|---------|---------|---------|-------|
| Framework | `remix` | `@next` dist-tag | Alpha — install via `npm install remix@next` |
| Server | `remix/node-fetch-server` | (included in remix) | `createRequestListener` wraps Fetch→Node.js |
| Router | `remix/fetch-router` | (included in remix) | Explicit route definitions, middleware-based |
| Static files | `remix/static-middleware` | (included in remix) | Serves `./public` directory |
| TypeScript | `tsx` | latest | Runtime TS execution, no build step for server |
| Client bundling | `esbuild` | latest | For client-side JS assets (interactive components) |
| CSS | `tailwindcss` + `@tailwindcss/cli` | v4.2+ | CSS-first config, CLI build (no Vite) |
| YAML parsing | `yaml` | ^2.x | Parse recipe YAML files |
| Validation | `zod` | latest | Schema validation for recipe data |
| Node.js | 20+ | LTS | Required for `remix/node-fetch-server` |

## Architecture Patterns

### Remix 3 Application Structure (from bookstore demo)

```
app/
├── server.ts              # Node.js HTTP server entry point
├── app/
│   ├── router.ts          # createRouter() + middleware stack + route mapping
│   ├── routes.ts          # Typed route definitions using remix/fetch-router/routes
│   ├── controllers/       # Route handlers (render pages, handle actions)
│   │   ├── render.tsx     # HTML renderer (document shell)
│   │   └── ...            # Feature controllers
│   ├── middleware/         # Request middleware (sessions, auth, etc.)
│   ├── data/              # Data layer (loading, validation)
│   └── utils/             # Shared utilities
├── public/                # Static assets (served by static-middleware)
├── package.json
└── tsconfig.json
```

### Key Architectural Differences from Old Remix

1. **No file-based routing** — Routes are explicitly defined in `routes.ts` using helpers like `route()`, `get()`, `post()`, `form()`
2. **No loaders/actions** — Controllers handle GET/POST directly via `router.get()`, `router.map()` patterns
3. **No bundler required** — `tsx` runs TypeScript directly at runtime, `esbuild` only for client-side interactive JS
4. **No React (uses Preact fork)** — Remix 3 uses its own component model (`remix/component`), NOT React
5. **Middleware composition** — Stack-based middleware pattern (compression, static files, form parsing, etc.)
6. **Web standards first** — Fetch API `Request`/`Response`, no Node.js-specific APIs except the HTTP listener bridge

### Server Setup Pattern

```typescript
// server.ts
import * as http from 'node:http'
import { createRequestListener } from 'remix/node-fetch-server'
import { createRouter } from './app/router.ts'

let router = createRouter()
let server = http.createServer(
  createRequestListener(async (request) => {
    try {
      return await router.fetch(request)
    } catch (error) {
      console.error(error)
      return new Response('Internal Server Error', { status: 500 })
    }
  })
)
server.listen(3000)
```

### Router + Middleware Pattern

```typescript
// app/router.ts
import { createRouter } from 'remix/fetch-router'
import { staticFiles } from 'remix/static-middleware'
import { routes } from './routes.ts'

export function createAppRouter() {
  let router = createRouter({
    middleware: [
      staticFiles('./public', { cacheControl: 'no-store' }),
    ],
  })
  router.get(routes.home, homeController)
  router.get(routes.recipes.index, recipesController.index)
  router.get(routes.recipes.show, recipesController.show)
  return router
}
```

### Route Definitions Pattern

```typescript
// app/routes.ts
import { get, route } from 'remix/fetch-router/routes'

export let routes = route({
  home: '/',
  recipes: {
    index: '/recipes',
    show: '/recipes/:slug',
  },
})
```

## Tailwind v4 CSS-First Approach

Tailwind v4 eliminates the JavaScript config file. Configuration is done in CSS:

```css
/* app/styles/input.css */
@import "tailwindcss";

@theme {
  --color-brand: #2d5016;
  --font-sans: "Inter", sans-serif;
}
```

**Build command:** `npx @tailwindcss/cli -i ./app/styles/input.css -o ./public/styles/output.css --watch`

**Integration with Remix 3:** Add CSS build as a parallel dev script alongside `tsx watch server.ts`. The built CSS file goes to `public/` and is served by `remix/static-middleware`.

## Hosting Decision

### Analysis

Remix 3 runs a persistent Node.js HTTP server. It does NOT produce static output. This eliminates GitHub Pages and any static-only hosting.

**Requirement:** Free + tied to GitHub repo (auto-deploy from pushes).

### Recommendation: Fly.io

| Factor | Fly.io | Render | Cloudflare Workers |
|--------|--------|--------|--------------------|
| Free tier | Yes (3 shared VMs) | Yes (spins down) | Yes (100k req/day) |
| Node.js support | Full | Full | No (`node:http` blocked) |
| Cold starts | None (machine stays warm) | 30s+ on free tier | None |
| GitHub deploy | Via GitHub Actions | Git push integration | Via Wrangler CLI |
| Complexity | Medium (Dockerfile or fly.toml) | Low (auto-detect) | High (needs adapter) |

**Primary recommendation: Fly.io** — Full Node.js support, no cold starts on free tier, GitHub Actions deploy, well-documented. Requires a simple `fly.toml` and `Dockerfile`.

**Fallback: Render** — Simpler setup (auto-detects Node.js), but free tier has significant cold start delays (~30s) after inactivity. Acceptable for a low-traffic recipe site.

**Rejected: Cloudflare Workers** — Remix 3 uses `node:http` for its server listener and `remix/node-fetch-server`. While the fetch-router core is runtime-agnostic, the HTTP server bridge is Node.js-specific. Would require significant adaptation.

### Deploy Configuration (Fly.io)

```toml
# fly.toml
app = "freerecipe-club"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[http_service]
  internal_port = 3000
  force_https = true

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
  cpus = 1
```

## Zod + YAML Validation Pattern

```typescript
// app/data/recipe-schema.ts
import { z } from 'zod'

const LinkSchema = z.object({
  text: z.string().min(1),
  url: z.string().url(),
})

const RecipeSchema = z.object({
  title: z.string().min(1),
  byline: z.string().min(1),
  location: z.string().min(1),
  components: z.array(z.array(z.string())),
  directions: z.array(z.string().min(1)),
  background: z.string(),
  links: z.array(LinkSchema),
  flavor: z.string(),
})

export type Recipe = z.infer<typeof RecipeSchema>
```

```typescript
// app/data/recipes.ts
import fs from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'
import { RecipeSchema, type Recipe } from './recipe-schema.ts'

export function loadRecipes(recipesDir: string): Recipe[] {
  let files = fs.readdirSync(recipesDir).filter(f => f.endsWith('.yml'))
  return files.map(file => {
    let content = fs.readFileSync(path.join(recipesDir, file), 'utf-8')
    let data = parseYaml(content)
    let result = RecipeSchema.safeParse(data)
    if (!result.success) {
      throw new Error(`Invalid recipe ${file}: ${result.error.message}`)
    }
    return result.data
  })
}
```

**Standalone validation script** (`scripts/validate-recipes.ts`):
```typescript
import { loadRecipes } from '../app/data/recipes.ts'
try {
  let recipes = loadRecipes('./data/recipes')
  console.log(`✓ ${recipes.length} recipe(s) validated`)
  process.exit(0)
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
```

## Recipe Data Location

Following Remix 3 conventions (flat files, no content collections), recipes should live in a `data/recipes/` directory at project root (not inside `app/`). This keeps data separate from application code and makes it easy to find for contributors.

Images should remain in `public/recipes/` as static assets.

## CI/CD Pipeline

GitHub Actions workflow with:
1. **PR checks:** TypeScript type checking (`tsc --noEmit`), recipe validation (`npm run validate`), build test
2. **Deploy on push to main:** Build → deploy to Fly.io via `flyctl deploy`

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run typecheck
      - run: npm run validate
      - run: npm run build:css

  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

## Don't Hand-Roll

| Concern | Use | Don't |
|---------|-----|-------|
| YAML parsing | `yaml` package | Manual regex/string parsing |
| Schema validation | Zod | Manual if/else checks or `as Type` casting |
| HTTP server bridge | `remix/node-fetch-server` | Raw `http.createServer` with manual Request conversion |
| Routing | `remix/fetch-router` | Express, Koa, or custom router |
| Static file serving | `remix/static-middleware` | Custom fs.readFile handlers |
| CSS utility classes | Tailwind v4 CLI | Manual CSS or runtime-based CSS-in-JS |
| TypeScript execution | `tsx` | `ts-node` or manual compilation step |

## Common Pitfalls

1. **Installing `@remix-run/*` packages** — Those are Remix v2 (legacy). Remix 3 is just the `remix` package with subpath imports (`remix/fetch-router`, `remix/component`, etc.)
2. **Expecting file-based routing** — Remix 3 has NO file-based routing. Routes are explicitly defined in code.
3. **Using React** — Remix 3 does NOT use React. It has its own component model based on a Preact fork. Import from `remix/component`.
4. **Expecting Vite** — Remix 3 is "religiously runtime." No bundler at all for server code. `tsx` runs TypeScript directly. Only client-side interactive JS uses `esbuild`.
5. **Expecting loaders/actions** — Remix 3 uses a controller/middleware pattern, not the loader/action convention from Remix v2.
6. **Trying to generate static output** — Remix 3 is a server framework. It needs a running Node.js process. No SSG mode.
7. **Using `tailwind.config.js`** — Tailwind v4 uses CSS-first configuration via `@theme` in CSS files. No JS config file.

## Validation Architecture

### Verification Points for Phase 1

| Truth | How to Verify |
|-------|---------------|
| Dev server runs | `tsx server.ts` starts without error, responds at localhost |
| Tailwind applied | Output CSS file contains utility classes; page has styled content |
| Recipes validated | `npm run validate` exits 0; invalid YAML causes exit 1 |
| CI passes | Push to branch, GitHub Actions check job succeeds |
| Deploy works | `flyctl deploy` succeeds, site accessible at fly.io URL |
| Zero third-party scripts | View source of deployed page, grep for external script tags = 0 |
| No tracking/auth | No cookies set, no analytics endpoints, no login pages |

---

*Phase: 01-foundation-data-layer*
*Researched: 2026-03-23*
