import {
  Button,
  Checkbox,
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
  Tooltip,
} from "antd";
import dayjs from "dayjs";

import { useEffect, useState, useRef } from "react";
import { useForm } from "antd/lib/form/Form";
import postApi from "./common/postApi";
import { useAppBridge, ResourcePicker } from "@shopify/app-bridge-react";
import { useNavigate } from "@shopify/app-bridge-react";
import pic from "../assets/images/image2.png";
import AddProduct from "../pages/Addproduct";
import { useAPI } from "./common/commonContext";
// import { Carousel } from "antd";
import Slider from "react-slick";

// import Toast from "./notification/Toast";

// import { Swiper, SwiperSlide } from 'swiper/react';

import { toast } from "react-toastify";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  UpOutlined,
} from "@ant-design/icons";

const PlanForm = (props) => {
  const app = useAppBridge();
  const navigate = useNavigate();
  const { currency, storeName } = useAPI();
  // //console.log(currency, "lkjh");
  const getCurrencySymbol = (currency) => {
    const symbol = new Intl.NumberFormat("en", { style: "currency", currency })
      .formatToParts()
      .find((x) => x.type === "currency");
    return symbol && symbol.value;
  };
  const sliderRef = useRef(null);

  const [form] = useForm();
  const [form1] = useForm();

  const [billingEvery, setBillingEvery] = useState("month"); //////// billing every dropdown value
  const [offerPriceSelect, setOfferPriceSelect] = useState("percentage"); ////dropdown value fpr fixed and percentage options in form pricetype
  const [plansList, setPlansList] = useState([]); /// contains list of new plans created
  const [buttonText, setButtonText] = useState(true);
  const [editIndex, setEditIndex] = useState(""); ///specifies index of plan in array to be edited
  const [initialPlans, setinitialPlans] = useState([]); //// contains list of previous existing plans of a plan group
  const [editdedPlans, seteditdedPlans] = useState();
  const [loader, setLoader] = useState(false); // for loader
  const [deletedPlanIds, setDeletedPlanIds] = useState([]); ////contains the list of previous plans to be deleted
  const [editExistingPlan, setEditExistingPlan] = useState(false); //// state to check if existing plan group is being edited
  const [editNewPlan, setEditNewPlan] = useState(false); //// state to check if new plan is being edited

  const [editedArrayIds, seteditedArrayIds] = useState([]); /// contains the list of ids of  previous plans to be edited
  const [planGroupId, setPlanGroupId] = useState("");
  const [openForm, setOpenForm] = useState(false); //// state to show hide the form
  const [modal, setModal] = useState(false); //// mmodal state for resourcepicker
  const [products, setProducts] = useState([]); //// listof product to be displayed in ui
  const [dbProducts, setDbProducts] = useState([]); ////list of products in plan group
  const [checkedIds, setCheckedIds] = useState([]); ///// pre selected products passed to resourcepicker
  const [prevPlanDel, setPrevPlanDel] = useState({}); //// to be deleted index and data of prevplan array
  const [currentPlanDel, setcurrentPlanDel] = useState(""); ///array to be deleted index of current plan
  const [isModalOpenCurrent, setIsModalOpenCurrent] = useState(false); /// modal state for deleting current plan from list
  const [isModalOpenPrev, setIsModalOpenPrev] = useState(false); /// modal state for deleting previous plan from list
  const [addproductModal, setaddproductModal] = useState(false); ///modal for create product form
  const [setupProductToBeDeleted, setSetupProductToBeDeleted] = useState([]); /// lisrt of setup products to be deleted
  const [advanceOptions, setAdvanceOptions] = useState(false); //// to toggole advance options menu
  const [planGroupName, setPlanGroupName] = useState(""); ///plan group name
  const [previewData, setpreviewData] = useState({
    productIndex: "",
    varientIndex: "",
    src: pic,
    name: "Dummy",
    price: 100,
  }); ///////////////////////////////////////////preview modal data
  const [previewDropdown, setPreviewDropdown] = useState([]); /////////// frequency dropdown in preview modal
  const [planpreviewPrice, setPlanpreviewPrice] = useState(100); ///////////// plan price based on selected frequency plan in preview modal
  const [dropdownValue, setDropdownValue] = useState(previewDropdown[0]); ////preview modal dropdown value
  const [allPlanGroupNames, setAllPlanGroupNames] = useState([]); ////////// list of allplan groupname to check the uniqueness
  const [previewproductid, setpreviewproductid] = useState("");
  const [preview, setPreview] = useState(
    "This subscription is a Pay As You Go plan. The customer will receive a delivery and be billed every 1 month(s).  Additionally, this plan will renew automatically until canceled."
  );
  // //console.log(previewDropdown);

  const week = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28,
  ];

  // const contentStyle = {
  //   margin: 0,
  //   height: "160px",
  //   lineHeight: "160px",
  //   color: "#fff",
  //   textAlign: "center",
  //   background: "#364d79",
  // };

  // const onChange = (currentSlide) => {
  //   //console.log(currentSlide);
  // };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    // autoplay: true,
    // autoplaySpeed: 2000,
    responsive: [
      // {
      //   breakpoint: 1800,
      //   settings: {
      //     slidesToShow: 2,
      //     slidesToScroll: 1,
      //   },
      // },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const selectAfter = (
    <Select
      name="ddd"
      value={billingEvery}
      onChange={(e) => {
        //console.log(form.getFieldsValue(),"fhsdfsdhkjsdhfbhj")
        setBillingEvery(e);
        if (buttonText) {
          let values = form.getFieldsValue();
          previewCommon({ ...values, billingEveryType: e });
        } else {
          editExistingPlan
            ? previewCommon({ ...initialPlans[editIndex], billingEveryType: e })
            : previewCommon({ ...plansList[editIndex], billingEveryType: e });
        }
        // form.validateFields();
      }}
    >
      <Select.Option value="day">Day(s)</Select.Option>
      <Select.Option value="week">Week(s)</Select.Option>
      <Select.Option value="month">Month(s)</Select.Option>
      <Select.Option value="year">Year(s)</Select.Option>
    </Select>
  );

  const selectAfterPrice = (
    <Select
      name="ddd"
      value={offerPriceSelect}
      onChange={(e) => {
        setOfferPriceSelect(e);
      }}
    >
      <Select.Option value="percentage">Percentage</Select.Option>
      <Select.Option value="fixed">Fixed</Select.Option>
    </Select>
  );

  const freeTrialPeriodType = (
    <Select
      name="ddd"
      value={offerPriceSelect}
      onChange={(e) => {
        setOfferPriceSelect(e);
      }}
    >
      <Select.Option value="percentage">Percentage</Select.Option>
      <Select.Option value="fixed">Fixed</Select.Option>
    </Select>
  );
  // useEffect(() => {
  //   form.validateFields(); // Trigger validation on form initialization
  //   //console.log("checkkinggggggg");
  // }, [billingEvery, offerPriceSelect, form]);
  // useEffect(() => {
  //   form.validateFields(["billingEvery"]);
  //   form.validateFields(["price"])+
  // }, [billingEvery,offerPriceSelect]);
  useEffect(() => {
    let arr = [];
    plansList.map((el, index) => {
      //console.log(el, "go");
      let name = el.planType == "payAsYouGo" ? "(Pay As You Go)" : "(Prepaid)";
      let typeName =
        el.billingEveryType == "week"
          ? "Week(s)"
          : el.billingEveryType == "month"
          ? "Month(s)"
          : el.billingEveryType == "day"
          ? "Day(s)"
          : el.billingEveryType == "year"
          ? "Year(s)"
          : "";
      arr.push({
        // label: el.billingEvery + " " + typeName + " " + name,
        label: el.planName,

        value: el.priceType + "new" + index,
        price: el.price,
        billing: el.billingEvery,
        delivery: el.deliveryEvery,
        interval: typeName,
        planType: name,
      });
    });
    initialPlans.map((el, index) => {
      let name = el.planType == "payAsYouGo" ? "(Pay As You Go)" : "(Prepaid)";
      let typeName =
        el.billingEveryType == "week"
          ? "Week(s)"
          : el.billingEveryType == "month"
          ? "Month(s)"
          : el.billingEveryType == "day"
          ? "Day(s)"
          : el.billingEveryType == "year"
          ? "Year(s)"
          : "";
      arr.push({
        // label: el.billingEvery + " " + typeName + " " + name,
        label: el.planName,
        value: el.priceType + "old" + index,
        price: el.price,
        billing: el.billingEvery,
        delivery: el.deliveryEvery,
        interval: typeName,
        planType: name,
      });
    });
    setPreviewDropdown(arr);
    setDropdownValue(arr[0]);
  }, [initialPlans, plansList]);
  //console.log(dropdownValue, "sdsdsd");
  useEffect(() => {
    setProducts(products);
    // props.setProductList(products)
  }, [products]);

  useEffect(() => {
    // //console.log(props.pid);
    if (props.pid != "new") {
      getProductPlansList();
    } else {
      getAllPlanGroupNames("new");
    }
  }, []);
  const getAllPlanGroupNames = async (flag, name) => {
    let data = await postApi("/api/admin/getAllPlanGroupNames", {}, app);
    if (data) {
      // //console.log(data?.data?.data, "jklmnb");
      let arr = [];
      data?.data?.data.map((element) => {
        arr.push(element.plan_group_name.toLowerCase());
      });
      if (flag == "old") {
        arr = arr.filter((item) => item !== name.toLowerCase());
      }
      setAllPlanGroupNames(arr);
    }
  };
  const getProductPlansList = async () => {
    setLoader(true);
    let res = await postApi(
      "/api/admin/getProductPlanList",
      { pid: props.pid },
      app
    );
    console.log(res,"oo");
    setLoader(false);
    if (res?.data?.message == "success") {
      setProducts(res?.data?.data?.product_details);
      setpreviewproductid(res?.data?.data?.product_details[0].handle);
      res?.data?.data?.product_details.map((item, productIndex) => {
        if (productIndex == 0) {
          let variants = [];
          item.variants.map((itm, varientIndex) => {
            if (varientIndex == 0) {
              variants.push({ id: itm.id });

              // ///////////////////// to set the first time preview image(first product)
              setpreviewData({
                productIndex: productIndex,
                varientIndex: varientIndex,
                src: itm?.image
                  ? itm?.image
                  : item?.product_image
                  ? item?.product_image
                  : pic,
                price: itm.price,
                name: item.hasOnlyDefaultVariant
                  ? item.product_name
                  : itm.title,
              });

              // //////////////////////////
              ///////////////// // to set first time preview plan price based on selected dropdown value
              if (res?.data?.data?.plans[0].price != undefined) {
                if (res?.data?.data?.plans[0].priceType == "percentage") {
                  setPlanpreviewPrice(
                    itm.price -
                      (itm.price * res?.data?.data?.plans[0].price) / 100
                  );
                } else if (res?.data?.data?.plans[0].priceType == "fixed") {
                  setPlanpreviewPrice(
                    itm.price - res?.data?.data?.plans[0].price > 0
                      ? itm.price - res?.data?.data?.plans[0].price
                      : 0
                  );
                }
              } else {
                setPlanpreviewPrice(itm.price);
              }
              // /////////////////////////////
            }
          });
        }
      });

      let ids = [];
      res?.data?.data?.product_details.map((item) => {
        let variants = [];
        item.variants.map((itm) => {
          variants.push({ id: itm.id });
        });
        ids.push({
          id: item.product_id,
          variants: variants,
        });
      });
      setCheckedIds(ids);
      //console.log(res?.data?.data?.plan_group_name, "ghghghg");
      setPlanGroupName(res?.data?.data?.plan_group_name);
      getAllPlanGroupNames("old", res?.data?.data?.plan_group_name);
      setinitialPlans(res?.data?.data?.plans);
      res?.data?.data?.product_details &&
        setDbProducts(
          JSON.parse(JSON.stringify(res?.data?.data?.product_details))
        );
    }

    // setPlanGroupId(res?.data?.data?.plan_group_id);
    // //console.log(res?.data?.data?.product_details);
    // res?.data?.data?.plans &&
    //   seteditdedPlans(JSON.parse(JSON.stringify(res?.data?.data?.plans)));
  };
  // //console.log(initialPlans);
  function handleFormChange(changedData, b) {
    //console.log("inchanges", changedData);

    if (changedData?.planType == "prepaid") {
      //console.log("prepaid");

      form.setFieldsValue({
        billingEvery: 2,
        deliveryEvery: 1,
      });
    }

    if (changedData?.planType == "payAsYouGo") {
      //console.log("payAsYouGo");

      form.setFieldsValue({
        billingEvery: "1",
      });

      form.setFieldsValue({
        billingCycle: true,
      });
    }

    let data;

    let data2;

    if (form.getFieldValue("planType") == "payAsYouGo") {
      //console.log("sahil");

      data =
      `This subscription is a Pay As You Go plan. The customer will receive a delivery and be billed every ` +
        `${form.getFieldValue(
          "billingEvery"
        ) ?  form.getFieldValue(
          "billingEvery"
        ) : "{Input for bill every}"}  ${form.getFieldValue(
          "billingEveryType"
        )?.toLowerCase()}(s).`;
    } else {
      //console.log("sahil2");

      data =
      `This subscription is a Prepaid plan. The length of the subscription is `  +
      `${
          form.getFieldValue("billingEvery")
            ? form.getFieldValue("billingEvery")
            : "{Input for prepaid length}"
        }  ${form.getFieldValue(
          "billingEveryType"
        )?.toLowerCase()}(s) and the customer will be billed upfront.` +
        ` The customer will receive a delivery every ${
          form.getFieldValue("deliveryEvery")
            ? form.getFieldValue("deliveryEvery")
            : form.getFieldValue("deliveryEvery") == undefined
            ? 1
            : form.getFieldValue("deliveryEvery") == ""
            ? "{Input for delivery every value}"
            : null
        } ${form.getFieldValue(
          "billingEveryType"
        )?.toLowerCase()}(s).`;
    }

    if (form.getFieldValue("billingCycle") == false) {
      //console.log("sahl3");

      data2 = ` Additionally, this plan will not renew automatically.`;
    } else {
      //console.log("sahl4");

      data2 = ` Additionally, this plan will renew automatically until canceled.`;
    }

    setPreview(data + data2);
  }

  const editPlanHandler = (elements, index) => {
    previewCommon(elements);
    form.validateFields();
    setOpenForm(true);
    setEditNewPlan(true);
    setEditIndex(index);
    setButtonText(false);
    //console.log("hahgggggggggah", elements);

    let obj = {
      planName: elements.planName,
      price: elements.offerDiscount ? parseInt(elements.price) : "",
      billingEvery: parseInt(elements.billingEvery),
      billingCycle: elements.billingCycle,
      billingEveryType: elements.billingEveryType,
      setupFee: elements.setupFee,
      offerDiscount: elements.offerDiscount,
      freeTrial: elements.freeTrial,
      startDate: dayjs(new Date(elements.startDate)),
      minCycle: elements.minCycle,
      maxCycle: elements.maxCycle,
      planType: elements.planType,
    };
    
    if(elements.freeTrial){
      obj.trialCount = elements.trialCount;
      obj.freeTrialCycle = elements.freeTrialCycle
    } 
    // elements.freeTrial ? (obj.trialCount = elements.trialCount) : "";
    elements.deliveryEvery
      ? (obj.deliveryEvery = parseInt(elements.deliveryEvery))
      : "";

    // elements.billingCycle == "cancel_after"
    //   ? (obj.billingCycleCount = parseInt(elements.billingCycleCount))
    //   : "";

    // if (elements.billingEveryType === "week") {
    //   obj.billingWeek = elements.billingWeek;
    // } else if (elements.billingEveryType === "month") {
    //   obj.billingMonth = elements.billingMonth;
    // } else if (elements.billingEveryType === "year") {
    //   obj.billingYear = elements.billingYear;
    //   obj.billingMonth = elements.billingMonth;
    // }
    if (elements.setupFee) {
      obj.setupPrice = elements.setupPrice;
    }

    console.log("cheksjdskjd",obj);
    form.setFieldsValue(obj);
    setBillingEvery(elements.billingEveryType);
    setOfferPriceSelect(elements.priceType);
  };

  const deletePlan = (index) => {
    setOpenForm(false);

    let arr = [...plansList];
    arr.splice(index, 1);
    setPlansList(arr);
    form.resetFields();
    setIsModalOpenCurrent(false);
  };

  const editPrevPlanHandler = (elements, index) => {
    previewCommon(elements);

    //console.log("afgagfasfhkashf");
    form.validateFields();
    setOpenForm(true);
    //console.log(elements);
    setEditExistingPlan(true);
    setButtonText(false);
    setEditIndex(index);

    let obj = {
      planName: elements.planName,
      price: elements.offerDiscount ? parseInt(elements.price) : "",
      billingEvery: parseInt(elements.billingEvery),
      billingCycle: elements.billingCycle,
      billingEveryType: elements.billingEveryType,
      setupFee: elements.setupFee,
      offerDiscount: elements.offerDiscount,
      freeTrial: elements.freeTrial,
      startDate: dayjs(new Date(elements.startDate)),
      minCycle: elements.minCycle,
      maxCycle: elements.maxCycle,
      planType: elements.planType,
    };

    if(elements.freeTrial){
      obj.trialCount = elements.trialCount;
      obj.freeTrialCycle = elements.freeTrialCycle
    } 

    // elements.freeTrial ? (obj.trialCount = elements.trialCount) : "";
    elements.deliveryEvery
      ? (obj.deliveryEvery = parseInt(elements.deliveryEvery))
      : "";

    // elements.billingCycle == "cancel_after"
    //   ? (obj.billingCycleCount = parseInt(elements.billingCycleCount))
    //   : "";
    // if (elements.billingEveryType === "week") {
    //   obj.billingWeek = elements.billingWeek;
    // } else if (elements.billingEveryType === "month") {
    //   obj.billingMonth = elements.billingMonth;
    // } else if (elements.billingEveryType === "year") {
    //   obj.billingYear = elements.billingYear;
    //   obj.billingMonth = elements.billingMonth;
    // }
    if (elements.setupFee) {
      obj.setupPrice = elements.setupPrice;
    }
    console.log(obj);
    form.setFieldsValue(obj);
    setBillingEvery(elements.billingEveryType);
    setOfferPriceSelect(elements.priceType);
  };
  // //console.log(editedArrayIds)
  const deletePrevPlan = (
    data = prevPlanDel.data,
    index = prevPlanDel.index
  ) => {
    //console.log(data);
    setOpenForm(false);

    let Planarr = [...initialPlans];
    Planarr.splice(index, 1);
    setinitialPlans(Planarr);
    console.log(data);

    let arr = [...deletedPlanIds];
    arr.push(data.data.plan_id);
    setDeletedPlanIds(arr);
    if (data.setupProductId) {
      let arr1 = [...setupProductToBeDeleted];
      arr1.push(data.setupProductId);
      setSetupProductToBeDeleted(arr1);
    }

    setIsModalOpenPrev(false);
  };
  // console.log(deletedPlanIds, "ajlkj");

  const onFinish = (values) => {
    //console.log(values, "kkk");

    if (editExistingPlan) {
      console.log("1check")
      //console.log(initialPlans);
      let idArr = [...editedArrayIds];
      idArr.push(editIndex);
      seteditedArrayIds(idArr);
      let arr = [...initialPlans];
      let elements = form.getFieldsValue();
      //console.log(elements);
      //console.log(arr);

      let obj = elements;
      obj.setupProductId = arr[editIndex].setupProductId;
      obj.plan_id = arr[editIndex].plan_id;
      // obj.billingEveryType = billingEvery;
      obj.priceType = offerPriceSelect;
      arr[editIndex] = obj;
      setinitialPlans(arr);
      setButtonText(true);
      form.resetFields();
      setOpenForm(false);
      setEditExistingPlan(false);
    } else if (editNewPlan) {
      console.log("2check")
      let arr = [...plansList];
      arr[editIndex] = form.getFieldsValue();
      // arr[editIndex].billingEveryType = billingEvery;
      arr[editIndex].priceType = offerPriceSelect;
      setPlansList(arr);
      // arr
      // //console.log("object", form.getFieldsValue());

      setButtonText(true);
      form.resetFields();
      setOpenForm(false);
      setEditNewPlan(false);
    } else {
      console.log("3check")
      // values.billingEveryType = billingEvery;
      values.priceType = offerPriceSelect;
      console.log("values",values);
      // //console.log(values.billingEvery.addonAfter);
      let arr = [...plansList];
      arr.push(values);
      setPlansList(arr);
      form.resetFields();
      setOpenForm(false);
      setEditNewPlan(false);
      setEditExistingPlan(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    // //console.log("Failed:", errorInfo);
  };
  // //console.log(initialPlans)
  const handleUpdate = () => {
    //console.log(form.getFieldsError().some((field) => field.errors.length));
    //console.log;
    if (
      form.getFieldsError().some((field) => field.errors.length) ||
      form.getFieldValue("offerDiscount") == ""
    ) {
      // Toast("warning", "Please set all form fields correctly", "topRight")
      toast.warn("Please set all form fields correctly", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    // else if (form.get) {

    // }
    else {
      if (editExistingPlan) {
        //console.log(initialPlans);
        let idArr = [...editedArrayIds];
        idArr.push(editIndex);
        seteditedArrayIds(idArr);
        let arr = [...initialPlans];
        let elements = form.getFieldsValue();
        //console.log(elements);
        //console.log(arr);

        let obj = elements;
        obj.setupProductId = arr[editIndex].setupProductId;
        obj.plan_id = arr[editIndex].plan_id;
        // obj.billingEveryType = billingEvery;
        obj.priceType = offerPriceSelect;
        arr[editIndex] = obj;
        setinitialPlans(arr);
        setButtonText(true);
        form.resetFields();
        // setOpenForm(false);
        setEditExistingPlan(false);
      } else {
        let arr = [...plansList];
        arr[editIndex] = form.getFieldsValue();
        // arr[editIndex].billingEveryType = billingEvery;
        arr[editIndex].priceType = offerPriceSelect;
        setPlansList(arr);
        // arr
        // //console.log("object", form.getFieldsValue());

        setButtonText(true);
        form.resetFields();
        // setOpenForm(false);
        setEditNewPlan(false);
      }
    }
  };

  const createPlanGroup = async () => {
    //console.log(allPlanGroupNames.includes(planGroupName));
    if (products.length < 1) {
      // Toast("warning", "Please select products", "topRight");
      toast.warn("Please add at least one product to this plan.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (
      planGroupName.length < 1 ||
      allPlanGroupNames.includes(planGroupName.toLowerCase())
    ) {
      toast.warn("Please enter a valid plan name.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (initialPlans.length < 1 && plansList.length < 1) {
      // Toast("error", "minimun one plan required", "topRight");
      toast.warn("Minimun one plan required", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      if (initialPlans.length < 1) {
        setLoader(true);
        let data = await postApi(
          "/api/admin/createSellingPlanGroup",
          {
            plansList: plansList,
            productList: products,
            planGroupName: planGroupName,
          },
          app
        );
        setLoader(false);

        if (data?.data?.message == "success") {
          // Toast("success", "PlanGroup created Successfully");
          toast.success("Plan created successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
          navigate("/manageplans");
        } else if (data?.data?.message == "userError") {
          data?.data?.data?.map((element) => {
            // Toast("error", element.message);
            toast.warn(element.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
          });
        } else if (data?.data?.message == "error") {
          // Toast("error", data?.data?.data);
          toast.warn(data?.data?.data, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } else {
        // //console.log("afhhhhhadkgjhkfyu");
        setLoader(true);
        let data = await postApi(
          "/api/admin/updateSellingPlanGroup",
          {
            pid: props.pid,
            productList: products,
            editedArrayIds: editedArrayIds,
            initialPlans: initialPlans,
            newPlans: plansList,
            deletedPlans: deletedPlanIds,
            planid: planGroupId,
            dbvarient: dbProducts,
            deletedSetupProducts: setupProductToBeDeleted,
            planGroupName: planGroupName,
          },
          app
        );
        setLoader(false);
        if (data?.data?.message == "success") {
          // Toast("success", "PlanGroup created Successfully");
          toast.success("Plan updated successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setOpenForm(false);
          form.resetFields()
          setPlansList([]);
          setinitialPlans([]);
          setButtonText(true);
          setEditIndex("");
          setDeletedPlanIds([]);
          setEditExistingPlan(false);
          setEditNewPlan(false);
          seteditedArrayIds([]);
          setModal(false);
          setProducts([]);
          setDbProducts([]);
          setCheckedIds([]);
          setPrevPlanDel({});
          setcurrentPlanDel("");
          setIsModalOpenCurrent(false);
          setIsModalOpenPrev(false);
          setaddproductModal(false);
          setSetupProductToBeDeleted([]);
          setpreviewproductid("");

          getProductPlansList();
          // navigate("/");
        } else if (data?.data?.message == "userError") {
          data?.data?.data?.map((element) => {
            // Toast("error", element.message);
            toast.warn(element.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
          });
        } else if (data?.data?.message == "error") {
          // Toast("error", data?.data?.data);
          toast.warn(data?.data?.data, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        // //console.log(data, "dfdf");
      }
    }
    // data && props.setLoader(false);
  };

  const nameValidator = (rule, value) => {
    //console.log(editExistingPlan, editNewPlan);
    if (editNewPlan) {
      // //console.log("hahahahhah", editIndex)
      let arr = [...plansList];
      arr.splice(editIndex, 1);

      const isDuplicate =
        arr.length > 0
          ? arr.some(
              (plan) => plan.planName.toLowerCase() === value.toLowerCase()
            )
          : false;
      const isDuplicate1 =
        initialPlans.length > 0
          ? initialPlans.some(
              (plan) => plan?.planName?.toLowerCase() === value?.toLowerCase()
            )
          : false;
      if (isDuplicate || isDuplicate1) {
        // //console.log("hahah");
        return Promise.reject("Frequency Plan Name should be unique!");
      }
      return Promise.resolve();
    } else if (editExistingPlan) {
      const isDuplicate =
        plansList.length > 0
          ? plansList.some(
              (plan) => plan?.planName?.toLowerCase() === value?.toLowerCase()
            )
          : false;
      //console.log("dddd", isDuplicate);

      let arr = [...initialPlans];
      arr.splice(editIndex, 1);
      const isDuplicate1 =
        arr.length > 0
          ? arr.some(
              (plan) => plan?.planName?.toLowerCase() === value?.toLowerCase()
            )
          : false;
      //console.log("ffff", isDuplicate1);

      if (isDuplicate || isDuplicate1) {
        //console.log("hahah");
        return Promise.reject("Frequency Plan Name should be unique!");
      }
      return Promise.resolve();
    } else {
      const isDuplicate =
        plansList.length > 0
          ? plansList.some(
              (plan) => plan?.planName?.toLowerCase() === value?.toLowerCase()
            )
          : false;
      const isDuplicate1 =
        initialPlans.length > 0
          ? initialPlans.some(
              (plan) => plan?.planName?.toLowerCase() === value?.toLowerCase()
            )
          : false;
      if (isDuplicate || isDuplicate1) {
        // //console.log("hahah");
        return Promise.reject("Frequency Plan Name should be unique!");
      }
      return Promise.resolve();
    }
  };

  const billingFreqValidator = (rule, value) => {
    // //console.log("object", initialPlans);
    if (editNewPlan) {
      let arr = [...plansList];
      arr.splice(editIndex, 1);

      const isDuplicate =
        arr.length > 0
          ? arr.some(
              (plan) =>
                plan.billingEvery == value &&
                plan.billingEveryType === billingEvery
            )
          : false;
      const isDuplicate1 =
        initialPlans.length > 0
          ? initialPlans.some(
              (plan) =>
                plan.billingEvery == value &&
                plan.billingEveryType === billingEvery
            )
          : false;

      if (isDuplicate || isDuplicate1) {
        return Promise.reject(
          "Frequency plan with same bill every already exists!"
        );
      }
      return Promise.resolve();
    } else if (editExistingPlan) {
      const isDuplicate =
        plansList.length > 0
          ? plansList.some(
              (plan) =>
                plan.billingEvery == value &&
                plan.billingEveryType === billingEvery
            )
          : false;
      //console.log("dddd", isDuplicate);

      let arr = [...initialPlans];
      arr.splice(editIndex, 1);
      const isDuplicate1 =
        arr.length > 0
          ? arr.some(
              (plan) =>
                plan.billingEvery == value &&
                plan.billingEveryType === billingEvery
            )
          : false;
      //console.log("ffff", isDuplicate1);

      if (isDuplicate || isDuplicate1) {
        //console.log("hahah");
        return Promise.reject(
          "Frequency plan with same bill every already exists!"
        );
      }
      return Promise.resolve();
    } else {
      const isDuplicate =
        plansList.length > 0
          ? plansList.some(
              (plan) =>
                // {
                //   //console.log(plan.deliveryEvery,"khkhkh");

                //   }
                plan.billingEvery == value &&
                !plan.deliveryEvery &&
                plan.billingEveryType === billingEvery
            )
          : false;
      const isDuplicate1 =
        initialPlans.length > 0
          ? initialPlans.some(
              (plan) =>
                plan.billingEvery == value &&
                !plan.deliveryEvery &&
                plan.billingEveryType === billingEvery
            )
          : false;

      if (isDuplicate || isDuplicate1) {
        return Promise.reject(
          "Frequency plan with same bill every already exists!"
        );
      }
      return Promise.resolve();
    }
  };
  const prepaidBillingValidator = (rule, value) => {
    if (editNewPlan) {
      let arr = [...plansList];
      arr.splice(editIndex, 1);
      // //console.log(
      //   plan.deliveryEvery == form.getFieldValue("deliveryEvery"),
      //   "lklk"
      // );
      const isDuplicate =
        arr.length > 0
          ? arr.some(
              (plan) =>
                plan.billingEvery == value &&
                plan.deliveryEvery == form.getFieldValue("deliveryEvery") &&
                plan.billingEveryType === billingEvery
            )
          : false;
      const isDuplicate1 =
        initialPlans.length > 0
          ? initialPlans.some(
              (plan) =>
                plan.billingEvery == value &&
                plan.deliveryEvery == form.getFieldValue("deliveryEvery") &&
                plan.billingEveryType === billingEvery
            )
          : false;
      //console.log(isDuplicate, isDuplicate1, "hhhh");

      if (isDuplicate || isDuplicate1) {
        return Promise.reject(
          "Frequency plan with same prepaid length & delivery every already exists!"
        );
      }
      return Promise.resolve();
    } else if (editExistingPlan) {
      const isDuplicate =
        plansList.length > 0
          ? plansList.some(
              (plan) =>
                plan.billingEvery == value &&
                plan.deliveryEvery == form.getFieldValue("deliveryEvery") &&
                plan.billingEveryType === billingEvery
            )
          : false;
      //console.log("dddd", isDuplicate);

      let arr = [...initialPlans];
      arr.splice(editIndex, 1);
      const isDuplicate1 =
        arr.length > 0
          ? arr.some(
              (plan) =>
                plan.billingEvery == value &&
                plan.deliveryEvery == form.getFieldValue("deliveryEvery") &&
                plan.billingEveryType === billingEvery
            )
          : false;
      //console.log("ffff", isDuplicate1);

      if (isDuplicate || isDuplicate1) {
        //console.log("hahah");
        return Promise.reject(
          "Frequency plan with same prepaid length & delivery every already exists!"
        );
      }
      return Promise.resolve();
    } else {
      const isDuplicate =
        plansList.length > 0
          ? plansList.some(
              (plan) =>
                plan.billingEvery == value &&
                plan.deliveryEvery == form.getFieldValue("deliveryEvery") &&
                plan.billingEveryType === billingEvery
            )
          : false;
      const isDuplicate1 =
        initialPlans.length > 0
          ? initialPlans.some(
              (plan) =>
                plan.billingEvery == value &&
                plan.deliveryEvery == form.getFieldValue("deliveryEvery") &&
                plan.billingEveryType === billingEvery
            )
          : false;
      //console.log(isDuplicate, isDuplicate1, "bnbn");
      if (isDuplicate || isDuplicate1) {
        return Promise.reject(
          "Frequency plan with same prepaid length & delivery every already exists!"
        );
      }
      return Promise.resolve();
    }
  };
  const handleDiscountValidator = (rule, value) => {
    if (offerPriceSelect == "percentage" && parseFloat(value) > 100) {
      return Promise.reject("Percentage can't exceed 100!");
    } else {
      return Promise.resolve();
    }
  };

  const handleMaxCycle = (rule, value) => {
    if (
      form.getFieldValue("minCycle") != "" && value &&
      parseInt(value) < parseInt(form.getFieldValue("minCycle"))
    ) {
      //console.log( "kdjaskdjaskd;sl;dals;dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd");
      return Promise.reject(
        "Maximum Billing Cycles cannot be less than Minimum Billing Cycles!"
      );
    } else if (value && (!/^\d+$/.test(value) || Number(value) <= 0)) {
      return Promise.reject(new Error("Must be a number greater than zero!"));
    } else if (value && (Number(value) < Number(form.getFieldValue("trialCount")))) {
      return Promise.reject(
        new Error(
          "Maximum Billing Cycles cannot be less than Free trial count!"
        )
      );
    } else {
      form.setFields([
        {
          name: "minCycle",
          errors: [],
        },
      ]);
      form.setFields([
        {
          name: "trialCount",
          errors: [],
        },
      ]);
      return Promise.resolve();
    }
  };

  const handleMinCycle = (rule, value) => {
    if (
      form.getFieldValue("maxCycle") != "" && value &&
      parseInt(value) > parseInt(form.getFieldValue("maxCycle"))
    ) {
      //console.log( "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd" );
      return Promise.reject(
        "Minimum Billing Cycles cannot be greater than Maximum Billing Cycles!"
      );
    }
    
    else if (value && (!/^\d+$/.test(value) || Number(value) <= 0)) {
      return Promise.reject(new Error("Must be a number greater than zero!"));
    }
      
    else if (form.getFieldValue("maxCycle") && form.getFieldValue("trialCount")  &&  Number(form.getFieldValue("maxCycle")) < Number(form.getFieldValue("trialCount"))) {
      // return Promise.reject(new Error("Maximum Billing Cycles cannot be less than Free trial count!"));
      form.setFields([
        {
          name: "maxCycle",
          errors: ["Maximum Billing Cycles cannot be less than Free trial count!"],
        },
      ]);
      
    }
    
    else {
      form.setFields([
        {
          name: "maxCycle",
          errors: [],
        },
      ]);
      return Promise.resolve();
    }
  };
  

  const handlePrepaidLength = (rule, value) => {
    if (
      form.getFieldValue("deliveryEvery") != "" && value !="" && 
      parseInt(value) % parseInt(form.getFieldValue("deliveryEvery")) != 0
    ) {
      //console.log("hhhhhhhhhhhhhhhhhhhhhhhhh");

      return Promise.reject(
        "Prepaid Length value must be a multiple of Delivery Every value."
      );
    } else if (
      form.getFieldValue("deliveryEvery") != "" && value != "" &&
      parseInt(value) <= parseInt(form.getFieldValue("deliveryEvery"))
    ) {
      return Promise.reject(
        "Prepaid Length value must be greater than Delivery Every value!"
      );
    } else {
      form.setFields([
        {
          name: "deliveryEvery",
          errors: [],
        },
      ]);

      return Promise.resolve();
    }
  };

  const handlePrepaidDelivery = (rule, value) => {
    // //console.log("sssssssssfirst", parseInt(form.getFieldValue(["subscription", "billingLength"]) % parseInt(value) ))
    if (
      form.getFieldValue("billingEvery") != "" && value != '' &&
      parseInt(form.getFieldValue("billingEvery")) % parseInt(value) != 0
    ) {
      //console.log("hhhhhhhhhhhhhhhhhhhhhhhhh");
      return Promise.reject(
        "Delivery Every value must be a factor of Prepaid Length value."
      );
    } else if (
      form.getFieldValue("billingEvery") != "" && value !='' &&
      parseInt(value) >= parseInt(form.getFieldValue("billingEvery"))
    ) {
      return Promise.reject(
        "Delivery Every value must be less than Prepaid Length value!"
      );
    } else {
      form.setFields([
        {
          name: "billingEvery",
          errors: [],
        },
      ]);
      return Promise.resolve();
    }
  };
  const handleProducts = async (e) => {
    // //console.log(e.selection);
    // setLoader(true);
    let sendData = [];

    e.selection.map((item) => {
      // let id = item.id.split("/");
      // let p_id = id[id.length - 1];
      let p_id = item.id;
      let variants = [];
      item.variants.map((itm) => {
        // let id = itm.id.split("/");
        // let v_id = id[id.length - 1];
        let v_id = itm.id;
        variants.push({
          id: v_id,
          title: itm.title,
          image: itm?.image?.originalSrc ? itm.image.originalSrc : "",
          price: itm.price,
        });
      });

      sendData.push({
        product_id: p_id,
        handle: item.handle,
        product_name: item.title,
        product_image:
          item?.images.length > 0 ? item.images[0].originalSrc : "",
        hasOnlyDefaultVariant: item.hasOnlyDefaultVariant,
        variants: variants,
        subscription_type: "inactive",
      });
      
    });
    //console.log(sendData, "sebddayta");
    setProducts(sendData);

    let ids = [];
    sendData.map((item) => {
      let variants = [];
      item.variants.map((itm) => {
        variants.push({ id: itm.id });
      });
      ids.push({
        id: item.product_id,
        variants: variants,
      });
    });
    setCheckedIds(ids);

    setModal(false);
  };
  // //console.log(checkedIds);

  const handleCancel = () => {
    setModal(false);
  };

  const handleProductDelete = (index) => {
    let arr = [...products];
    arr.splice(index, 1);
    setProducts(arr);

    let ids = [];
    arr.map((item) => {
      let variants = [];
      item.variants.map((itm) => {
        variants.push({ id: itm.id });
      });
      ids.push({
        id: item.product_id,
        variants: variants,
      });
    });
    setCheckedIds(ids);
  };

  const handleVarientDelete = (index, varientIndex) => {
    if (
      varientIndex == previewData.varientIndex &&
      index == previewData.productIndex
    ) {
      setpreviewData({
        productIndex: "",
        varientIndex: "",
        name: "Dummy",
        src: pic,
        price: 100,
      });

      if (previewDropdown.length > 0) {
        //console.log("object");
        if (dropdownValue?.price != undefined) {
          if (dropdownValue.value.includes("percentage")) {
            setPlanpreviewPrice(100 - (100 * dropdownValue?.price) / 100);
          } else if (dropdownValue.value.includes("fixed")) {
            //console.log(dropdownValue);
            setPlanpreviewPrice(
              100 - dropdownValue?.price > 0 ? 100 - dropdownValue?.price : 0
            );
          }
        } else {
          setPlanpreviewPrice(100);
        }
      }
    }

    let arr = [...products];
    if (arr[index].variants.length == 1) {
      arr.splice(index, 1);
      setProducts(arr);
    } else {
      arr[index].variants.splice(varientIndex, 1);
      setProducts(arr);
    }

    let ids = [];
    arr.map((item) => {
      let variants = [];
      item.variants.map((itm) => {
        variants.push({ id: itm.id });
      });
      ids.push({
        id: item.product_id,
        variants: variants,
      });
    });
    setCheckedIds(ids);
  };
  function previewCommon(data) {
    console.log(data);
    let data1;

    let data2;

    if (data?.planType == "payAsYouGo") {
      data1 =
      `This subscription is a Pay As You Go plan. The customer will receive a delivery and be billed every ` +
     `${
          data?.billingEvery
        }  ${data?.billingEveryType?.toLowerCase()}(s).`;
    } else {
      data1 =
      `This subscription is a Prepaid plan. The length of the subscription is ` +
        `${
          data?.billingEvery
        }  ${data?.billingEveryType?.toLowerCase()}(s) and the customer will be billed upfront.` +
        ` The customer will receive a delivery every ${
          data?.deliveryEvery
        } ${data?.billingEveryType?.toLowerCase()}(s).`;
    }

    if (data?.billingCycle == false) {
      data2 =  ` Additionally, this plan will not renew automatically.`;
    } else {
      data2 = ` Additionally, this plan will renew automatically until canceled.`;
    }

    setPreview(data1 + data2);
  }
  const selectedProductHandler = () => {
    return (
      <Card
        style={{
          width: "100%",
        }}
      >
        {/* <div className="revlytic pricing">
          <p>Products</p>
          
        </div> */}
        <div className="product-section">
         { products.length > 0 &&<div className="revlytic-product-listing-header">
            <h5>Product</h5>
            <h5>Price</h5>
            <h5>Preview</h5>
            <h5>Manage</h5>

          </div>}
          {products.length > 0 ? (
            products.map((el, productIndex) =>
              el?.variants?.map((item, varientIndex) => (
                <div className="revlytic product-container" key={varientIndex}>
                  <div className="revlytic-product-first-td-header">
                    {" "}
                    {/* {productIndex == 0 && varientIndex == 0 && <p>Product</p>} */}
                    <div className="revlytic product-image-title">
                      <img
                        src={
                          item?.image
                            ? item?.image
                            : el?.product_image
                            ? el?.product_image
                            : pic
                        }
                      />
                      <div className="revlytic product-name">
                        {/* <p>{item.product_name}</p> */}
                        {/* {//console.log(item.hasOnlyDefaultVariant);} */}
                        <p>
                          {/* {//console.log(el, "bv")} */}
                          <a
                            target="_blank"
                            href={
                              `https://admin.shopify.com/store/${storeName}/products/` +
                              el?.product_id?.split("/").at(-1)
                            }
                            title= {el.product_name}
                          >
                            {" "}
                            {el.product_name}
                          </a>
                          <p>{el.hasOnlyDefaultVariant ? "" : item.title}</p>
                        </p>
                        {/* <p>{currencyCode} {item.price} (perUnit)</p> */}
                      </div>
                    </div>
                  </div>
                  {/* <div>{currencyCode} {item.price} (perUnit)</div> */}
                  <div className="revlytic product-price">
                    {/* {productIndex == 0 && varientIndex == 0 && (
                      <p className="revlytic-product-header">Price</p>
                    )} */}
                    <p>
                      {currency &&
                        getCurrencySymbol(currency) + "" + parseFloat(item?.price)?.toFixed(2)}
                    </p>
                  </div>

                  <div className="revlytic product-preview-icon">
                    {/* {productIndex == 0 && varientIndex == 0 && (
                      <p className="revlytic-product-header">Preview</p>
                    )} */}
                    <EyeOutlined
                      onClick={
                        () => {
                          //console.log("chckkkekckk");
                          setpreviewproductid(el.handle);
                          setpreviewData({
                            productIndex: productIndex,
                            varientIndex: varientIndex,
                            src: item?.image
                              ? item?.image
                              : el?.product_image
                              ? el?.product_image
                              : pic,
                            price: item.price,
                            name: el.hasOnlyDefaultVariant
                              ? el.product_name
                              : item.title,
                          });
                          //console.log(dropdownValue);

                          if (previewDropdown.length > 0) {
                            if (dropdownValue.price != undefined) {
                              if (dropdownValue.value.includes("percentage")) {
                                setPlanpreviewPrice(
                                  (
                                    item.price -
                                    (item.price * dropdownValue.price) / 100
                                  ).toFixed(2)
                                );
                              } else if (
                                dropdownValue.value.includes("fixed")
                              ) {
                                setPlanpreviewPrice(
                                  item.price - dropdownValue.price > 0
                                    ? (
                                        item.price - dropdownValue.price
                                      ).toFixed(2)
                                    : 0
                                );
                              }
                            } else {
                              setPlanpreviewPrice(item.price);
                            }
                          }
                        }
                        // handlePreview(
                        //   item?.image
                        //     ? item?.image
                        //     : el?.product_image
                        //     ? el?.product_image
                        //     : pic,
                        //   item.price,
                        //   el.hasOnlyDefaultVariant ? el.product_name : item.title
                        // )
                      }
                    />
                  </div>
                  <div className="revlytic product-delete-icon">
                    {/* {productIndex == 0 && varientIndex == 0 && (
                      <p className="revlytic-product-header">Manage</p>
                    )} */}

                    <DeleteOutlined
                      onClick={() =>
                        handleVarientDelete(productIndex, varientIndex)
                      }
                    />
                  </div>
                </div>
              ))
            )
          ) : (
            <h4>No products </h4>
          )}
          {modal && (
            <ResourcePicker
              resourceType="Product"
              open={modal}
              onSelection={handleProducts}
              initialSelectionIds={checkedIds}
              onCancel={handleCancel}
              showHidden={false}
            />
          )}
        </div>
      </Card>
    );
    // ///////////////////

    // return (
    //   <div className="revlytic plan-form-create-add-product">
    //     <Button
    //       type="primary"
    //       onClick={() => {
    //         setModal(true);
    //       }}
    //     >
    //       Add Products
    //     </Button>
    //     <Button type="primary" onClick={() => setaddproductModal(true)}>
    //       Create product
    //     </Button>
    //     <List>
    //       {//console.log(products)}
    //       {products.length > 0 && (
    //         <h1 className="revlytic plan-form-products-heading">Products</h1>
    //       )}
    //       {products.map((item, productIndex) => (
    //         <>
    //           <List.Item
    //             actions={[
    //               <a
    //                 key="list-loadmore-edit"
    //                 onClick={() => {
    //                   handleProductDelete(productIndex);
    //                 }}
    //               >
    //                 delete
    //               </a>,
    //             ]}
    //           >
    //             {/* <List.Item.Meta
    //               avatar={
    //                 <Avatar
    //                   src={item?.product_image ? item?.product_image : pic}
    //                 />
    //               }
    //               title={item.product_name}
    //               description={
    //                 item.variants.length == 1 && item.variants[0].price
    //               }
    //             /> */}
    //           </List.Item>
    //           {
    //             !item.hasOnlyDefaultVariant ?
    //             item.variants.map((ele, varientIndex) => {
    //               return (
    //                 <div style={{ marginLeft: "20px" }}>
    //                   <List.Item
    //                     actions={[
    //                       <a
    //                         key="list-loadmore-edit"
    //                         onClick={() => {
    //                           handleVarientDelete(productIndex, varientIndex);
    //                         }}
    //                       >
    //                         Preview
    //                       </a>,
    //                       <a
    //                       key="list-loadmore-edit"
    //                       onClick={() => {
    //                         handleVarientDelete(productIndex, varientIndex);
    //                       }}
    //                     >
    //                       delete
    //                     </a>
    //                     ]}
    //                   >

    //                     <List.Item.Meta
    //                       avatar={
    //                         <Avatar
    //                           src={
    //                             ele?.product_image ? ele?.product_image : item?.product_image ? item?.product_image : pic
    //                           }
    //                         />
    //                       }
    //                       title={ele.title}
    //                       // description={ele.price}
    //                     />
    //                   </List.Item>

    //                 </div>
    //               );
    //             }
    //               )
    //               :

    //               item.variants.map((ele, varientIndex) => {
    //                 return (
    //                   <div style={{ marginLeft: "20px" }}>
    //                     <List.Item
    //                       actions={[
    //                         <a
    //                           key="list-loadmore-edit"
    //                           onClick={() => {
    //                             handleVarientDelete(productIndex, varientIndex);
    //                           }}
    //                         >
    //                           Preview
    //                         </a>,
    //                         <a
    //                         key="list-loadmore-edit"
    //                         onClick={() => {
    //                           handleVarientDelete(productIndex, varientIndex);
    //                         }}
    //                       >
    //                         delete
    //                       </a>
    //                       ]}
    //                     >

    //                       <List.Item.Meta
    //                         avatar={
    //                           <Avatar
    //                             src={
    //                               ele?.product_image ? ele?.product_image : item?.product_image ? item?.product_image : pic
    //                             }
    //                           />
    //                         }
    //                         title={item.product_name}
    //                         // description={ele.price}
    //                       />
    //                     </List.Item>

    //                   </div>
    //                 );
    //               }
    //                 )

    //           }
    //         </>
    //       ))}
    //     </List>

    //     {modal && (
    //       <ResourcePicker
    //         resourceType="Product"
    //         open={modal}
    //         onSelection={handleProducts}
    //         initialSelectionIds={checkedIds}
    //         onCancel={handleCancel}
    //         showHidden={false}
    //       />
    //     )}
    //   </div>
    // );
  };
  {
    // //console.log(previewData);
  }

  const onFinishproduct = async (values) => {
    setaddproductModal(false);
    //console.log("Success:", values);
    setLoader(true);
    let data = await postApi(
      "/api/admin/createProduct",
      {
        name: values.productName,
        price: values.price,
        check: values.requireShipping == "physical" ? true : false,
        quantity: values.quantity,
      },
      app
    );
    if (data.data.message == "success") {
      toast.success("Product created succesfully", {
        position: toast.POSITION.TOP_RIGHT,
      });

      //console.log(checkedIds);
      //console.log(data.data.data);
      let pid = data.data.data.admin_graphql_api_id;
      let vid = data.data.data.variants[0].admin_graphql_api_id;
      let arr = [...checkedIds];
      arr.push({
        id: pid,
        variants: [{ id: vid }],
      });
      setCheckedIds(arr);

      let arr1 = [...products];
      arr1.push({
        product_id: pid,
        product_name: data.data.data.title,
        product_image:
          data.data.data?.images.length > 0
            ? data.data.data.images[0].originalSrc
            : "",
        hasOnlyDefaultVariant: true,
        variants: [
          {
            id: vid,
            price: data.data.data.variants[0].price,
            title: data.data.data.variants[0].title,
          },
        ],
      });
      setProducts(arr1);
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setLoader(false);
    //console.log(data);
    form1.resetFields();
  };
  const onFinishFailedproduct = (errorInfo) => {
    //console.log("Failed:", errorInfo);
  };
  // //console.log(allPlanGroupNames);
  return (
    <>
      <Spin tip="Loading..." size="large" spinning={loader}>
        <div className="revlytic create-plan-form">
          <div className="revlytic create-plan-top-container">
            <div className="revlytic create-plan-name-product1">
              <div className="revlytic create-plan-name-product">
                <div className="revlytic create-plan-group-productlist">
                  <div className="revlytic plan-groupname-input">
                  <div className="revlytic plan-groupInput">
                  <strong className=" revlytic required">Plan Name</strong><Tooltip  className="revlytic subscription-planpage-tooltip" title="Name your subscription plan here. This will allow you to differentiate between your various Subscription Plans."><QuestionCircleOutlined /></Tooltip>
                    
                    <div className="revlytic-plan-nameError">
                    <Input
                      // placeholder="Enter plan group name"
                      status={
                        !allPlanGroupNames.includes(planGroupName.toLowerCase())
                          ? ""
                          : "error"
                      }
                      onChange={(e) => {
                        setPlanGroupName(e.target.value);
                        const isUnique = !allPlanGroupNames.includes(
                          e.target.value.toLowerCase()
                        );
                      }}
                      value={planGroupName}
                    />
                    {!allPlanGroupNames.includes(
                      planGroupName.toLowerCase()
                    ) ? (
                      ""
                    ) : (
                      <span className="revlytic-matching-product-error" style={{ color: "red" }}>
                        Plan with same name already exists.
                      </span>
                    )}
                    </div>
                    </div>
                  <div className="add-and-create-buttons">
          <Tooltip title='Add products to your Subscription Plan. You can either add all variants of a Product or a specific Product variant as selected.'>
            <Button
              className="add"
              type="primary"
              onClick={() => {
                setModal(true);
              }}
            >
              Add Products
            </Button>
            </Tooltip>
            <Tooltip title='This feature allows you to create a new Product directly from within Revlytic! So you never have to log out and back in. You can always go back into Shopify to add additional details if necessary.'><Button
              type="primary"
              className="create"
              onClick={() => setaddproductModal(true)}
            >
              Create a Product
            </Button>
            </Tooltip>
                    </div>
                  </div>

                  {selectedProductHandler()}
                </div>
              </div>
              <Card className="revlytic available-plans-listing">
                <div className=" revlytic pricing">
                  <p>Frequency Plans</p>
                  {!openForm && (
                    <Button onClick={() => setOpenForm(true)}>Add Plan</Button>
                  )}
                </div>
                {initialPlans.length < 1 && plansList.length < 1 ? (
                  <h4 className="revlytic empty-plan-list">No plans </h4>
                ) : (
                  <div>
                    <Slider {...settings}>
                      {initialPlans.length > 0 &&
                        initialPlans?.map((elements, index) => (
                          <div
                            key={index}
                            className={
                              !editExistingPlan && editIndex == index
                                ? "revlytic frequency-plan-cards"
                                : ""
                            }
                          >
                            <div className="revlytic-slick-div">
                              <div className="revlytic-slick-inner-div">
                                <div className="revlytic-first-header">
                                  <p>Name:</p>
                                  <h4 title={elements.planName}>
                                    {elements.planName}{" "}
                                  </h4>
                                </div>

                                <div className="revlytic plan-card-fields">
                                  <p>Billing : </p>
                                  <h4
                                    title={
                                      elements?.planType == "prepaid"
                                        ? "Prepaid-" +
                                          " " +
                                          elements.billingEvery +
                                          " " +
                                          elements.billingEveryType +
                                          "(s)"
                                        : "Every" +
                                          " " +
                                          elements.billingEvery +
                                          " " +
                                          elements.billingEveryType +
                                          "(s)"
                                    }
                                  >
                                    {elements?.planType == "prepaid"
                                      ? "Prepaid-" +
                                        " " +
                                        elements.billingEvery +
                                        " " +
                                        elements.billingEveryType +
                                        "(s)"
                                      : "Every" +
                                        " " +
                                        elements.billingEvery +
                                        " " +
                                        elements.billingEveryType +
                                        "(s)"}
                                  </h4>
                                </div>
                                <div className="revlytic plan-card-fields">
                                  <p>Delivery : </p>
                                  <h4
                                    title={
                                      elements?.planType == "payAsYouGo"
                                        ? "Every" +
                                          " " +
                                          elements.billingEvery +
                                          " " +
                                          elements.billingEveryType +
                                          "(s)"
                                        : "Every" +
                                          " " +
                                          elements.deliveryEvery +
                                          " " +
                                          elements.billingEveryType +
                                          "(s)"
                                    }
                                  >
                                    {elements?.planType == "payAsYouGo"
                                      ? "Every" +
                                        " " +
                                        elements.billingEvery +
                                        " " +
                                        elements.billingEveryType +
                                        "(s)"
                                      : "Every" +
                                        " " +
                                        elements.deliveryEvery +
                                        " " +
                                        elements.billingEveryType +
                                        "(s)"}
                                  </h4>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                                className="revlytic plan-cards-actions"
                              >
                                <p
                                  onClick={() =>
                                    editPrevPlanHandler(elements, index)
                                  }
                                >
                                  <EditOutlined /> Edit
                                </p>
                                <p
                                  onClick={() => {
                                    setPrevPlanDel({
                                      data: elements,
                                      index: index,
                                    }),
                                      setIsModalOpenPrev(true);
                                  }}
                                >
                                  <DeleteOutlined /> Delete
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      {plansList.length > 0 &&
                        plansList?.map((elements, index) => (
                          <div
                            key={index}
                            className={
                              editExistingPlan && editIndex == index
                                ? "revlytic frequency-plan-cards"
                                : ""
                            }
                          >
                            <div className="revlytic-slick-div">
                              <div className="revlytic-slick-inner-div">
                                <div className="revlytic-first-header">
                                  <p>Name:</p>
                                  <h4 title={elements.planName}>
                                    {elements.planName}{" "}
                                  </h4>
                                </div>

                                <div className="revlytic plan-card-fields">
                                  <p>Billing : </p>
                                  <h4
                                    title={
                                      elements?.planType == "prepaid"
                                        ? "Prepaid-" +
                                          " " +
                                          elements.billingEvery +
                                          " " +
                                          elements.billingEveryType +
                                          "(s)"
                                        : "Every" +
                                          " " +
                                          elements?.billingEvery +
                                          " " +
                                          elements.billingEveryType +
                                          "(s)"
                                    }
                                  >
                                    {elements?.planType == "prepaid"
                                      ? "Prepaid-" +
                                        " " +
                                        elements.billingEvery +
                                        " " +
                                        elements.billingEveryType +
                                        "(s)"
                                      : "Every" +
                                        " " +
                                        elements.billingEvery +
                                        " " +
                                        elements.billingEveryType +
                                        "(s)"}
                                  </h4>
                                </div>
                                <div className="revlytic plan-card-fields">
                                  <p>Delivery : </p>
                                  <h4
                                    title={
                                      elements?.planType == "payAsYouGo"
                                        ? "Every" +
                                          " " +
                                          elements.billingEvery +
                                          " " +
                                          elements.billingEveryType +
                                          "(s)"
                                        : "Every" +
                                          " " +
                                          elements.deliveryEvery +
                                          " " +
                                          elements.billingEveryType +
                                          "(s)"
                                    }
                                  >
                                    {elements?.planType == "payAsYouGo"
                                      ? "Every" +
                                        " " +
                                        elements.billingEvery +
                                        " " +
                                        elements.billingEveryType +
                                        "(s)"
                                      : "Every" +
                                        " " +
                                        elements.deliveryEvery +
                                        " " +
                                        elements.billingEveryType +
                                        "(s)"}
                                  </h4>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                                className="revlytic plan-cards-actions"
                              >
                                <p
                                  onClick={() =>
                                    editPlanHandler(elements, index)
                                  }
                                >
                                  <EditOutlined /> Edit
                                </p>
                                <p
                                  onClick={() => {
                                    setcurrentPlanDel(index);
                                    setIsModalOpenCurrent(true);
                                  }}
                                >
                                  <DeleteOutlined /> Delete
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </Slider>
                  </div>
                )}
              </Card>
            </div>
            <div className="revlytic create-plan-group-widget-preview">
              <Card>
                <div className="revlytic preview-container-1">
                 <div className="revlytic preview-heading-tooltip"><h2 className="revlytic preview-heading">
                    Subscription Widget Preview 
                  </h2><Tooltip  className="revlytic subscription-planpage-tooltip" title='Preview how your Subscription Plan will appear on your Shopify store Product Widget before you submit and create your plan.'><QuestionCircleOutlined/></Tooltip></div> 
                  <img
                    className="revlytic preview-image"
                    src={previewData.src}
                  />
                  <p className="revlytic preview-product-name">
                    {previewData.name}
                  </p>
                  <h3 className="revlytic preview-product-price">
                    {currency &&
                      getCurrencySymbol(currency) + "" + parseFloat(previewData?.price)?.toFixed(2)}
                  </h3>
                </div>
                <div className="revlytic preview-container-2">
                  <p className="revlytic preview-head-2">Purchase Options</p>
                  <div className="revlytic preview-container-3">
                    <div className="revlytic preview-one-time-price">
                      <p className="revlytic preview-one-time-purchase">
                        One-Time Purchase
                      </p>
                      <p className="revlytic preview-option-price">
                        {" "}
                        {currency &&
                          getCurrencySymbol(currency) + "" + parseFloat(previewData?.price)?.toFixed(2)}
                      </p>
                    </div>
                    <div div className="revlytic preview-container-4">
                      <div className="revlytic preview-save">
                        <p className="revlytic preview-one-time-purchase">
                          Subscribe & Save
                        </p>
                        <p className="revlytic preview-option-price">
                          {currency &&
                            getCurrencySymbol(currency) + "" + parseFloat(planpreviewPrice)?.toFixed(2)}
                        </p>
                      </div>
                      <p className="revlytic preview-delivery-frequency">
                        Delivery Frequency
                      </p>
                      <Select
                        value={dropdownValue?.value}
                        className="revlytic preview-select"
                        onChange={(e, all) => {
                          setDropdownValue(all);
                          if (all.price != undefined) {
                            if (all.value.includes("percentage")) {
                              setPlanpreviewPrice(
                                previewData.price -
                                  (previewData.price * all.price) / 100
                              );
                            } else if (all.value.includes("fixed")) {
                              setPlanpreviewPrice(
                                previewData.price - all.price > 0
                                  ? previewData.price - all.price
                                  : 0
                              );
                            }
                          } else {
                            setPlanpreviewPrice(previewData.price);
                          }
                          //console.log(e, all);
                        }}
                        options={previewDropdown}
                      />
                    </div>
                    {/* {console.log(initialPlans, plansList, dropdownValue)} */}
                    {initialPlans.length > 0 || plansList.length > 0 ? (
                      <div className="revlytic widget-selected-values">
                        <label>
                          <strong>Billing Frequency</strong> :{" "}
                          {dropdownValue?.planType == "(Prepaid)"
                            ? `Prepaid ${dropdownValue?.billing} ${dropdownValue?.interval}`
                            : `Every  ${dropdownValue?.billing} ${dropdownValue?.interval}`}
                        </label>

                        <label>
                          <strong>Delivery Frequency</strong> :{" "}
                          {dropdownValue?.planType == "(Prepaid)"
                            ? `Every ${dropdownValue?.delivery} ${dropdownValue?.interval}`
                            : `Every  ${dropdownValue?.billing} ${dropdownValue?.interval}`}
                        </label>
                      </div>
                    ) : (
                      <div style={{ height: "44px" }}></div>
                    )}
                  </div>
                </div>
                <div className="revlytic see-preview-link">
                  {initialPlans.length > 0 ? (
                    <>
                      <a
                        target="_blank"
                        href={`https://${storeName}.myshopify.com/products/${previewproductid}`}
                      >
                        {" "}
                        <EyeOutlined /> Preview In Store
                      </a>
                    </> 
                  ) : (
                    <div></div> 
                  )}
                </div>
              </Card>
            </div>
          </div>
          {/* ///////////////////////////////////////////////// */}
          {/* 
            <Card style={{ width: "60%" }} className="revlytic available-plans-listing">
              <div className=" revlytic pricing">
                <p>Frequency Plans</p>
                {!openForm && (
                  <Button onClick={() => setOpenForm(true)}>Add Plan</Button>
                )}
              </div>
              <Slider {...settings}>
                {plansList.map((elements, index) => (
                  <div
                    key={index}
                    className={
                      editExistingPlan && editIndex == index
                        ? "revlytic frequency-plan-cards"
                        : ""
                    }
                  >
                    <Card.Grid
                      bordered={false}
                      // style={{
                      //   width: "248px",
                      //   border: "2px solid #70ffaa",
                      //   margin: "0 10px",
                      // }}
                    >
                      <p>
                        Name :<h4>{elements.planName} </h4>
                      </p>{" "}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >z
                        <p onClick={() => editPlanHandler(elements, index)}>
                        <EditOutlined />   edit
                        </p>
                        <p
                          onClick={() => {
                            setcurrentPlanDel(index);
                            setIsModalOpenCurrent(true);
                          }}
                        >
                        <DeleteOutlined />  delete
                        </p>
                      </div>
                    </Card.Grid>
                  </div>
                ))}
              </Slider>
            </Card> */}

          {/* ///////////////////////////////////////////////////////// */}

          {openForm && (
            <>
              {" "}
              <Form
                layout="vertical"
                requiredMark={false}
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className="revlytic customerGenerate-form"
                onValuesChange={handleFormChange}
              >
                <div className="revlytic-subscription-wrapper">
                  <Card className="revlytic subscription-container">
                    <div className="revlytic head-buttons">
                      <p className="revlytic main-headings">
                        Subscription Details
                      </p>

                      {buttonText ? (
                        <div className="revlytic updat-cancel">
                          <Form.Item wrapperCol={{ span: 16 }}>
                            <Button type="primary" htmlType="submit">
                              Add Plan
                            </Button>
                          </Form.Item>
                          <Button
                            onClick={() => {
                              setOpenForm(false),
                                setButtonText(true),
                                form.resetFields();
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          {" "}
                          {/* <Button onClick={handleUpdate}>Update</Button> */}
                          <div className="revlytic updat-cancel">
                            <Button htmlType="submit">Save</Button>
                            <Button
                              onClick={() => {
                                setOpenForm(false),
                                  setButtonText(true),
                                  form.resetFields();
                                setEditExistingPlan(false);
                                setEditNewPlan(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="revlytic subscription-details">
                      <Form.Item
                        label={
                          <p className="revlytic required">
                            Frequency Plan Name
                          </p>
                        }
                        name="planName"
                        rules={[
                          {
                            required: true,
                            message: "Frequency Plan Name is required!",
                          },
                          {
                            validator: (rule, value) =>
                              nameValidator(rule, value),
                          },
                        ]}
                        tooltip="A Frequency Plan refers to the frequency  of deliveries or fulfillments to be made. Name the frequency here. Common examples of Frequency Plan Names are “Monthly” or “Weekly”. This is an external field that will be visible to your customers on the Product Details page."
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                         label={<div className="revlytic label-tooltip-main"><label>Plan Types</label><Tooltip placement="left"  title={
                          <div className="revlytic-plan-type-toolTip">
                                      <p>
                                      <h2>Supported Subscription Billing Plans</h2>
                                      <hr/>
                                 <h2>1. Pay As You Go (Auto Renewal):</h2>
                          Pay As You Go is a flexible billing plan that bills your customers for whatever billing frequency you select. For example, if you set up a Monthly Pay As You Go Subscription plan, your customer will be charged every month until the plan is canceled. 
                         </p><p><h1>2. Prepaid (Auto Renewal On):</h1>
                          With the Prepaid Auto Renewal plan type, you are able to bill your customer in advance for multiple periods in the future. For example, with the Prepaid Length set to 12 Months and the Delivery Every set to 1 month, you can bill the customer for 12 Months of deliveries upfront. At the end of the 12 Months, this plan will Auto Renew for another 12 Month period billed upfront. This will continue until either you or the Customer cancels the subscription.
                         </p><p> <h1>3. Prepaid (Auto Renewal Off):</h1>
                          This plan type is exactly the same as the Prepaid with Auto Renewal On, except that it does not renew at the of the billing cycle. 
                           </p>
                          </div>}><QuestionCircleOutlined/></Tooltip></div>} 
                        name={"planType"}
                        initialValue={"payAsYouGo"}
                 
                      >
                        <Select placeholder="">
                          <Select.Option value="payAsYouGo">
                            Pay As You Go{" "}
                          </Select.Option>
                          <Select.Option value="prepaid">Prepaid</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="revlytic subscription-details1">
                      <div className="revlytic start-date">
                        <Form.Item
                          label={<p className="revlytic required">Starts On</p>}
                          name="startDate"
                          initialValue={dayjs(new Date())}
                          rules={[
                            {
                              required: true,
                              message: "Please select start date!",
                            },
                          ]}
                          tooltip="The date that frequency plan is shown to your customers under delivery frequency options."
                        >
                          <DatePicker
                            allowClear={false}
                            disabledDate={
                              (current) =>
                                current &&
                                current <
                                  new Date().getTime() - 1 * 24 * 60 * 60 * 1000 //for disabling till yesterday// current && current < new Date().getTime() - 1 * 24 * 60 * 60 * 1000
                            }
                            showTime={false}
                            format="YYYY-MM-DD"
                          />
                        </Form.Item>
                       
                        <p className="revlytic preview-label">Preview</p>
                        <p>{preview}</p>
                      </div>
                      <div className={"revytic billing-frequency"}>
                        <Form.Item noStyle shouldUpdate>
                          {({ getFieldValue }) =>
                            getFieldValue("planType") == "payAsYouGo" ? (
                              <div
                                className={"revytic only-billing-frequency two"}
                              >
                                <Form.Item
                                  label={
                                    <p className="revlytic required">
                                      Bill Every
                                    </p>
                                  }
                                  name="billingEvery"
                                  initialValue="1"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Bill Every is required!",
                                    },
                                    {
                                      pattern: /^\d+$/,
                                      message: "Bill Every must be a number!",
                                    },
                                    // {
                                    //   validator: (rule, value) =>
                                    //     billingFreqValidator(rule, value),
                                    // },
                                  ]}
                                   tooltip="Enter how often you would like to Bill your customers in this plan. For example, if you select Bill Every 3 Months, your customer will be billed every three months, regardless of when they receive deliveries."
>
                                  <Input
                                    // addonAfter={selectAfter}
                                  />
                                </Form.Item>
                                <Form.Item
                                  label=" "
                                  initialValue="month"
                                  name = "billingEveryType"
                                >
                                  <Select>
                                    <Select.Option value="day">
                                      Day(s)
                                    </Select.Option>
                                    <Select.Option value="week">
                                      Week(s)
                                    </Select.Option>
                                    <Select.Option value="month">
                                      Month(s)
                                    </Select.Option>
                                    <Select.Option value="year">
                                      Year(s)
                                    </Select.Option>
                                  </Select>
                                </Form.Item>
                                <div className="revlytic auto-renew-check">
                                  <Form.Item
                                    label="Auto Renew"
                                    name={"billingCycle"}
                                    valuePropName="checked"
                                    initialValue={true}
                                    tooltip="If this box is selected, the plan will automatically renew at the end of the subscription."
                                  >
                                    <Checkbox disabled></Checkbox>
                                  </Form.Item>
                                </div>
                              </div>
                            ) : (
                              <div
                                className={"revytic billing-delivery-frequency"}
                                >
                                  <div className="revlyticbilling-delivery-frequency-container1">
                                <Form.Item
                                  label={
                                    <p className="revlytic required">
                                      Prepaid Length
                                    </p>
                                  }
                                  name="billingEvery"
                                  initialValue="1"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Prepaid Length is required!",
                                    },
                                    {
                                      pattern: /^\d+$/,
                                      message:
                                        "Prepaid Length must be a number!",
                                    },
                                    {
                                      validator: (rule, value) =>
                                        handlePrepaidLength(rule, value),
                                    },
                                    // {
                                    //   validator: (rule, value) =>
                                    //     prepaidBillingValidator(rule, value),
                                    // },
                                  ]}
                                tooltip="The term of the service that the customer will prepay for."
                                >
                                    <Input
                                      // addonAfter={selectAfter}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                  label=" "
                                  initialValue="month"
                                  name = "billingEveryType"
                                >
                                  <Select>
                                    <Select.Option value="day">
                                      Day(s)
                                    </Select.Option>
                                    <Select.Option value="week">
                                      Week(s)
                                    </Select.Option>
                                    <Select.Option value="month">
                                      Month(s)
                                    </Select.Option>
                                    <Select.Option value="year">
                                      Year(s)
                                    </Select.Option>
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                className="autorenew-tooltip"
                                  label="Auto Renew"
                                  name={"billingCycle"}
                                  initialValue={false}
                                  valuePropName="checked"
                                  tooltip="Subscription plan will not renew automatically if box unchecked and will expire  after the Billing Cycles complete.If box checked,Subscription plan will  renew automatically until cancelled manually"
                                >
                                  <Checkbox></Checkbox>
                               
                                  </Form.Item>
                                  </div>
                        <div className="revlyticbilling-delivery-frequency-container2">
                                <Form.Item
                                  label={
                                    <p className="revlytic required">
                                      Delivery every
                                    </p>
                                  }
                                  name="deliveryEvery"
                                  initialValue="1"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Delivery Every is required!",
                                    },
                                    {
                                      pattern: /^\d+$/,
                                      message:
                                        "Delivery every must be a number!",
                                    },
                                    {
                                      validator: (rule, value) =>
                                        handlePrepaidDelivery(rule, value),
                                    },
                                    // {
                                    //   validator: (rule, value) =>
                                    //     prepaidBillingValidator(rule, value),
                                    // },
                                  ]}
                                  tooltip='For Prepaid Plans, the number of deliveries that will be made to the customer in the defined Prepaid Length. For example, if you set “Prepaid Length” to 12 Months, and “Delivery Every” to 3 Months, you will be delivering to your customer every 3 months for a 12 month period. That equates to 4 Deliveries (4 Deliveries x 3 Months = 12 Months of Deliveries).'
                                >
                                    <Input
                                      // addonAfter={selectAfter}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                  label=" "
                                  initialValue="month"
                                  name = "billingEveryType"
                                >
                                  <Select>
                                    <Select.Option value="day">
                                      Day(s)
                                    </Select.Option>
                                    <Select.Option value="week">
                                      Week(s)
                                    </Select.Option>
                                    <Select.Option value="month">
                                      Month(s)
                                    </Select.Option>
                                    <Select.Option value="year">
                                      Year(s)
                                    </Select.Option>
                                  </Select>
                                </Form.Item>
                               </div>
                              </div>
                            )
                          }
                        </Form.Item>
                        {/* <Form.Item noStyle shouldUpdate>
                          {billingEvery == "week" ? (
                            <Form.Item
                              label="Billing day"
                              initialValue="Monday"
                              name="billingWeek"
                            >
                              <Select>
                                <Select.Option value="Monday">
                                  Monday
                                </Select.Option>
  
                                <Select.Option value="Tuesday">
                                  Tuesday
                                </Select.Option>
  
                                <Select.Option value="Wednesday">
                                  Wednesday
                                </Select.Option>
  
                                <Select.Option value="Thursday">
                                  Thursday
                                </Select.Option>
  
                                <Select.Option value="Friday">
                                  Friday
                                </Select.Option>
  
                                <Select.Option value="Saturday">
                                  Saturday
                                </Select.Option>
  
                                <Select.Option value="Sunday">
                                  Sunday
                                </Select.Option>
                              </Select>
                            </Form.Item>
                          ) : billingEvery == "year" ? (
                            <>
                              <Form.Item
                                label="Billing month"
                                initialValue="January"
                                name="billingYear"
                              >
                                <Select>
                                  {months.map((month) => (
                                    <Select.Option key={month} value={month}>
                                      {month}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
  
                              <Form.Item
                                label="Billing date"
                                initialValue="1"
                                name="billingMonth"
                              >
                                <Select>
                                  {days.map((day) => (
                                    <Select.Option key={day} value={day}>
                                      {day}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </>
                          ) : billingEvery == "month" ? (
                            <Form.Item
                              label="Billing date"
                              initialValue="1"
                              name="billingMonth"
                            >
                              <Select>
                                {days.map((day) => (
                                  <Select.Option key={day} value={day}>
                                    {day}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          ) : (
                            ""
                          )}
                        </Form.Item> */}
                      </div>
                    </div>

                    {/* ////////////////////////////////// */}
                    {advanceOptions == true ? (
                      <div className="revlytic advance-options-container">
                        <Divider />

                        <p className="revlytic main-headings">
                          Advanced Options
                        </p>

                        <div className="revlytic subscription-details2">
                          <div className="revlytic  advance-options-frequencyPlanName-discount">
                            <div className="revlytic frequency-name">
                              <div className="revlytic offer-discount-switch ">
                                <label>Offer discount</label>
                                <Form.Item
                                  label=" "
                                  valuePropName="checked"
                                  name="offerDiscount"
                                  initialValue={false}
                                  tooltip="Discount will be applied to every selected product individually  for the plan"
                                >
                                  <Switch />
                                </Form.Item>
                              </div>

                              <div className="revlytic setup-free-container">
                                <div className="revlytic discount-toggle">
                                  {/* <Form.Item
                                    label="Setup fee"
                                    valuePropName="checked"
                                    name="setupFee"
                                    initialValue={false}
                                  >
                                    <Switch />
                                  </Form.Item> */}
                                </div>
                                <div className="revlytic discount-toggle">
                                  <Form.Item
                                    label="Free trial"
                                    valuePropName="checked"
                                    name="freeTrial"
                                    initialValue={false}
                                  >
                                    <Switch />
                                  </Form.Item>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="revlytic discount-checks-field">
                            <div className="revlytic discount-value">
                              <Form.Item noStyle shouldUpdate>
                                {({ getFieldValue }) =>
                                  getFieldValue("offerDiscount") == true ? (
                                    <Form.Item
                                      label=""
                                      name="price"
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Offer Discount is required!",
                                        },
                                        {
                                          pattern: /^\d+(\.\d+)?$/,
                                          message:
                                            "Offer Discount must be a valid number!",
                                        },

                                        {
                                          validator: (rule, value) =>
                                            handleDiscountValidator(
                                              rule,
                                              value
                                            ),
                                        },
                                      ]}
                                    >
                                      <Input addonAfter={selectAfterPrice} />
                                    </Form.Item>
                                  ) : null
                                }
                              </Form.Item>
                            </div>

                            <div className="revlytic setup-fee-trial-row">
                              {/* <div className="revlytic setup-fee-field">
                                <Form.Item noStyle shouldUpdate>
                                  {({ getFieldValue }) =>
                                    getFieldValue("setupFee") == true ? (
                                      <Form.Item
                                        label="Setup fee price"
                                        name="setupPrice"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Setup fee price is required  !",
                                          },
                                          {
                                            pattern: /^\d+(\.\d+)?$/,
                                            message:
                                              "Price must be a valid number!",
                                          },
                                        ]}
                                      >
                                        <Input
                                          prefix={
                                            currency &&
                                            getCurrencySymbol(currency)
                                          }
                                        />
                                      </Form.Item>
                                    ) : null
                                  }
                                </Form.Item>
                              </div> */}
                              <div className="revlytic free-trial-field">
                                <Form.Item noStyle shouldUpdate>
                                  {({ getFieldValue }) =>
                                    getFieldValue("freeTrial") == true ? (
                                      <div className="revlytic-main-free-trial-input">
                                      <Form.Item
                                        label={
                                          <p className="revlytic required">
                                            Free Trial Period
                                          </p>
                                        }
                                        name="trialCount"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "Free trial period is required!",
                                          },
                                          {
                                            pattern: /^\d+$/,
                                            message:
                                              "Free trial period must be a valid number!",
                                          },
                                          {
                                            validator: (rule, value) => {
                                              console.log(
                                                form.getFieldValue("maxCycle")
                                              );
                                              if (
                                                form.getFieldValue("maxCycle") &&  (Number(value)  >
                                                Number(
                                                  form.getFieldValue("maxCycle")
                                                ))
                                              ) {
                                                return Promise.reject(
                                                  "Free trial period cannot be greater than Maximum Billing Cycles!"
                                                );
                                              }
                                              form.setFields([
                                                {
                                                  name: "maxCycle",
                                                  errors: [],
                                                },
                                              ]);
                                              return Promise.resolve();
                                            },
                                          },
                                          {
                                            validator: (rule, value) => {
                                              console.log(
                                                form.getFieldValue("maxCycle")
                                              );
                                              if (
                                               value && Number(value) < 1
                                               
                                              ) {
                                                return Promise.reject(
                                                  "Free trial period should be greater than zero!"
                                                );
                                              }
                                              return Promise.resolve();
                                            },
                                          },
                                        ]}

                                    tooltip=" Enter the number of Free Trials periods you would like to include in this subscription plan. For example, if you select 14 Days, the customer can try the product for the duration specified for free before the subscription starts after 14 days."

                                        
                                      >
                                        <Input     />
                                      </Form.Item>


                                      <Form.Item
                                        label={
                                          <p className="revlytic required rev-spacer">
                                             
                                          </p>
                                        }
                                        name="freeTrialCycle"
                                      initialValue={"day"}

                                    // tooltip=" "

                                        
                                      >
                                         <Select >
                                    <Select.Option value="day">
                                      Day(s)
                                    </Select.Option>
                                    <Select.Option value="week">
                                      Week(s)
                                    </Select.Option>
                                    <Select.Option value="month">
                                      Month(s)
                                    </Select.Option>
                                    <Select.Option value="year">
                                      Year(s)
                                    </Select.Option>
                                  </Select>
                                      </Form.Item>



                                      </div>
                                    ) : null
                                  }
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                          <div className="revlytic billing-cycles">
                            <Form.Item noStyle shouldUpdate>
                              {({ getFieldValue }) =>
                                getFieldValue("billingCycle") == true ? (
                                  <Form.Item
                                    label="Minimum Billing Cycles"
                                    name="minCycle"
                                    rules={[
                                      {
                                        validator: (rule, value) =>
                                          handleMinCycle(rule, value),
                                      },
                                    ]}
                                    tooltip="Minimum number of billing iteration you want to bind your customers with, before they can cancel their subscription. Default value is one (the very first billing iteration)."
                                  >
                                    <Input />
                                  </Form.Item>
                                ) : null
                              }
                            </Form.Item>
                            {/* <div className="revlytic billing-cycles"> */}
                            <Form.Item noStyle shouldUpdate>
                              {({ getFieldValue }) =>
                                getFieldValue("billingCycle") == true ? (
                                  <Form.Item
                                    label="Maximum Billing Cycles"
                                    name={"maxCycle"}
                                    rules={[
                                      {
                                        validator: (rule, value) =>
                                          handleMaxCycle(rule, value),
                                      },
                                    ]}
                                    tooltip="Maximum number of billing iteration that will be fulfilled as a part of the subscription plan, after which it will automatically expire. Default value is infinity."
                                  >
                                    <Input />
                                  </Form.Item>
                                ) : null
                              }
                            </Form.Item>

                            {/* </div> */}
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {/* /////////////////////////////// */}

                    <div
                      className="revlytic advance-option-label"
                      onClick={() => setAdvanceOptions(!advanceOptions)}
                    >
                      <span>
                        {advanceOptions == true
                          ? "Collapse Advanced Options"
                          : "Show Advanced Options"}
                      </span>
                      {advanceOptions == true ? (
                        <UpOutlined />
                      ) : (
                        <RightOutlined />
                      )}
                    </div>
                  </Card>
                </div>
                {/* {//console.log(buttonText)} */}
              </Form>
            </>
          )}

          {
            <div className="create-button-group">
              <Button type="primary" onClick={createPlanGroup}>
                {initialPlans.length < 1 ? "Submit" : "Update Plan"}
              </Button>
            </div>
          }
        </div>
      </Spin>

      {/* //////////// all modals */}

      <Modal
        title="Delete Frequency Plan?"
        open={isModalOpenPrev}
        onOk={() => deletePrevPlan(prevPlanDel)}
        onCancel={() => setIsModalOpenPrev(false)}
      >
        <h1>Are you sure you want to delete this frequency plan?</h1>
      </Modal>
      <Modal
        title="Delete Frequency Plan?"
        open={isModalOpenCurrent}
        onOk={() => deletePlan(currentPlanDel)}
        onCancel={() => setIsModalOpenCurrent(false)}
      >
        <h1>Are you sure you want to delete this frequency plan?</h1>
      </Modal>
      <Modal
        className="rev-create-product"
        // title="Create Product "
        open={addproductModal}
        onCancel={() => {setaddproductModal(false)
          form1.resetFields()
        }}
        footer={
          [
            // <Button key="cancel" onClick={() => setaddproductModal(false)}>
            //   Cancel
            // </Button>,
          ]
        }
      >
        <div className="revlytic new-customer-modal">
          <div className="revlytic new-customer-modal-title">
            Create a Product
          </div>
          <Form
            className="create-product-form"
            requiredMark={false}
            form={form1}
            name="basic"
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
            onFinish={onFinishproduct}
            onFinishFailed={onFinishFailedproduct}
            autoComplete="off"
          >
            <div className="revlytic customer-modal-name">
              <Form.Item
                label={<p className="revlytic required">Product Name</p>}
                name="productName"
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                  {
                    validator: (rule, value) => {
                      if (!value) {
                        return Promise.reject("Product Name is required!");
                      } else if (value.trim() === "") {
                        return Promise.reject("Product Name is required!");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<p className="revlytic required">Price</p>}
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Price is required!",
                  },
                  {
                    pattern: /^-?\d*(\.\d+)?$/,
                    message: "Price must be a number",
                  },
                  {
                    validator: (rule, value) => {
                      if (parseInt(value, 10) <= 0) {
                        return Promise.reject(
                          "Price must be greater than zero"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
               
              >
                <Input  prefix={currency && getCurrencySymbol(currency)} />
              </Form.Item>
            </div>
            <div className="revlytic customer-modal-email-phone">
              <Form.Item
                label={<p className="revlytic required">Quantity</p>}
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Quantity is required!",
                  },
                  {
                    pattern: /^\d+$/,
                    message: "Quantity must be a number ",
                  },
                  {
                    validator: (rule, value) => {
                      if (parseInt(value, 10) <= 0) {
                        return Promise.reject(
                          "Quantity must be greater than zero"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Product Type"
                name="requireShipping"
                // valuePropName="checked"
                initialValue="physical"
              >
                <Select
                  options={[
                    { value: "physical", label: "Physical product" },
                    { value: "digital", label: "Digital product or service" },
                  ]}
                />
              </Form.Item>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                <p className="revlytic create-customer-icon">
                  <PlusCircleOutlined /> Submit
                </p>
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
export default PlanForm;
