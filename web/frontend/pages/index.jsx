import React, { useEffect, useState } from "react";

import { Select, DatePicker, Card, Button, Spin, Tabs ,Empty ,Timeline , Alert } from "antd";


import dayjs from "dayjs";

import { getSessionToken } from "@shopify/app-bridge-utils";

import { useAppBridge } from "@shopify/app-bridge-react";

import { useNavigate } from "@shopify/app-bridge-react";

import axios from "axios";
import postApi from "../components/common/postApi";

import { useAPI } from "../components/common/commonContext";
import { Link } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";

function Home() {
  const { storeDetails } = useAPI();

  const navigate = useNavigate();

  const app = useAppBridge();

  const [loader, setLoader] = useState(false);

  // Initialize state for startDate and endDate

  const [startDate, setStartDate] = useState(
    dayjs().subtract(7, "day").format("YYYY-MM-DD")
  );

  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  const [customDate, setCustomDate] = useState(dayjs().format("YYYY-MM-DD"));

  const [range, setRange] = useState("today");

  const [recurringRevenue, setRecurringRevenue] = useState(0);

  const [activeCustomers, setActiveCustomers] = useState(0);

  const [subscriptionBookings, setSubscriptionBookings] = useState(0);

  const [upcomingRevenue, setUpcomingRevenue] = useState(0);

  // const [selectedRange,setSelectedRange]=useState(0)

  const [currencyConversionRates, setCurrencyConversionRates] = useState({});
  const [announcementList, setAnnouncementList] = useState([]);
  const [showAppBlock, setShowAppBlock] = useState();

  useEffect(async () => {
    console.log("in useEffectwithdependencys   storedetaisl");

    let data = await axios.get(
      "https://cdn.shopify.com/s/javascripts/currencies.js"
    );

    // console.log("data", (eval(new Function(`

    //   ${data?.data}

    //   return Currency;

    // `))()));

    let filtered =await  eval(
      new Function(`

  ${data?.data}

  return Currency;

`)
    )();

    console.log("yyyy", filtered);

    filtered && setCurrencyConversionRates(filtered.rates);

    if (filtered && storeDetails?.currency) {
      let response = await getData({ range: "last7Days" }, filtered?.rates);

      // if(response?.data?.message=="success"){

      //     console.log(response?.data?.data)

      //     let arr=response?.data?.data

      //     if(arr.length>0){

      // let sum = 0 ;

      // arr.map(item=> {

      // sum=sum + (parseFloat(item.total_amount) * parseFloat(filtered.rates[item?.currency] / filtered.rates[storeDetails?.currency]))

      // })

      // console.log("sum",sum)

      // setRecurringRevenue(sum)

      //     }

      //   }
    }
    return () => {};

  }, [storeDetails]);

  useEffect(async () => {

setLoader(true)

await checkAppBlockEmbed()
setLoader(false)
    await getActiveCustomers({ range: "last7Days" });

    await getAnnouncements();

  
  }, []);

async function checkAppBlockEmbed() {

let response=await postApi("/api/admin/checkAppBlockEmbed",{},app)

if(response?.data?.message=='success'){


console.log(response?.data?.data?.disabled)
setShowAppBlock(response?.data?.data?.disabled)


}






}

  function thousandsSeparator(input) {
    var output = input
    if (parseFloat(input)) {
        input = new String(input);
        var parts = input.split("."); 
        parts[0] = parts[0].split("").reverse().join("").replace(/(\d{3})(?!$)/g, "$1,").split("").reverse().join("");
        output = parts.join(".");
    }

    return output;
}


  const getAnnouncements=async()=>{

    let fetchAnnouncements=await postApi("/api/admin/getAnnouncements",{},app)
  
    if(fetchAnnouncements?.data?.message=='success'){
    
      setAnnouncementList(fetchAnnouncements?.data?.data)
    }
  
  }



  const getData = async (body, rates) => {
    console.log("getData", body);

    const sessionToken = await getSessionToken(app);

    const response = await axios.post("/api/admin/combinedData", body, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    console.log("response", response);

    if (response?.data?.message == "success") {
      console.log("dfdfd", response?.data?.data);

      console.log("trates", rates);

      let arr = response?.data?.data;

      let sum = 0;

      // let countInitialStatus = 0;

      if (arr.length > 0) {
        arr.map((item) => {
          sum =
            sum +
            parseFloat(item.total_amount) *
              parseFloat(rates[item?.currency] / rates[storeDetails?.currency]);

          // if (item.status == "initial") {
          //   countInitialStatus = countInitialStatus + 1;
          // }
        });
      }

      console.log("sum", sum);

      setRecurringRevenue(sum);

      // setSubscriptionBookings(countInitialStatus);
    }


    const subscriptionBookingsData = await axios.post("/api/admin/subscriptionBookings", body, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

console.log("subscriptionBookingsData",subscriptionBookingsData)
if (subscriptionBookingsData?.data?.message == "success") {

  setSubscriptionBookings(subscriptionBookingsData?.data?.data)

}

    // return response;
  };

  const getActiveCustomers = async (body) => {
    console.log("inactiveeee");

    const sessionToken = await getSessionToken(app);

    const response = await axios.post("/api/admin/activeCustomers", body, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    console.log("kikikkik");

    if (response?.data?.message == "success") {
      console.log("acttcccicccccveee", response?.data?.data);

      setActiveCustomers(response?.data?.data);
    }
  };

  const getUpcomingRevenue = async () => {
    const sessionToken = await getSessionToken(app);

    const response = await axios.post(
      "/api/admin/getUpcomingRevenue",
      {},
      { headers: { Authorization: `Bearer ${sessionToken}` } }
    );

    console.log("kikikkik");

    // if(response?.data?.message=="success"){

    //   console.log("acttcccicccccveee",response?.data?.data)

    //   setActiveCustomers(response?.data?.data)

    // }
  };

  // Handle disabling start date based on end date

  const handleDisableStartDate = (current) => {
    return current && current >= dayjs(endDate).startOf("day");
  };

  // Handle disabling end date based on start date

  const handleDisableEndDate = (current) => {
    const today = dayjs().startOf("day");

    return current && current <= dayjs(startDate).endOf("day");

    //    return current && current <= dayjs(startDate).endOf('day');
  };

  const handleDisableCustomDate = (current) => {
    // const today = dayjs().startOf('day');

    return current && current > new Date();
  };

  const handleRangeSelection = async (e) => {
    console.log(e, startDate, endDate, customDate);

    // console.log(dayjs(new Date()))

    console.log(new Date(new Date().setHours(0, 0, 0, 0)));

    setRange(e);

    let date;

        if(e =="customDate" ){

          console.log("saahhhhiiiiii",typeof customDate)
          await  getData({range:e,customDate},currencyConversionRates)

          await  getActiveCustomers({range:e,customDate})

        }

     else  if(e =="customRange" ){

          await  getData({range:e,startDate,endDate},currencyConversionRates)

          await  getActiveCustomers({range:e,startDate,endDate})

       }

  else  {
      await getData({ range: e }, currencyConversionRates);

      await getActiveCustomers({ range: e });
    }
  };
  const items = [
    {
      key: "1",
      label: `Subscription Plans`,
      children: (
        <>
          <div className="checklist-tabs-content">
            <p>
          With Subscription Plans, you have a quick and easy way to set up various recurring billing plans. These billing plans can then be assigned to any of your Products. Once assigned, your customers can self-subscribe to any of the plans you made available on your Products. This can jumpstart your Company’s growth in recurring revenue! </p>

<p>
Among the available features are Prepaid plans, Pay As You Go plans. Automatic Renewals, Discounts, and much more! These are all at your fingertips to make it easy to expand business! We’ve built in a lot of flexibility to meet your needs. Please click   <a href="https://revlytics.gitbook.io/revlytic/quick-create" target='/blank'>HERE</a>  for more Help documentation on Subscription Plans. Click below to start building your Subscription Plans!

            </p>
          </div>

          <div className="checklist-tabs-btns">
            <Button onClick={() => navigate("/createSubscription")}>
              {" "}
              subscription Plans
            </Button>
            {/* <Button className="help">Help</Button> */}
          </div>
          <div className="checklist-tabs-btn-next">
            {/* <Button>Next</Button> */}
          </div>
        </>
      ),
    },

    {
      key: "2",
      label: `Manual Subscriptions`,
      children: (
        <>
          <div className="checklist-tabs-content">
            <p>With Manual Subscriptions, we give all the control and flexibility to you to create individual subscriptions for any existing or new customers. With this feature you can create one off orders or automatically renew subscriptions for individual customers. We’ve built in the ability to create and send checkout links to your customers so you don’t have to do it! Please click   <a href="https://revlytics.gitbook.io/revlytic/manual-subscription" target='/blank'>HERE</a>  for more Help documentation on Manual Subscriptions. Click below to start building your Manual Subscriptions!
</p>
          </div>

          <div className="checklist-tabs-btns">
            <Button onClick={() => navigate('/createsubscription?type=manual')}>
              {" "}
              Manual Subscriptions
            </Button>
            {/* <Button className="help">Help</Button> */}
          </div>
          <div className="checklist-tabs-btn-next">
            {/* <Button>Next</Button> */}
          </div>
        </>
      ),
    },



    {
      key: "4",
      label: `Customer Portal`,
      children: (
        <>
          <div className="checklist-tabs-content">
            <p>
            Here, you will have the ability to customize the way your Customer Portal appears to your Customers. You can enable or disable features that you would like for your Customers to have when they access their Customer Portal. The Customer Portal is a feature we’ve built to increase customer satisfaction and to give your customers the ability to manage and view their subscriptions. Please click on the button below to get started.

            </p>
          </div>

          <div className="checklist-tabs-btns">
            <Button onClick={() => navigate("/customerportalsettings")}>
              {" "}
              Customer Portal
            </Button>
            {/* <Button className="help">Help</Button> */}
          </div>
          <div className="checklist-tabs-btn-next">
            {/* <Button>Next</Button> */}
          </div>
        </>
      ),
    },
    {
      key: "3",
      label: `Subscription Widget`,
      children: (
        <>
          <div className="checklist-tabs-content">
            <p>
            Customize and preview the subscription widget according to your store’s needs. The widget is displayed on the product page and can be added as an application block from the theme’s template customization in Shopify. We’ve built the subscription widget so that the labels, appearance, purchase options, and subscription details can be easily customized. We have a fantastic support team that can help you if you are having issues with setup. Please click the chat icon on the side for any support or questions. Click below to start customizing your subscription widget!

            </p>
          </div>

          <div className="checklist-tabs-btns">
            <Button onClick={() => navigate("/widgetsettings")}>
              {" "}
              Subscription Widget
            </Button>
            {/* <Button className="help">Help</Button> */}
          </div>
          <div className="checklist-tabs-btn-next">
            {/* <Button>Next</Button> */}
          </div>
        </>
      ),
    },
    // {
    //   key: "4",
    //   label: `Email Templates`,
    //   children: (
    //     <>
    //       <div className="checklist-tabs-content">
    //         <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
    //       </div>

    //       <div className="checklist-tabs-btns">
    //         <Button onClick={() => navigate("/emailtemplateslist")}>
    //           {" "}
    //           Email Templates
    //         </Button>
    //         {/* <Button className="help">Help</Button> */}
    //       </div>
    //       <div className="checklist-tabs-btn-next">
    //         {/* <Button>Next</Button> */}
    //       </div>
    //     </>
    //   ),
    // },
    {
      key: "5",
      label: `Help Docs`,
      children: (
        <>
          <div className="checklist-tabs-content">
            <p>Those are all the crucial steps and information you need to get started! We have additional features and capabilities that you can learn about in our Help Documentation. You can also watch our Video Demonstrations or reach out to us for additional help. Please visit the Settings page if you would like, to see all of the different configuration capabilities you have!
 </p> 
          </div>

          <div className="checklist-tabs-btns">
            <Button >
              {" "}
             <a href="https://revlytics.gitbook.io/revlytic/" target='/blank'>Help Docs</a> 
            </Button>
            {/* <Button className="help">Help</Button> */}
          </div>
          <div className="checklist-tabs-btn-next">
            {/* <Button>Next</Button> */}
          </div>
        </>
      ),
    },


  ];


const newItems= [{
  key: "1",
  label: `Announcements`,
  children: (
    <div className="revlytic-annoucments-inner-section-main">
    {announcementList.length > 0 ?  announcementList.map((item,index)=>  
    <div className="revlytic-annoucments-inner-section"> 
         <div className="revlytic-annoucments-inner-row">
         <div className="revlytic-annoucments-inner-column">
          <img src={`https://revlytic.co/images/announcement/${item?.image}`} width="100" height="100"  />
          <div className="revlyticannoucments-inner-content">
            <h3>{item?.title}</h3>  
            <p>{item?.description}</p>
            <a href={item?.buttonUrl} target="_blank"><Button>{item?.buttonText}</Button></a>
          </div>
          </div>
  
     
  
         </div>
      </div>)
    :
    <Empty/>  
    
    
    }
  
      </div> 
  
  ),
},
];

  return (

    <Spin spinning={loader} size="large" tip="Loading...">
        {showAppBlock==true &&  <Alert className="revlytic home-alert-main"
      message={<div className=""><div className="revlytic home-aleert-heading"><InfoCircleOutlined /> <span>Enable App Embed</span></div><div className="revlytic home-alert-message"><span>Kindly activate the Revlytic embed block in your live theme. This will allow us to set up a subscription widget on your product pages, specifically for products configured with subscription plans. </span><a href={`https://admin.shopify.com/store/${storeDetails?.shop?.split(".myshopify.com")[0]}/themes/current/editor?context=apps`} target="_blank">Click here to activate embedded block.</a> </div></div>}
      banner
      closable={false}
      showIcon={false}
      type="info"
    />}
      <div className="revlytic plan-group-listing-button">
        <h1 className="revlytic-plan-switch-heading">Home</h1>

        {/* <a onClick={() => setIsModalOpen(true)}> </a> */}
      </div>

   


      <div className="revlytic daterange-section-main" style={{alignItems:"center"}}>
        <Select
          onChange={handleRangeSelection}
          value={range}
          className="revlytic daterange-select"
        >
          <Select.Option value="customDate">Custom Date</Select.Option>{" "}
          <Select.Option value="customRange">Custom Date Range</Select.Option>
          <Select.Option value="today">Today</Select.Option>
          <Select.Option value="yesterday">Yesterday</Select.Option>
          <Select.Option value="last7Days">Last 7 Days</Select.Option>
          <Select.Option value="last30Days">Last 30 Days</Select.Option>
          <Select.Option value="last90Days">Last 90 Days</Select.Option>
          {/* <Select.Option value="last6months">
Last 6 Months
</Select.Option> */}
        </Select>

        {range == "customRange" && (
          <div className="revlytic custom-range-main">
            <DatePicker
              allowClear={false}
              showTime={false}
              showToday={false}
              disabledDate={handleDisableStartDate}
              // showTime={{
              //   hideDisabledOptions: true,
              //   defaultValue: [dayjs("00:00:00", "HH:mm:ss")],
              // }}
              format="YYYY-MM-DD"
              value={dayjs(startDate)}
              onChange={async (date, dateString) => {
                setStartDate(dateString);
                await getData(
                  { startDate: dateString, endDate, range },
                  currencyConversionRates
                );
                await getActiveCustomers({
                  startDate: dateString,
                  endDate,
                  range,
                });
              }}
            />

            <DatePicker
              allowClear={false}
              showTime={false}
              showToday={false}
              disabledDate={handleDisableEndDate}
              // showTime={{
              //   hideDisabledOptions: true,
              //   defaultValue: [dayjs("00:00:00", "HH:mm:ss")],
              // }}
              format="YYYY-MM-DD"
              value={dayjs(endDate)}
              onChange={async (date, dateString) => {
                setEndDate(dateString);

                await getData(
                  { startDate, endDate: dateString, range },
                  currencyConversionRates
                );
                await getActiveCustomers({
                  startDate,
                  endDate: dateString,
                  range,
                });
              }}
            />
          </div>
        )}


        {range == "customDate" && (
          <div className="revlytic custom-date-main">
            <DatePicker
              allowClear={false}
              showTime={false}
              showToday={false}
              disabledDate={handleDisableCustomDate}
              // showTime={{
              //   hideDisabledOptions: true,
              //   defaultValue: [dayjs("00:00:00", "HH:mm:ss")],
              // }}
              format="YYYY-MM-DD"
              value={dayjs(customDate)}
              onChange={(date, dateString) => {
                console.log("datestringgggg",typeof dateString)
                setCustomDate(dateString);
                getData({ customDate: dateString, range },currencyConversionRates);
                getActiveCustomers({ customDate: dateString, range });
              }}
            />
          </div>
        )}

<p style={{color:"#999"}}>Note : Last 7 Days, Last 30 Days, Last 90 Days exclude today</p>
      </div>
      
      <div className="revlytic data-record-main-container">
        <div className="revlytic data-records-main">
          <Card title="Recurring Revenue">
            {storeDetails?.currency_code && (
              <div className="data-record-content">
                <p>
                  {storeDetails?.currency_code +
                   thousandsSeparator(parseFloat(recurringRevenue)?.toFixed(2))}
                </p>

                <p>
                  {range == "last7Days"
                    ? "Last 7 Days "
                    : range == "last30Days"
                    ? "Last 30 Days"
                    : range == "last90Days"
                    ? "Last 90 Days"
                    : range == "yesterday"
                    ? "Yesterday"
                    : range == "today"
                    ? "Today"
                    : range == "customRange"
                    ? startDate + " " + "To" + " " + endDate
                    : range == "customDate"
                    ? customDate
                    : ""}
                </p>
              </div>
            )}
          </Card>
          <Card title="Subscription Bookings">
            <div className="data-record-content">
              <p>{subscriptionBookings}</p>
              <p>
                {range == "last7Days"
                  ? "Last 7 Days "
                  : range == "last30Days"
                  ? "Last 30 Days"
                  : range == "last90Days"
                  ? "Last 90 Days"
                  : range == "yesterday"
                  ? "Yesterday"
                  : range == "today"
                  ? "Today"
                  : range == "customRange"
                  ? startDate + " " + "To" + " " + endDate
                  : range == "customDate"
                  ? customDate
                  : ""}
              </p>
            </div>
          </Card>
          <Card title="Active Customers">
            <div className="data-record-content">
              <p>{activeCustomers}</p>
              <p>
                {range == "last7Days"
                  ? "Last 7 Days "
                  : range == "last30Days"
                  ? "Last 30 Days"
                  : range == "last90Days"
                  ? "Last 90 Days"
                  : range == "yesterday"
                  ? "Yesterday"
                  : range == "today"
                  ? "Today"
                  : range == "customRange"
                  ? startDate + " " + "To" + " " + endDate
                  : range == "customDate"
                  ? customDate
                  : ""}
              </p>
            </div>
          </Card>

          {/* <Card title="Upcoming Revenue">
            <div className="data-record-content">
              <p>rs 20</p>
              <p>dfsdfsdf</p>
            </div>
          </Card> */}
        </div>
      </div>

      <div className="revlytic checklist-infolist-main">
        <div className="tabs-checklist-first-column">
        <Card className="revlytic checklist-first-column">
          <div className="revlytic chekclist-greeeting-section">
            <h3> Hi {storeDetails?.store_name}.</h3>
            <h5>
              {" "}
              Welcome to Revlytic! We’re thankful to have you as a customer and strive to bring you the best tools to help grow your business. We’ve prepared this checklist as a guide to get you started with Revlytic!

            </h5>
            <Tabs
              className="revlytic order-main-tabs checklist"
              defaultActiveKey="1"
              items={items}
            />
          </div>
        </Card> 

        <div className="revlytic-ann_wrapper">
      <Tabs defaultActiveKey="1" items={newItems} />
      </div>
        
          </div>
        <div className="revlytic checklist-second-column">
        <Card>
          <div className="revlytic-checklist-second-content">
            {/* <p>
              {" "}
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 0.918762C3.58 0.918762 0 4.49876 0 8.91876C0 13.3388 3.58 16.9188 8 16.9188C12.42 16.9188 16 13.3388 16 8.91876C16 4.49876 12.42 0.918762 8 0.918762ZM8.8 14.5188H7.2V12.9188H8.8V14.5188ZM10.452 8.32276L9.736 9.05876C9.16 9.63476 8.8 10.1188 8.8 11.3188H7.2V10.9188C7.2 10.0348 7.56 9.23476 8.136 8.65476L9.132 7.64676C9.42 7.35876 9.6 6.95876 9.6 6.51876C9.6 5.63476 8.884 4.91876 8 4.91876C7.116 4.91876 6.4 5.63476 6.4 6.51876H4.8C4.8 4.75076 6.232 3.31876 8 3.31876C9.768 3.31876 11.2 4.75076 11.2 6.51876C11.2 7.22276 10.916 7.85876 10.452 8.32276Z"
                  fill="#888888"
                />
              </svg>
              Help Docs
            </p> */}
            {/* <p>
              <svg
                width="17"
                height="12"
                viewBox="0 0 17 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.6155 2.60726C16.486 2.52948 16.3386 2.49019 16.1905 2.49019C16.0666 2.49019 15.9428 2.51769 15.8286 2.57269L13.7619 3.57605V3.27591C13.7619 1.97633 12.6723 0.918762 11.3333 0.918762H2.42857C1.08962 0.918762 0 1.97633 0 3.27591V9.56162C0 10.8612 1.08962 11.9188 2.42857 11.9188H11.3333C12.6723 11.9188 13.7619 10.8612 13.7619 9.56162V9.26148L15.8286 10.264C15.9428 10.3198 16.0666 10.3473 16.1905 10.3473C16.3386 10.3473 16.486 10.308 16.6155 10.2303C16.8543 10.0865 17 9.83426 17 9.56162V3.27591C17 3.00326 16.8543 2.75105 16.6155 2.60726ZM4.04762 7.59733C3.37652 7.59733 2.83333 7.07012 2.83333 6.41876C2.83333 5.76741 3.37652 5.24019 4.04762 5.24019C4.71871 5.24019 5.2619 5.76741 5.2619 6.41876C5.2619 7.07012 4.71871 7.59733 4.04762 7.59733Z"
                  fill="#888888"
                />
              </svg>
              Video Tutorials
            </p> */}
            <p>
              <svg
                width="16"
                height="13"
                viewBox="0 0 16 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.3333 0.918762H2.66667C1.2 0.918762 0 2.11876 0 3.58543V10.2521C0 11.7188 1.2 12.9188 2.66667 12.9188H13.3333C14.8 12.9188 16 11.7188 16 10.2521V3.58543C16 2.11876 14.8 0.918762 13.3333 0.918762ZM14.4 4.78543L9.13333 8.31876C8.8 8.51876 8.4 8.6521 8 8.6521C7.6 8.6521 7.2 8.51876 6.86667 8.31876L1.6 4.78543C1.33333 4.58543 1.26667 4.18543 1.46667 3.8521C1.66667 3.58543 2.06667 3.51876 2.4 3.71876L7.66667 7.2521C7.86667 7.38543 8.2 7.38543 8.4 7.2521L13.6667 3.71876C14 3.51876 14.4 3.58543 14.6 3.91876C14.7333 4.18543 14.6667 4.58543 14.4 4.78543Z"
                  fill="#888888"
                />
              </svg>
              <Link onClick={()=>navigate('/contactus')} >support@revlytic.co</Link>
            </p>
          </div>
         
        </Card>
        <Card className="revlytic-timeline-wrapper">
          <h2>Latest Updates </h2>
          <h3> January 2024</h3>
        <Timeline
          items={[
            // {
            //   children: 'Revlytic Is Now Live!',
            // },
            {
              children: 'Quick Create - Manual Subscription',
            },
            {
              children: 'Quick Create - Subscription Plans',
            },
            {
              children: 'Manage Plans',
            },

            {

             children:'Subscription Management',              
            },
            {
              children:'Subscription Widget',
            },
            {
              children:'Customer Portal'
            },
            {
              children:'Email Templates & Invoice'
            }
          ]}
        />
        </Card>
      </div>
      </div>

     


    </Spin>
  );
}

export default Home;
