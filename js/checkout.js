(() => {
  const CART_KEY = 'bythehype-cart';
  const $ = (selector) => document.querySelector(selector);
  const formatPrice = (amount, currency = 'INR') => new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  const readCart = () => { try { const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); return Array.isArray(cart) ? cart : []; } catch { return []; } };
  const isAvailable = (product) => Boolean(product && Number.isFinite(product.price) && product.price > 0 && product.availability?.status === 'available');
  let state = { products: [], store: null, cart: readCart() };

  function renderSummary() {
    const lookup = (id) => state.products.find((product) => product.id === id);
    state.cart = state.cart.filter((item) => isAvailable(lookup(item.id)) && Number.isInteger(Number(item.quantity)) && Number(item.quantity) > 0).map((item) => ({ id: item.id, quantity: Math.min(Number(item.quantity), 99) }));
    localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
    const subtotal = state.cart.reduce((total, item) => total + lookup(item.id).price * item.quantity, 0);
    $('#checkoutItems').innerHTML = state.cart.length ? state.cart.map((item) => { const product = lookup(item.id); return `<div class="summary-item"><span>${escapeHtml(product.name)} × ${item.quantity}</span><strong>${formatPrice(product.price * item.quantity, product.currency)}</strong></div>`; }).join('') : '<p class="empty">Your bag is empty. <a href="../index.html#shop">Browse the collection.</a></p>';
    $('#checkoutSubtotal').textContent = formatPrice(subtotal, state.store.currency);
    const shipping = state.store.shipping;
    if (shipping.mode === 'flat-rate' && Number.isFinite(shipping.flatRate)) { $('#checkoutShipping').textContent = formatPrice(shipping.flatRate, state.store.currency); $('#checkoutTotal').textContent = formatPrice(subtotal + shipping.flatRate, state.store.currency); }
    else if (shipping.mode === 'free' && state.cart.length) { $('#checkoutShipping').textContent = 'Free'; $('#checkoutTotal').textContent = formatPrice(subtotal, state.store.currency); }
    else { $('#checkoutShipping').textContent = 'To be confirmed'; $('#checkoutTotal').textContent = 'To be confirmed'; }
    $('#shippingNote').textContent = shipping.statusMessage;
    return state.cart.length > 0;
  }

  async function initialise() {
    try { const [productsResponse, storeResponse] = await Promise.all([fetch('../data/products.json'), fetch('../data/store.json')]); if (!productsResponse.ok || !storeResponse.ok) throw new Error('Store data could not be loaded.'); const productData = await productsResponse.json(); state.products = productData.products; state.store = await storeResponse.json(); renderSummary(); }
    catch (error) { $('#checkoutMessage').textContent = 'Checkout could not load. Please return to the collection and try again.'; console.error(error); }
  }

  $('#checkoutForm').addEventListener('submit', (event) => {
    event.preventDefault(); const form = event.currentTarget; const hasItems = state.store && renderSummary();
    if (!hasItems) { $('#checkoutMessage').textContent = 'Your bag is empty. Add an available item before continuing.'; return; }
    if (!form.checkValidity()) { $('#checkoutMessage').textContent = 'Please complete every required delivery field with valid information.'; form.querySelector(':invalid').focus(); return; }
    $('#checkoutMessage').textContent = 'Payment is not configured, so no order was created and your details were not saved.';
  });
  initialise();
})();
