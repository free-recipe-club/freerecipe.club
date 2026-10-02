# Conventions

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
