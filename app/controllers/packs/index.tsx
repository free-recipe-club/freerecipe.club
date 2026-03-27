import { render } from '../render.tsx'
import { loadPacks, loadRecipesByPack } from '../../data/packs.ts'

export async function packsIndex() {
  let packs = loadPacks()

  if (packs.length === 0) {
    return render(
      'Themed Packs',
      <main class="max-w-2xl mx-auto px-4 py-8">
        <div class="text-center py-16">
          <h2 class="text-xl font-bold mb-2">Packs coming soon</h2>
          <p style="color:var(--theme-text-secondary)">Themed recipe collections are on the way. Check back shortly.</p>
        </div>
      </main>
    )
  }

  return render(
    'Themed Packs',
    <main class="max-w-2xl mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-2" style="font-family:var(--theme-heading-font)">Themed Packs</h1>
      <p class="mb-8 leading-relaxed" style="color:var(--theme-text-secondary)">Curated collections that transform the site.</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {packs.map(pack => {
          let recipeCount = loadRecipesByPack(pack.slug).length
          let countText = recipeCount === 1 ? '1 recipe' : `${recipeCount} recipes`
          return (
            <a
              href={`/packs/${encodeURIComponent(pack.slug)}`}
              class="block rounded-lg p-4 transition-colors"
              style={`background:var(--theme-surface);border:1px solid var(--theme-border);border-top:4px solid ${pack.colors.accent}`}
              {...{ onmouseover: "this.style.background='var(--theme-surface-hover)';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'", onmouseout: "this.style.background='var(--theme-surface)';this.style.boxShadow='none'" } as Record<string, string>}
            >
              <div class="text-3xl mb-2">{pack.icon}</div>
              <h2 class="text-2xl font-bold mb-1" style="font-family:var(--theme-heading-font);color:var(--theme-text)">{pack.name}</h2>
              <p class="text-sm font-bold" style="color:var(--theme-text-secondary)">{countText}</p>
            </a>
          )
        })}
      </div>
    </main>
  )
}
