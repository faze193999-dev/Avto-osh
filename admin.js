/* ==========================================================================
   AURA MOTORS ADMIN DASHBOARD CONTROLLER (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Admin Portal Authentication Gate ---
  const authOverlay = document.getElementById('admin-auth-overlay');
  const authForm = document.getElementById('admin-auth-form');
  const authEmailInput = document.getElementById('auth-email');
  const authPasswordInput = document.getElementById('auth-password');

  function checkAuth() {
    const session = localStorage.getItem('aura_admin_session');
    if (session === 'true') {
      if (authOverlay) {
        authOverlay.classList.remove('active');
      }
      document.body.classList.remove('auth-locked');
    } else {
      if (authOverlay) {
        authOverlay.classList.add('active');
      }
      document.body.classList.add('auth-locked');
    }
  }

  // Initial Check
  checkAuth();

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = authEmailInput.value.trim();
      const password = authPasswordInput.value;

      if (email === 'faze193999@gmail.com' && password === 'Asa99-99') {
        localStorage.setItem('aura_admin_session', 'true');
        showToast('Tizimga muvaffaqiyatli kirildi!', 'success');
        if (authOverlay) {
          authOverlay.classList.remove('active');
        }
        document.body.classList.remove('auth-locked');
        authForm.reset();
      } else {
        showToast('Email yoki parol noto\'g\'ri!', 'error');
        const card = authOverlay ? authOverlay.querySelector('.auth-card') : null;
        if (card) {
          card.style.animation = 'none';
          card.offsetHeight; // trigger reflow
          card.style.animation = 'shake 0.4s ease-in-out';
        }
      }
    });
  }

  // --- Initialize Lucide Icons ---
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ==========================================================================
  // 1. DATA INITIALIZATION & LOCALSTORAGE MANAGEMENT
  // ==========================================================================

  // Check and initialize Cars data
  let cars = JSON.parse(localStorage.getItem('aura_cars'));
  const defaultCars = typeof carsData !== 'undefined' ? carsData : [];

  if (!cars || cars.length === 0) {
    cars = defaultCars.map(car => ({
      ...car,
      status: car.status || 'Available', // Available, Reserved, Sold
      featured: car.featured !== undefined ? car.featured : true
    }));
    localStorage.setItem('aura_cars', JSON.stringify(cars));
  } else {
    // Check if any default cars are missing in the localStorage list and add them
    let modified = false;
    defaultCars.forEach(defaultCar => {
      const exists = cars.some(c => c.id === defaultCar.id);
      if (!exists) {
        cars.unshift({
          ...defaultCar,
          status: defaultCar.status || 'Available',
          featured: defaultCar.featured !== undefined ? defaultCar.featured : true
        });
        modified = true;
      }
    });
    if (modified) {
      localStorage.setItem('aura_cars', JSON.stringify(cars));
    }
  }

  // Check and initialize Leads data
  let leads = JSON.parse(localStorage.getItem('aura_leads'));
  if (!leads) {
    leads = [
      {
        id: "lead-1",
        name: "Bruce Wayne",
        phone: "+1 (555) 762-2321",
        email: "bruce@waynecorp.com",
        carId: "rolls-ghost",
        carName: "Rolls-Royce Ghost Black Badge",
        status: "New",
        date: "2026-06-22",
        message: "Requesting a private viewing of the Ghost Black Badge. Please contact me through my assistant."
      },
      {
        id: "lead-2",
        name: "Tony Stark",
        phone: "+1 (555) 888-9911",
        email: "tony@stark.com",
        carId: "tesla-models",
        carName: "Tesla Model S Plaid",
        status: "Contacted",
        date: "2026-06-20",
        message: "Interested in upgrading the battery pack or checking custom paint options before delivery."
      },
      {
        id: "lead-3",
        name: "Selina Kyle",
        phone: "+1 (555) 432-1200",
        email: "selina@gmail.com",
        carId: "porsche-gt3rs",
        carName: "Porsche 911 GT3 RS (992)",
        status: "New",
        date: "2026-06-23",
        message: "Can you provide lease options for the 911 GT3 RS? Looking to take delivery in Las Vegas."
      },
      {
        id: "lead-4",
        name: "James Bond",
        phone: "+1 (555) 007-7700",
        email: "mi6-007@gov.uk",
        carId: "lambo-aventador",
        carName: "Lamborghini Aventador LP780-4 Ultimae",
        status: "Sold",
        date: "2026-06-15",
        message: "Ready to wire the funds today. Requesting delivery to London, fully enclosed container."
      },
      {
        id: "lead-5",
        name: "Diana Prince",
        phone: "+1 (555) 902-1111",
        email: "diana@museum.org",
        carId: "ferrari-sf90",
        carName: "Ferrari SF90 Stradale",
        status: "Closed",
        date: "2026-05-18",
        message: "Would like to check if you have vintage collectors models. Thank you."
      }
    ];
    localStorage.setItem('aura_leads', JSON.stringify(leads));
  }

  // Check and initialize Customers data
  let customers = JSON.parse(localStorage.getItem('aura_customers'));
  if (!customers) {
    customers = [
      {
        id: "cust-1",
        name: "Bruce Wayne",
        email: "bruce@waynecorp.com",
        phone: "+1 (555) 762-2321",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
        role: "VIP Collector",
        saved: ["rolls-ghost", "lambo-aventador"],
        purchases: ["Mercedes-Benz AMG GT Black Series"]
      },
      {
        id: "cust-2",
        name: "Tony Stark",
        email: "tony@stark.com",
        phone: "+1 (555) 888-9911",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
        role: "VIP Collector",
        saved: ["tesla-models"],
        purchases: ["Tesla Model S Plaid", "Audi R8 V10 Performance"]
      },
      {
        id: "cust-3",
        name: "Diana Prince",
        email: "diana@museum.org",
        phone: "+1 (555) 902-1111",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
        role: "Platinum Collector",
        saved: ["ferrari-sf90"],
        purchases: []
      }
    ];
    localStorage.setItem('aura_customers', JSON.stringify(customers));
  }

  // Check and initialize Admin Profile data
  let adminProfile = JSON.parse(localStorage.getItem('aura_admin_profile'));
  if (!adminProfile) {
    adminProfile = {
      name: "Eleanor Vance",
      email: "eleanor@auramotors.com",
      role: "Super Admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      password: "admin"
    };
    localStorage.setItem('aura_admin_profile', JSON.stringify(adminProfile));
  }

  // Check and initialize Dealership Settings
  let dealerSettings = JSON.parse(localStorage.getItem('aura_dealer_settings'));
  if (!dealerSettings) {
    dealerSettings = {
      name: "AURA MOTORS",
      phone: "+1 (555) 019-9000",
      email: "sales@auramotors.com",
      address: "700 S Las Vegas Blvd, Las Vegas, NV 89101",
      seoTitle: "AURA MOTORS | Futuristic Luxury Car Dealership",
      seoDesc: "Experience the pinnacle of automotive luxury and performance. Explore, compare, and drive your dream sports car today at Aura Motors.",
      socialIg: "https://instagram.com/auramotors",
      socialYt: "https://youtube.com/auramotors",
      socialTw: "https://x.com/auramotors",
      admins: [
        { name: "Eleanor Vance", email: "eleanor@auramotors.com", role: "Super Admin" },
        { name: "Zack R.", email: "zack@auramotors.com", role: "Sales Specialist" }
      ]
    };
    localStorage.setItem('aura_dealer_settings', JSON.stringify(dealerSettings));
  }

  // Theme Settings
  let theme = localStorage.getItem('aura_admin_theme') || 'dark';
  if (theme === 'light') {
    document.body.classList.add('light-theme');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    if (sunIcon) sunIcon.style.display = '';
    if (moonIcon) moonIcon.style.display = 'none';
  }

  // Live Date Display
  const dateBadge = document.getElementById('live-date-str');
  if (dateBadge) {
    const options = { month: 'long', year: 'numeric' };
    dateBadge.innerText = new Date().toLocaleDateString('en-US', options);
  }

  // State
  let activeTab = 'dashboard';
  let activeCarDetailsId = null;
  let activeLeadContactId = null;
  let charts = {}; // Holds Chart.js instances

  // ==========================================================================
  // 2. TAB SWITCHING ROUTER
  // ==========================================================================
  const menuItems = document.querySelectorAll('.menu-item');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const sidebar = document.getElementById('sidebar');

  function switchTab(tabId, carIdToEdit = null) {
    activeTab = tabId;
    
    // Close sidebar on mobile
    if (sidebar) sidebar.classList.remove('active');

    // Update active menu buttons
    menuItems.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update active tab panels
    tabPanels.forEach(panel => {
      if (panel.id === `tab-${tabId}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Run Tab specific initializers
    if (tabId === 'dashboard') {
      renderDashboardStats();
      renderDashboardTables();
      initDashboardCharts();
    } else if (tabId === 'cars') {
      renderCarsCatalogTable();
      populateBrandFilters();
    } else if (tabId === 'add-car') {
      setupCarForm(carIdToEdit);
    } else if (tabId === 'leads') {
      renderLeadsTable();
    } else if (tabId === 'customers') {
      renderCustomersGrid();
    } else if (tabId === 'analytics') {
      initDetailedAnalyticsCharts();
    } else if (tabId === 'settings') {
      renderSettingsPage();
    } else if (tabId === 'profile') {
      renderProfilePage();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      switchTab(item.getAttribute('data-tab'));
    });
  });

  // Attach tab switching events to other dashboard buttons
  document.body.addEventListener('click', (e) => {
    const tabLink = e.target.closest('[data-tab]');
    if (tabLink && !tabLink.classList.contains('menu-item')) {
      e.preventDefault();
      switchTab(tabLink.getAttribute('data-tab'));
    }
  });

  // Mobile sidebar menu toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }

  // ==========================================================================
  // 3. THEME TOGGLE
  // ==========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLightTheme = document.body.classList.toggle('light-theme');
      theme = isLightTheme ? 'light' : 'dark';
      localStorage.setItem('aura_admin_theme', theme);
      
      if (isLightTheme) {
        if (sunIcon) sunIcon.style.display = '';
        if (moonIcon) moonIcon.style.display = 'none';
      } else {
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = '';
      }

      // Reload active charts to recalculate dark/light colors
      if (activeTab === 'dashboard') {
        initDashboardCharts();
      } else if (activeTab === 'analytics') {
        initDetailedAnalyticsCharts();
      }
      showToast(isLightTheme ? 'Light Theme activated' : 'Dark Theme activated', 'info');
    });
  }

  // ==========================================================================
  // 4. GENERAL SEARCH
  // ==========================================================================
  const globalSearchInput = document.getElementById('global-search');
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      const searchVal = e.target.value.toLowerCase();
      
      if (activeTab === 'cars') {
        const carSearch = document.getElementById('car-filter-search');
        if (carSearch) {
          carSearch.value = searchVal;
          // Trigger search filtering on catalog page
          carSearch.dispatchEvent(new Event('input'));
        }
      } else if (activeTab === 'leads') {
        const leadSearch = document.getElementById('leads-filter-search');
        if (leadSearch) {
          leadSearch.value = searchVal;
          leadSearch.dispatchEvent(new Event('input'));
        }
      }
    });
  }

  // ==========================================================================
  // 5. TOAST NOTIFICATIONS
  // ==========================================================================
  function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconStr = 'check-circle-2';
    if (type === 'error') iconStr = 'alert-triangle';
    if (type === 'info') iconStr = 'info';

    toast.innerHTML = `
      <i data-lucide="${iconStr}"></i>
      <span>${msg}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    // Trigger slide-in
    setTimeout(() => toast.classList.add('active'), 50);

    // Fade out and remove
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // ==========================================================================
  // 6. DASHBOARD TAB LOGIC
  // ==========================================================================

  function renderDashboardStats() {
    const totalFleet = cars.length;
    const activeListings = cars.filter(c => c.status === 'Available').length;
    const newLeads = leads.filter(l => l.status === 'New').length;
    const soldFleetCount = leads.filter(l => l.status === 'Sold').length;

    // Calculate revenue (Sum price of all sold leads)
    let totalRevenue = 0;
    leads.forEach(l => {
      if (l.status === 'Sold') {
        const matchCar = cars.find(c => c.id === l.carId);
        totalRevenue += matchCar ? matchCar.price : 250000; // fallback avg price
      }
    });

    const totalCarsEl = document.getElementById('stat-total-cars');
    const activeListingsEl = document.getElementById('stat-active-listings');
    const newLeadsEl = document.getElementById('stat-new-leads');
    const soldCarsEl = document.getElementById('stat-sold-cars');
    const monthlyRevenueEl = document.getElementById('stat-monthly-revenue');
    const siteVisitorsEl = document.getElementById('stat-site-visitors');

    if (totalCarsEl) totalCarsEl.innerText = totalFleet;
    if (activeListingsEl) activeListingsEl.innerText = activeListings;
    if (newLeadsEl) newLeadsEl.innerText = newLeads;
    if (soldCarsEl) soldCarsEl.innerText = soldFleetCount;
    if (monthlyRevenueEl) monthlyRevenueEl.innerText = `$${totalRevenue.toLocaleString()}`;
    if (siteVisitorsEl) siteVisitorsEl.innerText = "18,450";
  }

  function renderDashboardTables() {
    const recentLeadsTbody = document.getElementById('recent-leads-tbody');
    const recentCarsTbody = document.getElementById('recent-cars-tbody');

    if (recentLeadsTbody) {
      recentLeadsTbody.innerHTML = '';
      // Show latest 4 leads
      const latestLeads = [...leads].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
      
      latestLeads.forEach(l => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div class="tbl-user">
              <div class="tbl-user-avatar" style="display:flex; align-items:center; justify-content:center; background: rgba(255,255,255,0.05); font-weight:600; color:var(--text-secondary); font-size:0.75rem;">
                ${l.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <div class="tbl-user-details">
                <h5>${l.name}</h5>
                <p>${l.phone}</p>
              </div>
            </div>
          </td>
          <td>${l.carName}</td>
          <td><span class="status-pill ${l.status.toLowerCase()}">${l.status}</span></td>
          <td>${l.date}</td>
        `;
        recentLeadsTbody.appendChild(tr);
      });
    }

    if (recentCarsTbody) {
      recentCarsTbody.innerHTML = '';
      // Show latest 4 cars added
      const latestCars = [...cars].slice(-4).reverse();
      
      latestCars.forEach(car => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div class="tbl-user">
              <img src="${car.image}" alt="${car.name}" class="tbl-user-avatar" style="border-radius: 4px; width: 44px; height: 32px; object-fit: cover;">
              <div class="tbl-user-details">
                <h5>${car.brand} ${car.name}</h5>
                <p>${car.year} | ${car.engine}</p>
              </div>
            </div>
          </td>
          <td style="font-weight:600; color:var(--accent-blue);">$${car.price.toLocaleString()}</td>
          <td><span class="status-pill ${car.status === 'Available' ? 'sold' : 'closed'}">${car.status}</span></td>
          <td>
            <label class="switch">
              <input type="checkbox" class="featured-toggle-btn" data-id="${car.id}" ${car.featured ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </td>
        `;
        recentCarsTbody.appendChild(tr);
      });

      // Bind quick featured toggles
      recentCarsTbody.querySelectorAll('.featured-toggle-btn').forEach(btn => {
        btn.addEventListener('change', (e) => {
          toggleCarFeatured(e.target.dataset.id, e.target.checked);
        });
      });
    }
  }

  function initDashboardCharts() {
    const isDark = theme === 'dark';
    const textThemeColor = isDark ? '#8e9cae' : '#475569';
    const gridLineColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    // 1. Revenue Line Chart
    const revCtx = document.getElementById('revenue-chart');
    if (revCtx) {
      if (charts.rev) charts.rev.destroy();

      const gradient = revCtx.getContext('2d').createLinearGradient(0, 0, 0, 240);
      gradient.addColorStop(0, 'rgba(0, 112, 243, 0.35)');
      gradient.addColorStop(1, 'rgba(0, 112, 243, 0)');

      charts.rev = new Chart(revCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue ($)',
            data: [190000, 480000, 320000, 780000, 524000, 917000],
            borderColor: '#0070f3',
            borderWidth: 2,
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#0070f3',
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { color: 'transparent' },
              ticks: { color: textThemeColor }
            },
            y: {
              grid: { color: gridLineColor },
              ticks: { 
                color: textThemeColor,
                callback: value => '$' + (value / 1000) + 'k'
              }
            }
          }
        }
      });
    }

    // 2. Leads vs Sales Bar Chart
    const leadsCtx = document.getElementById('leads-chart');
    if (leadsCtx) {
      if (charts.leads) charts.leads.destroy();

      charts.leads = new Chart(leadsCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Sales',
              data: [1, 2, 1, 3, 2, 3],
              backgroundColor: '#10b981',
              borderRadius: 4
            },
            {
              label: 'Leads',
              data: [4, 6, 3, 8, 5, 9],
              backgroundColor: '#f97316',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { color: 'transparent' },
              ticks: { color: textThemeColor }
            },
            y: {
              grid: { color: gridLineColor },
              ticks: { 
                color: textThemeColor,
                stepSize: 2
              }
            }
          }
        }
      });
    }
  }

  // ==========================================================================
  // 7. CARS CATALOG TAB LOGIC
  // ==========================================================================
  const catalogTbody = document.getElementById('catalog-cars-tbody');
  const searchInput = document.getElementById('car-filter-search');
  const brandSelect = document.getElementById('car-filter-brand');
  const fuelSelect = document.getElementById('car-filter-fuel');
  const featuredSelect = document.getElementById('car-filter-featured');

  function populateBrandFilters() {
    if (!brandSelect) return;
    
    // Save current selection
    const currentBrand = brandSelect.value;
    brandSelect.innerHTML = '<option value="all">All Brands</option>';
    
    const brands = [...new Set(cars.map(c => c.brand))].sort();
    brands.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.innerText = b;
      brandSelect.appendChild(opt);
    });

    brandSelect.value = currentBrand;
  }

  function renderCarsCatalogTable() {
    if (!catalogTbody) return;

    catalogTbody.innerHTML = '';
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const brand = brandSelect ? brandSelect.value : 'all';
    const fuel = fuelSelect ? fuelSelect.value : 'all';
    const featured = featuredSelect ? featuredSelect.value : 'all';

    const filteredCars = cars.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(query) || c.brand.toLowerCase().includes(query);
      const matchesBrand = brand === 'all' || c.brand === brand;
      const matchesFuel = fuel === 'all' || c.fuel === fuel;
      const matchesFeatured = featured === 'all' || 
                              (featured === 'featured' && c.featured) || 
                              (featured === 'standard' && !c.featured);
      return matchesSearch && matchesBrand && matchesFuel && matchesFeatured;
    });

    if (filteredCars.length === 0) {
      catalogTbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
            No luxury vehicles match your search filters.
          </td>
        </tr>
      `;
      return;
    }

    filteredCars.forEach(car => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="tbl-user" style="cursor: pointer;" onclick="openCarModal('${car.id}')">
            <img src="${car.image}" alt="${car.name}" class="tbl-user-avatar" style="border-radius: 4px; width: 60px; height: 40px; object-fit: cover;">
            <div class="tbl-user-details">
              <h5 style="font-size:0.9rem;">${car.brand} ${car.name}</h5>
              <p>${car.engine} | ${car.hp} HP</p>
            </div>
          </div>
        </td>
        <td>${car.year}</td>
        <td style="font-weight:600; color:var(--accent-blue); font-size: 0.95rem;">$${car.price.toLocaleString()}</td>
        <td>
          <div style="font-size:0.75rem; color:var(--text-secondary);">
            Drivetrain: <span style="font-weight:600; color:var(--text-primary);">${car.drivetrain}</span><br>
            Top Speed: <span style="font-weight:600; color:var(--text-primary);">${car.topSpeed}</span>
          </div>
        </td>
        <td>
          <div style="font-size:0.75rem;">
            ${car.fuel}<br>
            <span style="color:var(--text-muted);">${car.transmission}</span>
          </div>
        </td>
        <td>
          <label class="switch">
            <input type="checkbox" class="featured-toggle-btn" data-id="${car.id}" ${car.featured ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-action blue" onclick="openCarModal('${car.id}')" title="View details"><i data-lucide="eye"></i></button>
            <button class="btn-action blue" onclick="editCarRecord('${car.id}')" title="Edit specs"><i data-lucide="edit"></i></button>
            <button class="btn-action red" onclick="deleteCarRecord('${car.id}')" title="Delete vehicle"><i data-lucide="trash-2"></i></button>
          </div>
        </td>
      `;

      // Bind featured check switch
      tr.querySelector('.featured-toggle-btn').addEventListener('change', (e) => {
        toggleCarFeatured(car.id, e.target.checked);
      });

      catalogTbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function toggleCarFeatured(carId, isChecked) {
    cars = cars.map(c => c.id === carId ? { ...c, featured: isChecked } : c);
    localStorage.setItem('aura_cars', JSON.stringify(cars));
    showToast(`Vehicle featured status updated`);
  }

  // Bind change/inputs for search catalog filters
  if (searchInput) searchInput.addEventListener('input', renderCarsCatalogTable);
  if (brandSelect) brandSelect.addEventListener('change', renderCarsCatalogTable);
  if (fuelSelect) fuelSelect.addEventListener('change', renderCarsCatalogTable);
  if (featuredSelect) featuredSelect.addEventListener('change', renderCarsCatalogTable);

  // Expose global handles for row actions
  window.editCarRecord = (id) => {
    switchTab('add-car', id);
  };

  window.deleteCarRecord = (id) => {
    const targetCar = cars.find(c => c.id === id);
    if (!targetCar) return;

    if (confirm(`Are you sure you want to permanently delete the ${targetCar.brand} ${targetCar.name} from the registry?`)) {
      cars = cars.filter(c => c.id !== id);
      localStorage.setItem('aura_cars', JSON.stringify(cars));
      showToast(`${targetCar.brand} ${targetCar.name} successfully deleted`, 'error');
      renderCarsCatalogTable();
    }
  };

  // ==========================================================================
  // 8. ADD & EDIT VEHICLE FORM LOGIC
  // ==========================================================================
  const vForm = document.getElementById('vehicle-form');
  const vSubmitBtn = document.getElementById('form-submit-btn');

  function setupCarForm(carId = null) {
    if (!vForm) return;

    vForm.reset();
    const formCarId = document.getElementById('form-car-id');
    const formPageTitle = document.getElementById('form-page-title');

    if (carId) {
      // Edit Mode
      const car = cars.find(c => c.id === carId);
      if (!car) return;

      if (formCarId) formCarId.value = car.id;
      if (formPageTitle) formPageTitle.innerText = `Edit: ${car.brand} ${car.name}`;
      if (vSubmitBtn) vSubmitBtn.innerText = "Update Vehicle Details";

      // Fill values
      document.getElementById('car-brand').value = car.brand;
      document.getElementById('car-name').value = car.name;
      document.getElementById('car-year').value = car.year;
      document.getElementById('car-price').value = car.price;
      document.getElementById('car-hp').value = car.hp;
      document.getElementById('car-fuel').value = car.fuel;
      document.getElementById('car-transmission').value = car.transmission;
      document.getElementById('car-drivetrain').value = car.drivetrain;
      document.getElementById('car-engine').value = car.engine;
      document.getElementById('car-acceleration').value = car.acceleration;
      document.getElementById('car-topspeed').value = car.topSpeed;
      document.getElementById('car-description').value = car.description;
      document.getElementById('car-image').value = car.image;
      document.getElementById('car-gallery').value = car.gallery ? car.gallery.join('\n') : '';
      document.getElementById('car-angles').value = car.angles ? car.angles.join('\n') : '';
      document.getElementById('car-featured').checked = car.featured;

    } else {
      // New Mode
      if (formCarId) formCarId.value = '';
      if (formPageTitle) formPageTitle.innerText = "Add New Vehicle";
      if (vSubmitBtn) vSubmitBtn.innerText = "Save Vehicle Details";
    }
  }

  if (vForm) {
    vForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const carId = document.getElementById('form-car-id').value;
      const brand = document.getElementById('car-brand').value.trim();
      const name = document.getElementById('car-name').value.trim();
      const year = parseInt(document.getElementById('car-year').value);
      const price = parseFloat(document.getElementById('car-price').value);
      const hp = parseInt(document.getElementById('car-hp').value);
      const fuel = document.getElementById('car-fuel').value;
      const transmission = document.getElementById('car-transmission').value;
      const drivetrain = document.getElementById('car-drivetrain').value.trim();
      const engine = document.getElementById('car-engine').value.trim();
      const acceleration = document.getElementById('car-acceleration').value.trim();
      const topSpeed = document.getElementById('car-topspeed').value.trim();
      const description = document.getElementById('car-description').value.trim();
      const image = document.getElementById('car-image').value.trim();
      
      const galleryRaw = document.getElementById('car-gallery').value.trim();
      const gallery = galleryRaw ? galleryRaw.split('\n').map(url => url.trim()) : [image];
      
      const anglesRaw = document.getElementById('car-angles').value.trim();
      const angles = anglesRaw ? anglesRaw.split('\n').map(url => url.trim()) : gallery;

      const featured = document.getElementById('car-featured').checked;

      const recordData = {
        brand,
        name,
        year,
        price,
        hp,
        fuel,
        transmission,
        drivetrain,
        engine,
        acceleration,
        topSpeed,
        description,
        image,
        gallery,
        angles,
        featured,
        status: 'Available'
      };

      if (carId) {
        // Update
        cars = cars.map(c => c.id === carId ? { ...recordData, id: carId, status: c.status } : c);
        localStorage.setItem('aura_cars', JSON.stringify(cars));
        showToast(`${brand} ${name} successfully updated`);
      } else {
        // Create
        const newId = brand.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + Date.now().toString().slice(-6);
        cars.push({ ...recordData, id: newId });
        localStorage.setItem('aura_cars', JSON.stringify(cars));
        showToast(`${brand} ${name} catalog entry created`);
      }

      // Redirect back to listings
      switchTab('cars');
    });

    const clearBtn = document.getElementById('form-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        vForm.reset();
        showToast('Form fields cleared', 'info');
      });
    }
  }

  // ==========================================================================
  // 9. LEADS & INQUIRIES TAB LOGIC
  // ==========================================================================
  const leadsTbody = document.getElementById('leads-tbody');
  const leadsSearchInput = document.getElementById('leads-filter-search');
  const leadsStatusSelect = document.getElementById('leads-filter-status');

  function renderLeadsTable() {
    if (!leadsTbody) return;

    leadsTbody.innerHTML = '';
    const query = leadsSearchInput ? leadsSearchInput.value.toLowerCase() : '';
    const statusFilter = leadsStatusSelect ? leadsStatusSelect.value : 'all';

    const filteredLeads = leads.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(query) || 
                            l.carName.toLowerCase().includes(query) || 
                            l.phone.includes(query);
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (filteredLeads.length === 0) {
      leadsTbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
            No customer inquiries found matching your filters.
          </td>
        </tr>
      `;
      return;
    }

    filteredLeads.forEach(l => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="tbl-user">
            <div class="tbl-user-avatar" style="display:flex; align-items:center; justify-content:center; background: rgba(255,255,255,0.05); font-weight:600; color:var(--text-secondary); font-size:0.8rem;">
              ${l.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div class="tbl-user-details">
              <h5 style="font-size:0.9rem;">${l.name}</h5>
              <p>${l.email}</p>
            </div>
          </div>
        </td>
        <td style="font-weight:500;">${l.phone}</td>
        <td>
          <div style="font-weight:600;">${l.carName}</div>
          <span style="font-size:0.75rem; color:var(--text-muted);">Inquiry Date: ${l.date}</span>
        </td>
        <td>${l.date}</td>
        <td>
          <select class="lead-status-dropdown inline-select" data-id="${l.id}">
            <option value="New" ${l.status === 'New' ? 'selected' : ''}>New</option>
            <option value="Contacted" ${l.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
            <option value="Sold" ${l.status === 'Sold' ? 'selected' : ''}>Sold</option>
            <option value="Closed" ${l.status === 'Closed' ? 'selected' : ''}>Closed</option>
          </select>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-action blue" onclick="openContactLeadModal('${l.id}')" title="Contact Client"><i data-lucide="send"></i></button>
            <button class="btn-action red" onclick="deleteLeadRecord('${l.id}')" title="Delete Inquiry"><i data-lucide="trash-2"></i></button>
          </div>
        </td>
      `;

      // Bind inline status change
      tr.querySelector('.lead-status-dropdown').addEventListener('change', (e) => {
        changeLeadStatus(l.id, e.target.value);
      });

      leadsTbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function changeLeadStatus(leadId, newStatus) {
    leads = leads.map(l => {
      if (l.id === leadId) {
        // If changed to sold, also update car status to Sold
        if (newStatus === 'Sold') {
          updateCarStatus(l.carId, 'Sold');
        } else if (l.status === 'Sold' && newStatus !== 'Sold') {
          // If reverted from sold, check if it should be Available again
          updateCarStatus(l.carId, 'Available');
        }
        return { ...l, status: newStatus };
      }
      return l;
    });
    localStorage.setItem('aura_leads', JSON.stringify(leads));
    showToast(`Lead status updated to ${newStatus}`);
  }

  function updateCarStatus(carId, status) {
    cars = cars.map(c => c.id === carId ? { ...c, status } : c);
    localStorage.setItem('aura_cars', JSON.stringify(cars));
  }

  if (leadsSearchInput) leadsSearchInput.addEventListener('input', renderLeadsTable);
  if (leadsStatusSelect) leadsStatusSelect.addEventListener('change', renderLeadsTable);

  window.deleteLeadRecord = (id) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    if (confirm(`Remove the inquiry from ${lead.name} from the portal database?`)) {
      leads = leads.filter(l => l.id !== id);
      localStorage.setItem('aura_leads', JSON.stringify(leads));
      showToast(`Inquiry successfully removed`, 'error');
      renderLeadsTable();
    }
  };

  // ==========================================================================
  // 10. CUSTOMERS TAB LOGIC
  // ==========================================================================
  const customersContainer = document.getElementById('customers-cards-grid');

  function renderCustomersGrid() {
    if (!customersContainer) return;

    customersContainer.innerHTML = '';

    customers.forEach(cust => {
      const card = document.createElement('div');
      card.className = 'customer-card glass';

      const purchasesList = cust.purchases.length > 0 
        ? cust.purchases.map(p => `<span>${p}</span>`).join(', ') 
        : '<span style="color:var(--text-muted); font-style:italic;">No purchases recorded</span>';

      card.innerHTML = `
        <img src="${cust.avatar}" alt="${cust.name}" class="customer-avatar">
        <h3>${cust.name}</h3>
        <div class="customer-email">${cust.email}</div>
        <span class="role-badge" style="border-color: var(--accent-gold-glow); color:var(--accent-gold); font-size:0.7rem;">${cust.role}</span>
        
        <div class="customer-stats">
          <div class="cust-stat">
            <span class="val">${cust.saved.length}</span>
            <span class="lbl">Wishlist</span>
          </div>
          <div class="cust-stat" style="border-left: 1px solid var(--border-color);">
            <span class="val">${cust.purchases.length}</span>
            <span class="lbl">Purchased</span>
          </div>
        </div>

        <div class="cust-purchases">
          Garage Archive: ${purchasesList}
        </div>
      `;

      customersContainer.appendChild(card);
    });
  }

  // ==========================================================================
  // 11. DETAILED ANALYTICS TAB LOGIC
  // ==========================================================================
  function initDetailedAnalyticsCharts() {
    const isDark = theme === 'dark';
    const textThemeColor = isDark ? '#8e9cae' : '#475569';
    const gridLineColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    // 1. Large Revenue Trend Line Graph
    const revLargeCtx = document.getElementById('analytics-revenue-large-chart');
    if (revLargeCtx) {
      if (charts.revLarge) charts.revLarge.destroy();

      const gradient = revLargeCtx.getContext('2d').createLinearGradient(0, 0, 0, 320);
      gradient.addColorStop(0, 'rgba(197, 168, 128, 0.35)');
      gradient.addColorStop(1, 'rgba(197, 168, 128, 0)');

      charts.revLarge = new Chart(revLargeCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Sales Revenue ($)',
            data: [190000, 480000, 320000, 780000, 524000, 917000],
            borderColor: '#c5a880',
            borderWidth: 2,
            backgroundColor: gradient,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#c5a880',
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { color: 'transparent' },
              ticks: { color: textThemeColor }
            },
            y: {
              grid: { color: gridLineColor },
              ticks: { 
                color: textThemeColor,
                callback: value => '$' + value.toLocaleString()
              }
            }
          }
        }
      });
    }

    // 2. Lead channels Doughnut Chart
    const channelsCtx = document.getElementById('analytics-channels-chart');
    if (channelsCtx) {
      if (charts.channels) charts.channels.destroy();

      charts.channels = new Chart(channelsCtx, {
        type: 'doughnut',
        data: {
          labels: ['Organic Web Search', 'Social Media / YouTube', 'Bespoke Referrals', 'Showroom VIP Walk-in'],
          datasets: [{
            data: [42, 28, 18, 12],
            backgroundColor: ['#0070f3', '#06b6d4', '#c5a880', '#10b981'],
            borderColor: isDark ? '#0f0f11' : '#ffffff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { color: textThemeColor, font: { family: 'Inter', size: 11 } }
            }
          }
        }
      });
    }

    // 3. Categories engagement Bar Graph
    const categoriesCtx = document.getElementById('analytics-categories-chart');
    if (categoriesCtx) {
      if (charts.categories) charts.categories.destroy();

      charts.categories = new Chart(categoriesCtx, {
        type: 'bar',
        data: {
          labels: ['Hypercars', 'Grand Tourers', 'Electric Sports', 'Suv/Luxury Sedans'],
          datasets: [{
            label: 'Visits',
            data: [4800, 2400, 3100, 1500],
            backgroundColor: '#0070f3',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { color: 'transparent' },
              ticks: { color: textThemeColor }
            },
            y: {
              grid: { color: gridLineColor },
              ticks: { color: textThemeColor }
            }
          }
        }
      });
    }
  }

  // ==========================================================================
  // 12. GENERAL SETTINGS TAB LOGIC
  // ==========================================================================
  const saveGeneralBtn = document.getElementById('save-general-settings-btn');
  const adminsListContainer = document.getElementById('admins-list-container');
  const addAdminAccountBtn = document.getElementById('add-admin-account-btn');

  function renderSettingsPage() {
    if (saveGeneralBtn) {
      // Pre-fill inputs from localStorage
      document.getElementById('settings-dealer-name').value = dealerSettings.name;
      document.getElementById('settings-dealer-phone').value = dealerSettings.phone;
      document.getElementById('settings-dealer-email').value = dealerSettings.email;
      document.getElementById('settings-dealer-address').value = dealerSettings.address;
      document.getElementById('settings-seo-title').value = dealerSettings.seoTitle;
      document.getElementById('settings-seo-description').value = dealerSettings.seoDesc;
      document.getElementById('settings-social-ig').value = dealerSettings.socialIg;
      document.getElementById('settings-social-yt').value = dealerSettings.socialYt;
      document.getElementById('settings-social-tw').value = dealerSettings.socialTw;

      renderAdminsSettingsList();
    }
  }

  function renderAdminsSettingsList() {
    if (!adminsListContainer) return;

    adminsListContainer.innerHTML = '';
    dealerSettings.admins.forEach((admin, index) => {
      const div = document.createElement('div');
      div.className = 'admin-account-item';
      div.innerHTML = `
        <div class="details">
          <h5>${admin.name}</h5>
          <p>${admin.email} | <span style="color:var(--accent-blue); font-weight:600;">${admin.role}</span></p>
        </div>
        ${index > 0 ? `<button class="btn-remove-admin" onclick="removeAdminAccount(${index})"><i data-lucide="trash-2"></i></button>` : ''}
      `;
      adminsListContainer.appendChild(div);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  if (saveGeneralBtn) {
    saveGeneralBtn.addEventListener('click', () => {
      dealerSettings.name = document.getElementById('settings-dealer-name').value.trim();
      dealerSettings.phone = document.getElementById('settings-dealer-phone').value.trim();
      dealerSettings.email = document.getElementById('settings-dealer-email').value.trim();
      dealerSettings.address = document.getElementById('settings-dealer-address').value.trim();
      dealerSettings.seoTitle = document.getElementById('settings-seo-title').value.trim();
      dealerSettings.seoDesc = document.getElementById('settings-seo-description').value.trim();
      dealerSettings.socialIg = document.getElementById('settings-social-ig').value.trim();
      dealerSettings.socialYt = document.getElementById('settings-social-yt').value.trim();
      dealerSettings.socialTw = document.getElementById('settings-social-tw').value.trim();

      localStorage.setItem('aura_dealer_settings', JSON.stringify(dealerSettings));
      showToast('dealership configurations saved successfully');
    });
  }

  window.removeAdminAccount = (index) => {
    const admin = dealerSettings.admins[index];
    if (confirm(`Remove access for team member ${admin.name}?`)) {
      dealerSettings.admins.splice(index, 1);
      localStorage.setItem('aura_dealer_settings', JSON.stringify(dealerSettings));
      showToast(`Admin privileges revoked`, 'error');
      renderAdminsSettingsList();
    }
  };

  if (addAdminAccountBtn) {
    addAdminAccountBtn.addEventListener('click', () => {
      const name = prompt("Enter new administrator full name:");
      if (!name) return;
      const email = prompt("Enter team member business email:");
      if (!email || !email.includes('@')) {
        alert("Invalid email address.");
        return;
      }
      const role = prompt("Enter designation / role (e.g. Sales Consultant):", "Sales Specialist");
      if (!role) return;

      dealerSettings.admins.push({ name, email, role });
      localStorage.setItem('aura_dealer_settings', JSON.stringify(dealerSettings));
      showToast(`Authorized administrative access for ${name}`);
      renderAdminsSettingsList();
    });
  }

  // ==========================================================================
  // 13. PERSONAL PROFILE TAB LOGIC
  // ==========================================================================
  const profileForm = document.getElementById('admin-profile-form');
  
  function renderProfilePage() {
    // Nav details
    const navName = document.getElementById('nav-admin-name');
    const navAvatar = document.getElementById('nav-admin-avatar');
    if (navName) navName.innerText = adminProfile.name;
    if (navAvatar) navAvatar.src = adminProfile.avatar;

    // Dropdown details
    const dropName = document.getElementById('dropdown-admin-name');
    const dropRole = document.getElementById('dropdown-admin-role');
    const dropAvatar = document.getElementById('dropdown-admin-avatar');
    if (dropName) dropName.innerText = adminProfile.name;
    if (dropRole) dropRole.innerText = adminProfile.role;
    if (dropAvatar) dropAvatar.src = adminProfile.avatar;

    // Profile card details
    const cardName = document.getElementById('profile-card-name');
    const cardRole = document.getElementById('profile-card-role');
    const cardAvatar = document.getElementById('profile-card-avatar');
    if (cardName) cardName.innerText = adminProfile.name;
    if (cardRole) cardRole.innerText = adminProfile.role;
    if (cardAvatar) cardAvatar.src = adminProfile.avatar;

    // Form inputs
    const pName = document.getElementById('profile-name');
    const pEmail = document.getElementById('profile-email');
    const pRole = document.getElementById('profile-role');
    const pAvatar = document.getElementById('profile-avatar-url');
    const pPass = document.getElementById('profile-password');

    if (pName) pName.value = adminProfile.name;
    if (pEmail) pEmail.value = adminProfile.email;
    if (pRole) pRole.value = adminProfile.role;
    if (pAvatar) pAvatar.value = adminProfile.avatar;
    if (pPass) pPass.value = adminProfile.password;
  }

  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      adminProfile.name = document.getElementById('profile-name').value.trim();
      adminProfile.email = document.getElementById('profile-email').value.trim();
      adminProfile.avatar = document.getElementById('profile-avatar-url').value.trim();
      adminProfile.password = document.getElementById('profile-password').value;

      localStorage.setItem('aura_admin_profile', JSON.stringify(adminProfile));
      showToast('Personal admin profile updated');
      renderProfilePage();
    });
  }

  // ==========================================================================
  // 14. MODAL DIALOGS LOGIC
  // ==========================================================================

  // --- CAR DETAILS POPUP ---
  const carModal = document.getElementById('car-details-modal');
  const carModalClose = document.getElementById('modal-car-close-btn');

  window.openCarModal = (carId) => {
    activeCarDetailsId = carId;
    const car = cars.find(c => c.id === carId);
    if (!car || !carModal) return;

    // Set Text Specs
    document.getElementById('modal-car-title').innerText = `${car.brand} ${car.name}`;
    document.getElementById('modal-car-brand').innerText = car.brand;
    document.getElementById('modal-car-price').innerText = `$${car.price.toLocaleString()}`;
    document.getElementById('modal-car-desc').innerText = car.description;
    
    document.getElementById('modal-car-spec-year').innerText = car.year;
    document.getElementById('modal-car-spec-fuel').innerText = car.fuel;
    document.getElementById('modal-car-spec-trans').innerText = car.transmission;
    document.getElementById('modal-car-spec-hp').innerText = `${car.hp} HP`;
    document.getElementById('modal-car-spec-acc').innerText = car.acceleration;
    document.getElementById('modal-car-spec-speed').innerText = car.topSpeed;

    // Set Media
    const mainImg = document.getElementById('modal-car-image');
    mainImg.src = car.image;

    const galleryRow = document.getElementById('modal-car-gallery-row');
    galleryRow.innerHTML = '';
    
    // Merge image & gallery to create thumbnail row
    const allImages = [car.image, ...(car.gallery || [])];
    const uniqueImages = [...new Set(allImages)];

    uniqueImages.forEach((imgSrc, index) => {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.className = `modal-gal-thumb ${index === 0 ? 'active' : ''}`;
      img.addEventListener('click', () => {
        mainImg.src = imgSrc;
        galleryRow.querySelectorAll('.modal-gal-thumb').forEach(t => t.classList.remove('active'));
        img.classList.add('active');
      });
      galleryRow.appendChild(img);
    });

    carModal.classList.add('active');
  };

  if (carModalClose) {
    carModalClose.addEventListener('click', () => {
      carModal.classList.remove('active');
      activeCarDetailsId = null;
    });
  }

  // --- CONTACT CLIENT/LEAD MODAL ---
  const leadModal = document.getElementById('lead-contact-modal');
  const leadModalClose = document.getElementById('modal-lead-close-btn');
  const btnCancelContact = document.getElementById('btn-cancel-contact');
  const btnSendContact = document.getElementById('btn-send-contact');
  const contactChannel = document.getElementById('contact-channel');
  const contactTemplate = document.getElementById('contact-template');
  const contactMsgContent = document.getElementById('contact-msg-content');

  window.openContactLeadModal = (leadId) => {
    activeLeadContactId = leadId;
    const lead = leads.find(l => l.id === leadId);
    if (!lead || !leadModal) return;

    document.getElementById('contact-client-name').innerText = lead.name;
    document.getElementById('contact-client-car').innerText = lead.carName;

    // Set default preview content based on template
    updateMessagePreview(lead);

    leadModal.classList.add('active');
  };

  function updateMessagePreview(lead) {
    if (!lead) return;

    const templateType = contactTemplate.value;
    const clientName = lead.name;
    const carName = lead.carName;

    let text = "";
    if (templateType === 'intro') {
      text = `Dear ${clientName},\n\nThank you for choosing AURA MOTORS. We received your request regarding the ${carName}. We would like to schedule a private test drive at your earliest convenience.\n\nPlease let us know if this weekend works for you.\n\nBest Regards,\nSales Team | Aura Motors`;
    } else if (templateType === 'pricing') {
      text = `Dear ${clientName},\n\nFollowing your inquiry about the ${carName}, we have prepared a bespoke leasing and pricing sheet for you. The monthly rates starting with an elite financing structure are attached.\n\nLet us know if you want to proceed with customizing your build.\n\nBest Regards,\nSales Team | Aura Motors`;
    } else if (templateType === 'avail') {
      text = `Dear ${clientName},\n\nGreat news regarding the ${carName}! We have secured a VIP showroom allocation block. We can expedite the delivery date directly to your address within 14 business days.\n\nReply to lock in this slot.\n\nBest Regards,\nSales Team | Aura Motors`;
    }

    contactMsgContent.value = text;
  }

  if (contactTemplate) {
    contactTemplate.addEventListener('change', () => {
      const lead = leads.find(l => l.id === activeLeadContactId);
      updateMessagePreview(lead);
    });
  }

  function closeLeadModal() {
    leadModal.classList.remove('active');
    activeLeadContactId = null;
  }

  if (leadModalClose) leadModalClose.addEventListener('click', closeLeadModal);
  if (btnCancelContact) btnCancelContact.addEventListener('click', closeLeadModal);

  if (btnSendContact) {
    btnSendContact.addEventListener('click', () => {
      const lead = leads.find(l => l.id === activeLeadContactId);
      if (!lead) return;

      const channel = contactChannel.value;
      showToast(`Sales proposal sent successfully via ${channel.toUpperCase()}!`);
      
      // Update status to contacted
      changeLeadStatus(lead.id, 'Contacted');
      
      // Refresh active view
      if (activeTab === 'leads') renderLeadsTable();
      else if (activeTab === 'dashboard') renderDashboardTables();

      closeLeadModal();
    });
  }

  // Close modals when clicking overlay background
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        activeCarDetailsId = null;
        activeLeadContactId = null;
      }
    });
  });

  // ==========================================================================
  // 15. TOP NAVBAR DROPDOWN TOGGLES
  // ==========================================================================
  const notifToggle = document.getElementById('notifications-toggle');
  const notifDropdown = document.getElementById('notifications-dropdown');
  const profToggle = document.getElementById('profile-toggle');
  const profDropdown = document.getElementById('profile-dropdown');

  function closeAllDropdowns() {
    if (notifDropdown) notifDropdown.classList.remove('active');
    if (profDropdown) profDropdown.classList.remove('active');
  }

  if (notifToggle && notifDropdown) {
    notifToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      notifDropdown.classList.toggle('active');
      
      // Mark notification dot as read
      const dot = document.getElementById('notif-dot');
      if (dot) dot.style.display = 'none';
    });
  }

  if (profToggle && profDropdown) {
    profToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      profDropdown.classList.toggle('active');
    });
  }

  document.addEventListener('click', (e) => {
    // Close dropdowns when clicking outside
    if (notifDropdown && !notifDropdown.contains(e.target) && !notifToggle.contains(e.target)) {
      notifDropdown.classList.remove('active');
    }
    if (profDropdown && !profDropdown.contains(e.target) && !profToggle.contains(e.target)) {
      profDropdown.classList.remove('active');
    }
  });

  // Clear notifications
  const clearNotifBtn = document.getElementById('clear-notifications-btn');
  if (clearNotifBtn) {
    clearNotifBtn.addEventListener('click', () => {
      const list = document.getElementById('notifications-list');
      if (list) {
        list.innerHTML = `
          <div class="notif-empty">
            <i data-lucide="bell-off"></i>
            <p>No new notifications</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      }
      showToast('Notifications cleared', 'info');
    });
  }

  function populateNotifications() {
    const list = document.getElementById('notifications-list');
    const dot = document.getElementById('notif-dot');
    const leadsBadge = document.getElementById('leads-badge');
    
    if (!list) return;

    list.innerHTML = '';
    const newLeadsList = leads.filter(l => l.status === 'New');
    
    if (leadsBadge) {
      if (newLeadsList.length > 0) {
        leadsBadge.innerText = newLeadsList.length;
        leadsBadge.style.display = '';
      } else {
        leadsBadge.style.display = 'none';
      }
    }

    if (newLeadsList.length === 0) {
      list.innerHTML = `
        <div class="notif-empty">
          <i data-lucide="bell-off"></i>
          <p>No new notifications</p>
        </div>
      `;
      if (dot) dot.style.display = 'none';
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    if (dot) dot.style.display = '';

    newLeadsList.forEach(l => {
      const item = document.createElement('div');
      item.className = 'notif-item';
      item.addEventListener('click', () => {
        closeAllDropdowns();
        switchTab('leads');
      });

      item.innerHTML = `
        <div class="notif-icon-wrapper orange">
          <i data-lucide="message-square"></i>
        </div>
        <div class="notif-item-body">
          <h5>New Inquiry: ${l.name}</h5>
          <p>Interested in the ${l.carName}</p>
          <span class="notif-time">${l.date}</span>
        </div>
      `;
      list.appendChild(item);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================================================
  // 14. LOGOUT PORTALS BUTTONS
  // ==========================================================================
  const sidebarLogout = document.getElementById('sidebar-logout-btn');
  const navbarLogout = document.getElementById('navbar-logout-btn');

  function handleLogout() {
    if (confirm("Admin paneldan chiqishni xohlaysizmi?")) {
      localStorage.removeItem('aura_admin_session');
      showToast('Tizimdan chiqildi', 'info');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    }
  }

  if (sidebarLogout) sidebarLogout.addEventListener('click', handleLogout);
  if (navbarLogout) navbarLogout.addEventListener('click', handleLogout);

  // ==========================================================================
  // 15. INITIALIZE CURRENT VIEW ON LOAD
  // ==========================================================================
  populateNotifications();
  renderProfilePage();
  switchTab('dashboard'); // Initial view

});
