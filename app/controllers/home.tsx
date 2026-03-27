import { render } from './render.tsx'

export async function home() {
  return render(
    'Home',
    <main class="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 class="text-4xl font-bold mb-4" style="color:var(--theme-accent)">freerecipe.club</h1>
      <p class="text-xl mb-8" style="color:var(--theme-text-secondary)">Recipes without the ads.</p>
      <p style="color:var(--theme-text-secondary)">No tracking. No accounts. No dark patterns. Just recipes.</p>
    </main>
  )
}
