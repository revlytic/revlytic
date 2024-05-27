// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import GDPRWebhookHandlers from "./gdpr.js";
import DB from "./backend/connection.js";
import shopModal from "./backend/modals/credential.js";
import StoreSchemaModal from "./backend/modals/storeDetails.js";
import { verifyWebhooks } from "./backend/webhooks/verifyWebhooks.js";
import { DataType } from "@shopify/shopify-api";
import router from "./backend/routes.js";
import invoice_all_details from "./backend/modals/invoice.js";
import emailTemplatesModal from "./backend/modals/emailtemplates.js";
const __dirname = path.resolve();
import path from "path";
import storeModal from "./backend/modals/storeCredentials.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

DB();
dotenv.config();
console.log("HOST", process.env.HOST);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/web/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

app.post(
  shopify.config.webhooks.path,
  express.text({ type: "*/*" }),
  verifyWebhooks
);

// app.post("/api/storefront/getPlansForStoreFront", getPlansForStoreFront);
app.use(express.json());
app.use("/api/emailSendFromShopifyAppStoreContactPopUp", async (req, res) => {
  console.log("demo", req.body);
  let options = {
    to: "cd@yopmail.com",
    subject: "Revlytic Customer Enquiry",
    from: "sahilagnihotri7@gmail.com",
    html: `<div>Name :  <strong> ${req?.body?.name}</strong> <div>
  <div>Email :  <strong> ${req?.body?.email}</strong> <div>
  <div>Message :  <strong> ${req?.body?.message}</strong> <div>
  `,
  };

  let emailConfig = {
    host: "smtp.gmail.com",

    port: 587,

    auth: {
      user: "sahilagnihotri7@gmail.com",

      pass: "srdvsdnxfmvbrduw",
    },

    secure: false,
  };

  let transporter = nodemailer.createTransport(emailConfig);
  try {
    let data = await transporter.sendMail(options);
    if (data) {
      res.send({
        message: "success",
        data: "Mail sent successfully",
      });
    }
    console.log(data, "jhgfds");
  } catch (err) {
    console.log(err, "errorr aa gyaa");
    res.send({ message: "error", data: "Something went wrong" });
  }
});

app.use("/api/storefront", router);
app.use("/api/prodEx", router);
app.use("/api/customerPortal", router);
app.get("/api/customerPortalJs", (req, res) => {
  const customerPortalScriptPath = path.join(
    __dirname,
    "/frontend/assets/js/",
    "revlytic.customer.portal.js"
  );
  res.sendFile(customerPortalScriptPath);
});
app.get("/api/customerPortalCss", (req, res) => {
  const customerPortalScriptPath = path.join(
    __dirname,
    "/frontend/assets/style/",
    "revlytic.customer.portal.css"
  );
  res.sendFile(customerPortalScriptPath);
});

app.get("/api/privacy-policy", (req, res) => {
  const templatePath = path.join(
    __dirname,
    "/frontend/privacyPolicy/",
    "privacyPolicy.ejs"
  );

  res.render(`${templatePath}`);
});

app.get("/api/pricing-details", (req, res) => {
  const templatePath = path.join(
    __dirname,
    "/frontend/pricingDetails/",
    "pricingDetails.ejs"
  );
  res.render(`${templatePath}`);
});

