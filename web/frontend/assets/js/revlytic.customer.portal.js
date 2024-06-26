document.addEventListener("DOMContentLoaded", () => {
  console.log("21novmber");
  let apiPath =`https://dev.revlytic.co/`;
  const urlParams = new URLSearchParams(window.location.search);
  const customerId = urlParams.get("cid");
  // const customerId = ShopifyAnalytics.meta.page.customerId;
  console.log(customerId, "idg");
  var shop = Shopify.shop;
  var prevButton, nextButton;
  var countrydata;
  var permissions = {
    cancellation: "simple",
    options: {
      one: "Doesn't meet my needs",
      two: "Found a better alternative",
      three: "Very expensive",
      four: "Other",
    },
    values: {
      attemptBilling: false,
      skipOrder: false,
      skipUpcomingFullfilment: false,
      pauseResumeSubscription: false,
      nextBilldate: false,
      changeShippingAddress: false,
      cancelSubscription: false,
      pauseBeforeCancellation: false,
      changeProductQuantity: false,
      addNewContractProduct: false,
      deleteSubscriptionProduct: false,
    },
  };
  var currencyCode;
  var timezone;
  var rescheduleId = "";
  var rescheduleDate = "";
  let store_name = "";
  let store_email = "";
  let totalBillings = "";
  let store_currency = "";

  const countries = [
    { countrycode: "US", name: "United States", currency: "USD" },
    { countrycode: "AF", name: "Afghanistan", currency: "AFN" },
    { countrycode: "AX", name: "Åland Islands", currency: "EUR" },
    { countrycode: "AL", name: "Albania", currency: "ALL" },
    { countrycode: "DZ", name: "Algeria", currency: "DZD" },
    { countrycode: "AD", name: "Andorra", currency: "EUR" },
    {
      countrycode: "AO",
      name: "Angola",
      currency: "AOA",
      shopify: "storecurrency",
    },
    { countrycode: "AI", name: "Anguilla", currency: "XCD" },
    { countrycode: "AG", name: "Antigua and Barbuda", currency: "XCD" },
    {
      countrycode: "AR",
      name: "Argentina",
      currency: "ARS",
      shopify: "storecurrency",
    },
    { countrycode: "AM", name: "Armenia", currency: "AMD" },
    { countrycode: "AW", name: "Aruba", currency: "AWG" },
    { countrycode: "AC", name: "Ascension Island", currency: "SHP" },
    { countrycode: "AU", name: "Australia", currency: "AUD" },
    { countrycode: "AT", name: "Austria", currency: "EUR" },
    { countrycode: "AZ", name: "Azerbaijan", currency: "AZN" },
    { countrycode: "BS", name: "Bahamas", currency: "BSD" },
    {
      countrycode: "BH",
      name: "Bahrain",
      currency: "BHD",
      shopify: "storecurrency",
    },
    { countrycode: "BD", name: "Bangladesh", currency: "BDT" },
    { countrycode: "BB", name: "Barbados", currency: "BBD" },
    {
      countrycode: "BY",
      name: "Belarus",
      currency: "BYN",
      shopify: "storecurrency",
    },
    { countrycode: "BE", name: "Belgium", currency: "EUR" },
    { countrycode: "BZ", name: "Belize", currency: "BZD" },
    { countrycode: "BJ", name: "Benin", currency: "XOF" },
    { countrycode: "BM", name: "Bermuda", currency: "BMD", shopify: "USD" },
    {
      countrycode: "BT",
      name: "Bhutan",
      currency: "BTN",
      shopify: "storecurrency",
    },
    {
      countrycode: "BO",
      name: "Bolivia (Plurinational State of)",
      currency: "BOB",
    },
    { countrycode: "BA", name: "Bosnia and Herzegovina", currency: "BAM" },
    { countrycode: "BW", name: "Botswana", currency: "BWP" },
    {
      countrycode: "BR",
      name: "Brazil",
      currency: "BRL",
      shopify: "storecurrency",
    },
    {
      countrycode: "IO",
      name: "British Indian Ocean Territory",
      currency: "USD",
    },
    { countrycode: "VG", name: "British Virgin Islands", currency: "USD" },
    { countrycode: "BN", name: "Brunei", currency: "BND" },
    { countrycode: "BG", name: "Bulgaria", currency: "BGN" },
    { countrycode: "BF", name: "Burkina Faso", currency: "XOF" },
    { countrycode: "BI", name: "Burundi", currency: "BIF" },
    { countrycode: "KH", name: "Cambodia", currency: "KHR" },
    { countrycode: "CM", name: "Cameroon", currency: "XAF" },
    { countrycode: "CA", name: "Canada", currency: "CAD" },
    { countrycode: "CV", name: "Cape Verde", currency: "CVE" },
    { countrycode: "BQ", name: "Caribbean Netherlands", currency: "USD" },
    { countrycode: "KY", name: "Cayman Islands", currency: "KYD" },
    { countrycode: "CF", name: "Central African Republic", currency: "XAF" },
    { countrycode: "TD", name: "Chad", currency: "XAF" },
    {
      countrycode: "CL",
      name: "Chile",
      currency: "CLP",
      shopify: "storecurrency",
    },
    { countrycode: "CN", name: "China", currency: "CNY" },
    { countrycode: "CX", name: "Christmas Island", currency: "AUD" },
    { countrycode: "CC", name: "Cocos (Keeling) Islands", currency: "AUD" },
    {
      countrycode: "CO",
      name: "Colombia",
      currency: "COP",
      shopify: "storecurrency",
    },
    { countrycode: "KM", name: "Comoros", currency: "KMF" },
    { countrycode: "CD", name: "Congo, Kinshasa", currency: "CDF" },
    { countrycode: "CG", name: "Congo Brazzaville", currency: "XAF" },
    { countrycode: "CK", name: "Cook Islands", currency: "NZD" },
    { countrycode: "CR", name: "Costa Rica", currency: "CRC" },
    { countrycode: "CI", name: "Côte d'Ivoire", currency: "XOF" },
    { countrycode: "HR", name: "Croatia", currency: "HRK", shopify: "EUR" },
    { countrycode: "CW", name: "Curaçao", currency: "ANG" },
    { countrycode: "CY", name: "Cyprus", currency: "EUR" },
    { countrycode: "CZ", name: "Czech Republic or czechia", currency: "CZK" },
    { countrycode: "DK", name: "Denmark", currency: "DKK" },
    { countrycode: "DJ", name: "Djibouti", currency: "DJF" },
    { countrycode: "DM", name: "Dominica", currency: "XCD" },
    { countrycode: "DO", name: "Dominican Republic", currency: "DOP" },
    { countrycode: "EC", name: "Ecuador", currency: "USD" },
    { countrycode: "EG", name: "Egypt", currency: "EGP" },
    { countrycode: "SV", name: "El Salvador", currency: "USD" },
    { countrycode: "GQ", name: "Equatorial Guinea", currency: "XAF" },
    {
      countrycode: "ER",
      name: "Eritrea",
      currency: "ERN",
      shopify: "storecurrency",
    },
    { countrycode: "EE", name: "Estonia", currency: "EUR" },
    {
      countrycode: "SZ",
      name: "Eswatini",
      currency: "SZL",
      shopify: "storecurrency",
    },
    { countrycode: "ET", name: "Ethiopia", currency: "ETB" },
    { countrycode: "FK", name: "Falkland Islands", currency: "FKP" },
    { countrycode: "FO", name: "Faroe Islands", currency: "DKK" },
    { countrycode: "FJ", name: "Fiji", currency: "FJD" },
    { countrycode: "FI", name: "Finland", currency: "EUR" },
    { countrycode: "FR", name: "France", currency: "EUR" },
    { countrycode: "GF", name: "French Guiana", currency: "EUR" },
    { countrycode: "PF", name: "French Polynesia", currency: "XPF" },
    { countrycode: "GA", name: "Gabon", currency: "XAF", shopify: "XOF" }, //XOF,XAF holds same monetary value
    { countrycode: "GM", name: "Gambia", currency: "GMD" },
    {
      countrycode: "GE",
      name: "Georgia",
      currency: "GEL",
      shopify: "storecurrency",
    },
    { countrycode: "DE", name: "Germany", currency: "EUR" },
    {
      countrycode: "GH",
      name: "Ghana",
      currency: "GHS",
      shopify: "storecurrency",
    },
    { countrycode: "GI", name: "Gibraltar", currency: "GIP", shopify: "GBP" }, //GIP,GBP holds same monetary value
    { countrycode: "GR", name: "Greece", currency: "EUR" },
    { countrycode: "GL", name: "Greenland", currency: "DKK" },
    { countrycode: "GD", name: "Grenada", currency: "XCD" },
    { countrycode: "GP", name: "Guadeloupe", currency: "EUR" },
    { countrycode: "GT", name: "Guatemala", currency: "GTQ" },
    { countrycode: "GG", name: "Guernsey", currency: "GBP" },
    { countrycode: "GN", name: "Guinea", currency: "GNF" },
    { countrycode: "GW", name: "Guinea-Bissau", currency: "XOF" },
    { countrycode: "GY", name: "Guyana", currency: "GYD" },
    {
      countrycode: "HT",
      name: "Haiti",
      currency: "HTG",
      shopify: "storecurrency",
    },
    { countrycode: "HN", name: "Honduras", currency: "HNL" },
    { countrycode: "HK", name: "Hong Kong SAR", currency: "HKD" },
    { countrycode: "HU", name: "Hungary", currency: "HUF" },
    { countrycode: "IS", name: "Iceland", currency: "ISK" },
    { countrycode: "IN", name: "India", currency: "INR" },
    { countrycode: "ID", name: "Indonesia", currency: "IDR" },
    {
      countrycode: "IQ",
      name: "Iraq",
      currency: "IQD",
      shopify: "storecurrency",
    },
    { countrycode: "IE", name: "Ireland", currency: "EUR" },
    { countrycode: "IM", name: "Isle of Man", currency: "GBP" },
    { countrycode: "IL", name: "Israel", currency: "ILS" },
    { countrycode: "IT", name: "Italy", currency: "EUR" },
    { countrycode: "JM", name: "Jamaica", currency: "JMD" },
    { countrycode: "JP", name: "Japan", currency: "JPY" },
    {
      countrycode: "JE",
      name: "Jersey",
      currency: "GBP",
      shopify: "storecurrency",
    },
    {
      countrycode: "JO",
      name: "Jordan",
      currency: "JOD",
      shopify: "storecurrency",
    },
    { countrycode: "KZ", name: "Kazakhstan", currency: "KZT" },
    { countrycode: "KE", name: "Kenya", currency: "KES" },
    {
      countrycode: "KI",
      name: "Kiribati",
      currency: "AUD",
      shopify: "storecurrency",
    },
    { countrycode: "XK", name: "Kosovo", currency: "EUR" },
    {
      countrycode: "KW",
      name: "Kuwait",
      currency: "KWD",
      shopify: "storecurrency",
    },
    { countrycode: "KG", name: "Kyrgyzstan", currency: "KGS" },
    { countrycode: "LA", name: "Laos", currency: "LAK" },
    { countrycode: "LV", name: "Latvia", currency: "EUR" },
    { countrycode: "LB", name: "Lebanon", currency: "LBP" },
    {
      countrycode: "LS",
      name: "Lesotho",
      currency: "LSL",
      shopify: "storecurrency",
    },
    {
      countrycode: "LR",
      name: "Liberia",
      currency: "LRD",
      shopify: "storecurrency",
    },
    {
      countrycode: "LY",
      name: "Libya",
      currency: "LYD",
      shopify: "storecurrency",
    },
    { countrycode: "LI", name: "Liechtenstein", currency: "CHF" },
    { countrycode: "LT", name: "Lithuania", currency: "EUR" },
    { countrycode: "LU", name: "Luxembourg", currency: "EUR" },
    { countrycode: "MO", name: "Macao SAR", currency: "MOP" },
    {
      countrycode: "MG",
      name: "Madagascar",
      currency: "MGA",
      shopify: "storecurrency",
    },
    { countrycode: "MW", name: "Malawi", currency: "MWK" },
    { countrycode: "ML", name: "Mali", currency: "XOF" },
    { countrycode: "MT", name: "Malta", currency: "EUR" },
    { countrycode: "MQ", name: "Martinique", currency: "EUR" },
    {
      countrycode: "MR",
      name: "Mauritania",
      currency: "MRU",
      shopify: "storecurrency",
    },
    { countrycode: "MU", name: "Mauritius", currency: "MUR" },
    { countrycode: "YT", name: "Mayotte", currency: "EUR" },
    {
      countrycode: "MX",
      name: "Mexico",
      currency: "MXN",
      shopify: "storecurrency",
    },
    { countrycode: "MD", name: "Moldova", currency: "MDL" },
    { countrycode: "MC", name: "Monaco", currency: "EUR" },
    { countrycode: "MN", name: "Mongolia", currency: "MNT" },
    { countrycode: "ME", name: "Montenegro", currency: "EUR" },
    { countrycode: "MS", name: "Montserrat", currency: "XCD" },
    { countrycode: "MA", name: "Morocco", currency: "MAD" },
    {
      countrycode: "MZ",
      name: "Mozambique",
      currency: "MZN",
      shopify: "storecurrency",
    },
    { countrycode: "MM", name: "Myanmar (Burma)", currency: "MMK" },
    {
      countrycode: "NA",
      name: "Namibia",
      currency: "NAD",
      shopify: "storecurrency",
    },
    { countrycode: "NR", name: "Nauru", currency: "AUD" },
    { countrycode: "NP", name: "Nepal", currency: "NPR" },
    { countrycode: "NL", name: "Netherlands", currency: "EUR" },
    { countrycode: "NC", name: "New Caledonia", currency: "XPF" },
    { countrycode: "NZ", name: "New Zealand", currency: "NZD" },
    { countrycode: "NI", name: "Nicaragua", currency: "NIO" },
    { countrycode: "NE", name: "Niger", currency: "XOF" },
    { countrycode: "NG", name: "Nigeria", currency: "NGN" },
    { countrycode: "NU", name: "Niue", currency: "NZD" },
    { countrycode: "NF", name: "Norfolk Island", currency: "AUD" },
    { countrycode: "MK", name: "North Macedonia", currency: "MKD" },
    {
      countrycode: "NO",
      name: "Norway",
      currency: "NOK",
      shopify: "storecurrency",
    },
    {
      countrycode: "OM",
      name: "Oman",
      currency: "OMR",
      shopify: "storecurrency",
    },
    { countrycode: "PK", name: "Pakistan", currency: "PKR" },
    { countrycode: "PS", name: "Palestinian Territories", currency: "ILS" },
    { countrycode: "PA", name: "Panama", currency: "PAB", shopify: "USD" },
    { countrycode: "PG", name: "Papua New Guinea", currency: "PGK" },
    { countrycode: "PY", name: "Paraguay", currency: "PYG" },
    { countrycode: "PE", name: "Peru", currency: "PEN" },
    { countrycode: "PH", name: "Philippines", currency: "PHP" },
    { countrycode: "PN", name: "Pitcairn Islands", currency: "NZD" },
    { countrycode: "PL", name: "Poland", currency: "PLN" },
    { countrycode: "PT", name: "Portugal", currency: "EUR" },
    { countrycode: "QA", name: "Qatar", currency: "QAR" },
    { countrycode: "RE", name: "Réunion", currency: "EUR" },
    { countrycode: "RO", name: "Romania", currency: "RON" },
    { countrycode: "RU", name: "Russia", currency: "RUB" },
    { countrycode: "RW", name: "Rwanda", currency: "RWF" },
    { countrycode: "WS", name: "Samoa", currency: "WST" },
    { countrycode: "SM", name: "San Marino", currency: "EUR" },
    { countrycode: "ST", name: "São Tomé & Príncipe", currency: "STD" },
    { countrycode: "SA", name: "Saudi Arabia", currency: "SAR" },
    { countrycode: "SN", name: "Senegal", currency: "XOF" },
    { countrycode: "RS", name: "Serbia", currency: "RSD" },
    {
      countrycode: "SC",
      name: "Seychelles",
      currency: "SCR",
      shopify: "storecurrency",
    },
    { countrycode: "SL", name: "Sierra Leone", currency: "SLL" },
    { countrycode: "SG", name: "Singapore", currency: "SGD" },
    { countrycode: "SX", name: "Sint Maarten", currency: "ANG" },
    { countrycode: "SK", name: "Slovakia", currency: "EUR" },
    { countrycode: "SI", name: "Slovenia", currency: "EUR" },
    { countrycode: "SB", name: "Solomon Islands", currency: "SBD" },
    {
      countrycode: "SO",
      name: "Somalia",
      currency: "SOS",
      shopify: "storecurrency",
    },
    { countrycode: "ZA", name: "South Africa", currency: "ZAR" },
    { countrycode: "KR", name: "South Korea", currency: "KRW" },
    {
      countrycode: "SS",
      name: "South Sudan",
      currency: "SSP",
      shopify: "storecurrency",
    },
    { countrycode: "ES", name: "Spain", currency: "EUR" },
    { countrycode: "LK", name: "Sri Lanka", currency: "LKR" },
    { countrycode: "BL", name: "Saint Barthélemy", currency: "EUR" },
    { countrycode: "SH", name: "St. Helena", currency: "SHP" },
    { countrycode: "KN", name: "St. Kitts & Nevis", currency: "XCD" },
    { countrycode: "LC", name: "St. Lucia", currency: "XCD" },
    { countrycode: "MF", name: "St. Martin", currency: "EUR" },
    { countrycode: "PM", name: "St. Pierre & Miquelon", currency: "EUR" },
    { countrycode: "KP", name: "North Korea", currency: "KPW" },
    { countrycode: "VC", name: "St. Vincent & Grenadines", currency: "XCD" },
    {
      countrycode: "SD",
      name: "Sudan",
      currency: "SDG",
      shopify: "storecurrency",
    },
    {
      countrycode: "SR",
      name: "Suriname",
      currency: "SRD",
      shopify: "storecurrency",
    },
    {
      countrycode: "SJ",
      name: "Svalbard & Jan Mayen",
      currency: "NOK",
      shopify: "storecurrency",
    },
    { countrycode: "SE", name: "Sweden", currency: "SEK" },
    { countrycode: "CH", name: "Switzerland", currency: "CHF" },
    { countrycode: "TW", name: "Taiwan", currency: "TWD" },
    { countrycode: "TJ", name: "Tajikistan", currency: "TJS" },
    { countrycode: "TZ", name: "Tanzania", currency: "TZS" },
    { countrycode: "TH", name: "Thailand", currency: "THB" },
    { countrycode: "TL", name: "Timor-Leste", currency: "USD" },
    { countrycode: "TG", name: "Togo", currency: "XOF" },
    { countrycode: "TK", name: "Tokelau", currency: "NZD" },
    { countrycode: "TO", name: "Tonga", currency: "TOP" },
    { countrycode: "TT", name: "Trinidad & Tobago", currency: "TTD" },
    {
      countrycode: "TA",
      name: "Tristan da Cunha",
      currency: "SHP",
      shopify: "GBP",
    }, //SHP,GBP share same monetary value
    {
      countrycode: "TN",
      name: "Tunisia",
      currency: "TND",
      shopify: "storecurrency",
    },
    {
      countrycode: "TR",
      name: "Turkey",
      currency: "TRY",
      shopify: "storecurrency",
    },
    {
      countrycode: "TM",
      name: "Turkmenistan",
      currency: "TMT",
      shopify: "storecurrency",
    },
    { countrycode: "TC", name: "Turks & Caicos Islands", currency: "USD" },
    { countrycode: "TV", name: "Tuvalu", currency: "AUD" },
    { countrycode: "UM", name: "U.S. Outlying Islands", currency: "USD" },
    { countrycode: "UG", name: "Uganda", currency: "UGX" },
    { countrycode: "UA", name: "Ukraine", currency: "UAH" },
    { countrycode: "AE", name: "United Arab Emirates", currency: "AED" },
    { countrycode: "GB", name: "United Kingdom", currency: "GBP" },
    { countrycode: "UY", name: "Uruguay", currency: "UYU" },
    { countrycode: "UZ", name: "Uzbekistan", currency: "UZS" },
    { countrycode: "VU", name: "Vanuatu", currency: "VUV" },
    { countrycode: "VA", name: "Vatican City", currency: "EUR" },
    { countrycode: "VE", name: "Venezuela", currency: "VES", shopify: "USD" },
    { countrycode: "VN", name: "Vietnam", currency: "VND" },
    { countrycode: "WF", name: "Wallis & Futuna", currency: "XPF" },
    { countrycode: "EH", name: "Western Sahara", currency: "MAD" },
    { countrycode: "YE", name: "Yemen", currency: "YER" },
    {
      countrycode: "ZM",
      name: "Zambia",
      currency: "ZMW",
      shopify: "storecurrency",
    },
    { countrycode: "ZW", name: "Zimbabwe", currency: "ZWL", shopify: "USD" },

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
  ];

  const getSymbol = (currency) => {
    const symbol = new Intl.NumberFormat("en", { style: "currency", currency })
      .formatToParts()
      .find((x) => x.type === "currency");
    return symbol && symbol.value;
  };

  function showToast(message, duration) {
    // Create a toast element
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    // Append the toast element to the body
    document.body.appendChild(toast);

    // Set a timeout to remove the toast after the specified duration
    setTimeout(function () {
      document.body.removeChild(toast);
    }, duration);
  }

  /////////////////////get total billngs
  function getBillingsTotal() {
    let loader = document.getElementById("revlytic-overlay");
    loader.style.display = "flex";

    fetch(`${apiPath}api/customerPortal/getTotalOrdersBillingsCount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shop,
        contract_id: `gid://shopify/SubscriptionContract/${param1}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        loader.style.display = "none";
        console.log(data, "permmmmm dataa");
        if (data.message == "success") {
          totalBillings = data?.data;
          console.log(data, "okokokokkoko");
        }
      })

      .catch((error) => {
        loader.style.display = "none";
        console.error("Error fetching data:", error);
      });
  }
  // //////////////////////

  function getPermissions() {
    let loader = document.getElementById("revlytic-overlay");
    loader.style.display = "flex";

    fetch(`${apiPath}api/customerPortal/getCustomerPortalDetailsStore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shop,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        loader.style.display = "none";
        console.log(data, "permmmmm dataa");
        if (data.message == "success") {
          permissions = data?.data;
        }
      })

      .catch((error) => {
        loader.style.display = "none";
        console.error("Error fetching data:", error);
      });
  }
  async function getstoreDetails() {
    let loader = document.getElementById("revlytic-overlay");
    loader.style.display = "flex";

    fetch(`${apiPath}api/customerPortal/getCurrencyCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shop,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        loader.style.display = "none";
        console.log(data, "currre dataa");
        if (data.message == "success") {
          timezone = data?.data?.timezone;
          store_name = data?.data?.store_name;
          store_email = data?.data?.store_email;
          store_currency = data?.data?.currency;
        }
      })

      .catch((error) => {
        loader.style.display = "none";
        console.error("Error fetching data:", error);
      });
  }
  let loaderData = `<div class="overlay" id="revlytic-overlay">
  <div className='revlytic-loader'>
  <svg width="20vh" height="20vh" viewBox="0 0 512 512" fill="#44e74473" overflow="hidden" xmlns="http://www.w3.org/2000/svg">
    <use href="#cube" x="128" y="320" stroke-width="2"  opacity="0.3">
        <animate attributeName="stroke" dur="6s" repeatCount="indefinite"
                 values="#FF9AA2;#FFB7B2;#FFDAC1;#E2F0CB;#B5EAD7;#C7CEEA;#FF9AA2"/>
    </use>
    
    <use href="#cube" x="128" y="128" stroke-width="2">
        <animate attributeName="stroke" dur="6s" repeatCount="indefinite"
                 values="#FF9AA2;#FFB7B2;#FFDAC1;#E2F0CB;#B5EAD7;#C7CEEA;#FF9AA2"/>
    </use>
    
    <defs>
      
         <g id="cube">
            <use href="#cube_outline" stroke-linejoin="round" stroke-width="16" fill="url(#stars)"/>
            <use href="#cube_base" stroke-width=".5"/>
            <use href="#cube_outline" stroke-linejoin="round" stroke-width="6" stroke="#141417"/>
        </g>    
    
        <g id="cube_outline">
            <path>
                <animate attributeName="d" dur="1.5s" repeatCount="indefinite" calcMode="spline"
                keyTimes="0;0.5;0.5;1"
                keySplines="0.8 0.2 0.6 0.9; 
                            0.8 0.2 0.6 0.9; 
                            0.8 0.2 0.6 0.9"
                values="M10 64 L128 0 L246 64 L246 192 L128 256 L10 192Z;
                        M40 20 L216 20 L216 108 L216 236 L40 236 L40 172Z;
                        M216 20 L40 20 L40 108 L40 236 L216 236 L216 172Z;
                        M246 64 L128 0 L10 64 L10 192 L128 256 L246 192Z"/>
            </path>
        </g>
    
        <g id="cube_base">
            <path fill="#fff1"> 
            <animate attributeName="d" dur="1.5s" repeatCount="indefinite" calcMode="spline"
                keyTimes="0;0.5;1"
                keySplines="0.8 0.2 0.6 0.9; 
                            0.8 0.2 0.6 0.9"
                values="M10 64 L128 0 L246 64 L128 128Z;
                        M40 20 L216 20 L216 108 L40 108Z;
                        M128 0 L246 64 L128 128 L10 64Z"/>
            </path>
            <path>
            <animate attributeName="d" dur="1.5s" repeatCount="indefinite" calcMode="spline"
                keyTimes="0;0.5;0.5;1"
                keySplines="0.8 0.2 0.6 0.9; 
                            0.8 0.2 0.6 0.9; 
                            0.8 0.2 0.6 0.9"
                values="M10 64 L128 128 L128 256 L10 192Z;
                        M40 20 L40 108 L40 236 L40 172Z;
                        M216 20 L216 108 L216 236 L216 172Z;
                        M246 64 L128 128 L128 256 L246 192Z"/>
            <animate attributeName="fill" dur="1.5s" repeatCount="indefinite" keyTimes="0;0.5;0.5;1"
                values="#fff0;#fff0;#fff2;#fff2"/>
            </path>
            <path fill="#407080">
            <animate attributeName="d" dur="1.5s" repeatCount="indefinite" calcMode="spline"
                keyTimes="0;0.5;1"
                keySplines="0.8 0.2 0.6 0.9; 
                            0.8 0.2 0.6 0.9"
                values="M246 64 L128 128 L128 256 L246 192Z;
                        M216 108 L40 108 L40 236 L216 236Z;
                        M128 128 L10 64 L10 192 L128 256Z"/>
                <animate attributeName="fill" dur="1.5s" repeatCount="indefinite" keyTimes="0;0.5;1"
                    values="#fff2;#fff1;#fff0"/>
            </path>
        </g>
        <linearGradient id="fade" gradientTransform="rotate(90)">
            <stop offset="0" stop-color="#14141700"/>
            <stop offset="0.25" stop-color="#141417ff"/>
        </linearGradient>
        <linearGradient id="sky" gradientTransform="rotate(90)">
            <stop offset="0.5" stop-color="#141417"/>
            <stop offset="1" stop-color="#40354a"/>
        </linearGradient>
      
      
        <pattern id="stars" x="0" y="0" width="50%" height="50%" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <rect width="256" height="256" fill="url(#sky)"/>
            <use href="#star01" x="24" y="32"  fill="white"/>
            <use href="#star01" x="64" y="96"  fill="#ad9dcb" transform="rotate(90 80 112)"/>
            <use href="#star01" x="224" y="102"  fill="#ad9dcb"/>
            <use href="#star01" x="192" y="112"  fill="#E0E8EA" transform="rotate(90 80 112)"/>
            <use href="#star02" x="16" y="64"  fill="#ad9dcb"/>
            <use href="#star03" x="96" y="16"  fill="#E0E8EA"/>
            <use href="#star04" x="64" y="64"  fill="white"/>
            <use href="#star04" x="8" y="16"  fill="#ad9dcb"/>
            <use href="#star04" x="110" y="96"  fill="#E0E8EA"/>
            <use href="#star02" x="160" y="24"  fill="#ad9dcb"/>
            <use href="#star03" x="196" y="60"  fill="#E0E8EA"/>
            <use href="#star04" x="64" y="212"  fill="white"/>
            <use href="#star04" x="218" y="216"  fill="#ad9dcb"/>
            <use href="#star03" x="228" y="220"  fill="#E0E8EA"/>
            <use href="#star02" x="140" y="128"  fill="#ad9dcb"/>
            <use href="#star03" x="24" y="140"  fill="#E0E8EA"/>
            <use href="#star04" x="95" y="160"  fill="white"/>
            <use href="#star04" x="180" y="128"  fill="#ad9dcb"/>
            <use href="#star03" x="200" y="136"  fill="#E0E8EA"/>
            <use href="#star10" x="120" y="120"  stroke="#E0E8EA"/>
            <use href="#star11" x="48" y="64"  stroke="#ad9dcb"/>
        </pattern>
        <path id="star01" transform="scale(0.5)">
            <animate attributeName="d" dur="3s" repeatCount="indefinite" calcMode="spline"
                keyTimes="0;0.5;1" keySplines="0.8 0.2 0.6 0.9; 0.8 0.2 0.6 0.9"
                values="M16 0 Q16 16 24 16 Q16 16 16 32 Q16 16 8 16 Q16 16 16 0Z;
                        M16 8 Q16 16 32 16 Q16 16 16 24 Q16 16 0 16 Q16 16 16 8Z;
                        M16 0 Q16 16 24 16 Q16 16 16 32 Q16 16 8 16 Q16 16 16 0Z"/>
        </path>
        <circle id="star02">
            <animate attributeName="r" dur="3s" repeatCount="indefinite" calcMode="spline"
                keyTimes="0;0.5;1" keySplines="0.8 0.2 0.6 0.9; 0.8 0.2 0.6 0.9"
                values="0;2;0"/>
        </circle>
        <circle id="star03">
            <animate attributeName="r" dur="6s" repeatCount="indefinite" calcMode="spline"
                keyTimes="0;0.5;1" keySplines="0.8 0.2 0.6 0.9; 0.8 0.2 0.6 0.9"
                values="3;1;3"/>
        </circle>
        <circle id="star04" r="1"/>
    
        <path id="star10" stroke-width="2">
            <animate attributeName="d" dur="5s" repeatCount="indefinite" 
                keyTimes="0;0.90;0.97;1"
                keySplines="0 0.4 1 0.2; 0 0.4 1 0.2; 0 0.4 1 0.2"
                values="M64 0 L64 0Z; M64 0 L64 0Z; M48 12 L0 48Z; M0 48 L0 48Z"/>
            <animate attributeName="opacity" dur="5s" repeatCount="indefinite"
                keyTimes="0;0.90;0.97;1"
                values="1; 1; 0.6; 0"/>
        </path>
        <path id="star11" stroke-width="3">
            <animate attributeName="d" dur="6s" repeatCount="indefinite" delay="3s"
                keyTimes="0;0.90;0.95;1"
                keySplines="0 0.4 1 0.2; 0 0.4 1 0.2; 0 0.4 1 0.2"
                values="M64 0 L64 0Z; M64 0 L64 0Z; M48 12 L0 48Z; M0 48 L0 48Z"/>
            <animate attributeName="opacity" dur="6s" repeatCount="indefinite" delay="3s"
                keyTimes="0;0.90;0.95;1"
                values="1; 1; 0.6; 0"/>
        </path>
    </defs>
    </svg>
</div>
</div>`;

  const storeUrl = `https://${shop}`;
  var accessToken;
  const pageSize = 10;
  let startCursor = null;
  let next = true;
  let loadProducts = [];
  var searchQuery = "";
  var selectedIds = [];
  let listData;
  let allListData;
  const itemsPerPage = 10;
  let currentPage = 1;

  // const urlParams = new URLSearchParams(window.location.search);
  const param1 = urlParams.get("id");
  console.log(param1);

  let bodyData = `<div class="revlytic-subscription-order">
  ${loaderData}
    <div class="order_profile">
        <h4 id="rev-initial"></h4>
        <div class="order_profile_details">
            <h3 id="rev-customer-name"></h3>
            <h5 id="rev-customer-id"></h5>
        </div>
    </div>
    <div class="serach-date">
        <div class="inner-search-input">
            <input class="nosubmit" id="rev-search" type="search" placeholder="Search...">
        </div>
  
    </div>
    <div class="revlytic_subscription-table" style="overflow-x: auto;">
        <ul class="responsive-table">
            <li class="table-header">
                <div class="col-col-1">Subscription ID</div>
                <div class="col-col-1">Next Order Date</div>
                <div class="col-col-1">Order Frequency</div>
                <div class="col-col-1 rev-product-count">Products</div>
                <div class="col-col-1">Price</div>
                <div class="col-col-1">Status</div>
                <div class="col-col-1">Manage</div>
            </li>
        </ul>
  
    </div>
    <div class="revlytic_subscription_pagination">
        <div class="pagination">
            <button id="rev-prev-btn" disabled>&laquo;</button>
            <button id="rev-next-btn" >&raquo;</button>
        </div>
    </div>
  </div>`;

  const containerDiv = document.getElementById("revlytic-main-body");
  containerDiv.innerHTML = loaderData;

  if (param1 == null) {
    containerDiv.innerHTML = bodyData;
  }
  getBillingsTotal();
  getPermissions();
  getstoreDetails();
  let loader = document.getElementById("revlytic-overlay");
  loader.style.display = "flex";
  let getDataFromDb = () => {
    fetch(`${apiPath}api/customerPortal/getCustomerSubscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: customerId,
        shop,
      }),
    })
      .then((response) => response.json())
      .then((subscriptions) => {
        loader.style.display = "none";

        listData = subscriptions;
        allListData = JSON.parse(JSON.stringify(subscriptions));
        console.log(allListData);
        if (param1 == null) {
          prevButton = document.getElementById("rev-prev-btn");
          nextButton = document.getElementById("rev-next-btn");
          prevButton.addEventListener("click", () => {
            var ulElement = document.querySelector(".responsive-table");

            // Get all li elements with the class name 'table-row'
            var tableRows = ulElement.querySelectorAll(".table-row");

            // Remove each table-row li element from the ul
            tableRows.forEach(function (row) {
              ulElement.removeChild(row);
            });
            if (currentPage > 1) {
              currentPage--;
              renderItems({ data: listData.data });
              updatePaginationButtons();
            }
          });
          // const nextButton = document.getElementById("rev-next-btn");
          nextButton.addEventListener("click", () => {
            var ulElement = document.querySelector(".responsive-table");

            // Get all li elements with the class name 'table-row'
            var tableRows = ulElement.querySelectorAll(".table-row");

            // Remove each table-row li element from the ul
            tableRows.forEach(function (row) {
              ulElement.removeChild(row);
            });
            const totalPages = Math.ceil(listData.data.length / itemsPerPage);
            if (currentPage < totalPages) {
              currentPage++;
              renderItems({ data: listData.data });
              updatePaginationButtons();
            }
          });
          function updatePaginationButtons() {
            const totalPages = Math.ceil(listData.data.length / itemsPerPage);

            prevButton.disabled = currentPage === 1;
            nextButton.disabled =
              currentPage === totalPages ||
              listData.data.length <= itemsPerPage;
          }
          renderItems(subscriptions);

          if (subscriptions.data.length < 11) {
            nextButton.disabled = true;
          }
          if (
            subscriptions.data[0].customer_details.firstName &&
            subscriptions.data[0].customer_details.lastName
          ) {
            customerName =
              subscriptions.data[0].customer_details.firstName +
              " " +
              subscriptions.data[0].customer_details.lastName;
          } else if (subscriptions.data[0].customer_details.firstName) {
            customerName = subscriptions.data[0].customer_details.firstName;
          } else if (subscriptions.data[0].customer_details.lastName) {
            customerName = subscriptions.data[0].customer_details.lastName;
          }

          let initials = "";

          if (
            subscriptions.data[0].customer_details.firstName &&
            subscriptions.data[0].customer_details.lastName
          ) {
            initials =
              subscriptions.data[0].customer_details.firstName
                .charAt(0)
                .toUpperCase() +
              subscriptions.data[0].customer_details.lastName
                .charAt(0)
                .toUpperCase();
          } else if (subscriptions.data[0].customer_details.firstName) {
            initials = subscriptions.data[0].customer_details.firstName
              .charAt(0)
              .toUpperCase();
          } else if (subscriptions.data[0].customer_details.lastName) {
            initials = subscriptions.data[0].customer_details.lastName
              .charAt(0)
              .toUpperCase();
          }
          let Cid = document.getElementById("rev-customer-id");
          let Cname = document.getElementById("rev-customer-name");
          let NameInitial = document.getElementById("rev-initial");
          NameInitial.innerHTML = initials;

          Cid.innerHTML = `Customer ID: ${customerId}`;
          Cname.innerHTML = `Hello ${customerName}`;
        } else {
          getStoreToken();
          console.log("ssdsdasa=>>>", subscriptions);
          subscriptionDetails(subscriptions);
        }
      })

      .catch((error) => {
        loader.style.display = "none";
        console.error("Error fetching subscriptions:", error);
      });
  };
  getDataFromDb();
  ///////////////////////////////// put list of subs

  //////////////////search input
  if (param1 == null) {
    let searchInput = document.getElementById("rev-search");

    searchInput.addEventListener("input", () => {
      currentPage = 1;
      console.log(listData, "hhh", allListData);
      // listData=allListData
      const searchTerm = searchInput.value.toLowerCase();

      // Clear the existing list content
      // const subscriptionList = document.getElementById("subscription-list");
      // subscriptionList.innerHTML = "";
      var ulElement = document.querySelector(".responsive-table");

      // Get all li elements with the class name 'table-row'
      var tableRows = ulElement.querySelectorAll(".table-row");

      // Remove each table-row li element from the ul
      tableRows.forEach(function (row) {
        ulElement.removeChild(row);
      });

      if (!searchTerm) {
        let change = JSON.parse(JSON.stringify(allListData));
        listData = change;
        console.log(allListData, "okkk", listData);
        // If search term is empty, render the original list
        const totalPages = Math.ceil(allListData.data.length / itemsPerPage);

        prevButton.disabled = currentPage === 1;
        nextButton.disabled =
          currentPage === totalPages || allListData.data.length <= itemsPerPage;
        renderItems(allListData);
      } else {
        const filteredItems = allListData.data.filter((item) => {
          const numericId = item.subscription_id.match(/\d+/)[0];
          let Price = 0;
          item?.product_details?.forEach((productData) => {
            Price += parseFloat(productData.price);
          });
          const statusFormatted =
            item.status.charAt(0).toUpperCase() +
            item.status.slice(1).toLowerCase();
          const dateString = item.nextBillingDate;
          const date = new Date(dateString);

          const options = { year: "numeric", month: "long", day: "numeric" };
          const formattedDate = date.toLocaleDateString("en-US", options);
          let frequency;
          if (item.subscription_details.planType == "payAsYouGo") {
            frequency =
              item.subscription_details.billingLength +
              " " +
              item.subscription_details.delivery_billingType;
          } else {
            frequency =
              item.subscription_details.delivery_billingValue +
              " " +
              item.subscription_details.delivery_billingType;
          }
          // Check if any of the properties include the search term
          return (
            numericId.toLowerCase().includes(searchTerm) ||
            statusFormatted.toLowerCase().includes(searchTerm) ||
            formattedDate.toLowerCase().includes(searchTerm) ||
            Price.toFixed(2).toLowerCase().includes(searchTerm) ||
            frequency.toLowerCase().includes(searchTerm)
          );
        });
        let mainData = listData;
        mainData.data = filteredItems;
        listData = mainData;

        function updatePaginationButtons() {
          const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

          prevButton.disabled = currentPage === 1;
          nextButton.disabled =
            currentPage === totalPages || filteredItems.length <= itemsPerPage;
        }
        updatePaginationButtons();
        renderItems({ data: filteredItems });
      }
    });

    // const prevButton = document.getElementById("rev-prev-btn");
  }

  const renderItems = (subscriptions) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const dataHtml = subscriptions.data
      .slice(startIndex, endIndex)
      .map((item) => {
        const numericId = item.subscription_id.match(/\d+/)[0];
        let Price = 0;
        item?.product_details?.map((productData) => {
          Price += parseFloat(productData.price);
        });
        const statusFormatted =
          item.status.charAt(0).toUpperCase() +
          item.status.slice(1).toLowerCase();
        const dateString = item.nextBillingDate;
        const date = new Date(dateString);

        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = date.toLocaleDateString("en-US", options);
        let frequency;
        if (item.subscription_details.planType == "payAsYouGo") {
          frequency =
            item.subscription_details.billingLength +
            " " +
            item.subscription_details.delivery_billingType;
        } else {
          frequency =
            item.subscription_details.delivery_billingValue +
            " " +
            item.subscription_details.delivery_billingType;
        }

        return `
                <li class="table-row">
                    <div class="col-col-1">${numericId}</div>
                    <div class="col-col-1">${formattedDate}</div>
                    <div class="col-col-1">${frequency.toLocaleLowerCase()}(s)</div>
                    <div class="col-col-1 rev-product-count">${
                      item.product_details.length
                    }</div>
                    <div class="col-col-1">${getSymbol(
                      item?.subscription_details?.currency
                    )}${Price.toFixed(2)}</div>
                    <div class="col-col-1 ${
                      item.status.toLowerCase() == "active"
                        ? "active"
                        : "cancel"
                    }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <circle cx="5.96289" cy="5.51038" r="5" fill= ${
                              item.status.toLowerCase() == "active"
                                ? "#3EBE62"
                                : "#F67070"
                            } />
                        </svg>
                        ${statusFormatted}
                    </div>
                    <div class="col-col-1"><a href="https://${shop}/apps/revlytic-subscriptions?id=${numericId}&cid=${customerId}"> View Details </a></div>
                </li>
              `;
      })
      .join("");

    let subcriptionList = document.getElementsByClassName("table-header")[0];
    subcriptionList.insertAdjacentHTML("afterend", dataHtml);
  };

  const fetchShopifyProducts = async (
    storeUrl,
    accessToken,
    pageSize,
    afterCursor,
    searchQuery
  ) => {
    const apiUrl = `${storeUrl}/api/2023-07/graphql.json`;

    const query = `
          query GetProducts($pageSize: Int!, $afterCursor: String, $searchQuery: String) {
            products(first: $pageSize, after: $afterCursor, query: $searchQuery) {
              pageInfo {
                hasNextPage
                endCursor
              }
              edges {
                node {
                  id
                  title
                  images(first: 1) {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                  variants(first: 100) {
                    edges {
                      node {
                        id
                        title
                        price{
                          amount
                          currencyCode
                        }
                        image{
                            url
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;

    const headers = {
      "X-Shopify-Storefront-Access-Token": accessToken,
      "Content-Type": "application/json",
    };

    const variables = {
      pageSize,
      afterCursor,
      searchQuery,
    };
    let loader = document.getElementById("revlytic-overlay");
    loader.style.display = "flex";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }), // Pass variables along with the query
    });

    const data = await response.json();
    loader.style.display = "none";
    return data.data.products;
  };

  const getStoreToken = async () => {
    let loader = document.getElementById("revlytic-overlay");
    loader.style.display = "flex";
    fetch(`${apiPath}api/customerPortal/getStoreToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shop,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        loader.style.display = "none";
        console.log(data.data[0].accessToken);

        accessToken = data.data[0].accessToken;
      });
  };

  const processProducts = (products) => {
    const productList = document.getElementById("product-list");

    products.edges.forEach((product) => {
      // console.log(product,"productssss")
      const productNode = product.node;
      const image = productNode.images.edges[0]?.node;

      const li = document.createElement("div");
      li.classList.add("product-item");
      li.innerHTML = `
          <div class="product-checkbox">
          <input type="checkbox" class="product-checkbox-input" data-productid=${
            productNode.id
          } >
      </div>
              <div class="product-image">
                <img src="${
                  image?.url
                    ? image?.url
                    : "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/dummyproduct.jpg?v=1695377068"
                }" height="100" alt="${productNode.title}">
              </div>
              <div class="product-details">
                <h3 class="product-title">${productNode.title}</h3>
              </div>
            `;
      productList.appendChild(li);

      // Iterate through variants and display each variant's image and title
      productNode.variants.edges.forEach((variantEdge, Vindex) => {
        // console.log(variantEdge,"variantEdge")

        // console.log(variantEdge, "laklskdfj");
        const variant = variantEdge.node;
        const variantImage = variant.image?.url;
        const variantTitle = variant.title;

        const variantLi = document.createElement("div");
        variantLi.classList.add("variant-item");
        variantLi.innerHTML = `
              <div class="variant-checkbox">
              <input type="checkbox" class="variant-checkbox-input" data-productid=${
                productNode.id
              } data-variantid=${variant.id}>
          </div>
                  <div class="variant-image">
                    <img src="${
                      variantImage
                        ? variantImage
                        : "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/dummyproduct.jpg?v=1695377068"
                    }" height="100" alt="${variantTitle}">
                  </div>
                  <div class="variant-details">
                    <p class="variant-title">${variantTitle}</p>
                  </div>
                `;
        {
          !(variantTitle == "Default Title" && Vindex == 0) &&
            productList.appendChild(variantLi);
        }
      });
    });
    handleCheckboxChanges();
  };

  const fetchAndProcessProducts = async (searchQuery) => {
    console.log(searchQuery);
    const products = await fetchShopifyProducts(
      storeUrl,
      accessToken,
      pageSize,
      startCursor,
      searchQuery
    );

    console.log("entresssssssssss", products);
    const nodesArray = products.edges.map((item) => item.node);
    console.log(nodesArray, "18octtest1");
    // Merge loadProducts with nodesArray
    loadProducts = [...loadProducts, ...nodesArray];

    processProducts(products);
    // console.log(products.pageInfo.hasNextPage, "afdkl");
    if (!products.pageInfo.hasNextPage) {
      next = false;
    } else {
      startCursor = products.pageInfo.endCursor;
    }
  };

  const handleScroll = (e) => {
    console.log("asfhkjshjksfhjkafhjkhdkjs");
    // const productList = document.getElementById("product-list");
    const bottom =
      e.target.scrollHeight - e.target.scrollTop == e.target.clientHeight;

    console.log("next", e.target.scrollHeight - parseInt(e.target.scrollTop));
    // console.log("next1",e.target.scrollTop)
    console.log("next2", e.target.clientHeight);

    if (next && bottom) {
      console.log("dffsdf");
      fetchAndProcessProducts(searchQuery);
    }
    // if (
    //   productList.scrollHeight - productList.scrollTop ===
    //   productList.clientHeight
    // ) {

    // }
  };

  const handleCheckboxChanges = () => {
    ////////////////////////////product check listner
    const productCheckbox = document.querySelectorAll(
      ".product-checkbox-input"
    );
    // console.log(productCheckbox,"askjhdjk")
    productCheckbox.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const productId = checkbox.getAttribute("data-productid");
        if (checkbox.checked) {
          const elementsWithDataProductId = document.querySelectorAll(
            `.variant-checkbox-input[data-productid="${productId}"]`
          );
          elementsWithDataProductId.forEach((checkbox) => {
            checkbox.checked = true;
          });
          let mainItem = loadProducts.filter((item) => item.id == productId);
          mainItem[0].variants.edges.map((item, index) => {
            let obj = {
              hasOnlyDefaultVariant:
                index == 0 && item?.node.title == "Default Title"
                  ? true
                  : false,
              id: item?.node.id,
              image: item?.node?.image?.url ? item?.node?.image?.url : "",
              price: item?.node?.price?.amount,
              product_id: productId,
              product_image:
                mainItem[0].images.edges.length > 0
                  ? mainItem[0].images.edges[0].node.url
                  : "",
              product_name: mainItem[0].title,
              quantity: 1,
              title: item.node.title,
            };

            selectedIds.push(obj);
          });

          console.log(selectedIds, "main");
        } else {
          const elementsWithDataProductId = document.querySelectorAll(
            `.variant-checkbox-input[data-productid="${productId}"]`
          );
          elementsWithDataProductId.forEach((checkbox) => {
            checkbox.checked = false;
          });
          let newArr = selectedIds.filter(
            (item) => item.product_id != productId
          );

          selectedIds = newArr;
          console.log(selectedIds, "kk");
        }
      });
    });

    ///////////////////////////////variant check listner
    const VariantCheckbox = document.querySelectorAll(
      ".variant-checkbox-input"
    );
    VariantCheckbox.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const productId = checkbox.getAttribute("data-productid");
        const variantId = checkbox.getAttribute("data-variantid");

        if (checkbox.checked) {
          let mainItem = loadProducts.filter((item) => item.id == productId);
          mainItem[0].variants.edges.map((item, index) => {
            if (item?.node.id == variantId) {
              let obj = {
                hasOnlyDefaultVariant:
                  index == 0 && item?.node.title == "Default Title"
                    ? true
                    : false,
                id: item?.node.id,
                image: item?.node?.image?.url ? item?.node?.image?.url : "",
                price: item?.node?.price?.amount,
                product_id: productId,
                product_image:
                  mainItem[0].images.edges.length > 0
                    ? mainItem[0].images.edges[0].node.url
                    : "",
                product_name: mainItem[0].title,
                quantity: 1,
                title: item.node.title,
              };

              selectedIds.push(obj);
            }
          });

          console.log(selectedIds, "mainvvv");
        } else {
          const elementsWithDataProductId = document.querySelector(
            `.variant-checkbox-input[data-variantid="${variantId}"]`
          );
          elementsWithDataProductId.checked = false;
          let newArr = selectedIds.filter((item) => item.id != variantId);

          selectedIds = newArr;
          console.log(selectedIds, "kkv");
        }
      });
    });
  };
  const dateChange = (type, originalDate, value) => {
    // console.log("datechange", type, originalDate);

    if (type.toLowerCase() === "day") {
      let nextDate = new Date(originalDate);
      nextDate.setDate(nextDate.getDate() + 1 * parseInt(value));

      return nextDate;
    } else if (type.toLowerCase() === "month") {
      let nextDate = new Date(originalDate);
      nextDate.setMonth(nextDate.getMonth() + 1 * parseInt(value));
      // console.log("typedtaechekcc", typeof nextDate);
      return nextDate;
    } else if (type.toLowerCase() === "week") {
      let nextDate = new Date(originalDate);
      nextDate.setDate(nextDate.getDate() + 7 * parseInt(value));
      return nextDate;
    } else if (type.toLowerCase() === "year") {
      let nextDate = new Date(originalDate);
      nextDate.setFullYear(nextDate.getFullYear() + 1 * parseInt(value));
      console.log(nextDate, "this is check");
      return nextDate;
    }
  };
  const subscriptionDetails = (subscriptions) => {
    let data = subscriptions?.data?.filter(
      (details) =>
        details.subscription_id ==
        `gid://shopify/SubscriptionContract/${param1}`
    );
    function formatDate(isoDate) {
      var date = new Date(isoDate);
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
      var day = date.getDate().toString().padStart(2, "0");
      var formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    }

    console.log(data, "fdjs");
    const mainDetails = data[0];
    currencyCode = getSymbol(data[0]?.subscription_details?.currency);
    let cancelReasonModal;
    if (permissions.cancellation == "simple") {
      cancelReasonModal = `<div id="cancelModal" class="rev-cancel-reason-modal">
<div class="modal-content">
    <span class="close" id="cancelModalCloseBtn">&times;</span>
    <h2 class="modal-title">Cancel Subscription</h2>
    <p class="modal-text">Please Provide Reason for Cancellation</p>
    <div>
    <textarea id=rev-cancel-reason-select placeholder="Could you please tell us why?"></textarea>
    </div>
    <button class="modal-btn" id="rev-reason-confirmCancelBtn">Yes, Cancel</button>
    <button class="modal-btn" id="rev-reason-cancelCancelBtn">No, Keep Subscription</button>
</div>
</div>`;
    } else {
      cancelReasonModal = `<div id="cancelModal" class="rev-cancel-reason-modal">
      <div class="modal-content">
          <span class="close" id="cancelModalCloseBtn">&times;</span>
          <h2 class="modal-title">Cancel Subscription</h2>
          <p class="modal-text">Please Select Reason for Cancellation</p>
          <div>

          <select id="rev-cancel-reason-select" placeholder="Select Cancellation Reason">
        
          <option value="${permissions?.options.one}">${permissions?.options.one}</option>
          <option value="${permissions?.options.two}">${permissions?.options.two}</option>
          <option value="${permissions?.options.three}">${permissions?.options.three}</option>
          <option value="${permissions?.options.four}">${permissions?.options.four}</option>

        </select>
        </div>

          <button class="modal-btn" id="rev-reason-confirmCancelBtn">Yes, Cancel</button>
          <button class="modal-btn" id="rev-reason-cancelCancelBtn">No, Keep Subscription</button>
      </div>
      </div>`;
    }

    var attemptedOrders;
    var upcomingOrders;
    function dateConversion(date) {
      const dateString = date;

      const dateObj = new Date(dateString);

      const formattedDate = dateObj.toLocaleDateString("en-US", {
        year: "numeric",

        month: "long",

        day: "numeric",
      });

      // console.log(formattedDate);

      return formattedDate;
    }
    function convertUTCToTimeZone(utcDateTime, timeZone) {
      const utcDate = new Date(utcDateTime);
      const options = {
        timeZone,
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const localDate = utcDate.toLocaleString("en-US", options);
      return localDate;
    }
    function fetchDataUpcomingOrders() {
      if (mainDetails.subscription_details.planType == "payAsYouGo") {
        let loader = document.getElementById("revlytic-overlay");
        loader.style.display = "flex";

        fetch(`${apiPath}api/customerPortal/getOrdersDataUpcoming`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shop: shop,
            contract_id: `gid://shopify/SubscriptionContract/${param1}`,
          }),
        })
          .then((response) => response.json())
          .then((ordersDataUpcoming) => {
            console.log(ordersDataUpcoming, "upcommiinggg");
            loader.style.display = "none";
            // let newArray = [...ordersDataUpcoming?.data];
            console.log(ordersDataUpcoming?.data, "newArray");
            let arr = [...ordersDataUpcoming?.data];

            let filterPastOrders = arr.filter(
              (item) => item.status == "success" || item.status == "initial"
            );
            console.log(filterPastOrders, "passsssstt");

            let filterSkippedOrders = arr.filter(
              (item) => item.status == "skipped"
            );

            // setAttemptedOrders(arr);
            let successCount = arr.filter(
              (item) => item.status == "success" || item.status == "initial"
            ).length;
            console.log(successCount);
            // let today=2
            let newArray = arr.filter(
              (item) =>
                item.status != "success" &&
                item.status != "initial" &&
                item.status != "skipped" &&
                item.status != "retriedAfterFailure" &&
                new Date(item.renewal_date) > new Date()
            );

            // let nextbilling=data?.nextBillingDate;
            // let billingMaxValue=4;
            console.log("in half", newArray);
            if (
              mainDetails?.subscription_details?.billingMaxValue &&
              mainDetails?.subscription_details?.billingMaxValue != undefined &&
              mainDetails?.subscription_details?.billingMaxValue != null
            ) {
              if (
                parseInt(mainDetails.subscription_details.billingMaxValue) <=
                successCount
              ) {
                console.log("hi");
              } else {
                console.log("no maxxxxxxxx");
                let nextDate;
                let type =
                  mainDetails?.subscription_details?.delivery_billingType;
                let value =
                  mainDetails.subscription_details.planType == "payAsYouGo"
                    ? mainDetails?.subscription_details?.billingLength
                    : mainDetails?.subscription_details?.delivery_billingValue;

                let originalDate = mainDetails?.nextBillingDate;

                while (
                  newArray.length <
                  parseInt(mainDetails?.subscription_details?.billingMaxValue) -
                    successCount
                ) {
                  let existAlready = arr.find(
                    (item) =>
                      new Date(item.renewal_date).getTime() ===
                      new Date(originalDate).getTime()
                  );
                  if (existAlready) {
                  } else {
                    newArray.push({
                      renewal_date: originalDate,
                      status: "upcoming",
                    });
                  }
                  let nextDate = dateChange(type, originalDate, value);
                  originalDate = nextDate.toISOString();
                }

                newArray.sort(
                  (a, b) => new Date(a.renewal_date) - new Date(b.renewal_date)
                );
              }
            } else {
              if (newArray.length >= 5) {
                console.log("hello");
              } else {
                let nextDate;
                let type =
                  mainDetails?.subscription_details?.delivery_billingType;
                let value =
                  mainDetails.subscription_details.planType == "payAsYouGo"
                    ? mainDetails?.subscription_details?.billingLength
                    : mainDetails?.subscription_details?.delivery_billingValue;
                // let originalDate = data2[0]?.renewal_date;
                let originalDate = mainDetails?.nextBillingDate;
                console.log(originalDate, "before");

                while (newArray.length < 5) {
                  let existAlready = arr.find(
                    (item) =>
                      new Date(item.renewal_date).getTime() ===
                      new Date(originalDate).getTime()
                  );
                  if (existAlready) {
                  } else {
                    newArray.push({
                      renewal_date: originalDate,
                      status: "upcoming",
                    });
                  }
                  let nextDate = dateChange(type, originalDate, value);
                  originalDate = nextDate.toISOString();
                }

                newArray.sort(
                  (a, b) => new Date(a.renewal_date) - new Date(b.renewal_date)
                );
              }
            }
            console.log("end", newArray);
            function getStatusSVG(status) {
              let color = "";
              switch (status) {
                case "initial":
                  color = "#3EBE62";
                  break;
                case "pending":
                  color = "#F39C44";
                  break;
                case "upcoming":
                  color = "#00a49c";
                  break;
                case "skipped":
                  color = "#2b90ae";
                  break;
                default:
                  color = "#FF0000";
                  break;
              }

              return `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                <circle cx="3.85848" cy="3.88357" r="3.74715" fill="${color}" />
              </svg>`;
            }
            let upcomingHtml = newArray.map((item) => {
              let svg = getStatusSVG(item.status);
              let buttons =
                item.status == "upcoming"
                  ? `<div class="order-now-and-skip">
                  ${
                    permissions.values.attemptBilling
                      ? `<button
                  class="order-button"
                  data-renewal-date="${item.renewal_date}"
                >
                  Order Now
                </button>`
                      : ""
                  }
                ${
                  permissions.values.skipOrder
                    ? `<button
                  class="skip-button"
                  data-renewal-date="${item.renewal_date}"
                >
                  Skip Order
              </button>`
                    : ""
                }
                  </div>`
                  : item.status == "failed"
                  ? ` <div class="order-now-and-skip">
                    <button
                      class="retry-button"
                      data-renewal-date="${item.renewal_date}"
                    >
                      Retry
                    </button>
                  </div>`
                  : ` <div class="order-now-and-skip">
</div>`;

              return ` <div class="order-conformation-inner">
              <div class="order-date">
                  <h5>${dateConversion(item?.renewal_date)}</h5>
              </div>
              <div class="order-status">
                  <h5>
                      ${svg}
                      ${
                        item.status == "upcoming"
                          ? "Queued"
                          : item.status == "pending"
                          ? "Pending"
                          : item.status == "failed"
                          ? "Failed"
                          : ""
                      }
                  </h5>
              </div>
              
                  ${buttons}
          </div>`;
            });
            let skipHtml = filterSkippedOrders.map((item) => {
              return ` <div class="order-conformation-inner">
              <div class="order-date">
                  <h5>${dateConversion(item?.renewal_date)}</h5>
              </div>

          </div>`;
            });
            let pastHtml = filterPastOrders.map((item) => {
              return ` <div class="order-conformation-inner">
              <div class="order-date">
                  <h5>${dateConversion(item?.renewal_date)}</h5>
              </div>
              <div class="order-status">
                  <h5>
${item?.order_no}
                  </h5>
              </div>

          </div>`;
            });
            //////upcomingg

            if (mainDetails.status.toLowerCase() == "active") {
              const upcomingOrdersMain = document.querySelector(
                ".revlytic.upcoming-order-container"
              );
              const upcomingOrdersContainer = document.createElement("div");
              upcomingOrdersContainer.classList.add(
                "revlytic-orders-container"
              );
              upcomingOrdersContainer.innerHTML = upcomingHtml.join("");
              upcomingOrdersMain.parentNode.insertBefore(
                upcomingOrdersContainer,
                upcomingOrdersMain.nextSibling
              );
            }
            /////////////past
            const skipOrdersMain = document.querySelector(
              ".revlytic.skip-order-container"
            );
            console.log(skipHtml, "fhsgdfghsdfhsdfsdhf");
            const skipOrdersContainer = document.createElement("div");
            skipOrdersContainer.classList.add("revlytic-orders-container");
            skipOrdersContainer.innerHTML = skipHtml.join("");
            skipOrdersMain.parentNode.insertBefore(
              skipOrdersContainer,
              skipOrdersMain.nextSibling
            );
            /////////skippp
            const pastOrderMain = document.querySelector(
              ".revlytic.past-order-container"
            );
            const pastOrderContainer = document.createElement("div");
            pastOrderContainer.classList.add("revlytic-orders-container");
            pastOrderContainer.innerHTML = pastHtml.join("");
            pastOrderMain.parentNode.insertBefore(
              pastOrderContainer,
              pastOrderMain.nextSibling
            );
            ////////////////////ordr now and skip listners

            const orderButtons = document.querySelectorAll(".order-button");
            const skipButtons = document.querySelectorAll(".skip-button");
            const retryButtons = document.querySelectorAll(".retry-button");

            if (
              permissions.values.attemptBilling &&
              mainDetails.status.toLowerCase() != "cancelled"
            ) {
              orderButtons.length > 0 &&
                orderButtons.forEach((button) => {
                  button.addEventListener("click", () => {
                    const renewal_date =
                      button.getAttribute("data-renewal-date");
                    // Call your function with the renewalDate value here
                    console.log(
                      `Order Now clicked for renewal date: ${renewal_date}`
                    );

                    if (
                      new Date(mainDetails?.nextBillingDate).getTime() ===
                      new Date(renewal_date).getTime()
                    ) {
                      console.log("mohalitowerrr");
                      let nextDate;
                      let value =
                        mainDetails.subscription_details.planType ==
                        "payAsYouGo"
                          ? mainDetails.subscription_details.billingLength
                          : mainDetails.subscription_details
                              .delivery_billingValue;
                      let type =
                        mainDetails.subscription_details.delivery_billingType;

                      // console.log(value,data?.nextBillingDate,type)

                      nextDate = dateChange(
                        type,
                        mainDetails?.nextBillingDate,
                        value
                      ).toISOString();
                      console.log("early", nextDate);
                      console.log("attemptedOrders", arr);

                      // console.log("existingAlready",existingAlready)
                      let flag = false;
                      while (flag == false) {
                        console.log("in  while", nextDate);
                        let existingAlready = arr.find(
                          (item) =>
                            new Date(item.renewal_date).getTime() ===
                            new Date(nextDate).getTime()
                        );

                        if (!existingAlready) {
                          flag = true;
                        } else {
                          nextDate = dateChange(
                            type,
                            nextDate,
                            value
                          ).toISOString();
                        } // console.log("nexttdate",nextDate,q=q+1)
                      }

                      console.log("hmmmkkkkk", nextDate);
                      let loader = document.getElementById("revlytic-overlay");
                      loader.style.display = "flex";

                      fetch(`${apiPath}api/customerPortal/orderNow`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          shop: shop,
                          data: mainDetails,
                          renewal_date: renewal_date,
                          nextBillingDate: nextDate,
                        }),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          loader.style.display = "none";
                          if (data.message == "success") {
                            console.log(data);
                            getDataFromDb();
                            showToast(
                              "Your order was successfully submitted",
                              3000
                            );
                          } else {
                            showToast(data?.data, 3000);
                          }
                        })
                        .catch((error) => {
                          showToast("Something went wrong", 3000);
                          loader.style.display = "none";
                          console.log(`Error  ${JSON.stringify(error)}`);
                        });
                      // let response = await postApi("/api/admin/orderNow", bodyData, app);

                      // if (response?.data?.message == "success") {
                      //   fetchDataUpcomingOrders({ ...mainDetails, nextBillingDate: nextDate });
                      //   setExistingSubscription({ ...mainDetails, nextBillingDate: nextDate });
                      //   setNextBillingDate(nextDate);
                      // }
                    } else {
                      let loader = document.getElementById("revlytic-overlay");
                      loader.style.display = "flex";

                      fetch(`${apiPath}api/customerPortal/orderNow`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          shop: shop,
                          data: mainDetails,
                          renewal_date: renewal_date,
                        }),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          loader.style.display = "none";
                          if (data.message == "success") {
                            console.log(data);
                            getDataFromDb();
                            showToast(
                              "Your order was successfully submitted",
                              3000
                            );
                          } else {
                            showToast(data?.data, 3000);
                          }
                        })
                        .catch((error) => {
                          showToast("Something went wrong", 3000);
                          loader.style.display = "none";
                          console.log(`Error  ${JSON.stringify(error)}`);
                        });
                      // console.log("in elseee");
                      // let bodyData = { data: mainDetails, renewal_date: renewal_date };
                      // let response = await postApi("/api/admin/orderNow", bodyData, app);
                      // if (response?.data?.message == "success") {
                      //   fetchDataUpcomingOrders(mainDetails);
                      // }
                    }
                  });
                });
            }

            if (
              permissions.values.skipOrder &&
              mainDetails.status.toLowerCase() != "cancelled"
            ) {
              skipButtons.length > 0 &&
                skipButtons.forEach((button) => {
                  button.addEventListener("click", () => {
                    const renewal_date =
                      button.getAttribute("data-renewal-date");
                    // Call your function with the renewalDate value here
                    console.log(
                      `Skip Order clicked for renewal date: ${renewal_date}`
                    );

                    if (
                      new Date(mainDetails?.nextBillingDate).getTime() ===
                      new Date(renewal_date).getTime()
                    ) {
                      console.log("mohalitowerrr");
                      let nextDate;
                      let value =
                        mainDetails.subscription_details.planType ==
                        "payAsYouGo"
                          ? mainDetails.subscription_details.billingLength
                          : mainDetails.subscription_details
                              .delivery_billingValue;
                      let type =
                        mainDetails.subscription_details.delivery_billingType;

                      // console.log(value,mainDetails?.nextBillingDate,type)

                      nextDate = dateChange(
                        type,
                        mainDetails?.nextBillingDate,
                        value
                      ).toISOString();
                      console.log("early", nextDate);
                      let existingAlready = arr.find(
                        (item) =>
                          new Date(item.renewal_date).getTime() ===
                          new Date(nextDate).getTime()
                      );
                      console.log("existingAlready", existingAlready);

                      ////////////////////////////
                      let flag = false;
                      while (flag == false) {
                        console.log("in  while", nextDate);
                        let existingAlready = arr.find(
                          (item) =>
                            new Date(item.renewal_date).getTime() ===
                            new Date(nextDate).getTime()
                        );

                        if (!existingAlready) {
                          flag = true;
                        } else {
                          nextDate = dateChange(
                            type,
                            nextDate,
                            value
                          ).toISOString();
                        } // console.log("nexttdate",nextDate,q=q+1)
                      }

                      console.log("hmmmkkkkk", nextDate);
                      let loader = document.getElementById("revlytic-overlay");
                      loader.style.display = "flex";

                      fetch(`${apiPath}api/customerPortal/skipOrder`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          shop: shop,
                          data: mainDetails,
                          renewal_date: renewal_date,
                          nextBillingDate: nextDate,
                        }),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          loader.style.display = "none";
                          if (data.message == "success") {
                            console.log(data);
                            getDataFromDb();
                            showToast(
                              "Your order was successfully skipped",
                              3000
                            );
                          } else {
                            showToast(data?.data, 3000);
                          }
                        })
                        .catch((error) => {
                          showToast("Something went wrong", 3000);
                          loader.style.display = "none";
                          console.log(`Error  ${JSON.stringify(error)}`);
                        });
                    } else {
                      let loader = document.getElementById("revlytic-overlay");
                      loader.style.display = "flex";

                      fetch(`${apiPath}api/customerPortal/skipOrder`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          shop: shop,
                          data: mainDetails,
                          renewal_date: renewal_date,
                        }),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          loader.style.display = "none";
                          if (data.message == "success") {
                            console.log(data);
                            getDataFromDb();
                            showToast(
                              "Your order was successfully skipped",
                              3000
                            );
                          } else {
                            showToast(data?.data, 3000);
                          }
                        })
                        .catch((error) => {
                          showToast("Something went wrong", 3000);
                          loader.style.display = "none";
                          console.log(`Error  ${JSON.stringify(error)}`);
                        });
                    }
                  });
                });
            }
            retryButtons.length > 0 &&
              retryButtons.forEach((button) => {
                button.addEventListener("click", () => {
                  const renewal_date = button.getAttribute("data-renewal-date");
                  let loader = document.getElementById("revlytic-overlay");
                  loader.style.display = "flex";

                  fetch(`${apiPath}api/customerPortal/retryFailedOrder`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      shop: shop,
                      renewal_date: renewal_date,
                      product_details: mainDetails?.product_details,
                      subscription_id: mainDetails.subscription_id,
                    }),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      loader.style.display = "none";
                      if (data.message == "success") {
                        console.log(data);
                        getDataFromDb();
                        showToast(
                          "Your order was successfully submitted",
                          3000
                        );
                      } else {
                        showToast(data?.data, 3000);
                      }
                    })
                    .catch((error) => {
                      showToast("Something went wrong", 3000);
                      loader.style.display = "none";
                      console.log(`Error  ${JSON.stringify(error)}`);
                    });
                });

                // setUpcomingOrders(newArray);
              });
          });
      } else {
        let loader = document.getElementById("revlytic-overlay");
        loader.style.display = "flex";

        fetch(`${apiPath}api/customerPortal/upcomingFulfillment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shop: shop,
            id: mainDetails?.subscription_id,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            loader.style.display = "none";
            if (data.message == "success") {
              console.log(data);
              let fullfillmentDataMain = data?.data;

              /////////////////////////////upcoming data structuring

              if (
                fullfillmentDataMain?.fulfillmentIdAndLineItemsData?.length > 0
              ) {
                console.log("length>000");

                let result = {};
                fullfillmentDataMain?.contractIdAndLineItemsData.forEach(
                  (item, index) => {
                    let id = item?.node?.contract?.id?.split("/").at(-1);
                    if (!result[id]) {
                      result[id] = [item?.node?.id?.split("/").at(-1)];
                    } else {
                      result[id].push(item?.node?.id?.split("/").at(-1));
                    }
                  }
                );
                console.log("resulttt", result);

                let contractLineItems =
                  result[mainDetails["subscription_id"].split("/").at(-1)];

                console.log("contractLineItems", contractLineItems);

                let upcoming = [];
                let completed = [];
                let active = [];

                fullfillmentDataMain?.fulfillmentIdAndLineItemsData?.forEach(
                  (item) => {
                    let arr = [];
                    item?.line_items.forEach((line) => {
                      arr.push(line?.line_item_id);
                    });
                    let id = item?.id;
                    let obj = {
                      [id]: {
                        lineItems: arr,
                        fulfill_at: item?.fulfill_at,
                        status: item.status,
                        order_id: item.order_id,
                      },
                    };
                    if (item.status == "scheduled") {
                      upcoming.push(obj);
                    } else if (item.status == "open") {
                      active.push(obj);
                    } else if (item.status == "closed") {
                      completed.push(obj);
                    }
                  }
                );
                console.log(
                  upcoming,
                  active,
                  completed,
                  "sdkjasjdkhjhkjhjkhjk"
                );
                if (upcoming.length > 0) {
                  let filtered = upcoming.filter((item) =>
                    Object.values(item)[0].lineItems.some((lineItem) =>
                      contractLineItems.includes(String(lineItem))
                    )
                  );
                  // console.log(filtered.sort((a, b) => new Date(a.fulfill_at) - new Date(b.fulfill_at)));
                  console.log(
                    filtered.sort((obj1, obj2) => {
                      const date1 = new Date(Object.values(obj1)[0].fulfill_at);
                      const date2 = new Date(Object.values(obj2)[0].fulfill_at);
                      console.log("sddfdf", Object.values(obj2));
                      return date1 - date2;
                    })
                  );
                  console.log("filterd", filtered);
                  let upcomingHtml = ``; // Initialize an array to store the generated HTML elements

                  if (filtered?.length > 0) {
                    upcomingHtml = filtered.map((item, index) => {
                      if (Object.values(item)[0].status === "scheduled") {
                        return ` <div class="order-conformation-inner">
                        <div class="order-date">
                            <h5>${dateConversion(
                              Object.values(item)[0].fulfill_at
                            )}</h5>
                        </div>
                        <div class="order-status">
                        <h5><a
                        target="_blank"
                        href="https://admin.shopify.com/store/${
                          shop?.split(".myshopify.com")[0]
                        }/orders/${Object.values(item)[0]?.order_id}"
                        
                      >
                      ${fullfillmentDataMain?.orderNumber}
                      </a></h5>
                        </div>
                        
                        <div class="order-now-and-skip">
                       <button
                              class="reschedule-button"
                              data-id= ${Object.keys(item)[0]}
                              data-date=${Object.values(item)[0].fulfill_at}
                              
                            >
                              Reschedule
                            </button>
                            ${
                              permissions.values.skipUpcomingFullfilment
                                ? `<button
                            class="skip-fullfill-button"
                            data-id= ${Object.keys(item)[0]}
                            data-date=${Object.values(item)[0].fulfill_at}
                          >
                            Postpone
                          </button>`
                                : ""
                            }
                      </div>
                    </div>`;

                        // Push the HTML element into the array
                      }
                    });
                    if (
                      mainDetails.subscription_details.planType == "prepaid"
                    ) {
                      const upcomingOrdersMain = document.querySelector(
                        ".revlytic.upcoming-order-container"
                      );
                      const upcomingOrdersContainer =
                        document.createElement("div");
                      upcomingOrdersContainer.innerHTML = upcomingHtml.join("");
                      upcomingOrdersMain.parentNode.insertBefore(
                        upcomingOrdersContainer,
                        upcomingOrdersMain.nextSibling
                      );
                    }
                  }
                  // setUpcomingFulfillments(filtered)
                }
                if (completed.length > 0) {
                  let filtered = completed.filter((item) =>
                    Object.values(item)[0].lineItems.some((lineItem) =>
                      contractLineItems.includes(String(lineItem))
                    )
                  );
                  // console.log(filtered.sort((a, b) => new Date(a.fulfill_at) - new Date(b.fulfill_at)));
                  console.log(
                    filtered.sort((obj1, obj2) => {
                      const date1 = new Date(Object.values(obj1)[0].fulfill_at);
                      const date2 = new Date(Object.values(obj2)[0].fulfill_at);
                      console.log("sddfdf", Object.values(obj2));
                      return date1 - date2;
                    })
                  );
                  console.log("filterd", filtered);
                  // setCompletedFulfillments(filtered)
                  let completedHtml = ``;
                  if (filtered?.length > 0) {
                    completedHtml = filtered?.map((item, index) => {
                      return (
                        Object.values(item)[0].status == "closed" &&
                        `<div class="order-conformation-inner" key={index}>
                            <div class="order-date">
                                   <h5>${dateConversion(
                                     Object.values(item)[0].fulfill_at,
                                     timezone
                                   )}</h5>
                            </div>
                            <div class="order-status">
                            <h5><a
                            target="_blank"
                            href="https://admin.shopify.com/store/${
                              shop?.split(".myshopify.com")[0]
                            }/orders/${Object.values(item)[0]?.order_id}"
                            
                          >
                          ${fullfillmentDataMain?.orderNumber}
                          </a></h5>
                            </div>
                         </div>`
                      );
                    });
                    const skipOrdersMain = document.querySelector(
                      ".revlytic.skip-order-container"
                    );
                    const skipOrdersContainer = document.createElement("div");
                    skipOrdersContainer.innerHTML = completedHtml.join("");
                    skipOrdersMain.parentNode.insertBefore(
                      skipOrdersContainer,
                      skipOrdersMain.nextSibling
                    );
                  }
                }

                if (active.length > 0) {
                  let filtered = active.filter((item) =>
                    Object.values(item)[0].lineItems.some((lineItem) =>
                      contractLineItems.includes(String(lineItem))
                    )
                  );
                  // console.log(filtered.sort((a, b) => new Date(a.fulfill_at) - new Date(b.fulfill_at)));
                  console.log(
                    filtered.sort((obj1, obj2) => {
                      const date1 = new Date(Object.values(obj1)[0].fulfill_at);
                      const date2 = new Date(Object.values(obj2)[0].fulfill_at);
                      console.log("sddfdf", Object.values(obj2));
                      return date1 - date2;
                    })
                  );
                  console.log("filterd", filtered);
                  // setActiveFulfillments(filtered)
                  let activeHtml = ``; // Initialize an array to store the generated HTML elements

                  if (filtered?.length > 0) {
                    activeHtml = filtered?.map((item, index) => {
                      return (
                        Object.values(item)[0].status == "open" &&
                        `<div class="order-conformation-inner" key={index}>
                            <div class="order-date">
                                 <h5>${dateConversion(
                                   Object.values(item)[0].fulfill_at,
                                   timezone
                                 )}</h5>
                            </div>
                            <div class="order-status">
                            <h5><a
                            target="_blank"
                            href="https://admin.shopify.com/store/${
                              shop?.split(".myshopify.com")[0]
                            }/orders/${Object.values(item)[0]?.order_id}"
                            
                          >
                          ${fullfillmentDataMain?.orderNumber}
                          </a></h5>
                            </div>
                         </div>`
                      );
                    });
                    const pastOrderMain = document.querySelector(
                      ".revlytic.past-order-container"
                    );
                    const pastOrderContainer = document.createElement("div");
                    pastOrderContainer.innerHTML = activeHtml.join("");
                    pastOrderMain.parentNode.insertBefore(
                      pastOrderContainer,
                      pastOrderMain.nextSibling
                    );
                  }
                }
              }
              // Event listener for the "Reschedule" button
              const rescheduleButtons =
                document.querySelectorAll(".reschedule-button");

              rescheduleButtons.length > 0 &&
                rescheduleButtons.forEach((button) => {
                  button.addEventListener("click", () => {
                    openRescheduleModal();
                    const id = button.getAttribute("data-id");
                    const date = button.getAttribute("data-date");
                    console.log(id, date, "doneeeee");
                    rescheduleDate = date;
                    rescheduleId = id;

                    function formatDateForInput(dateString) {
                      const dateObj = new Date(dateString);
                      const year = dateObj.getFullYear();
                      const month = (dateObj.getMonth() + 1)
                        .toString()
                        .padStart(2, "0"); // Adding 1 because January is 0
                      const day = dateObj.getDate().toString().padStart(2, "0");
                      return `${year}-${month}-${day}`;
                    }

                    const providedDate = dateConversion(date); // This is the date you want to set
                    const formattedDate = formatDateForInput(providedDate);
                    document.getElementById("reschedule-datepicker").value =
                      formattedDate;

                    // const parts = date.split("T"); // Split the date and time
                    // const datePart = parts[0]; // Get the date part "2023-10-25"
                    // document.getElementById("reschedule-datepicker").value =
                    //   datePart;
                    const today = new Date();

                    // Calculate tomorrow's date by adding one day to the current date
                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);

                    // Convert tomorrow's date to ISO format
                    const tomorrowISO = tomorrow.toISOString().split("T")[0];
                    document.getElementById("reschedule-datepicker").min =
                      tomorrowISO;
                  });
                });
              const skipButtons = document.querySelectorAll(
                ".skip-fullfill-button"
              );

              if (
                permissions.values.skipUpcomingFullfilment &&
                mainDetails.status.toLowerCase() != "cancelled"
              ) {
                skipButtons.length > 0 &&
                  skipButtons.forEach((button) => {
                    button.addEventListener("click", () => {
                      openRescheduleModal();
                      const id = button.getAttribute("data-id");
                      const date = button.getAttribute("data-date");
                      console.log(id, date, "doneeeee");
                      rescheduleDate = date;
                      rescheduleId = id;
                      let nextBillingDate = dateChange(
                        mainDetails.subscription_details.delivery_billingType,
                        mainDetails?.nextBillingDate,
                        mainDetails?.subscription_details?.delivery_billingValue
                      ).toISOString();
                      let loader = document.getElementById("revlytic-overlay");
                      loader.style.display = "flex";

                      fetch(
                        `${apiPath}api/customerPortal/fulfillmentOrderRescheduleOrSkip`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            shop: shop,
                            fulfill_at: mainDetails?.nextBillingDate,
                            id: id,
                            nextBillingDate: nextBillingDate,
                            subscription_id: mainDetails?.subscription_id,
                          }),
                        }
                      )
                        .then((response) => response.json())
                        .then((data) => {
                          loader.style.display = "none";
                          if (data.message == "success") {
                            console.log(data);
                            getDataFromDb();
                            showToast(
                              "Subscription skipped successfully",
                              3000
                            );
                          } else {
                            showToast(data?.data, 3000);
                          }
                        })
                        .catch((error) => {
                          showToast("Something went wrong", 3000);
                          loader.style.display = "none";
                          console.log(`Error  ${JSON.stringify(error)}`);
                        });
                      closeRescheduleModal();
                    });
                  });
              }
              // Event listener for the modal close button (X)
              document
                .querySelector(".rev-reschedule-close-modal")
                .addEventListener("click", function () {
                  closeRescheduleModal();
                });

              // Event listener for the "Confirm" button inside the modal
              document
                .getElementById("rescheduleConfirm")
                .addEventListener("click", function () {
                  console.log("Selected Date:", rescheduleDate, rescheduleDate);
                  const selectedDate = new Date(rescheduleDate);

                  // Get the current date
                  const currentDate = new Date();
                  if (selectedDate > currentDate) {
                    let loader = document.getElementById("revlytic-overlay");
                    loader.style.display = "flex";

                    fetch(
                      `${apiPath}api/customerPortal/fulfillmentOrderRescheduleOrSkip`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          shop: shop,
                          fulfill_at: rescheduleDate,
                          id: rescheduleId,
                        }),
                      }
                    )
                      .then((response) => response.json())
                      .then((data) => {
                        loader.style.display = "none";
                        if (data.message == "success") {
                          console.log(data);
                          getDataFromDb();
                          showToast(
                            "Subscription rescheduled successfully",
                            3000
                          );
                        } else {
                          showToast(data?.data, 3000);
                        }
                      })
                      .catch((error) => {
                        showToast("Something went wrong", 3000);
                        loader.style.display = "none";
                        console.log(`Error  ${JSON.stringify(error)}`);
                      });
                    closeRescheduleModal();
                  } else {
                    showToast("Reschedule date must be a future date ", 3000);
                  }
                });

              // showToast("successsssssss", 3000);
            } else {
              showToast(data?.data, 3000);
            }
          })
          .catch((error) => {
            showToast("Something went wrong", 3000);
            loader.style.display = "none";
            console.log(`Error`, error);
          });
        loader.style.display = "flex";

        fetch(`${apiPath}api/customerPortal/getOrdersDataUpcoming`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shop: shop,
            contract_id: `gid://shopify/SubscriptionContract/${param1}`,
          }),
        })
          .then((response) => response.json())
          .then((ordersDataUpcoming) => {
            console.log(ordersDataUpcoming, "upcommiinggg");
            loader.style.display = "none";
            // let newArray = [...ordersDataUpcoming?.data];
            console.log(ordersDataUpcoming?.data, "newArray");
            let arr = [...ordersDataUpcoming?.data];

            let filterPastOrders = arr.filter(
              (item) => item.status == "success" || item.status == "initial"
            );
            console.log(filterPastOrders, "passsssstt");
            if (filterPastOrders.length > 0) {
              // let filtered = completed.filter((item) =>
              //   Object.values(item)[0].lineItems.some((lineItem) =>
              //     contractLineItems.includes(String(lineItem))
              //   )
              // );
              // console.log(filtered.sort((a, b) => new Date(a.fulfill_at) - new Date(b.fulfill_at)));
              // console.log(
              //   filtered.sort((obj1, obj2) => {
              //     const date1 = new Date(Object.values(obj1)[0].fulfill_at);
              //     const date2 = new Date(Object.values(obj2)[0].fulfill_at);
              //     console.log("sddfdf", Object.values(obj2));
              //     return date1 - date2;
              //   })
              // );
              // console.log("filterd", filtered);
              // setCompletedFulfillments(filtered)
              let prepaidPastOrdersHtml = ``;
              if (filterPastOrders?.length > 0) {
                prepaidPastOrdersHtml = filterPastOrders?.map((item, index) => {
                  return `<div class="order-conformation-inner" key={index}>
                        <div class="order-date">
                               <h5>${dateConversion(
                                 item.renewal_date,
                                 timezone
                               )}</h5>
                        </div>
                        <div class="order-status">
                        <h5><a
                        target="_blank"
                        href="https://admin.shopify.com/store/${
                          shop?.split(".myshopify.com")[0]
                        }/orders/${item?.order_id?.split("/").at(-1)}"
                        
                      >
                      ${item?.order_no}
                      </a></h5>
                        </div>
                     </div>`;
                });
                const skipOrdersMain = document.querySelector(
                  ".revlytic.prepaid-past-order-container"
                );
                const skipOrdersContainer = document.createElement("div");
                skipOrdersContainer.innerHTML = prepaidPastOrdersHtml.join("");
                skipOrdersMain.parentNode.insertBefore(
                  skipOrdersContainer,
                  skipOrdersMain.nextSibling
                );
              }
            }
          })
          .catch((error) => {
            showToast("Something went wrong", 3000);
            loader.style.display = "none";
            console.log(`Error`, error);
          });
      }
    }

    ///////////////////////////////////skip button fuctionality

    fetchDataUpcomingOrders();
    // Add an event listener to the date input element

    function openRescheduleModal() {
      const modal = document.getElementById("rescheduleModal");
      modal.style.display = "block";
      // $("#datepicker").datepicker(); // Initialize the datepicker
    }

    // Function to close the reschedule modal
    function closeRescheduleModal() {
      const modal = document.getElementById("rescheduleModal");
      modal.style.display = "none";
    }

    let buttons = "";
    if (mainDetails.status.toLowerCase() === "active") {
      if (permissions.values.pauseResumeSubscription) {
        buttons += `<button href="#" class="pause-sub">Pause Subscription </button>`;
      }
      if (
        permissions.values.cancelSubscription &&
        parseInt(mainDetails?.subscription_details?.billingMinValue) <=
          parseInt(totalBillings)
      ) {
        buttons += `<button href="#" class="cancel-sub">Cancel Subscription</button>`;
      }
    } else if (mainDetails.status.toLowerCase() === "paused") {
      if (permissions.values.pauseResumeSubscription) {
        buttons += `<button href="#" class="resume-sub">Resume Subscription </button>`;
      }
      if (
        permissions.values.cancelSubscription &&
        parseInt(mainDetails?.subscription_details?.billingMinValue) <=
          parseInt(totalBillings)
      ) {
        buttons += `<button href="#" class="cancel-sub">Cancel Subscription</button>`;
      }
    } else {
      if (permissions.values.pauseResumeSubscription) {
        buttons += `<button href="#" class="resume-sub">Resume Subscription </button>`;
        buttons += `<button href="#" class="pause-sub">Pause Subscription</button>`;
      }
    }
    const firstName = mainDetails?.customer_details?.firstName || "";
    const lastName = mainDetails?.customer_details?.lastName || "";

    // Function to capitalize the first character of a string
    function capitalizeFirstChar(str) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
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
    let subtotal = 0;
    let allProductsList = mainDetails.product_details.map((item, index) => {
      subtotal =
        Number(subtotal) + Number(item?.price) * Number(item?.quantity);

      return `<tr class="alert" role="alert">
        <td class="d-flex align-items-center">
            <img class="img"
                src=${
                  item?.image
                    ? item?.image
                    : item?.product_image
                    ? item?.product_image
                    : "https://cdn.shopify.com/s/files/1/0753/8068/7139/files/dummyproduct.jpg?v=1695377068"
                }>
            </img>
            <div class="pl-3 email">
              <span>${item.product_name} ${
        item?.title?.toLowerCase() != "default title" && item?.title != null
          ? item?.title
          : ""
      }</span>
            </div>
        </td>
        <td class="price-td" data-price =${item?.price} >${
        currencyCode && currencyCode
      }${parseFloat(item?.price).toFixed(2)}</td>
        <td class="quantity-td">${item?.quantity}</td>
        <td class="quantity-input hidden"><input  type="number" placeholder="Quantity" value=${
          item?.quantity
        } /></td>
        <td class="total-td" >${currencyCode && currencyCode}${parseFloat(
        item?.price * item?.quantity
      )?.toFixed(2)}</td>
        <td class="total-input hidden">${
          currencyCode && currencyCode
        }${parseFloat(item?.price * item?.quantity)?.toFixed(2)}</td>

        <td class="submit-cancel-button hidden"><button  data-line =${
          item.subscriptionLine
        } data-index=${index}>Submit</button> <button>Cancel</button></td>
        <td class= "rev-manage-icon" style="text-align: right; position: relative;right: 10px;">
            <svg class="rev-edit-product-icon"  xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14"
                fill="none">
                <path
                    d="M7.67485 0.735474L1.2479 7.16243L0.984375 10.2932L4.16765 10.0911L10.6004 3.66154L7.67485 0.735474ZM7.03493 3.03152L7.67485 2.39159L8.94294 3.65968L8.30301 4.2996L7.03493 3.03152Z"
                    fill="#12600F" />
                <path d="M0.683594 11.8322H11.3714V13.0036H0.683594V11.8322Z" fill="#12600F" />
            </svg>
            <svg class="rev-delete-icon" data-line =${
              item.subscriptionLine
            } data-index=${index} fill="#12600F" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 width="12px" height="14px" viewBox="0 0 482.428 482.429"
	 xml:space="preserve">
<g>
	<g>
		<path d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098
			c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117
			h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828
			C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879
			C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096
			c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266
			c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979
			V115.744z"/>
		<path d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07
			c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"/>
		<path d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07
			c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"/>
		<path d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07
			c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"/>
	</g>
</g>
</svg>
            </td>
    </tr>
    <td height="1" colspan="5" style="border-bottom: 1px solid rgb(228, 228, 228);"></td>
    `;
    });
    const allProductsHtml = allProductsList.join("");

    const numericId = mainDetails.subscription_id.match(/\d+/)[0];
    let detailsData = `<div class="revlytic-edit-manual-subscription">
    ${loaderData}
      <div class="revlytic-subscription-id">
          <div class="id-content">
              <h4>
                  <a href="https://${shop}/apps/revlytic-subscriptions">
                      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="15" viewBox="0 0 8 15" fill="none">
                          <path
                              d="M0.421912 8.11897C0.174466 7.85791 0.174466 7.42173 0.421912 7.16L6.13135 1.1208C6.38197 0.856382 6.7884 0.856382 7.03839 1.1208C7.289 1.38521 7.289 1.81469 7.03839 2.0791L1.78249 7.63979L7.03902 13.1998C7.28964 13.4649 7.28964 13.8937 7.03902 14.1588C6.7884 14.4232 6.38197 14.4232 6.13198 14.1588L0.421912 8.11897Z"
                              fill="#666666" />
                      </svg>
                  </a>
                  Subscription ID #${numericId}
              </h4>
          </div>
          <div class="dropdown-container">
          <div class="id-content-${mainDetails.status.toLowerCase()}" id="dropdownToggle">
            <h5>
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                <circle cx="5.22852" cy="5.57791" r="5" fill="white" />
              </svg>
              ${
                mainDetails.status.charAt(0).toUpperCase() +
                mainDetails.status.slice(1).toLowerCase()
              }
            </h5>
          </div>
        </div>
    
      </div>
      


    <div id="myModal" class="modal">
      <div class="modal-content">
          <div class="revlytic product-headerFixed">
              <span class="close" id="close-modal">&times;</span>
              <input type="text" id="search-input" placeholder="Search products">
              <button id="search-button">Search</button>
          </div>

           <div class="modal-content-inner">
              <div id="product-list"></div>
               <div class="revlytic product-modalBtn">
               <button class="add-button">Add</button>
               <button id="cancel-button">Cancel</button>
              </div>
            </div>
        </div>
     </div> 


     <!-- cancel sub modal -->
${cancelReasonModal}


    
      <!-- edit details -->
    
      <div class="revlytic-edit-details-grid">
          <div class="edit-sub-details">
              <div class="edit-sub-detail-inner">
                  <span>
                      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="17.2676" cy="17.1281" r="16.6543" fill="#F39C44" />
                          <g clip-path="url(#clip0_2221_75)">
                              <path
                                  d="M22.8442 9.62805H11.691C11.1811 9.62888 10.6924 9.83179 10.3318 10.1923C9.97132 10.5528 9.76841 11.0416 9.76758 11.5515V21.8421H11.8704C12.1209 21.8421 12.3611 21.9416 12.5382 22.1187C12.7153 22.2958 12.8148 22.536 12.8148 22.7865V24.6218H22.8442C23.354 24.6209 23.8428 24.418 24.2033 24.0575C24.5638 23.697 24.7667 23.2082 24.7676 22.6984V11.5515C24.7667 11.0416 24.5638 10.5528 24.2033 10.1923C23.8428 9.83179 23.354 9.62888 22.8442 9.62805ZM17.266 18.5714H12.2545C12.1292 18.5714 12.0091 18.5216 11.9206 18.4331C11.832 18.3445 11.7823 18.2244 11.7823 18.0992C11.7823 17.974 11.832 17.8539 11.9206 17.7653C12.0091 17.6768 12.1292 17.627 12.2545 17.627H17.266C17.3912 17.627 17.5113 17.6768 17.5999 17.7653C17.6884 17.8539 17.7382 17.974 17.7382 18.0992C17.7382 18.2244 17.6884 18.3445 17.5999 18.4331C17.5113 18.5216 17.3912 18.5714 17.266 18.5714ZM17.266 16.0845H12.2545C12.1292 16.0845 12.0091 16.0348 11.9206 15.9462C11.832 15.8576 11.7823 15.7375 11.7823 15.6123C11.7823 15.4871 11.832 15.367 11.9206 15.2784C12.0091 15.1899 12.1292 15.1401 12.2545 15.1401H17.266C17.3912 15.1401 17.5113 15.1899 17.5999 15.2784C17.6884 15.367 17.7382 15.4871 17.7382 15.6123C17.7382 15.7375 17.6884 15.8576 17.5999 15.9462C17.5113 16.0348 17.3912 16.0845 17.266 16.0845ZM17.266 13.6008H12.2545C12.1292 13.6008 12.0091 13.551 11.9206 13.4625C11.832 13.3739 11.7823 13.2538 11.7823 13.1286C11.7823 13.0033 11.832 12.8832 11.9206 12.7947C12.0091 12.7061 12.1292 12.6564 12.2545 12.6564H17.266C17.3912 12.6564 17.5113 12.7061 17.5999 12.7947C17.6884 12.8832 17.7382 13.0033 17.7382 13.1286C17.7382 13.2538 17.6884 13.3739 17.5999 13.4625C17.5113 13.551 17.3912 13.6008 17.266 13.6008ZM20.798 20.4066C20.7818 20.4259 20.7615 20.4413 20.7387 20.4519C20.7158 20.4625 20.691 20.468 20.6658 20.468C20.6406 20.468 20.6158 20.4625 20.5929 20.4519C20.5701 20.4413 20.5498 20.4259 20.5336 20.4066L19.1611 18.8106H19.6868C19.7327 18.8106 19.7767 18.7924 19.8092 18.7599C19.8417 18.7275 19.8599 18.6834 19.8599 18.6375V13.3017C19.8599 13.2558 19.8782 13.2118 19.9106 13.1793C19.9431 13.1468 19.9871 13.1286 20.0331 13.1286H21.2922C21.3385 13.1286 21.3828 13.1467 21.4158 13.1791C21.4488 13.2115 21.4677 13.2555 21.4685 13.3017V18.6375C21.4681 18.6604 21.4723 18.6831 21.4808 18.7043C21.4894 18.7255 21.5021 18.7447 21.5183 18.7609C21.5344 18.777 21.5537 18.7898 21.5749 18.7983C21.5961 18.8069 21.6188 18.8111 21.6417 18.8106H22.1611L20.798 20.4066Z"
                                  fill="white" />
                              <path
                                  d="M9.76758 22.3552L12.2608 24.628V22.9974C12.2608 22.8304 12.1944 22.6703 12.0764 22.5522C11.9583 22.4341 11.7981 22.3678 11.6312 22.3678L9.76758 22.3552Z"
                                  fill="white" />
                          </g>
                          <defs>
                              <clipPath id="clip0_2221_75">
                                  <rect width="15" height="15" fill="white" transform="translate(9.76758 9.62805)" />
                              </clipPath>
                          </defs>
                      </svg>
                  </span>
                  <div class="edit-additional-btn">
                  <h3>Subscription Details</h3>
                  <div class="revlytic-subdetails-btn hidden">
                  <button id="rev-billing-freq-edit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14"
                          fill="none">
                          <path
                              d="M7.09282 0.735474L0.665865 7.16243L0.402344 10.2932L3.58562 10.0911L10.0183 3.66154L7.09282 0.735474ZM6.4529 3.03152L7.09282 2.39159L8.36091 3.65968L7.72098 4.2996L6.4529 3.03152Z"
                              fill="#12600F" />
                          <path d="M0.101562 11.8322H10.7894V13.0036H0.101563L0.101562 11.8322Z" fill="#12600F" />
                      </svg>

                      Edit
                  </button>
                   <button id="rev-billing-freq-submit" class="hidden">Submit</button>
                   <button id="rev-billing-freq-cancel" class="hidden">Cancel</button>
                   </div>
  
              </div>
              </div>
    
              <div class="edit-plan-details-main">
                  <h4>Plan Type : <span id="rev-planname">${
                    mainDetails.subscription_details.planType.toLowerCase() ==
                    "payasyougo"
                      ? "Pay As You Go"
                      : "Prepaid"
                  }</span>
                  <h4>Billing Frequency :
                  <span id="rev-billingfreq">Every ${
                    mainDetails.subscription_details.billingLength
                  } ${
      mainDetails.subscription_details.delivery_billingType.toLowerCase() +
      "(s)"
    }</span>
                  <input id="rev-billingfreq-input" class="hidden" type= "text"></input>  
                  
                  <select id="rev-billingfreq-type" class="hidden">
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                  </select>
                  </h4>
                  <h4>Delivery Frequency :
                  <span id="rev-deliveryfreq">Every ${
                    mainDetails.subscription_details.planType == "payAsYouGo"
                      ? mainDetails.subscription_details.billingLength
                      : mainDetails.subscription_details.delivery_billingValue
                  } ${
      mainDetails.subscription_details.delivery_billingType.toLowerCase() +
      "(s)"
    }</span>
                  <input id="rev-deliveryfreq-input" class="hidden" type= "text"></input>  <select id="rev-deliveryfreq-type" class="hidden">
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                  </select></h4>
                  <div id="validation-freq" style="color: red;"></div>
                  </div>
          </div>
    
          <div class="edit-additional-details">
              <div class="edit-sub-additional-inner">
                  <span>
                      <svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="17.3867" cy="17.1281" r="16.6543" fill="#52A045" />
                          <g clip-path="url(#clip0_0_1)">
                              <path
                                  d="M17.6989 7.75405C17.5759 7.7539 17.4542 7.77798 17.3405 7.82492C17.2269 7.87186 17.1236 7.94074 17.0366 8.02762C16.9497 8.1145 16.8806 8.21768 16.8336 8.33125C16.7865 8.44482 16.7622 8.56656 16.7622 8.6895C16.7624 8.7308 16.7544 8.77173 16.7386 8.80992C16.7229 8.84811 16.6998 8.8828 16.6706 8.91201C16.6414 8.94121 16.6067 8.96435 16.5685 8.98008C16.5303 8.99582 16.4894 9.00384 16.4481 9.00368L14.5724 9.0025C14.5315 9.0025 14.491 9.01057 14.4533 9.02626C14.4155 9.04194 14.3812 9.06493 14.3524 9.0939C14.3235 9.12287 14.3006 9.15725 14.2851 9.19508C14.2696 9.2329 14.2616 9.27342 14.2618 9.31432V10.8758C14.2618 11.047 14.3941 11.1923 14.5724 11.1899H20.8253C21.0037 11.1899 21.1371 11.0482 21.1371 10.8758V9.31432C21.1373 9.27333 21.1293 9.23271 21.1137 9.19481C21.0981 9.1569 21.0751 9.12247 21.0461 9.09348C21.0172 9.0645 20.9827 9.04153 20.9448 9.02592C20.9069 9.0103 20.8663 9.00234 20.8253 9.0025H18.9497C18.9085 9.00266 18.8677 8.99467 18.8295 8.97901C18.7914 8.96335 18.7568 8.94032 18.7276 8.91124C18.6984 8.88216 18.6752 8.84761 18.6594 8.80955C18.6436 8.7715 18.6355 8.73071 18.6355 8.6895C18.6357 8.56646 18.6115 8.44459 18.5645 8.33088C18.5175 8.21718 18.4485 8.11386 18.3615 8.02686C18.2745 7.93985 18.1712 7.87086 18.0575 7.82385C17.9438 7.77683 17.8219 7.7539 17.6989 7.75405ZM17.6989 8.37768C17.7415 8.37506 17.7842 8.3812 17.8244 8.39571C17.8646 8.41022 17.9014 8.43281 17.9325 8.46208C17.9636 8.49134 17.9884 8.52667 18.0054 8.56589C18.0223 8.6051 18.0311 8.64737 18.0311 8.69009C18.0311 8.73281 18.0223 8.77508 18.0054 8.8143C17.9884 8.85351 17.9636 8.88884 17.9325 8.91811C17.9014 8.94738 17.8646 8.96996 17.8244 8.98448C17.7842 8.99899 17.7415 9.00512 17.6989 9.0025C17.6159 9.0025 17.5362 8.96952 17.4775 8.91083C17.4188 8.85213 17.3859 8.77251 17.3859 8.6895C17.3859 8.60649 17.4188 8.52688 17.4775 8.46818C17.5362 8.40948 17.6159 8.37768 17.6989 8.37768ZM12.7015 9.62732C11.8452 9.7348 11.1377 10.3195 11.1377 11.1899V22.7532H11.7637V11.1911C11.7637 10.6773 12.1747 10.2533 12.6992 10.2533H13.6382V9.6285L12.7015 9.62732ZM21.7631 9.62732V10.2533H22.6998C23.2194 10.3183 23.6376 10.6762 23.6376 11.1899V23.8882C23.6387 24.754 22.949 25.5654 22.0738 25.5654H11.4495C11.3432 25.5654 11.2381 25.5536 11.1377 25.53V26.1914C11.1377 26.371 11.2806 26.5032 11.4507 26.5032H23.9494C23.9904 26.5037 24.0311 26.496 24.0692 26.4806C24.1072 26.4652 24.1418 26.4424 24.1709 26.4135C24.2 26.3845 24.2231 26.3501 24.2388 26.3122C24.2545 26.2743 24.2625 26.2336 24.2624 26.1926V11.1899C24.2629 10.9846 24.2228 10.7812 24.1444 10.5914C24.066 10.4016 23.9509 10.2292 23.8057 10.084C23.6605 9.93876 23.4881 9.82368 23.2983 9.74531C23.1085 9.66695 22.9051 9.62685 22.6998 9.62732H21.7631ZM12.698 10.8769C12.6569 10.8769 12.6163 10.8851 12.5784 10.9008C12.5405 10.9165 12.506 10.9396 12.4771 10.9687C12.4481 10.9978 12.4252 11.0323 12.4096 11.0703C12.394 11.1082 12.386 11.1489 12.3862 11.1899V22.7532H20.8253C20.9966 22.7543 21.1359 22.8937 21.1371 23.065L21.1395 23.8882C21.1395 24.4221 21.5588 24.9406 22.0726 24.9406C22.5875 24.9406 23.0128 24.4209 23.0128 23.8894L23.0116 11.1899C23.0117 11.1487 23.0037 11.1078 22.988 11.0697C22.9722 11.0316 22.949 10.997 22.9198 10.9679C22.8906 10.9387 22.8559 10.9157 22.8177 10.9001C22.7795 10.8845 22.7386 10.8766 22.6974 10.8769H21.7619C21.7626 11.0002 21.7388 11.1223 21.6919 11.2363C21.6451 11.3503 21.5762 11.4539 21.4891 11.5411C21.402 11.6282 21.2985 11.6973 21.1846 11.7443C21.0706 11.7913 20.9485 11.8152 20.8253 11.8148H14.5724C14.4494 11.8146 14.3277 11.7902 14.2141 11.743C14.1005 11.6958 13.9973 11.6267 13.9105 11.5396C13.8236 11.4525 13.7547 11.3492 13.7078 11.2355C13.6609 11.1218 13.6368 10.9999 13.637 10.8769H12.698ZM13.6382 14.0022H15.1984C15.6154 14.0022 15.6154 14.6282 15.1984 14.6282H13.9488V16.5062H16.1362V16.192C16.1575 15.7763 16.7457 15.7786 16.7622 16.192V16.818C16.7622 16.8592 16.7541 16.9 16.7383 16.9381C16.7225 16.9761 16.6993 17.0107 16.6701 17.0398C16.641 17.0688 16.6063 17.0919 16.5682 17.1075C16.5301 17.1232 16.4893 17.1312 16.4481 17.131H13.637C13.5959 17.131 13.5552 17.1229 13.5172 17.1072C13.4792 17.0915 13.4447 17.0684 13.4157 17.0393C13.3866 17.0103 13.3635 16.9758 13.3478 16.9378C13.3321 16.8998 13.324 16.8591 13.324 16.818V14.3164C13.324 14.1428 13.4645 14.0022 13.6382 14.0022ZM16.4422 14.3176C16.5048 14.3161 16.5664 14.3334 16.6191 14.3673C16.6717 14.4012 16.713 14.4502 16.7376 14.5078C16.7621 14.5654 16.7688 14.6291 16.7568 14.6906C16.7448 14.752 16.7146 14.8085 16.6701 14.8526L15.4205 16.1034C15.3914 16.1327 15.3568 16.156 15.3187 16.1718C15.2806 16.1877 15.2397 16.1958 15.1984 16.1958C15.1571 16.1958 15.1163 16.1877 15.0782 16.1718C15.0401 16.156 15.0055 16.1327 14.9764 16.1034L14.3516 15.4774C14.0563 15.1821 14.4992 14.7392 14.7945 15.0345L15.1984 15.4385L16.2272 14.4085C16.2841 14.3511 16.3613 14.3184 16.4422 14.3176ZM18.0119 14.6282H20.5111C20.9281 14.6282 20.9281 15.2542 20.5111 15.2542H18.0119C17.5949 15.2542 17.5949 14.6282 18.0119 14.6282ZM21.7619 15.8802C22.1871 15.8707 22.1871 16.5156 21.7619 16.5062H18.0107C17.5855 16.5156 17.5855 15.8707 18.0107 15.8802H21.7619ZM13.6382 18.3783H15.1984C15.6154 18.3783 15.6154 19.0043 15.1984 19.0043H13.9488V20.8823H16.1362V20.5681C16.1575 20.1523 16.7457 20.1547 16.7622 20.5681V21.1941C16.7622 21.2353 16.7541 21.2761 16.7383 21.3141C16.7225 21.3522 16.6993 21.3867 16.6701 21.4158C16.641 21.4449 16.6063 21.4679 16.5682 21.4836C16.5301 21.4993 16.4893 21.5072 16.4481 21.5071H13.637C13.5958 21.5071 13.555 21.4989 13.5169 21.4831C13.4789 21.4673 13.4443 21.4442 13.4152 21.415C13.3862 21.3858 13.3631 21.3512 13.3475 21.313C13.3318 21.2749 13.3238 21.2341 13.324 21.1929V18.6925C13.324 18.5188 13.4645 18.3771 13.6382 18.3783ZM16.6701 19.2287L15.4205 20.4783C15.3914 20.5076 15.3568 20.5308 15.3187 20.5467C15.2806 20.5626 15.2397 20.5707 15.1984 20.5707C15.1571 20.5707 15.1163 20.5626 15.0782 20.5467C15.0401 20.5308 15.0055 20.5076 14.9764 20.4783L14.3516 19.8523C14.0563 19.557 14.4992 19.1141 14.7945 19.4094L15.1984 19.8133L16.2272 18.7858C16.2859 18.727 16.3656 18.694 16.4486 18.694C16.5317 18.694 16.6114 18.727 16.6701 18.7858C16.7288 18.8445 16.7618 18.9242 16.7618 19.0072C16.7618 19.0903 16.7288 19.17 16.6701 19.2287ZM18.0119 19.0007H20.5111C20.9281 19.0007 20.9281 19.6267 20.5111 19.6267H18.0119C17.5949 19.6267 17.5949 19.0007 18.0119 19.0007ZM21.7619 20.2527C22.1694 20.2634 22.1694 20.8693 21.7619 20.8787H18.0107C17.6032 20.8693 17.6032 20.2634 18.0107 20.2527H21.7619ZM10.5117 23.3803V23.8894C10.5117 24.4245 10.9369 24.9406 11.4484 24.9406H20.8749C20.6429 24.64 20.5159 24.2715 20.5135 23.8918L20.5111 23.3803H10.5117Z"
                                  fill="white" />
                          </g>
                          <defs>
                              <clipPath id="clip0_0_1">
                                  <rect width="20" height="20" fill="white" transform="translate(7.38672 7.12805)" />
                              </clipPath>
                          </defs>
                      </svg>
                  </span>
                  <div class="edit-additional-btn">
                      <h3>Additional Subscription Details</h3>
                      <div class="revlytic-subdetails-btn">
                      <button id="rev-billing-cycle-edit">
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14"
                              fill="none">
                              <path
                                  d="M7.09282 0.735474L0.665865 7.16243L0.402344 10.2932L3.58562 10.0911L10.0183 3.66154L7.09282 0.735474ZM6.4529 3.03152L7.09282 2.39159L8.36091 3.65968L7.72098 4.2996L6.4529 3.03152Z"
                                  fill="#12600F" />
                              <path d="M0.101562 11.8322H10.7894V13.0036H0.101563L0.101562 11.8322Z" fill="#12600F" />
                          </svg>
    
                          Edit
                      </button>
                       <button id="rev-billing-cycle-submit" class="hidden">Submit</button>
                       <button id="rev-billing-cycle-cancel" class="hidden">Cancel</button>
                       </div>
      
                  </div>
    
              </div>
    
              <div class="edit-plan-additional-main">
                  <h4 >Next Billing Date : <span id="rev-next-bill-date">${formatDate(
                    dateConversion(mainDetails.nextBillingDate)
                  )}</span>
                  <input id="rev-billing-input" class="hidden" type= "date"></input>
                  </h4> 
                  <h4 >Minimum Billing Cycles : <span id="rev-min-cycle">${
                    mainDetails.subscription_details.billingMinValue
                      ? mainDetails.subscription_details.billingMinValue
                      : 1
                  }</span>
                      </h4> 
                      <div id="validation-message-min" style="color: red;"></div>

                  <h4 >Maximum Billing Cycles : <span id="rev-max-cycle">${
                    mainDetails.subscription_details.billingMaxValue
                      ? mainDetails.subscription_details.billingMaxValue
                      : "-"
                  }</span>
                      </h4> 
                      <div id="validation-message-max" style="color: red;"></div>
              </div>
          </div>
    
          <div class="edit-payment-details">
              <div class="edit-sub-payment-inner">
                  <span>
                      <svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="17.457" cy="17.1281" r="16.6543" fill="#4A4ACD" />
                          <path
                              d="M23.5617 9.07327H15.4221C15.0174 9.07327 14.6292 9.243 14.343 9.54511C14.0568 9.84722 13.896 10.257 13.896 10.6842V16.0541C13.896 16.4813 14.0568 16.8911 14.343 17.1932C14.6292 17.4953 15.0174 17.665 15.4221 17.665H23.5617C23.9665 17.665 24.3547 17.4953 24.6409 17.1932C24.9271 16.8911 25.0879 16.4813 25.0879 16.0541V10.6842C25.0879 10.257 24.9271 9.84722 24.6409 9.54511C24.3547 9.243 23.9665 9.07327 23.5617 9.07327ZM20.5094 12.8322C20.6443 12.8322 20.7737 12.8887 20.8691 12.9895C20.9645 13.0902 21.0181 13.2267 21.0181 13.3692V15.0875C21.0181 15.2299 20.9645 15.3665 20.8691 15.4672C20.7737 15.5679 20.6443 15.6245 20.5094 15.6245H20.0464C20.0156 15.736 19.9513 15.834 19.8633 15.9037C19.7752 15.9734 19.6681 16.0111 19.5581 16.0111C19.448 16.0111 19.3409 15.9734 19.2528 15.9037C19.1648 15.834 19.1005 15.736 19.0697 15.6245H18.4745C18.3396 15.6245 18.2102 15.5679 18.1148 15.4672C18.0194 15.3665 17.9658 15.2299 17.9658 15.0875C17.9658 14.9451 18.0194 14.8085 18.1148 14.7078C18.2102 14.6071 18.3396 14.5505 18.4745 14.5505H20.0006V13.9061H18.4745C18.3396 13.9061 18.2102 13.8496 18.1148 13.7489C18.0194 13.6482 17.9658 13.5116 17.9658 13.3692V11.6508C17.9658 11.5084 18.0194 11.3718 18.1148 11.2711C18.2102 11.1704 18.3396 11.1138 18.4745 11.1138H19.0697C19.1005 11.0023 19.1648 10.9043 19.2528 10.8346C19.3409 10.7649 19.448 10.7272 19.5581 10.7272C19.6681 10.7272 19.7752 10.7649 19.8633 10.8346C19.9513 10.9043 20.0156 11.0023 20.0464 11.1138H20.5094C20.6443 11.1138 20.7737 11.1704 20.8691 11.2711C20.9645 11.3718 21.0181 11.5084 21.0181 11.6508C21.0181 11.7932 20.9645 11.9298 20.8691 12.0305C20.7737 12.1312 20.6443 12.1878 20.5094 12.1878H18.9832V12.8322H20.5094ZM23.5617 20.5916L21.5268 21.0319C21.5318 20.9282 21.5318 20.8242 21.5268 20.7205C21.5216 20.508 21.4765 20.2987 21.3943 20.1046C21.312 19.9106 21.1942 19.7356 21.0476 19.5899C20.901 19.4441 20.7285 19.3304 20.5401 19.2554C20.3517 19.1803 20.1511 19.1453 19.9498 19.1525C19.2887 19.1738 18.6325 19.0264 18.037 18.7229L17.0755 18.2772C16.8173 18.1595 16.53 18.1331 16.2564 18.202C16.2211 18.207 16.1868 18.2179 16.1547 18.2342L15.5239 18.535C15.7102 19.0686 15.7593 19.6448 15.6663 20.205L15.066 23.6095C15.066 23.69 15.0253 23.7652 15.005 23.8457L17.7267 24.9519C18.0925 25.1053 18.4827 25.1837 18.8764 25.1828C19.2791 25.1826 19.6781 25.1006 20.0515 24.9412L24.2688 23.1369C24.5761 23.0049 24.8244 22.7544 24.9632 22.4363C25.1021 22.1182 25.1212 21.7563 25.0167 21.4239C24.9099 21.1234 24.7039 20.8737 24.4365 20.7208C24.1692 20.5679 23.8585 20.522 23.5617 20.5916ZM13.3872 17.8208L10.4265 17.3482C10.3529 17.334 10.2772 17.3371 10.2048 17.3573C10.1325 17.3775 10.0653 17.4143 10.0079 17.4651C9.95059 17.5158 9.90458 17.5793 9.87316 17.651C9.84175 17.7227 9.82571 17.8008 9.82618 17.8798V24.3237C9.82618 24.4661 9.87978 24.6027 9.97518 24.7034C10.0706 24.8041 10.2 24.8607 10.3349 24.8607H12.5733C12.9434 24.8447 13.2962 24.6909 13.5691 24.4264C13.842 24.162 14.0172 23.8041 14.0638 23.4162L14.6641 20.0063C14.7108 19.7431 14.7074 19.4727 14.6541 19.2109C14.6009 18.9491 14.4988 18.701 14.3538 18.4813C14.2433 18.308 14.1007 18.1601 13.9346 18.0466C13.7685 17.9331 13.5823 17.8563 13.3872 17.8208Z"
                              fill="white" />
                      </svg>
    
    
                  </span>
                  <div class="edit-payment-btn">
                      <h3>Payment Details</h3>
                      <button id="rev-edit-payment-btn" >
                          Request Update
                      </button>
                  </div>
    
              </div>
    
              <div class="edit-plan-payment-main">
              ${
                mainDetails?.payment_details?.payment_instrument_value
                  ?.__typename == "CustomerCreditCard" ||
                mainDetails?.payment_details?.payment_instrument_value
                  ?.__typename == "CustomerShopPayAgreement"
                  ? ` <h4>Payment Method Type: <span>${
                      mainDetails?.payment_details?.payment_instrument_value
                        ?.brand
                        ? mainDetails?.payment_details?.payment_instrument_value?.brand
                            ?.charAt(0)
                            ?.toUpperCase() +
                          formatVariableName(
                            mainDetails?.payment_details?.payment_instrument_value?.brand?.slice(
                              1
                            )
                          )
                        : ""
                    } Ending With ${
                      mainDetails?.payment_details?.payment_instrument_value
                        ?.lastDigits
                    }</span></h4>
    <h4>Card Holder Name: <span>${capitalizeFirstChar(
      firstName
    )} ${capitalizeFirstChar(lastName)}</span></h4>

                  <h4>Card Expiry: <span>${
                    mainDetails?.payment_details?.payment_instrument_value
                      ?.expiryMonth
                  } / ${
                      mainDetails?.payment_details?.payment_instrument_value
                        ?.expiryYear
                    }</span></h4>`
                  : mainDetails?.payment_details?.payment_instrument_value
                      ?.__typename == "CustomerPaypalBillingAgreement"
                  ? `<h4>Payment Method Type: <span>${mainDetails?.payment_details?.payment_instrument_value?.paypalAccountEmail}</span></h4>`
                  : ""
              }
              </div>
          </div>
      </div>
    
      <!-- edit details end -->
    
    
    
      <!--subscription add product section-->
    
      <div class="revlytic-sub-add-product-section">
          <div class="add-product-row">
              <h4>Products</h4>
              <a href="#" id="revlytic-resourcepicker">
                  <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.2246 6.60998V12.9183" stroke="white" stroke-width="1.47902" stroke-miterlimit="10"
                          stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M6.89648 9.76398H13.5521" stroke="white" stroke-width="1.47902" stroke-miterlimit="10"
                          stroke-linecap="round" stroke-linejoin="round" />
                      <mask id="mask0_1743_2942" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0"
                          width="20" height="19">
                          <path d="M0.759766 0.792053H19.6912V18.7356H0.759766V0.792053Z" fill="white" />
                      </mask>
                      <g mask="url(#mask0_1743_2942)">
                          <path
                              d="M14.7389 16.8432C13.4218 17.5994 11.8766 18.0348 10.2242 18.0348C5.4049 18.0348 1.49805 14.3318 1.49805 9.7639C1.49805 5.196 5.4049 1.49303 10.2242 1.49303C15.0436 1.49303 18.9504 5.196 18.9504 9.7639C18.9504 11.4625 18.3979 13.0414 17.4714 14.3549"
                              stroke="white" stroke-width="1.47902" stroke-miterlimit="10" stroke-linecap="round"
                              stroke-linejoin="round" />
                      </g>
                  </svg>
    
                  Add Product
              </a>
          </div>
    
          <div class="edit-add-product-list">
              <div class="table-wrap"><table class="table table-responsive-xl">
                      <thead>
                          <tr>
                              <th style="text-align: left;">product</th>
                              <th style="text-align: center;">Price</th>
                              <th style="text-align: center;">Quantity</th>
                              <th style="text-align: center;">Total</th>
                              <th style="text-align: right;position: relative;right: 10px;">${
                                mainDetails.status.toLowerCase() != "cancelled"
                                  ? `Manage`
                                  : ``
                              }</th>
                          </tr>
                      </thead>
                      <tbody>
                   ${allProductsHtml}
                        
                      </tbody>
                  </table>
              </div>
    
              <div class="edit-product-subtotal">
                  <h3>Subtotal</h3>
                  <h2>${currencyCode && currencyCode}${
      mainDetails.subscription_details.planType != "prepaid"
        ? subtotal.toFixed(2)
        : (
            subtotal *
            (Number(mainDetails.subscription_details.billingLength) /
              Number(mainDetails.subscription_details.delivery_billingValue))
          ).toFixed(2)
    }</h2>
              </div>
          </div>
      </div>
    
      <!--subscription add product section end-->
    
      <!--edit shiping details section-->
      <div class="revlytic-edit-shipping-details">
          <div class="edit-shiping-content">
              <h4>Shipping Details</h4>
           
              <div class="revlytic-shipping-action-btn">
              <button id="rev-edit-subscriptionDetails">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14" fill="none">
                  <path
                      d="M7.29009 0.990173L0.863131 7.41713L0.599609 10.5479L3.78289 10.3458L10.2156 3.91624L7.29009 0.990173ZM6.65017 3.28622L7.29009 2.64629L8.55817 3.91438L7.91825 4.5543L6.65017 3.28622Z"
                      fill="#12600F" />
                  <path d="M0.298828 12.0869H10.9866V13.2583H0.298828L0.298828 12.0869Z" fill="#12600F" />
              </svg>
              Edit
          </button>
              <button id= "rev-submit-sub-details" class="hidden">Submit</button>
              <button id= "rev-cancel-sub-details" class="hidden">Cancel</button>
              </div>
          </div>
          <div class="shipping-inputs">
              <form>
              <div class="shiping-inputs-main">
              <div class="shiping-address">
                  <label>First Name</label>
                  <input type="text" disabled id="rev-firstname"  name="Firstname">
              </div>
              <div class="shiping-address">
                  <label>Last Name</label>
                  <input type="text" disabled id="rev-lastname"  name="Lastname">
              </div>
          </div>
                  <div class="shiping-inputs-main">
                      <div class="shiping-address">
                          <label>Address 1</label>
                          <input type="text" disabled id="rev-address1"  name="address1">
                      </div>
                      <div class="shiping-address">
                          <label>Address 2</label>
                          <input type="text" disabled id="rev-address2"  name="address2">
                      </div>
                  </div>
                  <div class="shiping-inputs-main">
                      <div class="shiping-address city-zip">
                          <div>
                              <label>city</label>
                              <input type="text" disabled id="rev-city"  name="city">
                          </div>
                          <div>
                              <label>zip</label>
                              <input type="text" disabled id="rev-zip"  name="zip">
                          </div>
                      </div>
                      <div class="shiping-address">
                          <label>Company</label>
                          <input type="text" disabled id="rev-company"  name="company">
                      </div>
                  </div>
                  <div class="shiping-inputs-main">
                  <div class="shiping-address">
                      <label>Phone</label>
                      <input type="text" disabled id="rev-phone"  name="Phone">
                  </div>
                  <div class="shiping-address">
                      <label>Delivery/Shipping Price</label>
                      <input type="text" disabled id="rev-delivery-price" name="Delivery/Shipping Price">
                  </div>
              </div>
    
                  <div class="shiping-inputs-main">
                      <div class="shiping-address">
                          <label>Country</label>
                          <select id="rev-country-dropdown" disabled>
                          <option value="">Select an option</option>
                      </select>
                      </div>
                      <div class="shiping-address" id ="rev-province">
                          <label>State/Province</label>
                          <select id="rev-province-dropdown" disabled>
                          <option value="">Select an option</option>
                      </select>
                      </div>
                  </div>
              </form>
          </div>
    
      </div>
      <!--edit shiping details section end-->
    
      <div class="upcoming-order tabset">
      <!-- Tab 1 -->
      ${` <input type="radio" name="tabset" id="tab1" aria-controls="UpcomingOrders" checked>
      <label for="tab1">${
        mainDetails.subscription_details.planType == "payAsYouGo"
          ? "Upcoming Orders"
          : "Scheduled"
      }</label>`}
      <!-- Tab 2 -->
      <input type="radio" name="tabset" id="tab2" aria-controls="PastOrders" >
      <label for="tab2">${
        mainDetails.subscription_details.planType == "payAsYouGo"
          ? "Past Orders"
          : "Open"
      }</label>
      <!-- Tab 3 -->
      <input type="radio" name="tabset" id="tab3" aria-controls="SkippedOrders">
      <label for="tab3">${
        mainDetails.subscription_details.planType == "payAsYouGo"
          ? "Skipped Orders"
          : "Closed"
      }</label>
      <input type="radio" name="tabset" id="tab4" aria-controls="PrepaidPastOrders">
      ${
        mainDetails.subscription_details.planType == "prepaid"
          ? `<label for="tab4">Past Orders</label>`
          : ""
      }

      <div class="tab-panels">
          <section id="UpcomingOrders" class="tab-panel">
              <div class="revlytic upcoming-orders-main upcoming-order-container">
                  <h4>${
                    mainDetails.subscription_details.planType == "payAsYouGo"
                      ? "Order Date"
                      : "Fulfillment Date"
                  }</h4>
                  <h4 class="status">${
                    mainDetails.subscription_details.planType == "payAsYouGo"
                      ? "Status"
                      : "Order Number"
                  }</h4>
                  <h4 class="manage">${"Manage"}</h4>
              </div>

          </section>
          <section id="PastOrders" class="tab-panel">
          <div class="revlytic upcoming-orders-main past-order-container">
          <h4>${
            mainDetails.subscription_details.planType == "payAsYouGo"
              ? "Order Date"
              : "Fulfillment Date"
          }</h4>
          <h4 class="status">${
            mainDetails.subscription_details.planType == "payAsYouGo"
              ? "Order Number"
              : "Order Number"
          }</h4>
              </div>
              
          </section>
          <section id="SkippedOrders" class="tab-panel">
          <div class="revlytic upcoming-orders-main skip-order-container">
                  <h4>${
                    mainDetails.subscription_details.planType == "payAsYouGo"
                      ? "Order Date"
                      : "Fulfillment Date"
                  }</h4>
                  <h4 class="status">${
                    mainDetails.subscription_details.planType == "payAsYouGo"
                      ? ""
                      : "Order Number"
                  }</h4>
              </div>
          </section>

          ${
            mainDetails.subscription_details.planType == "prepaid"
              ? `         
           <section id="PrepaidPastOrders" class="tab-panel">
          <div class="revlytic upcoming-orders-main prepaid-past-order-container">
              <h4>Order Date</h4>
              <h4 class="status">Order Number</h4>
                  </div>

      </section>`
              : ""
          }
      </div>

  </div>
    
      <!--upcoming order section end-->
    
      <div class="revlytic-subscription-status">
        ${buttons}
      </div>
    
      <div id="rescheduleModal" class="rev-reschedule-modal" style="display: none;">
      <div class="rev-reschedule-modal-content">
        <span class="rev-reschedule-close-modal">&times;</span>
        <h2>Select a Reschedule Date</h2>
        <input type="date" id="reschedule-datepicker">
        <button id="rescheduleConfirm">Confirm</button>
      </div>
    </div>
    
    </div>`;

    containerDiv.innerHTML = detailsData;
    ////////////////////reschedule datepicker listner
    document
      .getElementById("reschedule-datepicker")
      .addEventListener("change", function () {
        // Get the selected date from the date input
        rescheduleDate = this.value;
        console.log("Selected Date:", rescheduleDate);
      });
    /////////////////////////////subscription pausee,resume,cancell listiners buttons
    const pauseSubButton = document.querySelector(".pause-sub");
    const resumeSubButton = document.querySelector(".resume-sub");
    const cancelSubButton = document.querySelector(".cancel-sub");

    pauseSubButton &&
      pauseSubButton.addEventListener("click", () => {
        // Call the API for pausing the subscription here
        changeSubStatus("PAUSED");
      });

    resumeSubButton &&
      resumeSubButton.addEventListener("click", () => {
        // Call the API for resuming the subscription here
        changeSubStatus("ACTIVE");
      });

    ////////////////////////////cance-reson modal
    const cancelModal = document.getElementById("cancelModal");
    const cancelModalCancelBtn = document.getElementById(
      "rev-reason-cancelCancelBtn"
    );
    const cancelModalConfirmBtn = document.getElementById(
      "rev-reason-confirmCancelBtn"
    );
    let reason = document.getElementById("rev-cancel-reason-select");

    cancelModalCancelBtn.addEventListener("click", () => {
      cancelModal.style.display = "none";
    });

    const cancelModalCrossBtn = document.getElementById("cancelModalCloseBtn");
    cancelModalCrossBtn.addEventListener("click", () => {
      cancelModal.style.display = "none";
    });
    cancelSubButton &&
      cancelSubButton.addEventListener("click", () => {
        // Call the API for canceling the subscription here
        cancelModal.style.display = "block";
      });
    cancelModalConfirmBtn.addEventListener("click", () => {
      console.log(reason.value);
      if (reason?.value?.trim().length < 3) {
        if (permissions.cancellation == "simple") {
          showToast("Please enter a valid reason", 3000);
        } else {
          showToast("Please select a  reason", 3000);
        }
      } else {
        console.log("all clearr");
        changeSubStatus("CANCELLED", reason?.value);
      }
    });

    function changeSubStatus(key, reason) {
      let loader = document.getElementById("revlytic-overlay");
      loader.style.display = "flex";

      fetch(`${apiPath}api/customerPortal/subscriptionStatusUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shop: shop,
          id: `gid://shopify/SubscriptionContract/${param1}`,
          input: { status: key },
          field: "status",
          reason: reason,
        }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          loader.style.display = "none";
          if (data.message == "success") {
            if (data?.data?.status == "CANCELLED") {
              let extra = {
                templateType: "subscriptionCanceled",
                data: data?.data,
                shop_name: store_name,
                shop_email: store_email,
                currency: mainDetails?.subscription_details?.currency,
              };

              let resp = await sendMailOnUpdate({}, extra);
            } else if (data?.data?.status == "PAUSED") {
              let extra = {
                templateType: "subscriptionPaused",
                data: data?.data,
                shop_name: store_name,
                shop_email: store_email,
                currency: mainDetails?.subscription_details?.currency,
              };

              let resp = await sendMailOnUpdate({}, extra);
            } else if (data?.data?.status == "ACTIVE") {
              let extra = {
                templateType: "subscriptionResumed",
                data: data?.data,
                shop_name: store_name,
                shop_email: store_email,
                currency: mainDetails?.subscription_details?.currency,
              };

              let resp = await sendMailOnUpdate({}, extra);
            }
            console.log(data);
            getDataFromDb();
            showToast("Subscription updated successfully", 3000);
          } else {
            showToast(data?.data, 3000);
          }
        })
        .catch((error) => {
          showToast("Something went wrong", 3000);
          loader.style.display = "none";
          console.log(`Error  ${JSON.stringify(error)}`);
        });
    }

    async function sendMailOnUpdate(others, extra) {
      let loader = document.getElementById("revlytic-overlay");
      loader.style.display = "flex";

      fetch(`${apiPath}api/customerPortal/getEmailTemplateAndConfigData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shop: shop,
          templateType: extra?.templateType,
        }),
      })
        .then((response) => response.json())
        .then((getEmailTemplateAndConfigData) => {
          loader.style.display = "none";
          if (getEmailTemplateAndConfigData.message == "success") {
            console.log(getEmailTemplateAndConfigData);
            let templateType = extra?.templateType;

            let getData = getEmailTemplateAndConfigData?.data;

            let sendMailToCustomer = getData?.settings[templateType].status;
            let sendMailToMerchant =
              getData?.settings[templateType].adminNotification;

            if (sendMailToCustomer || sendMailToMerchant) {
              console.log("stredetails", extra?.storeDetails);

              let recipientMails = [];

              if (sendMailToMerchant) {
                console.log("extra", extra);
                let shopEmail = extra?.shop_email;

                recipientMails.push(shopEmail);
              }
              if (sendMailToCustomer) {
                recipientMails.push(extra?.data?.customer_details?.email);
              }

              let configurationData = getData?.configuration;
              let selectedTemplate = getData?.settings[templateType];

              let options = {};
              let emailConfig = {};

              if (configurationData && configurationData.enable == true) {
                console.log("inenabletrue");
                let encryptionConfig = {};
                if (configurationData.encryption === "ssl") {
                  encryptionConfig = {
                    secure: true,
                    requireTLS: true,
                  };
                } else if (configurationData.encryption === "tls") {
                  encryptionConfig = {
                    secure: false, // For TLS, secure should be set to false
                    requireTLS: true,
                  };
                }

                emailConfig = {
                  host: configurationData.host,
                  port: parseInt(configurationData.portNumber), // Convert port number to integer
                  auth: {
                    user: configurationData.userName,
                    pass: configurationData.password,
                  },
                  ...(configurationData.encryption === "none"
                    ? {}
                    : encryptionConfig),
                };

                options = {
                  // from: configurationData.fromName,
                  from: `${configurationData.fromName}<${configurationData.userName}>`,
                  to: recipientMails,
                  subject: selectedTemplate?.emailSetting?.subject,
                  cc: selectedTemplate?.emailSetting?.cc,
                  bcc: selectedTemplate?.emailSetting?.bcc,
                  replyTo: selectedTemplate?.emailSetting?.replyTo,
                  ...others,
                };

                // let response = await postApi("/api/admin/sendMailCommon",{emailConfig,options,extra}, app);

                //       return response;
              } else {
                console.log("inenablefalse");

                emailConfig = {
                  host: "smtp.gmail.com",
                  port: 587, // Convert port number to integer
                  auth: {
                    user: "revlytic@gmail.com",
                    pass: "yiaglckhjmbratox",
                  },
                  secure: false,
                };

                options = {
                  from: `Revlytic <revlytic@gmail.com>`,
                  to: recipientMails,
                  subject: selectedTemplate?.emailSetting?.subject,
                  cc: selectedTemplate?.emailSetting?.cc,
                  bcc: selectedTemplate?.emailSetting?.bcc,
                  replyTo: selectedTemplate?.emailSetting?.replyTo,
                  ...others,
                };
              }

              console.log(
                "finalccheckkk",
                recipientMails,
                emailConfig,
                options,
                selectedTemplate,
                extra
              );

              fetch(`${apiPath}api/customerPortal/sendMailOnUpdate`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  shop: shop,
                  recipientMails,
                  emailConfig,
                  options,
                  selectedTemplate,
                  extra,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  loader.style.display = "none";
                  if (data.message == "success") {
                    console.log(data);
                    getDataFromDb();
                    showToast("Subscription updated successfully", 3000);
                  } else {
                    showToast(data?.data, 3000);
                  }
                })
                .catch((error) => {
                  showToast("Something went wrong", 3000);
                  loader.style.display = "none";
                  console.log(`Error  ${JSON.stringify(error)}`);
                });

              //   ///////
              //  let mailCheck = await sendMailCall(
              //   recipientMails,
              //   {},
              //   {
              //      shop,
              //      selectedTemplateData,
              //     configurationData,
              //     extra
              //    } );
            }

            getDataFromDb();
            showToast("Subscription updated successfully", 3000);
          } else {
            showToast(data?.data, 3000);
          }
        })
        .catch((error) => {
          showToast("Something went wrong", 3000);
          loader.style.display = "none";
          console.log(`Error  ${JSON.stringify(error)}`);
        });
    }

    /////////shippind detals sections
    let input1 = document.getElementById("rev-address1");
    let input2 = document.getElementById("rev-address2");
    let input3 = document.getElementById("rev-city");
    let input4 = document.getElementById("rev-zip");
    let input5 = document.getElementById("rev-company");
    let input6 = document.getElementById("rev-firstname");
    let input7 = document.getElementById("rev-lastname");
    let input8 = document.getElementById("rev-phone");
    let input9 = document.getElementById("rev-delivery-price");

    input1.value = mainDetails?.shipping_address?.address1
      ? mainDetails?.shipping_address?.address1
      : "";
    input2.value = mainDetails?.shipping_address?.address2
      ? mainDetails?.shipping_address?.address2
      : "";
    input3.value = mainDetails?.shipping_address?.city
      ? mainDetails?.shipping_address?.city
      : "";
    input4.value = mainDetails?.shipping_address?.zip
      ? mainDetails?.shipping_address?.zip
      : "";
    input5.value = mainDetails?.shipping_address?.company
      ? mainDetails?.shipping_address?.company
      : "";
    input6.value = mainDetails?.shipping_address?.firstName
      ? mainDetails?.shipping_address?.firstName
      : "";
    input7.value = mainDetails?.shipping_address?.lastName
      ? mainDetails?.shipping_address?.lastName
      : "";
    input8.value = mainDetails?.shipping_address?.phone
      ? mainDetails?.shipping_address?.phone
      : "";
    input9.value = mainDetails?.shipping_address?.deliveryPrice
      ? mainDetails?.shipping_address?.deliveryPrice
      : "";

    const cdropdown = document.getElementById("rev-country-dropdown");
    const pdropdown = document.getElementById("rev-province-dropdown");
    ///////payment update section(payment details)
    const paymentButton = document.getElementById("rev-edit-payment-btn");

    /////////first section (subscription detals)
    const editfreqButton = document.getElementById("rev-billing-freq-edit");
    const freqSubmit = document.getElementById("rev-billing-freq-submit");
    const freqCancel = document.getElementById("rev-billing-freq-cancel");
    const deliveryfreqInput = document.getElementById("rev-deliveryfreq-input");
    const billingfreqInput = document.getElementById("rev-billingfreq-input");
    const plannameInput = document.getElementById("rev-planname-input");
    const plannamespan = document.getElementById("rev-planname");
    const billingfreqspan = document.getElementById("rev-billingfreq");
    const deliveryfreqspan = document.getElementById("rev-deliveryfreq");
    const billfreqType = document.getElementById("rev-billingfreq-type");
    const DeliveryFreqType = document.getElementById("rev-deliveryfreq-type");

    //////////////////second section (additional subscrition details)
    const editMaxButton = document.getElementById("rev-billing-cycle-edit");
    const billingSubmit = document.getElementById("rev-billing-cycle-submit");
    const billingCancel = document.getElementById("rev-billing-cycle-cancel");
    const billingSpan = document.getElementById("rev-next-bill-date");
    const billingInput = document.getElementById("rev-billing-input");
    const minSpan = document.getElementById("rev-min-cycle");
    const maxSpan = document.getElementById("rev-max-cycle");
    // const minInput = document.getElementById("rev-min-input");
    // const maxInput = document.getElementById("rev-max-input");
    //////////////addding initial date to billingdate input
    function formatDateForInput(dateString) {
      const dateObj = new Date(dateString);
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because January is 0
      const day = dateObj.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    const providedDate = dateConversion(mainDetails.nextBillingDate);
    const formattedDate = formatDateForInput(providedDate);
    billingInput.value = formattedDate;
    ///////////////////shipping detals listners
    let editsubscriptionIcon = document.getElementById(
      "rev-edit-subscriptionDetails"
    );
    function toggleEditable() {
      input1.disabled = false;
      input2.disabled = false;
      input3.disabled = false;
      input4.disabled = false;
      input5.disabled = false;
      input6.disabled = false;
      input7.disabled = false;
      input8.disabled = false;

      editsubscriptionIcon.classList.add("hidden");
      submitSubDetail.classList.remove("hidden");
      cancelSubDetails.classList.remove("hidden");
      cdropdown.disabled = false;
      pdropdown.disabled = false;
    }

    // Add a click event listener to the edit button
    if (
      permissions.values.changeShippingAddress &&
      mainDetails.status.toLowerCase() != "cancelled"
    ) {
      editsubscriptionIcon.addEventListener("click", toggleEditable);
    } else {
      editsubscriptionIcon.remove();
    }
    let submitSubDetail = document.getElementById("rev-submit-sub-details");
    let cancelSubDetails = document.getElementById("rev-cancel-sub-details");
    cancelSubDetails.addEventListener("click", () => {
      input1.value = mainDetails?.shipping_address?.address1;
      input2.value = mainDetails?.shipping_address?.address2;
      input3.value = mainDetails?.shipping_address?.city;
      input4.value = mainDetails?.shipping_address?.zip;
      input5.value = mainDetails?.shipping_address?.company;
      input6.value = mainDetails?.shipping_address?.firstName;
      input7.value = mainDetails?.shipping_address?.lastName;
      input8.value = mainDetails?.shipping_address?.phone;
      input9.value = mainDetails?.shipping_address?.deliveryPrice
        ? mainDetails?.shipping_address?.deliveryPrice
        : "";

      cdropdown.value = mainDetails.shipping_address.countryCode;
      editsubscriptionIcon.classList.remove("hidden");
      submitSubDetail.classList.add("hidden");
      cancelSubDetails.classList.add("hidden");
      input1.disabled = true;
      input2.disabled = true;
      input3.disabled = true;
      input4.disabled = true;
      input5.disabled = true;
      input6.disabled = true;
      input7.disabled = true;
      input8.disabled = true;
      cdropdown.disabled = true;
      pdropdown.disabled = true;

      let provinceDropdown = document.getElementById("rev-province-dropdown");
      const provinceDiv = document.getElementById("rev-province");

      let selectedCountry = countrydata?.find(
        (item) => mainDetails.shipping_address.countryCode == item?.code
      );
      if (selectedCountry?.provinces?.length > 0) {
        provinceDiv.classList.remove("hidden");
      } else {
        provinceDiv.classList.add("hidden");
      }
      selectedCountry?.provinces?.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.code; // Set the value for the option
        option.textContent = item.name; // Set the display text
        provinceDropdown.appendChild(option);
      });
      provinceDropdown.value = mainDetails.shipping_address.provinceCode;
    });
    if (permissions.values.changeShippingAddress) {
      submitSubDetail.addEventListener("click", () => {
        let loader = document.getElementById("revlytic-overlay");
        loader.style.display = "flex";

        fetch(`${apiPath}api/customerPortal/subscriptionShippingUpdate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shop: shop,
            id: `gid://shopify/SubscriptionContract/${param1}`,
            country: cdropdown.value,
            province: pdropdown.value,
            input: {
              deliveryPrice: mainDetails.shipping_address.deliveryPrice,

              deliveryMethod: {
                shipping: {
                  address: {
                    address1: input1.value,
                    address2: input2.value,
                    city: input3.value,
                    company: input5.value,
                    firstName: input6.value,
                    lastName: input7.value,
                    phone: input8.value,
                    zip: input4.value,
                    provinceCode: pdropdown.value,
                    countryCode: cdropdown.value,
                  },
                },
              },
            },

            field: "deliveryMethod",
          }),
        })
          .then((response) => response.json())
          .then(async (data) => {
            loader.style.display = "none";
            if (data.message == "success") {
              console.log("21novvvv");
              //////emailfunc/////
              let extra = {
                templateType: "shippingAddressUpdated",
                data: data?.data,
                shop_name: store_name,
                shop_email: store_email,
                currency: mainDetails?.subscription_details?.currency,
              };

              let resp = await sendMailOnUpdate({}, extra);
              ////////emailfuncend/////
              getDataFromDb();
              console.log(data);
              showToast("Subscription updated successfully", 3000);
            } else {
              showToast(data?.data, 3000);
            }
          })
          .catch((error) => {
            showToast("Something went wrong", 3000);
            loader.style.display = "none";
            console.log(
              `Error fetching subscriptions ${JSON.stringify(error)}`
            );
          });
      });
    }
    //////////////payment update listner
    paymentButton.addEventListener("click", () => {
      let loader = document.getElementById("revlytic-overlay");
      loader.style.display = "flex";

      fetch(
        `${apiPath}api/customerPortal/customerPaymentMethodSendUpdateEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shop: shop,
            paymentId: mainDetails.payment_details.payment_method_token,
            email: mainDetails?.customer_details?.email,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          loader.style.display = "none";
          if (data.message == "success") {
            console.log(data);
            showToast(
              "Email to the customer for updating of payment method",
              3000
            );
          } else {
            showToast(data?.data, 3000);
          }
        })
        .catch((error) => {
          showToast("Something went wrong", 3000);
          loader.style.display = "none";
          console.log(`Error fetching subscriptions ${JSON.stringify(error)}`);
        });
    });

    ///////////////////additional subscription details listners
    const inputElement = document.getElementById("rev-billing-input");
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().split("T")[0];

    // Set the minimum date for the input element
    inputElement.setAttribute("min", formattedTomorrow);
    if (
      (permissions.values.minAndMax || permissions.values.nextBilldate) &&
      mainDetails.status.toLowerCase() != "cancelled"
    ) {
      editMaxButton.addEventListener("click", () => {
        billingSubmit.classList.remove("hidden");
        billingCancel.classList.remove("hidden");
        if (permissions.values.nextBilldate) {
          billingInput.classList.remove("hidden");
          billingSpan.classList.add("hidden");
        }

        if (false) {
          maxSpan.classList.add("hidden");
          minSpan.classList.add("hidden");
        }
        editMaxButton.classList.add("hidden");
      });
    } else {
      editMaxButton.remove();
    }
    billingCancel.addEventListener("click", () => {
      billingSubmit.classList.add("hidden");
      billingCancel.classList.add("hidden");
      billingInput.classList.add("hidden");
      // minInput.classList.add("hidden");
      // maxInput.classList.add("hidden");
      billingSpan.classList.remove("hidden");
      maxSpan.classList.remove("hidden");
      minSpan.classList.remove("hidden");
      editMaxButton.classList.remove("hidden");
      const validationMessageMin = document.getElementById(
        "validation-message-min"
      );
      const validationMessageMax = document.getElementById(
        "validation-message-max"
      );
      validationMessageMin.textContent = "";
      validationMessageMax.textContent = "";
    });
    billingSubmit.addEventListener("click", () => {
      console.log(billingInput.value);
      let billingPolicy = {
        interval:
          mainDetails?.subscription_details?.delivery_billingType?.toUpperCase(),
        intervalCount: parseInt(
          mainDetails?.subscription_details?.billingLength
        ),
        minCycles: mainDetails?.subscription_details?.billingMinValue
          ? parseInt(mainDetails?.subscription_details?.billingMinValue)
          : 1,
        ...(mainDetails?.subscription_details?.billingMaxValue
          ? mainDetails?.subscription_details?.billingMaxValue
            ? {
                maxCycles: parseInt(
                  mainDetails?.subscription_details?.billingMaxValue
                ),
              }
            : {}
          : mainDetails?.subscription_details?.planType == "prepaid" &&
            mainDetails?.subscription_details?.autoRenew == false
          ? { maxCycles: 1 }
          : {}),
      };

      let deliveryPolicy = {
        interval:
          mainDetails?.subscription_details?.delivery_billingType?.toUpperCase(),

        intervalCount:
          mainDetails?.subscription_details?.planType == "payAsYouGo"
            ? parseInt(mainDetails?.subscription_details?.billingLength)
            : parseInt(
                mainDetails?.subscription_details?.delivery_billingValue
              ),
      };

      // let loader = document.getElementById("revlytic-overlay")
      // loader.style.display="flex"
      const selectedDate = new Date(billingInput.value);
      const currentDate = new Date();
      if (!billingInput.value) {
        // validationMessage.textContent = "Please select a date.";
        // event.preventDefault();
        console.log("min maxeroorrrrr");
      } else if (selectedDate <= currentDate) {
        // validationMessage.textContent = "Date must be greater than today.";
        // event.preventDefault();
        console.log("min maxeroorrrrr");
      } else {
        let loader = document.getElementById("revlytic-overlay");
        loader.style.display = "flex";
        fetch(`${apiPath}api/customerPortal/subscriptionDetailsUpdate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shop: shop,
            id: `gid://shopify/SubscriptionContract/${param1}`,

            input: {
              nextBillingDate: billingInput.value,

              billingPolicy: billingPolicy,

              deliveryPolicy: deliveryPolicy,
            },

            planName: mainDetails?.subscription_details?.planName,

            planType: mainDetails?.subscription_details?.planType,

            frequencyPlanName:
              mainDetails?.subscription_details?.frequencyPlanName,

            autoRenew: mainDetails?.subscription_details?.autoRenew,
            currency: mainDetails?.subscription_details?.currency,

            check: "subscriptionDetailsUpdate",
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            loader.style.display = "none";
            if (data.message == "success") {
              getDataFromDb();
              billingSubmit.classList.add("hidden");
              billingCancel.classList.add("hidden");
              showToast("Subscription updated successfully", 3000);
            } else {
              showToast(data?.data, 3000);
            }
          })
          .catch((error) => {
            showToast("Something went wrong", 3000);
            loader.style.display = "none";
            console.log(
              `Error fetching subscriptions ${JSON.stringify(error)}`
            );
          });
      }
    });

    // const minValidationInput = document.getElementById("rev-min-input");
    // const maxValidationInput = document.getElementById("rev-max-input");
    // const validationMessageMin = document.getElementById(
    //   "validation-message-min"
    // );
    // const validationMessageMax = document.getElementById(
    //   "validation-message-max"
    // );

    // minValidationInput.addEventListener("input", () => {
    //   validateMin();
    // });

    // maxValidationInput.addEventListener("input", () => {
    //   validateMax();
    // });

    // function validateMin() {
    //   const minValue = parseFloat(minInput.value);
    //   const maxValue = parseFloat(maxInput.value);

    //   if (isNaN(minValue) || minValue <= 0 || maxValue <= 0) {
    //     validationMessageMin.textContent =
    //       "Must be a number greater than zero!";
    //   } else if (maxValue < minValue) {
    //     validationMessageMin.textContent =
    //       "Minimum Billing Cycles cannot be greater than Maximum Billing Cycles!";
    //   } else {
    //     validationMessageMin.textContent = "";
    //   }
    // }
    // function validateMax() {
    //   const minValue = parseFloat(minInput.value);
    //   const maxValue = parseFloat(maxInput.value);

    //   if (isNaN(maxValue) || minValue <= 0 || maxValue <= 0) {
    //     validationMessageMax.textContent =
    //       "Must be a number greater than zero!";
    //   } else if (maxValue < minValue) {
    //     validationMessageMax.textContent =
    //       "Maximum Billing Cycles cannot be less than Free trial count!";
    //   } else {
    //     validationMessageMax.textContent = "";
    //   }
    // }

    /////////////////////// subscription details listners
    // plannameInput.value = mainDetails.subscription_details.planType;
    billfreqType.value =
      mainDetails.subscription_details.delivery_billingType.toLowerCase();
    DeliveryFreqType.value =
      mainDetails.subscription_details.delivery_billingType.toLowerCase();
    billingfreqInput.value = mainDetails.subscription_details.billingLength;
    deliveryfreqInput.value =
      mainDetails.subscription_details.delivery_billingValue;
    let message = document.getElementById("validation-freq");
    // plannameInput.addEventListener("change", () => {
    //   if (plannameInput.value == "payAsYouGo") {
    //     if (!isNaN(billingfreqInput.value) && !isNaN(deliveryfreqInput.value)) {
    //       if (billingfreqInput.value != deliveryfreqInput.value) {
    //         console.log("444444");
    //         message.textContent =
    //           "Delivery frequency must be  same as billing frequency";
    //       } else {
    //         message.textContent = "";
    //       }
    //     } else {
    //       message.textContent =
    //         "Delivery frequency and Billing frequency must be valid numbers ";
    //     }
    //   } else {
    //     if (!isNaN(billingfreqInput.value) && !isNaN(deliveryfreqInput.value)) {
    //       console.log("2222");

    //       if (billingfreqInput.value % deliveryfreqInput.value !== 0) {
    //         console.log("3333");

    //         message.textContent =
    //           "Delivery frequency must be a multiple of billing frequency";
    //       } else if (billingfreqInput.value === deliveryfreqInput.value) {
    //         console.log("444444");
    //         message.textContent =
    //           "Delivery frequency cannot be the same as billing frequency";
    //       } else {
    //         console.log("5555555555");
    //         message.textContent = " ";
    //       }
    //     } else {
    //       message.textContent =
    //         "Delivery frequency and Billing frequency must be valid numbers ";
    //     }
    //   }
    // });

    deliveryfreqInput.addEventListener("input", (event) => {
      let message = document.getElementById("validation-freq");
      if (mainDetails.subscription_details.planType == "payAsYouGo") {
        if (!isNaN(billingfreqInput.value) && !isNaN(event.target.value)) {
          billingfreqInput.value = event.target.value;

          if (billingfreqInput.value != deliveryfreqInput.value) {
            console.log("444444");
            message.textContent =
              "Delivery frequency must be  same as billing frequency";
          } else {
            message.textContent = "";
          }
        } else {
          message.textContent =
            "Delivery frequency and Billing frequency must be valid numbers ";
        }
      } else {
        console.log("adsd", event.target.value, billingfreqInput.value);
        if (!isNaN(event.target.value) && !isNaN(billingfreqInput.value)) {
          console.log(
            "2222",
            Number(billingfreqInput.value) % Number(event.target.value)
          );

          if (
            Number(billingfreqInput.value) % Number(event.target.value) !==
            0
          ) {
            console.log("no multiple");

            message.textContent =
              "Delivery frequency must be a multiple of billing frequency";
          } else if (event.target.value === billingfreqInput.value) {
            console.log("444444");
            message.textContent =
              "Delivery frequency cannot be the same as billing frequency";
          } else {
            console.log("5555555555");
            message.textContent = " ";
          }
        } else {
          console.log("elseeeeeee");
          message.textContent =
            "Delivery frequency and Billing frequency must be valid numbers ";
        }
      }
    });
    billingfreqInput.addEventListener("input", (event) => {
      let message = document.getElementById("validation-freq");
      if (mainDetails.subscription_details.planType == "payAsYouGo") {
        console.log("hahaahha", event.target.value);

        if (!isNaN(event.target.value) && !isNaN(deliveryfreqInput.value)) {
          deliveryfreqInput.value = event.target.value;

          if (Number(event.target.value) != Number(deliveryfreqInput.value)) {
            console.log("444444");
            message.textContent =
              "Delivery frequency must be  same as billing frequency";
          } else {
            message.textContent = "";
          }
        } else {
          console.log("kkkkk");
          message.textContent =
            "Delivery frequency and Billing frequency must be valid numbers ";
        }
      } else {
        console.log("adsd", deliveryfreqInput.value, event.target.value);
        if (!isNaN(event.target.value) && !isNaN(deliveryfreqInput.value)) {
          console.log("2222");

          if (
            Number(event.target.value) % Number(deliveryfreqInput.value) !==
            0
          ) {
            console.log("3333");

            message.textContent =
              "Delivery frequency must be a multiple of billing frequency";
          } else if (event.target.value === deliveryfreqInput.value) {
            console.log("444444");
            message.textContent =
              "Delivery frequency cannot be the same as billing frequency";
          } else {
            console.log("5555555555");
            message.textContent = " ";
          }
        } else {
          message.textContent =
            "Delivery frequency and Billing frequency must be valid numbers ";
        }
      }
    });
    if (
      permissions.values.planTypeAndfrequencies &&
      mainDetails.status.toLowerCase() != "cancelled"
    ) {
      editfreqButton.addEventListener("click", () => {
        freqSubmit.classList.remove("hidden");
        freqCancel.classList.remove("hidden");
        deliveryfreqInput.classList.remove("hidden");
        billingfreqInput.classList.remove("hidden");
        // plannameInput.classList.remove("hidden");
        // plannamespan.classList.add("hidden");
        billingfreqspan.classList.add("hidden");
        deliveryfreqspan.classList.add("hidden");
        editfreqButton.classList.add("hidden");
        billfreqType.classList.remove("hidden");
        DeliveryFreqType.classList.remove("hidden");
      });
    } else {
      editfreqButton.remove();
    }

    freqCancel.addEventListener("click", () => {
      freqSubmit.classList.add("hidden");
      freqCancel.classList.add("hidden");
      deliveryfreqInput.classList.add("hidden");
      billingfreqInput.classList.add("hidden");
      billfreqType.classList.add("hidden");
      DeliveryFreqType.classList.add("hidden");
      // plannameInput.classList.add("hidden");
      // plannamespan.classList.remove("hidden");
      billingfreqspan.classList.remove("hidden");
      deliveryfreqspan.classList.remove("hidden");
      editfreqButton.classList.remove("hidden");
      message.textContent = "";
    });
    if (permissions.values.planTypeAndfrequencies) {
      freqSubmit.addEventListener("click", () => {
        let billingPolicy = {
          interval: billfreqType.value.toUpperCase(),
          intervalCount: parseInt(billingfreqInput.value),
          minCycles: mainDetails.subscription_details.billingMinValue,
          maxCycles: mainDetails.subscription_details.billingMaxValue,
        };

        let deliveryPolicy = {
          interval: billfreqType?.value.toUpperCase(),

          intervalCount: parseInt(deliveryfreqInput.value),
        };

        const currentDate = new Date();

        if (mainDetails.subscription_details.planType == "payAsYouGo") {
          if (billingfreqInput.value !== deliveryfreqInput.value) {
            // validationMessage.textContent = "Billing frequency and delivery frequency must be the same.";
            return; // Exit the function if the condition is not met
          }
        } else {
          if (
            !isNaN(billingfreqInput.value) &&
            !isNaN(deliveryfreqInput.value)
          ) {
            console.log("2222");

            if (billingfreqInput.value % deliveryfreqInput.value !== 0) {
              console.log("3333");

              return;
            } else if (billingfreqInput.value === deliveryfreqInput.value) {
              console.log("444444");
              return;
            }
          }
        }
        let loader = document.getElementById("revlytic-overlay");
        loader.style.display = "flex";
        fetch(`${apiPath}api/customerPortal/subscriptionDetailsUpdate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shop: shop,
            id: `gid://shopify/SubscriptionContract/${param1}`,

            input: {
              nextBillingDate: formatDate(mainDetails.nextBillingDate),

              billingPolicy: billingPolicy,

              deliveryPolicy: deliveryPolicy,
            },

            planName: mainDetails?.subscription_details?.planName,

            planType: mainDetails.subscription_details.planType,

            frequencyPlanName:
              mainDetails?.subscription_details?.frequencyPlanName,

            autoRenew: mainDetails?.subscription_details?.autoRenew,

            check: "subscriptionDetailsUpdate",
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            loader.style.display = "none";
            if (data.message == "success") {
              console.log(data);
              getDataFromDb();
              freqSubmit.classList.add("hidden");
              freqCancel.classList.add("hidden");
              showToast("Subscription updated successfully", 3000);
            } else {
              showToast(data?.data, 3000);
            }
          })
          .catch((error) => {
            showToast("Something went wrong", 3000);
            loader.style.display = "none";

            console.log(
              `Error fetching subscriptions ${JSON.stringify(error)}`
            );
          });
        // }
      });
    }
    billfreqType.addEventListener("change", function () {
      DeliveryFreqType.value = this.value; // Set the value of dropdown2 to match dropdown1
    });

    DeliveryFreqType.addEventListener("change", function () {
      billfreqType.value = this.value; // Set the value of dropdown1 to match dropdown2
    });
    getcountries(mainDetails);
    console.log(mainDetails.shipping_address.countryCode, "ll");
    // const cdropdown = document.getElementById('rev-country-dropdown')
    // cdropdown.value = mainDetails.shipping_address.countryCode
    // const pdropdown = document.getElementById('rev-province-dropdown')
    // pdropdown.value = mainDetails.shipping_address.provinceCode

    const deleteIcons = document.querySelectorAll(".rev-delete-icon");
    deleteIcons.forEach((icon) => {
      if (
        permissions.values.deleteSubscriptionProduct &&
        mainDetails.status.toLowerCase() != "cancelled"
      ) {
        icon.addEventListener("click", function () {
          console.log("hi this id");
          // Get the data attributes from the clicked icon
          const subscriptionLine = icon.getAttribute("data-line");
          const index = icon.getAttribute("data-index");

          // Call your function with the extracted data attributes
          if (deleteIcons.length <= 1) {
            showToast("Subscription must contain at least one product", 3000);
          } else {
            let loader = document.getElementById("revlytic-overlay");
            loader.style.display = "flex";
            fetch(`${apiPath}api/customerPortal/subscriptionDraftLineRemove`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                shop: shop,
                id: `gid://shopify/SubscriptionContract/${param1}`,
                line: subscriptionLine,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                loader.style.display = "none";
                if (data.message == "success") {
                  getDataFromDb();
                  showToast("Subscription updated successfully", 3000);
                } else {
                  showToast(data?.toastMessage, 3000);
                }
              })
              .catch((error) => {
                showToast("Something went wrong", 3000);
                loader.style.display = "none";
                console.log(
                  `Error fetching subscriptions ${JSON.stringify(error)}`
                );
              });
          }
        });
      } else {
        icon.remove();
      }
    });

    let manageicon = document.getElementsByClassName("rev-manage-icon");
    for (let i = 0; i < manageicon.length; i++) {
      const editIcon = manageicon[i].querySelector(".rev-edit-product-icon");
      if (
        permissions.values.changeProductQuantity &&
        mainDetails.status.toLowerCase() != "cancelled"
      ) {
        editIcon.addEventListener("click", function (event) {
          const allRows = document.querySelectorAll(".alert");
          allRows.forEach((otherRow) => {
            const otherQuantityInput =
              otherRow.querySelector(".quantity-input");
            const otherQuantitytd = otherRow.querySelector(".quantity-td");
            const otherTotaltd = otherRow.querySelector(".total-td");
            const otherTotalinput = otherRow.querySelector(".total-input");
            const otherSubmitCancelButton = otherRow.querySelector(
              ".submit-cancel-button"
            );
            const icon = otherRow.querySelector(".rev-manage-icon");

            otherQuantityInput.classList.add("hidden");
            otherQuantitytd.classList.remove("hidden");
            otherTotaltd.classList.remove("hidden");
            otherTotalinput.classList.add("hidden");
            otherSubmitCancelButton.classList.add("hidden");
            icon.classList.remove("hidden");
            console.log(otherQuantityInput, otherQuantitytd, "opopop");

            ////////////////to change value of quantity input on cancel click
            let inn = otherQuantityInput.querySelector("input");
            inn.value = otherQuantitytd.innerHTML;
          });
          // Find the parent row (tr) of the clicked element
          const row = event.target.closest("tr");
          console.log("obeewrject", row);

          // Find the input fields within the row (assumes you have input fields with class 'price-input' and 'quantity-input')
          const quantityInput = row.querySelector(".quantity-input");
          const quantitytd = row.querySelector(".quantity-td");
          const totaltd = row.querySelector(".total-td");

          const totalinput = row.querySelector(".total-input");

          const submitCancelButton = row.querySelector(".submit-cancel-button");

          // console.log("object",priceInput,quantityInput);

          // Toggle the visibility of input fields by adding/removing the 'hidden' class
          if (quantityInput) {
            quantityInput.classList.toggle("hidden");
            quantitytd.classList.toggle("hidden");
            totaltd.classList.toggle("hidden");

            totalinput.classList.toggle("hidden");

            submitCancelButton.classList.toggle("hidden");
            manageicon[i].classList.toggle("hidden");
          }
        });
      } else {
        editIcon.remove();
      }
    }
    let cancelButton = document.getElementsByClassName("submit-cancel-button");
    for (let i = 0; i < cancelButton.length; i++) {
      cancelButton[i].children[1].addEventListener("click", function (event) {
        // Find the parent row (tr) of the clicked element
        const row = event.target.closest("tr");
        console.log("obeewrject", row);

        // Find the input fields within the row (assumes you have input fields with class 'price-input' and 'quantity-input')
        const quantityInput = row.querySelector(".quantity-input");
        const quantitytd = row.querySelector(".quantity-td");
        const totalinput = row.querySelector(".total-input");
        const totaltd = row.querySelector(".total-td");

        const icon = row.querySelector(".rev-manage-icon");

        // console.log("object",priceInput,quantityInput);

        // Toggle the visibility of input fields by adding/removing the 'hidden' class
        if (quantityInput) {
          quantityInput.classList.toggle("hidden");
          quantitytd.classList.toggle("hidden");
          totalinput.classList.toggle("hidden");
          totaltd.classList.toggle("hidden");

          icon.classList.toggle("hidden");
          cancelButton[i].classList.toggle("hidden");
        }
      });
    }

    /////////////////////////////////////to hit the api to submit the edit values of a product
    let submitButton = document.getElementsByClassName("submit-cancel-button");
    for (let i = 0; i < submitButton.length; i++) {
      submitButton[i].children[0].addEventListener("click", function (event) {
        // Find the parent row (tr) of the clicked element
        const row = event.target.closest("tr");
        console.log("obeewrject", row);
        const pricetd = row.querySelector(".price-td");
        const price = pricetd.getAttribute("data-price");
        // Find the input fields within the row (assumes you have input fields with class 'price-input' and 'quantity-input')
        const quantityInput = row.querySelector(".quantity-input");
        const quantity = quantityInput.children[0].value;
        let subscriptionLine =
          submitButton[i].children[0].getAttribute("data-line");
        let index = submitButton[i].children[0].getAttribute("data-index");
        console.log(price, quantity, subscriptionLine, index);
        let loader = document.getElementById("revlytic-overlay");
        loader.style.display = "flex";

        fetch(
          `${apiPath}api/customerPortal/subscriptionDraftLineQuantityUpdate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              shop: shop,
              id: `gid://shopify/SubscriptionContract/${param1}`,
              input: {
                quantity: parseInt(quantity),
                // currentPrice: parseFloat(price),
                currentPrice:
                  mainDetails?.subscription_details?.planType == "prepaid"
                    ? parseFloat(
                        price *
                          (mainDetails?.subscription_details?.billingLength /
                            mainDetails?.subscription_details
                              ?.delivery_billingValue)
                      )
                    : parseFloat(price),
              },
              line: subscriptionLine,
              itemIndex: index,
              field: "lines", //field draftcommit waali mutation ke responses  ke according set ki hai taaki uske response waale data ko db mai set karne mai  easy ho
              check: "line_update", //   just to apply check on query in findItemForUpdateSubscription controller function
              unitPrice: price,
            }),
          }
        )
          .then((response) => response.json())
          .then(async (data) => {
            loader.style.display = "none";
            if (data.message == "success") {
              let extra = {
                templateType: "subscriptionProduct(s)Updated",
                data: data?.data,
                shop_name: store_name,
                shop_email: store_email,
                currency: mainDetails?.subscription_details?.currency,
              };

              let resp = await sendMailOnUpdate({}, extra);

              getDataFromDb();
              showToast("Subscription updated successfully", 3000);
            } else {
              showToast(data?.data, 3000);
            }
          })
          .catch((error) => {
            showToast("Something went wrong", 3000);
            loader.style.display = "none";
            console.log(
              `Error fetching subscriptions ${JSON.stringify(error)}`
            );
          });
      });
    }

    //////////////////////code and function to update the total price of products dynamically
    const quantityInputs = document.querySelectorAll(".quantity-input");

    quantityInputs.forEach(function (quantityInput) {
      quantityInput.addEventListener("input", updateTotal);
    });
    function updateTotal() {
      // Find the parent row (tr) of the input that triggered the change
      const row = this.closest("tr");
      console.log(row);
      // Find the relevant elements within the row
      const priceInput = row.querySelector(".price-td");
      const quantityInput = row.querySelector(".quantity-input");
      const totaltd = row.querySelector(".total-input");
      let currentValue = parseInt(quantityInput.children[0].value, 10);

      // Check if the value is less than 1
      if (currentValue < 1 || isNaN(currentValue)) {
        // If it is, set the value to 1
        currentValue = 1;
      }

      // Update the input value
      quantityInput.children[0].value = currentValue;

      // Calculate and update the total when the input values change
      const price = parseFloat(priceInput.getAttribute("data-price"));
      const quantity = parseInt(quantityInput.children[0].value) || 0;
      const total = price * quantity;
      totaltd.textContent =
        getSymbol(mainDetails?.subscription_details?.currency) +
        parseFloat(total)?.toFixed(2);
      console.log(price, quantity);
    }

    let addProductButton = document.getElementById("revlytic-resourcepicker");
    console.log(permissions, "ooooo");
    if (
      permissions.values.addNewContractProduct &&
      mainDetails.status.toLowerCase() != "cancelled"
    ) {
      addProductButton.addEventListener("click", () => {
        modal.style.display = "block";
        selectedIds = [];
        if (searchQuery) {
          const productList = document.getElementById("product-list");
          productList.innerHTML = ""; // Clear previous products
          searchQuery = "";
          startCursor = null;
          next = true;
          const searchInput = document.getElementById("search-input");
          searchInput.value = "";

          fetchAndProcessProducts("");
        } else {
          next && fetchAndProcessProducts("");
        }
      });
    } else {
      addProductButton.remove();
    }
    const searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", () => {
      next = true;
      const productList = document.getElementById("product-list");
      productList.innerHTML = ""; // Clear previous products
      const searchInput = document.getElementById("search-input");
      searchQuery = searchInput.value;
      startCursor = null; // Reset cursor for new search
      fetchAndProcessProducts(searchQuery);
    });

    var modal = document.getElementById("myModal");
    var closeModalBtn = document.getElementById("close-modal");
    var closeModalMainBtn = document.getElementById("cancel-button");
    closeModalMainBtn.addEventListener("click", function () {
      modal.style.display = "none";
      selectedIds = [];
    });

    closeModalBtn.addEventListener("click", function () {
      modal.style.display = "none";
      selectedIds = [];
    });

    const productList = document.querySelector("#product-list");
    productList.addEventListener("scroll", handleScroll);

    /////////////////////////resoucepicker functions////
    const addButton = document.querySelector(".add-button");
    addButton.addEventListener("click", () => {
      if (selectedIds.length > 0) {
        const uniqueObjects = Array.from(
          new Set(selectedIds.map(JSON.stringify)),
          JSON.parse
        );

        let country;
        if (
          mainDetails?.subscription_details?.currency?.toLowerCase() !=
          store_currency?.toLowerCase()
        ) {
          let filteredCountry = countries.find(
            (item) =>
              item?.currency?.toLowerCase() ==
              mainDetails?.subscription_details?.currency?.toLowerCase()
          );
          console.log("filteredCountry", filteredCountry);
          country = filteredCountry?.countrycode;
        }

        let loader = document.getElementById("revlytic-overlay");
        loader.style.display = "flex";
        fetch(`${apiPath}api/customerPortal/subscriptionDraftLineAdd`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shop: shop,
            id: `gid://shopify/SubscriptionContract/${param1}`,
            lines: uniqueObjects,
            check: "lineAdd",
            field: "lines",
            ...(country ? { country: country } : {}),
            subscription_details: mainDetails?.subscription_details,
          }),
        })
          .then((response) => response.json())
          .then(async (data) => {
            loader.style.display = "none";
            if (data.message == "success") {
              let extra = {
                templateType: "subscriptionProduct(s)Updated",
                data: data?.data,
                shop_name: store_name,
                shop_email: store_email,
                currency: mainDetails?.subscription_details?.currency,
              };

              let resp = await sendMailOnUpdate({}, extra);
              getDataFromDb();
              showToast("Subscription updated successfully", 3000);
            } else {
              showToast(data?.data, 3000);
            }
          })
          .catch((error) => {
            showToast("Something went wrong", 3000);
            loader.style.display = "none";
            console.log(
              `Error fetching subscriptions ${JSON.stringify(error)}`
            );
          });
        let modal = document.getElementById("myModal");
        modal.style.display = "none";

        startCursor = null;
        searchQuery = "";
        next = true;
        const productList = document.getElementById("product-list");
        productList.innerHTML = ""; // Clear previous products
      }
    });
  };

  const getcountries = (mainDetails) => {
    let loader = document.getElementById("revlytic-overlay");
    loader.style.display = "flex";
    fetch(`${apiPath}api/customerPortal/getStoreCountries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shop: shop,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        countrydata = data?.data?.data;
        const dropdown = document.getElementById("rev-country-dropdown");
        data?.data?.data?.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.code; // Set the value for the option
          option.textContent = item.name; // Set the display text
          dropdown.appendChild(option);
        });
        dropdown.value = mainDetails.shipping_address.countryCode;
        // const cdropdown = document.getElementById('rev-country-dropdown')
        // cdropdown.value = mainDetails.shipping_address.countryCode
        // const pdropdown = document.getElementById('rev-province-dropdown')
        // pdropdown.value = mainDetails.shipping_address.provinceCode
        let provinceDropdown = document.getElementById("rev-province-dropdown");
        const provinceDiv = document.getElementById("rev-province");

        provinceDropdown.innerHTML = "";

        let value = dropdown.value;
        let selectedCountry = countrydata?.find((item) => value == item?.code);
        console.log(selectedCountry, "dfjlkj");
        if (selectedCountry?.provinces?.length > 0) {
          provinceDiv.classList.remove("hidden");
        } else {
          provinceDiv.classList.add("hidden");
        }
        selectedCountry?.provinces?.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.code; // Set the value for the option
          option.textContent = item.name; // Set the display text
          provinceDropdown.appendChild(option);
        });
        provinceDropdown.value = mainDetails.shipping_address.provinceCode;

        dropdown.addEventListener("change", () => {
          // const provinceDropdown = document.getElementById('rev-province-dropdown')
          const provinceDiv = document.getElementById("rev-province");

          provinceDropdown.innerHTML = "";

          let value = dropdown.value;
          let selectedCountry = countrydata?.find(
            (item) => value == item?.code
          );
          console.log(selectedCountry, "dfjlkj");
          if (selectedCountry?.provinces?.length > 0) {
            provinceDiv.classList.remove("hidden");
          } else {
            provinceDiv.classList.add("hidden");
          }
          selectedCountry?.provinces?.forEach((item) => {
            const option = document.createElement("option");
            option.value = item.code; // Set the value for the option
            option.textContent = item.name; // Set the display text
            provinceDropdown.appendChild(option);
          });
        });

        console.log(data?.data?.data);

        loader.style.display = "none";
      })
      .catch((error) => {
        console.log(`Error fetching subscriptions ${JSON.stringify(error)}`);
        loader.style.display = "none";
      });
  };
});
