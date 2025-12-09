import { json } from "react-router";
import { authenticate } from "../shopify.server";

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

  return json({ checkoutProfileId });
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
    return json({ error: "No checkout profile found" }, { status: 400 });
  }

  // Custom CSS to hide/modify elements
  const customCSS = `
    /* Hide "PICK UP/BOOK YOUR OWN RIDER" text - adjust selector as needed */
    [data-pickup-instructions],
    .pickup-point-instructions,
    [class*="pickup"] [class*="instruction"] {
      display: none !important;
    }

    /* Optionally change the Delivery header styling */
    #deliveryAddress {
      /* Example: Change text via CSS (limited - better to use translations) */
      /* Or hide it if you want to use your own extension header */
      /* display: none !important; */
    }
  `;

  // Apply the branding
  const brandingResponse = await admin.graphql(`
    mutation checkoutBrandingUpsert($checkoutBrandingInput: CheckoutBrandingInput!, $checkoutProfileId: ID!) {
      checkoutBrandingUpsert(checkoutBrandingInput: $checkoutBrandingInput, checkoutProfileId: $checkoutProfileId) {
        checkoutBranding {
          customizations {
            custom {
              css
            }
          }
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
        customizations: {
          custom: {
            css: customCSS
          }
        }
      }
    }
  });

  const brandingData = await brandingResponse.json();
  return json(brandingData);
};

export default function CheckoutBranding() {
  return (
    <s-page title="Checkout Branding">
      <s-section heading="Apply Custom CSS">
        <s-form method="post">
          <s-button type="submit">Apply Checkout CSS</s-button>
        </s-form>
      </s-section>
    </s-page>
  );
}
