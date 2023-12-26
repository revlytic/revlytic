import React, { useEffect, useState } from "react";

import {
  render,
  extend,
  Text,
  useExtensionApi,
  Card,
  useSessionToken,
  useData,
  Heading,
  TextField,
  Button,
  Select,
  Checkbox,
  useToast,
  CardSection,
  Modal,
  useContainer,
  BlockStack,
  Icon,
  InlineStack,
  TextBlock,
} from "@shopify/admin-ui-extensions-react";

function Create() {
  const data = useData();
  const { getSessionToken } = useSessionToken();
  const { show: showToast } = useToast();
  const { extensionPoint } = useExtensionApi();
  const { close, done, setPrimaryAction, setSecondaryAction } = useContainer();

  const [planList, setplanList] = useState([]);
  const [planGroupName, setPlanGroupName] = useState("");
  const [planType, setplanType] = useState("payAsYouGo");
  const [autoRenew, setAutoRenew] = useState(true);
  const [offerDiscount, setOfferDiscount] = useState(false);
  const [freeTrial, setFreeTrial] = useState(false);
  const [frequencyPlanName, setFrequencyPlanName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [billEvery, setbillEvery] = useState(1);
  const [deliveryEvery, setdeliveryEvery] = useState(1);
  const [interval, setinterval] = useState("day");
  const [minCycle, setminCycle] = useState();
  const [maxCycle, setmaxCycle] = useState();
  const [discount, setDiscount] = useState(0);
  const [discountType, setdiscountType] = useState("percentage");
  const [freeTrialCount, setFreeTrialCount] = useState("");
  const [editState, seteditState] = useState(false);
  const [editIndex, seteditIndex] = useState();
  console.log(data, "dtaaaaalatestvala");
  const options = [
    { label: "Pay As You Go", value: "payAsYouGo" },
    { label: "Prepaid", value: "prepaid" },
  ];
  const options1 = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
  ];
  const numberRegex = /^-?\d+(\.\d+)?$/;
  const addPlan = () => {
    console.log("aksdjfhjhdklajh", numberRegex.test(billEvery));
    let arr = [...planList];
    if (editState) {
      arr.splice(editIndex, 1);
    }
    if (
      frequencyPlanName.length > 0 &&
      !arr.some((item) => item.frequencyPlanName === frequencyPlanName) &&
      // !arr.some(
      //   (item) =>
      //     item.billEvery === billEvery &&
      //     item.interval == interval &&
      //     planType != "prepaid"
      // ) &&
      // !arr.some(
      //   (item) =>
      //     item.billEvery === billEvery &&
      //     item.deliveryEvery &&
      //     item.interval == interval &&
      //     planType == "prepaid"
      // ) &&
      billEvery > 0 &&
      numberRegex.test(billEvery)
    ) {
      let details = {
        frequencyPlanName,
        planType,
        billEvery,
        interval,
        autoRenew,
        minCycle,
        maxCycle,
        offerDiscount,
        discount,
        discountType,
      };
      if (planType == "prepaid") {
        details.deliveryEvery = deliveryEvery;
      }
      if (!editState) {
        let arr = [...planList];
        arr.push(details);
        setplanList(arr);
      } else {
        let arr = [...planList];
        arr[editIndex] = details;
        setplanList(arr);
        seteditState(false);
      }

      setFrequencyPlanName("");
      setplanType("payAsYouGo");
      setbillEvery(1);
      setdeliveryEvery(1);
      setinterval("day");
      setAutoRenew(false);
      setminCycle(1);
      setmaxCycle(1);
      setOfferDiscount(false);
      setDiscount(1);
      setdiscountType("percentage");
    } else {
      if (
        arr.some(
          (item) =>
            item.billEvery === billEvery &&
            item.deliveryEvery &&
            item.interval == interval &&
            planType == "prepaid"
        )
      ) {
        showToast(
          "Same plan with same billing and delivery frequencies exist already !!"
        );
      }
    }
  };
  console.log(planList, "jkhg");

  const DeletePlan = (index) => {
    let arr = [...planList];
    arr.splice(index, 1);
    setplanList(arr);
  };

  const createPlanGroup = async () => {
    let token = await getSessionToken();

    if (planList.length > 0 && planGroupName.length > 0) {
      const createApi = await fetch(
        "https://revlytic.shinedezign.pro/api/prodEx/prodExCreatePlan",
        {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
            Authentication: token,
          },
          body: JSON.stringify({
            planGroupName,
            planList,
            pid: data.productId,
            vid: data.variantId,
          }),
        }
      );
      const result = await createApi.json();
      console.log(result, "nbvcx");
      if (result.message == "success") {
        showToast("Plan created successfully");
        done();
        // location.reload()
      } else {
        showToast(result.data);
      }
    } else {
      if (!(planList.length > 0 || prevPlanList.length > 0)) {
        showToast("Minimum one plan required !!");
      } else {
        showToast("Enter valid Plan Name !!");
      }
    }
  };
  const EditPlan = (index) => {
    seteditIndex(index);
    seteditState(true);
    let arr = [...planList];
    setFrequencyPlanName(arr[index].frequencyPlanName);
    setplanType(arr[index].planType);
    setbillEvery(arr[index].billEvery);
    setdeliveryEvery(arr[index].deliveryEvery);
    setinterval(arr[index].interval);
    setAutoRenew(arr[index].autoRenew);
    setminCycle(arr[index].minCycle);
    setmaxCycle(arr[index].maxCycle);
    setOfferDiscount(arr[index].offerDiscount);
    setDiscount(arr[index].discount);
    setdiscountType(arr[index].discountType);
  };
  return (
    <>
      <Heading id="profile_heading" level={3}>
        Create Plan
      </Heading>
      <Card>
        <CardSection>
          <TextField
            label="Plan Name"
            type="text"
            value={planGroupName}
            // placeholder="Plan  name"
            onChange={(value) => {
              console.log(value, " was typed"), setPlanGroupName(value);
            }}
            error={planGroupName.length < 1 ? "Plan Name is required!" : false}
          />
        </CardSection>
      </Card>

      {planList?.map((item, index) => {
        return (
          <Card>
            <CardSection>
              <BlockStack inlineAlignment="center">
                <InlineStack>
                  <Button
                    appearance="critical"
                    title="Delete"
                    onPress={() => DeletePlan(index)}
                  />
                  <Button title="Edit" onPress={() => EditPlan(index)} />
                </InlineStack>

                <Text>Name: {item.frequencyPlanName}</Text>
                <Text>
                  Type: {item.planType == "prepaid" ? "Prepaid" : "Pay As You Go"}
                </Text>
                <Text>
                  Billing Frequency: {item.billEvery} {item.interval}
                </Text>
                {item.planType == "prepaid" && (
                  <Text>
                    Delivery Frequency: {item.deliveryEvery} {item.interval}
                  </Text>
                )}
              </BlockStack>
            </CardSection>
          </Card>
        );
      })}

      <Card title="Subscription Details">
        <CardSection>
          <InlineStack>
            <TextField
              label="Frequency Plan Name"
              type="text"
              value={frequencyPlanName}
              onChange={(value) => {
                console.log(value, " was typed"), setFrequencyPlanName(value);
              }}
              error={
                planList.length > 0
                  ? planList.some(
                      (item) => item.frequencyPlanName === frequencyPlanName
                    )
                    ? "Frequency Plan Name cannot be the same"
                    : frequencyPlanName.length === 0
                    ? "Frequency Plan Name is required!"
                    : false
                  : frequencyPlanName.length === 0
                  ? "Frequency Plan Name is required!"
                  : false
              }
            />

            <Select
              label="Plan Type"
              options={options}
              // labelInline
              onChange={(e) => {
                setplanType(e), console.log(e, "was selected");
                e != "prepaid" && setAutoRenew(true);
              }}
              value={planType}
            />
          </InlineStack>
          <InlineStack>
            <TextField
              label="Bill Every"
              type="number"
              value={billEvery}
              onChange={(value) => {
                console.log(value, " was typed"), setbillEvery(value);
              }}
              error={
                billEvery &&
                (!/^\d+$/.test(billEvery) || Number(billEvery) <= 0)
                  ? "Must be a number greater than zero!"
                  : false
              }
            />

            <Select
              label="Period"
              options={options1}
              // labelInline
              onChange={(e) => {
                console.log(e, "was selected");
                setinterval(e);
              }}
              value={interval}
            />
          </InlineStack>

          {planType == "prepaid" && (
            <>
              <InlineStack>
                <TextField
                  label="Delivery Every"
                  type="number"
                  value={deliveryEvery}
                  onChange={(value) => {
                    console.log(value, " was typed"), setdeliveryEvery(value);
                  }}
                  error=""
                />

                <Select
                  label="Period"
                  options={options1}
                  // labelInline
                  onChange={(e) => {
                    console.log(e, "was selected");
                    setinterval(e);
                  }}
                  value={interval}
                />
              </InlineStack>
            </>
          )}
          <CardSection>
            <Checkbox
              label="Auto Renew"
              checked={autoRenew}
              onChange={() =>
                planType == "prepaid"
                  ? setAutoRenew(!autoRenew)
                  : setAutoRenew(true)
              }
            />
          </CardSection>
          {autoRenew && (
            <>
              
              <InlineStack>
                <TextField
                  label="Minimum Billing Cycles"
                  type="number"
                  value={minCycle}
                  onChange={(value) => {
                    console.log(value, " was typed"), setminCycle(value);
                  }}
                />

                <TextField
                  label="Maximum Billing Cycles"
                  type="number"
                  value={maxCycle}
                  onChange={(value) => {
                    console.log(value, " was typed"), setmaxCycle(value);
                  }}
                />
              </InlineStack>
            </>
          )}
          <CardSection>
            <Checkbox
              label="Offer Discount"
              checked={offerDiscount}
              onChange={() => setOfferDiscount(!offerDiscount)}
            />
          </CardSection>

          {offerDiscount && (
            <>
              <InlineStack>
                <TextField
                  label="Discount Value"
                  type="number"
                  //  placeholder="Enter discount"
                  value={discount}
                  onChange={(value) => {
                    console.log(value, " was typed"), setDiscount(value);
                  }}
                />

                <Select
                  label="Discount Type"
                  options={[
                    { label: "Percentage", value: "percentage" },
                    { label: "Fixed", value: "fixed" },
                  ]}
                  // labelInline
                  onChange={(e) => {
                    console.log(e, "was selected"), setdiscountType(e);
                  }}
                  value={discountType}
                />
              </InlineStack>
            </>
          )}
          {/* <Checkbox
            label="Free Trial"
            checked={freeTrial}
            onChange={() => setFreeTrial(!freeTrial)}
          />
          {freeTrial && (
            <>
              <TextField
                label="Free Trial Count"
                type="text"
                value={freeTrialCount}
                onChange={(value) => {
                  console.log(value, " was typed"), setFreeTrialCount(value);
                }}
              />
            </>
          )} */}
          <Button
            title={!editState ? "Add Plan" : "Update Plan"}
            onPress={addPlan}
          />
        </CardSection>
      </Card>
      <InlineStack>
        <Button title="Submit" kind="primary" onPress={createPlanGroup} />
        <Button title="Cancel" onPress={() => close()} />
      </InlineStack>
    </>
  );
}

