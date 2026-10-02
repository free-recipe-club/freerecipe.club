# Structure

## Directory Layout

```
freerecipe.club/
├── astro.config.mjs          # Astro configuration (React + Tailwind integrations)
├── tailwind.config.cjs        # Tailwind CSS config with custom wiggle keyframe
├── tsconfig.json              # TypeScript config extending Astro base
├── package.json               # Dependencies and scripts
├── README.md                  # Project overview + contribution guide
├── LICENSE                    # License file
├── public/                    # Static assets (copied to build output)
│   ├── frying_pan.svg         # Site icon/logo
│   └── recipes/               # Recipe images
│       ├── pumpkin_doughnut.jpg
│       └── pumpkin_doughnut_copy.jpg
├── src/
│   ├── env.d.ts               # Astro client type reference
│   ├── components/            # React UI components
│   │   └── RecipeCard.tsx     # Recipe display card
│   ├── interfaces/            # TypeScript type definitions
│   │   ├── Recipe.ts          # Recipe data shape
│   │   └── Link.ts            # Link data shape
│   ├── layouts/               # Astro page layouts
│   │   └── Layout.astro       # Base HTML layout
│   ├── pages/                 # Route pages (file-based routing)
│   │   ├── index.astro        # Home/landing page
│   │   └── recipes.astro      # Recipe listing page
│   └── recipes/               # Recipe data (YAML)
│       ├── pumpkin_doughnut.yml
│       └── pumpkin_doughnut_copy.yml
```

## Key Locations

| Concern | Path |
|---------|------|
| Add a new recipe | `src/recipes/<name>.yml` + `public/recipes/<name>.jpg` |
| Add a new page | `src/pages/<name>.astro` |
| Add a component | `src/components/<Name>.tsx` |
| Add a type | `src/interfaces/<Name>.ts` |
| Global styles | `src/layouts/Layout.astro` (inline `<style>`) |
| Static assets | `public/` |

## Naming Conventions

- **Recipe files:** snake_case (`pumpkin_doughnut.yml`)
- **Image files:** snake_case, matching recipe name (`pumpkin_doughnut.jpg`)
- **Components:** PascalCase (`RecipeCard.tsx`)
- **Interfaces:** PascalCase (`Recipe.ts`)
- **Pages:** lowercase (`recipes.astro`)
- **Config files:** lowercase with extensions indicating module type (`.mjs` for ESM, `.cjs` for CommonJS)
