import React, { useEffect, useState, useRef } from "react";

import {
  Card,
  Button,
  Form,
  Checkbox,
  Input,
  Modal,
  Spin,
  Select,
  Radio,
  Tooltip,
} from "antd";

import postApi from "../components/common/postApi";

import { useAppBridge } from "@shopify/app-bridge-react";

import { useForm } from "antd/lib/form/Form";

import { toast } from "react-toastify";

import { useAPI } from "../components/common/commonContext";

import dayjs from "dayjs";
import { Link } from "react-router-dom";
import CalculateBillingUsage from "../components/calculateBillingUsage";
function WidgetSettings() {
  const [form] = useForm();
  const defaultSettings = {
    purchaseOptionsText: "Purchase Options",

    oneTimePurchaseText: "One-Time Purchase",

    subscriptionOptionsText: "Subscribe & Save",

    deliveryFrequencyText: "Delivery Frequency",
    billingFrequencyText: "Billing Frequency",
    deliveryFrequencyOptionsText: "Delivery Frequency",

    // choosePlanText: "Choose Plan",
    showPredefinedDeliveryFrequencies: false,
    everyText: "Every",
    prepaidText: "Prepaid",

    payAsYouGoText: "Pay As You Go",

    subscriptionDetailsText: "Subscription Details",

    additionalSubscriptionDetails:
      "Subscribe with Revlytic. Choose an option that best meets your needs. Set up regularly scheduled deliveries that are automatically sent to you. Manage your subscription anytime.",

    monthFrequencyText: "Month(s)",

    yearFrequencyText: "Year(s)",

    dayFrequencyText: "Day(s)",

    weekFrequencyText: "Week(s)",
    saveText: "Save",
    prepayText: "Prepay",
    onFirstText: " on first",
    orderText: "order(s)",
    thenText: "then",
    borderStyle: "solid",

    purchaseOptionsTextColor: "#000000",

    headingTextColor: "#000000",

    additionalSubscriptionDetailsTextColor: "#767676",

    borderColor: "#000000",

    radioButtonColor: "#007F00",

    widgetBackgroundColor: "#FFFFFF",

    priceColor: "#5F5F5F",
  };
  const { currency } = useAPI();
  const [billingPlan, setBillingPlan] = useState("");
  const [loader, setLoader] = useState(false);
  const app = useAppBridge();

  const [formValues, setFormValues] = useState(defaultSettings);

  const getCurrencySymbol = (currency) => {
    const symbol = new Intl.NumberFormat("en", { style: "currency", currency })
      .formatToParts()
      .find((x) => x.type === "currency");
    return symbol && symbol.value;
  };

  useEffect(async () => {
    setLoader(true);
    let response = await postApi("/api/admin/getWidgetSettings", {}, app);

    if (response?.data?.message == "success") {
      setFormValues(response?.data?.data?.widgetSettings);
      form.setFieldsValue(response?.data?.data?.widgetSettings);
    } else {
    }
    setLoader(false);
  }, []);

  const inputRefs = {
    purchaseOptionsTextColor: useRef(null),
    headingTextColor: useRef(null),
    borderColor: useRef(null),
    priceColor: useRef(null),
    radioButtonColor: useRef(null),
    widgetBackgroundColor: useRef(null),
    additionalSubscriptionDetailsTextColor: useRef(null),
    // Add refs for other color inputs here
  };

  useEffect(() => {
    const handleInputClick = (fieldName) => {
      inputRefs[fieldName]?.current
        .querySelector("input[type='color']")
        ?.click();
    };

    const addClickListeners = () => {
      for (const fieldName in inputRefs) {
        if (inputRefs[fieldName]?.current) {
          inputRefs[fieldName]?.current.addEventListener("click", () =>
            handleInputClick(fieldName)
          );
        }
      }
    };

    const removeClickListeners = () => {
      for (const fieldName in inputRefs) {
        if (inputRefs[fieldName]?.current) {
          inputRefs[fieldName]?.current.removeEventListener("click", () =>
            handleInputClick(fieldName)
          );
        }
      }
    };

    addClickListeners();

    return () => {
      removeClickListeners();
    };
  }, []);

  const handleInputChange = (fieldName, value) => {
    if (fieldName == "showPredefinedDeliveryFrequencies") {
      if (value == true) {
        setFormValues((prevValues) => ({
          ...prevValues,
          [fieldName]: value,
          deliveryFrequencyOptionsText: "Delivery Every",
        }));

        form.setFieldsValue({
          deliveryFrequencyOptionsText: "Delivery Every",
        });
      } else {
        setFormValues((prevValues) => ({
          ...prevValues,
          [fieldName]: value,
          deliveryFrequencyOptionsText: "Delivery Frequency",
        }));

        form.setFieldsValue({
          deliveryFrequencyOptionsText: "Delivery Frequency",
        });
      }
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [fieldName]: value,
      }));
    }
  };

  const onFinish = async (values) => {
    setLoader(true);
    let response = await postApi(
      "/api/admin/widgetSettings",
      { ...values },
      app
    );

    if (response?.data?.message == "success") {
      toast.success("Data saved successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setLoader(false);
  };

  const handleResetDefault = () => {
    console.log("inreseting");
    setLoader(true);
    setFormValues(defaultSettings);
    form.setFieldsValue(defaultSettings);
    setLoader(false);
  };

  return (
    <Spin spinning={loader} size="large" tip="Loading...">
      <CalculateBillingUsage setBillingPlan={setBillingPlan} />
      <Form
        form={form}
        name="basic"
        layout="vertical"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="off"
        disabled={
          billingPlan != "starter" &&
          billingPlan != "premium" &&
          billingPlan != "premiere"
        }
      >
        <div className="revlytic widget-main-container">
          <div className="revlytic widget-card-heading revlytic_ugradeYour_plan1">
            <h3>Widget Settings</h3>
            {billingPlan != "starter" &&
            billingPlan != "premium" &&
            billingPlan != "premiere" ? (
              <div className="revlytic_ugradeYour_plan">
                <Link to="/billing?option=customiseWidget">
                  Upgrade Your Plan
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>
          <Tooltip
            color="#ffffff"
            title={
              billingPlan != "starter" &&
              billingPlan != "premium" &&
              billingPlan != "premiere" ? (
                <Link to={`/billing?option=customiseWidget`}>
                  Upgrade your Plan
                </Link>
              ) : (
                ""
              )
            }
          >
            <div className="revlytic widget-inner-container">
              <Card
                className={`revlytic widget-card-main ${
                  billingPlan != "starter" &&
                  billingPlan != "premium" &&
                  billingPlan != "premiere"
                    ? "billing-disable-card"
                    : ""
                }`}
              >
                <div className="revlytic widget-items">
                  <Form.Item
                    label="Purchase Options Text"
                    name="purchaseOptionsText"
                    initialValue={formValues?.purchaseOptionsText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject(
                              "Purchase Options Text is required!"
                            );
                          } else if (value.trim() === "") {
                            return Promise.reject(
                              "Purchase Options Text is required!"
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      // value={formValues?.purchaseOptionsText}
                      onChange={(e) =>
                        handleInputChange("purchaseOptionsText", e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="One-Time Purchase Text"
                    name="oneTimePurchaseText"
                    initialValue={formValues?.oneTimePurchaseText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject(
                              "One-Time Purchase Text is required!"
                            );
                          } else if (value.trim() === "") {
                            return Promise.reject(
                              "One-Time Purchase Text is required!"
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange("oneTimePurchaseText", e.target.value)
                      }
                    />
                  </Form.Item>
                </div>
                <div className="revlytic widget-items">
                  <Form.Item
                    label="Subscription Options Text"
                    name="subscriptionOptionsText"
                    initialValue={formValues?.subscriptionOptionsText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject(
                              "Subscription Options Text is required!"
                            );
                          } else if (value.trim() === "") {
                            return Promise.reject(
                              "Subscription Options Text is required!"
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange(
                          "subscriptionOptionsText",
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Every Text"
                    name="everyText"
                    initialValue={formValues?.everyText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject("Every Text is required!");
                          } else if (value.trim() === "") {
                            return Promise.reject("Every Text is required!");
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      value={formValues?.everyText}
                      onChange={(e) =>
                        handleInputChange("everyText", e.target.value)
                      }
                    />
                  </Form.Item>
                </div>

                <div className="revlytic widget-items">
                  <Form.Item
                    label="Delivery Frequency Options Text"
                    name="deliveryFrequencyOptionsText"
                    initialValue={formValues?.deliveryFrequencyOptionsText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject(
                              "Delivery Frequency Options Text is required!"
                            );
                          } else if (value.trim() === "") {
                            return Promise.reject(
                              "Delivery Frequency Options Text is required!"
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange(
                          "deliveryFrequencyOptionsText",
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Show Predefined Delivery Frequencies"
                    name="showPredefinedDeliveryFrequencies"
                    initialValue={formValues?.showPredefinedDeliveryFrequencies}
                    valuePropName="checked"
                  >
                    <Checkbox
                      onChange={(e) =>
                        handleInputChange(
                          "showPredefinedDeliveryFrequencies",
                          e.target.checked
                        )
                      }
                    />
                  </Form.Item>
                </div>

                <div className="revlytic widget-items">
                  <Form.Item
                    label="Subscription Details Text"
                    name="subscriptionDetailsText"
                    initialValue={formValues?.subscriptionDetailsText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject(
                              "Subscription Details Text is required!"
                            );
                          } else if (value.trim() === "") {
                            return Promise.reject(
                              "Subscription Details Text is required!"
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange(
                          "subscriptionDetailsText",
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Additional Subscription Details"
                    name="additionalSubscriptionDetails"
                    initialValue={formValues?.additionalSubscriptionDetails}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject(
                              "Additional Subscription Details is required!"
                            );
                          } else if (value.trim() === "") {
                            return Promise.reject(
                              "Additional Subscription Details is required!"
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange(
                          "additionalSubscriptionDetails",
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>
                </div>

                <div className="revlytic widget-items">
                  <Form.Item
                    label="Month Frequency Text"
                    name="monthFrequencyText"
                    initialValue={formValues?.monthFrequencyText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject(
                              "Month Frequency Text is required!"
                            );
                          } else if (value.trim() === "") {
                            return Promise.reject(
                              "Month Frequency Text is required!"
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange("monthFrequencyText", e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Year Frequency Text"
                    name="yearFrequencyText"
                    initialValue={formValues?.yearFrequencyText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject(
                              "Year Frequency Text is required!"
                            );
                          } else if (value.trim() === "") {
                            return Promise.reject(
                              "Year Frequency Text is required!"
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange("yearFrequencyText", e.target.value)
                      }
                    />
                  </Form.Item>
                </div>

                <div className="revlytic widget-items">
                  <Form.Item
                    label="Day Frequency Text"
                    name="dayFrequencyText"
                    initialValue={formValues?.dayFrequencyText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject(
                              "Day Frequency Text is required!"
                            );
                          } else if (value.trim() === "") {
                            return Promise.reject(
                              "Day Frequency Text is required!"
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange("dayFrequencyText", e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Week Frequency Text"
                    name="weekFrequencyText"
                    initialValue={formValues?.weekFrequencyText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject(
                              "Week Frequency Text is required!"
                            );
                          } else if (value.trim() === "") {
                            return Promise.reject(
                              "Week Frequency Text is required!"
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange("weekFrequencyText", e.target.value)
                      }
                    />
                  </Form.Item>
                </div>

                <div className="revlytic widget-items">
                  <Form.Item
                    label="Billing Frequency Text"
                    name="billingFrequencyText"
                    initialValue={formValues?.billingFrequencyText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject(
                              "Billing Frequency Text is required!"
                            );
                          } else if (value.trim() === "") {
                            return Promise.reject(
                              "Billing Frequency Text is required!"
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange(
                          "billingFrequencyText",
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Delivery Frequency Text"
                    name="deliveryFrequencyText"
                    initialValue={formValues?.deliveryFrequencyText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject(
                              "Delivery Frequency Text is required!"
                            );
                          } else if (value.trim() === "") {
                            return Promise.reject(
                              "Delivery Frequency Text is required!"
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange(
                          "deliveryFrequencyText",
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>
                </div>

                <div className="revlytic widget-items">
                  <Form.Item
                    label="Prepay Text"
                    name="prepayText"
                    initialValue={formValues?.prepayText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject("Prepay Text is required!");
                          } else if (value.trim() === "") {
                            return Promise.reject("Prepay Text is required!");
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange("prepayText", e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Save Text"
                    name="saveText"
                    initialValue={formValues?.saveText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject("Save Text is required!");
                          } else if (value.trim() === "") {
                            return Promise.reject("Save Text is required!");
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange("saveText", e.target.value)
                      }
                    />
                  </Form.Item>
                </div>

                <div className="revlytic widget-items">
                  <Form.Item
                    label="On First Text"
                    name="onFirstText"
                    initialValue={formValues?.onFirstText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject("On First Text is required!");
                          } else if (value.trim() === "") {
                            return Promise.reject("On First Text is required!");
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange("onFirstText", e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Order(s) Text"
                    name="orderText"
                    initialValue={formValues?.orderText}
                    className="order-stext"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject("Order(s) Text is required!");
                          } else if (value.trim() === "") {
                            return Promise.reject("Order(s) Text is required!");
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange("orderText", e.target.value)
                      }
                    />
                  </Form.Item>
                </div>

                <div className="revlytic widget-items">
                  <Form.Item
                    label="Then Text"
                    name="thenText"
                    initialValue={formValues?.thenText}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject("Then Text is required!");
                          } else if (value.trim() === "") {
                            return Promise.reject("Then Text is required!");
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      onChange={(e) =>
                        handleInputChange("thenText", e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Border Style"
                    name="borderStyle"
                    initialValue={formValues?.borderStyle}
                  >
                    <Select
                      onChange={(e) => handleInputChange("borderStyle", e)}
                      options={[
                        { value: "solid", label: "solid" },

                        { value: "dotted", label: "dotted" },

                        { value: "dashed", label: "dashed" },

                        { value: "double", label: "double" },
                      ]}
                    ></Select>
                  </Form.Item>
                </div>

                <div className="revlytic widget-items">
                  <Form.Item
                    label="Purchase Options Text Color"
                    name="purchaseOptionsTextColor"
                    initialValue={formValues?.purchaseOptionsTextColor}
                  >
                    <div ref={inputRefs.purchaseOptionsTextColor}>
                      <Input
                        value={formValues?.purchaseOptionsTextColor}
                        type="color"
                        suffix={formValues?.purchaseOptionsTextColor}
                        onChange={(e) =>
                          handleInputChange(
                            "purchaseOptionsTextColor",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </Form.Item>

                  <Form.Item
                    label="Heading Text Color"
                    name="headingTextColor"
                    initialValue={formValues?.headingTextColor}
                  >
                    <div ref={inputRefs.headingTextColor}>
                      <Input
                        value={formValues?.headingTextColor}
                        type="color"
                        suffix={formValues?.headingTextColor}
                        onChange={(e) =>
                          handleInputChange("headingTextColor", e.target.value)
                        }
                      />
                    </div>
                  </Form.Item>
                </div>

                <div className="revlytic widget-items">
                  <Form.Item
                    label="Border Color"
                    name="borderColor"
                    initialValue={formValues?.borderColor}
                  >
                    <div ref={inputRefs.borderColor}>
                      <Input
                        value={formValues?.borderColor}
                        type="color"
                        suffix={formValues?.borderColor}
                        onChange={(e) =>
                          handleInputChange("borderColor", e.target.value)
                        }
                      />
                    </div>
                  </Form.Item>

                  <Form.Item
                    label="Price Color"
                    name="priceColor"
                    initialValue={formValues?.priceColor}
                  >
                    <div ref={inputRefs.priceColor}>
                      <Input
                        value={formValues?.priceColor}
                        type="color"
                        suffix={formValues?.priceColor}
                        onChange={(e) =>
                          handleInputChange("priceColor", e.target.value)
                        }
                      />
                    </div>
                  </Form.Item>
                </div>

                <div className="revlytic widget-items">
                  <Form.Item
                    label="Radio Button Color"
                    name="radioButtonColor"
                    initialValue={formValues?.radioButtonColor}
                  >
                    <div ref={inputRefs.radioButtonColor}>
                      <Input
                        value={formValues?.radioButtonColor}
                        type="color"
                        suffix={formValues?.radioButtonColor}
                        onChange={(e) =>
                          handleInputChange("radioButtonColor", e.target.value)
                        }
                      />
                    </div>
                  </Form.Item>

                  <Form.Item
                    label="Widget Background Color"
                    name="widgetBackgroundColor"
                    initialValue={formValues?.widgetBackgroundColor}
                  >
                    <div ref={inputRefs.widgetBackgroundColor}>
                      <Input
                        value={formValues?.widgetBackgroundColor}
                        type="color"
                        suffix={formValues?.widgetBackgroundColor}
                        onChange={(e) =>
                          handleInputChange(
                            "widgetBackgroundColor",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </Form.Item>
                </div>

                <div className="revlytic widget-items">
                  <Form.Item
                    label="Additional Subscription Details Text Color"
                    name="additionalSubscriptionDetailsTextColor"
                    initialValue={
                      formValues?.additionalSubscriptionDetailsTextColor
                    }
                  >
                    <div ref={inputRefs.additionalSubscriptionDetailsTextColor}>
                      <Input
                        value={
                          formValues?.additionalSubscriptionDetailsTextColor ??
                          defaultSettings?.additionalSubscriptionDetailsTextColor
                        }
                        type="color"
                        suffix={
                          formValues?.additionalSubscriptionDetailsTextColor ??
                          defaultSettings?.additionalSubscriptionDetailsTextColor
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "additionalSubscriptionDetailsTextColor",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </Form.Item>
                </div>
              </Card>

              <Card className="revlytic widget-card-second">
                <div className="revlytic widget-card-second-heading">
                  <h3>Widget Preview</h3>
                </div>

                <div className="widget-card-preview-text">
                  <p style={{ color: formValues?.purchaseOptionsTextColor }}>
                    {formValues?.purchaseOptionsText}
                  </p>
                </div>

                <div className="revlytic purchase-optn-main">
                  <div
                    className="purchase_option"
                    style={{
                      border:
                        "1px " +
                        formValues?.borderStyle +
                        " " +
                        formValues?.borderColor,
                      backgroundColor: formValues?.widgetBackgroundColor,
                    }}
                  >
                    <div>
                      <div
                        className="one-time-purchase"
                        id="revlytic_section_oneTimePurchase"
                      >
                        <div className="revlytic purchase-label-price">
                          <label
                            htmlFor="revlytic_oneTimePurchase"
                            style={{ color: formValues?.headingTextColor }}
                          >
                            <input
                              type="radio"
                              disabled
                              name="purchaseOption"
                              id="revlytic_oneTimePurchase"
                              value="oneTimePurchase"
                            />
                            {formValues?.oneTimePurchaseText}
                          </label>
                          <span style={{ color: formValues?.priceColor }}>
                            {currency && getCurrencySymbol(currency) + "100.00"}{" "}
                          </span>
                        </div>
                      </div>

                      <div className="subscribe-option">
                        <div className="revlytic purchase-label-price">
                          <label
                            htmlFor="revlytic_subscribeAndSave"
                            style={{ color: formValues?.headingTextColor }}
                          >
                            <input
                              type="radio"
                              name="purchaseOption"
                              id="revlytic_subscribeAndSave"
                              value="subscribeAndSave"
                              style={{
                                border:
                                  "4px solid" + formValues?.radioButtonColor,
                              }}
                              defaultChecked
                            />
                            {formValues?.subscriptionOptionsText}
                          </label>
                          <span style={{ color: formValues?.priceColor }}>
                            {currency && getCurrencySymbol(currency) + "90.00"}
                          </span>
                        </div>
                      </div>
                      <div className="revlytic delivery-frequency-main">
                        <p
                          className="revlytic preview-delivery-frequency"
                          style={{ color: formValues?.headingTextColor }}
                        >
                          {formValues?.deliveryFrequencyOptionsText}
                        </p>
                        <Select disabled value="1">
                          <Select.Option value="1"> 1 Month(s)</Select.Option>
                        </Select>

                        <div className="revlytic delivery-billing-section">
                          <p>
                            {" "}
                            <strong
                              style={{ color: formValues?.headingTextColor }}
                            >
                              {formValues.billingFrequencyText}
                            </strong>{" "}
                            <span id="revlytic-billing-frequency">
                              : {formValues.everyText} 1{" "}
                              {formValues.monthFrequencyText}
                            </span>{" "}
                          </p>

                          <p>
                            {" "}
                            <strong
                              style={{ color: formValues?.headingTextColor }}
                            >
                              {formValues.deliveryFrequencyText}
                            </strong>{" "}
                            <span id="revlytic-delivery-frequency">
                              : {formValues.everyText} 1{" "}
                              {formValues.monthFrequencyText}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="revlytic  widget-subscription-details-heading">
                    {" "}
                    {formValues.subscriptionDetailsText}{" "}
                  </div>
                  <div className="revlytic  widget-subscription-details">
                    <Card>
                      <span
                        style={{
                          color:
                            formValues?.additionalSubscriptionDetailsTextColor ??
                            defaultSettings?.additionalSubscriptionDetailsTextColor,
                        }}
                      >
                        {formValues.additionalSubscriptionDetails}
                      </span>
                    </Card>
                  </div>
                </div>
              </Card>
            </div>
          </Tooltip>
        </div>
        <div className="revlytic widget-save-button">
          <Tooltip
            color="#ffffff"
            title={
              billingPlan != "starter" &&
              billingPlan != "premium" &&
              billingPlan != "premiere" ? (
                <Link to={`/billing?option=customiseWidget`}>
                  Upgrade your Plan
                </Link>
              ) : (
                ""
              )
            }
          >
            <Button
              onClick={handleResetDefault}
              disabled={
                billingPlan != "starter" &&
                billingPlan != "premium" &&
                billingPlan != "premiere"
              }
            >
              Reset To Default
            </Button>
          </Tooltip>
          <Tooltip
            color="#ffffff"
            title={
              billingPlan != "starter" &&
              billingPlan != "premium" &&
              billingPlan != "premiere" ? (
                <Link to={`/billing?option=customiseWidget`}>
                  Upgrade your Plan
                </Link>
              ) : (
                ""
              )
            }
          >
            <Button
              htmlType="submit"
              disabled={
                billingPlan != "starter" &&
                billingPlan != "premium" &&
                billingPlan != "premiere"
              }
            >
              Save
            </Button>
          </Tooltip>
        </div>
      </Form>
    </Spin>
  );
}

export default WidgetSettings;
