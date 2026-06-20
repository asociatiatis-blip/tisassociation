# TIS Association — website

The official website for **TIS Association (Technology and Innovation for Society)**, a
Romanian non-profit working across mobility, health, and energy.

A hand-built, dependency-free static site: polished, accessible, and hardened. No
framework, no build step, no third-party requests.

## Structure

```
index.html            Single-page site (semantic markup, SEO, strict CSP)
404.html              Branded not-found page
assets/
  styles.css          All styling (Refined Editorial Eco design)
  app.js              Progressive enhancement (reveals, nav, scroll-spy) — site works without it
  fonts/              Self-hosted Fraunces / Inter / IBM Plex Mono (WOFF2) + fonts.css
favicon.svg           Vector favicon
apple-touch-icon.png  iOS home-screen icon
icon-192.png / 512    PWA / manifest icons
og-image.png          Social sharing preview (1200×630)
site.webmanifest      PWA manifest
robots.txt / sitemap.xml
CNAME                 Custom domain for GitHub Pages
backup/               Original draft, kept for reference (not served meaningfully)
DEPLOY.md             Step-by-step launch + hardening guide
```

## Run locally

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Edit

Plain HTML/CSS/JS — edit the files directly, commit, and push. See **DEPLOY.md** for the
launch steps and the list of `[ YOU ADD: … ]` content placeholders to fill in.

## Tech & design

- **Design:** Refined Editorial Eco — Fraunces display serif + Inter + IBM Plex Mono,
  forest/lime palette, paper-grain texture, editorial layout, tasteful scroll reveals.
- **Accessibility:** WCAG AA/AAA contrast, keyboard navigable, skip link, visible focus,
  `prefers-reduced-motion` respected.
- **Security:** strict CSP, self-hosted fonts (no external calls), no form backend.
- **Contact:** email link (`asociatiatis@gmail.com`) — no third-party form service.
