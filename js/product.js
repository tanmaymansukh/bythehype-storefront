(() => {
  const CART_KEY = 'bythehype-cart';
  const detail = document.querySelector('#productDetail');
  const formatPrice = (amount, currency = 'INR') => new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  const available = (product) => Number.isFinite(product.price) && product.price > 0 && product.availability?.status === 'available';
  const readCart = () => { try { const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); return Array.isArray(cart) ? cart : []; } catch { return []; } };
  const addToCart = (id) => { const cart = readCart(); const item = cart.find((entry) => entry.id === id); if (item) item.quantity = Math.min(Number(item.quantity || 0) + 1, 99); else cart.push({ id, quantity: 1 }); localStorage.setItem(CART_KEY, JSON.stringify(cart)); };

  function addProductSchema(product) {
    if (!available(product)) return;
    const schema = { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.description, image: product.images.map((image) => new URL(`../${image}`, window.location.href).href), offers: { '@type': 'Offer', priceCurrency: product.currency, price: product.price, url: window.location.href } };
    const script = document.createElement('script'); script.type = 'application/ld+json'; script.textContent = JSON.stringify(schema); document.head.append(script);
  }

  async function loadProduct() {
    try {
      const response = await fetch('../data/products.json'); if (!response.ok) throw new Error('Unable to load products');
      const data = await response.json(); const slug = new URLSearchParams(window.location.search).get('slug'); const product = data.products.find((entry) => entry.slug === slug);
      if (!product) throw new Error('Product not found');
      const canPurchase = available(product); const variants = [...(product.variants?.colors || []), ...(product.variants?.sizes || [])].filter(Boolean);
      document.title = `${product.name} — BytheHype`; document.querySelector('meta[name="description"]').setAttribute('content', product.description);
      document.querySelector('link[rel="canonical"]').setAttribute('href', window.location.href); addProductSchema(product);
      detail.innerHTML = `<div class="product-gallery"><img src="../${escapeHtml(product.images[0])}" alt="${escapeHtml(product.name)}" /></div><div class="product-copy"><a class="back-link" href="../index.html#shop">← Collection</a><p class="eyebrow">${escapeHtml(product.category)}</p><h1>${escapeHtml(product.name)}</h1><p class="detail-price">${canPurchase ? formatPrice(product.price, product.currency) : '<span class="availability">Coming soon</span>'}</p><p class="detail-description">${escapeHtml(product.description)}</p>${variants.length ? `<div class="variant-group"><p class="variant-label">Available options</p><div class="variant-options">${variants.map((variant) => `<span>${escapeHtml(variant)}</span>`).join('')}</div></div>` : ''}<div class="detail-actions">${canPurchase ? '<button class="button dark" id="addToBag">Add to bag <span>+</span></button>' : '<p class="availability-note">This item is not available to purchase yet. Check back soon.</p>'}</div><p class="shipping-note">${canPurchase ? 'Shipping options and delivery timing are confirmed at checkout when available.' : 'Pricing and availability will be confirmed before this item opens for orders.'}</p><p class="detail-status" id="detailStatus" aria-live="polite"></p></div>`;
      const addButton = document.querySelector('#addToBag'); if (addButton) addButton.onclick = () => { addToCart(product.id); document.querySelector('#detailStatus').innerHTML = 'Added to your bag. <a href="../index.html#shop">Return to the collection</a> or <a href="checkout.html">go to checkout</a>.'; };
    } catch (error) { detail.innerHTML = '<p class="detail-error">This product could not be found. <a href="../index.html#shop">Return to the collection.</a></p>'; console.error(error); }
  }
  loadProduct();
})();
