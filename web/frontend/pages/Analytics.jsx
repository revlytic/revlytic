import React, { useEffect, useState } from "react";
import postApi from "../components/common/postApi";
import {
  Select,
  DatePicker,
  Card,
  Button,
  Spin,
  Tabs 
} from "antd";
import { useAppBridge } from "@shopify/app-bridge-react";
import dayjs from "dayjs";
import active from "../assets/images/active.svg";
import pause from "../assets/images/pause.svg";
import skip from "../assets/images/skip.svg";
import cancel from "../assets/images/cancel.svg";
import fail from "../assets/images/fail.svg";
import refresh from "../assets/images/refresh.svg";
import CalculateBillingUsage from "../components/calculateBillingUsage";
// import Chart from "react-apexcharts";

import ReactApexChart  from "react-apexcharts";

function Analytics() {
  const app = useAppBridge();
  const [loader, setLoader] = useState(false);
  // Initialize state for startDate and endDate

  const [startDate, setStartDate] = useState(
    dayjs().subtract(7, "day").format("YYYY-MM-DD")
  );

  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  const [customDate, setCustomDate] = useState(dayjs().format("YYYY-MM-DD"));

  const [range, setRange] = useState("last30Days");

  const [recurringRevenue, setRecurringRevenue] = useState(0);

  const [currencyConversionRates, setCurrencyConversionRates] = useState({});

  const [billingPlan, setBillingPlan] = useState("");
  const [selectedOption,setSelectedOption]=useState('overview')
  const [subscriptionsCountData, setSubscriptionsCountData] = useState([]);
  const [subscriptionsCountLineData, setSubscriptionsCountLineData] = useState([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);
  const [pausedSubscriptions, setPausedSubscriptions] = useState(0);
  const [cancelledSubscriptions, setCancelledSubscriptions] = useState(0);
  const [recurringOrders, setRecurringOrders] = useState(0);
  const [skippedOrders, setSkippedOrders] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const [revenue, setRevenue] = useState(0)
  const [averageOrderValue, setAverageOrderValue] = useState(0)

  useEffect(async () => {
    let currentDate = new Date();
    // const lineToday = `${
    //   monthNames[currentDate.getMonth()]
    // } ${currentDate.getDate()}`;
    // setSubscriptionsCountLineData([lineToday]);
    get_active_pause_cancelSubscription_count({ range: "last30Days" });
    get_reccuring_skip_failed_count({ range: "last30Days" });
    getData({ range: "last30Days" });
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const handleRangeSelection = async (e) => {
    setLoader(true)
    setRange(e);
    const currentDate = new Date();
    if (e == "customDate") {
      await Promise.all([
          get_active_pause_cancelSubscription_count({range: e, customDate}),
          get_reccuring_skip_failed_count({range: e, customDate}),
          getData({ range: e, customDate })
        ]
      );
    } else if (e == "customRange") {
      await Promise.all([
       get_active_pause_cancelSubscription_count({range: e, startDate, endDate}), 
       get_reccuring_skip_failed_count({range: e, startDate, endDate}), 
       getData({ range: e, startDate, endDate })
      ])
    } else {
      await Promise.all([
       get_active_pause_cancelSubscription_count({range:e}),
       get_reccuring_skip_failed_count({range:e}),
       getData({ range: e})
      ])
    }
    setLoader(false)
  };

  const get_active_pause_cancelSubscription_count = async (body) => {
    let response = await postApi(
      "/api/admin/get_active_pause_cancelSubscription_count",
      body,
      app
    );
    if (response?.data?.message == "success") {
      // console.log("getActivePauseCancelCount", response?.data?.data);
      setActiveSubscriptions(response?.data?.data[0]?.activeCount ?? 0);
      setPausedSubscriptions(response?.data?.data[0]?.pauseCount ?? 0);
      setCancelledSubscriptions(response?.data?.data[0]?.cancelCount ?? 0);
    }
  };

  const get_reccuring_skip_failed_count = async (body) => {
    let response = await postApi(
      "/api/admin/get_reccuring_skip_failed_count",
      body,
      app
    );
    if (response?.data?.message == "success") {
      // console.log("getActivePauseCancelCount", response?.data?.data);
      setRecurringOrders(response?.data?.data[0]?.recurringCount ?? 0);
      setSkippedOrders(response?.data?.data[0]?.skipCount ?? 0);
      setFailedAttempts(response?.data?.data[0]?.failedCount ?? 0);
    }
  };

  const getData = async (body) => { 
    // setLoader(true);
    const response = await postApi(
      "/api/admin/get_subscription_details_analytics",
      body,
      app
    );
    if (response?.data?.message == "success") {
     
      let mainData = response?.data?.data;

      let currentDate = new Date();
     
  
      // if (
      //   body.range == "last7Days" ||
      //   body.range == "last30Days" ||
      //   body.range == "yesterday" ||
      //   body.range == "today" ||
      //   body.range == "last90Days" ||
      //   body.range == "customDate" ||
      //   body.range == "customRange"
      // ) {
        let xarr = [];
        let yarr = [];
        mainData.forEach((item) => {
          let day = new Date(item._id);
          xarr.push(`${monthNames[day.getMonth()]} ${day.getDate()}`);
          yarr.push(item.count);
        });
        // console.log("yarr", yarr, xarr);
        setSubscriptionsCountLineData(xarr);
        setSubscriptionsCountData(yarr);
        // setLoader(false);
      // }
     
    }
  };

 const calculateSubscriptionsRevenue=async(body)=>{
 
let response=await postApi("/api/admin/combinedData",body,app);
if (response?.data?.message == "success") {
  let arr = response?.data?.data;
  let sum = 0;

  if (arr.length > 0) {
    let perDayRevenueArray=[];
    arr.map((item) => {
      sum =
        sum +
        parseFloat(item.total_amount) *
          parseFloat(rates[item?.currency] / rates[storeDetails?.currency]);

    });
  }

  // setRecurringRevenue(sum);

  // setSubscriptionBookings(countInitialStatus);
}

 }

 const metricItem =[
   {label : "Active Subscription" ,    value: activeSubscriptions,     icon : active},
   {label:  "Paused Subscriptions" ,   value: pausedSubscriptions,     icon : pause},
   {label : 'Cancelled Subscriptions', value : cancelledSubscriptions, icon : cancel},
   {label : 'Recurring Orders',        value : recurringOrders,        icon : refresh},
   {label : 'Skipped Orders',          value : skippedOrders,          icon : skip},
   {label : 'Failed Attempts' ,        value : failedAttempts,         icon : fail}     
]

  return (
    <Spin spinning={loader} size="large" tip="Loading...">
      {" "}
      <div
        className="revlytic daterange-section-main"
        style={{ alignItems: "center" }}
      >
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
                setLoader(true)
                setStartDate(dateString);
                // await getData({ startDate: dateString, endDate, range });
                await Promise.all([
                  get_active_pause_cancelSubscription_count({ startDate: dateString, endDate, range }),
                  get_reccuring_skip_failed_count({ startDate: dateString, endDate, range }),
                  getData({ startDate: dateString, endDate, range }),
                ])
               
                setLoader(false)
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
                setLoader(true);
                setEndDate(dateString);

                // await getData({ startDate, endDate: dateString, range });
                await Promise.all([
                  get_active_pause_cancelSubscription_count({ startDate, endDate: dateString, range }),
                  get_reccuring_skip_failed_count({ startDate, endDate: dateString, range }),
                  getData({ startDate, endDate: dateString, range }),
                ])               
                setLoader(false)
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
              onChange={async(date, dateString) => {
                setLoader(true)
                setCustomDate(dateString);
                // const dateEntered = new Date(dateString);
                // const customDate = `${
                //   monthNames[dateEntered.getMonth()]
                // } ${dateEntered.getDate()} ${dateEntered.getFullYear()}`;
                // setSubscriptionsCountLineData([customDate]);
                // getData({ customDate : dateString, range });

                await Promise.all([
                  get_active_pause_cancelSubscription_count({ customDate : dateString, range }),
                  get_reccuring_skip_failed_count({ customDate : dateString, range }),
                  getData({ customDate : dateString, range }),
                ])
                setLoader(false)
              }}
            />
          </div>
        )}

        <p>Note : Last 7 Days, Last 30 Days, Last 90 Days exclude today</p>
      </div>

{/* <div className="analytics-tab-main" ><p className="analytics-tab-item" type="dashed" onClick={()=>setSelectedOption('overview')}>Overview</p><p  className="analytics-tab-item" onClick={()=>setSelectedOption('revenue')}>Revenue</p></div> */}
 <div className="section-main"> 
      {/* <div
        style={{
          display: "flex",
          width: "70%",
          justifyContent: "space-between",
        }}
        className="analytics-card-main"
      >
        <Card title="Active Subscriptions" className="analytics-card">{activeSubscriptions}</Card>
        <Card title="Paused Subscriptions" className="analytics-card">{pausedSubscriptions}</Card>
        <Card title="Cancelled Subscriptions" className="analytics-card">{cancelledSubscriptions}</Card>
        <Card title="Recurring Orders">{recurringOrders}</Card>
        <Card title="Skipped Orders">{skippedOrders}</Card>
        <Card title="Failed Billing Attempts">{failedAttempts}</Card>
      </div> */}

      <div className="analytics-metrics-wrapper">
{ metricItem.map((item,index)=>

   <div className={`analytics-metrics-main anaylytics-metric-item-${index}`}>
    <div className="analytics-img-label">
     <img  src={item.icon} width={25} height={25}/>
     <p>{item.label}</p>
     </div>
     <p className="analytics-metric-value">{item.value}</p>
   </div> 
)
}
      </div>
      <Card className="analytics-card-chart" style={{marginTop: "20px", width : "60%"}}>
        <div>
          <ReactApexChart
            options={{
                chart: {        
                  height: "100%",
                  type: "line",
                  zoom: {
                      enabled: false,
                        },
                toolbar:false,
                animations: {
                      enabled: true,
                      easing: "easeinout",
                speed: 900,
              dynamicAnimation: {
                    enabled: true,
                  },
                },
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                width: [3, 3, 3],
                curve: "straight",
              },
              title: {
                text: "No. of Subscriptions",
                align: "left",
              },
              grid: {
                row: {
                  colors: ["#f3f3f3", "transparent"],
                  opacity: 0.8,
                },
              },

              xaxis: {
                // type: 'datetime',
                categories: subscriptionsCountLineData,
              },
              yaxis: {
                showForNullSeries: false,
                categories: subscriptionsCountData,
                forceNiceScale: true,
                min: 0,
                // tickAmount:0,
                // stepSize:1,
                labels: {
                  formatter: function (value) {
                    return Math.round(value); // Rounds to the nearest whole number
                  },
                },
              },
              legend: {
                show: true,
                position: "bottom",
                showForSingleSeries: true,
                customLegendItems: ["Time"],
                markers: {
                  fillColors: ["#249DF9"],
                },
              },
              tooltip: {
                y: [
                  {
                    title: {
                      formatter: function (val) {
                        return val;
                      },
                    },
                  },
                ],
              },
            }}
            series={[
              {
                name: "Subscriptions Count",
                data: subscriptionsCountData,
              },
            ]}
          />
        </div>
        
      </Card>
      </div> 
      <CalculateBillingUsage setBillingPlan={setBillingPlan} />
    </Spin>
  );
}

export default Analytics;
