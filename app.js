// Reference the global carsData array from cars.js
const initialCarsData = typeof carsData !== 'undefined' ? carsData : [];

document.addEventListener('DOMContentLoaded', () => {
  
  function generateRandomVIN() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let vin = "";
    for (let i = 0; i < 17; i++) {
      vin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return vin;
  }

  function fillMissingCarFields(car) {
    return {
      ...car,
      vin: car.vin || generateRandomVIN(),
      mileage: car.mileage !== undefined ? car.mileage : Math.floor(Math.random() * 8000) + 200,
      status: car.status || 'Available',
      exteriorColor: car.exteriorColor || 'Nero Matte',
      interiorColor: car.interiorColor || 'Alcantara Black',
      options: car.options || ['Carbon Ceramic Brakes', 'Sport Exhaust', 'Alcantara Trim', 'Suspension Lift'],
      dateAdded: car.dateAdded || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
  }

  // Shadow global carsData with the persistent localStorage database
  let carsData = JSON.parse(localStorage.getItem('aura_cars'));
  if (!carsData || carsData.length === 0) {
    carsData = initialCarsData.map(car => fillMissingCarFields({
      ...car,
      featured: car.featured !== undefined ? car.featured : true
    }));
    localStorage.setItem('aura_cars', JSON.stringify(carsData));
  } else {
    let modified = false;
    carsData = carsData.map(car => {
      const updated = fillMissingCarFields(car);
      if (updated.vin !== car.vin || updated.mileage !== car.mileage || updated.exteriorColor !== car.exteriorColor) {
        modified = true;
      }
      return updated;
    });
    if (modified) {
      localStorage.setItem('aura_cars', JSON.stringify(carsData));
    }
  }

  console.log("AURA MOTORS - Loaded " + carsData.length + " vehicles. Data source: " + (localStorage.getItem('aura_cars') ? "localStorage" : "static cars.js"));

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

  // Extended Spec Selectors
  const specVin = document.getElementById('spec-vin');
  const specMileage = document.getElementById('spec-mileage');
  const specExterior = document.getElementById('spec-exterior');
  const specInterior = document.getElementById('spec-interior');
  const specStatus = document.getElementById('spec-status');
  const specOptions = document.getElementById('spec-options');

  const calcDownpayment = document.getElementById('calc-downpayment');
  const calcTerm = document.getElementById('calc-term');
  const calcMonthlyEst = document.getElementById('calc-monthly-est');

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

    // Populate extended specifications
    if (specVin) specVin.innerText = car.vin || 'N/A';
    if (specMileage) specMileage.innerText = car.mileage ? car.mileage.toLocaleString() + ' mi' : '0 mi';
    if (specExterior) specExterior.innerText = car.exteriorColor || 'N/A';
    if (specInterior) specInterior.innerText = car.interiorColor || 'N/A';
    if (specStatus) {
      specStatus.innerText = car.status || 'Available';
      if (car.status === 'Sold') {
        specStatus.style.color = '#ef4444';
      } else if (car.status === 'Reserved') {
        specStatus.style.color = '#f59e0b';
      } else {
        specStatus.style.color = '#10b981';
      }
    }
    if (specOptions) {
      specOptions.innerText = Array.isArray(car.options) ? car.options.join(', ') : (car.options || 'None');
    }

    // Update wishlist / compare button states in modal
    updateModalInteractionStates();

    // Prefill inquiry form message
    const leadMessageEl = document.getElementById('lead-message');
    if (leadMessageEl) {
      leadMessageEl.value = `I am interested in acquiring the ${car.year} ${car.brand} ${car.name}. Please contact me to discuss customization options.`;
    }

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

  // --- DETAILS MODAL INTERACTIONS ---
  function updateModalInteractionStates() {
    if (!state.activeModalCar) return;
    const carId = state.activeModalCar.id;

    // Wishlist button state
    const isWishlisted = state.wishlist.includes(carId);
    const wishlistTextEl = document.getElementById('modal-wishlist-text');
    const wishlistToggleEl = document.getElementById('modal-wishlist-toggle');
    const wishlistIconEl = wishlistToggleEl ? wishlistToggleEl.querySelector('svg') : null;

    if (wishlistTextEl) {
      wishlistTextEl.innerText = isWishlisted ? "In Favorites" : "Add to Favorites";
    }
    if (wishlistToggleEl) {
      wishlistToggleEl.style.color = isWishlisted ? "var(--accent-gold)" : "var(--text-secondary)";
    }
    if (wishlistIconEl) {
      wishlistIconEl.style.fill = isWishlisted ? "var(--accent-gold)" : "none";
      wishlistIconEl.style.stroke = isWishlisted ? "var(--accent-gold)" : "currentColor";
    }

    // Compare button state
    const isCompared = state.compare.includes(carId);
    const compareTextEl = document.getElementById('modal-compare-text');
    const compareToggleEl = document.getElementById('modal-compare-toggle');
    const compareIconEl = compareToggleEl ? compareToggleEl.querySelector('svg') : null;

    if (compareTextEl) {
      compareTextEl.innerText = isCompared ? "Added to Compare" : "Compare";
    }
    if (compareToggleEl) {
      compareToggleEl.style.color = isCompared ? "var(--accent-gold)" : "var(--text-secondary)";
    }
    if (compareIconEl) {
      compareIconEl.style.stroke = isCompared ? "var(--accent-gold)" : "currentColor";
    }
  }

  const modalWishlistToggle = document.getElementById('modal-wishlist-toggle');
  if (modalWishlistToggle) {
    modalWishlistToggle.addEventListener('click', () => {
      if (!state.activeModalCar) return;
      toggleWishlist(state.activeModalCar.id);
      updateModalInteractionStates();
    });
  }

  const modalCompareToggle = document.getElementById('modal-compare-toggle');
  if (modalCompareToggle) {
    modalCompareToggle.addEventListener('click', () => {
      if (!state.activeModalCar) return;
      toggleCompare(state.activeModalCar.id);
      updateModalInteractionStates();
    });
  }

  const modalShareBtn = document.getElementById('modal-share-btn');
  if (modalShareBtn) {
    modalShareBtn.addEventListener('click', () => {
      if (!state.activeModalCar) return;
      const shareUrl = `${window.location.origin}${window.location.pathname}?car=${state.activeModalCar.id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Avtomobil havolasi buferga nusxalandi!");
      }).catch(err => {
        console.error("Nusxalashda xatolik:", err);
      });
    });
  }

  // --- DETAILS MODAL LEAD FORM ---
  const modalLeadForm = document.getElementById('modal-lead-form');
  if (modalLeadForm) {
    modalLeadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!state.activeModalCar) return;

      const name = document.getElementById('lead-name').value.trim();
      const phone = document.getElementById('lead-phone').value.trim();
      const email = document.getElementById('lead-email').value.trim();
      const inquiryType = document.getElementById('lead-inquiry-type').value;
      const rawMessage = document.getElementById('lead-message').value.trim();

      const message = `[${inquiryType}] ${rawMessage}`;

      const newLead = {
        id: "lead-" + Date.now(),
        name: name,
        phone: phone,
        email: email,
        carId: state.activeModalCar.id,
        carName: `${state.activeModalCar.brand} ${state.activeModalCar.name}`,
        status: "New",
        date: new Date().toISOString().split('T')[0],
        message: message
      };

      // Save to localStorage
      const existingLeads = JSON.parse(localStorage.getItem('aura_leads')) || [];
      existingLeads.push(newLead);
      localStorage.setItem('aura_leads', JSON.stringify(existingLeads));

      // Show success alert in Uzbek
      alert(`Rahmat, ${name}! Ushbu avtomobil bo'yicha so'rovingiz qabul qilindi. Tez orada siz bilan bog'lanamiz.`);
      modalLeadForm.reset();
      
      // Close the modal
      quickviewModal.classList.remove('active');
      state.activeModalCar = null;
    });
  }

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

  // --- QUICK SEARCH BAR LOGIC ---
  const quickBrand = document.getElementById('quick-brand');
  const quickType = document.getElementById('quick-type');
  const quickPrice = document.getElementById('quick-price');
  const quickSearchBtn = document.getElementById('quick-search-btn');

  if (quickSearchBtn) {
    quickSearchBtn.addEventListener('click', () => {
      if (filterBrand && quickBrand) filterBrand.value = quickBrand.value;
      if (filterFuel && quickType) filterFuel.value = quickType.value;
      if (filterPrice && quickPrice) filterPrice.value = quickPrice.value;

      applyFilters();

      const inventorySection = document.getElementById('inventory');
      if (inventorySection) {
        inventorySection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- NEURAL AI CHATBOT ADVISOR LOGIC ---
  const aiChatForm = document.getElementById('ai-chat-form');
  const aiChatInput = document.getElementById('ai-chat-input');
  const aiChatBody = document.getElementById('ai-chat-body');

  window.openCarDetailsFromChat = (carId) => {
    openQuickviewModal(carId);
  };

  if (aiChatForm) {
    aiChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = aiChatInput.value.trim();
      if (!text) return;

      appendChatMessage(text, 'user');
      aiChatInput.value = '';

      const typingId = 'typing-' + Date.now();
      const typingDiv = document.createElement('div');
      typingDiv.className = 'chat-message bot';
      typingDiv.id = typingId;
      typingDiv.style = "display: flex; gap: 0.8rem; max-width: 80%; align-self: flex-start; text-align: left;";
      typingDiv.innerHTML = `
        <div style="background: rgba(197, 168, 128, 0.1); color: var(--accent-gold); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.9rem;">
          <i data-lucide="bot"></i>
        </div>
        <div class="message-content" style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: 0 12px 12px 12px; padding: 0.6rem 1rem;">
          <div class="typing-indicator"><span></span><span></span><span></span></div>
        </div>
      `;
      aiChatBody.appendChild(typingDiv);
      aiChatBody.scrollTop = aiChatBody.scrollHeight;
      if (window.lucide) window.lucide.createIcons();

      setTimeout(() => {
        const indicator = document.getElementById(typingId);
        if (indicator) indicator.remove();
        processChatbotResponse(text);
      }, 1200);
    });
  }

  function appendChatMessage(text, sender, isHtml = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    
    if (sender === 'user') {
      msgDiv.style = "display: flex; gap: 0.8rem; max-width: 80%; align-self: flex-end; text-align: right; flex-direction: row-reverse;";
      msgDiv.innerHTML = `
        <div style="background: rgba(197, 168, 128, 0.15); color: var(--accent-gold); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.9rem;">
          <i data-lucide="user"></i>
        </div>
        <div class="message-content" style="background: rgba(197, 168, 128, 0.1); border: 1px solid rgba(197, 168, 128, 0.2); border-radius: 12px 0 12px 12px; padding: 0.8rem 1.1rem; font-size: 0.9rem; color: var(--text-primary); line-height: 1.5; text-align: left;">
          ${text}
        </div>
      `;
    } else {
      msgDiv.style = "display: flex; gap: 0.8rem; max-width: 80%; align-self: flex-start; text-align: left;";
      msgDiv.innerHTML = `
        <div style="background: rgba(197, 168, 128, 0.1); color: var(--accent-gold); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.9rem;">
          <i data-lucide="bot"></i>
        </div>
        <div class="message-content" style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: 0 12px 12px 12px; padding: 0.8rem 1.1rem; font-size: 0.9rem; color: var(--text-primary); line-height: 1.5;">
          ${text}
        </div>
      `;
    }
    aiChatBody.appendChild(msgDiv);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
    if (window.lucide) window.lucide.createIcons();
  }

  function processChatbotResponse(userInput) {
    const query = userInput.toLowerCase();
    
    if (query.includes('salom') || query.includes('hello') || query.includes('hi') || query.includes('qaysi') || query.includes('yordam')) {
      if (query.length < 8) {
        appendChatMessage("Salom! Men AURA MOTORS aqlli maslahatchisiman. Sizga qanday avtomobil topib beray? Masalan, 'Lamborghini bormi?', 'Elektr moshinlar' yoki 'Tezkor superkar' deb yozishingiz mumkin.", 'bot');
        return;
      }
    }

    let matches = [...carsData];

    const brands = ['lamborghini', 'porsche', 'ferrari', 'rolls-royce', 'tesla', 'audi', 'bmw', 'mercedes', 'damas', 'chevrolet', 'malibu', 'tracker', 'gentra'];
    let matchedBrand = null;
    brands.forEach(b => {
      if (query.includes(b)) {
        matchedBrand = b;
      }
    });

    if (matchedBrand) {
      if (matchedBrand === 'lambo') matchedBrand = 'lamborghini';
      if (matchedBrand === 'rolls') matchedBrand = 'rolls-royce';
      if (matchedBrand === 'mercedes' || matchedBrand === 'benz') matchedBrand = 'mercedes-benz';
      
      matches = matches.filter(c => c.brand.toLowerCase() === matchedBrand || c.name.toLowerCase().includes(matchedBrand));
    }

    if (query.includes('electric') || query.includes('elektr') || query.includes('tok')) {
      matches = matches.filter(c => c.fuel === 'Electric');
    } else if (query.includes('hybrid') || query.includes('gibrid')) {
      matches = matches.filter(c => c.fuel === 'Hybrid');
    } else if (query.includes('benzin') || query.includes('gasoline') || query.includes('petrol')) {
      matches = matches.filter(c => c.fuel === 'Gasoline');
    }

    if (query.includes('tez') || query.includes('fast') || query.includes('speed') || query.includes('poyga') || query.includes('race')) {
      matches = matches.filter(c => c.hp > 500 || parseFloat(c.acceleration) < 4);
      matches.sort((a,b) => parseFloat(a.acceleration) - parseFloat(b.acceleration));
    }

    if (query.includes('arzon') || query.includes('cheap') || query.includes('oddiy') || query.includes('budget')) {
      matches.sort((a,b) => a.price - b.price);
    } else if (query.includes('qimmat') || query.includes('expensive') || query.includes('luxury') || query.includes('premium')) {
      matches.sort((a,b) => b.price - a.price);
    }

    if (matches.length > 0) {
      const bestCar = matches[0];
      let responseText = `Sizning so'rovingizga mos eng yaxshi variant - <b>${bestCar.brand} ${bestCar.name}</b>. Uning dvigateli ${bestCar.engine}, quvvati ${bestCar.hp} ot kuchi, tezlanishi esa 0-60 mph tezlikka bor-yo'g'i ${bestCar.acceleration} soniyani tashkil etadi.`;
      
      appendChatMessage(responseText, 'bot');

      const cardHtml = `
        <div class="chat-message-car-card">
          <img src="${bestCar.image}" alt="${bestCar.name}">
          <div class="chat-message-car-card-body">
            <h5>${bestCar.brand} ${bestCar.name}</h5>
            <p>${bestCar.year} | ${bestCar.engine} | ${bestCar.hp} HP</p>
            <div class="card-footer">
              <span class="price">$${bestCar.price.toLocaleString()}</span>
              <button class="btn-view" onclick="openCarDetailsFromChat('${bestCar.id}')">Batafsil ko'rish</button>
            </div>
          </div>
        </div>
      `;
      
      const cardMsgDiv = document.createElement('div');
      cardMsgDiv.className = 'chat-message bot';
      cardMsgDiv.style = "display: flex; gap: 0.8rem; max-width: 80%; align-self: flex-start; text-align: left;";
      cardMsgDiv.innerHTML = `
        <div style="background: rgba(197, 168, 128, 0.1); color: var(--accent-gold); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.9rem;">
          <i data-lucide="bot"></i>
        </div>
        <div>
          ${cardHtml}
        </div>
      `;
      aiChatBody.appendChild(cardMsgDiv);
      
      if (matches.length > 1) {
        const alts = matches.slice(1, 4).map(c => `<a href="#inventory" onclick="openCarDetailsFromChat('${c.id}'); return false;" style="color: var(--accent-gold); text-decoration: underline; font-weight: 500;">${c.brand} ${c.name}</a>`).join(', ');
        setTimeout(() => {
          appendChatMessage(`Muqobil variantlar: ${alts}`, 'bot');
        }, 600);
      }
      
      aiChatBody.scrollTop = aiChatBody.scrollHeight;
      if (window.lucide) window.lucide.createIcons();

    } else {
      appendChatMessage("Kechirasiz, so'rovingizga mos birorta mashina topolmadim. Boshqacha so'rov berib ko'ring (masalan, brend nomi: Porsche, Lamborghini, Malibu yoki turi: elektr, arzon).", 'bot');
    }
  }

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
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const purpose = document.getElementById('form-purpose').value;
      const messageText = document.getElementById('form-message').value.trim();

      const newLead = {
        id: "lead-" + Date.now(),
        name: name,
        phone: phone,
        email: email,
        carId: "",
        carName: `General Appointment: ${purpose}`,
        status: "New",
        date: new Date().toISOString().split('T')[0],
        message: messageText
      };

      const existingLeads = JSON.parse(localStorage.getItem('aura_leads')) || [];
      existingLeads.push(newLead);
      localStorage.setItem('aura_leads', JSON.stringify(existingLeads));

      alert(`Thank you, ${name}! Your VIP showroom appointment request has been logged. Our concierge desk will reach out to you at ${email} or ${phone} within the next 2 hours.`);
      contactForm.reset();
    });
  }

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

  // Open car details from URL param if present
  const urlParams = new URLSearchParams(window.location.search);
  const carParam = urlParams.get('car');
  if (carParam) {
    setTimeout(() => {
      openQuickviewModal(carParam);
    }, 500);
  }
});
