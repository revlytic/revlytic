// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import path from 'path';

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import DB from "./backend/connection.js";
import shopModal from "./backend/modals/credential.js";
import StoreSchemaModal from "./backend/modals/storeDetails.js";
import { verifyWebhooks } from "./backend/webhooks/verifyWebhooks.js";
import { DataType } from "@shopify/shopify-api";
import router from "./backend/routes.js";
import invoice_all_details from "./backend/modals/invoice.js";
import cors from "cors"
const __dirname = path.resolve();
import storeModal from "./backend/modals/storeCredentials.js";
import subscriptionDetailsModal from "./backend/modals/subscriptionDetails.js";
import emailTemplatesModal from "./backend/modals/emailtemplates.js";
import billing_Attempt from "./backend/modals/billingAttempt.js";
import { sendInvoiceMailAndSaveContract } from "./backend/controller.js";


const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);


DB();
// dotenv.config();
console.log('HOST', process.env.HOST)

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/web/frontend/dist`
    : `${process.cwd()}/web/frontend/`;
    
    const app = express();
    app.use(cors());
app.post(
  shopify.config.webhooks.path,
  express.text({ type: "*/*" }),
  verifyWebhooks
);

// app.post("/api/storefront/getPlansForStoreFront", getPlansForStoreFront);
app.use(express.json());
app.use("/api/storefront/", router);
app.use("/api/prodEx", router)
app.use("/api/customerPortal", router)
app.get("/api/customerPortalJs", (req, res) => {
  console.log("enterrrrrrrrrrrrrrrrrrjsssr");

  const customerPortalScriptPath = path.join(__dirname, '/web/frontend/assets/js/', "revlytic.customer.portal.js");
  res.sendFile(customerPortalScriptPath)
})
app.get("/api/customerPortalCss", (req, res) => {
  console.log("enterrrrrrrrrrrrrrrrrrr");
  const customerPortalScriptPath = path.join(__dirname, '/web/frontend/assets/style/', "revlytic.customer.portal.css");
  res.sendFile(customerPortalScriptPath)
})

app.get("/privacy-policy", (req, res) => {
  console.log("enterin privacypolicy");
  const templatePath = path.join(__dirname, 'web/frontend/privacyPolicy/', "privacyPolicy.ejs");


res.render(`${templatePath}`)
})


app.get("/images/logo/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, '/web/frontend/images/logo', imageName);

  console.log(imageName, "image name", imagePath)
  
  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send('Image not found');
    }
  });

  // res.send("Hi virender")
})
app.get("/images/signature/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, '/web/frontend/images/signature', imageName);

  console.log(imageName, "image name", imagePath)
  
  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send('Image not found');
    }
  });

  // res.send("Hi virender")
})


app.get("/images/announcement/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, '/web/frontend/images/announcement', imageName);

  console.log(imageName, "image name", imagePath)
  
  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send('Image not found');
    }
  });

  // res.send("Hi virender")
})


// app.get("/api/cron/subscription", async (req, res) => {
//   const currentDate = new Date().toISOString();
// const targetDate = new Date(currentDate);
//   let data = await subscriptionDetailsModal.find(
//     {
//       $expr: {
//         $eq: [
//           { $dateToString: { format: "%Y-%m-%d", date: "$nextBillingDate" } },
//           { $dateToString: { format: "%Y-%m-%d", date: targetDate } },
//         ],
//       },
//     },
//     { shop: 1, subscription_id: 1, product_details: 1, subscription_details: 1 }
//   );
//   console.log(data, "Function executed at the scheduled time.");

//   let mutation = `mutation subscriptionBillingAttemptCreate($subscriptionBillingAttemptInput: SubscriptionBillingAttemptInput!, $subscriptionContractId: ID!) {
//     subscriptionBillingAttemptCreate(subscriptionBillingAttemptInput: $subscriptionBillingAttemptInput, subscriptionContractId: $subscriptionContractId) {
//       subscriptionBillingAttempt {
//         id
//               subscriptionContract
//               {
//                   nextBillingDate
//                   billingPolicy{
//                       interval
//                       intervalCount
//                       maxCycles
//                       minCycles
//                       anchors{
//                           day
//                           type
//                           month
//                       }
//                   }
//                   deliveryPolicy{
//                       interval
//                       intervalCount
//                       anchors{
//                           day
//                           type
//                           month
//                       }
//                   }
//               }
//       }
//       userErrors {
//         field
//         message
//       }
//     }
//   }
//   `;

//   if (data.length > 0) {
//     for (let i = 0; i < data.length; i++) {
//       const uniqueId =
//         Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
//       let Input = {
//         subscriptionBillingAttemptInput: {
//           idempotencyKey: uniqueId,
//           originTime: currentDate,
//         },
//         subscriptionContractId: data[i].subscription_id,
//       };

//       let gettoken = await shopModal.findOne({ shop: data[i].shop });
//       console.log(gettoken, "cvcvcvcvcv");
//       const client = new shopify.api.clients.Graphql({
//         session: {
//           shop: data[i].shop,
//           accessToken: gettoken.accessToken,
//         },
//       });

//       let billingAttempt = await client.query({
//         data: { query: mutation, variables: Input },
//       });

//       console.log(
//         billingAttempt.body.data.subscriptionBillingAttemptCreate,
//         "cechk ittt"
//       );
//       if (
//         billingAttempt.body.data.subscriptionBillingAttemptCreate.userErrors
//           .length < 1
//       ) {
//         const currentDate = new Date().toISOString();

//         let saveToBillingAttempt = await billing_Attempt.create({
//           shop: data[i].shop,
//           status: "pending",
//           billing_attempt_date: currentDate,
//           renewal_date: currentDate,
//           contract_products: data[i].product_details,
//           contract_id: data[i].subscription_id,
//           billing_attempt_id:
//             billingAttempt.body.data.subscriptionBillingAttemptCreate
//               .subscriptionBillingAttempt.id,
//         });
//         const originalDate = new Date(currentDate); // Assuming currentDate is already in ISO string format
//         let nextDate;

//         if (
//           data[i].subscription_details.delivery_billingType.toLowerCase() ===
//           "day"
//         ) {
//           nextDate = new Date(originalDate);
//           nextDate.setDate(nextDate.getDate() + 1);
//         } else if (
//           data[i].subscription_details.delivery_billingType.toLowerCase() ===
//           "month"
//         ) {
//           nextDate = new Date(originalDate);
//           nextDate.setMonth(nextDate.getMonth() + 1);
//         } else if (
//           data[i].subscription_details.delivery_billingType.toLowerCase() ===
//           "week"
//         ) {
//           nextDate = new Date(originalDate);
//           nextDate.setDate(nextDate.getDate() + 7);
//         } else if (
//           data[i].subscription_details.delivery_billingType.toLowerCase() ===
//           "year"
//         ) {
//           nextDate = new Date(originalDate);
//           nextDate.setFullYear(nextDate.getFullYear() + 1);
//         }

//         console.log(nextDate, "kkkkkkkkkk");

//         let updateNextBillingDate =
//           await subscriptionDetailsModal.findOneAndUpdate(
//             { shop: data[i].shop, subscription_id: data[i].subscription_id },
//             {
//               $set: {
//                 nextBillingDate: nextDate.toISOString(),
//               },
//             }
//           );
//         console.log(updateNextBillingDate, "nextupadtae");
//         if ((updateNextBillingDate))
//         {
//           res.status(200)
//         }
//         else {
//           res.status(200)

//         }
//       }
//     }
//   }
//   else {
//     res.status(200)
//   }

// })

// app.get("/api/cron/invoices", sendInvoiceMailAndSaveContract)

  
app.use("/api/customerPortal", router)
app.get("/api/customerPortalJs", (req, res) => {
  console.log("enterrrrrrrrrrrrrrrrrrjsssr");

  const customerPortalScriptPath = path.join(__dirname, '/frontend/assets/js/', "revlytic.customer.portal.js");
  res.sendFile(customerPortalScriptPath)
})
app.get("/api/customerPortalCss", (req, res) => {
  console.log("enterrrrrrrrrrrrrrrrrrr");
  const customerPortalScriptPath = path.join(__dirname, '/frontend/assets/style/', "revlytic.customer.portal.css");
  res.sendFile(customerPortalScriptPath)
})

app.get("/api/privacy-policy", (req, res) => {
  console.log("enterin privacypolicy");
  const templatePath = path.join(__dirname, '/frontend/privacyPolicy/', "privacyPolicy.ejs");


res.render(`${templatePath}`)
})


// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  async (req, res, next) => {
    const session = res.locals.shopify.session;
    const shop = session.shop;
    const accessToken = session.accessToken;
    console.log("in index filee present");
    await shopModal.findOne({ shop }).then((data) => {
      if (data) {
        shopModal.updateOne({accessToken})
        // return data;
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
    //////////////////////////////
    const storefront_access_token =
    new shopify.api.rest.StorefrontAccessToken({
      session: {
        shop: session.shop,
        accessToken: session.accessToken,
      },
    })
    storefront_access_token.title = "Test";
    await storefront_access_token.save({
      update: true,
    });
    console.log(storefront_access_token,"lkjhgg");
  
// console.log("CHECK SCOPES ==>", process.env)

    await storeModal.findOne({ shop }).then((data) => {
      if (data) {
        storeModal.updateOne({accessToken: storefront_access_token.accessToken})
        // return data;
      } else {
        storeModal.create({
          shop:shop,
          accessToken:storefront_access_token.access_token
        })
          .then(() => {
            console.log("Store info successfully saved");
          })
          .catch((err) => console.log("erros",err));
      }
    });


  
    // await emailTemplatesModal.findOne({ shop }).then((data) => {
    //   if (data) {
    //     return data;
    //   } else {
    //     emailTemplatesModal
    //       .create({
    //         shop,
    //         "settings": {
    //           "subscriptionCanceled": {
    //             "status": true,
    //             "adminNotification": true,
    //             "showCurrency": true,
    //             "showShippingAddress": true,
    //             "showBillingAddress": true,
    //             "showPaymentMethod": true,
    //             "showOrderNumber": true,
    //             "showLineItems": true,
    //             "showSubscriptionId":true,
    //             "logoUrl": "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic-logo.png?v=1695819688",
    //             "logoHeight": "70",
    //             "logoWidth": "170",
    //             "logoAlignment": "center",
    //             "headingText": "Subscription Canceled",
    //             "headingTextColor": "#000000",
    //             "textColor": "#767676",
    //             "manageSubscriptionText": "Manage Subscription",
    //             "manageSubscriptionTextColor": "#FFFFFF",
    //             "manageSubscriptionButtonBackground": "#0F550C",
    //             "subscriptionShippingAddressText": "Shipping Address",
    //             "subscriptionBillingAddressText": "Billing Address",
    //             "deliveryFrequencyText": "Delivery Frequency",
    //             "nextBillingDateText": "Next Billing Date",
    //             "planNameText": "Plan Name",
    //             "billingFrequencyText": "Billing Frequency",
    //             "orderNumberText": "Order Number",
    //             "paymentMethodText": "Payment Method",
    //             "endingWithText": "ending with",
    //             "emailSetting": {
    //               "subject": "Subscription Canceled",
    //               "bcc": "",
    //               "cc": "",
    //               "replyTo": ""
    //             },
    //             "contentText":`<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
    //             <br/><br/>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Your subscription has been canceled.</span><br/><br/>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Kindly go to customer portal to confirm the cancellation.</span><br><br>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
    //              <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
    //             "shippingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
    //             "billingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
    //             "footerText": "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;&nbsp;</p>\n",
    //             "subscriptionUrl": "",
    //             "subscriptionIdText":"Subscription ID"
    //           },
    //           "subscriptionResumed": {
    //             "status": true,
    //             "adminNotification": true,
    //             "showBillingAddress": true,
    //             "showPaymentMethod": true,
    //             "showOrderNumber": true,
    //             "showLineItems": true,
    //             "showSubscriptionId":true,
    //             "logoUrl": "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic-logo.png?v=1695819688",
    //             "logoHeight": "50",
    //             "logoWidth": "170",
    //             "logoAlignment": "right",
    //             "headingText": "Subscription Resumed",
    //             "headingTextColor": "#1B1B1B",
    //             "textColor": "#767676",
    //             "manageSubscriptionText": "Manage Subscription",
    //             "manageSubscriptionTextColor": "#FFFFFF",
    //             "manageSubscriptionButtonBackground": "#0F550C",
    //             "subscriptionShippingAddressText": "Shipping Address",
    //             "subscriptionBillingAddressText": "Billing Address",
    //             "deliveryFrequencyText": "Delivery Frequency",
    //             "nextBillingDateText": "Next Billing Date",
    //             "planNameText": "Plan Name",
    //             "billingFrequencyText": "Billing Frequency",
    //             "orderNumberText": "Order Number",
    //             "paymentMethodText": "Payment Method",
    //             "endingWithText": "ending with",
    //             "emailSetting": {
    //               "subject": "Subscription Resumed",
    //               "bcc": "",
    //               "cc": "",
    //               "replyTo": ""
    //             },
    //             "contentText": "<p>Hi  {{customer_name}},<br><br>Your subscription has been resumed.<br><br>Kindly go to customer portal to confirm it.<br><br>Thanks!<br>{{shop_name}}</p>\n",
    //             "shippingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
    //             "billingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
    //             "footerText": "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;</p>\n",
    //             "subscriptionUrl": "",
    //             "showShippingAddress": true,
    //             "subscriptionIdText":"Subscription ID"
    //           },
    //           "subscriptionPaused": {
    //             "status": true,
    //             "adminNotification": true,
    //             "showBillingAddress": true,
    //             "showPaymentMethod": true,
    //             "showOrderNumber": true,
    //             "showLineItems": true,
    //             "showSubscriptionId":true,
    //             "logoUrl": "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic-logo.png?v=1695819688",
    //             "logoHeight": "50",
    //             "logoWidth": "170",
    //             "logoAlignment": "center",
    //             "headingText": "Subscription has been Paused",
    //             "headingTextColor": "#1B1B1B",
    //             "textColor": "#767676",
    //             "manageSubscriptionText": "Manage Subscription",
    //             "manageSubscriptionTextColor": "#FFFFFF",
    //             "manageSubscriptionButtonBackground": "#0F550C",
    //             "subscriptionShippingAddressText": "Shipping Address",
    //             "subscriptionBillingAddressText": "Billing Address",
    //             "deliveryFrequencyText": "Delivery Frequency",
    //             "nextBillingDateText": "Next Billing Date",
    //             "planNameText": "Plan Name",
    //             "billingFrequencyText": "Billing Frequency",
    //             "orderNumberText": "Order Number",
    //             "paymentMethodText": "Payment Method",
    //             "endingWithText": "ending with",
    //             "emailSetting": {
    //               "subject": "Subscription Paused",
    //               "bcc": "",
    //               "cc": "",
    //               "replyTo": ""
    //             },
    //             "contentText": `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
    //             <br/><br/>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Your subscription has been paused.</span><br/><br/>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Kindly go to customer portal to confirm the pausation.</span><br><br>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
    //              <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
    //             "shippingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
    //             "billingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
    //             "footerText": "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;</p>\n",
    //             "subscriptionUrl": "",
    //             "showShippingAddress": true,
    //             "showCurrency": true,
    //             "subscriptionIdText":"Subscription ID"
    //           },
    //           "subscriptionProduct(s)Updated": {
    //             "status": true,
    //             "adminNotification": true,
    //             "showBillingAddress": true,
    //             "showPaymentMethod": true,
    //             "showOrderNumber": true,
    //             "showLineItems": true,
    //             "showSubscriptionId":true,
    //             "logoUrl": "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic-logo.png?v=1695819688",
    //             "logoHeight": "50",
    //             "logoWidth": "170",
    //             "logoAlignment": "center",
    //             "headingText": "Subscription Product(s) Updated",
    //             "headingTextColor": "#1B1B1B",
    //             "textColor": "#767676",
    //             "manageSubscriptionText": "Manage Subscription",
    //             "manageSubscriptionTextColor": "#FFFFFF",
    //             "manageSubscriptionButtonBackground": "#0F550C",
    //             "subscriptionShippingAddressText": "Shipping Address",
    //             "subscriptionBillingAddressText": "Billing Address",
    //             "deliveryFrequencyText": "Delivery Frequency",
    //             "nextBillingDateText": "Next Billing Date",
    //             "planNameText": "Plan Name",
    //             "billingFrequencyText": "Billing Frequency",
    //             "orderNumberText": "Order Number",
    //             "paymentMethodText": "Payment Method",
    //             "endingWithText": "ending with",
    //             "emailSetting": {
    //               "subject": "Subscription Product(s) Updated",
    //               "bcc": "",
    //               "replyTo": "",
    //               "cc": ""
    //             },
    //             "contentText": `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
    //             <br/><br/>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Subscribed product(s) has/have  been updated.</span><br/><br/>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Kindly go to customer portal to confirm it.</span><br><br>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
    //              <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
    //             "shippingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
    //             "billingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
    //             "footerText": "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;&nbsp;</p>\n",
    //             "subscriptionUrl": "",
    //             "showShippingAddress": true,
    //             "showCurrency": true,
    //             "subscriptionIdText":"Subscription ID"
    //           },
    //           "shippingAddressUpdated": {
    //             "status": true,
    //             "adminNotification": true,
    //             "showBillingAddress": true,
    //             "showPaymentMethod": true,
    //             "showOrderNumber": true,
    //             "showLineItems": true,
    //             "showSubscriptionId":true,
    //             "logoUrl": "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic-logo.png?v=1695819688",
    //             "logoHeight": "50",
    //             "logoWidth": "170",
    //             "logoAlignment": "center",
    //             "headingText": "Shipping Address  Updated",
    //             "headingTextColor": "#1B1B1B",
    //             "textColor": "#767676",
    //             "manageSubscriptionText": "Manage Subscription",
    //             "manageSubscriptionTextColor": "#FFFFFF",
    //             "manageSubscriptionButtonBackground": "#0F550C",
    //             "subscriptionShippingAddressText": "Shipping Address",
    //             "subscriptionBillingAddressText": "Billing Address",
    //             "deliveryFrequencyText": "Delivery Frequency",
    //             "nextBillingDateText": "Next Billing Date",
    //             "planNameText": "Plan Name",
    //             "billingFrequencyText": "Billing Frequency",
    //             "orderNumberText": "Order Number",
    //             "paymentMethodText": "Payment Method",
    //             "endingWithText": "ending with",
    //             "emailSetting": {
    //               "subject": "Shipping Address Updated",
    //               "bcc": "",
    //               "replyTo": "",
    //               "cc": ""
    //             },
    //             "contentText": `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
    //             <br/><br/>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Your shipping address for the subscription has been updated.</span><br/><br/>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Kindly go to customer portal to confirm the update.</span><br><br>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
    //              <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
    //             "shippingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
    //             "billingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
    //             "footerText": "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;&nbsp;</p>\n",
    //             "subscriptionUrl": "",
    //             "showShippingAddress": true,
    //             "subscriptionIdText":"Subscription ID"
    //           },
    //           "paymentFailure": {
    //             "status": true,
    //             "adminNotification": true,
    //             "showBillingAddress": true,
    //             "showPaymentMethod": true,
    //             "showOrderNumber": true,
    //             "showLineItems": true,
    //             "showSubscriptionId":true,
    //             "logoUrl": "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic-logo.png?v=1695819688",
    //             "logoHeight": "50",
    //             "logoWidth": "170",
    //             "logoAlignment": "center",
    //             "headingText": "Payment Failure",
    //             "headingTextColor": "#1B1B1B",
    //             "textColor": "#767676",
    //             "manageSubscriptionText": "Manage Subscription",
    //             "manageSubscriptionTextColor": "#FFFFFF",
    //             "manageSubscriptionButtonBackground": "#0F550C",
    //             "subscriptionShippingAddressText": "Shipping Address",
    //             "subscriptionBillingAddressText": "Billing Address",
    //             "deliveryFrequencyText": "Delivery Frequency",
    //             "nextBillingDateText": "Next Billing Date",
    //             "planNameText": "Plan Name",
    //             "billingFrequencyText": "Billing Frequency",
    //             "orderNumberText": "Order Number",
    //             "paymentMethodText": "Payment Method",
    //             "endingWithText": "ending with",
    //             "emailSetting": {
    //               "subject": "Payment Failure",
    //               "bcc": "",
    //               "replyTo": "",
    //               "cc": ""
    //             },
    //             "contentText": `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
    //             <br/><br/>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">We are writing to let you know that the auto renew on your subscribed product with our store did not go through. Please visit the manage subscription section (link below), to update your payment details.</span><br/><br/>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Sometimes issuing banks decline the charge if the name or account details entered do not match the bank’s records.</span><br><br>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
    //              <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
    //             "shippingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
    //             "billingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
    //             "footerText": "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;&nbsp;</p>\n",
    //             "subscriptionUrl": "",
    //             "showShippingAddress": true,
    //             "subscriptionIdText":"Subscription ID"
    //           },
    //           "subscriptionPurchased": {
    //             "status": true,
    //             "adminNotification": true,
    //             "showBillingAddress": true,
    //             "showPaymentMethod": true,
    //             "showOrderNumber": true,
    //             "showLineItems": true,
    //             "logoUrl": "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic-logo.png?v=1695819688",
    //             "logoHeight": "50",
    //             "logoWidth": "170",
    //             "logoAlignment": "center",
    //             "headingText": "Subscription Purchased",
    //             "headingTextColor": "#1B1B1B",
    //             "textColor": "#767676",
    //             "manageSubscriptionText": "Manage Subscription",
    //             "manageSubscriptionTextColor": "#FFFFFF",
    //             "manageSubscriptionButtonBackground": "#0F550C",
    //             "subscriptionShippingAddressText": "Shipping Address",
    //             "subscriptionBillingAddressText": "Billing Address",
    //             "deliveryFrequencyText": "Delivery Frequency",
    //             "nextBillingDateText": "Next Billing Date",
    //             "planNameText": "Plan Name",
    //             "billingFrequencyText": "Billing Frequency",
    //             "orderNumberText": "Order Number",
    //             "paymentMethodText": "Payment Method",
    //             "endingWithText": "ending with",
    //             "emailSetting": {
    //               "subject": "Subscription Purchased",
    //               "bcc": "",
    //               "replyTo": "",
    //               "cc": ""
    //             },
    //             "contentText": `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
    //             <br/><br/>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thank you for setting up a new auto delivery by subscribing to our product!</span><br/><br/>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Please see below, the details of your subscription.</span><br><br>
    //             <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
    //              <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
    //             "shippingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
    //             "billingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
    //             "footerText": "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;</p>\n",
    //             "subscriptionUrl": "",
    //             "showShippingAddress": true,
    //             "showCurrency": true,
    //             "subscriptionIdText":"Subscription ID"
    //           }
    //         },
    //       })
    //       .then(() => {
    //         console.log("emailsettings default saved");
    //       })
    //       .catch((err) => console.log("err",err));
    //   }
    // });
  let settings={
    "subscriptionCanceled": {
      "status": true,
      "adminNotification": true,
      "showCurrency": true,
      "showShippingAddress": true,
      "showBillingAddress": true,
      "showPaymentMethod": true,
      "showOrderNumber": true,
      "showLineItems": true,
      "showSubscriptionId":true,
      "logoUrl": "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic-logo.png?v=1695819688",
      "logoHeight": "70",
      "logoWidth": "170",
      "logoAlignment": "center",
      "headingText": "Subscription Canceled",
      "headingTextColor": "#000000",
      "textColor": "#767676",
      "manageSubscriptionText": "Manage Subscription",
      "manageSubscriptionTextColor": "#FFFFFF",
      "manageSubscriptionButtonBackground": "#0F550C",
      "subscriptionShippingAddressText": "Shipping Address",
      "subscriptionBillingAddressText": "Billing Address",
      "deliveryFrequencyText": "Delivery Frequency",
      "nextBillingDateText": "Next Billing Date",
      "planNameText": "Plan Name",
      "billingFrequencyText": "Billing Frequency",
      "orderNumberText": "Order Number",
      "paymentMethodText": "Payment Method",
      "endingWithText": "ending with",
      "emailSetting": {
        "subject": "Subscription Canceled",
        "bcc": "",
        "cc": "",
        "replyTo": ""
      },
      "contentText":`<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
      <br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Your subscription has been canceled.</span><br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Kindly go to customer portal to confirm the cancellation.</span><br><br>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
       <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
      "shippingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
      "billingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
      "footerText": "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;&nbsp;</p>\n",
      "subscriptionUrl": "",
      "subscriptionIdText":"Subscription ID"
    },
    "subscriptionResumed": {
      "status": true,
      "adminNotification": true,
      "showBillingAddress": true,
      "showPaymentMethod": true,
      "showOrderNumber": true,
      "showLineItems": true,
      "showSubscriptionId":true,
      "logoUrl": "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic-logo.png?v=1695819688",
      "logoHeight": "50",
      "logoWidth": "170",
      "logoAlignment": "right",
      "headingText": "Subscription Resumed",
      "headingTextColor": "#1B1B1B",
      "textColor": "#767676",
      "manageSubscriptionText": "Manage Subscription",
      "manageSubscriptionTextColor": "#FFFFFF",
      "manageSubscriptionButtonBackground": "#0F550C",
      "subscriptionShippingAddressText": "Shipping Address",
      "subscriptionBillingAddressText": "Billing Address",
      "deliveryFrequencyText": "Delivery Frequency",
      "nextBillingDateText": "Next Billing Date",
      "planNameText": "Plan Name",
      "billingFrequencyText": "Billing Frequency",
      "orderNumberText": "Order Number",
      "paymentMethodText": "Payment Method",
      "endingWithText": "ending with",
      "emailSetting": {
        "subject": "Subscription Resumed",
        "bcc": "",
        "cc": "",
        "replyTo": ""
      },
      "contentText": "<p>Hi  {{customer_name}},<br><br>Your subscription has been resumed.<br><br>Kindly go to customer portal to confirm it.<br><br>Thanks!<br>{{shop_name}}</p>\n",
      "shippingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
      "billingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
      "footerText": "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;</p>\n",
      "subscriptionUrl": "",
      "showShippingAddress": true,
      "subscriptionIdText":"Subscription ID"
    },
    "subscriptionPaused": {
      "status": true,
      "adminNotification": true,
      "showBillingAddress": true,
      "showPaymentMethod": true,
      "showOrderNumber": true,
      "showLineItems": true,
      "showSubscriptionId":true,
      "logoUrl": "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic-logo.png?v=1695819688",
      "logoHeight": "50",
      "logoWidth": "170",
      "logoAlignment": "center",
      "headingText": "Subscription has been Paused",
      "headingTextColor": "#1B1B1B",
      "textColor": "#767676",
      "manageSubscriptionText": "Manage Subscription",
      "manageSubscriptionTextColor": "#FFFFFF",
      "manageSubscriptionButtonBackground": "#0F550C",
      "subscriptionShippingAddressText": "Shipping Address",
      "subscriptionBillingAddressText": "Billing Address",
      "deliveryFrequencyText": "Delivery Frequency",
      "nextBillingDateText": "Next Billing Date",
      "planNameText": "Plan Name",
      "billingFrequencyText": "Billing Frequency",
      "orderNumberText": "Order Number",
      "paymentMethodText": "Payment Method",
      "endingWithText": "ending with",
      "emailSetting": {
        "subject": "Subscription Paused",
        "bcc": "",
        "cc": "",
        "replyTo": ""
      },
      "contentText": `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
      <br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Your subscription has been paused.</span><br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Kindly go to customer portal to confirm the pausation.</span><br><br>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
       <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
      "shippingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
      "billingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
      "footerText": "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;</p>\n",
      "subscriptionUrl": "",
      "showShippingAddress": true,
      "showCurrency": true,
      "subscriptionIdText":"Subscription ID"
    },
    "subscriptionProduct(s)Updated": {
      "status": true,
      "adminNotification": true,
      "showBillingAddress": true,
      "showPaymentMethod": true,
      "showOrderNumber": true,
      "showLineItems": true,
      "showSubscriptionId":true,
      "logoUrl": "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic-logo.png?v=1695819688",
      "logoHeight": "50",
      "logoWidth": "170",
      "logoAlignment": "center",
      "headingText": "Subscription Product(s) Updated",
      "headingTextColor": "#1B1B1B",
      "textColor": "#767676",
      "manageSubscriptionText": "Manage Subscription",
      "manageSubscriptionTextColor": "#FFFFFF",
      "manageSubscriptionButtonBackground": "#0F550C",
      "subscriptionShippingAddressText": "Shipping Address",
      "subscriptionBillingAddressText": "Billing Address",
      "deliveryFrequencyText": "Delivery Frequency",
      "nextBillingDateText": "Next Billing Date",
      "planNameText": "Plan Name",
      "billingFrequencyText": "Billing Frequency",
      "orderNumberText": "Order Number",
      "paymentMethodText": "Payment Method",
      "endingWithText": "ending with",
      "emailSetting": {
        "subject": "Subscription Product(s) Updated",
        "bcc": "",
        "replyTo": "",
        "cc": ""
      },
      "contentText": `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
      <br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Subscribed product(s) has/have  been updated.</span><br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Kindly go to customer portal to confirm it.</span><br><br>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
       <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
      "shippingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
      "billingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
      "footerText": "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;&nbsp;</p>\n",
      "subscriptionUrl": "",
      "showShippingAddress": true,
      "showCurrency": true,
      "subscriptionIdText":"Subscription ID"
    },
    "shippingAddressUpdated": {
      "status": true,
      "adminNotification": true,
      "showBillingAddress": true,
      "showPaymentMethod": true,
      "showOrderNumber": true,
      "showLineItems": true,
      "showSubscriptionId":true,
      "logoUrl": "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic-logo.png?v=1695819688",
      "logoHeight": "50",
      "logoWidth": "170",
      "logoAlignment": "center",
      "headingText": "Shipping Address  Updated",
      "headingTextColor": "#1B1B1B",
      "textColor": "#767676",
      "manageSubscriptionText": "Manage Subscription",
      "manageSubscriptionTextColor": "#FFFFFF",
      "manageSubscriptionButtonBackground": "#0F550C",
      "subscriptionShippingAddressText": "Shipping Address",
      "subscriptionBillingAddressText": "Billing Address",
      "deliveryFrequencyText": "Delivery Frequency",
      "nextBillingDateText": "Next Billing Date",
      "planNameText": "Plan Name",
      "billingFrequencyText": "Billing Frequency",
      "orderNumberText": "Order Number",
      "paymentMethodText": "Payment Method",
      "endingWithText": "ending with",
      "emailSetting": {
        "subject": "Shipping Address Updated",
        "bcc": "",
        "replyTo": "",
        "cc": ""
      },
      "contentText": `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
      <br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Your shipping address for the subscription has been updated.</span><br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Kindly go to customer portal to confirm the update.</span><br><br>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
       <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
      "shippingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
      "billingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
      "footerText": "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;&nbsp;</p>\n",
      "subscriptionUrl": "",
      "showShippingAddress": true,
      "subscriptionIdText":"Subscription ID"
    },
    "paymentFailure": {
      "status": true,
      "adminNotification": true,
      "showBillingAddress": true,
      "showPaymentMethod": true,
      "showOrderNumber": true,
      "showLineItems": true,
      "showSubscriptionId":true,
      "logoUrl": "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic-logo.png?v=1695819688",
      "logoHeight": "50",
      "logoWidth": "170",
      "logoAlignment": "center",
      "headingText": "Payment Failure",
      "headingTextColor": "#1B1B1B",
      "textColor": "#767676",
      "manageSubscriptionText": "Manage Subscription",
      "manageSubscriptionTextColor": "#FFFFFF",
      "manageSubscriptionButtonBackground": "#0F550C",
      "subscriptionShippingAddressText": "Shipping Address",
      "subscriptionBillingAddressText": "Billing Address",
      "deliveryFrequencyText": "Delivery Frequency",
      "nextBillingDateText": "Next Billing Date",
      "planNameText": "Plan Name",
      "billingFrequencyText": "Billing Frequency",
      "orderNumberText": "Order Number",
      "paymentMethodText": "Payment Method",
      "endingWithText": "ending with",
      "emailSetting": {
        "subject": "Payment Failure",
        "bcc": "",
        "replyTo": "",
        "cc": ""
      },
      "contentText": `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
      <br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">We are writing to let you know that the auto renew on your subscribed product with our store did not go through. Please visit the manage subscription section (link below), to update your payment details.</span><br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Sometimes issuing banks decline the charge if the name or account details entered do not match the bank’s records.</span><br><br>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
       <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
      "shippingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
      "billingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
      "footerText": "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;&nbsp;</p>\n",
      "subscriptionUrl": "",
      "showShippingAddress": true,
      "subscriptionIdText":"Subscription ID"
    },
    "subscriptionPurchased": {
      "status": true,
      "adminNotification": true,
      "showBillingAddress": true,
      "showPaymentMethod": true,
      "showOrderNumber": true,
      "showLineItems": true,
      "logoUrl": "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic-logo.png?v=1695819688",
      "logoHeight": "50",
      "logoWidth": "170",
      "logoAlignment": "center",
      "headingText": "Subscription Purchased",
      "headingTextColor": "#1B1B1B",
      "textColor": "#767676",
      "manageSubscriptionText": "Manage Subscription",
      "manageSubscriptionTextColor": "#FFFFFF",
      "manageSubscriptionButtonBackground": "#0F550C",
      "subscriptionShippingAddressText": "Shipping Address",
      "subscriptionBillingAddressText": "Billing Address",
      "deliveryFrequencyText": "Delivery Frequency",
      "nextBillingDateText": "Next Billing Date",
      "planNameText": "Plan Name",
      "billingFrequencyText": "Billing Frequency",
      "orderNumberText": "Order Number",
      "paymentMethodText": "Payment Method",
      "endingWithText": "ending with",
      "emailSetting": {
        "subject": "Subscription Purchased",
        "bcc": "",
        "replyTo": "",
        "cc": ""
      },
      "contentText": `<p><span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Hi {{customer_name}},</span>
      <br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thank you for setting up a new auto delivery by subscribing to our product!</span><br/><br/>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Please see below, the details of your subscription.</span><br><br>
      <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">Thanks!</span><br>
       <span style="font-size: 14px;font-family: 'Mulish', sans-serif;">{{shop_name}}</span></p>`,
      "shippingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
      "billingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
      "footerText": "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;</p>\n",
      "subscriptionUrl": "",
      "showShippingAddress": true,
      "showCurrency": true,
      "subscriptionIdText":"Subscription ID"
    },
    "subscriptionInvoice": {
      "status": true,
      "adminNotification": true,
      "showBillingAddress": false,
      "showPaymentMethod": false,
      "showOrderNumber": true,
      "showLineItems": false,
      "logoUrl": "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/revlytic-logo.png?v=1695819688",
      "logoHeight": "50",
      "logoWidth": "170",
      "logoAlignment": "center",
      "headingText": "Subscription Invoice",
      "headingTextColor": "#1B1B1B",
      "textColor": "#767676",
      "manageSubscriptionText": "Manage Subscription",
      "manageSubscriptionTextColor": "#FFFFFF",
      "manageSubscriptionButtonBackground": "#0F550C",
      "subscriptionShippingAddressText": "Shipping Address",
      "subscriptionBillingAddressText": "Billing Address",
      "deliveryFrequencyText": "Delivery Frequency",
      "nextBillingDateText": "Next Billing Date",
      "planNameText": "Plan Name",
      "billingFrequencyText": "Billing Frequency",
      "orderNumberText": "Order Number",
      "paymentMethodText": "Payment Method",
      "endingWithText": "ending with",
      "emailSetting": {
        "subject": "Subscription Purchased",
        "bcc": "",
        "replyTo": "",
        "cc": ""
      },
      "contentText": "<p><span style=\"font-size: 14px;font-family: 'Mulish', sans-serif;\">Hi {{customer_name}},</span>\n      <br/><br/>\n      <span style=\"font-size: 14px;font-family: 'Mulish', sans-serif;\">Thank you for setting up a new auto delivery by subscribing to our product!</span><br/><br/>\n      <span style=\"font-size: 14px;font-family: 'Mulish', sans-serif;\">Please see below, the details of your subscription.</span><br><br>\n      <span style=\"font-size: 14px;font-family: 'Mulish', sans-serif;\">Thanks!</span><br>\n       <span style=\"font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shop_name}}</span></p>",
      "shippingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{shipping_address_1}}, {{shipping_city}}, {{shipping_province}}, {{shipping_country}}</span></p>\n",
      "billingAddress": "<p><span style=\"color: rgba(0,0,0,0.88);font-size: 14px;font-family: 'Mulish', sans-serif;\">{{billing_address_1}}, {{billing_city}}, {{billing_province}}, {{billing_country}}</span>&nbsp;</p>\n",
      "footerText": "<p><span style=\"color: rgb(73,86,97);font-size: 14px;font-family: 'Mulish', sans-serif;\">If you have any questions or concerns, please reply to this email and we will get back to you as soon as we can.</span>&nbsp;</p>\n",
      "subscriptionUrl": "",
      "showShippingAddress": false,
      "showCurrency": true,
      "subscriptionIdText": "Subscription ID"
    }
  };
    await emailTemplatesModal.findOneAndUpdate({ shop },{settings},{upsert:true,new:true}).then((data) => {
      if (data) {
        console.log("emailsettings",data)
        return data;
      } else {
        console.log("inemailtemplateelse")
      }
    }).catch(err=>console.log("err"));
  
  ////////////////////
    await invoice_all_details.findOne({ shop }).then((data) => {
      if (data) {
        return data;
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
              Logo: "",
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
              Signature: "Signature",
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
    // StoreSchemaModal.findOne({ shop: shop }).then((data) => {
    //   if (data) {
    //     return data;
    //   } else {
    //     const storedetails = {
    //       shop: shop,
    //       store_owner: fetchInfo.data[0].shop_owner,
    //       store_name: fetchInfo.data[0].name,
    //       store_email: fetchInfo.data[0].email,
    //       currency: fetchInfo.data[0].currency,
    //       currency_code: curSymbol,
    //       timezone: fetchInfo.data[0].iana_timezone,
    //     };
    //     StoreSchemaModal.create(storedetails)
    //       .then((data) => {
    //         console.log("Merchant Info Successfully Saved!");
    //       })
    //       .catch((err) => console.log("Something went wrong!" + err));
    //   }
    // });


 await StoreSchemaModal.findOneAndUpdate({ shop }, { shop, store_owner: fetchInfo.data[0].shop_owner,
      store_name: fetchInfo.data[0].name,
      store_email: fetchInfo.data[0].email,
      currency: fetchInfo.data[0].currency,
      currency_code: curSymbol,
      timezone: fetchInfo.data[0].iana_timezone},{upsert:true,new:true}).then((data) => {
         console.log("dataas",data)
    }).catch(error=>console.log("error",error));
    //code


/////////////////////////////////

await   StoreSchemaModal.findOne({ shop }).then(async(data) => {

  if (data) {

    if(!data.themeType){

console.log("in nested ifff")

let getThemeId;
var themeType;

var meta_field_value;

let meta_field_value_not;

let theme_block_support;

let theme_block_support_not;




console.log("qwertttttyyyyyyyyyyyyyyyyyyyyyyyy");

const client = new shopify.api.clients.Rest({ session });

try {

const theme = await client.get({ path: "themes", type: "json" });

const themeId = theme.body.themes.find((el) => el.role === "main");

console.log("theme123", themeId);

 getThemeId=themeId?.id

const getAssetsData = await client.get({

path: `themes/${themeId.id}/assets`,

type: DataType.JSON,

});


const findJsonTemplate = getAssetsData.body.assets.find((asset) => {

return asset.key === "templates/product.json";

});

console.log("lyyy", findJsonTemplate);

themeType = findJsonTemplate === undefined ? "vintage" : "modern";

console.log("themeTypeaaaaaaa", themeType);




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




console.log(

"checkinggg--->",

themeType,

meta_field_value,

meta_field_value_not,

theme_block_support,

theme_block_support_not

);




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




console.log(

  "checkinggg123455--->",

  themeType,

  meta_field_value,

  meta_field_value_not,

  theme_block_support,

  theme_block_support_not

);

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

console.log("errorinput checking", Input);

try {

  const result = await Client.query({

    data: { query: createAppDataMetafieldMutation, variables: Input },

  });




  console.log("response--->", result.body.data);

  console.log("response--->", result.body.data.metafieldsSet.metafields);

} catch (error) {

  console.log("errror1233");

}

}

} catch (error) {

console.log("error4565");

}

StoreSchemaModal.updateOne({shop},{$set:{themeType:themeType,themeId:getThemeId}}).then((data)=>console.log("theme stored in db")).catch(error=>console.log("error1290"))

    }




  } else {

 console.log("inelse27oct")



   }

}).catch((error)=>{
  console.log("error",error)
})

    //////////////////////////





    next();
    shopify.redirectToShopifyOrAppRoot();
  }
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.use("/api/admin/", router);

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    console.log(res.locals.shopify.session);
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
