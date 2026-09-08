const products = [
  { name: 'Cloud Carryall', type: 'Everyday bag', price: 38, shape: 'one', tag: 'Best seller' },
  { name: 'Foldaway Form', type: 'Silicone storage', price: 24, shape: 'two', tag: 'New' },
  { name: 'Slow Morning Mug', type: 'Hand-finished ceramic', price: 28, shape: 'three', tag: '' },
  { name: 'Soft Light Lamp', type: 'Rechargeable light', price: 46, shape: 'four', tag: 'Back in stock' }
];
const cart = [];
const productsEl = document.querySelector('#products');
const cartEl = document.querySelector('#cart');
const overlay = document.querySelector('#overlay');
const cartItems = document.querySelector('#cartItems');
function renderProducts(){productsEl.innerHTML=products.map((p,i)=>`<article class="product-card"><div class="product-image"><div class="shape ${p.shape}"></div>${p.tag?`<span class="tag">${p.tag}</span>`:''}<button class="quick-add" data-index="${i}" aria-label="Add ${p.name} to bag">+</button></div><div class="product-info"><div><h3>${p.name}</h3><small>${p.type}</small></div><p>$${p.price}</p></div></article>`).join('')}
function renderCart(){document.querySelector('#cartCount').textContent=cart.length;document.querySelector('#subtotal').textContent='$'+cart.reduce((t,p)=>t+p.price,0).toFixed(2);cartItems.innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-row"><div class="cart-thumb"></div><div><p><strong>${p.name}</strong><br>$${p.price}</p><button data-remove="${i}">Remove</button></div></div>`).join(''):'<p class="empty">Your bag is waiting for something good.</p>'}
function toggleCart(show){cartEl.classList.toggle('open',show);overlay.classList.toggle('visible',show);cartEl.setAttribute('aria-hidden',!show)}
productsEl.addEventListener('click',e=>{const i=e.target.dataset.index;if(i!==undefined){cart.push(products[i]);renderCart();toggleCart(true)}});cartItems.addEventListener('click',e=>{const i=e.target.dataset.remove;if(i!==undefined){cart.splice(i,1);renderCart()}});document.querySelector('#cartButton').onclick=()=>toggleCart(true);document.querySelector('#closeCart').onclick=()=>toggleCart(false);overlay.onclick=()=>toggleCart(false);document.querySelector('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#formMessage').textContent='You’re on the list — welcome to BytheHype.';e.target.reset()});document.querySelector('#checkout').onclick=()=>alert('Your checkout connection comes next. Add Stripe, Shopify, or another payment provider to start taking orders.');document.querySelector('#filterButton').onclick=()=>alert('Your catalog filters will go here as your product range grows.');renderProducts();renderCart();
