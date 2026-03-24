import { render } from '../render.tsx'
import { loadRecipes, listRecipeSlugs } from '../../data/recipes.ts'
import { loadPack } from '../../data/packs.ts'

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
      let badgeHtml = ''
      if (recipe.pack) {
        try {
          let pack = loadPack(recipe.pack)
          badgeHtml = `<span class="inline-flex items-center gap-1 px-2 py-1 text-sm font-bold rounded-full flex-shrink-0" style="background:var(--theme-badge-bg);color:var(--theme-badge-text)"><span aria-hidden="true">${pack.icon}</span> ${escapeHtml(pack.name)}</span>`
        } catch {}
      }
      return `<li class="py-4">
    <a href="/recipes/${encodeURIComponent(slug)}" class="flex items-start justify-between group">
      <div>
        <span class="text-xl font-bold group-hover:underline" style="color:var(--theme-accent)">${escapeHtml(recipe.title)}</span>
        <p class="text-sm text-gray-600">${escapeHtml(recipe.byline)}, ${escapeHtml(recipe.location)}</p>${flavorHtml}
      </div>
      ${badgeHtml}
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
