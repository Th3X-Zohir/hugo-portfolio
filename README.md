# portfolio

Personal website of **Zohir Rayhan** — Tech Lead · DevOps & DevSecOps Engineer.

Built with [Hugo](https://gohugo.io) (extended, v0.167.0) and deployed to GitHub
Pages by GitHub Actions on every push to `main`.

**Live:** https://th3x-zohir.github.io/hugo-portfolio/

## Layout

```
hugo.toml                  site config, params, menus
content/                   markdown content
  _index.md                home
  about.md
  projects/                one file per project
assets/css/main.css        styles (minified + fingerprinted by Hugo Pipes)
data/portfolio.yaml        skills, open source, experience, education
layouts/
  baseof.html              page shell
  home.html                home page
  section.html             project list
  page.html                single project / about
  _partials/               head, header, footer
.github/workflows/hugo.yml build + deploy
```

No external theme and no submodules — the layouts are the theme.

## Run locally

```bash
hugo server -D          # http://localhost:1313/
hugo --gc --minify      # production build into ./public
```

## Editing

- Text, skills, jobs, education → `data/portfolio.yaml`
- Name, tagline, links, menu → `hugo.toml`
- A new project → add a markdown file in `content/projects/` with `weight`,
  `tag`, `role`, `period`, `status`, `url`, `stack` and `highlights` front matter

The site is fully static: no client-side rendering, no runtime JavaScript
beyond a theme toggle, so the HTML is complete for crawlers on first byte.
