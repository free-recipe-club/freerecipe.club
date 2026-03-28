import fs from 'node:fs'
import path from 'node:path'
import { home } from '../app/controllers/home.tsx'
import { recipesIndex } from '../app/controllers/recipes/index.tsx'
import { recipeShow } from '../app/controllers/recipes/show.tsx'
import { recipeMake } from '../app/controllers/recipes/make.tsx'
import { packsIndex } from '../app/controllers/packs/index.tsx'
import { packShow } from '../app/controllers/packs/show.tsx'
import { sitemap } from '../app/controllers/sitemap.ts'
import { listRecipeSlugs, loadRecipe, countSteps } from '../app/data/recipes.ts'
import { loadPacks } from '../app/data/packs.ts'

const DIST = path.join(process.cwd(), 'dist')
const PUBLIC = path.join(process.cwd(), 'public')
const ORIGIN = 'https://freerecipe.club'

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

  let recipeSlugs = listRecipeSlugs()
  let packSlugs = loadPacks().map(p => p.slug)
  let pages = 0

  // Static pages
  await writePage(path.join(DIST, 'index.html'), await home())
  pages++

  await writePage(path.join(DIST, 'recipes', 'index.html'), await recipesIndex())
  pages++

  await writePage(path.join(DIST, 'packs', 'index.html'), await packsIndex())
  pages++

  // Recipe pages
  for (let slug of recipeSlugs) {
    await writePage(
      path.join(DIST, 'recipes', slug, 'index.html'),
      await recipeShow(fakeContext(`/recipes/${slug}`, { slug }))
    )
    pages++

    // Make mode: one page per step
    let recipe = loadRecipe(slug.replace(/-/g, '_'))
    let totalSteps = countSteps(recipe)
    await writePage(
      path.join(DIST, 'recipes', slug, 'make', 'index.html'),
      await recipeMake(fakeContext(`/recipes/${slug}/make`, { slug, step: '1' }))
    )
    pages++
    for (let step = 2; step <= totalSteps; step++) {
      await writePage(
        path.join(DIST, 'recipes', slug, 'make', String(step), 'index.html'),
        await recipeMake(fakeContext(`/recipes/${slug}/make/${step}`, { slug, step: String(step) }))
      )
      pages++
    }
  }

  // Pack pages
  for (let slug of packSlugs) {
    await writePage(
      path.join(DIST, 'packs', slug, 'index.html'),
      await packShow(fakeContext(`/packs/${slug}`, { slug }))
    )
    pages++
  }

  // Sitemap
  await writePage(
    path.join(DIST, 'sitemap.xml'),
    sitemap(fakeContext('/sitemap.xml'))
  )
  pages++

  // Copy static assets from public/
  copyDir(PUBLIC, DIST)

  console.log(`Built ${pages} pages to dist/`)
}

build().catch(err => {
  console.error(err)
  process.exit(1)
})
