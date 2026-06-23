document.addEventListener('DOMContentLoaded', () => {
  
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- STATE MANAGEMENT ---
  const state = {
    wishlist: JSON.parse(localStorage.getItem('aura_wishlist')) || [],
    compare: JSON.parse(localStorage.getItem('aura_compare')) || [],
    activeModalCar: null,
    modalViewerMode: 'gallery', // 'gallery' or '360'
    activeAngleIndex: 0,
    theme: localStorage.getItem('aura_theme') || 'dark'
  };

  // --- THEME INITIALIZATION ---
  if (state.theme === 'light') {
    document.body.classList.add('light-theme');
    document.getElementById('theme-icon-sun').style.display = 'block';
    document.getElementById('theme-icon-moon').style.display = 'none';
  }

  // --- SELECTORS ---
  const loader = document.getElementById('loader');
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  const filterBrand = document.getElementById('filter-brand');
  const filterPrice = document.getElementById('filter-price');
  const filterFuel = document.getElementById('filter-fuel');
  const filterTransmission = document.getElementById('filter-transmission');
  const filterYear = document.getElementById('filter-year');
  const filterResetBtn = document.getElementById('filter-reset-btn');
  const carsCountDisplay = document.getElementById('cars-count-display');
  const carCardsContainer = document.getElementById('car-cards-container');

  const wishlistToggle = document.getElementById('wishlist-toggle');
  const wishlistDrawer = document.getElementById('wishlist-drawer');
  const wishlistClose = document.getElementById('wishlist-close');
  const wishlistDrawerBody = document.getElementById('wishlist-drawer-body');
  const wishlistBadge = document.getElementById('wishlist-badge');

  const compareToggle = document.getElementById('compare-toggle');
  const compareDrawer = document.getElementById('compare-drawer');
  const compareClose = document.getElementById('compare-close');
  const compareGridContainer = document.getElementById('compare-grid-container');
  const compareBadge = document.getElementById('compare-badge');

  const themeToggle = document.getElementById('theme-toggle');

  // Modal Selectors
  const quickviewModal = document.getElementById('quickview-modal');
  const modalClose = document.getElementById('modal-close');
  const btnShowGallery = document.getElementById('btn-show-gallery');
  const btnShow360 = document.getElementById('btn-show-360');
  const modalPreviewFrame = document.getElementById('modal-preview-frame');
  const modalActiveImg = document.getElementById('modal-active-img');
  const overlay360Drag = document.getElementById('overlay-360-drag');
  const modalThumbsContainer = document.getElementById('modal-thumbs-container');
  
  const modalCarBrand = document.getElementById('modal-car-brand');
  const modalCarName = document.getElementById('modal-car-name');
  const specEngine = document.getElementById('spec-engine');
  const specHp = document.getElementById('spec-hp');
  const specAccel = document.getElementById('spec-accel');
  const specTop = document.getElementById('spec-top');
  const specDrivetrain = document.getElementById('spec-drivetrain');
  const specTransmission = document.getElementById('spec-transmission');

  const calcDownpayment = document.getElementById('calc-downpayment');
  const calcTerm = document.getElementById('calc-term');
  const calcMonthlyEst = document.getElementById('calc-monthly-est');
  const btnModalReserve = document.getElementById('btn-modal-reserve');

  // --- LOADER ---
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = 0;
      loader.style.visibility = 'hidden';
      animateHeroStats();
    }, 1200);
  });

  // --- FLOATING CANVAS PARTICLES ---
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particlesArray = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      else if (this.x < 0) this.x = canvas.width;

      if (this.y > canvas.height) this.y = 0;
      else if (this.y < 0) this.y = canvas.height;
    }
    draw() {
      ctx.save();
      const isLightTheme = document.body.classList.contains('light-theme');
      ctx.fillStyle = isLightTheme ? `rgba(154, 120, 70, ${this.alpha})` : `rgba(197, 168, 128, ${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = isLightTheme ? 'rgba(154, 120, 70, 0.3)' : 'rgba(197, 168, 128, 0.4)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    particlesArray = [];
    const numberOfParticles = Math.min(60, Math.floor((canvas.width * canvas.height) / 25000));
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();
  window.addEventListener('resize', initParticles);

  // --- HEADER SCROLL ACTION ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- MOBILE MENU TOGGLE ---
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // --- LIGHT/DARK MODE TOGGLE ---
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    
    document.getElementById('theme-icon-sun').style.display = isLight ? 'block' : 'none';
    document.getElementById('theme-icon-moon').style.display = isLight ? 'none' : 'block';
    
    state.theme = isLight ? 'light' : 'dark';
    localStorage.setItem('aura_theme', state.theme);
  });

  // --- HERO SLIDESHOW AUTOMATION ---
  const heroSlider = document.getElementById('hero-slider');
  const heroSlides = heroSlider.querySelectorAll('.hero-slide');
  let currentHeroSlide = 0;

  function nextHeroSlide() {
    heroSlides[currentHeroSlide].classList.remove('active');
    currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
    heroSlides[currentHeroSlide].classList.add('active');
  }
  setInterval(nextHeroSlide, 5000);

  // --- STATS COUNTING ANIMATION ---
  function animateHeroStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = target >= 12000 ? '+' : (target === 150 ? '+' : '+');
      
      if (window.gsap) {
        window.gsap.to(stat, {
          innerText: target,
          duration: 2.5,
          ease: 'power4.out',
          snap: { innerText: 1 },
          onUpdate: function () {
            stat.innerHTML = Math.ceil(this.targets()[0].innerText).toLocaleString() + suffix;
          }
        });
      } else {
        // Fallback standard JS interval
        let count = 0;
        const increment = Math.ceil(target / 80);
        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            stat.innerText = target.toLocaleString() + suffix;
            clearInterval(timer);
          } else {
            stat.innerText = count.toLocaleString() + suffix;
          }
        }, 30);
      }
    });
  }

  // --- RENDERING INVENTORY CARDS ---
  function renderCarsGrid(filteredCars = carsData) {
    carCardsContainer.innerHTML = '';
    carsCountDisplay.innerText = `Showing ${filteredCars.length} luxury vehicles`;

    if (filteredCars.length === 0) {
      carCardsContainer.innerHTML = `
        <div class="drawer-empty-msg" style="grid-column: 1/-1; padding: 6rem 0;">
          No vehicles match the selected filter criteria. Please reset filters.
        </div>
      `;
      return;
    }

    filteredCars.forEach(car => {
      const isWishlisted = state.wishlist.includes(car.id);
      const isCompared = state.compare.includes(car.id);

      const cardWrapper = document.createElement('div');
      cardWrapper.className = 'car-card-wrapper';
      
      cardWrapper.innerHTML = `
        <div class="car-card glass" data-id="${car.id}">
          <span class="card-badge-top">${car.year}</span>
          <div class="card-actions-top">
            <button class="card-action-btn ${isWishlisted ? 'active' : ''}" data-action="wishlist" aria-label="Add to Wishlist">
              <i data-lucide="heart" style="${isWishlisted ? 'fill: currentColor;' : ''}"></i>
            </button>
            <button class="card-action-btn ${isCompared ? 'active' : ''}" data-action="compare" aria-label="Compare Car">
              <i data-lucide="git-compare"></i>
            </button>
          </div>
          <div class="car-card-img">
            <img src="${car.image}" alt="${car.name}" loading="lazy">
          </div>
          <div class="car-card-content">
            <div class="car-card-brand">${car.brand}</div>
            <h3 class="car-card-title">${car.name}</h3>
            
            <div class="car-card-specs">
              <div class="spec-info">
                <span class="spec-val">${car.hp} hp</span>
                <span class="spec-lbl">Power</span>
              </div>
              <div class="spec-info">
                <span class="spec-val">${car.acceleration}</span>
                <span class="spec-lbl">0-60 mph</span>
              </div>
              <div class="spec-info">
                <span class="spec-val">${car.topSpeed}</span>
                <span class="spec-lbl">Top Speed</span>
              </div>
            </div>
            
            <div class="car-card-footer">
              <div class="car-card-price">
                <span class="price-lbl">Starting Price</span>
                <span class="price-val">$${car.price.toLocaleString()}</span>
              </div>
              <button class="btn btn-secondary btn-quickview" data-action="quickview" style="padding: 0.7rem 1.2rem; font-size: 0.75rem;">
                Explore <i data-lucide="arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      carCardsContainer.appendChild(cardWrapper);
    });

    // Re-create icons for new DOM elements
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Attach card event listeners (3D tilt & buttons)
    attachCardListeners();
  }

  // Tilt Animation variables
  function attachCardListeners() {
    const cards = document.querySelectorAll('.car-card');
    cards.forEach(card => {
      // 3D Tilt Effect on mousemove
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = rect.width;
        const height = rect.height;

        const rotateX = ((y / height) - 0.5) * -15; // Max 15 deg
        const rotateY = ((x / width) - 0.5) * 15;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      });

      // Actions buttons click inside card
      card.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('.card-action-btn') || e.target.closest('.btn-quickview');
        if (!actionBtn) return;

        const carId = card.getAttribute('data-id');
        const action = actionBtn.getAttribute('data-action');

        if (action === 'wishlist') {
          toggleWishlist(carId, actionBtn);
        } else if (action === 'compare') {
          toggleCompare(carId, actionBtn);
        } else if (action === 'quickview') {
          openQuickviewModal(carId);
        }
      });
    });
  }

  // --- FILTER SYSTEM ---
  function applyFilters() {
    const brand = filterBrand.value;
    const maxPrice = filterPrice.value;
    const fuel = filterFuel.value;
    const transmission = filterTransmission.value;
    const year = filterYear.value;

    const filtered = carsData.filter(car => {
      if (brand !== 'all' && car.brand !== brand) return false;
      if (maxPrice !== 'all' && car.price > parseInt(maxPrice, 10)) return false;
      if (fuel !== 'all' && car.fuel !== fuel) return false;
      if (transmission !== 'all' && car.transmission !== transmission) return false;
      if (year !== 'all' && car.year !== parseInt(year, 10)) return false;
      return true;
    });

    renderCarsGrid(filtered);
  }

  [filterBrand, filterPrice, filterFuel, filterTransmission, filterYear].forEach(filter => {
    filter.addEventListener('change', applyFilters);
  });

  filterResetBtn.addEventListener('click', () => {
    filterBrand.value = 'all';
    filterPrice.value = 'all';
    filterFuel.value = 'all';
    filterTransmission.value = 'all';
    filterYear.value = 'all';
    renderCarsGrid(carsData);
  });

  // Tapping brand logo in slider scrolls to inventory and filters to it
  document.querySelectorAll('.brand-logo').forEach(logo => {
    logo.addEventListener('click', () => {
      const selectedBrand = logo.getAttribute('data-brand');
      filterBrand.value = selectedBrand;
      applyFilters();
      
      const invSection = document.getElementById('inventory');
      invSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // --- WISHLIST MANAGEMENT ---
  function toggleWishlist(carId, buttonElement = null) {
    const index = state.wishlist.indexOf(carId);
    if (index === -1) {
      state.wishlist.push(carId);
      if (buttonElement) {
        buttonElement.classList.add('active');
        buttonElement.querySelector('svg').style.fill = 'currentColor';
      }
    } else {
      state.wishlist.splice(index, 1);
      if (buttonElement) {
        buttonElement.classList.remove('active');
        buttonElement.querySelector('svg').style.fill = 'none';
      }
    }

    localStorage.setItem('aura_wishlist', JSON.stringify(state.wishlist));
    updateWishlistBadge();
    renderWishlistDrawer();
    
    // Synced card states might need re-render if drawer actions used
    if (!buttonElement) renderCarsGrid();
  }

  function updateWishlistBadge() {
    wishlistBadge.innerText = state.wishlist.length;
  }

  function renderWishlistDrawer() {
    wishlistDrawerBody.innerHTML = '';
    
    if (state.wishlist.length === 0) {
      wishlistDrawerBody.innerHTML = `
        <div class="drawer-empty-msg">
          Your favorites is currently empty. Start liking cars to save them.
        </div>
      `;
      return;
    }

    state.wishlist.forEach(carId => {
      const car = carsData.find(c => c.id === carId);
      if (!car) return;

      const wishCard = document.createElement('div');
      wishCard.className = 'wish-card glass';
      
      wishCard.innerHTML = `
        <div class="wish-card-img">
          <img src="${car.image}" alt="${car.name}">
        </div>
        <div class="wish-card-info">
          <div class="wish-card-name">${car.name}</div>
          <div class="wish-card-price">$${car.price.toLocaleString()}</div>
        </div>
        <button class="wish-card-remove" data-id="${car.id}">
          <i data-lucide="trash-2"></i>
        </button>
      `;

      wishlistDrawerBody.appendChild(wishCard);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Attach listeners on drawer remove buttons
    wishlistDrawerBody.querySelectorAll('.wish-card-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        toggleWishlist(id);
      });
    });
  }

  wishlistToggle.addEventListener('click', () => {
    wishlistDrawer.classList.add('active');
  });

  wishlistClose.addEventListener('click', () => {
    wishlistDrawer.classList.remove('active');
  });

  // --- COMPARE MANAGEMENT ---
  function toggleCompare(carId, buttonElement = null) {
    const index = state.compare.indexOf(carId);
    if (index === -1) {
      if (state.compare.length >= 3) {
        alert("You can compare a maximum of 3 luxury vehicles at a time.");
        return;
      }
      state.compare.push(carId);
      if (buttonElement) buttonElement.classList.add('active');
    } else {
      state.compare.splice(index, 1);
      if (buttonElement) buttonElement.classList.remove('active');
    }

    localStorage.setItem('aura_compare', JSON.stringify(state.compare));
    updateCompareBadge();
    renderCompareDrawer();

    if (!buttonElement) renderCarsGrid();
  }

  function updateCompareBadge() {
    compareBadge.innerText = state.compare.length;
  }

  function renderCompareDrawer() {
    compareGridContainer.innerHTML = '';

    // Render compare slot cards (always 4 columns: labels + up to 3 cars)
    // Left column: Spec labels
    const labelsCol = document.createElement('div');
    labelsCol.className = 'compare-actions-panel';
    labelsCol.innerHTML = `
      <div class="compare-card-title" style="color: var(--accent-gold); letter-spacing: 0.15rem; font-family: var(--font-family-heading); font-size: 0.9rem;">SPEC COMPARISON</div>
      <p style="font-size: 0.75rem; color: var(--text-secondary);">Direct technical review of your selected models.</p>
      <button class="btn-filter-reset" id="compare-clear-all-btn" style="margin-top: 1rem; width: 100%;">Clear All</button>
    `;
    compareGridContainer.appendChild(labelsCol);

    // 3 slots for vehicles
    for (let i = 0; i < 3; i++) {
      const carId = state.compare[i];
      const slotCol = document.createElement('div');

      if (carId) {
        const car = carsData.find(c => c.id === carId);
        slotCol.className = 'compare-card glass';
        slotCol.innerHTML = `
          <button class="compare-card-remove" data-id="${car.id}">
            <i data-lucide="x"></i>
          </button>
          <div>
            <span style="font-size: 0.7rem; text-transform: uppercase; color: var(--accent-gold);">${car.brand}</span>
            <div class="compare-card-title">${car.name}</div>
          </div>
          <div class="compare-specs-list">
            <div class="compare-spec-row"><span class="lbl">Price:</span> <span class="val">$${car.price.toLocaleString()}</span></div>
            <div class="compare-spec-row"><span class="lbl">Power:</span> <span class="val">${car.hp} HP</span></div>
            <div class="compare-spec-row"><span class="lbl">0-60 mph:</span> <span class="val">${car.acceleration}</span></div>
            <div class="compare-spec-row"><span class="lbl">Top Speed:</span> <span class="val">${car.topSpeed}</span></div>
            <div class="compare-spec-row"><span class="lbl">Fuel Type:</span> <span class="val">${car.fuel}</span></div>
          </div>
        `;
      } else {
        slotCol.className = 'compare-column-empty glass';
        slotCol.innerHTML = `
          <div>
            <i data-lucide="plus" style="margin-bottom: 0.5rem; opacity: 0.5;"></i>
            <p>Add vehicle to compare</p>
          </div>
        `;
      }

      compareGridContainer.appendChild(slotCol);
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Attach clear all listener
    const clearAllBtn = document.getElementById('compare-clear-all-btn');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        state.compare = [];
        localStorage.setItem('aura_compare', JSON.stringify(state.compare));
        updateCompareBadge();
        renderCompareDrawer();
        renderCarsGrid();
      });
    }

    // Attach card remove listener
    compareGridContainer.querySelectorAll('.compare-card-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        toggleCompare(id);
      });
    });
  }

  compareToggle.addEventListener('click', () => {
    compareDrawer.classList.add('active');
  });

  compareClose.addEventListener('click', () => {
    compareDrawer.classList.remove('active');
  });

  // --- DETAILS QUICKVIEW MODAL ---
  function openQuickviewModal(carId) {
    const car = carsData.find(c => c.id === carId);
    if (!car) return;

    state.activeModalCar = car;
    state.modalViewerMode = 'gallery';
    state.activeAngleIndex = 0;

    // Load specs info
    modalCarBrand.innerText = car.brand.toUpperCase();
    modalCarName.innerText = car.name;
    specEngine.innerText = car.engine || 'Electric';
    specHp.innerText = car.hp;
    specAccel.innerText = car.acceleration;
    specTop.innerText = car.topSpeed;
    specDrivetrain.innerText = car.drivetrain || 'RWD';
    specTransmission.innerText = car.transmission;

    // Default main photo
    modalActiveImg.src = car.image;
    modalActiveImg.className = '';
    overlay360Drag.classList.add('hidden');

    // Button states
    btnShowGallery.classList.add('active');
    btnShow360.classList.remove('active');

    // Thumbs builder
    modalThumbsContainer.innerHTML = '';
    car.gallery.forEach((imgUrl, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `thumb-item ${idx === 0 ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${imgUrl}" alt="${car.name} Angle">`;
      thumb.addEventListener('click', () => {
        if (state.modalViewerMode === 'gallery') {
          modalActiveImg.src = imgUrl;
          modalThumbsContainer.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        }
      });
      modalThumbsContainer.appendChild(thumb);
    });

    // Reset and calculate dynamic finance numbers
    calcDownpayment.value = Math.round(car.price * 0.2); // Default 20% down
    calcDownpayment.max = car.price;
    updateFinanceCalculation();

    // Show modal
    quickviewModal.classList.add('active');
  }

  function updateFinanceCalculation() {
    if (!state.activeModalCar) return;

    const carPrice = state.activeModalCar.price;
    const downPayment = Math.max(0, parseInt(calcDownpayment.value, 10) || 0);
    const term = parseInt(calcTerm.value, 10);
    const interestAnnual = 0.055; // 5.5% annual rate
    const interestMonthly = interestAnnual / 12;

    const loanAmount = carPrice - downPayment;
    if (loanAmount <= 0) {
      calcMonthlyEst.innerText = '$0 / mo';
      return;
    }

    // Amortization math
    const monthlyPayment = (loanAmount * interestMonthly * Math.pow(1 + interestMonthly, term)) / (Math.pow(1 + interestMonthly, term) - 1);
    calcMonthlyEst.innerText = `$${Math.round(monthlyPayment).toLocaleString()} / mo`;
  }

  calcDownpayment.addEventListener('input', updateFinanceCalculation);
  calcTerm.addEventListener('change', updateFinanceCalculation);

  modalClose.addEventListener('click', () => {
    quickviewModal.classList.remove('active');
    state.activeModalCar = null;
  });

  // Toggle buttons inside details viewer
  btnShowGallery.addEventListener('click', () => {
    state.modalViewerMode = 'gallery';
    btnShowGallery.classList.add('active');
    btnShow360.classList.remove('active');
    overlay360Drag.classList.add('hidden');
    modalActiveImg.src = state.activeModalCar.gallery[0];
    
    // Reactivate first thumb
    const thumbs = modalThumbsContainer.querySelectorAll('.thumb-item');
    thumbs.forEach(t => t.classList.remove('active'));
    if (thumbs[0]) thumbs[0].classList.add('active');
  });

  btnShow360.addEventListener('click', () => {
    state.modalViewerMode = '360';
    btnShow360.classList.add('active');
    btnShowGallery.classList.remove('active');
    overlay360Drag.classList.remove('hidden');
    state.activeAngleIndex = 0;
    modalActiveImg.src = state.activeModalCar.angles[0];
  });

  // --- 360 INTERACTIVE DRAG LOGIC ---
  let isDragging360 = false;
  let startDragX = 0;

  function handleStart(e) {
    if (state.modalViewerMode !== '360') return;
    isDragging360 = true;
    startDragX = e.clientX || (e.touches && e.touches[0].clientX);
    overlay360Drag.classList.add('hidden');
  }

  function handleMove(e) {
    if (!isDragging360 || state.modalViewerMode !== '360') return;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const deltaX = clientX - startDragX;
    const dragThreshold = 20; // Swap frame every 20px

    if (Math.abs(deltaX) > dragThreshold) {
      const angles = state.activeModalCar.angles;
      const angleCount = angles.length;
      
      if (deltaX > 0) {
        state.activeAngleIndex = (state.activeAngleIndex + 1) % angleCount;
      } else {
        state.activeAngleIndex = (state.activeAngleIndex - 1 + angleCount) % angleCount;
      }

      modalActiveImg.src = angles[state.activeAngleIndex];
      startDragX = clientX; // Reset drag pivot
    }
  }

  function handleEnd() {
    isDragging360 = false;
  }

  modalPreviewFrame.addEventListener('mousedown', handleStart);
  window.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleEnd);

  modalPreviewFrame.addEventListener('touchstart', handleStart);
  window.addEventListener('touchmove', handleMove);
  window.addEventListener('touchend', handleEnd);

  // Reserve/checkout interaction
  btnModalReserve.addEventListener('click', () => {
    if (!state.activeModalCar) return;
    quickviewModal.classList.remove('active');
    
    // prefill contact form purpose and message details
    document.getElementById('form-purpose').value = 'purchase';
    document.getElementById('form-message').value = `I am interested in acquiring the ${state.activeModalCar.year} ${state.activeModalCar.brand} ${state.activeModalCar.name}. Please contact me to discuss customization options.`;
    
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  });

  // --- AI CAR RECOMMENDATION QUIZ ---
  const aiQuizData = {
    questions: [
      {
        id: "budget",
        question: "Select your investment range",
        options: [
          { text: "Under $150,000", value: "medium" },
          { text: "$150,000 - $350,000", value: "high" },
          { text: "Over $350,000", value: "exclusive" }
        ]
      },
      {
        id: "lifestyle",
        question: "Define your core driving purpose",
        options: [
          { text: "Track Performance & Aero", value: "track" },
          { text: "Elite Prestige & Commute", value: "luxury" },
          { text: "High-Tech Electric Innovation", value: "electric" }
        ]
      },
      {
        id: "drivetrain",
        question: "Specify propulsion preference",
        options: [
          { text: "Naturally Aspirated / Twin-Turbo V8-V12", value: "gas" },
          { text: "Pure Battery Electric (Zero Emission)", value: "battery" },
          { text: "Performance Plug-in Hybrid", value: "hybrid" }
        ]
      }
    ]
  };

  let currentAiStep = 0;
  const aiAnswers = {};

  const aiQuestionText = document.getElementById('ai-question-text');
  const aiOptionsContainer = document.getElementById('ai-options-container');
  const aiProgressBarFill = document.getElementById('ai-progress-bar-fill');
  const aiQuizView = document.getElementById('ai-quiz-view');
  const aiResultView = document.getElementById('ai-result-view');
  const aiMatchedCarCardPlaceholder = document.getElementById('ai-matched-car-card-placeholder');
  const aiRetryBtn = document.getElementById('ai-retry-btn');

  function renderAiQuestion() {
    if (currentAiStep >= aiQuizData.questions.length) {
      calculateAiRecommendation();
      return;
    }

    const currentQuestion = aiQuizData.questions[currentAiStep];
    aiQuestionText.innerText = currentQuestion.question;
    aiOptionsContainer.innerHTML = '';

    currentQuestion.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'ai-option-btn';
      btn.innerText = opt.text;
      btn.addEventListener('click', () => {
        aiAnswers[currentQuestion.id] = opt.value;
        currentAiStep++;
        updateAiProgressBar();
        renderAiQuestion();
      });
      aiOptionsContainer.appendChild(btn);
    });
  }

  function updateAiProgressBar() {
    const percent = (currentAiStep / aiQuizData.questions.length) * 100;
    aiProgressBarFill.style.width = `${percent}%`;
  }

  function calculateAiRecommendation() {
    // Scoring logic against carsData
    let bestCar = null;
    let highestScore = -999;

    carsData.forEach(car => {
      let score = 0;

      // 1. Budget checking
      if (aiAnswers.budget === 'medium') {
        if (car.price < 150000) score += 3;
        else if (car.price < 250000) score += 1;
      } else if (aiAnswers.budget === 'high') {
        if (car.price >= 150000 && car.price < 350000) score += 3;
        else if (car.price < 150000) score += 1;
      } else if (aiAnswers.budget === 'exclusive') {
        if (car.price >= 350000) score += 3;
        else if (car.price >= 200000) score += 1;
      }

      // 2. Lifestyle checking
      if (aiAnswers.lifestyle === 'track') {
        if (car.brand === 'Porsche' || car.brand === 'Ferrari' || car.brand === 'Lamborghini') score += 3;
        if (car.hp > 600) score += 1;
      } else if (aiAnswers.lifestyle === 'luxury') {
        if (car.brand === 'Rolls-Royce' || car.brand === 'Mercedes-Benz' || car.brand === 'BMW') score += 3;
      } else if (aiAnswers.lifestyle === 'electric') {
        if (car.brand === 'Tesla' || car.fuel === 'Electric') score += 4;
      }

      // 3. Fuel checking
      if (aiAnswers.drivetrain === 'gas') {
        if (car.fuel === 'Gasoline') score += 3;
      } else if (aiAnswers.drivetrain === 'battery') {
        if (car.fuel === 'Electric') score += 4;
      } else if (aiAnswers.drivetrain === 'hybrid') {
        if (car.fuel === 'Hybrid') score += 4;
      }

      if (score > highestScore) {
        highestScore = score;
        bestCar = car;
      }
    });

    if (!bestCar) bestCar = carsData[0]; // fallback safeguard

    // Display recommendation
    aiQuizView.style.display = 'none';
    aiResultView.style.display = 'block';

    aiMatchedCarCardPlaceholder.innerHTML = `
      <div class="car-card glass" style="max-width: 420px; margin: 0 auto; text-align: left;" data-id="${bestCar.id}">
        <span class="card-badge-top">AI Matching 98%</span>
        <div class="car-card-img">
          <img src="${bestCar.image}" alt="${bestCar.name}">
        </div>
        <div class="car-card-content">
          <div class="car-card-brand">${bestCar.brand}</div>
          <h3 class="car-card-title">${bestCar.name}</h3>
          
          <div class="car-card-specs">
            <div class="spec-info">
              <span class="spec-val">${bestCar.hp} hp</span>
              <span class="spec-lbl">Power</span>
            </div>
            <div class="spec-info">
              <span class="spec-val">${bestCar.acceleration}</span>
              <span class="spec-lbl">0-60 mph</span>
            </div>
            <div class="spec-info">
              <span class="spec-val">${bestCar.topSpeed}</span>
              <span class="spec-lbl">Top Speed</span>
            </div>
          </div>
          
          <div class="car-card-footer">
            <div class="car-card-price">
              <span class="price-lbl">Starting Price</span>
              <span class="price-val">$${bestCar.price.toLocaleString()}</span>
            </div>
            <button class="btn btn-primary btn-quickview-match" data-action="quickview" style="padding: 0.7rem 1.2rem; font-size: 0.75rem;">
              Explore Match <i data-lucide="arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Match card quick view trigger
    const matchBtn = aiMatchedCarCardPlaceholder.querySelector('.btn-quickview-match');
    if (matchBtn) {
      matchBtn.addEventListener('click', () => {
        openQuickviewModal(bestCar.id);
      });
    }
  }

  aiRetryBtn.addEventListener('click', () => {
    currentAiStep = 0;
    aiAnswers.budget = null;
    aiAnswers.lifestyle = null;
    aiAnswers.drivetrain = null;
    updateAiProgressBar();
    
    aiResultView.style.display = 'none';
    aiQuizView.style.display = 'block';
    renderAiQuestion();
  });

  renderAiQuestion();

  // --- TESTIMONIALS SLIDER ---
  const tSlider = document.getElementById('testimonial-slider');
  const tSlides = tSlider.querySelectorAll('.testimonial-slide');
  const tDots = document.querySelectorAll('.slider-dot');
  let currentTestimonial = 0;

  function showTestimonial(idx) {
    tSlides[currentTestimonial].classList.remove('active');
    tDots[currentTestimonial].classList.remove('active');
    
    currentTestimonial = idx;
    
    tSlides[currentTestimonial].classList.add('active');
    tDots[currentTestimonial].classList.add('active');
  }

  tDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showTestimonial(idx);
    });
  });

  // Testimonials Auto Scroll
  setInterval(() => {
    const nextIdx = (currentTestimonial + 1) % tSlides.length;
    showTestimonial(nextIdx);
  }, 7000);

  // --- SHOWROOM CONTACT FORM HANDLING ---
  const contactForm = document.getElementById('showroom-contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const phone = document.getElementById('form-phone').value;
    const purpose = document.getElementById('form-purpose').value;
    const message = document.getElementById('form-message').value;

    alert(`Thank you, ${name}! Your VIP showroom appointment request has been logged. Our concierge desk will reach out to you at ${email} or ${phone} within the next 2 hours.`);
    contactForm.reset();
  });

  // --- SCROLL REVEAL ANIMATIONS ---
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, no need to track it further
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- STARTUP LOGIC ---
  renderCarsGrid();
  updateWishlistBadge();
  updateCompareBadge();
  renderWishlistDrawer();
  renderCompareDrawer();

  // Expose openQuickviewModal globally so auth.js dashboard cards can call it
  window.openQuickviewModal = openQuickviewModal;

  // --- VIRTUAL ROUTING (Hash-based) ---
  const allPageSections = [
    document.querySelector('.hero-section'),
    document.querySelector('.brands-section'),
    document.querySelector('.inventory-section'),
    document.querySelector('.ai-section'),
    document.querySelector('.services-section'),
    document.querySelector('.testimonials-section'),
    document.querySelector('.contact-section'),
    document.querySelector('footer.main-footer')
  ].filter(Boolean);

  const loginSection = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');

  function showMainSite() {
    allPageSections.forEach(el => el.style.display = '');
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'none';
  }

  function showLoginPage() {
    allPageSections.forEach(el => el.style.display = 'none');
    if (loginSection) loginSection.style.display = 'flex';
    if (dashboardSection) dashboardSection.style.display = 'none';
    // Init Google sign-in button each time login page is shown
    if (window.AuraAuth) window.AuraAuth.initGoogleAuth();
  }

  function showDashboard() {
    // Guard: redirect to login if not authenticated
    if (!window.AuraAuth || !window.AuraAuth.user) {
      window.location.hash = '#login';
      return;
    }
    allPageSections.forEach(el => el.style.display = 'none');
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';

    // Update dashboard stats counters
    const wishCount = document.getElementById('dash-wishlist-count');
    const compareCount = document.getElementById('dash-compare-count');
    if (wishCount) wishCount.innerText = state.wishlist.length;
    if (compareCount) compareCount.innerText = state.compare.length;

    // Re-render dashboard content
    if (window.AuraAuth) window.AuraAuth.renderDashboard(window.AuraAuth.user);

    // Reinit icons for dynamically injected elements
    if (window.lucide) window.lucide.createIcons();
  }

  function handleRouting() {
    const hash = window.location.hash;
    if (hash === '#login') {
      // If already logged in, skip login, show dashboard
      if (window.AuraAuth && window.AuraAuth.user) {
        window.location.hash = '#dashboard';
      } else {
        showLoginPage();
      }
    } else if (hash === '#dashboard') {
      showDashboard();
    } else {
      showMainSite();
    }
  }

  window.addEventListener('hashchange', handleRouting);
  handleRouting(); // Run on page load

  // --- PROFILE DROPDOWN TOGGLE ---
  const userProfileToggle = document.getElementById('user-profile-toggle');
  const userProfileDropdown = document.getElementById('user-profile-dropdown');

  if (userProfileToggle && userProfileDropdown) {
    userProfileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.AuraAuth && window.AuraAuth.user) {
        // Logged in — toggle dropdown
        userProfileDropdown.classList.toggle('active');
      } else {
        // Not logged in — go to login page
        window.location.hash = '#login';
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!userProfileToggle.contains(e.target) && !userProfileDropdown.contains(e.target)) {
        userProfileDropdown.classList.remove('active');
      }
    });
  }

  // --- LOGOUT BUTTONS ---
  const btnLogoutDropdown = document.getElementById('btn-logout-dropdown');
  const btnLogoutDashboard = document.getElementById('btn-logout-dashboard');

  if (btnLogoutDropdown) {
    btnLogoutDropdown.addEventListener('click', () => {
      userProfileDropdown.classList.remove('active');
      if (window.AuraAuth) window.AuraAuth.logoutUser();
    });
  }

  if (btnLogoutDashboard) {
    btnLogoutDashboard.addEventListener('click', () => {
      if (window.AuraAuth) window.AuraAuth.logoutUser();
    });
  }

  // --- AUTH SESSION RESTORATION ---
  // After all DOM + JS is loaded, check if user was previously logged in
  if (window.AuraAuth) {
    const wasLoggedIn = window.AuraAuth.checkSession();
    if (wasLoggedIn) {
      // Show Dashboard nav link
      const dashLink = document.getElementById('nav-dashboard-link');
      if (dashLink) dashLink.style.display = '';
    }
  }

});
