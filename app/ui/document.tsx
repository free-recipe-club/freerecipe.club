import type { RemixNode } from '@remix-run/component'
import { getActiveThemeClass } from '../data/packs.ts'

export function Document() {
  return (props: {
    title: string
    description?: string
    canonicalUrl?: string
    themeClass?: string
    children: RemixNode
  }) => {
    let themeClass = props.themeClass || getActiveThemeClass()
    return (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#2d6a4f" />
          <title>{props.title} — freerecipe.club</title>
          {props.description ? (
            <meta name="description" content={props.description} />
          ) : null}
          {props.canonicalUrl ? <link rel="canonical" href={props.canonicalUrl} /> : null}
          <meta property="og:site_name" content="freerecipe.club" />
          <meta property="og:title" content={`${props.title} — freerecipe.club`} />
          <meta property="og:description" content={props.description || 'Recipes without the ads. No tracking, no accounts, just recipes.'} />
          <meta property="og:type" content="website" />
          {props.canonicalUrl ? <meta property="og:url" content={props.canonicalUrl} /> : null}
          <meta property="og:image" content="https://freerecipe.club/og.svg" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={`${props.title} — freerecipe.club`} />
          <meta name="twitter:description" content={props.description || 'Recipes without the ads. No tracking, no accounts, just recipes.'} />
          <meta name="twitter:image" content="https://freerecipe.club/og.svg" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="stylesheet" href="/styles/output.css" />
        </head>
        <body class={`${themeClass} min-h-screen`}>
          <a class="skip-link" href="#main-content">Skip to content</a>
          <Nav />
          {props.children}
          <footer class="max-w-2xl mx-auto px-4 py-8 text-sm print:hidden" style="color:var(--theme-text-secondary)">
            <span>Code: MIT. Recipe text and photos: CC BY-SA 4.0.</span>{' '}
            <a href="https://github.com/free-recipe-club/freerecipe.club" rel="noopener noreferrer" style="color:var(--theme-accent)">Contribute on GitHub</a>
          </footer>
        </body>
      </html>
    )
  }
}

function Nav() {
  return () => (
    <nav
      aria-label="Main navigation"
      class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between print:hidden"
      style="background:var(--theme-nav-bg)"
    >
      <a
        href="/"
        class="text-xl font-bold hover:underline"
        style="color:var(--theme-accent)"
      >
        freerecipe.club
      </a>
      <div class="flex items-center gap-4">
        <a
          href="/recipes"
          class="text-lg hover:underline"
          style="color:var(--theme-accent)"
        >
          Recipes
        </a>
        <a
          href="/packs"
          class="text-lg hover:underline"
          style="color:var(--theme-accent)"
        >
          Packs
        </a>
      </div>
    </nav>
  )
}
