/* ==========================================================================
   EDITÉ CLUB — LUXURY EDITORIAL FASHION DISCOVERY & SUBSCRIPTION CLUB
   JAVASCRIPT CORE APPLICATION ARCHITECTURE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initNavigation();
  initScrollProgress();
  initBackToTop();
  initRevealAnimations();
  initPageTransitions();
  initWishlist();
  initAuthentication();
  initModals();
  initAdminControls();
  initGlobalAddToBox();

  // Page-specific initializations
  if (document.body.classList.contains('page-discover')) {
    initImageFilters();
  }
  if (document.body.classList.contains('page-quiz')) {
    initStyleQuiz();
  }
  if (document.body.classList.contains('page-box-builder')) {
    initBoxBuilder();
  }
  if (document.body.classList.contains('page-dashboard')) {
    initDashboard();
  }
});

/* --------------------------------------------------------------------------
   1. CUSTOM CURSOR (DESKTOP ONLY)
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor || window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover triggers
  document.querySelectorAll('img, .reveal-image, .category-rail-item, .discover-item-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover-image');
      cursor.textContent = 'VIEW';
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover-image');
      cursor.textContent = '';
    });
  });

  document.querySelectorAll('button, a, .btn-editorial, .quiz-option-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (!cursor.classList.contains('hover-image')) {
        cursor.classList.add('hover-button');
      }
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover-button');
    });
  });
}

/* --------------------------------------------------------------------------
   2. NAVIGATION & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavigation() {
  const siteNav = document.getElementById('site-nav');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const closeMobile = document.getElementById('close-mobile-nav');

  if (siteNav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        siteNav.classList.add('scrolled');
      } else {
        siteNav.classList.remove('scrolled');
      }
    });
  }

  // Highlight active link in desktop navbar & mobile hamburger drawer
  const rawPath = window.location.pathname.split('/').pop();
  const currentFile = (!rawPath || rawPath === '') ? 'index.html' : rawPath.toLowerCase();

  document.querySelectorAll('.nav-link-item, .mobile-nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (href === currentFile) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeMobile && mobileDrawer) {
    closeMobile.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
}

/* --------------------------------------------------------------------------
   3. SCROLL PROGRESS
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  });
}

function initBackToTop() {
  let btn = document.getElementById('btn-back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'btn-back-to-top';
    btn.className = 'btn-back-to-top';
    btn.setAttribute('aria-label', 'Back to Top');
    btn.setAttribute('title', 'Back to Top');
    btn.innerHTML = '<span>TOP</span> ↑';
    document.body.appendChild(btn);
  }

  const checkScroll = () => {
    if (window.scrollY > 160) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function initRevealAnimations() {
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // High-Fashion Curtain Reveal for Images
  const revealImages = document.querySelectorAll('.reveal-image');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, { threshold: 0.1 });

  revealImages.forEach(img => imgObserver.observe(img));

  // Signature Animation: "CURATED FLOW"
  const flowSections = document.querySelectorAll('.curated-flow');
  const flowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        const verticalTag = section.querySelector('.vertical-label');
        const numBadge = section.querySelector('.editorial-number');
        const imgTarget = section.querySelector('.flow-shift-img');

        if (verticalTag) verticalTag.style.color = 'var(--accent)';
        if (numBadge) numBadge.style.transform = 'scale(1.08)';
        if (imgTarget) imgTarget.style.transform = 'translateY(-12px) scale(1.03)';
      }
    });
  }, { threshold: 0.25 });

  flowSections.forEach(sec => flowObserver.observe(sec));
}

/* --------------------------------------------------------------------------
   5. PAGE TRANSITION OVERLAY
   -------------------------------------------------------------------------- */
function initPageTransitions() {
  const overlay = document.getElementById('page-transition-overlay');
  if (!overlay) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('http') && !link.hasAttribute('target')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      });
    }
  });
}

/* --------------------------------------------------------------------------
   6. WISHLIST MANAGEMENT (LOCALSTORAGE)
   -------------------------------------------------------------------------- */
function getWishlist() {
  return JSON.parse(localStorage.getItem('edite_wishlist')) || [];
}

function saveWishlist(list) {
  localStorage.setItem('edite_wishlist', JSON.stringify(list));
  updateWishlistCountBadge();
}

function updateWishlistCountBadge() {
  const list = getWishlist();
  document.querySelectorAll('.wishlist-count-badge').forEach(b => {
    b.textContent = list.length;
  });
}

