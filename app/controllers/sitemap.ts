import { listRecipeSlugs } from '../data/recipes.ts'

export function sitemap(request: Request): Response {
  let slugs = listRecipeSlugs()
  let origin = new URL(request.url).origin
  let urls = [
    `  <url><loc>${origin}/</loc></url>`,
    `  <url><loc>${origin}/recipes</loc></url>`,
    ...slugs.map(s => `  <url><loc>${origin}/recipes/${s}</loc></url>`),
  ]
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
