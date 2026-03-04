/* ============================================
   DOODLETYPE — MAIN JS
   No build step required. Vanilla ES6+.
   ============================================ */

'use strict';

/* ---- Fade-in on scroll ---- */
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ---- Header scroll behavior ---- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    if (current > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = current;
  }, { passive: true });
}

/* ---- Mobile Menu ---- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = mobileMenu?.querySelector('.mobile-menu__close');
  const overlay = mobileMenu?.querySelector('.mobile-menu__overlay');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  // Close on escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });
}

/* ---- Cart Drawer ---- */
function initCartDrawer() {
  const cartTrigger = document.getElementById('cart-trigger');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartClose = cartDrawer?.querySelector('.cart-drawer__close');
  const overlay = cartDrawer?.querySelector('.cart-drawer__overlay');

  if (!cartTrigger || !cartDrawer) return;

  function openCart() {
    fetchCart();
    cartDrawer.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cartTrigger.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', closeCart);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && cartDrawer.classList.contains('open')) closeCart();
  });

  // Also open cart after add-to-cart
  document.addEventListener('cart:open', openCart);
}

/* ---- Fetch & Render Cart ---- */
function fetchCart() {
  fetch('/cart.js')
    .then(res => res.json())
    .then(cart => renderCart(cart))
    .catch(err => console.error('Cart fetch error:', err));
}

function renderCart(cart) {
  const body = document.getElementById('cart-drawer-body');
  const subtotal = document.getElementById('cart-subtotal');
  const cartCount = document.getElementById('cart-count');

  if (cartCount) {
    cartCount.textContent = cart.item_count;
    cartCount.style.display = cart.item_count > 0 ? 'flex' : 'none';
  }

  if (subtotal) {
    subtotal.textContent = formatMoney(cart.total_price);
  }

  if (!body) return;

  if (cart.item_count === 0) {
    body.innerHTML = `
      <div class="cart-drawer-empty">
        <p>Your cart is empty.</p>
        <a href="/collections/all" style="color: var(--color-red); font-weight: 800; text-decoration: underline;">Shop Characters →</a>
      </div>
    `;
    return;
  }

  const items = cart.items.map(item => `
    <div class="drawer-item" data-key="${item.key}">
      <img
        src="${item.image || ''}"
        alt="${escapeHtml(item.product_title)}"
        class="drawer-item__image"
        loading="lazy"
      >
      <div class="drawer-item__details">
        <p class="drawer-item__title">${escapeHtml(item.product_title)}</p>
        ${item.variant_title && item.variant_title !== 'Default Title'
          ? `<p class="drawer-item__variant">${escapeHtml(item.variant_title)}</p>`
          : ''}
        <div class="drawer-item__bottom">
          <span class="drawer-item__price">${formatMoney(item.final_line_price)}</span>
          <button class="drawer-item__remove" data-key="${item.key}">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  body.innerHTML = items;

  // Attach remove handlers
  body.querySelectorAll('.drawer-item__remove').forEach(btn => {
    btn.addEventListener('click', function() {
      removeFromCart(this.dataset.key);
    });
  });
}

function removeFromCart(key) {
  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: key, quantity: 0 })
  })
  .then(res => res.json())
  .then(cart => renderCart(cart))
  .catch(err => console.error('Remove from cart error:', err));
}

/* ---- Ajax Add to Cart ---- */
function initAddToCart() {
  const form = document.getElementById('product-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Adding...';

    const formData = new FormData(form);

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    })
    .then(res => {
      if (!res.ok) return res.json().then(err => Promise.reject(err));
      return res.json();
    })
    .then(item => {
      btn.textContent = 'Added! ✓';
      btn.style.background = '#22c55e';
      updateCartCount();

      // Open cart drawer
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('cart:open'));
      }, 300);

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 2000);
    })
    .catch(err => {
      console.error('Add to cart error:', err);
      btn.textContent = err.description || 'Error — try again';
      btn.style.background = 'var(--color-red)';
      btn.disabled = false;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 2500);
    });
  });
}

function updateCartCount() {
  fetch('/cart.js')
    .then(res => res.json())
    .then(cart => {
      const count = document.getElementById('cart-count');
      if (count) {
        count.textContent = cart.item_count;
        count.style.display = cart.item_count > 0 ? 'flex' : 'none';
      }

      const subtotal = document.getElementById('cart-subtotal');
      if (subtotal) subtotal.textContent = formatMoney(cart.total_price);
    });
}

/* ---- Email Signup ---- */
function initEmailSignup() {
  const form = document.getElementById('email-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    // Let Shopify handle the native form submission
    // This just adds a nice UX overlay
    const success = document.getElementById('email-success');
    if (success) {
      setTimeout(() => {
        form.style.display = 'none';
        success.style.display = 'block';
      }, 500);
    }
  });
}

/* ---- Smooth anchor scroll ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---- Marquee speed from section settings ---- */
function initMarquee() {
  document.querySelectorAll('.marquee-content').forEach(marquee => {
    // Speed is hardcoded in CSS; can be overridden via data attributes if needed
  });
}

/* ---- Utilities ---- */
function formatMoney(cents) {
  const dollars = (cents / 100).toFixed(2);
  return '$' + dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', function() {
  initFadeIn();
  initHeader();
  initMobileMenu();
  initCartDrawer();
  initAddToCart();
  initEmailSignup();
  initSmoothScroll();
  initMarquee();
});

/* ---- Expose for Shopify section re-rendering ---- */
window.DoodleType = {
  fetchCart,
  renderCart,
  updateCartCount,
  formatMoney
};
