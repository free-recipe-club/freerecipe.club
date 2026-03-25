import { createRouter } from 'remix/fetch-router'
import { staticFiles } from 'remix/static-middleware'
import { routes } from './routes.ts'
import { home } from './controllers/home/controller.tsx'
import { recipesIndex } from './controllers/recipes/index.tsx'
import { recipeShow } from './controllers/recipes/show.tsx'
import { recipeMake } from './controllers/recipes/make.tsx'
import { packsIndex } from './controllers/packs/index.tsx'
import { packShow } from './controllers/packs/show.tsx'
import { sitemap } from './controllers/sitemap.ts'

export function createAppRouter() {
  let router = createRouter({
    middleware: [
      staticFiles('./public', {
        cacheControl: 'no-store, must-revalidate',
      }),
    ],
  })

  router.get(routes.home, home)
  router.get(routes.recipes.index, recipesIndex)
  router.get(routes.recipes.make, recipeMake)
  router.get(routes.recipes.show, recipeShow)
  router.get(routes.packs.index, packsIndex)
  router.get(routes.packs.show, packShow)
  router.get(routes.sitemap, sitemap)

  return router
}
