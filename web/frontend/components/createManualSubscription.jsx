import React, { useEffect, useState } from "react";
import postApi from "../components/common/postApi";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useForm } from "antd/lib/form/Form";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { debounce } from "lodash-es";
import copy from "clipboard-copy";
import SubscriptionProductsEdit from "./SubscriptionProductsEditMode";
import Orders from "./orders/ordersMain";
import Fulfillments from "./orders/fulfillments";
import {
  ArrowLeftOutlined,
  EditOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  UpOutlined,
} from "@ant-design/icons";
import {
  Card,
  Button,
  Dropdown,
  Row,
  Col,
  Checkbox,
  DatePicker,
  Form,
  Input,
  message,
  Space,
  Radio,
  Select,
  Alert,
  Spin,
  Switch,
  Divider,
  Modal,
  Tooltip,
} from "antd";

import SubscriptionProducts from "./SubscriptionProducts";
import { useAPI } from "../components/common/commonContext";
import { sendMailOnUpdate } from "./common/helpers";
import CalculateBillingUsage from "./calculateBillingUsage";
function CreateManualSubscription() {
  const { currency, storeDetails } = useAPI();
  const [form] = useForm();
  const [form2] = useForm();
  const navigate = useNavigate();
  const [billingPlan, setBillingPlan] = useState("");

  const location = useLocation();
  const queryParams = location.search;
  const params = new URLSearchParams(queryParams);
  const subscriptionId = params.get("id");
  const mode = params.get("mode");

  const [existingSubscription, setExistingSubscription] = useState({}); // for storing existing
  const [upcomingOrders, setUpcomingOrders] = useState([]);
  const [attemptedOrders, setAttemptedOrders] = useState([]);
  const [fullfillmentDataMain, setFullfillmentDataMain] = useState({});
  const [pastOrders, setPastOrders] = useState([]);
  const [skippedOrders, setSkippedOrders] = useState([]);

  const [checkedIds, setCheckedIds] = useState([]);
  const [advanceOptions, setAdvanceOptions] = useState(false);

  // const [showDate,setShowDate]=useState(true)
  const [products, setProducts] = useState([]);
  const [cursor, setCursor] = useState("");
  const app = useAppBridge();
  const [loader, setLoader] = useState(false);
  const [edit, setEdit] = useState({
    subscriptionDetails: false,
    productDetails: false,
    customerDetails: false,
    shippingDetails: false,
  });

  const [hasNext, setHasNext] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({});
  const [customerId, setCustomerId] = useState();
  const [provinceError, setProvinceError] = useState(false);

  const [customersList, setCustomersList] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [selectLoader, setSelectLoader] = useState(false);
  const [paymentLoader, setPaymentLoader] = useState(false);
  const [createCustomerModal, setCreateCustomerModal] = useState(false);

  const [countriesData, setCountriesData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [countriesName, setCountriesName] = useState([]);
  const [provincesName, setProvincesName] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [provinceCode, setProvinceCode] = useState("");

  // const [subscriptionType, setSubscriptionType] = useState("merchant");
  const [customerPaymentsData, setCustomerPaymentsData] = useState([]);
  const [copyLink, setCopyLink] = useState(false);
  const [copyText, setCopyText] = useState("");
  const [options, setOptions] = useState({});
  const [preview, setPreview] = useState(
    "This subscription is a Pay As You Go plan. The customer will receive a delivery and be billed every 1 month(s).  Additionally, this plan will renew automatically until canceled."
  );

  function dateConversion(date) {
    const dateString = date;

    const dateObj = new Date(dateString);

    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",

      month: "long",

      day: "numeric",
    });

    // //console.log(formattedDate);

    return formattedDate;
  }

  function compareDatesIgnoringTime(date1, date2) {
    // Create new Date objects with the same date but time set to 00:00:00
    const newDate1 = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const newDate2 = new Date(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );

    // Compare the new Date objects
    if (newDate1 < newDate2) {
      return -1;
    } else if (newDate1 > newDate2) {
      return 1;
    } else {
      return 0;
    }
  }

  const getCurrencySymbol = (currency) => {
    const symbol = new Intl.NumberFormat("en", { style: "currency", currency })
      .formatToParts()
      .find((x) => x.type === "currency");
    return symbol && symbol.value;
  };

  const setNextBillingDate = (date) => {
    //console.log("tringtring",form.getFieldValue("nextBillingDate"))

    form.setFieldsValue({ startDate: dayjs(date) });
  };

  //console.log("14septtt",form.getFieldValue("subscription"))

  const dateChange = (type, originalDate, value) => {
    //console.log("datechange",type,originalDate,)

    if (type.toLowerCase() === "day") {
      let nextDate = new Date(originalDate);
      nextDate.setDate(nextDate.getDate() + 1 * parseInt(value));

      return nextDate;
    } else if (type.toLowerCase() === "month") {
      let nextDate = new Date(originalDate);
      nextDate.setMonth(nextDate.getMonth() + 1 * parseInt(value));
      //console.log("typedtaechekcc",typeof nextDate)
      return nextDate;
    } else if (type.toLowerCase() === "week") {
      let nextDate = new Date(originalDate);
      nextDate.setDate(nextDate.getDate() + 7 * parseInt(value));
      return nextDate;
    } else if (type.toLowerCase() === "year") {
      let nextDate = new Date(originalDate);
      nextDate.setFullYear(nextDate.getFullYear() + 1 * parseInt(value));
      return nextDate;
    }
  };

  function formatVariableName(variableName) {
    // Split the variable name by underscores
    const parts = variableName.split("_");

    // Capitalize the first letter of each part after the first one
    const formattedParts = parts.map((part, index) => {
      if (index === 0) {
        return part; // Keep the first part as is
      } else {
        return part.charAt(0).toUpperCase() + part.slice(1);
      }
    });

    // Join the formatted parts with spaces
    const formattedVariableName = formattedParts.join(" ");

    return formattedVariableName;
  }

  function formatFreeTrialCycle(input) {
    if (input?.toLowerCase() == "day") {
      return "Day(s)";
    } else if (input?.toLowerCase() == "week") {
      return "Week(s)";
    } else if (input?.toLowerCase() == "month") {
      return "Month(s)";
    } else if (input?.toLowerCase() == "year") {
      return "Year(s)";
    }
  }

  async function getPrepaidPastorders() {
    let ordersDataUpcoming = await postApi(
      "/api/admin/getOrdersDataUpcoming",
      { contract_id: `gid://shopify/SubscriptionContract/${subscriptionId}` },
      app
    );

    if (ordersDataUpcoming.data.message == "success") {
      let arr = [...ordersDataUpcoming?.data?.data];
      // setAttemptedOrders(arr);

      let filterPastOrders = arr.filter(
        (item) => item.status == "initial" || item.status == "success"
      );

      setPastOrders(filterPastOrders);
    }
  }
  async function fetchDataUpcomingOrders(data) {
    let ordersDataUpcoming = await postApi(
      "/api/admin/getOrdersDataUpcoming",
      { contract_id: data?.subscription_id },
      app
    );

    if (ordersDataUpcoming.data.message == "success") {
      let arr = [...ordersDataUpcoming?.data?.data];
      setAttemptedOrders(arr);

      let filterPastOrders = arr.filter(
        (item) => item.status == "initial" || item.status == "success"
      );
      //console.log("18sept",filterPastOrders)
      setPastOrders(filterPastOrders);

      let filterSkippedOrders = arr.filter((item) => item.status == "skipped");
      setSkippedOrders(filterSkippedOrders);

      let successCount = arr.filter(
        (item) => item.status == "initial" || item.status == "success"
      ).length;
      //console.log(successCount);
      // let today=2
      let newArr = arr.filter(
        (item) =>
          item.status != "success" &&
          item.status != "initial" &&
          item.status != "skipped" &&
          item.status != "retriedAfterFailure" &&
          new Date(item.renewal_date) > new Date()
      );
      // let nextbilling=data?.nextBillingDate;
      // let billingMaxValue=4;
      //console.log("in half",newArr)
      if (
        data?.subscription_details?.billingMaxValue &&
        data?.subscription_details?.billingMaxValue != undefined &&
        data?.subscription_details?.billingMaxValue != null
      ) {
        if (
          parseInt(data.subscription_details.billingMaxValue) <= successCount
        ) {
          //console.log("hi")
          setUpcomingOrders([]);
        } else {
          //console.log("west",newArr.length)
          let nextDate;
          let type = data?.subscription_details?.delivery_billingType;
          let value =
            data.subscription_details.planType == "payAsYouGo"
              ? data?.subscription_details?.billingLength
              : data?.subscription_details?.delivery_billingValue;

          let originalDate = data?.nextBillingDate;

          while (
            newArr.length <
            parseInt(data?.subscription_details?.billingMaxValue) - successCount
          ) {
            let existAlready = arr.find(
              (item) =>
                new Date(item.renewal_date).getTime() ===
                new Date(originalDate).getTime()
            );
            if (existAlready) {
            } else {
              newArr.push({ renewal_date: originalDate, status: "upcoming" });
            }
            let nextDate = dateChange(type, originalDate, value);
            originalDate = nextDate.toISOString();
          }

          newArr.sort(
            (a, b) => new Date(a.renewal_date) - new Date(b.renewal_date)
          );
        }

        setUpcomingOrders(newArr);
      } else {
        if (newArr.length >= 5) {
          //console.log("hello")
        } else {
          //console.log("south")
          let nextDate;
          let type = data?.subscription_details?.delivery_billingType;
          let value =
            data.subscription_details.planType == "payAsYouGo"
              ? data?.subscription_details?.billingLength
              : data?.subscription_details?.delivery_billingValue;
          // let originalDate = data2[0]?.renewal_date;
          let originalDate = data?.nextBillingDate;
          //    //console.log(originalDate,"before",merged)

          while (newArr.length < 5) {
            let existAlready = arr.find(
              (item) =>
                new Date(item.renewal_date).getTime() ===
                new Date(originalDate).getTime()
            );
            if (existAlready) {
            } else {
              newArr.push({ renewal_date: originalDate, status: "upcoming" });
            }
            let nextDate = dateChange(type, originalDate, value);
            originalDate = nextDate.toISOString();
          }

          newArr.sort(
            (a, b) => new Date(a.renewal_date) - new Date(b.renewal_date)
          );
        }
      }
      //console.log("end",newArr)
      setUpcomingOrders(newArr);
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  useEffect(async () => {
    getPrepaidPastorders();
    //console.log();
    //console.log("in useeffect", params.get("mode"));

    setLoader(true);

    if (subscriptionId && mode == "view") {
      //console.log("ahhhchakkkkk");
      //  setShowDate(true)
      let result = await postApi(
        "/api/admin/getSubscriptionDetails",
        { subscriptionId: subscriptionId },
        app
      );

      if (result?.data?.message == "success") {
        // setData(result?.data?.data);

        let data = result?.data?.data;
        //console.log("inifinityyyyy",data)
        setExistingSubscription(data);

        setProducts(data?.product_details);

        //console.log(data?.subscription_details?.planType);

        form.setFieldsValue({
          startDate: dayjs(data?.nextBillingDate),

          subscription: {
            planName: data?.subscription_details?.planName,

            planType: data?.subscription_details?.planType,

            billingLength: data?.subscription_details?.billingLength,

            delivery_billingType:
              data?.subscription_details?.delivery_billingType?.toUpperCase(),

            autoRenew: data?.subscription_details?.autoRenew,

            delivery_billingValue:
              data?.subscription_details?.delivery_billingValue,

            billingMinValue: data?.subscription_details?.billingMinValue,

            billingMaxValue: data?.subscription_details?.billingMaxValue,

            frequencyPlanName: data?.subscription_details?.frequencyPlanName,

            offerDiscount: data?.subscription_details?.offerDiscount,

            discount: {
              type: data?.subscription_details?.discount?.type,

              value: data?.subscription_details?.discount?.value,
            },

            freeTrial: data?.subscription_details?.freeTrial,
            freeTrialCycle: data?.subscription_details?.freeTrialCycle
              ? formatFreeTrialCycle(data?.subscription_details?.freeTrialCycle)
              : "",
          },

          customer:
            (data?.customer_details?.firstName != null
              ? data?.customer_details?.firstName
              : "") +
            " " +
            (data?.customer_details?.lastName != null
              ? data?.customer_details?.lastName
              : "") +
            "   " +
            (data?.customer_details?.email != null
              ? data?.customer_details?.email
              : ""),

          // {item?.node?.instrument?.brand
          //   .charAt(0)
          //   .toUpperCase() +
          //   item?.node?.instrument?.brand.slice(1)}{" "}
          // (**** **** **** {item?.node?.instrument?.lastDigits})

          paymentMethod:
            data?.payment_details?.payment_instrument_value?.__typename ==
              "CustomerCreditCard" ||
            data?.payment_details?.payment_instrument_value?.__typename ==
              "CustomerShopPayAgreement"
              ? (data?.payment_details?.payment_instrument_value?.brand
                  ? data?.payment_details?.payment_instrument_value?.brand
                      ?.charAt(0)
                      ?.toUpperCase()
                  : "") +
                (data?.payment_details?.payment_instrument_value?.brand
                  ? formatVariableName(
                      data?.payment_details?.payment_instrument_value?.brand?.slice(
                        1
                      )
                    )
                  : "") +
                " " +
                "(**** **** ****  " +
                (data?.payment_details?.payment_instrument_value?.lastDigits
                  ? data?.payment_details?.payment_instrument_value?.lastDigits
                  : "") +
                ")"
              : data?.payment_details?.payment_instrument_value?.__typename ==
                "CustomerPaypalBillingAgreement"
              ? data?.payment_details?.payment_instrument_value
                  ?.paypalAccountEmail
              : "",

          customer_details: {
            firstName: data?.customer_details?.firstName,

            lastName: data?.customer_details?.lastName,

            email: data?.customer_details?.email,

            phone: data?.customer_details?.phone,
          },

          address_details: {
            firstName: data?.shipping_address?.firstName,

            lastName: data?.shipping_address?.lastName,

            // email: data?.shipping_address?.email,

            phone: data?.shipping_address?.phone,

            address1: data?.shipping_address?.address1,

            address2: data?.shipping_address?.address2,

            city: data?.shipping_address?.city,

            zip: data?.shipping_address?.zip,

            company: data?.shipping_address?.company,

            country: data?.shipping_address?.country,

            province: data?.shipping_address?.province,

            deliveryPrice:
              data?.shipping_address?.deliveryPrice != null
                ? parseFloat(data?.shipping_address?.deliveryPrice)?.toFixed(2)
                : parseFloat(0)?.toFixed(2),

            // countryCode: getCountryData?.code,
          },
        });

        previewCommon(data);

        ///////////////////////orders related/////////////////////////
        if (data?.subscription_details.planType == "payAsYouGo") {
          fetchDataUpcomingOrders(data);
        } else {
          let fulfillmentdData = await postApi(
            "/api/admin/upcomingFulfillment",
            { id: data?.subscription_id },
            app
          );

          if (fulfillmentdData?.data?.message == "success") {
            setFullfillmentDataMain(fulfillmentdData?.data?.data);
          }
        }

        ////////////////////////////////////////// /////////////////
      } else {
        toast.error(result?.data?.data, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else if (subscriptionId && mode == "edit") {
      //  setShowDate(true)
      //console.log("")
      let result = await postApi(
        "/api/admin/getSubscriptionDetails",

        { subscriptionId: subscriptionId },

        app
      );

      if (result?.data?.message == "success") {
        // setData(result?.data?.data);

        let info = await getCountries();

        //console.log("firstsatrday", info);

        let data = result?.data?.data;

        setExistingSubscription(data);

        setProducts(data?.product_details);

        //console.log("firsts", data?.shipping_address);

        form.setFieldsValue({
          startDate: dayjs(data?.nextBillingDate),

          subscription: {
            planName: data?.subscription_details?.planName,

            planType: data?.subscription_details?.planType,

            billingLength: data?.subscription_details?.billingLength,

            delivery_billingType:
              data?.subscription_details?.delivery_billingType?.toUpperCase(),

            autoRenew: data?.subscription_details?.autoRenew,

            delivery_billingValue:
              data?.subscription_details?.delivery_billingValue,

            billingMinValue: data?.subscription_details?.billingMinValue,

            billingMaxValue: data?.subscription_details?.billingMaxValue,

            frequencyPlanName: data?.subscription_details?.frequencyPlanName,

            offerDiscount: data?.subscription_details?.offerDiscount,

            discount: {
              type: data?.subscription_details?.discount?.type,

              value: data?.subscription_details?.discount?.value,
            },
            freeTrial: data?.subscription_details?.freeTrial,
            freeTrialCycle: data?.subscription_details?.freeTrialCycle
              ? formatFreeTrialCycle(data?.subscription_details?.freeTrialCycle)
              : "",
          },

          customer:
            (data?.customer_details?.firstName != null
              ? data?.customer_details?.firstName
              : "") +
            " " +
            (data?.customer_details?.lastName != null
              ? data?.customer_details?.lastName
              : "") +
            "   " +
            (data?.customer_details?.email != null
              ? data?.customer_details?.email
              : ""),

          paymentMethod:
            data?.payment_details?.payment_instrument_value?.__typename ==
              "CustomerCreditCard" ||
            data?.payment_details?.payment_instrument_value?.__typename ==
              "CustomerShopPayAgreement"
              ? (data?.payment_details?.payment_instrument_value?.brand
                  ? data?.payment_details?.payment_instrument_value?.brand
                      ?.charAt(0)
                      ?.toUpperCase()
                  : "") +
                (data?.payment_details?.payment_instrument_value?.brand
                  ? formatVariableName(
                      data?.payment_details?.payment_instrument_value?.brand?.slice(
                        1
                      )
                    )
                  : "") +
                " " +
                "(**** **** ****  " +
                (data?.payment_details?.payment_instrument_value?.lastDigits
                  ? data?.payment_details?.payment_instrument_value?.lastDigits
                  : "") +
                ")"
              : data?.payment_details?.payment_instrument_value?.__typename ==
                "CustomerPaypalBillingAgreement"
              ? data?.payment_details?.payment_instrument_value
                  ?.paypalAccountEmail
              : "",

          customer_details: {
            firstName: data?.customer_details?.firstName,

            lastName: data?.customer_details?.lastName,

            email: data?.customer_details?.email,

            phone: data?.customer_details?.phone,
          },

          address_details: {
            firstName: data?.shipping_address?.firstName
              ? data?.shipping_address?.firstName
              : "",

            lastName: data?.shipping_address?.lastName,

            // email: data?.shipping_address?.email,

            phone: data?.shipping_address?.phone,

            address1: data?.shipping_address?.address1,

            address2: data?.shipping_address?.address2,

            city: data?.shipping_address?.city,

            zip: data?.shipping_address?.zip,

            company: data?.shipping_address?.company,

            country: data?.shipping_address?.country,

            province: data?.shipping_address?.province,

            deliveryPrice:
              data?.shipping_address?.deliveryPrice != null
                ? parseFloat(data?.shipping_address?.deliveryPrice)?.toFixed(2)
                : parseFloat(0)?.toFixed(2),

            // countryCode: getCountryData?.code,
          },
        });

        setCountryCode(data?.shipping_address?.countryCode);

        setProvinceCode(data?.shipping_address?.provinceCode);

        ////////

        let selectedCountryData = info?.find(
          (item) => item.name == data?.shipping_address?.country
        );

        setSelectedCountry(selectedCountryData);

        if (selectedCountryData && selectedCountryData?.provinces?.length > 0) {
          //console.log("jalndharrrrrr");

          let provincesNameArray = [];

          selectedCountryData?.provinces.forEach((element) => {
            provincesNameArray.push({
              label: element?.name,

              value: element?.name,
            });
          });

          //console.log("mohaliiiiiii", provincesNameArray);

          setProvincesName(provincesNameArray);
        }

        previewCommon(data);

        ///////////////////////orders related/////////////////////////
        if (data?.subscription_details.planType == "payAsYouGo") {
          //console.log("end-to-end")
          fetchDataUpcomingOrders(data);
        } else {
          let fulfillmentdData = await postApi(
            "/api/admin/upcomingFulfillment",
            { id: data?.subscription_id },
            app
          );

          if (fulfillmentdData?.data?.message == "success") {
            // //console.log("sept11",upcomingFulfillmentdData?.data?.data)
            setFullfillmentDataMain(fulfillmentdData?.data?.data);
          }
        }

        ////////////////////////////////////////// /////////////////
      } else {
        toast.error(result?.data?.data, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      //console.log("ineffecttttt");

      form.resetFields();

      setCheckedIds([]);

      setCustomerId();

      getCustomers();

      await getCountries();

      setExistingSubscription({});

      setProducts([]);

      setCountryCode("");

      setProvinceCode("");

      setEdit({
        subscriptionDetails: false,

        productDetails: false,

        customerDetails: false,

        shippingDetails: false,
      });

      setProvincesName([]);

      setCustomerDetails({});

      setProvinceError(false);
      setAttemptedOrders([]);
      setUpcomingOrders([]);
      setFullfillmentDataMain({});
    }

    setLoader(false);
  }, [params.get("mode")]);

  async function getCountries() {
    let response = await postApi("api/admin/getCountries", {}, app);
    if (response?.data?.message == "success") {
      setCountriesData(response?.data?.data?.data);

      let countriesNameArray = [];

      response?.data?.data?.data.forEach((element) => {
        countriesNameArray.push({ label: element?.name, value: element?.name });
      });

      setCountriesName(countriesNameArray);
      return response?.data?.data?.data;
    } else {
      //console.log("20jun");
      toast.error(response?.data?.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  function previewCommon(data) {
    let data1;
    let data2;
    // This subscription is a Pay As You Go plan. The customer will receive a delivery and be billed every  1 month(s).  Additionally, this plan will renew automatically until canceled.
    if (data?.subscription_details?.planType == "payAsYouGo") {
      data1 =
        `This subscription is a Pay As You Go plan. The customer will receive a delivery and be billed every ` +
        `${
          data?.subscription_details?.billingLength
        }  ${data?.subscription_details?.delivery_billingType?.toLowerCase()}(s).`;
    } else {
      data1 =
        `This subscription is a Prepaid plan. The length of the subscription is ` +
        `${
          data?.subscription_details?.billingLength
        }  ${data?.subscription_details?.delivery_billingType?.toLowerCase()}(s) and the customer will be billed upfront.` +
        ` The customer will receive a delivery every ${
          data?.subscription_details?.delivery_billingValue
        } ${data?.subscription_details?.delivery_billingType?.toLowerCase()}(s).`;
    }

    if (data?.subscription_details?.autoRenew == false) {
      data2 = ` Additionally, this plan will not renew automatically.`;
    } else {
      data2 = ` Additionally, this plan will renew automatically until canceled.`;
    }

    setPreview(data1 + data2);
  }

  function handleFormChange(changedData, b) {
    //console.log("inchanges", changedData);
    if (changedData?.subscription?.planType == "prepaid") {
      //console.log("prepaid");
      form.setFieldsValue({
        subscription: {
          billingLength: 2,
          delivery_billingValue: 1,
        },
      });
    }

    if (changedData?.subscription?.planType == "payAsYouGo") {
      //console.log("payAsYouGo");
      form.setFieldsValue({
        subscription: {
          billingLength: "1",
        },
      });

      form.setFieldsValue({
        subscription: {
          autoRenew: true,
        },
      });
    }
    if (changedData?.address_details?.country) {
      //console.log("virender");
      let getCountryData = countriesData?.find(
        (item) => changedData?.address_details?.country == item?.name
      );
      //console.log("getCountryData", getCountryData);
      setSelectedCountry(getCountryData);

      if (getCountryData && getCountryData.provinces.length > 0) {
        form.setFieldsValue({
          address_details: {
            province: undefined,
            // provinceCode: undefined,
            // countryCode: getCountryData?.code,
          },
        });

        setCountryCode(getCountryData?.code);
        setProvinceCode("");

        let provincesNameArray = [];

        getCountryData?.provinces.length > 0 &&
          getCountryData?.provinces.forEach((element) => {
            provincesNameArray.push({
              label: element?.name,
              value: element?.name,
            });
          });

        //console.log("errorfind", provincesNameArray);
        setProvincesName(provincesNameArray);
      } else {
        //console.log("firstinelsyyyy");
        form.setFieldsValue({
          address_details: {
            province: undefined,
            // provinceCode: undefined,
            // countryCode: getCountryData?.code,
          },
        });
        setCountryCode(getCountryData?.code);
        setProvinceCode("");
        setProvincesName([]);
      }
    }

    if (changedData?.address_details?.province) {
      let selectedProvince = selectedCountry?.provinces?.find(
        (item) => changedData?.address_details?.province == item?.name
      );

      if (selectedProvince) {
        // form.setFieldsValue({
        //   address_details: {
        //     provinceCode: selectedProvince?.code,
        //   },
        // });
        setProvinceCode(selectedProvince?.code);
      } else {
        //console.log(" in else");
        // form.setFieldsValue({
        //   address_details: {
        //     provinceCode: undefined,
        //   },
        // });
        setProvinceCode("");
      }
    }

    let data;
    let data2;

    if (form.getFieldValue(["subscription", "planType"]) == "payAsYouGo") {
      data =
        `This subscription is a Pay As You Go plan. The customer will receive a delivery and be billed every ` +
        `${
          form.getFieldValue(["subscription", "billingLength"])
            ? form.getFieldValue(["subscription", "billingLength"])
            : "{Input for bill every}"
        }  ${form
          .getFieldValue(["subscription", "delivery_billingType"])
          ?.toLowerCase()}(s).`;
    } else {
      //console.log("sahil2");
      data =
        `This subscription is a Prepaid plan. The length of the subscription is ` +
        `${
          form.getFieldValue(["subscription", "billingLength"])
            ? form.getFieldValue(["subscription", "billingLength"])
            : "{Input for prepaid length}"
        }  ${form
          .getFieldValue(["subscription", "delivery_billingType"])
          ?.toLowerCase()}(s) and the customer will be billed upfront.` +
        ` The customer will receive a delivery every ${
          form.getFieldValue(["subscription", "delivery_billingValue"])
            ? form.getFieldValue(["subscription", "delivery_billingValue"])
            : form.getFieldValue(["subscription", "delivery_billingValue"]) ==
              undefined
            ? 1
            : form.getFieldValue(["subscription", "delivery_billingValue"]) ==
              ""
            ? "{Input for delivery every value}"
            : null
        } ${form
          .getFieldValue(["subscription", "delivery_billingType"])
          ?.toLowerCase()}(s).`;
    }

    if (form.getFieldValue(["subscription", "autoRenew"]) == false) {
      //console.log("sahl3");
      data2 = ` Additionally, this plan will not renew automatically.`;
    } else {
      //console.log("sahl4");
      data2 = ` Additionally, this plan will renew automatically until canceled.`;
    }

    setPreview(data + data2);
  }

  async function getCustomerPaymentMethods(id, country) {
    setLoader(true);
    setPaymentLoader(true);
    let result = await postApi(
      "/api/admin/getCustomerPaymentMethods",
      { id: id },
      app
    );
    setLoader(false);

    if (result?.data?.message == "success") {
      let finalData = result?.data?.data;
      //console.log(finalData[0].node.customer?.email);
      //console.log(result?.data?.data);

      setCustomerPaymentsData(result?.data?.data);
      //console.log("cusssssstttttt", result?.data?.data);
      if (result?.data?.data.length > 0) {
        // form.setFieldsValue({
        //   startDate: dayjs(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
        // });

        form.setFieldValue("paymentMethod", result?.data?.data[0]?.node?.id);
        let selectedCountryData = countriesData?.find(
          (item) => item.name?.toLowerCase() == country?.toLowerCase()
        );

        setSelectedCountry(selectedCountryData);

        {
          mode != "edit" && setCountryCode(selectedCountryData.code);
        }

        if (selectedCountryData && selectedCountryData?.provinces?.length > 0) {
          //console.log("jalndharrrrrr");
          let provincesNameArray = [];

          selectedCountryData?.provinces.forEach((element) => {
            provincesNameArray.push({
              label: element?.name,
              value: element?.name,
            });
          });
          //console.log("mohaliiiiiii", provincesNameArray);
          setProvincesName(provincesNameArray);
        } else {
          //console.log("ludhiaanaaaaaa");
          // form.setFieldValue(["address_details", "provinceCode"], undefined);
          setProvinceCode("");
          setProvincesName([]);
        }

        // getCountries(country);
      }
    } else if (result?.data?.message == "no_data_found") {
      form.setFieldsValue({ startDate: undefined });

      setCustomerPaymentsData([]);
      toast.info(result?.data?.toastMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
      //console.log("nopaymetnmethodsfound");
    } else if (result?.data?.message == "error") {
      setCustomerPaymentsData([]);
      form.setFieldsValue({ startDate: undefined });
      toast.error(result?.data?.toastMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setPaymentLoader(false);
  }

  async function getCustomers() {
    if (hasNext == true) {
      setSelectLoader(true);
      let results = await postApi(
        "api/admin/getCustomers",
        { cursor: cursor },
        app
      );

      if (results?.data?.message == "success") {
        setCursor(results?.data?.data.at(-1).cursor);

        //console.log("data", results?.data?.data);

        setHasNext(results.data.next);
        let arr = [];

        results.data.data?.map((item, index) => {
          // let id = item.node.id.split("/");
          // let c_id = id[id.length - 1];

          arr.push({
            value: item.node.id,
            label:
              item.node?.displayName +
              " " +
              (item.node?.email == null ? "" : item.node?.email),
            firstName: item?.node?.firstName,
            lastName: item?.node?.lastName,
            email: item.node?.email,
            phone: item.node?.phone,
            address1: item.node?.defaultAddress?.address1,
            address2: item.node?.defaultAddress?.address2,
            city: item.node?.defaultAddress?.city,
            country: item.node?.defaultAddress?.country,
            countryCode: item.node?.defaultAddress?.countryCodeV2,
            province: item.node?.defaultAddress?.province,
            provinceCode: item.node?.defaultAddress?.provinceCode,
            company: item.node?.defaultAddress?.company,
            zip: item.node?.defaultAddress?.zip,
          });
        });
        //console.log(arr);
        setCustomersList([...customersList, ...arr]);
      } else if (results?.data?.message == "error") {
        toast.error(results?.data?.toastMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      setSelectLoader(false);
    }
  }

  const searchCustomer = debounce(async (input) => {
    setInputVal(input);

    if (input != "") {
      setSelectLoader(true);

      let results = await postApi(
        "api/admin/searchCustomer",
        { cursor: "", input: input },
        app
      );
      if (results?.data?.message == "success") {
        //console.log(results);

        setCursor(results?.data?.data.at(-1).cursor);

        setHasNext(results.data.next);
        let arr = [];

        results.data.data?.map((item, index) => {
          arr.push({
            value: item.node.id,
            label:
              item.node?.displayName +
              " " +
              (item.node?.email == null ? "" : item.node?.email),
            firstName: item?.node?.firstName,
            lastName: item?.node?.lastName,
            email: item.node.email,
            phone: item.node?.phone,
            address1: item.node?.defaultAddress?.address1,
            address2: item.node?.defaultAddress?.address2,
            city: item.node?.defaultAddress?.city,
            country: item.node?.defaultAddress?.country,
            countryCode: item.node?.defaultAddress?.countryCodeV2,
            province: item.node?.defaultAddress?.province,
            provinceCode: item.node?.defaultAddress?.provinceCode,
            company: item.node?.defaultAddress?.company,
            zip: item.node?.defaultAddress?.zip,
          });
        });
        setCustomersList(arr);
      } else if (results?.data?.message == "no_data_found") {
        setCustomersList([]);
      } else if (results?.data?.message == "error") {
        toast.error(results?.data?.toastMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      setSelectLoader(false);
    } else {
      setSelectLoader(true);
      let results = await postApi(
        "api/admin/getCustomers",
        { cursor: "" },
        app
      );

      if (results?.data?.message == "success") {
        //console.log(results);

        setCursor(results?.data?.data.at(-1).cursor);

        setHasNext(results.data.next);
        let arr = [];

        results.data.data?.map((item, index) => {
          // let id = item.node.id.split("/");
          // let c_id = id[id.length - 1];

          arr.push({
            value: item.node.id,
            label:
              item.node?.displayName +
              " " +
              (item.node?.email == null ? "" : item.node?.email),
            firstName: item?.node?.firstName,
            lastName: item?.node?.lastName,
            email: item.node.email,
            phone: item.node?.phone,

            address1: item.node?.defaultAddress?.address1,
            address2: item.node?.defaultAddress?.address2,
            city: item.node?.defaultAddress?.city,
            country: item.node?.defaultAddress?.country,
            countryCode: item.node?.defaultAddress?.countryCodeV2,
            province: item.node?.defaultAddress?.province,
            provinceCode: item.node?.defaultAddress?.provinceCode,
            company: item.node?.defaultAddress?.company,
            zip: item.node?.defaultAddress?.zip,
          });
        });

        setCustomersList([...arr]);
      } else if (results?.data?.message == "no_data_found") {
        setCustomersList([]);
      } else if (results?.data?.message == "error") {
        setCustomersList([]);
      }
      setSelectLoader(false);
    }
  }, 500);

  const getSearchedCustomerOnScroll = async () => {
    setSelectLoader(true);

    let results = await postApi(
      "api/admin/searchCustomer",
      { cursor: cursor, input: inputVal },
      app
    );
    if (results?.data?.message == "success") {
      //console.log(results);

      setCursor(results?.data?.data.at(-1).cursor);

      setHasNext(results.data.next);
      let arr = [];

      results.data.data?.map((item, index) => {
        // let id = item.node.id.split("/");
        // let c_id = id[id.length - 1];

        arr.push({
          value: item.node.id,
          label:
            item.node?.displayName +
            " " +
            (item.node?.email == null ? "" : item.node?.email),
          firstName: item?.node?.firstName,
          lastName: item?.node?.lastName,
          email: item.node.email,
          phone: item.node?.phone,
          address1: item.node?.defaultAddress?.address1,
          address2: item.node?.defaultAddress?.address2,
          city: item.node?.defaultAddress?.city,
          country: item.node?.defaultAddress?.country,
          countryCode: item.node?.defaultAddress?.countryCodeV2,
          province: item.node?.defaultAddress?.province,
          provinceCode: item.node?.defaultAddress?.provinceCode,
          company: item.node?.defaultAddress?.company,
          zip: item.node?.defaultAddress?.zip,
        });
      });
      setCustomersList([...customersList, ...arr]);
    } else if (results?.data?.message == "no_data_found") {
      setCustomersList([]);
    } else if (results?.data?.message == "error") {
      //console.log("3");
    }
    setSelectLoader(false);
  };

  const discountType = (
    <Select
      name="ddd"
      value={
        existingSubscription?.subscription_details?.discount?.type ==
        "FIXED_AMOUNT"
          ? "fixed"
          : "percentage"
      }
      disabled
    >
      <Select.Option value="percentage">Percentage</Select.Option>

      <Select.Option value="fixed">Fixed</Select.Option>
    </Select>
  );

  const handleMenuScroll = ({ currentTarget }) => {
    const { scrollTop, clientHeight, scrollHeight } = currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      if (hasNext == true && inputVal == "") {
        getCustomers();
      } else if (hasNext == true && inputVal != "") {
        getSearchedCustomerOnScroll();
      }
    }
    // //console.log(customersList)
  };

  const handleMaxCycle = (rule, value) => {
    if (
      form.getFieldValue(["subscription", "billingMinValue"]) != "" &&
      parseInt(value) <
        parseInt(form.getFieldValue(["subscription", "billingMinValue"]))
    ) {
      return Promise.reject(
        "Maximum Billing Cycles cannot be less than Minimum Billing Cycles!"
      );
    } else if (value && (!/^\d+$/.test(value) || Number(value) <= 0)) {
      return Promise.reject(new Error("Must be a number greater than zero!"));
    } else if (
      value &&
      Number(value) < Number(form.getFieldValue(["subscription", "freeTrial"]))
    ) {
      return Promise.reject(
        new Error(
          "Maximum Billing Cycles cannot be less than Free trial count!"
        )
      );
    } else {
      form.setFields([
        {
          name: ["subscription", "billingMinValue"],
          errors: [],
        },
      ]);
      return Promise.resolve();
    }
  };

  const handleMinCycle = (rule, value) => {
    if (
      form.getFieldValue(["subscription", "billingMaxValue"]) != "" &&
      parseInt(value) >
        parseInt(form.getFieldValue(["subscription", "billingMaxValue"]))
    ) {
      //console.log( "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd" );
      return Promise.reject(
        "Minimum Billing Cycles cannnot be greater than Maximum Billing Cycles!"
      );
    } else if (value && (!/^\d+$/.test(value) || Number(value) <= 0)) {
      return Promise.reject(new Error("Must be a number greater than zero!"));
    } else if (
      form.getFieldValue(["subscription", "freeTrial"]) &&
      form.getFieldValue(["subscription", "billingMaxValue"]) &&
      Number(form.getFieldValue(["subscription", "freeTrial"])) >
        Number(form.getFieldValue(["subscription", "billingMaxValue"]))
    ) {
      form.setFields([
        {
          name: ["subscription", "billingMaxValue"],

          errors: [
            "Maximum Billing Cycles cannot be less than Free trial count!",
          ],
        },
      ]);
    } else {
      form.setFields([
        {
          name: ["subscription", "billingMaxValue"],
          errors: [],
        },
      ]);
      return Promise.resolve();
    }
  };

  const handleCustomerSelection = (value) => {
    //console.log("valuecheck", value);
    if (value != "empty") {
      // <---this condition because for add new customer label ,value is ""
      //console.log("enterr", value);
      // setShowDate(true)
      form.setFieldsValue({ paymentMethod: undefined });

      let data = customersList.find((item) => item.value == value);
      //console.log("findingggg", customersList);

      if (data) {
        setCustomerId(data?.value);
        form.setFieldsValue({
          address_details: {
            email: data?.email,
            firstName: data?.firstName,
            lastName: data?.lastName,
            phone: data?.phone,
            address1: data?.address1,
            address2: data?.address2,
            city: data?.city,
            country: data?.country,
            // countryCode: data?.countryCodeV2,
            province: data?.province,
            // provinceCode: data?.provinceCode,
            company: data?.company,
            zip: data?.zip,
          },
        });
        //console.log("firstmode", data?.countryCode);
        setCountryCode(data?.countryCode);
        setProvinceCode(data?.provinceCode);

        form.setFieldsValue({
          customer_details: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data?.email,
            phone: data?.phone,
          },
        });

        setCustomerDetails({
          email: data?.email,
          firstName: data?.firstName,
          lastName: data?.lastName,
          phone: data?.phone,
        });

        getCustomerPaymentMethods(value, data?.country);
      }
    } else {
      setCreateCustomerModal(true);

      // setCustomerDetails([]);
      // form.setFieldsValue({
      //   address_details: {},
      // });
    }
  };

  const handleDiscountValidator = (rule, value) => {
    if (
      form.getFieldValue(["subscription", "discount", "type"]) ==
        "PERCENTAGE" &&
      parseFloat(value) > 100
    ) {
      return Promise.reject("Can't exceed 100 !");
    } else {
      return Promise.resolve();
    }
  };

  // const handlePrepaidLength = (rule, value) => {
  //   const deliveryBillingValue = form.getFieldValue(["subscription", "delivery_billingValue"]);

  //   if (deliveryBillingValue && value) {
  //     if (parseInt(value) % parseInt(deliveryBillingValue) !== 0) {
  //       return Promise.reject("Prepaid billing value must be a multiple of the delivery value!");
  //     } else if (parseInt(value) <= parseInt(deliveryBillingValue)) {
  //       return Promise.reject("Prepaid billing value must be greater than the delivery value!");
  //     }
  //   }

  //   form.setFields([
  //     {
  //       name: ["subscription", "delivery_billingValue"],
  //       errors: [],
  //     },
  //   ]);

  //   return Promise.resolve();
  // };

  const handlePrepaidLength = (rule, value) => {
    if (
      form.getFieldValue(["subscription", "delivery_billingValue"]) != "" &&
      value != "" &&
      parseInt(value) %
        parseInt(
          form.getFieldValue(["subscription", "delivery_billingValue"])
        ) !=
        0
    ) {
      //console.log("hhhhhhhhhhhhhhhhhhhhhhhhh");

      return Promise.reject(
        "Prepaid Length value must be a multiple of Delivery Every value."
      );
    } else if (
      form.getFieldValue(["subscription", "delivery_billingValue"]) != "" &&
      value != "" &&
      parseInt(value) <=
        parseInt(form.getFieldValue(["subscription", "delivery_billingValue"]))
    ) {
      return Promise.reject(
        "Prepaid Length value must be greater than Delivery Every value!"
      );
    } else {
      form.setFields([
        {
          name: ["subscription", "delivery_billingValue"],
          errors: [],
        },
      ]);

      return Promise.resolve();
    }
  };

  const handlePrepaidDelivery = (rule, value) => {
    // //console.log("sssssssssfirst", parseInt(form.getFieldValue(["subscription", "billingLength"]) % parseInt(value) ))
    if (
      form.getFieldValue(["subscription", "billingLength"]) != "" &&
      value != "" &&
      parseInt(form.getFieldValue(["subscription", "billingLength"])) %
        parseInt(value) !=
        0
    ) {
      //console.log("hhhhhhhhhhhhhhhhhhhhhhhhh");
      return Promise.reject(
        "Delivery Every value must be a factor of Prepaid Length value."
      );
    } else if (
      form.getFieldValue(["subscription", "billingLength"]) != "" &&
      value != "" &&
      parseInt(value) >=
        parseInt(form.getFieldValue(["subscription", "billingLength"]))
    ) {
      return Promise.reject(
        "Delivery Every value must be less than Prepaid Length value!"
      );
    } else {
      form.setFields([
        {
          name: ["subscription", "billingLength"],
          errors: [],
        },
      ]);
      return Promise.resolve();
    }
  };

  // const handlePrepaidDelivery = (rule, value) => {
  //   const billingLengthValue = form.getFieldValue(["subscription", "billingLength"]);

  //   if (billingLengthValue && value) {
  //     if (parseInt(billingLengthValue) % parseInt(value) !== 0) {
  //       return Promise.reject("Prepaid billing value must be a multiple of the delivery value!");
  //     } else if (parseInt(value) >= parseInt(billingLengthValue)) {
  //       return Promise.reject("Delivery value must be less than the prepaid billing value!");
  //     }
  //   }

  //   form.setFields([
  //     {
  //       name: ["subscription", "billingLength"],
  //       errors: [],
  //     },
  //   ]);

  //   return Promise.resolve();
  // };

  const handleCreateCustomer = async (values) => {
    //console.log("jdfndfkdmfkmd", values);
    setLoader(true);
    let response = await postApi("/api/admin/createCustomer", { values }, app);
    setLoader(false);

    if (response.data.message == "success") {
      // setShowDate(false)
      form.setFieldValue("startDate", undefined);
      setCustomerPaymentsData([]);
      form.setFieldValue("paymentMethod", undefined);
      setCreateCustomerModal(false);
      form2.resetFields();
      //console.log(response.data.data.plan.customer);
      let data = response.data.data.plan.customer;

      let firstName = data?.firstName ? data?.firstName : "";
      let lastName = data?.lastName ? data?.lastName : "";
      let email = data?.email ? data?.email : "";

      form.setFieldsValue({
        customer_details: {
          email: data?.email,
          firstName: data?.firstName,
          lastName: data?.lastName,
          phone: data?.phone,
        },
        customer: firstName + " " + lastName + " " + email,
      });

      setCustomerDetails({
        email: data?.email,
        firstName: data?.firstName,
        lastName: data?.lastName,
        phone: data?.phone,
      });

      setCustomerId(data?.id);
      toast.success("Customer created succesfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      //console.log(response.data.data);

      toast.error(response.data.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const onFinish = async (values) => {
    //console.log(values);
    if (products.length == 0) {
      toast.warning("Please add at least one product to this plan.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      try {
        setLoader(true);
        if (
          JSON.stringify(values?.customer_details) !==
          JSON.stringify(customerDetails)
        ) {
          let body = {
            input: {
              id: customerId,
              ...form.getFieldValue("customer_details"),
            },
          };

          let result = await postApi("/api/admin/customerUpdate", body, app);
        }

        ////////
        let response = await postApi(
          "/api/admin/createPlanFormForCheckout",
          { products: products, values },
          app
        );

        if (response) {
          //console.log(response);
          let pid = response.data.data.plan.edges[0].node.id;
          let id = pid.split("/");

          let planid = id[id.length - 1];

          let shop = response.data.data.shop;
          let link = `https://${shop}/cart/clear?return_to=/cart/add?`;
          // let end = `return_to=/checkout?checkout[email]=${values.customer_details.email}`;
          let end = `return_to=/checkout`;
          products.map((i, index) => {
            let fullId = i.id;
            let varient = fullId.split("/");
            let vid = varient[varient.length - 1];
            link =
              link +
              `items[${index}][id]=${vid}%26items[${index}][quantity]=${i.quantity}%26items[${index}][selling_plan]=${planid}%26`;
          });

          link = link + end;
          setCopyText(link);
          setOptions({
            // from: "virender.shinedezign@gmail.com",
            to: values.customer_details.email,
            subject: "Subscription Checkout Link",
            html: `<p>Click <a href= ${link}>here</a> to redirect to checkout</p>`,
          });
          setCopyLink(true);
        }
        setLoader(false);
      } catch (err) {
        setLoader(false);
      }
    }
  };

  const sendPaymentMethodUpdateMail = async () => {
    setLoader(true);
    let response = await postApi(
      "/api/admin/customerPaymentMethodSendUpdateEmail",
      {
        paymentId: existingSubscription?.payment_details?.payment_method_token,
        email: existingSubscription?.customer_details?.email,
      },
      app
    );

    setLoader(false);
    if (response.data.message == "success") {
      toast.success(response.data.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error(response.data.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const sendMail = async () => {
    //console.log(options, "optionsss");

    setLoader(true);
    let response = await postApi(
      "/api/admin/sendMail",
      { options: options },
      app
    );

    setLoader(false);
    if (response.data.message == "success") {
      toast.success(response.data.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error(response.data.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const subscriptionUpdateCommon = async (endpoint, body, updateOption) => {
    setLoader(true);
    //console.log("updateOption", updateOption);
    let result = await postApi(`/api/admin/${endpoint}`, body, app);
    //console.log("67august", result?.data?.data);

    if (result?.data?.message == "success") {
      toast.success(`Subscription updated successfuly`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      // setExistingSubscription(result?.data?.data);
      setLoader(false);
      if (updateOption == "shippingDetails") {
        let updatedData = {
          ...existingSubscription,
          shipping_address: result?.data?.data?.shipping_address,
        };
        setExistingSubscription(updatedData);
        //console.log("updatedData", updatedData);

        let extra = {
          templateType: "shippingAddressUpdated",
          data: result?.data?.data,
          shop_name: storeDetails?.store_name,
          shop_email: storeDetails?.store_email,
          currency: storeDetails?.currency,
        };

        let resp = await sendMailOnUpdate({}, app, extra);

        ////////////////////////////////////
      } else if (updateOption == "customerDetails") {
        let updatedData = {
          ...existingSubscription,
          customer_details: result?.data?.data,
        };
        setExistingSubscription(updatedData);

        let firstName = result?.data?.data?.firstName
          ? result?.data?.data?.firstName
          : "";
        let lastName = result?.data?.data?.lastName
          ? result?.data?.data?.lastName
          : "";
        let email = result?.data?.data?.email ? result?.data?.data?.email : "";
        form.setFieldsValue({
          customer: firstName + " " + lastName + " " + email,
        });

        //console.log("updatedData", updatedData);
      } else if (updateOption == "subscriptionDetails") {
        //console.log("dsdsdsd");
        let updatedData = {
          ...existingSubscription,
          subscription_details: result?.data?.data?.subscription_details,
        };
        setExistingSubscription(updatedData);

        //console.log("kjjkjk");
        if (
          result?.data?.data?.subscription_details?.planType == "payAsYouGo"
        ) {
          //console.log("cscscsc");
          fetchDataUpcomingOrders(result?.data?.data);
        } else {
          // console.log("gfgdfgf",result?.data?.data?.subscription_id);
          let upcomingFulfillmentdData = await postApi(
            "/api/admin/upcomingFulfillment",
            { id: result?.data?.data?.subscription_id},
            app
          );

          if (upcomingFulfillmentdData?.data?.message == "success") {
            setFullfillmentDataMain(upcomingFulfillmentdData?.data?.data);
          }
        }

        //console.log("updatedData", updatedData);
      } else if (updateOption == "status") {
        let updatedData = {
          ...existingSubscription,
          status: result?.data?.data?.status,
          nextBillingDate: result?.data?.data?.nextBillingDate,
        };
        setExistingSubscription(updatedData);
        // console.log("5august", result?.data?.data?.nextBillingDate);
        form.setFieldValue(
          "startDate",
          dayjs(result?.data?.data?.nextBillingDate)
        );
        if (result?.data?.data?.status?.toUpperCase() == "CANCELLED") {
          let extra = {
            templateType: "subscriptionCanceled",
            data: result?.data?.data,
            shop_name: storeDetails?.store_name,
            shop_email: storeDetails?.store_email,
            currency: storeDetails?.currency,
          };

          let resp = await sendMailOnUpdate({}, app, extra);
        } else if (result?.data?.data?.status?.toUpperCase() == "PAUSED") {
          let extra = {
            templateType: "subscriptionPaused",
            data: result?.data?.data,
            shop_name: storeDetails?.store_name,
            shop_email: storeDetails?.store_email,
            currency: storeDetails?.currency,
          };

          let resp = await sendMailOnUpdate({}, app, extra);
        } else if (result?.data?.data?.status?.toUpperCase() == "ACTIVE") {
          fetchDataUpcomingOrders(updatedData)
          let extra = {
            templateType: "subscriptionResumed",
            data: result?.data?.data,
            shop_name: storeDetails?.store_name,
            shop_email: storeDetails?.store_email,
            currency: storeDetails?.currency,
          };
          let resp = await sendMailOnUpdate({}, app, extra);
        }
      }
      return true;
    } else {
      toast.error(result?.data?.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoader(false);
      return false;
    }
  };

  const handleCancelEdit = (cancelOption) => {
    if (cancelOption == "customerDetails") {
      //console.log(existingSubscription?.customer_details);

      form.setFields([
        {
          name: ["customer_details", "email"],
          errors: [],
          value: existingSubscription?.subscription_details?.email,
        },
        {
          name: ["customer_details", "firstName"],
          errors: [],
          value: existingSubscription?.subscription_details?.firstName,
        },
        {
          name: ["customer_details", "phone"],
          errors: [],
          value: existingSubscription?.subscription_details?.phone,
        },
        {
          name: ["customer_details", "lastName"],
          errors: [],
          value: existingSubscription?.subscription_details?.lastName,
        },
      ]);

      let data = JSON.parse(
        JSON.stringify(existingSubscription?.customer_details)
      );
      delete data?.id;
      //console.log(data);
      form.setFieldsValue({
        customer_details: data,
      });
      setEdit({ ...edit, customerDetails: false });
    }

    if (cancelOption == "subscriptionDetails") {
      //console.log(" in cancel");

      form.setFields([
        {
          name: ["subscription", "billingMaxValue"],
          errors: [],
          value: existingSubscription?.subscription_details?.billingMaxValue,
        },
        {
          name: ["subscription", "billingMinValue"],
          errors: [],
          value: existingSubscription?.subscription_details?.billingMinValue,
        },
      ]);

      form.setFieldsValue({
        subscription: { ...existingSubscription?.subscription_details },
        startDate: dayjs(existingSubscription?.nextBillingDate),
      });
      setEdit({ ...edit, subscriptionDetails: false });
    }

    if (cancelOption == "shippingDetails") {
      form.setFields([
        {
          name: ["address_details", "firstName"],
          errors: [],
          value: existingSubscription?.shipping_address?.firstName,
        },
        {
          name: ["address_details", "lastName"],
          errors: [],
          value: existingSubscription?.shipping_address?.lastName,
        },
        {
          name: ["address_details", "address1"],
          errors: [],
          value: existingSubscription?.shipping_address?.address1,
        },
        {
          name: ["address_details", "phone"],
          errors: [],
          value: existingSubscription?.shipping_address?.phone,
        },
        {
          name: ["address_details", "city"],
          errors: [],
          value: existingSubscription?.shipping_address?.city,
        },
        {
          name: ["address_details", "country"],
          errors: [],
          value: existingSubscription?.shipping_address?.country,
        },
        {
          name: ["address_details", "zip"],
          errors: [],
          value: existingSubscription?.shipping_address?.zip,
        },
        {
          name: ["address_details", "deliveryPrice"],
          errors: [],
          value: existingSubscription?.shipping_address?.deliveryPrice,
        },

        {
          name: ["address_details", "province"],
          errors: [],
          value: existingSubscription?.shipping_address?.province,
        },
        {
          name: ["address_details", "address2"],
          errors: [],
          value: existingSubscription?.shipping_address?.address2,
        },
        {
          name: ["address_details", "company"],
          errors: [],
          value: existingSubscription?.shipping_address?.company,
        },
      ]);

      setProvinceError(false);
      // let data = existingSubscription?.shipping_address?.deliveryPrice
      //   ? existingSubscription?.shipping_address
      //   : {
      //       ...existingSubscription?.shipping_address,
      //       deliveryPrice:
      //         existingSubscription?.shipping_address?.deliveryPrice,
      //     };

      // form.setFieldsValue({
      //   address_details: data,
      // });

      setCountryCode(existingSubscription?.shipping_address?.countryCode);
      setProvinceCode(existingSubscription?.shipping_address?.provinceCode);

      let selectedCountryData = countriesData?.find(
        (item) => item?.name == existingSubscription?.shipping_address?.country
      );

      setSelectedCountry(selectedCountryData);
      //console.log("newdelhi", selectedCountryData);

      if (selectedCountryData && selectedCountryData?.provinces?.length > 0) {
        let provincesNameArray = [];

        selectedCountryData?.provinces.forEach((element) => {
          provincesNameArray.push({
            label: element?.name,
            value: element?.name,
          });
        });
        //console.log("mohaliiiiiii", provincesNameArray);
        setProvincesName(provincesNameArray);
      } else if (
        selectedCountryData &&
        selectedCountryData?.provinces?.length == 0
      ) {
        setProvincesName([]);
      }

      if (!existingSubscription?.shipping_address?.country) {
        setProvincesName([]);
      }

      setEdit({ ...edit, shippingDetails: false });
    }
  };

  const handleSaveSubscriptionUpdate = async (updateOption) => {
    // console.log("sdjksjdkskdasdasdasdasdasdasdasdasdasdasddasda",form.isFieldValidating(['address_details']))
    //  form.isFieldValidating(['address_details','lastName'])

    await form
      .validateFields()
      .then(() => {})
      .catch((error) => {
        // console.log('Validation failed for username field:', error);
      });

    if (updateOption == "shipping") {
      //console.log( "inn shipppppppppppppppppppppppppppppp", provincesName.length );

      if (provincesName.length > 0) {
        if (!form.getFieldValue(["address_details", "province"])) {
          setProvinceError(true);
        } else {
          setProvinceError(false);
        }
      } else {
        setProvinceError(false);
      }

      // console.log("23oct", form.getFieldError(["address_details", "lastName"]), form.getFieldValue(["address_details", "address1"]) );

      let check =
        provincesName.length > 0
          ? form.getFieldError(["address_details", "firstName"]).length == 0 &&
            form.getFieldError(["address_details", "lastName"]).length == 0 &&
            form.getFieldError(["address_details", "address1"]).length == 0 &&
            form.getFieldError(["address_details", "phone"]).length == 0 &&
            form.getFieldError(["address_details", "zip"]).length == 0 &&
            form.getFieldError(["address_details", "deliveryPrice"]).length ==
              0 &&
            form.getFieldError(["address_details", "country"]).length == 0 &&
            form.getFieldError(["address_details", "province"]).length == 0 &&
            form.getFieldValue(["address_details", "province"])
          : form.getFieldError(["address_details", "firstName"]).length == 0 &&
            form.getFieldError(["address_details", "lastName"]).length == 0 &&
            form.getFieldError(["address_details", "address1"]).length == 0 &&
            form.getFieldError(["address_details", "phone"]).length == 0 &&
            form.getFieldError(["address_details", "zip"]).length == 0 &&
            form.getFieldError(["address_details", "deliveryPrice"]).length ==
              0 &&
            form.getFieldError(["address_details", "country"]).length == 0;

      if (check) {
        //console.log("hellooooooooooooo");

        let details = JSON.parse(
          JSON.stringify(form.getFieldValue("address_details"))
        );

        //console.log(details);

        let delivery_price =
          form.getFieldValue("address_details")?.deliveryPrice;
        let country = form.getFieldValue("address_details")?.country;
        let province = form.getFieldValue("address_details")?.province;

        //console.log(details);

        //console.log(delivery_price);

        delete details?.deliveryPrice;
        delete details?.country;
        delete details?.province;

        let body = {
          id: existingSubscription?.subscription_id,
          country: country,
          province: province,
          input: {
            deliveryPrice: delivery_price ? delivery_price : 0,

            deliveryMethod: {
              shipping: {
                address: {
                  ...details,

                  provinceCode: provinceCode,

                  countryCode: countryCode,
                },
              },
            },
          },

          field: "deliveryMethod",
        };

        let getStatus = await subscriptionUpdateCommon(
          "subscriptionShippingUpdate",

          body,
          "shippingDetails"
        );

        //console.log("azzzz", getStatus);

        getStatus && setEdit({ ...edit, shippingDetails: false });
      } else {
        // console.log("inelseshipping");
      }
    }

    if (updateOption == "subscriptionDetails") {
      //console.log(form.getFieldError(["subscription", "billingLength"]));

      if (
        form.getFieldError(["subscription", "planName"]).length == 0 &&
        form.getFieldError("startDate").length == 0 &&
        form.getFieldError(["subscription", "billingLength"]).length == 0 &&
        form.getFieldError(["subscription", "delivery_billingValue"]).length ==
          0 &&
        form.getFieldError(["subscription", "billingMinValue"]).length == 0 &&
        form.getFieldError(["subscription", "billingMaxValue"]).length == 0
      ) {
        //console.log("wewekjkjkjkjkjkj");

        let data = form.getFieldValue("subscription");
        ///////////////////////////
        //console.log("31august",data)
        let billingPolicy = {
          interval: data?.delivery_billingType?.toUpperCase(),
          intervalCount: parseInt(data?.billingLength),
          minCycles: data?.billingMinValue
            ? parseInt(data?.billingMinValue)
            : 1,

          // maxCycle:values?.subscription?.billingMaxValue ? parseInt(values.subscription.billingMaxValue) :null,
          //     ...(data?.billingMaxValue

          //       ?  { maxCycles:parseInt(data?.billingMaxValue) }

          //       :  data?.planType=='prepaid' && data?.autoRenew==false ? { maxCycles : 1}  : {}

          // ),

          ...(data?.autoRenew
            ? data?.billingMaxValue
              ? { maxCycles: parseInt(data?.billingMaxValue) }
              : {}
            : data?.planType == "prepaid" && data?.autoRenew == false
            ? { maxCycles: 1 }
            : {}),
        };

        // ///////////////////////
        // let billingPolicy =
        //   data?.autoRenew == true
        //     ? {
        //         interval: data?.delivery_billingType?.toUpperCase(),

        //         intervalCount: parseInt(data?.billingLength),

        //         minCycles: data?.billingMinValue
        //           ? parseInt(data?.billingMinValue)
        //           : 1,
        //       }
        //     : data?.billingMaxValue && data?.billingMinValue
        //     ? {
        //         interval: data?.delivery_billingType?.toUpperCase(),

        //         intervalCount: parseInt(data?.billingLength),

        //         minCycles: parseInt(data?.billingMinValue),

        //         maxCycles: parseInt(data?.billingMaxValue),
        //       }
        //     : data?.billingMinValue == true && data?.billingMaxValue == false
        //     ? {
        //         interval: data?.delivery_billingType?.toUpperCase(),

        //         intervalCount: parseInt(data?.billingLength),

        //         minCycles: parseInt(data?.billingMinValue),
        //       }
        //     : data?.billingMinValue == false && data?.billingMaxValue == true
        //     ? {
        //         interval: data?.delivery_billingType?.toUpperCase(),

        //         intervalCount: parseInt(data?.billingLength),

        //         maxCycles: parseInt(data?.billingMaxValue),
        //       }
        //     : {
        //         interval: data?.delivery_billingType?.toUpperCase(),

        //         intervalCount: parseInt(data?.billingLength),
        //       };

        let deliveryPolicy = {
          interval: data?.delivery_billingType?.toUpperCase(),

          intervalCount:
            data?.planType == "payAsYouGo"
              ? parseInt(data?.billingLength)
              : parseInt(data?.delivery_billingValue),
        };

        // input={...input,deliveryPolicy:deliveryPolicy,billingPolicy:billingPolicy}

        //console.log(updateOption, form.getFieldValue("subscription"));

        //console.log("hurrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");

        let body = {
          id: existingSubscription?.subscription_id,

          input: {
            nextBillingDate: form.getFieldValue("startDate"),

            billingPolicy: billingPolicy,

            deliveryPolicy: deliveryPolicy,
          },

          planName: form.getFieldValue(["subscription", "planName"]),

          planType: form.getFieldValue(["subscription", "planType"]),

          frequencyPlanName: form.getFieldValue([
            "subscription",

            "frequencyPlanName",
          ]),

          autoRenew: form.getFieldValue(["subscription", "autoRenew"]),
          currency: existingSubscription?.subscription_details?.currency,

          ...(existingSubscription?.subscription_details?.discount
            ? { discount: existingSubscription?.subscription_details?.discount }
            : {}),
          ...(existingSubscription?.subscription_details?.freeTrial
            ? {
                freeTrial:
                  existingSubscription?.subscription_details?.freeTrial,
              }
            : {}),
          ...(existingSubscription?.subscription_details?.freeTrialCycle
            ? {
                freeTrialCycle:
                  existingSubscription?.subscription_details?.freeTrialCycle,
              }
            : {}),
          check: "subscriptionDetailsUpdate",
        };

        let getStatus = await subscriptionUpdateCommon(
          "subscriptionDetailsUpdate",

          body,
          "subscriptionDetails"
        );

        getStatus && setEdit({ ...edit, subscriptionDetails: false });

        // else {

        // let body=  {id:existingSubscription?.subscription_id,input:{nextBillingDate: form.getFieldValue("startDate"),billingPolicy:billingPolicy,deliveryPolicy:deliveryPolicy},discountValue: form.getFieldValue(["subscription","discount","value"]),discountType:form.getFieldValue(["subscription","discount","type"]) ,check:"subscriptionDetails"}

        // subscriptionUpdateCommon("subscriptionDetailsUpdateWithDiscount",body)

        // }
      } else {
        //console.log("inelsesubscriptionDetails");
      }
    }

    if (updateOption == "customerDetails") {
      if (
        form.getFieldError(["customer_details", "firstName"]).length == 0 &&
        form.getFieldError(["customer_details", "lastName"]).length == 0 &&
        form.getFieldError(["customer_details", "email"]).length == 0 &&
        form.getFieldError(["customer_details", "phone"]).length == 0
      ) {
        let body = {
          input: {
            id: existingSubscription?.customer_details?.id,
            ...form.getFieldValue("customer_details"),
          },
          id: existingSubscription?.subscription_id,
          check: "customerUpdate",
        };
        let getStatus = subscriptionUpdateCommon(
          "subscriptionCustomerUpdate",
          body,
          "customerDetails"
        );
        getStatus && setEdit({ ...edit, customerDetails: false });
      } else {
        //console.log("in else customer detilasss");
      }
    }
  };

  const handleDisableDate = (current) => {
    return current && current < new Date(); //for disabling till yesterday,just do ---->  current && current < new Date().getTime() - 1 * 24 * 60 * 60 * 1000
  };

  const handleButtonClick = (e) => {
    //console.log("click left button", e);
  };

  const handleMenuClick = (e) => {
    // console.log("click", e.key);

    let body = {
      id: existingSubscription?.subscription_id,
      input: { status: e.key },
      field: "status",
    };

    if (e.key == "ACTIVE") {
      // console.log("sttauscheck",existingSubscription?.nextBillingDate,new Date().toISOString())
      const dateString1 = new Date(
        existingSubscription?.nextBillingDate
      ).toISOString();
      const dateString2 = new Date().toISOString();
      //  console.log("dateString1, dateString2",dateString1, dateString2)
      let date1 = new Date(dateString1);
      let date2 = new Date(dateString2);
      const comparisonResult = compareDatesIgnoringTime(date1, date2);

      if (comparisonResult < 0) {
        date2.setDate(date2.getDate() + 1);
        // console.log("date2",new Date(date2).toISOString())
        body.input.nextBillingDate = new Date(date2)?.toISOString();
        console.log("bodyyy", body);
      } else if (comparisonResult > 0) {
        // console.log("date1 is after date2.");
      } else {
        // console.log("Both dates are the same.");
      }
    }

    subscriptionUpdateCommon("subscriptionStatusUpdate", body, "status");
  };

  const items = [
    {
      label: "Pause Subscription",
      key: "PAUSED",
    },
    {
      label: "Resume Subscription",
      key: "ACTIVE",
    },
    {
      label: "Cancel Subscription",
      key: "CANCELLED",
      // danger: true,
    },
  ];

  const menuProps = {
    items: items.filter(
      (itm) => itm.key != existingSubscription?.status?.toUpperCase()
    ),

    onClick: handleMenuClick,
  };

  const handleStatusChange = (e) => {
    let body = {
      id: existingSubscription?.subscription_id,
      input: { status: e },
      field: "status",
    };
    subscriptionUpdateCommon("subscriptionStatusUpdate", body, "status");
  };

  return (
    <Spin spinning={loader} size="large" tip="Loading...">
      {/* <div className="revlytic-subscription-type-header">
        <p>Subscription Type</p>
        <Radio.Group defaultValue={subscriptionType} buttonStyle="solid">
          <Radio.Button
            value="customer"
            onChange={() => setSubscriptionType("customer")}
          >
            Subscription
          </Radio.Button>
          <Radio.Button
            value="merchant"
            onChange={() => setSubscriptionType("merchant")}
          >
            Manual Subscription
          </Radio.Button>
        </Radio.Group>
      </div> */}

      <Form
        form={form}
        layout="vertical"
        // requiredMark={!(existingSubscription != {} && mode == "view")}
        requiredMark={false}
        onFinish={onFinish}
        onValuesChange={handleFormChange}
        scrollToFirstError={true}
      >
        {(mode == "view" || mode == "edit") && (
          <div className="revlytic-header-button">
            {(mode == "view" || mode == "edit") && (
              <Button
                type="link"
                style={{ color: "#000000" }}
                onClick={() => navigate("/subscriptionList")}
              >
                <ArrowLeftOutlined /> Subscriptions
              </Button>
            )}
            {mode == "view"
              ? existingSubscription?.status && (
                  <div className="revlytic more-action-subscription">
                    {/* <div
                  className={
                    existingSubscription?.status?.toLowerCase() == "active"
                      ? "revlytic subscription-status-name subscription-status-active"
                      : existingSubscription?.status?.toLowerCase() == "cancelled"   ?   "revlytic subscription-status-name subscription-status-cancel"  :    "revlytic subscription-status-name subscription-status-others"
                  }
                >

               {existingSubscription?.status?.toLowerCase()== "cancelled" ? "Canceled" : existingSubscription?.status.charAt(0).toUpperCase() + existingSubscription?.status.slice(1).toLowerCase()}
                </div>
              </div> */}

                    <Dropdown.Button
                      disabled={mode == "view"}
                      menu={menuProps}
                      onClick={handleButtonClick}
                      className={
                        existingSubscription?.status?.toLowerCase() == "active"
                          ? "revlytic subscription-status-name subscription-status-active"
                          : existingSubscription?.status?.toLowerCase() ==
                            "cancelled"
                          ? "revlytic subscription-status-name subscription-status-cancel"
                          : "revlytic subscription-status-name subscription-status-others"
                      }
                    >
                      {existingSubscription?.status?.toLowerCase() ==
                      "cancelled"
                        ? "Canceled"
                        : existingSubscription?.status.charAt(0).toUpperCase() +
                          existingSubscription?.status.slice(1).toLowerCase()}
                    </Dropdown.Button>
                  </div>
                )
              : mode == "edit"
              ? existingSubscription?.status && (
                  <div className="revlytic more-action-subscription">
                    <Dropdown.Button
                      menu={menuProps}
                      onClick={handleButtonClick}
                      className={
                        existingSubscription?.status?.toLowerCase() == "active"
                          ? "revlytic subscription-status-name subscription-status-active"
                          : existingSubscription?.status?.toLowerCase() ==
                            "cancelled"
                          ? "revlytic subscription-status-name subscription-status-cancel"
                          : "revlytic subscription-status-name subscription-status-others"
                      }
                    >
                      {existingSubscription?.status?.toLowerCase() ==
                      "cancelled"
                        ? "Canceled"
                        : existingSubscription?.status.charAt(0).toUpperCase() +
                          existingSubscription?.status.slice(1).toLowerCase()}
                    </Dropdown.Button>

                    {/* {mode == "edit" && existingSubscription?.status && (
                <Dropdown.Button menu={menuProps} onClick={handleButtonClick}>
                <span>Status</span>:{existingSubscription?.status?.toLowerCase()== "cancelled" ? "Canceled" : existingSubscription?.status.charAt(0).toUpperCase() + existingSubscription?.status.slice(1).toLowerCase() }
                </Dropdown.Button>
              )} */}
                  </div>
                )
              : null}
          </div>
        )}

        <div className="revlytic-subscription-wrapper">
          {/* <Card
         
        >
          {" "}
          Create a Subscription
        </Card> */}

          <Card>
            <div className="revlytic heading-edit-save-container">
              <p className="revlytic main-headings">Customer</p>
              {existingSubscription != {} &&
                mode == "edit" &&
                (edit.customerDetails ? (
                  <div className="revlytic save-cancel-section">
                    <div>
                      <Button
                        onClick={() =>
                          handleSaveSubscriptionUpdate("customerDetails")
                        }
                      >
                        Submit
                      </Button>
                    </div>
                    <div>
                      <Button
                        onClick={() => handleCancelEdit("customerDetails")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="revlytic edit-section-button"
                    onClick={() => setEdit({ ...edit, customerDetails: true })}
                  >
                    <p>
                      <EditOutlined />
                    </p>

                    <p>Edit</p>
                  </div>
                ))}
            </div>
            <div className="revlytic customer-container">
              <div className="revlytic customer-details">
                <Form.Item
                  label={<p className="revlytic required">Customer Name</p>}
                  name="customer"
                  rules={[
                    {
                      required: true,
                      message: "Customer is required !",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    filterOption={false}
                    // placeholder=" Select Customer or Search For Customer"
                    onSearch={searchCustomer}
                    // loading={selectLoader}
                    // allowClear={true}
                    dropdownRender={(menu) => (
                      <>
                        <Space style={{ padding: "0 8px 4px" }}>
                          <Button
                            type="text"
                            icon={<PlusOutlined />}
                            onClick={() => setCreateCustomerModal(true)}
                          >
                            Add new customer
                          </Button>
                        </Space>

                        <Divider style={{ margin: "8px 0" }} />
                        <Spin
                          spinning={selectLoader}
                          size="large"
                          tip="Loading..."
                        >
                          {menu}
                        </Spin>
                      </>
                    )}
                    options={[...customersList]}
                    onPopupScroll={handleMenuScroll}
                    onChange={handleCustomerSelection}
                    // onDropdownVisibleChange={(open) => {
                    //   if (open) {
                    //     // form.setFieldsValue({ customer: undefined });
                    //     form.setFieldsValue({ paymentMethod: undefined });
                    //   }
                    // }}

                    disabled={
                      existingSubscription != {} &&
                      (mode == "view" || mode == "edit")
                    }
                  />
                </Form.Item>

                <Form.Item label="Payment Method" name="paymentMethod">
                  <Select
                    // placeholder="Please Select"
                    disabled={
                      existingSubscription != {} &&
                      (mode == "view" || mode == "edit")
                    }
                  >
                    {paymentLoader ? (
                      <Select.Option>
                        {" "}
                        <Spin
                          spinning={paymentLoader}
                          size="large"
                          tip="Loading..."
                        />
                      </Select.Option>
                    ) : (
                      customerPaymentsData.map((item, index) =>
                        item?.node?.instrument?.brand &&
                        item?.node?.instrument?.lastDigits ? (
                          <Select.Option key={index} value={item?.node?.id}>
                            {item?.node?.instrument?.brand
                              .charAt(0)
                              .toUpperCase() +
                              formatVariableName(
                                item?.node?.instrument?.brand.slice(1)
                              )}
                            (**** **** **** {item?.node?.instrument?.lastDigits}
                            )
                          </Select.Option>
                        ) : (
                          ""
                        )
                      )
                    )}
                  </Select>
                </Form.Item>

                {edit["customerDetails"] == true && (
                  <Button onClick={sendPaymentMethodUpdateMail}>
                    Request Update
                  </Button>
                )}
              </div>
              <div className="revlytic customer-profile">
                <div className="revlytic customer-profile-name">
                  <Form.Item
                    label="First Name"
                    // label={<p className="revlytic required">First Name</p>}
                    name={["customer_details", "firstName"]}
                    // initialValue={props?.data?.customer_details?.customerFirstName}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "",
                    //   },

                    //   {
                    //     validator: (rule, value) => {
                    //       if (!value) {
                    //         return Promise.reject("First Name is required!");
                    //       } else if (value.trim() === "") {
                    //         return Promise.reject("First Name is required!");
                    //       }

                    //       return Promise.resolve();
                    //     },
                    //   },
                    // ]}
                  >
                    <Input
                      // placeholder="enter name"
                      //   disabled={
                      //   existingSubscription != {} &&
                      //   (mode == "view" ||
                      //     (mode == "edit" && edit["customerDetails"] == false))
                      // }
                      disabled={
                        existingSubscription != {} &&
                        (mode == "view" ||
                          (mode == "edit" && edit["customerDetails"] == false))
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Last Name"
                    name={["customer_details", "lastName"]}
                    // initialValue={props?.data?.customer_details?.customerLastName}
                  >
                    <Input
                      disabled={
                        existingSubscription != {} &&
                        (mode == "view" ||
                          (mode == "edit" && edit["customerDetails"] == false))
                      }
                    />
                  </Form.Item>
                </div>
                <div className="revlytic customer-profile-email">
                  <Form.Item
                    label={<p className="revlytic required">Email</p>}
                    name={["customer_details", "email"]}
                    // initialValue={props?.data?.customer_details?.customerEmail}
                    rules={[
                      {
                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                      {
                        required: true,
                        message: "Email Address is required!",
                      },
                    ]}
                  >
                    <Input
                      disabled={
                        existingSubscription != {} &&
                        (mode == "view" ||
                          (mode == "edit" && edit["customerDetails"] == false))
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Phone"
                    name={["customer_details", "phone"]}
                    rules={[
                      {
                        pattern: /^\+?\d+$/,
                        message: "Enter a valid phone number!",
                      },
                    ]}
                  >
                    <Input
                      disabled={
                        existingSubscription != {} &&
                        (mode == "view" ||
                          (mode == "edit" && edit["customerDetails"] == false))
                      }
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* {showDeliveryPrice==true &&  <Form.Item
            label="Delivery/Shipping Price"
            name= "deliveryPrice"
            initialValue={""}
            rules={[
              {
                pattern: /^\d+(\.\d+)?$/,
                message: "Price can only be a number or decimal value!",
              },
              // { pattern: /^\d+$/, message: "Must be a number!" },
              {
                required: true,
                message: "Delivery price can't be empty !",
              },
            ]}
          >
            <Input />
          </Form.Item>
} */}
          </Card>

          <Card className="revlytic subscription-container">
            <div className="revlytic heading-edit-save-container">
              <p className="revlytic main-headings">Subscription Details</p>

              {existingSubscription != {} &&
                mode == "edit" &&
                (edit.subscriptionDetails ? (
                  <div className="revlytic save-cancel-section">
                    <div>
                      <Button
                        onClick={() =>
                          handleSaveSubscriptionUpdate("subscriptionDetails")
                        }
                      >
                        Submit
                      </Button>
                    </div>
                    <div>
                      <Button
                        onClick={() => handleCancelEdit("subscriptionDetails")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="revlytic edit-section-button"
                    onClick={() =>
                      setEdit({ ...edit, subscriptionDetails: true })
                    }
                  >
                    <p>
                      <EditOutlined />
                    </p>

                    <p>Edit</p>
                  </div>
                ))}
            </div>

            {existingSubscription != {} &&
            existingSubscription?.createdAt &&
            (mode == "edit" || mode == "view") ? (
              <div>
                <div>
                  {"Created Date : " +
                    dateConversion(existingSubscription?.createdAt)}{" "}
                </div>
                <div>
                  {"Subscription ID : " +
                    existingSubscription?.subscription_id
                      ?.split("/")
                      .at(-1)}{" "}
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="revlytic subscription-details">
              <Form.Item
                label={<p className="revlytic required">Plan Name</p>}
                name={["subscription", "planName"]}
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                  {
                    validator: (rule, value) => {
                      if (!value) {
                        return Promise.reject("Plan Name is required!");
                      } else if (value.trim() === "") {
                        return Promise.reject("Plan Name is required!");
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
                tooltip={
                  "Name your subscription plan here. This will allow you to differentiate between your various Subscription Plans."
                }
              >
                <Input
                  // placeholder="Plan Name"
                  disabled={
                    existingSubscription != {} &&
                    (mode == "view" ||
                      (mode == "edit" && edit["subscriptionDetails"] == false))
                  }
                />
              </Form.Item>
              <Form.Item
                className="chekkkk"
                label={
                  <div className="revlytic label-tooltip-main">
                    <label>Plan Types</label>
                    <Tooltip
                      placement="left"
                      title={
                        <div className="revlytic-plan-type-toolTip">
                          <p>
                            <h2>Supported Subscription Billing Plans</h2>
                            <hr />
                            <h2>1. Pay As You Go (Auto Renewal):</h2>
                            Pay As You Go is a flexible billing plan that bills
                            your customers for whatever billing frequency you
                            select. For example, if you set up a Monthly Pay As
                            You Go Subscription plan, your customer will be
                            charged every month until the plan is canceled.
                          </p>
                          <p>
                            <h1>2. Prepaid (Auto Renewal On):</h1>
                            With the Prepaid Auto Renewal plan type, you are
                            able to bill your customer in advance for multiple
                            periods in the future. For example, with the Prepaid
                            Length set to 12 Months and the Delivery Every set
                            to 1 month, you can bill the customer for 12 Months
                            of deliveries upfront. At the end of the 12 Months,
                            this plan will Auto Renew for another 12 Month
                            period billed upfront. This will continue until
                            either you or the Customer cancels the subscription.
                          </p>
                          <p>
                            {" "}
                            <h1>3. Prepaid (Auto Renewal Off):</h1>
                            This plan type is exactly the same as the Prepaid
                            with Auto Renewal On, except that it does not renew
                            at the of the billing cycle.
                          </p>
                        </div>
                      }
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                }
                name={["subscription", "planType"]}
                initialValue={"payAsYouGo"}
              >
                <Select
                  // placeholder="Please Select"
                  disabled={
                    existingSubscription != {} &&
                    (mode == "view" ||
                      (mode == "edit" && edit["subscriptionDetails"] == false))
                  }
                >
                  <Select.Option value="payAsYouGo">
                    Pay As You Go{" "}
                  </Select.Option>
                  <Select.Option value="prepaid">Prepaid</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div className="revlytic subscription-details1">
              <div className="revlytic start-date">
                {mode != "edit" && mode != "view" ? (
                  <Form.Item
                    name="startDate"
                    label={
                      <p className="revlytic required">
                        Subscription Start Date
                      </p>
                    }
                    tooltip="Date when subscription starts(* Valid for existing customers only)"
                  >
                    <Input
                      disabled
                      placeholder="The date is determined on checkout by the customer"
                    />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label={
                      <p className="revlytic required">Next Billing Date</p>
                    }
                    name="startDate"
                    initialValue={dayjs(
                      new Date().getTime() + 1 * 24 * 60 * 60 * 1000
                    )}
                    tooltip="Date when subscription starts(* Valid for existing customers only)"
                    rules={[
                      {
                        required: true,
                        message: "Please select start date!",
                      },
                    ]}
                    // extra="Valid for existing customers only"
                  >
                    <DatePicker
                      allowClear={false}
                      showTime={false}
                      showToday={false}
                      disabledDate={handleDisableDate}
                      // showTime={{
                      //   hideDisabledOptions: true,
                      //   defaultValue: [dayjs("00:00:00", "HH:mm:ss")],
                      // }}
                      format="YYYY-MM-DD"
                      disabled={
                        existingSubscription != {} &&
                        (mode == "view" ||
                          (mode == "edit" &&
                            edit["subscriptionDetails"] == false))
                      }
                    />
                  </Form.Item>
                )}

                <p className="revlytic preview-label">Preview</p>
                <p> {preview} </p>
              </div>
              <div className={"revytic billing-frequency"}>
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) =>
                    getFieldValue(["subscription", "planType"]) ==
                    "payAsYouGo" ? (
                      <div className={"revytic only-billing-frequency"}>
                        <Form.Item
                          label={
                            <p className="revlytic required">Bill Every</p>
                          }
                          // name={["subscription", "delivery_billingValue"]}
                          name={["subscription", "billingLength"]}
                          initialValue="1"
                          rules={[
                            {
                              required: true,
                              message: "Bill Every is required!",
                            },
                            {
                              pattern: /^\d+$/,
                              message: "Must be a number!",
                            },
                          ]}
                          tooltip="Enter how often you would like to Bill your customers in this plan. For example, if you select Bill Every 3 Months, your customer will be billed every three months, regardless of when they receive deliveries"
                        >
                          <Input
                            disabled={
                              existingSubscription != {} &&
                              (mode == "view" ||
                                (mode == "edit" &&
                                  edit["subscriptionDetails"] == false))
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          label=" "
                          name={["subscription", "delivery_billingType"]}
                          initialValue={"MONTH"}
                        >
                          <Select
                            disabled={
                              existingSubscription != {} &&
                              (mode == "view" ||
                                (mode == "edit" &&
                                  edit["subscriptionDetails"] == false))
                            }
                          >
                            <Select.Option value="DAY">Day(s)</Select.Option>
                            <Select.Option value="WEEK">Week(s)</Select.Option>
                            <Select.Option value="MONTH">
                              Month(s)
                            </Select.Option>
                            <Select.Option value="YEAR">Year(s)</Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="Auto Renew "
                          className="revlytic autorenew-tooltip"
                          name={["subscription", "autoRenew"]}
                          initialValue={true}
                          valuePropName="checked"
                          tooltip="If this box is selected, the plan will automatically renew at the end of the subscription."
                        >
                          <Checkbox disabled></Checkbox>
                        </Form.Item>
                      </div>
                    ) : (
                      <div className={"revytic billing-delivery-frequency"}>
                        <div className="revlyticbilling-delivery-frequency-container1">
                          {" "}
                          <Form.Item
                            label={
                              <p className="revlytic required">
                                Prepaid Length
                              </p>
                            }
                            // name={["subscription", "delivery_billingValue"]}

                            name={["subscription", "billingLength"]}
                            initialValue="1"
                            rules={[
                              {
                                required: true,
                                message: "Prepaid Length is required!",
                              },
                              {
                                pattern: /^\d+$/,
                                message: "Must be a number!",
                              },
                              {
                                validator: (rule, value) =>
                                  handlePrepaidLength(rule, value),
                              },
                            ]}
                            tooltip="The term of the service that the customer will prepay for."
                          >
                            <Input
                              disabled={
                                existingSubscription != {} &&
                                (mode == "view" ||
                                  (mode == "edit" &&
                                    edit["subscriptionDetails"] == false))
                              }
                            />
                          </Form.Item>
                          <Form.Item
                            label=" "
                            name={["subscription", "delivery_billingType"]}
                            initialValue={"MONTH"}
                          >
                            <Select
                              disabled={
                                existingSubscription != {} &&
                                (mode == "view" ||
                                  (mode == "edit" &&
                                    edit["subscriptionDetails"] == false))
                              }
                            >
                              <Select.Option value="DAY">Day(s)</Select.Option>
                              <Select.Option value="WEEK">
                                Week(s)
                              </Select.Option>
                              <Select.Option value="MONTH">
                                Month(s)
                              </Select.Option>
                              <Select.Option value="YEAR">
                                Year(s)
                              </Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            className="autorenew-tooltip"
                            label=" Auto Renew"
                            name={["subscription", "autoRenew"]}
                            initialValue={false}
                            valuePropName="checked"
                            tooltip="If this box is selected, the plan will automatically renew at the end of the subscription."
                          >
                            <Checkbox
                              disabled={
                                existingSubscription != {} &&
                                (mode == "view" ||
                                  (mode == "edit" &&
                                    edit["subscriptionDetails"] == false))
                              }
                            ></Checkbox>
                          </Form.Item>
                        </div>
                        <div className="revlyticbilling-delivery-frequency-container2">
                          <Form.Item
                            label={
                              <p className="revlytic required">
                                Delivery Every
                              </p>
                            }
                            name={["subscription", "delivery_billingValue"]}
                            initialValue="1"
                            rules={[
                              {
                                required: true,
                                message: "Delivery Every is required!",
                                // whitespace: true,
                              },
                              {
                                pattern: /^\d+$/,
                                message: "Must be a number!",
                              },
                              {
                                validator: (rule, value) =>
                                  handlePrepaidDelivery(rule, value),
                              },
                            ]}
                            tooltip="For Prepaid Plans, the number of deliveries that will be made to the customer in the defined Prepaid Length. For example, if you set “Prepaid Length” to 12 Months, and “Delivery Every” to 3 Months, you will be delivering to your customer every 3 months for a 12 month period. That equates to 4 Deliveries (4 Deliveries x 3 Months = 12 Months of Deliveries)."
                          >
                            <Input
                              disabled={
                                existingSubscription != {} &&
                                (mode == "view" ||
                                  (mode == "edit" &&
                                    edit["subscriptionDetails"] == false))
                              }
                            />
                          </Form.Item>

                          <Form.Item
                            label=" "
                            name={["subscription", "delivery_billingType"]}
                            initialValue={"MONTH"}
                          >
                            <Select
                              disabled={
                                existingSubscription != {} &&
                                (mode == "view" ||
                                  (mode == "edit" &&
                                    edit["subscriptionDetails"] == false))
                              }
                            >
                              <Select.Option value="DAY">Day(s)</Select.Option>
                              <Select.Option value="WEEK">
                                Week(s)
                              </Select.Option>
                              <Select.Option value="MONTH">
                                Month(s)
                              </Select.Option>
                              <Select.Option value="YEAR">
                                Year(s)
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                    )
                  }
                </Form.Item>
              </div>
            </div>

            {advanceOptions == true ? (
              <div className="revlytic advance-options-container">
                <Divider />

                <p className="revlytic main-headings">Advanced Options</p>

                <div className="revlytic subscription-details2">
                  {(mode == "edit" || mode == "view") &&
                  existingSubscription?.subscription_details?.freeTrial ? (
                    <div className="revlytic advance-options-discount free_trial">
                      {/* <div className="revlytic discount-toggle">
                          <Form.Item
                            label="Offer Discount"
                            name={["subscription", "offerDiscount"]}
                            // initialValue={existingSubscription}
                            valuePropName="checked"
                            tooltip="Discount will be applied to every selected product individually for the plan"
                          >
                            <Switch
                              onChange={(state) => {
                                if (!state) {
                                  form.setFieldValue(
                                    ["subscription", "discount"],
                                    { type: "PERCENTAGE", value: undefined }
                                  );
                                }
                              }}
                              disabled={
                                existingSubscription != {} &&
                                (mode == "view" ||
                                  mode == "edit" )
                              }
                            />
                          </Form.Item>
                        </div>    */}

                      {/* <label>Discount</label> */}
                      <div className="revlytic ">
                        <Form.Item
                          name={["subscription", "freeTrial"]}
                          // noStyle
                          label="Free Trial Period"
                          rules={[
                            {
                              required: true,
                              message: "Offer Discount is required!",
                              // whitespace: true,
                            },
                            {
                              pattern: /^\d+(\.\d+)?$/,
                              message: "Price must be a valid number!",
                            },

                            {
                              validator: (rule, value) =>
                                handleDiscountValidator(rule, value),
                            },
                          ]}
                          tooltip=""
                        >
                          <Input
                            // placeholder="Enter value"
                            disabled={
                              existingSubscription != {} &&
                              (mode == "view" || mode == "edit")
                            }
                          />
                        </Form.Item>

                        <Form.Item
                          name={["subscription", "freeTrialCycle"]}
                          // noStyle
                          label=" "
                          tooltip=""
                        >
                          <Input
                            // placeholder="Enter value"
                            disabled={
                              existingSubscription != {} &&
                              (mode == "view" || mode == "edit")
                            }
                          />
                        </Form.Item>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="revlytic  advance-options-frequencyPlanName-discount">
                    <div className="revlytic frequency-name">
                      <Form.Item
                        label="Frequency Plan Name"
                        name={["subscription", "frequencyPlanName"]}
                        tooltip=" A Frequency Plan refers to the frequency  of deliveries or fulfillments to be made. Name the frequency here. Common examples of Frequency Plan Names are “Monthly” or “Weekly”. This is an external field that will be visible to your customers on the Product Details page."
                      >
                        <Input
                          // placeholder="Enter Plan Name"
                          disabled={
                            existingSubscription != {} &&
                            (mode == "view" ||
                              (mode == "edit" &&
                                edit["subscriptionDetails"] == false))
                          }
                        />
                      </Form.Item>
                    </div>
                    {/* {mode == "edit" || mode == "view" ? null : (
                      <div className="revlytic advance-options-discount">
                        <div className="revlytic discount-toggle">
                          <Form.Item
                            label="Offer Discount"
                            name={["subscription", "offerDiscount"]}
                            initialValue={false}
                            valuePropName="checked"
                            tooltip="Discount will be applied to every selected product individually for the plan"
                          >
                            <Switch
                              onChange={(state) => {
                                if (!state) {
                                  form.setFieldValue(
                                    ["subscription", "discount"],
                                    { type: "PERCENTAGE", value: undefined }
                                  );
                                }
                              }}
                              disabled={
                                existingSubscription != {} &&
                                (mode == "view" ||
                                  (mode == "edit" &&
                                    edit["subscriptionDetails"] == false))
                              }
                            />
                          </Form.Item>
                        </div>

                        <div className="revlytic discount-value">
                          <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) =>
                              getFieldValue([
                                "subscription",
                                "offerDiscount",
                              ]) === true ? (
                                <>
                                  <Form.Item
                                    name={["subscription", "discount", "value"]}
                                    // noStyle
                                    label=" "
                                    rules={[
                                      {
                                        required: true,
                                        message: "Offer Discount is required!",
                                        // whitespace: true,
                                      },
                                      {
                                        pattern: /^\d+(\.\d+)?$/,
                                        message:
                                          "Price must be a valid number!",
                                      },

                                      {
                                        validator: (rule, value) =>
                                          handleDiscountValidator(rule, value),
                                      },
                                    ]}
                                    tooltip=""
                                  >
                                    <Input
                                      // placeholder="Enter value"
                                      disabled={
                                        existingSubscription != {} &&
                                        (mode == "view" ||
                                          (mode == "edit" &&
                                            edit["subscriptionDetails"] ==
                                              false))
                                      }
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    name={["subscription", "discount", "type"]}
                                    label=" "
                                    // rules={[{ required: true, message: 'Province is required' }]}
                                    initialValue={"PERCENTAGE"}
                                  >
                                    <Select
                                      disabled={
                                        existingSubscription != {} &&
                                        (mode == "view" ||
                                          (mode == "edit" &&
                                            mode == "edit" &&
                                            edit["subscriptionDetails"] ==
                                              false))
                                      }
                                    >
                                      <Option value="PERCENTAGE">
                                        Percentage
                                      </Option>
                                      <Option value="FIXED_AMOUNT">
                                        Fixed
                                      </Option>
                                    </Select>
                                  </Form.Item>
                                </>
                              ) : null
                            }
                          </Form.Item>
                        </div>
                      </div>
                    )} */}

                    {/* 23 sept 2023333 start */}
                    {(mode == "edit" || mode == "view") &&
                    existingSubscription?.subscription_details?.discount ? (
                      <div className="revlytic advance-options-discount">
                        {/* <div className="revlytic discount-toggle">
                          <Form.Item
                            label="Offer Discount"
                            name={["subscription", "offerDiscount"]}
                            // initialValue={existingSubscription}
                            valuePropName="checked"
                            tooltip="Discount will be applied to every selected product individually for the plan"
                          >
                            <Switch
                              onChange={(state) => {
                                if (!state) {
                                  form.setFieldValue(
                                    ["subscription", "discount"],
                                    { type: "PERCENTAGE", value: undefined }
                                  );
                                }
                              }}
                              disabled={
                                existingSubscription != {} &&
                                (mode == "view" ||
                                  mode == "edit" )
                              }
                            />
                          </Form.Item>
                        </div>    */}

                        {/* <label>Discount</label> */}
                        <div className="revlytic ">
                          <Form.Item
                            name={["subscription", "discount", "value"]}
                            // noStyle
                            label="Discount"
                            rules={[
                              {
                                required: true,
                                message: "Offer Discount is required!",
                                // whitespace: true,
                              },
                              {
                                pattern: /^\d+(\.\d+)?$/,
                                message: "Price must be a valid number!",
                              },

                              {
                                validator: (rule, value) =>
                                  handleDiscountValidator(rule, value),
                              },
                            ]}
                            tooltip=""
                          >
                            <Input
                              // placeholder="Enter value"
                              //  prefix={currency && getCurrencySymbol(currency) && existingSubscription?.subscription_details?.discount?.type=="fixed"}

                              disabled={
                                existingSubscription != {} &&
                                (mode == "view" || mode == "edit")
                              }
                              addonAfter={discountType}
                            />
                          </Form.Item>
                          {/* <Form.Item
                                    name={["subscription", "discount", "type"]}
                                    label="Type"
                                    // rules={[{ required: true, message: 'Province is required' }]}
                                    initialValue={"PERCENTAGE"}
                                  >
                                    <Select
                                      disabled={
                                        existingSubscription != {} &&
                                        (mode == "view" ||
                                          mode == "edit" )
                                      }
                                    >
                                      <Option value="PERCENTAGE">
                                        Percentage
                                      </Option>
                                      <Option value="FIXED_AMOUNT">
                                        Fixed
                                      </Option>
                                    </Select>
                                  </Form.Item>
                                 */}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {/* ***    23sept endddd **** */}
                  </div>

                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) =>
                      getFieldValue(["subscription", "autoRenew"]) == true ? (
                        <div className="revlytic billing-cycles">
                          <Form.Item
                            label="Minimum Billing Cycles"
                            name={["subscription", "billingMinValue"]}
                            rules={[
                              {
                                validator: (rule, value) =>
                                  handleMinCycle(rule, value),
                                // whitespace: true,
                              },
                            ]}
                            tooltip="Minimum number of billing iteration you want to bind your customers with, before they can cancel their subscription. Default value is one (the very first billing iteration)."
                            onChange={(e) =>
                              console.log("testing", e.target.value)
                            }
                          >
                            <Input
                              // placeholder="Enter value"
                              disabled={
                                existingSubscription != {} &&
                                (mode == "view" ||
                                  (mode == "edit" &&
                                    edit["subscriptionDetails"] == false))
                              }
                            />
                          </Form.Item>

                          <Form.Item
                            label="Maximum Billing Cycles"
                            name={["subscription", "billingMaxValue"]}
                            rules={[
                              {
                                validator: (rule, value) =>
                                  handleMaxCycle(rule, value),
                              },
                            ]}
                            tooltip="Maximum number of billing iteration that will be fulfilled as a part of the subscription plan, after which it will automatically expire. Default value is infinity."
                          >
                            <Input
                              // placeholder="Enter value"
                              disabled={
                                existingSubscription != {} &&
                                (mode == "view" ||
                                  (mode == "edit" &&
                                    edit["subscriptionDetails"] == false))
                              }
                            />
                          </Form.Item>
                        </div>
                      ) : null
                    }
                  </Form.Item>
                </div>
              </div>
            ) : null}

            {/* </div> */}

            <div
              className="revlytic advance-option-label"
              onClick={() => setAdvanceOptions(!advanceOptions)}
            >
              <span>
                {advanceOptions == true
                  ? "Collapse Advanced Options"
                  : "Show Advanced Options"}
              </span>
              {advanceOptions == true ? <UpOutlined /> : <RightOutlined />}
            </div>
          </Card>

          {mode && mode == "edit" && existingSubscription != {} ? (
            <SubscriptionProductsEdit
              products={products}
              setProducts={setProducts}
              loader={loader}
              setLoader={setLoader}
              edit={edit}
              setEdit={setEdit}
              discount={existingSubscription?.subscription_details?.discount}
              subscriptionId={existingSubscription?.subscription_id}
              subscription_details={existingSubscription?.subscription_details}
              // countriesData={countriesData}
              storeCurrency={storeDetails?.currency}
            />
          ) : (
            <SubscriptionProducts
              products={products}
              setProducts={setProducts}
              loader={loader}
              setLoader={setLoader}
              mode={existingSubscription != {} ? mode : null}
              edit={edit}
              setEdit={setEdit}
              checkedIds={checkedIds}
              setCheckedIds={setCheckedIds}
              customerPaymentsDataLength={customerPaymentsData.length}
              subscription_details={{
                ...form.getFieldValue("subscription"),
                currency: existingSubscription?.subscription_details?.currency,
              }}
            />
          )}
        </div>

        {existingSubscription != {} && (mode == "edit" || mode == "view") ? (
          <Card>
            <div className="revlytic heading-edit-save-container">
              <p className="revlytic main-headings">Shipping Details</p>
              {existingSubscription != {} &&
                mode == "edit" &&
                (edit.shippingDetails ? (
                  <div className="revlytic save-cancel-section">
                    <div>
                      <Button
                        onClick={() => handleSaveSubscriptionUpdate("shipping")}
                      >
                        Submit
                      </Button>
                    </div>
                    <div>
                      <Button
                        onClick={() => handleCancelEdit("shippingDetails")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="revlytic edit-section-button"
                    onClick={() => setEdit({ ...edit, shippingDetails: true })}
                  >
                    <p>
                      <EditOutlined />
                    </p>

                    <p>Edit</p>
                  </div>
                ))}
            </div>
            <div className="revlytic shipping-details">
              <Form.Item
                // label={<p className="revlytic required">First Name</p>}
                label="First Name"
                name={["address_details", "firstName"]}
                // initialValue={props?.data?.customer_details?.customerFirstName}
                // rules={[
                //   {
                //     required: true,
                //     message: "",
                //   },
                //   {
                //     validator: (rule, value) => {
                //       if (!value) {
                //         return Promise.reject("First Name is required!");
                //       } else if (value.trim() === "") {
                //         return Promise.reject("First Name is required!");
                //       }

                //       return Promise.resolve();
                //     },
                //   },
                // ]}
              >
                <Input
                  // placeholder="enter name"
                  disabled={
                    existingSubscription != {} &&
                    (mode == "view" ||
                      (mode == "edit" && edit["shippingDetails"] == false))
                  }
                />
              </Form.Item>
              <Form.Item
                label={<p className="revlytic required">Last Name</p>}
                name={["address_details", "lastName"]}
                // initialValue={props?.data?.customer_details?.customerLastName}
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                  {
                    validator: (rule, value) => {
                      if (!value) {
                        return Promise.reject("Last Name is required!");
                      } else if (value.trim() === "") {
                        return Promise.reject("Last Name is required!");
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  disabled={
                    existingSubscription != {} &&
                    (mode == "view" ||
                      (mode == "edit" && edit["shippingDetails"] == false))
                  }
                />
              </Form.Item>
            </div>
            <div className="revlytic shipping-details">
              <Form.Item
                label={<p className="revlytic required">Address 1</p>}
                name={["address_details", "address1"]}
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                  {
                    validator: (rule, value) => {
                      if (!value) {
                        return Promise.reject("Address1 is required!");
                      } else if (value.trim() === "") {
                        return Promise.reject("Address1 is required!");
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  disabled={
                    existingSubscription != {} &&
                    (mode == "view" ||
                      (mode == "edit" && edit["shippingDetails"] == false))
                  }
                />
              </Form.Item>

              <Form.Item
                label="Address 2"
                name={["address_details", "address2"]}
              >
                <Input
                  disabled={
                    existingSubscription != {} &&
                    (mode == "view" ||
                      (mode == "edit" && edit["shippingDetails"] == false))
                  }
                />
              </Form.Item>
            </div>
            <div className="revlytic shipping-details">
              <Form.Item
                label="Phone"
                name={["address_details", "phone"]}
                rules={[
                  {
                    pattern: /^\+?\d+$/,
                    message: "Enter a valid phone number!",
                  },
                ]}
              >
                <Input
                  disabled={
                    existingSubscription != {} &&
                    (mode == "view" ||
                      (mode == "edit" && edit["shippingDetails"] == false))
                  }
                />
              </Form.Item>

              <Form.Item
                label={<p className="revlytic required">City</p>}
                name={["address_details", "city"]}
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                  {
                    validator: (rule, value) => {
                      if (!value) {
                        return Promise.reject("City is required!");
                      } else if (value.trim() === "") {
                        return Promise.reject("City is required!");
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  disabled={
                    existingSubscription != {} &&
                    (mode == "view" ||
                      (mode == "edit" && edit["shippingDetails"] == false))
                  }
                />
              </Form.Item>
            </div>
            <div className="revlytic shipping-details">
              <Form.Item
                label={<p className="revlytic required">Zip</p>}
                name={["address_details", "zip"]}
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                  {
                    validator: (rule, value) => {
                      if (!value) {
                        return Promise.reject("Zip is required!");
                      } else if (value.trim() === "") {
                        return Promise.reject("Zip is required!");
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  disabled={
                    existingSubscription != {} &&
                    (mode == "view" ||
                      (mode == "edit" && edit["shippingDetails"] == false))
                  }
                />
              </Form.Item>

              <Form.Item label="Company" name={["address_details", "company"]}>
                <Input
                  disabled={
                    existingSubscription != {} &&
                    (mode == "view" ||
                      (mode == "edit" && edit["shippingDetails"] == false))
                  }
                />
              </Form.Item>
            </div>
            <div className="revlytic shipping-details-country">
              <Form.Item
                label={<p className="revlytic required">Country</p>}
                name={["address_details", "country"]}
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                  {
                    validator: (rule, value) => {
                      if (!value) {
                        return Promise.reject("Country is required!");
                      } else if (value.trim() === "") {
                        return Promise.reject("Country is required!");
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Select
                  showSearch
                  // placeholder="Search to Select"
                  // optionFilterProp={countriesData}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={countriesName}
                  disabled={
                    existingSubscription != {} &&
                    (mode == "view" ||
                      (mode == "edit" && edit["shippingDetails"] == false))
                  }
                />
              </Form.Item>

              {provincesName.length > 0 ||
              (mode == "view" &&
                existingSubscription?.shipping_address?.province) ||
              (mode == "edit" &&
                existingSubscription?.shipping_address?.province &&
                provincesName.length > 0) ? (
                <>
                  <Form.Item
                    label={<p className="revlytic required">State/Province</p>}
                    name={["address_details", "province"]}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.reject("Province is required!");
                          } else if (value.trim() === "") {
                            return Promise.reject("Province is required!");
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      // placeholder="Search to Select"
                      // optionFilterProp={countriesData}
                      onChange={(e) => {
                        e && setProvinceError(false);
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={provincesName}
                      disabled={
                        existingSubscription != {} &&
                        (mode == "view" ||
                          (mode == "edit" && edit["shippingDetails"] == false))
                      }
                    />
                    {/* {provinceError ? (
                      <p style={{ color: "red" }}>Province is required!!</p>
                    ) : null} */}
                  </Form.Item>
                </>
              ) : null}

              <Form.Item
                label="Delivery/Shipping Price"
                name={["address_details", "deliveryPrice"]}
                // initialValue={""}
                rules={[
                  {
                    pattern: /^\s*\d+(\.\d+)?\s*$/,
                    message: "Price can only be a number or decimal value!",
                  },
                ]}
              >
                <Input
                  disabled={
                    existingSubscription != {} &&
                    (mode == "view" ||
                      (mode == "edit" && edit["shippingDetails"] == false))
                  }
                  prefix={currency && getCurrencySymbol(currency)}
                />
              </Form.Item>
            </div>
          </Card>
        ) : null}

        {existingSubscription != {} &&
        (mode == "view" || mode == "edit") ? null : (
          <Tooltip
            color="#ffffff"
            title={
              billingPlan != "starter" &&
              billingPlan != "premium" &&
              billingPlan != "premiere" ? (
                <Link to={`/billing?option=checkoutlink`}>
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
            >
              Create Checkout Link
            </Button>
          </Tooltip>
        )}
      </Form>

      {(mode == "view" || mode == "edit") && existingSubscription ? (
        existingSubscription?.subscription_details?.planType == "payAsYouGo" ? (
          <Orders
            data={existingSubscription}
            upcomingOrders={upcomingOrders}
            setLoader={setLoader}
            attemptedOrders={attemptedOrders}
            fetchDataUpcomingOrders={fetchDataUpcomingOrders}
            storeDetails={storeDetails}
            setExistingSubscription={setExistingSubscription}
            setNextBillingDate={setNextBillingDate}
            pastOrders={pastOrders}
            skippedOrders={skippedOrders}
            mode={mode}
            billingPlan={billingPlan}
          />
        ) : (
          <Fulfillments
            data={existingSubscription}
            fullfillmentDataMain={fullfillmentDataMain}
            setFullfillmentDataMain={setFullfillmentDataMain}
            setLoader={setLoader}
            setExistingSubscription={setExistingSubscription}
            storeDetails={storeDetails}
            setNextBillingDate={setNextBillingDate}
            pastOrders={pastOrders}
            mode={mode}
            billingPlan={billingPlan}
          />
        )
      ) : (
        ""
      )}
      <CalculateBillingUsage setBillingPlan={setBillingPlan} />

      <Modal
        // title="Create Customer "
        maskClosable={false}
        open={createCustomerModal}
        onCancel={() => {
          setCreateCustomerModal(false);
        }}
        footer={[]}
        className="revlytic-new-cutomer-container-modal"
      >
        <div className="revlytic new-customer-modal">
          <div className="revlytic new-customer-modal-title">New Customer</div>

          <Form
            form={form2}
            // name="basic"
            requiredMark={false}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={handleCreateCustomer}
            //   onFinishFailed={onFinishFailedproduct}

            autoComplete="off"
          >
            <div className="revlytic customer-modal-name">
              <Form.Item
                label={<p className="revlytic required">First Name</p>}
                name="firstName"
                rules={[
                  {
                    required: true,

                    message: "",
                  },
                  {
                    validator: (rule, value) => {
                      if (!value) {
                        return Promise.reject("First Name is required!");
                      } else if (value.trim() === "") {
                        return Promise.reject("First Name is required!");
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Last Name" name="lastName">
                <Input />
              </Form.Item>
            </div>

            <div className="revlytic customer-modal-email-phone">
              <Form.Item
                label={<p className="revlytic required">Email</p>}
                name="email"
                rules={[
                  {
                    required: true,

                    message: "Please enter email!",
                  },

                  {
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,

                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<p className="revlytic required">Phone Number</p>}
                name="phone"
                rules={[
                  {
                    required: true,

                    message: "",
                  },

                  {
                    pattern: /^\+?\d+$/,
                    message: "Enter a valid phone number!",
                  },

                  {
                    validator: (rule, value) => {
                      if (!value) {
                        return Promise.reject("Phone Number is required!");
                      } else if (value.trim() === "") {
                        return Promise.reject("Phone Number is required!");
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="revlytic customer-modal-submit">
              <Form.Item
                wrapperCol={{
                  offset: 8,

                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit" disabled={loader}>
                  <p className="revlytic create-customer-icon">
                    <PlusCircleOutlined /> Submit
                  </p>
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>

      <Modal
        title="Checkout Link"
        maskClosable={false}
        onCancel={() => setCopyLink(false)}
        open={copyLink}
        footer={[
          <Button
            type="primary"
            disabled={loader}
            onClick={() => {
              //console.log("dsa");
              setCopyLink(false);
              sendMail();
            }}
          >
            Send Email
          </Button>,
          <Button
            type="primary"
            onClick={() => {
              copy(copyText);
              toast.info("Copied!", {
                position: toast.POSITION.TOP_RIGHT,
              });
              setCopyLink(false);
            }}
          >
            Copy Link
          </Button>,
        ]}
      >
        <p>{copyText}</p>
      </Modal>
    </Spin>
  );
}

export default CreateManualSubscription;
