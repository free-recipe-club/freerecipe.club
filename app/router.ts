import { createRouter } from 'remix/fetch-router'
import { staticFiles } from 'remix/static-middleware'
import { routes } from './routes.ts'
import { home } from './controllers/home/controller.tsx'

export function createAppRouter() {
  let router = createRouter({
    middleware: [
      staticFiles('./public', {
        cacheControl: 'no-store, must-revalidate',
      }),
    ],
  })

  router.get(routes.home, home)

  return router
}
