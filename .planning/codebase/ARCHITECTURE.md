# Architecture

## Pattern

**Static Site Generation (SSG)** — Astro generates static HTML at build time. No server runtime, no client-side routing, no API layer.

## Data Flow

```
src/recipes/*.yml  →  fs.readdirSync + yaml.parse  →  Recipe[]  →  Astro pages  →  Static HTML
public/recipes/*.jpg  →  copied to build output as-is
```

1. **Build time:** `recipes.astro` reads all `.yml` files from `src/recipes/` using Node.js `fs` module
2. **Parse:** Each YAML file is parsed into a `Recipe` object via the `yaml` package
3. **Render:** Recipe array is passed to `RecipeCard` React components
4. **Output:** Astro generates static HTML pages

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
