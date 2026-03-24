import { render } from '../render.tsx'

export function home() {
  return render(
    'Home',
    `<main class="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 class="text-4xl font-bold text-brand-green mb-4">freerecipe.club</h1>
      <p class="text-xl text-gray-600 mb-8">Recipes without the ads.</p>
      <p class="text-gray-500">No tracking. No accounts. No dark patterns. Just recipes.</p>
    </main>`
  )
}
