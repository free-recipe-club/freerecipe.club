import { route } from 'remix/fetch-router/routes'

export let routes = route({
  home: '/',
  recipes: {
    index: '/recipes',
    make: '/recipes/:slug/make',
    show: '/recipes/:slug',
  },
  packs: {
    index: '/packs',
    show: '/packs/:slug',
  },
  sitemap: '/sitemap.xml',
})
