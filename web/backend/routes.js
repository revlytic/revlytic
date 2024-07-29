import express from "express";
import {
  getCurrencyCode,
  addPlansSubscription,
  getProductPlanList,
  getCustomerPaymentMethods,
  getCustomers,
  searchCustomer,
  getCodeDiscountNodes,
  updatePlanGroup,
  checkReferenceId,
  subscriptionContractCreate,
  getSubscriptionList,
  getSubscriptionDetails,
  getPlanGroups,
  deleteSellingPlanGroup,
  createProduct,
  createSubscriptionDraftCommon,
  updateSubscriptionFieldCommon,
  subscriptionDraftCommitCommon,
  updateSubscriptionInDbCommon,
  findAndDeleteSetupProducts,
  deletePlanGroupFromDb,
  getProductPlans,
  subscriptionDraftLineAdd,
  CreatePlanFormForCheckout,
  checkPlanNameUniqueness,
  createCustomer,
  sendMail,
  subscriptionDraftLineRemove,
  removeDraftLineItemFromDb,
  findItemForUpdateSubscription,
  subscriptionDraftLineUpdateCommon,
  getCountries,
  customerPaymentMethodSendUpdateEmail,
  getAllPlanGroupNames,
  subscriptionCustomerUpdate,
  saveInvoiceDetails,
  getInvoiceDetails,
  widgetSettings,
  getWidgetSettings,
  saveproductbundleDetails,
  getproductbundle,
  deleteproductbundle,
  getproductBundleDetails,
  updateproductbundleDetails,
  updateproductbundleStatus,
  emailTemplates,
  getEmailTemplatesList,
  getEmailTemplateData,
  prodExRemoveVariants,
  emailTemplateStatusOrAdminNotificationUpdate,
  prodExCreatePlan,
  prodExPlanDetails,
  prodExPlanUpdate,
  prodExAddProduct,
  prodExGetallPlans,
  getEmailConfigurationData,
  sendMailCommon,
  orderDetails,
  getEmailTemplateAndConfigData,
  sendMailOnUpdate,
  saveCustomerPortalDetails,
  getCustomerPortalDetails,
  getPastOrdersDetail,
  orderNow,
  getOrdersDataUpcoming,
  skipOrder,
  getSkippedOrdersDetail,
  upcomingFulfillment,
  fulfillmentOrderRescheduleOrSkip,
  combinedData,
  retryFailedOrder,
  activeCustomers,
  addAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  checkAppBlockEmbed,
  convertStoreProductPriceIntoOrderCurrency,
  recurringBiling,
  recurringBilingSelected,
  getBillingPlanData,
  subscriptionBookings,
  calculateRevenue,
  freePlanActivation,
  deleteRecurringCharge,
  saveDunningData,
  fetchDunningData,
  getEmailTemplatesCount,
  saveDunningTemplates,
  get_active_pause_cancelSubscription_count,
  get_reccuring_skip_failed_count,
  get_subscription_details_analytics,
 } from "./controller.js";
import {
  appProxy,
  getCustomerPortalDetailsStore,
  getCustomerSubscriptions,
  getStoreCountries,
  getStoreToken,
  getTotalOrdersBillingsCount,
} from "./customerPortalController.js";

import multer from "multer";
import path from "path";
const __dirname = path.resolve();

import {
  getPlansForStoreFront,
  getWidgetSettingsForStoreFront,
} from "./storeFrontController.js";

import fs from "fs";

const upload = multer({ dest: "/frontend/uploads" });
const router = express.Router();

