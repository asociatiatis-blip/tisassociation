# Launching tisassociation.com — step by step

This guide takes the finished site live on your GoDaddy domain using **GitHub Pages**
(free hosting, free HTTPS) and an optional **Cloudflare** layer for extra security headers.

Your repo: `https://github.com/asociatiatis-blip/tisassociation`
Assumed domain: **tisassociation.com** (change every occurrence below if yours differs).

---

## 0. Before you start (5 min)

- [ ] Confirm the exact domain you bought on GoDaddy (apex like `tisassociation.com`).
      If it's different, edit these files and change the domain in each:
      `CNAME`, `index.html` (the `og:url`, `canonical`, `twitter`/`og:image` URLs),
      `robots.txt`, `sitemap.xml`.
- [ ] Make sure [Git](https://git-scm.com/download/win) is installed (`git --version`).

---

## 1. Push the site to GitHub

Open a terminal **in this project folder** (`tisassociation.com`) and run:

```bash
git init
git add .
git commit -m "Launch polished TIS Association website"
git branch -M main
git remote add origin https://github.com/asociatiatis-blip/tisassociation.git
git push -u origin main
```

> If the repo already has files and Git refuses to push, run `git pull origin main --rebase`
> first, resolve any conflict, then `git push`. If it asks you to log in, use your GitHub
> username and a **Personal Access Token** (GitHub → Settings → Developer settings →
> Personal access tokens) as the password.

**Updating the site later:** once the repo is connected, any change is just three commands
from the project folder — GitHub Pages redeploys in ~1 minute:

```bash
git add .
git commit -m "Describe your change"
git push
```

---

## 2. Turn on GitHub Pages

1. Go to your repo → **Settings** → **Pages** (left sidebar).
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)** → **Save**.
4. Wait ~1 minute. A green box appears: "Your site is live at …".

---

## 3. Connect your custom domain

1. Still in **Settings → Pages**, under **Custom domain**, type:
   `tisassociation.com` → **Save**.
   (This commits/uses the `CNAME` file already in the repo.)
2. Leave **Enforce HTTPS** unchecked **for now** — it only becomes available after DNS
   below is set and GitHub has issued the certificate (can take 15 min–24 h). Come back
   and tick it once it's selectable.

---

## 4. Point GoDaddy DNS to GitHub

1. Sign in to **GoDaddy** → **My Products** → your domain → **DNS** → **Manage Zones**
   (or "Manage DNS").
