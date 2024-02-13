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
import { Button, Spin, Alert } from "antd";
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
import contact from "../../assets/images/contactus.svg";
import setup from "../../assets/images/setup.svg";
import { useAPI } from "./commonContext";

function Sidebar(props) {
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
  const [planUpdate, setPlanUpdate] = useState(false);
  const [changePlan, setChangePlan] = useState(false);
  const [revenue, setRevenue] = useState();
  const [loader, setLoader] = useState(false);
  const {
    billingPlan,
    billingPlanDate,
    check,
    setRecurringRevenue,
    planBuyDate,
    recurringRevenue,
  } = useAPI();
  useEffect(async () => {
    //  console.log("ewyewye",billingPlan,planBuyDate)
    setLoader(true);
    if (billingPlan != undefined) {
      let data = await axios.get(
        "https://cdn.shopify.com/s/javascripts/currencies.js"
      );

      let filtered = await eval(
        new Function(`
           
           ${data?.data}
           
           return Currency;
           
           `)
      )();

     if (filtered) {
         let range =
          !billingPlan || billingPlan == ""
            ? new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
            : billingPlan == "free"
            ? getFreePlanDate(new Date(), new Date(planBuyDate))
            : planBuyDate;
        //  console.log("range",range)

        let response = await getData({ range }, filtered?.rates);

        setRenderSidebar(true);
        // count.current = count.current + 1;
      }
    }
    setLoader(false);
  }, [billingPlan, planBuyDate]);

  const getData = async (body, rates) => {
    // console.log("getData--->", body);

    const response = await postApi("/api/admin/calculateRevenue", body, app);

    // console.log("response", response);

    if (response?.data?.message === "success") {
      // console.log("dfdfd", response?.data?.data);

      // console.log("trates", rates);

      let arr = response?.data?.data;
      let sum = 0;

      if (arr.length > 0) {
        arr.map((item) => {
          sum =
            sum +
            parseFloat(item.total_amount) *
              parseFloat(rates[item?.currency] / rates["USD"]);
          // console.log("checkitemsrev", sum);
        });
      }

      // console.log("insidebarrr--sum", sum,typeof undefined);
      //  sum =10000;
      setRecurringRevenue(sum);
      if (billingPlan == undefined) {
        // Billing plan is not available yet
        props.setActiveContactRoute(false);
        console.log("Billing plan not available");
      } else {
        // Billing plan is available, update the state
        // console.log("billingPlan",billingPlan)
        if (billingPlan == "starter" && sum >= 5000) {
          // console.log("1233")
          setPlanUpdate(true);
          props.setActiveContactRoute(true);
        } else if (billingPlan === "premium" && sum >= 30000) {
          setPlanUpdate(true);
          props.setActiveContactRoute(true);

          // console.log("3553")
        } else if (billingPlan === "premiere" && sum >= 100000) {
          setPlanUpdate(true);
          props.setActiveContactRoute(true);

          // console.log("3553")
        } else {
          if ((billingPlan == "" || billingPlan == "free") && sum >= 750) {
            setPlanUpdate(true);
            props.setActiveContactRoute(true);
            // console.log("868009")
          } else {
            // console.log("262783939")
            props.setActiveContactRoute(false);
            setPlanUpdate(false);
          }
        }
      }
    }
  };

  function getFreePlanDate(endDate, startDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds

    console.log("endDate, startDate", endDate, startDate);
    const timeDifference = Math.abs(endDate - startDate);
  
    let daysDifference = Math.floor(timeDifference / oneDay);
    const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // console.log("sdsdsd",daysDifference)
    if (daysDifference > 30) {
      let remaining = parseInt(daysDifference / 30);
      //  console.log("dsdasa",daysDifference)
      const finaldate = new Date(
        today.getTime() - remaining * 24 * 60 * 60 * 1000
      );
      // console.log("jkkkk",finaldate)
      return finaldate;
    } else {
      const finaldate = new Date(
        today.getTime() - daysDifference * 24 * 60 * 60 * 1000
      );
      return finaldate;
    }
  }

  return (
    renderSidebar && (
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
                <img src={image7} width={150} />{" "}
              </a>
            </div>
            <div className="sidemenusMain">
              <div className="sidemenus">
                <h4>Menu</h4>
                <ul>
                  <li
                    className={
                      location.pathname == "/"
                        ? "revlytic custom  active-sidebar"
                        : "revlytic custom"
                    }
                  >
                    <Link to="/" onClick={() => setToggleSidebar(false)}>
                      <img src={Home} />
                      Home
                    </Link>
                  </li>
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
                          Subscription{" "}
                          {open ? <UpOutlined /> : <DownOutlined />}
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
                        <Link
                          to="/subscriptionlist"
                          onClick={() => setToggleSidebar(false)}
                        >
                          Subscriptions{" "}
                        </Link>
                      </li>
                      <li
                        className={
                          location.pathname == "/manageplans"
                            ? "revlytic  active-sidebar"
                            : "revlytic"
                        }
                      >
                        <Link
                          to="/manageplans"
                          onClick={() => setToggleSidebar(false)}
                        >
                          Manage Plans
                        </Link>
                      </li>
                       <li
                        className={
                          location.pathname == "/createSubscription"
                            ? "revlytic  active-sidebar"
                            : "revlytic"
                        }
                      >
                        <Link
                          to="/createSubscription"
                          onClick={() => setToggleSidebar(false)}
                        >
                          Quick Create{" "}
                        </Link>
                      </li>
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
                        <Link
                          to="/customerportalsettings"
                          onClick={() => setToggleSidebar(false)}
                        >
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
                        <Link
                          to="/widgetsettings"
                          onClick={() => setToggleSidebar(false)}
                        >
                          Subscription Widget{" "}
                        </Link>
                      </li>
                      <li
                        className={
                          location.pathname == "/emailtemplateslist"
                            ? "revlytic  active-sidebar"
                            : "revlytic"
                        }
                      >
                        <Link
                          to="/emailtemplateslist"
                          onClick={() => setToggleSidebar(false)}
                        >
                          Email Templates
                        </Link>
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
                    <Link
                      to="/settings"
                      onClick={() => setToggleSidebar(false)}
                    >
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
                    <Link
                      to="/contactus"
                      onClick={() => setToggleSidebar(false)}
                    >
                      <img src={contact} />
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
                    <Link to="/billing" onClick={() => setToggleSidebar(false)}>
                      <img src={contact} />
                      Billing Plans
                    </Link>
                  </li>
                  <li className={"revlytic custom"}>
                    <a
                      href="https://revlytics.gitbook.io/revlytic/how-to-enable-disable-app-embed-block"
                      target="_blank"
                    >
                      {" "}
                      <img src={setup} />
                      How to setup?
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
                      fullscreen.dispatch(Fullscreen.Action.ENTER),
                        setFull(true);
                    }}
                  >
                    <FullscreenOutlined /> Enter Fullscreen
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      fullscreen.dispatch(Fullscreen.Action.EXIT),
                        setFull(false);
                    }}
                  >
                    <FullscreenExitOutlined /> Exit Fullscreen
                  </Button>
                )}
              </div>
            </div>
            <div className="revlytic inner-column-scnd">
              <div className="revlytic-top-section">
                {planUpdate && (
                  <Alert
                    className="revlytic-billing-plans-warning"
                    banner
                    closable
                    message="Revenue cap for the monthly plan reached, please upgrade."
                    type="warning"
                  />
                )}

                {planUpdate == false ? (
                  <Outlet setActiveContactRoute={props.setActiveContactRoute} />
                ) : (
                  <Billing
                    setPlanUpdate={setPlanUpdate}
                    setActiveContactRoute={props.setActiveContactRoute}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Sidebar;