router.post("/getCurrencyCode", getCurrencyCode);
router.post("/getCountries", getCountries);
router.post("/getCustomers", getCustomers);
router.post("/searchCustomer", searchCustomer);
router.post("/getCustomerPaymentMethods", getCustomerPaymentMethods);
router.post("/getCodeDiscountNodes", getCodeDiscountNodes);
// router.post("/subscriptionContractCreate",checkReferenceId,subscriptionContractCreate)
router.post(
  "/subscriptionContractCreate",
  // checkPlanNameUniqueness,
  subscriptionContractCreate
);
router.post("/getSubscriptionList", getSubscriptionList);
router.post("/getSubscriptionDetails", getSubscriptionDetails);
router.post("/createProduct", createProduct);
router.post(
  "/subscriptionStatusUpdate",
  findItemForUpdateSubscription,
  createSubscriptionDraftCommon,
  updateSubscriptionFieldCommon,
  subscriptionDraftCommitCommon,
  updateSubscriptionInDbCommon
);
router.post(
  "/subscriptionNextBillingDateUpdate",
  findItemForUpdateSubscription,
  createSubscriptionDraftCommon,
  updateSubscriptionFieldCommon,
  subscriptionDraftCommitCommon,
  updateSubscriptionInDbCommon
);
router.post(
  "/subscriptionShippingUpdate",
  findItemForUpdateSubscription,
  createSubscriptionDraftCommon,
  updateSubscriptionFieldCommon,
  subscriptionDraftCommitCommon,
  updateSubscriptionInDbCommon
);
router.post(
  "/subscriptionDraftLineAdd",
  findItemForUpdateSubscription,
  convertStoreProductPriceIntoOrderCurrency,
  createSubscriptionDraftCommon,
  subscriptionDraftLineAdd,
  subscriptionDraftCommitCommon,
  updateSubscriptionInDbCommon
);
router.post(
  "/subscriptionDraftLineRemove",
  findItemForUpdateSubscription,
  createSubscriptionDraftCommon,
  subscriptionDraftLineRemove,
  subscriptionDraftCommitCommon,
  removeDraftLineItemFromDb
);
router.post(
  "/subscriptionDraftLineQuantityUpdate",
  findItemForUpdateSubscription,
  createSubscriptionDraftCommon,
  subscriptionDraftLineUpdateCommon,
  subscriptionDraftCommitCommon,
  updateSubscriptionInDbCommon
);
router.post(
  "/subscriptionDraftLinePriceUpdate",
  findItemForUpdateSubscription,
  createSubscriptionDraftCommon,
  subscriptionDraftLineUpdateCommon,
  subscriptionDraftCommitCommon,
  updateSubscriptionInDbCommon
);

router.post(
  "/subscriptionDetailsUpdate",
  findItemForUpdateSubscription,
  // checkPlanNameUniqueness,
  createSubscriptionDraftCommon,
  updateSubscriptionFieldCommon,
  subscriptionDraftCommitCommon,
  updateSubscriptionInDbCommon
);

router.post(
  "/customerPaymentMethodSendUpdateEmail",
  customerPaymentMethodSendUpdateEmail
);

router.post(
  "/createProductSubscriptionEdit",
  findItemForUpdateSubscription,
  createProduct,
  convertStoreProductPriceIntoOrderCurrency,
  createSubscriptionDraftCommon,
  subscriptionDraftLineAdd,
  subscriptionDraftCommitCommon,
  updateSubscriptionInDbCommon
);

router.post(
  "/subscriptionCustomerUpdate",
  findItemForUpdateSubscription,
  subscriptionCustomerUpdate
);

router.post("/customerUpdate",subscriptionCustomerUpdate);
router.post("/widgetSettings", widgetSettings);
router.post("/getWidgetSettings", getWidgetSettings);
router.post("/emailTemplates", emailTemplates);
router.post("/getEmailTemplateData", getEmailTemplateData);
router.post("/getEmailTemplatesList", getEmailTemplatesList);
router.post("/emailConfiguration", emailTemplates);
router.post("/getEmailConfigurationData", getEmailConfigurationData);
router.post("/sendMailCommon", sendMailCommon);
router.post(
  "/emailTemplateStatusOrAdminNotificationUpdate",
  emailTemplateStatusOrAdminNotificationUpdate
);
router.post("/orderDetailsCheck", orderDetails);
router.post("/getEmailTemplateAndConfigData", getEmailTemplateAndConfigData);
router.post("/sendMailonUpdate", sendMailOnUpdate);
router.post("/getPastOrdersDetail", getPastOrdersDetail);
router.post("/getSkippedOrdersDetail", getSkippedOrdersDetail);
router.post("/orderNow", orderNow);
router.post("/getOrdersDataUpcoming", getOrdersDataUpcoming);
router.post("/skipOrder", skipOrder);
router.post("/upcomingfulfillment", upcomingFulfillment);
router.post(
  "/fulfillmentOrderRescheduleOrSkip",
  fulfillmentOrderRescheduleOrSkip
);

