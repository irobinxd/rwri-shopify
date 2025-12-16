import { authenticate } from "../shopify.server";
import { useLoaderData, useActionData, useNavigation, useSubmit } from "react-router";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  // Get shop domain
  const shopDomain = shop || (await admin.graphql(`
    query {
      shop {
        myshopifyDomain
        primaryDomain {
          url
        }
      }
    }
  `).then(res => res.json()).then(data => data.data.shop.myshopifyDomain));

  return { shopDomain };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "check_products") {
    try {
      // Fetch all products with pagination
      let allProducts = [];
      let hasNextPage = true;
      let cursor = null;

      while (hasNextPage) {
        const query = cursor
          ? `#graphql
            query getProducts($cursor: String!) {
              products(first: 250, after: $cursor) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                edges {
                  node {
                    id
                    title
                    handle
                    status
                    publishedAt
                    onlineStoreUrl
                    variants(first: 1) {
                      edges {
                        node {
                          id
                          availableForSale
                        }
                      }
                    }
                    description
                    descriptionHtml
                  }
                }
              }
            }`
          : `#graphql
            query getProducts {
              products(first: 250) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                edges {
                  node {
                    id
                    title
                    handle
                    status
                    publishedAt
                    onlineStoreUrl
                    variants(first: 1) {
                      edges {
                        node {
                          id
                          availableForSale
                        }
                      }
                    }
                    description
                    descriptionHtml
                  }
                }
              }
            }`;

        const variables = cursor ? { cursor } : {};
        const response = await admin.graphql(query, { variables });
        const data = await response.json();

        if (data.errors) {
          return {
            success: false,
            error: "Failed to fetch products",
            details: data.errors,
          };
        }

        const products = data.data.products.edges.map((edge) => edge.node);
        allProducts = allProducts.concat(products);

        hasNextPage = data.data.products.pageInfo.hasNextPage;
        cursor = data.data.products.pageInfo.endCursor;
      }

      // Get shop domain for URL checking
      const shopResponse = await admin.graphql(`
        query {
          shop {
            myshopifyDomain
            primaryDomain {
              url
            }
          }
        }
      `);
      const shopData = await shopResponse.json();
      const shopDomain = shopData.data.shop.myshopifyDomain;
      const baseUrl = `https://${shopDomain}`;

      // Analyze products
      const results = {
        total: allProducts.length,
        active: 0,
        inactive: 0,
        draft: 0,
        archived: 0,
        noVariantsAvailable: 0,
        products: [],
        deadLinks: [],
      };

      // Extract links from product descriptions
      const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
      const allLinks = new Set();

      allProducts.forEach((product) => {
        // Check product status
        const isActive = product.status === "ACTIVE" && product.publishedAt;
        const isDraft = product.status === "DRAFT";
        const isArchived = product.status === "ARCHIVED";

        if (isActive) results.active++;
        if (isDraft) results.draft++;
        if (isArchived) results.archived++;
        if (!isActive && !isDraft && !isArchived) results.inactive++;

        // Check if variants are available
        const hasAvailableVariants = product.variants.edges.some(
          (edge) => edge.node.availableForSale
        );
        if (!hasAvailableVariants && isActive) {
          results.noVariantsAvailable++;
        }

        // Extract links from description
        const description = product.descriptionHtml || product.description || "";
        let match;
        while ((match = linkRegex.exec(description)) !== null) {
          const link = match[1];
          if (link && !link.startsWith("#") && !link.startsWith("javascript:")) {
            allLinks.add(link);
          }
        }

        results.products.push({
          id: product.id,
          title: product.title,
          handle: product.handle,
          status: product.status,
          publishedAt: product.publishedAt,
          onlineStoreUrl: product.onlineStoreUrl || `${baseUrl}/products/${product.handle}`,
          isActive,
          hasAvailableVariants,
          variantsCount: product.variants.edges.length,
        });
      });

      // Check dead links (this would need to be done client-side or via a background job)
      // For now, we'll identify potentially problematic links
      results.deadLinks = Array.from(allLinks).map((link) => {
        const isInternal = link.includes(shopDomain) || link.startsWith("/");
        const isExternal = !isInternal && (link.startsWith("http://") || link.startsWith("https://"));
        
        return {
          url: link,
          isInternal,
          isExternal,
          // Note: Actual link checking would require making HTTP requests
          // This should be done client-side or via a background job
        };
      });

      return {
        success: true,
        results,
        shopDomain: baseUrl,
      };
    } catch (error) {
      console.error("Error checking products:", error);
      return {
        success: false,
        error: error.message || "Failed to check products",
      };
    }
  }

  return { success: false, error: "Invalid action" };
};

