# Technology Stack

**Project:** freerecipe.club
**Researched:** 2026-03-23
**Overall Confidence:** HIGH — versions verified against npm registry and official React Router Cloudflare template (updated same day)

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| React | ^19.2.4 | UI library | React 19 is stable (2+ months), used in official RR7 template; server components support future-proofs | HIGH |
| React DOM | ^19.2.4 | DOM renderer | Peer dep of React Router; matches React version | HIGH |
| React Router | 7.13.2 | Full-stack framework (framework mode) | **This IS Remix now.** React Router v7 absorbed Remix after the merger. Framework mode provides SSR, loaders, actions, nested routing — everything Remix had. Pinned (not caret) per official template convention for stability | HIGH |
| @react-router/dev | 7.13.2 | Dev tooling, CLI, code generation | Provides `react-router dev`, `react-router build`, route typegen. Pinned to match react-router version | HIGH |

**Critical note:** "Remix" no longer exists as a separate package. React Router v7 in framework mode _is_ Remix. The `remix` and `@remix-run/*` packages are legacy. Use `react-router` and `@react-router/*` exclusively.

### Build Tooling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vite | ^7.1.7 | Build tool, dev server, HMR | Official RR7 Cloudflare template uses Vite 7.x. **Do NOT use Vite 8** (released 2026-03-23, extremely new — RR7 compatibility unverified) | HIGH |
| TypeScript | ^5.9.3 | Type safety | Official template pins to TS 5.x. **Do NOT use TypeScript 6** (released 2026-03-23, compatibility unverified). TS 5.9 is stable and fully supported | HIGH |
| vite-tsconfig-paths | ^5.1.4 | TSConfig path alias support in Vite | Enables `~/*` import aliases without manual Vite `resolve.alias` config. Used in official template | HIGH |

### Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | ^4.2.2 | Utility-first CSS | v4 is a major rewrite: CSS-first config (no `tailwind.config.js`), zero-runtime, native `@theme` directive. Team already knows Tailwind from v3 — migration is straightforward. Official RR7 template includes it | HIGH |
| @tailwindcss/vite | ^4.2.2 | Vite plugin for Tailwind | Replaces the old PostCSS-based setup. Drop-in Vite plugin, recommended for all Vite projects | HIGH |

**Tailwind v4 migration notes:**
- No more `tailwind.config.cjs` — configuration is done in CSS via `@theme { }` blocks
- No more `@tailwind base/components/utilities` — use `@import "tailwindcss";`
- Content detection is automatic (no `content: [...]` glob)
- Custom theme values use CSS custom properties: `@theme { --color-brand: #ef4444; }`

### Deployment (Cloudflare Pages)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @cloudflare/vite-plugin | ^1.29.1 | Cloudflare Workers/Pages Vite integration | Official Cloudflare integration for Vite-based frameworks. Handles worker bundling, asset manifests, local dev emulation | HIGH |
| wrangler | ^4.75.0 | Cloudflare CLI for deploy, dev, typegen | `wrangler deploy` for production, `wrangler types` for env typegen. Config via `wrangler.jsonc` | HIGH |
| @cloudflare/workers-types | latest | TypeScript types for CF Workers runtime | Provides types for `Env`, KV, D1, etc. Generated via `wrangler types` | HIGH |

**Why Cloudflare Pages over Vercel:**
- Free tier is generous: unlimited requests, 500 builds/month, 100K function invocations/day
- GitHub integration is native (auto-deploy on push)
- Edge SSR by default (global distribution, no cold starts like Vercel serverless)
- Wrangler CLI provides local dev environment that accurately emulates production
- No vendor lock-in concern — site serves flat-file recipes with standard Web APIs
- Vercel free tier has 100GB bandwidth limit; Cloudflare has none

### Recipe Data

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| yaml | ^2.8.3 | YAML parser/stringifier | Parse recipe `.yml` files in route loaders. Already used in existing codebase. YAML 1.2 compliant, zero deps, full TypeScript support | HIGH |
| zod | ^4.3.6 | Schema validation | Validate recipe YAML at load time — catch malformed contributions before they break the site. 2kb gzipped, zero deps, infers TypeScript types from schemas | HIGH |

**Recipe data format decision: Keep YAML.**
- Recipes are structured data (ingredients list, steps list, metadata) — not narrative content
- YAML is human-readable and contributor-friendly for PR-based workflows
- MDX is wrong here: it's for narrative content with embedded components, not structured data
- JSON is less readable for non-technical contributors submitting recipes
- Zod schemas validate YAML after parsing — type-safe recipe objects in loaders

### Bot Detection

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| isbot | ^5.1.36 | Bot user-agent detection | Used in entry.server.tsx to skip hydration for bots (saves bandwidth, improves SEO crawl). Included in official RR7 template | HIGH |

### Testing

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vitest | ^4.1.1 | Unit/integration test runner | Native Vite integration (shares config), Jest-compatible API, blazing fast. The standard for Vite-based projects | HIGH |
| @testing-library/react | ^16.3.2 | Component testing utilities | Test components the way users interact with them. React 19 compatible | HIGH |
| @testing-library/dom | latest | DOM testing utilities | Required peer dep for @testing-library/react v16+ | HIGH |
| @playwright/test | ^1.58.2 | E2E testing | Cross-browser, auto-wait, tracing. Best E2E framework for verifying cooking mode, recipe display, responsive layouts | HIGH |

### Type Definitions

| Technology | Version | Purpose |
|------------|---------|---------|
| @types/react | ^19.2.14 | React type definitions |
| @types/react-dom | ^19.2.3 | ReactDOM type definitions |
| @types/node | ^22 | Node.js type definitions |

### Future Consideration (not needed now)

