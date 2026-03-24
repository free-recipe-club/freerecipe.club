function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function render(title: string, content: string, options?: { description?: string }): Response {
  let descriptionTag = options?.description
    ? `\n  <meta name="description" content="${escapeHtml(options.description)}">`
    : ''
  let html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — freerecipe.club</title>${descriptionTag}
  <link rel="stylesheet" href="/styles/output.css">
</head>
<body class="bg-brand-cream text-gray-900 font-sans min-h-screen">
  <nav class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between print:hidden">
    <a href="/" class="text-xl font-bold text-brand-green hover:underline">freerecipe.club</a>
    <a href="/recipes" class="text-lg text-brand-green hover:underline">Recipes</a>
  </nav>
  ${content}
</body>
</html>`
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
