# Quick Task 260327-qd9: Summary

## Task
Replace autumn-harvest pack with botanical theme, 5 placeholder recipes, add sigil field to pack

## Changes Made

### Pack Schema (`app/data/pack-schema.ts`)
- Added `sigil` field (string, defaults to empty) for pack emblem/logo mark

### New Pack: Wildflower (`data/packs/wildflower.yml`)
- Botanical green palette (#2d6a4f accent, #f6faf6 bg)
- Icon: 🌿, Sigil: 🌸 (placeholder)
- Theme class: `theme-wildflower`

### Removed
- `data/packs/autumn-harvest.yml`
- `data/recipes/pumpkin_doughnut.yml`
- `public/recipes/pumpkin_doughnut.jpg`

### 5 New Placeholder Recipes
1. **Basil Strawberry Salad** — sweet/savory garden salad
2. **Chamomile Shortbread** — teatime cookies with chamomile
3. **Garden Herb Pasta** — simple herb pasta
4. **Honey Lavender Lemonade** — floral citrus drink
5. **Rosemary Focaccia** — herb bread

All assigned to `wildflower` pack with placeholder images.

### CSS (`app/styles/input.css`)
- Replaced `.theme-autumn-harvest` with `.theme-wildflower`
- Updated all custom properties to botanical green palette
- Updated dark mode make-mode overrides

### Tests Updated
- `recipes/index.test.ts` — references basil-strawberry-salad
- `recipes/show.test.ts` — references basil-strawberry-salad
- `sitemap.test.ts` — references basil-strawberry-salad
- `print.test.ts` — references .theme-wildflower

## Commit
4d3bfa0
