import crypto from "node:crypto";
import StoreSchemaModal from "../modals/storeDetails.js";
import productsModal from "../modals/Products.js";
import shopModal from "../modals/credential.js";
import planModal from "../modals/PlanGroupDetails.js";
import shopify from "../../shopify.js";
import subscriptionDetailsModal from "../modals/subscriptionDetails.js";
import emailTemplatesModal from "../modals/emailtemplates.js";
import billing_Attempt from "../modals/billingAttempt.js";
import invoice_all_details from "../modals/invoice.js";
import path from "path";
import ejs from "ejs";
import mime from "mime";
import fs from "fs";
import nodemailer from "nodemailer";
import orderOnly from "../modals/contractOrder.js";
import orderContractDetails from "../modals/contractOrderDetails.js";
import checkoutCustomerModal from "../modals/checkoutCustomer.js";
import cPortalSettings from "../modals/customerPortalSettings.js";
import planProductModal from "../modals/planGroupProducts.js";
import widgetSettingsModal from "../modals/widgetSetting.js";
import storeModal from "../modals/storeCredentials.js";
import uninstallModal from "../modals/uninstall.js";
import { DataType } from "@shopify/shopify-api";
const getStoreDetails = async (shop) => {
  try {
    let data = await StoreSchemaModal.findOne({ shop: shop });

    return data;
  } catch (error) {
    console.log(error);
  }
};

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