// function Add() {
//   const { getSessionToken } = useSessionToken();
//   const { extensionPoint } = useExtensionApi();
//   const { show: showToast } = useToast();
//   const { close, done, setPrimaryAction, setSecondaryAction } = useContainer();
//   const data = useData();
// console.log(data);
//   const [plans, setplans] = useState([]);
//   const [selected, setselected] = useState([]);
//   const [checkedPlans, setCheckedPlans] = useState([]);
//   const [selectedPlans, setSelectedPlans] = useState([]);

//   console.log("existing options");

//   useEffect(() => {
//     setPrimaryAction({
//       content: "Add",
//       onAction: async () => {

//         console.log(checkedPlans, "checked items")

//         console.log("primary action pressed!",selectedPlans);
//         await addProduct();
//         // done();
//       },
//     });

//     setSecondaryAction({
//       content: "Cancel",
//       onAction: () => {
//         console.log("secondary action pressed!");
//         close();
//       },
//     });
//   }, [close, done, setSecondaryAction]);

//   useEffect(async () => {
//     let token = await getSessionToken();
//     const response = await fetch(
//       "https://revlytic.shinedezign.pro/api/prodEx/prodExGetallPlans",
//       {
//         method: "POST", // or 'PUT'
//         headers: {
//           "Content-Type": "application/json",
//           Authentication: token,
//         },
//       }
//     );

