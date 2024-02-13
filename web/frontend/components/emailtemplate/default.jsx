//althogh textdeditors are contained in form ,but there values are extracted in textEditorData object
import React, { useEffect, useState, useRef } from "react";
import { Card, Switch, Form, Input, Select, Button, Collapse } from "antd";
import { useForm } from "antd/lib/form/Form";
import Preview from "./preview";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { toast } from "react-toastify";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useAPI } from "../common/commonContext";
import postApi from "../common/postApi";
import { useAppBridge } from "@shopify/app-bridge-react";
function Default({
  formData,
  textEditorData,
  setFormData,
  setTextEditorData,
  templateType,
  setLoader,
}) {
  const [form] = useForm();
  const [editorState, setEditorState] = useState(null);
  const app = useAppBridge();

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
  const { storeName } = useAPI();

  const { Panel } = Collapse;

  useEffect(() => {
    setInitialEditorState("contentText", textEditorData.contentText);
    setInitialEditorState("shippingAddress", textEditorData.shippingAddress);
    setInitialEditorState("billingAddress", textEditorData.billingAddress);
    setInitialEditorState("footerText", textEditorData.footerText);

    form.setFieldsValue({
      status: formData.status,
      adminNotification:formData.adminNotification,
      showCurrency: formData.showCurrency,
      showShippingAddress: formData.showShippingAddress,
      showBillingAddress: formData.showBillingAddress,
      showPaymentMethod: formData.showPaymentMethod,
      showOrderNumber: formData.showOrderNumber,
      showLineItems: formData.showLineItems,
      emailSetting: {
        bcc: formData.bcc,
        ccc: formData.ccc,
        replyTo: formData.replyTo,
        subject: formData.subject,
      },
      endingWithText: formData.endingWithText,
      headingText: formData.headingText,

      headingTextColor: formData.headingTextColor,
      logoAlignment: formData.logoAlignment,
      logoHeight: formData.logoHeight,
      logoUrl: formData.logoUrl,
      logoWidth: formData.logoWidth,
      manageSubscriptionButtonBackground: formData.manageSubscriptionButtonBackground,
      manageSubscriptionText:formData.manageSubscriptionText,
      manageSubscriptionTextColor: formData.manageSubscriptionTextColor,
      nextBillingDateText:formData.nextBillingDateText,
      orderNumberText: formData.orderNumberText,
      paymentMethodText:formData.paymentMethodText,
      planNameText: formData.planNameText,
     
      subscriptionBillingAddressText: formData.subscriptionBillingAddressText,
      subscriptionShippingAddressText:formData.subscriptionShippingAddressText,
      textColor:formData.textColor,
    });
  }, [formData]);

  console.log("dsdad", formData);
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

  const handleEditorStateChange = (newEditorState, editorName) => {
    switch (editorName) {
      case "contentText":
        setEditorStateContentText(newEditorState);
        break;
      case "shippingAddress":
        setEditorStateShippingAddress(newEditorState);
        break;
      case "billingAddress":
        setEditorStateBillingAddress(newEditorState);
        break;
      case "footerText":
        setEditorStateFooterText(newEditorState);
        break;
      default:
        break;
    }

    const contentState = newEditorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const html = draftToHtml(rawContentState);
    setTextEditorData({ ...textEditorData, [editorName]: html });
    console.log("first", html);
  };

  const onFinish = async (values) => {
    setLoader(true);
    console.log("first", templateType);
    console.log("valuesss", values);
    console.log("FORMDATA", formData);
    console.log("ediotrsss", textEditorData);

    let response = await postApi(
      "/api/admin/emailTemplates",
      { data: { ...formData, ...textEditorData }, templateType },
      app
    );

    if (response?.data?.message == "success") {
      toast.success("Data  saved successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      console.log("20jun");
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setLoader(false);
  };

  const handleFormChange = (changedValues, allValues) => {
    console.log("alllvalues", allValues);
    setFormData(allValues);
    console.log("formdataonchange", allValues);
  };

  // const handleInputChange = (fieldName, value) => {
  //   console.log("sjhdjkhjsjdj", value);
  //   setFormValues((prevValues) => ({
  //     ...prevValues,
  //     [fieldName]: value,
  //   }));
  // };
  const CustomLabel = () => (
    <div style={{ display: "flex" }}>
      <span>Url</span>
      <span onClick={() => navigate("/")}>Don't have url ?</span>
      <a
        target="_blank"
        href={`https://admin.shopify.com/store/${storeName}/content/files`}
      >
        {" "}
        Click Here
      </a>
    </div>
  );

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={handleFormChange}
    >
    
 
         
      <div className="revlytic email-template-main-two">
        <div className="revlytic email-template-setting-main">
        <Card>
          <div className="revlytic email-control-input-main">
            <div className="revlytic email-control-input">
            <Form.Item
              label="Show Currency"
              name="showCurrency"
              initialValue={formData.showCurrency}
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
            </div>
            <div className="revlytic email-control-input">
            <Form.Item
              label="Show Shipping Address"
              name="showShippingAddress"
              initialValue={formData.showShippingAddress}
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
            </div>
            <div className="revlytic email-control-input">
            <Form.Item
              label="Show Biling Address"
              name="showBillingAddress"
              initialValue={formData.showBillingAddress}
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
            </div>
            <div className="revlytic email-control-input">
            <Form.Item
              label="Show Payment Method"
              name="showPaymentMethod"
              initialValue={formData.showPaymentMethod}
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
            </div>
            <div className="revlytic email-control-input">
            <Form.Item
              label="Show Order Number"
              name="showOrderNumber"
              initialValue={formData.showOrderNumber}
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
            </div>
            <div className="revlytic email-control-input">
            <Form.Item
              label="Show Line Items"
              name="showLineItems"
              initialValue={formData.showLineItems}
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
            </div>
          </div>

          {/* */}
          <div className="revlytic email-dynamic-field-column">

            <Collapse>
              <Panel header="Email Sender Settings" key="1">
                
                  {/* <div>
                    <p>Subject</p>
                    <Input />
                  </div>
                  <div>
                    <p>CCC Email</p>
                    <Input />
                  </div>
                  <div>
                    <p>Bcc Email</p>
                    <Input />
                  </div>
                  <div>
                    <p>Reply To</p>
                    <Input />
                  </div> */}
                  <Form.Item
                    label="Subject"
                    name={["emailSetting", "subject"]}
                    initialValue={formData.emailSetting?.subject}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Ccc Email"
                    name={["emailSetting", "ccc"]}
                    initialValue={formData?.emailSetting?.ccc}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Bcc Email"
                    name={["emailSetting", "bcc"]}
                    initialValue={formData?.emailSetting?.bcc}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Reply To"
                    name={["emailSetting", "replyTo"]}
                    initialValue={formData?.emailSetting?.replyTo}
                  >
                    <Input />
                  </Form.Item>
                </Panel>
                <Panel header="Logo" key="2">
                  <Form.Item
                    label={CustomLabel()}
                    name="logoUrl"
                    initialValue={formData.logoUrl}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Height"
                    name="logoHeight"
                    initialValue={formData.logoHeight}
                  >
                    <Input suffix="px" />
                  </Form.Item>
                  <Form.Item
                    label="Width"
                    name="logoWidth"
                    initialValue={formData.logoWidth}
                  >
                    <Input suffix="px" />
                  </Form.Item>
                  <Form.Item
                    label="Alignment"
                    name="logoAlignment"
                    initialValue={formData.logoAlignment}
                  >
                    <Select>
                      <Select.Option value="left"> Left</Select.Option>
                      <Select.Option value="center"> Center</Select.Option>
                      <Select.Option value="right"> Right</Select.Option>
                    </Select>
                  </Form.Item>
                </Panel>

                <Panel header="Heading" key="3">
                  <Form.Item
                    label="Text"
                    name="headingText"
                    initialValue={formData.headingText}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) =>
                      getFieldValue(["headingTextColor"]) ? (
                        <Form.Item
                          label="Text Color"
                          name="headingTextColor"
                          initialValue={formData.headingTextColor}
                        >
                          <Input
                            type="color"
                            suffix={getFieldValue(["headingTextColor"])}
                          />
                        </Form.Item>
                      ) : (
                        <Form.Item
                          label="Text Color"
                          name="Text Color"
                          initialValue={formData.headingTextColor}
                        >
                          <Input
                            type="color"
                            suffix={formData.headingTextColor}
                          />
                        </Form.Item>
                      )
                    }
                  </Form.Item>
                </Panel>

                <Panel header="Email Body Content" key="4">
                  <p>Text</p>

                  <Editor
                    editorState={editorStateContentText}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={(newEditorState) =>
                      handleEditorStateChange(newEditorState, "contentText")
                    }
                  />

                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) =>
                      getFieldValue(["textColor"]) ? (
                        <Form.Item
                          label="Color"
                          name="textColor"
                          initialValue={formData.textColor}
                        >
                          <Input
                            type="color"
                            suffix={getFieldValue(["textColor"])}
                          />
                        </Form.Item>
                      ) : (
                        <Form.Item
                          label="Text Color"
                          name="textColor"
                          initialValue={formData.textColor}
                        >
                          <Input type="color" suffix={formData.textColor} />
                        </Form.Item>
                      )
                    }
                  </Form.Item>
                </Panel>

                <Panel header="Manage Subscription Button" key="5">
                  <Form.Item
                    label="Text"
                    name="manageSubscriptionText"
                    initialValue={formData.manageSubscriptionText}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) =>
                      getFieldValue(["manageSubscriptionTextColor"]) ? (
                        <Form.Item
                          label="Text Color"
                          name="manageSubscriptionTextColor"
                          initialValue={formData.manageSubscriptionTextColor}
                        >
                          <Input
                            type="color"
                            suffix={getFieldValue([
                              "manageSubscriptionTextColor",
                            ])}
                          />
                        </Form.Item>
                      ) : (
                        <Form.Item
                          label="Text Color"
                          name="manageSubscriptionTextColor"
                          initialValue={formData.manageSubscriptionTextColor}
                        >
                          <Input
                            type="color"
                            suffix={formData.manageSubscriptionTextColor}
                          />
                        </Form.Item>
                      )
                    }
                  </Form.Item>

                  <Form.Item
                    label="Url"
                    name="subscriptionUrl"
                    initialValue={formData.subscriptionUrl}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) =>
                      getFieldValue(["manageSubscriptionButtonBackground"]) ? (
                        <Form.Item
                          label="Background"
                          name="manageSubscriptionButtonBackground"
                          initialValue={
                            formData.manageSubscriptionButtonBackground
                          }
                        >
                          <Input
                            type="color"
                            suffix={
                              getFieldValue([
                                "manageSubscriptionButtonBackground",
                              ]) + "px"
                            }
                          />
                        </Form.Item>
                      ) : (
                        <Form.Item
                          label="Background"
                          name="manageSubscriptionButtonBackground"
                          initialValue={
                            formData.manageSubscriptionButtonBackground
                          }
                        >
                          <Input
                            type="color"
                            suffix={formData.manageSubscriptionButtonBackground}
                          />
                        </Form.Item>
                      )
                    }
                  </Form.Item>
                </Panel>

                <Panel header="Shipping Address" key="6">
                  <Form.Item
                    label="Text"
                    name="subscriptionShippingAddressText"
                    initialValue={formData.subscriptionShippingAddressText}
                  >
                    <Input />
                  </Form.Item>
                  <p>Address</p>
                  <Editor
                    editorState={editorStateShippingAddress}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={(newEditorState) =>
                      handleEditorStateChange(newEditorState, "shippingAddress")
                    }
                  />
                </Panel>

                <Panel header="Billing Address" key="7">
                  <Form.Item
                    label="Text"
                    name="subscriptionBillingAddressText"
                    initialValue={formData.subscriptionBillingAddressText}
                  >
                    <Input />
                  </Form.Item>
                  <p>Address</p>
                  <Editor
                    editorState={editorStateBillingAddress}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={(newEditorState) =>
                      handleEditorStateChange(newEditorState, "billingAddress")
                    }
                  />
                </Panel>
                <Panel header="Payment Method" key="8">
                  <Form.Item
                    label="Text"
                    name="paymentMethodText"
                    initialValue={formData.paymentMethodText}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Ending With"
                    name="endingWithText"
                    initialValue={formData.endingWithText}
                  >
                    <Input />
                  </Form.Item>
                </Panel>

                <Panel header="Placeholder Text" key="9">
                  <Form.Item
                    label="Order Number"
                    name="orderNumberText"
                    initialValue={formData.orderNumberText}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Delivery Frequency"
                    name="deliveryFrequencyText"
                    initialValue={formData.deliveryFrequencyText}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Next Billing Date"
                    name="nextBillingDateText"
                    initialValue={formData.nextBillingDateText}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Plan Name"
                    name="planNameText"
                    initialValue={formData.planNameText}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Billing Frequency"
                    name="billingFrequencyText"
                    initialValue={formData.billingFrequencyText}
                  >
                    <Input />
                  </Form.Item>
                </Panel>

                <Panel header="Footer" key="10">
                  <p>Text</p>
                  <Editor
                    editorState={editorStateFooterText}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={(newEditorState) =>
                      handleEditorStateChange(newEditorState, "footerText")
                    }
                  />
                </Panel>
              </Collapse>
            </div>
          </Card>
        </div>
        <div className="revlytic email-template-preview-main">
          <Card>
          {templateType} && <Preview formData={formData}  templateType={templateType} textEditorData={textEditorData} />
          </Card>
        </div>
      </div>
      <div className="revlytic email-template-setting-button-main">
        <Button className="revlytic-save-subscription" htmlType="submit">
          Submit
        </Button>
        </div>
    </Form>
  );
}

export default Default;