export default function ProductChecker() {
  const { shopDomain } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();

  const isLoading = navigation.state === "submitting";

  const handleCheckProducts = () => {
    const formData = new FormData();
    formData.append("action", "check_products");
    submit(formData, { method: "post" });
  };

  return (
    <s-page
      title="Product & Link Checker"
      primaryAction={{
        content: "Check Products",
        onAction: handleCheckProducts,
        loading: isLoading,
      }}
    >
      <s-section heading="Product Status Checker">
        <s-stack gap="base">
          <s-text>
            This tool checks your Shopify store for:
          </s-text>
          <s-unordered-list>
            <s-list-item>Active vs inactive products</s-list-item>
            <s-list-item>Products with no available variants</s-list-item>
            <s-list-item>Draft and archived products</s-list-item>
            <s-list-item>Links in product descriptions</s-list-item>
            <s-list-item>Product page URLs</s-list-item>
          </s-unordered-list>
          <s-text size="small" appearance="subdued">
            Click "Check Products" to analyze your store.
          </s-text>
        </s-stack>
      </s-section>

      {isLoading && (
        <s-banner tone="info">
          <s-text>Checking products... This may take a moment.</s-text>
        </s-banner>
      )}

      {actionData?.success && actionData.results && (
        <s-section heading="Results">
          <s-stack gap="base">
            <s-box padding="base" borderWidth="base" borderRadius="base" background="subdued">
              <s-stack gap="tight">
                <s-text size="large" weight="bold">
                  Summary
                </s-text>
                <s-text>
                  <strong>Total Products:</strong> {actionData.results.total}
                </s-text>
                <s-text appearance="success">
                  <strong>Active:</strong> {actionData.results.active}
                </s-text>
                <s-text appearance="critical">
                  <strong>Inactive:</strong> {actionData.results.inactive}
                </s-text>
                <s-text appearance="subdued">
                  <strong>Draft:</strong> {actionData.results.draft}
                </s-text>
                <s-text appearance="subdued">
                  <strong>Archived:</strong> {actionData.results.archived}
                </s-text>
                <s-text appearance="warning">
                  <strong>Active but no variants available:</strong>{" "}
                  {actionData.results.noVariantsAvailable}
                </s-text>
                <s-text>
                  <strong>Links found:</strong> {actionData.results.deadLinks.length}
                </s-text>
              </s-stack>
            </s-box>

            {/* Products List */}
            <s-section heading="All Products">
              <s-stack gap="tight">
                {actionData.results.products.map((product) => (
                  <s-box
                    key={product.id}
                    padding="base"
                    borderWidth="base"
                    borderRadius="base"
                    background={product.isActive ? "subdued" : "surface"}
                  >
                    <s-stack gap="extraTight">
                      <s-stack direction="row" gap="tight" align="space-between">
                        <s-text weight="medium">{product.title}</s-text>
                        <s-badge
                          tone={
                            product.isActive
                              ? "success"
                              : product.status === "DRAFT"
                              ? "info"
                              : "critical"
                          }
                        >
                          {product.status}
                        </s-badge>
                      </s-stack>
                      <s-text size="small" appearance="subdued">
                        Handle: {product.handle}
                      </s-text>
                      <s-text size="small">
                        <s-link href={product.onlineStoreUrl} target="_blank">
                          View Product Page →
                        </s-link>
                      </s-text>
                      {!product.hasAvailableVariants && product.isActive && (
                        <s-text size="small" appearance="warning">
                          ⚠️ No variants available for sale
                        </s-text>
                      )}
                    </s-stack>
                  </s-box>
                ))}
              </s-stack>
            </s-section>

            {/* Links Found */}
            {actionData.results.deadLinks.length > 0 && (
              <s-section heading="Links Found in Product Descriptions">
                <s-stack gap="tight">
                  <s-text size="small" appearance="subdued">
                    These links were found in product descriptions. Verify them manually.
                  </s-text>
                  {actionData.results.deadLinks.map((link, index) => (
                    <s-box
                      key={index}
                      padding="base"
                      borderWidth="base"
                      borderRadius="base"
                      background="subdued"
                    >
                      <s-stack gap="extraTight">
                        <s-text size="small">
                          <s-link href={link.url} target="_blank">
                            {link.url}
                          </s-link>
                        </s-text>
                        <s-text size="small" appearance="subdued">
                          {link.isInternal ? "Internal link" : "External link"}
                        </s-text>
                      </s-stack>
                    </s-box>
                  ))}
                </s-stack>
              </s-section>
            )}
          </s-stack>
        </s-section>
      )}

      {actionData?.error && (
        <s-banner tone="critical">
          <s-text>Error: {actionData.error}</s-text>
        </s-banner>
      )}
    </s-page>
  );
}

