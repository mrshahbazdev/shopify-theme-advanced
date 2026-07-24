# Nova Advanced Shopify Theme

A production-ready Shopify Online Store 2.0 theme with advanced sections, AJAX cart, predictive search, and a polished, responsive design.

## Features

- Responsive, mobile-first layout using CSS custom properties
- Sticky header with mega menu and predictive search
- AJAX cart drawer with dynamic quantity updates
- Advanced product page: variant swatches, tabs, sticky add-to-cart, media gallery
- Collection filtering, sorting, and pagination
- Rich homepage sections: image banner, featured collection, collection list, rich text, testimonials, video, before/after comparison, and countdown timer
- Marketing features: newsletter popup and age verifier
- Customer account pages: login, register, account overview, addresses, orders, and reset password

## Requirements

- A Shopify store
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) (for local development and deployment)

## Quick start

1. Clone this repo:
   ```bash
   git clone https://github.com/mrshahbazdev/shopify-theme-advanced.git
   cd shopify-theme-advanced
   ```
2. Authenticate the Shopify CLI with your store:
   ```bash
   shopify theme dev --store your-store.myshopify.com
   ```
3. Open the preview URL shown in the terminal and customize the theme in the Shopify admin.

## Available sections

| Section | Description |
|---|---|
| `header` | Sticky header with logo, menu, search, and cart icons |
| `announcement-bar` | Top promotional bar with text and link |
| `image-banner` | Full-width hero banner with text overlay |
| `featured-collection` | Grid or slider of products from a selected collection |
| `collection-list` | List of collection cards |
| `rich-text` | Centered heading and text block |
| `testimonials` | Customer review cards with star ratings |
| `countdown-timer` | Sale or event countdown |
| `before-after` | Interactive before/after image slider |
| `video` | Self-hosted or YouTube/Vimeo embed with cover image fallback |
| `newsletter-popup` | Timed newsletter signup popup |
| `age-verifier` | Yes/No age-gate overlay |
| `footer` | Multi-column footer with menus, text, and newsletter |

## Theme structure

```
├── config/           # settings_schema.json and settings_data.json
├── layout/           # theme.liquid, password.liquid
├── sections/         # Reusable sections and section groups
├── snippets/         # Shared Liquid snippets and icons
├── templates/        # JSON and Liquid page templates
├── assets/           # CSS and JavaScript
└── locales/          # Translation files
```

## Customization

Theme-wide colors, typography, favicon, and social links are managed through **Theme settings** in the Shopify admin. Each section has its own block and setting schema for the editor.

## Deploy to a store

From the project directory run:

```bash
shopify theme push --store your-store.myshopify.com
```

## Notes

- This theme was bootstrapped as an initial commit. All core templates, sections, snippets, and assets are included.
- For production use, run `shopify theme check` before deploying and review any platform-specific recommendations.
