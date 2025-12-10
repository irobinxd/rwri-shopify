import{w as t}from"./chunk-WWGJGFF6-Du9VGVJJ.js";const a=t(function(){return`(function() {
  'use strict';

  // Hide "PICK UP/BOOK YOUR OWN RIDER" text
  function hidePickupBookRiderText() {
    const localPickupMethods = document.getElementById('local_pickup_methods');
    if (localPickupMethods) {
      // Find all strong elements and spans that contain "PICK UP/BOOK YOUR OWN RIDER"
      const allElements = localPickupMethods.querySelectorAll('strong, span');
      allElements.forEach(el => {
        const text = (el.textContent || '').trim();
        if (text.includes('PICK UP/BOOK YOUR OWN RIDER') || 
            text.includes('PICK UP') && text.includes('BOOK YOUR OWN RIDER')) {
          el.style.display = 'none !important';
          el.style.visibility = 'hidden !important';
          el.style.opacity = '0 !important';
          el.style.height = '0 !important';
          el.style.width = '0 !important';
          el.style.overflow = 'hidden !important';
          el.style.fontSize = '0 !important';
          el.style.lineHeight = '0 !important';
          el.style.padding = '0 !important';
          el.style.margin = '0 !important';
          el.setAttribute('data-hidden', 'true');
        }
      });
      
      // Also hide parent strong elements
      const strongElements = localPickupMethods.querySelectorAll('strong');
      strongElements.forEach(strong => {
        const text = (strong.textContent || '').trim();
        if (text.includes('PICK UP/BOOK YOUR OWN RIDER') || 
            (text.includes('PICK UP') && text.includes('BOOK YOUR OWN RIDER'))) {
          strong.style.display = 'none !important';
          strong.style.visibility = 'hidden !important';
          strong.style.opacity = '0 !important';
          strong.setAttribute('data-hidden', 'true');
        }
      });
    }
  }

  // Hide "FREE" and "Usually ready in X hours" text on the right side
  function hideRightSideText() {
    const localPickupMethods = document.getElementById('local_pickup_methods');
    if (localPickupMethods) {
      // Find the right side container (div with classes _1u2aa6me _1u2aa6mj)
      const rightSideContainers = localPickupMethods.querySelectorAll('[class*="_1u2aa6me"], [class*="_1u2aa6mj"]');
      
      rightSideContainers.forEach(rightSideContainer => {
        // Hide "FREE" text
        const allElements = rightSideContainer.querySelectorAll('*');
        allElements.forEach(el => {
          const text = (el.textContent || '').trim();
          if (text === 'FREE' || (text.includes('FREE') && text.length < 10)) {
            el.style.display = 'none !important';
            el.style.visibility = 'hidden !important';
            el.style.opacity = '0 !important';
            el.style.height = '0 !important';
            el.style.width = '0 !important';
            el.style.overflow = 'hidden !important';
            el.style.fontSize = '0 !important';
            el.style.lineHeight = '0 !important';
            el.style.padding = '0 !important';
            el.style.margin = '0 !important';
            el.setAttribute('data-hidden', 'true');
          }
        });
        
        // Hide "Usually ready in X hours" text - target paragraphs
        const paragraphs = rightSideContainer.querySelectorAll('p');
        paragraphs.forEach(p => {
          const text = (p.textContent || '').trim();
          if (text.includes('Usually ready') || text.includes('ready in') || text.match(/ready in \\d+/i)) {
            p.style.display = 'none !important';
            p.style.visibility = 'hidden !important';
            p.style.opacity = '0 !important';
            p.style.height = '0 !important';
            p.style.width = '0 !important';
            p.style.overflow = 'hidden !important';
            p.style.fontSize = '0 !important';
            p.style.lineHeight = '0 !important';
            p.style.padding = '0 !important';
            p.style.margin = '0 !important';
            p.setAttribute('data-hidden', 'true');
          }
        });
        
        // Also target parent divs with specific classes that contain ready time
        const readyTimeDivs = rightSideContainer.querySelectorAll('[class*="_16s97g73r"]');
        readyTimeDivs.forEach(div => {
          const text = (div.textContent || '').trim();
          if (text.includes('Usually ready') || text.includes('ready in') || text.match(/ready in \\d+/i)) {
            div.style.display = 'none !important';
            div.style.visibility = 'hidden !important';
            div.style.opacity = '0 !important';
            div.setAttribute('data-hidden', 'true');
          }
        });
      });
      
      // Fallback: search entire local_pickup_methods for "FREE" and "Usually ready" text
      const allElements = localPickupMethods.querySelectorAll('*');
      allElements.forEach(el => {
        const text = (el.textContent || '').trim();
        // Hide elements that only contain "FREE"
        if (text === 'FREE' || (text.includes('FREE') && text.length < 10 && !text.includes('FREESHIPPING'))) {
          // Make sure it's on the right side (check if parent has right side classes)
          const parent = el.closest('[class*="_1u2aa6me"], [class*="_1u2aa6mj"]');
          if (parent && !el.hasAttribute('data-hidden')) {
            el.style.display = 'none !important';
            el.style.visibility = 'hidden !important';
            el.style.opacity = '0 !important';
            el.setAttribute('data-hidden', 'true');
          }
        }
        
        // Hide "Usually ready" text anywhere in the container
        if ((text.includes('Usually ready') || text.includes('ready in') || text.match(/ready in \\d+/i)) && 
            !el.hasAttribute('data-hidden')) {
          const parent = el.closest('[class*="_1u2aa6me"], [class*="_1u2aa6mj"]');
          if (parent) {
            el.style.display = 'none !important';
            el.style.visibility = 'hidden !important';
            el.style.opacity = '0 !important';
            el.setAttribute('data-hidden', 'true');
          }
        }
      });
    }
  }

  // Add hidden inputs for pickup dates before delivery section
  function addHiddenInputs() {
    // Try to get values from cart attributes if available
    let platterValue = '';
    let otherValue = '';
    
    try {
      // Try different ways to access cart data
      if (window.Shopify?.checkout?.cart?.attributes) {
        const attrs = window.Shopify.checkout.cart.attributes;
        const platterAttr = attrs.find(attr => attr.key === 'Platter Pickup Date');
        const otherAttr = attrs.find(attr => attr.key === 'Other Items Pickup Date');
        if (platterAttr) platterValue = platterAttr.value || '';
        if (otherAttr) otherValue = otherAttr.value || '';
      }
      
      // Try to get from meta tags or data attributes
      const metaTags = document.querySelectorAll('meta[name*="attribute"], meta[property*="attribute"]');
      metaTags.forEach(meta => {
        const name = meta.getAttribute('name') || meta.getAttribute('property') || '';
        if (name.includes('Platter Pickup Date')) {
          platterValue = meta.getAttribute('content') || '';
        }
        if (name.includes('Other Items Pickup Date')) {
          otherValue = meta.getAttribute('content') || '';
        }
      });
      
      // Try to get from data attributes on body or form
      const bodyData = document.body?.dataset || {};
      if (bodyData.platterPickupDate) platterValue = bodyData.platterPickupDate;
      if (bodyData.otherItemsPickupDate) otherValue = bodyData.otherItemsPickupDate;
      
      // Also try to read from existing hidden inputs if they exist
      const existingPlatter = document.getElementById('platter-datetime-attr');
      const existingOther = document.getElementById('non-platter-datetime-attr');
      if (existingPlatter && existingPlatter.value) platterValue = existingPlatter.value;
      if (existingOther && existingOther.value) otherValue = existingOther.value;
      
      // Try to find any input with the attribute name pattern
      const allInputs = document.querySelectorAll('input[type="hidden"]');
      allInputs.forEach(input => {
        const name = input.name || '';
        if (name.includes('Platter Pickup Date') && input.value) {
          platterValue = input.value;
        }
        if (name.includes('Other Items Pickup Date') && input.value) {
          otherValue = input.value;
        }
      });
      
      console.log('Cart attributes found - Platter:', platterValue, 'Other:', otherValue);
    } catch(e) {
      console.log('Error reading cart attributes:', e);
    }
    
    // Find the delivery/pickup section - prioritize local_pickup_methods
    let targetSection = document.getElementById('local_pickup_methods');
    
    if (!targetSection) {
      const selectors = [
        '[id="local_pickup_methods"]',
        '[class*="delivery"]',
        '[class*="Delivery"]',
        '[id*="delivery"]',
        '[id*="Delivery"]',
        'section[aria-label*="Delivery"]',
        'section[aria-label*="delivery"]',
        '[data-section*="delivery"]',
        '[class*="pickup"]',
        '[class*="Pickup"]',
        '[data-section*="pickup"]'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          targetSection = element;
          break;
        }
      }
    }
    
    // Add hidden inputs
    if (targetSection) {
      // Check if inputs already exist
      if (!document.getElementById('platter-datetime-attr')) {
        const platterInput = document.createElement('input');
        platterInput.type = 'hidden';
        platterInput.name = 'attributes[Platter Pickup Date]';
        platterInput.id = 'platter-datetime-attr';
        platterInput.value = platterValue;
        // Insert before the first child or at the beginning
        if (targetSection.firstChild) {
          targetSection.insertBefore(platterInput, targetSection.firstChild);
        } else {
          targetSection.appendChild(platterInput);
        }
      } else {
        // Update existing input value
        const existing = document.getElementById('platter-datetime-attr');
        if (existing && platterValue) {
          existing.value = platterValue;
        }
      }
      
      if (!document.getElementById('non-platter-datetime-attr')) {
        const otherInput = document.createElement('input');
        otherInput.type = 'hidden';
        otherInput.name = 'attributes[Other Items Pickup Date]';
        otherInput.id = 'non-platter-datetime-attr';
        otherInput.value = otherValue;
        // Insert after platter input or at the beginning
        const platterInput = document.getElementById('platter-datetime-attr');
        if (platterInput && platterInput.nextSibling) {
          targetSection.insertBefore(otherInput, platterInput.nextSibling);
        } else if (platterInput) {
          targetSection.insertBefore(otherInput, platterInput.nextSibling || null);
        } else if (targetSection.firstChild) {
          targetSection.insertBefore(otherInput, targetSection.firstChild);
        } else {
          targetSection.appendChild(otherInput);
        }
      } else {
        // Update existing input value
        const existing = document.getElementById('non-platter-datetime-attr');
        if (existing && otherValue) {
          existing.value = otherValue;
        }
      }
    } else {
      // Fallback: add to form if section not found
      const form = document.querySelector('form[action*="checkout"], form[action*="cart"], form');
      if (form) {
        if (!document.getElementById('platter-datetime-attr')) {
          const platterInput = document.createElement('input');
          platterInput.type = 'hidden';
          platterInput.name = 'attributes[Platter Pickup Date]';
          platterInput.id = 'platter-datetime-attr';
          platterInput.value = platterValue;
          form.appendChild(platterInput);
        }
        
        if (!document.getElementById('non-platter-datetime-attr')) {
          const otherInput = document.createElement('input');
          otherInput.type = 'hidden';
          otherInput.name = 'attributes[Other Items Pickup Date]';
          otherInput.id = 'non-platter-datetime-attr';
          otherInput.value = otherValue;
          form.appendChild(otherInput);
        }
      }
    }
  }

  // Run the functions
  function runChanges() {
    hidePickupBookRiderText();
    hideRightSideText();
    addHiddenInputs();
  }

  // Execute immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runChanges);
  } else {
    runChanges();
  }

  // Also run after delays to catch dynamically loaded content
  setTimeout(runChanges, 500);
  setTimeout(runChanges, 1500);
  setTimeout(runChanges, 3000);

  // Use MutationObserver to catch dynamically added content
  const observer = new MutationObserver(function(mutations) {
    let shouldRun = false;
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        shouldRun = true;
      }
    });
    if (shouldRun) {
      // Debounce to avoid too many calls
      clearTimeout(observer.timeout);
      observer.timeout = setTimeout(runChanges, 300);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();`});export{a as default};
