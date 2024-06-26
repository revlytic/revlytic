import shopify from "../shopify.js";
import planModal from "./modals/PlanGroupDetails.js";
import subscriptionDetailsModal from "./modals/subscriptionDetails.js";
import StoreSchemaModal from "./modals/storeDetails.js";
import checkoutCustomerModal from "./modals/checkoutCustomer.js";
import nodemailer from "nodemailer";
import { CronJob } from "cron";
import shopModal from "./modals/credential.js";
import billing_Attempt from "./modals/billingAttempt.js";
import invoice_all_details from "./modals/invoice.js";
import emailTemplatesModal from "./modals/emailtemplates.js";
import announcementsModal from "./modals/announcements.js";
import { DataType } from "@shopify/shopify-api";
// import pdf from "html-pdf";
import axios from 'axios';
import FormData from "form-data";
import mime from "mime";
import fs from "fs";
import jwt from "jsonwebtoken";
import { ObjectId } from "bson";
import puppeteer from "puppeteer";
import widgetSettingsModal from "./modals/widgetSetting.js";
import productBundleModal from "./modals/productBundle.js";
import path from "path";
import ejs from "ejs";
import cPortalSettings from "./modals/customerPortalSettings.js";
import orderOnly from "./modals/contractOrder.js";
import orderContractDetails from "./modals/contractOrderDetails.js";
import billingModal from "./modals/billing.js";
import dunningModal from "./modals/dunning.js";
import dunningTemplates from './dunningTemplates.json'  with { type: "json" };
const __dirname = path.resolve();
const dirPath = path.join(__dirname, "/frontend/invoiceTemplate");
console.log("dirname",path.resolve())
function formatVariableName(variableName) {
  // Split the variable name by underscores
  const parts = variableName.split("_");

  // Capitalize the first letter of each part after the first one
  const formattedParts = parts.map((part, index) => {
    if (index === 0) {
      return part; // Keep the first part as is
    } else {
      return part.charAt(0).toUpperCase() + part.slice(1);
    }
  });

  // Join the formatted parts with spaces
  const formattedVariableName = formattedParts.join(" ");

  return formattedVariableName;
}

const getStoreDetails = async (shop) => {
  try {
    let data = await StoreSchemaModal.findOne({ shop: shop });

    return data;
  } catch (error) {
    console.log(error);
  }
};

const sendMailCall = async (recipientMails, others, extra) => {
  let data = extra?.configurationData;

  // if (!data) {
  //   console.log("nodatafound");
  // } else {
  let emailConfig = {};

  let options = {};

  if (data && data.enable == true) {
     let encryptionConfig = {};
    if (data.encryption === "ssl") {
      encryptionConfig = {
        secure: true,
        requireTLS: true,
      };
    } else if (data.encryption === "tls") {
      encryptionConfig = {
        secure: false, 
        requireTLS: true,
      };
    }
    emailConfig = {
      host: data.host,
      port: parseInt(data.portNumber), 
      auth: {
        user: data.userName,
        pass: data.password,
      },
      ...(data.encryption === "none" ? {} : encryptionConfig),
    };
    options = {
      from: `${data.fromName}<${data.userName}>`,
      // to: recipientMails.join(", "),
      subject: extra?.selectedTemplateData?.emailSetting?.subject,
      cc: extra?.selectedTemplateData?.emailSetting?.cc,
      bcc: extra?.selectedTemplateData?.emailSetting?.bcc,
      replyTo: extra?.selectedTemplateData?.emailSetting?.replyTo,
      ...others,
    };    
  } else {
     emailConfig = {
      host: "smtp.gmail.com",
      port: 587, 
      auth: {
        user: "sahilagnihotri7@gmail.com",
        pass: "srdvsdnxfmvbrduw",
      },
      secure: false,
    };
    options = {
      from: "sahilagnihotri7@gmail.com",
      // to: recipientMails.join(", "),
      subject: extra?.selectedTemplateData?.emailSetting?.subject,
      cc: extra?.selectedTemplateData?.emailSetting?.cc,
      bcc: extra?.selectedTemplateData?.emailSetting?.bcc,
      replyTo: extra?.selectedTemplateData?.emailSetting?.replyTo,
      ...others,
    };
  }
  const __dirname = path.resolve();
  const dirPath = path.join(__dirname, "/frontend/components/emailtemplate");
  const transporter = nodemailer.createTransport(emailConfig);
  let selectedTemplate = extra?.selectedTemplateData;
  let replacements;
  let emailContent; 

  replacements = {
    "{{customer_email}}": extra?.data?.customer_email,
    "{{order_number}}": extra?.data?.order_number,
    "{{customer_name}}": extra?.data?.customer_name,
    "{{customer_id}}": extra?.data?.customer_id,
    "{{shop_name}}": extra?.data?.shopName,
    "{{shop_email}}": extra?.data?.shopEmail,
    "{{shipping_country}}": extra?.data?.shipping_address?.country,
    "{{email_subject}}": selectedTemplate?.emailSetting?.subject,
    "{{shipping_full_name}}": extra?.data?.shipping_address?.firstName != null
        ? extra?.data?.shipping_address?.firstName
        : "" + " " + extra?.data?.shipping_address?.lastName != null
        ? extra?.data?.shipping_address?.lastName
        : "",
    "{{shipping_address_1}}": extra?.data?.shipping_address?.address1,
    "{{shipping_company}}":  extra?.data?.shipping_address?.company != null
        ? extra?.data?.shipping_address?.company
        : "",
    "{{shipping_city}}": extra?.data?.shipping_address?.city != null
        ? extra?.data?.shipping_address?.city
        : "",
    "{{shipping_province}}":extra?.data?.shipping_address?.province != null
        ? extra?.data?.shipping_address?.province
        : extra?.data?.shipping_address?.province,
    "{{shipping_province_code}}": extra?.data?.shipping_address?.provinceCode != null
        ? extra?.data?.shipping_address?.provinceCode
        : "",
    "{{shipping_zip}}":extra?.data?.shipping_address?.zip != null
        ? extra?.data?.shipping_address?.zip
        : "",
    "{{billing_full_name}}":extra?.data?.billing_address?.firstName != null
        ? extra?.data?.billing_address?.firstName
        : "" + " " + extra?.data?.billing_address?.lastName != null
        ? extra?.data?.billing_address?.lastName
        : "",
    "{{billing_country}}": extra?.data?.billing_address?.country != null
        ? extra?.data?.billing_address?.country
        : "",
    "{{billing_address_1}}":extra?.data?.billing_address?.address1 != null
        ? extra?.data?.billing_address?.address1
        : "",
    "{{billing_city}}": extra?.data?.billing_address?.city != null
        ? extra?.data?.billing_address?.city
        : "",
    "{{billing_province}}":extra?.data?.billing_address?.province != null
        ? extra?.data?.billing_address?.province
        : "",
    "{{billing_province_code}}": extra?.data?.billing_address?.provinceCode
      ? extra?.data?.billing_address?.provinceCode
      : "",
    "{{billing_zip}}":extra?.data?.billing_address?.zip
      ? extra?.data?.billing_address?.zip
      : "",
    "{{card_brand_name}}":extra?.data?.contractDetails?.instrument?.brand
      ? extra?.data?.contractDetails?.instrument?.brand.charAt(0).toUpperCase() +
        formatVariableName(extra?.data?.contractDetails?.instrument?.brand.slice(1).toLowerCase())
      : "",
    "{{last_four_digits}}":extra?.data?.contractDetails?.instrument?.lastDigits,
    "{{card_expiry_month}}":extra?.data?.contractDetails?.instrument?.expiryMonth,
    "{{card_expiry_year}}":extra?.data?.contractDetails?.instrument?.expiryYear,
    "{{heading_text}}": selectedTemplate?.headingText,
    "{{{logo_image}}": selectedTemplate?.logoUrl,
    "{{shiiping_address_text}}":selectedTemplate?.subscriptionShippingAddressText,
    "{{billing_address_text}}":selectedTemplate?.subscriptionBillingAddressText,
    "{{payment_method_text}}": selectedTemplate?.paymentMethodText,
    "{{logo_width}}": selectedTemplate?.logoWidth,
    "{{logo_height}}": selectedTemplate?.logoHeight,
    "{{logo_alignment}}": selectedTemplate?.logoAlignment,
  };

  if (extra?.check == "subscriptionInvoice") {
     async function generatePdf() {
      const browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser",
        headless: true,
        args: ["--no-sandbox"],
      });
      const page = await browser.newPage();
      const options = {
        format: "A4",
        printBackground: true, 
      };

      const filename = String(new Date().getTime());
      try {
        const templatePath = dirPath + "/invoiceTemplate.ejs";
        const compiledTemplate = ejs.compile(
          fs.readFileSync(templatePath, "utf8")
        );

        const content = compiledTemplate({ details: extra.details });
        await page.setContent(content);
        await page.pdf({
          path: dirPath + `/${filename}.pdf`,
          format: options.format,
        });
        await browser.close();
        const pdfData = fs.readFileSync(dirPath + `/${filename}.pdf`);
        const base64Data = Buffer.from(pdfData).toString("base64");
        const contentType = mime.getType(dirPath + `/${filename}.pdf`);

        let attachments = [
          {
            filename: "invoice.pdf",
            content: base64Data,
            encoding: "base64",
            contentType: contentType,
            contentDisposition: "inline",
          },
        ];
        const recipientEmails = recipientMails.join(",");
        options = {
          ...options,
          to: recipientEmails,
        };
        emailContent = await ejs.renderFile(dirPath + "/preview.ejs", {
          selectedTemplate,
          mode: "real",
          data: { ...extra?.data, check: extra?.check },
          currencySymbol: extra?.data?.currencySymbol,
          dateConversion,
          check: extra?.check,
          templateType: "subscriptionInvoice",
        });

        const updatedEmailContent = emailContent.replace(
          new RegExp(Object.keys(replacements).join("|"), "g"),
          (matched) => replacements[matched]
        );
        options.html = updatedEmailContent;
        options.attachments = attachments;
        try {          
          let data = await transporter.sendMail(options);
          if (data) {
            console.log("Mail sent successfully");
            let updateDb = await orderOnly.findOneAndUpdate(
              { shop: extra.shop, orderId: extra.orderId },
              { status: true }
            );
            fs.unlink(pdfPath, (err) => {
              if (err) {
                console.error("Error deleting PDF file:", err);
                throw error;
              } else {
                console.log("PDF file deleted successfully.");
              }
            });
          }
          console.log(data, "faaltuu");
        } catch (error) {
          console.log(error, "errorr aa gyaa");
          throw error;
        }
       } catch (err) {
        console.error(err);
      }
    }
    generatePdf();
      } else {
    if (recipientMails[0]) {    
      options = {
        ...options,
        to: recipientMails[0],
      };
      let url;
      if (extra?.selectedTemplateData?.subscriptionUrl) {
        url = extra?.selectedTemplateData?.subscriptionUrl;
      } else {
        if (recipientMails[0] == extra?.data?.customer_email) {
           url = `https://${extra?.shop}/account/login`;
        } else {
           url = `https://admin.shopify.com/store/${
            extra?.shop?.split(".myshopify.com")[0]
          }/apps/revlytic/subscriptionlist`;
        }
      }
      emailContent = await ejs.renderFile(dirPath + "/preview.ejs", {
        selectedTemplate,
        mode: "real",
        data: { ...extra?.data, check: extra?.check },
        currencySymbol: extra?.data?.currencySymbol,
        dateConversion,
        check: extra?.check,
        templateType: "subscriptionPurchased",
        url: url,
      });

      const updatedEmailContent = emailContent.replace(
        new RegExp(Object.keys(replacements).join("|"), "g"),
        (matched) => replacements[matched]
      );
      options.html = updatedEmailContent;
      try {
        let data = await transporter.sendMail(options);
        if (data) {
          console.log("Mail sent successfully");
        }
        console.log(data, "faaltuu");
      } catch (error) {
        console.log(error, "errorr");
        throw error;
      }  
    }
    if (recipientMails[1]) {     
      options = {
        ...options,
        to: recipientMails[1],
      };
      let url;
      if (extra?.selectedTemplateData?.subscriptionUrl) {
        url = extra?.selectedTemplateData?.subscriptionUrl;
      } else {
        if (recipientMails[1] == extra?.data?.customer_email) {
          url = `https://${extra?.shop}/account/login`;
        } else {
          url = `https://admin.shopify.com/store/${
            extra?.shop?.split(".myshopify.com")[0]
          }/apps/revlytic/subscriptionlist`;          
        }
      }

      emailContent = await ejs.renderFile(dirPath + "/preview.ejs", {
        selectedTemplate,
        mode: "real",
        data: { ...extra?.data, check: extra?.check },
        currencySymbol: extra?.data?.currencySymbol,
        dateConversion,
        check: extra?.check,
        templateType: "subscriptionPurchased",
        url: url,
      });
      const updatedEmailContent = emailContent.replace(
        new RegExp(Object.keys(replacements).join("|"), "g"),
        (matched) => replacements[matched]
      );
      options.html = updatedEmailContent;
      try {
        let data = await transporter.sendMail(options);
        if (data) {
          console.log("Mail sent successfully");
        }
        console.log(data, "faaltuu");
      } catch (error) {
        console.log(error, "errorr");
        throw error;
      }
    }
  }
};

let subscriptionBillingAttemptCreateMutation = `mutation subscriptionBillingAttemptCreate($subscriptionBillingAttemptInput: SubscriptionBillingAttemptInput!, $subscriptionContractId: ID!) {
  subscriptionBillingAttemptCreate(subscriptionBillingAttemptInput: $subscriptionBillingAttemptInput, subscriptionContractId: $subscriptionContractId) {
    subscriptionBillingAttempt {
      id
            subscriptionContract
            {
                nextBillingDate
                billingPolicy{
                    interval
                    intervalCount
                    maxCycles
                    minCycles
                    anchors{
                        day
                        type
                        month
                    }
                }
                deliveryPolicy{
                    interval
                    intervalCount
                    anchors{
                        day
                        type
                        month
                    }
                }
            }
    }
    userErrors {
      field
      message
    }
  }
}
`;

function verifyToken(token, secretOrPublicKey, callback) {
  jwt.verify(token, secretOrPublicKey, (err, decodedToken) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      callback(err, null);
    } else {
      console.log("JWT token is valid.");
      // console.log("Payload:", decodedToken);
      callback(null, decodedToken);
    }
  });
}

async function getshopToken(shop) {
   let gettoken = await shopModal.findOne({ shop: shop });
   const client = new shopify.api.clients.Graphql({
    session: {
      shop: shop,
      accessToken: gettoken.accessToken,
    },
  });
  return client;
}

async function sendmailforcrons(recipientMails,emailConfig,options,selectedTemplate,extra,shop){

  try{
  {
    let flag=false;
    const __dirname = path.resolve();
    
    const dirPath = path.join(__dirname, "/frontend/components/emailtemplate");
    let templateType = extra?.templateType;
    const transporter = nodemailer.createTransport(emailConfig);
    let currencySymbol =extra?.currency ? getCurrencySymbol(extra?.currency) : ""; 

    const replacements = {
      "{{subscription_id}}": extra?.data?.subscription_id?.split("/").at(-1),

      "{{customer_email}}": extra?.data?.customer_details?.email,

      "{{customer_name}}":
        extra?.data.customer_details.firstName != null
          ? extra?.data.customer_details.firstName
          : "",

      "{{customer_id}}": extra?.data?.customer_details?.id?.split("/").at(-1),

      "{{shop_name}}": extra?.shop_name,

      "{{shop_email}}": extra?.shop_email,

      "{{shipping_country}}":
        extra?.data?.shipping_address?.country != null
          ? extra?.data?.shipping_address?.country
          : "",

      "{{shipping_full_name}}":
        extra?.data?.shipping_address?.firstName != null
          ? extra?.data?.shipping_address?.firstName
          : "" + " " + extra?.data?.shipping_address?.lastName != null
          ? extra?.data?.shipping_address?.lastName
          : "",

      "{{shipping_address_1}}":
        extra?.data?.shipping_address?.address1 != null
          ? extra?.data?.shipping_address?.address1
          : "",

      "{{shipping_company}}":
        extra?.data?.shipping_address?.company != null
          ? extra?.data?.shipping_address?.company
          : "",

      "{{shipping_city}}":
        extra?.data?.shipping_address?.city != null
          ? extra?.data?.shipping_address?.city
          : "",

      "{{shipping_province}}":
        extra?.data?.shipping_address?.province != null
          ? extra?.data?.shipping_address?.province
          : "",

      "{{shipping_province_code}}":
        extra?.data?.shipping_address?.provinceCode != null
          ? extra?.data?.shipping_address?.provinceCode
          : "",

      "{{shipping_zip}}":
        extra?.data?.shipping_address?.zip != null
          ? extra?.data?.shipping_address?.zip
          : "",

      "{{billing_full_name}}":
        extra?.data?.billing_address?.firstName != null
          ? extra?.data?.billing_address?.firstName
          : "" + " " + extra?.data?.billing_address?.lastName != null
          ? extra?.data?.billing_address?.lastName
          : "",

      "{{billing_country}}":
        extra?.data?.billing_address?.country != null
          ? extra?.data?.billing_address?.country
          : "",

      "{{billing_address_1}}":
        extra?.data?.billing_address?.address1 != null
          ? extra?.data?.billing_address?.address1
          : "",

      "{{billing_city}}":
        extra?.data?.billing_address?.city != null
          ? extra?.data?.billing_address?.city
          : "",

      "{{billing_province}}":
        extra?.data?.billing_address?.province != null
          ? extra?.data?.billing_address?.province
          : "",

      "{{billing_province_code}}":
        extra?.data?.billing_address?.provinceCode != null
          ? extra?.data?.billing_address?.provinceCode
          : "",

      "{{billing_zip}}":
        extra?.data?.billing_address?.zip != null
          ? extra?.data?.billing_address?.zip
          : "",

      "{{card_brand_name}}":
        extra?.data?.payment_details?.payment_instrument_value?.brand,

      "{{last_four_digits}}":
        extra?.data?.payment_details?.payment_instrument_value?.lastDigits,

      "{{card_expiry_month}}":
        extra?.data?.payment_details?.payment_instrument_value?.expiryMonth,

      "{{card_expiry_year}}":
        extra?.data?.payment_details?.payment_instrument_value?.expiryYear,

      "{{heading_text}}": selectedTemplate.headingText,
      "{{card_brand_name}}": extra?.data?.payment_details
        ?.payment_instrument_value?.brand
        ? extra?.data?.payment_details?.payment_instrument_value?.brand
            .charAt(0)
            .toUpperCase() +
          formatVariableName(
            extra?.data?.payment_details?.payment_instrument_value?.brand
              .slice(1)
              .toLowerCase()
          )
        : "",

      "{{{logo_image}}": selectedTemplate.logoUrl,

      "{{shiiping_address_text}}":
        selectedTemplate.subscriptionShippingAddressText,

      "{{billing_address_text}}":
        selectedTemplate.subscriptionBillingAddressText,

      "{{payment_method_text}}": selectedTemplate.paymentMethodText,

      "{{logo_width}}": selectedTemplate.logoWidth,

      "{{logo_height}}": selectedTemplate.logoHeight,

      "{{logo_alignment}}": selectedTemplate.logoAlignment,
    };

    if (recipientMails[0]) {
      
      options = {
        ...options,
        to: recipientMails[0],
      };

      let url;

      if (selectedTemplate?.subscriptionUrl) {
        url = selectedTemplate?.subscriptionUrl;
      } else {
        if (recipientMails[0] == extra?.data?.customer_details?.email) {
            url = url = `https://${shop}/account/login`;
        } else {
           url = `https://admin.shopify.com/store/${
            shop?.split(".myshopify.com")[0]
          }/apps/revlytic/create-manual-subscription?id=${(extra?.data?.subscription_id)
            .split("/")
            .at(-1)}&mode=view`;
        }
      }
               
       let emailContent = await ejs.renderFile(dirPath + "/preview2.ejs", {
        selectedTemplate,
        templateType,
        currencySymbol,
        data: { ...extra?.data, recipientMails },
        dateConversion,
        url: url,
      });

      const updatedEmailContent = emailContent.replace(
        new RegExp(Object.keys(replacements).join("|"), "g"),
        (matched) => replacements[matched]
      );

      options.html = updatedEmailContent ;
      

      try {
       
        let data = await transporter.sendMail(options);

        if (data) {
          console.log("Mail sent successfully");
          flag=true
        }
        console.log(data, "faaltuu");
      } catch (error) {
        console.log(error, "errorr aa gyaa");
        throw error;
      }

   
    }

 

    if (recipientMails[1]) {
     
      options = {
        ...options,
        to: recipientMails[1],
      };

      let url;

      if (selectedTemplate?.subscriptionUrl) {
        url = selectedTemplate?.subscriptionUrl;
         } else {
        if (recipientMails[1] == extra?.data?.customer_details?.email) {
          url = url = `https://${shop}/account/login`;
        } else {
          url = `https://admin.shopify.com/store/${
            shop?.split(".myshopify.com")[0]
          }/apps/revlytic/create-manual-subscription?id=${(extra?.data?.subscription_id)
            .split("/")
            .at(-1)}&mode=view`;
           }
      }
      
      const emailContent = await ejs.renderFile(dirPath + "/preview2.ejs", {
        selectedTemplate,
        templateType,
        currencySymbol,
        data: { ...extra?.data, recipientMails},
        dateConversion,
        url: url,
      });

      const updatedEmailContent = emailContent.replace(
        new RegExp(Object.keys(replacements).join("|"), "g"),
        (matched) => replacements[matched]
      );

      options.html = updatedEmailContent;

      try {
        let data = await transporter.sendMail(options);
        if (data) {
          console.log("Mail sent successfully");
          flag=true
        }
        console.log(data, "faaltuu");
      } catch (error) {
        console.log(error, "errorr aa gyaa");
        throw error;
      }    
    }
return flag;
  }
}
catch(error){
console.log("error12",error)
}
}

// ///////////////////////////contract create cron start///////////////////////////////////////////
const firstScheduledTime = "*/30 * * * * *"; // Replace with your desired time in cron syntax
const cronTimeEvery1hr = "0 * * * *"; // Replace with your desired time in cron syntax
const cronTimeEvery24hr="10 0 * * *";

const firstJob = new CronJob(cronTimeEvery1hr, recurringOrderCron);
const secondJob = new CronJob(firstScheduledTime,sendInvoiceMailAndSaveContract);

firstJob.start();
secondJob.start();
 
const  upcomingOrderCron=new CronJob("5 0 * * *",upcomingOrders) ;
const  paymentFailureEmailCron=new CronJob("15 0 * * *",paymentFailureEmail); 
const  failedPaymentRetryAttemptCron=new CronJob("15 3 * * *",failedPaymentRetryAttempt);

upcomingOrderCron.start();
paymentFailureEmailCron.start();
failedPaymentRetryAttemptCron.start();

export async function recurringOrderCron(req, res) {
  const currentDate = new Date().toISOString();
  const targetDate = new Date(currentDate);
  
  console.log("checking dataess", targetDate);
  let data = await subscriptionDetailsModal.find(
    {
      $and: [
        {
          $expr: {
            $eq: [
              {
                $dateToString: { format: "%Y-%m-%d", date: "$nextBillingDate" },
              },

              { $dateToString: { format: "%Y-%m-%d", date: targetDate } },
            ],
          },
        },

        { status: "active" },
      ],
    },

    { shop: 1, subscription_id: 1, product_details: 1, subscription_details: 1 ,nextBillingDate:1 }
  );

     // const dataString =
      //   typeof CreateInput === "string"
      //     ? CreateInput
      //     : JSON.stringify(CreateInput);
  
     
  let mutation = `mutation subscriptionBillingAttemptCreate($subscriptionBillingAttemptInput: SubscriptionBillingAttemptInput!, $subscriptionContractId: ID!) {
    subscriptionBillingAttemptCreate(subscriptionBillingAttemptInput: $subscriptionBillingAttemptInput, subscriptionContractId: $subscriptionContractId) {
      subscriptionBillingAttempt {
        id
        subscriptionContract
              {
                  nextBillingDate
                  billingPolicy
                  {
                  interval
                  intervalCount
                  maxCycles
                  minCycles
                  anchors
                    {
                      day
                      type
                      month
                    }
                  }
                  deliveryPolicy
                  {
                  interval
                  intervalCount
                  anchors
                      {
                        day
                        type
                        month
                      }
                  }
              }
           }
          userErrors {
            field
            message
          }
        }
      }
      `;

  if (data.length > 0) {  
    for (let i = 0; i < data.length; i++) {
      const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
      let Input = {
        subscriptionBillingAttemptInput: {
          idempotencyKey: uniqueId,
          originTime: currentDate,
        },

        subscriptionContractId: data[i].subscription_id,
      };

      let gettoken = await shopModal.findOne({ shop: data[i].shop });
    
       if(gettoken){
       const client = new shopify.api.clients.Graphql({
        session: {
          shop: data[i].shop,
          accessToken: gettoken.accessToken,
        },
      });

      let billingAttempt = await client.request(mutation,{
                variables: Input 
            });

      if (billingAttempt.data.subscriptionBillingAttemptCreate.userErrors.length < 1 ) {
        const currentDate = new Date().toISOString();
        let saveToBillingAttempt = await billing_Attempt.create({
          shop: data[i].shop,
          status: "pending",
          billing_attempt_date: currentDate,
          renewal_date: currentDate,
          contract_products: data[i].product_details,
          contract_id: data[i].subscription_id,
          billing_attempt_id: billingAttempt.data.subscriptionBillingAttemptCreate.subscriptionBillingAttempt.id,
          idempotencyKey: uniqueId,
          attemptMode:"recurringOrderCron"
        });

        const originalDate = new Date(currentDate); // Assuming currentDate is already in ISO string format
        let nextDate;
        let value = data[i]?.subscription_details?.billingLength;
        if (data[i].subscription_details.delivery_billingType.toLowerCase() === "day" ) {
          nextDate = new Date(originalDate);
          nextDate.setDate(nextDate.getDate() + 1 * parseInt(value));
        } else if (data[i].subscription_details.delivery_billingType.toLowerCase() === "month") {
          nextDate = new Date(originalDate);
          nextDate.setMonth(nextDate.getMonth() + 1 * parseInt(value));
        } else if (data[i].subscription_details.delivery_billingType.toLowerCase() === "week" ) {
          nextDate = new Date(originalDate);
          nextDate.setDate(nextDate.getDate() + 7 * parseInt(value));
        } else if (data[i].subscription_details.delivery_billingType.toLowerCase() ===  "year" ) {
          nextDate = new Date(originalDate);
          nextDate.setFullYear(nextDate.getFullYear() + 1 * parseInt(value));
        }
        
        let updateNextBillingDate =  await subscriptionDetailsModal.findOneAndUpdate(
            { shop: data[i].shop, subscription_id: data[i].subscription_id },
            {
              $set: {
                nextBillingDate: nextDate.toISOString(),
              },
            }
          );
      }
    }
    }
  }
}
/////////////////////////////// contract create cron end/////////////////////////////////////////

const areDatesEqual = (date1, date2) => {
  const dateString1 = date1.toISOString().split('T')[0];
  const dateString2 = date2.toISOString().split('T')[0];
  return dateString1 === dateString2;
}