router.post("/retryFailedOrder", retryFailedOrder);
router.post("/combinedData", combinedData);
router.post("/subscriptionBookings", subscriptionBookings);
router.post("/activeCustomers", activeCustomers);
router.post("/addAnnouncement", addAnnouncement);
router.post("/updateAnnouncement", updateAnnouncement);
router.post("/getAnnouncements", getAnnouncements);
router.post("/deleteAnnouncement", deleteAnnouncement);
router.post("/checkAppBlockEmbed", checkAppBlockEmbed);
router.post("/getBillingPlanData", getBillingPlanData);
router.post("/calculateRevenue", calculateRevenue);
router.post("/saveDunningData", saveDunningData);
router.post("/fetchDunningData", fetchDunningData);
router.post("/getEmailTemplatesCount", getEmailTemplatesCount);
router.post("/saveDunningTemplates", saveDunningTemplates);
router.post("/get_active_pause_cancelSubscription_count", get_active_pause_cancelSubscription_count);
router.post("/get_reccuring_skip_failed_count", get_reccuring_skip_failed_count);
router.post("/get_subscription_details_analytics",get_subscription_details_analytics);


router.post("/getProductPlanList", getProductPlanList);

// router.post("/getProducts", getProducts);
// router.post("/getProductVarientsIds", getProductVarientsIds);

router.post("/createSellingPlanGroup", addPlansSubscription);
router.post("/updateSellingPlanGroup", updatePlanGroup);
router.post("/getPlanGroups", getPlanGroups);
router.post("/getAllPlanGroupNames", getAllPlanGroupNames);

router.post(
  "/deleteSellingPlan",
  deleteSellingPlanGroup,
  findAndDeleteSetupProducts,
  deletePlanGroupFromDb
);
router.post("/getProductPlans", getProductPlans);
router.post("/createPlanFormForCheckout", CreatePlanFormForCheckout);
router.post("/createCustomer", createCustomer);
router.post("/sendMail", sendMail);
router.post("/saveinvoiceDetails", saveInvoiceDetails);
router.post("/getinvoiceDetails", getInvoiceDetails);
router.post("/saveproductbundleDetails", saveproductbundleDetails);
router.post("/getproductbundle", getproductbundle);
router.post("/deleteproductbundle", deleteproductbundle);
router.post("/getproductBundleDetails", getproductBundleDetails);
router.post("/updateproductbundleDetails", updateproductbundleDetails);
router.post("/updateproductbundleStatus", updateproductbundleStatus);
router.post("/saveCustomerPortalDetails", saveCustomerPortalDetails);
router.post("/getCustomerPortalDetails", getCustomerPortalDetails);
router.post("/recurringBiling", recurringBiling);
router.post("/recurringBilingSelected", recurringBilingSelected);
router.post("/getTotalOrdersBillingsCount", getTotalOrdersBillingsCount);
router.post("/freePlanActivation", deleteRecurringCharge, freePlanActivation);

/////////////////////////////prod extension
router.post("/prodExRemoveVariants", prodExRemoveVariants);
router.post("/prodExCreatePlan", prodExCreatePlan);
router.post("/prodExPlanDetails", prodExPlanDetails);
router.post("/prodExPlanUpdate", prodExPlanUpdate);
router.post("/prodExAddProduct", prodExAddProduct);
router.post("/prodExGetallPlans", prodExGetallPlans);

