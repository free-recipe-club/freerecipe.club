# Concerns

## Outdated Dependencies

**Severity: High**

All dependencies are significantly outdated (circa mid-2022):

| Package | Current | Latest |
|---------|---------|--------|
| `astro` | ^1.1.2 | 4.x+ |
| `@astrojs/react` | ^1.1.1 | 3.x+ |
| `@astrojs/tailwind` | ^1.0.0 | 5.x+ (or replaced by Vite plugin) |
| `react` | ^18.2.0 | 19.x |
| `typescript` | ^4.8.3 | 5.x+ |
| `tailwindcss` | (implicit ~3.x) | 4.x |

Astro v1 → v4 involves significant breaking changes (content collections API, middleware, View Transitions, etc.).

## Incomplete RecipeCard

**Severity: Medium**

`RecipeCard.tsx` only renders `<h1>{recipe.title}</h1>`. The Recipe interface has 8 fields (byline, location, components, directions, background, links, flavor) — none are displayed. The card component is essentially a stub.

## No Input Validation

**Severity: Medium**

- YAML files are cast directly to `Recipe` with `as Recipe` — no runtime validation
- Malformed YAML or missing fields would cause silent rendering bugs or build failures
- No schema validation for recipe data

## Class Component Pattern

**Severity: Low**

`RecipeCard` uses React class component (`extends Component`) instead of functional components with hooks. This is an older pattern that's harder to extend.

## File System Data Loading

**Severity: Low**

`recipes.astro` uses `fs.readdirSync()` directly instead of Astro's Content Collections API (available since Astro v2). Content Collections provide:
- Built-in schema validation (via Zod)
- Type-safe data access
- Better error messages

## No Error Handling

**Severity: Low**

No try/catch around `fs.readdirSync()` or `yaml.parse()`. If the recipes directory is missing or a YAML file is malformed, the build fails with an unhelpful error.

## Duplicate Recipe File

**Severity: Low**

Both `pumpkin_doughnut.yml` and `pumpkin_doughnut_copy.yml` exist (along with matching images), suggesting a test/copy that should be cleaned up.

## Missing Deployment Configuration

**Severity: Info**

No deployment config found (no Vercel, Netlify, GitHub Actions, or similar). The site is presumably deployed manually or via an external pipeline not tracked in the repo.