function initWishlist() {
  updateWishlistCountBadge();

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-save-wishlist');
    if (!btn) return;

    e.preventDefault();
    const itemId = btn.dataset.itemId;
    const itemTitle = btn.dataset.itemTitle || 'Fashion Item';
    const itemImg = btn.dataset.itemImg || '';
    const itemPrice = btn.dataset.itemPrice || '₹3,499';

    let wishlist = getWishlist();
    const existsIndex = wishlist.findIndex(i => i.id === itemId);

    if (existsIndex > -1) {
      wishlist.splice(existsIndex, 1);
      btn.classList.remove('saved');
      showNotification(`Removed "${itemTitle}" from saved collection`);
    } else {
      wishlist.push({ id: itemId, title: itemTitle, img: itemImg, price: itemPrice });
      btn.classList.add('saved');
      showNotification(`Added "${itemTitle}" to saved collection`);
    }
    saveWishlist(wishlist);
  });
}

/* --------------------------------------------------------------------------
   7. DISCOVER PAGE FILTERS & QUICK VIEW MODAL
   -------------------------------------------------------------------------- */
function initImageFilters() {
  const filterBtns = document.querySelectorAll('.btn-filter');
  const items = document.querySelectorAll('.discover-item-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;
      items.forEach(item => {
        const itemCategory = item.dataset.category;
        if (filterVal === 'all' || itemCategory === filterVal) {
          item.style.display = 'block';
          item.classList.add('reveal-on-scroll', 'is-visible');
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

function initModals() {
  const modalBackdrop = document.getElementById('quickview-modal');
  const modalClose = document.getElementById('modal-close-btn');

  if (!modalBackdrop) return;

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.btn-quickview');
    if (!trigger) return;

    const title = trigger.dataset.title;
    const category = trigger.dataset.category;
    const price = trigger.dataset.price;
    const img = trigger.dataset.img;
    const desc = trigger.dataset.desc || 'Hand-curated piece crafted with organic silk-linen blend.';
    const pairing = trigger.dataset.pairing || 'Pairs effortlessly with wide-leg wool trousers and leather slides.';

    document.getElementById('modal-img').src = img;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-category').textContent = category;
    document.getElementById('modal-price').textContent = price;
    document.getElementById('modal-desc').textContent = desc;
    document.getElementById('modal-pairing').textContent = pairing;

    // Set dataset for modal Add to Box & Wishlist buttons
    const addBoxBtn = document.getElementById('modal-btn-addbox');
    if (addBoxBtn) {
      addBoxBtn.dataset.itemId = trigger.dataset.id;
      addBoxBtn.dataset.itemTitle = title;
      addBoxBtn.dataset.itemPrice = price;
      addBoxBtn.dataset.itemImg = img;
    }

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* --------------------------------------------------------------------------
   8. STYLE QUIZ INTERACTION
   -------------------------------------------------------------------------- */
function initStyleQuiz() {
  let currentStep = 1;
  const totalSteps = 6;
  const userAnswers = {};

  const progressFill = document.getElementById('quiz-progress-fill');
  const stepCounter = document.getElementById('quiz-step-counter');
  const btnNext = document.getElementById('btn-quiz-next');
  const btnPrev = document.getElementById('btn-quiz-prev');

  function updateQuizUI() {
    document.querySelectorAll('.quiz-question-step').forEach(step => {
      step.classList.remove('active');
    });

    const activeStepEl = document.getElementById(`quiz-step-${currentStep}`);
    if (activeStepEl) activeStepEl.classList.add('active');

    if (progressFill) progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;
    if (stepCounter) stepCounter.textContent = `0${currentStep} / 0${totalSteps}`;

    if (btnPrev) btnPrev.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    if (btnNext) {
      btnNext.textContent = currentStep === totalSteps ? 'VIEW MY STYLE PROFILE' : 'NEXT QUESTION';
    }
  }

  document.querySelectorAll('.quiz-option-card').forEach(card => {
    card.addEventListener('click', () => {
      const stepEl = card.closest('.quiz-question-step');
      stepEl.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      userAnswers[currentStep] = card.dataset.value;
    });
  });

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (!userAnswers[currentStep]) {
        showNotification('Please select an option to continue');
        return;
      }

      if (currentStep < totalSteps) {
        currentStep++;
        updateQuizUI();
      } else {
        finishQuiz(userAnswers);
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateQuizUI();
      }
    });
  }
}

function finishQuiz(answers) {
  const profileTypes = [
    { title: 'THE MODERN MINIMALIST', desc: 'Architectural silhouettes, clean neutral palettes, and effortless tailored elegance.' },
    { title: 'ELEVATED ARCHITECT', desc: 'Structured wools, sharp lines, and sculptural monochrome statements.' },
    { title: 'AVANT-GARDE CURATOR', desc: 'Artistic draping, rich textures, and unexpected vintage accents.' }
  ];

  const result = profileTypes[Math.floor(Math.random() * profileTypes.length)];
  localStorage.setItem('edite_style_profile', JSON.stringify({
    type: result.title,
    desc: result.desc,
    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }));

  document.getElementById('quiz-interactive-area').style.display = 'none';
  const resultArea = document.getElementById('quiz-result-area');
  resultArea.style.display = 'block';

  document.getElementById('result-profile-title').textContent = result.title;
  document.getElementById('result-profile-desc').textContent = result.desc;

  setTimeout(() => {
    document.querySelectorAll('.trait-progress-fill').forEach(bar => {
      bar.style.width = `${bar.dataset.target}%`;
    });
  }, 200);
}

/* --------------------------------------------------------------------------
   8.5 GLOBAL ADD TO BOX HANDLER
   -------------------------------------------------------------------------- */
function initGlobalAddToBox() {
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add-to-box');
    if (!addBtn || addBtn.id === 'modal-btn-addbox') return;

    const title = addBtn.dataset.itemTitle || 'Curated Fashion Piece';
    const price = addBtn.dataset.itemPrice || '₹4,999';
    const id = addBtn.dataset.itemId || Date.now().toString();

    let boxItems = JSON.parse(localStorage.getItem('edite_box_items')) || [];
    boxItems.push({ id, title, price });
    localStorage.setItem('edite_box_items', JSON.stringify(boxItems));

    // UI Feedback
    addBtn.classList.add('added');
    const origText = addBtn.innerHTML;
    addBtn.innerHTML = '✓ ADDED';

    setTimeout(() => {
      addBtn.classList.remove('added');
      addBtn.innerHTML = origText;
    }, 2000);

    showNotification(`Added "${title}" to your curated box`);
  });
}

/* --------------------------------------------------------------------------
   9. BOX BUILDER INTERACTION
   -------------------------------------------------------------------------- */
function initBoxBuilder() {
  let boxItems = JSON.parse(localStorage.getItem('edite_box_items')) || [];
  let currentTier = 'Signature';
  let tierPrice = 6999;

  const previewList = document.getElementById('box-items-list');
  const countBadge = document.getElementById('box-item-count');
  const priceDisplay = document.getElementById('box-est-price');

  function renderBoxPreview() {
    if (!previewList) return;
    previewList.innerHTML = '';

    if (boxItems.length === 0) {
      previewList.innerHTML = `<li class="text-muted text-center py-3" style="font-size: 0.8rem;">Your curated box is currently empty. Select items below.</li>`;
    } else {
      boxItems.forEach((item, idx) => {
        const li = document.createElement('li');
        li.className = 'box-item-row';
        li.innerHTML = `
          <span>${item.title}</span>
          <div class="d-flex align-items-center gap-2">
            <span class="text-muted">${item.price}</span>
            <button class="btn-remove-box-item" data-index="${idx}">✕</button>
          </div>
        `;
        previewList.appendChild(li);
      });
    }

    if (countBadge) countBadge.textContent = boxItems.length < 10 ? `0${boxItems.length}` : boxItems.length;
    if (priceDisplay) priceDisplay.textContent = `₹${(tierPrice + (boxItems.length * 1200)).toLocaleString()}`;

    localStorage.setItem('edite_box_items', JSON.stringify(boxItems));
  }

  // Tier selection buttons
  document.querySelectorAll('.tier-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tier-select-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentTier = btn.dataset.tier;
      tierPrice = parseInt(btn.dataset.price);
      renderBoxPreview();
    });
  });

  // Add Item to Box handler
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add-to-box');
    if (!addBtn) return;

    const title = addBtn.dataset.itemTitle || 'Curated Fashion Piece';
    const price = addBtn.dataset.itemPrice || '₹2,499';
    const id = addBtn.dataset.itemId || Date.now().toString();

    boxItems.push({ id, title, price });

    // Animate preview box icon
    const boxVis = document.getElementById('box-visual');
    if (boxVis) {
      boxVis.style.transform = 'scale(1.05)';
      boxVis.style.borderColor = 'var(--accent)';
      setTimeout(() => {
        boxVis.style.transform = 'scale(1)';
        boxVis.style.borderColor = 'var(--line)';
      }, 400);
    }

    showNotification(`Added "${title}" to your curated box`);
    renderBoxPreview();
  });

  // Remove Item from Box
  if (previewList) {
    previewList.addEventListener('click', (e) => {
      const rmBtn = e.target.closest('.btn-remove-box-item');
      if (!rmBtn) return;
      const idx = parseInt(rmBtn.dataset.index);
      boxItems.splice(idx, 1);
      renderBoxPreview();
    });
  }

  // Confirm Box Button
  const confirmBtn = document.getElementById('btn-confirm-box');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (boxItems.length === 0) {
        showNotification('Please add at least one item to build your box');
        return;
      }
      localStorage.setItem('edite_active_subscription', JSON.stringify({
        status: 'Active',
        tier: currentTier,
        frequency: 'Monthly',
        nextDate: '18 Nov 2026',
        itemsCount: boxItems.length,
        price: `₹${(tierPrice + (boxItems.length * 1200)).toLocaleString()}`
      }));
      showNotification('Subscription box confirmed! Redirecting to Discovery archive...');
      setTimeout(() => {
        window.location.href = 'discover.html';
      }, 1000);
    });
  }

  renderBoxPreview();
}

