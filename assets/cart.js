document.addEventListener('DOMContentLoaded', () => {
  const cartDrawer = document.querySelector('[data-cart-drawer]');
  const cartItemsContainer = document.querySelector('[data-cart-drawer-items]');
  const cartSubtotalEls = document.querySelectorAll('[data-cart-subtotal]');
  const cartCountEls = document.querySelectorAll('[data-cart-count], .js-cart-count');

  async function fetchCart() {
    const res = await fetch('/cart.js', { headers: { 'Accept': 'application/json' } });
    return res.json();
  }

  function updateCartUI(cart) {
    cartSubtotalEls.forEach(el => el.textContent = formatMoney(cart.total_price));
    cartCountEls.forEach(el => { el.textContent = cart.item_count; el.setAttribute('data-count', cart.item_count); });
    if (!cartItemsContainer) return;
    if (!cart.items.length) { cartItemsContainer.innerHTML = '<p class="cart-drawer__empty">Your cart is empty</p>'; return; }
    let html = '';
    cart.items.forEach((item, index) => {
      const image = item.image ? `<img src="${item.image.replace(/\?.*$/, '')}" alt="">` : '';
      html += `
      <div class="cart-item cart-item--compact" data-cart-item data-line="${index + 1}">
        <div class="cart-item__image">${image}</div>
        <div class="cart-item__details">
          <a href="${item.url}" class="cart-item__title">${item.product_title}</a>
          ${item.variant_title && item.variant_title !== 'Default Title' ? `<p class="cart-item__variant">${item.variant_title}</p>` : ''}
          <p class="cart-item__price">${formatMoney(item.final_line_price)}</p>
          <div class="cart-item__qty">
            <button type="button" class="cart-item__qty-btn" data-qty-change="-1" data-line="${index + 1}">-</button>
            <input type="number" value="${item.quantity}" min="0" data-line="${index + 1}" class="cart-item__qty-input" aria-label="Quantity">
            <button type="button" class="cart-item__qty-btn" data-qty-change="1" data-line="${index + 1}">+</button>
          </div>
        </div>
        <button type="button" class="cart-item__remove" data-line-remove="${index + 1}" aria-label="Remove">×</button>
      </div>`;
    });
    cartItemsContainer.innerHTML = html;
    bindCartItemEvents();
  }

  async function updateCart(line, quantity) {
    const body = JSON.stringify({ line, quantity });
    await fetch('/cart/change.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    const cart = await fetchCart();
    updateCartUI(cart);
  }

  async function addToCart(form) {
    const data = new FormData(form);
    const id = data.get('id');
    const quantity = Number(data.get('quantity') || 1);
    if (!id) throw new Error('Please select a variant');
    const res = await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, quantity }) });
    if (!res.ok) throw new Error('Add to cart failed');
    const cart = await fetchCart();
    updateCartUI(cart);
    if (cartDrawer) cartDrawer.classList.add('is-open');
  }

  function bindCartItemEvents() {
    if (!cartItemsContainer) return;
    cartItemsContainer.querySelectorAll('[data-qty-change]').forEach(btn => {
      btn.addEventListener('click', () => {
        const line = btn.dataset.line;
        const input = cartItemsContainer.querySelector(`input[data-line="${line}"]`);
        let qty = parseInt(input.value, 10) + parseInt(btn.dataset.qtyChange, 10);
        if (qty < 0) qty = 0;
        updateCart(line, qty);
      });
    });
    cartItemsContainer.querySelectorAll('[data-line-remove]').forEach(btn => {
      btn.addEventListener('click', () => updateCart(btn.dataset.lineRemove, 0));
    });
    cartItemsContainer.querySelectorAll('.cart-item__qty-input').forEach(input => {
      input.addEventListener('change', () => updateCart(input.dataset.line, parseInt(input.value, 10) || 0));
    });
  }

  document.querySelectorAll('.js-product-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try { await addToCart(form); }
      catch (err) {
        const errorEl = form.querySelector('[data-form-error]');
        if (errorEl) errorEl.textContent = err.message || 'Could not add item.';
      }
    });
  });

  document.querySelectorAll('[data-cart-checkout]').forEach(btn => {
    btn.addEventListener('click', () => window.location.href = '/checkout');
  });

  bindCartItemEvents();
});
