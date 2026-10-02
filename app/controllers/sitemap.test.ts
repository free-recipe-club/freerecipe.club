import { createAppRouter } from '../router.ts'
import { listRecipeSlugs } from '../data/recipes.ts'
import { loadPacks } from '../data/packs.ts'

let router = createAppRouter()

// Test sitemap
let req = new Request('http://localhost:3000/sitemap.xml')
let siteOrigin = process.env.SITE_ORIGIN || new URL('http://localhost:3000').origin
let res = await router.fetch(req)
let xml = await res.text()
let ct = res.headers.get('content-type')
let recipeSlug = listRecipeSlugs()[0]
let packSlug = loadPacks()[0].slug

let checks: [string, boolean][] = [
  ['sitemap 200', res.status === 200],
  ['content-type xml', ct?.includes('xml') ?? false],
  ['urlset element', xml.includes('urlset')],
  ['home url', xml.includes(`${siteOrigin}/</loc>`)],
  ['/recipes url', xml.includes('/recipes</loc>')],
  ['packs index url', xml.includes(`${siteOrigin}/packs</loc>`) ],
  ['first recipe url', xml.includes(`/recipes/${recipeSlug}</loc>`)],
  ['first pack url', xml.includes(`/packs/${packSlug}</loc>`)],
  ['sitemaps namespace', xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')],
]

for (let [name, pass] of checks) {
  console.log(pass ? `✓ ${name}` : `✗ ${name}`)
  if (!pass) process.exit(1)
}
console.log('ALL PASS')
