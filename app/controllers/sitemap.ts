import { listRecipeSlugs } from '../data/recipes.ts'

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

export function sitemap(context: { url: URL }): Response {
  let slugs = listRecipeSlugs()
  let origin = context.url.origin
  let urls = [
    `  <url><loc>${escapeXml(origin)}/</loc></url>`,
    `  <url><loc>${escapeXml(origin)}/recipes</loc></url>`,
    ...slugs.map(s => `  <url><loc>${escapeXml(origin)}/recipes/${escapeXml(s)}</loc></url>`),
  ]
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
