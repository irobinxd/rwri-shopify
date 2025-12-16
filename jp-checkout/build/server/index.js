var _a;
import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter, UNSAFE_withComponentProps, Meta, Links, Outlet, ScrollRestoration, Scripts, useLoaderData, useActionData, Form, redirect, UNSAFE_withErrorBoundaryProps, useRouteError, useNavigation, useSubmit, useFetcher } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import "@shopify/shopify-app-react-router/adapters/node";
import { shopifyApp, AppDistribution, ApiVersion, LoginErrorType, boundary } from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { PrismaClient } from "@prisma/client";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { useState, useRef, useEffect } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient();
  }
}
const prisma = global.prismaGlobal ?? new PrismaClient();
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October25,
  scopes: (_a = process.env.SCOPES) == null ? void 0 : _a.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  ...process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}
});
ApiVersion.October25;
const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
const authenticate = shopify.authenticate;
shopify.unauthenticated;
const login = shopify.login;
shopify.registerWebhooks;
shopify.sessionStorage;
const streamTimeout = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, reactRouterContext) {
  addDocumentResponseHeaders(request, responseHeaders);
  const userAgent = request.headers.get("user-agent");
  const callbackName = isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: reactRouterContext, url: request.url }),
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width,initial-scale=1"
      }), /* @__PURE__ */ jsx("link", {
        rel: "preconnect",
        href: "https://cdn.shopify.com/"
      }), /* @__PURE__ */ jsx("link", {
        rel: "stylesheet",
        href: "https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
const action$4 = async ({
  request
}) => {
  const {
    payload,
    session,
    topic,
    shop
  } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);
  const current = payload.current;
  if (session) {
    await prisma.session.update({
      where: {
        id: session.id
      },
      data: {
        scope: current.toString()
      }
    });
  }
  return new Response();
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4
}, Symbol.toStringTag, { value: "Module" }));
const action$3 = async ({
  request
}) => {
  const {
    shop,
    session,
    topic
  } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);
  if (session) {
    await prisma.session.deleteMany({
      where: {
        shop
      }
    });
  }
  return new Response();
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3
}, Symbol.toStringTag, { value: "Module" }));
const headers$3 = () => ({
  "Content-Type": "application/javascript; charset=utf-8",
  "Cache-Control": "public, max-age=3600"
});
const checkoutScript = UNSAFE_withComponentProps(function checkoutScript2() {
  return `(function() {
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
})();`;
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: checkoutScript,
  headers: headers$3
}, Symbol.toStringTag, { value: "Module" }));
function loginErrorMessage(loginErrors) {
  if ((loginErrors == null ? void 0 : loginErrors.shop) === LoginErrorType.MissingShop) {
    return { shop: "Please enter your shop domain to log in" };
  } else if ((loginErrors == null ? void 0 : loginErrors.shop) === LoginErrorType.InvalidShop) {
    return { shop: "Please enter a valid shop domain to log in" };
  }
  return {};
}
const loader$5 = async ({
  request
}) => {
  const errors = loginErrorMessage(await login(request));
  return {
    errors
  };
};
const action$2 = async ({
  request
}) => {
  const errors = loginErrorMessage(await login(request));
  return {
    errors
  };
};
const route$1 = UNSAFE_withComponentProps(function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const {
    errors
  } = actionData || loaderData;
  return /* @__PURE__ */ jsx(AppProvider, {
    embedded: false,
    children: /* @__PURE__ */ jsx("s-page", {
      children: /* @__PURE__ */ jsx(Form, {
        method: "post",
        children: /* @__PURE__ */ jsxs("s-section", {
          heading: "Log in",
          children: [/* @__PURE__ */ jsx("s-text-field", {
            name: "shop",
            label: "Shop domain",
            details: "example.myshopify.com",
            value: shop,
            onChange: (e) => setShop(e.currentTarget.value),
            autocomplete: "on",
            error: errors.shop
          }), /* @__PURE__ */ jsx("s-button", {
            type: "submit",
            children: "Log in"
          })]
        })
      })
    })
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: route$1,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const loader$4 = async ({
  request
}) => {
  await authenticate.admin(request);
  return null;
};
const headers$2 = (headersArgs) => {
  return boundary.headers(headersArgs);
};
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  headers: headers$2,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const index = "_index_1hqgz_1";
const heading = "_heading_1hqgz_21";
const text = "_text_1hqgz_23";
const content = "_content_1hqgz_43";
const form = "_form_1hqgz_53";
const label = "_label_1hqgz_69";
const input = "_input_1hqgz_85";
const button = "_button_1hqgz_93";
const list = "_list_1hqgz_101";
const styles = {
  index,
  heading,
  text,
  content,
  form,
  label,
  input,
  button,
  list
};
const loader$3 = async ({
  request
}) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  return {
    showForm: Boolean(login)
  };
};
const route = UNSAFE_withComponentProps(function App2() {
  const {
    showForm
  } = useLoaderData();
  return /* @__PURE__ */ jsx("div", {
    className: styles.index,
    children: /* @__PURE__ */ jsxs("div", {
      className: styles.content,
      children: [/* @__PURE__ */ jsx("h1", {
        className: styles.heading,
        children: "A short heading about [your app]"
      }), /* @__PURE__ */ jsx("p", {
        className: styles.text,
        children: "A tagline about [your app] that describes your value proposition."
      }), showForm && /* @__PURE__ */ jsxs(Form, {
        className: styles.form,
        method: "post",
        action: "/auth/login",
        children: [/* @__PURE__ */ jsxs("label", {
          className: styles.label,
          children: [/* @__PURE__ */ jsx("span", {
            children: "Shop domain"
          }), /* @__PURE__ */ jsx("input", {
            className: styles.input,
            type: "text",
            name: "shop"
          }), /* @__PURE__ */ jsx("span", {
            children: "e.g: my-shop-domain.myshopify.com"
          })]
        }), /* @__PURE__ */ jsx("button", {
          className: styles.button,
          type: "submit",
          children: "Log in"
        })]
      }), /* @__PURE__ */ jsxs("ul", {
        className: styles.list,
        children: [/* @__PURE__ */ jsxs("li", {
          children: [/* @__PURE__ */ jsx("strong", {
            children: "Product feature"
          }), ". Some detail about your feature and its benefit to your customer."]
        }), /* @__PURE__ */ jsxs("li", {
          children: [/* @__PURE__ */ jsx("strong", {
            children: "Product feature"
          }), ". Some detail about your feature and its benefit to your customer."]
        }), /* @__PURE__ */ jsxs("li", {
          children: [/* @__PURE__ */ jsx("strong", {
            children: "Product feature"
          }), ". Some detail about your feature and its benefit to your customer."]
        })]
      })]
    })
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: route,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const loader$2 = async ({
  request
}) => {
  await authenticate.admin(request);
  return {
    apiKey: process.env.SHOPIFY_API_KEY || ""
  };
};
const app = UNSAFE_withComponentProps(function App3() {
  const {
    apiKey
  } = useLoaderData();
  return /* @__PURE__ */ jsxs(AppProvider, {
    embedded: true,
    apiKey,
    children: [/* @__PURE__ */ jsxs("s-app-nav", {
      children: [/* @__PURE__ */ jsx("s-link", {
        href: "/app",
        children: "Home"
      }), /* @__PURE__ */ jsx("s-link", {
        href: "/app/additional",
        children: "Additional page"
      }), /* @__PURE__ */ jsx("s-link", {
        href: "/app/checkout-branding",
        children: "Checkout Branding"
      })]
    }), /* @__PURE__ */ jsx(Outlet, {})]
  });
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2() {
  return boundary.error(useRouteError());
});
const headers$1 = (headersArgs) => {
  return boundary.headers(headersArgs);
};
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: app,
  headers: headers$1,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const loader$1 = async ({
  request
}) => {
  var _a2, _b;
  const {
    admin
  } = await authenticate.admin(request);
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
  const checkoutProfileId = (_b = (_a2 = profileData.data.checkoutProfiles.edges[0]) == null ? void 0 : _a2.node) == null ? void 0 : _b.id;
  return {
    checkoutProfileId
  };
};
const action$1 = async ({
  request
}) => {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const {
    admin
  } = await authenticate.admin(request);
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
  const checkoutProfileId = (_b = (_a2 = profileData.data.checkoutProfiles.edges[0]) == null ? void 0 : _a2.node) == null ? void 0 : _b.id;
  if (!checkoutProfileId) {
    return {
      success: false,
      error: "No checkout profile found. Please make sure you have a published checkout profile in your store.",
      details: {
        profileData
      }
    };
  }
  const url = new URL(request.url);
  const appUrl = process.env.SHOPIFY_APP_URL || `${url.protocol}//${url.host}`;
  const scriptUrl = `${appUrl}/checkout-script.js`;
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
  let brandingData;
  try {
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
        checkoutProfileId,
        checkoutBrandingInput: {
          css: cssWithScriptInjection
        }
      }
    });
    brandingData = await brandingResponse.json();
    console.log("Branding response:", JSON.stringify(brandingData, null, 2));
  } catch (error) {
    console.error("Error applying branding via API:", error);
    return {
      success: true,
      message: "CSS will be injected via the checkout extension instead of the branding API. Make sure your checkout extension is deployed and active.",
      warning: `Branding API error: ${error.message}. CSS injection will fallback to the checkout extension.`,
      checkoutProfileId,
      scriptUrl,
      cssApplied: false,
      details: {
        error: error.toString()
      }
    };
  }
  if (((_e = (_d = (_c = brandingData.data) == null ? void 0 : _c.checkoutBrandingUpsert) == null ? void 0 : _d.userErrors) == null ? void 0 : _e.length) > 0) {
    const errors = brandingData.data.checkoutBrandingUpsert.userErrors;
    return {
      success: false,
      error: errors.map((e) => e.message).join(", "),
      details: brandingData
    };
  }
  if (brandingData.errors) {
    return {
      success: false,
      error: brandingData.errors.map((e) => e.message).join(", "),
      details: brandingData
    };
  }
  const hasErrors = ((_h = (_g = (_f = brandingData.data) == null ? void 0 : _f.checkoutBrandingUpsert) == null ? void 0 : _g.userErrors) == null ? void 0 : _h.length) > 0;
  const appliedCSS = !hasErrors && ((_k = (_j = (_i = brandingData.data) == null ? void 0 : _i.checkoutBrandingUpsert) == null ? void 0 : _j.checkoutBranding) == null ? void 0 : _k.id);
  return {
    success: true,
    message: appliedCSS ? "Checkout branding applied successfully! CSS has been injected into your checkout." : "Checkout branding mutation completed, but CSS may not have been applied.",
    checkoutProfileId,
    scriptUrl,
    cssApplied: !!appliedCSS,
    details: brandingData
  };
};
const app_checkoutBranding = UNSAFE_withComponentProps(function CheckoutBranding() {
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = (navigation == null ? void 0 : navigation.state) === "submitting";
  const hasAutoApplied = useRef(false);
  let shopify2 = null;
  try {
    shopify2 = useAppBridge();
  } catch (error) {
    console.warn("AppBridge not available (this is OK in some contexts):", error.message);
  }
  useEffect(() => {
    if (!hasAutoApplied.current && !actionData && !isSubmitting && (loaderData == null ? void 0 : loaderData.checkoutProfileId) && submit) {
      hasAutoApplied.current = true;
      setTimeout(() => {
        try {
          const formData = new FormData();
          submit(formData, {
            method: "post"
          });
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      }, 500);
    }
  }, [actionData, isSubmitting, loaderData, submit]);
  useEffect(() => {
    if (!shopify2) return;
    if (actionData == null ? void 0 : actionData.success) {
      shopify2.toast.show(actionData.message || "Checkout branding applied successfully!");
    } else if (actionData == null ? void 0 : actionData.error) {
      shopify2.toast.show(`Error: ${actionData.error}`, {
        isError: true
      });
    }
  }, [actionData, shopify2]);
  useEffect(() => {
    if (actionData) {
      console.log("Checkout Branding Action Data:", actionData);
    }
  }, [actionData]);
  return /* @__PURE__ */ jsxs("s-page", {
    title: "Checkout Branding",
    children: [/* @__PURE__ */ jsxs("s-section", {
      heading: "Checkout Branding",
      children: [!actionData && !isSubmitting && /* @__PURE__ */ jsx("s-banner", {
        tone: "info",
        heading: "Auto-applying",
        children: /* @__PURE__ */ jsx("s-text", {
          children: "Checkout branding will be applied automatically..."
        })
      }), /* @__PURE__ */ jsx("s-form", {
        method: "post",
        children: /* @__PURE__ */ jsx("s-button", {
          type: "submit",
          loading: isSubmitting,
          disabled: isSubmitting,
          children: isSubmitting ? "Applying..." : "Re-apply Checkout CSS"
        })
      }), isSubmitting && /* @__PURE__ */ jsx("s-banner", {
        tone: "info",
        heading: "Processing",
        children: /* @__PURE__ */ jsx("s-text", {
          children: "Applying checkout branding... Please wait."
        })
      }), (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsx("s-banner", {
        tone: "success",
        heading: "Success",
        children: /* @__PURE__ */ jsxs("s-stack", {
          gap: "base",
          children: [/* @__PURE__ */ jsx("s-text", {
            children: actionData.message
          }), actionData.scriptUrl && /* @__PURE__ */ jsxs("s-text", {
            size: "small",
            children: ["Script URL: ", /* @__PURE__ */ jsx("s-link", {
              href: actionData.scriptUrl,
              target: "_blank",
              children: actionData.scriptUrl
            })]
          })]
        })
      }), (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsxs("s-banner", {
        tone: "critical",
        heading: "Error",
        children: [/* @__PURE__ */ jsx("s-text", {
          children: actionData.error
        }), actionData.details && /* @__PURE__ */ jsxs("s-details", {
          children: [/* @__PURE__ */ jsx("s-summary", {
            children: "View details"
          }), /* @__PURE__ */ jsx("pre", {
            style: {
              fontSize: "12px",
              overflow: "auto"
            },
            children: JSON.stringify(actionData.details, null, 2)
          })]
        })]
      }), (loaderData == null ? void 0 : loaderData.checkoutProfileId) && /* @__PURE__ */ jsx("s-banner", {
        tone: "info",
        heading: "Info",
        children: /* @__PURE__ */ jsxs("s-text", {
          children: ["Checkout Profile ID: ", loaderData.checkoutProfileId]
        })
      })]
    }), /* @__PURE__ */ jsx("s-section", {
      heading: "Instructions",
      children: /* @__PURE__ */ jsxs("s-stack", {
        gap: "base",
        children: [/* @__PURE__ */ jsx("s-text", {
          children: "This will apply custom CSS to your checkout to:"
        }), /* @__PURE__ */ jsxs("s-unordered-list", {
          children: [/* @__PURE__ */ jsx("s-list-item", {
            children: "Add hidden inputs for pickup dates (Platter Pickup Date and Other Items Pickup Date) before store selection"
          }), /* @__PURE__ */ jsx("s-list-item", {
            children: "Preserve cart attributes in checkout"
          }), /* @__PURE__ */ jsx("s-list-item", {
            children: 'Hide "FREE" text on the right side of pickup locations'
          }), /* @__PURE__ */ jsx("s-list-item", {
            children: 'Hide "Usually ready in X hours" text on the right side'
          })]
        }), /* @__PURE__ */ jsxs("s-text", {
          size: "small",
          style: {
            marginTop: "1rem"
          },
          children: [/* @__PURE__ */ jsx("strong", {
            children: "Note:"
          }), ' To change "PICK UP/BOOK YOUR OWN RIDER" text, go to ', /* @__PURE__ */ jsx("strong", {
            children: "Settings → Checkout → Local pickup"
          }), " in your Shopify admin."]
        }), /* @__PURE__ */ jsx("s-text", {
          size: "small",
          children: /* @__PURE__ */ jsx("strong", {
            children: "Important Notes:"
          })
        }), /* @__PURE__ */ jsxs("s-unordered-list", {
          children: [/* @__PURE__ */ jsx("s-list-item", {
            children: "Make sure your checkout UI extension is deployed and active in your checkout settings"
          }), /* @__PURE__ */ jsx("s-list-item", {
            children: "Go to Settings → Checkout → Checkout extensions to enable the extension"
          }), /* @__PURE__ */ jsx("s-list-item", {
            children: "The CSS will be applied immediately, but script injection requires the extension to be active"
          }), /* @__PURE__ */ jsx("s-list-item", {
            children: "Check the browser console on your checkout page for any errors"
          })]
        }), (actionData == null ? void 0 : actionData.success) && actionData.cssApplied && /* @__PURE__ */ jsx("s-banner", {
          tone: "info",
          heading: "CSS Applied",
          children: /* @__PURE__ */ jsx("s-text", {
            children: "The CSS has been successfully applied to your checkout. Check your checkout page to see the changes."
          })
        })]
      })
    })]
  });
});
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: app_checkoutBranding,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const app_additional = UNSAFE_withComponentProps(function AdditionalPage() {
  return /* @__PURE__ */ jsxs("s-page", {
    heading: "Additional page",
    children: [/* @__PURE__ */ jsxs("s-section", {
      heading: "Multiple pages",
      children: [/* @__PURE__ */ jsxs("s-paragraph", {
        children: ["The app template comes with an additional page which demonstrates how to create multiple pages within app navigation using", " ", /* @__PURE__ */ jsx("s-link", {
          href: "https://shopify.dev/docs/apps/tools/app-bridge",
          target: "_blank",
          children: "App Bridge"
        }), "."]
      }), /* @__PURE__ */ jsxs("s-paragraph", {
        children: ["To create your own page and have it show up in the app navigation, add a page inside ", /* @__PURE__ */ jsx("code", {
          children: "app/routes"
        }), ", and a link to it in the", " ", /* @__PURE__ */ jsx("code", {
          children: "<ui-nav-menu>"
        }), " component found in", " ", /* @__PURE__ */ jsx("code", {
          children: "app/routes/app.jsx"
        }), "."]
      })]
    }), /* @__PURE__ */ jsx("s-section", {
      slot: "aside",
      heading: "Resources",
      children: /* @__PURE__ */ jsx("s-unordered-list", {
        children: /* @__PURE__ */ jsx("s-list-item", {
          children: /* @__PURE__ */ jsx("s-link", {
            href: "https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav",
            target: "_blank",
            children: "App nav best practices"
          })
        })
      })
    })]
  });
});
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: app_additional
}, Symbol.toStringTag, { value: "Module" }));
const loader = async ({
  request
}) => {
  await authenticate.admin(request);
  return null;
};
const action = async ({
  request
}) => {
  const {
    admin
  } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][Math.floor(Math.random() * 4)];
  const response = await admin.graphql(`#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`, {
    variables: {
      product: {
        title: `${color} Snowboard`
      }
    }
  });
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(`#graphql
    mutation shopifyReactRouterTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`, {
    variables: {
      productId: product.id,
      variants: [{
        id: variantId,
        price: "100.00"
      }]
    }
  });
  const variantResponseJson = await variantResponse.json();
  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants
  };
};
const app__index = UNSAFE_withComponentProps(function Index() {
  var _a2, _b, _c, _d;
  const fetcher = useFetcher();
  const shopify2 = useAppBridge();
  const isLoading = ["loading", "submitting"].includes(fetcher.state) && fetcher.formMethod === "POST";
  useEffect(() => {
    var _a3, _b2;
    if ((_b2 = (_a3 = fetcher.data) == null ? void 0 : _a3.product) == null ? void 0 : _b2.id) {
      shopify2.toast.show("Product created");
    }
  }, [(_b = (_a2 = fetcher.data) == null ? void 0 : _a2.product) == null ? void 0 : _b.id, shopify2]);
  const generateProduct = () => fetcher.submit({}, {
    method: "POST"
  });
  return /* @__PURE__ */ jsxs("s-page", {
    heading: "Shopify app template",
    children: [/* @__PURE__ */ jsx("s-button", {
      slot: "primary-action",
      onClick: generateProduct,
      children: "Generate a product"
    }), /* @__PURE__ */ jsx("s-section", {
      heading: "Congrats on creating a new Shopify app 🎉",
      children: /* @__PURE__ */ jsxs("s-paragraph", {
        children: ["This embedded app template uses", " ", /* @__PURE__ */ jsx("s-link", {
          href: "https://shopify.dev/docs/apps/tools/app-bridge",
          target: "_blank",
          children: "App Bridge"
        }), " ", "interface examples like an", " ", /* @__PURE__ */ jsx("s-link", {
          href: "/app/additional",
          children: "additional page in the app nav"
        }), ", as well as an", " ", /* @__PURE__ */ jsx("s-link", {
          href: "https://shopify.dev/docs/api/admin-graphql",
          target: "_blank",
          children: "Admin GraphQL"
        }), " ", "mutation demo, to provide a starting point for app development."]
      })
    }), /* @__PURE__ */ jsxs("s-section", {
      heading: "Get started with products",
      children: [/* @__PURE__ */ jsxs("s-paragraph", {
        children: ["Generate a product with GraphQL and get the JSON output for that product. Learn more about the", " ", /* @__PURE__ */ jsx("s-link", {
          href: "https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate",
          target: "_blank",
          children: "productCreate"
        }), " ", "mutation in our API references."]
      }), /* @__PURE__ */ jsxs("s-stack", {
        direction: "inline",
        gap: "base",
        children: [/* @__PURE__ */ jsx("s-button", {
          onClick: generateProduct,
          ...isLoading ? {
            loading: true
          } : {},
          children: "Generate a product"
        }), ((_c = fetcher.data) == null ? void 0 : _c.product) && /* @__PURE__ */ jsx("s-button", {
          onClick: () => {
            var _a3, _b2, _c2, _d2;
            (_d2 = (_c2 = shopify2.intents).invoke) == null ? void 0 : _d2.call(_c2, "edit:shopify/Product", {
              value: (_b2 = (_a3 = fetcher.data) == null ? void 0 : _a3.product) == null ? void 0 : _b2.id
            });
          },
          target: "_blank",
          variant: "tertiary",
          children: "Edit product"
        })]
      }), ((_d = fetcher.data) == null ? void 0 : _d.product) && /* @__PURE__ */ jsx("s-section", {
        heading: "productCreate mutation",
        children: /* @__PURE__ */ jsxs("s-stack", {
          direction: "block",
          gap: "base",
          children: [/* @__PURE__ */ jsx("s-box", {
            padding: "base",
            borderWidth: "base",
            borderRadius: "base",
            background: "subdued",
            children: /* @__PURE__ */ jsx("pre", {
              style: {
                margin: 0
              },
              children: /* @__PURE__ */ jsx("code", {
                children: JSON.stringify(fetcher.data.product, null, 2)
              })
            })
          }), /* @__PURE__ */ jsx("s-heading", {
            children: "productVariantsBulkUpdate mutation"
          }), /* @__PURE__ */ jsx("s-box", {
            padding: "base",
            borderWidth: "base",
            borderRadius: "base",
            background: "subdued",
            children: /* @__PURE__ */ jsx("pre", {
              style: {
                margin: 0
              },
              children: /* @__PURE__ */ jsx("code", {
                children: JSON.stringify(fetcher.data.variant, null, 2)
              })
            })
          })]
        })
      })]
    }), /* @__PURE__ */ jsxs("s-section", {
      slot: "aside",
      heading: "App template specs",
      children: [/* @__PURE__ */ jsxs("s-paragraph", {
        children: [/* @__PURE__ */ jsx("s-text", {
          children: "Framework: "
        }), /* @__PURE__ */ jsx("s-link", {
          href: "https://reactrouter.com/",
          target: "_blank",
          children: "React Router"
        })]
      }), /* @__PURE__ */ jsxs("s-paragraph", {
        children: [/* @__PURE__ */ jsx("s-text", {
          children: "Interface: "
        }), /* @__PURE__ */ jsx("s-link", {
          href: "https://shopify.dev/docs/api/app-home/using-polaris-components",
          target: "_blank",
          children: "Polaris web components"
        })]
      }), /* @__PURE__ */ jsxs("s-paragraph", {
        children: [/* @__PURE__ */ jsx("s-text", {
          children: "API: "
        }), /* @__PURE__ */ jsx("s-link", {
          href: "https://shopify.dev/docs/api/admin-graphql",
          target: "_blank",
          children: "GraphQL"
        })]
      }), /* @__PURE__ */ jsxs("s-paragraph", {
        children: [/* @__PURE__ */ jsx("s-text", {
          children: "Database: "
        }), /* @__PURE__ */ jsx("s-link", {
          href: "https://www.prisma.io/",
          target: "_blank",
          children: "Prisma"
        })]
      })]
    }), /* @__PURE__ */ jsx("s-section", {
      slot: "aside",
      heading: "Next steps",
      children: /* @__PURE__ */ jsxs("s-unordered-list", {
        children: [/* @__PURE__ */ jsxs("s-list-item", {
          children: ["Build an", " ", /* @__PURE__ */ jsx("s-link", {
            href: "https://shopify.dev/docs/apps/getting-started/build-app-example",
            target: "_blank",
            children: "example app"
          })]
        }), /* @__PURE__ */ jsxs("s-list-item", {
          children: ["Explore Shopify's API with", " ", /* @__PURE__ */ jsx("s-link", {
            href: "https://shopify.dev/docs/apps/tools/graphiql-admin-api",
            target: "_blank",
            children: "GraphiQL"
          })]
        })]
      })
    })]
  });
});
const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: app__index,
  headers,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-B5gnf1YN.js", "imports": ["/assets/jsx-runtime-DCmaUFpU.js", "/assets/chunk-WWGJGFF6-Du9VGVJJ.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/root-Dh_CeMNu.js", "imports": ["/assets/jsx-runtime-DCmaUFpU.js", "/assets/chunk-WWGJGFF6-Du9VGVJJ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/webhooks.app.scopes_update": { "id": "routes/webhooks.app.scopes_update", "parentId": "root", "path": "webhooks/app/scopes_update", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/webhooks.app.scopes_update-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/webhooks.app.uninstalled": { "id": "routes/webhooks.app.uninstalled", "parentId": "root", "path": "webhooks/app/uninstalled", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/webhooks.app.uninstalled-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/checkout-script": { "id": "routes/checkout-script", "parentId": "root", "path": "checkout-script", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/checkout-script-CPD4ZdtB.js", "imports": ["/assets/chunk-WWGJGFF6-Du9VGVJJ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth.login": { "id": "routes/auth.login", "parentId": "root", "path": "auth/login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/route-B_tTyCSg.js", "imports": ["/assets/chunk-WWGJGFF6-Du9VGVJJ.js", "/assets/jsx-runtime-DCmaUFpU.js", "/assets/AppProxyProvider-Bp09svzj.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth.$": { "id": "routes/auth.$", "parentId": "root", "path": "auth/*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/auth._-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/route-EiUSvSdb.js", "imports": ["/assets/chunk-WWGJGFF6-Du9VGVJJ.js", "/assets/jsx-runtime-DCmaUFpU.js"], "css": ["/assets/route-CNPfFM0M.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app": { "id": "routes/app", "parentId": "root", "path": "app", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/app-Dtj5-51M.js", "imports": ["/assets/chunk-WWGJGFF6-Du9VGVJJ.js", "/assets/jsx-runtime-DCmaUFpU.js", "/assets/AppProxyProvider-Bp09svzj.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app.checkout-branding": { "id": "routes/app.checkout-branding", "parentId": "routes/app", "path": "checkout-branding", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/app.checkout-branding-DybFTXMp.js", "imports": ["/assets/chunk-WWGJGFF6-Du9VGVJJ.js", "/assets/jsx-runtime-DCmaUFpU.js", "/assets/useAppBridge-Bj34gXAL.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app.additional": { "id": "routes/app.additional", "parentId": "routes/app", "path": "additional", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/app.additional-CJLypTK7.js", "imports": ["/assets/chunk-WWGJGFF6-Du9VGVJJ.js", "/assets/jsx-runtime-DCmaUFpU.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app._index": { "id": "routes/app._index", "parentId": "routes/app", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/app._index-Zv4gq0hM.js", "imports": ["/assets/chunk-WWGJGFF6-Du9VGVJJ.js", "/assets/jsx-runtime-DCmaUFpU.js", "/assets/useAppBridge-Bj34gXAL.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-1d3a0868.js", "version": "1d3a0868", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/webhooks.app.scopes_update": {
    id: "routes/webhooks.app.scopes_update",
    parentId: "root",
    path: "webhooks/app/scopes_update",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/webhooks.app.uninstalled": {
    id: "routes/webhooks.app.uninstalled",
    parentId: "root",
    path: "webhooks/app/uninstalled",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/checkout-script": {
    id: "routes/checkout-script",
    parentId: "root",
    path: "checkout-script",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/auth.login": {
    id: "routes/auth.login",
    parentId: "root",
    path: "auth/login",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/auth.$": {
    id: "routes/auth.$",
    parentId: "root",
    path: "auth/*",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route6
  },
  "routes/app": {
    id: "routes/app",
    parentId: "root",
    path: "app",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/app.checkout-branding": {
    id: "routes/app.checkout-branding",
    parentId: "routes/app",
    path: "checkout-branding",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/app.additional": {
    id: "routes/app.additional",
    parentId: "routes/app",
    path: "additional",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/app._index": {
    id: "routes/app._index",
    parentId: "routes/app",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route10
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
