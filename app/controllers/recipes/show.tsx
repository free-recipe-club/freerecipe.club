import { render } from '../render.tsx'
import { loadRecipe, getRecipeFilename } from '../../data/recipes.ts'
import type { Recipe } from '../../data/recipe-schema.ts'

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function renderIngredients(components: string[][]): string {
  return components.map(group => {
    let name = group[0]
    let items = group.slice(1)
    return `<div class="mb-6">
      <h3 class="text-xl font-bold mb-2">${escapeHtml(name)}</h3>
      <ul class="space-y-2">
        ${items.map(item => `<li class="text-lg leading-relaxed">${escapeHtml(item)}</li>`).join('\n        ')}
      </ul>
    </div>`
  }).join('\n  ')
}

function renderDirections(directions: string[]): string {
  return directions.map((step, i) => `<li class="text-lg leading-relaxed">
      <label class="cursor-pointer">
        <input type="checkbox" class="peer sr-only">
        <span class="peer-checked:line-through peer-checked:text-gray-400">${escapeHtml(step)}</span>
      </label>
    </li>`).join('\n    ')
}

function renderRecipe(recipe: Recipe, slug: string): string {
  let flavorHtml = recipe.flavor
    ? `<p class="text-lg leading-relaxed text-gray-600 italic mb-4">${escapeHtml(recipe.flavor)}</p>`
    : ''
  let backgroundHtml = recipe.background
    ? `<p class="text-lg leading-relaxed text-gray-600 italic recipe-background-text mb-8">${escapeHtml(recipe.background)}</p>`
    : ''

  let linksHtml = recipe.links.length > 0
    ? `<footer class="text-sm text-gray-600">
    ${recipe.links.map(link => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="text-brand-green hover:underline">${escapeHtml(link.text)}</a>`).join(', ')}
  </footer>`
    : ''

  return `<main class="max-w-2xl mx-auto px-4 py-8">
  <header class="flex items-start gap-4 mb-8">
    <img src="/recipes/${encodeURIComponent(getRecipeFilename(slug))}.jpg" alt="${escapeHtml(recipe.title)}" width="80" height="80"
         class="w-20 h-20 rounded object-cover flex-shrink-0 recipe-image">
    <div>
      <h1 class="text-3xl font-bold text-brand-green">${escapeHtml(recipe.title)}</h1>
    </div>
  </header>

  <section class="mb-8">
    <h2 class="text-xl font-bold mb-4">Ingredients</h2>
    ${renderIngredients(recipe.components)}
  </section>

  <section class="mb-8">
    <h2 class="text-xl font-bold mb-4">Directions</h2>
    <p class="text-sm text-gray-500 mb-3">Tap a step to cross it off.</p>
    <ol class="list-decimal list-inside space-y-3">
      ${renderDirections(recipe.directions)}
    </ol>
  </section>

  <p class="text-sm text-gray-600 mb-8">${escapeHtml(recipe.byline)}, ${escapeHtml(recipe.location)}</p>

  ${flavorHtml}
  ${backgroundHtml}

  ${linksHtml}
</main>`
}

export function recipeShow(request: Request): Response {
  let url = new URL(request.url)
  let slug = url.pathname.split('/').pop() || ''
  let filename = getRecipeFilename(slug)

  try {
    let recipe = loadRecipe(filename)
    return render(recipe.title, renderRecipe(recipe, slug), {
      description: recipe.flavor || undefined,
    })
  } catch {
    let html = `<main class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">Recipe not found</h1>
    <p class="text-gray-600">We couldn't find that recipe. Browse <a href="/recipes" class="text-brand-green hover:underline">all recipes</a> to find something to cook.</p>
  </main>`
    return new Response(
      render('Recipe not found', html).body,
      {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }
    )
  }
}
