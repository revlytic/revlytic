import React, { useEffect, useState } from "react";
import { CheckOutlined, SmileOutlined } from "@ant-design/icons";
import Slider from "react-slick";
import { Alert, Progress, Spin, notification } from "antd";
import postApi from "../components/common/postApi";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAPI } from "../components/common/commonContext";
import { Link } from "react-router-dom";
import { useNavigate } from "@shopify/app-bridge-react";
import { toast } from "react-toastify";
function Billing(props) {
  const navigate = useNavigate();
  const app = useAppBridge();
  const location = useLocation();
  const queryParams = location.search;
  const params = new URLSearchParams(queryParams);
  const charge_id = params.get("charge_id");
  const option = params.get("option");
  const {
    billingPlan,
    setBillingPlan,
    nextBillingDate,
    recurringRevenue,
    chargeId,
    setChargeId,
    setRecurringRevenue,
    check
  } = useAPI();
  const [loader, setLoader] = useState(false);
  const [activePlan, setActivePlan] = useState("free");
  const [checkFree, setCheckFree] = useState(false);
  
  //  const [recurringRevenue,setRecurringRevenue]=useState(0)
  const [currencyConversionRates, setCurrencyConversionRates] = useState({});
  const [nextDate, setNextDate] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const toastNotification = (type, res, placement) => {
    // console.log(type,res)
    return notification[type]({
      message: `Notification ${type}`,
      description: `${res}`,
      placement: `${placement}`,
      closeIcon: false,
      maxCount: 1,
    });
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    // autoplay: true,
    // autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // console.log(props,"====bilingdata===",billingPlan,nextBillingDate,)
  useEffect(async () => {
    console.log("10fev")
    // console.log(billingPlan)
    setActivePlan(billingPlan=="" ? "free": billingPlan);
    setNextDate(nextBillingDate);

    if (charge_id) {
      setLoader(true);
      let response = await postApi(
        "/api/admin/recurringBilingSelected",
        { charge_id: charge_id },
        app
      );
      // setLoader(false);
      // console.log("ressponse=====25jan",response)
      if (response.data.message == "success") {
        setChargeId(charge_id);
        // console.log("myclll",response.data.next_billing)
        setActivePlan(response.data.plan);
        setNextDate(response.data.next_billing);
        setBillingPlan(response.data.plan);
        setRecurringRevenue(0)
        props.setPlanUpdate && props.setPlanUpdate(false);
        props.setActiveContactRoute && props.setActiveContactRoute(false);
        // toast.success("plan updated successfully", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });

        // if(checkNotify(response.data.plan,props.revenue)){
        //   props.setpPlanUpdate(true)
        //   setMessage(true)

        // }
      }
    }
    setLoader(false);
  }, []);

  // console.log("24jan",billingPlan,props.planUpdate)

  const getData = async (body, rates) => {
    // console.log("getData", body);

    // const sessionToken = await getSessionToken(app);

    const response = await postApi("/api/admin/combinedData", body, app);

    // console.log("response", response);

    if (response?.data?.message == "success") {
      // console.log("dfdfd", response?.data?.data);

      // console.log("trates", rates);

      let arr = response?.data?.data;

      let sum = 0;

      // let countInitialStatus = 0;

      if (arr.length > 0) {
        arr.map((item) => {
          sum =
            sum +
            parseFloat(item.total_amount) *
              parseFloat(rates[item?.currency] / rates["USD"]);

          // console.log("checkitemsrev",sum)
        });
      }

      // console.log("sum", sum);

      // setRecurringRevenue(sum);
    }
  };

  const checkNotify = (billingPlan, sum) => {
    // if (billingPlan === false || billingPlan === undefined || billingPlan === null) {
    //   // Billing plan is not available yet
    //   console.log("Billing plan not available");
    // } else {
    // Billing plan is available, update the state
    if (billingPlan === "starter" && sum >= 5000) {
      return true;
    } else if (billingPlan === "premium" && sum >= 30000) {
      return true;
    } else {
      if (
        (billingPlan === false ||
          billingPlan === undefined ||
          billingPlan === null ||
          billingPlan == "" ||
          billingPlan == "free") &&
        sum >= 1000
      ) {
        return true;
      } else {
        return false;
      }
    }
    // }
  };

  const handleUpgradePlan = async (planData) => {
    setLoader(true);
    if (planData.plan != "free") {
      let response = await postApi("/api/admin/recurringBiling", planData, app);
      if (response?.data?.message == "success") {
        window.top.location.href =
          response.data.url.body.data.appSubscriptionCreate.confirmationUrl;
      }
    } else {
////////////
           // Get the current URL
  let currentUrl = window.location.href;
  // console.log("ccurl",currentUrl)
 
  if (currentUrl.includes('charge_id')) {
    // Remove the charge_id parameter using regular expression
 var updatedUrl = currentUrl.replace(/[?&]charge_id=([^&#]*)(&|$)/, '?');
// console.log("uppddurl",updatedUrl)
  // Update the browser URL without reloading the page
  history.replaceState(null, '', updatedUrl);
  window.location.replace(updatedUrl);
    }

//////////////
let response = await postApi(
        "/api/admin/freePlanActivation",
        { charge_id: chargeId },
        app
      );
      if (response?.data?.message == "success") {
        setActivePlan("free");
        setNextDate("");
        setBillingPlan("free");
        setRecurringRevenue(0)
        // setCheckFree(true)
        props.setPlanUpdate && props.setPlanUpdate(false);
        props.setActiveContactRoute && props.setActiveContactRoute(false);


        setLoader(false);
      }

      //  console.log('response',response)
    }
  };

  return (
    <Spin spinning={loader} size="large" tip="Loading...">
      <div className="revlytic-billing-plans">
        {/* {message && <Alert className="revlytic-billing-plans-warning" banner closable message="Revenue cap for the monthly plan reached, please upgrade." type="warning"  />} */}
        <div className="container">
          <div className="revlytic-usage-tracker-wrapper">
            <div className="revlytic-plan-history">
              <h5>
                {activePlan
                  ? activePlan.charAt(0).toUpperCase() + activePlan.slice(1)
                  : "Free"}{" "}
                plan
              </h5>
              {activePlan && activePlan != "free" && (
                <p>Next billing date : {nextDate}</p>
              )}
            </div>
            <div className="revlytic-usage-tracker-main">
              <div className="usage-tarcker-content">
                <h3>${recurringRevenue?.toFixed(2)}</h3>
                {/* <p>{activePlan ?  activePlan : "Completely free of charge"}</p> */}
                <Progress
                  percent={
                    activePlan=='free'
                      ? (recurringRevenue / 750) * 100
                      : activePlan == "starter"
                      ? (recurringRevenue / 5000) * 100
                      : activePlan == "premium"
                      ?  (recurringRevenue / 30000) * 100
                      : activePlan == "premiere" 
                      ? (recurringRevenue / 100000) * 100
                      : 0
                  }
                  showInfo={false}
                />
              </div>
            </div>
          </div>
          <div className="card-wrapper">
            <Slider {...settings} className="billing-plan-slider">
              <div
                className={`subscription-card yellow ${
                  activePlan != "starter" && activePlan != "premium"
                    ? "active"
                    : ""
                }`}
              >
                <div className="subscription-card-heading">
                  <h2>Free</h2>
                  {/* <span><b>$0/</b>month</span> */}
                  <p className="price_card_desc">
                    Completely free of charge up to the first $750 of monthly
                    subscription revenue.
                  </p>
                  <span>
                    (<b>$0/</b>month)
                  </span>
                  <p className="price_card_fee"> No transaction fees. </p>
                  
                  {activePlan != "free" && activePlan != "" && activePlan !=undefined && (
                    <div className="billing-update-plan">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpgradePlan({
                            plan: "free",
                            interval: "MONTHLY",
                            price: 0,
                          })
                        }
                      >
                        Select
                      </button>
                    </div>
                  )}
                </div>
                <div className="subscription-card-list">
                  {/* <p>+ All Features from Free PLUS</p> */}
                  <ul className="subscription-card-listing">
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Subscription Creation and Mgmt
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Pay As You Go Plans
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Prepaid Plans
                    </li>
                    {/* <li>
                  <div className="check-box">
                  <CheckOutlined />
                  </div>
                  Unlimited Emails
                </li> */}
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Payment Retry
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Quick Create
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Manual Subscriptions
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Discounts
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Free Trials
                    </li>
                  </ul>
                </div>
                {/* <div className="revlytic-upgradeButton">
            <a href="#" className="btn card-btn">
              Upgrade Plan
            </a>
            </div> */}
              </div>
              <div
                className={`subscription-card green ${
                  activePlan == "starter" ? "active" : ""
                }`}
              >
                <div className="subscription-card-heading">
                  <h2>Starter </h2>
                  <p className="price_card_desc">
                    Includes up to $5,000 of monthly subscription revenue.
                  </p>
                  <span>
                    (<b>$7/</b>month)
                  </span>
                  <p className="price_card_fee"> No transaction fees. </p>
                  <p className="price_card_fee"> 14 Days Free Trial </p>
                  <div className="billing-update-plan">
                    {activePlan != "starter" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpgradePlan({
                            plan: "starter",
                            interval: "MONTHLY",
                            price: 7,
                          })
                        }
                      >
                        Upgrade Plan
                      </button>
                    )}
                  </div>
                </div>
                <div className="subscription-card-list">
                  <ul className="subscription-card-listing">
                    <li>
                      {/* <div className="check-box">
                  <CheckOutlined />
                  </div> */}
                      + All Features from Free 
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Overview Metrics
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      {option == "checkoutlink" ? (
                        <strong>One Click Checkout Link</strong>
                      ) : (
                        "One Click Checkout Link"
                      )}
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Customer Portal
                    </li>
                    {/* <li>
                  <div className="check-box">
                  <CheckOutlined />
                  </div>
                  Customization
                </li> */}
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      {option == "invoice" ? (
                        <strong>Invoice Templates</strong>
                      ) : (
                        "Invoice Templates"
                      )}
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      {option == "earlyAttempt" ? (
                        <strong>Early Attempt</strong>
                      ) : (
                        "Early Attempt"
                      )}
                    </li>
                    {/* <li>
                  <div className="check-box">
                  <CheckOutlined />
                  </div>
                  Billing Orders
                </li> */}
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      {option == "skipOrders" ? (
                        <strong>Skip Subscription Orders</strong>
                      ) : (
                        "Skip Subscription Orders"
                      )}
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      {option == "rescheduleDelivery" ? (
                        <strong>Reschedule Upcoming Deliveries</strong>
                      ) : (
                        "Reschedule Upcoming Deliveries"
                      )}
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      {option == "emailTemplates" ? (
                        <strong> Email templates Customization</strong>
                      ) : (
                        " Email templates Customization"
                      )}
                    </li>
                  </ul>
                </div>
                {/* <div className="revlytic-upgradeButton">
            <a href="#" className="btn card-btn">
              Upgrade Plan
            </a>
            </div> */}
              </div>
              <div
                className={`subscription-card blue ${
                  activePlan == "premium" ? "active" : ""
                }`}
              >
                <div className="subscription-card-heading">
                  <h2>Premium </h2>
                  <p className="price_card_desc">
                    Includes up to $30,000 of monthly subscription revenue.
                  </p>
                  <span>
                    (<b>$20/</b>month)
                  </span>
                  <p className="price_card_fee"> No transaction fees. </p>
                  <p className="price_card_fee"> 14 Days Free Trial </p>
                  <div className="billing-update-plan">
                    {activePlan != "premium" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpgradePlan({
                            plan: "premium",
                            interval: "MONTHLY",
                            price: 20,
                          })
                        }
                      >
                        Upgrade Plan
                      </button>
                    )}
                  </div>
                </div>
                <div className="subscription-card-list">
                  <ul className="subscription-card-listing">
                    <li>
                      {/* <div className="check-box">
                  <CheckOutlined />
                  </div> */}
                      + All Features from Starter
                    </li>

                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      {option == "customiseWidget" ? (
                        <strong> Customize Widget </strong>
                      ) : (
                        "Customize Widget"
                      )}
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      {option == "enableEmailConfiguration" ? (
                        <strong> Email Configuration </strong>
                      ) : (
                        " Email Configuration"
                      )}
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      {option == "editProducts" ? (
                        <strong> Product Changes in Existing </strong>
                      ) : (
                        "Product Changes in Existing"
                      )}
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Subscription
                    </li>
                  </ul>
                </div>
                {/* <div className="revlytic-upgradeButton">
            <a href="#" className="btn card-btn">
              Upgrade Plan
            </a>
            </div> */}
              </div>
              <div
                className={`subscription-card pink ${
                  activePlan == "premiere" ? "active" : ""
                }`}
              >
                <div className="subscription-card-heading">
                  <h2>Premiere</h2>
                  <p className="price_card_desc">
                    Includes up to $100,000 of monthly subscription revenue.
                  </p>

                  <span>
                    (<b>$50/</b>month)
                  </span>
                  <p className="price_card_fee"> No transaction fees. </p>
                  <p className="price_card_fee"> 14 Days Free Trial </p>
                  <div className="billing-update-plan">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpgradePlan({
                          plan: "premiere",
                          interval: "MONTHLY",
                          price: 50,
                        })
                      }
                    >
                      Upgrade Plan
                    </button>
                  </div>
                </div>
                <div className="subscription-card-list">
                  <ul className="subscription-card-listing">
                    <li>
                      {/* <div className="check-box">
                  <CheckOutlined />
                  </div> */}
                      + All Features from Premium
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      24/7 Support 
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      White Glove Migration Support 
                    </li>
                    {/* <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Product Changes in Existing
                    </li> */}
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Early Access to new features
                    </li>
                  </ul>
                </div>
                {/* <div className="revlytic-upgradeButton">
            <a href="#" className="btn card-btn">
              Upgrade Plan
            </a>
            </div> */}
              </div>


             <div className="subscription-card lightyellow">
                <div className="subscription-card-heading">
                  <h2>Enterprise</h2>
                  <p className="price_card_desc">
                    Contact us for your own custom plan and tailored servicing
                    of your business needs.{" "}
                  </p>
                  <span>
                    (<b>Custom</b>)
                  </span>
                  <p className="price_card_fee"> No transaction fees.</p>
                  <div className="billing-update-plan">
                    <button
                      type="button"
                      onClick={() => navigate("/contactus")}
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
                <div className="subscription-card-list">
                  {/* <p>+ All Features from Free PLUS</p> */}
                  <ul className="subscription-card-listing">
                    <li>
                      {/* <div className="check-box">
                  <CheckOutlined />
                  </div> */}
                      + All Features from Premiere
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      App Customization
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      1:1 Consultation
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Strategy Sessions
                    </li>
                    <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Early Access to New Features
                    </li>
                  </ul>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
</Spin>
  );
}

export default Billing;
