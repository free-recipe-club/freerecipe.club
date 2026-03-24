import { render } from '../render.tsx'
import { loadRecipes, listRecipeSlugs } from '../../data/recipes.ts'

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function recipesIndex() {
  let recipes = loadRecipes()
  let slugs = listRecipeSlugs()

  let content: string
  if (recipes.length === 0) {
    content = `<main class="max-w-2xl mx-auto px-4 py-8">
  <div class="text-center py-16">
    <h2 class="text-xl font-bold mb-2">No recipes yet</h2>
    <p class="text-gray-600">Recipes are coming soon. Check back shortly.</p>
  </div>
</main>`
  } else {
    let items = recipes.map((recipe, i) => {
      let slug = slugs[i]
      let flavorHtml = recipe.flavor
        ? `\n      <p class="text-sm text-gray-600 mt-1">${escapeHtml(recipe.flavor)}</p>`
        : ''
      return `<li class="py-4">
    <a href="/recipes/${encodeURIComponent(slug)}" class="block group">
      <span class="text-xl font-bold group-hover:underline" style="color:var(--theme-accent)">${escapeHtml(recipe.title)}</span>
      <p class="text-sm text-gray-600">${escapeHtml(recipe.byline)}, ${escapeHtml(recipe.location)}</p>${flavorHtml}
    </a>
  </li>`
    }).join('\n  ')

    content = `<main class="max-w-2xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Recipes</h1>
  <ul class="divide-y" style="border-color:var(--theme-divider)">
  ${items}
  </ul>
</main>`
  }

  return render('Recipes', content)
}