/* --------------------------------------------------------------------------
   10. DASHBOARD INTERACTIONS
   -------------------------------------------------------------------------- */
function initDashboard() {
  const user = JSON.parse(localStorage.getItem('edite_user')) || { name: 'Alex Vance', email: 'alex.vance@edite.club' };
  const profile = JSON.parse(localStorage.getItem('edite_style_profile')) || { type: 'THE MODERN MINIMALIST', desc: 'Architectural silhouettes, clean neutral palettes, and effortless tailored elegance.' };
  const sub = JSON.parse(localStorage.getItem('edite_active_subscription')) || {
    status: 'Active',
    tier: 'SIGNATURE BOX',
    frequency: 'Monthly',
    nextDate: '18 Oct 2026',
    itemsCount: 4,
    price: '₹6,999'
  };

  const userNameEl = document.getElementById('dash-user-name');
  const userEmailEl = document.getElementById('dash-user-email');
  const styleTypeEl = document.getElementById('dash-style-type');
  const subStatusEl = document.getElementById('dash-sub-status');
  const subTierEl = document.getElementById('dash-sub-tier');
  const subNextEl = document.getElementById('dash-sub-next');

  if (userNameEl) userNameEl.textContent = user.name.toUpperCase();
  if (userEmailEl) userEmailEl.textContent = user.email;
  if (styleTypeEl) styleTypeEl.textContent = profile.type;

  if (subStatusEl) subStatusEl.textContent = sub.status;
  if (subTierEl) subTierEl.textContent = sub.tier;
  if (subNextEl) subNextEl.textContent = sub.nextDate;

  // Saved items gallery render
  const savedGallery = document.getElementById('dash-saved-items');
  if (savedGallery) {
    const wishlist = getWishlist();
    if (wishlist.length === 0) {
      savedGallery.innerHTML = `<div class="col-12 text-muted py-4">No saved looks in your collection yet. Explore the Discover page to save favorites.</div>`;
    } else {
      savedGallery.innerHTML = wishlist.map(item => `
        <div class="col-6 col-md-4 mb-4">
          <div class="discover-item-card">
            <div class="item-img-container" style="height: 280px;">
              <img src="${item.img || 'assets/images/1.jpg'}" alt="${item.title}">
            </div>
            <div class="item-card-body p-3">
              <div class="item-title" style="font-size: 1.1rem;">${item.title}</div>
              <div class="item-meta"><span>${item.price}</span></div>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Subscription Control Actions
  const btnPause = document.getElementById('btn-pause-sub');
  const btnCancel = document.getElementById('btn-cancel-sub');

  if (btnPause) {
    btnPause.addEventListener('click', () => {
      sub.status = sub.status === 'Paused' ? 'Active' : 'Paused';
      localStorage.setItem('edite_active_subscription', JSON.stringify(sub));
      if (subStatusEl) subStatusEl.textContent = sub.status;
      btnPause.textContent = sub.status === 'Paused' ? 'RESUME SUBSCRIPTION' : 'PAUSE SUBSCRIPTION';
      showNotification(`Subscription status updated to: ${sub.status}`);
    });
  }

  if (btnCancel) {
    btnCancel.addEventListener('click', () => {
      if (confirm('Are you sure you want to cancel your demo subscription?')) {
        sub.status = 'Cancelled';
        localStorage.setItem('edite_active_subscription', JSON.stringify(sub));
        if (subStatusEl) subStatusEl.textContent = 'Cancelled';
        showNotification('Subscription cancelled');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   11. AUTHENTICATION (DEMO LOCALSTORAGE)
   -------------------------------------------------------------------------- */
function initAuthentication() {
  const authModal = document.getElementById('auth-modal');
  const authClose = document.getElementById('auth-modal-close');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  document.querySelectorAll('#btn-open-auth, .btn-open-auth').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (mobileDrawer) {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      }
      if (authModal) authModal.classList.add('active');
    });
  });

  if (authClose && authModal) {
    authClose.addEventListener('click', () => authModal.classList.remove('active'));
  }

  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const name = email.split('@')[0];
      const user = { name, email };
      localStorage.setItem('edite_user', JSON.stringify(user));
      showNotification(`Welcome back, ${name}!`);
      if (authModal) authModal.classList.remove('active');
      setTimeout(() => window.location.reload(), 600);
    });
  }

  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const user = { name, email };
      localStorage.setItem('edite_user', JSON.stringify(user));
      showNotification(`Welcome to EDITÉ CLUB, ${name}!`);
      if (authModal) authModal.classList.remove('active');
      setTimeout(() => window.location.reload(), 600);
    });
  }

  // Update navbar user status
  const user = JSON.parse(localStorage.getItem('edite_user'));
  if (user) {
    document.querySelectorAll('#btn-open-auth, .btn-open-auth').forEach(btn => {
      btn.textContent = user.name.split(' ')[0].toUpperCase();
    });
  }
}

/* --------------------------------------------------------------------------
   12. ADMIN MANAGEMENT CONTROLS (FRONTEND DEMO)
   -------------------------------------------------------------------------- */
function initAdminControls() {
  const adminDrawer = document.getElementById('admin-drawer');
  const btnCloseAdmin = document.getElementById('btn-close-admin');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  document.querySelectorAll('#btn-toggle-admin, .btn-toggle-admin').forEach(btn => {
    btn.addEventListener('click', () => {
      if (mobileDrawer) {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      }
      if (adminDrawer) {
        adminDrawer.classList.add('open');
        renderAdminTable();
      }
    });
  });

  if (btnCloseAdmin && adminDrawer) {
    btnCloseAdmin.addEventListener('click', () => adminDrawer.classList.remove('open'));
  }
}

const ADMIN_MEMBERS_KEY = 'edite_admin_members';

function getAdminMembers() {
  const saved = JSON.parse(localStorage.getItem(ADMIN_MEMBERS_KEY));
  if (saved && saved.length) return saved;
  return [
    { name: 'Alex Vance', email: 'alex@edite.club', plan: 'Signature', status: 'Active', profile: 'Modern Minimalist' },
    { name: 'Elena Rostova', email: 'elena@vogue.co', plan: 'Collector', status: 'Active', profile: 'Avant-Garde' },
    { name: 'Marcus Sterling', email: 'marcus@arch.org', plan: 'Edit Box', status: 'Paused', profile: 'Elevated Architect' },
    { name: 'Chloe Laurent', email: 'chloe@paris.fr', plan: 'Signature', status: 'Active', profile: 'Minimalist' }
  ];
}

function renderAdminTable() {
  const body = document.getElementById('admin-table-body');
  if (!body) return;

  const members = getAdminMembers();

  body.innerHTML = members.map((m, idx) => `
    <tr>
      <td><strong>${m.name}</strong><br><small class="text-muted" style="font-size: 0.72rem;">${m.email}</small></td>
      <td style="font-size: 0.75rem; font-weight: 500;">${m.plan}</td>
      <td><span class="admin-status-badge ${m.status.toLowerCase()}">${m.status}</span></td>
      <td style="font-size: 0.72rem; color: var(--muted);">${m.profile}</td>
      <td>
        <button class="btn-admin-action-toggle ${m.status === 'Active' ? 'is-active' : 'is-paused'}" onclick="toggleAdminMemberStatus(${idx})">
          ${m.status === 'Active' ? 'Pause' : 'Activate'}
        </button>
      </td>
    </tr>
  `).join('');
}

function toggleAdminMemberStatus(idx) {
  const members = getAdminMembers();
  const member = members[idx];
  if (!member) return;

  member.status = member.status === 'Active' ? 'Paused' : 'Active';
  localStorage.setItem(ADMIN_MEMBERS_KEY, JSON.stringify(members));
  renderAdminTable();
  showNotification(`${member.name} is now ${member.status}`);
}

/* --------------------------------------------------------------------------
   13. HELPER UTILITIES
   -------------------------------------------------------------------------- */
function showNotification(msg) {
  let toast = document.getElementById('edite-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'edite-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background-color: var(--ink);
      color: var(--paper);
      padding: 1rem 1.8rem;
      font-family: var(--font-sans);
      font-size: 0.8rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      z-index: 9999;
      border: 1px solid var(--accent);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      transition: transform 0.4s var(--ease-editorial), opacity 0.4s ease;
      opacity: 0;
      transform: translateY(20px);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 3500);
}
