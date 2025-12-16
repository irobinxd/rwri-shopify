// Resource route for /checkout-script.js
// The [.]js pattern allows the route to match /checkout-script.js

export async function loader({ request }) {
  const scriptContent = `(function() {
  'use strict';
  
  // Simple alert to verify script is loading
  console.log('🚀 Checkout customization script loaded!');
  console.log('📍 Current URL:', window.location.href);
  console.log('📍 Is checkout page:', window.location.href.includes('/checkouts/') || window.location.href.includes('/checkout'));
  
  // Only show alert on checkout pages to avoid annoying users
  if (window.location.href.includes('/checkouts/') || window.location.href.includes('/checkout')) {
    console.log('✅ Script loaded on checkout page!');
  }
  
  // Function to access and log all cart details
  function getCartDetails() {
    const cartData = {
      attributes: [],
      items: [],
      total: null,
      subtotal: null,
      lineItems: [],
      discounts: [],
      shipping: null,
      available: false
    };

    try {
      // Method 1: Try window.Shopify.checkout
      if (window.Shopify?.checkout) {
        cartData.available = true;
        
        // Cart attributes
        if (window.Shopify.checkout.cart?.attributes) {
          cartData.attributes = window.Shopify.checkout.cart.attributes;
        }
        
        // Cart items
        if (window.Shopify.checkout.cart?.items) {
          cartData.items = window.Shopify.checkout.cart.items;
        }
        
        // Cart totals
        if (window.Shopify.checkout.cart?.total_price) {
          cartData.total = window.Shopify.checkout.cart.total_price;
        }
        
        if (window.Shopify.checkout.cart?.subtotal_price) {
          cartData.subtotal = window.Shopify.checkout.cart.subtotal_price;
        }
        
        // Line items
        if (window.Shopify.checkout.lineItems) {
          cartData.lineItems = window.Shopify.checkout.lineItems;
        }
        
        // Discounts
        if (window.Shopify.checkout.discounts) {
          cartData.discounts = window.Shopify.checkout.discounts;
        }
        
        // Shipping
        if (window.Shopify.checkout.shippingAddress) {
          cartData.shipping = window.Shopify.checkout.shippingAddress;
        }
      }
      
      // Method 2: Try to get from form data
      const form = document.querySelector('form[action*="checkout"], form');
      if (form) {
        const formData = new FormData(form);
        const attributes = [];
        formData.forEach((value, key) => {
          if (key.startsWith('attributes[')) {
            const attrKey = key.match(/attributes\\[(.+?)\\]/)?.[1];
            if (attrKey) {
              attributes.push({ key: attrKey, value: value });
            }
          }
        });
        if (attributes.length > 0) {
          cartData.attributes = [...cartData.attributes, ...attributes];
        }
      }
      
      // Method 3: Try to get from data attributes
      const checkoutData = document.querySelector('[data-checkout]') || document.body;
      if (checkoutData?.dataset) {
        Object.keys(checkoutData.dataset).forEach(key => {
          if (key.startsWith('cart') || key.startsWith('checkout')) {
            try {
              const value = JSON.parse(checkoutData.dataset[key]);
              if (value) {
                cartData[key] = value;
              }
            } catch (e) {
              cartData[key] = checkoutData.dataset[key];
            }
          }
        });
      }
      
      // Method 4: Try to get from script tags with JSON data
      const scriptTags = document.querySelectorAll('script[type="application/json"]');
      scriptTags.forEach(script => {
        try {
          const data = JSON.parse(script.textContent);
          if (data.cart || data.checkout) {
            Object.assign(cartData, data.cart || data.checkout);
            cartData.available = true;
          }
        } catch (e) {
          // Not JSON, skip
        }
      });
      
      console.log('🛒 Full Cart Details:', cartData);
      return cartData;
    } catch (error) {
      console.error('Error accessing cart details:', error);
      return cartData;
    }
  }

  // Make cart details accessible globally
  window.getCartDetails = getCartDetails;

  // Hide "PICK UP/BOOK YOUR OWN RIDER" text
  function hidePickupBookRiderText() {
    console.log('🔍 hidePickupBookRiderText: Looking for local_pickup_methods...');
    const localPickupMethods = document.getElementById('local_pickup_methods');
    console.log('🔍 local_pickup_methods found:', !!localPickupMethods);
    
    if (localPickupMethods) {
      // Find all strong elements and spans that contain "PICK UP/BOOK YOUR OWN RIDER"
      const allElements = localPickupMethods.querySelectorAll('strong, span');
      allElements.forEach(el => {
        const text = (el.textContent || '').trim();
        if (text.includes('PICK UP/BOOK YOUR OWN RIDER') || 
            (text.includes('PICK UP') && text.includes('BOOK YOUR OWN RIDER'))) {
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('visibility', 'hidden', 'important');
          el.style.setProperty('opacity', '0', 'important');
          el.style.setProperty('height', '0', 'important');
          el.style.setProperty('width', '0', 'important');
          el.style.setProperty('overflow', 'hidden', 'important');
          el.style.setProperty('font-size', '0', 'important');
          el.style.setProperty('line-height', '0', 'important');
          el.style.setProperty('padding', '0', 'important');
          el.style.setProperty('margin', '0', 'important');
          el.style.setProperty('position', 'absolute', 'important');
          el.style.setProperty('left', '-9999px', 'important');
          el.setAttribute('data-hidden', 'true');
        }
      });
      
      // Also hide parent strong elements
      const strongElements = localPickupMethods.querySelectorAll('strong');
      strongElements.forEach(strong => {
        const text = (strong.textContent || '').trim();
        if (text.includes('PICK UP/BOOK YOUR OWN RIDER') || 
            (text.includes('PICK UP') && text.includes('BOOK YOUR OWN RIDER'))) {
          strong.style.setProperty('display', 'none', 'important');
          strong.style.setProperty('visibility', 'hidden', 'important');
          strong.style.setProperty('opacity', '0', 'important');
          strong.style.setProperty('position', 'absolute', 'important');
          strong.style.setProperty('left', '-9999px', 'important');
          strong.setAttribute('data-hidden', 'true');
        }
      });
    }
  }

  // Hide "FREE" and "Usually ready in X hours" text on the right side
  function hideRightSideText() {
    console.log('🔍 hideRightSideText: Looking for elements to hide...');
    const localPickupMethods = document.getElementById('local_pickup_methods');
    console.log('🔍 local_pickup_methods found:', !!localPickupMethods);
    
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
            p.style.setProperty('display', 'none', 'important');
            p.style.setProperty('visibility', 'hidden', 'important');
            p.style.setProperty('opacity', '0', 'important');
            p.style.setProperty('height', '0', 'important');
            p.style.setProperty('width', '0', 'important');
            p.style.setProperty('overflow', 'hidden', 'important');
            p.style.setProperty('font-size', '0', 'important');
            p.style.setProperty('line-height', '0', 'important');
            p.style.setProperty('padding', '0', 'important');
            p.style.setProperty('margin', '0', 'important');
            p.style.setProperty('position', 'absolute', 'important');
            p.style.setProperty('left', '-9999px', 'important');
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
    
    // Log cart details for debugging (only once)
    if (!window.__cartDetailsLogged) {
      window.__cartDetailsLogged = true;
      setTimeout(() => {
        const cartDetails = getCartDetails();
        console.log('📦 Cart Summary:', {
          itemCount: cartDetails.items?.length || cartDetails.lineItems?.length || 0,
          attributes: cartDetails.attributes,
          total: cartDetails.total,
          subtotal: cartDetails.subtotal
        });
      }, 1000);
    }
  }

  // Execute immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runChanges);
  } else {
    runChanges();
  }

  // Also run after delays to catch dynamically loaded content - more frequent for checkout
  setTimeout(runChanges, 100);
  setTimeout(runChanges, 500);
  setTimeout(runChanges, 1000);
  setTimeout(runChanges, 2000);
  setTimeout(runChanges, 3000);
  setTimeout(runChanges, 5000);
  setTimeout(runChanges, 8000);
  setTimeout(runChanges, 10000);

  // Use MutationObserver to catch dynamically added content
  const observer = new MutationObserver(function(mutations) {
    let shouldRun = false;
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        // Check if any added node is within local_pickup_methods
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            const localPickup = document.getElementById('local_pickup_methods');
            if (localPickup && (localPickup.contains(node) || node.contains(localPickup) || node.id === 'local_pickup_methods')) {
              shouldRun = true;
            }
          }
        });
      }
    });
    if (shouldRun) {
      // Debounce to avoid too many calls
      clearTimeout(observer.timeout);
      observer.timeout = setTimeout(runChanges, 100);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
})();`;

  return new Response(scriptContent, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

