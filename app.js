const products = [
  { name: 'Desk Reset Kit', type: 'Clips, ties & desk hook', price: 799, shape: 'one', tag: 'Best seller' },
  { name: 'Cable Calm Set', type: 'Magnetic cable organisers', price: 349, shape: 'two', tag: 'New' },
  { name: 'Focus Phone Stand', type: 'Foldable aluminium stand', price: 499, shape: 'three', tag: '' },
  { name: 'Soft Glow Mini', type: 'Rechargeable desk light', price: 899, shape: 'four', tag: 'Back in stock' }
];
const cart = [];
const productsEl = document.querySelector('#products');
const cartEl = document.querySelector('#cart');
const overlay = document.querySelector('#overlay');
const cartItems = document.querySelector('#cartItems');
function renderProducts(){productsEl.innerHTML=products.map((p,i)=>`<article class="product-card"><div class="product-image"><div class="shape ${p.shape}"></div>${p.tag?`<span class="tag">${p.tag}</span>`:''}<button class="quick-add" data-index="${i}" aria-label="Add ${p.name} to bag">+</button></div><div class="product-info"><div><h3>${p.name}</h3><small>${p.type}</small></div><p>$${p.price}</p></div></article>`).join('')}
function renderCart(){document.querySelector('#cartCount').textContent=cart.length;document.querySelector('#subtotal').textContent='$'+cart.reduce((t,p)=>t+p.price,0).toFixed(2);cartItems.innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-row"><div class="cart-thumb"></div><div><p><strong>${p.name}</strong><br>$${p.price}</p><button data-remove="${i}">Remove</button></div></div>`).join(''):'<p class="empty">Your bag is waiting for something good.</p>'}
function toggleCart(show){cartEl.classList.toggle('open',show);overlay.classList.toggle('visible',show);cartEl.setAttribute('aria-hidden',!show)}
productsEl.addEventListener('click',e=>{const i=e.target.dataset.index;if(i!==undefined){cart.push(products[i]);renderCart();toggleCart(true)}});cartItems.addEventListener('click',e=>{const i=e.target.dataset.remove;if(i!==undefined){cart.splice(i,1);renderCart()}});document.querySelector('#cartButton').onclick=()=>toggleCart(true);document.querySelector('#closeCart').onclick=()=>toggleCart(false);overlay.onclick=()=>toggleCart(false);document.querySelector('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#formMessage').textContent='You’re on the list — welcome to BytheHype.';e.target.reset()});document.querySelector('#checkout').onclick=()=>alert('Checkout will be connected once you choose your payment provider.');document.querySelector('#filterButton').onclick=()=>alert('More desk essentials are coming soon.');renderProducts();renderCart();