//     const result = await response.json();
//     if (result.message == "success") {
//       console.log(result, "ghgh");
//       setplans(result.data);
//     }
//   }, []);

// const handleSelect = (checked, id) => {
//   const plans = checked ? selectedPlans.concat(id) : selectedPlans.filter((pid) => pid !== id);
//   setSelectedPlans(plans);
//   setCheckedPlans(plans);
// }

//   const handleCheckbox = (e, id) => {
//     let arr = [...selected];
//     // if (e) {
//     //   arr.push(id);
//     //   setselected(arr)
//     //   setCheckedPlans(arr);

//     // } else {
//     //   const checkArr = arr.filter(item => item !== id);
//     //   setselected(checkArr)
//     //   setCheckedPlans(checkArr);

//     // }

//     const plans = e ? selectedPlans.concat(id) : selectedPlans.filter((pid) => pid !== id);
//     setSelectedPlans(plans);
//     setCheckedPlans(plans);
//   }

//   // console.log(checkedPlans, "checked")

//   console.log(selected,"cvcvcv")
//   const addProduct = async() => {
//     let token = await getSessionToken();
//     const response = await fetch(
//       "https://revlytic.shinedezign.pro/api/prodEx/prodExAddProduct",
//       {
//         method: "POST", // or 'PUT'
//         headers: {
//           "Content-Type": "application/json",
//           Authentication: token,

