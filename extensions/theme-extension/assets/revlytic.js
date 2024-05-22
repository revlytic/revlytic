console.log(" dec27");
let shop = Shopify.shop;

let currentUrl=window.location.href
if (currentUrl.includes('account')) {
  console.log('URL contains "account"');
  
  let targetElement = document.getElementsByTagName("a");
  let targetArray = Array.from(targetElement); // Convert HTMLCollection to an array
  targetArray.forEach((item) => {
    let url = item.href;
    if (url.includes("account/addresses")) {
      let button = document.createElement("button");

 let linebreak = document.createElement("br");
      button.innerHTML = "Manage Subscriptions";
// button.id="revlytic-account-button";
  const id = ShopifyAnalytics.meta.page.customerId;
   
      button.addEventListener("click", function() {
          // const targetUrl = "https://quick-start-0d1be701.myshopify.com/apps/revlytic-subscriptions"; // Replace with your desired URL
          const targetUrl = `https://${shop}/apps/revlytic-subscriptions?cid=${id}`; // Replace with your desired URL
          console.log("targetUrl",targetUrl)
          window.location.href = targetUrl;
      });
      // item.appendChild(button);
// item.parentNode.insertBefore(linebreak, item);
item.parentNode.insertBefore(button, item);
button.insertAdjacentHTML('afterend', '<br>');

    }
  });
}


let serverPath = "https://dev.revlytic.co";

let activeCurrency = Shopify.currency.active;
console.log("activeeeecrc",activeCurrency)
let fetchedData = [];
//console.log(selectedVariant,"sdfkjdfksdf;lskdf;sld;fffjdjjjhhhhjkjkjkklkl;klkl");
  let widgetSettingsData = {
  purchaseOptionsText: "Purchase Options",

  oneTimePurchaseText: "One-Time Purchase",
  
  subscriptionOptionsText: "Subscribe and Save",

  deliveryFrequencyText: "Delivery Frequency",
  billingFrequencyText: "Billing Frequency",
  deliveryFrequencyOptionsText:"Delivery Frequency",
  // choosePlanText: "Choose Plan",
  everyText: "Every",
  
  // prepaidText: "Prepaid",
  
  // payAsYouGoText: "Pay as you go",
  
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

  borderColor: "#000000",

  radioButtonColor: "#007F00",
  
  widgetBackgroundColor: "#FFFFFF",
  
  priceColor: "#5F5F5F",
  
  // Rest of the form field values
};

let purchaseOption;
let selectedPlanPrice;
let selectedPlanPriceForPriceBlock;
let options;
let positionPriceDiv;
let priceDivData1;
let priceDivData2;
let selectedPlanIndex;
let dropdownData = [];
let selectedPlanDeliveryFrequency;
let selectedPlanBillingFrequency;
//console.log("selectedPlanPricessssssss", selectedPlanPrice);

const getCurrencySymbol = (currency) => {
  const symbol = new Intl.NumberFormat("en", { style: "currency", currency })
  .formatToParts()
    .find((x) => x.type === "currency");
    return symbol && symbol.value;
  };

  //console.log("activecrncy",activeCurrency,"----dssasdasddd---",getCurrencySymbol(activeCurrency))
  
  const priceMultiplier = (price, billingValue, deliveryValue) => {
    //console.log("inmultiplier", price);
  // Step 1: Extract the number from the string using a regular expression
  let numberMatch = price.match(/\d+(\.\d+)?/);
  //console.log("numbermatch", numberMatch);
  if (numberMatch) {
    //console.log("inmubmer");
    let numberStr = numberMatch[0];
    // Convert the number to a float and multiply by 5
    let multipliedNumber =
    (parseFloat(numberStr) *(parseFloat(billingValue) / parseFloat(deliveryValue))).toFixed(2);
    //console.log(parseFloat(numberStr), "tttttttr", billingValue, deliveryValue);
    //console.log( parseFloat(billingValue) / parseFloat(deliveryValue), "fdsdfsdfttr");
      //console.log("multipliedNumber", multipliedNumber);
      // Step 3: Convert the result back to a string
      let multipliedNumberStr = multipliedNumber.toString();

    // Step 4: Join the modified number with the rest of the original string
    let result = price.replace(numberStr, multipliedNumberStr);
    //console.log("result", result);
    return result;
  } else {
    //console.log("No number found in the string.");
  }
};
function showAmountWithCurrency(value) {
  let moneyFormat = shopCurrencySymbol;
  let revCurrencyFormatcondition;

  if (moneyFormat.includes("{{amount_no_decimals}}")) {
    revCurrencyFormatcondition = "amount_no_decimals";
  } else if (moneyFormat.includes("{{amount_with_comma_separator}}")) {
    revCurrencyFormatcondition = "amount_with_comma_separator";
  } else if (
    moneyFormat.includes("{{amount_no_decimals_with_space_separator}}")
  ) {
    revCurrencyFormatcondition = "amount_no_decimals_with_space_separator";
  } else if (
    moneyFormat.includes("{{amount_no_decimals_with_comma_separator}}") || moneyFormat.includes("${{ amount_no_decimals_with_comma_separator }}")
  ) {
    revCurrencyFormatcondition = "amount_no_decimals_with_comma_separator";
  } else if (moneyFormat.includes("{{amount_with_space_separator}}$")) {
    revCurrencyFormatcondition = "amount_with_space_separator";
  } else if (moneyFormat.includes("{{amount}}")) {
    revCurrencyFormatcondition = "amount";
  }else{
      let pattern = /{{(.*?)}}/;
       let match = moneyFormat.match(pattern);
       revCurrencyFormatcondition = `${match[1]}`
  }

  let revCurrencyprice;
  switch (revCurrencyFormatcondition) {
    case "amount":
      revCurrencyprice = moneyFormat.replace("{{amount}}", value);
      break;
    case "amount_with_comma_separator":
      if (value) {
        let stringValue = value.toString();
        if (stringValue.indexOf(".") > 0) {
          let comma_seperator = stringValue.replace(".", ",");
          revCurrencyprice = moneyFormat.replace(
            "{{amount_with_comma_separator}}",
            comma_seperator
          );
        } else {
          revCurrencyprice = moneyFormat.replace(
            "{{amount_with_comma_separator}}",
            value
          );
        }
      } else {
        revCurrencyprice = moneyFormat.replace(
          "{{amount_with_comma_separator}}",
          value
        );
      }
      break;
    case "amount_no_decimals_with_space_separator":
      let noDecimalwithSpace = parseInt(value);
      revCurrencyprice = moneyFormat.replace(
        "{{amount_no_decimals_with_space_separator}}",
        noDecimalwithSpace
      );
      break;
    case "amount_no_decimals":
      let noDecimal = parseInt(value);
      revCurrencyprice = moneyFormat.replace(
        "{{amount_no_decimals}}",
        noDecimal
      );
      break;
    case "amount_no_decimals_with_comma_separator":
      let noDecimalwithComma = parseInt(value);

      // revCurrencyprice = moneyFormat.replace(
      //   "{{amount_no_decimals_with_comma_separator}}",
      //   noDecimalwithComma
      // );
      revCurrencyprice = moneyFormat.replace(/{{amount_no_decimals_with_comma_separator}}|\${{ amount_no_decimals_with_comma_separator }}/g, noDecimalwithComma);
      break;
    case "amount_with_space_separator":
      if (value) {
        let spaceStringValue = value.toString();
        if (spaceStringValue.indexOf(".") > 0) {
          let Space_comma_seperator = spaceStringValue.replace(".", ",");
          revCurrencyprice = moneyFormat.replace(
            "{{amount_with_space_separator}}",
            Space_comma_seperator
          );
        } else {
          revCurrencyprice = moneyFormat.replace(
            "{{amount_with_space_separator}}",
            value
          );
        }
      } else {
        revCurrencyprice = moneyFormat.replace(
          "{{amount_with_space_separator}}",
          value
        );
      }
      break;
    default:
       revCurrencyprice = moneyFormat.replace(`{{${revCurrencyFormatcondition}}}`,value);
    
  }

  return revCurrencyprice;
}