| Technology | Purpose | When to Add |
|------------|---------|-------------|
| @react-router/fs-routes | File-system routing convention | If manual `routes.ts` config becomes unwieldy with many recipes. Currently, explicit routing is better for a small site |
| schema-dts | TypeScript types for Schema.org | When implementing JSON-LD structured data for recipe SEO (Recipe schema) |
| lucide-react | Icon library | When UI needs icons (cooking mode controls, navigation). Tree-shakeable, ~1kb per icon |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | React Router 7 (framework mode) | Next.js, Astro v5 | RR7 is the team's chosen framework; Astro v5 is SSG-focused (was existing, but migration target is Remix/RR7); Next.js has more complexity than needed |
| Hosting | Cloudflare Pages | Vercel free tier | Vercel caps bandwidth at 100GB, has cold starts on serverless. CF Pages has no bandwidth limit, edge SSR, and deeper free tier |
| Hosting | Cloudflare Pages | GitHub Pages | GH Pages is static-only — no SSR support. Disqualified by project requirements |
| Styling | Tailwind CSS v4 | Vanilla CSS / CSS Modules | Team already uses Tailwind; v4 is a clean upgrade path. Utility-first is fast for responsive kitchen-friendly layouts |
| Data format | YAML | MDX | MDX is for narrative content with components. Recipes are structured data — YAML maps directly to typed objects |
| Data format | YAML | JSON | JSON is less readable for human contributors. YAML supports comments, multi-line strings (recipe instructions), is more PR-friendly |
| Validation | Zod v4 | Yup, io-ts, ArkType | Zod is the TypeScript validation standard (39M weekly downloads), zero deps, 2kb core. Perfect inference from schema to type |
| Unit tests | Vitest | Jest | Jest requires separate config, doesn't share Vite's transform pipeline. Vitest is built for Vite |
| E2E tests | Playwright | Cypress | Playwright is faster, supports all browsers, better for CI. Cypress has dashboard lock-in for parallel runs |
| Build tool | Vite 7 | Vite 8, Webpack, Turbopack | Vite 7 is what RR7 officially supports. Vite 8 just released (unverified compat). Webpack/Turbopack are irrelevant for RR7 |
| TypeScript | TS 5.9 | TS 6.0 | TS 6.0 released today — not yet verified with RR7 toolchain. TS 5.9 is battle-tested |

## Project Configuration Files

```
react-router.config.ts    # React Router framework config (SSR mode, prerender, etc.)
vite.config.ts            # Vite config with RR7 plugin, Tailwind plugin, CF plugin
tsconfig.json             # TypeScript config
wrangler.jsonc            # Cloudflare Workers config (routes, compatibility_date)
app/app.css               # Root CSS with @import "tailwindcss" and @theme customization
app/routes.ts             # Route definitions
```

No `tailwind.config.js` — Tailwind v4 is CSS-first.

## Installation

```bash
# Scaffold from official Cloudflare template
npx create-react-router@latest freerecipe-club --template remix-run/react-router-templates/cloudflare

# Additional production dependencies
npm install yaml zod

# Additional dev dependencies
npm install -D vitest @testing-library/react @testing-library/dom @playwright/test
```

## Scripts

```json
{
  "scripts": {
    "dev": "react-router dev",
    "build": "react-router build",
    "preview": "npm run build && vite preview",
    "deploy": "npm run build && wrangler deploy",
    "typecheck": "react-router typegen && tsc -b",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

## Key Architecture Decisions Baked Into Stack

1. **SSR on Cloudflare Edge** — Every recipe page is server-rendered at the edge, meaning fast TTFB globally. No client-side data fetching waterfalls.

2. **Flat-file data in loaders** — Recipe YAML files are read and parsed in React Router `loader` functions at request time. No database. On Cloudflare, these files are bundled into the worker at build time.

3. **Zod validation at the boundary** — Recipe YAML is untrusted input (contributed via PRs). Zod schemas in loaders validate and type-narrow before rendering.

4. **Tailwind v4 CSS-first theming** — Seasonal theme packs can be implemented as CSS files that override `@theme` custom properties. No JS theme switching needed — pure CSS cascade.

5. **No client JS required to read recipes** — React Router SSR serves complete HTML. Progressive enhancement adds cooking mode interactivity, but recipes are readable with JS disabled.

## Sources

All versions verified against npm registry on 2026-03-23:
- react-router 7.13.2: https://www.npmjs.com/package/react-router
- @react-router/dev 7.13.2: https://www.npmjs.com/package/@react-router/dev
- @react-router/cloudflare 7.13.2: https://www.npmjs.com/package/@react-router/cloudflare
- react 19.2.4: https://www.npmjs.com/package/react
- tailwindcss 4.2.2: https://www.npmjs.com/package/tailwindcss
- vite 8.0.2 (latest) / 7.1.7 (template): https://www.npmjs.com/package/vite
- typescript 6.0.2 (latest) / 5.9.3 (template): https://www.npmjs.com/package/typescript
- vitest 4.1.1: https://www.npmjs.com/package/vitest
- @playwright/test 1.58.2: https://www.npmjs.com/package/@playwright/test
- @testing-library/react 16.3.2: https://www.npmjs.com/package/@testing-library/react
- zod 4.3.6: https://www.npmjs.com/package/zod
- yaml 2.8.3: https://www.npmjs.com/package/yaml
- wrangler 4.76.0: https://www.npmjs.com/package/wrangler

Official Cloudflare template (updated 2026-03-23):
- https://github.com/remix-run/react-router-templates/tree/main/cloudflare

React Router docs:
- https://reactrouter.com/start/framework/installation
- https://reactrouter.com/start/framework/routing

Tailwind CSS v4 installation:
- https://tailwindcss.com/docs/installation/using-vite
