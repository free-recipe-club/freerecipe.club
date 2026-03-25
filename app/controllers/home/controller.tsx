import { render } from '../render.tsx'

export function home() {
  return render(
    'Home',
    `<main class="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 class="text-4xl font-bold mb-4" style="color:var(--theme-accent)">freerecipe.club</h1>
      <p class="text-xl mb-8" style="color:var(--theme-text-secondary)">Recipes without the ads.</p>
      <p style="color:var(--theme-text-secondary)">No tracking. No accounts. No dark patterns. Just recipes.</p>
      <p class="mt-12 text-sm" style="color:var(--theme-text-secondary)">
        Have a recipe to share? Email us at
        <a href="mailto:recipes@freerecipe.club" class="underline" style="color:var(--theme-accent)">recipes@freerecipe.club</a>
        — no GitHub account needed.
      </p>
    </main>`
  )
}
