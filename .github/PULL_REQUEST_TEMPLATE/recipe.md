## New Recipe: [Recipe Name]

### Recipe YAML

Add your recipe file to `data/recipes/` with an underscore-separated filename (e.g., `chocolate_cake.yml`).

Here's the full YAML structure — fill in your values:

```yaml
# Required fields
title: Your Recipe Name
byline: Your Name
location: City, State (or Country)

# Ingredient groups — each group starts with a header, followed by ingredients
components:
  -
    - Main        # Group header (e.g., "Doughnuts", "Sauce", "Filling")
    - 2 c all-purpose flour
    - 1 tsp salt
    # Add more ingredients...
  -
    - Topping     # Second group (remove if only one group)
    - 1/2 c sugar
    # Add more ingredients...

# Direction groups — each group starts with a header, followed by steps
# You can also include standalone steps (strings outside of arrays)
directions:
  -
    - Main        # Group header matching your component group
    - Preheat oven to 350 °F.
    - Mix dry ingredients in a bowl.
    # Add more steps...
  -
    - Topping     # Second group (remove if only one group)
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
pack:   # Leave blank unless adding to a themed pack
```

### Image

Place a `.jpg` image with the same filename as your recipe YAML in `public/recipes/` (e.g., `your_recipe_name.jpg`). The image should be a photo of the finished dish.

### Submission Checklist

- [ ] Recipe YAML file added to `data/recipes/`
- [ ] Matching image added to `public/recipes/`
- [ ] `npm run validate` passes locally
- [ ] Recipe tested (I've actually made this!)
