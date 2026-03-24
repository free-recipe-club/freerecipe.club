<!-- GSD:project-start source:PROJECT.md -->
## Project

**freerecipe.club**

A community-driven recipe website that's the antithesis of ad-bloated recipe sites. No accounts, no tracking, no dark patterns — just recipes. Contributors submit via GitHub PRs (or email/letters converted to issues), recipes get community annotations (inline substitutions and tips), and a full cooking mode guides you step by step. Seasonal themed packs transform the site's look alongside curated recipe collections. Open source, Hacktoberfest-ready, built transparently in a public repo.

**Core Value:** Someone finds a recipe and actually cooks from it.

### Constraints

- **Framework**: React Router v7 (framework mode) — stable since Nov 2024, successor to Remix
- **Hosting**: Must be free and tied to GitHub repo — no paid hosting services
- **Privacy**: Zero tracking, zero cookies beyond technical necessity, no third-party scripts
- **Data**: Recipes stored as flat files in the repo — no database
- **Accessibility**: Must work on phones in a kitchen (wet hands, small screen, distractions)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages & Runtime
| Language | Version | Usage |
|----------|---------|-------|
| TypeScript | ^4.8.3 | Primary language for components, interfaces, config |
| JavaScript | ES2022 | Astro config files (.mjs, .cjs) |
| YAML | — | Recipe data format |
## Framework
| Framework | Version | Role |
|-----------|---------|------|
| Astro | ^1.1.2 | Static site generator — core framework |
| React | ^18.2.0 | UI components (via `@astrojs/react` integration) |
| Tailwind CSS | via `@astrojs/tailwind` ^1.0.0 | Utility-first CSS framework |
## Dependencies
### Production (bundled as devDependencies)
| Package | Version | Purpose |
|---------|---------|---------|
| `astro` | ^1.1.2 | Core SSG framework |
| `@astrojs/react` | ^1.1.1 | React integration for Astro |
| `@astrojs/tailwind` | ^1.0.0 | Tailwind CSS integration |
| `react` | ^18.2.0 | Component library |
| `react-dom` | ^18.2.0 | React DOM renderer |
| `typescript` | ^4.8.3 | Type checking |
| `yaml` | ^2.1.1 | YAML parser for recipe files |
### Dev-only
| Package | Version | Purpose |
|---------|---------|---------|
| `@types/jest` | ^29.0.0 | Jest type definitions (no tests exist yet) |
| `@types/node` | ^18.7.16 | Node.js type definitions |
| `@types/react` | ^18.0.18 | React type definitions |
| `@types/react-dom` | ^18.0.6 | ReactDOM type definitions |
## Build & Scripts
| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `astro dev` | Development server |
| `start` | `astro dev` | Alias for dev |
| `build` | `astro check && tsc --noEmit && astro build` | Type-check + build |
| `preview` | `astro preview` | Preview production build |
## Configuration
- **Astro config:** `astro.config.mjs` — enables Tailwind and React integrations
- **TypeScript:** `tsconfig.json` — extends `astro/tsconfigs/base`, JSX set to `react-jsx`
- **Tailwind:** `tailwind.config.cjs` — content glob for all src files, custom `wiggle` keyframe animation
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Code Style
- **TypeScript** used throughout with strict-ish config (extends Astro base)
- **React JSX** configured via `"jsx": "react-jsx"` in tsconfig
- **Semicolons:** Not used consistently — trailing commas in interfaces, no semicolons in some places
- **Quotes:** Single quotes in TypeScript, double quotes in Astro templates
- **No linter/formatter configured** (no ESLint, Prettier, or similar in package.json)
## Component Patterns
- **React class components:** `RecipeCard` uses `Component` base class (older pattern vs. functional components)
- **Astro frontmatter:** TypeScript logic in `---` fenced blocks at top of `.astro` files
- **Props typing:** Astro uses `export interface Props`, React uses explicit `type` declarations
## Data Handling
- **File-based data:** Recipes stored as individual YAML files, read at build time with `fs.readdirSync()`
- **No content collections:** Uses raw filesystem reads instead of Astro's content collection API
- **Type casting:** YAML parse results cast with `as Recipe` (no runtime validation)
## Styling
- **Tailwind CSS:** Used in templates for utility classes (e.g., `class="h-96"`)
- **Scoped styles:** Astro `<style>` blocks with CSS custom properties (`:root` variables)
- **Global styles:** Base typography and colors defined in `Layout.astro`
- **CSS custom properties:** Font sizes use `clamp()` for responsive scaling
- **Animation:** Custom `wiggle` keyframe defined in Tailwind config, applied with `animate-[wiggle_1s_ease-in-out_infinite]`
## Error Handling
- **None implemented.** No try/catch around file reads, YAML parsing, or component rendering. Build would fail on malformed YAML.
## TypeScript Interfaces
- **`Recipe`:** 8 fields (title, byline, location, components, directions, background, links, flavor)
- **`Link`:** 2 fields (text, url)
- **Components field:** `string[][]` — nested arrays for grouped ingredients (e.g., "Doughnuts", "Topping")
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern
## Data Flow
```
```
## Layers
| Layer | Technology | Files |
|-------|-----------|-------|
| Pages | Astro (.astro) | `src/pages/index.astro`, `src/pages/recipes.astro` |
| Layout | Astro (.astro) | `src/layouts/Layout.astro` |
| Components | React (.tsx) | `src/components/RecipeCard.tsx` |
| Data | YAML files | `src/recipes/*.yml` |
| Types | TypeScript interfaces | `src/interfaces/Recipe.ts`, `src/interfaces/Link.ts` |
| Static Assets | Images, SVG | `public/` |
## Entry Points
- `src/pages/index.astro` — Landing page ("Something exciting is cooking")
- `src/pages/recipes.astro` — Lists all recipes by scanning `src/recipes/` directory
## Key Abstractions
- **`Recipe` interface** (`src/interfaces/Recipe.ts`): Typed recipe data with title, byline, location, components, directions, background, links, flavor
- **`Link` interface** (`src/interfaces/Link.ts`): Simple text + URL pair used for recipe source attribution
- **`RecipeCard` component** (`src/components/RecipeCard.tsx`): React class component that renders a recipe (currently only renders title)
- **`Layout` component** (`src/layouts/Layout.astro`): Base HTML wrapper with head, meta, global styles
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
