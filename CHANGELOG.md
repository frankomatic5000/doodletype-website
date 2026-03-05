# Changelog

All notable changes to the DoodleType Shopify theme.

---

## [Unreleased]
- Add John (bread) keyword mapping to character-card snippet
- Custom domain www.doodletype.com DNS setup

---

## [1.0.3] - 2026-03-05

### Fixed
- `sections/footer.liquid` — removed invalid `\'` backslash escape in Liquid default filter (caused product page 404s)
- `templates/product.json` — removed `limit` setting that failed Shopify range validation
- `assets/John-bread.png` — added missing John character illustration
- Pushed all commits to GitHub remote (previous commits were local-only, blocking Shopify sync)

---

## [1.0.2] - 2026-03-04

### Fixed
- `sections/main-product.liquid` — removed invalid `| index:` Liquid filter causing all product pages to 404
- `templates/product.json` — removed Unicode special chars (`✦`) from marquee text setting
- `templates/page.characters.json` — removed Unicode special chars and apostrophes from settings values
- `sections/character-grid.liquid` — removed static asset fallback that was showing wrong images
- `snippets/character-card.liquid` — replaced broken image logic with keyword-based product title → asset mapping
- `sections/hero.liquid` — replaced product featured_image with hardcoded character illustration assets
- Character asset filenames corrected: Annabelle (was Annable), Broccoli (was Brocolli), Pepper (was Peper), Ian Ice Cube (was garbled filename)

### Added
- `templates/404.json` + `sections/main-404.liquid` — branded 404 page (was defaulting to Shopify generic)
- `templates/page.characters.json` + `sections/characters-page.liquid` — Meet the Characters page
- Character images moved from `assets/images/` subdirectory to `assets/` root (Shopify requirement)
- "Characters" link added to header nav and mobile menu

---

## [1.0.1] - 2026-03-03

### Fixed
- `templates/index.json` — home page 404 caused by `✦` and `∞` Unicode chars + apostrophes in settings values
- `sections/shop-cta.liquid` — invalid `\'` escape in Liquid string crashing home page render

---

## [1.0.0] - 2026-03-02

### Added
- Initial theme build: full Shopify OS 2.0 theme
- Layout: `theme.liquid` with Google Fonts, CSS variables, cart drawer, mobile menu
- Sections: header, footer, hero, marquee, character-grid, about-strip, story-strip, shop-cta, email-signup
- Sections: main-product, main-collection-banner, main-collection-products, main-cart, main-page
- Templates: index, product, collection, cart, page
- Assets: `style.css` (~900 lines), `main.js` (Ajax cart, fade-in, mobile menu)
- Character assets: 9 hand-drawn PNG illustrations
- Snippets: character-card, product-card
- Locales: en.default.json
