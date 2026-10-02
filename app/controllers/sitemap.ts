import { listSitemapPaths } from '../data/pages.ts'

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

export function sitemap(context: { url: URL }): Response {
  let origin = process.env.SITE_ORIGIN || context.url.origin
  let urls = listSitemapPaths().map(path => `  <url><loc>${escapeXml(origin)}${escapeXml(path)}</loc></url>`)
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
