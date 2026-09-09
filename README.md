# BytheHype storefront

BytheHype is a GitHub Pages-ready static storefront for aesthetic desk and home organisation. Its message is **“Clear desk. Clear head.”** It is not Shopify and has no live payments, orders, supplier fulfilment, or inventory sync.

## Run locally

The storefront reads JSON with `fetch`, so use a local web server rather than opening HTML files directly. From this folder run `python -m http.server 8000`, then open `http://localhost:8000`. No dependencies or build step are required.

## Publish with GitHub Pages

Commit this folder to GitHub. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save. `index.html` and all asset paths are compatible with a GitHub Pages project URL.

## Project map

- `data/products.json` — catalogue and sourcing placeholders.
- `data/store.json` — store settings, branding, policy placeholders, and integration status.
- `js/app.js` — homepage rendering, controls, and browser-local cart.
- `js/product.js` and `pages/product.html` — data-driven product detail route.
- `images/` — editable SVG product illustrations.
- `STORE_DATA.md` — product-management instructions.
- `PROJECT_STATE.md` — handoff record and next work.

Read `PROJECT_STATE.md` first when continuing the project.