//         },
//         body: JSON.stringify({data,selected})
//       }
//     );

//     const result = await response.json();
//     if (result.message == "success") {
//       if (result.message == "success") {
//         showToast("Plan added successfully");
//         // location.reload()
//       }
//     }
//   }

//   return (
//     <>
//       <InlineStack>
//         {/* {plans?.map((item) => {
//             return (
//                   <>
//                   <Text>{item.plan_group_name}</Text>
//                   <Checkbox onChange={(e) => handleCheckbox(e, item.plan_group_id)} value={selected.includes(item.plan_group_id)} />
//                   </>
//               )
//         })} */}

//         {plans.map((plan) => (
//           <Checkbox
//             key={plan.id}
//             label={plan.plan_group_name}
//             onChange={(e)=>handleCheckbox(e, plan.plan_group_id)}
//             checked={checkedPlans.includes(plan.plan_group_id)}
//           />
//         ))}
//        </InlineStack>
//   </>

//   )
// }

function Add() {
  const data = useData();
  const { show: showToast } = useToast();
  const { close, done, setSecondaryAction, setPrimaryAction } = useContainer();
  const { getSessionToken } = useSessionToken();
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [checkedPlans, setCheckedPlans] = useState([]);
  const [plans, setplans] = useState([]);

  const handleSelect = (checked, id) => {
    const plans = checked
      ? selectedPlans.concat(id)
      : selectedPlans.filter((pid) => pid !== id);
    setSelectedPlans(plans);
    setCheckedPlans(plans);
  };

  // Configure the extension container UI
  useEffect(() => {
    setPrimaryAction({
      content: "Add to plan",
      onAction: async () => {
        const token = await getSessionToken();

        console.log(selectedPlans, "selected plans");
        console.log(checkedPlans, "checked plans");

        const response = await fetch(
          "https://revlytic.shinedezign.pro/api/prodEx/prodExAddProduct",
          {
            method: "POST", // or 'PUT'
            headers: {
              "Content-Type": "application/json",
              Authentication: token,
            },
            body: JSON.stringify({ data, selectedPlans }),
          }
        );

        const result = await response.json();

        console.log(result, "result");
        if (result.message == "success") {
          showToast("Plan added successfully");
          done();
        }
      },
    });

    setSecondaryAction({
      content: "Cancel",
      onAction: () => close(),
    });
  }, [
    selectedPlans,
    getSessionToken,
    close,
    done,
    setPrimaryAction,
    setSecondaryAction,
  ]);

  useEffect(async () => {
    let token = await getSessionToken();
    const response = await fetch(
      "https://revlytic.shinedezign.pro/api/prodEx/prodExGetallPlans",
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          Authentication: token,
        },
      }
    );

    const result = await response.json();
    if (result.message == "success") {
      setplans(result.data);
    }
  }, []);

  return (
    <>
      <InlineStack>
        {plans.map((plan) => (
          <Checkbox
            key={plan.id}
            label={plan.plan_group_name}
            onChange={(e) => handleSelect(e, plan.plan_group_id)}
            checked={checkedPlans.includes(plan.plan_group_id)}
          />
        ))}
      </InlineStack>
    </>
  );
}

