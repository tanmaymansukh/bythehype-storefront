# BytheHype storefront

BytheHype is a GitHub Pages-ready static storefront for aesthetic desk and home organisation. Its message is **“Clear desk. Clear head.”** It is not Shopify. The public site is currently a catalogue, browser-local bag and checkout foundation; it does not accept payment, create orders or send fulfilment requests.

## Run locally

The site loads JSON with `fetch`, so use a local web server rather than opening files directly. From this folder, run `python -m http.server 8000`, then open `http://localhost:8000`. There are no dependencies or build step.

## Architecture

- `data/products.json` is the single authoritative product catalogue. There is no root `products.json` in this project; the audit found no runtime or documentation dependency on one.
- `data/store.json` holds public store, shipping and payment-integration configuration. It deliberately contains no credentials.
- `js/app.js` renders the catalogue and persistent browser-local bag.
- `pages/product.html` and `js/product.js` create data-driven product views.
- `pages/checkout.html` and `js/checkout.js` provide validated delivery details and an order summary without saving data or claiming a payment/order.
- `pages/contact.html` and `pages/policies.html` are launch-gated customer-information pages.
- `images/` contains the active SVG product images. Keep the current `images/...svg` paths in the catalogue unless the assets move and every reference is updated together.

## Product and pricing management

Edit only `data/products.json` for product content. Each product needs a unique `id`, URL-safe `slug`, image path, description, category, `availability` object and `shippingProfile`.

To sell an item, set a real positive `price` and use `"availability": { "status": "available", "message": "Available to add to bag" }`. To keep an item off sale while it is being sourced, use `price: null` and `"status": "coming-soon"`. The interface will never add an item to the bag unless it is both available and positively priced.

Do not store supplier costs, supplier contacts, margins, contracts, keys or any other confidential information in this repository. GitHub Pages files are public.

## Shipping configuration

`data/store.json` is the one shipping configuration point. Supported modes are `unconfigured`, `free`, `flat-rate`, and a future location-rate model. For a flat rate, set `shipping.mode` to `flat-rate` and enter a numeric `shipping.flatRate`; for free shipping, set `shipping.mode` to `free`. Confirm tax treatment, service regions, carriers and delivery windows before changing the live status.

## Payments and orders

For an Indian launch, Razorpay Standard Checkout is a practical option once the business is approved. A GitHub Pages page must call a separate secure backend/serverless endpoint to create the provider order, calculate prices from trusted product data, validate inventory and delivery data, and return only the checkout session/order details needed by the browser. The backend then verifies payment signatures and webhooks before recording an order and triggering fulfilment. Razorpay documents that order creation is server-side and that payment signatures must be verified server-side; Cashfree likewise requires backend order creation because it uses a secret key. See the official [Razorpay integration guide](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/) and [Cashfree hosted checkout guide](https://www.cashfree.com/docs/payments/online/web/redirect).

Suggested order flow:

1. Browser sends cart IDs, quantities and delivery details to a serverless `create-order` endpoint.
2. Endpoint re-prices the cart from trusted private data, applies the configured shipping/tax rules, creates a pending order and creates the payment-provider order.
3. Browser opens provider-hosted checkout using the returned public session/order data.
4. Provider webhook reaches a `payment-webhook` endpoint; that endpoint verifies its signature and records the confirmed payment.
5. Only then create/send the fulfilment request, store tracking and notify the customer.

Keep provider secrets and webhook signing secrets in the serverless host’s environment-variable/secrets settings. Never add them to `data/store.json`, JavaScript or Git history. Set `payment.provider` and `payment.createOrderEndpoint` only after those endpoints exist and are tested.

## Supplier workflow

Before supplier integration, confirm the supplier, product quality, sourcing terms, inventory expectations, packing standards, dispatch times, return address, cancellations, tracking source and refund responsibility. After payment confirmation: create the supplier request, save the supplier reference, capture tracking when issued, notify the customer and handle exceptions/refunds through the published policy. This site does not perform those steps yet.

## Deployment

Publish the repository’s `main` branch from `/ (root)` in GitHub Pages. The configured canonical and sitemap base URL is `https://tanmaymansukh.github.io/bythehype-storefront/`; update it in `index.html`, `robots.txt` and `sitemap.xml` if the public URL changes. GitHub Pages serves static files only, so the payment/order endpoints must be hosted separately.

## Launch checklist

- Set confirmed supplier, product, stock and pricing information.
- Configure shipping, taxes, policy terms, support details and social links.
- Replace the draft policy/contact content with reviewed, business-specific information.
- Create and verify the secure payment/order/webhook backend.
- Test provider sandbox and live payments, failed payments, refunds, tracking and mobile checkout.
- Commit, push and verify the GitHub Pages deployment.
