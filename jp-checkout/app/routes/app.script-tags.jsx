import { authenticate } from "../shopify.server";
import { useLoaderData, useActionData, useSubmit, useNavigation, Form } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  // Get all script tags
  const response = await admin.graphql(`
    query {
      scriptTags(first: 50) {
        edges {
          node {
            id
            src
            displayScope
          }
        }
      }
    }
  `);

  const data = await response.json();
  const scriptTags = data.data?.scriptTags?.edges || [];

  // Get app URL for script
  const url = new URL(request.url);
  const appUrl = process.env.SHOPIFY_APP_URL || `${url.protocol}//${url.host}`;
  const scriptUrl = `${appUrl}/checkout-script.js`;

  return { scriptTags, scriptUrl };
};

export const action = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const action = formData.get("action");

    const url = new URL(request.url);
    const appUrl = process.env.SHOPIFY_APP_URL || `${url.protocol}//${url.host}`;
    const scriptUrl = `${appUrl}/checkout-script.js`;

    console.log("Script tag action:", action);
    console.log("Script URL:", scriptUrl);

    if (action === "create") {
      // Check if script tag already exists
      const checkResponse = await admin.graphql(`
        query {
          scriptTags(first: 50) {
            edges {
              node {
                id
                src
              }
            }
          }
        }
      `);

      const checkData = await checkResponse.json();
      const existing = checkData.data?.scriptTags?.edges?.find(
        (edge) => edge.node.src === scriptUrl
      );

      if (existing) {
        return {
          success: false,
          error: "Script tag already exists",
          scriptTag: existing.node,
        };
      }

      // Create new script tag
      const response = await admin.graphql(`
        mutation scriptTagCreate($input: ScriptTagInput!) {
          scriptTagCreate(input: $input) {
            scriptTag {
              id
              src
              displayScope
            }
            userErrors {
              field
              message
            }
          }
        }
      `, {
        variables: {
          input: {
            src: scriptUrl,
            displayScope: "ALL",
          },
        },
      });

      const data = await response.json();
      
      console.log("Script tag create response:", JSON.stringify(data, null, 2));
      
      if (data.errors && data.errors.length > 0) {
        return {
          success: false,
          error: data.errors[0].message || "Failed to create script tag",
          details: data.errors,
        };
      }
      
      if (data.data?.scriptTagCreate?.userErrors?.length > 0) {
        return {
          success: false,
          error: data.data.scriptTagCreate.userErrors[0].message,
          details: data.data.scriptTagCreate.userErrors,
        };
      }

      if (!data.data?.scriptTagCreate?.scriptTag) {
        return {
          success: false,
          error: "Script tag was not created. Response: " + JSON.stringify(data),
        };
      }

      return {
        success: true,
        scriptTag: data.data.scriptTagCreate.scriptTag,
      };
    } else if (action === "delete") {
      const scriptTagId = formData.get("scriptTagId");
      
      if (!scriptTagId) {
        return { success: false, error: "Script tag ID is required" };
      }

      const response = await admin.graphql(`
        mutation scriptTagDelete($id: ID!) {
          scriptTagDelete(id: $id) {
            deletedScriptTagId
            userErrors {
              field
              message
            }
          }
        }
      `, {
        variables: {
          id: scriptTagId,
        },
      });

      const data = await response.json();
      
      if (data.data?.scriptTagDelete?.userErrors?.length > 0) {
        return {
          success: false,
          error: data.data.scriptTagDelete.userErrors[0].message,
        };
      }

      return {
        success: true,
        deletedId: data.data?.scriptTagDelete?.deletedScriptTagId,
      };
    }

    return { success: false, error: "Invalid action" };
  } catch (error) {
    console.error("Script tag action error:", error);
    return {
      success: false,
      error: error.message || "An error occurred while processing the request",
      details: error.stack,
    };
  }
};

export default function ScriptTags() {
  const { scriptTags, scriptUrl } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const appBridge = useAppBridge();

  useEffect(() => {
    if (actionData?.success) {
      appBridge.toast.show("Script tag operation successful!", { isError: false });
      // Reload the page data after successful operation
      window.location.reload();
    } else if (actionData?.error) {
      appBridge.toast.show(actionData.error, { isError: true });
      console.error("Script tag error:", actionData.error);
    }
  }, [actionData, appBridge]);

  const checkoutScriptTag = scriptTags.find(
    (edge) => edge.node.src === scriptUrl
  );

  const handleCreate = (e) => {
    e.preventDefault();
    console.log("Creating script tag...");
    submit({ action: "create" }, { method: "post" });
  };

  const handleDelete = (scriptTagId) => {
    if (confirm("Are you sure you want to delete this script tag?")) {
      console.log("Deleting script tag:", scriptTagId);
      submit({ action: "delete", scriptTagId }, { method: "post" });
    }
  };

  const isLoading = navigation.state === "submitting";

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Checkout Script Tag Management</h1>
      
      <div style={{ marginBottom: "2rem", padding: "1rem", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
        <h2>Script URL</h2>
        <p style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{scriptUrl}</p>
      </div>

      {checkoutScriptTag ? (
        <div style={{ marginBottom: "2rem" }}>
          <h2>Current Script Tag</h2>
          <div style={{ padding: "1rem", backgroundColor: "#e8f5e9", borderRadius: "8px", marginBottom: "1rem" }}>
            <p><strong>Status:</strong> ✅ Installed</p>
            <p><strong>ID:</strong> {checkoutScriptTag.node.id}</p>
            <p><strong>Display Scope:</strong> {checkoutScriptTag.node.displayScope || "ALL"}</p>
          </div>
          <button
            onClick={() => handleDelete(checkoutScriptTag.node.id)}
            disabled={isLoading}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#d32f2f",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Deleting..." : "Delete Script Tag"}
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: "2rem" }}>
          <h2>Install Script Tag</h2>
          <p style={{ marginBottom: "1rem" }}>
            Click the button below to install the checkout customization script tag.
            This will inject the JavaScript into your checkout pages.
          </p>
          <Form method="post" onSubmit={handleCreate}>
            <input type="hidden" name="action" value="create" />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Installing..." : "Install Script Tag"}
            </button>
          </Form>
          {actionData && !actionData.success && (
            <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#ffebee", borderRadius: "4px", color: "#c62828" }}>
              <strong>Error:</strong> {actionData.error || "Unknown error occurred"}
            </div>
          )}
        </div>
      )}

      {scriptTags.length > 0 && (
        <div>
          <h2>All Script Tags ({scriptTags.length})</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {scriptTags.map((edge) => (
              <li
                key={edge.node.id}
                style={{
                  padding: "1rem",
                  marginBottom: "0.5rem",
                  backgroundColor: edge.node.src === scriptUrl ? "#e8f5e9" : "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <p><strong>ID:</strong> {edge.node.id}</p>
                <p><strong>URL:</strong> <code style={{ fontSize: "0.9em" }}>{edge.node.src}</code></p>
                <p><strong>Scope:</strong> {edge.node.displayScope || "ALL"}</p>
                {edge.node.src === scriptUrl && (
                  <button
                    onClick={() => handleDelete(edge.node.id)}
                    disabled={isLoading}
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.5rem 1rem",
                      backgroundColor: "#d32f2f",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

