import shopify from "../shopify.js";
import subscriptionDetailsModal from "./modals/subscriptionDetails.js";
import shopModal from "./modals/credential.js";
import billing_Attempt from "./modals/billingAttempt.js";
import path from "path";
import cPortalSettings from "./modals/customerPortalSettings.js";
import storeModal from "./modals/storeCredentials.js";

export async function appProxy(req, res) {
  const __dirname = path.resolve();
  let  apiPath = process.env.APP_URL+"/";
  path.join(__dirname, "../frontend/pages/SubscriptionList.jsx");
  const liquidContent = `
      <html>
      <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <script src="${apiPath}api/customerPortalJs">
      </script>
      <link rel="stylesheet" href="${apiPath}api/customerPortalCss">
      </head>
      <body>
      <div id ="revlytic-main-body"></div>

  </body>
      </html>
    `;
  res.set("Content-Type", "application/liquid").send(liquidContent);
}

export async function getCustomerSubscriptions(req, res) {
    let id = `gid://shopify/Customer/${req.body.id}`
    let shop = req.body.shop
      try {
        let data = await subscriptionDetailsModal.find({ shop: shop, "customer_details.id": id }).sort({ nextBillingDate: 1 });
         res.send({ status: "success", data: data })

    } catch (error) {
        res.send({status:"error",data:"something went wrong"})
}
    
}
export async function getStoreToken(req, res) {
  let shop = req.body.shop
  try {
      let data = await storeModal.find({ shop: shop })
      res.send({ status: "success", data: data })
  } catch (error) {
      res.send({status:"error",data:"something went wrong"})
}
  
}

export async function getStoreCountries(req, res) {
  try {
let shop= req.body.shop
      let gettoken = await shopModal.findOne({ shop: shop });
       let session= {
          shop: shop,
          accessToken: gettoken.accessToken,
       }
         
    let data = await shopify.api.rest.Country.all({
      session: session,
    });
    if (data) {
      res.send({ message: "success", data: data });
    } else {
      res.send({ message: "error", data: "Countries data not found" });
    }
  } catch (error) {
    console.log(error)
    res.send({ message: "error", data: "Error fetching Countries Data" });
  }
}

export async function getCustomerPortalDetailsStore(req, res) {
  let shop= req.body.shop
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

export async function getTotalOrdersBillingsCount(req, res) {
  try {
    let shop = req?.body?.shop;
    const desiredStatusValues = ["initial", "success"];

    let data = await billing_Attempt.countDocuments(
      { shop: shop, contract_id: req?.body?.contract_id,status: { $in: desiredStatusValues },
    },
     
    );
      res.send({ message: "success", data: data });
  } catch (error) {
    console.log("error", error);
    res.send({ message: "error" });
  }
}