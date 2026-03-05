# DoodleType

> Original characters. Real personalities. Designed by a 12-year-old who refused to draw boring stuff.

**Live site:** https://doodletype.com
**Shopify store:** https://doodletype.myshopify.com

---

## Characters

Annabelle (Apple) · Brian (Broccoli) · Ethan (Egg) · Martin (Watermelon) · Jim (Jelly) · Ian (Ice Cube) · Kiran (Kiwi) · Steve (Strawberry) · Peter (Pepper) · John (Bread)

## Stack

- **Shopify OS 2.0** — JSON templates + Liquid sections
- **No build step** — pure Liquid, CSS, vanilla JS
- **GitHub → Shopify sync** — push to `main` to deploy

## Deploy

```bash
git add <files>
git commit -m "your message"
git push origin main
# Shopify auto-syncs in ~1 minute
```

If Shopify doesn't pick up changes: Admin → Themes → `...` → **Reset to latest commit**

## Docs

- [SPEC.md](./SPEC.md) — full architecture, brand guidelines, gotchas
- [CHANGELOG.md](./CHANGELOG.md) — version history and bug fixes
