import React, { useEffect, useState } from "react";
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
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { ResourcePicker } from "@shopify/app-bridge-react";
import pic from "../assets/images/image2.png";
import postApi from "./common/postApi";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import { useAPI } from "./common/commonContext";
import dayjs from "dayjs";
import { sendMailOnUpdate } from "./common/helpers";
import { Link } from "react-router-dom";

const SubscriptionProductsEdit = ({
  products,
  setProducts,
  edit,
  setEdit,
  subscriptionId,
  setLoader,
  discount,
  subscription_details,
  storeCurrency
}) => {
  const [form] = useForm();
  const [addProductModal, setAddProductModal] = useState(false);
  const [addOnModal, setAddOnModal] = useState(false);
  const [addOnValue, setAddOnValue] = useState("recurring");
  const [checkedIds, setCheckedIds] = useState([]);

  const app = useAppBridge();
  const [createProductModal, setCreateProductModal] = useState(false);
  // const [loader, setLoader] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState();
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const { currency, storeName, storeDetails,billingPlan } = useAPI();
  const handleAddButton = () => {
    setAddProductModal(true);
  };



const countries=[
  { "countrycode": "US", "name": "United States", "currency": "USD" },
  { "countrycode": "AF", "name": "Afghanistan", "currency": "AFN" },
  { "countrycode": "AX", "name": "Åland Islands", "currency": "EUR" },
  { "countrycode": "AL", "name": "Albania", "currency": "ALL" },
  { "countrycode": "DZ", "name": "Algeria", "currency": "DZD" },
  { "countrycode": "AD", "name": "Andorra", "currency": "EUR" },
  { "countrycode": "AO", "name": "Angola", "currency": "AOA" ,"shopify":"storecurrency"},
  { "countrycode": "AI", "name": "Anguilla", "currency": "XCD" },
  { "countrycode": "AG", "name": "Antigua and Barbuda", "currency": "XCD" },
  { "countrycode": "AR", "name": "Argentina", "currency": "ARS" , "shopify" :"storecurrency" },
  { "countrycode": "AM", "name": "Armenia", "currency": "AMD" },
  { "countrycode": "AW", "name": "Aruba", "currency": "AWG" },
  { "countrycode": "AC", "name": "Ascension Island" ,"currency": "SHP" },
  { "countrycode": "AU", "name": "Australia", "currency": "AUD" },
  { "countrycode": "AT", "name": "Austria", "currency": "EUR" },
  { "countrycode": "AZ", "name": "Azerbaijan", "currency": "AZN" },
    { "countrycode": "BS", "name": "Bahamas", "currency": "BSD" },
    { "countrycode": "BH", "name": "Bahrain", "currency": "BHD" ,"shopify": "storecurrency"},
    { "countrycode": "BD", "name": "Bangladesh", "currency": "BDT" },
    { "countrycode": "BB", "name": "Barbados", "currency": "BBD" },
    { "countrycode": "BY", "name": "Belarus", "currency": "BYN" ,"shopify":"storecurrency" },
    { "countrycode": "BE", "name": "Belgium", "currency": "EUR" },
    { "countrycode": "BZ", "name": "Belize", "currency": "BZD" },
    { "countrycode": "BJ", "name": "Benin", "currency": "XOF" },
    { "countrycode": "BM", "name": "Bermuda", "currency": "BMD" ,"shopify":"USD"},
    { "countrycode": "BT", "name": "Bhutan", "currency": "BTN" ,"shopify":"storecurrency"},
    { "countrycode": "BO", "name": "Bolivia (Plurinational State of)", "currency": "BOB" },
    { "countrycode": "BA", "name": "Bosnia and Herzegovina", "currency": "BAM" },
    { "countrycode": "BW", "name": "Botswana", "currency": "BWP" },
    { "countrycode": "BR", "name": "Brazil", "currency": "BRL" ,"shopify": "storecurrency" },
    { "countrycode": "IO", "name": "British Indian Ocean Territory", "currency": "USD" },
    { "countrycode": "VG", "name": "British Virgin Islands", "currency": "USD" },
    { "countrycode": "BN", "name": "Brunei", "currency": "BND" },
    { "countrycode": "BG", "name": "Bulgaria", "currency": "BGN" },
    { "countrycode": "BF", "name": "Burkina Faso", "currency": "XOF" },
    { "countrycode": "BI", "name": "Burundi", "currency": "BIF" },
    { "countrycode": "KH", "name": "Cambodia", "currency": "KHR" },
    { "countrycode": "CM", "name": "Cameroon", "currency": "XAF" },
    { "countrycode": "CA", "name": "Canada", "currency": "CAD" },
    { "countrycode": "CV", "name": "Cape Verde", "currency": "CVE" },
    { "countrycode": "BQ", "name": "Caribbean Netherlands", "currency": "USD" },
    { "countrycode": "KY", "name": "Cayman Islands", "currency": "KYD" },
    { "countrycode": "CF", "name": "Central African Republic", "currency": "XAF" },
    { "countrycode": "TD", "name": "Chad", "currency": "XAF" },
    { "countrycode": "CL", "name": "Chile", "currency": "CLP" ,"shopify":"storecurrency" },
    { "countrycode": "CN", "name": "China", "currency": "CNY" },
    { "countrycode": "CX", "name": "Christmas Island", "currency": "AUD" },
    { "countrycode": "CC", "name": "Cocos (Keeling) Islands", "currency": "AUD" },
    { "countrycode": "CO", "name": "Colombia", "currency": "COP" ,"shopify":"storecurrency"},
    { "countrycode": "KM", "name": "Comoros", "currency": "KMF" },
    { "countrycode": "CD", "name": "Congo, Kinshasa", "currency": "CDF" },
    { "countrycode": "CG", "name": "Congo Brazzaville", "currency": "XAF" },
    { "countrycode": "CK", "name": "Cook Islands", "currency": "NZD" },
    { "countrycode": "CR", "name": "Costa Rica", "currency": "CRC" },
    { "countrycode": "CI", "name": "Côte d'Ivoire", "currency": "XOF" },
    { "countrycode": "HR", "name": "Croatia", "currency": "HRK" ,"shopify":"EUR"},
    { "countrycode": "CW", "name": "Curaçao", "currency": "ANG" },
    { "countrycode": "CY", "name": "Cyprus", "currency": "EUR" },
    { "countrycode": "CZ", "name": "Czech Republic or czechia", "currency": "CZK" },
    { "countrycode": "DK", "name": "Denmark", "currency": "DKK" },
    { "countrycode": "DJ", "name": "Djibouti", "currency": "DJF" },
    { "countrycode": "DM", "name": "Dominica", "currency": "XCD" },
    { "countrycode": "DO", "name": "Dominican Republic", "currency": "DOP" },
    { "countrycode": "EC", "name": "Ecuador", "currency": "USD" },
    { "countrycode": "EG", "name": "Egypt", "currency": "EGP" },
    { "countrycode": "SV", "name": "El Salvador", "currency": "USD" },
    { "countrycode": "GQ", "name": "Equatorial Guinea", "currency": "XAF" },
    { "countrycode": "ER", "name": "Eritrea", "currency": "ERN" ,"shopify":"storecurrency" },
    { "countrycode": "EE", "name": "Estonia", "currency": "EUR" },
    { "countrycode": "SZ", "name": "Eswatini", "currency": "SZL" ,"shopify":"storecurrency" },
    { "countrycode": "ET", "name": "Ethiopia", "currency": "ETB" },
    { "countrycode": "FK", "name": "Falkland Islands", "currency": "FKP" },
    { "countrycode": "FO", "name": "Faroe Islands", "currency": "DKK" },
    { "countrycode": "FJ", "name": "Fiji", "currency": "FJD" },
    { "countrycode": "FI", "name": "Finland", "currency": "EUR" },
    { "countrycode": "FR", "name": "France", "currency": "EUR" },
    { "countrycode": "GF", "name": "French Guiana", "currency": "EUR" },
    { "countrycode": "PF", "name": "French Polynesia", "currency": "XPF" },
    { "countrycode": "GA", "name": "Gabon", "currency": "XAF" ,"shopify":"XOF"},//XOF,XAF holds same monetary value
    { "countrycode": "GM", "name": "Gambia", "currency": "GMD" },
    { "countrycode": "GE", "name": "Georgia", "currency": "GEL" ,"shopify":"storecurrency"},
    { "countrycode": "DE", "name": "Germany", "currency": "EUR" },
    { "countrycode": "GH", "name": "Ghana", "currency": "GHS","shopify":"storecurrency"},
    { "countrycode": "GI", "name": "Gibraltar", "currency": "GIP" ,"shopify" :"GBP" },//GIP,GBP holds same monetary value
    { "countrycode": "GR", "name": "Greece", "currency": "EUR" },
    { "countrycode": "GL", "name": "Greenland", "currency": "DKK" },
    { "countrycode": "GD", "name": "Grenada", "currency": "XCD" },
    { "countrycode": "GP", "name": "Guadeloupe", "currency": "EUR" },
    { "countrycode": "GT", "name": "Guatemala", "currency": "GTQ" },
    { "countrycode": "GG", "name": "Guernsey", "currency": "GBP" },
    { "countrycode": "GN", "name": "Guinea", "currency": "GNF" },
    { "countrycode": "GW", "name": "Guinea-Bissau", "currency": "XOF" },
    { "countrycode": "GY", "name": "Guyana", "currency": "GYD" },
    { "countrycode": "HT", "name": "Haiti", "currency": "HTG" ,"shopify":"storecurrency" },
    { "countrycode": "HN", "name": "Honduras", "currency": "HNL" },
    { "countrycode": "HK", "name": "Hong Kong SAR", "currency": "HKD" },
    { "countrycode": "HU", "name": "Hungary", "currency": "HUF" },
    { "countrycode": "IS", "name": "Iceland", "currency": "ISK" },
    { "countrycode": "IN", "name": "India", "currency": "INR" },
    { "countrycode": "ID", "name": "Indonesia", "currency": "IDR" },
    { "countrycode": "IQ", "name": "Iraq", "currency": "IQD", "shopify":"storecurrency" },
    { "countrycode": "IE", "name": "Ireland", "currency": "EUR" },
    { "countrycode": "IM", "name": "Isle of Man", "currency": "GBP" },
    { "countrycode": "IL", "name": "Israel", "currency": "ILS" },
    { "countrycode": "IT", "name": "Italy", "currency": "EUR" },
    { "countrycode": "JM", "name": "Jamaica", "currency": "JMD" },
    { "countrycode": "JP", "name": "Japan", "currency": "JPY" },
    { "countrycode": "JE", "name": "Jersey", "currency": "GBP","shopify":"storecurrency" },
    { "countrycode": "JO", "name": "Jordan", "currency": "JOD","shopify":"storecurrency" },
    { "countrycode": "KZ", "name": "Kazakhstan", "currency": "KZT" },
    { "countrycode": "KE", "name": "Kenya", "currency": "KES" },
    { "countrycode": "KI", "name": "Kiribati", "currency": "AUD" ,"shopify":"storecurrency" },
    { "countrycode": "XK", "name": "Kosovo", "currency": "EUR" },
    { "countrycode": "KW", "name": "Kuwait", "currency": "KWD" ,"shopify":"storecurrency" },
    { "countrycode": "KG", "name": "Kyrgyzstan", "currency": "KGS"  },
    { "countrycode": "LA", "name": "Laos", "currency": "LAK" },
    { "countrycode": "LV", "name": "Latvia", "currency": "EUR" },
    { "countrycode": "LB", "name": "Lebanon", "currency": "LBP" },
    { "countrycode": "LS", "name": "Lesotho", "currency": "LSL" ,"shopify":"storecurrency" },
    { "countrycode": "LR", "name": "Liberia", "currency": "LRD" ,"shopify":"storecurrency"},
    { "countrycode": "LY", "name": "Libya", "currency": "LYD" ,"shopify":"storecurrency" },
    { "countrycode": "LI", "name": "Liechtenstein", "currency": "CHF" },
    { "countrycode": "LT", "name": "Lithuania", "currency": "EUR" },
    { "countrycode": "LU", "name": "Luxembourg", "currency": "EUR" },
    { "countrycode": "MO", "name": "Macao SAR", "currency": "MOP" },
    { "countrycode": "MG", "name": "Madagascar", "currency": "MGA" ,"shopify":"storecurrency"},
    { "countrycode": "MW", "name": "Malawi", "currency": "MWK" },
    { "countrycode": "ML", "name": "Mali", "currency": "XOF" },
    { "countrycode": "MT", "name": "Malta", "currency": "EUR" }, 
    { "countrycode": "MQ", "name": "Martinique", "currency": "EUR" },
    { "countrycode": "MR", "name": "Mauritania", "currency": "MRU" ,"shopify":"storecurrency" },
    { "countrycode": "MU", "name": "Mauritius", "currency": "MUR" },
    { "countrycode": "YT", "name": "Mayotte", "currency": "EUR" },
    { "countrycode": "MX", "name": "Mexico", "currency": "MXN" ,"shopify":"storecurrency" },
    { "countrycode": "MD", "name": "Moldova", "currency": "MDL" },
    { "countrycode": "MC", "name": "Monaco", "currency": "EUR" },
    { "countrycode": "MN", "name": "Mongolia", "currency": "MNT" },
    { "countrycode": "ME", "name": "Montenegro", "currency": "EUR" },
    { "countrycode": "MS", "name": "Montserrat", "currency": "XCD" },
    { "countrycode": "MA", "name": "Morocco", "currency": "MAD" },
    { "countrycode": "MZ", "name": "Mozambique", "currency": "MZN" ,"shopify":"storecurrency"},
    { "countrycode": "MM", "name": "Myanmar (Burma)", "currency": "MMK" },
    { "countrycode": "NA", "name": "Namibia", "currency": "NAD" ,"shopify":"storecurrency"},
    { "countrycode": "NR", "name": "Nauru", "currency": "AUD" },
    { "countrycode": "NP", "name": "Nepal", "currency": "NPR" },
    { "countrycode": "NL", "name": "Netherlands", "currency": "EUR" },
    { "countrycode": "NC", "name": "New Caledonia", "currency": "XPF" }, 
    { "countrycode": "NZ", "name": "New Zealand", "currency": "NZD" },
    { "countrycode": "NI", "name": "Nicaragua", "currency": "NIO" },
    { "countrycode": "NE", "name": "Niger", "currency": "XOF" },
    { "countrycode": "NG", "name": "Nigeria", "currency": "NGN" },
    { "countrycode": "NU", "name": "Niue", "currency": "NZD" },
    { "countrycode": "NF", "name": "Norfolk Island", "currency": "AUD" },
    { "countrycode": "MK", "name": "North Macedonia", "currency": "MKD" },
    { "countrycode": "NO", "name": "Norway", "currency": "NOK","shopify":"storecurrency"},
    { "countrycode": "OM", "name": "Oman", "currency": "OMR" ,"shopify":"storecurrency" },
    { "countrycode": "PK", "name": "Pakistan", "currency": "PKR" },
    { "countrycode": "PS", "name": "Palestinian Territories", "currency": "ILS" },
    { "countrycode": "PA", "name": "Panama", "currency": "PAB" ,"shopify":"USD" },
    { "countrycode": "PG", "name": "Papua New Guinea", "currency": "PGK" },
    { "countrycode": "PY", "name": "Paraguay", "currency": "PYG" },
    { "countrycode": "PE", "name": "Peru", "currency": "PEN" },
    { "countrycode": "PH", "name": "Philippines", "currency": "PHP" },
    { "countrycode": "PN", "name": "Pitcairn Islands", "currency": "NZD" },
    { "countrycode": "PL", "name": "Poland", "currency": "PLN" },
    { "countrycode": "PT", "name": "Portugal", "currency": "EUR" },
    { "countrycode": "QA", "name": "Qatar", "currency": "QAR" },
    { "countrycode": "RE", "name": "Réunion", "currency": "EUR" },
    { "countrycode": "RO", "name": "Romania", "currency": "RON" },
    { "countrycode": "RU", "name": "Russia", "currency": "RUB" },
    { "countrycode": "RW", "name": "Rwanda", "currency": "RWF" },
    { "countrycode": "WS", "name": "Samoa", "currency": "WST" },
    { "countrycode": "SM", "name": "San Marino", "currency": "EUR" },
    { "countrycode": "ST", "name": "São Tomé & Príncipe", "currency": "STD" },
    { "countrycode": "SA", "name": "Saudi Arabia", "currency": "SAR" },
    { "countrycode": "SN", "name": "Senegal", "currency": "XOF" },
    { "countrycode": "RS", "name": "Serbia", "currency": "RSD" },
    { "countrycode": "SC", "name": "Seychelles", "currency": "SCR" ,"shopify":"storecurrency" },
    { "countrycode": "SL", "name": "Sierra Leone", "currency": "SLL" },
    { "countrycode": "SG", "name": "Singapore", "currency": "SGD" },
    { "countrycode": "SX", "name": "Sint Maarten", "currency": "ANG" },
    { "countrycode": "SK", "name": "Slovakia", "currency": "EUR" },
    { "countrycode": "SI", "name": "Slovenia", "currency": "EUR" },
    { "countrycode": "SB", "name": "Solomon Islands", "currency": "SBD" },
    { "countrycode": "SO", "name": "Somalia", "currency": "SOS" ,"shopify":"storecurrency"},
    { "countrycode": "ZA", "name": "South Africa", "currency": "ZAR" },
    { "countrycode": "KR", "name": "South Korea", "currency": "KRW" },
    { "countrycode": "SS", "name": "South Sudan", "currency": "SSP" ,"shopify":"storecurrency"},
    { "countrycode": "ES", "name": "Spain", "currency": "EUR" },
    { "countrycode": "LK", "name": "Sri Lanka", "currency": "LKR" },
    { "countrycode": "BL", "name": "Saint Barthélemy", "currency": "EUR" },
    { "countrycode": "SH", "name": "St. Helena", "currency": "SHP" },
    { "countrycode": "KN", "name": "St. Kitts & Nevis", "currency": "XCD" },
    { "countrycode": "LC", "name": "St. Lucia", "currency": "XCD" },
    { "countrycode": "MF", "name": "St. Martin", "currency": "EUR" },
    { "countrycode": "PM", "name": "St. Pierre & Miquelon", "currency": "EUR" },
    { "countrycode": "KP", "name": "North Korea", "currency": "KPW" },
    { "countrycode": "VC", "name": "St. Vincent & Grenadines", "currency": "XCD" },
    { "countrycode": "SD", "name": "Sudan", "currency": "SDG" ,"shopify":"storecurrency"},
    { "countrycode": "SR", "name": "Suriname", "currency": "SRD" ,"shopify":"storecurrency"},
    { "countrycode": "SJ", "name": "Svalbard & Jan Mayen", "currency": "NOK" ,"shopify":"storecurrency"},
    { "countrycode": "SE", "name": "Sweden", "currency": "SEK" },
    { "countrycode": "CH", "name": "Switzerland", "currency": "CHF" },
    { "countrycode": "TW", "name": "Taiwan", "currency": "TWD" },
    { "countrycode": "TJ", "name": "Tajikistan", "currency": "TJS" },
    { "countrycode": "TZ", "name": "Tanzania", "currency": "TZS" },
    { "countrycode": "TH", "name": "Thailand", "currency": "THB" },
    { "countrycode": "TL", "name": "Timor-Leste", "currency": "USD" },
    { "countrycode": "TG", "name": "Togo", "currency": "XOF" },
    { "countrycode": "TK", "name": "Tokelau", "currency": "NZD" },
    { "countrycode": "TO", "name": "Tonga", "currency": "TOP" },
    { "countrycode": "TT", "name": "Trinidad & Tobago", "currency": "TTD" },
    { "countrycode": "TA", "name": "Tristan da Cunha", "currency": "SHP" ,"shopify":"GBP" },//SHP,GBP share same monetary value
    { "countrycode": "TN", "name": "Tunisia", "currency": "TND" ,"shopify":"storecurrency" },
    { "countrycode": "TR", "name": "Turkey", "currency": "TRY" ,"shopify":"storecurrency"},
    { "countrycode": "TM", "name": "Turkmenistan", "currency": "TMT" ,"shopify":"storecurrency"},
    { "countrycode": "TC", "name": "Turks & Caicos Islands", "currency": "USD" },
    { "countrycode": "TV", "name": "Tuvalu", "currency": "AUD" },
    { "countrycode": "UM", "name": "U.S. Outlying Islands", "currency": "USD" },
    { "countrycode": "UG", "name": "Uganda", "currency": "UGX" },
    { "countrycode": "UA", "name": "Ukraine", "currency": "UAH" },
    { "countrycode": "AE", "name": "United Arab Emirates", "currency": "AED" },
    { "countrycode": "GB", "name": "United Kingdom", "currency": "GBP" },
    { "countrycode": "UY", "name": "Uruguay", "currency": "UYU" },
    { "countrycode": "UZ", "name": "Uzbekistan", "currency": "UZS" },
    { "countrycode": "VU", "name": "Vanuatu", "currency": "VUV" },
    { "countrycode": "VA", "name": "Vatican City", "currency": "EUR" },
    { "countrycode": "VE", "name": "Venezuela", "currency": "VES" ,"shopify":"USD" },
    { "countrycode": "VN", "name": "Vietnam", "currency": "VND" },
    { "countrycode": "WF", "name": "Wallis & Futuna", "currency": "XPF" },
    { "countrycode": "EH", "name": "Western Sahara", "currency": "MAD" },
    { "countrycode": "YE", "name": "Yemen", "currency": "YER" },
    { "countrycode": "ZM", "name": "Zambia", "currency": "ZMW" ,"shopify":"storecurrency" },
    { "countrycode": "ZW", "name": "Zimbabwe", "currency": "ZWL" ,"shopify":"USD" },
    
    
    
    ////below are unconfirmed counties
    
    // { "countrycode": "AS", "name": "American Samoa", "currency": "USD" },
    // { "countrycode": "BV", "name": "Bouvet Island", "currency": "NOK" },
    // { "countrycode": "CU", "name": "Cuba", "currency": "CUP" },
    // { "countrycode": "GS", "name": "South Georgia & South Sandwich Islands", "currency": "GBP" },
    // { "countrycode": "HM", "name": "Heard & McDonald Islands", "currency": "AUD" },
    // { "countrycode": "IR", "name": "Iran", "currency": "IRR" },
    
    // { "countrycode": "MV", "name": "Maldives", "currency": "MVR" },
    // { "countrycode": "MY", "name": "Malaysia", "currency": "MYR" },
    // { "countrycode": "SY", "name": "Syria", "currency": "SYP" },
    // { "countrycode": "TF", "name": "French Southern Territories", "currency": "EUR" },
    // { "countrycode": "AN", "name": "Netherlands Antilles", "currency": "ANG" }, 
]

  
  const deliveryCheck = (arr) => {
    let flag = false;
    arr.map((item) => {
      item.variants.map((itm) => {
        if (itm.requiresShipping == true) {
          flag = true;
        }
      });
    });
    return flag;
  };

  const getCurrencySymbol = (currency) => {
    const symbol = new Intl.NumberFormat("en", { style: "currency", currency })
      .formatToParts()
      .find((x) => x.type === "currency");
    return symbol && symbol.value;
  };


//console.log("subscription_details",subscription_details)



  // const handleProducts = async (e) => {
  //   //console.log(" in handleproducst");

  //   let obj = {};

  //   products?.map((item) => {
  //     obj[item.id] = item?.quantity;
  //   });

  //   // let newVariantsAddedIds = [];

  //   let sendData = [];
  //   let ids = [];
  //   e.selection.map((item) => {
  //     let variants = [];
  //     item.variants.map((itm) => {
  //       if (!obj[itm.id]) {
  //         // newVariantsAddedIds.push({
  //         //   id: itm.id,
  //         //   price: itm?.price,
  //         //   quantity: 1,
  //         // });
  //         sendData.push({
  //           id: itm.id,
  //           title: itm.title,
  //           image: itm?.image?.originalSrc ? itm.image.originalSrc : "",
  //           price: itm.price,
  //           quantity: obj[itm.id] ? obj[itm.id] : 1,
  //           requiresShipping: itm.requiresShipping,
  //           product_id: item.id,

  //           product_name: item.title,
  //           product_image:
  //             item?.images.length > 0 ? item.images[0].originalSrc : "",
  //           hasOnlyDefaultVariant: item.hasOnlyDefaultVariant,
  //         });
  //       }

  //       // ids.push({
  //       //   id: item.id,
  //       //   variants: [{ id: itm.id }],
  //       // });
  //     });
  //   });
  //   ///////////
  //   // //console.log("testing", newVariantsAddedIds);

  //   if (sendData?.length > 0) {
  //     // let result = await postApi(
  //     //   "/api/admin/subscriptionDraftLineAdd",
  //     //   {
  //     //     id: data?.subscription_id,
  //     //     lines: newVariantsAddedIds,
  //     //     discount: data?.subscription_details?.discount,
  //     //   },
  //     //   app
  //     // );

  //     let body = {
  //       id: subscriptionId,
  //       lines: sendData,
  //       discount: discount,
  //       check: "lineAdd",
  //       field: "lines", // just to apply check  in common updatedb function to make things easy
  //     };

  //     let getStatus = await subscriptionUpdateCommon(
  //       "subscriptionDraftLineAdd",
  //       body
  //     );

  //     getStatus && setAddProductModal(false);
  //   } else {
  //     toast.info("Selected item/items exist already ,Select any new !!", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //     setAddProductModal(false);
  //   }
  //   // setCheckedIds(ids);
  // };

  const handleProducts = async (e) => {
    //console.log(" in handleproducst");

    // setAddOnModal(true)
     let country;
if(subscription_details?.currency?.toLowerCase() != storeCurrency?.toLowerCase()){

  let filteredCountry=  countries.find(item=> item?.currency?.toLowerCase() == subscription_details?.currency?.toLowerCase() )   
  console.log("filteredCountry",filteredCountry)
country=filteredCountry?.countrycode

}



    let sendData = [];

    e.selection.map((item) => {
      item.variants.map((itm) => {
        sendData.push({
          id: itm.id,
          title: itm.title,
          image: itm?.image?.originalSrc ? itm.image.originalSrc : "",
          price: itm.price,
          quantity: 1,
          requiresShipping: itm.requiresShipping,
          product_id: item.id,

          product_name: item.title,
          product_image:
            item?.images.length > 0 ? item.images[0].originalSrc : "",
          hasOnlyDefaultVariant: item.hasOnlyDefaultVariant,
          originalPrice:itm.price
        });
      });
    });
    //console.log("first");

    let body = {
      id: subscriptionId,
      lines: sendData,
      discount: discount,
      check: "lineAdd",
      field: "lines", // just to apply check  in common updatedb function to make things easy
      ...( country ? { country :  country} : {} ),
      subscription_details:subscription_details
    };

    let getStatus = await subscriptionUpdateCommon(
      "subscriptionDraftLineAdd",
      body
    );

    getStatus && setAddProductModal(false);

    setAddProductModal(false);

  };

  const subscriptionUpdateCommon = async (endpoint, body) => {
    //console.log("checkkkkk7august");
    setLoader(true);
    let result = await postApi(`/api/admin/${endpoint}`, body, app);
    setLoader(false);
    //console.log("nevermind", result?.data?.data);

    if (result?.data?.message == "success") {
      toast.success(`Subscription updated successfully`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setProducts(result?.data?.data?.product_details);
      //console.log("at the end");

      let extra = {
        templateType: "subscriptionProduct(s)Updated",
        data: result?.data?.data,
        shop_name: storeDetails?.store_name,
        shop_email: storeDetails?.store_email,
        currency: storeDetails?.currency,
      };

      let resp = await sendMailOnUpdate({}, app, extra);
      return true;
    } else {
      toast.error(result?.data?.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return false;
    }
  };

  const handleCancel = () => {
    setAddProductModal(false);
  };

  //   const handleQuantity=(e,p_index,v_index)=>{

  //      let copy=[...products]
  //    let numbers=/^[0-9]+$/;
  // if ( e.target.value.match(numbers)&& e.target.value >0 ) {
  //   let newvalue = String(e.target.value);
  //   newvalue = newvalue.replace(/^0/, "");

  //   copy[p_index]["variants"][v_index]["quantity"]=parseInt(newvalue)
  //   //console.log(copy)
  //  setProducts(copy)
  //   }
  //   }
  //   //console.log(products)

  //   const handleDeleteVariant=(index,var_index)=>{
  //     let copy=[...products]

  //     if(copy[index].variants.length==1){
  //      copy.splice(index,1)

  //   }
  //   else{
  //     copy[index]["variants"].splice(var_index,1)
  //   }

  // // //  let checkDeliveryPrice=deliveryCheck(copy)
  // //  if(checkDeliveryPrice==true){
  // //   //console.log("up")
  // //    setShowDeliveryPrice(true)
  // //  }
  // //  else{
  // //   //console.log("down")
  // //   setShowDeliveryPrice(false)
  // //  }

  //  setProducts(copy)
  //  let ids = [];

  //      copy.map((item) => {
  //        let variants = [];
  //        item.variants.map((itm) => {
  //          variants.push({ id: itm.id });
  //        });

  //        ids.push({
  //          id:  item.product_id,
  //          variants: variants,
  //        });
  //      });

  //      setCheckedIds(ids);
  // }

  const handleQuantity = (e, index) => {
    let copy = [...products];
    let numbers = /^[0-9]+$/;
    if (e.target.value.match(numbers) && e.target.value > 0) {
      let newvalue = String(e.target.value);
      newvalue = newvalue.replace(/^0/, "");

      copy[index]["quantity"] = parseInt(newvalue);
      //console.log(copy);
      setProducts(copy);
    }
  };

  //console.log(products);

  const handlePrice = (e, index) => {
    let copy = [...products];
    // let numbers = /^[0-9]+(\.[0-9]+)?$/;

    const inputValue = e.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (e.target.value.length > 0) {
      if (regex.test(inputValue)) {
        copy[index]["price"] = parseFloat(inputValue);
        //console.log(copy);
        setProducts(copy);
      }
    } else {
      copy[index]["price"] = 0;
      //console.log(copy);
      setProducts(copy);
    }

    // let numbers = /^\d+(\.\d+)?$/;
    // if (e.target.value.match(numbers) ) {
    //   let newvalue = String(e.target.value);
    //   // newvalue = newvalue.replace(/^0/, "");

    //   copy[index]["price"] = parseFloat(newvalue);
    //   //console.log(copy);
    //   setProducts(copy);
    // }
  };

  const onFinish = async (values) => {
    //console.log("Successssdssss:", values);
    setCreateProductModal(false);

    setLoader(true);
    let country;
if(subscription_details?.currency?.toLowerCase() != storeCurrency?.toLowerCase()){

  let filteredCountry=  countries.find(item=> item?.currency?.toLowerCase() == subscription_details?.currency?.toLowerCase() )   
  console.log("filteredCountry",filteredCountry)
country=filteredCountry?.countrycode

}
    // let body = {
    //   id: subscriptionId,
    //   // lines: sendData,
    //   discount: discount,
    //   check: "createProductSubscriptionEdit", // just to apply check  in common updatedb function to make things easy
    // };

    let data = await postApi(
      "/api/admin/createProductSubscriptionEdit",

      {
        name: values.productName,

        price: values.price,

        // check: values.requireShipping,
        check: values.requireShipping == "physical" ? true : false,

        quantity: values.quantity,
        id: subscriptionId,
        discount: discount,
        check2: "createProductSubscriptionEdit",
        ...( country ? { country :  country} : {} ),
      },

      app
    );

    if (data?.data?.message == "success") {
      toast.success("Product created succesfully", {
        position: toast.POSITION.TOP_RIGHT,
      });

      // //console.log(data.data.data);

      // let pid = data.data.data.admin_graphql_api_id;

      // let vid = data.data.data.variants[0].admin_graphql_api_id;

      // // let arr = [...checkedIds];

      // // arr.push({
      // //   id: pid,

      // //   variants: [{ id: vid }],
      // // });

      // // setCheckedIds(arr);

      // let arr1 = [...products];

      // arr1.push({
      //   product_id: pid,

      //   product_name: data.data.data.title,

      //   product_image:
      //     data.data.data?.images.length > 0
      //       ? data.data.data.images[0].originalSrc
      //       : "",

      //   hasOnlyDefaultVariant: true,
      //   requiresShipping: data.data.data.variants[0].requires_shipping,
      //   id: vid,
      //   image: "",
      //   price: data.data.data.variants[0].price,

      //   title: data.data.data.variants[0].title,
      //   quantity: data.data.data.variants[0].inventory_quantity,
      // });

      setProducts(data?.data?.data?.product_details);
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    setLoader(false);

    //console.log(data);

    form.resetFields();
  };

  const handleEditProductItem = (index, price, quantity, line) => {
    setSelectedItemIndex(index);
    setPrice(parseFloat(price)?.toFixed(2));
    setQuantity(quantity);
  };

  const handleQuantityValue = (e) => {
    let numbers = /^[0-9]+$/;
    if (e.target.value.length > 0 ) {
      if (numbers.test(e.target.value)&& e.target.value > 0) {
        setQuantity(parseInt(e.target.value));
     
      }
    } else {
      setQuantity(1);
  };
  };

  // const handleQuantityValue = (e) => {
  //   let numbers = /^[0-9]+$/;
  //   if (e.target.value.match(numbers) && e.target.value > 0) {
  //     let newvalue = String(e.target.value);
  //     newvalue = newvalue.replace(/^0/, "");

  //     setQuantity(parseInt(newvalue));
  //   }
  // };




  // const handlePriceValue = (e) => {
  //   let validInput = /^\s*\d+(\.\d+)?\s*$/;
  //   if (e.target.value.match(validInput) && e.target.value > 0) {
  //     setPrice(e.target.value);
  //   }
  // };


  const handlePriceValue = (e) => {
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (e.target.value.length > 0) {
      if (regex.test(e.target.value)) {
        setPrice(parseFloat(e.target.value));
     
      }
    } else {
      setPrice(0);
  };

  }


  const handleDeleteProduct = async (index, subscriptionLine) => {
    let getStatus = await subscriptionUpdateCommon(
      "subscriptionDraftLineRemove",
      {
        id: subscriptionId,
        line: subscriptionLine,
      }
    );
    getStatus && setSelectedItemIndex();
  };

  const handleSave = async (subscriptionLine, index) => {
    //console.log("enter in saveeeeeeeeeeeeeeeeeeee");

// let computedPrice;
// if(subscription_details?.planType=='prepaid'){


// computedPrice=parseFloat(price*quantity*(subscription_details?.billingLength/subscription_details?.delivery_billingValue))


// }
// else{

//   computedPrice=parseFloat(price*quantity)
// }
console.log("7decec",price)
    let body = {
      id: subscriptionId,
      input: {
        quantity: parseInt(quantity),
        currentPrice: subscription_details?.planType == 'prepaid' ?   parseFloat(price*(subscription_details?.billingLength/subscription_details?.delivery_billingValue))  :    parseFloat(price),
      },
      line: subscriptionLine,
      itemIndex: index,
      field: "lines", //field draftcommit waali mutation ke responses  ke according set ki hai taaki uske response waale data ko db mai set karne mai  easy ho
      check: "line_update", //   just to apply check on query in findItemForUpdateSubscription controller function
     unitPrice:price 
    };

    let getStatus = await subscriptionUpdateCommon(
      "subscriptionDraftLineQuantityUpdate",
      body
    );
    //console.log("getStatus", getStatus);

    getStatus && setSelectedItemIndex();
  };
  //console.log(selectedItemIndex, edit, "checkinggggggg");

  const handleCancelProductItems = (index) => {
    setSelectedItemIndex();
  };


  const calculateSubTotal=()=>{
    let sum=0;
    products.map(item=>{
    
     sum= sum + parseFloat((item.quantity * item.price).toFixed(2))
    //console.log(sum,"sssumm")
    })
       
    return sum?.toFixed(2)
      }
    

  return (
    <div>
      <Card
        style={{
          width: "100%",
        }}
        className="revlytic sub-products-list"
      >
        <div className="revlytic pricing">
          <p>Products</p>
          {!edit?.productDetails ? null : (
            <div>
               <Tooltip color='#ffffff' title={billingPlan != 'premium' ? <Link to='/billing?option=editProducts'>Upgrade Your Plan</Link>: 'Add products to your Subscription Plan. You can either add all variants of a Product or a specific Product variant as selected.'}>
              <Button
                className="revlytic pricing-add-product"
                onClick={handleAddButton}
                disabled={billingPlan != 'premium'}
              >
                Add Products
              </Button>
              </Tooltip>
              <Tooltip title='This feature allows you to create a new Product directly from within Revlytic! So you never have to log out and back in. You can always go back into Shopify to add additional details if necessary.'>
              <Button
                className="revlytic pricing-create-product"
                onClick={() => setCreateProductModal(true)}
              >
                Create a Product
              </Button>
</Tooltip>
              <Button
                className="revlytic pricing-cancel-main"
              onClick={()=>{
                setEdit({ ...edit, productDetails: false })
                 setSelectedItemIndex();  
              }}>Cancel</Button>
            </div>
          )}
          {!edit?.productDetails && (
            <Button onClick={() => setEdit({ ...edit, productDetails: true })}>
 
                      <EditOutlined />
Edit
            </Button>
          )}
        </div>
        <div className="product-section portal-product">
        { products.length > 0 &&<div className="revlytic-product-listing-header manual-list">
            <h5>Product</h5>
            <h5>Price</h5>
            <h5>Quantity</h5>
            <h5>Total</h5>
         { edit.productDetails==true &&  <h5>Manage</h5>  }

          </div>}
          {products?.map((item, index) => 
            <div  key={index}>
            <div className="revlytic product-container">
              <div>
                {/* {index == 0 && (
                  <p className="revlytic-product-header-product">Product</p>
                )} */}

                <div className="revlytic product-image-title">
                  <img
                    src={
                      item?.image
                        ? item?.image
                        : item?.product_image
                        ? item?.product_image
                        : pic
                    }
                  />
                  <div className="revlytic product-name">
                    {/* <p>{item.product_name}</p> */}
                    <a
                      target="_blank"
                      href={
                        `https://admin.shopify.com/store/${storeDetails?.shop?.split(".myshopify.com")[0]}/products/` +
                        item?.product_id?.split("/").at(-1)
                      }
                      title={item?.product_name}
                    >
                      {item?.product_name}
                    </a>
                    <p>
                      {item.hasOnlyDefaultVariant == false ? item.title : ""}
                    </p>
                    {/* <p>{currencyCode} {item.price} (perUnit)</p> */}
                  </div>
                </div>
              </div>
              {/* <div>{currencyCode} {item.price} (perUnit)</div> */}
              <div className="revlytic product-price">
                {/* {index == 0 && <p className="revlytic-product-header">Price</p>} */}

                {edit?.productDetails && selectedItemIndex == index ? (
                  <Input
                    type="number"
                    prefix={subscription_details?.currency && getCurrencySymbol(subscription_details?.currency)}
                    value={price}
                    onChange={handlePriceValue}
                  />
                ) : (
                  subscription_details?.currency && getCurrencySymbol(subscription_details?.currency) + parseFloat(item?.price)?.toFixed(2)
                )}
              </div>
              <div className="revlytic product-quantity">
                {/* {index == 0 && (
                  <p className="revlytic-product-header">Quantity</p>
                )} */}

                {edit?.productDetails && selectedItemIndex == index ? (
                  <Input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityValue}
                  />
                ) : (
                  item?.quantity
                )}

              </div>

              <div className="revlytic price-total">
                {/* {index == 0 && <p className="revlytic-product-header">Total</p>} */}

                <p>
                  { edit?.productDetails &&
                  selectedItemIndex == index
                    ? subscription_details?.currency &&
                    getCurrencySymbol(subscription_details?.currency) +  (quantity * price).toFixed(2)
                    : subscription_details?.currency &&
                    getCurrencySymbol(subscription_details?.currency) +  (item.quantity * item.price).toFixed(2)}
                </p>
              </div>

           {/* 25septedittingstart */}
              {edit.productDetails &&
                (selectedItemIndex == undefined ||
                  selectedItemIndex != index) && (
<div className="revlytic product-delete-icon">
  {/* {index == 0 && (
       <p className="revlytic-product-header">Manage</p>
     )} */}
 {products.length > 1 && (
  

     <DeleteOutlined
       onClick={() =>
         handleDeleteProduct(index, item?.subscriptionLine)
       }
     />
  
 )}

 <EditOutlined
   onClick={() =>
     handleEditProductItem(
       index,
       item?.price,
       item?.quantity
     )
   }
   />
   
</div>
                )}



{/* 25septend */}


              {edit.productDetails && selectedItemIndex == index && (
                <div className="revlytic save-cancel-section">
                  <Button
                    onClick={() => handleSave(item?.subscriptionLine, index)}
                  >
                    Submit
                  </Button>

                  <Button onClick={() => handleCancelProductItems(index)}>
                    Cancel
                  </Button>
                </div>
              )}

              {/* {edit.productDetails && selectedItemIndex &&  selectedItemIndex ==index  ? <Button>Save</Button> : edit.productDetails && !selectedItemIndex 
                      ? <div><DeleteOutlined /><EditOutlined onClick={()=>setSelectedItemIndex(index)}/> </div> 
                       
                      :null}    */}


           </div>
           {index==products.length-1 &&  subscription_details.planType &&  <div className="rev-subtotal"><p>Subtotal:</p><p> {getCurrencySymbol(subscription_details.currency) + (subscription_details.planType=='prepaid' ? parseFloat(calculateSubTotal() * (parseInt(subscription_details?.billingLength)/parseInt(subscription_details?.delivery_billingValue)))?.toFixed(2):parseFloat(calculateSubTotal())?.toFixed(2))}</p></div>}
</div>
          )}
        </div>
      </Card>

      <ResourcePicker
        resourceType="Product" 
        open={addProductModal}
        onSelection={handleProducts}
        initialSelectionIds={checkedIds}
        onCancel={handleCancel}
        showHidden={false}
      />

      <Modal
        title="Select Addon Type"
        open={addOnModal}
        onCancel={() => setAddOnModal(false)}
        // footer={
        //   [
        //     // <Button key="cancel" onClick={() => setCreateProductModal(false)}>
        //     //   Cancel
        //     // </Button>,
        //   ]
        // }
      >
        <Radio.Group
          onChange={(e) => setAddOnValue(e.target.value)}
          value={addOnValue}
        >
          <Tooltip
            title="Customers are charged only once for a one-time (non-recurring) addon."
            placement="bottom"
          >
            <Radio value="oneTime">One Time</Radio>
          </Tooltip>
          <Tooltip
            title=" customers are charged  for the same feature each time."
            placement="bottom"
          >
            <Radio value="recurring">Recurring</Radio>
          </Tooltip>
        </Radio.Group>
      </Modal>

      <Modal
        className="rev-create-product"
        open={createProductModal}
        onCancel={() =>{ setCreateProductModal(false)
        form.resetFields()
        }}
        footer={
          [
            // <Button key="cancel" onClick={() => setCreateProductModal(false)}>
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
            
            form={form}
            name="basic"
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
            onFinish={onFinish}
            //   onFinishFailed={onFinishFailedproduct}
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

                        return Promise.reject( "Product Name is required!");

                        
                      }
                      if (value.trim() === "") {

                        return Promise.reject( "Product Name is required!");

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
                    message: " Price is required!",
                  },
                  {
                    pattern: /^-?\d*(\.\d+)?$/,
                    message: "Price must be a number",
                  },
                  {
                 
                                     validator: (rule, value) => {
                 
                                       if (parseInt(value, 10) <= 0) {
                 
                                         return Promise.reject("Price must be greater than zero");
                 
                                       }
                 
                                       return Promise.resolve();
                 
                                     },
                 
                                   },
                ]}
              >
                <Input prefix={currency && getCurrencySymbol(currency)} />
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
                    message: "Quantity must be a number",
                  },
                 

 {

                    validator: (rule, value) => {

                      if (parseInt(value, 10) <= 0) {

                        return Promise.reject("Quantity must be greater than zero");

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
                  //   defaultValue="physical"

                  options={[
                    { value: "physical", label: "Physical product" },

                    { value: "digital", label: "Digital product or service" },
                  ]}
                />
              </Form.Item>

              {/* 
          <Form.Item
                label="Requires Shipping"
                name="requireShipping"
                valuePropName="checked"
                initialValue={false}
              >
                <Checkbox />
              </Form.Item> */}
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
    </div>
  );
  
};
export default SubscriptionProductsEdit;
