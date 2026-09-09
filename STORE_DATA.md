# Store data guide

Edit `data/products.json`; the homepage and product-detail page load it automatically. Keep every product `id` unique and `slug` URL-safe. To add a product, copy an existing object, supply its public details and image path, then add a unique ID and slug. To remove one, delete its complete object. Do not change product details in `index.html`.

The public fields include name, copy, category, prices, images, variants, review placeholders, tags, feature flags, availability, and delivery messaging. `price: 0` is the deliberate editable placeholder state: the storefront shows “Price TBD” and prevents purchase. Set a real positive price only after approving it.

`internal` is kept separate from fields rendered by the storefront and contains supplier placeholders, cost, margin, profit, and sourcing notes. This separation is for organisation only: GitHub Pages files are public. Never put credentials, private contracts, actual supplier contacts, or sensitive costs in this repository. Move genuine private sourcing records to a secure system before publishing.

## Pricing

Use this planning formula after sourcing: `estimated profit = selling price − supplier cost − shipping cost − payment fees − tax − packaging/returns allowance`. `margin = estimated profit ÷ selling price × 100`. No actual margin or profit has been calculated yet; every internal value is explicitly a placeholder.

## Store settings

Edit `data/store.json` for store name, announcement, social links, contact placeholders, shipping threshold, return-policy metadata, tax notes, and theme values. Update the actual CSS colours separately in `css/styles.css` if you change the theme colours. Do not claim a service is live until its `commerceStatus` field and the implementation are both updated.

## Current catalogue

1. **Desk Reset Kit** — ₹799, featured and bestseller; includes magnetic cable clips, reusable cable ties, a minimal phone stand, and adhesive headphone hook.
2. **Cable Calm Set** — sourcing and price placeholder.
3. **Focus Phone Stand** — sourcing and price placeholder.
4. **Soft Glow Mini** — sourcing and price placeholder.
