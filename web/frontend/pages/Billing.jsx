import React, { useEffect, useState } from "react";
import { CheckOutlined, SmileOutlined } from "@ant-design/icons";
import Slider from "react-slick";
import { Alert, Progress, Spin, notification } from "antd";
import postApi from "../components/common/postApi";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useLocation } from "react-router-dom";
import { useAPI } from "../components/common/commonContext";
import { useNavigate } from "@shopify/app-bridge-react";
import { useOutletContext } from "react-router-dom";
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
  const {showRevenue,setShowRevenue}=useOutletContext();

  const [loader, setLoader] = useState(false);
  const [activePlan, setActivePlan] = useState("free");
  const [checkFree, setCheckFree] = useState(false);
  const [nextDate, setNextDate] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const toastNotification = (type, res, placement) => {
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

  useEffect(async () => {
    console.log("10fev")
    setActivePlan(billingPlan=="" ? "free": billingPlan);
    setNextDate(nextBillingDate);

    if (charge_id) {
      setLoader(true);
      let response = await postApi(
        "/api/admin/recurringBilingSelected",
        { charge_id: charge_id },
        app
      );
       if (response.data.message == "success") {
        setChargeId(charge_id);
        setActivePlan(response.data.plan);
        setNextDate(response.data.next_billing);
        setBillingPlan(response.data.plan);
        setRecurringRevenue(0)
        setShowRevenue(0)
        props.setPlanUpdate && props.setPlanUpdate(false);
        props.setActiveContactRoute && props.setActiveContactRoute(false);
      }
    }
    setLoader(false);
  }, []);


  const getData = async (body, rates) => {
    const response = await postApi("/api/admin/combinedData", body, app);

    if (response?.data?.message == "success") {
      let arr = response?.data?.data;
      let sum = 0;
      if (arr.length > 0) {
        arr.map((item) => {
          sum =
            sum +
            parseFloat(item.total_amount) *
              parseFloat(rates[item?.currency] / rates["USD"]);
        });
      }
    }
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
        setShowRevenue(0)
        props.setPlanUpdate && props.setPlanUpdate(false);
        props.setActiveContactRoute && props.setActiveContactRoute(false);
        setLoader(false);
      }
    }
  };

  return (
    <Spin spinning={loader} size="large" tip="Loading...">
      <div className="revlytic-billing-plans">
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
                <h3>${showRevenue?.toFixed(2)}</h3>
                <Progress
                  percent={
                    activePlan=='free'
                      ? (showRevenue / 750) * 100
                      : activePlan == "starter"
                      ? (showRevenue / 5000) * 100
                      : activePlan == "premium"
                      ?  (showRevenue / 30000) * 100
                      : activePlan == "premiere" 
                      ? (showRevenue / 100000) * 100
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
                      <li>
                      <div className="check-box">
                        <CheckOutlined />
                      </div>
                      Early Access to new features
                    </li>
                  </ul>
                </div>
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
                     <ul className="subscription-card-listing">
                    <li>
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
