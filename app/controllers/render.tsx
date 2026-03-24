export function render(title: string, content: string): Response {
  let html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — freerecipe.club</title>
  <link rel="stylesheet" href="/styles/output.css">
</head>
<body class="bg-brand-cream text-gray-900 font-sans min-h-screen">
  ${content}
</body>
</html>`
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
