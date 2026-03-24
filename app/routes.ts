import { route } from 'remix/fetch-router/routes'

export let routes = route({
  home: '/',
  recipes: {
    index: '/recipes',
    cook: '/recipes/:slug/cook',
    show: '/recipes/:slug',
  },
  packs: {
    index: '/packs',
    show: '/packs/:slug',
  },
  sitemap: '/sitemap.xml',
})
