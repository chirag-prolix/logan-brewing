# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Core Rules

**Think Before Coding** — Ask instead of assuming. If the intent behind a request is unclear, ask one focused question rather than guessing and building the wrong thing.

**Simplicity First** — No abstractions nobody asked for. A direct Liquid snippet beats a clever system. Three similar lines is better than a premature abstraction.

**Surgical Changes** — Touch only what you must. Every changed line must trace back to the request. Do not refactor surrounding code, rename variables, or clean up unrelated sections while fixing something else.

**Goal-Driven Execution** — Before writing code, state the success criteria. What does "done" look like? Verify against it before reporting completion.

---

## Development Commands

This theme has **no build tooling** — no webpack, vite, or gulp. CSS and JS are pre-minified/bundled and served as-is.

To develop locally, use the Shopify CLI:

```bash
shopify theme dev --store=<your-store.myshopify.com>   # hot-reload preview
shopify theme push                                       # push to store
shopify theme pull                                       # pull from store
shopify theme check                                      # lint Liquid files
```

---

## Architecture

### Shopify Theme Structure

Standard Shopify theme layout. The key design decision is **everything is Liquid-rendered** — no client-side framework.

| Path | Role |
|------|------|
| `layout/theme.liquid` | Root shell — includes age gate, cart drawer JS, font preloads, global scripts |
| `sections/` | 34 custom Liquid sections; each embeds its own `{% schema %}` block |
| `templates/` | Page layouts defined as `.json` files (not `.liquid`) for Shopify editor flexibility |
| `snippets/` | Reusable partials: `css-variables.liquid`, `meta-tags.liquid`, `image.liquid` |
| `blocks/` | Reusable section blocks: `group.liquid` (layout wrapper), `text.liquid` |
| `config/settings_schema.json` | Global theme settings exposed in the Shopify editor |
| `assets/base.css` | Primary stylesheet (~3,500 lines, hand-authored, no framework) |
| `assets/critical.css` | Inlined in `<head>` for above-the-fold performance |

### JavaScript

Vanilla JS only. No framework.

- **`layout/theme.liquid`** — All global JS lives here: age gate (localStorage), cart drawer (open/close + animation), cart API calls (`/cart.js`, `/cart/change.js`, `/cart/add.js`), add-to-cart form hijack, money formatting.
- **`assets/base.js`** — Minimal utility: scroll-triggered class toggling (`.js-scroll` → `active`/`scrolled`) and cache-busting on script tags.
- **`assets/swiper-bundle.min.js`** — Swiper 8+ for the testimonials carousel (`sections/swiper-slider.liquid`).

### CSS & Fonts

- No Tailwind, no Bootstrap — custom properties throughout.
- `snippets/css-variables.liquid` generates `:root` vars from theme settings (font family/weight/style, page width, margins, colors).
- Custom fonts (Acme Gothic Wide, Georgia Pro) are stored in `assets/` and loaded via Shopify's `font_face` filter with `font-display: swap`.
- Inline `style` attributes in sections handle per-section overrides (background images, brand colors).

### Section/Template Pattern

- **Sections** are self-contained `.liquid` files with embedded `{% schema %}` JSON.
- **Templates** are `.json` files that compose sections into pages — edit them when changing page structure, not layout logic.
- Section groups (`config/header-group.json`, `footer-group.json`) handle the header and footer.
- `{% content_for 'blocks' %}` is used in simple wrapper sections (`blocks/group.liquid`) to slot child blocks.

### Key Non-Obvious Details

**Age Gate:** All pages redirect to an age-verification page unless a localStorage flag is set. This is intentional for alcohol brand compliance — do not remove the gate without understanding the legal context.

**Spin Wheel (hero-with-popup.liquid):** A gamification feature that generates coupon codes. State is stored in Shopify customer metafields (`customer.metafields.spin_wheel.coupon`). The UI checks for a logged-in customer before showing the wheel.

**Cart Drawer:** The cart is a slide-out drawer, not a page. All cart mutations go through the Storefront Ajax API in `theme.liquid`. The dedicated `templates/cart.json` is a fallback only.

**Money Formatting:** A custom `formatMoney()` function in `theme.liquid` handles cases where `shop.money_format` is empty — do not replace it with a simpler implementation without checking edge cases.

**Third-Party Apps (via `settings_data.json`):** Instagram feed (GSC), store locator (S Store Locator), and email/SMS (Klaviyo) are embedded via app blocks. Their embed codes appear in section and template JSON — do not strip them when editing nearby settings.
