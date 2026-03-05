# DoodleType — Theme Specification

> A Shopify OS 2.0 theme for DoodleType, a character-based t-shirt brand designed by a 12-year-old named Antonio. Hand-drawn food characters with attitude. Wear Your Weird.

---

## Brand

| Property | Value |
|---|---|
| Name | DoodleType |
| Tagline | "Wear Your Weird." |
| Live URL | https://doodletype.com |
| Shopify Store | https://doodletype.myshopify.com |
| Price point | $29 per tee |
| Free shipping threshold | $50+ |
| Return window | 30 days |

### Colors
| Variable | Hex | Usage |
|---|---|---|
| `--color-black` | `#1a1a1a` | Backgrounds, text |
| `--color-white` | `#ffffff` | Text on dark bg |
| `--color-red` | `#ff3c3c` | CTAs, accents, marquee bg |
| `--color-cream` | `#fafaf7` | Light section backgrounds |
| `--color-yellow` | `#fff9c4` | Email signup section bg |

### Typography
| Variable | Font | Usage |
|---|---|---|
| `--font-header` | Permanent Marker | Headlines, logo, buttons |
| `--font-body` | Nunito | Body copy, labels, prices |

---

## Characters (10 total)

All character assets live in `assets/` root as PNG files. Keyword mapping is in `snippets/character-card.liquid`.

| Character | Asset File | Keywords (in product title) |
|---|---|---|
| Annabelle | `Annabelle-Apple.png` | `annabelle`, `apple` |
| Brian | `Brian-Broccoli.png` | `brian`, `broccoli` |
| Ethan | `Ethan-Egg.png` | `ethan`, `egg` |
| Martin | `Martin-Watermelon.png` | `martin`, `watermelon` |
| Jim | `Jim-Jelly.png` | `jim`, `jelly` |
| Ian | `Ian-Ice-Cube.png` | `ian`, `ice` |
| Kiran | `Kiran-Kiwi.png` | `kiran`, `kiwi` |
| Steve | `Steve-Strawberry.png` | `steve`, `strawberry` |
| Peter | `Peter-Pepper.png` | `peter`, `pepper` |
| John | `John-bread.png` | `john`, `bread` ⚠️ *not yet mapped* |

> **Note:** John's asset exists in `assets/` but the keyword mapping in `snippets/character-card.liquid` still needs to be updated.

---

## Architecture

**Shopify OS 2.0** — JSON templates + Liquid sections. No build step, no npm, no frameworks.

```
doodletype-website/
├── assets/
│   ├── style.css          # Full design system (~900 lines)
│   ├── main.js            # Vanilla JS — cart, menu, animations
│   └── *.png              # Character illustrations (10 files)
├── config/
│   ├── settings_schema.json   # Theme editor settings definitions
│   └── settings_data.json     # Default theme setting values
├── layout/
│   └── theme.liquid       # Master layout — fonts, CSS vars, cart drawer, mobile menu
├── sections/
│   ├── header.liquid
│   ├── footer.liquid
│   ├── hero.liquid            # Home hero with character grid
│   ├── marquee.liquid         # Red scrolling ticker (reusable)
│   ├── character-grid.liquid  # Grid pulling from collections/all
│   ├── characters-page.liquid # Full /pages/characters showcase
│   ├── main-product.liquid    # Product detail page
│   ├── main-collection-banner.liquid
│   ├── main-collection-products.liquid
│   ├── main-cart.liquid
│   ├── main-page.liquid
│   ├── main-404.liquid        # Branded 404 page
│   ├── about-strip.liquid
│   ├── story-strip.liquid
│   ├── shop-cta.liquid
│   └── email-signup.liquid
├── snippets/
│   ├── character-card.liquid  # Card with keyword→asset mapping
│   └── product-card.liquid    # Standard product grid card
├── templates/
│   ├── index.json
│   ├── product.json
│   ├── collection.json
│   ├── cart.json
│   ├── page.json
│   ├── page.characters.json
│   └── 404.json
└── locales/
    └── en.default.json
```

---

## Pages & Templates

| URL | Template | Sections |
|---|---|---|
| `/` | `index.json` | hero, marquee, character-grid, about-strip, story-strip, shop-cta, email-signup |
| `/products/*` | `product.json` | main-product, marquee, character-grid (related) |
| `/collections/*` | `collection.json` | main-collection-banner, main-collection-products |
| `/cart` | `cart.json` | main-cart |
| `/pages/characters` | `page.characters.json` | characters-page |
| `/pages/*` | `page.json` | main-page |
| `/404` | `404.json` | main-404 |

---

## Key JS Behaviors (`assets/main.js`)

- **Ajax Add-to-Cart** — intercepts `#product-form` submit, POSTs to `/cart/add.js`, opens cart drawer on success
- **Cart Drawer** — fetches `/cart.js`, renders items, handles remove via `/cart/change.js`
- **Fade-in** — IntersectionObserver on all `.fade-in` elements (threshold 0.12)
- **Mobile Menu** — hamburger toggle, overlay close, Escape key close
- **Quantity Selector** — +/- buttons on product page, clamped 1–10

---

## Deployment

GitHub repo `frankomatic5000/doodletype-website` is connected to Shopify.

**Deploy flow:**
1. Edit files locally
2. `git add <files> && git commit -m "message"`
3. `git push origin main`
4. Shopify auto-syncs within ~1 minute

**If Shopify doesn't pick up changes:**
- Shopify Admin → Online Store → Themes → `...` → **Reset to latest commit**
- Check sync: Themes → **View logs** — must show `0 failed`

---

## Known Shopify Gotchas (hard-won lessons)

| Bug | Cause | Fix |
|---|---|---|
| Product/home page 404 | Special Unicode chars (`✦` `∞`) or apostrophes in `.json` template settings values | Replace with ASCII equivalents |
| Page 404 | Backslash escape `\'` inside Liquid single-quoted strings | Use double quotes or remove the default filter |
| Page 404 | `| index:` filter doesn't exist in Shopify Liquid | Use `split` + `last` to extract tagline from title |
| Validation error | Range setting value in JSON template not matching schema step | Remove the setting and rely on schema default |
| Images not showing | Asset files in `assets/images/` subdirectory | Shopify only serves from `assets/` root — move files up |
| Sync not working | `git commit` without `git push` | Always push — Shopify reads from GitHub remote, not local |

---

## TODO / Pending

- [ ] Add John (bread) keyword mapping to `snippets/character-card.liquid`
- [ ] Add John to `sections/hero.liquid` character grid
- [ ] Add John to `sections/characters-page.liquid` showcase
- [ ] Set up custom domain DNS: CNAME `www` → `shops.myshopify.com`, A `@` → `23.227.38.65`
- [ ] Update product prices to $29 in Shopify Admin (was showing $19.99)