if (revlytic_page_type == "product") {
  // function handlePlanSelection(e) {
  //   let extractPlanId = "ID_" + e.target.value.split("/").at(-1);
  //   //console.log("extractPlanId", extractPlanId);
  //   let getPrice =
  //     Revlytic.variant["VID_" + selectedVariant]?.allocations?.selling_plans
  //       ?.list[extractPlanId]?.checkout_charge_amount;
  //   //console.log("herapheriii", getPrice);
  //   // selectedPlanPrice = getPrice;
  //   // document.getElementById("revlytic_subscribe_price").innerText = getPrice;

  //   var form = document.querySelector(
  //     'form[action="/cart/add"][data-type="add-to-cart-form"]'
  //   );
  //   //console.log("form", form);
  //   var sellingPlanInput = form.querySelector('input[name="selling_plan"]');
  //   //console.log("selllinPlanInput", sellingPlanInput);
  //   if (sellingPlanInput) {
  //     //console.log("innnnnnererrrrrrr");
  //     sellingPlanInput.value = e.target.value.split("/").at(-1);
  //   }

  //   // //console.log(
  //   //   "rukozaraa",
  //   //   document.getElementById("revlytic-price-div-save-section")
  //   // );

  //   // //console.log(
  //   //   "planchangevalue",
  //   //   e.target.options[e.target.selectedIndex].dataset.index
  //   // );

  //   selectedPlanIndex = e.target.options[e.target.selectedIndex].dataset.index;
  //   let item = dropdownData[selectedPlanIndex];
  //   //console.log("auta", item);

  //   //console.log( "saaaaaahiiiiiiiillllll",item.billingEvery,item.deliveryEvery);

  //   // selectedPlanPrice =
  //   //   item.planType == "prepaid"
  //   //     ? priceMultiplier(getPrice, item.billingEvery, item.deliveryEvery)
  //   //     : getPrice ;


  //   selectedPlanPrice=getPrice;


  //   document.getElementById("revlytic_subscribe_price").innerText =
  //     selectedPlanPrice;

  //   //console.log("after mul,", selectedPlanPrice);
  //   document.getElementById("revlytic-delivery-frequency").innerText =
  //     item.planType == "prepaid"
  //       ? `: ${widgetSettingsData.everyText} ${item.deliveryEvery} ${
  //           item.billingEveryType == "month"
  //             ? widgetSettingsData.monthFrequencyText
  //             : item.billingEveryType == "year"
  //             ? widgetSettingsData.yearFrequencyText
  //             : item.billingEveryType == "week"
  //             ? widgetSettingsData.weekFrequencyText
  //             : item.billingEveryType == "day"
  //             ? widgetSettingsData.dayFrequencyText
  //             : ""
  //         }`
  //       : `: ${widgetSettingsData.everyText}  ${item.billingEvery} ${
  //           item.billingEveryType == "month"
  //             ? widgetSettingsData.monthFrequencyText
  //             : item.billingEveryType == "year"
  //             ? widgetSettingsData.yearFrequencyText
  //             : item.billingEveryType == "week"
  //             ? widgetSettingsData.weekFrequencyText
  //             : item.billingEveryType == "day"
  //             ? widgetSettingsData.dayFrequencyText
  //             : ""
  //         }`;

  //   document.getElementById("revlytic-billing-frequency").innerText =
  //     item.planType == "prepaid"
  //       ? `: ${widgetSettingsData.prepayText} ${item.billingEvery} ${
  //           item.billingEveryType == "month"
  //             ? widgetSettingsData.monthFrequencyText
  //             : item.billingEveryType == "year"
  //             ? widgetSettingsData.yearFrequencyText
  //             : item.billingEveryType == "week"
  //             ? widgetSettingsData.weekFrequencyText
  //             : item.billingEveryType == "day"
  //             ? widgetSettingsData.dayFrequencyText
  //             : ""
  //         }`
  //       : `: ${widgetSettingsData.everyText} ${item.billingEvery} ${
  //           item.billingEveryType == "month"
  //             ? widgetSettingsData.monthFrequencyText
  //             : item.billingEveryType == "year"
  //             ? widgetSettingsData.yearFrequencyText
  //             : item.billingEveryType == "week"
  //             ? widgetSettingsData.weekFrequencyText
  //             : item.billingEveryType == "day"
  //             ? widgetSettingsData.dayFrequencyText
  //             : ""
  //         }`;

  //   if (
  //     (item.offerDiscount == false || item.offerDiscount == null) &&
  //     (item.freeTrial == false || item.freeTrial == null)
  //   ) {
  //     //console.log("breakfast");
  //     document.getElementById("revlytic-pricediv-main").style.display = "none";
  //     positionPriceDiv[0].style.display = "block";
  //   } else {
  //     //console.log("dinner");
  //     positionPriceDiv[0].style.display = "none";
  //     ///
  //     document.getElementById("revlytic-pricediv-main").innerHTML =
  //       item.offerDiscount ? priceDivData1 : priceDivData2;

  //     if (item.offerDiscount) {
  //       document.getElementById(
  //         "revlytic-price-div-selectedPlanPrice"
  //       ).innerText = getPrice;
  //     }

  //     // let setPriceSaveHtml1 = `${
  //     //   item.offerDiscount || item.freeTrial
  //     //     ? "(" + widgetSettingsData.saveText
  //     //     : ""
  //     // }  ${
  //     //   item.freeTrial && item.offerDiscount
  //     //     ? "100% " +
  //     //       widgetSettingsData.onFirstText +
  //     //       " " +
  //     //       (item.trialCount == "1" ? "" : item.trialCount) +
  //     //       " " +
  //     //       widgetSettingsData.orderText +
  //     //       ", " +
  //     //       widgetSettingsData.thenText +
  //     //       " "
  //     //     : item.freeTrial &&
  //     //       (item.offerDiscount == false || item.offerDiscount == null)
  //     //     ? "100% " +
  //     //       widgetSettingsData.onFirstText +
  //     //       " " +
  //     //       (item.trialCount == "1" ? "" : item.trialCount) +
  //     //       " " +
  //     //       widgetSettingsData.orderText +
  //     //       ")"
  //     //     : ""
  //     // }  ${
  //     //   item.offerDiscount && item.priceType == "percentage"
  //     //     ? item.price + "%)"
  //     //     : item.offerDiscount && item.priceType == "fixed"
  //     //     ? getCurrencySymbol(activeCurrency) +
  //     //       " " +
  //     //       item?.price_adjustment?.position_1?.value / 100 +
  //     //       ") "
  //     //     : ""
  //     // }`;

  //     // let setPriceSaveHtml = `${
  //     //   item?.price_adjustment
  //     //     ? "(" + widgetSettingsData.saveText
  //     //     : ""
  //     // } ${
  //     //   item?.price_adjustment?.position_1 &&  item?.price_adjustment?.position_2 && parseFloat(item?.price_adjustment?.position_2?.value) > 0
  //     //     ?  item?.price_adjustment?.position_1?.value + "% " +
  //     //       widgetSettingsData.onFirstText +
  //     //       " " +
  //     //       (item?.price_adjustment?.position_1?.order_count == "1" ? "" :item?.price_adjustment?.position_1?.order_count) +
  //     //       " " +
  //     //       widgetSettingsData.orderText +
  //     //       ", " +
  //     //       widgetSettingsData.thenText +
  //     //       " "
  //     //     :item?.price_adjustment?.position_1 &&  item?.price_adjustment?.position_2 && parseFloat(item?.price_adjustment?.position_2?.value) == 0
  //     //     ?  item?.price_adjustment?.position_1?.value + "% " +
  //     //     widgetSettingsData.onFirstText +
  //     //     " " +
  //     //     (item?.price_adjustment?.position_1?.order_count == "1" ? "" :item?.price_adjustment?.position_1?.order_count) +
  //     //     " " +
  //     //     widgetSettingsData.orderText +
  //     //       ")"
  //     //     : ""
  //     // }`



  //     let setPriceSaveHtml;
  
  //     if(item?.price_adjustment?.position_1 &&  !item?.price_adjustment?.position_2 ){///pos1 contain discount
      
  //       setPriceSaveHtml="(" +widgetSettingsData.saveText+ " "+(item?.price_adjustment?.position_1?.type=="percentage" ?  item?.price_adjustment?.position_1?.value + "%" : showAmountWithCurrency(parseFloat(item?.price_adjustment?.position_1?.value)/100)) +")"
      
      
  //     }
      
  //     else if(item?.price_adjustment?.position_1 &&  item?.price_adjustment?.position_2 )
      
  //     {
      
  //       setPriceSaveHtml="(" +widgetSettingsData.saveText+ " "+item?.price_adjustment?.position_1?.value+"%";
  //     if(parseFloat(item?.price_adjustment?.position_2?.value) > 0) 
  //     {
  //       //console.log("iyyiyiyiyis",widgetSettingsData.onFirstText)
  //       setPriceSaveHtml += widgetSettingsData.onFirstText + " " +(item?.price_adjustment?.position_1?.order_count == "1" ? "" : item?.price_adjustment?.position_1?.order_count) +
  //       " " +
  //       widgetSettingsData.orderText +
  //       ", " +
  //       widgetSettingsData.thenText +
  //       " " +
  //       (item?.price_adjustment?.position_2?.type=="percentage" ?  item?.price_adjustment?.position_2?.value + "%" : showAmountWithCurrency(parseFloat(item?.price_adjustment?.position_2?.value)/100))  +" off)"
      
  //     }else{
  //       setPriceSaveHtml += " "+widgetSettingsData.onFirstText + " " +(item?.price_adjustment?.position_1?.order_count == "1" ? "" : item?.price_adjustment?.position_1?.order_count) +
  //       " " +
  //       widgetSettingsData.orderText+ ")"
  //     }
  //     }





  //     document.getElementById("revlytic-price-div-save-section").innerHTML =
  //       setPriceSaveHtml;
  //     document.getElementById("revlytic-pricediv-main").style.display = "block";
  //   }
  // }
  function handlePlanSelection(e) {
    let extractPlanId = "ID_" + e.target.value.split("/").at(-1);
    //console.log("extractPlanId", extractPlanId);
    let getPrice =
      Revlytic.variant["VID_" + selectedVariant]?.allocations?.selling_plans
        ?.list[extractPlanId]?.checkout_charge_amount;
 

    // var form = document.querySelector(
    //   'form[action="/cart/add"][data-type="add-to-cart-form"]'
    // );
    // //console.log("form", form);
    // var sellingPlanInput = form.querySelector('input[name="selling_plan"]');
    // //console.log("selllinPlanInput", sellingPlanInput);
    // if (sellingPlanInput) {
    //   //console.log("innnnnnererrrrrrr");
    //   sellingPlanInput.value = e.target.value.split("/").at(-1);
    // }



//@@@@@@@  18jan   //////////
var form = document.querySelectorAll(
  'form[action*="/cart/add"]'
);
  form.forEach((item)=>
    {
console.log("isi",item)

      var sellingPlanInputs = item.querySelectorAll('input[name="selling_plan"]');
      console.log("e22novm",sellingPlanInputs) 
  
   
        console.log("22nov-sam")
        if (sellingPlanInputs.length === 0) {
          console.log("tickkkktokl")
          var newHiddenInput = document.createElement("input");
          newHiddenInput.type = "hidden";
          newHiddenInput.name = "selling_plan";
          newHiddenInput.value = e.target.value.split("/").at(-1);
  
          item.appendChild(newHiddenInput);
          //console.log("Created new hidden input:", newHiddenInput);
        } else {
          console.log("in3oct else",)
          
          sellingPlanInputs.forEach(function (input) {
            input.value = e.target.value.split("/").at(-1);
          });
        }
      




    }
    
    
    )



///////enddddd///////////////////
    selectedPlanIndex = e.target.options[e.target.selectedIndex].dataset.index;
    let item = dropdownData[selectedPlanIndex];
    //console.log("auta", item);

    //console.log( "saaaaaahiiiiiiiillllll",item.billingEvery,item.deliveryEvery);

    // selectedPlanPrice =
    //   item.planType == "prepaid"
    //     ? priceMultiplier(getPrice, item.billingEvery, item.deliveryEvery)
    //     : getPrice ;


    selectedPlanPrice=getPrice;


    document.getElementById("revlytic_subscribe_price").innerText =
      selectedPlanPrice;

    //console.log("after mul,", selectedPlanPrice);
    document.getElementById("revlytic-delivery-frequency").innerText =
      item.planType == "prepaid"
        ? `: ${widgetSettingsData.everyText} ${item.deliveryEvery} ${
            item.billingEveryType == "month"
              ? widgetSettingsData.monthFrequencyText
              : item.billingEveryType == "year"
              ? widgetSettingsData.yearFrequencyText
              : item.billingEveryType == "week"
              ? widgetSettingsData.weekFrequencyText
              : item.billingEveryType == "day"
              ? widgetSettingsData.dayFrequencyText
              : ""
          }`
        : `: ${widgetSettingsData.everyText}  ${item.billingEvery} ${
            item.billingEveryType == "month"
              ? widgetSettingsData.monthFrequencyText
              : item.billingEveryType == "year"
              ? widgetSettingsData.yearFrequencyText
              : item.billingEveryType == "week"
              ? widgetSettingsData.weekFrequencyText
              : item.billingEveryType == "day"
              ? widgetSettingsData.dayFrequencyText
              : ""
          }`;

    document.getElementById("revlytic-billing-frequency").innerText =
      item.planType == "prepaid"
        ? `: ${widgetSettingsData.prepayText} ${item.billingEvery} ${
            item.billingEveryType == "month"
              ? widgetSettingsData.monthFrequencyText
              : item.billingEveryType == "year"
              ? widgetSettingsData.yearFrequencyText
              : item.billingEveryType == "week"
              ? widgetSettingsData.weekFrequencyText
              : item.billingEveryType == "day"
              ? widgetSettingsData.dayFrequencyText
              : ""
          }`
        : `: ${widgetSettingsData.everyText} ${item.billingEvery} ${
            item.billingEveryType == "month"
              ? widgetSettingsData.monthFrequencyText
              : item.billingEveryType == "year"
              ? widgetSettingsData.yearFrequencyText
              : item.billingEveryType == "week"
              ? widgetSettingsData.weekFrequencyText
              : item.billingEveryType == "day"
              ? widgetSettingsData.dayFrequencyText
              : ""
          }`;

    if (
      (item.offerDiscount == false || item.offerDiscount == null) &&
      (item.freeTrial == false || item.freeTrial == null)
    ) {
      //console.log("breakfast");
      document.getElementById("revlytic-pricediv-main").style.display = "none";
      positionPriceDiv[0].style.display = "block";
    } else {
      //console.log("dinner");
      positionPriceDiv[0].style.display = "none";
      ///
      document.getElementById("revlytic-pricediv-main").innerHTML =
        item.offerDiscount ? priceDivData1 : priceDivData2;

      if (item.offerDiscount) {
        document.getElementById(
          "revlytic-price-div-selectedPlanPrice"
        ).innerText = getPrice;
      }

      // let setPriceSaveHtml1 = `${
      //   item.offerDiscount || item.freeTrial
      //     ? "(" + widgetSettingsData.saveText
      //     : ""
      // }  ${
      //   item.freeTrial && item.offerDiscount
      //     ? "100% " +
      //       widgetSettingsData.onFirstText +
      //       " " +
      //       (item.trialCount == "1" ? "" : item.trialCount) +
      //       " " +
      //       widgetSettingsData.orderText +
      //       ", " +
      //       widgetSettingsData.thenText +
      //       " "
      //     : item.freeTrial &&
      //       (item.offerDiscount == false || item.offerDiscount == null)
      //     ? "100% " +
      //       widgetSettingsData.onFirstText +
      //       " " +
      //       (item.trialCount == "1" ? "" : item.trialCount) +
      //       " " +
      //       widgetSettingsData.orderText +
      //       ")"
      //     : ""
      // }  ${
      //   item.offerDiscount && item.priceType == "percentage"
      //     ? item.price + "%)"
      //     : item.offerDiscount && item.priceType == "fixed"
      //     ? getCurrencySymbol(activeCurrency) +
      //       " " +
      //       item?.price_adjustment?.position_1?.value / 100 +
      //       ") "
      //     : ""
      // }`;

      // let setPriceSaveHtml = `${
      //   item?.price_adjustment
      //     ? "(" + widgetSettingsData.saveText
      //     : ""
      // } ${
      //   item?.price_adjustment?.position_1 &&  item?.price_adjustment?.position_2 && parseFloat(item?.price_adjustment?.position_2?.value) > 0
      //     ?  item?.price_adjustment?.position_1?.value + "% " +
      //       widgetSettingsData.onFirstText +
      //       " " +
      //       (item?.price_adjustment?.position_1?.order_count == "1" ? "" :item?.price_adjustment?.position_1?.order_count) +
      //       " " +
      //       widgetSettingsData.orderText +
      //       ", " +
      //       widgetSettingsData.thenText +
      //       " "
      //     :item?.price_adjustment?.position_1 &&  item?.price_adjustment?.position_2 && parseFloat(item?.price_adjustment?.position_2?.value) == 0
      //     ?  item?.price_adjustment?.position_1?.value + "% " +
      //     widgetSettingsData.onFirstText +
      //     " " +
      //     (item?.price_adjustment?.position_1?.order_count == "1" ? "" :item?.price_adjustment?.position_1?.order_count) +
      //     " " +
      //     widgetSettingsData.orderText +
      //       ")"
      //     : ""
      // }`



      let setPriceSaveHtml;
  
      if(item?.price_adjustment?.position_1 &&  !item?.price_adjustment?.position_2 ){///pos1 contain discount
      
        setPriceSaveHtml="(" +widgetSettingsData.saveText+ " "+(item?.price_adjustment?.position_1?.type=="percentage" ?  item?.price_adjustment?.position_1?.value + "%" : showAmountWithCurrency(parseFloat(item?.price_adjustment?.position_1?.value)/100)) +")"
      
      
      }
      
      else if(item?.price_adjustment?.position_1 &&  item?.price_adjustment?.position_2 )
      
      {
      
        setPriceSaveHtml="(" +widgetSettingsData.saveText+ " "+item?.price_adjustment?.position_1?.value+"%";
      if(parseFloat(item?.price_adjustment?.position_2?.value) > 0) 
      {
        //console.log("iyyiyiyiyis",widgetSettingsData.onFirstText)
        setPriceSaveHtml += widgetSettingsData.onFirstText + " " +(item?.price_adjustment?.position_1?.order_count == "1" ? "" : item?.price_adjustment?.position_1?.order_count) +
        " " +
        widgetSettingsData.orderText +
        ", " +
        widgetSettingsData.thenText +
        " " +
        (item?.price_adjustment?.position_2?.type=="percentage" ?  item?.price_adjustment?.position_2?.value + "%" : showAmountWithCurrency(parseFloat(item?.price_adjustment?.position_2?.value)/100))  +" off)"
      
      }else{
        setPriceSaveHtml += " "+widgetSettingsData.onFirstText + " " +(item?.price_adjustment?.position_1?.order_count == "1" ? "" : item?.price_adjustment?.position_1?.order_count) +
        " " +
        widgetSettingsData.orderText+ ")"
      }
      }





      document.getElementById("revlytic-price-div-save-section").innerHTML =
        setPriceSaveHtml;
      document.getElementById("revlytic-pricediv-main").style.display = "block";
    }
  }

  function handlePurchaseOption(e) {
    //console.log("in func", e.target.value);
    // //console.log("before", purchaseOption);
    let purchaseOption = e.target.value;
    //console.log("after", purchaseOption);
    let priceSelectors = [
      ".price.price--large",
      ".product__price",
      ".product__price--holder",
      ".yv-product-price",
      ".product-single__prices",
      ".price-area",
    ];
    //console.log("chekkkkk", selectedPlanPrice);
    // priceDiv= document.querySelectorAll(priceSelectors.join())
    positionPriceDiv = document.querySelectorAll(priceSelectors.join());

    if (purchaseOption == "subscribeAndSave") {
      updateHiddenInputForAddToCartForm("add");
      //console.log("checkingreqquirement", dropdownData[0]);

      document.getElementById("revlytic_selectedPlan").value =
        dropdownData[0].plan_id;

      //console.log("inderrrrrrr", positionPriceDiv[0]);
      positionPriceDiv[0].style.display = "none";
      document.getElementById("revlytic_oneTimePurchase").style.border =
        "4px solid #D9D9D9";
      document.getElementById("revlytic_subscribeAndSave").style.border =
        "4px solid " + widgetSettingsData.radioButtonColor + "";
      document.getElementById(
        "revlytic-delivery-frequency-main"
      ).style.display = "block";
      //console.log("inif", document.getElementById("revlytic-pricediv-main"));

      let item = dropdownData[0];

      document.getElementById("revlytic-delivery-frequency").innerText =
        item.planType == "prepaid"
          ? `: ${widgetSettingsData.everyText} ${item.deliveryEvery} ${
              item.billingEveryType == "month"
                ? widgetSettingsData.monthFrequencyText
                : item.billingEveryType == "year"
                ? widgetSettingsData.yearFrequencyText
                : item.billingEveryType == "week"
                ? widgetSettingsData.weekFrequencyText
                : item.billingEveryType == "day"
                ? widgetSettingsData.dayFrequencyText
                : ""
            }`
          : `: ${widgetSettingsData.everyText}  ${item.billingEvery} ${
              item.billingEveryType == "month"
                ? widgetSettingsData.monthFrequencyText
                : item.billingEveryType == "year"
                ? widgetSettingsData.yearFrequencyText
                : item.billingEveryType == "week"
                ? widgetSettingsData.weekFrequencyText
                : item.billingEveryType == "day"
                ? widgetSettingsData.dayFrequencyText
                : ""
            }`;
      document.getElementById("revlytic-billing-frequency").innerText =
        item.planType == "prepaid"
          ? `: ${widgetSettingsData.prepayText} ${item.billingEvery} ${
              item.billingEveryType == "month"
                ? widgetSettingsData.monthFrequencyText
                : item.billingEveryType == "year"
                ? widgetSettingsData.yearFrequencyText
                : item.billingEveryType == "week"
                ? widgetSettingsData.weekFrequencyText
                : item.billingEveryType == "day"
                ? widgetSettingsData.dayFrequencyText
                : ""
            }`
          : `: ${widgetSettingsData.everyText} ${item.billingEvery} ${
              item.billingEveryType == "month"
                ? widgetSettingsData.monthFrequencyText
                : item.billingEveryType == "year"
                ? widgetSettingsData.yearFrequencyText
                : item.billingEveryType == "week"
                ? widgetSettingsData.weekFrequencyText
                : item.billingEveryType == "day"
                ? widgetSettingsData.dayFrequencyText
                : ""
            }`;

      if (document.getElementById("revlytic-pricediv-main") == null) {
        const createDiv = document.createElement("div");
        createDiv.innerHTML = item.offerDiscount
          ? priceDivData1
          : priceDivData2;
        createDiv.id = "revlytic-pricediv-main";
        positionPriceDiv[0].insertAdjacentElement("afterend", createDiv);
        //console.log("bataldsadsdsdsda", createDiv);
      }

      if (
        (item.offerDiscount == false || item.offerDiscount == null) &&
        (item.freeTrial == false || item.freeTrial == null)
      ) {
        //console.log("morning");
        document.getElementById("revlytic-pricediv-main").style.display =
          "none";
        positionPriceDiv[0].style.display = "block";
      } else {
        //console.log("evening");
        positionPriceDiv[0].style.display = "none";

        document.getElementById("revlytic-pricediv-main").style.display =
          "block";

        //console.log("wait sirji");

        // document.getElementById("revlytic-price-div-selectedPlanPrice").innerText="";

        selectedPlanPriceForPriceBlock=  Revlytic.variant["VID_" + selectedVariant]?.allocations
        .selling_plans.list["ID_" + item.plan_id.split("/").at(-1)]
        .checkout_charge_amount;

        // let setPriceSaveHtml = `${
        //   item.offerDiscount || item.freeTrial
        //     ? "(" + widgetSettingsData.saveText
        //     : ""
        // }  ${
        //   item.freeTrial && item.offerDiscount
        //     ? "100 % " +
        //       widgetSettingsData.onFirstText +
        //       " " +
        //       (item.trialCount == "1" ? "" : item.trialCount) +
        //       " " +
        //       widgetSettingsData.orderText +
        //       ", " +
        //       widgetSettingsData.thenText +
        //       " "
        //     : item.freeTrial &&
        //       (item.offerDiscount == false || item.offerDiscount == null)
        //     ? "100 % " +
        //       widgetSettingsData.onFirstText +
        //       " " +
        //       (item.trialCount == "1" ? "" : item.trialCount) +
        //       " " +
        //       widgetSettingsData.orderText +
        //       ")"
        //     : ""
        // }  ${
        //   item.offerDiscount && item.priceType == "percentage"
        //     ? item.price + "%)"
        //     : item.offerDiscount && item.priceType == "fixed"
        //     ? getCurrencySymbol(activeCurrency) +
        //       " " +
        //       item?.price_adjustment?.position_1?.value / 100 +
        //       ")"
        //     : ""
        // }`;




        let setPriceSaveHtml;
        if(item?.price_adjustment?.position_1 &&  !item?.price_adjustment?.position_2 ){///pos1 contain discount
        
          setPriceSaveHtml="(" +widgetSettingsData.saveText+ " "+(item?.price_adjustment?.position_1?.type=="percentage" ?  item?.price_adjustment?.position_1?.value + "%" :showAmountWithCurrency(parseFloat(item?.price_adjustment?.position_1?.value)/100)) +")"
        
        
        }
        
        else if(item?.price_adjustment?.position_1 &&  item?.price_adjustment?.position_2 )
        
        {
        
          setPriceSaveHtml="(" +widgetSettingsData.saveText+ " "+item?.price_adjustment?.position_1?.value+"%";
        if(parseFloat(item?.price_adjustment?.position_2?.value) > 0) 
        {
          //console.log("iyyiyiyiyis",widgetSettingsData.onFirstText)
          setPriceSaveHtml += widgetSettingsData.onFirstText + " " +(item?.price_adjustment?.position_1?.order_count == "1" ? "" : item?.price_adjustment?.position_1?.order_count) +
          " " +
          widgetSettingsData.orderText +
          ", " +
          widgetSettingsData.thenText +
          " " +
          (item?.price_adjustment?.position_2?.type=="percentage" ?  item?.price_adjustment?.position_2?.value + "%" : showAmountWithCurrency(parseFloat(item?.price_adjustment?.position_2?.value)/100))  +" off)"
        
        }else{
          setPriceSaveHtml += " "+widgetSettingsData.onFirstText + " " +(item?.price_adjustment?.position_1?.order_count == "1" ? "" : item?.price_adjustment?.position_1?.order_count) +
          " " +
          widgetSettingsData.orderText+ ")"
        }
        }



        document.getElementById("revlytic-price-div-save-section").innerHTML =
          setPriceSaveHtml;
      }

      ////
    } else {
      //console.log("inelse");
      positionPriceDiv[0].style.display = "block";
      document.getElementById("revlytic-pricediv-main").style.display = "none";
      document.getElementById("revlytic_subscribeAndSave").style.border =
        "4px solid #D9D9D9";

      document.getElementById("revlytic_oneTimePurchase").style.border =
        "4px solid " + widgetSettingsData.radioButtonColor + "";
      document.getElementById(
        "revlytic-delivery-frequency-main"
      ).style.display = "none";

      updateHiddenInputForAddToCartForm("remove");
    }
  }

  // function updateHiddenInputForAddToCartForm(option) {
  //   //console.log("option",option)
  //   const selectedPlan = document.getElementById("revlytic_selectedPlan").value;

  //   // var form = document.querySelector(
  //   //   'form[action="/cart/add"][data-type="add-to-cart-form"]'
  //   // );

  //   var form = document.querySelector(
  //     'form[action*="/cart/add"] button[name="add"], form[action*="/cart/add"] input[name="add"]'
  //   );

  //   //console.log("form", form);
  //   // var hiddenInput = form.querySelector('input[name="selling_plan"][data-type="add-to-cart-form"]');
  //   var sellingPlanInputs = form.querySelectorAll('input[name="selling_plan"]');
  //   //console.log("33333333",option)

  //   if (option == "add") {
  //     //console.log("3octoberrrrrrrr")
  //     if (sellingPlanInputs.length === 0) {
  //       var newHiddenInput = document.createElement("input");
  //       newHiddenInput.type = "hidden";
  //       newHiddenInput.name = "selling_plan";
  //       newHiddenInput.value = selectedPlan.split("/").at(-1);

  //       form.appendChild(newHiddenInput);
  //       //console.log("Created new hidden input:", newHiddenInput);
  //     } else {
  //       //console.log("in3oct else",)
  //       sellingPlanInputs.forEach(function (input) {
  //         input.value = selectedPlan.split("/").at(-1);
  //       });
  //     }
  //   } else if (option == "remove") {
  //     if (sellingPlanInputs.length > 0) {
  //       sellingPlanInputs.forEach(function (input) {
  //         input.value = "";
  //       });
  //     }
  //   }
  // }



  function updateHiddenInputForAddToCartForm(option) {
    console.log("option20nov",option)
    console.log("skkke",theme_block_supported)
    const selectedPlan = document.getElementById("revlytic_selectedPlan").value;

    var form = document.querySelectorAll(
      'form[action*="/cart/add"]'
    );

    // var form = document.querySelector(
    //   'form[action*="/cart/add"] button[name="add"], form[action*="/cart/add"] input[name="add"]'
    // );

    console.log("formeeeeee22nov", form);
    // var hiddenInput = form.querySelector('input[name="selling_plan"][data-type="add-to-cart-form"]');

    form.forEach((item)=>
    {
console.log("iiissssiiii",item)

      var sellingPlanInputs = item.querySelectorAll('input[name="selling_plan"]');
      console.log("e22novm",sellingPlanInputs) 
  
      if (option == "add") {
        console.log("22nov-sam")
        if (sellingPlanInputs.length === 0) {
          console.log("tickkkktokl")
          var newHiddenInput = document.createElement("input");
          newHiddenInput.type = "hidden";
          newHiddenInput.name = "selling_plan";
          newHiddenInput.value = selectedPlan.split("/").at(-1);
  
          item.appendChild(newHiddenInput);
          //console.log("Created new hidden input:", newHiddenInput);
        } else {
          console.log("in3oct else",)
          
          sellingPlanInputs.forEach(function (input) {
            input.value = selectedPlan.split("/").at(-1);
          });
        }
      } else if (option == "remove") {
        if (sellingPlanInputs.length > 0) {
          sellingPlanInputs.forEach(function (input) {
            input.value = "";
          });
        }
      }




    }
    
    
    )


  }


  async function main() {
    //  const createDiv = document.createElement("div");
    // createDiv.id = "revlytic-pricediv-main";
    //console.log("in main");
    async function getWidgetSettings() {
      try {
        const response = await fetch(
          `${serverPath}/api/storefront/getWidgetSettingsForStoreFront`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ shop: Revlytic.shop }),
          }
        );

        const result = await response.json();
        if (result.message == "success") {
          widgetSettingsData = result?.data?.widgetSettings;
        }
        //console.log("Success:", result);
      } catch (error) {
        //console.error("Error:", error);
      }
    }

    await getWidgetSettings();

    async function getPlans() {
      try {
        const response = await fetch(
          `${serverPath}/api/storefront/getPlansForStoreFront`,
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              shop: Revlytic.shop,
              id: revlytic_selectedProduct,
            }),
          }
        );

        const result = await response.json();
         

        fetchedData = result?.message == 'success' ? result?.data : [];

        console.log("chekc2nov:", fetchedData);
      } catch (error) {
        //console.error("Error:", error);
      }
    }

    await getPlans();

    let filterData = [];

    if (fetchedData?.length > 0) {
      fetchedData.map((item) => {
        item?.plans.map((itm) => filterData.push(itm));
      });
    }

    let selectedVariantData = Revlytic.variant["VID_" + selectedVariant];
    console.log("ppppppppppppp", selectedVariantData);
    console.log("selectedVariant", selectedVariant);
    if (  
      selectedVariantData &&
      selectedVariantData.allocations.selling_plans.list != {}
    ) {
      let sellingPlanIdList = Object.keys(
        selectedVariantData.allocations.selling_plans.list
      );
      sellingPlanIdList.map((item) => {
        let rawId = item.split("ID_")[1];
        console.log("majhaaa",Revlytic.selling_plans.list[item]);
        let getData = filterData.find(
          (itm) => itm.plan_id == "gid://shopify/SellingPlan/" + rawId
        );
        getData != undefined &&
          dropdownData.push({
            ...getData,
            ...Revlytic.selling_plans.list[item],
          });

        // //testmode  see it laterrr
        //          options += `<option value="${getData.plan_id}" >${getData.planType=="prepaid" ? "prepay" :""} ${getData.billingEvery} ${getData.billingEveryType} ${getData.offerDiscount || getData.freeTrial ?  "-Save" : ""}  ${getData.freeTrial && getData.offerDiscount ? "100 %  on first " + getData.trialCount + ",then ": getData.freeTrial && getData.offerDiscount==false ? "100 %  on first " + getData.trialCount + "order" : "" }  ${getData.offerDiscount && getData.priceType == "percentage" ?  getData.price + "%" : getData.offerDiscount && getData.priceType == "fixed" ?  getData.price +"currency" : ""} (${getData.planType})</option>`;
        // if (index == 0) {
        //   selectedPlanPrice = Revlytic.variant["VID_" + selectedVariant]?.allocations.selling_plans.list["ID_" + item.plan_id.split("/").at(-1)].pa_per_delivery_price_formatted;

        //   // const d
        //   //console.log(selectedPlanPrice, "checprice");
        //   // document.getElementById("revlytic_subscribe_price").textContent = selectedPlanPrice;
        // }
      });
    }

    console.log("dropdownData", dropdownData);

    function generateOptions() {
      let options = "";
      
      dropdownData.forEach((item, index) => {

                  //console.log("first")

                //   let showOption = widgetSettingsData.showPredefinedDeliveryFrequencies== true  ?  ( (item.planType=="prepaid" ? item.deliveryEvery : item.billingEvery) + " "+
                //   item.billingEveryType == "month"
                //    ? widgetSettingsData.monthFrequencyText
                //    : item.billingEveryType == "year" 
                //    ? widgetSettingsData.yearFrequencyText
                //    : item.billingEveryType == "week"
                //    ? widgetSettingsData.weekFrequencyText
                //    : item.billingEveryType == "day"
                //    ? widgetSettingsData.dayFrequencyText
                //    : ""
                //    +
                //    "(s)"
                //    +
                //  item.planType=='prepaid' ? 

                // (", " + widgetSettingsData.prepayText +" "+item.billingEvery +" "+
                //   (item.billingEveryType == "month"
                //     ? widgetSettingsData.monthFrequencyText
                //     : item.billingEveryType == "year"
                //     ? widgetSettingsData.yearFrequencyText
                //     : item.billingEveryType == "week"
                //     ? widgetSettingsData.weekFrequencyText
                //     : item.billingEveryType == "day"
                //     ? widgetSettingsData.dayFrequencyText
                //     : "")
                //    +"(s)" 
                // ) : ""

                //    ): item.planName


                let showOption;

                if (widgetSettingsData.showPredefinedDeliveryFrequencies === true) {
                  if (item.planType === "prepaid") {
                    showOption = item.deliveryEvery + " ";
                    
                    if (item.billingEveryType === "month") {
                      showOption += widgetSettingsData.monthFrequencyText;
                    } else if (item.billingEveryType === "year") {
                      showOption += widgetSettingsData.yearFrequencyText;
                    } else if (item.billingEveryType === "week") {
                      showOption += widgetSettingsData.weekFrequencyText;
                    } else if (item.billingEveryType === "day") {
                      showOption += widgetSettingsData.dayFrequencyText;
                    }
                    
                    showOption += ", " + widgetSettingsData.prepayText + " " + item.billingEvery + " ";
                    
                    if (item.billingEveryType === "month") {
                      showOption += widgetSettingsData.monthFrequencyText;
                    } else if (item.billingEveryType === "year") {
                      showOption += widgetSettingsData.yearFrequencyText;
                    } else if (item.billingEveryType === "week") {
                      showOption += widgetSettingsData.weekFrequencyText;
                    } else if (item.billingEveryType === "day") {
                      showOption += widgetSettingsData.dayFrequencyText;
                    }
                    
                    
                  } else {
                   showOption= item.billingEvery + " ";
                    
                    if (item.billingEveryType === "month") {
                      showOption += widgetSettingsData.monthFrequencyText;
                    } else if (item.billingEveryType === "year") {
                      showOption += widgetSettingsData.yearFrequencyText;
                    } else if (item.billingEveryType === "week") {
                      showOption += widgetSettingsData.weekFrequencyText;
                    } else if (item.billingEveryType === "day") {
                      showOption += widgetSettingsData.dayFrequencyText;
                    }
                    
                   
                  }
                } else {
                  showOption = item.planName;
                }
                
              

        // options += `<option value="${item.plan_id}" data-index="${index}" >${item.planName}</option>`;
        options += `<option value="${item.plan_id}" data-index="${index}" >${showOption}</option>`;

        if (index == 0) {
          selectedPlanPrice =
            Revlytic.variant["VID_" + selectedVariant]?.allocations
              .selling_plans.list["ID_" + item.plan_id.split("/").at(-1)]
              .checkout_charge_amount;

              selectedPlanPriceForPriceBlock=selectedPlanPrice

          // selectedPlanPrice =
          //   item.planType == "prepaid"
          //     ? priceMultiplier(selectedPlanPrice, item.billingEvery, item.deliveryEvery)
          //     : selectedPlanPrice;

             
          //console.log(selectedPlanPrice, "checprice");
          // document.getElementById("revlytic_subscribe_price").textContent = selectedPlanPrice;
        }
      });
      return options;
    }

    let data3 = `<div class="revlytic purchase-optn-main"  id="revlytic-purchase-optn-main" style="display:none">
       <p style="color: ${widgetSettingsData?.purchaseOptionsTextColor}">${
      widgetSettingsData?.purchaseOptionsText
    }</p>
        <div class="purchase_option" style="
                border:1px ${widgetSettingsData.borderStyle} ${
      widgetSettingsData.borderColor
    };
                background-color:${widgetSettingsData.widgetBackgroundColor}
              ">
            <div>
                <div class="one-time-purchase" id="revlytic_section_oneTimePurchase">
                  
                    <div class="revlytic purchase-label-price">
                    <label for="revlytic_oneTimePurchase" style="color: ${
                      widgetSettingsData.headingTextColor
                    }">
                     <input type="radio" name="revlytic_purchaseOption" id="revlytic_oneTimePurchase" value="oneTimePurchase"
                        onchange="handlePurchaseOption(event)" >     ${
                          widgetSettingsData.oneTimePurchaseText
                        }
                    </label>
                    <span style="color: ${widgetSettingsData.priceColor}" id="revlytic_oneTimePurchase_price">${
      selectedVariantData.onetimepurchaseprice
    }</span>
                </div>

                </div>

                <div class="subscribe-option">
               
                  
                        <div class="revlytic purchase-label-price">
                    <label for="revlytic_subscribeAndSave" style="color: ${
                      widgetSettingsData.headingTextColor
                    }">
                    <input type="radio" name="revlytic_purchaseOption" id="revlytic_subscribeAndSave" value="subscribeAndSave"
                        onchange="handlePurchaseOption(event)"  >     ${
                          widgetSettingsData.subscriptionOptionsText
                        }
                    </label>
                    <span id="revlytic_subscribe_price" style="color: ${
                      widgetSettingsData.priceColor
                    }">${selectedPlanPrice}</span>
                    </div>
                </div>
                <div class="revlytic delivery-frequency-main" id="revlytic-delivery-frequency-main">
                    <p class="revlytic preview-delivery-frequency" style="color: ${
                      widgetSettingsData.headingTextColor
                    }">
                       ${widgetSettingsData.deliveryFrequencyOptionsText}
                    </p>
                    <select id="revlytic_selectedPlan" name="selectedPlan" onchange="handlePlanSelection(event)">
                       ${generateOptions()}
                    </select>

                    <div class="revlytic delivery-billing-section">
                        
                   <p> <strong style="color: ${
                     widgetSettingsData.headingTextColor
                   }">${
      widgetSettingsData.billingFrequencyText
    }</strong> <span id="revlytic-billing-frequency"></span> </p>

                    

                 <p> <strong style="color: ${
                   widgetSettingsData.headingTextColor
                 }">${
      widgetSettingsData.deliveryFrequencyText
    }</strong> <span id="revlytic-delivery-frequency"></span></p>

                   

                  </div>

                </div>
            </div>
        </div>
        <div class="widget-preview-banner">
        <p>Powered by <span><strong>Rev</strong>lytic.</span></p>
    </div>
         <div><h3>${widgetSettingsData.subscriptionDetailsText}</h3></div>
        <div class="revlytic-subscription-details-main">
        <p>${widgetSettingsData.additionalSubscriptionDetails}</p>
        </div>
    </div>
   
    
    `;

    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = data3;
    // box.appendChild(tempContainer);

    //  const revlytic_div =  document.createElement('div');
    //  revlytic_div.classList.add("Revlytic-outer");
    //  //console.log(revlytic_div,"ssfsdfdf")
    //  revlytic_div.innerHTML =tempContainer;

    const revlytic_div = document.createElement("div");
    revlytic_div.classList.add("Revlytic-outer");
    revlytic_div.appendChild(tempContainer);

    let Revlytic_SIZE_POSITION =
      document.getElementsByClassName("revlytic-app-block");
    
    if (theme_block_supported == true) {
      console.log("afganistan")
      if (Revlytic_SIZE_POSITION.length > 0) {
        //console.log("in nested if");
        Revlytic_SIZE_POSITION[0].appendChild(revlytic_div);
      } else {
        console.log("in nestesd elese");
      }
    } else {
      console.log("australiaaa")
      //console.log("inelseeouter",theme_block_supported);
      let positionAddToCart = document.querySelector('form[action*="/cart/add"] button[name="add"],form[action*="/cart/add"] input[name="add"]');
     if(positionAddToCart){
      console.log("sting",positionAddToCart)
      positionAddToCart.insertAdjacentElement("beforebegin", tempContainer);
      console.log("end AFTER ROADDD")
      }
      else{
        console.log("ticktokk")
      }
    }
    //   let Revlytic_SIZE_POSITION = document.getElementsByClassName("revlytic-app-block");
    //   if(Revlytic_SIZE_POSITION.length > 0) {

    //     if(theme_block_supported==true){
    //      Revlytic_SIZE_POSITION[0].appendChild(revlytic_div);
    //     }
    //     else{

    //   let positionAddToCart = document.querySelector('button[name="add"]');
    //    positionAddToCart.insertAdjacentElement("beforebegin", tempContainer);

    //     }

    //   } else {
    //     // if (smartClass == "") {
    //     //   let Revlytic_SIZE_SELECTOR =
    //     //     'form[action*="/cart/add"] button[name="add"], form[action*="/cart/add"] input[name="add"]';
    //     //   const existingElement = document.querySelector(Revlytic_SIZE_SELECTOR);
    //     //   if (existingElement) {
      //     //     existingElement.insertAdjacentHTML("beforebegin", Revlytic_DIV);
      //     //   }
      //     // } else {
        //     //   let RevlyticSSClass = document.getElementsByClassName(smartClass);
        //     //   if(SELECTOR_POSITION == "Before") {
          //     //     RevlyticSSClass[0]?.insertAdjacentHTML("beforebegin", Revlytic_DIV);
          //     //   } else {
            //     //     RevlyticSSClass[0]?.insertAdjacentHTML("afterend", Revlytic_DIV);
            //     //   }
            
            //     //}
            
            // //console.log("inelsee")
            
            //  }
            
            // await new Promise((resolve) => setTimeout(resolve, 0));
            console.log("dropdownData.length",dropdownData.length)
            
    if (dropdownData.length > 0) {
      console.log("checkinngggggbatalaaa")
      document.getElementById("revlytic-purchase-optn-main").style.display =
        "block";
    }

    // document.body.innerHTML = "";
    var priceSelectors = [
      ".price.price--large",
      ".product__price",
      ".product__price--holder",
      ".yv-product-price",
      ".product-single__prices",
      ".price-area",
    ];
    //console.log("chekkkkk", selectedPlanPrice);
    // priceDiv= document.querySelectorAll(priceSelectors.join())
    positionPriceDiv = document.querySelectorAll(priceSelectors.join());

    // let onetimepurchasepricediv = '<span id="hi"> </span>';
    // let html2 = '<span id="hello"> ${selectedPlanPrice</span> <span id="hi"> </span>';
    priceDivData1 = `<div id="revlytic-price-div" >
     <span id="revlytic-price-div-selectedPlanPrice">${selectedPlanPriceForPriceBlock}</span>
      <span id="revlytic-price-div-onetimepurchaseprice"><s> ${selectedVariantData.onetimepurchaseprice}</s></span>
   
      <span id="revlytic-price-div-save-section"></span>
    </div>`;

    priceDivData2 = `<div id="revlytic-price-div">
       <span id="revlytic-price-div-onetimepurchaseprice"> ${selectedVariantData.onetimepurchaseprice}</span>
       <span id="revlytic-price-div-save-section"></span>
    </div>`;
    // priceDiv[0].innerHTML=priceDivData

    var requires_selling_plan = Revlytic.product.requires_selling_plan;
    var divOneTimePurchase = document.getElementById(
      "revlytic_section_oneTimePurchase"
    );
    var inputSubscribeAndSave = document.getElementById(
      "revlytic_subscribeAndSave"
    );

    //console.log("requires_selling_plan", requires_selling_plan);

    const selectedPlanPriceElement = document.getElementById(
      "revlytic_subscribe_price"
    );

    selectedPlanPriceElement.innerText = selectedPlanPrice;

    if (requires_selling_plan) {
      divOneTimePurchase.style.display = "none";
      inputSubscribeAndSave.setAttribute("checked", "checked");
      purchaseOption = "subscribeAndSave";
// 3octoberstart///////

      let  check={target:{value:"subscribeAndSave"}}
      handlePurchaseOption(check)

////3rd october end///////
    } else {
      divOneTimePurchase.style.display = "block"; // or "inline-block", "flex", etc.
      var inputOneTimePurchase = document.getElementById(
        "revlytic_oneTimePurchase"
      );

      inputOneTimePurchase.setAttribute("checked", "checked");
      purchaseOption = "oneTimePurchase";
      document.getElementById(
        "revlytic-delivery-frequency-main"
      ).style.display = "none";
      updateHiddenInputForAddToCartForm("remove");
    }

    /////

    // if(dropdownData.length>0 && purchaseOption=="subscribeAndSave"){
    //      //document.getElementById("revlytic_subscribeAndSave").checked.style.border=`4px solid ${widgetSettingsData.radioButtonColor}`;
    //   //console.log("inif")
    // priceDiv[0].innerHTML=priceDivData1;
    // document.getElementById("revlytic-price-div").style.display="block"

    // }
    //  else if(dropdownData.length>0 && purchaseOption=="oneTimePurchase"){
    //      //document.getElementById("revlytic_oneTimePurchase").checked.style.border=`4px solid ${widgetSettingsData.radioButtonColor}`;
    //      //console.log("inelse")
    //    // priceDiv[0].innerHTML=priceDivData2;
    //    // document.getElementById("revlytic-price-div").style.display="block"
    //  }

    /////


    //     function updateHiddenInputForAddToCartForm(){
    //     const selectedPlan = document.getElementById("revlytic_selectedPlan").value;

    // var form = document.querySelector('form[action="/cart/add"][data-type="add-to-cart-form"]');
    //     //console.log("form",form)
    //   // var hiddenInput = form.querySelector('input[name="selling_plan"][data-type="add-to-cart-form"]');
    // var sellingPlanInputs = form.querySelectorAll('input[name="selling_plan"]');

    // if (sellingPlanInputs.length === 0) {
    //   var newHiddenInput = document.createElement("input");
    //   newHiddenInput.type = "hidden";
    //   newHiddenInput.name = "selling_plan";
    //   newHiddenInput.value = selectedPlan.split("/").at(-1);

    //   form.appendChild(newHiddenInput);
    //   //console.log("Created new hidden input:", newHiddenInput);
    // } else {
    //   sellingPlanInputs.forEach(function(input) {
    //     input.value = selectedPlan.split("/").at(-1);
    //   });
    // }
    //     }

    //console.log("fsdfsdfs", document.getElementsByName("revlytic_purchaseOption") );

    document.getElementsByName("revlytic_purchaseOption").forEach((item) => {
      //console.log("item", item);
      if (item.checked == true) {
        item.style.border =
          "4px solid " + widgetSettingsData.radioButtonColor + "";
      }
    });

    document.addEventListener("change", (e) => {
      //console.log("inchangeeeeeeeeee");

      if (
        selectedVariant != window.ShopifyAnalytics.meta["selectedVariantId"]
      ) {
        //console.log("hello in change");

        updateHiddenInputForAddToCartForm("remove");

        // var priceDiv = document.getElementById("revlytic-pricediv-main");
        //    if (priceDiv) {
        //      priceDiv.style.display = "none";
        //    }

        //console.log( window.ShopifyAnalytics.meta["selectedVariantId"],"sdfsdfsdfsdfsdfsdfdfs------", e );
        let plan_array = [];
        selectedVariant = window.ShopifyAnalytics.meta["selectedVariantId"];

        selectedVariantData =
          Revlytic.variant[
            "VID_" + window.ShopifyAnalytics.meta["selectedVariantId"]
          ];
        //console.log("ppppppppppppp", selectedVariantData);
        if (
          selectedVariantData &&
          selectedVariantData.allocations.selling_plans.list != {}
        ) {
          let sellingPlanIdList = Object.keys(
            selectedVariantData.allocations.selling_plans.list
          );
          sellingPlanIdList.map((item) => {
            let rawId = item.split("ID_")[1];
            //console.log(Revlytic.selling_plans.list[item]);
            let getData = filterData.find(
              (itm) => itm.plan_id == "gid://shopify/SellingPlan/" + rawId
            );
            getData != undefined &&
              plan_array.push({
                ...getData,
                ...Revlytic.selling_plans.list[item],
              });
          });

          dropdownData = plan_array;

          if (dropdownData.length > 0) {

           
            //console.log("sahil", dropdownData, selectedVariant);
            //console.log("12sept", Revlytic.variant["VID_" + selectedVariant]?.allocations.selling_plans.list["ID_" + dropdownData[0].plan_id.split("/").at(-1)].checkout_charge_amount)
            document.getElementById("revlytic_selectedPlan").innerHTML =
              generateOptions();

            
            let getPrice = Revlytic.variant["VID_" + selectedVariant]?.allocations.selling_plans.list["ID_" + dropdownData[0].plan_id.split("/").at(-1)].checkout_charge_amount;
            //console.log("herapheriii", getPrice);
 
      
              selectedPlanPrice=getPrice;



            var inputOneTimePurchase = document.getElementById(
              "revlytic_oneTimePurchase"
            );
            var inputSubscribeAndSave = document.getElementById(
              "revlytic_subscribeAndSave"
            );
            inputOneTimePurchase.setAttribute("checked", "checked");
            // inputSubscribeAndSave.setAttribute("checked", "checked");
            inputSubscribeAndSave.checked = false;
            inputOneTimePurchase.style.border =
              "4px solid " + widgetSettingsData.radioButtonColor + "";
            inputSubscribeAndSave.style.border = "4px solid #D9D9D9";
            // purchaseOption="oneTimePurchase"
             document.getElementById("revlytic_oneTimePurchase_price").innerText = selectedVariantData.onetimepurchaseprice;


            document.getElementById("revlytic_subscribe_price").innerText = selectedPlanPrice;
            document.getElementById(
              "revlytic-purchase-optn-main"
            ).style.display = "block";
            
            document.getElementById(
              "revlytic-delivery-frequency-main"
            ).style.display = "none";

           if(requires_selling_plan){

            document.getElementById(
              "revlytic-delivery-frequency-main"
            ).style.display = "block";

            let  check={target:{value:"subscribeAndSave"}}
            handlePurchaseOption(check)

           }
           else{

           }

          } else {
            //console.log("viru");
            document.getElementById(
              "revlytic-purchase-optn-main"
            ).style.display = "none";
            document.getElementById(
              "revlytic-purchase-optn-main"
            ).style.display = "none";
          }
        }
      } else {
        //console.log("hi");
      }

      //   //end of onchangeeventlisrerner
    });
  }

  main();
}

//console.log(purchaseOption, "purchaseeee");