const sendPaymentFailureMail = async (recipientMails, others, extra) => {
  try {
    let data = extra?.configurationData;
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
      options = {
        from: `Revlytic <revlytic@gmail.com>`,
        // to: recipientMails[0],
        subject: extra?.selectedTemplateData?.emailSetting?.subject,
        cc: extra?.selectedTemplateData?.emailSetting?.cc,
        bcc: extra?.selectedTemplateData?.emailSetting?.bcc,
        replyTo: extra?.selectedTemplateData?.emailSetting?.replyTo,
        ...others,
      };

      emailConfig = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "revlytic@gmail.com",
          pass: "hynmucteprubqhnc",
        },
        secure: false,
      };
    }

    const __dirname = path.resolve();
    const dirPath = path.join(__dirname,"/web/frontend/components/emailtemplate");
    const transporter = nodemailer.createTransport(emailConfig);
    let selectedTemplate = extra?.selectedTemplateData;
    let replacements;
    let emailContent;

    replacements = {
      "{{subscription_id}}": extra?.data?.subscription_id?.split("/").at(-1),
      "{{customer_email}}": extra?.data?.customer_details?.email,
      "{{customer_name}}":
        extra?.data.customer_details?.firstName != null
          ? extra?.data.customer_details?.firstName
          : "",
      "{{customer_id}}": extra?.data?.customer_details?.id?.split("/").at(-1),
      "{{shop_name}}": extra?.shop_name,
      "{{shop_email}}": extra?.shop_email,
      "{{shipping_country}}": extra?.data?.shipping_address?.country,
      "{{shipping_full_name}}":
        extra?.data?.shipping_address?.firstName != null
          ? extra?.data?.shipping_address?.firstName
          : "" + " " + extra?.data?.shipping_address?.lastName != null
          ? extra?.data?.shipping_address?.lastName
          : "",
      "{{shipping_address_1}}": extra?.data?.shipping_address?.address1,
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
      "{{card_brand_name}}": extra?.data?.payment_details
        ?.payment_instrument_value?.brand
        ? extra?.data?.payment_details?.payment_instrument_value?.brand
            .charAt(0)
            .toUpperCase() +
          extra?.data?.payment_details?.payment_instrument_value?.brand
            .slice(1)
            .toLowerCase()
        : "",
      "{{last_four_digits}}":
        extra?.data?.payment_details?.payment_instrument_value?.lastDigits,
      "{{card_expiry_month}}":
        extra?.data?.payment_details?.payment_instrument_value?.expiryMonth,
      "{{card_expiry_year}}":
        extra?.data?.payment_details?.payment_instrument_value?.expiryYear,
      "{{heading_text}}": selectedTemplate?.headingText,
      "{{{logo_image}}": selectedTemplate?.logoUrl,
      "{{shiiping_address_text}}":
        selectedTemplate?.subscriptionShippingAddressText,
      "{{billing_address_text}}":
        selectedTemplate?.subscriptionBillingAddressText,
      "{{payment_method_text}}": selectedTemplate?.paymentMethodText,
      "{{logo_width}}": selectedTemplate?.logoWidth,
      "{{logo_height}}": selectedTemplate?.logoHeight,
      "{{logo_alignment}}": selectedTemplate?.logoAlignment,
    };

    if (recipientMails[0]) {
      options = {
        ...options,
        to: recipientMails[0],
      };
      let url;
      if (extra?.selectedTemplateData?.subscriptionUrl) {
        url = extra?.selectedTemplateData?.subscriptionUrl;
      } else {
        if (recipientMails[0] == extra?.data?.customer_details?.email) {
          url = `https://${extra?.shop}/account/login`;
        } else {
          url = `https://admin.shopify.com/store/${
            extra?.shop?.split(".myshopify.com")[0]
          }/apps/revlytic/create-manual-subscription?id=${(extra?.data.subscription_id)
            .split("/")
            .at(-1)}&mode=view`;
        }
      }
      emailContent = await ejs.renderFile(dirPath + "/preview2.ejs", {
        selectedTemplate,
        currencySymbol: extra?.currencySymbol,
        templateType: "paymentFailure",
        data: extra?.data,
        dateConversion,
        url: url,
        check: extra?.check,
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
      if (extra?.selectedTemplateData?.subscriptionUrl) {
        url = extra?.selectedTemplateData?.subscriptionUrl;
      } else {
        if (recipientMails[1] == extra?.data?.customer_details?.email) {
          url = `https://${extra?.shop}/account/login`;
        } else {
          url = `https://admin.shopify.com/store/${
            extra?.shop?.split(".myshopify.com")[0]
          }/apps/revlytic/create-manual-subscription?id=${(extra?.data.subscription_id)
            .split("/")
            .at(-1)}&mode=view`;
        }
      }

      emailContent = await ejs.renderFile(dirPath + "/preview2.ejs", {
        selectedTemplate,
        currencySymbol: extra?.currencySymbol,
        templateType: "paymentFailure",
        data: extra?.data,
        dateConversion,
        url: url,
        check: extra?.check,
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
      } catch (error) {
        console.log(error, "errorr aa gyaa");
        throw error;
      }
    }
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

const __dirname = path.resolve();
const dirPath = path.join(__dirname, "web/frontend/invoiceTemplate");
const getSymbol = (currency) => {
  const symbol = new Intl.NumberFormat("en", { style: "currency", currency })
    .formatToParts()
    .find((x) => x.type === "currency");
  return symbol && symbol.value;
};

export async function verifyWebhooks(req, res) {
  try {
    const topic = req.headers["x-shopify-topic"];
    let shop = req.headers["x-shopify-shop-domain"];
    let hmac_header = req.headers["x-shopify-hmac-sha256"];
    const secretKey = process.env.SHOPIFY_API_SECRET;
    let gettoken = await shopModal.findOne({ shop: shop });
    const client = new shopify.api.clients.Graphql({
      session: {
        shop: shop,
        accessToken: gettoken.accessToken,
      },
    });
    console.log(req.body, "ye hai body");

    console.log(topic, "topic", secretKey, hmac_header);

    switch (topic) {
      case "products/update":
        try {
          const calculated_hmac = crypto
            .createHmac("sha256", secretKey)
            .update(req.body)
            .digest("base64");
          if (calculated_hmac == hmac_header) {
            // console.log("Webhook verified");
            let responseWebhook = JSON.parse(req.body);
            // console.log(responseWebhook, "pupdateeeee");
            let pid = responseWebhook.id;

            let productSrc =
              responseWebhook.image == null ? "" : responseWebhook.image.src;
            let title = responseWebhook.title;
            const filter = { shop: shop, "products_data.product_id": pid };
            var newvalues = {
              $set: {
                "products_data.$.product_image": productSrc,
                "products_data.$.product_name": title,
              },
            };
            let productUpdate = await productsModal.updateOne(
              filter,
              newvalues
            );
            // console.log(res);

            if (productUpdate && productUpdate.modifiedCount > 0) {
              res.status(200).json({ message: "Updated Successfully!" });
            } else {
              res.status(200).json({ message: "No document found!" });
            }
          } else {
            res.status(401).json("Unauthorized access");
          }
        } catch (err) {
          console.error("Webhook processing error:", err);
          // Respond with an error status code if needed
          res.status(200).send("success");
        }
        break;
      case "products/delete":
        try {
          console.log("********* Products DELETE WEBHOOK START *******");
          const calculated_hmac = crypto
            .createHmac("sha256", secretKey)
            .update(req.body)
            .digest("base64");
          if (calculated_hmac == hmac_header) {
            let responseWebhook = JSON.parse(req.body);
            let pid = responseWebhook.id.toString();
            const filter = { shop: shop };
            let productDelete = await productsModal.updateOne(filter, {
              $pull: { products_data: { product_id: pid } },
            });

            res.status(200).send("success");
          } else {
            res.status(401).json("unauthorized access");
          }
        } catch (err) {
          console.error("Webhook processing error:", err);
          // Respond with an error status code if needed
          res.status(200).send("success in catch");
        }
        break;
      case "customers/update":
        try {
          const calculated_hmac = crypto
            .createHmac("sha256", secretKey)
            .update(req.body)
            .digest("base64");
          if (calculated_hmac == hmac_header) {
            let responseWebhook = JSON.parse(req.body);
            let id = responseWebhook.id;
            let update = {
              $set: {
                customer_details: {
                  id: "gid://shopify/Customer/" + id,
                  email: responseWebhook.email,
                  firstName: responseWebhook.first_name,
                  lastName: responseWebhook.last_name,
                  phone: responseWebhook.phone,
                },
              },
            };
            const filter = {
              shop: shop,
              "customer_details.id": "gid://shopify/Customer/" + id,
            };

            let customerUpdate = await subscriptionDetailsModal.updateMany(
              filter,
              update
            );
            if (customerUpdate && customerUpdate.modifiedCount > 0) {
              res.status(200).json({ message: "Updated Successfully!" });
            } else {
              res.status(200).json({ message: "No document found!" });
            }
          } else {
            res.status(401).json("Unauthorized access");
          }
        } catch (err) {
          console.error("Webhook processing error:", err);
          // Respond with an error status code if needed
          res.status(200).send("success");
        }
        break;
      case "app/uninstalled":
        try {
          const calculated_hmac = crypto
            .createHmac("sha256", secretKey)
            .update(req.body)
            .digest("base64");
          if (calculated_hmac == hmac_header) {
            // console.log("shop", shop);
            // console.log("hmac verified uninstall app");
            const deleteStore = await shopModal.deleteOne({ shop: shop });

            // console.log(deleteStore, "store");
            if (deleteStore) {
              res.status(200).json({ message: "Deleted Successfully!" });
            } else {
              res.status(200).json({ message: "Failed" });
            }
          } else {
            res.status(401).json("Unauthorized access");
          }
        } catch (err) {
          console.error("Webhook processing error:", err);
          // Respond with an error status code if needed
          res.status(200).send("success in catch");
        }
        break;
      case "customers/data_request":
        try {
          const calculated_hmac = crypto
            .createHmac("sha256", secretKey)
            .update(req.body)
            .digest("base64");
          if (calculated_hmac == hmac_header) {
            ///oct12///////////

            let body = JSON.parse(req?.body);
            let storeData = await getStoreDetails(body?.shop_domain);
            let storeEmail = storeData?.store_email;
            let filePath;
            let emailConfig = {
              host: "smtp.gmail.com",
              port: 587, // Convert port number to integer
              auth: {
                user: "revlytic@gmail.com",
                pass: "hynmucteprubqhnc",
              },
              secure: false,
            };
            const transporter = nodemailer.createTransport(emailConfig);
            const sendEmail = (options, emailConfig) => {
              return new Promise((resolve, reject) => {
                const transporter = nodemailer.createTransport(emailConfig);
                transporter.sendMail(options, (error, info) => {
                  if (error) {
                    console.error("Error sending email:", error);
                    reject(error);
                  } else {
                    console.log("Email sent:", info.response);
                    resolve(info);
                  }
                });
              });
            };

            let getCustomerDetails = await subscriptionDetailsModal
              .find(
                {
                  shop: body?.shop_domain,
                  "customer_details.id": `gid://shopify/Customer/${body?.customer?.id}`,
                },
                {
                  _id: 0,
                  "customer_details.firstName": 1,
                  "customer_details.lastName": 1,
                  "payment_details.payment_instrument_value": 1,
                  shipping_address: 1,
                  billing_address: 1,
                }
              )
              .lean();
            if (getCustomerDetails.length > 0) {
              const __dirname = path.resolve();
              const jsonOutput = JSON.stringify(getCustomerDetails, null, 2); // Use null and 2 for pretty-printing
              filePath = path.join(
                `${__dirname}/web/frontend/assets/`,
                "customerData.json"
              );
              fs.writeFile(filePath, jsonOutput, async (err, res) => {
                if (err) {
                  console.log(err, "<><><><>");
                } else {
                  console.log(res, "::::::");
                  let options = {
                    from: `Revlytic <revlytic@gmail.com>`,
                    to: storeEmail,
                    subject: "Customer Data",
                    text: "Please find the attached customer data file.",
                    attachments: [
                      {
                        filename: "customerData.json",
                        path: filePath,
                      },
                    ],
                  };

                  const data = await sendEmail(options, emailConfig);

                  fs.unlink(filePath, (error) => {
                    if (error) {
                      console.error(
                        "Error deleting customer data file:",
                        error
                      );
                      throw error;
                    } else {
                      console.log("customer data file deleted successfully.");
                    }
                  });
                }
              });
            } else {
              let options = {
                from: `Revlytic <revlytic@gmail.com>`,
                to: storeEmail,
                subject: "Customer Data",
                text: "No data stored for this customer.",
              };
              const data = await sendEmail(options, emailConfig);
            }
            res.status(200).send("Accepted Customer Data request");
          } else {
            res.status(401).send("Unauthorized Access");
          }
        } catch (err) {
          console.error("Webhook processing error:", err);
          // Respond with an error status code if needed
          res.status(200).send("success in catch");
        }
        break;
      case "customers/redact":
        try {
          const calculated_hmac = crypto
            .createHmac("sha256", secretKey)
            .update(req.body)
            .digest("base64");
          if (calculated_hmac == hmac_header) {
            let storedata = getStoreDetails(shop);
            let email = storedata.store_email;
            const transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 587,
              secure: false,
              auth: {
                user: "revlytic@gmail.com",
                pass: "hynmucteprubqhnc",
                 },
            });
            const mailOptions = {
              from: `Revlytic <revlytic@gmail.com>`,
              to: email,
              subject: "Customer Data Deletion",
              text: "As we are using customer's data in subcription details so we can not delete the customer's data.",
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error("Error sending email:", error);
              } else {
                console.log("Email sent:", info.response);
              }
            });
            res.status(200).json("we can not delete customer's data");
          } else {
            console.error("Webhook processing error:", err);
            // Respond with an error status code if needed
            res.status(401).send("Unauthorized Access");
          }
        } catch (err) {
          res.status(200).send("success in catch");
        }
        break;
      case "shop/redact":
        try {
          const calculated_hmac = crypto
            .createHmac("sha256", secretKey)
            .update(req.body)
            .digest("base64");
          if (calculated_hmac == hmac_header) {
            let data = await shopModal.findOne(
              { shop: shop },
              { createdAt: 1 }
            );
            console.log(data?.createdAt, "lo");
            let installDate = data?.createdAt;
            let uninstallDate = new Date().toISOString();
            let insertData = await uninstallModal.create({
              shop: shop,
              installDate: installDate,
              uninstallDate: uninstallDate,
            });

            let allCollections = [
              billing_Attempt,
              checkoutCustomerModal,
              orderOnly,
              orderContractDetails,
              shopModal,
              cPortalSettings,
              emailTemplatesModal,
              invoice_all_details,
              planModal,
              planProductModal,
              widgetSettingsModal,
              subscriptionDetailsModal,
              StoreSchemaModal,
              storeModal,
            ];

            // An array to store all deleteMany promises
            const deletePromises = allCollections.map((collection) => {
              return collection.deleteMany({ shop: shop });
            });

            // Wait for all promises to resolve
            Promise.all(deletePromises)
              .then(() => {
                res.status(200).send("Shop data deleted");
              })
              .catch((err) => {
                console.error("Error deleting shop data:", error);
                res.status(200).send("success in catch");
              });
          } else {
            res.status(401).json("Unauthorized Access!");
          }
        } catch (err) {
          console.error("Webhook processing error:", err);
          // Respond with an error status code if needed
          res.status(200).send("success in catch");
        }
        break;
      case "shop/update":
        try {
          const calculated_hmac = crypto
            .createHmac("sha256", secretKey)
            .update(req.body)
            .digest("base64");
          if (calculated_hmac == hmac_header) {
            console.log("Webhook verifieduuuuuuuuuuuuuuu");
            let responseWebhook = JSON.parse(req.body);
            console.log(responseWebhook);
            let email = responseWebhook.email;
            let name = responseWebhook.name;
            let store_owner = responseWebhook.shop_owner;
            let currency = responseWebhook.currency;
            let symbol = getSymbol(currency);
            let timezone = responseWebhook.iana_timezone;

            const filter = { shop: shop };
            var newvalues = {
              $set: {
                store_email: email,
                store_name: name,
                store_owner: store_owner,
                currency: currency,
                currency_code: symbol,
                timezone: timezone,
              },
            };
            let update = await StoreSchemaModal.updateOne(filter, newvalues);
            if (update && update.modifiedCount > 0) {
              res.status(200).json({ message: "Updated Successfully!" });
            } else {
              res.status(200).json({ message: "Something went wrong" });
            }
          } else {
            res.status(401).json("Unauthorized Access!");
          }
        } catch (err) {
          console.error("Webhook processing error:", err);
          // Respond with an error status code if needed
          res.status(200).send("success in catch");
        }
        break;

      case "themes/update":
        try {
          const calculated_hmac = crypto
            .createHmac("sha256", secretKey)
            .update(req.body)
            .digest("base64");
          if (calculated_hmac == hmac_header) {
            let responseWebhook = JSON.parse(req.body);
            let getThemeId;
            var themeType;
            var meta_field_value;
            let meta_field_value_not;
            let theme_block_support;
            let theme_block_support_not;

            try {
              console.log("nahidd");
              let themes = await shopify.api.rest.Theme.all({
                session: {
                  shop: shop,
                  accessToken: gettoken.accessToken,
                },
              });
              const themeId = themes.data.find((el) => el.role === "main");
              console.log("themeid---->", themeId);
              getThemeId = themeId?.id;
              let themeData = await shopify.api.rest.Asset.all({
                session: session,
                theme_id: getThemeId,
                asset: { key: "templates/product.json" },
              });
              themeType = themeData === undefined ? "vintage" : "modern";

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

            const Client = new shopify.api.clients.Graphql({
              session: {
                shop: shop,
                accessToken: gettoken.accessToken,
              },
            });

            try {
              const response = await Client.request(app_query);
              if (response.data.appInstallation.id) {
                let app_installation_id = response.data.appInstallation.id;
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
                  const result = await Client.request(
                    createAppDataMetafieldMutation,
                    {
                      variables: Input,
                    }
                  );
                } catch (error) {
                  throw error;
                }
              }
            } catch (error) {
              throw error;
            }

            StoreSchemaModal.updateOne(
              { shop },
              { $set: { themeType: themeType, themeId: getThemeId } }
            )
              .then((data) => console.log("theme stored in db"))
              .catch((error) => {
                throw error;
              });
            res.status(200).send("success");
          } else {
            res.status(401).json("Unauthorized Access!");
          }
        } catch (err) {
          console.error("Webhook processing error:", err);
          // Respond with an error status code if needed
          res.status(200).send("success in catch");
        }
        break;

      case "subscription_contracts/create":
        try {
          const calculated_hmac = crypto
            .createHmac("sha256", secretKey)
            .update(req.body)
            .digest("base64");

          if (calculated_hmac == hmac_header) {
            let responseWebhook = JSON.parse(req.body);
            const existingOrder = await orderOnly.findOne({
              shop: shop,
              orderId: responseWebhook.admin_graphql_api_origin_order_id,
            });
            if (!existingOrder) {
              // Order ID doesn't exist in the database, so you can save it
              const savedOrder = await orderOnly.create({
                shop: shop,
                orderId: responseWebhook.admin_graphql_api_origin_order_id,
                status: false,
              });
            }
            const savecontractDetails = await orderContractDetails.create({
              shop: shop,
              orderId: responseWebhook.admin_graphql_api_origin_order_id,
              contractID: responseWebhook.admin_graphql_api_id,
              status: false,
            });
            res.status(200).json({ message: "Updated Successfully!" });
          } else {
            res.status(401).json("Unauthorized Access!");
          }
        } catch (err) {
          console.error("Webhook processing error:", err);
          // Respond with an error status code if needed
          res.status(200).send("success in catch");
        }
        break;

      case "customer_payment_methods/update":
        try {
          const calculated_hmac = crypto
            .createHmac("sha256", secretKey)
            .update(req.body)
            .digest("base64");

          if (calculated_hmac == hmac_header) {
            console.log("customer_payment_methods/update", req?.body);
            let body = JSON.parse(req?.body);
            let obj = {
              __typename: body?.instrument_type,
              expiryYear: body?.payment_instrument?.year,
              expiryMonth: body?.payment_instrument?.month,
              lastDigits: body?.payment_instrument?.last_digits,
              brand: body?.payment_instrument?.brand,
              name: body?.payment_instrument?.name,
            };

            let filter = {
              shop: shop,
              "payment_details.payment_method_token":
                body?.admin_graphql_api_id,
            };
            let paymentMethodUpdate = await subscriptionDetailsModal.updateMany(
              filter,
              { $set: { "payment_details.payment_instrument_value": obj } }
            );

            if (paymentMethodUpdate && paymentMethodUpdate.modifiedCount > 0) {
              res.status(200).json({ message: "Updated Successfully!" });
            } else {
              res.status(200).json({ message: "No document found!" });
            }
          } else {
            res.status(401).json("Unauthorized access");
          }
        } catch (err) {
          // Respond with an error status code if needed
          res.status(200).send("success in catch");
        }
        break;

      case "subscription_billing_attempts/success":
        try {
          const calculated_hmac = crypto
            .createHmac("sha256", secretKey)
            .update(req.body)
            .digest("base64");

          if (calculated_hmac == hmac_header) {
            let body = JSON.parse(req?.body);
            const currentDate = new Date().toISOString();

            let admin_graphql_api_order_id =
              '"' + body.admin_graphql_api_order_id + '"';
            let query = `{
              order(id:${admin_graphql_api_order_id}) {
                name
                currentTotalPriceSet{
                  presentmentMoney{
                    amount
                    currencyCode
                  }
                }
              }
            }`;
            let orderData = await client.request(query);

            let billing_attempt_success =
              await billing_Attempt.findOneAndUpdate(
                {
                  shop: shop,
                  contract_id: `gid://shopify/SubscriptionContract/${body.subscription_contract_id}`,
                  status: "pending",
                  idempotencyKey: body?.idempotency_key,
                },
                {
                  status: "success",
                  order_id: body.admin_graphql_api_order_id,
                  billing_response_date: currentDate,
                  order_no: orderData.data.order.name,
                  total_amount:
                    orderData.data.order.currentTotalPriceSet.presentmentMoney
                      .amount,
                  currency:
                    orderData.data.order.currentTotalPriceSet.presentmentMoney
                      .currencyCode,
                }
              );

            let getMaxCycle = await subscriptionDetailsModal.findOne(
              {
                shop: shop,
                subscription_id:
                  body.admin_graphql_api_subscription_contract_id,
              },
              { subscription_details: 1, product_details: 1 }
            );

            ////////auto renew check
            if (getMaxCycle?.subscription_details?.autoRenew == false) {
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
                contractId: body.admin_graphql_api_subscription_contract_id,
              };
              let response1 = await client.request(mutationQuery, {
                variables: Input1,
              });

              if (
                response1.data?.subscriptionContractUpdate?.userErrors.length <
                1
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
                let response2 = await client.request(mutationQuery, {
                  variables: Input,
                });

                if (
                  response2.data?.subscriptionDraftUpdate?.userErrors.length < 1
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
                  let response3 = await client.request(
                    mutationSubscriptionDraftCommit,
                    {
                      variables: InputMutationSubscriptionDraftCommit,
                    }
                  );

                  if (
                    response3.data?.subscriptionDraftCommit?.userErrors.length <
                    1
                  ) {
                    let updateTable =
                      await subscriptionDetailsModal.findOneAndUpdate(
                        {
                          shop: shop,
                          subscription_id: `gid://shopify/SubscriptionContract/${body.subscription_contract_id}`,
                        },
                        { status: "PAUSED" }
                      );
                  }
                }
              }
            }

            if (
              getMaxCycle.subscription_details.billingMaxValue != undefined &&
              getMaxCycle.subscription_details.billingMaxValue != null
            ) {
              let count = await billing_Attempt.countDocuments({
                shop: shop,
                contract_id: body.admin_graphql_api_subscription_contract_id,
                status: { $in: ["success", "initial"] },
              });

              if (
                parseInt(count) ==
                parseInt(getMaxCycle.subscription_details.billingMaxValue)
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
                  contractId: body.admin_graphql_api_subscription_contract_id,
                };
                let response1 = await client.request(mutationQuery, {
                  variables: Input1,
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
                  let response2 = await client.request(mutationQuery, {
                    variables: Input,
                  });

                  if (
                    response2.data?.subscriptionDraftUpdate?.userErrors.length <
                    1
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

                    let response3 = await client.request(
                      mutationSubscriptionDraftCommit,
                      {
                        variables: InputMutationSubscriptionDraftCommit,
                      }
                    );

                    if (
                      response3.data?.subscriptionDraftCommit?.userErrors
                        .length < 1
                    ) {
                      let updateTable =
                        await subscriptionDetailsModal.findOneAndUpdate(
                          {
                            shop: shop,
                            subscription_id: `gid://shopify/SubscriptionContract/${body.subscription_contract_id}`,
                          },
                          { status: "PAUSED" }
                        );
                    }
                  }
                }
              }
            }

            if (
              getMaxCycle.subscription_details.freeTrial != undefined &&
              getMaxCycle.subscription_details.freeTrial != null &&
              getMaxCycle.subscription_details.freeTrialStatus
            ) {
              let updateTable = subscriptionDetailsModal.findOneAndUpdate(
                {
                  shop: shop,
                  subscription_id: `gid://shopify/SubscriptionContract/${body.subscription_contract_id}`,
                },
                { "subscription_details.freeTrialStatus": false }
              );
            }
            // if (
            //   getMaxCycle.subscription_details.freeTrial != undefined &&
            //   getMaxCycle.subscription_details.freeTrial != null &&
            //   getMaxCycle.subscription_details.freeTrialStatus
            // ) {
            //   let count = await billing_Attempt.countDocuments({
            //     shop: shop,
            //     contract_id: body.admin_graphql_api_subscription_contract_id,
            //     status: { $in: ["success", "initial"] },
            //   });
            //   console.log("count ko check k aro", parseInt(count));
            //   if (
            //     parseInt(count) ==
            //     parseInt(getMaxCycle.subscription_details.freeTrial)
            //   ) {
            //     getMaxCycle.product_details.forEach(async (item) => {
            //       const mutationQuery = `mutation subscriptionContractUpdate($contractId: ID!) {
            //           subscriptionContractUpdate(contractId: $contractId) {
            //             draft {
            //              id
            //             }
            //               userErrors {
            //               field
            //               message
            //             }
            //           }
            //         }`;
            //       const Input1 = {
            //         contractId: admin_graphql_api_subscription_contract_id,
            //       };
            //       let response1 = await client.query({
            //         data: { query: mutationQuery, variables: Input1 },
            //       });
            //       console.log(response1, "response1 hai yee");
            //       if (
            //         response1.body.data?.subscriptionContractUpdate?.userErrors
            //           .length < 1
            //       ) {
            //         console.log(
            //           "drfat id bn gyi hai",
            //           response1.body.data.subscriptionContractUpdate?.draft?.id
            //         );
            //         let draftID =
            //           response1.body.data.subscriptionContractUpdate?.draft?.id;

            //         const mutationQuery = `mutation subscriptionDraftLineUpdate($draftId: ID!, $input: SubscriptionLineUpdateInput!, $lineId: ID!) {
            //           subscriptionDraftLineUpdate(draftId: $draftId, input: $input, lineId: $lineId) {
            //             draft {
            //               id
            //             }
            //             lineUpdated {
            //               id
            //               variantId
            //               quantity
            //               productId
            //               currentPrice {
            //                 amount
            //               }
            //             }
            //             userErrors {
            //               field
            //               message
            //             }
            //           }
            //         }`;

            //         const Input = {
            //           draftId: draftID,
            //           input: { currentPrice: item?.computedPrice },
            //           lineId: item?.subscriptionLine,
            //         };

            //         let response2 = await client.query({
            //           data: { query: mutationQuery, variables: Input },
            //         });

            //         console.log(response2.body.data);

            //         if (
            //           response2.body.data?.subscriptionDraftLineUpdate
            //             ?.userErrors.length < 1
            //         ) {
            //           console.log("update hio giyo draftttt");

            //           let mutationSubscriptionDraftCommit = `mutation subscriptionDraftCommit($draftId: ID!) {
            //             subscriptionDraftCommit(draftId: $draftId) {
            //               contract {
            //               id
            //               status
            //               }
            //               userErrors {
            //                 field
            //                 message
            //               }
            //             }
            //           }`;

            //           const InputMutationSubscriptionDraftCommit = {
            //             draftId: draftID,
            //           };
            //           let response3 = await client.query({
            //             data: {
            //               query: mutationSubscriptionDraftCommit,
            //               variables: InputMutationSubscriptionDraftCommit,
            //             },
            //           });
            //           if (
            //             response3.body.data?.subscriptionDraftCommit?.userErrors
            //               .length < 1
            //           ) {
            //             const updatedProductDetails =
            //               getMaxCycle.product_details.map((productDetail) => {
            //                 // Check if the current productDetail has the desired product_id
            //                 if (
            //                   productDetail.subscriptionLine ===
            //                   item?.subscriptionLine
            //                 ) {
            //                   // Clone the current productDetail object
            //                   const updatedProductDetail = { ...productDetail };
            //                   // Update the price property of the cloned object
            //                   updatedProductDetail.price = item?.computedPrice;
            //                   // Return the updated productDetail
            //                   return updatedProductDetail;
            //                 }
            //                 // If the product_id doesn't match, return the original object
            //                 return productDetail;
            //               });
            //             let updateTable =
            //               subscriptionDetailsModal.findOneAndUpdate(
            //                 {
            //                   shop: shop,
            //                   subscription_id: `gid://shopify/SubscriptionContract/${body.subscription_contract_id}`,
            //                 },
            //                 { product_details: updatedProductDetails }
            //               );
            //           }

            //           console.log(
            //             "jklmnaop",
            //             response3.body.data?.subscriptionDraftCommit?.contract
            //               ?.status
            //           );
            //         }
            //       }
            //     });
            //   }
            // }

            res.status(200).json({ message: "Updated Successfully!" });
          } else {
            res.status(401).json("Unauthorized Access!");
          }
        } catch (err) {
          console.error("Webhook processing error:", err);
          // Respond with an error status code if needed
          res.status(200).send("success in catch");
        }
        break;

      case "subscription_billing_attempts/failure":
        try {
          const calculated_hmac = crypto
            .createHmac("sha256", secretKey)
            .update(req.body)
            .digest("base64");

          if (calculated_hmac == hmac_header) {
            const currentDate = new Date().toISOString();
            let body = JSON.parse(req?.body);
            let admin_graphql_api_order_id =
              '"' + body.admin_graphql_api_order_id + '"';
            let billing_attempt_failure =
              await billing_Attempt.findOneAndUpdate(
                {
                  shop: shop,
                  contract_id: body.admin_graphql_api_subscription_contract_id,
                  idempotencyKey: body?.idempotency_key,
                  status: "pending",
                },
                {
                  $set: {
                    status: "failed",
                    billing_response_date: currentDate,
                  },
                }
              );

            if (billing_attempt_failure) {
              let subscriptionData = await subscriptionDetailsModal
                .findOne({
                  shop: shop,
                  subscription_id:
                    body.admin_graphql_api_subscription_contract_id,
                })
                .lean();

              let shopName;
              let shopEmail;
              let currencySymbol;

              let data = await emailTemplatesModal.findOne(
                { shop: shop },
                { "settings.paymentFailure": 1, configuration: 1 }
              );

              if (data) {
                let sendMailToCustomer = data?.settings?.paymentFailure?.status;
                let sendMailToMerchant =
                  data?.settings?.paymentFailure?.adminNotification;

                if (sendMailToCustomer || sendMailToMerchant) {
                  let recipientMails = [];

                  if (sendMailToMerchant) {
                    let storeData = await getStoreDetails(shop);
                    shopEmail = storeData.store_email;
                    shopName = storeData.store_name;
                    currencySymbol = storeData.currency_code;
                    console.log("emailstore", shopEmail);
                    recipientMails.push(shopEmail);
                    // getDataFromWebhook.shopEmail=shopEmail;
                    // getDataFromWebhook.shopName=shopName;
                  }
                  if (sendMailToCustomer) {
                    recipientMails.push(
                      subscriptionData?.customer_details?.email
                    );
                    // recipientMails.push("sam@yopmail.com");
                  }

                  let configurationData = data?.configuration;
                  let selectedTemplateData = data?.settings?.paymentFailure;

                  let mailCheck = await sendPaymentFailureMail(
                    recipientMails,
                    {},
                    {
                      shop,
                      shop_email: shopEmail,
                      shop_name: shopName,
                      selectedTemplateData,
                      configurationData,
                      currencySymbol,
                      data: {
                        ...subscriptionData,
                        recipientMails: recipientMails,
                      },
                      templateType: "paymentFailure",
                      check: "paymentFailure",
                    }
                  );
                }
              } else {
                console.log("nodata found");
              }
              res.status(200).json({ message: "Updated Successfully!" });
            }
          } else {
            res.status(401).json("Unauthorized Access!");
          }
        } catch (err) {
          console.error("Webhook processing error:", err);
          // Respond with an error status code if needed
          res.status(200).send("success in catch");
        }
        break;

      case "subscription_billing_attempts/challenged":
        try {
          const calculated_hmac = crypto
            .createHmac("sha256", secretKey)
            .update(req.body)
            .digest("base64");

          if (calculated_hmac == hmac_header) {
            res.status(200).json({ message: "Updated Successfully!" });
          } else {
            res.status(401).json("Unauthorized Access!");
          }
        } catch (err) {
          console.error("Webhook processing error:", err);
          // Respond with an error status code if needed
          res.status(200).send("success in catch");
        }
        break;

      case "orders/create":
        try {
          let shop = req.headers["x-shopify-shop-domain"];
          const calculated_hmac = crypto
            .createHmac("sha256", secretKey)
            .update(req.body)
            .digest("base64");

          if (calculated_hmac == hmac_header) {
            res.status(200).json({ message: "Updated Successfully!" });
          } else {
            res.status(401).json("Unauthorized Access!");
          }
        } catch (err) {
          console.error("Webhook processing error:", err);
          // Respond with an error status code if needed
          res.status(200).send("success in catch");
        }
        break;

      case "bulk_operations/finish":
        const calculated_hmac = crypto
          .createHmac("sha256", secretKey)
          .update(req.body)
          .digest("base64");
        try {
          if (calculated_hmac == hmac_header) {
            let body = JSON.parse(req?.body);
            console.log("infinish bulk", body);
            res.status(200);
          } else {
            res.status(401).json("Unauthorized Access!");
          }
        } catch (error) {
          console.error("Webhook processing error:", err);
          res.status(200).send("success in catch");
        }
        break;
      default:
        break;
    }
  } catch (err) {
    res.status(200).send("success");
  }
}
