import fs from 'node:fs'
import path from 'node:path'
import { home } from '../app/controllers/home.tsx'
import { recipesIndex } from '../app/controllers/recipes/index.tsx'
import { recipeShow } from '../app/controllers/recipes/show.tsx'
import { recipeMake } from '../app/controllers/recipes/make.tsx'
import { packsIndex } from '../app/controllers/packs/index.tsx'
import { packShow } from '../app/controllers/packs/show.tsx'
import { sitemap } from '../app/controllers/sitemap.ts'
import { listStaticPagePaths } from '../app/data/pages.ts'
import { notFound } from '../app/controllers/not-found.tsx'

const DIST = path.join(process.cwd(), 'dist')
const PUBLIC = path.join(process.cwd(), 'public')
const ORIGIN = process.env.SITE_ORIGIN || 'https://freerecipe.club'

function fakeContext(pathname: string, params: Record<string, string> = {}): { params: Record<string, string>; url: URL } {
  return { params, url: new URL(`${ORIGIN}${pathname}`) }
}

async function writePage(filePath: string, response: Response) {
  let html = await response.text()
  let dir = path.dirname(filePath)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, html, 'utf-8')
}

function copyDir(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true })
  for (let entry of fs.readdirSync(src, { withFileTypes: true })) {
    let srcPath = path.join(src, entry.name)
    let destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

async function build() {
  // Clean dist
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true })
  }
  fs.mkdirSync(DIST, { recursive: true })

  let pages = 0

  // Render the shared page inventory so newly added pages cannot be omitted from the build.
  for (let pagePath of listStaticPagePaths()) {
    let match = pagePath.match(/^\/recipes\/([^/]+)\/make(?:\/(\d+))?$/)
    let response: Response
    let outputPath: string

    if (pagePath === '/') {
      response = await home()
      outputPath = path.join(DIST, 'index.html')
    } else if (pagePath === '/recipes') {
      response = await recipesIndex()
      outputPath = path.join(DIST, 'recipes', 'index.html')
    } else if (pagePath === '/packs') {
      response = await packsIndex()
      outputPath = path.join(DIST, 'packs', 'index.html')
    } else if (pagePath === '/sitemap.xml') {
      response = sitemap(fakeContext(pagePath))
      outputPath = path.join(DIST, 'sitemap.xml')
    } else if (pagePath === '/404.html') {
      response = await notFound()
      outputPath = path.join(DIST, '404.html')
    } else if (pagePath === '/robots.txt') {
      // These deployment files are copied from public/ after rendering pages.
      continue
    } else if (match) {
      let slug = decodeURIComponent(match[1])
      let step = match[2] || '1'
      response = await recipeMake(fakeContext(pagePath, { slug, step }))
      outputPath = path.join(DIST, 'recipes', slug, 'make', ...(step === '1' ? [] : [step]), 'index.html')
    } else if (pagePath.startsWith('/recipes/')) {
      let slug = decodeURIComponent(pagePath.slice('/recipes/'.length))
      response = await recipeShow(fakeContext(pagePath, { slug }))
      outputPath = path.join(DIST, 'recipes', slug, 'index.html')
    } else if (pagePath.startsWith('/packs/')) {
      let slug = decodeURIComponent(pagePath.slice('/packs/'.length))
      response = await packShow(fakeContext(pagePath, { slug }))
      outputPath = path.join(DIST, 'packs', slug, 'index.html')
    } else {
      throw new Error(`No static renderer for ${pagePath}`)
    }

    await writePage(outputPath, response)
    pages++
  }

  // Copy static assets from public/
  copyDir(PUBLIC, DIST)

  console.log(`Built ${pages} pages to dist/`)
}

build().catch(err => {
  console.error(err)
  process.exit(1)
})
