import { render } from './render.tsx'

export function notFound(): Response {
  let html = `<main class="max-w-2xl mx-auto px-4 py-16 text-center">
    <h1 class="text-3xl font-bold mb-4">Page not found</h1>
    <p style="color:var(--theme-text-secondary)">The page you're looking for doesn't exist. Browse <a href="/recipes" class="hover:underline" style="color:var(--theme-accent)">all recipes</a> to find something to cook.</p>
  </main>`
  return new Response(render('Page not found', html).body, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