2. **Delete** any default GoDaddy **Parked**/**Forwarding** records and any existing
   `A` record on `@` that points to a GoDaddy IP. Also remove a `CNAME` on `www` if it
   points to GoDaddy.
3. **Add these records** (Type → Name → Value):

   | Type  | Name | Value                       | TTL    |
   |-------|------|-----------------------------|--------|
   | A     | @    | `185.199.108.153`           | 1 Hour |
   | A     | @    | `185.199.109.153`           | 1 Hour |
   | A     | @    | `185.199.110.153`           | 1 Hour |
   | A     | @    | `185.199.111.153`           | 1 Hour |
   | CNAME | www  | `asociatiatis-blip.github.io` | 1 Hour |

   Optional (IPv6 — add if GoDaddy lets you add `AAAA`):

   | Type | Name | Value                    |
   |------|------|--------------------------|
   | AAAA | @    | `2606:50c0:8000::153`    |
   | AAAA | @    | `2606:50c0:8001::153`    |
   | AAAA | @    | `2606:50c0:8002::153`    |
   | AAAA | @    | `2606:50c0:8003::153`    |

4. **Save**.

---

## 5. Wait, then verify

- DNS usually propagates in minutes (can be up to 48 h). Check progress at
  <https://dnschecker.org> (look up your domain's `A` records → should show the four
  `185.199.x.153` IPs).
- Once propagated, go back to **Settings → Pages** and tick **Enforce HTTPS**.
- Open **https://tisassociation.com** and **https://www.tisassociation.com** — both should
  load with a padlock. (`www` auto-redirects to the apex.)

✅ Your site is live.

---

## 6. (Recommended) Add security headers with Cloudflare — optional, free

GitHub Pages can't send custom HTTP security headers (HSTS, X-Frame-Options, etc.).
The site is already hardened from the page itself (strict CSP, no third-party calls,
no forms), but routing DNS through Cloudflare adds the header-level protections **and**
a free CDN/DDoS shield — without moving your hosting.

1. Create a free account at <https://cloudflare.com> → **Add a site** → enter your domain.
2. Cloudflare scans your DNS. Make sure the four GitHub `A` records and the `www` CNAME
   are present (orange cloud = proxied = ON).
3. Cloudflare gives you **two nameservers** (e.g. `xxx.ns.cloudflare.com`). In **GoDaddy →
   your domain → Nameservers → Change → I'll use my own**, paste those two. Save.
   (This moves DNS authority to Cloudflare; it can take a few hours.)
4. In Cloudflare → **SSL/TLS** → set encryption mode to **Full (strict)**.
5. In Cloudflare → **Rules → Transform Rules → Modify Response Header → Create rule**,
   set it to apply to all requests and **add** these headers:

   | Header                      | Value |
   |-----------------------------|-------|
   | `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
   | `X-Content-Type-Options`    | `nosniff` |
   | `X-Frame-Options`           | `DENY` |
   | `Referrer-Policy`           | `strict-origin-when-cross-origin` |
   | `Permissions-Policy`        | `geolocation=(), microphone=(), camera=(), interest-cohort=()` |

6. Verify your grade at <https://securityheaders.com> and SSL at <https://ssllabs.com/ssltest>.

> Prefer not to move nameservers? You can skip Cloudflare entirely — the site is still
> served over HTTPS with a strong page-level CSP. Cloudflare just adds the extra headers.

---

## Maintaining the site

Everything is plain HTML/CSS/JS — no build step. To change content, edit `index.html`,
then `git add . && git commit -m "Update copy" && git push`. GitHub Pages redeploys in
~1 minute.

**Fill in the `[ YOU ADD: … ]` spots** (search the project for `YOU ADD`):
- About section — your real founding year / team / story.
- Footer — real social links (or delete the placeholders).

**Projects** now link to their websites (each title opens the site in a new tab). To change
a link, edit the `href` on that project's `<a class="proj-link" …>` in `index.html`. The
five projects are EcoHuedin 360, EcoAlianța, Terra, Technology for Accessible Justice
(2019–2023), and Smart Volunteer / voluntarI (2018–2019).

**Add project photos:** drop images in `assets/img/`, then in `index.html` replace a
project's `<span class="proj-thumb">…</span>` with:
```html
<span class="proj-thumb"><img src="assets/img/ecohuedin.jpg" alt="EcoHuedin 360 — short description" loading="lazy" width="160" height="160"></span>
```
Use compressed JPG/WebP (≤200 KB each) for speed.

**Replace the social preview image:** swap `og-image.png` (1200×630) for your own; keep
the same filename and dimensions.

**How contact works now:** the "Let's talk" section has an **Open in Gmail** button
(composes a message in the browser — reliable even without a desktop mail app), a
**Copy email** button, click-to-copy email addresses, and a `tel:` phone link. No
`mailto:` anywhere (it silently fails when there's no desktop mail app). Nothing to
maintain; messages arrive at `asociatiatis@gmail.com`.

**Want a real in-page form later?** You can add one for free with
[Web3Forms](https://web3forms.com) (no backend):
1. Get a free **Access Key** (just enter your email on their site).
2. Add a `<form action="https://api.web3forms.com/submit" method="POST">` with a hidden
   `access_key` field and name/email/message inputs.
3. Relax the CSP in `index.html` by adding `https://api.web3forms.com` to the
   `form-action` (and `connect-src` if you submit via JavaScript) directive.
Ask and this can be wired in.

---

## What's already done for you (security & quality)

- 🔒 Strict Content-Security-Policy, no inline scripts/styles, no third-party requests.
- 🔒 Fonts self-hosted (no Google Fonts call → cleaner GDPR/EU posture, faster).
- 🔒 No contact form backend to attack — contact is an "Open in Gmail" compose link +
  one-click "Copy email" + click-to-copy addresses + a `tel:` link (works for everyone,
  no third party, no failure-prone `mailto:`).
- ♿ WCAG AA/AAA contrast, keyboard nav, skip link, visible focus, reduced-motion support.
- ⚡ ~0.7 MB total, lazy/deferred where it matters, no framework.
- 🔎 SEO: sitemap, robots, canonical, Open Graph + Twitter cards, JSON-LD Organization.