app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  async (req, res, next) => {
    const session = res.locals.shopify.session;
    const { shop, accessToken } = session;

    await shopModal.findOne({ shop }).then((data) => {
      if (data) {
        console.log("17april2024", accessToken);
        shopModal.updateOne({ accessToken });
      } else {
        shopModal
          .create({
            shop,
            accessToken,
              })
          .then(() => {
            console.log("Shop info successfully saved");
          })
          .catch((err) => console.log(err));
      }
    });
    
    const storefront_access_token = new shopify.api.rest.StorefrontAccessToken({
      session: {
        shop,
        accessToken,
      },
    });
    storefront_access_token.title = "Test";
    await storefront_access_token.save({
      update: true,
    });

    await storeModal.findOne({ shop }).then((data) => {
      if (data) {
        storeModal.updateOne({
          accessToken: storefront_access_token.accessToken,
        });
        // return data;
      } else {
        storeModal
          .create({
            shop: shop,
            accessToken: storefront_access_token.access_token,
          })
          .then(() => {
            console.log("Store info successfully saved");
          })
          .catch((err) => console.log("erros", err));
      }
    });

    let settings = {
      subscriptionCanceled: {
        status: true,
        adminNotification: true,
        showCurrency: true,
        showShippingAddress: true,
        showBillingAddress: true,
        showPaymentMethod: true,
        showOrderNumber: true,
        showLineItems: true,
        showSubscriptionId: true,
        logoUrl:
          "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic.c679902f_1.svg?v=1701756753",
        logoHeight: "70",
        logoWidth: "170",
        logoAlignment: "center",
        headingText: "Subscription Canceled",
        headingTextColor: "#000000",
        textColor: "#767676",
        manageSubscriptionText: "Manage Subscription",
        manageSubscriptionTextColor: "#FFFFFF",
        manageSubscriptionButtonBackground: "#0F550C",
        subscriptionShippingAddressText: "Shipping Address",
        subscriptionBillingAddressText: "Billing Address",
        deliveryFrequencyText: "Delivery Frequency",
        nextBillingDateText: "Next Billing Date",
        planNameText: "Plan Name",
        billingFrequencyText: "Billing Frequency",
        orderNumberText: "Order Number",
        paymentMethodText: "Payment Method",
        endingWithText: "ending with",
        emailSetting: {
          subject: "Subscription Canceled",
          bcc: "",
          cc: "",
          replyTo: "",
        },
        contentText: `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
      <br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Your subscription has been canceled.</span><br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Kindly go to customer portal to confirm the cancellation.</span><br><br>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
       <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
        shippingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
        billingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
        footerText:
          "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;&nbsp;</p>\n",
        subscriptionUrl: "",
        subscriptionIdText: "Subscription ID",
      },
      subscriptionResumed: {
        status: true,
        adminNotification: true,
        showBillingAddress: true,
        showPaymentMethod: true,
        showOrderNumber: true,
        showLineItems: true,
        showSubscriptionId: true,
        logoUrl:
          "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic.c679902f_1.svg?v=1701756753",
        logoHeight: "50",
        logoWidth: "170",
        logoAlignment: "right",
        headingText: "Subscription Resumed",
        headingTextColor: "#1B1B1B",
        textColor: "#767676",
        manageSubscriptionText: "Manage Subscription",
        manageSubscriptionTextColor: "#FFFFFF",
        manageSubscriptionButtonBackground: "#0F550C",
        subscriptionShippingAddressText: "Shipping Address",
        subscriptionBillingAddressText: "Billing Address",
        deliveryFrequencyText: "Delivery Frequency",
        nextBillingDateText: "Next Billing Date",
        planNameText: "Plan Name",
        billingFrequencyText: "Billing Frequency",
        orderNumberText: "Order Number",
        paymentMethodText: "Payment Method",
        endingWithText: "ending with",
        emailSetting: {
          subject: "Subscription Resumed",
          bcc: "",
          cc: "",
          replyTo: "",
        },
        contentText:
          "<p>Hi  {{customer_name}},<br><br>Your subscription has been resumed.<br><br>Kindly go to customer portal to confirm it.<br><br>Thanks!<br>{{shop_name}}</p>\n",
        shippingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
        billingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
        footerText:
          "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;</p>\n",
        subscriptionUrl: "",
        showShippingAddress: true,
        subscriptionIdText: "Subscription ID",
      },
      subscriptionPaused: {
        status: true,
        adminNotification: true,
        showBillingAddress: true,
        showPaymentMethod: true,
        showOrderNumber: true,
        showLineItems: true,
        showSubscriptionId: true,
        logoUrl:
          "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic.c679902f_1.svg?v=1701756753",
        logoHeight: "50",
        logoWidth: "170",
        logoAlignment: "center",
        headingText: "Subscription has been Paused",
        headingTextColor: "#1B1B1B",
        textColor: "#767676",
        manageSubscriptionText: "Manage Subscription",
        manageSubscriptionTextColor: "#FFFFFF",
        manageSubscriptionButtonBackground: "#0F550C",
        subscriptionShippingAddressText: "Shipping Address",
        subscriptionBillingAddressText: "Billing Address",
        deliveryFrequencyText: "Delivery Frequency",
        nextBillingDateText: "Next Billing Date",
        planNameText: "Plan Name",
        billingFrequencyText: "Billing Frequency",
        orderNumberText: "Order Number",
        paymentMethodText: "Payment Method",
        endingWithText: "ending with",
        emailSetting: {
          subject: "Subscription Paused",
          bcc: "",
          cc: "",
          replyTo: "",
        },
        contentText: `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
      <br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Your subscription has been paused.</span><br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Kindly go to customer portal to confirm the pausation.</span><br><br>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
       <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
        shippingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
        billingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
        footerText:
          "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;</p>\n",
        subscriptionUrl: "",
        showShippingAddress: true,
        showCurrency: true,
        subscriptionIdText: "Subscription ID",
      },
      "subscriptionProduct(s)Updated": {
        status: true,
        adminNotification: true,
        showBillingAddress: true,
        showPaymentMethod: true,
        showOrderNumber: true,
        showLineItems: true,
        showSubscriptionId: true,
        logoUrl:
          "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic.c679902f_1.svg?v=1701756753",
        logoHeight: "50",
        logoWidth: "170",
        logoAlignment: "center",
        headingText: "Subscription Product(s) Updated",
        headingTextColor: "#1B1B1B",
        textColor: "#767676",
        manageSubscriptionText: "Manage Subscription",
        manageSubscriptionTextColor: "#FFFFFF",
        manageSubscriptionButtonBackground: "#0F550C",
        subscriptionShippingAddressText: "Shipping Address",
        subscriptionBillingAddressText: "Billing Address",
        deliveryFrequencyText: "Delivery Frequency",
        nextBillingDateText: "Next Billing Date",
        planNameText: "Plan Name",
        billingFrequencyText: "Billing Frequency",
        orderNumberText: "Order Number",
        paymentMethodText: "Payment Method",
        endingWithText: "ending with",
        emailSetting: {
          subject: "Subscription Product(s) Updated",
          bcc: "",
          replyTo: "",
          cc: "",
        },
        contentText: `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
      <br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Subscribed product(s) has/have  been updated.</span><br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Kindly go to customer portal to confirm it.</span><br><br>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
       <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
        shippingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
        billingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
        footerText:
          "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;&nbsp;</p>\n",
        subscriptionUrl: "",
        showShippingAddress: true,
        showCurrency: true,
        subscriptionIdText: "Subscription ID",
      },
      shippingAddressUpdated: {
        status: true,
        adminNotification: true,
        showBillingAddress: true,
        showPaymentMethod: true,
        showOrderNumber: true,
        showLineItems: true,
        showSubscriptionId: true,
        logoUrl:
          "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic.c679902f_1.svg?v=1701756753",
        logoHeight: "50",
        logoWidth: "170",
        logoAlignment: "center",
        headingText: "Shipping Address  Updated",
        headingTextColor: "#1B1B1B",
        textColor: "#767676",
        manageSubscriptionText: "Manage Subscription",
        manageSubscriptionTextColor: "#FFFFFF",
        manageSubscriptionButtonBackground: "#0F550C",
        subscriptionShippingAddressText: "Shipping Address",
        subscriptionBillingAddressText: "Billing Address",
        deliveryFrequencyText: "Delivery Frequency",
        nextBillingDateText: "Next Billing Date",
        planNameText: "Plan Name",
        billingFrequencyText: "Billing Frequency",
        orderNumberText: "Order Number",
        paymentMethodText: "Payment Method",
        endingWithText: "ending with",
        emailSetting: {
          subject: "Shipping Address Updated",
          bcc: "",
          replyTo: "",
          cc: "",
        },
        contentText: `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
      <br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Your shipping address for the subscription has been updated.</span><br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Kindly go to customer portal to confirm the update.</span><br><br>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
       <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
        shippingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
        billingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
        footerText:
          "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;&nbsp;</p>\n",
        subscriptionUrl: "",
        showShippingAddress: true,
        subscriptionIdText: "Subscription ID",
      },
      paymentFailure: {
        status: true,
        adminNotification: true,
        showBillingAddress: true,
        showPaymentMethod: true,
        showOrderNumber: true,
        showLineItems: true,
        showSubscriptionId: true,
        logoUrl:
          "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic.c679902f_1.svg?v=1701756753",
        logoHeight: "50",
        logoWidth: "170",
        logoAlignment: "center",
        headingText: "Payment Failure",
        headingTextColor: "#1B1B1B",
        textColor: "#767676",
        manageSubscriptionText: "Manage Subscription",
        manageSubscriptionTextColor: "#FFFFFF",
        manageSubscriptionButtonBackground: "#0F550C",
        subscriptionShippingAddressText: "Shipping Address",
        subscriptionBillingAddressText: "Billing Address",
        deliveryFrequencyText: "Delivery Frequency",
        nextBillingDateText: "Next Billing Date",
        planNameText: "Plan Name",
        billingFrequencyText: "Billing Frequency",
        orderNumberText: "Order Number",
        paymentMethodText: "Payment Method",
        endingWithText: "ending with",
        emailSetting: {
          subject: "Payment Failure",
          bcc: "",
          replyTo: "",
          cc: "",
        },
        contentText: `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
      <br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">We are writing to let you know that the auto renew on your subscribed product with our store did not go through. Please visit the manage subscription section (link below), to update your payment details.</span><br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Sometimes issuing banks decline the charge if the name or account details entered do not match the bank’s records.</span><br><br>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
       <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
        shippingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
        billingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
        footerText:
          "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;&nbsp;</p>\n",
        subscriptionUrl: "",
        showShippingAddress: true,
        subscriptionIdText: "Subscription ID",
      },
      subscriptionPurchased: {
        status: true,
        adminNotification: true,
        showBillingAddress: true,
        showPaymentMethod: true,
        showOrderNumber: true,
        showLineItems: true,
        logoUrl:
          "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic.c679902f_1.svg?v=1701756753",
        logoHeight: "50",
        logoWidth: "170",
        logoAlignment: "center",
        headingText: "Subscription Purchased",
        headingTextColor: "#1B1B1B",
        textColor: "#767676",
        manageSubscriptionText: "Manage Subscription",
        manageSubscriptionTextColor: "#FFFFFF",
        manageSubscriptionButtonBackground: "#0F550C",
        subscriptionShippingAddressText: "Shipping Address",
        subscriptionBillingAddressText: "Billing Address",
        deliveryFrequencyText: "Delivery Frequency",
        nextBillingDateText: "Next Billing Date",
        planNameText: "Plan Name",
        billingFrequencyText: "Billing Frequency",
        orderNumberText: "Order Number",
        paymentMethodText: "Payment Method",
        endingWithText: "ending with",
        emailSetting: {
          subject: "Subscription Purchased",
          bcc: "",
          replyTo: "",
          cc: "",
        },
        contentText: `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
      <br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thank you for setting up a new auto delivery by subscribing to our product!</span><br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Please see below, the details of your subscription.</span><br><br>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
       <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
        shippingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
        billingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
        footerText:
          "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;</p>\n",
        subscriptionUrl: "",
        showShippingAddress: true,
        showCurrency: true,
        subscriptionIdText: "Subscription ID",
      },
      subscriptionInvoice: {
        status: true,
        adminNotification: true,
        showBillingAddress: false,
        showPaymentMethod: false,
        showOrderNumber: true,
        showLineItems: false,
        logoUrl:
          "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic.c679902f_1.svg?v=1701756753",
        logoHeight: "50",
        logoWidth: "170",
        logoAlignment: "center",
        headingText: "Subscription Invoice",
        headingTextColor: "#1B1B1B",
        textColor: "#767676",
        manageSubscriptionText: "Manage Subscription",
        manageSubscriptionTextColor: "#FFFFFF",
        manageSubscriptionButtonBackground: "#0F550C",
        subscriptionShippingAddressText: "Shipping Address",
        subscriptionBillingAddressText: "Billing Address",
        deliveryFrequencyText: "Delivery Frequency",
        nextBillingDateText: "Next Billing Date",
        planNameText: "Plan Name",
        billingFrequencyText: "Billing Frequency",
        orderNumberText: "Order Number",
        paymentMethodText: "Payment Method",
        endingWithText: "ending with",
        emailSetting: {
          subject: "Subscription Purchased",
          bcc: "",
          replyTo: "",
          cc: "",
        },
        contentText:
          "<p><span style=\"font-size: 14px;font-family: 'Mulish', sans-serif;\">Hi {{customer_name}},</span>\n      <br/><br/>\n      <span style=\"font-size: 14px;font-family: 'Mulish', sans-serif;\">Thank you for setting up a new auto delivery by subscribing to our product!</span><br/><br/>\n      <span style=\"font-size: 14px;font-family: 'Mulish', sans-serif;\">Please see below, the details of your subscription.</span><br><br>\n      <span style=\"font-size: 14px;font-family: 'Mulish', sans-serif;\">Thanks!</span><br>\n       <span style=\"font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shop_name}}</span></p>",
        shippingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
        billingAddress:
          "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
        footerText:
          "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;</p>\n",
        subscriptionUrl: "",
        showShippingAddress: false,
        showCurrency: true,
        subscriptionIdText: "Subscription ID",
      },
    };
    await emailTemplatesModal
      .findOneAndUpdate({ shop }, { settings }, { upsert: true, new: true })
      .then((data) => {
        if (data) {
          // console.log("emailsettings", data);
          // return data;
        } else {
          console.log("inemailtemplateelse");
        }
      })
      .catch((err) => console.log("err"));

    await invoice_all_details.findOne({ shop }).then((data) => {
      if (data) {
        // return data;
      } else {
        invoice_all_details
          .create({
            shop: shop,
            components: [
              { label: "Logo", status: true },
              { label: "Bill To", status: true },
              { label: "Invoice Heading", status: true },
              { label: "Invoice Number", status: true },
              { label: "Invoice Number Prefix", status: true },
              { label: "Invoice Billing Date", status: true },
              { label: "Serial Number", status: true },
              { label: "Item Description", status: true },
              { label: "Price", status: true },
              { label: "QTY", status: true },
              { label: "Total", status: true },
              { label: "Sub total", status: true },
              { label: "Tax", status: true },
              { label: "Shipping", status: true },
              { label: "Discount", status: true },
              { label: "Terms", status: false },
              { label: "Notes", status: false },
              { label: "Signature", status: true },
              { label: "Automatically send when order created", status: true },
            ],
            invoice_details: {
              Logo: "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic.c679902f_1.svg?v=1701756753",
              Bill_To: "Bill To",
              Invoice_Heading: "Invoice Heading",
              Invoice_Number: "Invoice Number",
              Invoice_Number_Prefix: "Invoice Number Prefix",
              Invoice_Billing_Date: "Invoice Billing Date",
              Serial_Number: "Line Number",
              Item_Description: "Item Description",
              Price: "Price",
              QTY: "Quantity",
              Total: "Total",
              Terms: "Terms",
              Notes: "Notes",
              Subtotal: "Sub total",
              Tax: "Tax",
              Shipping: "Shipping",
              Discount: "Discount",
              Signature:
                "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic.c679902f_1.svg?v=1701756753",
            },
          })
          .then(() => {
            console.log("invoice settings saved");
          })
          .catch((err) => console.log(err));
      }
    });

    const fetchInfo = await shopify.api.rest.Shop.all({
      session: res.locals.shopify.session,
    });
    console.log(fetchInfo, "fetch");
    const getSymbol = (currency) => {
      const symbol = new Intl.NumberFormat("en", {
        style: "currency",
        currency,
      })
        .formatToParts()
        .find((x) => x.type === "currency");
      return symbol && symbol.value;
    };
    let curSymbol = getSymbol(fetchInfo.data[0].currency);
    await StoreSchemaModal.findOneAndUpdate(
      { shop },
      {
        shop,
        store_owner: fetchInfo.data[0].shop_owner,
        store_name: fetchInfo.data[0].name,
        store_email: fetchInfo.data[0].email,
        currency: fetchInfo.data[0].currency,
        currency_code: curSymbol,
        timezone: fetchInfo.data[0].iana_timezone,
      },
      { upsert: true, new: true }
    )
      .then((data) => {
        console.log("dataas", data);
      })
      .catch((error) => console.log("error", error));

    await StoreSchemaModal.findOne({ shop })
      .then(async (data) => {
        if (data) {
          if (!data.themeType) {
            let getThemeId;
            var themeType;
            var meta_field_value;
            let meta_field_value_not;
            let theme_block_support;
            let theme_block_support_not;
            const client = new shopify.api.clients.Rest({ session });
            try {
              const theme = await client.get({ path: "themes", type: "json" });
              const themeId = theme.body.themes.find(
                (el) => el.role === "main"
              );
              getThemeId = themeId?.id;
              const getAssetsData = await client.get({
                path: `themes/${themeId.id}/assets`,
                type: DataType.JSON,
              });
              const findJsonTemplate = getAssetsData.body.assets.find(
                (asset) => {
                  return asset.key === "templates/product.json";
                }
              );
              themeType = findJsonTemplate === undefined ? "vintage" : "modern";
              if (themeType === "modern") {
                theme_block_support = "support_theme_block";
                theme_block_support_not = "support_theme_block_not";
                meta_field_value_not = "false";
                meta_field_value = "true";
              } else {
                theme_block_support = "support_theme_block";
                meta_field_value = "false";
                theme_block_support_not = "support_theme_block_not";
                meta_field_value_not = "true";
              }
            } catch (error) {
              theme_block_support = "support_theme_block";
              meta_field_value = "false";
              theme_block_support_not = "support_theme_block_not";
              meta_field_value_not = "true";
            }
            const app_query = `{
                                  appInstallation {
                                  id
                                }
                                }`;

            const Client = new shopify.api.clients.Graphql({ session });
            try {
              const response = await Client.query({
                data: { query: app_query },
              });
              if (response.body.data.appInstallation.id) {
                let app_installation_id = response.body.data.appInstallation.id;

                console.log("app_installation_id", app_installation_id);
                let createAppDataMetafieldMutation = `mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafieldsSetInput) {
    metafields {
      id
      namespace
      key
      type
      value
    }
    userErrors {
      field
      message
   }
  }
}`;
                const Input = {
                  metafieldsSetInput: [
                    {
                      namespace: "theme_support",
                      key: theme_block_support,
                      type: "boolean",
                      value: meta_field_value,
                      ownerId: app_installation_id,
                    },
                    {
                      namespace: "theme_not_support",
                      key: theme_block_support_not,
                      type: "boolean",
                      value: meta_field_value_not,
                      ownerId: app_installation_id,
                    },
                  ],
                };
                try {
                  const result = await Client.query({
                    data: {
                      query: createAppDataMetafieldMutation,
                      variables: Input,
                    },
                  });
                } catch (error) {
                  console.log("errror1233");
                }
              }
            } catch (error) {
              console.log("error4565");
            }
            StoreSchemaModal.updateOne(
              { shop },
              { $set: { themeType: themeType, themeId: getThemeId } }
            )
              .then((data) => console.log("theme stored in db"))
              .catch((error) => console.log("error1290"));
          }
        } else {
          console.log("inelse27oct");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
    next();
  },
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use("/api/admin/", router);

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
