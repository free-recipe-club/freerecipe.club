import { render } from './render.tsx'
import { getActivePack, loadPack } from '../data/packs.ts'

export async function home() {
  let pack = loadPack(getActivePack())
  return render(
    'Home',
    <main id="main-content" class="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 class="text-4xl font-bold mb-4" style="color:var(--theme-accent)">freerecipe.club</h1>
      <p class="text-xl mb-8" style="color:var(--theme-text-secondary)">Recipes without the ads.</p>
      <p style="color:var(--theme-text-secondary)">No tracking. No accounts. No dark patterns. Just recipes.</p>
      <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <a href="/recipes" class="inline-block rounded-lg px-6 py-3 font-bold" style="background:var(--theme-accent);color:var(--theme-accent-text)">Browse recipes</a>
        <a href={`/packs/${encodeURIComponent(pack.slug)}`} class="inline-block rounded-lg px-6 py-3 font-bold" style="background:var(--theme-surface);color:var(--theme-accent);border:1px solid var(--theme-border)">Explore {pack.name}</a>
      </div>
      <section class="mt-12 rounded-lg p-6 text-left" style="background:var(--theme-surface);border:1px solid var(--theme-border)">
        <h2 class="text-xl font-bold mb-2" style="color:var(--theme-accent)">Help build the spooky pack</h2>
        <p class="leading-relaxed" style="color:var(--theme-text-secondary)">We're collecting original spooky-season recipes through October. Browse the <a class="underline font-bold" href="/packs/spooky" style="color:var(--theme-accent)">pack in progress</a>, then contribute a recipe by pull request or open an issue if you'd like help formatting it.</p>
      </section>
    </main>,
    { canonicalUrl: 'https://freerecipe.club/' }
  )
}
