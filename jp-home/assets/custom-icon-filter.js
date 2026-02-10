/**
 * Custom Icon Label Filter for Product Collections
 * 
 * This script creates a client-side filter for product icon labels.
 * It survives Shopify's AJAX filter updates and shows selected labels as tags.
 * Supports multiple filter containers (sidebar + mobile drawer).
 */

(function() {
  'use strict';

  // Global state that persists across re-initializations
  window.customIconFilterState = window.customIconFilterState || {
    selectedLabels: [],
    initialized: false,
    checkInterval: null,
    updatingTags: false
  };

  const state = window.customIconFilterState;

  // Get ALL filter containers (sidebar + drawer)
  function getAllContainers() {
    return document.querySelectorAll('.custom-icon-filter-container');
  }

  // Main initialization function
  function init() {
    const containers = getAllContainers();
    if (containers.length === 0) return;

    containers.forEach(container => {
      // Check if filter already exists and is functional
      const existingFilter = container.querySelector('.js-custom-icon-filter');
      if (existingFilter && existingFilter.querySelector('[data-icon-filter-checkbox]')) {
        // Filter exists, just re-apply state
        restoreFilterState(container);
        return;
      }

      // Build the filter HTML
      buildFilterHTML(container);
      
      // Set up event listeners
      setupEventListeners(container);
      
      // Restore any previously selected filters
      restoreFilterState(container);
    });

    // Apply filters to products (only needs to happen once)
    applyFilters();
    
    // Update active tags display
    updateActiveTags();

    state.initialized = true;
  }

  // Build the filter HTML structure
  function buildFilterHTML(container) {
    const defaultOpen = container.dataset.defaultOpen === 'true';
    const labelCounts = collectIconLabels();
    const labels = Object.keys(labelCounts).sort();

    if (labels.length === 0) {
      container.innerHTML = '';
      return;
    }

    // Use container id for unique checkbox IDs
    const containerId = container.id || 'default';

    let checkboxesHTML = labels.map((label, index) => {
      const safeValue = escapeHTML(label);
      const checkboxId = `icon-filter-cb-${containerId}-${index}`;
      const isChecked = state.selectedLabels.includes(label) ? 'checked' : '';
      return `
        <li class="facets__item">
          <label class="icon-filter-checkbox" for="${checkboxId}">
            <input type="checkbox" id="${checkboxId}" data-icon-filter-checkbox value="${safeValue}" ${isChecked}>
            <span class="icon-filter-text">${label} <span class="icon-filter-count">(${labelCounts[label]})</span></span>
          </label>
        </li>
      `;
    }).join('');

    container.innerHTML = `
      <details 
        class="disclosure-has-popup facets__disclosure js-filter js-custom-icon-filter" 
        data-index="custom-icon"
        ${defaultOpen ? 'open' : ''}
      >
        <summary class="facets__summary">
          <span class="facets__summary-text">Product Labels</span>
        </summary>
        <div class="facets__display body-text-sm">
          <div class="facets__header">
            <span class="facets__selected no-js-hidden icon-filter-selected-count">
              ${state.selectedLabels.length > 0 ? state.selectedLabels.length + ' selected' : '0 selected'}
            </span>
            <button type="button" class="facets__reset link underlined-link icon-filter-reset">Reset</button>
          </div>
          <ul class="facets__list list-unstyled no-js-hidden" role="list">
            ${checkboxesHTML}
          </ul>
        </div>
      </details>
    `;
  }

  // Collect icon labels from products on the page
  function collectIconLabels() {
    const products = document.querySelectorAll('[data-js-product-item][data-icon-labels]');
    const labelCounts = {};

    products.forEach(product => {
      const labels = product.dataset.iconLabels;
      if (labels) {
        labels.split('|').forEach(label => {
          const trimmed = label.trim();
          if (trimmed) {
            labelCounts[trimmed] = (labelCounts[trimmed] || 0) + 1;
          }
        });
      }
    });

    return labelCounts;
  }

  // Set up event listeners for a specific container
  function setupEventListeners(container) {
    // Checkbox change events
    container.querySelectorAll('[data-icon-filter-checkbox]').forEach(checkbox => {
      checkbox.addEventListener('change', handleCheckboxChange);
      checkbox.addEventListener('click', handleCheckboxClick);
    });

    // Label click events
    container.querySelectorAll('.icon-filter-checkbox').forEach(label => {
      label.addEventListener('click', handleLabelClick);
    });

    // Reset button
    const resetBtn = container.querySelector('.icon-filter-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', handleReset);
    }
  }

  // Handle checkbox click - prevent form submission
  function handleCheckboxClick(e) {
    e.stopPropagation();
  }

  // Handle checkbox change
  function handleCheckboxChange(e) {
    e.stopPropagation();
    
    const checkbox = e.target;
    const value = checkbox.value;

    if (checkbox.checked) {
      if (!state.selectedLabels.includes(value)) {
        state.selectedLabels.push(value);
      }
    } else {
      state.selectedLabels = state.selectedLabels.filter(l => l !== value);
    }

    // Sync checkbox state across ALL containers
    syncCheckboxState();

    applyFilters();
    updateActiveTags();
    updateSelectedCount();
  }

  // Sync checkbox state across all containers
  function syncCheckboxState() {
    getAllContainers().forEach(container => {
      container.querySelectorAll('[data-icon-filter-checkbox]').forEach(cb => {
        cb.checked = state.selectedLabels.includes(cb.value);
      });
    });
  }

  // Handle label click - toggle checkbox
  function handleLabelClick(e) {
    const label = e.currentTarget;
    const checkbox = label.querySelector('[data-icon-filter-checkbox]');
    
    // If clicking the label text (not the checkbox directly), toggle the checkbox
    if (e.target !== checkbox) {
      e.preventDefault();
      e.stopPropagation();
      checkbox.checked = !checkbox.checked;
      
      // Trigger change event
      const event = new Event('change', { bubbles: false });
      checkbox.dispatchEvent(event);
    }
  }

  // Handle reset button
  function handleReset(e) {
    e.preventDefault();
    e.stopPropagation();

    state.selectedLabels = [];

    // Reset ALL containers
    getAllContainers().forEach(container => {
      container.querySelectorAll('[data-icon-filter-checkbox]').forEach(cb => {
        cb.checked = false;
      });
    });

    applyFilters();
    updateActiveTags();
    updateSelectedCount();
  }

  // Apply filters to products
  function applyFilters() {
    const products = document.querySelectorAll('[data-js-product-item][data-icon-labels]');
    let visibleCount = 0;

    products.forEach(product => {
      const productLabels = (product.dataset.iconLabels || '').split('|').map(l => l.trim());

      if (state.selectedLabels.length === 0) {
        product.classList.remove('icon-filter-hidden');
        visibleCount++;
      } else {
        const hasMatch = state.selectedLabels.some(selected => productLabels.includes(selected));
        if (hasMatch) {
          product.classList.remove('icon-filter-hidden');
          visibleCount++;
        } else {
          product.classList.add('icon-filter-hidden');
        }
      }
    });

    // Update visible counts on filter options
    updateFilterCounts();
  }

  // Update counts on filter checkboxes (in ALL containers)
  function updateFilterCounts() {
    const labelCounts = collectIconLabels();

    getAllContainers().forEach(container => {
      container.querySelectorAll('.icon-filter-checkbox').forEach(labelEl => {
        const checkbox = labelEl.querySelector('[data-icon-filter-checkbox]');
        const countEl = labelEl.querySelector('.icon-filter-count');
        if (checkbox && countEl) {
          const count = labelCounts[checkbox.value] || 0;
          countEl.textContent = `(${count})`;

          if (count === 0 && !checkbox.checked) {
            labelEl.classList.add('disabled');
          } else {
            labelEl.classList.remove('disabled');
          }
        }
      });
    });
  }

  // Update selected count display (in ALL containers)
  function updateSelectedCount() {
    const text = state.selectedLabels.length > 0 
      ? `${state.selectedLabels.length} selected`
      : '0 selected';

    document.querySelectorAll('.icon-filter-selected-count').forEach(countEl => {
      countEl.textContent = text;
    });
  }

  // Update active tags display (shown next to "Clear all")
  function updateActiveTags() {
    // Prevent recursive updates
    if (state.updatingTags) return;
    
    // Use requestAnimationFrame to batch DOM updates and prevent flashing
    requestAnimationFrame(() => {
      state.updatingTags = true;

      try {
      // Find the active facets container
      const activeFacetsContainers = document.querySelectorAll('.active-facets-desktop, .active-facets-mobile');
      
      // Get current tags and their labels
      const existingTags = Array.from(document.querySelectorAll('.icon-filter-active-tag'));
      const existingLabels = existingTags.map(tag => tag.dataset.label).filter(Boolean);
      
      // Only update if labels changed
      const labelsChanged = 
        existingLabels.length !== state.selectedLabels.length ||
        !existingLabels.every(label => state.selectedLabels.includes(label)) ||
        !state.selectedLabels.every(label => existingLabels.includes(label));
      
      if (!labelsChanged && existingTags.length > 0) {
        // No change needed, exit early
        state.updatingTags = false;
        setTimeout(() => { state.updatingTags = false; }, 0);
        return;
      }
      
      // Remove existing custom tags
      existingTags.forEach(tag => tag.remove());

      if (state.selectedLabels.length === 0) {
        // No labels selected, exit early
        setTimeout(() => { state.updatingTags = false; }, 0);
        return;
      }

    activeFacetsContainers.forEach(container => {
      // Find the "Clear all" button to insert before it
      const clearAllBtn = container.querySelector('a[href*="?"], .js-facet-remove:last-child');
      
      state.selectedLabels.forEach(label => {
        // Use anchor tag like Shopify does, not button
        const tag = document.createElement('a');
        tag.href = '#';
        tag.className = 'active-facets__button active-facets__button--light button button--small button--outline js-facet-remove icon-filter-active-tag';
        tag.dataset.label = label;
        tag.setAttribute('role', 'button');
        
        // Use the same close-small SVG that Shopify uses (from theme-symbols.liquid)
        const closeIconSvg = '<svg version="1.1" class="svg close" xmlns="//www.w3.org/2000/svg" xmlns:xlink="//www.w3.org/1999/xlink" x="0px" y="0px" width="60px" height="60px" viewBox="0 0 60 60" enable-background="new 0 0 60 60" xml:space="preserve"><polygon points="38.936,23.561 36.814,21.439 30.562,27.691 24.311,21.439 22.189,23.561 28.441,29.812 22.189,36.064 24.311,38.186 30.562,31.934 36.814,38.186 38.936,36.064 32.684,29.812 "></polygon></svg>';
        
        tag.innerHTML = `${escapeHTML(label)}${closeIconSvg}`;
        
        tag.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          removeLabel(label);
          return false;
        });

        if (clearAllBtn) {
          clearAllBtn.parentNode.insertBefore(tag, clearAllBtn);
        } else {
          container.appendChild(tag);
        }
      });
      }); // Close activeFacetsContainers.forEach
      } finally {
        // Always reset the flag after a short delay to ensure DOM is stable
        setTimeout(() => {
          state.updatingTags = false;
        }, 50);
      }
    }); // Close requestAnimationFrame
  }

  // Remove a label from selection
  function removeLabel(label) {
    state.selectedLabels = state.selectedLabels.filter(l => l !== label);

    // Sync across ALL containers
    syncCheckboxState();

    applyFilters();
    updateActiveTags();
    updateSelectedCount();
  }

  // Restore filter state from global state for a specific container
  function restoreFilterState(container) {
    if (!container) return;

    container.querySelectorAll('[data-icon-filter-checkbox]').forEach(cb => {
      cb.checked = state.selectedLabels.includes(cb.value);
    });
  }

  // Escape HTML to prevent XSS
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  }

  // Watch for DOM changes and re-initialize when needed
  function setupObservers() {
    // Observe the main collection grid for AJAX updates
    const productGrid = document.getElementById('main-collection-product-grid');

    const gridObserver = new MutationObserver(debounce((mutations) => {
      // Ignore changes in active-facets containers (to prevent blinking from our own tag updates)
      const hasProductChange = mutations.some(mutation => {
        const target = mutation.target;
        
        // Ignore if we're updating tags
        if (state.updatingTags) return false;
        
        // Ignore if change is in active-facets containers
        if (target && target.classList && target.closest('.active-facets-desktop, .active-facets-mobile, .active-facets')) {
          return false;
        }
        
        // Ignore if change is in our custom tags
        if (target && (target.classList?.contains('icon-filter-active-tag') || target.closest('.icon-filter-active-tag'))) {
          return false;
        }
        
        // Only react to product item changes
        return true;
      });

      if (hasProductChange) {
        // Re-apply filters after grid update (only if not updating tags ourselves)
        applyFilters();
      }
    }, 300));

    if (productGrid) {
      gridObserver.observe(productGrid, { childList: true, subtree: true });
    }

    // Observe filter wrappers for AJAX updates (but ignore our own tag changes)
    document.querySelectorAll('.facets__wrapper, #FacetFiltersForm, #FacetFiltersFormMobile').forEach(filterWrapper => {
      const filterObserver = new MutationObserver(debounce((mutations) => {
        const hasFilterChange = mutations.some(mutation => {
          const target = mutation.target;
          if (!target || !target.classList) return true;
          if (target.closest('.active-facets-desktop, .active-facets-mobile, .active-facets')) {
            return false;
          }
          if (target.classList.contains('icon-filter-active-tag') || target.closest('.icon-filter-active-tag')) {
            return false;
          }
          return true;
        });
        
        if (hasFilterChange && !state.updatingTags) {
          init();
        }
      }, 200));
      filterObserver.observe(filterWrapper, { childList: true, subtree: true });
    });

    // Also observe the sidebar-drawer for when it becomes visible (mobile)
    const sidebarDrawer = document.getElementById('site-filters-sidebar');
    if (sidebarDrawer) {
      const drawerObserver = new MutationObserver(() => {
        // When sidebar drawer becomes visible, re-init to ensure the drawer filter is built
        if (sidebarDrawer.style.display !== 'none') {
          init();
        }
      });
      drawerObserver.observe(sidebarDrawer, { attributes: true, attributeFilter: ['style', 'aria-hidden'] });
    }

    // Periodically check if any filter containers need to be re-initialized
    if (state.checkInterval) {
      clearInterval(state.checkInterval);
    }
    state.checkInterval = setInterval(() => {
      getAllContainers().forEach(container => {
        if (!container.querySelector('.js-custom-icon-filter')) {
          init();
        }
      });
    }, 1000);
  }

  // Debounce utility
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      setupObservers();
    });
  } else {
    init();
    setupObservers();
  }

  // Re-initialize after Shopify section events
  document.addEventListener('shopify:section:load', init);
  document.addEventListener('shopify:section:unload', init);

  // Expose init function globally for manual re-initialization
  window.initCustomIconFilter = init;

})();
