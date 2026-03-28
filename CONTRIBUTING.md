# Contributing to freerecipe.club

Welcome! We'd love your recipes (and code contributions too).

## How to Submit a Recipe

### Via Pull Request (Recommended)

If you're comfortable with Git and GitHub, here's the full walkthrough:

1. **Fork** the repo on GitHub (click the "Fork" button at the top right)
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/freerecipe.club.git
   cd freerecipe.club
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a branch:**
   ```bash
   git checkout -b add-my-recipe
   ```
5. **Add your recipe** YAML file to `data/recipes/` using underscores in the filename (e.g., `chocolate_cake.yml`)
6. **Add a matching image** (`.jpg`) to `public/recipes/` with the same filename (e.g., `chocolate_cake.jpg`)
7. **Validate** your recipe:
   ```bash
   npm run validate
   ```
8. **Commit and push** your changes:
   ```bash
   git add .
   git commit -m "Add chocolate cake recipe"
   git push origin add-my-recipe
   ```
9. **Open a pull request** — the recipe template will guide you through the rest

### Via GitHub Issue

Not comfortable with Git? No problem! Open a [Recipe Submission](../../issues/new?template=recipe_submission.md) issue and paste your recipe details. A maintainer will format it and create the PR for you.

## Recipe Format Reference

Recipes are YAML files in `data/recipes/`. Here's the full structure:

```yaml
# Required fields
title: Pumpkin Doughnut                 # Recipe name (max 100 characters)
byline: Michelle                        # Who made/submitted it
location: Michigan                      # Where the contributor is from

# Ingredient groups — each group starts with a header, followed by ingredients
components:
  -
    - Doughnuts                         # Group header
    - 2 c all-purpose flour             # Ingredient lines
    - 2 tsp pumpkin pie spice
    - 1 can (15 oz) pumpkin puree       # Use parenthetical format for compound quantities
  -
    - Topping                           # Second group (remove if only one group)
    - 3/4 c sugar

# Direction groups — each group starts with a header, followed by steps
# You can also include standalone steps as plain strings
directions:
  -
    - Doughnuts                         # Group header matching your component group
    - Preheat oven to 350 °F.
    - Mix dry ingredients in a bowl.
  -
    - Topping
    - Combine topping ingredients.
  - Serve warm or at room temperature.  # Standalone step (no group)

# Optional fields
background: The story behind this recipe — why it matters to you.
links:
  - text: Recipe Source
    url: https://example.com/original-recipe
  - text: Image Source
    url: https://example.com/image-source
flavor: A short tagline for the recipe.
pack:                                   # Leave blank unless adding to a themed pack
```

### Required Fields

| Field | Description |
|-------|-------------|
| `title` | Recipe name (max 100 characters) |
| `byline` | Who made or submitted it |
| `location` | Where the contributor is from |
| `components` | Ingredient groups (each group: header + ingredients) |
| `directions` | Step groups (each group: header + steps), or standalone steps |

### Optional Fields

| Field | Description |
|-------|-------------|
| `background` | The story behind the recipe |
| `links` | Source/credit links (array of `text` + `url`) |
| `flavor` | Short tagline |
| `pack` | Pack slug if part of a themed pack |

### Images

Place a `.jpg` image with the **same filename** as your recipe YAML in `public/recipes/`. Use underscores, not hyphens:

- Recipe: `data/recipes/chocolate_cake.yml`
- Image: `public/recipes/chocolate_cake.jpg`

## Code Contributions

Want to contribute code instead of (or in addition to) recipes? Great!

1. Fork and clone the repo (same as above)
2. Create a branch for your changes
3. Make your changes
4. Run checks:
   ```bash
   npm run typecheck    # TypeScript type checking
   npm run validate     # Recipe validation
   ```
5. Commit, push, and open a pull request

## Running Locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Questions?

Open an issue on GitHub.
