import { createRouter } from 'remix/fetch-router'
import { staticFiles } from 'remix/static-middleware'
import { routes } from './routes.ts'
import { home } from './controllers/home/controller.tsx'
import { recipesIndex } from './controllers/recipes/index.tsx'
import { recipeShow } from './controllers/recipes/show.tsx'

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
  router.get(routes.recipes.show, recipeShow)

  return router
}
