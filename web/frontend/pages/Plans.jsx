import React, { useEffect, useState } from "react";
import PlanForm from "../components/PlanForm";
import { useLocation } from "react-router-dom";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";


function Plans() {
  const navigate = useNavigate()
  const app = useAppBridge();
  const location = useLocation();
  const queryParams = location.search;
  const params = new URLSearchParams(queryParams);
  const param1 = params.get("id"); // get the value of param1

  useEffect(() => {
    // console.log(param1)
    // getVarientids();
  }, []);
  // const getVarientids = async () => {
  //   let data = await postApi(
  //     "/api/admin/getProductVarientsIds",
  //     { pid: param1 },
  //     app
  //   );
  //   setProductData(data?.data?.data)
  // };
  return (
    <div>
         <div className="revlytic plan-group-listing-button">

            <Button type="link"  onClick={() => navigate("/manageplans")}>
        <ArrowLeftOutlined />Plans
        </Button>
        </div>
        <PlanForm  pid={param1}/>
    </div>
  );
}

export default Plans;
