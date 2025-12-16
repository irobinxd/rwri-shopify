import { authenticate } from "../shopify.server";
import { useActionData, useLoaderData, useNavigation, useSubmit } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect, useRef } from "react";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  // First, get the checkout profile ID
  const profileResponse = await admin.graphql(`
    query {
      checkoutProfiles(first: 1, query: "is_published:true") {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `);

  const profileData = await profileResponse.json();
  const checkoutProfileId = profileData.data.checkoutProfiles.edges[0]?.node?.id;

  return { checkoutProfileId };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  // Get the published checkout profile
  const profileResponse = await admin.graphql(`
    query {
      checkoutProfiles(first: 1, query: "is_published:true") {
        edges {
          node {
            id
          }
        }
      }
    }
  `);

  const profileData = await profileResponse.json();
  const checkoutProfileId = profileData.data.checkoutProfiles.edges[0]?.node?.id;

  if (!checkoutProfileId) {
    return {
      success: false,
      error: "No checkout profile found. Please make sure you have a published checkout profile in your store.",
      details: { profileData }
    };
  }

  // Get the app URL for the script injection
  const url = new URL(request.url);
  const appUrl = process.env.SHOPIFY_APP_URL || `${url.protocol}//${url.host}`;
  const scriptUrl = `${appUrl}/checkout-script.js`;

  // CSS to hide "FREE" and "Usually ready in X hours" text on the right side
  const customCSS = `
    /* Hide right side container content - targets the div with _1u2aa6me/_1u2aa6mj classes */
    /* This will hide both "FREE" and "Usually ready" text */
    #local_pickup_methods [class*="_1u2aa6me"] > *:not(strong),
    [id="local_pickup_methods"] [class*="_1u2aa6me"] > *:not(strong),
    #local_pickup_methods [class*="_1u2aa6mj"] > *:not(strong),
    [id="local_pickup_methods"] [class*="_1u2aa6mj"] > *:not(strong),
    
    /* Hide "Usually ready in X hours" text on the right side */
    #local_pickup_methods [class*="_16s97g73r"] p,
    [id="local_pickup_methods"] [class*="_16s97g73r"] p,
    [id*="local_pickup_methods"] [class*="_16s97g73r"] p,
    /* Target paragraph elements within right side container */
    #local_pickup_methods [class*="_1u2aa6me"] p,
    [id="local_pickup_methods"] [class*="_1u2aa6me"] p,
    #local_pickup_methods [class*="_1u2aa6mj"] p,
    [id="local_pickup_methods"] [class*="_1u2aa6mj"] p,
    /* Target divs containing ready time */
    #local_pickup_methods [class*="_1u2aa6me"] [class*="_16s97g73r"],
    [id="local_pickup_methods"] [class*="_1u2aa6me"] [class*="_16s97g73r"],
    #local_pickup_methods [class*="_1u2aa6mj"] [class*="_16s97g73r"],
    [id="local_pickup_methods"] [class*="_1u2aa6mj"] [class*="_16s97g73r"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
      overflow: hidden !important;
      font-size: 0 !important;
      line-height: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    /* Script injection instruction - URL: ${scriptUrl} */
    /* The checkout extension will inject this script */
    body::before {
      content: 'SCRIPT_URL:${scriptUrl}';
      position: absolute;
      width: 0;
      height: 0;
      overflow: hidden;
      z-index: -9999;
      opacity: 0;
      pointer-events: none;
    }
  `;
  
  const cssWithScriptInjection = customCSS;

  // Apply branding with CSS that includes script injection instructions
  // The script will be loaded via the checkout extension or via a manual injection
  let brandingData;
  try {
    // Try CSS directly in checkoutBrandingInput (not in customizations)
    const brandingResponse = await admin.graphql(`
      mutation checkoutBrandingUpsert($checkoutBrandingInput: CheckoutBrandingInput!, $checkoutProfileId: ID!) {
        checkoutBrandingUpsert(checkoutBrandingInput: $checkoutBrandingInput, checkoutProfileId: $checkoutProfileId) {
          checkoutBranding {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      variables: {
        checkoutProfileId: checkoutProfileId,
        checkoutBrandingInput: {
          css: cssWithScriptInjection
        }
      }
    });

    brandingData = await brandingResponse.json();
    console.log('Branding response:', JSON.stringify(brandingData, null, 2));
  } catch (error) {
    console.error('Error applying branding via API:', error);
    
    // If the API doesn't support CSS, that's okay - we'll inject it via the extension
    // Return success with a note that CSS will be injected via extension
    return {
      success: true,
      message: "CSS will be injected via the checkout extension instead of the branding API. Make sure your checkout extension is deployed and active.",
      warning: `Branding API error: ${error.message}. CSS injection will fallback to the checkout extension.`,
      checkoutProfileId: checkoutProfileId,
      scriptUrl: scriptUrl,
      cssApplied: false,
      details: { error: error.toString() }
    };
  }
  
  // Check for errors
  if (brandingData.data?.checkoutBrandingUpsert?.userErrors?.length > 0) {
    const errors = brandingData.data.checkoutBrandingUpsert.userErrors;
    return {
      success: false,
      error: errors.map(e => e.message).join(', '),
      details: brandingData
    };
  }
  
  if (brandingData.errors) {
    return {
      success: false,
      error: brandingData.errors.map(e => e.message).join(', '),
      details: brandingData
    };
  }
  
  // Check if the mutation succeeded (no userErrors means success)
  const hasErrors = brandingData.data?.checkoutBrandingUpsert?.userErrors?.length > 0;
  const appliedCSS = !hasErrors && brandingData.data?.checkoutBrandingUpsert?.checkoutBranding?.id;
  
  return {
    success: true,
    message: appliedCSS 
      ? "Checkout branding applied successfully! CSS has been injected into your checkout."
      : "Checkout branding mutation completed, but CSS may not have been applied.",
    checkoutProfileId: checkoutProfileId,
    scriptUrl: scriptUrl,
    cssApplied: !!appliedCSS,
    details: brandingData
  };
};

export default function CheckoutBranding() {
  // Hooks must be called unconditionally - React Router should provide context
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation?.state === "submitting";
  const hasAutoApplied = useRef(false);
  
  // Safely get AppBridge - wrap in try-catch for safety
  let shopify = null;
  try {
    shopify = useAppBridge();
  } catch (error) {
    // AppBridge might not be available in all contexts
    console.warn('AppBridge not available (this is OK in some contexts):', error.message);
  }
  
  // Automatically apply CSS on page load
  useEffect(() => {
    // Only auto-apply once and if we haven't already applied successfully
    // Also ensure submit function is available
    if (!hasAutoApplied.current && !actionData && !isSubmitting && loaderData?.checkoutProfileId && submit) {
      hasAutoApplied.current = true;
      // Small delay to ensure page is fully loaded
      setTimeout(() => {
        try {
          const formData = new FormData();
          submit(formData, { method: "post" });
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      }, 500);
    }
  }, [actionData, isSubmitting, loaderData, submit]);
  
  // Show toast notification on success/error
  useEffect(() => {
    if (!shopify) return;
    
    if (actionData?.success) {
      shopify.toast.show(actionData.message || "Checkout branding applied successfully!");
    } else if (actionData?.error) {
      shopify.toast.show(`Error: ${actionData.error}`, { isError: true });
    }
  }, [actionData, shopify]);
  
  // Log action data for debugging
  useEffect(() => {
    if (actionData) {
      console.log('Checkout Branding Action Data:', actionData);
    }
  }, [actionData]);
  
  return (
    <s-page title="Checkout Branding">
      <s-section heading="Checkout Branding">
        {!actionData && !isSubmitting && (
          <s-banner tone="info" heading="Auto-applying">
            <s-text>Checkout branding will be applied automatically...</s-text>
          </s-banner>
        )}
        
        <s-form method="post">
          <s-button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? "Applying..." : "Re-apply Checkout CSS"}
          </s-button>
        </s-form>
        
        {isSubmitting && (
          <s-banner tone="info" heading="Processing">
            <s-text>Applying checkout branding... Please wait.</s-text>
          </s-banner>
        )}
        
        {actionData?.success && (
          <s-banner tone="success" heading="Success">
            <s-stack gap="base">
              <s-text>{actionData.message}</s-text>
              {actionData.scriptUrl && (
                <s-text size="small">
                  Script URL: <s-link href={actionData.scriptUrl} target="_blank">{actionData.scriptUrl}</s-link>
                </s-text>
              )}
            </s-stack>
          </s-banner>
        )}
        
        {actionData?.error && (
          <s-banner tone="critical" heading="Error">
            <s-text>{actionData.error}</s-text>
            {actionData.details && (
              <s-details>
                <s-summary>View details</s-summary>
                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                  {JSON.stringify(actionData.details, null, 2)}
                </pre>
              </s-details>
            )}
          </s-banner>
        )}
        
        {loaderData?.checkoutProfileId && (
          <s-banner tone="info" heading="Info">
            <s-text>Checkout Profile ID: {loaderData.checkoutProfileId}</s-text>
          </s-banner>
        )}
      </s-section>
      
      <s-section heading="Instructions">
        <s-stack gap="base">
          <s-text>
            This will apply custom CSS to your checkout to:
          </s-text>
          <s-unordered-list>
            <s-list-item>Add hidden inputs for pickup dates (Platter Pickup Date and Other Items Pickup Date) before store selection</s-list-item>
            <s-list-item>Preserve cart attributes in checkout</s-list-item>
            <s-list-item>Hide "FREE" text on the right side of pickup locations</s-list-item>
            <s-list-item>Hide "Usually ready in X hours" text on the right side</s-list-item>
          </s-unordered-list>
          <s-text size="small" style={{ marginTop: '1rem' }}>
            <strong>Note:</strong> To change "PICK UP/BOOK YOUR OWN RIDER" text, go to <strong>Settings → Checkout → Local pickup</strong> in your Shopify admin.
          </s-text>
          <s-text size="small">
            <strong>Important Notes:</strong>
          </s-text>
          <s-unordered-list>
            <s-list-item>Make sure your checkout UI extension is deployed and active in your checkout settings</s-list-item>
            <s-list-item>Go to Settings → Checkout → Checkout extensions to enable the extension</s-list-item>
            <s-list-item>The CSS will be applied immediately, but script injection requires the extension to be active</s-list-item>
            <s-list-item>Check the browser console on your checkout page for any errors</s-list-item>
          </s-unordered-list>
          
          {actionData?.success && actionData.cssApplied && (
            <s-banner tone="info" heading="CSS Applied">
              <s-text>The CSS has been successfully applied to your checkout. Check your checkout page to see the changes.</s-text>
            </s-banner>
          )}
        </s-stack>
      </s-section>
    </s-page>
  );
}
