# Stack

## Languages & Runtime

| Language | Version | Usage |
|----------|---------|-------|
| TypeScript | ^4.8.3 | Primary language for components, interfaces, config |
| JavaScript | ES2022 | Astro config files (.mjs, .cjs) |
| YAML | — | Recipe data format |

**Runtime:** Node.js (required by Astro)

## Framework

| Framework | Version | Role |
|-----------|---------|------|
| Astro | ^1.1.2 | Static site generator — core framework |
| React | ^18.2.0 | UI components (via `@astrojs/react` integration) |
| Tailwind CSS | via `@astrojs/tailwind` ^1.0.0 | Utility-first CSS framework |

**Astro version note:** v1.x is significantly outdated (current is v4+). This is a very early version of Astro.

## Dependencies

### Production (bundled as devDependencies)

All dependencies are in `devDependencies` — standard for Astro static sites since everything is build-time:

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
