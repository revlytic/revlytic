import { BillingInterval, LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-07";
import dotenv from 'dotenv';

dotenv.config();
const DB_PATH = `${process.cwd()}/database.sqlite`;
// console.log("dasdassdasdas",process.env)
// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const billingConfig = {
  "My Shopify One-Time Charge": {
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    amount: 5.0,
    currencyCode: "USD",
    interval: BillingInterval.OneTime,
  },
};

const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    // billing: undefined, // or replace with billingConfig above to enable example billing
    // apiKey: process.env.SHOPIFY_API_KEY,
    // apiSecretKey: process.env.SHOPIFY_API_SECRET,
    // scopes: ["write_products","read_translations","read_themes","read_products","read_discounts","write_discounts","read_customers","write_customers","read_orders","write_orders","read_merchant_managed_fulfillment_orders","write_merchant_managed_fulfillment_orders","read_third_party_fulfillment_orders","write_third_party_fulfillment_orders","read_price_rules","unauthenticated_write_checkouts","read_own_subscription_contracts","write_own_subscription_contracts","read_customer_payment_methods"],
    // hostScheme: 'https',
    // hostName: `${process.env.DOMAIN}`,
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  // This should be replaced with your preferred storage strategy
  sessionStorage: new SQLiteSessionStorage(DB_PATH),
});

export default shopify;
