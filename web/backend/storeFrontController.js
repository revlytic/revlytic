import planModal from "./modals/PlanGroupDetails.js";
import widgetSettingsModal from "./modals/widgetSetting.js";

export async function getPlansForStoreFront(req, res) {
  try {
    console.log("body checkkfdsfsdfsdfsdfsfdd", req.body);

    let today = new Date();
    //let startDateWithoutMillis = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());

    console.log("firstsdasdas", today);
    today.setHours(23, 59, 59, 999);
    console.log("first", today);

    let query = {
      shop: req.body.shop,
      "product_details.product_id": "gid://shopify/Product/" + req?.body?.id,
      // "product_details.variants.id": "gid://shopify/ProductVariant/44360463450416",
    };

    let data = await planModal.aggregate([
      { $match: query },
      {
        $project: {
          plans: {
            $map: {
              input: {
                $filter: {
                  input: "$plans",
                  as: "plan",
                  cond: { $lte: ["$$plan.startDate", today] },
                },
              },
              as: "plan",
              in: {
                id: "$_id",
                planType: "$$plan.planType",
                billingEvery: "$$plan.billingEvery",
                plan_id: "$$plan.plan_id",
                billingEveryType: "$$plan.billingEveryType",
                offerDiscount: "$$plan.offerDiscount",
                priceType: "$$plan.priceType",
                price: "$$plan.price",
                freeTrial: "$$plan.freeTrial",
                trialCount: "$$plan.trialCount",
                deliveryEvery: "$$plan.deliveryEvery",
                planName: "$$plan.planName",
              },
            },
          },
          _id: 0,
        },
      },
    ]);

    console.log(data);

    console.log("trrrere", JSON.stringify(data));
    if (data.length == 0) {
      res.send({ message: "error", data: "No data found" });
    } else {
      console.log("pppppppppppppppppppppp");

      res.send({ message: "success", data: data });
    }
  } catch (error) {
    console.log("ghrrrrrrrrrrrrrrrrrrrrrrrr");
    res.send({ message: "error", data: "" });
  }
}

export async function getWidgetSettingsForStoreFront(req, res) {
  try {
    console.log(req.body, "sddfsdfsdffdsk");

    let data = await widgetSettingsModal.findOne({ shop: req.body.shop });

    console.log("ttttttt", data);

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
