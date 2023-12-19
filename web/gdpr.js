import { DeliveryMethod } from "@shopify/shopify-api";

export default {

  PRODUCTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
  },

  PRODUCTS_DELETE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
  },

  SHOP_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
  },

  THEMES_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
  },

  CUSTOMERS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
  },

  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
  },
  
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
  },

  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
  },

  ORDERS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
  },

  CUSTOMER_PAYMENT_METHODS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
  },
  SUBSCRIPTION_BILLING_ATTEMPTS_SUCCESS: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
  },
  SUBSCRIPTION_BILLING_ATTEMPTS_CHALLENGED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
  },
  SUBSCRIPTION_BILLING_ATTEMPTS_FAILURE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
  },
  SUBSCRIPTION_CONTRACTS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
  },

};
