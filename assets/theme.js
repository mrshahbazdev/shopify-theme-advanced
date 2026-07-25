document.addEventListener('DOMContentLoaded', () => {
  const theme = window.theme || {};

  // Mobile menu
  const menuToggle = document.querySelector('.js-menu-toggle');
  const mobileMenu = document.querySelector('.js-mobile-menu');
  const menuClose = document.querySelectorAll('.js-menu-close');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', mobileMenu.classList.contains('is-open'));
    });
    menuClose.forEach(btn => btn.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Search overlay
  const searchToggle = document.querySelector('.js-search-toggle');
  const searchOverlay = document.querySelector('.js-search-overlay');
  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', () => {
      searchOverlay.classList.toggle('is-open');
      searchOverlay.setAttribute('aria-hidden', !searchOverlay.classList.contains('is-open'));
      searchOverlay.querySelector('input')?.focus();
    });
  }

  // Cart drawer
  const cartToggle = document.querySelector('.js-cart-toggle');
  const cartDrawer = document.querySelector('[data-cart-drawer]');
  if (cartToggle && cartDrawer) {
    cartToggle.addEventListener('click', () => cartDrawer.classList.add('is-open'));
    cartDrawer.querySelectorAll('.js-cart-close').forEach(btn => {
      btn.addEventListener('click', () => cartDrawer.classList.remove('is-open'));
    });
  }

  // Sticky header
  const header = document.querySelector('.header');
  if (header && header.dataset.sticky === 'true') {
    let last = 0;
    window.addEventListener('scroll', () => {
      const current = window.pageYOffset;
      if (current > 50) header.classList.add('header--scrolled');
      else header.classList.remove('header--scrolled');
      last = current;
    }, { passive: true });
  }

  // Back to top
  const backTop = document.querySelector('.js-back-to-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('is-visible', window.pageYOffset > 500);
    }, { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Product variant selection
  const productForm = document.querySelector('.js-product-form');
  if (productForm) {
    const variantSelect = productForm.querySelector('[data-variant-select]');
    const optionInputs = productForm.querySelectorAll('[data-option-value], [data-option-index]');
    const submitBtn = productForm.querySelector('[data-add-to-cart]');
    const priceEl = document.querySelector('[data-product-price]');
    const stickyPriceEl = document.querySelector('[data-sticky-price]');
    const variantsScript = document.querySelector('script[data-product-variants]');
    const variants = variantsScript ? JSON.parse(variantsScript.textContent) : [];

    function getSelectedOptions() {
      const options = [];
      const indexes = [...new Set([...optionInputs].map(i => i.dataset.optionIndex))].sort();
      indexes.forEach(idx => {
        const radio = productForm.querySelector(`[data-option-index="${idx}"][type="radio"]:checked`);
        const select = productForm.querySelector(`select[data-option-index="${idx}"]`);
        options.push((radio && radio.value) || (select && select.value) || '');
      });
      return options;
    }

    function renderPrice(price, compare, container) {
      let html = `<span class="price__regular">${formatMoney(price)}</span>`;
      if (compare && compare > price) {
        html = `<s class="price__compare">${formatMoney(compare)}</s><span class="price__sale">${formatMoney(price)}</span>`;
      }
      container.innerHTML = `<div class="price ${compare && compare > price ? 'price--on-sale' : ''}">${html}</div>`;
    }

    function updateVariant() {
      const options = getSelectedOptions();
      const match = variants.find(v => v.option1 === options[0] && v.option2 === options[1] && v.option3 === options[2]);
      if (match && variantSelect) {
        variantSelect.value = match.id;
        if (priceEl) renderPrice(match.price, match.compare_at_price, priceEl);
        if (stickyPriceEl) renderPrice(match.price, match.compare_at_price, stickyPriceEl);
        if (submitBtn) {
          submitBtn.disabled = !match.available;
          submitBtn.textContent = match.available ? (window.theme.strings && window.theme.strings.addToCart) || 'Add to cart' : (window.theme.strings && window.theme.strings.soldOut) || 'Sold out';
        }
      }
    }

    optionInputs.forEach(input => input.addEventListener('change', updateVariant));

    // Quantity stepper
    const qtyDecrement = productForm.querySelector('[data-qty-decrement]');
    const qtyIncrement = productForm.querySelector('[data-qty-increment]');
    const qtyInput = productForm.querySelector('[data-quantity-input]');
    if (qtyDecrement && qtyInput) {
      qtyDecrement.addEventListener('click', () => { qtyInput.value = Math.max(1, parseInt(qtyInput.value || 1, 10) - 1); });
    }
    if (qtyIncrement && qtyInput) {
      qtyIncrement.addEventListener('click', () => { qtyInput.value = parseInt(qtyInput.value || 1, 10) + 1; });
    }

    // Sticky ATC
    const stickyATC = document.querySelector('[data-sticky-atc]');
    const stickyAdd = document.querySelector('[data-sticky-add]');
    if (stickyATC && stickyAdd) {
      const observer = new IntersectionObserver(([entry]) => {
        stickyATC.classList.toggle('is-visible', !entry.isIntersecting);
      }, { threshold: 0 });
      const info = document.querySelector('[data-sticky-info]');
      if (info) observer.observe(info);
      stickyAdd.addEventListener('click', () => productForm.dispatchEvent(new Event('submit', { cancelable: true })));
    }

    // Product media thumbnails & lightbox
    const mediaItems = document.querySelectorAll('.product-media__item');
    const thumbs = document.querySelectorAll('.product-media__thumb');
    const lightbox = document.querySelector('[data-lightbox]');
    const lightboxImg = document.querySelector('[data-lightbox-img]');
    const lightboxClose = document.querySelector('[data-lightbox-close]');

    function updateLightboxSrc() {
      if (!lightboxImg) return;
      const active = document.querySelector('.product-media__item--active img');
      if (active) { lightboxImg.src = active.src; lightboxImg.alt = active.alt; }
    }

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const id = thumb.dataset.mediaId;
        thumbs.forEach(t => t.classList.remove('product-media__thumb--active'));
        thumb.classList.add('product-media__thumb--active');
        mediaItems.forEach(item => item.classList.toggle('product-media__item--active', item.dataset.mediaId === id));
        updateLightboxSrc();
      });
    });

    document.querySelectorAll('[data-lightbox-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        updateLightboxSrc();
        if (lightbox) lightbox.classList.add('is-open');
      });
    });

    if (lightbox) {
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox && lightbox) lightbox.classList.remove('is-open'); });
    }
    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => { if (lightbox) lightbox.classList.remove('is-open'); });
    }
  }

  // Before / after slider
  document.querySelectorAll('[data-before-after]').forEach(wrapper => {
    const slider = wrapper.querySelector('[data-before-after-slider]');
    const imageAfter = wrapper.querySelector('.before-after__image--after');
    if (slider && imageAfter) {
      slider.addEventListener('input', () => {
        wrapper.style.setProperty('--after-clip', `${slider.value}%`);
      });
    }
  });

  // Countdown timers
  document.querySelectorAll('[data-countdown-end]').forEach(el => {
    const end = new Date(el.dataset.countdownEnd).getTime();
    if (!end) return;
    const display = el.querySelector('[data-countdown-display]');
    const message = el.dataset.countdownMessage || (window.theme.strings && window.theme.strings.offerEnded) || 'Offer has ended';
    function tick() {
      const diff = end - Date.now();
      if (diff <= 0) { if (display) display.textContent = message; return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const parts = display ? display.children : [];
      if (parts[0]) parts[0].querySelector('[data-days]').textContent = String(d).padStart(2, '0');
      if (parts[1]) parts[1].querySelector('[data-hours]').textContent = String(h).padStart(2, '0');
      if (parts[2]) parts[2].querySelector('[data-minutes]').textContent = String(m).padStart(2, '0');
      if (parts[3]) parts[3].querySelector('[data-seconds]').textContent = String(s).padStart(2, '0');
    }
    setInterval(tick, 1000); tick();
  });

  // Newsletter popup
  const popup = document.querySelector('[data-newsletter-popup]');
  if (popup) {
    const delay = parseInt(popup.dataset.delay || '5000', 10);
    const frequency = parseInt(popup.dataset.frequency || '7', 10);
    const closed = parseInt(localStorage.getItem('newsletterClosed') || '0', 10);
    if (Date.now() - closed > frequency * 86400000) {
      setTimeout(() => popup.classList.add('is-open'), delay);
    }
    popup.querySelectorAll('.js-popup-close').forEach(btn => btn.addEventListener('click', () => {
      popup.classList.remove('is-open');
      localStorage.setItem('newsletterClosed', Date.now());
    }));
  }

  // Customer login / recover password toggle
  const recoverPasswordLink = document.getElementById('RecoverPassword');
  const hideRecoverLink = document.getElementById('HideRecoverPasswordLink');
  const loginForm = document.getElementById('CustomerLoginForm');
  const recoverForm = document.getElementById('RecoverPasswordForm');
  if (recoverPasswordLink && loginForm && recoverForm) {
    recoverPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.classList.add('hidden');
      recoverForm.classList.remove('hidden');
    });
  }
  if (hideRecoverLink && loginForm && recoverForm) {
    hideRecoverLink.addEventListener('click', (e) => {
      e.preventDefault();
      recoverForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
    });
  }

  // Age verifier
  const ageVerifier = document.querySelector('[data-age-verifier]');
  if (ageVerifier) {
    const passed = sessionStorage.getItem('ageVerified');
    if (passed !== 'true') ageVerifier.classList.add('is-open');
    ageVerifier.querySelector('.js-age-yes')?.addEventListener('click', () => {
      sessionStorage.setItem('ageVerified', 'true');
      ageVerifier.classList.remove('is-open');
    });
    ageVerifier.querySelector('.js-age-no')?.addEventListener('click', () => {
      const redirect = ageVerifier.dataset.redirect || 'https://www.google.com';
      window.location.href = redirect;
    });
  }
});

function formatMoney(cents) {
  const fmt = (window.theme && window.theme.moneyFormat) || '${{ amount }}';
  return fmt.replace(/\{\{\s*amount\s*\}\}/, (cents / 100).toFixed(2));
}
window.formatMoney = formatMoney;
