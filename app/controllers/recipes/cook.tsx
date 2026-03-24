import { loadRecipe, getRecipeFilename } from '../../data/recipes.ts'
import type { Recipe } from '../../data/recipe-schema.ts'

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function extractIngredientName(ingredient: string): string {
  let stripped = ingredient.replace(
    /^[\d\s./]+(?:c|tsp|tbsp|oz|lb|lg|sm|med|cups?|cans?|pkg|pt|qt|gal|ml|g|kg|inch|cloves?|bunch|head|sticks?|pinch|dash|slices?)\b\s*/i,
    ''
  )
  if (stripped !== ingredient) return stripped.trim()
  return ingredient.replace(/^[\d\s./]+/, '').trim()
}

const COMMON_ADJECTIVES = new Set([
  'fresh', 'large', 'ground', 'unsalted', 'melted', 'small', 'medium',
  'chopped', 'diced', 'minced', 'sliced', 'dried', 'whole', 'warm',
  'cold', 'hot', 'room', 'softened', 'packed', 'sifted',
])

function matchIngredientsToStep(
  step: string,
  components: string[][]
): { group: string; ingredient: string }[] {
  let matches: { group: string; ingredient: string }[] = []
  let stepLower = step.toLowerCase()

  for (let group of components) {
    let groupName = group[0]
    let ingredients = group.slice(1)

    for (let ingredient of ingredients) {
      let name = extractIngredientName(ingredient).toLowerCase()

      // Pass 1: exact substring match
      if (stepLower.includes(name)) {
        matches.push({ group: groupName, ingredient })
        continue
      }

      // Also try without trailing 's' or with added 's'
      let nameSingular = name.endsWith('s') ? name.slice(0, -1) : null
      let namePlural = name + 's'
      if ((nameSingular && stepLower.includes(nameSingular)) || stepLower.includes(namePlural)) {
        matches.push({ group: groupName, ingredient })
        continue
      }

      // Pass 2: significant word matching
      let words = name.split(/\s+/).filter(
        w => w.length >= 4 && !COMMON_ADJECTIVES.has(w)
      )
      let found = words.some(word => {
        let re = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 's?\\b', 'i')
        return re.test(step)
      })
      if (found) {
        matches.push({ group: groupName, ingredient })
      }
    }
  }

  return matches
}

function renderCookingMode(recipe: Recipe, slug: string): Response {
  let total = recipe.directions.length

  let stepsHtml = recipe.directions.map((step, i) => {
    let matched = matchIngredientsToStep(step, recipe.components)
    let ingredientHtml = ''

    if (matched.length > 0) {
      let groups = new Map<string, string[]>()
      for (let m of matched) {
        let list = groups.get(m.group)
        if (!list) {
          list = []
          groups.set(m.group, list)
        }
        list.push(m.ingredient)
      }

      let groupsHtml = Array.from(groups.entries())
        .map(([groupName, items]) =>
          `<div class="cook-ingredient-group">
            <div class="cook-ingredient-heading">${escapeHtml(groupName)}</div>
            <ul class="cook-ingredient-list">
              ${items.map(item => `<li>${escapeHtml(item)}</li>`).join('\n              ')}
            </ul>
          </div>`
        )
        .join('\n        ')

      ingredientHtml = `\n      <div class="cook-ingredients">\n        ${groupsHtml}\n      </div>`
    }

    return `    <div class="cook-step" data-step="${i + 1}">${ingredientHtml}
      <div class="cook-step-text" tabindex="-1">${escapeHtml(step)}</div>
    </div>`
  }).join('\n')

  let html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(recipe.title)} — Cooking — freerecipe.club</title>
  <link rel="stylesheet" href="/styles/output.css">
</head>
<body class="cook-mode" style="background:var(--cook-bg);color:var(--cook-text);margin:0;min-height:100vh;min-height:100dvh">
  <div class="cook-top-bar">
    <a href="/recipes/${encodeURIComponent(slug)}" aria-label="Exit cooking mode" class="cook-exit">✕</a>
    <span class="cook-step-counter" id="cook-step-counter">Step 1 of ${total}</span>
  </div>
  <div role="progressbar" aria-valuenow="1" aria-valuemin="1" aria-valuemax="${total}" aria-label="Cooking progress" class="cook-progress">
    <div class="cook-progress-fill" id="cook-progress-fill" style="width:${(1 / total * 100).toFixed(1)}%"></div>
  </div>
  <div id="cook-steps" aria-live="polite">
${stepsHtml}
  </div>
  <div class="cook-nav" id="cook-nav">
    <button type="button" id="cook-prev" class="cook-btn" hidden>Previous</button>
    <button type="button" id="cook-next" class="cook-btn">${total === 1 ? 'Finish Cooking' : 'Next'}</button>
  </div>
  <script src="/cook.js" defer></script>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export function recipeCook(request: Request): Response {
  let url = new URL(request.url)
  let segments = url.pathname.split('/')
  // /recipes/:slug/cook → segments = ['', 'recipes', ':slug', 'cook']
  let slug = segments[2] || ''
  let filename = getRecipeFilename(slug)

  try {
    let recipe = loadRecipe(filename)
    return renderCookingMode(recipe, slug)
  } catch {
    let html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Recipe not found — freerecipe.club</title>
  <link rel="stylesheet" href="/styles/output.css">
</head>
<body class="bg-brand-cream text-gray-900 font-sans min-h-screen">
  <nav class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
    <a href="/" class="text-xl font-bold text-brand-green hover:underline">freerecipe.club</a>
    <a href="/recipes" class="text-lg text-brand-green hover:underline">Recipes</a>
  </nav>
  <main class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">Recipe not found</h1>
    <p class="text-gray-600">We couldn't find that recipe. Browse <a href="/recipes" class="text-brand-green hover:underline">all recipes</a> to find something to cook.</p>
  </main>
</body>
</html>`
    return new Response(html, {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}
