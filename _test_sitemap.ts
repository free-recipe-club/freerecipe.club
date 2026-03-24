import { createAppRouter } from './app/router.ts'

let router = createAppRouter()

// Test sitemap
let req = new Request('http://localhost:3000/sitemap.xml')
let res = await router.fetch(req)
let xml = await res.text()
let ct = res.headers.get('content-type')

let checks: [string, boolean][] = [
  ['sitemap 200', res.status === 200],
  ['content-type xml', ct?.includes('xml') ?? false],
  ['urlset element', xml.includes('urlset')],
  ['home url', xml.includes('http://localhost:3000/')],
  ['/recipes url', xml.includes('/recipes</loc>')],
  ['pumpkin-doughnut url', xml.includes('/recipes/pumpkin-doughnut')],
  ['sitemaps namespace', xml.includes('sitemaps.org')],
]

for (let [name, pass] of checks) {
  console.log(pass ? `✓ ${name}` : `✗ ${name}`)
  if (!pass) process.exit(1)
}
console.log('ALL PASS')
