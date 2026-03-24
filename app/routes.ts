import { route } from 'remix/fetch-router/routes'

export let routes = route({
  home: '/',
  recipes: {
    index: '/recipes',
    show: '/recipes/:slug',
  },
})
