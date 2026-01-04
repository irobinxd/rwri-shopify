/**
 * Store Selector - Joel's Place
 * Manages store selection and product filtering based on inventory availability
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    storageKey: 'joels_preferred_store',
    cookieDays: 30,
    stores: {
      'jpp': {
        name: "Joel's Place Proscenium",
        patterns: ['proscenium', 'jpp', 'rockwell']
      },
      'jpa': {
        name: "Joel's Place Alabang", 
        patterns: ['alabang', 'jpa', 'molito']
      }
    },
    // Enable/disable features
    enableProductFiltering: true,
    enableCartValidation: true,
    showUnavailableBadge: true
  };

  // Store Selector Class
  class StoreSelector {
    constructor() {
      this.currentStore = null;
      this.modal = null;
      this.init();
    }

    init() {
      // Wait for DOM
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        this.setup();
      }
    }

    setup() {
      this.modal = document.getElementById('store-selector-modal');
      this.currentStore = this.getStoredStore();
      
      // Add body class for current store
      this.updateBodyClass();
      
      // Setup modal event listeners
      this.setupModalListeners();
      
      // Setup header store indicator
      this.setupHeaderIndicator();
      
      // Check if we need to show the modal
      if (!this.currentStore && this.modal) {
        this.showModal();
      }
      
      // Filter products based on store
      if (CONFIG.enableProductFiltering && this.currentStore) {
        this.filterProducts();
      }
      
      // Dispatch event for other scripts
      this.dispatchStoreEvent();
    }

    // Get stored store from localStorage
    getStoredStore() {
      try {
        return localStorage.getItem(CONFIG.storageKey);
      } catch (e) {
        // Fallback to cookie
        return this.getCookie(CONFIG.storageKey);
      }
    }

    // Save store selection
    saveStore(storeCode) {
      try {
        localStorage.setItem(CONFIG.storageKey, storeCode);
      } catch (e) {
        // Fallback to cookie
        this.setCookie(CONFIG.storageKey, storeCode, CONFIG.cookieDays);
      }
      this.currentStore = storeCode;
      this.updateBodyClass();
      this.dispatchStoreEvent();
    }

    // Cookie helpers
    setCookie(name, value, days) {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    getCookie(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    }

    // Update body class for CSS targeting
    updateBodyClass() {
      document.body.classList.remove('store-jpp', 'store-jpa', 'store-not-selected');
      if (this.currentStore) {
        document.body.classList.add(`store-${this.currentStore}`);
      } else {
        document.body.classList.add('store-not-selected');
      }
    }

    // Dispatch custom event
    dispatchStoreEvent() {
      const event = new CustomEvent('store-selected', {
        detail: {
          store: this.currentStore,
          storeName: this.currentStore ? CONFIG.stores[this.currentStore]?.name : null
        }
      });
      document.dispatchEvent(event);
    }

    // Modal methods
    showModal() {
      if (this.modal) {
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    }

    hideModal() {
      if (this.modal) {
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    }

    setupModalListeners() {
      if (!this.modal) return;

      // Store option buttons
      const storeOptions = this.modal.querySelectorAll('.store-option');
      storeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          const storeCode = option.dataset.store;
          if (storeCode) {
            this.selectStore(storeCode);
          }
        });
      });

      // Don't close on overlay click - force selection
      // const overlay = this.modal.querySelector('.store-selector-overlay');
      // if (overlay) {
      //   overlay.addEventListener('click', () => this.hideModal());
      // }
    }

    selectStore(storeCode) {
      this.saveStore(storeCode);
      this.hideModal();
      
      // Show confirmation
      this.showConfirmation(CONFIG.stores[storeCode]?.name || storeCode);
      
      // Update header indicator
      this.updateHeaderIndicator();
      
      // Filter products
      if (CONFIG.enableProductFiltering) {
        this.filterProducts();
      }
      
      // Validate cart if items exist
      if (CONFIG.enableCartValidation) {
        this.validateCart();
      }
    }

    showConfirmation(storeName) {
      // Create toast notification
      const toast = document.createElement('div');
      toast.className = 'store-toast';
      toast.innerHTML = `
        <div class="store-toast-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Store set to <strong>${storeName}</strong></span>
        </div>
      `;
      
      // Add styles if not present
      if (!document.getElementById('store-toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'store-toast-styles';
        styles.textContent = `
          .store-toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: #fff;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 99999;
            animation: toastSlideUp 0.3s ease-out;
          }
          .store-toast-content {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .store-toast svg {
            color: #70a062;
          }
          @keyframes toastSlideUp {
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
        `;
        document.head.appendChild(styles);
      }
      
      document.body.appendChild(toast);
      
      // Remove after 3 seconds
      setTimeout(() => {
        toast.style.animation = 'toastSlideUp 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    // Header indicator
    setupHeaderIndicator() {
      // Find or create header indicator
      const headerIndicator = document.getElementById('store-header-indicator');
      if (headerIndicator) {
        this.updateHeaderIndicator();
        
        // Click to change store
        headerIndicator.addEventListener('click', (e) => {
          e.preventDefault();
          this.showModal();
        });
      }
    }

    updateHeaderIndicator() {
      const headerIndicator = document.getElementById('store-header-indicator');
      if (!headerIndicator) return;

      const storeNameEl = headerIndicator.querySelector('.store-indicator-name');
      if (storeNameEl && this.currentStore) {
        storeNameEl.textContent = CONFIG.stores[this.currentStore]?.name || 'Select Store';
      }
    }

    // Product filtering
    async filterProducts() {
      if (!this.currentStore) return;

      // Find all product items on the page
      const productItems = document.querySelectorAll('[data-product-id], .product-item, .grid-product, .collection-product');
      
      if (productItems.length === 0) return;

      // For each product, check availability at selected store
      for (const item of productItems) {
        const productId = item.dataset.productId;
        const variantId = item.dataset.variantId || item.querySelector('[data-variant-id]')?.dataset.variantId;
        
        if (variantId) {
          const isAvailable = await this.checkVariantAvailability(variantId);
          this.updateProductVisibility(item, isAvailable);
        }
      }
    }

    async checkVariantAvailability(variantId) {
      try {
        const baseUrl = window.Shopify?.routes?.root_url || '/';
        const url = `${baseUrl}variants/${variantId}/?section_id=helper-pickup-availability-compact`;
        
        const response = await fetch(url);
        if (!response.ok) return true; // Default to showing if can't check
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Check if available at selected store
        const alerts = doc.querySelectorAll('.pickup-availability-alert');
        for (const alert of alerts) {
          const storeNameEl = alert.querySelector('.pickup-availability-alert-store');
          const isAvailable = alert.querySelector('.alert--success');
          
          if (storeNameEl && isAvailable) {
            const storeName = storeNameEl.textContent.toLowerCase();
            const patterns = CONFIG.stores[this.currentStore]?.patterns || [];
            
            for (const pattern of patterns) {
              if (storeName.includes(pattern)) {
                return true;
              }
            }
          }
        }
        
        return false;
      } catch (e) {
        console.warn('Error checking variant availability:', e);
        return true; // Default to showing
      }
    }

    updateProductVisibility(item, isAvailable) {
      if (isAvailable) {
        item.classList.remove('store-unavailable');
        item.style.display = '';
      } else {
        if (CONFIG.showUnavailableBadge) {
          // Show but mark as unavailable
          item.classList.add('store-unavailable');
          
          // Add badge if not present
          if (!item.querySelector('.store-unavailable-badge')) {
            const badge = document.createElement('div');
            badge.className = 'store-unavailable-badge';
            badge.textContent = 'Not available at your store';
            item.style.position = 'relative';
            item.appendChild(badge);
          }
        } else {
          // Hide completely
          item.style.display = 'none';
        }
      }
    }

    // Cart validation
    async validateCart() {
      if (!this.currentStore) return;

      try {
        const response = await fetch('/cart.js');
        if (!response.ok) return;
        
        const cart = await response.json();
        if (!cart.items || cart.items.length === 0) return;

        const unavailableItems = [];
        
        for (const item of cart.items) {
          const isAvailable = await this.checkVariantAvailability(item.variant_id);
          if (!isAvailable) {
            unavailableItems.push(item);
          }
        }

        if (unavailableItems.length > 0) {
          this.showCartWarning(unavailableItems);
        }
      } catch (e) {
        console.warn('Error validating cart:', e);
      }
    }

    showCartWarning(unavailableItems) {
      const storeName = CONFIG.stores[this.currentStore]?.name || this.currentStore;
      const itemNames = unavailableItems.map(item => item.product_title).join(', ');
      
      // Create warning modal
      const warning = document.createElement('div');
      warning.className = 'store-cart-warning-modal';
      warning.innerHTML = `
        <div class="store-cart-warning-overlay"></div>
        <div class="store-cart-warning-content">
          <h3>⚠️ Some items not available</h3>
          <p>The following items are not available at <strong>${storeName}</strong>:</p>
          <ul>
            ${unavailableItems.map(item => `<li>${item.product_title}</li>`).join('')}
          </ul>
          <p>Would you like to remove these items from your cart?</p>
          <div class="store-cart-warning-actions">
            <button type="button" class="btn btn-secondary" data-action="keep">Keep Items</button>
            <button type="button" class="btn btn-primary" data-action="remove">Remove Items</button>
          </div>
        </div>
      `;
      
      // Add styles
      if (!document.getElementById('store-cart-warning-styles')) {
        const styles = document.createElement('style');
        styles.id = 'store-cart-warning-styles';
        styles.textContent = `
          .store-cart-warning-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .store-cart-warning-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
          }
          .store-cart-warning-content {
            position: relative;
            background: #fff;
            padding: 2rem;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
          }
          .store-cart-warning-content h3 {
            margin: 0 0 1rem 0;
            color: #d97706;
          }
          .store-cart-warning-content ul {
            background: #f9f9f9;
            padding: 1rem 1rem 1rem 2rem;
            border-radius: 6px;
            margin: 1rem 0;
          }
          .store-cart-warning-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
          }
          .store-cart-warning-actions button {
            flex: 1;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          }
          .store-cart-warning-actions .btn-secondary {
            background: #e5e5e5;
            border: none;
            color: #333;
          }
          .store-cart-warning-actions .btn-primary {
            background: var(--color-accent, #70a062);
            border: none;
            color: #fff;
          }
        `;
        document.head.appendChild(styles);
      }
      
      document.body.appendChild(warning);
      
      // Event listeners
      warning.querySelector('[data-action="keep"]').addEventListener('click', () => {
        warning.remove();
      });
      
      warning.querySelector('[data-action="remove"]').addEventListener('click', async () => {
        // Remove items from cart
        for (const item of unavailableItems) {
          await fetch('/cart/change.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item.key, quantity: 0 })
          });
        }
        warning.remove();
        // Reload page to reflect changes
        window.location.reload();
      });
      
      warning.querySelector('.store-cart-warning-overlay').addEventListener('click', () => {
        warning.remove();
      });
    }

    // Public method to get current store
    getStore() {
      return this.currentStore;
    }

    // Public method to get store name
    getStoreName() {
      return this.currentStore ? CONFIG.stores[this.currentStore]?.name : null;
    }

    // Public method to change store
    changeStore() {
      this.showModal();
    }
  }

  // Initialize
  window.JoelsStoreSelector = new StoreSelector();

  // Also expose config for customization
  window.JoelsStoreSelectorConfig = CONFIG;

})();


