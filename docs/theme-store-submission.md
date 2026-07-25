# Theme Store submission guide — Nova Advanced

This guide helps you prepare Nova Advanced for the Shopify Theme Store submission and review process.

## Theme overview

Nova Advanced is a Shopify Online Store 2.0 theme with the following features:

- Shopify Online Store 2.0 JSON templates and sections everywhere
- AJAX cart drawer with toast notifications and dynamic cart count
- Predictive search
- Mega menu support
- Product page: image gallery with zoom + lightbox, thumbnails, sticky add-to-cart, color swatches, quantity stepper, trust badges, collapsible tabs, social share, related products
- Collection page: product grid, sorting, tag filter, price range filter
- Responsive, mobile-first design
- Customizable contact, about, FAQ, returns, blog, article, and policy pages
- Customer account templates (login, register, account, order, addresses, reset password)
- Newsletter popup and age verifier sections
- Before/after image comparison section
- Countdown timer section
- Testimonials, video, image banner, featured collection, collection list, rich text sections

## Technical readiness

- `shopify theme check` passes with 0 offenses
- All customer-facing strings use the `| t` translation filter (`locales/en.default.json`)
- All images use `image_url` with explicit `width` and `height` attributes and `loading` attributes
- Scripts are loaded with `defer`
- Accessible: skip-to-content link, focus-visible styles, ARIA labels, keyboard-usable controls

## Demo store setup

Shopify Theme Store reviewers test themes on a fully populated demo store. Make sure the store contains:

### Pages

Create the following pages in **Online Store > Pages** and assign the matching templates:

| Page title | Template to assign |
|------------|--------------------|
| Contact us | `page.contact` |
| About us | `page.about` |
| FAQ | `page.faq` |
| Returns | `page.returns` |
| Terms of Service | `page` (default) or `page.policy` (custom) |
| Privacy Policy | `page` (default) or `page.policy` (custom) |
| Refund Policy | `page` (default) or `page.policy` (custom) |

### Collections

Create at least 3 collections (e.g. "All products", "New arrivals", "Sale") and add products to them. Set a collection image and description.

### Products

Add 10–20 products with:

- Multiple high-quality images
- Variants (size, color) so swatches and variant selectors are visible
- Compare-at prices for sale badges
- Inventory tracking for stock messages
- A sold-out product to test sold-out states

### Blog

Create a blog and 3–6 blog posts with:

- Featured images
- Tags
- Excerpts
- Author names

Assign the `blog` template to the blog and the `article` template to posts.

### Store policies

Fill in **Settings > Legal** or **Settings > Policies**:

- Refund policy
- Privacy policy
- Terms of service
- Shipping policy

These render with the theme's `main-policy` section.

### Navigation

Set up **Online Store > Navigation** menus:

- Main menu (used by header)
- Footer menu (used by footer blocks)

### Theme settings

Open the theme editor and configure:

- Colors (primary, text, background, accent)
- Typography
- Logo and favicon
- Social media links in **Theme settings > Social media**
- Newsletter popup settings (optional)
- Footer menu and newsletter block

## Pre-submission checklist

- [ ] `shopify theme check` returns 0 offenses
- [ ] `shopify theme package` produces a valid ZIP
- [ ] Theme preview loads on desktop and mobile with no console errors
- [ ] Cart add/update works on product page and collection quick-add
- [ ] All pages (home, collection, product, cart, search, contact, blog, article, policies, 404) render correctly
- [ ] Product page shows variants, swatches, images, related products
- [ ] Collection filters and sorting work
- [ ] Contact form submits and shows success message
- [ ] No broken images or missing alt text
- [ ] Demo store is fully populated

## Submission steps

1. Log in to the [Shopify Partner Dashboard](https://partners.shopify.com/)
2. Go to **Themes > Create theme listing**
3. Upload `Nova Advanced-1.0.0.zip` or connect the theme via `shopify theme share`
4. Fill in:
   - Theme name: `Nova Advanced`
   - Description and feature list
   - Category (e.g. General, Fashion, Electronics)
   - Screenshots of key pages (home, product, collection, mobile)
   - Link to the live demo store (`https://shahbazsevnns.myshopify.com?preview_theme_id=...`)
5. Submit for review
6. Shopify reviews the theme and may ask for fixes; iterate and resubmit

## Support

For setup help, refer to the theme README or contact the theme author.
