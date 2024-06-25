import React, { useEffect, useState } from "react";
import { Tabs, Button, Spin, Empty, Tooltip } from "antd";
import postApi from "../common/postApi";
import { Link, useNavigate } from "react-router-dom";
import { useAPI } from "../common/commonContext";
import { useAppBridge } from "@shopify/app-bridge-react";
import { toast } from "react-toastify";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

function Orders({
  data,
  upcomingOrders,
  attemptedOrders,
  fetchDataUpcomingOrders,
  setLoader,
  storeDetails,
  setExistingSubscription,
  setNextBillingDate,
  pastOrders,
  skippedOrders,
  mode,
  billingPlan,
}) {
  const navigate = useNavigate();
  const { storeName } = useAPI();
  const app = useAppBridge();
  const [showOrders, setShowOrders] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (data?.status?.toLowerCase() == "active") {
      setShowOrders(upcomingOrders.slice(0, 10));
    } else {
      setShowOrders(pastOrders.slice(0, 10));
    }
  }, [upcomingOrders, data?.status]);

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

  const dateChange = (type, originalDate, value) => {
    if (type.toLowerCase() === "day") {
      let nextDate = new Date(originalDate);
      nextDate.setDate(nextDate.getDate() + 1 * parseInt(value));
      return nextDate;
    } else if (type.toLowerCase() === "month") {
      let nextDate = new Date(originalDate);
      nextDate.setMonth(nextDate.getMonth() + 1 * parseInt(value));
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

  const handleOrderNow = async (renewal_date) => {
    setLoader(true);
    if (
      new Date(data?.nextBillingDate).getTime() ===
      new Date(renewal_date).getTime()
    ) {
      let nextDate;
      let value =
        data.subscription_details.planType == "payAsYouGo"
          ? data.subscription_details.billingLength
          : data.subscription_details.delivery_billingValue;
      let type = data.subscription_details.delivery_billingType;
      nextDate = dateChange(type, data?.nextBillingDate, value).toISOString();
      let flag = false;
      while (flag == false) {
        let existingAlready = attemptedOrders.find(
          (item) =>
            new Date(item.renewal_date).getTime() ===
            new Date(nextDate).getTime()
        );
        if (!existingAlready) {
          flag = true;
        } else {
          nextDate = dateChange(type, nextDate, value).toISOString();
        }
      }
      let bodyData = {
        data: data,
        renewal_date: renewal_date,
        nextBillingDate: nextDate,
      };
      let response = await postApi("/api/admin/orderNow", bodyData, app);
      if (response?.data?.message == "success") {
        fetchDataUpcomingOrders({ ...data, nextBillingDate: nextDate });
        setExistingSubscription({ ...data, nextBillingDate: nextDate });
        setNextBillingDate(nextDate);
      }
    } else {
      let bodyData = { data: data, renewal_date: renewal_date };
      let response = await postApi("/api/admin/orderNow", bodyData, app);
      if (response?.data?.message == "success") {
        fetchDataUpcomingOrders(data);
      }
    }
    setLoader(false);
  };

  const handleSkipOrder = async (renewal_date) => {
    setLoader(true);

    if (
      new Date(data?.nextBillingDate).getTime() ===
      new Date(renewal_date).getTime()
    ) {
      let nextDate;
      let value =
        data.subscription_details.planType == "payAsYouGo"
          ? data.subscription_details.billingLength
          : data.subscription_details.delivery_billingValue;
      let type = data.subscription_details.delivery_billingType;
      nextDate = dateChange(type, data?.nextBillingDate, value).toISOString();

      let existingAlready = attemptedOrders.find(
        (item) =>
          new Date(item.renewal_date).getTime() === new Date(nextDate).getTime()
      );

      let flag = false;
      while (flag == false) {
        let existingAlready = attemptedOrders.find(
          (item) =>
            new Date(item.renewal_date).getTime() ===
            new Date(nextDate).getTime()
        );

        if (!existingAlready) {
          flag = true;
        } else {
          nextDate = dateChange(type, nextDate, value).toISOString();
        }
      }

      let bodyData = {
        data: data,
        renewal_date: renewal_date,
        nextBillingDate: nextDate,
      };

      let response = await postApi("/api/admin/skipOrder", bodyData, app);

      if (response?.data?.message == "success") {
        setExistingSubscription({ ...data, nextBillingDate: nextDate });
        fetchDataUpcomingOrders({ ...data, nextBillingDate: nextDate });

        setNextBillingDate(nextDate);
      }
    } else {
      let bodyData = { data: data, renewal_date: renewal_date };

      let response = await postApi("/api/admin/skipOrder", bodyData, app);

      if (response?.data?.message == "success") {
        fetchDataUpcomingOrders(data);
      }
    }

    setLoader(false);
  };

  const handleRetry = async (renewal_date, idempotencyKey) => {
    setLoader(true);
    let response = await postApi(
      "/api/admin/retryFailedOrder",
      {
        renewal_date,
        idempotencyKey,
        product_details: data?.product_details,
        subscription_id: data.subscription_id,
      },
      app
    );

    if (response?.data?.message == "success") {
      fetchDataUpcomingOrders(data);
    }
    setLoader(false);
  };

  const pastAndSkippedItems = [
    {
      key: "1",
      label: `Completed Orders`,
      children: (
        <section id="PastOrders" className="tab-panel">
          <div className="revlytic upcoming-orders-main">
            <h4 className="revlytic completed-orders-header">Order Date</h4>
            <h4 className="revlytic completed-orders-header">Order Number</h4>
          </div>
          {showOrders.length > 0 ? (
            showOrders.map((item, index) => {
              return (
                <div className="order-conformation-inner" key={index}>
                  <div className="order-date">
                    <h5>
                      {convertUTCToTimeZone(
                        item.renewal_date,
                        storeDetails?.timeZone
                      )}
                    </h5>
                  </div>

                  <div className="order-status">
                    <a
                      target="_blank"
                      href={
                        `https://admin.shopify.com/store/${storeName}/orders/` +
                        item?.order_id?.split("/").at(-1)
                      }
                    >
                      {item?.order_no}
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <Empty />
          )}
          {showOrders.length > 0 && (
            <div className="revlytic-previousbtn-orders">
              <Button
                disabled={index == 0}
                onClick={() => handlePrevious(pastOrders)}
              >
                <ArrowLeftOutlined />
              </Button>
              <Button
                onClick={() => handleNext(pastOrders)}
                disabled={index + 10 > pastOrders.length}
              >
                <ArrowRightOutlined />
              </Button>
            </div>
          )}
        </section>
      ),
    },
    {
      key: "2",
      label: `Skipped Orders`,
      children: (
        <section id="PastOrders" className="tab-panel">
          <div className="revlytic upcoming-orders-main">
            <h4 className="revlytic skipped-orders-header">Order Date</h4>
          </div>
          {skippedOrders.length > 0 ? (
            skippedOrders.map((item, index) => {
              return (
                <div className="order-conformation-inner" key={index}>
                  <div className="order-date">
                    <h5>
                      {convertUTCToTimeZone(
                        item.renewal_date,
                        storeDetails?.timeZone
                      )}
                    </h5>
                  </div>
                </div>
              );
            })
          ) : (
            <Empty />
          )}
          {showOrders.length > 0 && (
            <div className="revlytic-previousbtn-orders">
              <Button
                disabled={index == 0}
                onClick={() => handlePrevious(skippedOrders)}
              >
                <ArrowLeftOutlined />
              </Button>
              <Button
                onClick={() => handleNext(skippedOrders)}
                disabled={index + 10 > skippedOrders.length}
              >
                <ArrowRightOutlined />
              </Button>
            </div>
          )}
        </section>
      ),
    },
  ];

  const handleNext = (type) => {
    setIndex(index + 10);
    setShowOrders(type.slice(index + 10, index + 20));
  };

  const handlePrevious = (type) => {
    setIndex(index - 10);
    setShowOrders(type.slice(index - 10, index));
  };

  const items = [
    {
      key: "1",
      label: `Upcoming Orders`,
      children:
        data != {} && data.subscription_details ? (
          data.subscription_details.planType == "payAsYouGo" ? (
            <section id="UpcomingOrders" className="tab-panel">
              <div className="revlytic upcoming-orders-main">
                <h4 className="revlytic upcoming-orders-header">Order Date</h4>
                <h4 className="revlytic upcoming-orders-status">Status</h4>
                <h4 className="revlytic upcoming-orders-manage">Manage</h4>
              </div>
              {showOrders.length > 0 ? (
                showOrders.map((item, index) => {
                  return (
                    <div className="order-conformation-inner" key={index}>
                      <div className="order-date">
                        <h5>
                          {convertUTCToTimeZone(
                            item.renewal_date,
                            storeDetails?.timeZone
                          )}
                        </h5>
                      </div>
                      <div className="order-status">
                        <h5>
                          {item.status == "success" ||
                          item.status == "initial" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                            >
                              <circle
                                cx="3.85848"
                                cy="3.88357"
                                r="3.74715"
                                fill="#3EBE62"
                              />
                            </svg>
                          ) : item.status == "pending" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                            >
                              <circle
                                cx="3.85848"
                                cy="3.88357"
                                r="3.74715"
                                fill="#F39C44"
                              />
                            </svg>
                          ) : item.status == "upcoming" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                            >
                              <circle
                                cx="3.85848"
                                cy="3.88357"
                                r="3.74715"
                                fill="#00a49c"
                              />
                            </svg>
                          ) : item.status == "skipped" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                            >
                              <circle
                                cx="3.85848"
                                cy="3.88357"
                                r="3.74715"
                                fill="#2b90ae"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                            >
                              <circle
                                cx="3.85848"
                                cy="3.88357"
                                r="3.74715"
                                fill="#FF0000"
                              />
                            </svg>
                          )}

                          {item.status == "upcoming"
                            ? "Queued"
                            : item.status == "pending"
                            ? "Pending"
                            : item.status == "failed"
                            ? "Failed"
                            : ""}
                        </h5>
                      </div>
                      <div className="order-now-and-skip">
                        {item.status == "upcoming" ? (
                          <div className="order-inner">
                            <Tooltip
                              color="#ffffff"
                              title={
                                billingPlan != "starter" &&
                                billingPlan != "premium" &&
                                billingPlan != "premiere" ? (
                                  <Link to={`/billing?option=earlyAttempt`}>
                                    Upgrade your Plan
                                  </Link>
                                ) : (
                                  ""
                                )
                              }
                            >
                              <Button
                                onClick={() =>
                                  handleOrderNow(item.renewal_date)
                                }
                                disabled={
                                  (billingPlan != "starter" &&
                                    billingPlan != "premium" &&
                                    billingPlan != "premiere") ||
                                  mode == "view"
                                }
                              >
                                Order Now
                              </Button>
                            </Tooltip>
                            <Tooltip
                              color="#ffffff"
                              title={
                                billingPlan != "starter" &&
                                billingPlan != "premium" &&
                                billingPlan != "premiere" ? (
                                  <Link to={`/billing?option=skipOrders`}>
                                    Upgrade your Plan
                                  </Link>
                                ) : (
                                  ""
                                )
                              }
                            >
                              <Button
                                onClick={() =>
                                  handleSkipOrder(item.renewal_date)
                                }
                                disabled={
                                  (billingPlan != "starter" &&
                                    billingPlan != "premium" &&
                                    billingPlan != "premiere") ||
                                  mode == "view"
                                }
                              >
                                Skip Order
                              </Button>
                            </Tooltip>
                          </div>
                        ) : item.status == "failed" ? (
                          <Button
                            onClick={() =>
                              handleRetry(
                                item.renewal_date,
                                item.idempotencyKey
                              )
                            }
                            disabled={
                              (billingPlan != "starter" &&
                                billingPlan != "premium" &&
                                billingPlan != "premiere") ||
                              mode == "view"
                            }
                          >
                            Retry
                          </Button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <Empty />
              )}
              {showOrders.length > 0 && (
                <div className="revlytic-previousbtn-orders">
                  <Button
                    disabled={index == 0}
                    onClick={() => handlePrevious(upcomingOrders)}
                  >
                    <ArrowLeftOutlined />
                  </Button>
                  <Button
                    onClick={() => handleNext(upcomingOrders)}
                    disabled={index + 10 > upcomingOrders.length}
                  >
                    <ArrowRightOutlined />
                  </Button>
                </div>
              )}
            </section>
          ) : (
            ""
          )
        ) : (
          ""
        ),
    },

    {
      key: "2",
      label: `Completed Orders`,
      children: (
        <section id="PastOrders" className="tab-panel">
          <div className="revlytic upcoming-orders-main">
            <h4 className="revlytic completed-orders-header">Order Date</h4>
            <h4 className="revlytic completed-orders-header">Order Number</h4>
          </div>
          {showOrders.length > 0 ? (
            showOrders.map((item, index) => {
              return (
                <div className="order-conformation-inner" key={index}>
                  <div className="order-date">
                    <h5>
                      {convertUTCToTimeZone(
                        item.renewal_date,
                        storeDetails?.timeZone
                      )}
                    </h5>
                  </div>

                  <div className="order-status">
                    <a
                      target="_blank"
                      href={
                        `https://admin.shopify.com/store/${storeName}/orders/` +
                        item?.order_id?.split("/").at(-1)
                      }
                    >
                      {item?.order_no}
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <Empty />
          )}
          {showOrders.length > 0 && (
            <div className="revlytic-previousbtn-orders">
              <Button
                disabled={index == 0}
                onClick={() => handlePrevious(pastOrders)}
              >
                <ArrowLeftOutlined />
              </Button>
              <Button
                onClick={() => handleNext(pastOrders)}
                disabled={index + 10 > pastOrders.length}
              >
                <ArrowRightOutlined />
              </Button>
            </div>
          )}
        </section>
      ),
    },
    {
      key: "3",
      label: `Skipped Orders`,
      children: (
        <section id="PastOrders" className="tab-panel">
          <div className="revlytic upcoming-orders-main">
            <h4 className="revlytic skipped-orders-header">Order Date</h4>
          </div>
          {showOrders.length > 0 ? (
            showOrders.map((item, index) => {
              return (
                <div className="order-conformation-inner" key={index}>
                  <div className="order-date">
                    <h5>
                      {convertUTCToTimeZone(
                        item.renewal_date,
                        storeDetails?.timeZone
                      )}
                    </h5>
                  </div>
                </div>
              );
            })
          ) : (
            <Empty />
          )}
          {showOrders.length > 0 && (
            <div className="revlytic-previousbtn-orders">
              <Button
                disabled={index == 0}
                onClick={() => handlePrevious(skippedOrders)}
              >
                <ArrowLeftOutlined />
              </Button>
              <Button
                onClick={() => handleNext(skippedOrders)}
                disabled={index + 10 > skippedOrders.length}
              >
                <ArrowRightOutlined />
              </Button>
            </div>
          )}
        </section>
      ),
    },
  ];

  return (
    <Tabs
      className="revlytic order-main-tabs"
      defaultActiveKey="1"
      items={
        data?.status?.toLowerCase() == "active" ? items : pastAndSkippedItems
      }
      onChange={(activeTab) => {
        setIndex(0);
        if (data?.status?.toLowerCase() == "active") {
          activeTab == 1
            ? setShowOrders(upcomingOrders.slice(0, 10))
            : activeTab == 2
            ? setShowOrders(pastOrders.slice(0, 10))
            : setShowOrders(skippedOrders.slice(0, 10));
        } else {
          activeTab == 1
            ? setShowOrders(pastOrders.slice(0, 10))
            : setShowOrders(skippedOrders.slice(0, 10));
        }
      }}
    />
  );
}

export default Orders;
