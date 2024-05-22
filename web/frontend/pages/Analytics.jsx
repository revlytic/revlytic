import React, { useEffect, useState } from "react";
import postApi from "../components/common/postApi";
import {
  Select,
  DatePicker,
  Card,
  Button,
  Spin,
  Tabs,
 
} from "antd";
import { useAppBridge } from "@shopify/app-bridge-react";
import dayjs from "dayjs";
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

  const [range, setRange] = useState("today");

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
    const lineToday = `${
      monthNames[currentDate.getMonth()]
    } ${currentDate.getDate()}`;
    setSubscriptionsCountLineData([lineToday]);
    get_active_pause_cancelSubscription_count({ range: "last30Days" });
    get_reccuring_skip_failed_count({ range: "last30Days" });
    getData({ range: "today" });
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
    setRange(e);

    const currentDate = new Date();

    if (e == "customDate") {
      await getData({ range: e, customDate });
    } else if (e == "customRange") {
      await getData({ range: e, startDate, endDate });
    } else {
      await getData({ range: e });
    }
  };

  const get_active_pause_cancelSubscription_count = async (body) => {
    let response = await postApi(
      "/api/admin/get_active_pause_cancelSubscription_count",
      body,
      app
    );
    if (response?.data?.message == "success") {
      // console.log("getActivePauseCancelCount", response?.data?.data);
      setActiveSubscriptions(response?.data?.data[0]?.activeCount);
      setPausedSubscriptions(response?.data?.data[0]?.pauseCount);
      setCancelledSubscriptions(response?.data?.data[0]?.cancelCount);
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
      setRecurringOrders(response?.data?.data[0]?.recurringCount);
      setSkippedOrders(response?.data?.data[0]?.skipCount);
      setFailedAttempts(response?.data?.data[0]?.failedCount);
    }
  };

  const getData = async (body) => {
    setLoader(true);
    const response = await postApi(
      "/api/admin/get_subscription_details_analytics",
      body,
      app
    );
    if (response?.data?.message == "success") {
     
      let mainData = response?.data?.data;

      let currentDate = new Date();
      let last7DaysObj = {};
      for (let i = 1; i <= 7; i++) {
        last7DaysObj[currentDate.getDate() - i] = 0;
      }
  
      if (
        body.range == "last7Days" ||
        body.range == "last30Days" ||
        body.range == "yesterday" ||
        body.range == "today" ||
        body.range == "last90Days" ||
        body.range == "customDate"
      ) {
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
        setLoader(false);
      }
     
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
                setStartDate(dateString);
                await getData({ startDate: dateString, endDate, range });
                // await getActiveCustomers({
                //   startDate: dateString,
                //   endDate,
                //   range,
                // });
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

                await getData({ startDate, endDate: dateString, range });
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
                setCustomDate(dateString);
                const dateEntered = new Date(dateString);
                const customDate = `${
                  monthNames[dateEntered.getMonth()]
                } ${dateEntered.getDate()} ${dateEntered.getFullYear()}`;
                setSubscriptionsCountLineData([customDate]);
                getData({ customDate: dateString, range });
              }}
            />
          </div>
        )}

        <p>Note : Last 7 Days, Last 30 Days, Last 90 Days exclude today</p>
      </div>

<div className="analytics-tab-main" ><p className="analytics-tab-item" type="dashed" onClick={()=>setSelectedOption('overview')}>Overview</p><p  className="analytics-tab-item" onClick={()=>setSelectedOption('revenue')}>Revenue</p></div>
 { selectedOption == 'overview' && <div className="section-main"> 
      <div
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
      </div>
      
      <Card className="analytics-card-chart" style={{ width: "55%", marginTop: "10px" }}>
        <ReactApexChart
          options={{
            chart: {
              height: 350,
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
      </Card>
      </div> }

{
  selectedOption=='revenue' &&
<div className="section-main">

<div
        style={{
          display: "flex",
          width: "70%",
          justifyContent: "space-between",
        }}
        className="analytics-card-main"
      >
        <Card title="Active Subscriptions" className="analytics-card">{revenue}</Card>
        <Card title="Paused Subscriptions" className="analytics-card">{averageOrderValue}</Card>
      </div>
</div>
}

    </Spin>
  );
}

export default Analytics;