function Remove() {
  const { getSessionToken } = useSessionToken();
  const { show: showToast } = useToast();
  const { close, done, setPrimaryAction, setSecondaryAction } = useContainer();
  const { extensionPoint, container } = useExtensionApi();
  const data = useData();

  console.log(data, "clicked on remove");

  const removeVariants = async () => {
    let token = await getSessionToken();

    const response = await fetch(
      "https://revlytic.shinedezign.pro/api/prodEx/prodExRemoveVariants",
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          Authentication: token,
        },
        body: JSON.stringify({ data }),
      }
    );

    const result = await response.json();
    console.log("Success:", result);
    if (result.message == "success") {
      showToast("Plan removed successfully");
      // location.reload()
    }
  };

  useEffect(() => {
    setPrimaryAction({
      content: "Remove",
      onAction: async () => {
        console.log("primary action pressed!");
        await removeVariants();
        done();
      },
    });

    setSecondaryAction({
      content: "Cancel",
      onAction: () => {
        console.log("secondary action pressed!");
        close();
      },
    });
  }, [close, done, setPrimaryAction, setSecondaryAction]);
  console.log("9 oct");
  return (
    <>
      <Text>Are you sure you want to remove this plan !!</Text>
    </>
  );
}

function Edit() {
  const data = useData();
  const { getSessionToken } = useSessionToken();
  const { show: showToast } = useToast();
  const { extensionPoint } = useExtensionApi();
  const { close, done, setPrimaryAction, setSecondaryAction } = useContainer();
  const [prevPlanList, setprevPlanList] = useState([]);
  const [planList, setplanList] = useState([]);
  const [planGroupName, setPlanGroupName] = useState("");
  const [planType, setplanType] = useState("payAsYouGo");
  const [autoRenew, setAutoRenew] = useState(true);
  const [offerDiscount, setOfferDiscount] = useState(false);
  const [freeTrial, setFreeTrial] = useState(false);
  const [frequencyPlanName, setFrequencyPlanName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [billEvery, setbillEvery] = useState(1);
  const [deliveryEvery, setdeliveryEvery] = useState(1);
  const [interval, setinterval] = useState("day");
  const [minCycle, setminCycle] = useState();
  const [maxCycle, setmaxCycle] = useState();
  const [discount, setDiscount] = useState(0);
  const [discountType, setdiscountType] = useState("percentage");
  const [freeTrialCount, setFreeTrialCount] = useState("");
  const [editState, seteditState] = useState(false);
  const [editIndex, seteditIndex] = useState();
  const [deletedPlans, setdeletedPlans] = useState([]);
  const [whichPlanList, setwhichPlanList] = useState(false);
  const [editIndexOfPrevPlan, seteditIndexOfPrevPlan] = useState([]);

  // const [errors, seterrors] = useState({
  //   planGroupName: false,
  //   frequencyPlanName: false,
  //   billEvery: false,
  //   deliveryEvery: false,
  //   interval: false,
  //   minCycle: false,
  //   maxCycle: false,
  //   discount: false,
  //   freeTrialCount:false

  // });
  const [error, seterror] = useState(true);

  console.log(data, "dtaaaaatatatatabye");
  const options = [
    { label: "Pay As You Go", value: "payAsYouGo" },
    { label: "Prepaid", value: "prepaid" },
  ];
  const options1 = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
  ];
  const numberRegex = /^-?\d+(\.\d+)?$/;

  useEffect(async () => {
    let token = await getSessionToken();

    const createApi = await fetch(
      "https://revlytic.shinedezign.pro/api/prodEx/prodExPlanDetails",
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          Authentication: token,
        },
        body: JSON.stringify({ id: data.sellingPlanGroupId }),
      }
    );
    const result = await createApi.json();
    console.log(result);
    let allplans = result.data.plans;
    let arr = [];
    allplans.map((item) => {
      arr.push({
        frequencyPlanName: item?.planName,
        planType: item?.planType,
        billEvery: item?.billingEvery,
        interval: item?.billingEveryType,
        deliveryEvery: item?.deliveryEvery,
        autoRenew: item?.billingCycle,
        minCycle: item?.minCycle,
        maxCycle: item?.maxCycle,
        offerDiscount: item?.offerDiscount,
        discount: item?.price,
        discountType: item?.priceType,
        plan_id: item?.plan_id,
      });
    });
    setprevPlanList(arr);
    setPlanGroupName(result.data.plan_group_name);
  }, []);

  const addPlan = () => {
    let arr = [];
    if (editState) {
      console.log("editatate");
      if (!whichPlanList) {
        console.log("newlist");
        arr = [...planList];
        arr.splice(editIndex, 1);
        arr = [...arr, ...prevPlanList];
      } else {
        console.log("prevlist");

        arr = [...prevPlanList];
        arr.splice(editIndex, 1);
        arr = [...arr, ...planList];
      }
    } else {
      console.log("inelseee");
      arr = [...planList, ...prevPlanList];
    }

    if (
      frequencyPlanName.length > 0 &&
      !arr.some((item) => item.frequencyPlanName === frequencyPlanName) &&
      // !arr.some(
      //   (item) =>
      //     item.billEvery === billEvery &&
      //     item.interval == interval &&
      //     item.planType != "prepaid" &&
      //     planType != "prepaid"
      // ) &&
      // !arr.some(
      //   (item) =>
      //     item.billEvery === billEvery &&
      //     item.deliveryEvery == deliveryEvery &&
      //     item.interval == interval &&
      //     item.planType == "prepaid" &&
      //     planType == "prepaid"
      // )
      // &&
      billEvery > 0 &&
      numberRegex.test(billEvery)
    ) {
      let details = {
        frequencyPlanName,
        planType,
        billEvery,
        interval,
        autoRenew,
        minCycle,
        maxCycle,
        offerDiscount,
        discount,
        discountType,
      };
      if (planType == "prepaid") {
        details.deliveryEvery = deliveryEvery;
      }
      if (!editState) {
        let arr = [...planList];
        arr.push(details);
        setplanList(arr);
      } else {
        if (!whichPlanList) {
          let arr = [...planList];
          arr[editIndex] = details;
          setplanList(arr);
          seteditState(false);
        } else {
          let arr = [...prevPlanList];
          arr[editIndex] = details;
          setprevPlanList(arr);
          let newarr = [...editIndexOfPrevPlan];
          newarr.push(editIndex);
          seteditIndexOfPrevPlan(newarr);
          seteditState(false);
        }
      }

      setFrequencyPlanName("");
      setplanType("payAsYouGo");
      setbillEvery(1);
      setdeliveryEvery(1);
      setinterval("day");
      setAutoRenew(false);
      setminCycle(1);
      setmaxCycle(1);
      setOfferDiscount(false);
      setDiscount(1);
      setdiscountType("percentage");
    } else {
      if (
        frequencyPlanName.length > 0 &&
        arr.some((item) => item.frequencyPlanName === frequencyPlanName)
      ) {
        showToast("Plan names should be unique");
      }
      if (
        arr.some(
          (item) =>
            item.billEvery === billEvery &&
            item.interval == interval &&
            item.planType != "prepaid" &&
            planType != "prepaid"
        )
      ) {
        showToast("Another plan with same billing frequency exists");
      }
      if (
        arr.some(
          (item) =>
            item.billEvery === billEvery &&
            item.deliveryEvery == deliveryEvery &&
            item.interval == interval &&
            item.planType == "prepaid" &&
            planType == "prepaid"
        )
      ) {
        showToast(
          "Same plan with same billing and delivery frequencies exist already !!"
        );
      }
    }
  };
  console.log(planList, "jkhg");

  const DeletePlan = (index) => {
    let arr = [...planList];
    arr.splice(index, 1);
    setplanList(arr);
  };
  const DeletePrevPlan = (index) => {
    let arr = [...prevPlanList];
    let newarr = [...deletedPlans];
    newarr.push(arr[index].plan_id);

    setdeletedPlans(newarr);
    arr.splice(index, 1);
    setprevPlanList(arr);
  };

  const updatePlanGroup = async () => {
    let token = await getSessionToken();

    if (planList.length > 0 || prevPlanList.length > 0) {
      const createApi = await fetch(
        "https://revlytic.shinedezign.pro/api/prodEx/prodExPlanUpdate",
        {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
            Authentication: token,
          },
          body: JSON.stringify({
            id: data.sellingPlanGroupId,
            planGroupName,
            prevPlanList,
            planList,
            editIndexOfPrevPlan,
            deletedPlans,
          }),
        }
      );
      const result = await createApi.json();
      console.log(result, "nbvcx");
      if (result.message == "success") {
        showToast("Plan updated successfully");
        done();
        // location.reload()
      } else if (result.message == "userError") {
        showToast(result.data);
      } else {
        showToast(result.data);
      }
    } else {
      if (!(planList.length > 0 || prevPlanList.length > 0)) {
        showToast("Minimum one plan required !!");
      } else {
        showToast("Enter valid Plan Name !!");
      }
    }
  };
  const EditPlan = (index) => {
    seteditIndex(index);
    seteditState(true);
    setwhichPlanList(false);
    let arr = [...planList];
    setFrequencyPlanName(arr[index].frequencyPlanName);
    setplanType(arr[index].planType);
    setbillEvery(arr[index].billEvery);
    setdeliveryEvery(arr[index].deliveryEvery);
    setinterval(arr[index].interval);
    setAutoRenew(arr[index].autoRenew);
    setminCycle(arr[index].minCycle);
    setmaxCycle(arr[index].maxCycle);
    setOfferDiscount(arr[index].offerDiscount);
    setDiscount(arr[index].discount);
    setdiscountType(arr[index].discountType);
  };
  const EditPrevPlan = (index) => {
    seteditIndex(index);
    seteditState(true);
    setwhichPlanList(true);
    let arr = [...prevPlanList];
    setFrequencyPlanName(arr[index].frequencyPlanName);
    setplanType(arr[index].planType);
    setbillEvery(arr[index].billEvery);
    setdeliveryEvery(arr[index].deliveryEvery);
    setinterval(arr[index].interval);
    setAutoRenew(arr[index].autoRenew);
    setminCycle(arr[index].minCycle);
    setmaxCycle(arr[index].maxCycle);
    setOfferDiscount(arr[index].offerDiscount);
    setDiscount(arr[index].discount);
    setdiscountType(arr[index].discountType);
  };
  return (
    <>
      <Heading id="profile_heading" level={3}>
        Update Plan
      </Heading>
      {/* <BlockStack> */}
      <Card>
        <CardSection>
          <TextField
            label="Plan Name"
            type="text"
            value={planGroupName}
            onChange={(value) => {
              console.log(value, " was typed"), setPlanGroupName(value);
            }}
            error={planGroupName.length < 1 ? "Plan Name is required!" : false}
          />
        </CardSection>
      </Card>
      {/* </BlockStack> */}
      {prevPlanList?.map((item, index) => {
        return (
          <Card>
            <CardSection>
              <BlockStack inlineAlignment="center">
                <InlineStack>
                  <Button
                    appearance="critical"
                    title="Delete"
                    onPress={() => DeletePrevPlan(index)}
                  />
                  <Button title="Edit" onPress={() => EditPrevPlan(index)} />
                </InlineStack>

                <Text>Name: {item.frequencyPlanName}</Text>
                <Text>
                  Type: {item.planType == "prepaid" ? "Prepaid" : "Pay As You Go"}
                </Text>
                <Text>
                  Billing Frequency: {item.billEvery} {item.interval}
                </Text>
                {item.planType == "prepaid" && (
                  <Text>
                    Delivery Frequency: {item.deliveryEvery} {item.interval}
                  </Text>
                )}
              </BlockStack>
            </CardSection>
          </Card>
        );
      })}
      {planList?.map((item, index) => {
        return (
          <Card>
            <CardSection>
              <BlockStack inlineAlignment="center">
                <InlineStack>
                  <Button
                    appearance="critical"
                    title="Delete"
                    onPress={() => DeletePlan(index)}
                  />
                  <Button title="Edit" onPress={() => EditPlan(index)} />
                </InlineStack>

                <Text>Name: {item.frequencyPlanName}</Text>
                <Text>Type: {item.planType}</Text>
                <Text>
                  Billing Frequency: {item.billEvery} {item.interval}
                </Text>
                {item.planType == "prepaid" && (
                  <Text>
                    Delivery Frequency: {item.deliveryEvery} {item.interval}
                  </Text>
                )}
              </BlockStack>
            </CardSection>
          </Card>
        );
      })}

      <Card title="Subscription Details">
        <CardSection>
          <InlineStack>
            <TextField
              label="Frequency Plan Name"
              type="text"
              value={frequencyPlanName}
              onChange={(value) => {
                console.log(value, " was typed"), setFrequencyPlanName(value);
              }}
              error={
                planList.length > 0
                  ? planList.some(
                      (item) => item.frequencyPlanName === frequencyPlanName
                    )
                    ? "Frequency Plan Name cannot be the same"
                    : frequencyPlanName.length === 0
                    ? "Frequency Plan Name is required!"
                    : false
                  : frequencyPlanName.length === 0
                  ? "Frequency Plan Name is required!"
                  : false
              }
            />
            <Select
              label="Plan Type"
              options={options}
              // labelInline
              onChange={(e) => {
                setplanType(e), console.log(e, "was selected");
              }}
              value={planType}
            />
          </InlineStack>

          <InlineStack>
      
            <TextField
              label="Bill Every"
              type="number"
              value={billEvery}
              onChange={(value) => {
                console.log(value, " was typed"), setbillEvery(value);
              }}
              error={
                billEvery &&
                (!/^\d+$/.test(billEvery) || Number(billEvery) <= 0)
                  ? "Must be a number greater than zero!"
                  : false
              }
            />
            <Select
              label="Period"
              options={options1}
              // labelInline
              onChange={(e) => {
                console.log(e, "was selected");
                setinterval(e);
              }}
              value={interval}
            />
          </InlineStack>

          {planType == "prepaid" && (
            <>
              <InlineStack>
                <TextField
                  label="Delivery Every"
                  type="number"
                  value={deliveryEvery}
                  onChange={(value) => {
                    console.log(value, " was typed"), setdeliveryEvery(value);
                  }}
                  error=""
                />
                <Select
                  label="Period"
                  options={options1}
                  // labelInline
                  onChange={(e) => {
                    console.log(e, "was selected");
                    setinterval(e);
                  }}
                  value={interval}
                />
              </InlineStack>
            </>
          )}

          <CardSection>
            <Checkbox
              label="Auto Renew"
              checked={autoRenew}
              onChange={() =>
                planType == "prepaid"
                  ? setAutoRenew(!autoRenew)
                  : setAutoRenew(true)
              }
            />
          </CardSection>

          <InlineStack>
            <TextField
              label="Minimum Billing Cycles"
              type="number"
              value={minCycle}
              onChange={(value) => {
                console.log(value, " was typed"), setminCycle(value);
              }}
            />
            <TextField
              label="Maximum Billing Cycles"
              type="number"
              value={maxCycle}
              onChange={(value) => {
                console.log(value, " was typed"), setmaxCycle(value);
              }}
            />
          </InlineStack>

          <CardSection>
            <Checkbox
              label="Offer Discount"
              checked={offerDiscount}
              onChange={() => setOfferDiscount(!offerDiscount)}
            />
          </CardSection>

          {offerDiscount && (
            <>
              <InlineStack>
                <TextField
                  label="Discount Value"
                  type="number"
                  //  placeholder="Enter discount"
                  value={discount}
                  onChange={(value) => {
                    console.log(value, " was typed"), setDiscount(value);
                  }}
                />

                <Select
                  label="Discount Type"
                  options={[
                    { label: "Percentage", value: "percentage" },
                    { label: "Fixed", value: "fixed" },
                  ]}
                  // labelInline
                  onChange={(e) => {
                    console.log(e, "was selected"), setdiscountType(e);
                  }}
                  value={discountType}
                />
              </InlineStack>
            </>
          )}
          <CardSection>
            <Button
              title={!editState ? "Add Plan" : "Update Plan"}
              onPress={addPlan}
            />
          </CardSection>
        </CardSection>
      </Card>
      <InlineStack>
        <Button title="Submit" kind="primary" onPress={updatePlanGroup} />
        <Button title="Cancel" onPress={() => close()} />
      </InlineStack>
    </>
  );
}

// Your extension must render all four modes
extend(
  "Admin::Product::SubscriptionPlan::Add",
  render(() => <Add />)
);
extend(
  "Admin::Product::SubscriptionPlan::Create",
  render(() => <Create />)
);
extend(
  "Admin::Product::SubscriptionPlan::Remove",
  render(() => <Remove />)
);
extend(
  "Admin::Product::SubscriptionPlan::Edit",
  render(() => <Edit />)
);
