// JWT decoder for decoding Google's credential response (id_token) on client side
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT token", error);
    return null;
  }
}

// Central Auth Management Object
const AuraAuth = {
  user: JSON.parse(localStorage.getItem('aura_user')) || null,
  clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace with actual Client ID in production

  // Check if session is already active on load
  checkSession() {
    if (this.user) {
      this.updateNavbarForUser(this.user);
      this.renderDashboard(this.user);
      return true;
    }
    return false;
  },

  // Initialize official Google Identity Services SDK
  initGoogleAuth() {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response) => this.handleGoogleCredential(response)
      });
      
      google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { 
          theme: 'filled_black', 
          size: 'large', 
          shape: 'rectangular',
          width: 320,
          text: 'continue_with'
        }
      );
    } else {
      console.warn("Google Client SDK not loaded. Proceeding with simulated sandbox login.");
      const googleBtnContainer = document.getElementById('google-signin-btn');
      if (googleBtnContainer) {
        googleBtnContainer.innerHTML = `
          <button class="btn btn-google-fallback" id="btn-google-fallback">
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        `;
        document.getElementById('btn-google-fallback').addEventListener('click', () => {
          this.triggerSimulatedLogin();
        });
      }
    }
  },

  // Callback handler for official Google auth
  handleGoogleCredential(response) {
    this.showAuthLoader();
    const profile = parseJwt(response.credential);
    if (profile) {
      setTimeout(() => {
        this.loginUser({
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          token: response.credential
        });
      }, 1500); // Luxury delay
    } else {
      this.hideAuthLoader();
      this.showErrorMessage("Google authentication failed. Invalid token payload.");
    }
  },

  // Simulated login for local files / offline testing
  triggerSimulatedLogin() {
    this.showAuthLoader();
    // Simulate API fetch delay
    setTimeout(() => {
      const mockProfile = {
        name: "Arthur Pendragon",
        email: "arthur@auramotors.com",
        picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
        token: "mock-jwt-token-auramotors-auth"
      };
      this.loginUser(mockProfile);
    }, 1500);
  },

  // Setup user session
  loginUser(userProfile) {
    this.user = userProfile;
    localStorage.setItem('aura_user', JSON.stringify(this.user));
    
    // Update navbar avatar
    this.updateNavbarForUser(this.user);

    // Update and populate dashboard content
    this.renderDashboard(this.user);

    // Fade out loading overlay
    this.hideAuthLoader();

    // Show Success feedback alert
    this.showSuccessMessage(`Welcome back, ${this.user.name}!`);

    // Reveal dashboard nav link
    const dashLink = document.getElementById('nav-dashboard-link');
    if (dashLink) dashLink.style.display = '';

    // Re-render icons after avatar swap
    if (window.lucide) window.lucide.createIcons();

    // Redirect to Dashboard
    window.location.hash = '#dashboard';
  },

  // Clear user session
  logoutUser() {
    this.showAuthLoader();
    setTimeout(() => {
      this.user = null;
      localStorage.removeItem('aura_user');
      
      // Reset navbar avatar to general user icon
      const userBtn = document.getElementById('user-profile-toggle');
      if (userBtn) {
        userBtn.innerHTML = `<i data-lucide="user"></i>`;
        if (window.lucide) window.lucide.createIcons();
      }

      // Hide dropdown if open
      const dropdown = document.getElementById('user-profile-dropdown');
      if (dropdown) dropdown.classList.remove('active');

      this.hideAuthLoader();
      
      // Redirect to home
      window.location.hash = '#';
    }, 1000);
  },

  // Update navbar layout with Google Avatar
  updateNavbarForUser(user) {
    const userBtn = document.getElementById('user-profile-toggle');
    if (userBtn) {
      userBtn.innerHTML = `
        <img class="nav-avatar" src="${user.picture}" alt="${user.name}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid var(--accent-blue);">
      `;
    }

    // Populate dropdown info
    const dropdownAvatar = document.getElementById('dropdown-user-avatar');
    const dropdownName = document.getElementById('dropdown-user-name');
    const dropdownEmail = document.getElementById('dropdown-user-email');

    if (dropdownAvatar) dropdownAvatar.src = user.picture;
    if (dropdownName) dropdownName.innerText = user.name;
    if (dropdownEmail) dropdownEmail.innerText = user.email;
  },

  // Populate dynamic authenticated dashboard components
  renderDashboard(user) {
    const banner = document.getElementById('dash-welcome-banner');
    if (banner) {
      banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 2rem;">
          <img src="${user.picture}" alt="${user.name}" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid var(--accent-blue); box-shadow: 0 0 15px var(--accent-blue-glow);">
          <div>
            <h2 style="font-family: var(--font-family-heading); font-size: 1.8rem; text-transform: uppercase;">Hello, ${user.name}</h2>
            <p style="color: var(--text-secondary); margin-top: 0.3rem;">Signed in as ${user.email} | VIP Collector Status</p>
          </div>
        </div>
      `;
    }

    // Render Wishlist items inside Dashboard spec-grid
    const dashWishlist = document.getElementById('dash-wishlist-cards');
    if (dashWishlist) {
      dashWishlist.innerHTML = '';
      const wishIds = JSON.parse(localStorage.getItem('aura_wishlist')) || [];
      
      if (wishIds.length === 0) {
        dashWishlist.innerHTML = `
          <div class="drawer-empty-msg" style="grid-column: 1/-1;">
            No saved vehicles in your catalog. Explore our fleet and click the heart icon.
          </div>
        `;
      } else {
        wishIds.forEach(id => {
          // Assuming carsData is loaded globally from cars.js
          if (typeof carsData !== 'undefined') {
            const car = carsData.find(c => c.id === id);
            if (car) {
              const card = document.createElement('div');
              card.className = 'car-card glass';
              card.innerHTML = `
                <div class="car-card-img" style="height: 180px;">
                  <img src="${car.image}" alt="${car.name}">
                </div>
                <div class="car-card-content" style="padding: 1.5rem;">
                  <div class="car-card-brand">${car.brand}</div>
                  <h4 style="font-weight:700; margin-bottom: 1rem;">${car.name}</h4>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; color: var(--accent-blue);">$${car.price.toLocaleString()}</span>
                    <button class="btn btn-secondary btn-quickview" data-action="quickview" data-id="${car.id}" style="padding: 0.5rem 1rem; font-size: 0.7rem;">Explore</button>
                  </div>
                </div>
              `;
              
              // Attach button listener
              card.querySelector('.btn-quickview').addEventListener('click', () => {
                if (typeof openQuickviewModal === 'function') {
                  openQuickviewModal(car.id);
                }
              });

              dashWishlist.appendChild(card);
            }
          }
        });
      }
    }
  },

  // Auth Loader Visual Animations
  showAuthLoader() {
    const authOverlay = document.getElementById('auth-loading-overlay');
    if (authOverlay) {
      authOverlay.classList.add('active');
    }
  },

  hideAuthLoader() {
    const authOverlay = document.getElementById('auth-loading-overlay');
    if (authOverlay) {
      authOverlay.classList.remove('active');
    }
  },

  // Notification overlays
  showSuccessMessage(msg) {
    this.createNotification(msg, 'success');
  },

  showErrorMessage(msg) {
    this.createNotification(msg, 'error');
  },

  createNotification(msg, type) {
    // Check if notification box already exists
    let box = document.getElementById('auth-notifications-container');
    if (!box) {
      box = document.createElement('div');
      box.id = 'auth-notifications-container';
      document.body.appendChild(box);
    }

    const note = document.createElement('div');
    note.className = `auth-note glass note-${type}`;
    note.innerHTML = `
      <div class="note-icon">
        <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-triangle'}"></i>
      </div>
      <div class="note-text">${msg}</div>
    `;

    box.appendChild(note);
    if (window.lucide) window.lucide.createIcons();

    // Trigger animate-in
    setTimeout(() => note.classList.add('active'), 50);

    // Dismiss
    setTimeout(() => {
      note.classList.remove('active');
      setTimeout(() => note.remove(), 500);
    }, 4000);
  }
};

window.AuraAuth = AuraAuth;
