import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Fullscreen } from "@shopify/app-bridge/actions";
import {
  CloseSquareOutlined,
  DownOutlined,
  FullscreenOutlined,
  MenuOutlined,
  UpOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { FullscreenExitOutlined } from "@ant-design/icons";
import { Button,Spin } from "antd";
import { useLocation } from "react-router-dom";
import axios from "axios";
import postApi from "./postApi";
import Billing from "../../pages/Billing";

import Home from "../../assets/images/Home.svg";
import image2 from "../../assets/images/dot_icon.svg";
import image3 from "../../assets/images/dunning_icon.svg";
import image4 from "../../assets/images/features.svg";
import image5 from "../../assets/images/pin_icon.svg";
import image6 from "../../assets/images/products_icon.svg";
import image7 from "../../assets/images/revlytic.svg";
import image8 from "../../assets/images/setting_icon.svg";
import image9 from "../../assets/images/subscription_icon.svg";
import image10 from "../../assets/images/trans_icon.svg";
import image11 from "../../assets/images/billing.svg";
import contact from '../../assets/images/contactus.svg'
import setup from '../../assets/images/setup.svg'
import { useAPI } from "./commonContext";


function Sidebar() {
  const app = useAppBridge();
  const navigate = useNavigate();
  const location = useLocation();
  const fullscreen = Fullscreen.create(app);
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const [settings, setSettings] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const [activeLink, setActiveLink] = useState("");
  const [renderSidebar, setRenderSidebar] = useState(false);
  const [planUpdate,setPlanUpdate]=useState(false)
  const [changePlan,setChangePlan]=useState(false)
  const [revenue,setRevenue]=useState()
  const [loader,setLoader]=useState(false)
   const {billingPlan,billingPlanDate,setRecurringRevenue,recurringRevenue}=useAPI()
    
useEffect(async()=>{

 setLoader(true)
    let data = await axios.get(
      "https://cdn.shopify.com/s/javascripts/currencies.js"
    );

    

    let filtered =await  eval(
      new Function(`

  ${data?.data}

  return Currency;

`)
    )();

    console.log("yyyy", filtered);

    if (filtered) {
      let response = await getData(billingPlanDate, filtered?.rates);
      setRenderSidebar(true)
      // count.current = count.current + 1;
    }

  setLoader(false)


},[billingPlan])
  
const getData = async (body, rates) => {
  console.log("getData", body);

  const response = await postApi("/api/admin/combinedData", body, app);

  console.log("response", response);

  if (response?.data?.message === "success") {
    console.log("dfdfd", response?.data?.data);

    console.log("trates", rates);

    let arr = response?.data?.data;
    let sum = 0;

    if (arr.length > 0) {
      arr.map((item) => {
        sum =
          sum +
          parseFloat(item.total_amount) *
          parseFloat(rates[item?.currency] / rates["USD"]);
        console.log("checkitemsrev", sum);
      });
    }

    console.log("insidebarrr--sum", sum, planUpdate);
     sum = 30000;
     setRecurringRevenue(sum)
    if (billingPlan === false || billingPlan === undefined || billingPlan === null) {
      // Billing plan is not available yet
      console.log("Billing plan not available");
    } else {
      // Billing plan is available, update the state
      console.log("billingPlan",billingPlan)
      if (billingPlan == 'starter' && sum >= 5000) {
        console.log("1233")
        setPlanUpdate(true);
      } else if (billingPlan === 'premium' && sum >= 30000) {
        setPlanUpdate(true);
        console.log("3553")
      } else {
        if ((billingPlan == false || billingPlan == undefined || billingPlan == null || billingPlan== '') && sum >= 1000) {
          setPlanUpdate(true);
          console.log("868009")
        } else {
          console.log("262783939")
          setPlanUpdate(false);
        }
      }
    }
  }
}

// const getData = async (body, rates) => {
//   console.log("getData", body);

//   // const sessionToken = await getSessionToken(app);

//   const response = await postApi("/api/admin/combinedData", body, app);

//   console.log("response", response);

//   if (response?.data?.message == "success") {
//     console.log("dfdfd", response?.data?.data);

//     console.log("trates", rates);

//     let arr = response?.data?.data;

//     let sum = 0;

//     // let countInitialStatus = 0;

//     if (arr.length > 0) {
//       arr.map((item) => {
//         sum =
//           sum +
//           parseFloat(item.total_amount) *
//             parseFloat(rates[item?.currency] / rates["USD"]);

// console.log("checkitemsrev",sum)

//       });
//     }

//     console.log("insidebarrr--sum", sum,planUpdate);
// sum=1000
// if (billingPlan === false || billingPlan === undefined || billingPlan === null) {

//   console.log("Billing plan not available");
// }
//    else if(billingPlan=='starter' && 
// sum >= 5000){
//   console.log("11111")
//     setPlanUpdate(true);

//   }
//   else if(billingPlan=='premium' && 
// sum >= 30000){
//           console.log("2434")
//       setPlanUpdate(true);
//  }
//  else{
//   console.log("dkskdjksjdiii123" ,billingPlan,planUpdate)
// if(( billingPlan==false || billingPlan==undefined && billingPlan==null) && sum>=1000){
//   console.log("0977")
// setPlanUpdate(true);
//  }
// else{
//   console.log("3455")
//   setPlanUpdate(false)
// }

//   }
// }

// }
// console.log("fjfdkkfdkfdk",billingPlan)

  return (
 renderSidebar &&  
 <Spin spinning={loader} size="large">
 <div style={{ display: "flex" }}>
      {/* <section id="mainSection"> */}
      <div className="containerMain">
        {/*---- sidebar start here---------*/}
        {!toggleSidebar && (
          <CloseSquareOutlined
            onClick={() => setToggleSidebar(true)}
            className="revlytic toggle-menu"
          />
        )}
        {toggleSidebar && (
          <MenuOutlined
            onClick={() => setToggleSidebar(false)}
            className="revlytic close-menu"
          />
        )}
        <div className={toggleSidebar ? "sideBar" : "sidebar toggle-sidebar"}>
          <div className="sideLogo">
            <a href="#">
              {" "}
              <img src={image7} width={150}/>{" "}
            </a>
          </div>
          <div className="sidemenusMain">
            <div className="sidemenus">
              <h4>Menu</h4>
              <ul>
                {/* <li>
                  <a href="#">
                    <img src={image1} />
                    Dashboards &amp; Reports{" "}
                  </a>
                </li> */}
                 <li
                      className={
                        location.pathname == "/"
                          ? "revlytic custom  active-sidebar"
                          : "revlytic custom"
                      }
                    >
                      <Link to ="/" onClick={()=>setToggleSidebar(false)}>
                    <img src={Home} />
                    Home
                  </Link>
                </li>

                {/* {settings && (
                  <div className="subOpen">
                    <li
                      className={
                        location.pathname == "/invoice"
                          ? "revlytic  active-sidebar"
                          : "revlytic"
                      }
                    >
                      <Link to="/invoice">Invoice </Link>
                    </li>
                    
                    <li
                      className={
                        location.pathname == "/widgetsettings"
                          ? "revlytic  active-sidebar"
                          : "revlytic"
                      }
                    >
                      <Link to="/widgetsettings">Widget Settings </Link>
                    </li>
                    <li
                      className={
                        location.pathname == "/emailtemplate"
                          ? "revlytic  active-sidebar"
                          : "revlytic"
                      }
                    >
                      <Link to="/emailtemplateslist">Email Templates</Link>
                    </li>
                    <li
                      className={
                        location.pathname == "/customerportalsettings"
                          ? "revlytic  active-sidebar"
                          : "revlytic"
                      }
                    >
                      <Link to="customerportalsettings">
                        Customer Portal settings
                      </Link>
                    </li>
             
                  </div>
                )} */}

                {/* <li>
                  <a href="#">
                    <img src={image6} />
                    Products{" "}
                  </a>
                </li> */}
                <div
                  className={
                    location.pathname == "/" ||
                    location.pathname == "/createSubscription" ||
                    location.pathname == "/subscriptionlist"
                      ? " revlytic OpenDiv"
                      : "revlytic OpenDiv"
                  }
                >
                  <a onClick={() => setOpen(!open)}>
                    {" "}
                    <h5>
                      {" "}
                      <img src={image9} />{" "}
                      <div className="sidebar-arrow">
                        {" "}
                        Subscription {open ? <UpOutlined /> : <DownOutlined />}
                      </div>
                    </h5>{" "}
                  </a>
                </div>
                {open && (
                  <div className="subOpen">
                     <li
                      className={
                        location.pathname == "/subscriptionlist"
                          ? "revlytic  active-sidebar"
                          : "revlytic"
                      }
                    >
                      <Link to="/subscriptionlist" onClick={()=>setToggleSidebar(false)}>Subscriptions </Link>
                    </li>
                    <li
                      className={
                        location.pathname == "/manageplans"
                          ? "revlytic  active-sidebar"
                          : "revlytic"
                      }
                    >
                      <Link to="/manageplans" onClick={()=>setToggleSidebar(false)}>Manage Plans</Link>
                    </li>
                    {/* <li>
                      <a href="#">Addons </a>
                    </li>
                    <li>
                      <a href="#">Coupons </a>
                    </li> */}
                   
                   
                    <li
                      className={
                        location.pathname == "/createSubscription"
                          ? "revlytic  active-sidebar"
                          : "revlytic"
                      }
                    >
                      <Link to="/createSubscription" onClick={()=>setToggleSidebar(false)}>Quick Create </Link>
                    </li>
                    {/* <li>
                      <a href="#">Payment Processing </a>
                    </li> */}
                  </div>
                )}
 <div className="OpenDiv">
                  <a onClick={() => setSettings(!settings)}>
                    {" "}
                    <h5>
                      {" "}
                      <img src={image3} />{" "}
                      <div className="sidebar-arrow">
                      Storefront
                        {settings ? <UpOutlined /> : <DownOutlined />}{" "}
                      </div>
                    </h5>{" "}
                  </a>
                </div>
                {settings && (
                  <div className="subOpen">
                     <li
                      className={
                        location.pathname == "/customerportalsettings"
                          ? "revlytic  active-sidebar"
                          : "revlytic"
                      }
                    >
                      <Link to="/customerportalsettings" onClick={()=>setToggleSidebar(false)}>
                      Customer Portal
                      </Link>
                    </li>
                    <li
                      className={
                        location.pathname == "/widgetsettings"
                          ? "revlytic  active-sidebar"
                          : "revlytic"
                      }
                    >
                      <Link to="/widgetsettings" onClick={()=>setToggleSidebar(false)}>Subscription Widget </Link>
                    </li>
                    <li
                      className={
                        location.pathname == "/emailtemplateslist"
                          ? "revlytic  active-sidebar"
                          : "revlytic"
                      }
                    >
                      <Link to="/emailtemplateslist" onClick={()=>setToggleSidebar(false)}>Email Templates</Link>
                    </li>
                   
             
                  </div>
                )}
                    <li
                      className={
                        location.pathname == "/settings"
                          ? "revlytic custom  active-sidebar"
                          : "revlytic custom"
                      }
                    >
                      <Link to ="/settings" onClick={()=>setToggleSidebar(false)}>
                    <img src={image8} />
                    Settings
                  </Link>
                </li>
                <li
                      className={
                        location.pathname == "/contactus"
                          ? "revlytic custom  active-sidebar"
                          : "revlytic custom"
                      }
                    >
                      <Link to ="/contactus" onClick={()=>setToggleSidebar(false)}>
                    <img src={contact}/>
                    Contact Us
                  </Link>
                </li>
                <li
                      className={
                        location.pathname == "/billing"
                          ? "revlytic custom  active-sidebar"
                          : "revlytic custom"
                      }
                    >
                      <Link to ="/billing" onClick={()=>setToggleSidebar(false)}>
                    <img src={contact}/>
                 Billing Plans
                  </Link>
                </li>
                <li
                      className={                 
                           "revlytic custom"
                      }
                    >
                        <a href="https://revlytics.gitbook.io/revlytic/how-to-enable-disable-app-embed-block" target='_blank'> <img src={setup}/>How to setup?</a> 
                   
                </li>
                {/* <li
                      className={
                        location.pathname == "/billing"
                          ? "revlytic custom  active-sidebar"
                          : "revlytic custom"
                      }
                    >
                      <Link to ="/billing" onClick={()=>setToggleSidebar(false)}>
                      <img src={image11} />
                    Billing Plans
                  </Link>
                </li> */}
  
              </ul>
            </div>
          </div>
        </div>
        {/*---- sidebar start here---------*/}
        {/*---- right section start here---------*/}
        {/* <div className="mainSection">
      <div className="innerCoumn">
        <h3>Subscription Functionality</h3>
        <div className="innerRight">
          <a href="#">
            <img src="assets/img/pin_icon.svg" className="pinIcon" />
          </a>
          <a href="#">
            <img src="assets/img/dot_icon.svg" className="dotIcon" />
          </a>
        </div>
      </div>
      <div className="innerColumnscnd"></div>
    </div> */}
        {/*---- right section end here---------*/}
      </div>
      {/* </section> */}
      <div style={{ width: "100%" }}>
        <div className="mainSection">
          <div className="innerCoumn">
            <h3></h3>
            <div className="innerRight">

              {!full ? (
                <Button
                  onClick={() => {
                    fullscreen.dispatch(Fullscreen.Action.ENTER), setFull(true);
                  }}
                >
                  <FullscreenOutlined /> Enter Fullscreen
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    fullscreen.dispatch(Fullscreen.Action.EXIT), setFull(false);
                  }}
                >
                  <FullscreenExitOutlined /> Exit Fullscreen
                </Button>
              )}
            </div>
          </div>
          <div className="revlytic inner-column-scnd">
            <div className="revlytic-top-section">
      { planUpdate ==false ? <Outlet planUpdate={planUpdate}  setPlanUpdate={setPlanUpdate}  /> : <Billing planUpdate={planUpdate}  setPlanUpdate={setPlanUpdate} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Spin>
  );
}

export default Sidebar;