async function  upcomingOrders()
{
 try {
 
let startRange=new Date(new Date().setUTCHours(0,0,0,0))
let endRange=new Date()
endRange.setDate(endRange.getDate() + 5)
endRange.setUTCHours(23,59,59,999)

 let data= await dunningModal.aggregate(
  [
    { $match: { enableDunningNotices: true } },
    {
      $lookup: {
        from: 'subscription_details',
        localField: 'shop',
        foreignField: 'shop',
        as: 'result'
      }
    },
    {
      $addFields: {
        result: {
          $filter: {
            input: '$result',
            as: 'res',
            cond: {
              $and: [
                {
                  $eq: ['$$res.status', 'active']
                },
                {
                  $and: [
                    {
                      $gte: [
                        '$$res.nextBillingDate',
                        startRange
                      ]
                    },
                    {
                      $lte: [
                        '$$res.nextBillingDate',
                        endRange
                      ]
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
);

if(data.length > 0){  
let emailTemplate_storeDetail_Obj={};
data.forEach(async(item)=>{
if(item?.result?.length > 0 ) {
  let storedetails={}; 
  
    let getTemplateAndStoreData = await emailTemplatesModal.aggregate(
       [
         {
           $match: {
             shop: item?.shop
           }
         },
         {
           $lookup: {
             from: 'store_details',
             localField: 'shop',
             foreignField: 'shop',
             as: 'storedetails'
           }
         },
         {
           $project: {
             'settings.upcomingOrderReminder': 1,
             configuration: 1,
             storedetails:{ $arrayElemAt: [ "$storedetails", 0 ] }
           }
         }
       ],
       { maxTimeMS: 60000, allowDiskUse: true }
     );

if(getTemplateAndStoreData){
 emailTemplate_storeDetail_Obj =getTemplateAndStoreData[0]
 storedetails=emailTemplate_storeDetail_Obj?.storedetails 

item.result.map(async(sub_item)=> {
   const date1 = new Date(sub_item?.nextBillingDate);
   const date2 = new Date();
   date2.setDate(date2.getDate() + parseInt(item?.statementsInput))
   let sendMail=areDatesEqual(date1,date2)
 
   if(sendMail) {      
    
   let sendMailToCustomer = emailTemplate_storeDetail_Obj?.settings?.upcomingOrderReminder?.status;
   let sendMailToMerchant = emailTemplate_storeDetail_Obj?.settings?.upcomingOrderReminder?.adminNotification;

   if (sendMailToCustomer || sendMailToMerchant) {
        
    let recipientMails = [];

    if (sendMailToMerchant)
       {
            
      let shopEmail = storedetails?.store_email;
        recipientMails.push(shopEmail);
    
    }
    if (sendMailToCustomer) {       
      recipientMails.push(sub_item?.customer_details?.email);
    }

    let configurationData = emailTemplate_storeDetail_Obj?.configuration;
    let selectedTemplate = emailTemplate_storeDetail_Obj?.settings?.upcomingOrderReminder;

    let options={};
    let emailConfig={};

     
 if (configurationData && configurationData.enable == true) {
   let encryptionConfig = {};
  if (configurationData.encryption === "ssl") {
    encryptionConfig = {
      secure: true,
      requireTLS: true,
    };
  } else if (configurationData.encryption === "tls") {
    encryptionConfig = {
      secure: false, 
      requireTLS: true,
    };
  }

   emailConfig = {
    host: configurationData.host,
    port: parseInt(configurationData.portNumber),
    auth: {
      user: configurationData.userName,
      pass: configurationData.password,
    },
    ...(configurationData.encryption === "none" ? {} : encryptionConfig),
  };

   options = {
    // from: configurationData.fromName,
    from:`${configurationData.fromName}<${configurationData.userName}>`,
    to: recipientMails,
    subject:selectedTemplate?.emailSetting?.subject,
    cc:selectedTemplate?.emailSetting?.cc,
    bcc:selectedTemplate?.emailSetting?.bcc,
    replyTo:selectedTemplate?.emailSetting?.replyTo,
    // ...others,
  };

} else {
emailConfig = {
    host: "smtp.gmail.com",
    port: 587, 
    auth: {
      user: "sahilagnihotri7@gmail.com",
      pass: "srdvsdnxfmvbrduw",
    },
    secure: false,
  };

   options = {
    from: "sahilagnihotri7@gmail.com",
    to: recipientMails,
    subject:selectedTemplate?.emailSetting?.subject,
    cc:selectedTemplate?.emailSetting?.cc,
    bcc:selectedTemplate?.emailSetting?.bcc,
    replyTo:selectedTemplate?.emailSetting?.replyTo,
    // ...others,
 };   
}

 let extra = {
    templateType: "upcomingOrderReminder",
    data: sub_item,
    shop_name: storedetails?.store_name,
    shop_email: storedetails?.store_email,
    currency:sub_item?.subscription_details?.currency,
  };
  sendmailforcrons(recipientMails,emailConfig,options,selectedTemplate,extra,item.shop)
  } 
}
})
}
}
})
}
  }
  catch (error) {
    console.log("error", error);
      }

}


async function paymentFailureEmail(){
  try 
    {

    let targetDate=new Date()
    targetDate.setDate(targetDate.getDate() - 11)
    targetDate.setUTCHours(0,0,0,0)
   
  // let getBillingData=await billing_Attempt.find({
  //   updatedAt:{$gte: targetDate},
  //   $or: [{ status: "failed" }, { status: "retriedAfterFailure" },{ status: "success" }],
  //  })

 let mainData=await billing_Attempt.aggregate(
    [
      {
        $match: {
          billing_response_date: {$gte: targetDate},
          $or: [{ status: "failed" }, { status: "retriedAfterFailure" },{ status: "success" }],
        }
      },
      {
        $lookup: {
          from: 'subscription_details',
          localField: 'contract_id',
          foreignField: 'subscription_id',
          as: 'result'
        }
      },
      {
        $match: {
          'result.status': { $eq: 'active' }
        }
      }
    ],
    { maxTimeMS: 60000, allowDiskUse: true }
  );
  console.log("main",mainData)  
  let filteredArr=[]; 
  let contract_idArr=[];
  let contractIdFailureCountObj={};
  let allstore_emailTemplate_storeDetail_Obj={};
  let lastEmailSentStatusObj={}
  
  if(mainData.length > 0){
    mainData.map((item)=>{
  if(item?.status=='failed' || item?.status=='retriedAfterFailure'){
    filteredArr.push(item)
    contract_idArr.push(item?.contract_id)
  }
  else if(item?.status=='success'){
    filteredArr= filteredArr.filter((itm, index) => !Object.values(itm).includes(item.contract_id))
      contract_idArr= contract_idArr.filter((value, index) => value != item?.contract_id )
  }
    })
  }
  else{
    return;
  }

  let dunningDataArray=await dunningModal.find({enablePaymentAttempt:true});
   if(dunningDataArray.length >0 &&  filteredArr.length > 0){
     console.log("filteredArr",filteredArr)       
    filteredArr.forEach(async(item)=> {    
  if(!Object.keys(contractIdFailureCountObj).includes(item["contract_id"])){
    
    const countDuplicates= contract_idArr.filter((val) => 
      val==item["contract_id"]    
    ).length
    
    let dunningDataItem=dunningDataArray.find((val)=>
    val.shop==item["shop"]
  )  
  contractIdFailureCountObj[item["contract_id"]]={count:countDuplicates};

  // if(dunningDataItem && dunningDataItem.attemptNum && parseInt(dunningDataItem.attemptNum) > 0) {
    if(dunningDataItem) { 
      console.log("indunningdata")
    if(! allstore_emailTemplate_storeDetail_Obj[item["shop"]]){   
      console.log("inallstore")         
      let getTemplateAndStoreData = await emailTemplatesModal.aggregate([
          {
            $match: {
              shop: item["shop"]
            }
          },
          {
            $lookup: {
              from: 'store_details',
              localField: 'shop',
              foreignField: 'shop',
              as: 'storedetails'
            }
          },
          {
            $project: {
              [`settings.standardCourtsyNotice`]: 1,
              [`settings.standardPastDueNotice1`]: 1,
              [`settings.standardPastDueNotice2`]: 1,
              [`settings.standardPastDueNotice3`]: 1,
              [`settings.standardFinalDemand`]: 1,
              configuration: 1,
              shop:1,
              storedetails:{ $arrayElemAt: [ "$storedetails",0] }
            }
          }
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
      );      
      // console.log("getTemplateAndStoreData[0]",getTemplateAndStoreData[0])
    
        allstore_emailTemplate_storeDetail_Obj[item["shop"]] =getTemplateAndStoreData[0]     
    }
     if (allstore_emailTemplate_storeDetail_Obj[item["shop"]]){     
     ////////18junestart////////
     console.log("depppo")
     let selectedTemplateIndex;
     let currentItemEmailTemplateStoreDetail=allstore_emailTemplate_storeDetail_Obj[item["shop"]];
     let storedetails=currentItemEmailTemplateStoreDetail["storedetails"]; 
     let flag=true;
if(Object.keys(item).includes("lastEmailSentStatus")){
 if(item.lastEmailSentStatus == item.retriedAttemptStatus && item.lastEmailSentStatus < dunningDataItem?.attemptList?.length -1){
  selectedTemplateIndex = parseInt(item.lastEmailSentStatus) + 1 ;
 }
 else{
  console.log("inelsesee")
   flag=false;
 }
}
else{ 
  console.log("in0template")
  selectedTemplateIndex = 0 ;
}
console.log("19june")
if(flag){
       let templateOption=dunningDataItem?.attemptList[selectedTemplateIndex]?.selectedTemplate ;

       let sendMailToCustomer = currentItemEmailTemplateStoreDetail?.settings[templateOption]?.status ;
       let sendMailToMerchant = currentItemEmailTemplateStoreDetail?.settings[templateOption]?.adminNotification ;
    
       if (sendMailToCustomer || sendMailToMerchant) {
            
        let recipientMails = [];
    
        if (sendMailToMerchant)
           {
            let shopEmail = storedetails?.store_email;
            recipientMails.push(shopEmail);
        }
        if (sendMailToCustomer) {       
          recipientMails.push(item["result"][0]?.customer_details?.email);
        }
    
        let configurationData =  currentItemEmailTemplateStoreDetail?.configuration;
        let selectedTemplate =   currentItemEmailTemplateStoreDetail?.settings[templateOption];
    
        let options={};
        let emailConfig={};
    
         
     if (configurationData && configurationData.enable == true) {
      let encryptionConfig = {};
      if (configurationData.encryption === "ssl") {
        encryptionConfig = {
          secure: true,
          requireTLS: true,
        };
      } else if (configurationData.encryption === "tls") {
        encryptionConfig = {
          secure: false, // For TLS, secure should be set to false
          requireTLS: true,
        };
      }
    
       emailConfig = {
        host: configurationData.host,
        port: parseInt(configurationData.portNumber), // Convert port number to integer
        auth: {
          user: configurationData.userName,
          pass: configurationData.password,
        },
        ...(configurationData.encryption === "none" ? {} : encryptionConfig),
      };
    
       options = {
        // from: configurationData.fromName,
        from:`${configurationData.fromName}<${configurationData.userName}>`,
        to: recipientMails,
        subject:selectedTemplate?.emailSetting?.subject,
        cc:selectedTemplate?.emailSetting?.cc,
        bcc:selectedTemplate?.emailSetting?.bcc,
        replyTo:selectedTemplate?.emailSetting?.replyTo,
        // ...others,
      };
    
    } else {
    emailConfig = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "sahilagnihotri7@gmail.com",
          pass: "srdvsdnxfmvbrduw",
        },
        secure: false,
      };
    
       options = {
        from: "sahilagnihotri7@gmail.com",
        to: recipientMails,
        subject:selectedTemplate?.emailSetting?.subject,
        cc:selectedTemplate?.emailSetting?.cc,
        bcc:selectedTemplate?.emailSetting?.bcc,
        replyTo:selectedTemplate?.emailSetting?.replyTo,
        // ...others,
     };   
    }
    
     let extra = {
        templateType: templateOption,
        data:  item["result"][0],
        shop_name: storedetails?.store_name,
        shop_email: storedetails?.store_email,
        currency: item["result"][0]?.subscription_details?.currency,
      };

     let mailSentCheck=await  sendmailforcrons(recipientMails,emailConfig,options,selectedTemplate,extra,item.shop)
  
if(mailSentCheck)
     {
    // let updateBillingAttempts=await billing_Attempt.updateMany({ contract_id : item["contract_id"] }, {$set:{lastEmailSentStatus:contractIdFailureCountObj[item["contract_id"]].count-1}}) 
    let updateBillingAttempts=await billing_Attempt.updateMany({ contract_id : item["contract_id"] , status : { $in: ["failed", "retriedAfterFailure"] } } ,{$set:{lastEmailSentStatus:selectedTemplateIndex}}) 
    // console.log("updateBillingAttempts",updateBillingAttempts) 
    }
      }
    }
   /////////18juneend///////
    } 
      
    // let storedetails=currentItemEmailTemplateStoreDetail["storedetails"]; 


// let checkIsNewEntry= filteredArr.find(val => val.contract_id == item.contract_id && val.lastEmailSentStatus == undefined)   
// console.log("checkNewEntry",checkIsNewEntry)

// if(!checkIsNewEntry){
// return
// }
// const lastEmailSentStatusArray = filteredArr.filter(val => val.contract_id == item.contract_id && val.lastEmailSentStatus !== undefined);
// let selectedTemplateIndex;


// if(lastEmailSentStatusArray.length > 0 ) {
//   let highestlastEmailSentStatusValue = lastEmailSentStatusArray.reduce((maxvalue, item) => {
//         return item.lastEmailSentStatus > maxvalue ? item.lastEmailSentStatus : maxvalue;
//       }, 0);   
//       console.log("highestlastEmailSentStatusValue",highestlastEmailSentStatusValue)
//       if(parseInt(dunningDataItem?.attemptNum)==highestlastEmailSentStatusValue+1) {
//         return ; 
//       }
//       selectedTemplateIndex = parseInt(highestlastEmailSentStatusValue) + 1
//      }
//     else
//     {
//       selectedTemplateIndex = 0 ;
//     }
//   console.log("22april-checkcron",selectedTemplateIndex,lastEmailSentStatusArray)
 
   
      }
  }        
    })
  }
  else{
    return
  }
  }
  catch(error){
  console.log("errorpaymentfailure",error)
  }
 
  }


async function failedPaymentRetryAttempt(){

  try
    {
      let targetDate=new Date()
      targetDate.setDate(targetDate.getDate() - 11)
      targetDate.setUTCHours(0,0,0,0)
  
  
      let mainData=await billing_Attempt.aggregate(
        [
          {
            $match: {
              billing_response_date: {$gte: targetDate},
              $or: [{ status: "failed" }, { status: "retriedAfterFailure" },{ status: "success" }],
            }
          },
          {
            $lookup: {
              from: 'subscription_details',
              localField: 'contract_id',
              foreignField: 'subscription_id',
              as: 'result'
            }
          },
          {
            $match: {
              'result.status': { $eq: 'active' }
            }
          }
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
      )
      console.log("maindAta",mainData)
      let filteredArr=[];
      let contract_idArr=[];
      let contractIdFailureCountObj={};
  
      if(mainData.length > 0){
        mainData.map((item)=>{
      if(item?.status=='failed' || item?.status=='retriedAfterFailure'){
        filteredArr.push(item)
        contract_idArr.push(item?.contract_id)
      }
      else if(item?.status=='success'){
        filteredArr= filteredArr.filter((itm, index) => !Object.values(itm).includes(item.contract_id))
        contract_idArr= contract_idArr.filter((value, index) => value != item?.contract_id )
      }
        })
      }
      else{
        return;
      }
  
  let dunningDataArray=await dunningModal.find({enablePaymentAttempt:true});
     
  if(dunningDataArray.length > 0 &&  filteredArr.length > 0){
   
    filteredArr.forEach(async(item)=> {
    
  if(!Object.keys(contractIdFailureCountObj).includes(item["contract_id"])){
    
    const countDuplicates= contract_idArr.filter((val) => 
      val==item["contract_id"]     
    ).length 
    
    let dunningDataItem=dunningDataArray.find((val)=>
    val.shop==item["shop"]
  )
  contractIdFailureCountObj[item["contract_id"]]={count:countDuplicates};
  
  if( dunningDataItem && item.lastEmailSentStatus ){
  let today=new Date()
  today.setUTCHours(0,0,0,0)  
   let targetDate=item?.billing_response_date
   targetDate.setDate(targetDate.getDate() + parseInt(dunningDataItem?.attemptList[item.lastEmailSentStatus]?.retryAfterDays))
   targetDate.setUTCHours(0,0,0,0)  
   let  retryAttempt= areDatesEqual(today,targetDate);
  // let retriedAttemptStatus=item.retriedAttemptStatus ;
   console.log("abovefunction",retryAttempt,item.lastEmailSentStatus != item.retriedAttemptStatus )
   if ( retryAttempt && item.lastEmailSentStatus != item.retriedAttemptStatus ){
    console.log("inon",item["shop"])
    
    let mutation = subscriptionBillingAttemptCreateMutation ;  
    const currentDate = new Date().toISOString();
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  
    let Input = {
      subscriptionBillingAttemptInput: {
        idempotencyKey: uniqueId,
        originTime: currentDate,
      },
      subscriptionContractId: item.contract_id,
    };
  
    let gettoken = await shopModal.findOne({ shop: item?.shop });
  
  
    const client = new shopify.api.clients.Graphql({
      session: {
        shop: item?.shop,
        accessToken: gettoken.accessToken,
      },
    });
  
    let billingAttempt = await client.request(mutation,{
     variables: Input
    });
  
    if (billingAttempt.data.subscriptionBillingAttemptCreate.userErrors.length < 1 ) {
  
      let saveToBillingAttempt = await billing_Attempt.create({
        shop: item?.shop,
        status: "pending",
        billing_attempt_date: currentDate,
        idempotencyKey: uniqueId,
        renewal_date: item.renewal_date,
        contract_products: item.contract_products,
        contract_id: item.contract_id,
        billing_attempt_id:
          billingAttempt.data.subscriptionBillingAttemptCreate
            .subscriptionBillingAttempt.id,
        retriedAttemptStatus:item.lastEmailSentStatus,
        attemptMode:"dunning" 
      });
    
      let updateBillingAttempts=await billing_Attempt.updateMany({ contract_id : item["contract_id"] , status : { $in: ["failed", "retriedAfterFailure"] } } ,{$set:{retriedAttemptStatus:item.lastEmailSentStatus}}) 
      console.log("inend")
    }
  
  
   }
  
  }

  
     }
  
    })
  }
    }
  catch(error){
  console.log('error',error)  
  }
  } 
  
/////////cron pament retry end//////

const currentDate = new Date().toISOString();
const targetDate = new Date(currentDate);

function dateConversion(date) {
  const dateString = date;
  const dateObj = new Date(dateString);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
   return formattedDate;
}

const dateChange = (type, originalDate, value) => {
    if (type.toLowerCase() === "day") {
    let nextDate = new Date(originalDate);
    nextDate.setDate(nextDate.getDate() + 1 * parseInt(value));
    return nextDate;
  } else if (type.toLowerCase() === "month") {
    let nextDate = new Date(originalDate);
    nextDate.setMonth(nextDate.getMonth() + 1 * parseInt(value));
    return nextDate;
  } else if (type.toLowerCase() === "week") {
    let nextDate = new Date(originalDate);
    nextDate.setDate(nextDate.getDate() + 7 * parseInt(value));
    return nextDate;
  } else if (type.toLowerCase() === "year") {
    let nextDate = new Date(originalDate);
    nextDate.setFullYear(nextDate.getFullYear() + 1 * parseInt(value));
    return nextDate;
  }
};

const getCurrencySymbol = (currency) => {
  const symbol = new Intl.NumberFormat("en", { style: "currency", currency })
    .formatToParts()
    .find((x) => x.type === "currency") ;
  return symbol && symbol.value;
};

export async function orderDetails(req, res) {
  try {
    let session = res.locals.shopify.session;

    let shop = res.locals.shopify.session.shop;

    const client = new shopify.api.clients.Graphql({ session });
    const data = await client.query({
      data: `query {
        node(id: "gid://shopify/Order/5406648992048") {
          ... on Order {
            name
            lineItems(first: 50) {
              edges {
                node {
                  id
                  image{
                    url
                   }
                  contract {
                    id
                    customerPaymentMethod {
                      __typename
                      instrument {
                        __typename
                        ... on CustomerCreditCard {
                          brand
                          expiryYear
                          expiryMonth
                          lastDigits
                          name
                        }
                        ... on CustomerShopPayAgreement {
                          expiryMonth
                          expiryYear
                          isRevocable
                          maskedNumber
                          lastDigits
                          name
                        }
                        ... on CustomerPaypalBillingAgreement {
                          billingAddress{
                            country
                          }
                          paypalAccountEmail
                        }
                      }
                    }
                  }
                  sellingPlan {
                    name
                    sellingPlanId
                  }
                }
              }
            }
          }
        }
      }
      `,
    });
    let orderDeets = data.body.data.node.lineItems.edges;
    let Obj = {};
    let flag = false;
    let contractdetails;
    let imageObj = {};
    orderDeets.map((item, index) => {
      console.log("imageurl", item.node?.image?.url);
      imageObj[item.node.id] = item.node?.image?.url;
      if (item.node.sellingPlan != null) {
         if (flag == false) {
          console.log("contract--->", item.node.contract);
          contractdetails = item.node.contract;
          flag = true;
        }
        console.log("plan--->", item.node.sellingPlan);
        Obj[item.node.sellingPlan.sellingPlanId] = {};
      }
    });
   
    if (Obj) {
      let arr = Object.keys(Obj);
      try {
        let planDetails = await planModal.findOne({
          shop: shop,
          plans: {
            $elemMatch: { plan_id: { $in: arr } },
          },
        });

        planDetails.plans.map((item) => {
          if (arr.includes(item.plan_id)) {
            Obj[item.plan_id] = item;
          }
        });

      } catch (error) {
        console.error("Error:", error);
      }
    }
  } catch (error) {
    console.log("check", error);
    res.send({ message: "something_went_wrong", error: error.message });
  }
}

export async function getCurrencyCode(req, res) {
  let shop = res?.locals?.shopify?.session?.shop
    ? res?.locals?.shopify?.session?.shop
    : req?.body?.shop;
  try {
    let data = await StoreSchemaModal.findOne({ shop });
    if (data) {
      res.send({ message: "success", data: data });
    } else {
      res.send({ message: "no_data", data: "" });
    }
  } catch (error) {
    res.send({ message: "error", error: error?.message });
  }
}

export async function getCustomers(req, res) {
  try {
    let session = res.locals.shopify.session;
    let cursor = req.body.cursor;
    let cursorCheckNext = cursor == "" ? "first : 10" : 'first:10,after:"' + cursor + '"';

    const client = new shopify.api.clients.Graphql({ session });
    const data = await client.request(
      `query {
      customers(${cursorCheckNext}) {
        edges {
          node {
            id
            displayName
            email
            lastName
            firstName
            phone
            defaultAddress{
              address1
              address2
              city
              country
              countryCodeV2
              province
              provinceCode
              company
              zip
            }

           }
          cursor
        }
        pageInfo{
          hasNextPage
        }
      }
    }`,
    );

    let sendData = data.data.customers.edges;
    if (sendData.length > 0) {
      let next = data.data.customers.pageInfo.hasNextPage;

      res.send({
        data: sendData,
        next: next,
        message: "success",
      });
    } else {
      res.send({
        message: "no_data_found",
        toastMessage: "No data found",
        data: "",
      });
    }
  } catch (error) {
    res.send({
      message: "error",
      toastMessage: "Error fetching customers",
      data: "",
    });
  }
}

export async function searchCustomer(req, res) {
  try {
    let searchTerm = req.body.input;
    let session = res.locals.shopify.session;
    let cursor = req.body.cursor;
    let query = 'query:"' + searchTerm + '"';
    let cursorCheckNext = cursor == "" ? "first : 10" : 'first:10,after:"' + cursor + '"';
    const client = new shopify.api.clients.Graphql({ session });
    const data = await client.request(
       `query {
      customers(${cursorCheckNext},${query}) {
        edges {
          node {
            id
            displayName
            email
            firstName
            lastName
            phone
            defaultAddress{
              address1
              address2
              city
              country
              countryCodeV2
              province
              provinceCode
              company
              zip
            }
          }
          cursor
        }
        pageInfo{
          hasNextPage
        }
      }
    }`,
    );

    let sendData = data.data.customers.edges;
    if (sendData.length > 0) {
      let next = data.data.customers.pageInfo.hasNextPage;
      res.send({
        data: sendData,
        next: next,
        message: "success",
      });
    } else {
      res.send({
        message: "no_data_found",
        toastMessage: "No data found",
        data: "",
      });
    }
  } catch (error) {
    console.log("sdsdsd", error?.response?.errors);
    res.send({
      message: "error",
      toastMessage: "Error fetching customer",
    });
  }
}

export async function subscriptionCustomerUpdate(req, res, next) {
  try {
    let session = res.locals.shopify.session;
    const client = new shopify.api.clients.Graphql({ session });
    const mutationQuery = `mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      userErrors {
        field
        message
      }
      customer {
        id
        firstName
        lastName
        phone
        email
      }
    }
  }`;

    const Input = {
      input: req?.body?.input,
    };

    let response = await client.request(mutationQuery,{
       variables: Input 
    });

    if (response.data?.customerUpdate?.userErrors.length > 0) {
       res.send({
        message: "error",
        data: response?.data?.customerUpdate?.userErrors[0]?.message,
      });
    } else {
       res.send({
        message: "success",
        data: response?.data?.customerUpdate?.customer,
      });
    }
  } catch (error) {
    res.send({
      message: "error",
      data: "Something went wrong while updating customer!",
    });
  }
}

export async function getCustomerPaymentMethods(req, res) {
  try {
    let session = res.locals.shopify.session;
    const client = new shopify.api.clients.Graphql({ session });
    let id = req.body.id;
    const data = await client.request( `query 
      {
                
     customer(id:"${req.body.id}"){
       id
       paymentMethods(first:50){
        edges{
          node{
            id
           
            customer{
                   email
                   firstName
                   lastName
                   displayName
                    }
            __typename
           instrument{
                     __typename
                     ...on CustomerCreditCard {
      
                      brand
                       
                     expiryYear
                       
                      expiryMonth
                       
                      lastDigits
                       name
                      }
                      ...on CustomerShopPayAgreement{
      
                        expiryMonth
                           
                         expiryYear
                           
                          isRevocable
                           
                           maskedNumber
                           
                          lastDigits
                           
                         name
                           
                           }
                             ...on CustomerPaypalBillingAgreement{
                           
                        billingAddress{
                           
                          countryCode
                           
                          country
                           
                          province
                           
                        }
                           
                          paypalAccountEmail
                           
                          }

                    }
                   }
                }
                }
              }
              }`,
    );
    let dataToSend = data.data.customer.paymentMethods.edges;
    if (dataToSend.length > 0) {
       res.send({ message: "success", data: dataToSend });
    } else {
      res.send({
        message: "no_data_found",
        toastMessage:
          "This customer has no payment methods, but can proceed to create checkout link.",
        data: dataToSend,
      });
    }
  } catch (error) {
    console.log("check", error.message);
    res.send({ message: "error", toastMessage: "Something went wrong" });
  }
}

export async function getCodeDiscountNodes(req, res) {
  try {
    let session = res.locals.shopify.session;
    let cursor = req.body.cursor;
    let cursorCheckNext =
      cursor == "" ? "first : 12" : 'first:12,after:"' + cursor + '"';
    const client = new shopify.api.clients.Graphql({ session });
    const data = await client.query({
      data: `query {
       
    discountNodes(${cursorCheckNext}){
    edges{
      node{
        id      
           discount{
           __typename
          ... on DiscountCodeBasic{
                  title
                  recurringCycleLimit
            customerGets{
              appliesOnSubscription
            }         
          }  
         }
      }
      cursor
    }
    pageInfo{
      hasNextPage
    }
      }
     }`,
    });
    let dataToSend = data.body.data.discountNodes.edges;
    if (dataToSend.length > 0) {
      let next = data.body.data.discountNodes.pageInfo.hasNextPage;
      res.send({ message: "success", data: dataToSend, next: next });
    } else {
      res.send({ message: "no_data", data: dataToSend });
    }
  } catch (error) {
    console.log("check", error.response);
    res.send({ message: "something_went_wrong", error: error.message });
  }
}

export async function subscriptionContractCreate(req, res) {
  try {
    let { session } = res.locals.shopify;
    let { shop } = res.locals.shopify.session;
    const client = new shopify.api.clients.Graphql({ session });
    let values = req.body?.bodyData;
    let linesArray = [];
    // let discountCodes = values?.subscription?.discountCode
    //   ? [`${values?.subscription?.discountCode}`]
    //   : [];

    values?.products.map((ele, index) => {
      // if (values?.subscription?.discount?.value) {
      //   ele.currentPrice =
      //     values.subscription.discount.type == "PERCENTAGE"
      //       ? (
      //           parseFloat(ele.price) -
      //           (parseFloat(ele.price) *
      //             parseFloat(values.subscription.discount.value)) /
      //             100
      //         ).toFixed(2)
      //       : parseFloat(ele.price) -
      //           parseFloat(values.subscription.discount.value) >
      //         0
      //       ? (
      //           parseFloat(ele.price) -
      //           parseFloat(values.subscription.discount.value)
      //         ).toFixed(2)
      //       : 0;
      // }

      // console.log("firstlineschecking",ele.currentPrice)
      linesArray.push({
        line: {
          productVariantId: ele.id,
          quantity: parseInt(ele.quantity),
          // currentPrice: parseFloat(ele.price),
          currentPrice:
            values?.subscription?.planType == "prepaid"
              ? parseFloat(
                  ele.price *
                    ele.quantity *
                    (values?.subscription?.billingLength /
                      values?.subscription?.delivery_billingValue)
                )
              : parseFloat(ele.price),
          sellingPlanName: values?.subscription?.planName,
        },
      });
    });

    // values?.products.map((item, index) => {
    //   item.variants.map((ele, var_index) => {
    //     if (values?.discount?.value) {
    //       values.products[index].variants[var_index].currentPrice =
    //         values.subscription.discount.type == "PERCENTAGE"
    //           ? (
    //               parseFloat(ele.price) -
    //               (parseFloat(ele.price) * parseFloat(values.subscription.discount.value)) /
    //                 100
    //             ).toFixed(2)
    //           : parseFloat(ele.price) - parseFloat(values.subscription.discount.value) > 0
    //           ? (
    //               parseFloat(ele.price) - parseFloat(values.subscription.discount.value)
    //             ).toFixed(2)
    //           : 0;
    //     }

    //     linesArray.push({
    //       line: {
    //         productVariantId: ele.id,
    //         quantity: parseInt(ele.quantity),
    //         currentPrice: parseFloat(
    //           ele?.currentPrice ? ele?.currentPrice : ele.price
    //         ),
    //       },
    //     });
    //   });
    // });

    // console.log("hihelo", values.products[0].variants[0])
  

    let setBillingPolicy = {
      interval: values.subscription.delivery_billingType,
      intervalCount: parseInt(values.subscription.billingLength),
      minCycles: values?.subscription?.billingMinValue
        ? parseInt(values?.subscription?.billingMinValue)
        : 1,
      // maxCycle:values?.subscription?.billingMaxValue ? parseInt(values.subscription.billingMaxValue) :null,
      // ...(values?.subscription?.billingMaxValue

      //   ?  { maxCycles: parseInt(values?.subscription?.billingMaxValue) }

      //   :  values?.subscription?.planType=='prepaid' && values?.subscription?.autoRenew==false ? { maxCycles : 1}  : {}

      ...(values?.subscription?.autoRenew
        ? values?.subscription?.billingMaxValue
          ? { maxCycles: parseInt(values?.subscription?.billingMaxValue) }
          : {}
        : values?.subscription?.planType == "prepaid" &&
          values?.subscription?.autoRenew == false
        ? { maxCycles: 1 }
        : {}),
    };

    const mutationQuery = `mutation($input: SubscriptionContractAtomicCreateInput!) {
    subscriptionContractAtomicCreate(input: $input ) {
      contract {
        id
        note
        lines(first: ${linesArray.length}) {
          nodes {
            id
            quantity
            variantId
            productId
            currentPrice{
              amount
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }`;

    const Input = {
      input: {
        customerId: values.customer_details.id,
        nextBillingDate: values.startDate,
        currencyCode: values.subscription.currency,
        discountCodes: [],
        lines: linesArray,
        contract: {
          status: "ACTIVE",
          note: values.subscription.note,
          paymentMethodId: values.paymentMethod,
          billingPolicy: setBillingPolicy,
          deliveryPolicy: {
            interval: values.subscription.delivery_billingType,
            intervalCount:
              values.subscription.planType == "payAsYouGo"
                ? parseInt(values.subscription.billingLength)
                : parseInt(values.subscription.delivery_billingValue),
          }, ///interval is kept same for deliverypolicy as billinpolicy in our flow ,interval count changes according to respective changes
          deliveryPrice: parseFloat(
            values?.address_details?.deliveryPrice
              ? values?.address_details?.deliveryPrice
              : 0
          ),
          deliveryMethod: {
            shipping: {
              address: {
                firstName: values?.address_details?.firstName,
                lastName: values?.address_details?.lastName,
                address1: values?.address_details?.address1,
                address2: values.address_details?.address2,
                phone: values.address_details?.phone,
                city: values.address_details?.city,
                countryCode: values.address_details?.countryCode,
                provinceCode: values.address_details?.provinceCode, //  "IN-PB",
                zip: values.address_details?.zip,
                company: values.address_details?.company,
                //  "country": values.country,
                //  "province":values.province
              },
            },
          },
        },
      },
    };

    let response = await client.query({
      data: { query: mutationQuery, variables: Input },
    });

    if (
      response.body.data?.subscriptionContractAtomicCreate?.userErrors.length >
      0
    ) {
       res.send({
        message: "userError",
        data: response.body.data.subscriptionContractAtomicCreate.userErrors[0]
          .message,
      });
    } else {
      let subscription_id =
        response.body.data.subscriptionContractAtomicCreate?.contract?.id;

      let subscriptionLinesArray =
        response.body.data.subscriptionContractAtomicCreate?.contract?.lines
          ?.nodes;

      values?.products.map((item, index) => {
        let obj = subscriptionLinesArray.find((x) => x.variantId == item.id);
        if (obj) {
            item.subscriptionLine = obj?.id;
        }
      });

      let billing_address = JSON.parse(JSON.stringify(values?.address_details));
      if (billing_address && billing_address?.deliveryPrice) {
        delete billing_address?.deliveryPrice;
      }
      let obj = {
        shop: shop,
        subscription_id: subscription_id,
        createdBy: "merchant",
        customer_details: values.customer_details,
        shipping_address: values.address_details,
        billing_address: billing_address,
        subscription_details: values.subscription,
        product_details: values.products,
        payment_details: {
          payment_method_token: values.payment_details.node.id,
          // payment_instrument_type: values.payment_details.node.__typename,
          payment_instrument_value: values.payment_details.node.instrument,
        },
        status: "active",
        nextBillingDate: values.startDate,
      };

      try {
        let data = await subscriptionDetailsModal.create(obj);
        if (data) {
          res.send({ message: "success", data: data });
        }
      } catch (error) {
        console.log(error);
        res.send({ message: "error", error: error?.message });
      }
    }
  } catch (error) {
    console.log("inerror", error.response.errors[0]);
    res.send({ message: "error", error: error?.message });
  }
}

export async function checkPlanNameUniqueness(req, res, next) {
  try {
    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
    let values = req.body.bodyData;
    let query = {};
    console.log("checkkdsd", values?.subscription?.planName, req?.body?.id);
    if (req.body.check == "subscriptionDetailsUpdate") {
      console.log("twentyyyy-septemberrr");

      const regex = new RegExp("^" + req?.body?.planName?.trim() + "$", "i");

      query = {
        shop: shop,
        "subscription_details.planName": regex,
        subscription_id: { $ne: req?.body?.id },
      };
    } else {
      console.log("mimimii");
      const regex = new RegExp(
        "^" + values.subscription.planName?.trim() + "$",
        "i"
      );

      query = {
        shop: shop,
        "subscription_details.planName": regex,
      };
    }
    let data = await subscriptionDetailsModal.findOne(query);
 
    if (data) {
      res.send({
        message: "duplicate_planName",
        data: "This plan Name already exists.Try another",
      });
    } else {
         next();
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function subscriptionDraftLineUpdateCommon(req, res, next) {
  try {
    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
    let client = await getshopToken(shop);
    
    // const client  = new shopify.api.clients.Graphql({ session });

    const mutationQuery = `mutation subscriptionDraftLineUpdate($draftId: ID!, $input: SubscriptionLineUpdateInput!, $lineId: ID!) {
  subscriptionDraftLineUpdate(draftId: $draftId, input: $input, lineId: $lineId) {
    draft {
     id
    }
    lineUpdated {
    id
    variantId
    quantity
      productId
    currentPrice{
      amount
    }
    }
    userErrors {
      field
      message
    }
  }
}`;

    const Input = {
      draftId: req?.draft_id,
      input: req?.body?.input,
      lineId: req?.body?.line,
    };

    let response = await client.request(mutationQuery,{
    variables: Input 
    });

    if (
      response.data?.subscriptionDraftLineUpdate?.userErrors.length > 0
    ) {
     
      res.send({
        message: "error",
        data: response.data.subscriptionDraftUpdate.userErrors[0].message,
      });
    } else {
         next();
    }
  } catch (error) {
    console.log(error?.response?.errors);
  }
}

export async function checkReferenceId(req, res, next) {
  try {
    let shop = res.locals.shopify.session.shop;
    let values = req.body.bodyData;
    let data = await subscriptionDetailsModal.findOne({
      shop: shop,
      "subscription_details.referenceId": values.subscription.referenceId,
    });
    if (data) {
      res.send({
        message: "duplicate_referenceId",
        data: "This referenceId already exists.Try another",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "error" });
  }
}

export async function getSubscriptionList(req, res) {
  try {
    let shop = res.locals.shopify.session.shop;
    let session = res.locals.shopify.session;
    const client = new shopify.api.clients.Graphql({ session });
    let query = req.body?.listType == "all"
        ? { shop: shop }
        : req.body?.listType == "subscriptions"
        ? { shop: shop, createdBy: "customer" }
        : { shop: shop, createdBy: "merchant" };
   
    let data = await subscriptionDetailsModal.aggregate([
      {
        $match: query,
      },
      {
        $project: {
          subscription_id: 1,
          nextBillingDate: 1,
          createdAt: 1,
          status: 1,
          lastName: "$customer_details.lastName",
          customerId: "$customer_details.id",
          firstName: "$customer_details.firstName",
          fullName: {
            $concat: [
              {
                $ifNull: ["$customer_details.firstName", ""],
              },
              " ",
              {
                $ifNull: ["$customer_details.lastName", ""],
              },
            ],
          },
          planType: "$subscription_details.planType",
          createdBy: 1,
          type: {
            $cond: {
              if: { $eq: ["$createdBy", "merchant"] },
              then: "manual subscription",
              else: "subscription",
            },
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
  
    if (data.length == 0) {
      res.send({ message: "error", data: "No data found" });
    } else {
      res.send({ message: "success", data: data });
    }
  } catch (error) {
    console.log(error);
    res.send({
      message: "error",
      data: "Something went wrong",
    });
  }
}

export async function getSubscriptionListCustomer(req, res) {
  try {
   
    let shop = res.locals.shopify.session.shop;
    let createdBy = req.body?.listSelection;
    let data = await subscriptionDetailsModal.find(
      {
        shop: shop,
        "customer_details.customerId": req.body?.customerId,
        createdBy,
      },
      { subscription_id: 1, nextBillingDate: 1, createdAt: 1, status: 1 }
    );
    if (data.length == 0) {
      res.send({ message: "no_data", data: "" });
    } else {
      res.send({ message: "success", data: data });
    }
  } catch (error) {
    console.log(error);

    res.send({ message: "error", error: error.message });
  }
}

export async function getSubscriptionDetails(req, res) {
  try {
     let shop = res.locals.shopify.session.shop;
     let subscription_id = "gid://shopify/SubscriptionContract/" + req.body.subscriptionId;

    let data = await subscriptionDetailsModal.findOne({
      shop: shop,
      subscription_id: subscription_id,
    });
    if (data) {
      res.send({ message: "success", data: data });
    } else {
      res.send({ message: "error", data: "No data found" });
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function createSubscriptionDraftCommon(req, res, next) {

  try {
    // let session = res.locals.shopify.session;

    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
    let cli = await getshopToken(shop);

    // console.log(cli, "shop");

    // const cli = new shopify.api.clients.Graphql({ session });

    const mutationQuery = `mutation subscriptionContractUpdate($contractId: ID!) {

   subscriptionContractUpdate(contractId: $contractId) {

     draft {

      id

     }

     userErrors {

       field

       message

     }

   }

 }`;

    const Input = {
      contractId: req.body.id,
    };
    let response = await cli.request(mutationQuery,{
      variables: Input
    });
   
    if (response.data?.subscriptionContractUpdate?.userErrors.length > 0) {
        res.send({
        message: "error",
        data: response.data.subscriptionContractUpdate.userErrors[0].message,
      });
    } else {
      console.log("draftid",response.data.subscriptionContractUpdate?.draft?.id);
      req.draft_id = response.data.subscriptionContractUpdate?.draft?.id;
      next();
    }
  } catch (error) {
    console.log("error->", error);
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function updateSubscriptionFieldCommon(req, res, next) {
  try {
   
      let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
    let client = await getshopToken(shop);

    // let { session } = res.locals.shopify;

    // const client = new shopify.api.clients.Graphql({ session });

    let input = req?.body?.input;

    const mutationQuery = `mutation subscriptionDraftUpdate($draftId: ID!, $input: SubscriptionDraftInput!) {

     subscriptionDraftUpdate(draftId: $draftId, input: $input) {

       draft {
         id
         nextBillingDate
         status
         billingPolicy{
          interval
          intervalCount
          maxCycles
          minCycles
        }
        deliveryPolicy{
          interval
          intervalCount
          }
       }

       userErrors {

         field

         message

       }

     }

   }`;

    const Input = {
      draftId: req?.draft_id,
      input: input,
    };

    let response = await client.request(mutationQuery,{
     variables: Input 
    });

    if (response.data?.subscriptionDraftUpdate?.userErrors.length > 0) {
       res.send({
        message: "error",
        data: response.data.subscriptionDraftUpdate.userErrors[0].message,
      });
    } else {     
      if (req.body.check == "subscriptionDetailsUpdate")
        req.subscriptionDetailsChange = {
          billingPolicy   : response.data.subscriptionDraftUpdate?.draft?.billingPolicy,
          deliveryPolicy  : response.data.subscriptionDraftUpdate?.draft?.deliveryPolicy,
          nextBillingDate : response.data.subscriptionDraftUpdate?.draft?.nextBillingDate,
        };
      next();
    }
  } catch (error) {
    // console.log(error?.response?.errors);
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function subscriptionDraftCommitCommon(req, res, next) {
  console.log(" firstin commit");
  let shop = res?.locals?.shopify?.session?.shop
    ? res?.locals?.shopify?.session?.shop
    : req?.body?.shop;
  let client = await getshopToken(shop);

  // let session = res.locals.shopify.session;
  // const client = new shopify.api.clients.Graphql({ session });

  try {
    let mutationSubscriptionDraftCommit = `mutation subscriptionDraftCommit($draftId: ID!) {
      subscriptionDraftCommit(draftId: $draftId) {
        contract {
        id
        status
        note
        deliveryPrice{
          amount
        }

          nextBillingDate
          
          deliveryMethod{
        
            ...on SubscriptionDeliveryMethodShipping{
            address{
              address1
              address2
              phone
              firstName
              lastName
              city
              zip
              company
              provinceCode
              countryCode
              country
              province
              
            }
          }
        }
          lines(first:50){
            edges{
              node{
                id
                quantity
                title
                productId
                variantId
                variantTitle
                currentPrice{
                  amount
                }
                 discountAllocations{
                  discount{
                    __typename
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }`;

    const InputMutationSubscriptionDraftCommit = {
      draftId: req.draft_id,
    };
    let response = await client.request(mutationSubscriptionDraftCommit,{
              variables: InputMutationSubscriptionDraftCommit,
         });

    if (response.data?.subscriptionDraftCommit?.userErrors.length > 0) {
      res.send({
        message: "error",
        data:
          response.data.subscriptionDraftCommit.userErrors[0].message ==
          "Contract draft delivery method can't be blank if any lines require shipping."
            ? "Please update shipping address first."
            : response.data.subscriptionDraftCommit.userErrors[0].message,
      });
    } else {
      // response.body.data?.subscriptionDraftCommit?.contract?.lines?.edges?.map(
      //   (item) => {
      //     console.log("itemdec7", item?.node);
      //     console.log(
      //       "sandwich",
      //       item?.node?.currentPrice,
      //       item?.node?.quantity
      //     );
      //   }
      // );

      if (req?.body?.field == "deliveryMethod") {
        req.data = {
          deliveryPrice: response.data?.subscriptionDraftCommit?.contract?.deliveryPrice?.amount,
          [req.body?.field]:response.data?.subscriptionDraftCommit?.contract[req.body?.field],
        };
      } else {
        req.data = {
          [req.body?.field]:response.data?.subscriptionDraftCommit?.contract[req.body?.field],
            nextBillingDate:response.data?.subscriptionDraftCommit?.contract?.nextBillingDate
        };
      }
      next();
    }
  } catch (error) {
    console.log(error, "commmiterror");
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function updateSubscriptionInDbCommon(req, res) {
  try {
    // let shop = res.locals.shopify.session.shop;
    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
    // let client =await getshopToken(shop)
    let update = {};
    // let update = { $set: req.data };
    let query = { shop: shop, subscription_id: req.body.id };
    if (req?.body?.field == "note") {
      update = { $set: { "subscription_details.note": req?.data?.note } };
    } else if (req?.body?.field == "status") {
    if(req?.body?.input?.nextBillingDate) {
      update = { $set: { status: req?.data?.status?.toLowerCase()=="active" ? "active" : req?.data?.status   ,nextBillingDate: req?.data?.nextBillingDate } };
    }
else {
      update = { $set: { status: req?.data?.status?.toLowerCase()=="active" ? "active" : req?.data?.status } } ;
}
    } else if (req.body.field == "deliveryMethod") {
      //for updating shipping address
      update = {
        $set: {
          // "subscription_details.deliveryPrice": req?.data?.deliveryPrice,
          shipping_address: {
            ...req?.data?.deliveryMethod?.address,
            deliveryPrice: req?.data?.deliveryPrice,
            province: req?.body?.province,
            country: req?.body?.country,
          },
        },
      };
     
    } else if (req.body.field == "lines" && req.body.check == "line_update") {
      //for updating quantity
     
      query = {
        shop: shop,
        subscription_id: req.body.id,
        product_details: {
          $elemMatch: {
            subscriptionLine: req?.body?.line,
          },
        },
      };
      let itemIndex = req?.body?.itemIndex;
      update = {
        $set: {
          [`product_details.${itemIndex}.quantity`]: req?.body?.input?.quantity,
          [`product_details.${itemIndex}.price`]: req?.body?.unitPrice,
          // [`product_details.${itemIndex}.computedPrice`]:
          //   req?.body?.computedPrice,
        },
      };
    } else if (
      (req.body.field == "lines" && req.body.check == "lineAdd") ||
      req.body.check2 == "createProductSubscriptionEdit"
    ) {
      
      {
        update = {
          $push: { product_details: { $each: req.newLines.details } },
        };
      }
    } else if (req.body.check == "subscriptionDetailsUpdate") {
     
      let nextBillingDate = req?.subscriptionDetailsChange?.nextBillingDate;
      let getData = {
        delivery_billingType:
          req?.subscriptionDetailsChange?.billingPolicy?.interval,
        billingLength:
          req?.subscriptionDetailsChange?.billingPolicy?.intervalCount,
        billingMaxValue:
          req?.subscriptionDetailsChange?.billingPolicy?.maxCycles,
        billingMinValue:
          req?.subscriptionDetailsChange?.billingPolicy?.minCycles,
        delivery_billingValue:
          req?.subscriptionDetailsChange?.deliveryPolicy?.intervalCount,
      };

      update = {
        $set: {
          nextBillingDate: nextBillingDate,
          subscription_details: {
            ...getData,
            autoRenew: req?.body?.autoRenew,
            planName: req?.body?.planName,
            planType: req?.body?.planType,
            frequencyPlanName: req?.body?.frequencyPlanName,
            ...(req?.body?.discount ? { discount: req?.body?.discount } : {}),
            ...(req?.body?.freeTrial
              ? { freeTrial: req?.body?.freeTrial }
              : {}),
            ...(req?.body?.freeTrialCycle
              ? { freeTrialCycle: req?.body?.freeTrialCycle }
              : {}),
            currency: req?.body?.currency,
          },
        },
      };
    } else if (req.body.check == "customerUpdate") {
      update = {
        $set: {
          // "subscription_details.deliveryPrice": req?.data?.deliveryPrice,
          customer_details: req?.customerInfo?.data,
        },
      };
    }

    let data = await subscriptionDetailsModal.findOneAndUpdate(query, update, {
      new: true,
    });

    if (data) {
      res.send({
        message: "success",
        data: data,
      });
    } else {
      res.send({ message: "error", data: "Data not found" });
    }
  } catch (error) {
    console.log("error subscriptiondbupdate", error.message);
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function findItemForUpdateSubscription(req, res, next) {
  try {
   
    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
    let query = {
      shop: shop,
      subscription_id: req.body.id,
    };
    if (req?.body?.check == "line_update") {
      console.log("check in line_update");
      query = {
        shop: shop,
        subscription_id: req.body.id,
        product_details: {
          $elemMatch: {
            subscriptionLine: req?.body?.line,
          },
        },
      };
    }

    let data = await subscriptionDetailsModal.findOne(query);
   
    if (data) {
      next();
    } else {
      res.send({ message: "error", data: "No data found" });
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function subscriptionDraftLineAdd(req, res, next) {
  try {
    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
    let client = await getshopToken(shop);
    
    const mutationSubscriptionDraftLine = `mutation subscriptionDraftLineAdd($draftId: ID!, $input: SubscriptionLineInput!) {
        subscriptionDraftLineAdd(draftId: $draftId, input: $input) {
          draft {
           id
          }
          lineAdded {
          id
          variantId
          }
          userErrors {
            field
            message
          }
        }
      }`;

    let values = req?.body;
    if (req.body.check2 == "createProductSubscriptionEdit") {
      values = {
        lines: req?.createProductData?.data,
        // discount: req?.body?.discount,
      };
    }
    let flag = false;
    let linesArray = [];
    for (let i = 0; i < values?.lines?.length; i++) {
      try {
        if (flag == true) {
          break;
        }
        let element = values["lines"][i];
        const InputSubscriptionDraftLine = {
          draftId: req.draft_id,
          input: {
            // currentPrice: calculatedPrice,
            currentPrice:
              req?.body?.subscription_details?.planType == "prepaid"
                ? parseFloat(
                    element.price *
                      (req?.body?.subscription_details?.billingLength /
                        req?.body?.subscription_details?.delivery_billingValue)
                  )
                : parseFloat(element.price),
            productVariantId: element.id,
            quantity: element.quantity,
          },
        };

        let response = await client.request(mutationSubscriptionDraftLine,{
                    variables: InputSubscriptionDraftLine,
                });

        if (
          response.data?.subscriptionDraftLineAdd?.lineAdded?.id != null
        ) {
         
          linesArray.push(response.data?.subscriptionDraftLineAdd?.lineAdded);
          element.subscriptionLine = response.data?.subscriptionDraftLineAdd?.lineAdded?.id;

          if (i == values["lines"].length - 1) {
            req.newLines = { details: values.lines };
            next();                 
          }
        } else if ( response.data?.subscriptionDraftLineAdd?.userErrors.length > 0 ) {
            res.send({
            message: "error",
            data: response.data?.subscriptionDraftLineAdd?.userErrors[0].message,
          });

          flag = true;
          break;
        }
      } catch (error) {
        console.log("error too ", error);
        res.send({ message: "error", data: "Something went wrong" });
        flag = true;
        break;
      }
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function subscriptionDraftLineRemove(req, res, next) {
  try {
    console.log('7june')
    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
    let client = await getshopToken(shop);

    const mutationSubscriptionDraftLineRemove = `mutation subscriptionDraftLineRemove($draftId: ID!, $lineId: ID!) {  
        subscriptionDraftLineRemove(draftId: $draftId, lineId: $lineId) {  
          discountsUpdated {  
            id  
          }  
          draft {  
           id  
          }  
          lineRemoved {           
          id
          productId
          title  
          }  
          userErrors {  
            field  
            message  
          }  
        }  
      }`;

    const InputSubscriptionDraftLineRemove = {
      draftId: req.draft_id,
      lineId: req?.body?.line,
    };

    let response = await client.request(mutationSubscriptionDraftLineRemove,{
            variables: InputSubscriptionDraftLineRemove,
       });

    if (
      response?.data?.subscriptionDraftLineRemove?.lineRemoved != null
    ) {
      next();
    } else if (
      response?.data?.subscriptionDraftLineRemove?.userErrors?.length > 0
    ) {     
      res.send({
        message: "error",
        toastMessage:
          response.data?.subscriptionDraftLineRemove?.userErrors[0]
            .message,
      });
    }
  } catch (error) {
    console.log("checkerror", error?.response?.errors);
    res.send({
      message: "error",
      toastMessage: "Something went wrong",
      error: error.message,
    });
  }
}

export async function removeDraftLineItemFromDb(req, res) {

  let shop = res?.locals?.shopify?.session?.shop
    ? res?.locals?.shopify?.session?.shop
    : req?.body?.shop;

  try {
    let response = await subscriptionDetailsModal.findOneAndUpdate(
      {
        shop: shop,
        subscription_id: req.body.id,
      },
      { $pull: { product_details: { subscriptionLine: req?.body?.line } } },
      { new: true }
    );

    console.log("remove line item in db", response);
    if (response) {
       res.send({
        message: "success",
        data: response,
      });
    } else {
      res.send({ message: "error", data: "Unable to delete" });
    }
  } catch (err) {
    console.log("errrrrr");
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function getCountries(req, res) {
  try {
    console.log("ingetcountries");
    let session = res.locals.shopify.session;
    let data = await shopify.api.rest.Country.all({
      session: session,
    });
    if (data) {
      res.send({ message: "success", data: data });
    } else {
      res.send({ message: "error", data: "Countries data not found" });
    }
  } catch (error) {
    res.send({ message: "error", data: "Error fetching Countries Data" });
  }
}

export async function customerPaymentMethodSendUpdateEmail(req, res) {
  try {
    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
    let client = await getshopToken(shop);
    // let session = res.locals.shopify.session;
   
    // const client = new shopify.api.clients.Graphql({ session });
    let mutationQuery = `mutation customerPaymentMethodSendUpdateEmail($customerPaymentMethodId: ID!) {
    customerPaymentMethodSendUpdateEmail(customerPaymentMethodId: $customerPaymentMethodId) {
      customer {
      id
        email
      }
      userErrors {
        field
        message
      }
    }
  }`;

    const Input = {
      customerPaymentMethodId: req?.body?.paymentId,
      email: {
        from: "sahilagnihotri7@gmail.com",
        to: req?.body?.email,
      },
    };

    let response = await client.request(mutationQuery,{
       variables: Input 
    });
    
    if (
      response?.data?.customerPaymentMethodSendUpdateEmail?.userErrors
        ?.length > 0
    ) {
      res.send({
        message: "error",
        data: response?.data?.customerPaymentMethodSendUpdateEmail
          ?.userErrors[0].message,
      });
    } else {
      res.send({
        message: "success",
        data: "Email sent to the customer for updating of payment method",
      });
    }
  } catch (error) {
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function widgetSettings(req, res) {
  try {
    let shop = res.locals.shopify.session.shop;
    let data = await widgetSettingsModal.findOneAndUpdate(
      { shop: shop },
      {
        $set: {
          widgetSettings: req.body,
        },
      },
      { upsert: true, new: true }
    );
    if (data) {
      res.send({ message: "success", data: data });
    } else {
      res.send({ message: "error", data: data });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "error" });
  }
}

export async function getWidgetSettings(req, res) {
  try {
  
    let shop = res.locals.shopify.session.shop;
    let data = await widgetSettingsModal.findOne({ shop: shop });


    if (!data) {
      res.send({ message: "error", data: "No data found" });
    } else {
      res.send({ message: "success", data: data });
    }
  } catch (error) {
    console.log(error);
    res.send({
      message: "error",
      data: "Something went wrong",
    });
  }
}

export async function emailTemplates(req, res) {
  try {
   
    let shop = res.locals.shopify.session.shop;
    let templateType = req.body.templateType;
    let templateData = req.body.data;

    let query = {
      $set: {
        [`settings.${templateType}`]: templateData,
      },
    };

    if (req.body.check == "configuration") {
      query = {
        $set: {
          configuration: req.body.values,
        },
      };
    }

    let data = await emailTemplatesModal.findOneAndUpdate(
      { shop: shop },
      query,
      { upsert: true, new: true }
    );

    if (data) {     
      res.send({ message: "success", data: data });
    } else {
      res.send({ message: "error", data: data });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "error" });
  }
}

export async function getEmailTemplatesList(req, res) {
  try {    
    let shop = res.locals.shopify.session.shop;
    let data = await emailTemplatesModal.findOne({ shop: shop });
    if (data.length == 0) {
      res.send({ message: "error", data: "No data found" });
    } else {
      res.send({ message: "success", data: data });
    }
  } catch (error) {
    console.log(error);
    res.send({
      message: "error",
      data: "Something went wrong",
    });
  }
}

export async function getEmailTemplateData(req, res) {
  try {
    let shop = res.locals.shopify.session.shop;
    let templateType = req.body.templateType;
   
    let data = await emailTemplatesModal
      .findOne({ shop: shop })
      .select(`settings.${templateType}`)
      .lean();
 
    if (!data) {
      res.send({ message: "error", data: "No data found" });
    } else {
        res.send({ message: "success", data: data?.settings[templateType] });
    }
  } catch (error) {
    console.log(error);
    res.send({
      message: "error",
      data: "Something went wrong",
    });
  }
}

export async function getEmailTemplateAndConfigData(req, res) {
  try {
    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
    let templateType = req.body.templateType;
    let data = await emailTemplatesModal
      .findOne(
        { shop: shop },
        { [`settings.${templateType}`]: 1, configuration: 1 }
      )
      .lean();
    
    if (!data) {
      res.send({ message: "error", data: "No data found" });
    } else {
       res.send({ message: "success", data: data });
    }
  } catch (error) {
    console.log(error);
    res.send({
      message: "error",
      data: "Something went wrong",
    });
  }
}

export async function emailTemplateStatusOrAdminNotificationUpdate(req, res) {
  try {
  
    let shop = res.locals.shopify.session.shop;
    let templateType = req.body.type;
    let option = req.body.option;
    let data = await emailTemplatesModal.findOneAndUpdate(
      { shop: shop },
      {
        $set: {
          [`settings.${templateType}.${option}`]: req.body.value,
        },
      },

      { new: true }
    );
    if (data) {
      res.send({ message: "success", data: data });
    } else {
      res.send({ message: "error", data: data });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "error" });
  }
}

export async function sendMailCommon(req, res) {
  const __dirname = path.resolve(); 
  const dirPath = path.join(__dirname, "/frontend/components/emailtemplate");

  let options = req.body?.options; 
  let emailConfig = req.body?.emailConfig;  
  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport(emailConfig);

  if (req.body.check != "smtpTest") {
    let selectedTemplate = req.body?.extra?.selectedTemplate;
    let templateType = req.body?.extra?.templateType;
    let currencySymbol = getCurrencySymbol(req.body?.extra?.currency);
    let mode = req.body?.extra?.mode;
   
    const emailContent = await ejs.renderFile(dirPath + "/preview.ejs", {
      selectedTemplate,
      templateType,
      currencySymbol,
      mode,
    });

    options.html = emailContent;
  }

  try {
   
    let data = await transporter.sendMail(options);
    if (data) {
      res.send({
        message: "success",
        data: "Mail sent successfully",
      });
    }
    } catch (err) {
    console.log(err, "errorr aa gyaa");
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function sendMailOnUpdate(req, res) {
  try {
    const __dirname = path.resolve();   
    const dirPath = path.join(__dirname, "/frontend/components/emailtemplate");
    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
    let options = req.body?.options;
    let emailConfig = req.body?.emailConfig;
    let extra = req.body?.extra;
    let templateType = extra?.templateType;
    let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport(emailConfig);

    let selectedTemplate = req.body?.selectedTemplate;
    let currencySymbol = getCurrencySymbol(req.body?.extra?.currency);    
    let recipientMails = req?.body?.recipientMails;

    const replacements = {
      "{{subscription_id}}"  : extra?.data?.subscription_id?.split("/").at(-1),
      "{{customer_email}}"   : extra?.data?.customer_details?.email,
      "{{customer_name}}"    : extra?.data.customer_details.firstName != null
                                ? extra?.data.customer_details.firstName    : "",
      "{{customer_id}}"      : extra?.data?.customer_details?.id?.split("/").at(-1),
      "{{shop_name}}"        : extra?.shop_name,
      "{{shop_email}}"       : extra?.shop_email,
      "{{shipping_country}}" : extra?.data?.shipping_address?.country != null
                                ? extra?.data?.shipping_address?.country : "",
      "{{shipping_full_name}}":extra?.data?.shipping_address?.firstName != null
                                ? extra?.data?.shipping_address?.firstName
                                : "" + " " + extra?.data?.shipping_address?.lastName != null
                                ? extra?.data?.shipping_address?.lastName
                                : "",

      "{{shipping_address_1}}": extra?.data?.shipping_address?.address1 != null
                                ? extra?.data?.shipping_address?.address1
                                : "",

      "{{shipping_company}}" : extra?.data?.shipping_address?.company != null
                                ? extra?.data?.shipping_address?.company
                                : "",

      "{{shipping_city}}"   : extra?.data?.shipping_address?.city != null
                                ? extra?.data?.shipping_address?.city
                                : "",

      "{{shipping_province}}": extra?.data?.shipping_address?.province != null
                                ? extra?.data?.shipping_address?.province
                                : "",

    "{{shipping_province_code}}": extra?.data?.shipping_address?.provinceCode != null
                                  ? extra?.data?.shipping_address?.provinceCode
                                  : "",

    "{{shipping_zip}}"      : extra?.data?.shipping_address?.zip != null
                                ? extra?.data?.shipping_address?.zip
                                : "",

    "{{billing_full_name}}" : extra?.data?.billing_address?.firstName != null
                                ? extra?.data?.billing_address?.firstName
                                : "" + " " + extra?.data?.billing_address?.lastName != null
                                ? extra?.data?.billing_address?.lastName
                                : "",

   "{{billing_country}}"   : extra?.data?.billing_address?.country != null
                                ? extra?.data?.billing_address?.country
                                : "",

   "{{billing_address_1}}":extra?.data?.billing_address?.address1 != null
                              ? extra?.data?.billing_address?.address1
                              : "",

   "{{billing_city}}"   : extra?.data?.billing_address?.city != null
                          ? extra?.data?.billing_address?.city
                          : "",

   "{{billing_province}}":extra?.data?.billing_address?.province != null
                            ? extra?.data?.billing_address?.province
                            : "",

  "{{billing_province_code}}":extra?.data?.billing_address?.provinceCode != null
                              ? extra?.data?.billing_address?.provinceCode
                              : "",

      "{{billing_zip}}":extra?.data?.billing_address?.zip != null
                          ? extra?.data?.billing_address?.zip
                          : "",
      "{{card_brand_name}}": extra?.data?.payment_details?.payment_instrument_value?.brand,
      "{{last_four_digits}}":extra?.data?.payment_details?.payment_instrument_value?.lastDigits,
      "{{card_expiry_month}}":extra?.data?.payment_details?.payment_instrument_value?.expiryMonth,
      "{{card_expiry_year}}":extra?.data?.payment_details?.payment_instrument_value?.expiryYear,
      "{{heading_text}}": selectedTemplate.headingText,
      "{{card_brand_name}}": extra?.data?.payment_details
                              ?.payment_instrument_value?.brand
                              ? extra?.data?.payment_details?.payment_instrument_value?.brand
                                  .charAt(0)
                                  .toUpperCase() +
                                formatVariableName(
                                  extra?.data?.payment_details?.payment_instrument_value?.brand
                                    .slice(1)
                                    .toLowerCase()
                                )
                              : "",
      "{{{logo_image}}": selectedTemplate.logoUrl,
      "{{shiiping_address_text}}":selectedTemplate.subscriptionShippingAddressText,
      "{{billing_address_text}}": selectedTemplate.subscriptionBillingAddressText,
      "{{payment_method_text}}": selectedTemplate.paymentMethodText,
      "{{logo_width}}": selectedTemplate.logoWidth,
      "{{logo_height}}": selectedTemplate.logoHeight,
      "{{logo_alignment}}": selectedTemplate.logoAlignment,
    };

    if (recipientMails[0]) {
      options = {
        ...options,
        to: recipientMails[0],
      };
      let url;
      if (selectedTemplate?.subscriptionUrl) {
        url = selectedTemplate?.subscriptionUrl;
        } else {
        if (recipientMails[0] == extra?.data?.customer_details?.email) {
           url = url = `https://${shop}/account/login`;
        } else {          
          url = `https://admin.shopify.com/store/${
            shop?.split(".myshopify.com")[0]
          }/apps/revlytic/create-manual-subscription?id=${(extra?.data?.subscription_id)
            .split("/")
            .at(-1)}&mode=view`;
        }
      }
 
      const emailContent = await ejs.renderFile(dirPath + "/preview2.ejs", {
        selectedTemplate,
        templateType,
        currencySymbol,
        data: { ...extra?.data, recipientMails: req?.body?.recipientMails },
        dateConversion,
        url: url,
      });
     
      const updatedEmailContent = emailContent.replace(
        new RegExp(Object.keys(replacements).join("|"), "g"),
        (matched) => replacements[matched]
      );
      options.html = updatedEmailContent;
      try {
       let data = await transporter.sendMail(options);
        if (data) {
          console.log("Mail sent successfully");
        }
        console.log(data, "faaltuu");
      } catch (error) {
        console.log(error, "errorr aa gyaa");
        throw error;
      } 
    }
    if (recipientMails[1]) {      
      options = {
        ...options,
        to: recipientMails[1],
      };

      let url;
      if (selectedTemplate?.subscriptionUrl) {
        url = selectedTemplate?.subscriptionUrl;
         } else {
        if (recipientMails[1] == extra?.data?.customer_details?.email) {
          url = url = `https://${shop}/account/login`;
            } else {
          url = `https://admin.shopify.com/store/${
            shop?.split(".myshopify.com")[0]
          }/apps/revlytic/create-manual-subscription?id=${(extra?.data?.subscription_id)
            .split("/")
            .at(-1)}&mode=view`;
           }
      }

      const emailContent = await ejs.renderFile(dirPath + "/preview2.ejs", {
        selectedTemplate,
        templateType,
        currencySymbol,
        data: { ...extra?.data, recipientMails: req?.body?.recipientMails },
        dateConversion,
        url: url,
      });

      const updatedEmailContent = emailContent.replace(
        new RegExp(Object.keys(replacements).join("|"), "g"),
        (matched) => replacements[matched]
      );
      options.html = updatedEmailContent;
      try {
        let data = await transporter.sendMail(options);
        if (data) {
          console.log("Mail sent successfully");
        }
        console.log(data, "faaltuu");
      } catch (error) {
        console.log(error, "errorr aa gyaa");
        throw error;
      }    
    }
    res.send({ message: "success" });
  } catch (error) {
    console.log("errr-----", error);
    res.send({ message: "error" });
  }
}

export async function getEmailConfigurationData(req, res) {
  try {   
    let shop = res.locals.shopify.session.shop;
    let data = await emailTemplatesModal.findOne(
      { shop: shop },
      { configuration: 1 }
    );
    if (!data) {
      res.send({ message: "no_data", data: "No data found" });
    } else {
      res.send({ message: "success", data: data?.configuration });
    }
  } catch (error) {
    console.log(error);
    res.send({
      message: "error",
      data: "Something went wrong",
    });
  }
}

export async function getPastOrdersDetail(req, res) {
  try {
    let shop = res.locals.shopify.session.shop;
    const desiredStatusValues = ["initial", "success"];
    let data = await billing_Attempt.find(
      {
        shop: shop,
        contract_id: req?.body?.contract_id,
        status: { $in: desiredStatusValues },
      },
      {
        updatedAt: 1,
        order_no: 1,
        contract_products: 1,
        order_id: 1,
        renewal_date: 1,
      }
    );
    if (data.length > 0) {
      res.send({ message: "success", data: data });
    } else {
      res.send({ message: "no_data", data: data });
    }
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error" });
  }
}

export async function getSkippedOrdersDetail(req, res) {
  try {
    let shop = res.locals.shopify.session.shop;
    let data = await billing_Attempt.find(
      { shop: shop, contract_id: req?.body?.contract_id, status: "skipped" },
      {
        updatedAt: 1,
        order_no: 1,
        contract_products: 1,
        order_id: 1,
        renewal_date: 1,
      }
    );   
    if (data.length > 0) {
      res.send({ message: "success", data: data });
    } else {
      res.send({ message: "no_data", data: data });
    }
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error" });
  }
}

export async function getOrdersDataUpcoming(req, res) {
  try {
    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;

    let data = await billing_Attempt.find(
      { shop: shop, contract_id: req?.body?.contract_id },
      {
        renewal_date: 1,
        status: 1,
        idempotencyKey: 1,
        order_no: 1,
        order_id: 1,
      }
    );   
    res.send({ message: "success", data: data });
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error" });
  }
}

export async function orderNow(req, res) {
  try {   
    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
    let data = req?.body?.data;    
    let mutation = subscriptionBillingAttemptCreateMutation;
    const currentDate = new Date().toISOString();
    const uniqueId =  Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    let Input = {
      subscriptionBillingAttemptInput: {
        idempotencyKey: uniqueId,
        originTime: currentDate,
      },
      subscriptionContractId: data.subscription_id,
    };

    let gettoken = await shopModal.findOne({ shop: shop });
    const client = new shopify.api.clients.Graphql({
      session: {
        shop: shop,
        accessToken: gettoken.accessToken,
      },
    });

    let billingAttempt = await client.request(mutation,{
      variables: Input 
    });  

    if (billingAttempt.data.subscriptionBillingAttemptCreate.userErrors.length < 1 ) {  
      if (req.body.nextBillingDate) {
        let updateNextBillingDate =
          await subscriptionDetailsModal.findOneAndUpdate(
            { shop: shop, subscription_id: data.subscription_id },
            {
              $set: {
                nextBillingDate: req?.body?.nextBillingDate,
              },
            }
          );
      
      }

      let saveToBillingAttempt = await billing_Attempt.create({
        shop: shop,
        status: "pending",
        billing_attempt_date: currentDate,
        idempotencyKey: uniqueId,
        renewal_date: req.body.renewal_date,
        contract_products: data.product_details,
        contract_id: data.subscription_id,
        billing_attempt_id:
          billingAttempt.data.subscriptionBillingAttemptCreate
            .subscriptionBillingAttempt.id,
            attemptMode:'orderNow'
      });   
      res.send({ message: "success" });
    }
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function skipOrder(req, res) {
  try {
    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
   
    let data = req?.body?.data;
    if (req.body.nextBillingDate) {
      let updateNextBillingDate =
        await subscriptionDetailsModal.findOneAndUpdate(
          { shop: shop, subscription_id: data.subscription_id },
          {
            $set: {
              nextBillingDate: req?.body?.nextBillingDate,
            },
          }
        );
      
    }

    let result = await billing_Attempt.findOneAndUpdate(
      {
        shop: shop,
        contract_id: data.subscription_id,
        renewal_date: req.body.renewal_date,
      },
      { status: "skipped" },
      { upsert: true, new: true }
    );

    if (result) {
      res.send({ message: "success", data: result });
    }
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error" });
  }
}

export async function retryFailedOrder(req, res) {
  try {   
    console.log("inretryfailed")
    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
    let mutation = subscriptionBillingAttemptCreateMutation;
    const currentDate = new Date().toISOString();
    const uniqueId =  Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    let Input = {
      subscriptionBillingAttemptInput: {
        idempotencyKey: uniqueId,
        originTime: currentDate,
      },
      subscriptionContractId: req.body.subscription_id,
    };

    let gettoken = await shopModal.findOne({ shop: shop });
    const client = new shopify.api.clients.Graphql({
      session: {
        shop: shop,
        accessToken: gettoken.accessToken,
      },
    });

    let billingAttempt = await client.request(mutation,{
     variables: Input
    });

    if (
      billingAttempt.data.subscriptionBillingAttemptCreate.userErrors
        .length < 1
    ) {   

      let updateFailedStatus = await billing_Attempt.findOneAndUpdate(
        {
          shop: shop,
          status: "failed",
          idempotencyKey: req?.body?.idempotencyKey,
          contract_id: req?.body?.subscription_id,
        },
        { $set: { status: "retriedAfterFailure" } }
      );

      let saveToBillingAttempt = await billing_Attempt.create({
        shop: shop,
        status: "pending",
        billing_attempt_date: currentDate,
        idempotencyKey: uniqueId,
        renewal_date: req?.body?.renewal_date,
        contract_products: req?.body?.product_details,
        contract_id: req?.body?.subscription_id,
        billing_attempt_id:
          billingAttempt.data.subscriptionBillingAttemptCreate
            .subscriptionBillingAttempt.id,
            attemptMode:'retriedAfterFailure'
      });

        res.send({ message: "success" });
    } else {    
      res.send({
        message: "userrerror",
        data: billingAttempt.data.subscriptionBillingAttemptCreate
          .userErrors[0].message,
      });
    }
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function upcomingFulfillment(req, res) {
  try {
    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
    let subscription_id = '"' + req?.body?.id + '"';
    let gettoken = await shopModal.findOne({ shop: shop });
   
    const client = new shopify.api.clients.Graphql({
      session: {
        shop: shop,
        accessToken: gettoken.accessToken,
      },
    });

    // const client = new shopify.api.clients.Graphql({ session });

    const data = await client.request(
     `query {
        subscriptionContract(id : ${subscription_id}){
            createdAt
            orders(first : 1, reverse:true){
                edges{
                cursor
                    node{
                        id               
                    }
                }
            }
        }
    }`,
    );

    if (
      data?.data?.subscriptionContract?.orders?.edges[0]?.node?.id != null
    ) {
      let order_id =
        data?.data?.subscriptionContract?.orders?.edges[0]?.node?.id;
      let id = '"' + order_id + '"';
      const orderData = await client.request( `{

      order(id: ${id}){

        id

        name

          lineItems(first:15){

              edges{

                  node{

                      id

                      contract{

                      id

                      }

                  }

              }

          }

      }

  }`,
  );
     

      let orderNumber = orderData?.data?.order?.name;
      let contractIdAndLineItemsData =
        orderData?.data?.order?.lineItems?.edges;

   
      const fulfillmentData = await shopify.api.rest.FulfillmentOrder.all({
        session: {
          shop: shop,
          accessToken: gettoken.accessToken,
        },
        order_id: order_id.split("/").at(-1),
        // status: "scheduled",
      });

      let fulfillmentIdAndLineItemsData = fulfillmentData?.data;
      res.send({
        message: "success",
        data: {
          orderNumber,
          contractIdAndLineItemsData,
          fulfillmentIdAndLineItemsData,
        },
      });
    } else {
      res.send({ message: "no_data" });
    }
    
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error" });
  }
}

export async function fulfillmentOrderRescheduleOrSkip(req, res) {
  try {
    // let session = res.locals.shopify.session;
    // let shop = res.locals.shopify.session.shop;
    let shop = res?.locals?.shopify?.session?.shop
      ? res?.locals?.shopify?.session?.shop
      : req?.body?.shop;
    let client = await getshopToken(shop);
     // const client = new shopify.api.clients.Graphql({ session });

    let mutationQuery = `mutation fulfillmentOrderReschedule($fulfillAt: DateTime!, $id: ID!) {
      fulfillmentOrderReschedule(fulfillAt: $fulfillAt, id: $id) {
        fulfillmentOrder {
         id
         fulfillAt
        }
        userErrors {
          field
          message
        }
      }
    }`;

    const Input = {
      fulfillAt: new Date(req?.body?.fulfill_at)?.toISOString(),
      id: "gid://shopify/FulfillmentOrder/" + req?.body?.id,
    };

    let response = await client.request(mutationQuery,{
      variables: Input 
    });
    
    if (
      response?.data?.fulfillmentOrderReschedule?.userErrors?.length == 0
    ) {
      if (req?.body?.nextBillingDate) {
        
        let updateNextBillingDate =
          await subscriptionDetailsModal.findOneAndUpdate(
            { shop: shop, subscription_id: req?.body?.subscription_id },
            {
              $set: {
                nextBillingDate: req?.body?.nextBillingDate,
              },
            },
            {
              new: true,
            }
          );
       
        return res.send({
          message: "success",
          date: updateNextBillingDate?.nextBillingDate,
        });
      }

      res.send({
        message: "success",
      });
    } else {
      res.send({ message: "usererror" });
    }
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error", data: "Something went wrong" });
  }
}

function findDateRange(data) {
  let dateRange;
  let date;
  if (data.range == "customDate") {
     dateRange = {
      $gte: new Date(new Date(data.customDate).setUTCHours(0, 0, 0, 0)),
      $lte: new Date(new Date(data.customDate).setUTCHours(23, 59, 59, 999)),
    };
  } else if (data.range == "customRange") {
    dateRange = {
      $gte: new Date(new Date(data.startDate).setUTCHours(0, 0, 0, 0)),
      $lte: new Date(new Date(data.endDate).setUTCHours(23, 59, 59, 999)),
    };
  } else if (data.range == "today") {
    dateRange = {
      $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
      $lte: new Date(new Date().setUTCHours(23, 59, 59, 999)),
    };
  } else if (data.range == "yesterday") {
    date = new Date();
    date.setDate(date.getDate() - 1);

    dateRange = {
      $gte: new Date(date.setUTCHours(0, 0, 0, 0)),
      $lte: new Date(date.setUTCHours(23, 59, 59, 999)),
    };
  } else if (data.range == "last7Days") {
     date = new Date();
    date.setDate(date.getDate() - 7);
    dateRange = {
      $gte: new Date(new Date(date).setUTCHours(0, 0, 0, 0)),
      $lt: new Date(new Date().setUTCHours(0, 0, 0, 0)),
    };
  } else if (data.range == "last30Days") {
    date = new Date();
    date.setDate(date.getDate() - 30);
    dateRange = {
      $gte: new Date(date.setUTCHours(0, 0, 0, 0)),
      $lt: new Date(new Date().setUTCHours(0, 0, 0, 0)),
    };
  } else if (data.range == "last90Days") {   
    date = new Date();
    date.setDate(date.getDate() - 90);
    dateRange = {
      $gte: new Date(date.setUTCHours(0, 0, 0, 0)),
      $lt: new Date(new Date().setUTCHours(0, 0, 0, 0)),
    };
  } else if (data.range == "lastmonth") {
    ///this case is used in billing plan page
    date = new Date();
    date.setDate(date.getDate() - 30);
    dateRange = {
      $gte: new Date(date.setUTCHours(23, 59, 59, 99)),
      $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)),
    };
  }
  console.log("daterange", dateRange);
  return dateRange;
}

export async function combinedData(req, res) {
  try {
    let shop = res.locals.shopify.session.shop;
    let dateRange = findDateRange(req.body);
    let data = await billing_Attempt.find(
      {
        shop: shop,
        $or: [{ status: "success" }, { status: "initial" }],
        createdAt: dateRange,
      },
      { new: true, _id: 0, total_amount: 1, currency: 1, status: 1 }
    );
    res.send({ message: "success", data });
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error" });
  }
}

export async function subscriptionBookings(req, res) {
  try {
    let shop = res.locals.shopify.session.shop;
    let dateRange = findDateRange(req.body);
    let data = await subscriptionDetailsModal.countDocuments({
      shop: shop,
      createdAt: dateRange,
    });
    res.send({ message: "success", data });
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error" });
  }
}

export async function activeCustomers(req, res) {
  try {
    let shop = res.locals.shopify.session.shop;
    let dateRange = findDateRange(req.body);
    let data = await subscriptionDetailsModal.countDocuments({
      shop: shop,
      status: "active",
      createdAt: dateRange,
    });
    res.send({ message: "success", data });
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error" });
  }
}

export async function addAnnouncement(req, res) {
  try {
    let shop = res.locals.shopify.session.shop;
    let data = await announcementsModal.create({
      description: req?.body?.description,
      title: req?.body?.title,
      image: req?.body?.image,
      buttonUrl: req?.body?.buttonUrl,
      buttonText: req?.body?.buttonText,
    });
    res.send({ message: "success", data });
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error" });
  }
}

export async function updateAnnouncement(req, res) {
  try {
    let shop = res.locals.shopify.session.shop;
    let data = await announcementsModal.findOneAndUpdate(
      { _id: new ObjectId(req?.body?._id) },
      {
        $set: {
          description: req?.body?.description,
          title: req?.body?.title,
          image: req?.body?.image,
          buttonUrl: req?.body?.buttonUrl,
          buttonText: req?.body?.buttonText,
        },
      },
      {
        new: true,
      }
    );

    if (data) {
      res.send({ message: "success", data });
    } else {
      res.send({ message: "no_data_found" });
    }
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error" });
  }
}

export async function getAnnouncements(req, res) {
  try {
    let shop = res.locals.shopify.session.shop;
    let data = await announcementsModal.find({}).sort({ createdAt: -1 });
    res.send({ message: "success", data });
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error" });
  }
}

export async function deleteAnnouncement(req, res) {
  try {
    let shop = res.locals.shopify.session.shop;
    let data = await announcementsModal.deleteOne({
      _id: new ObjectId(req?.body?._id),
    });

    if (data && data?.deletedCount == 1) {
      res.send({ message: "success", data });
    } else {
      res.send({ message: "no_data_found", data });
    }
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error" });
  }
}

export async function convertStoreProductPriceIntoOrderCurrency( req,res, next) {
  try {
    if (req?.body?.country) {
      let session = res.locals.shopify.session;
      const client = new shopify.api.clients.Graphql({ session });     
      let lines =
        req?.body?.check2 == "createProductSubscriptionEdit"
          ? req?.createProductData?.data
          : req?.body.lines;
      let flag = false;
      const promises = lines.map(async (item, index) => {
        let currencyConversionQuery = `query{
    productVariant(id: "${item?.id}") {
      id
      contextualPricing(context: { country: ${req?.body?.country} }) {
        price {
          amount
        }
      }
    }
  }`;

        try {
          let data = await client.request(currencyConversionQuery);         
          let price = data?.data?.productVariant?.contextualPricing?.price?.amount;
          lines[index]["price"] = price;
          return price;
        } catch (error) {
          console.error(
            `Error fetching data for item at index ${index}: ${error}`
          );
          return null;
        }
      });

      // Wait for all promises to resolve

      Promise.all(promises)
        .then((prices) => {
          if (req?.body?.check2 == "createProductSubscriptionEdit") {          
            req.createProductData.data = lines;
              } else {           
            req.body.lines = lines;
          }
          next();          
        })
        .catch((error) => {
          console.error("Error processing promises:", error);
          throw error;
        });
    } else {
        next();
    }

  } catch (error) {
    console.log("errorr", error);
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function checkAppBlockEmbed(req, res) {
  try {
    let session = res.locals.shopify.session;
    console.log("session",res.locals.shopify.session)
    let storeDetails = await getStoreDetails(res.locals.shopify.session.shop);
    let theme_config_data = await shopify.api.rest.Asset.all({
      session: res.locals.shopify.session,
      theme_id: storeDetails?.themeId,
      asset: { key: "config/settings_data.json"},
    });
    let currentThemeData = JSON.parse(theme_config_data?.data[0]?.value);    
    let blockData=currentThemeData?.current?.blocks;    
    let searchedBlock ;
    if (blockData) {
    searchedBlock=Object?.values(blockData)?.find(
      (item) =>
        item?.type ==
        `shopify://apps/${process.env?.APP_NAME}/blocks/${process.env?.APP_EXTENSION_BLOCK}/${process.env?.SHOPIFY_THEME_APP_EXTENSION_ID}`
    );
    }
   
    if (searchedBlock) {
      res.send({ message: "success", data: searchedBlock });
    } else {
      res.send({ message: "noData", data: {} });
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "error" });
  }
}

export async function recurringBiling(req, res) {
  try {
    const { plan, interval, price } = req.body;
    const session = res.locals.shopify.session;
    const shop = res.locals.shopify.session.shop;
    const API_KEY = process.env.SHOPIFY_API_KEY;
   
    const client = new shopify.api.clients.Graphql({ session });
    let billingInterval = interval == "MONTHLY" ? "EVERY_30_DAYS" : "ANNUAL";
    let testCharge;
    let trialDays =  plan == "premiere" || plan == "starter" || plan == "premium" ? 14 : 0;
    if ( shop == "sahil-shine.myshopify.com" || shop == "sahilnew.myshopify.com") {
      testCharge = true;
    } else {
      testCharge = false;
    }

    const recurringString = `mutation CreateSubscription{
            appSubscriptionCreate(
                name: "${plan}",
      returnUrl: "https://${shop}/admin/apps/${API_KEY}/billing"
                test : ${testCharge}
                trialDays: ${trialDays},
                lineItems: [{
                    plan: {
          appRecurringPricingDetails: {
            price: { amount: ${price}, currencyCode: USD }
            interval: ${billingInterval}
                        }
                    }
                }]
            ){
                userErrors {
                    field
                    message
                }
                confirmationUrl    
                appSubscription {
                    id
                }
            }
        }`;

    const response = await client.request(recurringString);

    if ( response && response?.data?.appSubscriptionCreate?.userErrors.length > 0 ) {
      res.send({message: "error",data: response?.data?.appSubscriptionCreate?.userErrors[0]?.message,});
    } else {
      res.status(200).send({ message: "success", url: response, interval: interval });
    }
  } catch (err) {
    return res.json({ message: "INTERNAL_SERVER_ERROR", err: err.message });
  }
}

export async function recurringBilingSelected(req, res) {
  try {
    const { charge_id } = req.body;
    const shop = res.locals.shopify.session.shop;
    const verifyBilling =
      await shopify.api.rest.RecurringApplicationCharge.find({
        session: res.locals.shopify.session,
        id: charge_id,
      });
   
    if (verifyBilling.status === "active") {
      const updatePlan = await billingModal.findOneAndUpdate(
        { shop },
        {
          charge_id,
          plan: verifyBilling.name,
          price: verifyBilling.price,
          interval: "MONTHLY",
          next_billing: verifyBilling.billing_on,
          activated_on: verifyBilling.activated_on,
        },
        { upsert: true, new: true }
      );

      if (!updatePlan) {
        return res.json({
          message: "something went wrong!!!",
          result: 0,
        });
      } else {
        return res
          .status(202)
          .json({
            message: "success",
            result: 1,
            plan: verifyBilling.name,
            interval: "MONTHLY",
            next_billing: verifyBilling.billing_on,
            activated_on: verifyBilling.activated_on,
          });
      }
    } else {
       res.json({ message: "something went wrong", result: 0 });
    }
  } catch (err) {
    return res.json({ message: "INTERNAL_SERVER_ERROR", err: err.message });
  }
}

export async function getBillingPlanData(req, res) {
   try {
    const shop = res.locals.shopify.session.shop;
    const planData = await billingModal.findOne(
      { shop },
      {
        plan: 1,
        _id: 0,
        next_billing: 1,
        charge_id: 1,
        activated_on: 1,
      }
    );
  
    if(planData && planData.plan !='free'){
      const  charge_id  = planData?.charge_id;      
      const verifyBilling = await shopify.api.rest.RecurringApplicationCharge.find({
                                          session: res.locals.shopify.session,
                                          id: charge_id,
                                        });
      
       res.send({ message: "success", planData: { plan : planData.plan ,charge_id, next_billing: verifyBilling?.billing_on , activated_on: verifyBilling?.activated_on }});
  }
  else{
    res.send({message:'success',planData})
  }
  } catch (error) {
    console.log("errorr", error);
    res.send({ message: "error", data: error?.message });
  }
}

export async function calculateRevenue(req, res) {
  try {
    let shop = res.locals.shopify.session.shop;
    let range = req?.body?.range;    
    new Date(range).setHours(0, 0, 0, 0);
    let data = await billing_Attempt.find(
      {
        shop: shop,
        $or: [{ status: "success" }, { status: "initial" }],
        createdAt: { $gte: range },
      },
      { new: true, _id: 0, total_amount: 1, currency: 1, status: 1 }
    );
    res.send({ message: "success", data });
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error" });
  }
}

export async function deleteRecurringCharge(req, res, next) {
  try {
    let session = res.locals.shopify.session;   
    let data = await shopify.api.rest.RecurringApplicationCharge.delete({
      session: session,
      id: req.body?.charge_id,
    });

    if (Object.keys(data).length == 0) {     
      next();
    } else {
      res.send({ message: "Something went wrong" });
    }
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error" });
  }
}

export async function freePlanActivation(req, res) {
  const shop = res.locals.shopify.session.shop;
  const updatePlan = await billingModal.findOneAndUpdate(
    { shop },
    {
      charge_id: "",
      plan: "free",
      price: 0,
      interval: "",
      next_billing: "",
      activated_on: new Date().toISOString(),
    },
    { upsert: true, new: true }
  );
  if (!updatePlan) {
    return res.json({
      message: "something went wrong!!!",
      result: 0,
    });
  } else {
    return res
      .status(202)
      .json({
        message: "success",
        result: 1,
        plan: updatePlan.plan,
        interval: "",
        next_billing: "",
      });
  }
}

export async function saveDunningData(req,res){
  try{
    const shop = res.locals.shopify.session.shop; 
  const data = await dunningModal.findOneAndUpdate(
    { shop },
    {
     ...req?.body
    },
    { upsert: true, new: true }
  );
  
if(data)
{
  res.send({message: "success"})
}
}
catch(error){
    console.log("error", error);
    res.send({ message: "error" });
}
}

export async function fetchDunningData(req,res){
  try{
    const shop = res.locals.shopify.session.shop;
    const data = await dunningModal.findOne({ shop });
    // stagedUploadsCreateMutation(res.locals.shopify.session)
    // bulk_operationsFinishWebhookSubscription(res.locals.shopify.session)
    // bulkSetNextBillingDateMutation(res.locals.shopify.session,"tmp/67035398448/bulk/b396fd62-7fbc-4c34-a622-057e0c7319a4/Bulk_op_vars")
    //  getBulkOperationUrl(res.locals.shopify.session)
    // upcomingOrders()
    // paymentFailureEmail()  
    // failedPaymentRetryAttempt()
   if(data) 
   {
      res.send({message:"success",data:data})
   }
   else{
    res.send({message:"nodata",data:{}})
   }
}
catch(error)
   {
    console.log("error", error);
    res.send({ message: "error" });
  }
}


export async function getEmailTemplatesCount(req,res){
  try {
       let shop = res.locals.shopify.session.shop;
       let data = await emailTemplatesModal.findOne({ shop: shop } ,{settings:1});
   
    if (data && data.settings) {
      let templatesLength=Object.keys(data.settings).length ;
      res.send({ message: "success", templatesLength });
    } else {
      res.send({ message: "error", data: "No data found" });
    }
  } catch (error) {
    console.log(error);
    res.send({
      message: "error",
      data: "Something went wrong",
    });
  }

}

export async function saveDunningTemplates(req,res){
      try
    {
      let shop=res.locals.shopify.session.shop ;
      let saveTemplatesData=await emailTemplatesModal.findOneAndUpdate(
        { shop},
         {
          $set:{
          'settings.upcomingOrderReminder':  dunningTemplates?.upcomingOrderReminder,
          'settings.standardCourtsyNotice':  dunningTemplates?.standardCourtsyNotice,
          'settings.standardPastDueNotice1': dunningTemplates?.standardPastDueNotice1,
          'settings.standardPastDueNotice2': dunningTemplates?.standardPastDueNotice2,
          'settings.standardPastDueNotice3': dunningTemplates?.standardPastDueNotice3,
          'settings.standardFinalDemand':    dunningTemplates?.standardFinalDemand,
                }
        },{new:true} 
        )                 
     if(saveTemplatesData){
      res.send({message:'success'})
     }
else{
  res.send({message:"error"})
}
  }
 catch(error){
console.log("error",error)
res.send({message:"error"})
 }

}

export async function get_active_pause_cancelSubscription_count(req, res) {
    try {
      let shop = res.locals.shopify.session.shop;
      let dateRange = findDateRange(req.body);     
      let data = await subscriptionDetailsModal.aggregate([
        {
          $match: {
            shop: shop,
            createdAt: dateRange
          }
        },
        {
          $group: {
            _id: null,
            activeCount: { $sum: { $cond: [{ $eq: [{ $toLower: "$status" }, "active"] }, 1, 0] } },
            cancelCount: { $sum: { $cond: [{ $eq: [{ $toLower: "$status" }, "cancelled"] }, 1, 0] } },
            pauseCount: { $sum: { $cond: [{ $eq: [{ $toLower: "$status" }, "paused"] }, 1, 0] } }
          }
        }
      ]);
     
      res.send({ message: "success", data });
    } catch (error) {
      console.log("error", error);
      res.send({ message: "error" });
    }
  }

  export async function get_reccuring_skip_failed_count(req, res) {
    try {
      let shop = res.locals.shopify.session.shop;
      let dateRange = findDateRange(req.body);
      let data = await billing_Attempt.aggregate([
        {
          $match: {
            shop: shop, 
            createdAt: dateRange
          }
        },
        {
          $group: {
            _id: null,
            recurringCount: { $sum: { $cond: [{ $eq: [{ $toLower: "$status" }, "success"] }, 1, 0] } },
            skipCount: { $sum: { $cond: [{ $eq: [{ $toLower: "$status" }, "cancelled"] }, 1, 0] } },
            failedCount: { $sum: { $cond: [ { $or: [ 
              { $eq: [{ $toLower: "$status" }, "failed"] }, 
              { $eq: [{ $toLower: "$status" }, "retriedAfterFailure"] }
            ]}, 1, 0] } }
          }
        }
      ]);    
      res.send({ message: "success", data });
    } catch (error) {
      console.log("error", error);
      res.send({ message: "error" });
    }
  }

  function convertISOtoDate(isoDateString) {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
 
  function findDateRangeNew(data) {
    let dateRange;
    let date;
    let datesArray=[];
    if (data.range == "customDate") {
      datesArray.push({_id:convertISOtoDate(data.customDate),count:0});
      dateRange = {
        $gte: new Date(new Date(data.customDate).setUTCHours(0, 0, 0, 0)),
        $lte: new Date(new Date(data.customDate).setUTCHours(23, 59, 59, 999)),
      };
    } else if (data.range == "customRange") {
      dateRange = {
        $gte: new Date(new Date(data.startDate).setUTCHours(0, 0, 0, 0)),
        $lte: new Date(new Date(data.endDate).setUTCHours(23, 59, 59, 999)),
      };
    } else if (data.range == "today") {
      date = new Date();
      datesArray.push({_id:convertISOtoDate(date),count:0});
      dateRange = {
        $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setUTCHours(23, 59, 59, 999)),
      };
    } else if (data.range == "yesterday") {
      date = new Date();
      date.setDate(date.getDate() - 1);
      datesArray.push({_id:convertISOtoDate(date),count:0});
      dateRange = {
        $gte: new Date(date.setUTCHours(0, 0, 0, 0)),
        $lte: new Date(date.setUTCHours(23, 59, 59, 999)),
      };
     
    } else if (data.range == "last7Days") {
      date = new Date();
      date.setDate(date.getDate() - 7);  
      dateRange = {
        $gte: new Date(new Date(date).setUTCHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setUTCHours(0, 0, 0, 0)),
      };
      
      for (let i = 1; i <=7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        datesArray.push({_id:convertISOtoDate(date),count:0});
      }

    } else if (data.range == "last30Days") {
      
      date = new Date();
      date.setDate(date.getDate() - 30);  
      dateRange = {
        $gte: new Date(date.setUTCHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setUTCHours(0, 0, 0, 0)),
      };
      for (let i = 1; i <= 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        datesArray.push({_id:convertISOtoDate(date),count:0});
      }
    } else if (data.range == "last90Days") {
     
      date = new Date();
      date.setDate(date.getDate() - 90);  
      dateRange = {
        $gte: new Date(date.setUTCHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setUTCHours(0, 0, 0, 0)),
      };

      for (let i = 1; i <= 90; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        datesArray.push({_id:convertISOtoDate(date),count:0});
      }

    } else if (data.range == "lastmonth") {
      ///this case is used in billing plan page
      date = new Date();  
      date.setDate(date.getDate() - 30);  
      dateRange = {
        $gte: new Date(date.setUTCHours(23, 59, 59, 99)),
        $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)),
      };
    }
    return ({dateRange,datesArray});
  }

  export async function get_subscription_details_analytics(req,res){  
    try {
    let shop = res.locals.shopify.session.shop;
    let getData = findDateRangeNew(req.body);
  
    let datesArray=getData.datesArray
    let data= await subscriptionDetailsModal.aggregate([
       {
        $match: {
          shop: shop,
         createdAt:getData.dateRange  
        }
      },     
      {
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
        }
      },    
      {
        $group: {
          _id: "$day",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }])
let uniqueArr=[]
datesArray.map(item=>{
     let existing=data.find(itm=>itm._id == item._id);
     if(!existing){
      uniqueArr.push(item)
     }
}) 
let mergedArr=[...data,...uniqueArr];
mergedArr.sort((a, b) => new Date(a._id) - new Date(b._id));
res.send({message:'success',data:mergedArr})
    }  
   catch(error){
console.log("error",error)
res.send({message:'error'})
   }
 }  

  export async function getSubscriptionsRevenueForAnalytics(){
      try
      {
        let shop=res.locals.shopify.session.shop
        let data=await billing_Attempt.aggregate([
          {
              $group: {
                  _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                  totalRevenue: { $sum: "$revenue" }
              }
          },
          {
              $project: {
                  _id: 0,
                  date: "$_id",
                  totalRevenue: 1
              }
          }
      ])
      }
      catch(error){
        console.log("error",error)
        res.send({message:"error"})
      }
  }

///////////////////////////////////////////////

// export async function getProductVarientsIds(req, res) {
//   let shop = res.locals.shopify.session.shop;
//   let pid = req.body.pid;
//   try {
//     let data = await productsModal.findOne(
//       { shop: shop },
//       { products_data: { $elemMatch: { product_id: pid } } }
//     );
//     let varientIds = [];`
//     data?.products_data[0]?.variants?.map((item) => {
//       varientIds.push(item.id);
//     });
//     let pName = data?.products_data[0]?.product_name;
//     res.send({
//       data: { productName: pName, varientIds: varientIds },
//       message: "success",
//     });
//   } catch (err) {
//     res.send({ message: "Something went wrong" });
//   }
// }

export async function getProductPlanList(req, res) {
  let shop = res.locals.shopify.session.shop;
  let pid = req.body.pid;
  try {
    let data = await planModal.findOne({ shop: shop, plan_group_id: pid });
     res.send({ data: data, message: "success" });
  } catch (err) {
    res.send({ message: "Something went wrong" });
  }
}

export async function addPlansSubscription(req, res) {
  let days = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };
  let months = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };
  let shop = res.locals.shopify.session.shop;
  let session = res.locals.shopify.session;
  const client = new shopify.api.clients.Graphql({ session });
  let list = req.body.plansList;
  let product_id = req.body.pid;
  let productList = req.body.productList;
  const allVariants = productList.reduce((acc, product) => {
    return acc.concat(product.variants);
  }, []);
  let varientIds = [];
  allVariants.map((item) => {
    varientIds.push(item.id);
  });
  let allOptions = [];
  list?.map((item) => {
    let unique =
      Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    allOptions?.push(
      item?.billingEvery + " " + item?.billingEveryType + " " + unique
    );
  });
  const topOptions = allOptions.join(",");

  let sellPlan = [];
  list?.map((item) => {
    let unique = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);

    let draftAnchors = [];
    // if (item.billingEveryType != "day") {
    //   item.billingEveryType == "week" &&
    //     draftAnchors.push({ day: days[item.billingWeek], type: "WEEKDAY" });
    //   item.billingEveryType == "month" &&
    //     draftAnchors.push({
    //       day: parseInt(item.billingMonth),
    //       type: "MONTHDAY",
    //     });

    //   item.billingEveryType == "year" &&
    //     draftAnchors.push({
    //       day: parseInt(item.billingMonth),
    //       month: months[item.billingYear],
    //       type: "YEARDAY",
    //     });
    // }

    let pricingPolicy = [];
    if (item.offerDiscount) {
      if (item.freeTrial) {
        if (item.priceType == "percentage") {
          pricingPolicy.push(
            {
              fixed: {
                adjustmentType: "PERCENTAGE",
                adjustmentValue: {
                  percentage: parseFloat(100),
                },
              },
            },
            {
              recurring: {
                adjustmentType: "PERCENTAGE",
                adjustmentValue: {
                  percentage: parseFloat(item.price),
                },
                afterCycle: parseInt(1),
                // afterCycle: parseInt(item.trialCount),
              },
            }
          );
        } else if (item.priceType == "fixed") {
          pricingPolicy.push(
            {
              fixed: {
                adjustmentType: "PERCENTAGE",
                adjustmentValue: {
                  percentage: parseFloat(100),
                },
              },
            },
            {
              recurring: {
                adjustmentType: "FIXED_AMOUNT",
                adjustmentValue: {
                  fixedValue: parseFloat(item.price),
                },
                // afterCycle: parseInt(item.trialCount),
                afterCycle: parseInt(1),
              },
            }
          );
        }
      } else {
        if (item.priceType == "percentage") {
          pricingPolicy.push({
            fixed: {
              adjustmentType: "PERCENTAGE",
              adjustmentValue: {
                percentage: parseFloat(item.price),
              },
            },
          });
        } else if (item.priceType == "fixed") {
          pricingPolicy.push({
            fixed: {
              adjustmentType: "FIXED_AMOUNT",
              adjustmentValue: {
                fixedValue: parseFloat(item.price),
              },
            },
          });
        }
      }
    } else {
      if (item.freeTrial) {
        pricingPolicy.push(
          {
            fixed: {
              adjustmentType: "PERCENTAGE",
              adjustmentValue: {
                percentage: parseFloat(100),
              },
            },
          },
          {
            recurring: {
              adjustmentType: "PERCENTAGE",
              adjustmentValue: {
                percentage: parseFloat(0),
              },
              afterCycle: parseInt(1),
              // afterCycle: parseInt(item.trialCount),
            },
          }
        );
      }
      // else {
      //   if (item.priceType == "percentage") {
      //     pricingPolicy.push({
      //       fixed: {
      //         adjustmentType: "PERCENTAGE",
      //         adjustmentValue: {
      //           percentage: parseFloat(item.price),
      //         },
      //       },
      //     });
      //   } else if (item.priceType == "fixed") {
      //     pricingPolicy.push({
      //       fixed: {
      //         adjustmentType: "FIXED_AMOUNT",
      //         adjustmentValue: {
      //           fixedValue: parseFloat(item.price),
      //         },
      //       },
      //     });
      //   }
      // }
    }

    sellPlan.push({
      name: req.body.planGroupName + "-" + item.planName,
      options: item?.billingEvery + " " + item?.billingEveryType + "" + unique,
      position: 1,
      category: "SUBSCRIPTION",
      inventoryPolicy: {
        reserve: "ON_FULFILLMENT",
      },
      billingPolicy: {
        recurring: {
          anchors: draftAnchors,
          interval: item.billingEveryType.toUpperCase(),
          intervalCount: parseInt(item.billingEvery),
          minCycles: item?.minCycle ? parseInt(item?.minCycle) : 1,
          ...(item.billingCycle
            ? item?.maxCycle
              ? { maxCycles: parseInt(item?.maxCycle) }
              : {}
            : item?.planType == "prepaid" && item?.billingCycle == false
            ? { maxCycles: 1 }
            : {}),
        },
      },

      deliveryPolicy: {
        recurring: {
          intent: "FULFILLMENT_BEGIN",
          anchors: draftAnchors,
          preAnchorBehavior: "ASAP",
          interval: item.billingEveryType.toUpperCase(),
          intervalCount:
            item.planType != "prepaid"
              ? parseInt(item.billingEvery)
              : parseInt(item.deliveryEvery),
        },
      },
      pricingPolicies: pricingPolicy,
    });
  });
 
  const Input = {
    input: {
      appId: "SdSubscriptionApp2k23virga22luck",
      merchantCode: req.body.planGroupName,
      name: req.body.planGroupName,
      options: [topOptions],
      position: 10,
      sellingPlansToCreate: sellPlan,
    },
    resources: { productVariantIds: varientIds },
  };
  
  const mutationQuery = `
  mutation sellingPlanGroupCreate($input: SellingPlanGroupInput!,$resources:SellingPlanGroupResourceInput) {
    sellingPlanGroupCreate(input: $input,resources:$resources) {
      sellingPlanGroup {
        id
        appId
        sellingPlans(first: 30) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
  
  `;

  let productCreatemutation = `mutation productCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
      }

      userErrors {
        field
        message
      }
    }
  }
  `;

  try {
    let response = await client.request(mutationQuery,{
     variables: Input 
    });

    if (response.data.sellingPlanGroupCreate.userErrors.length < 1) {
      
      let planGroupId =
        response.data.sellingPlanGroupCreate.sellingPlanGroup.id;
      let planIds =
        response.data.sellingPlanGroupCreate.sellingPlanGroup.sellingPlans
          .edges;

      let planDetails = [];
      await Promise.all(
        list.map(async (item, index) => {
         
          let Input = {
            input: {
              requiresSellingPlan: false,
              status: "ACTIVE",
              title: item.planName + " " + "(setup fee product)",
              variants: [
                {
                  price: item.setupPrice,
                  requiresShipping: false,
                  sku: "1",
                  taxable: false,
                },
              ],
            },
          };
          let obj = {
            planName: item.planName,
            plan_id: planIds[index].node.id,
            // plan_id: planIds.map((entries) => {
            //   if (entries.node.name == item.name) {
            //     return (
            //       entries.node.id
            //     )
            //   }
            // }),

            billingCycle: item.billingCycle,
            billingEvery: item.billingEvery,
            billingEveryType: item.billingEveryType,
            setupFee: item.setupFee,
            offerDiscount: item.offerDiscount,
            priceType: item.priceType,
            price: item.price,
            freeTrial: item.freeTrial,
            startDate: new Date(item.startDate),
            minCycle: item.minCycle,
            maxCycle: item.maxCycle,
            planType: item.planType,
            deliveryEvery: item.deliveryEvery,
          };
          if (item.freeTrial) {
            obj.trialCount = item.trialCount;
            obj.freeTrialCycle = item.freeTrialCycle;
          }

          // item.billingCycle == "cancel_after"
          //   ? (obj.billingCycleCount = item.billingCycleCount)
          //   : "";
          // if (item.billingEveryType != "day") {
          //   if (item.billingEveryType == "week") {
          //     obj.billingWeek = item.billingWeek;
          //   } else if (item.billingEveryType == "month") {
          //     obj.billingMonth = item.billingMonth;
          //   } else if (item.billingEveryType == "year") {
          //     obj.billingMonth = item.billingMonth;
          //     obj.billingYear = item.billingYear;
          //   }
          // }

          if (item.setupFee) {
            try {
              obj.setupPrice = item.setupPrice;
              let createProduct = await client.request(productCreatemutation,{
                variables: Input
              });
             
              let createdProductId =
                createProduct.data.productCreate.product.id;
              obj.setupProductId = createdProductId;
              planDetails.push(obj);
            } catch (err) {
              console.log(err.response.errors);
            }
          } else {
            planDetails.push(obj);
          }

        })
      );


      let object = {
        shop: shop,
        plan_group_name: req.body.planGroupName,
        plan_group_id: planGroupId,
        product_details: req.body.productList,
        plans: planDetails,
      };

      try {
        
        let saveData = await planModal.create(object);
         if (saveData) {
          res.send({ message: "success", data: response });
        }
      } catch (error) {
        res.send({ message: "error", data: "Db error" });
      }
    } else if (
      response.data.sellingPlanGroupCreate.userErrors.length > 0
    ) {      
      res.send({
        message: "userError",
        data: response.data.sellingPlanGroupCreate.userErrors,
      });
    }
  } catch (error) {
    res.send({ message: "error", data: "Something went wrong" });
    console.log(error, "error");
  }
}

///**********************/// function to update the existing selling plan group
export async function updatePlanGroup(req, res) {
  let shop = res.locals.shopify.session.shop;
  let session = res.locals.shopify.session;
  const client = new shopify.api.clients.Graphql({ session });
  
  let days = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };
  let months = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };
  let pid = req.body.pid;
  // let pName = req.body.ids.productName;

  let productList = req.body.productList;
  // let varientIds = req.body.ids.varientIds;
  let initialplans = req.body.initialPlans;
  let editedArrayId = req.body.editedArrayIds;
  let editedArrayIds = [...new Set(editedArrayId)];
  let deletedSetupProducts = req.body.deletedSetupProducts;

  let newPlans = req.body.newPlans;
  let deletedPlans = req.body.deletedPlans;
 
  let dbproductlist = req.body.dbvarient;
  const allVariants = productList.reduce((acc, product) => {
    return acc.concat(product.variants);
  }, []);
  let varientIds = [];
  allVariants.map((item) => {
    varientIds.push(item.id);
  });

  const alldbvarients = dbproductlist.reduce((acc, product) => {
    return acc.concat(product.variants);
  }, []);
  let dbvarientIds = [];
  alldbvarients.map((item) => {
    dbvarientIds.push(item.id);
  });

  const variantsToDelete = dbvarientIds.filter((x) => !varientIds.includes(x));
  const varientToAdd = varientIds.filter((x) => !dbvarientIds.includes(x));

  let allOptions = [];
  newPlans?.map((item) => {
    let unique = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);

    allOptions?.push(item?.billingEvery + " " + item?.billingEveryType + " " + unique );
  });

  initialplans?.map((item) => {
    allOptions?.push(item?.billingEvery + " " + item?.billingEveryType);
  });
  
  const topOptions = allOptions.join(",");
 
  ///**********************/// array of new selling plans to be created for update selling plan group mutation
  let sellPlan = [];
  newPlans.length > 0 &&
    newPlans?.map((item) => {
      let unique =
        Date.now().toString(36) + Math.random().toString(36).substring(2, 5);

      let draftAnchors = [];
      // if (item.billingEveryType != "day") {
      //   item.billingEveryType == "week" &&
      //     draftAnchors.push({ day: days[item.billingWeek], type: "WEEKDAY" });
      //   item.billingEveryType == "month" &&
      //     draftAnchors.push({
      //       day: parseInt(item.billingMonth),
      //       type: "MONTHDAY",
      //     });

      //   item.billingEveryType == "year" &&
      //     draftAnchors.push({
      //       day: parseInt(item.billingMonth),
      //       month: months[item.billingYear],
      //       type: "YEARDAY",
      //     });
      // }

      let pricingPolicy = [];

      // item.offerDiscount &&
      //   item.priceType == "percentage" &&
      //   pricingPolicy.push({
      //     fixed: {
      //       adjustmentType: "PERCENTAGE",
      //       adjustmentValue: {
      //         percentage: parseFloat(item.price),
      //       },
      //     },
      //   });

      // item.offerDiscount &&
      //   item.priceType == "fixed" &&
      //   pricingPolicy.push({
      //     fixed: {
      //       adjustmentType: "FIXED_AMOUNT",
      //       adjustmentValue: {
      //         fixedValue: parseFloat(item.price),
      //       },
      //     },
      //   });

      if (item.offerDiscount) {
        if (item.freeTrial) {
          if (item.priceType == "percentage") {
            pricingPolicy.push(
              {
                fixed: {
                  adjustmentType: "PERCENTAGE",
                  adjustmentValue: {
                    percentage: parseFloat(100),
                  },
                },
              },
              {
                recurring: {
                  adjustmentType: "PERCENTAGE",
                  adjustmentValue: {
                    percentage: parseFloat(item.price),
                  },
                  afterCycle: parseInt(1),
                  // afterCycle: parseInt(item.trialCount),
                },
              }
            );
          } else if (item.priceType == "fixed") {
            pricingPolicy.push(
              {
                fixed: {
                  adjustmentType: "PERCENTAGE",
                  adjustmentValue: {
                    percentage: parseFloat(100),
                  },
                },
              },
              {
                recurring: {
                  adjustmentType: "FIXED_AMOUNT",
                  adjustmentValue: {
                    fixedValue: parseFloat(item.price),
                  },
                  // afterCycle: parseInt(item.trialCount),
                  afterCycle: parseInt(1),
                },
              }
            );
          }
        } else {
          if (item.priceType == "percentage") {
            pricingPolicy.push({
              fixed: {
                adjustmentType: "PERCENTAGE",
                adjustmentValue: {
                  percentage: parseFloat(item.price),
                },
              },
            });
          } else if (item.priceType == "fixed") {
            pricingPolicy.push({
              fixed: {
                adjustmentType: "FIXED_AMOUNT",
                adjustmentValue: {
                  fixedValue: parseFloat(item.price),
                },
              },
            });
          }
        }
      } else {
        if (item.freeTrial) {
          pricingPolicy.push(
            {
              fixed: {
                adjustmentType: "PERCENTAGE",
                adjustmentValue: {
                  percentage: parseFloat(100),
                },
              },
            },
            {
              recurring: {
                adjustmentType: "PERCENTAGE",
                adjustmentValue: {
                  percentage: parseFloat(0),
                },
                // afterCycle: parseInt(item.trialCount),
                afterCycle: parseInt(1),
              },
            }
          );
        }
        // else {
        //   if (item.priceType == "percentage") {
        //     pricingPolicy.push({
        //       fixed: {
        //         adjustmentType: "PERCENTAGE",
        //         adjustmentValue: {
        //           percentage: parseFloat(item.price),
        //         },
        //       },
        //     });
        //   } else if (item.priceType == "fixed") {
        //     pricingPolicy.push({
        //       fixed: {
        //         adjustmentType: "FIXED_AMOUNT",
        //         adjustmentValue: {
        //           fixedValue: parseFloat(item.price),
        //         },
        //       },
        //     });
        //   }
        // }
      }

      sellPlan.push({
        name: req.body.planGroupName + "-" + item.planName,
        options:
          item?.billingEvery + " " + item?.billingEveryType + " " + unique,
        position: 1,
        category: "SUBSCRIPTION",
        inventoryPolicy: {
          reserve: "ON_FULFILLMENT",
        },
        billingPolicy: {
          recurring: {
            anchors: draftAnchors,
            interval: item.billingEveryType.toUpperCase(),
            intervalCount: parseInt(item.billingEvery),
            minCycles: item.minCycle ? parseInt(item.minCycle) : 1,
            ...(item.billingCycle
              ? item?.maxCycle
                ? { maxCycles: parseInt(item?.maxCycle) }
                : {}
              : item?.planType == "prepaid" && item?.billingCycle == false
              ? { maxCycles: 1 }
              : {}),
          },
        },
        deliveryPolicy: {
          recurring: {
            intent: "FULFILLMENT_BEGIN",
            anchors: draftAnchors,
            preAnchorBehavior: "ASAP",
            interval: item.billingEveryType.toUpperCase(),
            // intervalCount: parseInt(item.billingEvery),
            intervalCount:
              item.planType != "prepaid"
                ? parseInt(item.billingEvery)
                : parseInt(item.deliveryEvery),
          },
        },
        pricingPolicies: pricingPolicy,
      });
    });
  console.log(sellPlan, "selllplannnnn");
  ///**********************/// making array of plans to update in selling plan group
  let sellPlanToUpdate = [];

  editedArrayIds.length > 0 &&
    editedArrayIds?.map((item) => {
      let unique =
        Date.now().toString(36) + Math.random().toString(36).substring(2, 5);

      let draftAnchors = [];
      // if (initialplans[item].billingEveryType != "day") {
      //   initialplans[item].billingEveryType == "week" &&
      //     draftAnchors.push({
      //       day: days[initialplans[item.billingWeek]],
      //       type: "WEEKDAY",
      //     });
      //   initialplans[item].billingEveryType == "month" &&
      //     draftAnchors.push({
      //       day: parseInt(initialplans[item].billingMonth),
      //       type: "MONTHDAY",
      //     });

      //   initialplans[item].billingEveryType == "year" &&
      //     draftAnchors.push({
      //       day: parseInt(initialplans[item].billingMonth),
      //       month: months[initialplans[item].billingYear],
      //       type: "YEARDAY",
      //     });
      // }

      let pricingPolicy = [];

      // initialplans[item].offerDiscount &&
      //   initialplans[item].priceType == "percentage" &&
      //   pricingPolicy.push({
      //     fixed: {
      //       adjustmentType: "PERCENTAGE",
      //       adjustmentValue: {
      //         percentage: parseFloat(initialplans[item].price),
      //       },
      //     },
      //   });

      // initialplans[item].offerDiscount &&
      //   initialplans[item].priceType == "fixed" &&
      //   pricingPolicy.push({
      //     fixed: {
      //       adjustmentType: "FIXED_AMOUNT",
      //       adjustmentValue: {
      //         fixedValue: parseFloat(initialplans[item].price),
      //       },
      //     },
      //   });

      if (initialplans[item].offerDiscount) {
        if (initialplans[item].freeTrial) {
          if (initialplans[item].priceType == "percentage") {
            pricingPolicy.push(
              {
                fixed: {
                  adjustmentType: "PERCENTAGE",
                  adjustmentValue: {
                    percentage: parseFloat(100),
                  },
                },
              },
              {
                recurring: {
                  adjustmentType: "PERCENTAGE",
                  adjustmentValue: {
                    percentage: parseFloat(initialplans[item].price),
                  },
                  // afterCycle: parseInt(initialplans[item].trialCount),
                  afterCycle: parseInt(1),
                },
              }
            );
          } else if (initialplans[item].priceType == "fixed") {
            pricingPolicy.push(
              {
                fixed: {
                  adjustmentType: "PERCENTAGE",
                  adjustmentValue: {
                    percentage: parseFloat(100),
                  },
                },
              },
              {
                recurring: {
                  adjustmentType: "FIXED_AMOUNT",
                  adjustmentValue: {
                    fixedValue: parseFloat(initialplans[item].price),
                  },
                  // afterCycle: parseInt(initialplans[item].trialCount),
                  afterCycle: parseInt(1),
                },
              }
            );
          }
        } else {
          if (initialplans[item].priceType == "percentage") {
            pricingPolicy.push({
              fixed: {
                adjustmentType: "PERCENTAGE",
                adjustmentValue: {
                  percentage: parseFloat(initialplans[item].price),
                },
              },
            });
          } else if (initialplans[item].priceType == "fixed") {
            pricingPolicy.push({
              fixed: {
                adjustmentType: "FIXED_AMOUNT",
                adjustmentValue: {
                  fixedValue: parseFloat(initialplans[item].price),
                },
              },
            });
          }
        }
      } else {
        if (initialplans[item].freeTrial) {
          pricingPolicy.push(
            {
              fixed: {
                adjustmentType: "PERCENTAGE",
                adjustmentValue: {
                  percentage: parseFloat(100),
                },
              },
            },
            {
              recurring: {
                adjustmentType: "PERCENTAGE",
                adjustmentValue: {
                  percentage: parseFloat(0),
                },
                // afterCycle: parseInt(initialplans[item].trialCount),
                afterCycle: parseInt(1),
              },
            }
          );
        }
        // else {
        //   if (initialplans[item].priceType == "percentage") {
        //     pricingPolicy.push({
        //       fixed: {
        //         adjustmentType: "PERCENTAGE",
        //         adjustmentValue: {
        //           percentage: parseFloat(initialplans[item].price),
        //         },
        //       },
        //     });
        //   } else if (initialplans[item].priceType == "fixed") {
        //     pricingPolicy.push({
        //       fixed: {
        //         adjustmentType: "FIXED_AMOUNT",
        //         adjustmentValue: {
        //           fixedValue: parseFloat(initialplans[item].price),
        //         },
        //       },
        //     });
        //   }
        // }
      }

      sellPlanToUpdate.push({
        name: req.body.planGroupName + "-" + initialplans[item].planName,
        id: initialplans[item].plan_id,
        options:
          initialplans[item]?.billingEvery +
          " " +
          initialplans[item]?.billingEveryType +
          " " +
          unique,
        position: 1,
        category: "SUBSCRIPTION",
        inventoryPolicy: {
          reserve: "ON_FULFILLMENT",
        },
        billingPolicy: {
          recurring: {
            anchors: draftAnchors,
            interval: initialplans[item].billingEveryType.toUpperCase(),
            intervalCount: parseInt(initialplans[item].billingEvery),
            minCycles: initialplans[item].minCycle
              ? parseInt(initialplans[item].minCycle)
              : 1,
            ...(initialplans[item].billingCycle
              ? initialplans[item].maxCycle
                ? { maxCycles: parseInt(initialplans[item].maxCycle) }
                : {}
              : initialplans[item]?.planType == "prepaid" &&
                initialplans[item]?.billingCycle == false
              ? { maxCycles: 1 }
              : {}),
          },
        },
        deliveryPolicy: {
          recurring: {
            intent: "FULFILLMENT_BEGIN",
            anchors: draftAnchors,
            preAnchorBehavior: "ASAP",
            interval: initialplans[item].billingEveryType.toUpperCase(),
            // intervalCount: parseInt(initialplans[item].billingEvery),
            intervalCount:
              initialplans[item].planType != "prepaid"
                ? parseInt(initialplans[item].billingEvery)
                : parseInt(initialplans[item].deliveryEvery),
          },
        },
        pricingPolicies: pricingPolicy,
      });
    });

  ///**********************///  input variable for update sellingplan group mutaion

  const Input = {
    id: pid,
    input: {
      appId: "SdSubscriptionApp2k23virga22luck",
      merchantCode: req.body.planGroupName,
      name: req.body.planGroupName,
      options: [topOptions],
    },
  };
  sellPlan.length > 0 && (Input.input.sellingPlansToCreate = sellPlan);

  deletedPlans.length > 0 && (Input.input.sellingPlansToDelete = deletedPlans);

  sellPlanToUpdate.length > 0 &&
    (Input.input.sellingPlansToUpdate = sellPlanToUpdate);

  const mutationQuery = `
  mutation sellingPlanGroupUpdate($id: ID!, $input: SellingPlanGroupInput!) {
    sellingPlanGroupUpdate(id: $id, input: $input) {
      deletedSellingPlanIds
      sellingPlanGroup {
        id
        name
        sellingPlans(first:31){
          edges{
            node{
              id
              name
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }`;

  const varientDelete = `mutation sellingPlanGroupRemoveProductVariants($id: ID!, $productVariantIds: [ID!]!) {
    sellingPlanGroupRemoveProductVariants(id: $id, productVariantIds: $productVariantIds) {
      removedProductVariantIds
      userErrors {
        field
        message
      }
    }
  }`;

  const varientAdd = `mutation sellingPlanGroupAddProductVariants($id: ID!, $productVariantIds: [ID!]!) {
    sellingPlanGroupAddProductVariants(id: $id, productVariantIds: $productVariantIds) {
      sellingPlanGroup {
id      }
      userErrors {
        field
        message
      }
    }
  }
  `;
  let productCreatemutation = `mutation productCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
      }

      userErrors {
        field
        message
      }
    }
  }
  `;

  let productUpdate = `mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
  `;

  let productDelete = `mutation productDelete($input: ProductDeleteInput!) {
    productDelete(input: $input) {
      deletedProductId
      shop {
       id
      }
      userErrors {
        field
        message
      }
    }
  }`;

  try {
    ///**********************/// update selling plan group mutation is fired here
   
    let response = await client.request(mutationQuery,{
      variables: Input 
    });    

    if (response.data.sellingPlanGroupUpdate.userErrors.length > 0) {
      res.send({
        message: "userError",
        data: response.data.sellingPlanGroupUpdate.userErrors,
      });
    } else {
      var planIds =
        response.data.sellingPlanGroupUpdate.sellingPlanGroup.sellingPlans
          .edges;
      res.send({ message: "success", data: response.data });

      if (variantsToDelete.length > 0) {
        try {
          let response1 = await client.request(varientDelete,{
             variables: {
                id: pid,
                productVariantIds: variantsToDelete,
              },           
          });
          
        } catch (err) {
          console.log(err, "varientTodel");
        }
      }

      if (varientToAdd.length > 0) {
        try {
          let response2 = await client.request(varientAdd,{
              variables: {
                id: pid,
                productVariantIds: varientToAdd,
              },          
          });          
        } catch (err) {
          console.log(err.response.errors, "varientToAdd");
        }
      }
    }
  } catch (err) {
    console.log(err, "rrrrrrrrr");
  }

  let planDetails = [];
  await Promise.all(
    newPlans.map(async (item, index) => {
      let Input = {
        input: {
          requiresSellingPlan: false,
          status: "ACTIVE",
          title:
            req.body.planGroupName +
            "-" +
            item.planName +
            " " +
            "(setup fee product)",
          variants: [
            {
              price: item.setupPrice,
              requiresShipping: false,
              sku: "1",
              taxable: false,
            },
          ],
        },
      };
      let len = initialplans.length;
      console.log(planIds, len, "trmm");
      let obj = {
        planName: item.planName,
        plan_id: planIds[len + index]?.node?.id,
        billingCycle: item.billingCycle,
        billingEvery: item.billingEvery,
        billingEveryType: item.billingEveryType,
        setupFee: item.setupFee,
        offerDiscount: item.offerDiscount,
        priceType: item.priceType,
        price: item.price,
        freeTrial: item.freeTrial,
        startDate: new Date(item.startDate),
        minCycle: item.minCycle,
        maxCycle: item.maxCycle,
        planType: item.planType,
        deliveryEvery: item.deliveryEvery,
      };
      if (item.freeTrial) {
        obj.trialCount = item.trialCount;
        obj.freeTrialCycle = item.freeTrialCycle;
      }

      // item.billingCycle == "cancel_after"
      //   ? (obj.billingCycleCount = item.billingCycleCount)
      //   : "";
      // if (item.billingEveryType != "day") {
      //   if (item.billingEveryType == "week") {
      //     obj.billingWeek = item.billingWeek;
      //   } else if (item.billingEveryType == "month") {
      //     obj.billingMonth = item.billingMonth;
      //   } else if (item.billingEveryType == "year") {
      //     obj.billingMonth = item.billingMonth;
      //     obj.billingYear = item.billingYear;
      //   }
      // }

      if (item.setupFee) {
        try {
          obj.setupPrice = item.setupPrice;
          let createProduct = await client.request(productCreatemutation,{
             variables: Input 
          });
          
          let createdProductId =
            createProduct.data.productCreate.product.id;
          obj.setupProductId = createdProductId;
        } catch (err) {
          console.log(err);
        }
      }
      planDetails.push(obj);
      })
  );
 
  let updatedPlans = [];
  ///**********************/// previous existing plans to update
  await Promise.all(
    initialplans.map(async (item, index) => {
      let Input = {
        input: {
          requiresSellingPlan: false,
          status: "ACTIVE",
          title: item.planName + " " + "(setup fee product)",
          variants: [
            {
              price: item.setupPrice,
              requiresShipping: false,
              sku: "1",
              taxable: false,
            },
          ],
        },
      };
      let updateInput = {
        input: {
          id: item.setupProductId,
          requiresSellingPlan: false,
          status: "ACTIVE",
          title: item.planName + " " + "(setup fee product)",
          variants: [
            {
              price: item.setupPrice,
              requiresShipping: false,
              sku: "1",
              taxable: false,
            },
          ],
        },
      };
      
      let obj = {
        planName: item.planName,
        plan_id: item.plan_id,
        billingCycle: item.billingCycle,
        billingEvery: item.billingEvery,
        billingEveryType: item.billingEveryType,
        setupFee: item.setupFee,
        offerDiscount: item.offerDiscount,
        priceType: item.priceType,
        price: item.price,
        freeTrial: item.freeTrial,
        startDate: new Date(item.startDate),
        minCycle: item.minCycle,
        maxCycle: item.maxCycle,
        planType: item.planType,
        deliveryEvery: item.deliveryEvery,
      };
      item.setupProductId ? (obj.setupProductId = item.setupProductId) : "";
      if (item.freeTrial) {
        obj.trialCount = item.trialCount;
        obj.freeTrialCycle = item.freeTrialCycle;
      }
      // item.billingCycle == "cancel_after"
      //   ? (obj.billingCycleCount = item.billingCycleCount)
      //   : "";
      // if (item.billingEveryType != "day") {
      //   if (item.billingEveryType == "week") {
      //     obj.billingWeek = item.billingWeek;
      //   } else if (item.billingEveryType == "month") {
      //     obj.billingMonth = item.billingMonth;
      //   } else if (item.billingEveryType == "year") {
      //     obj.billingMonth = item.billingMonth;
      //     obj.billingYear = item.billingYear;
      //   }
      // }

      if (item.setupFee) {
        obj.setupPrice = item.setupPrice;
        
        ///**********************/// check if updated plan has setup fee enabled
        try {
          let check = await planModal.findOne(
            {
              shop: shop,
              plan_group_id: pid,
            },
            {
              plans: { $elemMatch: { plan_id: item.plan_id } },
            }
          );
         
          if (check.plans[0].setupProductId) {

            ///**********************/// check if plan also contains previous setup fee then update setup fee product
          
            if (check.plans[0].setupPrice != item.setupPrice) {
           
              let updatedetails = await client.request(productUpdate,{
                 variables: updateInput 
              });              
            }
          } else {
           
            ///**********************/// if plan doesn't contain previously setup fee create new product for setup fee
            try {
              let createProduct = await client.request(productCreatemutation,{
                variables: Input 
              });            
              let createdProductId =
                createProduct.data.productCreate.product.id;
              obj.setupProductId = createdProductId;
            } catch (err) {}
          }
        } catch (err) {}
      } else {
       
        try {
          let check = await planModal.findOne(
            {
              shop: shop,
              plan_group_id: pid,
              plans: { $elemMatch: { plan_id: item.plan_id } },
            },
            { plans: 1 }
          );
         
          if (check.plans[0].setupProductId) {
            let deleteSetupProduct = await client.request(productDelete,{
                 variables: {
                  input: {
                    id: check.plans[0].setupProductId,
                  },
                },
               });

            delete obj.setupProductId;
            // updatedPlans.push(obj);
          }
        } catch (err) {
          console.log(err);
        }
      }
      updatedPlans.push(obj);
    })
  );
 
  if (deletedSetupProducts.length > 0) {
    deletedSetupProducts.map(async (item) => {
      let deleteSetupProduct = await client.request(productDelete,{
           variables: {
            input: {
              id: item,
            },
          },
         });
    });
  }

  try {
    let data = await planModal.findOneAndUpdate(
      { shop: shop, plan_group_id: pid },
      {
        $set: {
          plans: planDetails.concat(updatedPlans),
          product_details: productList,
          plan_group_name: req.body.planGroupName,
        },
      }
    );
   
  } catch (err) {
    console.log(err, "errrrorrr");
  }
}

export async function deleteSellingPlanGroup(req, res, next) {
  ///**********************/// function to delete selling plan group
  let shop = res.locals.shopify.session.shop;
  let session = res.locals.shopify.session;
  const client = new shopify.api.clients.Graphql({ session });
  const planId = {
    id: req.body.id,
  };

  const mutationQuery = `
  mutation sellingPlanGroupDelete($id: ID!) {
    sellingPlanGroupDelete(id: $id) {
      deletedSellingPlanGroupId
      userErrors {
        field
        message
      }
    }
  }`;

  try {
    let response = await client.request(mutationQuery,{
                              variables: planId 
                              });
    if (response.data.sellingPlanGroupDelete.userErrors.length > 0) {
      res.send({
        message: "userError",
        data: response.data.sellingPlanGroupDelete.userErrors,
      });
    } else {
      next();
    }
  } catch (err) {
    res.send({ message: "error", data: "Something went wrong1" });
  }
}

export async function findAndDeleteSetupProducts(req, res, next) {
  let shop = res.locals.shopify.session.shop;
  let session = res.locals.shopify.session;
  const client = new shopify.api.clients.Graphql({ session });
  let productDelete = `mutation productDelete($input: ProductDeleteInput!) {
    productDelete(input: $input) {
      deletedProductId
      shop {
       id
      }
      userErrors {
        field
        message
      }
    }
  }`;
  try {
    let details = await planModal.findOne(
      { shop: shop, plan_group_id: req.body.id },
      { plans: 1 }
    );
    if (details) {
      
      let arr = [];
      details.plans.map((item) => {
        if (item?.setupProductId) {
          arr.push(item?.setupProductId);
        }
      });
     
      if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          let deleteSetupProduct = await client.request(productDelete,{
              variables: {
                input: {
                  id: arr[i],
                }            
            },
          });
        }
        next();
      } else {
        next();
      }
    }
  } catch (err) {
    console.log(err, "checkthis");
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function deletePlanGroupFromDb(req, res) {
 
  let shop = res.locals.shopify.session.shop;
  let session = res.locals.shopify.session;
  try {
    let delPlan = await planModal.findOneAndDelete({
      shop: shop,
      plan_group_id: req.body.id,
    });
    if (delPlan) {
       res.send({ message: "success", data: "success" });
    }
  } catch (err) {
    console.log("errrrrr");
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function getPlanGroups(req, res) {
  ///**********************/// function to get the plan groups from db  for listing
  let shop = res.locals.shopify.session.shop;
  let session = res.locals.shopify.session;
  const client = new shopify.api.clients.Graphql({ session });
  
  try {
    let data = await planModal
      .find(
        { shop: shop },
        { plan_group_name: 1, plan_group_id: 1, product_details: 1, plans: 1 }
      )
      .sort({ _id: -1 });
    if (data) {
      res.send({ message: "success", data: data });
    }
  } catch (error) {
    res.send({ message: "error", data: "something went wrong" });
  }
}

export async function getAllPlanGroupNames(req, res) {
  ///**********************/// function to get the plan groups from db  for listing
  let shop = res.locals.shopify.session.shop;
  let session = res.locals.shopify.session;
  try {
    let data = await planModal.find({ shop: shop }, { plan_group_name: 1 });
    if (data) {
      res.send({ message: "success", data: data });
    }
  } catch (error) {
    res.send({ message: "error", data: "something went wrong" });
  }
}

export async function createProduct(req, res, next) {
  // let shop = res.locals.shopify.session.shop;
  let session = res.locals.shopify.session;
  // const client = new shopify.api.clients.Graphql({ session });
  let {name, price, check, quantity } = req.body;
console.log("name, price, check, quantity ",name, price, check, quantity )
  const product = new shopify.api.rest.Product({
    session
  });
  
  product.title = name;
  product.status = "active";
  product.variants = [
    {
      price: price,
      taxable: check,
      requires_shipping: check,
      inventory_quantity: quantity,
    },
  ];
  try {
    let result = await product.save({
      update: true,
    });
    console.log("result10june==>",product)
    if (req.body.check2 == "createProductSubscriptionEdit") {
      console.log("iniffff10june")
      let pid = product?.admin_graphql_api_id;

      let vid = product?.variants[0].admin_graphql_api_id;

      let lines = [];

      lines.push({
        product_id: pid,

        product_name: product?.title,

        product_image:
          product?.images.length > 0 ? product.images[0].originalSrc : "",

        hasOnlyDefaultVariant: true,
        requiresShipping: product.variants[0].requires_shipping,
        id: vid,
        image: "",
        price: product.variants[0].price,

        title: product.variants[0].title,
        quantity: 1,
        // quantity: product.variants[0].inventory_quantity,
      });   

      req.createProductData = {
        data: lines,
      };

      next();
    } else {
      console.log("first in createProduct");
      res.send({ message: "success", data: product });
    }
  } catch (error) {
    console.log("error",error)
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function getProductPlans(req, res) {
  let id = req.body.id;
  try {
    let data = await planModal.aggregate([
      {
        $unwind: "$product_details",
      },
      {
        $unwind: "$product_details.variants",
      },
      {
        $match: {
          "product_details.variants.id": id,
        },
      },
      {
        $project: {
          _id: 0,
          plansName: "$plans.planName",
          planId: "$plans.plan_id",
        },
      },
    ]);
    if (data) {
      res.send({ message: "success", data: data });
    }
  } catch (err) {
    res.send({ message: "error", data: "something went wrong" });
  }
}

export async function CreatePlanFormForCheckout(req, res) {
  let shop = res.locals.shopify.session.shop;
  let session = res.locals.shopify.session;
  const client = new shopify.api.clients.Graphql({ session });
  let planDetails = req.body.values;
  let values = req.body.values;
  let varientIds = [];
  req.body.products.map((item) => {
    varientIds.push(item.id);
  });
  let topOptions = [
    values.subscription.planType != "payAsYouGo"
      ? `${
          values.subscription.billingLength +
          " " +
          values.subscription.delivery_billingType +
          "," +
          values.subscription.delivery_billingValue +
          " " +
          values.subscription.delivery_billingType
        }`
      : `${
          values.subscription.billingLength +
          " " +
          values.subscription.delivery_billingType
        }`,
  ];

  let pricingPolicy = [];
  let sellPlan = [];
  let rec = {
    anchors: [],
    interval: values.subscription.delivery_billingType.toUpperCase(),
    intervalCount: parseInt(values.subscription.billingLength),
    minCycles: values?.billingMinValue ? parseInt(values?.billingMinValue) : 1,
    maxCycles: values?.billingMaxValue
      ? parseInt(values?.billingMaxValue)
      : null,

    ...(values.subscription.autoRenew
      ? values?.billingMaxValue
        ? { maxCycles: parseInt(values?.billingMaxValue) }
        : {}
      : values?.subscription?.planType == "prepaid" &&
        values.subscription.autoRenew == false
      ? { maxCycles: 1 }
      : {}),
  };
  if (values.subscription.autoRenew) {
    rec.maxCycles = values?.billingMaxValue
      ? parseInt(values?.billingMaxValue)
      : null;
  }

  sellPlan.push({
    name:
      values?.subscription?.frequencyPlanName != undefined
        ? values.subscription.planName +
          "-" +
          values?.subscription?.frequencyPlanName
        : values.subscription.planName,
    options: [
      values.subscription.planType != "payAsYouGo"
        ? `${
            values.subscription.billingLength +
            " " +
            values.subscription.delivery_billingType +
            "," +
            values.subscription.delivery_billingValue +
            " " +
            values.subscription.delivery_billingType
          }`
        : `${
            values.subscription.billingLength +
            " " +
            values.subscription.delivery_billingType
          }`,
    ],
    // options:["1 MONTH"],
    position: 1,
    category: "SUBSCRIPTION",
    inventoryPolicy: {
      reserve: "ON_FULFILLMENT",
    },
    billingPolicy: {
      recurring: rec,
    },
    deliveryPolicy: {
      recurring: {
        intent: "FULFILLMENT_BEGIN",
        anchors: [],
        preAnchorBehavior: "ASAP",
        interval: values.subscription.delivery_billingType.toUpperCase(),
        intervalCount: parseInt(
          values.subscription.planType == "prepaid"
            ? values.subscription.delivery_billingValue
            : values.subscription.billingLength
        ),
      },
    },
    pricingPolicies: pricingPolicy,
  });

  const mutationQuery = `
  mutation sellingPlanGroupCreate($input: SellingPlanGroupInput!,$resources:SellingPlanGroupResourceInput) {
    sellingPlanGroupCreate(input: $input,resources:$resources) {
      sellingPlanGroup {
        id
        appId
        sellingPlans(first: 30) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }  
  `;

  const Input = {
    input: {
      appId: "SdSubscriptionApp2k23virga22luck",
      merchantCode: values.subscription.planName,
      name: values.subscription.planName,
      options: topOptions,
      position: 10,
      sellingPlansToCreate: sellPlan,
    },
    resources: { productVariantIds: varientIds },
  };

  try {
    let response = await client.request(mutationQuery,{
            variables: Input 
              });
    if (response.data.sellingPlanGroupCreate.userErrors.length > 0) {
      res.send({
        message: "error",
        data: response.data.sellingPlanGroupCreate.userErrors[0].message,
      });
    } else {
      res.send({
        message: "success",
        data: {
          plan: response.data.sellingPlanGroupCreate.sellingPlanGroup
            .sellingPlans,
          shop: shop,
        },
      });

      let ids = response.data.sellingPlanGroupCreate.sellingPlanGroup;
      let plandetail = planDetails.subscription;
      plandetail.startDate = planDetails.startDate;
      let customerDetail = planDetails.customer_details;
      customerDetail.id = planDetails.customer;

      try {
        let object = {
          shop: shop,
          plan_group_name: values.subscription.planName,
          plan_group_id: ids.id,
          product_details: varientIds,
          plans: plandetail,
          customer: customerDetail,
        };
        let saveData = checkoutCustomerModal.create(object);
      } catch (err) {}
    }   
  } catch (err) {
    console.log(err);
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function createCustomer(req, res) {
  let shop = res.locals.shopify.session.shop;
  let session = res.locals.shopify.session;
  const client = new shopify.api.clients.Graphql({ session });
  let mutationQuery = `mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        lastName
        firstName
        email 
        phone
             
                }
      userErrors {
        field
        message
      }
    }
  }
  `;

  let firstName = req.body.values.firstName;
  let lastName = req.body.values?.lastName;
  let email = req.body.values.email;
  let phone = req.body.values.phone;
  let Input = {
    input: {
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
    },
  };

  try {
    let response = await client.request(mutationQuery,{
                            variables: Input 
                        });

    if (response.data.customerCreate.userErrors.length > 0) {
      res.send({
        message: "error",
        data: response.data.customerCreate.userErrors[0].message,
      });
    } else {
      res.send({
        message: "success",
        data: {
          plan: response.data.customerCreate,
        },
      });
    }
  } catch (err) {
    console.log(err.response.errors, "error");
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function sendMail(req, res) {
  let options = req.body.options;
  let shop = res.locals.shopify.session.shop;
  let configurationData = await emailTemplatesModal.findOne(
    { shop },
    { configuration: 1 }
  );
  
  let configuration = "";
  let emailConfig = {};

  if (configuration && configuration?.enable == true) {
    let encryptionConfig = {};
    if (configuration.encryption === "ssl") {
      encryptionConfig = {
        secure: true,
        requireTLS: true,
      };
    } else if (configuration.encryption === "tls") {
      encryptionConfig = {
        secure: false, 
        requireTLS: true,
      };
    }
    emailConfig = {
      host: configuration.host,
      port: parseInt(configuration.portNumber), 
      auth: {
        user: configuration.userName,
        pass: configuration.password,
      },
      ...(configuration.encryption === "none" ? {} : encryptionConfig),
    };
    options.from = `${configuration.fromName}<${configuration.userName}>`;

  } else {
     emailConfig = {
      host: "smtp.gmail.com",
      port: 587, 
      auth: {
        user: "sahilagnihotri7@gmail.com",
        pass: "srdvsdnxfmvbrduw",
      },
      secure: false,
    };
    options.from = "sahilagnihotri7@gmail.com";
  }
  
  const transporter = nodemailer.createTransport(emailConfig);
  try {
    let data = await transporter.sendMail(options);
    if (data) {
      res.send({
        message: "success",
        data: "Mail sent successfully",
      });
    }
 
  } catch (err) {
    console.log(err, "errorr");
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function getInvoiceDetails(req, res) {
  let shop = res.locals.shopify.session.shop;

  let data = req.body;
  try {
    let saveDetails = await invoice_all_details.findOne({
      shop: shop,
    });
    if (saveDetails) {
      res.send({
        message: "success",
        data: saveDetails,
      });
    }
  } catch (err) {
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function saveInvoiceDetails(req, res) {
  let shop = res.locals.shopify.session.shop;
  let data = req.body;
  
  try {
    let saveDetails = await invoice_all_details.findOneAndUpdate(
      {
        shop: shop,
      },
      { components: data.components, invoice_details: data.details },
      { upsert: true }
    );
    
    if (saveDetails) {
      res.send({
        message: "success",
        data: "Details saved successfully",
      });
    }
  } catch (err) {
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function saveproductbundleDetails(req, res) {
  let shop = res.locals.shopify.session.shop;
  let data = req.body;
 
  try {
    let saveDetails = await productBundleModal.create({
      shop: shop,
      products: data.products,
      bundleDetails: data.data,
    });
  
    if (saveDetails) {
      res.send({
        message: "success",
        data: "Details saved successfully",
      });
    }
  } catch (err) {
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function updateproductbundleDetails(req, res) {
  let shop = res.locals.shopify.session.shop;
  let data = req.body;

  try {
    let saveDetails = await productBundleModal.findOneAndUpdate(
      { shop: shop, _id: data.id },
      {
        $set: {
          products: data.products,
          bundleDetails: data.data,
        },
      }
    );
  
    if (saveDetails) {
      res.send({
        message: "success",
        data: "Details saved successfully",
      });
    }
  } catch (err) {
    console.log(err, "jkh");
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function updateproductbundleStatus(req, res) {
  let shop = res.locals.shopify.session.shop;
  let data = req.body;
 
  try {
    let saveDetails = await productBundleModal.findOneAndUpdate(
      { shop: shop, _id: data.id },
      {
        $set: {
          "bundleDetails.status": data.status,
        },
      }
    );
   
    if (saveDetails) {
      res.send({
        message: "success",
        data: "Status updated successfully",
      });
    }
  } catch (err) {
    console.log(err, "jkh");
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function getproductBundleDetails(req, res) {
  let shop = res.locals.shopify.session.shop;
  let data = req.body;
  
  try {
    let saveDetails = await productBundleModal.findOne({
      shop: shop,
      _id: data.id,
    });
   
    if (saveDetails) {
      res.send({
        message: "success",
        data: saveDetails,
      });
    }
  } catch (err) {
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function getproductbundle(req, res) {
  let shop = res.locals.shopify.session.shop;
  let data = req.body;
 
  try {
    let saveDetails = await productBundleModal.find(
      {
        shop: shop,
      },
      {
        "bundleDetails.bundleName": 1,
        "bundleDetails.status": 1,
      }
    );
    
    if (saveDetails) {
      res.send({
        message: "success",
        data: saveDetails,
      });
    }
  } catch (err) {
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function deleteproductbundle(req, res) {
  let shop = res.locals.shopify.session.shop;
  let data = req.body;

  try {
    let saveDetails = await productBundleModal.findByIdAndDelete(req.body.id);
   
    if (saveDetails) {
      res.send({
        message: "success",
        data: "Details saved successfully",
      });
    }
  } catch (err) {
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function prodExRemoveVariants(req, res) {
  const secretOrPublicKey = process.env.SHOPIFY_API_SECRET;
  const token = req.headers.authentication;
  let shop;
  verifyToken(token, secretOrPublicKey, (err, decodedToken) => {
    if (err) {
    } else {
       shop = decodedToken.dest.replace(/^https?:\/\//, "");
    }
  });

  if (shop) {
    try {
      let cli = await getshopToken(shop);
     
      let VIds = req.body.data.variantIds;
      let SId = req.body.data.sellingPlanGroupId;
      let SingleVid = req.body.data.variantId;
   
      const varientDelete = `mutation sellingPlanGroupRemoveProductVariants($id: ID!, $productVariantIds: [ID!]!) {
      sellingPlanGroupRemoveProductVariants(id: $id, productVariantIds: $productVariantIds) {
        removedProductVariantIds
        userErrors {
          field
          message
        }
      }
    }`;
      let response1;
      if (VIds != undefined) {
        response1 = await cli.request(varientDelete,{
          variables: {
              id: SId,
              productVariantIds: VIds,
            },
          });
      } else if (SingleVid != undefined) {
        response1 = await cli.request(varientDelete,{
           variables: {
              id: SId,
              productVariantIds: [SingleVid],
            },
          });
      }
   
      if (response1) {
        const data = await planModal.findOne(
          {
            shop: shop,
            plan_group_id: SId,
          },
          {
            product_details: 1,
          }
        );
        let product_details = data.product_details;
    
        if (req.body.data.variantId != undefined) {
          let vid = req.body.data.variantId;
          product_details = product_details
            .map((product) => {
              const filteredVariants = product.variants.filter(
                (variant) => !(vid == variant.id)
              );
              if (filteredVariants.length === 0) {
                return null; // Don't include products with empty variants array
              }
              return { ...product, variants: filteredVariants };
            })
            .filter((product) => product !== null);
          const data1 = await planModal.findOneAndUpdate(
            {
              shop: shop,
              plan_group_id: SId,
            },
            {
              $set: {
                product_details: product_details,
              },
            }
          );
        } else if (req.body.data.variantIds != undefined) {
          let productIdsToRemove = req.body.data.productId;
          product_details = product_details.filter(
            (product) => !(productIdsToRemove == product.product_id)
          );
        }
    
        if (product_details.length > 0) {
          const data1 = await planModal.findOneAndUpdate(
            {
              shop: shop,
              plan_group_id: SId,
            },
            {
              $set: {
                product_details: product_details,
              },
            }
          );
        } else {
          let del = await planModal.deleteOne({
            shop: shop,
            plan_group_id: SId,
          });
        }

        res.send({
          message: "success",
          data: "Details saved successfully",
        });
      }
    } catch (err) {
      res.send({ message: "error", data: "Something went wrong" });
    }
  }
}

export async function prodExCreatePlan(req, res) {
 
  const secretOrPublicKey = process.env.SHOPIFY_API_SECRET;
  const token = req.headers.authentication;
  let shop;
  verifyToken(token, secretOrPublicKey, (err, decodedToken) => {
    if (err) {
    } else {     
      shop = decodedToken.dest.replace(/^https?:\/\//, "");
    }
  });

  if (shop) {
    try {
      let cli = await getshopToken(shop);
     let varientIds = [];

      let prodId = '"' + req.body.pid + '"';
      let getproductVarientQuery = `query {
          product(id: ${prodId}) {
            id
            handle
            title
            hasOnlyDefaultVariant
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  id
                  title
                  image {
                    url
                  }
                  price
                }
              }
            }
            
          }
        }
        `;
      let VIDs = await cli.request(getproductVarientQuery);
    
      let allVarianData = [];
      VIDs.data.product.variants.edges.map((item) => {
        varientIds.push(item.node.id);
        allVarianData.push({
          id: item?.node?.id,
          title: item?.node?.title,
          price: item?.node?.price,
          image: item?.node?.image?.url,
        });
      });

      if (req.body.vid == undefined) {
        VIDs.data.product.variants.edges.map((item) => {
          varientIds.push(item.node.id);
        });
      } else {
        varientIds.push(req.body.vid);
      }
      let list = req.body.planList;
    
      let allOptions = [];
      list?.map((item) => {
        let unique =
          Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
      
        allOptions?.push(item?.billEvery + " " + item?.interval + " " + unique);
      });
      const topOptions = allOptions.join(",");
    
      let sellPlan = [];
      list?.map((item) => {
        let draftAnchors = [];

        let pricingPolicy = [];

        ///////////////////////////
        // if (item.offerDiscount) {
        //   if (item.priceType == "percentage") {
        //     pricingPolicy.push({
        //       fixed: {
        //         adjustmentType: "PERCENTAGE",
        //         adjustmentValue: {
        //           percentage: parseFloat(item.discount),
        //         },
        //       },
        //     });
        //   } else if (item.priceType == "fixed") {
        //     pricingPolicy.push({
        //       fixed: {
        //         adjustmentType: "FIXED_AMOUNT",
        //         adjustmentValue: {
        //           fixedValue: parseFloat(item.discount),
        //         },
        //       },
        //     });
        //   }
        // }

        if (
          item.offerDiscount &&
          item.discount != undefined &&
          item.discount != null &&
          parseInt(item.discount) != 0
        ) {
          if (item.freeTrial) {
            if (item.discountType == "percentage") {
           
              pricingPolicy.push(
                {
                  fixed: {
                    adjustmentType: "PERCENTAGE",
                    adjustmentValue: {
                      percentage: parseFloat(100),
                    },
                  },
                },
                {
                  recurring: {
                    adjustmentType: "PERCENTAGE",
                    adjustmentValue: {
                      percentage: parseFloat(item.discount),
                    },
                    afterCycle: parseInt(1),
                    // afterCycle: parseInt(item.trialCount),
                  },
                }
              );
            } else if (item.discountType == "fixed") {
             
              pricingPolicy.push(
                {
                  fixed: {
                    adjustmentType: "PERCENTAGE",
                    adjustmentValue: {
                      percentage: parseFloat(100),
                    },
                  },
                },
                {
                  recurring: {
                    adjustmentType: "FIXED_AMOUNT",
                    adjustmentValue: {
                      fixedValue: parseFloat(item.discount),
                    },
                    // afterCycle: parseInt(item.trialCount),
                    afterCycle: parseInt(1),
                  },
                }
              );
            }
          } else {
            if (item.discountType == "percentage") {
            
              pricingPolicy.push({
                fixed: {
                  adjustmentType: "PERCENTAGE",
                  adjustmentValue: {
                    percentage: parseFloat(item.discount),
                  },
                },
              });
            } else if (item.discountType == "fixed") {
              pricingPolicy.push({
                fixed: {
                  adjustmentType: "FIXED_AMOUNT",
                  adjustmentValue: {
                    fixedValue: parseFloat(item.discount),
                  },
                },
              });
            }
          }
        } else {
          if (item.freeTrial) {
          
            pricingPolicy.push(
              {
                fixed: {
                  adjustmentType: "PERCENTAGE",
                  adjustmentValue: {
                    percentage: parseFloat(100),
                  },
                },
              },
              {
                recurring: {
                  adjustmentType: "PERCENTAGE",
                  adjustmentValue: {
                    percentage: parseFloat(0),
                  },
                  afterCycle: parseInt(1),
                  // afterCycle: parseInt(item.trialCount),
                },
              }
            );
          }
        }
        let unique =  Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
       
        sellPlan.push({
          name: req.body.planGroupName + "-" + item.frequencyPlanName,
          options:
            item?.billEvery +
            " " +
            item?.interval +
            " " +
            unique +
            Math.random().toString(10),
          position: 1,
          category: "SUBSCRIPTION",
          inventoryPolicy: {
            reserve: "ON_FULFILLMENT",
          },
          billingPolicy: {
            recurring: {
              anchors: draftAnchors,
              interval: item.interval.toUpperCase(),
              intervalCount: parseInt(item.billEvery),
              minCycles: item?.minCycle ? parseInt(item?.minCycle) : 1,
              ...(item.autoRenew
                ? item?.maxCycle
                  ? { maxCycles: parseInt(item?.maxCycle) }
                  : {}
                : item?.planType == "prepaid" && item.autoRenew == false
                ? { maxCycles: 1 }
                : {}),
            },
          },
          deliveryPolicy: {
            recurring: {
              intent: "FULFILLMENT_BEGIN",
              anchors: draftAnchors,
              preAnchorBehavior: "ASAP",
              interval: item.interval.toUpperCase(),
              intervalCount:
                item.planType != "prepaid"
                  ? parseInt(item.billEvery)
                  : parseInt(item.deliveryEvery),
            },
          },
          pricingPolicies: pricingPolicy,
        });
      });
      const CreateInput = {
        input: {
          appId: "SdSubscriptionApp2k23virga22luck",
          merchantCode: req.body.planGroupName,
          name: req.body.planGroupName,
          options: [topOptions],
          position: 10,
          sellingPlansToCreate: sellPlan,
        },
        resources: { productVariantIds: varientIds },
      };
      // const dataString =
      //   typeof CreateInput === "string"
      //     ? CreateInput
      //     : JSON.stringify(CreateInput);
      // fs.writeFile("hiiiii.txt", dataString, (err) => {
      //   if (err) {
      //     console.error("Error writing to file:", err);
      //   } else {
      //     console.log("Data written to file successfully!");
      //   }
      // });

      const mutationQuery = `
mutation sellingPlanGroupCreate($input: SellingPlanGroupInput!,$resources:SellingPlanGroupResourceInput) {
  sellingPlanGroupCreate(input: $input,resources:$resources) {
    sellingPlanGroup {
      id
      appId
      sellingPlans(first: 30) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}

`;
    let createGroup = await cli.request(mutationQuery,{
          variables: CreateInput 
      });
      if (createGroup.data.sellingPlanGroupCreate.userErrors.length > 0) {
      
        res.send({
          message: "error",
          data: createGroup.data.sellingPlanGroupCreate.userErrors[0]
            .message,
        });
      } else {
       
        let planGroupId =
          createGroup.data.sellingPlanGroupCreate.sellingPlanGroup.id;
        let planIds =
          createGroup.data.sellingPlanGroupCreate.sellingPlanGroup
            .sellingPlans.edges;

        let dbArr = [];
        list.forEach((item, index) => {
          dbArr.push({
            planName: item.frequencyPlanName,
            plan_id: planIds[index].node.id,
            billingCycle: item.autoRenew,
            billingEvery: item.billEvery,
            billingEveryType: item.interval,
            offerDiscount: item.offerDiscount,
            priceType: item.discountType,
            price: item.discount,
            minCycle: item.minCycle,
            maxCycle: item.maxCycle,
            planType: item.planType,
            deliveryEvery: item.deliveryEvery,
            freeTrial: item.freeTrial,
            trialCount: item.freeTrialCount,
            freeTrialCycle: item.freeTrialCycle,
          });
        });
        let variants = [];
        if (req.body.vid) {
          variants = allVarianData.filter((item) => item.id === req.body.vid);
        } else {
          variants = allVarianData;
        }
        let productlist = {
          product_id: req.body.pid,
          product_name: VIDs.data.product.title,
          product_image: VIDs.data.product?.images?.edges[0]?.node?.url,
          hasOnlyDefaultVariant: VIDs.data.product.hasOnlyDefaultVariant,
          handle: VIDs.data.product.handle,
          variants: variants,
        };
        let object = {
          shop: shop,
          plan_group_name: req.body.planGroupName,
          plan_group_id: planGroupId,
          product_details: productlist,
          plans: dbArr,
        };

        let saveData = await planModal.create(object);
        console.log("11june2024")
        if (saveData) {
          res.send({ message: "success", data: "Plan created successfully" });
        }
      }
    } catch (err) {
      console.log(err);
      res.send({ message: "error", data: "Something went wrong" });
    }
  }
}

export async function prodExPlanDetails(req, res) {
  const secretOrPublicKey = process.env.SHOPIFY_API_SECRET;
  const token = req.headers.authentication;
  let shop;
  verifyToken(token, secretOrPublicKey, (err, decodedToken) => {
    if (err) {
    } else {
      console.log("Payload:", decodedToken);
      shop = decodedToken.dest.replace(/^https?:\/\//, "");
    }
  });

  if (shop) {
    try {
      let data = await planModal.findOne({
        shop: shop,
        plan_group_id: req.body.id,
      });
     
      if (data) {
        res.send({ message: "success", data: data });
      }
    } catch (err) {
      res.send({ message: "error", data: "Something went wrong" });
    }
  }
}

export async function prodExPlanUpdate(req, res) {

  const secretOrPublicKey = process.env.SHOPIFY_API_SECRET;
  const token = req.headers.authentication;
  let shop;
  verifyToken(token, secretOrPublicKey, (err, decodedToken) => {
    if (err) {
    } else {
      console.log("Payload:", decodedToken);
      shop = decodedToken.dest.replace(/^https?:\/\//, "");
    }
  });

  if (shop) {
    
    let cli = await getshopToken(shop);
   
    try {
      let editedArrayId = req.body.editIndexOfPrevPlan;
      let editedArrayIds = [...new Set(editedArrayId)];
      let allOptions = [];
      req.body.planList?.map((item) => {
        let unique =
          Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
        allOptions?.push(item?.billEvery + " " + item?.interval + " " + unique);
      });
      req.body.prevPlanList?.map((item) => {
        let unique =
          Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
        allOptions?.push(item?.billEvery + " " + item?.interval + " " + unique);
      });
      const topOptions = allOptions.join(",");
      
      let sellPlan = [];
      req.body.planList.length > 0 &&
        req.body.planList?.map((item) => {
          let draftAnchors = [];
          let pricingPolicy = [];

          // item.offerDiscount &&
          //   item.discountType == "percentage" &&
          //   pricingPolicy.push({
          //     fixed: {
          //       adjustmentType: "PERCENTAGE",
          //       adjustmentValue: {
          //         percentage: parseFloat(item.discount),
          //       },
          //     },
          //   });

          // item.offerDiscount &&
          //   item.discountType == "fixed" &&
          //   pricingPolicy.push({
          //     fixed: {
          //       adjustmentType: "FIXED_AMOUNT",
          //       adjustmentValue: {
          //         fixedValue: parseFloat(item.discount),
          //       },
          //     },
          //   });

          ////////////
          if (
            item.offerDiscount &&
            item.discount != undefined &&
            item.discount != null &&
            parseInt(item.discount) != 0
          ) {
            if (item.freeTrial) {
              if (item.discountType == "percentage") {
                pricingPolicy.push(
                  {
                    fixed: {
                      adjustmentType: "PERCENTAGE",
                      adjustmentValue: {
                        percentage: parseFloat(100),
                      },
                    },
                  },
                  {
                    recurring: {
                      adjustmentType: "PERCENTAGE",
                      adjustmentValue: {
                        percentage: parseFloat(item.discount),
                      },
                      afterCycle: parseInt(1),
                      // afterCycle: parseInt(item.trialCount),
                    },
                  }
                );
              } else if (item.discountType == "fixed") {
                pricingPolicy.push(
                  {
                    fixed: {
                      adjustmentType: "PERCENTAGE",
                      adjustmentValue: {
                        percentage: parseFloat(100),
                      },
                    },
                  },
                  {
                    recurring: {
                      adjustmentType: "FIXED_AMOUNT",
                      adjustmentValue: {
                        fixedValue: parseFloat(item.discount),
                      },
                      // afterCycle: parseInt(item.trialCount),
                      afterCycle: parseInt(1),
                    },
                  }
                );
              }
            } else {
              if (item.discountType == "percentage") {
                pricingPolicy.push({
                  fixed: {
                    adjustmentType: "PERCENTAGE",
                    adjustmentValue: {
                      percentage: parseFloat(item.discount),
                    },
                  },
                });
              } else if (item.discountType == "fixed") {
                pricingPolicy.push({
                  fixed: {
                    adjustmentType: "FIXED_AMOUNT",
                    adjustmentValue: {
                      fixedValue: parseFloat(item.discount),
                    },
                  },
                });
              }
            }
          } else {
            if (item.freeTrial) {
              pricingPolicy.push(
                {
                  fixed: {
                    adjustmentType: "PERCENTAGE",
                    adjustmentValue: {
                      percentage: parseFloat(100),
                    },
                  },
                },
                {
                  recurring: {
                    adjustmentType: "PERCENTAGE",
                    adjustmentValue: {
                      percentage: parseFloat(0),
                    },
                    afterCycle: parseInt(1),
                    // afterCycle: parseInt(item.trialCount),
                  },
                }
              );
            }
          }
          ////////
          let unique =
            Date.now().toString(36) +
            Math.random().toString(36).substring(2, 5);

          sellPlan.push({
            name: req.body.planGroupName + "-" + item.frequencyPlanName,
            options:
              item?.billEvery +
              " " +
              item?.interval +
              " " +
              unique +
              Math.random().toString(10),
            position: 1,
            category: "SUBSCRIPTION",
            inventoryPolicy: {
              reserve: "ON_FULFILLMENT",
            },
            billingPolicy: {
              recurring: {
                anchors: draftAnchors,
                interval: item.interval.toUpperCase(),
                intervalCount: parseInt(item.billEvery),
                minCycles: item.minCycle ? parseInt(item.minCycle) : 1,
                ...(item.autoRenew
                  ? item?.maxCycle
                    ? { maxCycles: parseInt(item?.maxCycle) }
                    : {}
                  : item?.planType == "prepaid" && item.autoRenew == false
                  ? { maxCycles: 1 }
                  : {}),
              },
            },
            deliveryPolicy: {
              recurring: {
                intent: "FULFILLMENT_BEGIN",
                anchors: draftAnchors,
                preAnchorBehavior: "ASAP",
                interval: item.interval.toUpperCase(),
                intervalCount:
                  item.plantype == "prepaid"
                    ? parseInt(item.deliveryEvery)
                    : parseInt(item.billEvery),
              },
            },
            pricingPolicies: pricingPolicy,
          });
        });

      ///////////////////////
      let sellPlanToUpdate = [];
      
      editedArrayIds.length > 0 &&
        editedArrayIds?.map((item) => {
          let draftAnchors = [];
          let pricingPolicy = [];

          // req.body.prevPlanList[item].offerDiscount &&
          //   req.body.prevPlanList[item].discountType == "percentage" &&
          //   pricingPolicy.push({
          //     fixed: {
          //       adjustmentType: "PERCENTAGE",
          //       adjustmentValue: {
          //         percentage: parseFloat(req.body.prevPlanList[item].discount),
          //       },
          //     },
          //   });

          // req.body.prevPlanList[item].offerDiscount &&
          //   req.body.prevPlanList[item].discountType == "fixed" &&
          //   pricingPolicy.push({
          //     fixed: {
          //       adjustmentType: "FIXED_AMOUNT",
          //       adjustmentValue: {
          //         fixedValue: parseFloat(req.body.prevPlanList[item].discount),
          //       },
          //     },
          //   });
          ///////start//////////
          if (
            req.body.prevPlanList[item].offerDiscount &&
            req.body.prevPlanList[item].discount != undefined &&
            req.body.prevPlanList[item].discount != null &&
            parseInt(req.body.prevPlanList[item].discount) != 0
          ) {
            if (req.body.prevPlanList[item].freeTrial) {
              if (req.body.prevPlanList[item].discountType == "percentage") {
                pricingPolicy.push(
                  {
                    fixed: {
                      adjustmentType: "PERCENTAGE",
                      adjustmentValue: {
                        percentage: parseFloat(100),
                      },
                    },
                  },
                  {
                    recurring: {
                      adjustmentType: "PERCENTAGE",
                      adjustmentValue: {
                        percentage: parseFloat(
                          req.body.prevPlanList[item].discount
                        ),
                      },
                      afterCycle: parseInt(1),
                      // afterCycle: parseInt(item.trialCount),
                    },
                  }
                );
              } else if (req.body.prevPlanList[item].discountType == "fixed") {
                pricingPolicy.push(
                  {
                    fixed: {
                      adjustmentType: "PERCENTAGE",
                      adjustmentValue: {
                        percentage: parseFloat(100),
                      },
                    },
                  },
                  {
                    recurring: {
                      adjustmentType: "FIXED_AMOUNT",
                      adjustmentValue: {
                        fixedValue: parseFloat(
                          req.body.prevPlanList[item].discount
                        ),
                      },
                      // afterCycle: parseInt(item.trialCount),
                      afterCycle: parseInt(1),
                    },
                  }
                );
              }
            } else {
              if (req.body.prevPlanList[item].discountType == "percentage") {
                pricingPolicy.push({
                  fixed: {
                    adjustmentType: "PERCENTAGE",
                    adjustmentValue: {
                      percentage: parseFloat(
                        req.body.prevPlanList[item].discount
                      ),
                    },
                  },
                });
              } else if (req.body.prevPlanList[item].discountType == "fixed") {
                pricingPolicy.push({
                  fixed: {
                    adjustmentType: "FIXED_AMOUNT",
                    adjustmentValue: {
                      fixedValue: parseFloat(
                        req.body.prevPlanList[item].discount
                      ),
                    },
                  },
                });
              }
            }
          } else {
            if (req.body.prevPlanList[item].freeTrial) {
              pricingPolicy.push(
                {
                  fixed: {
                    adjustmentType: "PERCENTAGE",
                    adjustmentValue: {
                      percentage: parseFloat(100),
                    },
                  },
                },
                {
                  recurring: {
                    adjustmentType: "PERCENTAGE",
                    adjustmentValue: {
                      percentage: parseFloat(0),
                    },
                    afterCycle: parseInt(1),
                    // afterCycle: parseInt(item.trialCount),
                  },
                }
              );
            }
          }

          ////end///////////
          let unique =
            Date.now().toString(36) +
            Math.random().toString(36).substring(2, 5);
          
          sellPlanToUpdate.push({
            name:
              req.body.planGroupName +
              "-" +
              req.body.prevPlanList[item].frequencyPlanName,
            id: req.body.prevPlanList[item].plan_id,
            options:
              req.body.prevPlanList[item]?.billEvery +
              " " +
              req.body.prevPlanList[item]?.interval +
              " " +
              unique +
              Math.random().toString(10),
            position: 1,
            category: "SUBSCRIPTION",
            inventoryPolicy: {
              reserve: "ON_FULFILLMENT",
            },
            billingPolicy: {
              recurring: {
                anchors: draftAnchors,
                interval: req.body.prevPlanList[item].interval.toUpperCase(),
                intervalCount: parseInt(req.body.prevPlanList[item].billEvery),
                minCycles: req.body.prevPlanList[item].minCycle
                  ? parseInt(req.body.prevPlanList[item].minCycle)
                  : 1,
                ...(req.body.prevPlanList[item].autoRenew
                  ? req.body.prevPlanList[item].maxCycle
                    ? {
                        maxCycles: parseInt(
                          req.body.prevPlanList[item].maxCycle
                        ),
                      }
                    : {}
                  : req.body.prevPlanList[item]?.planType == "prepaid" &&
                    req.body.prevPlanList[item].autoRenew == false
                  ? { maxCycles: 1 }
                  : {}),
              },
            },
            deliveryPolicy: {
              recurring: {
                intent: "FULFILLMENT_BEGIN",
                anchors: draftAnchors,
                preAnchorBehavior: "ASAP",
                interval: req.body.prevPlanList[item].interval.toUpperCase(),
                intervalCount:
                  req.body.prevPlanList[item].planType == "prepaid"
                    ? parseInt(req.body.prevPlanList[item].deliveryEvery)
                    : parseInt(req.body.prevPlanList[item].billEvery),
              },
            },
            pricingPolicies: pricingPolicy,
          });
        });
    
      const Input = {
        id: req.body.id,
        input: {
          appId: "SdSubscriptionApp2k23virga22luck",
          merchantCode: req.body.planGroupName,
          name: req.body.planGroupName,
          options: [topOptions],
        },
      };
      sellPlan.length > 0 && (Input.input.sellingPlansToCreate = sellPlan);

      req.body.deletedPlans.length > 0 &&
        (Input.input.sellingPlansToDelete = req.body.deletedPlans);

      sellPlanToUpdate.length > 0 &&
        (Input.input.sellingPlansToUpdate = sellPlanToUpdate);

      const dataString =
        typeof Input === "string" ? Input : JSON.stringify(Input);

  
      // fs.writeFile("haha.txt", dataString, (err) => {
      //   if (err) {
      //     console.error("Error writing to file:", err);
      //   } else {
      //     console.log("Data written to file successfully!");
      //   }
      // });
      // // console.log(sellPlan[0]["billingPolicy"], "aaaaa");
     
      const mutationQuery = `
        mutation sellingPlanGroupUpdate($id: ID!, $input: SellingPlanGroupInput!) {
          sellingPlanGroupUpdate(id: $id, input: $input) {
            deletedSellingPlanIds
            sellingPlanGroup {
              id
              name
              sellingPlans(first:31){
                edges{
                  node{
                    id
                    name
                  }
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }`;

      ///**********************/// update selling plan group mutation is fired here
      
      let response = await cli.request(mutationQuery,{
         variables: Input 
      });
   
      if (response.data.sellingPlanGroupUpdate.userErrors.length > 0) {
        res.send({
          message: "userError",
          data: response.data.sellingPlanGroupUpdate.userErrors[0].message,
        });
      } else {
        var planIds =
          response.data.sellingPlanGroupUpdate.sellingPlanGroup
            .sellingPlans.edges;
        res.send({ message: "success", data: response.data });

        let planDetails = [];
        await Promise.all(
          req.body.planList.map(async (item, index) => {
            // console.log(item, "trmm");
            let len = req.body.prevPlanList.length;
            let obj = {
              planName: item.frequencyPlanName,
              plan_id: planIds[len + index]?.node?.id,
              billingCycle: item.autoRenew,
              billingEvery: item.billEvery,
              billingEveryType: item.interval,
              offerDiscount: item.offerDiscount,
              priceType: item.discountType,
              price: item.discount,
              minCycle: item.minCycle,
              maxCycle: item.maxCycle,
              planType: item.planType,
              deliveryEvery: item.deliveryEvery,
              freeTrial: item.freeTrial,
              trialCount: item.freeTrialCount,
              freeTrialCycle: item.freeTrialCycle,
            };
            planDetails.push(obj);          
          })
        );

        /////////////////////updated plans to push
        let updatedPlans = [];
        ///**********************/// previous existing plans to update
        await Promise.all(
          req.body.prevPlanList?.map(async (item, index) => {
          
            let obj = {
              planName: item.frequencyPlanName,
              plan_id: item.plan_id,
              billingCycle: item.autoRenew,
              billingEvery: item.billEvery,
              billingEveryType: item.interval,
              offerDiscount: item.offerDiscount,
              priceType: item.discountType,
              price: item.discount,
              minCycle: item.minCycle,
              maxCycle: item.maxCycle,
              planType: item.planType,
              deliveryEvery: item.deliveryEvery,
              freeTrial: item.freeTrial,
              trialCount: item.freeTrialCount,
              freeTrialCycle: item.freeTrialCycle,
            };
            updatedPlans.push(obj);
          })
        );
        /////////////////////

        let data = await planModal.findOneAndUpdate(
          { shop: shop, plan_group_id: req.body.id },
          {
            $set: {
              plans: planDetails.concat(updatedPlans),
              plan_group_name: req.body.planGroupName,
            },
          }
        );
      }
    } catch (err) {
      console.log(err, "error");
      res.send({ message: "error", data: "Something went wrong" });
    }
  }
}

export async function prodExAddProduct(req, res) {
 
  const secretOrPublicKey = process.env.SHOPIFY_API_SECRET;
  const token = req.headers.authentication;
  let shop;
  verifyToken(token, secretOrPublicKey, (err, decodedToken) => {
    if (err) {
    } else {
      console.log("Payload:", decodedToken);
      shop = decodedToken.dest.replace(/^https?:\/\//, "");
    }
  });

  if (shop) {
    let cli = await getshopToken(shop);
    let variants = [];

    if (req.body.data.variantId == undefined) {
      let getproductVarientQuery = `query {
      product(id: "${req.body.data.productId}") {
        id
        handle
        title
        hasOnlyDefaultVariant
        images(first: 1) {
          edges {
            node {
              url
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              id
              title
              image {
                url
              }
              price
            }
          }
        }
        
      }
    }
    `;
      let VIDs = await cli.request(getproductVarientQuery);
      VIDs.data.product.variants.edges.map((item) => {
        variants.push(item.node.id);
      });
    } else {
      variants.push(req.body.data.variantId);
    }

    const varientAdd = `mutation sellingPlanGroupAddProductVariants($id: ID!, $productVariantIds: [ID!]!) {
    sellingPlanGroupAddProductVariants(id: $id, productVariantIds: $productVariantIds) {
      sellingPlanGroup {
id      }
      userErrors {
        field
        message
      }
    }
  }
  `;
 
    try {
      req.body.selectedPlans?.map(async (item, index) => {
        let response2 = await cli.request(varientAdd,{
           variables: {
              id: item,
              productVariantIds: variants,
            },        
        });
  
        if (index + 1 == req.body.selectedPlans.length) {
          res.send({ message: "success", data: "added" });
        }
      });
    } catch (err) {
      console.log(err.response.errors, "varientToAdd");
      res.send({ message: "error", data: "Something went wrong" });
    }
  }
}

export async function prodExGetallPlans(req, res) {
  const secretOrPublicKey = process.env.SHOPIFY_API_SECRET;
  const token = req.headers.authentication;
  let shop;
  verifyToken(token, secretOrPublicKey, (err, decodedToken) => {
    if (err) {
    } else {
      console.log("Payload:", decodedToken);
      shop = decodedToken.dest.replace(/^https?:\/\//, "");
    }
  });

  if (shop) {
    try {
      let data = await planModal.find(
        { shop: shop },
        { plan_group_id: 1, plan_group_name: 1 }
      );
      if (data) {
        res.send({ message: "success", data: data });
      }
    } catch (err) {
      res.send({ message: "error", data: "Something went wrong" });
    }
  }
}

//////////////customer poratl settings
export async function saveCustomerPortalDetails(req, res) {
  let shop = res.locals.shopify.session.shop;
  let data = req.body;
  try {
    // let getdata = await cPortalSettings.findOne({ shop: shop });
    // console.log(getdata, "pp");
    let values = data.values;
    // for (const key in data.values) {
    //   if (data.values.hasOwnProperty(key)) {
    //     values[key] = data.values[key];
    //   }
    // }
    let saveData = await cPortalSettings.findOneAndUpdate(
      { shop: shop },
      {
        values: values,
        cancellation: data.selectedOption,
        options: data.options,
      },
      { upsert: true, new: true }
    );
    
    if (saveData) {
      res.send({ message: "success", data: "Settings saved successfully" });
    }
  } catch (err) {
    console.log("err", err);
    res.send({ message: "error", data: "Something went wrong" });
  }
}

export async function getCustomerPortalDetails(req, res) {
  let shop = res.locals.shopify.session.shop;

  try {
    let saveData = await cPortalSettings.findOne({ shop: shop });
   
    if (saveData) {
      res.send({ message: "success", data: saveData });
    } else {
      res.send({ message: "noData", data: "no" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "error", data: "Something went wrong" });
  }
}

///////////////////////////////////customrt portal


export async function sendInvoiceMailAndSaveContract(req, res) {
  console.log("in sendInvoiceMailAndSaveContract");
  try {
    let details;
    let getorder = await orderOnly.findOne({
      status: false,
      orderId: { $ne: null },
    });
    if (getorder) {
      let orderId = '"' + getorder.orderId + '"';

      let orderQuery = `query {
        node(id: ${orderId}) {
          ... on Order {
            createdAt
            confirmationNumber
            subtotalPriceSet {
              presentmentMoney {
                amount
                currencyCode
              }
            }
            totalDiscountsSet {
              presentmentMoney {
                amount
                currencyCode
              }
            }
            totalShippingPriceSet {
              presentmentMoney {
                amount
                currencyCode
              }
            }
            totalTaxSet {
              presentmentMoney {
                amount
                currencyCode
              }
            }
            totalPriceSet {
              presentmentMoney {
                currencyCode
                amount
              }
            }
            name
            email
            customer {
              id
              email
              firstName
            }
            billingAddress {
              firstName
              lastName
              address1
              address2
              city
              zip
              phone
              country
              province
              countryCodeV2
              provinceCode
            }
            shippingAddress {
              firstName
              lastName
              address1
              address2
              city
              zip
              phone
              country
              province
              countryCodeV2
              provinceCode
            }
            lineItems(first: 50) {
              edges {
                node {
                  name
                  quantity
                  originalUnitPriceSet{
                    presentmentMoney{
                      amount
                      currencyCode
                    }
                  }
                  discountedUnitPriceSet{
                    presentmentMoney{
                      amount
                      currencyCode
                    }
                  }
                  id
                  image {
                    url
                  }
                  contract {
                    id
                    billingPolicy {
                      interval
                      intervalCount
                    }
                    deliveryPolicy {
                      interval
                      intervalCount
                    }
                    nextBillingDate
                    customerPaymentMethod {
                      __typename
                      instrument {
                        __typename
                        ... on CustomerCreditCard {
                          brand
                          expiryYear
                          expiryMonth
                          lastDigits
                          name
                        }
                        ... on CustomerShopPayAgreement {
                          expiryMonth
                          expiryYear
                          isRevocable
                          maskedNumber
                          lastDigits
                          name
                        }
                        ... on CustomerPaypalBillingAgreement {
                          billingAddress {
                            country
                          }
                          paypalAccountEmail
                        }
                      }
                    }
                  }
                  sellingPlan {
                    name
                    sellingPlanId
                  }
                }
              }
            }
          }
        }
      }`;

      /////////////////creating client
      let client = await getshopToken(getorder.shop);
      //////////////   get invoice details
      let saveDetails = await invoice_all_details.findOne({
        shop: getorder.shop,
      });
      let orderQueryData = await client.request(orderQuery);
      // console.log( orderQueryData.data.node.shippingAddress,"detailssssssss");
      let orderDetails = orderQueryData.data.node;

      //////////////////getiing contracts related to order

      checkContracts();
      async function checkContracts() {
        let contract = await orderContractDetails.findOne({
          status: false,
          orderId: getorder.orderId,
        });
        if (contract) {
          let contractId = '"' + contract.contractID + '"';
          // console.log(contractId, "contractId");
          let mutation = `query {
              subscriptionContract(id: ${contractId}) {
                id
                originOrder {
                  id
                  name
                  totalPriceSet {
                    presentmentMoney {
                      amount
                      currencyCode
                    }
                  }
                  customerLocale
                  shippingLine {
                    code
                    originalPriceSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
                customer {
                  firstName
                  lastName
                  id
                  email
                }
                customerPaymentMethod {
                  id
                  instrument {
                    __typename
                    ... on CustomerCreditCard {
                      brand
                      expiresSoon
                      expiryMonth
                      expiryYear
                      firstDigits
                      lastDigits
                      name
                    }
                    ... on CustomerShopPayAgreement {
                      expiresSoon
                      expiryMonth
                      expiryYear
                      lastDigits
                      name
                  }
                  ... on CustomerPaypalBillingAgreement{
                      paypalAccountEmail
                  }
                  }
                }
                nextBillingDate
                billingPolicy {
                  intervalCount
                  interval
                  maxCycles
                  minCycles
                }
                deliveryPolicy {
                  intervalCount
                }
                lines(first: 50) {
                  edges {
                    node {
                      id
                      quantity
                      sellingPlanId
                      sellingPlanName
                      productId
                      requiresShipping
                      variantId
                      variantTitle
                      title
                      quantity
                      variantImage {
                        url
                      }
                      discountAllocations {
                        amount {
                          amount
                        }
                        discount {
                          __typename
                          ... on SubscriptionManualDiscount {
                            title
                          }
                        }
                      }
                      pricingPolicy {
                        basePrice {
                          amount
                        }
                        cycleDiscounts {
                          adjustmentType
                          afterCycle
                          computedPrice {
                            amount
                          }
                          adjustmentValue {
                            ... on MoneyV2 {
                              amount
                            }
                            ... on SellingPlanPricingPolicyPercentageValue {
                              percentage
                            }
                          }
                        }
                      }
                      currentPrice {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }`;

          let contractData = await client.request(mutation);
          // console.log(contractData.data.subscriptionContract?.billingPolicy,"mutationn" );
          
          ///////////////////getting autao renew from db
          let autoRenewState = await planModal.findOne(
            {
              shop: getorder.shop, // Replace with your plan_group_id
              plans: {
                $elemMatch: {
                  plan_id:
                    contractData.data.subscriptionContract.lines.edges[0]
                      .node.sellingPlanId,
                }, // Replace with the plan_id you want to filter by
              },
            },
            {
              "plans.$": 1,
              _id: 0,
            }
          );
         
          let products = [];
          let plantype =
            contractData.data.subscriptionContract?.billingPolicy
              ?.intervalCount ==
            contractData.data.subscriptionContract?.deliveryPolicy
              ?.intervalCount
              ? "payAsYouGo"
              : "prepaid";
          contractData.data.subscriptionContract.lines.edges.map((el) => {
            let price = Number(el.node.currentPrice?.amount);
            // console.log(el.node.currentPrice?.amount,"el.node.currentPrice?.amount");
            if (plantype == "prepaid") {
              let deliveries =
                Number(
                  contractData.data.subscriptionContract?.billingPolicy
                    ?.intervalCount
                ) /
                Number(
                  contractData.data.subscriptionContract?.deliveryPolicy
                    ?.intervalCount
                );
              price = Number(el.node.currentPrice?.amount) / deliveries;
            
            }
           

            let computedPrice;
            if (el.node?.pricingPolicy?.cycleDiscounts.length == 2) {
              computedPrice =
                el?.node?.pricingPolicy?.cycleDiscounts?.[1]?.computedPrice
                  .amount;
             

              let freeTrial =
                el?.node?.pricingPolicy?.cycleDiscounts[1]?.afterCycle;
              if (freeTrial == 1) {
                if (plantype == "prepaid") {
                  let deliveries =
                    Number(
                      contractData.data.subscriptionContract?.billingPolicy
                        ?.intervalCount
                    ) /
                    Number(
                      contractData.data.subscriptionContract
                        ?.deliveryPolicy?.intervalCount
                    );
                  price = Number(computedPrice) / deliveries;
                } else {
                  price = computedPrice;
                }
              }

            }
            const productObj = {
              id: el.node.variantId,
              title: el.node.variantTitle,
              image: el.node.variantImage?.url,
              price: price,
              quantity: el.node.quantity,
              requiresShipping: el.node.requiresShipping,
              product_id: el.node.productId,
              product_name: el.node.title,
              product_image: el.node.variantImage?.url,
              hasOnlyDefaultVariant: "",
              subscriptionLine: el.node.id,
            };
            // if (computedPrice !== undefined) {
            //   productObj.computedPrice = computedPrice;
            // }
            products.push(productObj);
          });
          // fs.appendFile(
          //   "mutationdata2.txt",
          //   JSON.stringify(contractData),
          //   function (err) {
          //     if (err) throw err;
          //     console.log("IS WRITTEN");
          //   }
          // );

          ////////check max billing value funcionility////////////

          if (
            contractData.data.subscriptionContract?.billingPolicy
              ?.maxCycles == 1
          ) {
            
            const mutationQuery = `mutation subscriptionContractUpdate($contractId: ID!) {
  subscriptionContractUpdate(contractId: $contractId) {             
    draft {            
     id            
    }
      userErrors {
      field
      message
    }
  }
}`;
            const Input1 = {
              contractId: contract?.contractID,
            };
            let response1 = await client.request(mutationQuery,{
                    variables: Input1 
                  });
                  
            if (
              response1.data?.subscriptionContractUpdate?.userErrors
                .length < 1
            ) {
              let draftID =
                response1.data.subscriptionContractUpdate?.draft?.id;

              const mutationQuery = `mutation subscriptionDraftUpdate($draftId: ID!, $input: SubscriptionDraftInput!) {
    subscriptionDraftUpdate(draftId: $draftId, input: $input) {
      draft {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }`;

              const Input = {
                draftId: draftID,
                input: { status: "PAUSED" },
              };
              let response2 = await client.request(mutationQuery,{
                      variables: Input 
                    });

              if (
                response2.data?.subscriptionDraftUpdate?.userErrors
                  .length < 1
              ) {
                
                let mutationSubscriptionDraftCommit = `mutation subscriptionDraftCommit($draftId: ID!) {
    subscriptionDraftCommit(draftId: $draftId) {
      contract {
      id
      status
      }
      userErrors {
        field
        message
      }
    }
  }`;

                const InputMutationSubscriptionDraftCommit = {
                  draftId: draftID,
                };
                let response3 = await client.request(mutationSubscriptionDraftCommit,{
                       variables: InputMutationSubscriptionDraftCommit,
                          });
                if (
                  response3?.data?.subscriptionDraftCommit?.userErrors
                    .length < 1
                ) {
                  
                  let updateTable =
                    await subscriptionDetailsModal.findOneAndUpdate(
                      {
                        shop: getorder.shop,
                        subscription_id: `gid://shopify/SubscriptionContract/${contract.contractID}`,
                      },
                      { status: "PAUSED" }
                    );
                }
              }
            }
          }

          ////////////////////////

          let allData = contractData.data.subscriptionContract;
          // console.log(allData, "productsswwewesss");
          let updatedBillingAddress = {
            ...orderDetails?.billingAddress,
            countryCode: orderDetails?.billingAddress.countryCodeV2,
          };
          delete updatedBillingAddress.countryCodeV2;

          let updatedShippingAddress = orderDetails.shippingAddress
            ? {
                ...orderDetails.shippingAddress,
                countryCode: orderDetails?.shippingAddress?.countryCodeV2,
              }
            : {};
          updatedShippingAddress?.countryCodeV2 &&
            delete updatedShippingAddress?.countryCodeV2;
       
          let obj = {
            shop: getorder.shop,
            subscription_id: contract.contractID,
            createdBy: "customer",
            customer_details: allData?.customer,
            shipping_address: updatedShippingAddress,
            billing_address: updatedBillingAddress,
            subscription_details: {
              planName:
                contractData?.data?.subscriptionContract?.lines?.edges[0]
                  ?.node?.sellingPlanName,
              planType:
                contractData.data.subscriptionContract?.billingPolicy
                  ?.intervalCount ==
                contractData.data.subscriptionContract?.deliveryPolicy
                  ?.intervalCount
                  ? "payAsYouGo"
                  : "prepaid",
              billingLength:
                contractData.data.subscriptionContract?.billingPolicy
                  ?.intervalCount,
              delivery_billingType:
                contractData.data.subscriptionContract?.billingPolicy
                  ?.interval,
              delivery_billingValue:
                contractData.data.subscriptionContract?.deliveryPolicy
                  ?.intervalCount,
              currency: getCurrencySymbol(
                orderDetails.subtotalPriceSet.presentmentMoney.currencyCode
              ),
              billingMaxValue:
                contractData.data.subscriptionContract?.billingPolicy
                  ?.maxCycles,
              billingMinValue:
                contractData.data.subscriptionContract?.billingPolicy
                  ?.minCycles,
              autoRenew: autoRenewState?.plans[0]?.billingCycle,
              currency:
                contractData.data.subscriptionContract.originOrder
                  .totalPriceSet.presentmentMoney.currencyCode,
            },
            product_details: products,
            payment_details: {
              payment_method_token: allData?.customerPaymentMethod?.id,
              payment_instrument_value:
                allData?.customerPaymentMethod.instrument,
            },
            nextBillingDate: allData?.nextBillingDate,
            status:
              contractData.data.subscriptionContract?.billingPolicy
                ?.maxCycles == 1
                ? "PAUSED"
                : "active",
          };     

          if (
            contractData?.data?.subscriptionContract?.lines?.edges[0]
              ?.node?.pricingPolicy
          ) {
            let policies;
            let discountvalue;

            if (
              contractData?.data?.subscriptionContract?.lines?.edges[0]
                ?.node?.pricingPolicy?.cycleDiscounts.length == 1
            ) {
              policies =
                contractData?.data?.subscriptionContract?.lines?.edges[0]
                  ?.node?.pricingPolicy?.cycleDiscounts[0];

              discountvalue =
                contractData?.data?.subscriptionContract?.lines?.edges[0]
                  ?.node?.pricingPolicy?.cycleDiscounts[0]?.adjustmentValue;
            } else {
              policies =
                contractData?.data?.subscriptionContract?.lines?.edges[0]
                  ?.node?.pricingPolicy?.cycleDiscounts[1];

              discountvalue =
                contractData?.data?.subscriptionContract?.lines?.edges[0]
                  ?.node?.pricingPolicy?.cycleDiscounts[1]?.adjustmentValue;
              let freeTrial =
                contractData?.data?.subscriptionContract?.lines?.edges[0]
                  ?.node?.pricingPolicy?.cycleDiscounts[1]?.afterCycle;
              // obj.subscription_details.freeTrial = freeTrial;

              if (parseInt(freeTrial) == 1) {
                obj.subscription_details.freeTrialStatus = true;

                contractData?.data?.subscriptionContract?.lines?.edges.forEach(
                  async (item, index) => {
                    const mutationQuery = `mutation subscriptionContractUpdate($contractId: ID!) {
                    subscriptionContractUpdate(contractId: $contractId) {             
                      draft {            
                       id            
                      }
                        userErrors {
                        field
                        message
                      }
                    }
                  }`;
                    const Input1 = {
                      contractId: contract.contractID,
                    };
                    let response1 = await client.request(mutationQuery,{
                            variables: Input1 
                            });                  
                    if (
                      response1.data?.subscriptionContractUpdate
                        ?.userErrors.length < 1
                    ) {
                    
                      let draftID =
                        response1.data.subscriptionContractUpdate?.draft
                          ?.id;

                      const mutationQuery = `mutation subscriptionDraftLineUpdate($draftId: ID!, $input: SubscriptionLineUpdateInput!, $lineId: ID!) {
                    subscriptionDraftLineUpdate(draftId: $draftId, input: $input, lineId: $lineId) {
                      draft {
                        id
                      }
                      lineUpdated {
                        id
                        variantId
                        quantity
                        productId
                        currentPrice {
                          amount
                        }
                      }
                      userErrors {
                        field
                        message
                      }
                    }
                  }`;

                      const Input = {
                        draftId: draftID,
                        input: {
                          currentPrice:
                            item?.node?.pricingPolicy?.cycleDiscounts?.[1]
                              ?.computedPrice.amount,
                        },
                        lineId: item?.node?.id,
                      };

                      let response2 = await client.request(mutationQuery,{
                                        variables: Input 
                                      });

                      if (
                        response2.data?.subscriptionDraftLineUpdate
                          ?.userErrors.length < 1
                      ) {
                       
                        let mutationSubscriptionDraftCommit = `mutation subscriptionDraftCommit($draftId: ID!) {
                      subscriptionDraftCommit(draftId: $draftId) {
                        contract {
                        id
                        status
                        }
                        userErrors {
                          field
                          message
                        }
                      }
                    }`;

                        const InputMutationSubscriptionDraftCommit = {
                          draftId: draftID,
                        };
                        let response3 = await client.request(mutationSubscriptionDraftCommit,{
                               variables: InputMutationSubscriptionDraftCommit
                              });

                      }
                    }
                  }
                );

                let updatedDate = dateChange(
                  autoRenewState?.plans[0]?.freeTrialCycle,
                  new Date(),
                  autoRenewState?.plans[0]?.trialCount
                );
               
                obj.nextBillingDate = updatedDate;
                obj.subscription_details.freeTrial =
                  autoRenewState?.plans[0]?.trialCount;
                obj.subscription_details.freeTrialCycle =
                  autoRenewState?.plans[0]?.freeTrialCycle;
              }
              // else {
              //   obj.subscription_details.freeTrialStatus = true;
              //   obj.subscription_details.freeTrialCycle= autoRenewState?.plans[0]?.freeTrialCycle;
              // }
            }

            obj.subscription_details.discount = {
              type: policies?.adjustmentType,
              value: discountvalue[Object.keys(discountvalue)],
            };
          }

          const currentDate = new Date().toISOString();
       
          let saveToBillingAttempt = await billing_Attempt.create({
            shop: getorder.shop,
            status: "initial",
            billing_attempt_date: currentDate,
            renewal_date: currentDate,
            contract_products: products,
            order_id:
              contractData.data.subscriptionContract.originOrder.id,
            order_no:
              contractData.data.subscriptionContract.originOrder.name,
            contract_id: contract.contractID,
            currency:
              contractData.data.subscriptionContract.originOrder
                .totalPriceSet.presentmentMoney.currencyCode,
            total_amount:
              contractData.data.subscriptionContract.originOrder
                .totalPriceSet.presentmentMoney.amount,
          });
          ///////////////// check max to pause start////////////////////////
         
          if (
            contractData.data.subscriptionContract?.billingPolicy
              ?.maxCycles != undefined &&
            contractData.data.subscriptionContract?.billingPolicy
              ?.maxCycles != null
          ) {
            if (
              1 ==
              parseInt(
                contractData.data.subscriptionContract?.billingPolicy
                  ?.maxCycles
              )
            ) {
             
              const mutationQuery = `mutation subscriptionContractUpdate($contractId: ID!) {
                subscriptionContractUpdate(contractId: $contractId) {             
                  draft {            
                   id            
                  }
                    userErrors {
                    field
                    message
                  }
                }
              }`;
              const Input1 = {
                contractId: contract.contractID,
              };
              let response1 = await client.request(mutationQuery,{
                        variables: Input1 
                      });
             
              if (
                response1.data?.subscriptionContractUpdate?.userErrors
                  .length < 1
              ) {
               
                let draftID =
                  response1.data.subscriptionContractUpdate?.draft?.id;

                const mutationQuery = `mutation subscriptionDraftUpdate($draftId: ID!, $input: SubscriptionDraftInput!) {
                  subscriptionDraftUpdate(draftId: $draftId, input: $input) {
                    draft {
                      id
                      status
                    }
                    userErrors {
                      field
                      message
                    }
                  }
                }`;

                const Input = {
                  draftId: draftID,
                  input: { status: "PAUSED" },
                };
                let response2 = await client.request(mutationQuery,{
                      variables: Input 
                    });

                if (
                  response2.data?.subscriptionDraftUpdate?.userErrors
                    .length < 1
                ) {
                  let mutationSubscriptionDraftCommit = `mutation subscriptionDraftCommit($draftId: ID!) {
                  subscriptionDraftCommit(draftId: $draftId) {
                    contract {
                    id
                    status
                    }
                    userErrors {
                      field
                      message
                    }
                  }
                }`;

                  const InputMutationSubscriptionDraftCommit = {
                    draftId: draftID,
                  };
                  let response3 = await client.request(mutationSubscriptionDraftCommit,{
                          variables: InputMutationSubscriptionDraftCommit                    
                  });
                }
              }
            }
          }
          ////////////////////////////check max to pause end////////////////////////

          let saveContractDetailsToDB = await subscriptionDetailsModal.create(obj);
         

          if (saveContractDetailsToDB) {
            let updateDb = await orderContractDetails.findOneAndUpdate(
              { shop: getorder.shop, contractID: contract.contractID },
              { status: true }
            );
           
            checkContracts();
          }
        } else {
          let updateOrderDb = await orderOnly.findOneAndUpdate(
            { shop: getorder.shop, orderId: getorder.orderId },
            { status: true }
          );
        }
      }

      /////////////////////send invoice start
      if (orderDetails) {
        let addTagMutation = `mutation tagsAdd($id: ID!, $tags: [String!]!) {
              tagsAdd(id: $id, tags: $tags) {
                node {
                id
                }
                userErrors {
                  field
                  message
                }
              }
            }`;

        let customerTagInput = {
          id: orderDetails.customer.id,
          tags: ["revlytic-subcription-customer"],
        };

        let orderTagInput = {
          id: getorder.orderId,
          tags: ["revlytic-subscription"],
        };

        let addOrderTag = await client.request(addTagMutation,{
               variables: orderTagInput
              });
        let addCustomerTag = await client.request(addTagMutation,{
              variables: customerTagInput,
        });
        
        details = {
          email: orderDetails.email,
          bill_to: {
            firstName:
              orderDetails.billingAddress.firstName != undefined
                ? orderDetails.billingAddress.firstName
                : "",
            lastName:
              orderDetails.billingAddress.lastName != undefined
                ? orderDetails.billingAddress.lastName
                : "",
            address1:
              (orderDetails.billingAddress.address1 != undefined
                ? orderDetails.billingAddress.address1
                : "") +
                " " +
                orderDetails.billingAddress.address2 !=
              undefined
                ? orderDetails.billingAddress.address2
                : "",
            address2:
              orderDetails.billingAddress.city != undefined
                ? orderDetails.billingAddress.city
                : "" + "-" + orderDetails.billingAddress.zip != undefined
                ? orderDetails.billingAddress.zip
                : "",

            province:
              orderDetails.billingAddress.province != undefined
                ? orderDetails.billingAddress.province
                : "",
            country:
              orderDetails.billingAddress.country != undefined
                ? orderDetails.billingAddress.country
                : "",
          },
          billing_date: new Date(orderDetails.createdAt)
            .toISOString()
            .split("T")[0],
          subtotal:
            orderDetails.subtotalPriceSet.presentmentMoney.amount != null
              ? orderDetails.subtotalPriceSet.presentmentMoney.amount
              : 0,
          discount:
            orderDetails.totalDiscountsSet.presentmentMoney.amount != null
              ? orderDetails.totalDiscountsSet.presentmentMoney.amount
              : 0,
          shipping:
            orderDetails.totalShippingPriceSet.presentmentMoney.amount != null
              ? orderDetails.totalShippingPriceSet.presentmentMoney.amount
              : 0,
          tax:
            orderDetails.totalTaxSet.presentmentMoney.amount != null
              ? orderDetails.totalTaxSet.presentmentMoney.amount
              : 0,
          total:
            orderDetails.totalPriceSet.presentmentMoney.amount != null
              ? orderDetails.totalPriceSet.presentmentMoney.amount
              : 0,
          items: orderDetails.lineItems.edges,
          labels: saveDetails.invoice_details,
          components: saveDetails.components,
          orderno: orderDetails.name,
          currency: getCurrencySymbol(
            orderDetails.subtotalPriceSet.presentmentMoney.currencyCode
          ),
        };
      

        let lineItemDetails = orderDetails.lineItems.edges;
        let newArr = [];
        // let plansDetailObj = {};
        // let lineItemSellingPlanObj = {};
        let flag = false;
        let contractDetails;
        let imageObj = {};
        let emailCheck = false;
        lineItemDetails.map((item, index) => {
          newArr.push({
            id: item.node.id,
            sellingPlanId: item.node?.sellingPlan?.sellingPlanId,
            sellingPlanName: item.node?.sellingPlan?.name,
            imageUrl: item.node?.image?.url,
            name: item.node?.name,
            quantity: item?.node?.quantity,
            price:
              item.node?.discountedUnitPriceSet?.presentmentMoney?.amount !=
              null
                ? item.node?.discountedUnitPriceSet?.presentmentMoney?.amount
                : 0,
          });

          imageObj[item.node.id] = item.node?.image?.url;
         if (item.node.sellingPlan) {
            emailCheck = true;
            if (flag == false) {
              contractDetails = item?.node?.contract?.customerPaymentMethod;
              flag = true;
            }
          
            newArr.at(-1).planName = item?.node?.sellingPlan?.name;
            newArr.at(-1).contractId = item?.node?.contract?.id
              ?.split("/")
              ?.at(-1);
            newArr.at(-1).billingEvery =
              item?.node?.contract?.billingPolicy?.intervalCount;
            newArr.at(-1).billingEveryType =
              item?.node?.contract?.billingPolicy?.interval;
            newArr.at(-1).deliveryEvery =
              item?.node?.contract?.deliveryPolicy?.intervalCount;
            newArr.at(-1).deliveryEveryType =
              item?.node?.contract?.deliveryPolicy?.interval;
            newArr.at(-1).nextBillingDate =
              item?.node?.contract?.nextBillingDate;
          }
        });


        let getData = {
          order_number: orderDetails?.name,
          customer_id: orderDetails?.customer?.id,
          customer_email: orderDetails?.customer?.email,
          customer_name:
            orderDetails?.customer?.firstName != null
              ? orderDetails?.customer?.firstName
              : "",
          shipping_address: orderDetails?.shippingAddress,
          billing_address: orderDetails?.billingAddress,
          items: newArr,
          currencySymbol: getCurrencySymbol(
            orderDetails?.subtotalPriceSet?.presentmentMoney?.currencyCode
          ),
        };

        try {
       
          let shopName;
          let shopEmail;
          let subscriptionPurchasedTemplateData =
            await emailTemplatesModal.findOne(
              { shop: getorder.shop },
              {
                "settings.subscriptionPurchased": 1,
                "settings.subscriptionInvoice": 1,
                configuration: 1,
              }
            );
        
          if (subscriptionPurchasedTemplateData) {
            let sendMailToCustomer =
              subscriptionPurchasedTemplateData?.settings?.subscriptionPurchased
                ?.status;
            let sendMailToMerchant =
              subscriptionPurchasedTemplateData?.settings?.subscriptionPurchased
                ?.adminNotification;

            if (sendMailToCustomer || sendMailToMerchant) {
              let recipientMails = [];
              if (sendMailToMerchant) {
                let storeData = await getStoreDetails(getorder.shop);
                shopEmail = storeData.store_email;
                shopName = storeData.store_name;                
                recipientMails.push(shopEmail);
                getData.shopEmail = shopEmail;
                getData.shopName = shopName;
              }
              if (sendMailToCustomer) {               
                recipientMails.push(getData.customer_email);
              }
           
              let configurationData =
                subscriptionPurchasedTemplateData?.configuration;
              let selectedTemplateData =
                subscriptionPurchasedTemplateData?.settings
                  ?.subscriptionPurchased;
           
              let mailCheck = await sendMailCall(
                recipientMails,
                {},
                {
                  shop: getorder.shop,
                  selectedTemplateData,
                  configurationData,
                  data: {
                    ...getData,
                    recipientMails: recipientMails,
                    contractDetails,
                  },
                  check: "orderCreate",
                }
              );
            }
          }
          if (subscriptionPurchasedTemplateData && saveDetails.components[17]) {
            let sendMailToCustomer =
              subscriptionPurchasedTemplateData?.settings?.subscriptionInvoice
                ?.status;
            let sendMailToMerchant =
              subscriptionPurchasedTemplateData?.settings?.subscriptionInvoice
                ?.adminNotification;

            if (sendMailToCustomer || sendMailToMerchant) {
              let recipientMails = [];

              if (sendMailToMerchant) {
                let storeData = await getStoreDetails(getorder.shop);
                shopEmail = storeData.store_email;
                shopName = storeData.store_name;
             
                recipientMails.push(shopEmail);
                getData.shopEmail = shopEmail;
                getData.shopName = shopName;
              }
              if (sendMailToCustomer) {
               
                recipientMails.push(getData.customer_email);
              }
          
              let configurationData =
                subscriptionPurchasedTemplateData?.configuration;
              let selectedTemplateData =
                subscriptionPurchasedTemplateData?.settings
                  ?.subscriptionInvoice;
              
              let mailCheck = await sendMailCall(
                recipientMails,
                {},
                {
                  shop: getorder.shop,
                  selectedTemplateData,
                  configurationData,
                  data: {
                    ...getData,
                    recipientMails: recipientMails,
                    contractDetails,
                  },
                  check: "subscriptionInvoice",
                  details,
                  orderId: getorder.orderId,
                }
              );
            }
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    }
  } catch (err) {
    console.error("Error in fetching orders", err);
  }
}

export async function checkAppBlock(req,res) {
  try {
    let {shop}=res.locals.shopify.session;
    let storeDetails = await getStoreDetails(shop);
    let theme_config_data = await shopify.api.rest.Asset.all({
      session: res.locals.shopify.session,
      theme_id: storeDetails?.themeId,
      asset: { key: "templates/product.json"},
    });
    let currentThemeData = JSON.parse(theme_config_data?.data[0]?.value);
    let blockData=currentThemeData?.sections?.main?.blocks;
    
    let searchedBlock ;
    if (blockData) {
    searchedBlock=Object?.values(blockData)?.find(
      (item) =>
        item?.type ==
        `shopify://apps/${process.env?.APP_NAME}/blocks/revlytic_app_bock/${process.env?.SHOPIFY_THEME_APP_EXTENSION_ID}`
    );
   
    if(searchedBlock && !searchedBlock.disabled){
     res.send({message:'success',active:true})
    }
    else{
      res.send({message:'success',active:false})
    }
    }

  } catch (error) {
    console.log(error);
  }
}

export async function setUpGuideStatusCheck(req,res){
try{
  let { shop } = res.locals.shopify.session;
   let data=await shopModal.findOne({shop});
   res.send({message : "success",data})

}
catch(error){
  res.send({message:"error"})
  console.log("error",error)
}
}


export async function stagedUploadsCreateMutation(session){  
  try
  {  
let stagedUploadsCreateMutation=`mutation {
  stagedUploadsCreate(input:{
    resource: BULK_MUTATION_VARIABLES,
    filename: "Bulk_op_vars",
    mimeType: "text/jsonl",
    httpMethod: POST
  }){
    userErrors{
      field,
      message
    },
    stagedTargets{
      url,
      resourceUrl,
      parameters {
        name,
        value
      }
    }
  }
}
`

const client = new shopify.api.clients.Graphql({session});
let Input=
  {
    resource: "BULK_MUTATION_VARIABLES",
    filename: "Bulk_op_vars",
    mimeType: "text/jsonl",
    httpMethod: "POST"
  }

let mutationResponse = await client.query({
  data: { query: stagedUploadsCreateMutation },
});
console.log("mutationResponse",mutationResponse.body.data.stagedUploadsCreate);

if(mutationResponse.body.data.stagedUploadsCreate.userErrors.length == 0){
console.log("array",mutationResponse.body.data.stagedUploadsCreate.stagedTargets[0].parameters);
let url=mutationResponse.body.data.stagedUploadsCreate.stagedTargets[0].url;
let fileUploadParamsArray=mutationResponse.body.data.stagedUploadsCreate.stagedTargets[0].parameters;
uploadFile(fileUploadParamsArray,url)
}
  }
  catch(error){
    console.log("error",error)
  }
}

export async function bulkSetNextBillingDateMutation(session,uploadpath){
  try
  //let mutation = `mutation subscriptionBillingAttemptCreate($subscriptionBillingAttemptInput: SubscriptionBillingAttemptInput!, $subscriptionContractId: ID!) {
    // subscriptionBillingAttemptCreate(subscriptionBillingAttemptInput: $subscriptionBillingAttemptInput, subscriptionContractId: $subscriptionContractId) {
    {
      let bulkSetNextBillingDateMutation = `mutation {
        bulkOperationRunMutation(
          mutation: "mutation subscriptionContractSetNextBillingDate($contractId: ID!, $date: DateTime!){subscriptionContractSetNextBillingDate(contractId: $contractId, date: $date){contract{id nextBillingDate } userErrors {  field  message } } }",
          stagedUploadPath:${'"'+uploadpath+'"'}) {
          bulkOperation {
            id
            url
            status
          }
          userErrors {
            message
            field
          }
        }
      }`   
      const client = new shopify.api.clients.Graphql({session});

      let mutationResponse = await client.query({
        data: { query: bulkSetNextBillingDateMutation },
      });
      console.log('mutationresponse',mutationResponse.body.data.bulkOperationRunMutation)
      console.log("furtherdata",mutationResponse.body.data.bulkOperationRunMutation.userErrors[0])  

    }
catch(error)
   {
console.log("error",error)
   }
}
  
  async function uploadFile(data,url) {
   const form = new FormData();  
   let obj={};
    data.forEach((item)=>{
      obj[item.name]=item.value
          },[])

  console.log("obj",obj)    
    // Append form fields
    form.append('key',obj["key"]);
    form.append('x-goog-credential', obj["x-goog-credential"]);
    form.append('x-goog-algorithm', obj['x-goog-algorithm']);
    form.append('x-goog-date', obj['x-goog-date']);
    form.append('x-goog-signature',obj['x-goog-signature']);
    form.append('policy', obj['policy']);
    form.append('acl',obj['acl']);
    form.append('Content-Type',obj['Content-Type']);
    form.append('success_action_status', obj['success_action_status']);
    form.append('file', fs.createReadStream(path.join(__dirname,"/backend/Bulk_op_vars.jsonl")));  
    try {
      const response = await axios.post(url, form, {
        headers: {
          ...form.getHeaders()
        }
      });
      console.log('Response:=>', response);
      if(response.data){
         console.log("response.data",response.data)
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  }
  
  async function bulk_operationsFinishWebhookSubscription(session){
    try
    {
     let Mutation= `mutation {
        webhookSubscriptionCreate(
          topic: BULK_OPERATIONS_FINISH
          webhookSubscription: {
            format: JSON,
            callbackUrl: "https://diameter-ll-sharp-oklahoma.trycloudflare.com/api/webhooks"}
        ) {
          userErrors {
            field
            message
          }
          webhookSubscription {
            id
          }
        }
      }`      
      const client = new shopify.api.clients.Graphql({session});
      let mutationResponse = await client.query({
        data: { query: Mutation },
      });      
      console.log('mutationresponse',mutationResponse.body.data)
      console.log("furtherdata",mutationResponse.body.data.webhookSubscriptionCreate.userErrors[0])  
    }
    catch(error){
      console.log("error")
    }
  } 

  async function getBulkOperationUrl(session){
try
{
  let query=`query {
    node(id: "gid://shopify/BulkOperation/4279702487344") {
      ... on BulkOperation {
        url
        partialDataUrl
      }
    }
  }`

  const client = new shopify.api.clients.Graphql({session});
  let mutationResponse = await client.query({
    data: { query },
  });  
  console.log("mutationResponse",mutationResponse.body.data.node.url)
  if(mutationResponse.body.data.node.url){
    const response = await axios.get(mutationResponse.body.data.node.url);
    // console.log("urlresponse", response.data)
      
  const jsonArray = convertJsonlStringToJsonArray(response.data);
  // console.log("mydata",JSON.stringify(jsonArray, null, 2));
     
  }
}
catch(error){
console.log("error",error.message)
}
  }

  function convertJsonlStringToJsonArray(jsonlString) {
    const lines = jsonlString.split('\n');    
    const jsonArray = lines.map(line => {
      try {
        const jsonObject = JSON.parse(line.trim());
        if (jsonObject && Object.keys(jsonObject).length > 0) {
        if(jsonObject.data.subscriptionContractSetNextBillingDate.contract && Object.keys(jsonObject.data.subscriptionContractSetNextBillingDate.contract).length>0){
          return jsonObject;
        }
        }
      } catch (e) {
        // Ignore parsing errors
      }
      return null;
    }).filter(Boolean); // Remove any null entries from the array
  
    return jsonArray;
  } 
  
  
  // Example usage
  const jsonlData = `{"input": {"contractId": "gid://shopify/SubscriptionContract/11601903920", "date": "2024-09-08T15:50:00Z"}}
  {"input": {"contractId": "gid://shopify/SubscriptionContract/14226587952", "date": "2024-09-07T15:50:00Z"}}`;


    
