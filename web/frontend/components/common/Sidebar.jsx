import React, { useState } from "react";
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
import { Button } from "antd";
import { useLocation } from "react-router-dom";

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
  // console.log(location, "bbbbbbbbbbbbbbb");
  return (
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
                        location.pathname == "/home"
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
                        location.pathname == "/"
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
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
