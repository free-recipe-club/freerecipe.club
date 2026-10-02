import { countSteps, getRecipeFilename, listRecipeSlugs, loadRecipe } from './recipes.ts'
import { loadPacks } from './packs.ts'

export function listRecipePagePaths(): string[] {
  return listRecipeSlugs().map(slug => `/recipes/${encodeURIComponent(slug)}`)
}

export function listPackPagePaths(): string[] {
  return loadPacks().map(pack => `/packs/${encodeURIComponent(pack.slug)}`)
}

export function listSitemapPaths(): string[] {
  return ['/', '/recipes', '/packs', ...listRecipePagePaths(), ...listPackPagePaths()]
}

export function listStaticPagePaths(): string[] {
  let makePaths = listRecipeSlugs().flatMap(slug => {
    let recipe = loadRecipe(getRecipeFilename(slug))
    let steps = countSteps(recipe)
    return [
      `/recipes/${encodeURIComponent(slug)}/make`,
      ...Array.from({ length: Math.max(0, steps - 1) }, (_, index) => `/recipes/${encodeURIComponent(slug)}/make/${index + 2}`),
    ]
  })

  return [
    '/',
    '/recipes',
    '/packs',
    ...listRecipePagePaths(),
    ...makePaths,
    ...listPackPagePaths(),
    '/sitemap.xml',
    '/404.html',
    '/robots.txt',
  ]
}