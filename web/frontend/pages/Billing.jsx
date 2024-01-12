import React,{useEffect,useState} from "react";
import { CheckOutlined } from "@ant-design/icons";
import Slider from "react-slick";
import { Progress,Spin } from 'antd';
import postApi from "../components/common/postApi";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useLocation } from "react-router-dom";


function Billing() {
    
    const app =useAppBridge();
    const location = useLocation();
    const queryParams = location.search;
    const params = new URLSearchParams(queryParams);
    const charge_id = params.get("charge_id");
   const [loader,setLoader]=useState(false)
 
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
  
    console.log("charge_id",charge_id)
    setLoader(true);
    if (charge_id) {
      let response=await postApi("/api/admin/recurringBilingSelected",{charge_id: charge_id},app)
      //   setBtnClicked("");
      
      
      //       const sessionToken = await getSessionToken(app);
      //       await axios
      //         .post(
        //           "/api/billingSelected",
        //           { shop: shop, charge_id: charge_id },
//           { headers: { Authorization: `Bearer ${sessionToken}` } }
//         )
//         .then((res) => {
  //           setBillingPlan({
    //             ...billingPlan,
    //             plan: res.data.plan,
    //             interval: res.data.interval,
    //           });
    //         })
    //         .catch((err) => console.log("Something went wrong!" + err));
  }
  setLoader(false);
}, []);


