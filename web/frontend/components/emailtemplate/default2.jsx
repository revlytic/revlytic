import React, { useState } from "react";
import {
  Card,
  Switch,
  Form,
  Input,
  Select,
  Button,
  Collapse,
  ColorPicker,
  InputNumber,
  Tooltip,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import Preview from "./preview";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { toast } from "react-toastify";
import {
    convertToRaw,
  } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useAPI } from "../common/commonContext";
import postApi from "../common/postApi";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Link } from "react-router-dom";

function DefaultTemp({
  formData,
  setFormData,
  templateType,
  setLoader,
  editorStateContentText,
  setEditorStateContentText,
  editorStateShippingAddress,
  setEditorStateShippingAddress,
  editorStateBillingAddress,
  setEditorStateBillingAddress,
  editorStateFooterText,
  setEditorStateFooterText,
}) {
  const [form] = useForm();
  // const [editorState, setEditorState] = useState(null);
  const app = useAppBridge();

  const { storeName, billingPlan } = useAPI();

  const { Panel } = Collapse;
  const [selected, setSelected] = useState("hex");

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

    setFormData((prevFormData) => ({ ...prevFormData, [editorName]: html }));
  };

  const handleSubmit = async () => {
    setLoader(true);

    let response = await postApi(
      "/api/admin/emailTemplates",
      { data: formData, templateType },
      app
    );

    if (response?.data?.message == "success") {
      toast.success("Data  saved successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setLoader(false);
  };

  const handleFormChange = (e, option) => {
    if (
      option == "subject" ||
      option == "bcc" ||
      option == "cc" ||
      option == "replyTo"
    ) {
      setFormData({
        ...formData,
        emailSetting: { ...formData?.emailSetting, [option]: e.target.value },
      });
    } else if (
      option == "showLineItems" ||
      option == "showOrderNumber" ||
      option == "showPaymentMethod" ||
      option == "showBillingAddress" ||
      option == "showShippingAddress" ||
      option == "showCurrency" ||
      option == "showSubscriptionId" ||
      option == "logoAlignment"
    ) {
      setFormData({ ...formData, [option]: e });
    } else if (
      option == "headingTextColor" ||
      option == "textColor" ||
      option == "manageSubscriptionTextColor" ||
      option == "manageSubscriptionButtonBackground"
    ) {
      setFormData({ ...formData, [option]: e.toHexString() });
    } else {
      if (option == "logoWidth" || option == "logoHeight") {
        if (/^[0-9]+$/.test(e.target.value) == false) {
          return;
        }
      }

      setFormData({ ...formData, [option]: e.target.value });
    }
  };

  const CustomLabel = () => (
    <div className="revlytic custom-label-email-function">
      <span>URL</span>
      <span className="revlytic-custom-url">
        Don't have URL?{" "}
        <a
          target="_blank"
          href={`https://admin.shopify.com/store/${storeName}/content/files`}
        >
          {" "}
          Click Here
        </a>
      </span>
    </div>
  );

  return (
    <div>
      {formData.contentText && formData?.emailSetting && (
        <div className="revlytic email-template-main-two">
          <div className="revlytic email-template-setting-main">
            <Card>
              <Tooltip
                color="#ffffff"
                title={
                  billingPlan != "starter" &&
                  billingPlan != "premium" &&
                  billingPlan != "premiere" ? (
                    <Link to={`/billing?option=emailTemplates`}>
                      Upgrade your Plan
                    </Link>
                  ) : (
                    ""
                  )
                }
              >
                <div className="revlytic email-dynamic-field-column">
                  <Collapse
                    collapsible={
                      billingPlan != "starter" &&
                      billingPlan != "premium" &&
                      billingPlan != "premiere"
                        ? "disabled"
                        : ""
                    }
                  >
                    <Panel header="Enable/Disable Settings" key="11">
                      <div className="revlytic email-control-input-main">
                        {templateType != "subscriptionInvoice" && (
                          <div className="revlytic email-control-input">
                            {" "}
                            <p>Show Currency</p>
                            <Switch
                              checked={formData.showCurrency}
                              onChange={(value) =>
                                handleFormChange(value, "showCurrency")
                              }
                            />
                          </div>
                        )}

                        {templateType != "subscriptionInvoice" && (
                          <div className="revlytic email-control-input">
                            <p>Show Shipping Address</p>
                            <Switch
                              checked={formData.showShippingAddress}
                              onChange={(value) =>
                                handleFormChange(value, "showShippingAddress")
                              }
                            />
                          </div>
                        )}

                        {templateType != "subscriptionInvoice" && (
                          <div className="revlytic email-control-input">
                            <p>Show Biling Address</p>
                            <Switch
                              checked={formData.showBillingAddress}
                              onChange={(value) =>
                                handleFormChange(value, "showBillingAddress")
                              }
                            />
                          </div>
                        )}
                        {templateType != "subscriptionInvoice" && (
                          <div className="revlytic email-control-input">
                            <p>Show Payment Method</p>
                            <Switch
                              checked={formData.showPaymentMethod}
                              onChange={(value) =>
                                handleFormChange(value, "showPaymentMethod")
                              }
                            />
                          </div>
                        )}

                        {(templateType == "subscriptionPurchased" ||
                          templateType == "subscriptionInvoice") && (
                          <div className="revlytic email-control-input">
                            <p>Show Order Number</p>
                            <Switch
                              checked={formData.showOrderNumber}
                              onChange={(value) =>
                                handleFormChange(value, "showOrderNumber")
                              }
                            />
                          </div>
                        )}
                        {templateType != "subscriptionPurchased" &&
                          templateType != "subscriptionInvoice" && (
                            <div className="revlytic email-control-input">
                              <p>Show Subscription ID</p>
                              <Switch
                                checked={formData.showSubscriptionId}
                                onChange={(value) =>
                                  handleFormChange(value, "showSubscriptionId")
                                }
                              />
                            </div>
                          )}
                        {templateType != "subscriptionInvoice" && (
                          <div className="revlytic email-control-input">
                            <p>Show Line Items</p>
                            <Switch
                              checked={formData.showLineItems}
                              onChange={(value) =>
                                handleFormChange(value, "showLineItems")
                              }
                            />
                          </div>
                        )}
                      </div>
                    </Panel>
                    <Panel header="Email Sender Settings" key="1">
                      <div>
                        <p>Subject</p>
                        <Input
                          value={formData.emailSetting?.subject}
                          onChange={(value) =>
                            handleFormChange(value, "subject")
                          }
                        />
                      </div>
                      <div>
                        <p>CC Email</p>
                        <Input
                          value={formData.emailSetting?.cc}
                          onChange={(value) => handleFormChange(value, "cc")}
                        />
                      </div>
                      <div>
                        <p>Bcc Email</p>
                        <Input
                          value={formData.emailSetting?.bcc}
                          onChange={(value) => handleFormChange(value, "bcc")}
                        />
                      </div>
                      <div>
                        <p>Reply To</p>
                        <Input
                          value={formData.emailSetting?.replyTo}
                          onChange={(value) =>
                            handleFormChange(value, "replyTo")
                          }
                        />
                      </div>
                    </Panel>
                    <Panel header="Logo" key="2">
                      <div>
                        <p>{CustomLabel()}</p>
                        <Input
                          value={formData.logoUrl}
                          onChange={(value) =>
                            handleFormChange(value, "logoUrl")
                          }
                        />
                      </div>
                      <div>
                        <p>Height</p>
                        <Input
                          value={formData.logoHeight}
                          onChange={(value) =>
                            handleFormChange(value, "logoHeight")
                          }
                          suffix="px"
                        />
                      </div>
                      <div>
                        <p>Width</p>
                        <Input
                          value={formData.logoWidth}
                          onChange={(value) =>
                            handleFormChange(value, "logoWidth")
                          }
                          suffix="px"
                        />
                      </div>
                      <div>
                        <p>Alignment</p>
                        <Select
                          value={formData.logoAlignment}
                          onChange={(value) =>
                            handleFormChange(value, "logoAlignment")
                          }
                        >
                          <Select.Option value="left"> Left</Select.Option>
                          <Select.Option value="center"> Center</Select.Option>
                          <Select.Option value="right"> Right</Select.Option>
                        </Select>
                      </div>
                    </Panel>
                    <Panel header="Heading" key="3">
                      <div>
                        <p>Text</p>
                        <Input
                          value={formData.headingText}
                          onChange={(value) =>
                            handleFormChange(value, "headingText")
                          }
                        />
                      </div>

                      <div>
                        <p>Text Color</p>{" "}
                        <ColorPicker
                          showText={(color) => (
                            <span>{formData.headingTextColor}</span>
                          )}
                          format={selected}
                          onFormatChange={(s) => setSelected(s)}
                          value={formData.headingTextColor}
                          onChange={(value) =>
                            handleFormChange(value, "headingTextColor")
                          }
                        />
                      </div>
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
                      <div>
                        <p>Color</p>{" "}
                        <ColorPicker
                          showText={(color) => (
                            <span>{formData.textColor}</span>
                          )}
                          format={selected}
                          onFormatChange={(s) => setSelected(s)}
                          value={formData.textColor}
                          onChange={(value) =>
                            handleFormChange(value, "textColor")
                          }
                        />
                      </div>
                    </Panel>

                    {templateType != "subscriptionInvoice" && (
                      <Panel header="Manage Subscription Button" key="5">
                        <div>
                          <p>Text</p>
                          <Input
                            value={formData.manageSubscriptionText}
                            onChange={(value) =>
                              handleFormChange(value, "manageSubscriptionText")
                            }
                          />
                        </div>

                        <div>
                          <p>Text Color</p>{" "}
                          <ColorPicker
                            showText={(color) => (
                              <span>
                                {formData.manageSubscriptionTextColor}
                              </span>
                            )}
                            format={selected}
                            onFormatChange={(s) => setSelected(s)}
                            value={formData.manageSubscriptionTextColor}
                            onChange={(value) =>
                              handleFormChange(
                                value,
                                "manageSubscriptionTextColor"
                              )
                            }
                          />
                        </div>

                        <div>
                          <p>URL</p>
                          <Input
                            value={formData.subscriptionUrl}
                            onChange={(value) =>
                              handleFormChange(value, "subscriptionUrl")
                            }
                          />
                        </div>

                        <div>
                          <p>Background</p>{" "}
                          <ColorPicker
                            showText={(color) => (
                              <span>
                                {formData.manageSubscriptionButtonBackground}
                              </span>
                            )}
                            format={selected}
                            onFormatChange={(s) => setSelected(s)}
                            value={formData.manageSubscriptionButtonBackground}
                            onChange={(value) =>
                              handleFormChange(
                                value,
                                "manageSubscriptionButtonBackground"
                              )
                            }
                          />
                        </div>
                      </Panel>
                    )}

                    {templateType != "subscriptionInvoice" && (
                      <Panel header="Shipping Address" key="6">
                        <div>
                          <p>Text</p>
                          <Input
                            value={formData.subscriptionShippingAddressText}
                            onChange={(value) =>
                              handleFormChange(
                                value,
                                "subscriptionShippingAddressText"
                              )
                            }
                          />
                        </div>

                        <p>Address</p>
                        <Editor
                          editorState={editorStateShippingAddress}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          onEditorStateChange={(newEditorState) =>
                            handleEditorStateChange(
                              newEditorState,
                              "shippingAddress"
                            )
                          }
                        />
                      </Panel>
                    )}

                    {templateType != "subscriptionInvoice" && (
                      <Panel header="Billing Address" key="7">
                        <div>
                          <p>Text</p>
                          <Input
                            value={formData.subscriptionBillingAddressText}
                            onChange={(value) =>
                              handleFormChange(
                                value,
                                "subscriptionBillingAddressText"
                              )
                            }
                          />
                        </div>

                        <p>Address</p>
                        <Editor
                          editorState={editorStateBillingAddress}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          onEditorStateChange={(newEditorState) =>
                            handleEditorStateChange(
                              newEditorState,
                              "billingAddress"
                            )
                          }
                        />
                      </Panel>
                    )}
                    {templateType != "subscriptionInvoice" && (
                      <Panel header="Payment Method" key="8">
                        <div>
                          <p>Text</p>
                          <Input
                            value={formData.paymentMethodText}
                            onChange={(value) =>
                              handleFormChange(value, "paymentMethodText")
                            }
                          />
                        </div>
                        <div>
                          <p>Ending With</p>
                          <Input
                            value={formData.endingWithText}
                            onChange={(value) =>
                              handleFormChange(value, "endingWithText")
                            }
                          />
                        </div>
                      </Panel>
                    )}
                    <Panel header="Placeholder Text" key="9">
                      <div>
                        <p>Order Number</p>
                        <Input
                          value={formData.orderNumberText}
                          onChange={(value) =>
                            handleFormChange(value, "orderNumberText")
                          }
                        />
                      </div>
                      <div>
                        <p>Subscription ID</p>
                        <Input
                          value={formData.subscriptionIdText}
                          onChange={(value) =>
                            handleFormChange(value, "subscriptionIdText")
                          }
                        />
                      </div>

                      <div>
                        <p>Delivery Frequency</p>
                        <Input
                          value={formData.deliveryFrequencyText}
                          onChange={(value) =>
                            handleFormChange(value, "deliveryFrequencyText")
                          }
                        />
                      </div>
                      <div>
                        <p>Next Billing Date</p>
                        <Input
                          value={formData.nextBillingDateText}
                          onChange={(value) =>
                            handleFormChange(value, "nextBillingDateText")
                          }
                        />
                      </div>
                      <div>
                        <p>Plan Name</p>
                        <Input
                          value={formData.planNameText}
                          onChange={(value) =>
                            handleFormChange(value, "planNameText")
                          }
                        />
                      </div>
                      <div>
                        <p>Billing Frequency</p>
                        <Input
                          value={formData.billingFrequencyText}
                          onChange={(value) =>
                            handleFormChange(value, "billingFrequencyText")
                          }
                        />
                      </div>
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
              </Tooltip>
            </Card>
          </div>
          <div className="revlytic email-template-preview-main">
            <Card>
              <Preview formData={formData} templateType={templateType} />
            </Card>
          </div>
        </div>
      )}
      <div className="revlytic email-template-setting-button-main">
        <Tooltip
          color="#ffffff"
          title={
            billingPlan != "starter" &&
            billingPlan != "premium" &&
            billingPlan != "premiere" ? (
              <Link to={`/billing?option=emailTemplates`}>
                Upgrade your Plan
              </Link>
            ) : (
              ""
            )
          }
        >
          <Button
            className="revlytic-save-subscription"
            htmlType="submit"
            disabled={
              billingPlan != "starter" &&
              billingPlan != "premium" &&
              billingPlan != "premiere"
            }
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export default DefaultTemp;
