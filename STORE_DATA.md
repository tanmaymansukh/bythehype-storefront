# Store data guide

## Product catalogue

`data/products.json` is the only product catalogue used by the homepage, product page and checkout. Keep `id` values unique and `slug` values URL-safe. Do not duplicate product prices in JavaScript or HTML.

Each public product contains:

- Identity: `id`, `name`, `slug`, `description`, `category`, `tags`
- Media: `images` and `thumbnail`
- Commerce: `price`, `currency`, `availability`, `shippingProfile`
- Display: `variants`, `featured`, `bestseller`

Use `price: null` with `availability.status: "coming-soon"` when a price is not approved. Use a real positive `price` with `availability.status: "available"` only after the item is ready for sale. The site excludes every other state from the bag and checkout.

The active image files live in `images/`. Their current product paths are `images/desk-reset-kit.svg`, `images/cable-calm-set.svg`, `images/focus-phone-stand.svg` and `images/soft-glow-mini.svg`.

## Store settings

Edit `data/store.json` for public store status, announcement copy, shipping configuration and payment endpoint configuration. Do not use this file for API secrets, supplier records or non-public business information.

`shipping.mode` is intentionally `unconfigured` until shipping is approved. When ready, use `free` or `flat-rate` with a numeric `flatRate`; location-based rates can be supplied through `locationRates` when a server-side order service is available. Checkout only calculates shipping/total when the configuration is an explicit public fixed rule.

## Safely adding a product

1. Add its image under `images/` and use its matching relative path in the product.
2. Copy an object in `data/products.json`, change the ID and slug, and write public customer-facing copy.
3. Set `price: null` and `coming-soon` until its price, supply and fulfilment are approved.
4. Test the home card and `pages/product.html?slug=your-slug` through a local server.
5. Do not add private supplier costs, contacts or credentials to any public file.