const handleUpgradePlan=async(planData)=>{

setLoader(true)

let response= await postApi('/api/admin/recurringBiling',planData,app)
if(response?.data?.message=="success"){

    window.top.location.href =
    response.data.url.body.data.appSubscriptionCreate.confirmationUrl;
}
console.log("heloo inupgrade plan")

}

 
  return (
    <Spin spinning={loader} size="large" tip="Loading...">
    <div className="revlytic-billing-plans">
      <div className="container">
      <div className="revlytic-usage-tracker-wrapper">
        <div className="revlytic-plan-history">
          <h5>Start plan</h5>
          <p>Next billing date : 25/09/23</p>
        </div>
        <div className="revlytic-usage-tracker-main">
          <div className="usage-tarcker-content">
          <h3>$0</h3>
          <p> Completely free of charge</p>
          <Progress percent={0}  showInfo={false} />
          </div>
          <div className="usage-tarcker-content">
          <h3>1/1</h3>
          <p> Completely free of charge</p>
          <Progress percent={0}    status="active" showInfo={false} />
          </div>
          <div className="usage-tarcker-content">
          <h3>2/1</h3>
          <p> Completely free of charge</p>
          <Progress percent={0}    status="exception" showInfo={false} />
 
          </div>
        </div>
        </div>
        <div className="card-wrapper">
        <Slider {...settings} className="billing-plan-slider">
          <div className="subscription-card yellow">
            <div className="subscription-card-heading">
              <h2>Free</h2>
              {/* <span><b>$0/</b>month</span> */}
              <p className="price_card_desc">
                Completely free of charge up to the first $1,000 of monthly
                subscription revenue.
              </p>
              <span>
                  (<b>$0/</b>month)
                </span>
                <p className="price_card_fee"> No transaction fees.  </p>
                <div className="billing-update-plan">
                {/* <button type="button" onClick={()=>handleUpgradePlan({plan:"free",interval:"MONTHLY",price:0})}>Upgrade Plan</button> */}
                </div>
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
                <li>
                  <div className="check-box">
                  <CheckOutlined />
                  </div>
                  Unlimited Emails
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
            {/* <div className="revlytic-upgradeButton">
            <a href="#" className="btn card-btn">
              Upgrade Plan
            </a>
            </div> */}
          </div>
          <div className="subscription-card green">
            <div className="subscription-card-heading">
              <h2>
                Starter{" "}
             
              </h2>
              <p className="price_card_desc">
                Includes up to $5,000 of monthly subscription revenue.
              </p>
              <span>
                  (<b>$5/</b>month)
                </span>
                <p className="price_card_fee"> No transaction fees.  </p>
                <div className="billing-update-plan">
                <button type="button"  onClick={()=>handleUpgradePlan({plan:"starter",interval:"MONTHLY",price:5})}>Upgrade Plan</button>
                </div>
            </div>
            <div className="subscription-card-list">
              <ul className="subscription-card-listing">
              <li>
                  {/* <div className="check-box">
                  <CheckOutlined />
                  </div> */}
                  + All Features from Free PLUS  
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
                  One Click Checkout Link
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
                  Customization
                </li>
                <li>
                  <div className="check-box">
                  <CheckOutlined />
                  </div>
                  Invoice Templates
                </li>
                <li>
                  <div className="check-box">
                  <CheckOutlined />
                  </div>
                  Early Attempt
                </li>
                <li>
                  <div className="check-box">
                  <CheckOutlined />
                  </div>
                  Billing Orders
                </li>
                <li>
                  <div className="check-box">
                  <CheckOutlined />
                  </div>
                  Skip Subscription Orders
                </li>
                <li>
                  <div className="check-box">
                  <CheckOutlined />
                  </div>
                  Reschedule Upcoming Deliveries
                </li>
                <li>
                  <div className="check-box">
                  <CheckOutlined />
                  </div>
                  Email templates Customization
                </li>
              </ul>
            </div>
            {/* <div className="revlytic-upgradeButton">
            <a href="#" className="btn card-btn">
              Upgrade Plan
            </a>
            </div> */}
          </div>
          <div className="subscription-card blue">
            <div className="subscription-card-heading">
              <h2>
                Premium{" "}
               
              </h2>
              <p className="price_card_desc">
                Includes up to $30,000 of monthly subscription revenue.
              </p>
              <span>
                  (<b>$20/</b>month)
                </span>
                <p className="price_card_fee"> No transaction fees.  </p>
                <div className="billing-update-plan">
                <button type="button"  onClick={()=>handleUpgradePlan({plan:"premium",interval:"MONTHLY",price:20})}>Upgrade Plan</button>
                </div>
            </div>
            <div className="subscription-card-list">
              <ul className="subscription-card-listing">
              <li>
                  {/* <div className="check-box">
                  <CheckOutlined />
                  </div> */}
                  + All Features from Free PLUS
                </li>
                <li>
                  <div className="check-box">
                  <CheckOutlined />
                  </div>
                  Customize Widget
                </li>
                <li>
                  <div className="check-box">
                  <CheckOutlined />
                  </div>
                  Email Domain
                </li>
                <li>
                  <div className="check-box">
                  <CheckOutlined />
                  </div>
                  Product Changes in Existing
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
          <div className="subscription-card pink">
            <div className="subscription-card-heading">
              <h2>
                Premiere{" "}
               
              </h2>
              <p className="price_card_desc">
                Includes up to $100,000 of monthly subscription revenue.
              </p>
             
              <span>
                  (<b>$50/</b>month)
                </span>
                <p className="price_card_fee"> No transaction fees.  </p>
                <div className="billing-update-plan">
                <button type="button"  onClick={()=>handleUpgradePlan({plan:"premiere",interval:"MONTHLY",price:50})}>Upgrade Plan</button>
                </div>
            </div>
            <div className="subscription-card-list">
           
                <ul className="subscription-card-listing">
                <li>
                  {/* <div className="check-box">
                  <CheckOutlined />
                  </div> */}
                  + All Features from Free PLUS
                </li>
                                   <li>
                                   <div className="check-box">
                  <CheckOutlined />
                 
                  </div>
                        Additional User (2 Users)
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
                        Product Changes in Existing
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
 
          <div className="subscription-card lightyellow">
            <div className="subscription-card-heading">
              <h2>Enterprise</h2>
              <p className="price_card_desc">
                Contact us for your own custom plan and tailored servicing of
                your business needs.{" "}
              </p>
              <span>
                  (<b>Custom</b>)
                </span>
                <p className="price_card_fee"> No transaction fees.</p>
                <div className="billing-update-plan">
                <button type="button" onClick={()=>handleUpgradePlan({plan:"free",interval:"MONTHLY",price:0})}>Upgrade Plan</button>
                </div>
            </div>
            <div className="subscription-card-list">
              {/* <p>+ All Features from Free PLUS</p> */}
                <ul className="subscription-card-listing">
                <li>
                  {/* <div className="check-box">
                  <CheckOutlined />
                  </div> */}
                  + All Features from Free PLUS  
                </li>
                    <li>
                    <div className="check-box">
                  <CheckOutlined />
                  </div>
                        Customize Widget
                    </li>
                    <li>
                    <div className="check-box">
                  <CheckOutlined />
                  </div>
                        Email Domain
                    </li>
                    <li>
                    <div className="check-box">
                  <CheckOutlined />
                  </div>
                        Product Changes in Existing
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
          </Slider>
        </div>
      </div>
    </div>
    </Spin>
  );
}
 
export default Billing;