///////////////////////////////customer portal

router.get("/appProxy", appProxy);

router.post("/getCustomerSubscriptions", getCustomerSubscriptions);
router.post("/getStoreToken", getStoreToken);
router.post("/getStoreCountries", getStoreCountries);
router.post("/getCustomerPortalDetailsStore", getCustomerPortalDetailsStore);


// router.post('/upload', upload.single('image'), (req, res) => {
//   console.log(req.file,'req file')
//   if (!req.file) {
//     res.send({ message: "error", data: "error" });
//   }
// console.log(req.body,"fileee");
// const { originalname, mimetype } = req.file;
// const fileExtension = mimetype.split('/')[1];
//   const uniqueFilename = `${String(new Date().getTime())}.${fileExtension}`;
//   const targetFolder =req.body.flag=="logo" ? path.join(__dirname,"frontend/images/logo"):req.body.flag=="announcement"? path.join(__dirname,"frontend/images/announcement"): path.join(__dirname,"frontend/images/signature")// Specify the target folder
//   console.log(targetFolder,"lkj")

//   if (!fs.existsSync(targetFolder)) {     fs.mkdirSync(targetFolder, { recursive: true });   }
// // Move the file to the target folder with the unique filename
// fs.renameSync(req.file.path, path.join(targetFolder, uniqueFilename));
// // router.post('/upload', upload.single('image'), (req, res) => {
// //   if (!req.file) {
// //     res.send({ message: "error", data: "error" });
// //   }
// // console.log(req.body,"fileee");
// // const { originalname, mimetype } = req.file;
// // const fileExtension = mimetype.split('/')[1];
// //   const uniqueFilename = `${String(new Date().getTime())}.${fileExtension}`;
// //   const targetFolder =req.body.flag=="logo"? path.join(__dirname,"frontend/images/logo"): req.body.flag=="announcement"? path.join(__dirname,"frontend/images/announcement") : path.join(__dirname,"frontend/images/signature")// Specify the target folder
// //   console.log(targetFolder,"lkj")

// // // Move the file to the target folder with the unique filename
// // fs.renameSync(req.file.path, path.join(targetFolder, uniqueFilename));

// // res.send({ message: "success", name:uniqueFilename ,check:req.body.flag });
// });

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.send({ message: "error", data: "error" });
    return; // Exit the function early if there is no uploaded file
  }

  console.log(req.body, "fileee");
  const { originalname, mimetype } = req.file;
  const fileExtension = mimetype.split("/")[1];
  const uniqueFilename = `${String(new Date().getTime())}.${fileExtension}`;

  // Specify the target folder based on req.body.flag
  const targetFolder =
    req.body.flag == "logo"
      ? path.join(__dirname, "frontend/images/logo")
      : req.body.flag == "announcement"
      ? path.join(__dirname, "frontend/images/announcement")
      : path.join(__dirname, "frontend/images/signature");

  // Check if the target folder exists
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true }); // Create the target folder if it doesn't exist
  }

  console.log(targetFolder, "lkj");

  // Move the file to the target folder with the unique filename
  fs.renameSync(req.file.path, path.join(targetFolder, uniqueFilename));
  console.log("llsdkskkskkss");

  res.send({ message: "success", name: uniqueFilename, check: req.body.flag });

  console.log();
});

router.post("/delete", (req, res) => {
  const imageName = req.body.url.substring(req.body.url.lastIndexOf("images"));
  console.log(imageName, "kjhk");
  fs.unlink(`frontend/${imageName}`, (error) => {
    if (error) {
      res.send({ message: "error", data: error });
      // Handle the error or show a notification to the user
    } else {
      res.send({ message: "success", data: "Image deleted" });
    }
    // Proceed with the upload functionality here
    // Call the function or perform the actions to upload the new image
  });
});

///////////////////////'//routes for storefront/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/getPlansForStoreFront", getPlansForStoreFront);
router.post("/getWidgetSettingsForStoreFront", getWidgetSettingsForStoreFront);

export default router;
