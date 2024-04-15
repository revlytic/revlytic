import React, { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Radio,
  Select,
  Card,
  List,
  Avatar,
  Spin,
  Modal,
  DatePicker,
  Divider,
  Switch,
  Collapse,
  Tooltip,
} from "antd";

import { useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { toast } from "react-toastify";
import postApi from "../components/common/postApi";
import { useAPI } from "../components/common/commonContext";
import CalculateBillingUsage from "../components/calculateBillingUsage";
import {
  CalendarOutlined,
  CloseOutlined,
  ContactsOutlined,
  EditOutlined,
  QuestionCircleFilled,
  QuestionCircleOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Panel } = Collapse;

function customerPortalSettings() {
  const [form] = Form.useForm();
  const app = useAppBridge();
  // const { billingPlan } = useAPI();
  const [billingPlan,setBillingPlan]=useState('')
  const [loader, setLoader] = useState(false); // for loader
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("simple");
  const [options, setoptions] = useState({
    one: "Doesn’t meet my needs",
    two: "Found a better alternative",
    three: "Very Expensive",
    four: "Other",
  });
  const { TextArea } = Input;
  useEffect(async () => {
    setLoader(true);
    let data = await postApi("/api/admin/getCustomerPortalDetails", {}, app);
    setLoader(false);
    if (data.data.message == "success") {
      setSelectedOption(data.data.data.cancellation);
      setoptions(data.data.data.options);
      form.setFieldsValue(data.data.data.values);
    } else if (data.data.message == "noData") {
    } else {
      toast.error(data.data.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const onFinish = async (values) => {
    setLoader(true);
    let data = await postApi(
      "/api/admin/saveCustomerPortalDetails",
      { values: values, selectedOption, options },
      app
    );
    setLoader(false);
    if (data.data.message == "success") {
      toast.success(data.data.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error(data.data.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleOptions = (e, name) => {
    let arr = { ...options };
    if (name == "one") {
      arr.one = e.target.value;
    } else if (name == "two") {
      arr.two = e.target.value;
    } else if (name == "three") {
      arr.three = e.target.value;
    } else {
      arr.four = e.target.value;
    }
    setoptions(arr);
  };
  
  return (
    <Spin tip="Loading..." size="large" spinning={loader}>
        <CalculateBillingUsage setBillingPlan={setBillingPlan}/>
      <div className="revlytic customer-portal-settings">
        <h2>Customer Portal </h2>
        <div className="main-container-permissons-side">
          <Form
            form={form}
            onFinish={onFinish}
            className="portal-settings-form"
          >
            <div className="revlytic settings-main-container">
              <Collapse defaultActiveKey={["1"]}>
                <Panel
                  header={
                    <div className="rev-panel-header">
                      <ContactsOutlined />{" "}
                      <Tooltip title="This section will give you control over which features are available to your customers from within the customer portal.">
                        Customer Portal Permissions
                      </Tooltip>
                    </div>
                  }
                  key="1"
                >
                  {/* <div><label></label><Tooltip title=''><QuestionCircleOutlined/></Tooltip></div> */}

                  <div className="revlytic settings-container-1">
                    <div className="revlytic settings-fields">
                      <div className="revlytic label-tooltip-main">
                        <label>Order Now</label>
                        <Tooltip title="Allow customers to place a recurring subscription order immediately.">
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>
                      <div className="revlytic cancel-reason-container">
                        {/* <p onClick={()=>setOpen(true)}><EditOutlined />Edit Options</p> */}
                        <Tooltip
                          color="#ffffff"
                          title={
                            billingPlan != "starter" &&
                            billingPlan != "premium" &&
                            billingPlan != "premiere" ? (
                              <Link to={`/billing?option=earlyAttempt`}>
                                Upgrade your Plan
                              </Link>
                            ) : (
                              ""
                            )
                          }
                        >
                          <Form.Item
                            valuePropName="checked"
                            name="attemptBilling"
                            initialValue={false}
                          >
                            <Switch
                              disabled={
                                billingPlan != "starter" &&
                                billingPlan != "premium" &&
                                billingPlan != "premiere"
                              }
                            />
                          </Form.Item>
                        </Tooltip>
                      </div>
                    </div>
                    {/* <div className="revlytic settings-fields">
                <p>
                  {" "}
                  Order Now 
                  <Form.Item
                  label=" "
                  tooltip="Allow customers to place a recurring subscription order immediately."
                  valuePropName="checked"
                  name="attemptBilling"
                  initialValue={false}
                >
                  </Form.Item>

                </p> 
                
                <Form.Item
                  valuePropName="checked"
                  name="attemptBilling"
                  initialValue={false}
                  

                  
                >
                  <Switch />
                </Form.Item>{" "}
              </div> */}

                    <div className="revlytic settings-fields">
                      <div className="revlytic label-tooltip-main">
                        <label>Skip Order</label>
                        <Tooltip title="Allows the customer to skip an upcoming order.">
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>
                      <Tooltip
                        color="#ffffff"
                        title={
                          billingPlan != "starter" &&
                          billingPlan != "premium" &&
                          billingPlan != "premiere" ? (
                            <Link to={`/billing?option=skipOrders`}>
                              Upgrade your Plan
                            </Link>
                          ) : (
                            ""
                          )
                        }
                      >
                        <Form.Item
                          // label=" "
                          valuePropName="checked"
                          name="skipOrder"
                          initialValue={false}
                          // noStyle
                        >
                          <Switch
                            disabled={
                              billingPlan != "starter" &&
                              billingPlan != "premium" &&
                              billingPlan != "premiere"
                            }
                          />
                        </Form.Item>{" "}
                      </Tooltip>
                    </div>

                    <div className="revlytic settings-fields">
                      <div className="revlytic label-tooltip-main">
                        <label>Postpone Scheduled Fulfillments</label>
                        <Tooltip title="Allows the customer to postpone a scheduled fulfillment.">
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>
                      <Tooltip
                        color="#ffffff"
                        title={
                          billingPlan != "starter" &&
                          billingPlan != "premium" &&
                          billingPlan != "premiere" ? (
                            <Link to={`/billing?option=rescheduleDelivery`}>
                              Upgrade your Plan
                            </Link>
                          ) : (
                            ""
                          )
                        }
                      >
                        {" "}
                        <Form.Item
                          // label=" "

                          valuePropName="checked"
                          name="skipUpcomingFullfilment"
                          initialValue={false}
                          // noStyle
                        >
                          <Switch
                            disabled={
                              billingPlan != "starter" &&
                              billingPlan != "premium" &&
                              billingPlan != "premiere"
                            }
                          />
                        </Form.Item>
                      </Tooltip>
                    </div>
                    <div className="revlytic settings-fields">
                      <div className="revlytic label-tooltip-main">
                        <label>Pause and Resume</label>
                        <Tooltip title="Customers can pause and resume existing subscriptions.">
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>
                      <Form.Item
                        // label=" "
                        valuePropName="checked"
                        name="pauseResumeSubscription"
                        initialValue={false}
                        // noStyle
                      >
                        <Switch />
                      </Form.Item>{" "}
                    </div>
                    <div className="revlytic settings-fields">
                      <div className="revlytic label-tooltip-main">
                        <label>Adjust Next Order Date</label>
                        <Tooltip title="Allows customers to change the next order date.">
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>
                      <Form.Item
                        // label=" "
                        valuePropName="checked"
                        name="nextBilldate"
                        initialValue={false}
                        // noStyle
                      >
                        <Switch />
                      </Form.Item>{" "}
                    </div>
                    <div className="revlytic settings-fields">
                      <div className="revlytic label-tooltip-main">
                        <label>Change Shipping Address</label>
                        <Tooltip title="Allow customers to change their shipping address.">
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>

                      <Form.Item
                        // label=" "
                        valuePropName="checked"
                        name="changeShippingAddress"
                        initialValue={false}
                        // noStyle
                      >
                        <Switch />
                      </Form.Item>
                    </div>
                  </div>
                </Panel>
                <Panel
                  header={
                    <div className="rev-panel-header">
                      {" "}
                      <CalendarOutlined /> Customer Portal Product Permissions
                    </div>
                  }
                  key="2"
                >
                  <div className="revlytic settings-container-1">
                    <div className="revlytic settings-fields">
                      <div className="revlytic label-tooltip-main">
                        <label>Edit Product Quantities</label>
                        <Tooltip title="Allows customers to edit their product quantities on their subscriptions.">
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>
                      <Form.Item
                        // label=" "
                        valuePropName="checked"
                        name="changeProductQuantity"
                        initialValue={false}
                      >
                        <Switch />
                      </Form.Item>{" "}
                    </div>
                    <div className="revlytic settings-fields">
                      <div className="revlytic label-tooltip-main">
                        <label>Add New Products to Existing Subscription</label>
                      </div>
                      {/* <label> Add New Products to Existing Subscription</label> */}
                      <Tooltip
                        color="#ffffff"
                        title={
                          billingPlan != "premium" &&
                          billingPlan != "premiere" ? (
                            <Link to={`/billing?option=editProducts`}>
                              Upgrade your Plan
                            </Link>
                          ) : (
                            ""
                          )
                        }
                      >
                        <Form.Item
                          label=" "
                          valuePropName="checked"
                          name="addNewContractProduct"
                          initialValue={false}
                          noStyle
                        >
                          <Switch
                            disabled={
                              billingPlan != "premium" &&
                              billingPlan != "premiere"
                            }
                          />
                        </Form.Item>{" "}
                      </Tooltip>
                    </div>
                    <div className="revlytic settings-fields">
                      <div className="revlytic label-tooltip-main">
                        <label>Remove Existing Products</label>
                        <Tooltip title="Customers can remove existing products.">
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>
                      <Form.Item
                        label=" "
                        valuePropName="checked"
                        name="deleteSubscriptionProduct"
                        initialValue={false}
                        noStyle
                      >
                        <Switch />
                      </Form.Item>{" "}
                    </div>
                  </div>
                </Panel>

                <Panel
                  header={
                    <div className="rev-panel-header">
                      <UserSwitchOutlined /> Subscription Cancellation &
                      Retention
                    </div>
                  }
                  key="3"
                >
                  <div className="revlytic settings-container-1">
                    <div className="revlytic settings-fields">
                      <div className="revlytic label-tooltip-main">
                        <label>Enable Cancel Subscription</label>
                        <Tooltip
                          title={
                            <p>
                              The customer will be allowed to cancel their
                              subscription.
                            </p>
                          }
                        >
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>

                      <div className="revlytic cancel-reason-container">
                        <p onClick={() => setOpen(true)}>
                          <EditOutlined />
                          Edit Options
                        </p>
                        <Form.Item
                          // label=" "
                          valuePropName="checked"
                          name="cancelSubscription"
                          initialValue={false}
                          // noStyle
                        >
                          <Switch />
                        </Form.Item>{" "}
                      </div>
                    </div>

                    <div className="revlytic settings-fields">
                      <div className="revlytic label-tooltip-main">
                        <label>
                          Enable Pause Option Before Cancellation (Coming Soon)
                        </label>
                        <Tooltip
                          title="This feature will prompt the customer with three pause options (different durations) when they attempt to cancel. This feature can help with better retention rates with your customers. Please click on “Edit Pause Retention Duration” to input the options you’d like the customer to consider."
                          valuePropName="checked"
                        >
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>
                      <Form.Item
                        valuePropName="checked"
                        name="pauseBeforeCancellation"
                        initialValue={false}
                      >
                        <Switch disabled />
                      </Form.Item>{" "}
                    </div>
                  </div>
                </Panel>
              </Collapse>
            </div>

            <Form.Item>
              <div className="customer-portal-button">
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </div>
            </Form.Item>
          </Form>
          <div className="rev-portalMain-side">
            <div className="rev-prtal-side-data">
              <Card>
                <h1 className="rev-frequent-card-heading">
                  Frequently Asked Questions
                </h1>
                <h1 className="rev-frequent-card">
                  How do I customize the Cancellation Prompt my customers see if
                  they cancel their subscription?
                </h1>

                <p>
                  Under “Enable Cancel Subscription”, click on Edit Options” and
                  then select “Advanced”. Here you can add four different
                  options that the customer sees when attempting to cancel their
                  subscription.
                </p>
                {/* dgdfgdfg */}

                <h1 className="rev-frequent-card">
                  Will there be more features available in the future?
                </h1>
                <p>
                  Yes, we are always working on adding new features to Revlytic.
                  We also source new features based on customer requests, so if
                  you have any requests of something you would like to see in
                  the application, please feel free to let us know!
                </p>

                {/*  */}
                <h1 className="rev-frequent-card">
                  Can I allow a customer to remove a product from their existing
                  subscription through the Customer Portal?
                </h1>
                <p>
                  Yes, simply enable the “Remove Existing Products” feature, and
                  your customers will be able to remove existing products.
                  Additionally, you can enable the “Add New Products to Existing
                  Subscription” feature for them to add new products to their
                  existing plans!
                </p>
                {/*  */}
              </Card>
              {/* <Card><h1 className="rev-frequent-card">Will there be more features available in the future?
</h1>
<p>Yes, we are always working on adding new features to Revlytic. We also source new features based on customer requests, so if you have any requests of something you would like to see in the application, please feel free to let us know!
</p></Card>

<Card><h1 className="rev-frequent-card">Can I allow a customer to remove a product from their existing subscription through the Customer Portal?
</h1>
<p>Yes, simply enable the “Remove Existing Product” feature, and your customers will be able to remove existing products. Additionally, you can enable the “Add New Products to Existing Subscription” feature for them to add new products to their existing plans!
</p></Card> */}
            </div>
          </div>
        </div>
      </div>
      <Modal
        className="customer-portal-modal-setting"
        open={open}
        // title=""
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>,
        ]}
        // closeIcon={false}
      >
        <div className="portal-main-heading">
          <h1>Prompt for Subscription Cancellation</h1>
          {/* <CloseOutlined onClick={()=>setOpen(false)}/> */}
        </div>

        <div className="customer-portal-modal-inner">
          {/* <h2>Prompt for Subscription Cancellation</h2> */}
          <div className="customer-portal-preview-setting">
            <div className="portal-radio-buttons">
              <label>
                <input
                  type="radio"
                  value="simple"
                  checked={selectedOption === "simple"}
                  onChange={handleOptionChange}
                />
                Simple
              </label>
            </div>

            <div className="preview-content-container">
              <div
                className={`preview-content ${
                  selectedOption === "simple" ? "active" : ""
                }`}
              >
                {selectedOption == "simple" && (
                  <div className="portal-setting-inner-preview-items">
                    <h3>Preview</h3>
                    {/* <p>Reason For Cancellation</p> */}
                    <TextArea
                      placeholder="Could you please tell us why?"
                      disabled
                    ></TextArea>
                  </div>
                )}
              </div>
            </div>
            <div className="portal-radio-buttons">
              <label>
                <input
                  type="radio"
                  value="advance"
                  checked={selectedOption === "advance"}
                  onChange={handleOptionChange}
                />
                Advanced
              </label>
            </div>

            <div className="preview-content-container">
              <div
                className={`preview-content ${
                  selectedOption === "advance" ? "active" : ""
                }`}
              >
                {selectedOption == "advance" && (
                  <div className="preview-advance-inner-content">
                    <div className="preview-advance-fields">
                      <div className="preview-advance-inner-inputs">
                        <label>Option 1</label>
                        <input
                          type="text"
                          value={options?.one}
                          onChange={(e) => handleOptions(e, "one")}
                        />
                      </div>
                      <div className="preview-advance-inner-inputs">
                        <label>Option 2</label>
                        <input
                          type="text"
                          value={options?.two}
                          onChange={(e) => handleOptions(e, "two")}
                        />
                      </div>
                    </div>
                    <div className="preview-advance-fields">
                      <div className="preview-advance-inner-inputs">
                        <label>Option 3</label>
                        <input
                          type="text"
                          value={options?.three}
                          onChange={(e) => handleOptions(e, "three")}
                        />
                      </div>
                      <div className="preview-advance-inner-inputs">
                        <label>Option 4</label>
                        <input
                          type="text"
                          value={options?.four}
                          onChange={(e) => handleOptions(e, "four")}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Spin>
  );
}

export default customerPortalSettings;
