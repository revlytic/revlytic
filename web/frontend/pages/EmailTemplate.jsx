import React, { useState, useEffect } from "react";
import { Tabs, Button, Spin } from "antd";
import DefaultTemp from "../components/emailtemplate/default2";
import DynamicVariables from "../components/emailtemplate/dynamicVariables";
import postApi from "../components/common/postApi";
import { useLocation } from "react-router-dom";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "@shopify/app-bridge-react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import CalculateBillingUsage from "../components/calculateBillingUsage";
const EmailTemplate = () => {
  const [loader, setLoader] = useState(false);
  const location = useLocation();
  const queryParams = location.search;
  const params = new URLSearchParams(queryParams);
  const templateType = params.get("type");
  const app = useAppBridge();
  const navigate = useNavigate();
    
  const [formData, setFormData] = useState({});
  const [billingPlan,setBillingPlan]=useState('')


  const [editorStateContentText, setEditorStateContentText] = useState(
    EditorState.createEmpty()
  );
  const [editorStateShippingAddress, setEditorStateShippingAddress] = useState(
    EditorState.createEmpty()
  );
  const [editorStateBillingAddress, setEditorStateBillingAddress] = useState(
    EditorState.createEmpty()
  );
  const [editorStateFooterText, setEditorStateFooterText] = useState(
    EditorState.createEmpty()
  );
  useEffect(async () => {
    setLoader(true);
    let res = await postApi(
      "/api/admin/getEmailTemplateAndConfigData",
      { templateType: templateType },
      app
    );
    let response = await postApi(
      "/api/admin/getEmailTemplateData",
      { templateType: templateType },
      app
    );
    if (response?.data?.message == "success") {
      let result = response.data.data;

      setFormData(result);

      setInitialEditorState("contentText", result.contentText);
      setInitialEditorState("shippingAddress", result.shippingAddress);
      setInitialEditorState("billingAddress", result.billingAddress);
      setInitialEditorState("footerText", result.footerText);
    } else {
    }

    setLoader(false);
  }, []);

  const setInitialEditorState = (editorName, initialValue) => {
    if (initialValue) {
      const blocksFromHTML = convertFromHTML(initialValue);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      switch (editorName) {
        case "contentText":
          setEditorStateContentText(
            EditorState.createWithContent(contentState)
          );
          break;
        case "shippingAddress":
          setEditorStateShippingAddress(
            EditorState.createWithContent(contentState)
          );
          break;
        case "billingAddress":
          setEditorStateBillingAddress(
            EditorState.createWithContent(contentState)
          );
          break;
        case "footerText":
          setEditorStateFooterText(EditorState.createWithContent(contentState));
          break;
        default:
          break;
      }
    }
  };

  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: `Default`,
      children: (
        <DefaultTemp
          formData={formData}
          setFormData={setFormData}
          templateType={templateType}
          loader={loader}
          setLoader={setLoader}
          editorStateContentText={editorStateContentText}
          setEditorStateContentText={setEditorStateContentText}
          editorStateShippingAddress={editorStateShippingAddress}
          setEditorStateShippingAddress={setEditorStateShippingAddress}
          editorStateFooterText={editorStateFooterText}
          setEditorStateFooterText={setEditorStateFooterText}
          editorStateBillingAddress={editorStateBillingAddress}
          setEditorStateBillingAddress={setEditorStateBillingAddress}
        />
      ),
    },

    {
      key: "3",
      label: `Dynamic Variables`,
      children: (
        <DynamicVariables
          formData={formData}
          setFormData={setFormData}
          templateType={templateType}
          // textEditorData={textEditorData}
          // setTextEditorData={setTextEditorData}
        />
      ),
    },
  ];

  return (
    <>
      <Spin spinning={loader} size="large" tip="Loading...">
        <Button
          type="link"
          style={{ color: "#000000" }}
          onClick={() => navigate("/emailtemplatesList")}
        >
          <ArrowLeftOutlined /> Email Templates
        </Button>
        <div className="revlytic default-and-dynamic-Varriables">
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
       <CalculateBillingUsage setBillingPlan={setBillingPlan}/>
      </Spin>
    </>
  );
};

export default EmailTemplate;
