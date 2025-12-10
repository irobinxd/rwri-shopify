import '@shopify/ui-extensions/preact';
import {render} from "preact";

// 1. Export the extension
export default async () => {
  render(<Extension />, document.body)
};

function Extension() {
  // Get current cart attributes
  const currentAttributes = shopify.cart.attributes || [];
  
  // Debug: log cart attributes
  console.log('Checkout Extension - Cart attributes:', currentAttributes);
  console.log('Checkout Extension - Full cart:', shopify.cart);
  
  // Get delivery groups to access pickup locations
  const deliveryGroups = shopify.deliveryGroups || [];
  console.log('Checkout Extension - Delivery groups:', deliveryGroups);
  
  // Find pickup locations from delivery groups
  let pickupLocations = [];
  let selectedPickupLocation = null;
  
  deliveryGroups.forEach(group => {
    if (group.deliveryOptions) {
      group.deliveryOptions.forEach(option => {
        // Check if this is a pickup option
        if (option.type === 'PICKUP' || option.type === 'LOCAL_PICKUP' || option.title?.toLowerCase().includes('pickup')) {
          pickupLocations.push({
            id: option.handle || option.id,
            title: option.title || 'Pickup Location',
            description: option.description || '',
            cost: option.cost || { amount: 0, currencyCode: 'USD' },
            groupId: group.id,
            optionId: option.id
          });
          
          // Check if this is the selected option
          if (group.selectedDeliveryOption?.id === option.id) {
            selectedPickupLocation = option.handle || option.id;
          }
        }
      });
    }
  });
  
  console.log('Checkout Extension - Pickup locations found:', pickupLocations);
  console.log('Checkout Extension - Selected pickup location:', selectedPickupLocation);
  
  // Find the pickup date attributes from cart
  const platterPickupDate = currentAttributes.find(attr => attr.key === "Platter Pickup Date")?.value || "";
  const otherItemsPickupDate = currentAttributes.find(attr => attr.key === "Other Items Pickup Date")?.value || "";
  
  console.log('Checkout Extension - Platter Pickup Date:', platterPickupDate);
  console.log('Checkout Extension - Other Items Pickup Date:', otherItemsPickupDate);
  
  // Function to handle pickup location selection
  const handlePickupLocationChange = async (locationId) => {
    console.log('🔄 Changing pickup location to:', locationId);
    
    try {
      // Find the delivery group and option for this location
      for (const group of deliveryGroups) {
        if (group.deliveryOptions) {
          const option = group.deliveryOptions.find(opt => 
            (opt.handle || opt.id) === locationId && 
            (opt.type === 'PICKUP' || opt.type === 'LOCAL_PICKUP' || opt.title?.toLowerCase().includes('pickup'))
          );
          
          if (option) {
            console.log('✅ Found matching option:', option);
            
            // Apply the delivery option change
            await shopify.applyDeliveryGroupChange({
              type: 'updateDeliveryOption',
              deliveryGroupId: group.id,
              deliveryOptionHandle: option.handle || option.id,
            });
            
            console.log('✅ Pickup location changed successfully');
            return;
          }
        }
      }
      
      console.warn('⚠️ Could not find pickup location option for:', locationId);
    } catch (error) {
      console.error('❌ Error changing pickup location:', error);
    }
  };

  // Ensure attributes are preserved in checkout (run once on mount)
  // Use a flag to prevent multiple executions
  const global = typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : {};
  if (!global.__checkoutAttributesSet) {
    global.__checkoutAttributesSet = true;
    
    // Ensure both attributes are set in checkout
    const promises = [];
    
    if (platterPickupDate) {
      promises.push(
        shopify.applyAttributeChange({
          key: "Platter Pickup Date",
          type: "updateAttribute",
          value: platterPickupDate,
        }).catch(err => console.log("Error setting Platter Pickup Date:", err))
      );
    }
    
    if (otherItemsPickupDate) {
      promises.push(
        shopify.applyAttributeChange({
          key: "Other Items Pickup Date",
          type: "updateAttribute",
          value: otherItemsPickupDate,
        }).catch(err => console.log("Error setting Other Items Pickup Date:", err))
      );
    }
    
    // Also ensure empty attributes are set if they don't exist
    if (!platterPickupDate) {
      promises.push(
        shopify.applyAttributeChange({
          key: "Platter Pickup Date",
          type: "updateAttribute",
          value: "",
        }).catch(() => {})
      );
    }
    
    if (!otherItemsPickupDate) {
      promises.push(
        shopify.applyAttributeChange({
          key: "Other Items Pickup Date",
          type: "updateAttribute",
          value: "",
        }).catch(() => {})
      );
    }
    
    Promise.all(promises).catch(() => {});
  }

  // Inject CSS and JavaScript for checkout customization (run once)
  if (!global.__checkoutCustomizationInjected) {
    global.__checkoutCustomizationInjected = true;
    console.log('🚀 Checkout Extension: Starting customization injection...');
    
    // Use setTimeout to ensure DOM is ready
    if (typeof setTimeout !== 'undefined') {
      setTimeout(() => {
        try {
          console.log('🚀 Checkout Extension: Attempting to inject CSS and script...');
          
          // Inject CSS directly
          if (typeof document !== 'undefined') {
            // Check if style already exists
            if (!document.getElementById('checkout-custom-css')) {
              const style = document.createElement('style');
              style.id = 'checkout-custom-css';
              style.textContent = `
                /* Custom colors for checkout elements */
                :root {
                  --custom-primary-color: #0066cc;
                  --custom-success-color: #00a651;
                  --custom-warning-color: #ff9900;
                  --custom-error-color: #d72c0d;
                }
                
                /* Style the extension banner */
                s-banner[heading="Pickup Information"] {
                  background-color: #f0f8ff !important;
                  border-left: 4px solid var(--custom-primary-color) !important;
                }
                
                /* Hide the ENTIRE default pickup selection section */
                #local_pickup_methods,
                [id="local_pickup_methods"],
                [id*="local_pickup"],
                [id*="pickup_methods"],
                section[aria-label*="pickup" i],
                section[aria-label*="Pickup" i] {
                  display: none !important;
                  visibility: hidden !important;
                  opacity: 0 !important;
                  height: 0 !important;
                  width: 0 !important;
                  overflow: hidden !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  position: absolute !important;
                  left: -9999px !important;
                  pointer-events: none !important;
                }
              `;
              
              const target = document.head || document.getElementsByTagName('head')[0] || document.body;
              if (target) {
                target.appendChild(style);
                console.log('✅ Checkout Extension: Custom CSS injected successfully');
              } else {
                console.error('❌ Checkout Extension: Could not find target for CSS injection');
              }
            } else {
              console.log('⚠️ Checkout Extension: CSS already injected');
            }
            
            // Inject the script directly inline to avoid URL issues
            if (!document.getElementById('checkout-custom-script-injected')) {
              console.log('🚀 Checkout Extension: Injecting script inline...');
              
              // Create and inject the script inline
              const script = document.createElement('script');
              script.id = 'checkout-custom-script-injected';
              script.textContent = `
                (function() {
                  'use strict';
                  console.log('✅ Checkout customization script executing...');
                  
                  // Extract pickup locations from DOM and create custom selector
                  function createCustomPickupSelector() {
                    console.log('🔍 Creating custom pickup selector...');
                    
                    const defaultSection = document.getElementById('local_pickup_methods');
                    if (!defaultSection) {
                      console.log('⚠️ Default pickup section not found yet');
                      return;
                    }
                    
                    // Extract pickup locations from the default section
                    const locationCards = defaultSection.querySelectorAll('[class*="_1u2aa6me"], [class*="_1u2aa6mj"], [role="radio"], input[type="radio"]');
                    console.log('Found', locationCards.length, 'pickup location cards');
                    
                    if (locationCards.length === 0) {
                      console.log('⚠️ No pickup locations found in DOM');
                      return;
                    }
                    
                    // Create custom selector container
                    const customSelector = document.createElement('div');
                    customSelector.id = 'custom-pickup-selector';
                    customSelector.style.cssText = 'margin: 1rem 0; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px; background: #ffffff;';
                    
                    const title = document.createElement('h3');
                    title.textContent = 'Select Pickup Location';
                    title.style.cssText = 'margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: bold;';
                    customSelector.appendChild(title);
                    
                    // Extract location info and create custom options
                    locationCards.forEach((card, index) => {
                      const locationText = card.textContent || card.innerText || '';
                      const locationName = locationText.split('\\n')[0] || \`Location \${index + 1}\`;
                      
                      // Find the radio input for this location
                      const radioInput = card.querySelector('input[type="radio"]') || card.closest('[role="radio"]')?.querySelector('input[type="radio"]');
                      if (!radioInput) {
                        console.log('⚠️ Could not find radio input for location:', locationName);
                        return;
                      }
                      
                      const locationId = radioInput.id || radioInput.name || \`pickup-\${index}\`;
                      const isSelected = radioInput.checked;
                      
                      // Create custom option button
                      const optionDiv = document.createElement('div');
                      optionDiv.style.cssText = \`
                        padding: 0.75rem;
                        margin: 0.5rem 0;
                        border: \${isSelected ? '2px solid #0066cc' : '1px solid #e0e0e0'};
                        border-radius: 6px;
                        background: \${isSelected ? '#f0f8ff' : '#ffffff'};
                        cursor: pointer;
                        transition: all 0.2s ease;
                      \`;
                      
                      optionDiv.innerHTML = \`
                        <div style="font-weight: \${isSelected ? 'bold' : 'normal'}; margin-bottom: 0.25rem;">
                          \${locationName.replace(/PICK UP\\/BOOK YOUR OWN RIDER/g, '').replace(/FREE/g, '').replace(/Usually ready in.*/g, '').trim()}
                        </div>
                      \`;
                      
                      optionDiv.addEventListener('click', function() {
                        console.log('🔄 Selecting pickup location:', locationId);
                        radioInput.checked = true;
                        radioInput.dispatchEvent(new Event('change', { bubbles: true }));
                        radioInput.dispatchEvent(new Event('click', { bubbles: true }));
                        
                        // Update visual selection
                        customSelector.querySelectorAll('div[data-pickup-option]').forEach(opt => {
                          opt.style.border = '1px solid #e0e0e0';
                          opt.style.background = '#ffffff';
                          opt.querySelector('div').style.fontWeight = 'normal';
                        });
                        optionDiv.style.border = '2px solid #0066cc';
                        optionDiv.style.background = '#f0f8ff';
                        optionDiv.querySelector('div').style.fontWeight = 'bold';
                      });
                      
                      optionDiv.setAttribute('data-pickup-option', locationId);
                      customSelector.appendChild(optionDiv);
                    });
                    
                    // Insert custom selector before default section
                    if (defaultSection.parentNode) {
                      defaultSection.parentNode.insertBefore(customSelector, defaultSection);
                      console.log('✅ Custom pickup selector created and inserted');
                    }
                  }
                  
                  // Hide the ENTIRE default pickup selection section
                  function hideDefaultPickupSection() {
                    console.log('🔍 hideDefaultPickupSection: Hiding entire default pickup section...');
                    
                    // Try multiple ways to find and hide the container
                    const selectors = [
                      '#local_pickup_methods',
                      '[id="local_pickup_methods"]',
                      '[id*="local_pickup"]',
                      '[id*="pickup_methods"]',
                      'section[aria-label*="pickup" i]',
                      'section[aria-label*="Pickup" i]'
                    ];
                    
                    let hiddenCount = 0;
                    
                    selectors.forEach(selector => {
                      const elements = document.querySelectorAll(selector);
                      elements.forEach(el => {
                        if (!el.hasAttribute('data-custom-hidden')) {
                          console.log('🚫 Hiding default pickup section:', selector);
                          el.style.setProperty('display', 'none', 'important');
                          el.style.setProperty('visibility', 'hidden', 'important');
                          el.style.setProperty('opacity', '0', 'important');
                          el.style.setProperty('height', '0', 'important');
                          el.style.setProperty('width', '0', 'important');
                          el.style.setProperty('overflow', 'hidden', 'important');
                          el.style.setProperty('padding', '0', 'important');
                          el.style.setProperty('margin', '0', 'important');
                          el.style.setProperty('position', 'absolute', 'important');
                          el.style.setProperty('left', '-9999px', 'important');
                          el.style.setProperty('pointer-events', 'none', 'important');
                          el.setAttribute('data-custom-hidden', 'true');
                          hiddenCount++;
                        }
                      });
                    });
                    
                    console.log('✅ Hidden', hiddenCount, 'default pickup section(s)');
                  }
                  
                  // Add hidden inputs for pickup dates
                  function addHiddenInputs() {
                    let platterValue = '';
                    let otherValue = '';
                    
                    try {
                      if (window.Shopify?.checkout?.cart?.attributes) {
                        const attrs = window.Shopify.checkout.cart.attributes;
                        const platterAttr = attrs.find(attr => attr.key === 'Platter Pickup Date');
                        const otherAttr = attrs.find(attr => attr.key === 'Other Items Pickup Date');
                        if (platterAttr) platterValue = platterAttr.value || '';
                        if (otherAttr) otherValue = otherAttr.value || '';
                        console.log('📦 Cart attributes - Platter:', platterValue, 'Other:', otherValue);
                      }
                    } catch(e) {
                      console.log('Error reading cart attributes:', e);
                    }
                    
                    const targetSection = document.getElementById('local_pickup_methods') || 
                                         document.querySelector('[class*="delivery"], [id*="delivery"]') ||
                                         document.body;
                    
                    console.log('Target section for inputs:', targetSection?.id || targetSection?.tagName);
                    
                    if (targetSection && !document.getElementById('platter-datetime-attr')) {
                      const platterInput = document.createElement('input');
                      platterInput.type = 'hidden';
                      platterInput.name = 'attributes[Platter Pickup Date]';
                      platterInput.id = 'platter-datetime-attr';
                      platterInput.value = platterValue;
                      targetSection.insertBefore(platterInput, targetSection.firstChild);
                      console.log('✅ Added platter pickup date input');
                    }
                    
                    if (targetSection && !document.getElementById('non-platter-datetime-attr')) {
                      const otherInput = document.createElement('input');
                      otherInput.type = 'hidden';
                      otherInput.name = 'attributes[Other Items Pickup Date]';
                      otherInput.id = 'non-platter-datetime-attr';
                      otherInput.value = otherValue;
                      const platterInput = document.getElementById('platter-datetime-attr');
                      if (platterInput) {
                        targetSection.insertBefore(otherInput, platterInput.nextSibling);
                      } else {
                        targetSection.insertBefore(otherInput, targetSection.firstChild);
                      }
                      console.log('✅ Added other items pickup date input');
                    }
                  }
                  
                  // Run functions
                  function runChanges() {
                    console.log('🔄 Running checkout customizations...');
                    hideDefaultPickupSection();
                    createCustomPickupSelector();
                    addHiddenInputs();
                  }
                  
                  // Execute immediately
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', runChanges);
                  } else {
                    runChanges();
                  }
                  
                  // Run multiple times to catch dynamic content
                  setTimeout(runChanges, 100);
                  setTimeout(runChanges, 500);
                  setTimeout(runChanges, 1000);
                  setTimeout(runChanges, 2000);
                  setTimeout(runChanges, 3000);
                  setTimeout(runChanges, 5000);
                  
                  // MutationObserver for dynamic content
                  const observer = new MutationObserver(function(mutations) {
                    let shouldRun = false;
                    mutations.forEach(function(mutation) {
                      if (mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                          if (node.nodeType === 1) {
                            const localPickup = document.getElementById('local_pickup_methods');
                            if (localPickup && (localPickup.contains(node) || node.id === 'local_pickup_methods')) {
                              shouldRun = true;
                            }
                            // Also check if any added node is the pickup section
                            if (node.id && (node.id.includes('local_pickup') || node.id.includes('pickup_methods'))) {
                              shouldRun = true;
                            }
                          }
                        });
                      }
                    });
                    if (shouldRun) {
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
                  
                  console.log('✅ Checkout customization script initialized');
                })();
              `;
              
              const target = document.head || document.getElementsByTagName('head')[0] || document.body;
              if (target) {
                target.appendChild(script);
                console.log('✅ Checkout Extension: Script injected inline successfully');
              } else {
                console.error('❌ Checkout Extension: Could not find target for script injection');
              }
            } else {
              console.log('⚠️ Checkout Extension: Script already injected');
            }
          } else {
            console.error('❌ Checkout Extension: document is not available');
          }
        } catch (error) {
          console.error('❌ Checkout Extension: Error injecting customization:', error);
          console.error('❌ Checkout Extension: Error stack:', error.stack);
        }
      }, 100);
    } else {
      console.error('❌ Checkout Extension: setTimeout is not available');
    }
  } else {
    console.log('⚠️ Checkout Extension: Customization already injected (skipping)');
  }

  // Render custom pickup location selector
  return (
    <s-block>
      {/* Show pickup date attributes if available */}
      {(platterPickupDate || otherItemsPickupDate) && (
        <s-banner tone="info" heading="Pickup Information">
      <s-stack gap="base">
            {platterPickupDate && (
              <s-text size="small" appearance="accent">
                🍽️ Platter Pickup: {platterPickupDate}
              </s-text>
            )}
            {otherItemsPickupDate && (
              <s-text size="small" appearance="accent">
                📦 Other Items Pickup: {otherItemsPickupDate}
        </s-text>
            )}
      </s-stack>
    </s-banner>
      )}
      
      {/* Custom Pickup Location Selector - Only show if we have API data */}
      {/* Note: If API doesn't provide data, JavaScript injection will create the selector */}
      {pickupLocations.length > 0 && (
        <s-block>
          <s-text size="large" weight="bold">
            Select Pickup Location
          </s-text>
          
          <s-choice-list
            name="pickup-location"
            value={selectedPickupLocation || ''}
            onChange={(value) => handlePickupLocationChange(value)}
          >
            {pickupLocations.map((location) => {
              const costText = location.cost.amount === 0 
                ? 'FREE' 
                : `${location.cost.currencyCode} ${(location.cost.amount / 100).toFixed(2)}`;
              
              return (
                <s-choice-list-item
                  key={location.id}
                  id={location.id}
                  value={location.id}
                >
                  <s-stack gap="tight">
                    <s-text size="medium" weight="medium">
                      {location.title}
                    </s-text>
                    
                    {location.description && (
                      <s-text size="small" appearance="subdued">
                        {location.description}
                      </s-text>
                    )}
                    
                    <s-text size="small" appearance="accent">
                      {costText}
                    </s-text>
                  </s-stack>
                </s-choice-list-item>
              );
            })}
          </s-choice-list>
        </s-block>
      )}
      
      {/* Info message - JavaScript will create custom selector if API doesn't work */}
      {pickupLocations.length === 0 && (
        <s-banner tone="info">
          <s-text size="small">
            Custom pickup selector will be created automatically. The default pickup section will be hidden.
          </s-text>
        </s-banner>
      )}
    </s-block>
  );
}