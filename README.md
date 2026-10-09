# portfolio

Personal website of **Zohir Rayhan** — Tech Lead · DevOps & DevSecOps Engineer.

The v3 editorial design from [zohirrayhan.me](https://zohirrayhan.me), rebuilt as
a static [Hugo](https://gohugo.io) site (extended, v0.167.0) and deployed to
GitHub Pages by GitHub Actions on every push to `main`.

**Live:** https://th3x-zohir.github.io/hugo-portfolio/

## What changed from the original

Same design, same DOM, same stylesheets — different engine. The original site
rendered itself in the browser with React + in-browser Babel, so crawlers saw an
empty `<div id="root">`. Here Hugo renders all eleven sections at build time:

| | original | this build |
|---|---|---|
| Markup | React components, transpiled in the browser | Hugo templates, rendered at build |
| Runtime JS | React + ReactDOM + Babel (~1.5 MB, dev builds) | motion engine + widgets only |
| Content source | `js/data.js` (`window.DATA`) | `data/site.yaml` (Hugo also emits `window.DATA` from it) |
| CSS | three plain files | same files, concatenated + minified + fingerprinted by Hugo Pipes |
| Lenis | unpkg CDN | self-hosted, fingerprinted |
| SEO | empty HTML, no sitemap | full HTML, sitemap, RSS, JSON-LD |

The canvas code is the original, verbatim: `assets/js/reels.js` keeps all ten
project reel scenes and `assets/js/v3-motion.js` is untouched. Only the React
wrappers were replaced with vanilla initializers, and the terminal, command
palette, skill graph and GitHub panel were rewritten in plain JS against the
same class names.

## Layout

```
hugo.toml                       config, params, keywords
data/site.yaml                  ALL content — identity, skills, projects, jobs, CV
content/_index.md               home page front matter
assets/
  css/v3-base.css               original design tokens (light + dark)
  css/v3-sections.css           original section styles
  css/v3-polish.css             original polish pass
  css/v3-hugo.css               two rules the React version did in state
  js/v3-motion.js               loader, Lenis, reveals, cursor, parallax (verbatim)
  js/reels.js                   10 canvas project reels (verbatim drawing code)
  js/app.js                     theme, palette, typewriter, terminal, graph, GitHub
  js/lenis.min.js               self-hosted smooth scroll
layouts/
  baseof.html                   page shell: grain, aurora, cursor, nav, rail
  home.html                     composes the eleven sections
  _partials/head.html           meta, JSON-LD, CSS pipeline
  _partials/scripts.html        window.DATA + JS pipeline
  _partials/chrome/             loader, nav, rail, footer, command palette
  _partials/sections/           one partial per section
static/                         photo.jpg, CV pdf, Showreel.html + its two jsx files
.github/workflows/hugo.yml      build + deploy
```

No external theme and no submodules — the layouts are the theme.

## Run locally

```bash
hugo server            # http://localhost:1313/
hugo --gc --minify     # production build into ./public
```

## Editing

- Any text, skill, job, project, certification → `data/site.yaml`
- A new project → add an entry under `projects:` (or `ghProjects:`) with a
  `reel:` key naming one of the ten canvas scenes (`court`, `schedule`,
  `dashboard`, `map`, `ai`, `shop`, `pay`, `chat`, `split`, `booking`)
- Design tweaks → the `assets/css/v3-*.css` files
- Accent colour → `--accent` in `assets/css/v3-base.css`

The site is fully static: the HTML is complete on first byte, and JavaScript
only adds motion and the interactive widgets.
