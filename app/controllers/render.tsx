import { getActiveThemeClass } from '../data/packs.ts'

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function render(title: string, content: string, options?: { description?: string; themeClass?: string }): Response {
  let descriptionTag = options?.description
    ? `\n  <meta name="description" content="${escapeHtml(options.description)}">`
    : ''
  let themeClass = options?.themeClass || getActiveThemeClass()
  let html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — freerecipe.club</title>${descriptionTag}
  <link rel="stylesheet" href="/styles/output.css">
</head>
<body class="${themeClass} min-h-screen">
  <nav class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between print:hidden" style="background:var(--theme-nav-bg)">
    <a href="/" class="text-xl font-bold hover:underline" style="color:var(--theme-accent)">freerecipe.club</a>
    <div class="flex items-center gap-4">
      <a href="/recipes" class="text-lg hover:underline" style="color:var(--theme-accent)">Recipes</a>
      <a href="/packs" class="text-lg hover:underline" style="color:var(--theme-accent)">Packs</a>
    </div>
  </nav>
  ${content}
</body>
</html>`
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
