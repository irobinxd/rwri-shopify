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
    stores: {}, // Will be populated from Shopify locations
    // Enable/disable features
    enableProductFiltering: true,
    enableCartValidation: true,
    showUnavailableBadge: true
  };

  // Load Shopify locations dynamically
  function loadShopifyLocations() {
    // Try to get from JSON script tag first
    const locationsScript = document.getElementById('shopify-locations-data');
    if (locationsScript) {
      try {
        const locations = JSON.parse(locationsScript.textContent);
        locations.forEach(location => {
          const handle = location.handle || location.name.toLowerCase().replace(/\s+/g, '-');
          CONFIG.stores[handle] = {
            id: location.id,
            name: location.name,
            handle: handle,
            patterns: [
              location.name.toLowerCase(),
              handle,
              ...location.name.toLowerCase().split(' ').filter(word => word.length > 2)
            ]
          };
        });
        return;
      } catch (e) {
      }
    }

    // Fallback: Fetch from a product variant
    fetchShopifyLocationsFromProduct();
  }

  // Fetch locations from a product variant's availability
  async function fetchShopifyLocationsFromProduct() {
    try {
      // Try to get a product variant ID from the page
      const variantId = document.querySelector('[data-variant-id]')?.dataset.variantId;
      if (!variantId) {
        // Try to get from any product on the page
        const productItem = document.querySelector('[data-product-id]');
        if (productItem) {
          const productId = productItem.dataset.productId;
          // Fetch product data to get variant
          const response = await fetch(`/products/${productId}.js`);
          if (response.ok) {
            const product = await response.json();
            if (product.variants && product.variants.length > 0) {
              const firstVariantId = product.variants[0].id;
              await fetchLocationsFromVariant(firstVariantId);
            }
          }
        }
        return;
      }
      await fetchLocationsFromVariant(variantId);
    } catch (e) {
    }
  }

  async function fetchLocationsFromVariant(variantId) {
    try {
      const baseUrl = window.Shopify?.routes?.root_url || '/';
      const url = `${baseUrl}variants/${variantId}/?section_id=helper-pickup-availability-compact`;
      const response = await fetch(url);
      if (!response.ok) return;
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const alerts = doc.querySelectorAll('.pickup-availability-alert');
      const locationsMap = new Map();
      
      alerts.forEach(alert => {
        const storeNameEl = alert.querySelector('.pickup-availability-alert-store');
        if (storeNameEl) {
          const locationName = storeNameEl.textContent.trim();
          const handle = locationName.toLowerCase().replace(/\s+/g, '-');
          
          if (!locationsMap.has(handle)) {
            locationsMap.set(handle, {
              name: locationName,
              handle: handle,
              patterns: [
                locationName.toLowerCase(),
                handle,
                ...locationName.toLowerCase().split(' ').filter(word => word.length > 2)
              ]
            });
          }
        }
      });
      
      // Populate CONFIG.stores
      locationsMap.forEach((location, handle) => {
        CONFIG.stores[handle] = location;
      });
      
      // Build modal options
      buildModalOptions();
    } catch (e) {
    }
  }

    // Build modal options from loaded locations
    function buildModalOptions() {
      const optionsContainer = document.getElementById('store-selector-options');
      if (!optionsContainer) return;
      
      const loadingEl = optionsContainer.querySelector('.store-selector-loading');
      if (loadingEl) loadingEl.remove();
      
      const stores = Object.entries(CONFIG.stores);
      if (stores.length === 0) {
        optionsContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: #999;">No pickup locations available</div>';
        return;
      }
      
      // Escape HTML for attributes, but decode for display
      const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };
      
      const decodeHtml = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
      };
      
      optionsContainer.innerHTML = stores.map(([handle, store]) => {
        const safeHandle = escapeHtml(handle);
        const displayName = decodeHtml(store.name); // Decode for display
        const safeNameAttr = escapeHtml(store.name); // Escape for attribute
        return `
      <button type="button" class="store-option" data-store="${safeHandle}" data-store-name="${safeNameAttr}">
        <div class="store-option-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <div class="store-option-details">
          <strong>${displayName}</strong>
          <span>Pickup available</span>
        </div>
      </button>
    `;
    }).join('');
    
    // Re-attach event listeners
    if (window.JoelsStoreSelector) {
      window.JoelsStoreSelector.setupModalListeners();
    }
  }

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
      
      // Load Shopify locations first
      loadShopifyLocations();
      
      // Wait a bit for locations to load, then build modal
      setTimeout(() => {
        buildModalOptions();
        this.setupModalListeners();
      }, 100);
      
      // Add body class for current store
      this.updateBodyClass();
      
      // Setup header store indicator
      this.setupHeaderIndicator();
      
      // Check if we need to show the modal
      if (!this.currentStore && this.modal) {
        // Wait for locations to load before showing
        setTimeout(() => {
          if (Object.keys(CONFIG.stores).length > 0) {
            this.showModal();
          }
        }, 500);
      }
      
      // Filter products based on store (with delay to ensure DOM is ready)
      if (CONFIG.enableProductFiltering && this.currentStore) {
        setTimeout(() => {
          this.filterProducts();
        }, 500);
      }
      
      // Check product page availability (with delay to ensure DOM is ready)
      if (this.currentStore) {
        setTimeout(() => {
          this.checkProductPageAvailability();
        }, 800);
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
      document.body.classList.remove('store-jpp', 'store-jpa', 'store-not-selected', 'store-selected');
      if (this.currentStore) {
        document.body.classList.add(`store-${this.currentStore}`, 'store-selected');
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
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.classList.add('store-modal-open');
      }
    }

    hideModal() {
      if (this.modal) {
        this.modal.classList.remove('active');
        this.modal.style.display = '';
        document.body.style.overflow = '';
        document.body.classList.remove('store-modal-open');
      }
    }

    setupModalListeners() {
      if (!this.modal) return;

      // Store option buttons - remove old listeners first
      const storeOptions = this.modal.querySelectorAll('.store-option');
      storeOptions.forEach(option => {
        // Clone to remove all event listeners
        const newOption = option.cloneNode(true);
        option.parentNode.replaceChild(newOption, option);
        
        // Add new listener
        newOption.addEventListener('click', (e) => {
          const storeCode = newOption.dataset.store;
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
      const previousStore = this.currentStore;
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
      
      // Check product page availability - reset debounce first
      this._checkingAvailability = false;
      this.checkProductPageAvailability();
      
      // Validate cart if items exist - especially if store changed
      if (CONFIG.enableCartValidation) {
        if (previousStore && previousStore !== storeCode) {
          // Store changed - check for incompatible items
          this.validateCartOnStoreChange(previousStore, storeCode);
        } else {
          this.validateCart();
        }
      }
    }

    showConfirmation(storeName) {
      // Decode HTML entities for display
      const decodeHtml = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
      };
      
      const displayName = decodeHtml(storeName);
      
      // Create toast notification
      const toast = document.createElement('div');
      toast.className = 'store-toast';
      
      // Use textContent for the name to avoid HTML injection
      const toastContent = document.createElement('div');
      toastContent.className = 'store-toast-content';
      toastContent.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Store set to <strong></strong></span>
      `;
      toastContent.querySelector('strong').textContent = displayName;
      toast.appendChild(toastContent);
      
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
      const headerIndicator = document.getElementById('joels-store-pin');
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
      const tooltip = document.getElementById('joels-pin-tooltip');
      if (tooltip && this.currentStore) {
        let storeName = CONFIG.stores[this.currentStore]?.name || 'Select Store';
        
        // Decode HTML entities (like &#39; to ')
        const decodeHtml = (html) => {
          const txt = document.createElement('textarea');
          txt.innerHTML = html;
          return txt.value;
        };
        
        // Use textContent to safely handle special characters
        tooltip.textContent = decodeHtml(storeName);
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
        if (!response.ok) {
          return true; // Default to available if can't check
        }
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Get selected store info
        const selectedStore = CONFIG.stores[this.currentStore];
        if (!selectedStore) {
          return true; // If store not found, show product
        }
        
        // Collect all availability data
        const alerts = doc.querySelectorAll('.pickup-availability-alert');
        
        // Check if available at selected store
        let isAvailableAtSelectedStore = false;
        let storeFound = false;
        
        // Normalize the selected store handle for comparison
        const selectedStoreHandle = this.currentStore.toLowerCase()
          .replace(/[''&#39;]/g, '')
          .replace(/\s+/g, '-');
        const selectedStoreName = selectedStore.name.toLowerCase()
          .replace(/[''&#39;]/g, '');
        
        // Check if selected store is curbside or in-store pickup
        const selectedIsCurbside = selectedStoreHandle.includes('curbside');
        const selectedIsInStore = selectedStoreHandle.includes('in-store');
        
        for (const alert of alerts) {
          const storeNameEl = alert.querySelector('.pickup-availability-alert-store');
          if (!storeNameEl) continue;
          
          const apiStoreName = storeNameEl.textContent.trim();
          const apiStoreNameLower = apiStoreName.toLowerCase().replace(/[''&#39;]/g, '');
          const apiStoreHandle = apiStoreNameLower.replace(/\s+/g, '-');
          
          // Check if API store is curbside or in-store
          const apiIsCurbside = apiStoreHandle.includes('curbside');
          const apiIsInStore = apiStoreHandle.includes('in-store');
          
          let matches = false;
          
          // Method 1: Exact handle match (most reliable)
          if (apiStoreHandle === selectedStoreHandle) {
            matches = true;
          }
          
          // Method 2: Handle contains match (for slight variations)
          if (!matches) {
            // Normalize both handles by removing common prefixes
            const normalizedSelected = selectedStoreHandle.replace('joel-39-s-place-', '').replace('joels-place-', '');
            const normalizedApi = apiStoreHandle.replace('joel-39-s-place-', '').replace('joels-place-', '');
            
            if (normalizedSelected === normalizedApi) {
              matches = true;
            }
          }
          
          // Method 3: Match by location + pickup type
          if (!matches) {
            // Extract location part (e.g., "glorietta-4", "proscenium-rockwell")
            const locationKeywords = ['proscenium', 'rockwell', 'glorietta', 'alabang', 'makati', 'bgc', 'fort'];
            
            for (const keyword of locationKeywords) {
              if (selectedStoreHandle.includes(keyword) && apiStoreHandle.includes(keyword)) {
                // Same location - now check pickup type matches
                if (selectedIsCurbside && apiIsCurbside) {
                  matches = true;
                } else if (selectedIsInStore && apiIsInStore) {
                  matches = true;
                } else if (!selectedIsCurbside && !selectedIsInStore && !apiIsCurbside && !apiIsInStore) {
                  // Neither specifies pickup type - consider a match
                  matches = true;
                }
                break;
              }
            }
          }
          
          if (matches) {
            storeFound = true;
            const isAvailable = alert.querySelector('.alert--success');
            isAvailableAtSelectedStore = !!isAvailable;
            break;
          }
        }
        
        // If store not found in the list, default to false (not available)
        return storeFound ? isAvailableAtSelectedStore : false;
      } catch (e) {
        return true; // Default to showing
      }
    }

    updateProductVisibility(item, isAvailable) {
      const addToCartBtn = item.querySelector('[data-js-product-add-to-cart], .quick-add-to-cart button, button[name="add"]');
      
      if (isAvailable) {
        item.classList.remove('store-unavailable');
        item.style.display = '';
        
        // Restore Add to Cart button if exists
        if (addToCartBtn) {
          addToCartBtn.disabled = false;
          addToCartBtn.classList.remove('disabled', 'store-unavailable-button');
          const btnText = addToCartBtn.querySelector('.button__text');
          if (btnText && btnText.dataset.originalText) {
            btnText.textContent = btnText.dataset.originalText;
          }
        }
      } else {
        item.classList.add('store-unavailable');
        
        // Change Add to Cart button to "Not Available"
        if (addToCartBtn) {
          addToCartBtn.disabled = true;
          addToCartBtn.classList.add('disabled', 'store-unavailable-button');
          const btnText = addToCartBtn.querySelector('.button__text');
          if (btnText) {
            if (!btnText.dataset.originalText) {
              btnText.dataset.originalText = btnText.textContent;
            }
            btnText.textContent = 'Not Available';
          }
        }
      }
    }

    // Check product page availability and disable add-to-cart
    async checkProductPageAvailability() {
      // Debounce to prevent multiple calls
      if (this._checkingAvailability) return;
      this._checkingAvailability = true;
      
      // Check if we're on an actual product page (for warning display)
      const isProductPage = window.location.pathname.includes('/products/');
      
      try {
        if (!this.currentStore) {
          this.enableAddToCartButton();
          return;
        }
        
        // Check if we're on a product page
        const productForm = document.querySelector('[data-js-product-form], product-form');
        if (!productForm) return;
        
        // Get current variant ID
        const variantInput = productForm.querySelector('input[name="id"]');
        if (!variantInput) return;
        
        const variantId = variantInput.value;
        if (!variantId) return;
        
        // Check availability
        const isAvailable = await this.checkVariantAvailability(variantId);
        
        // Find add-to-cart button
        const addToCartBtn = productForm.querySelector('[data-js-product-add-to-cart], button[type="submit"][name="add"]');
        const addToCartText = productForm.querySelector('[data-js-product-add-to-cart-text]');
        
        if (addToCartBtn) {
          // Store original text if not already stored
          if (addToCartText && !addToCartText.dataset.originalText) {
            addToCartText.dataset.originalText = addToCartText.textContent;
          }
          
          if (!isAvailable) {
            // Disable button
            addToCartBtn.disabled = true;
            addToCartBtn.classList.add('disabled', 'store-unavailable-button');
            addToCartBtn.setAttribute('aria-disabled', 'true');
            
            // Update button text
            if (addToCartText) {
              addToCartText.textContent = 'Not Available';
            }
            
            // Only show warning message on actual product pages
            if (isProductPage) {
              const storeName = CONFIG.stores[this.currentStore]?.name || this.currentStore;
              this.showProductUnavailableMessage(storeName);
            }
            
            // Store availability state
            addToCartBtn.dataset.storeUnavailable = 'true';
            productForm.dataset.storeUnavailable = 'true';
            productForm.dataset.storeUnavailableVariant = variantId;
          } else {
            // Enable button if product is available
            this.enableAddToCartButton();
          }
        }
      } finally {
        this._checkingAvailability = false;
      }
    }

    enableAddToCartButton() {
      const productForm = document.querySelector('[data-js-product-form], product-form');
      if (!productForm) return;
      
      const addToCartBtn = productForm.querySelector('[data-js-product-add-to-cart], button[type="submit"][name="add"]');
      const addToCartText = productForm.querySelector('[data-js-product-add-to-cart-text]');
      
      // Clear form data attributes
      productForm.removeAttribute('data-store-unavailable');
      productForm.removeAttribute('data-store-unavailable-variant');
      
      if (addToCartBtn) {
        // Check if button was disabled by us (store-unavailable-button class)
        const wasDisabledByUs = addToCartBtn.classList.contains('store-unavailable-button');
        
        // Only re-enable if we disabled it
        if (wasDisabledByUs) {
          addToCartBtn.disabled = false;
          addToCartBtn.classList.remove('disabled', 'store-unavailable-button');
          addToCartBtn.removeAttribute('aria-disabled');
          addToCartBtn.removeAttribute('data-store-unavailable');
          
          // Restore original text if available
          if (addToCartText) {
            if (addToCartText.dataset.originalText) {
              addToCartText.textContent = addToCartText.dataset.originalText;
            } else {
              // Fallback to default text
              addToCartText.textContent = window.KROWN?.settings?.locales?.products_add_to_cart_button || 'Add to cart';
            }
          }
        }
        
        // Remove warning message
        this.hideProductUnavailableMessage();
      }
    }

    preventUnavailableAddToCart(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const storeName = CONFIG.stores[this.currentStore]?.name || this.currentStore;
      const decodedName = this.decodeHtml(storeName);
      alert(`This product is not available for pickup at ${decodedName}. Please select a different store.`);
      return false;
    }

    showProductUnavailableMessage(storeName) {
      // Remove existing message
      this.hideProductUnavailableMessage();
      
      const productForm = document.querySelector('[data-js-product-form], product-form');
      if (!productForm) return;
      
      const addToCartBtn = productForm.querySelector('[data-js-product-add-to-cart], button[type="submit"][name="add"]');
      if (!addToCartBtn) return;
      
      const safeStoreName = this.escapeHtml(storeName);
      
      // Create warning message
      const warning = document.createElement('div');
      warning.className = 'store-product-unavailable-message';
      warning.innerHTML = `
        <div class="store-product-unavailable-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>Not available at <strong>${this.decodeHtml(safeStoreName)}</strong>. Select a different store.</span>
        </div>
      `;
      
      // Insert before add-to-cart button or in product actions
      const parent = addToCartBtn.closest('.product__cart-functions, .product-actions, .flex-buttons, .product-form');
      if (parent) {
        // Try to insert before the button's immediate parent
        const buttonParent = addToCartBtn.parentElement;
        if (buttonParent && buttonParent !== parent) {
          buttonParent.insertBefore(warning, addToCartBtn);
        } else {
          parent.insertBefore(warning, addToCartBtn);
        }
      } else {
        addToCartBtn.parentNode.insertBefore(warning, addToCartBtn);
      }
      
      // Prevent form submission - use capture phase to run first
      const form = productForm.querySelector('form');
      if (form) {
        // Remove old handler if exists
        if (form._storeSubmitHandler) {
          form.removeEventListener('submit', form._storeSubmitHandler, true);
        }
        
        // Create new handler
        const submitHandler = (e) => {
          // Check if product is unavailable at selected store
          if (productForm.dataset.storeUnavailable === 'true') {
            const currentVariantId = form.querySelector('input[name="id"]')?.value;
            if (currentVariantId === productForm.dataset.storeUnavailableVariant) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              
              // Show alert
              const storeName = CONFIG.stores[this.currentStore]?.name || this.currentStore;
              alert(`This product is not available for pickup at ${this.decodeHtml(storeName)}. Please select a different store.`);
              return false;
            }
          }
        };
        
        form._storeSubmitHandler = submitHandler;
        form.addEventListener('submit', submitHandler, true); // Use capture phase to run before other handlers
      }
      
      // Also intercept the add-to-cart custom event
      if (productForm) {
        // Remove old listener
        if (productForm._storeAddToCartHandler) {
          productForm.removeEventListener('add-to-cart', productForm._storeAddToCartHandler, true);
        }
        
        const addToCartHandler = (e) => {
          if (productForm.dataset.storeUnavailable === 'true') {
            const currentVariantId = form?.querySelector('input[name="id"]')?.value;
            if (currentVariantId === productForm.dataset.storeUnavailableVariant) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              
              const storeName = CONFIG.stores[this.currentStore]?.name || this.currentStore;
              alert(`This product is not available for pickup at ${this.decodeHtml(storeName)}. Please select a different store.`);
              return false;
            }
          }
        };
        
        productForm._storeAddToCartHandler = addToCartHandler;
        productForm.addEventListener('add-to-cart', addToCartHandler, true);
      }
      
      // Add styles if not present
      if (!document.getElementById('store-product-unavailable-styles')) {
        const styles = document.createElement('style');
        styles.id = 'store-product-unavailable-styles';
        styles.textContent = `
          .store-product-unavailable-message {
            margin-bottom: 1rem;
            padding: 1rem;
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 8px;
            color: #856404;
          }
          .store-product-unavailable-content {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            font-size: 0.9rem;
            line-height: 1.5;
          }
          .store-product-unavailable-content svg {
            flex-shrink: 0;
            margin-top: 2px;
            color: #ffc107;
          }
          .store-product-unavailable-content strong {
            color: #856404;
          }
          .store-unavailable-button {
            opacity: 0.6;
            cursor: not-allowed !important;
            pointer-events: none;
          }
        `;
        document.head.appendChild(styles);
      }
    }

    hideProductUnavailableMessage() {
      const existing = document.querySelector('.store-product-unavailable-message');
      if (existing) {
        existing.remove();
      }
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    decodeHtml(html) {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
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
      }
    }

    // Validate cart when store changes
    async validateCartOnStoreChange(oldStore, newStore) {
      if (!this.currentStore) return;

      try {
        const response = await fetch('/cart.js');
        if (!response.ok) return;
        
        const cart = await response.json();
        if (!cart.items || cart.items.length === 0) return;

        const unavailableItems = [];
        const availableItems = [];
        
        // Check each item
        for (const item of cart.items) {
          const isAvailable = await this.checkVariantAvailability(item.variant_id);
          if (!isAvailable) {
            unavailableItems.push(item);
          } else {
            availableItems.push(item);
          }
        }

        if (unavailableItems.length > 0) {
          // Show warning with option to remove incompatible items
          this.showCartStoreChangeWarning(unavailableItems, availableItems, oldStore, newStore);
        }
      } catch (e) {
      }
    }

    showCartStoreChangeWarning(unavailableItems, availableItems, oldStore, newStore) {
      const oldStoreName = this.decodeHtml(CONFIG.stores[oldStore]?.name || oldStore);
      const newStoreName = this.decodeHtml(CONFIG.stores[newStore]?.name || newStore);
      
      // Create warning modal
      const warning = document.createElement('div');
      warning.className = 'store-cart-warning-modal';
      warning.innerHTML = `
        <div class="store-cart-warning-overlay"></div>
        <div class="store-cart-warning-content">
          <h3>⚠️ Store Changed</h3>
          <p>You changed your pickup location from <strong>${this.escapeHtml(oldStoreName)}</strong> to <strong>${this.escapeHtml(newStoreName)}</strong>.</p>
          <p>The following items in your cart are not available at the new location:</p>
          <ul>
            ${unavailableItems.map(item => `<li>${this.escapeHtml(item.product_title)}${item.variant_title && item.variant_title !== 'Default Title' ? ' (' + this.escapeHtml(item.variant_title) + ')' : ''}</li>`).join('')}
          </ul>
          ${availableItems.length > 0 ? `<p><strong>Note:</strong> ${availableItems.length} item(s) in your cart are still available at ${this.escapeHtml(newStoreName)}.</p>` : ''}
          <p>What would you like to do?</p>
          <div class="store-cart-warning-actions">
            <button type="button" class="btn btn-secondary" data-action="revert">Revert to ${this.escapeHtml(oldStoreName)}</button>
            <button type="button" class="btn btn-primary" data-action="remove">Remove Incompatible Items</button>
          </div>
        </div>
      `;
      
      // Add styles if not present
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
            z-index: 10003;
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
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
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
            border: none;
          }
          .store-cart-warning-actions .btn-secondary {
            background: #e5e5e5;
            color: #333;
          }
          .store-cart-warning-actions .btn-primary {
            background: var(--color-accent, #70a062);
            color: #fff;
          }
        `;
        document.head.appendChild(styles);
      }
      
      document.body.appendChild(warning);
      
      // Event listeners
      warning.querySelector('[data-action="revert"]').addEventListener('click', () => {
        // Revert to previous store
        this.saveStore(oldStore);
        this.updateHeaderIndicator();
        this.checkProductPageAvailability();
        warning.remove();
        
        // Show confirmation
        this.showConfirmation(CONFIG.stores[oldStore]?.name || oldStore);
      });
      
      warning.querySelector('[data-action="remove"]').addEventListener('click', async () => {
        // Remove incompatible items from cart
        const removePromises = unavailableItems.map(item => 
          fetch('/cart/change.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item.key, quantity: 0 })
          })
        );
        
        await Promise.all(removePromises);
        warning.remove();
        
        // Reload page or update cart
        if (window.location.pathname.includes('/cart')) {
          window.location.reload();
        } else {
          // Trigger cart update event
          document.dispatchEvent(new CustomEvent('cart-updated'));
        }
      });
      
      warning.querySelector('.store-cart-warning-overlay').addEventListener('click', () => {
        // Clicking overlay also reverts to previous store
        this.saveStore(oldStore);
        this.updateHeaderIndicator();
        this.checkProductPageAvailability();
        warning.remove();
      });
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

