(() => {
  const CART_KEY = 'bythehype-cart';
  const $ = (selector) => document.querySelector(selector);
  const readCart = () => { try { const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); return Array.isArray(cart) ? cart : []; } catch { return []; } };
  const state = { products: [], store: null, cart: readCart() };
  const formatPrice = (amount, currency = 'INR') => new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  const byId = (id) => state.products.find((product) => product.id === id);
  const isAvailable = (product) => Boolean(product && Number.isFinite(product.price) && product.price > 0 && product.availability?.status === 'available');
  const saveCart = () => localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
  const cartQuantity = () => state.cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = () => state.cart.reduce((total, item) => total + byId(item.id).price * item.quantity, 0);

  function sanitiseCart() {
    state.cart = state.cart.reduce((valid, item) => {
      const product = byId(item.id);
      const quantity = Number.parseInt(item.quantity, 10);
      if (isAvailable(product) && quantity > 0) valid.push({ id: product.id, quantity: Math.min(quantity, 99) });
      return valid;
    }, []);
    saveCart();
  }

  function renderCart() {
    const empty = state.cart.length === 0;
    $('#cartCount').textContent = cartQuantity();
    $('#subtotal').textContent = formatPrice(cartSubtotal(), state.store?.currency);
    $('#checkout').classList.toggle('is-disabled', empty);
    $('#checkout').setAttribute('aria-disabled', String(empty));
    $('#cartItems').innerHTML = empty ? '<p class="empty">Your bag is waiting for something good.</p>' : state.cart.map((item) => {
      const product = byId(item.id);
      return `<div class="cart-row"><img src="${escapeHtml(product.thumbnail)}" alt="" /><div><p><strong>${escapeHtml(product.name)}</strong><br>${formatPrice(product.price, product.currency)} · Qty ${item.quantity}</p><div class="quantity-controls"><button type="button" data-cart-change="-1" data-id="${escapeHtml(product.id)}" aria-label="Remove one ${escapeHtml(product.name)}">−</button><button type="button" data-cart-change="1" data-id="${escapeHtml(product.id)}" aria-label="Add one ${escapeHtml(product.name)}">+</button><button type="button" class="remove-button" data-remove="${escapeHtml(product.id)}">Remove</button></div></div></div>`;
    }).join('');
  }

  function addToCart(id) {
    const product = byId(id);
    if (!isAvailable(product)) return;
    const item = state.cart.find((cartItem) => cartItem.id === id);
    if (item) item.quantity = Math.min(item.quantity + 1, 99);
    else state.cart.push({ id, quantity: 1 });
    saveCart(); renderCart(); toggleCart(true);
  }

  function changeQuantity(id, change) {
    const item = state.cart.find((cartItem) => cartItem.id === id);
    if (!item || !Number.isInteger(change)) return;
    item.quantity = Math.min(99, item.quantity + change);
    if (item.quantity < 1) state.cart = state.cart.filter((cartItem) => cartItem.id !== id);
    saveCart(); renderCart();
  }

  function toggleCart(show) {
    $('#cart').classList.toggle('open', show); $('#overlay').classList.toggle('visible', show);
    $('#cart').setAttribute('aria-hidden', String(!show)); $('#cartButton').setAttribute('aria-expanded', String(show));
    if (show) $('#closeCart').focus();
  }

  function visibleProducts() {
    const query = $('#productSearch').value.trim().toLowerCase();
    const category = $('#categoryFilter').value;
    const sort = $('#sortProducts').value;
    const products = state.products.filter((product) => (category === 'all' || product.category === category) && `${product.name} ${product.description} ${product.tags.join(' ')}`.toLowerCase().includes(query));
    return products.sort((left, right) => {
      if (sort === 'price-low') return (left.price ?? Infinity) - (right.price ?? Infinity);
      if (sort === 'price-high') return (right.price ?? -Infinity) - (left.price ?? -Infinity);
      if (sort === 'name') return left.name.localeCompare(right.name);
      return Number(right.featured) - Number(left.featured) || Number(right.bestseller) - Number(left.bestseller) || left.name.localeCompare(right.name);
    });
  }

  function renderProducts() {
    const products = visibleProducts();
    $('#catalogStatus').textContent = `${products.length} product${products.length === 1 ? '' : 's'} found`;
    $('#products').innerHTML = products.length ? products.map((product) => {
      const available = isAvailable(product);
      const badges = [product.featured ? 'Featured' : '', product.bestseller ? 'Best seller' : ''].filter(Boolean).map((badge) => `<span class="tag">${badge}</span>`).join('');
      return `<article class="product-card"><a class="product-image" href="pages/product.html?slug=${encodeURIComponent(product.slug)}"><img src="${escapeHtml(product.thumbnail)}" alt="${escapeHtml(product.name)}" loading="lazy" />${badges}</a><div class="product-info"><div><h3><a href="pages/product.html?slug=${encodeURIComponent(product.slug)}">${escapeHtml(product.name)}</a></h3><small>${escapeHtml(product.category)}</small><p class="product-description">${escapeHtml(product.description)}</p></div><div class="price"><p>${available ? formatPrice(product.price, product.currency) : '<span class="availability">Coming soon</span>'}</p></div></div>${available ? `<button type="button" class="quick-add wide" data-add="${escapeHtml(product.id)}">Add to bag <span>+</span></button>` : `<a class="quick-add wide" href="pages/product.html?slug=${encodeURIComponent(product.slug)}">View details <span>→</span></a>`}</article>`;
    }).join('') : '<p class="empty">No products match that search yet.</p>';
  }

  async function initialise() {
    try {
      const [productsResponse, storeResponse] = await Promise.all([fetch('data/products.json'), fetch('data/store.json')]);
      if (!productsResponse.ok || !storeResponse.ok) throw new Error('Store data could not be loaded.');
      const productData = await productsResponse.json(); state.store = await storeResponse.json(); state.products = productData.products;
      sanitiseCart(); document.title = `${state.store.name} — ${state.store.tagline}`;
      $('#announcement').textContent = `${state.store.announcement.primaryText} • ${state.store.announcement.secondaryText}`;
      $('#brand').firstChild.textContent = state.store.name;
      [...new Set(state.products.map((product) => product.category))].forEach((category) => $('#categoryFilter').insertAdjacentHTML('beforeend', `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`));
      renderProducts(); renderCart();
    } catch (error) { $('#catalogStatus').textContent = 'The collection could not load. Please refresh or use a local web server.'; console.error(error); }
  }

  $('#products').addEventListener('click', (event) => { const button = event.target.closest('[data-add]'); if (button) addToCart(button.dataset.add); });
  $('#cartItems').addEventListener('click', (event) => { const change = event.target.dataset.cartChange; if (change) changeQuantity(event.target.dataset.id, Number(change)); if (event.target.dataset.remove) { state.cart = state.cart.filter((item) => item.id !== event.target.dataset.remove); saveCart(); renderCart(); } });
  $('#productSearch').addEventListener('input', renderProducts); $('#categoryFilter').addEventListener('change', renderProducts); $('#sortProducts').addEventListener('change', renderProducts);
  $('#cartButton').onclick = () => toggleCart(true); $('#closeCart').onclick = () => toggleCart(false); $('#overlay').onclick = () => toggleCart(false);
  $('#menuButton').onclick = () => { const nav = $('#mainNav'); const open = nav.classList.toggle('open'); $('#menuButton').setAttribute('aria-expanded', String(open)); };
  $('#newsletterForm').addEventListener('submit', (event) => { event.preventDefault(); const input = $('#email'); if (!input.validity.valid) { $('#formMessage').textContent = 'Enter a valid email address.'; input.focus(); return; } $('#formMessage').textContent = 'Newsletter sign-up is not connected yet, so your email was not saved.'; event.target.reset(); });
  $('#checkout').addEventListener('click', (event) => { if (state.cart.length === 0) event.preventDefault(); });
  $('#year').textContent = new Date().getFullYear(); initialise();
})();
