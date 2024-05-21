import React, { useEffect, useState } from "react";
import { Button, Modal, Radio } from "antd";
import CreateManualSubscription from "../components/createManualSubscription";
import PlanForm from "../components/PlanForm";
import { ArrowLeftOutlined,RollbackOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import icons from "../assets/images/switch.png"
import { useLocation } from "react-router-dom";



function CreteSubscription() {
  const navigate = useNavigate()
  const [subscriptionType, setSubscriptionType] = useState("Subscriptions");
  const [isModalOpen, setIsModalOpen] = useState(false); //// modal state to do back to listing link
  const location = useLocation();
  const queryParams = location.search;
  const params = new URLSearchParams(queryParams);
  const type = params.get("type");
  useEffect(() => {
    type=="manual" && setSubscriptionType("merchant")
  }, [])
 
  return (
    <>
      <div className="revlytic plan-group-listing-button">
      <h1 className="revlytic-plan-switch-heading">{subscriptionType == "merchant" ? "Manual Subscription":"Subscription Plan"}</h1>

        {/* <a onClick={() => setIsModalOpen(true)}> </a> */}
        
</div>
      <div className="revlytic-subscription-type-header">
      <Button type="link"  style={{"color":"#000"}} onClick={() => setIsModalOpen(true)}>
        <ArrowLeftOutlined /> {subscriptionType != "merchant"?"Plans":"Subscriptions"}
    </Button>
        {/* <Radio.Group defaultValue={subscriptionType} buttonStyle="solid">
          <Radio.Button
            value="customer"s
            onChange={() => setSubscriptionType("customer")}
          >
            Subscription Plan
          </Radio.Button>
          <Radio.Button
            value="merchant"
            onChange={() => setSubscriptionType("merchant")}
          >
            Manual Subscription
          </Radio.Button>
        </Radio.Group> */}
        <Button className="revlytic-plan-switch" onClick={() => { subscriptionType == "merchant" ? setSubscriptionType("customer") : setSubscriptionType("merchant") }}><img src={icons} />{subscriptionType == "merchant" ? "Switch to Subscription Plan":"Switch to Manual Subscription"} </Button>

      </div>

      {subscriptionType == "merchant" ? (
        <CreateManualSubscription />
      ) : (
        <PlanForm pid="new" />
      )}


<Modal
        title="Going Back?"
        open={isModalOpen}
        onOk={() => {subscriptionType != "merchant"?navigate(`/manageplans`):navigate("/subscriptionList")}}
        onCancel={() => setIsModalOpen(false)}
      >
        <h1>
          Are you sure you want to go back? All unsaved changes will be lost.
        </h1>
      </Modal>
    </>
  );
}

export default CreteSubscription;
