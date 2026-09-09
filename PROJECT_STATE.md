# BytheHype project state

**Status:** Static GitHub Pages storefront is ready for design review and product sourcing; it is not ready to take real orders.

## Completed

- Brand positioning: BytheHype, aesthetic desk and home organisation; “Clear desk. Clear head.”
- Dynamic catalogue: `data/products.json` generates product cards and detail pages.
- Browser-local cart with add, remove, and quantity controls; it does not create orders or payments.
- Search, category filter, sorting, responsive navigation, accessible labels, SVG placeholders, and checkout status messaging.
- Central store configuration and product-data documentation.

## Current products and sourcing

- Desk Reset Kit is flagship, featured bestseller at ₹799. Supplier, costs, shipping, and stock still need confirmation.
- Cable Calm Set, Focus Phone Stand, and Soft Glow Mini are editable sourcing placeholders. They show “Price TBD” and are not purchasable.
- Supplier details are non-rendered under each product’s `internal` object. GitHub Pages is public, so keep real confidential sourcing data elsewhere.

## Technical decisions

- Pure HTML/CSS/JavaScript; no framework, server, build process, Shopify, or commerce integration.
- JSON loads at runtime with relative paths for GitHub Pages compatibility.
- Product pages use `pages/product.html?slug=<product-slug>`.
- Cart state stays only in browser `localStorage`; it is not inventory or an order system.

## Next steps

1. Source and quality-check products; replace all `PLACEHOLDER` values and confirm compliance.
2. Decide prices, delivery, returns, tax, contact details, and social URLs.
3. Replace SVGs with licensed, optimised product photography.
4. Add legal pages, newsletter service, secure checkout, payments, and verified fulfilment before launch.
5. Test the deployed GitHub Pages URL on mobile browsers.

## Next-developer instruction

Read this file, `README.md`, `STORE_DATA.md`, then `data/products.json`. Preserve the rule that customers never see supplier/internal fields. Do not say payments, orders, inventory, fulfilment, shipping, reviews, or newsletter delivery are connected unless they actually are.
