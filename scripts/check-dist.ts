import fs from 'node:fs'
import path from 'node:path'
import { listStaticPagePaths } from '../app/data/pages.ts'

const DIST = path.resolve(process.cwd(), 'dist')
const errors: string[] = []
const siteOrigin = process.env.SITE_ORIGIN || 'https://freerecipe.club'

if (!fs.existsSync(DIST)) {
  console.error('✗ dist/ is missing; run npm run build first')
  process.exit(1)
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(fullPath) : [fullPath]
  })
}

const htmlFiles = walk(DIST).filter(file => file.endsWith('.html'))
const requiredFiles = ['404.html', 'robots.txt']
for (const required of requiredFiles) {
  if (!fs.existsSync(path.join(DIST, required))) errors.push(`missing ${required}`)
}

function htmlFileForUrl(urlPath: string): string | null {
  let normalized = decodeURIComponent(urlPath.split(/[?#]/, 1)[0] || '/')
  if (!normalized.startsWith('/')) normalized = `/${normalized}`
  const candidate = path.resolve(DIST, `.${normalized}`)
  if (candidate !== DIST && !candidate.startsWith(DIST + path.sep)) return null
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate
  if (fs.existsSync(path.join(candidate, 'index.html'))) return path.join(candidate, 'index.html')
  if (normalized.endsWith('/')) return null
  const withIndex = path.join(DIST, normalized, 'index.html')
  if (fs.existsSync(withIndex)) return withIndex
  return null
}

function checkReference(sourceFile: string, value: string, attribute: string) {
  if (!value || value.startsWith('#') || value.startsWith('data:') || value.startsWith('mailto:') || value.startsWith('tel:')) return
  let url: URL
  try {
    url = new URL(value, siteOrigin)
  } catch {
    errors.push(`${path.relative(DIST, sourceFile)}: invalid ${attribute} "${value}"`)
    return
  }
  if (url.origin !== siteOrigin && url.origin !== 'http://localhost:3000') return
  const pathname = decodeURIComponent(url.pathname)
  const recipeImageMatch = pathname.match(/^\/recipes\/([^/]+)\.(jpg|jpeg|png|webp)$/i)
  const normalizedPath = recipeImageMatch
    ? `/recipes/${path.basename(recipeImageMatch[1]).replace(/-/g, '_')}.${recipeImageMatch[2]}`
    : pathname
  const target = /\.(?:xml|txt|jpg|jpeg|png|svg|js|css|ico|webp)$/i.test(normalizedPath)
    ? path.resolve(DIST, `.${normalizedPath}`)
    : htmlFileForUrl(normalizedPath)
  if (!target || target !== DIST && !target.startsWith(DIST + path.sep) || !fs.existsSync(target)) {
    errors.push(`${path.relative(DIST, sourceFile)}: unresolved ${attribute} "${value}"`)
  }
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8')
  for (const match of html.matchAll(/\b(href|src)\s*=\s*["']([^"']+)["']/gi)) {
    checkReference(file, match[2], match[1].toLowerCase())
  }
}

const htmlPaths = new Set(htmlFiles.map(file => path.relative(DIST, file).replace(/\\/g, '/')))
const deploymentFiles = new Set(['/404.html', '/robots.txt'])
const htmlRoutePaths = listStaticPagePaths().filter(pagePath =>
  !deploymentFiles.has(pagePath) && (pagePath === '/' || pagePath === '/404.html' || !path.posix.extname(pagePath))
)
for (const pagePath of htmlRoutePaths) {
  const expected = pagePath === '/404.html'
    ? '404.html'
    : pagePath === '/'
      ? 'index.html'
      : `${pagePath.replace(/^\//, '').replace(/\/$/, '')}/index.html`
  if (!htmlPaths.has(expected)) errors.push(`missing generated page ${pagePath}`)
}

const sitemapPath = path.join(DIST, 'sitemap.xml')
if (fs.existsSync(sitemapPath)) {
  const xml = fs.readFileSync(sitemapPath, 'utf8')
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    checkReference(sitemapPath, match[1], 'sitemap URL')
  }
}

if (errors.length) {
  for (const error of errors) console.error(`✗ ${error}`)
  console.error(`\n${errors.length} built-site check(s) failed`)
  process.exit(1)
}

console.log(`✓ Built-site checks passed (${htmlFiles.length} HTML pages checked)`)
