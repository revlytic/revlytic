import React, { useState, useEffect } from "react";
import { Table, Input, Pagination, Button, Modal, Spin, Select,Empty } from "antd";
import { EyeOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "@shopify/app-bridge-react";
import postApi from "../components/common/postApi";
import { toast } from "react-toastify";
import { useAPI } from "../components/common/commonContext";
const SubscriptionList = () => {
  const navigate = useNavigate();
  const app = useAppBridge();

  const [subscriptionList, setSubscriptionList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedListType, setSelectedListType] = useState("all");
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [pageSize, setPageSize] = useState(10);
  // const pageSize = 10;


  // useEffect(() => {
  //   filterProducts(searchText);
  // }, [searchText]);

 const {storeName,storeDetails}=useAPI()

  useEffect(async() => {
    getSubscriptionList("all");
  //  await   postApi('/api/admin/demo',{},app) ;

  }, []);

  const handleListChange = (e) => {
    setSelectedListType(e);
    getSubscriptionList(e);
  };
  const getSubscriptionList = async (option) => {
    setLoader(true);
    let response = await postApi(
      "/api/admin/getSubscriptionList",
      { listType: option },
      app
    );
    if (response?.data?.message == "success") {
      setSubscriptionList(response?.data?.data);
      // console.log("checkkkkkkkkkk", response?.data?.data);
      setFilteredList(response?.data?.data);
    } else {
      toast.error(response?.data?.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setSubscriptionList([]);

      setFilteredList([]);
    }
    setLoader(false);
  };


  // const getSearchedData = (value) => {
  //   console.log("value",value)
  //   // let inputValue=value.trim()
  //   const filtered = subscriptionList.filter((item) => {
  //     let a = Object.values(item).some(
  //       (val) =>{ console.log("val",val)
  //        return val && val.toString().toLowerCase().includes((value.trim().toLowerCase()))
       
  //       }
  //     );
  //     console.log("first", value, item);
  //     console.log("dddd", a);
  //     return a;
  //   });
  //   console.log("clllf", filtered);
  //   setFilteredList(filtered);
  //   setCurrentPage(1);
  // };

  const getSearchedData = (value) => {
    console.log("value",value)
  const filtered = subscriptionList.filter((item) => {

    const numericId = item.subscription_id.match(/\d+/)[0];



    const dateString1 = item?.nextBillingDate;
    // const dateString2 = item?.createdAt;

    const date1 = new Date(dateString1);
    // const date2 = new Date(dateString2);



    const options = { year: "numeric", month: "long", day: "numeric" };

    const formattedDate1 = date1.toLocaleDateString("en-US", options);
    // const formattedDate2 = date2.toLocaleDateString("en-US", options);

  


  //   // Check if any of the properties include the search term

    return (

       numericId.includes(value) ||
      item?.fullName?.toLowerCase().includes(value.toLowerCase())||
      item?.planType?.toLowerCase().includes(value.toLowerCase())||
      item?.type?.toLowerCase().includes(value.toLowerCase())|| 
      formattedDate1?.toLowerCase()?.includes(value.toLowerCase()) ||
      // formattedDate2?.toLowerCase()?.includes(value.toLowerCase()) ||
      item?.status?.toLowerCase()?.includes(value.toLowerCase())
  

    );

  });

  setFilteredList(filtered);
  setCurrentPage(1);
};



  const handleSearch = (e) => {
    setSearchText(e.target.value);
    getSearchedData(e.target.value);
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = filteredList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  return (
    <Spin spinning={loader} size="large" tip="Loading...">
        <div className="revlytic plan-group-listing-button">

<h1 className="revlytic-plan-switch-heading">Subscriptions</h1>



  {/* <a onClick={() => setIsModalOpen(true)}> </a> */}

 

</div>
      <div className="revltic-planlist subscription-list">
        {/* <div style={{textAlign:"right"}}>
      <Button
        
          onClick={() => navigate("/createsubscription")}
        >
          Add New Subscription
          </Button>
          </div> */}
    <p> <strong>Note:</strong> This page shows a listing of all executed subscriptions, whether they were customer generated Subscription Plans or Manual Subscriptions that you created for your customers.</p>
          
        <div className="search-container">
        <div className="revlytic show-entries">
            <p>Show Entries</p>
            <Input
              type="number"
              min={1}
              value={pageSize}
              onChange={(e) =>
                e.target.value < 1 ? 1 : setPageSize(e.target.value)
              }
              />
              </div>

          <Input
            prefix={<SearchOutlined />}
            placeholder="Search Subscriptions"
            value={searchText}
            onChange={handleSearch}
          />


          <Select
            style={{ width: "180px" }}
            value={selectedListType}
            onChange={handleListChange}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="subscriptions">Subscriptions</Select.Option>
            <Select.Option value="manual_subscriptions">
              Manual Subscriptions
            </Select.Option>
          </Select>
          <div style={{textAlign:"right"}}>
      <Button
        
        onClick={() => navigate(`/createsubscription`)}
        >
          Add New Subscription
          </Button>
          </div>
        </div>
{paginatedData.length > 0 ? <div className="responsive-table-forAll-screen">
        <ul className="responsive-table">
          <li className="table-header">
            <div className="revlytic-subscription-list-header1">Subscription ID</div>
            <div className="revlytic-subscription-list-header2">Customer Name</div>
            <div className="revlytic-subscription-list-header3">Subscription Type</div>
            {/* <div className="revlytic-subscription-list-header5">Created Date</div> */}
            <div className="revlytic-subscription-list-header4">Next Order Date</div>
            <div className="revlytic-subscription-list-header6">Plan Type</div>
            <div className="status">Status</div>
            <div className="view">Manage</div>
          </li>
          {paginatedData.map((item) => {
            return (
              <li>
                <div className="revlytic-subscription-list-header1" onClick={() =>
                      navigate(
                        `/create-manual-subscription?id=${(item?.subscription_id)
                          .split("/")
                          .at(-1)}&&mode=edit`
                      )
                    }>
              <p>   {(item?.subscription_id).split("/").at(-1)} </p>
                </div>
                <div className="revlytic-subscription-list-header2"><a  target="_blank"
                    href={
                      `https://admin.shopify.com/store/${storeDetails?.shop?.split(".myshopify.com")[0]}/customers/` +
                      item?.customerId?.split("/").at(-1)
                    // } ><p>{item?.firstName ? item?.firstName :"" } {item?.lastName ? item?.lastName :""}</p></a></div>
                  } ><p>{item?.fullName ? item?.fullName :"" } </p></a></div>
                <div className="revlytic-subscription-list-header3">{item.createdBy=="merchant" ? "Manual Subscription" : "Subscription"}</div>
                {/* <div className="revlytic-subscription-list-header5"><p>{dateConversion(item?.createdAt)}</p></div> */}
                <div className="revlytic-subscription-list-header4"><p>{dateConversion(item?.nextBillingDate)}</p></div>
                <div className="revlytic-subscription-list-header6"><p>{item?.planType=="payAsYouGo" ? "Pay As You Go"  : item?.planType.charAt(0).toUpperCase() + item?.planType?.slice(1).toLowerCase()}</p></div>
                <div className={item?.status?.toLowerCase()=="active" ? "revlytic list-status-active" :   item?.status?.toLowerCase()=="cancelled" ? "revlytic list-status-cancel" :"revlytic list-status-others" }  ><p> {item?.status?.toLowerCase()== "cancelled" ? "Canceled" : item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1).toLowerCase()}    </p></div>
               
               
                <div className="revlytic list-actions">
                  <EyeOutlined
                    onClick={() =>
                      navigate(
                        `/create-manual-subscription?id=${(item?.subscription_id)
                          .split("/")
                          .at(-1)}&&mode=view`
                      )
                    }
                  />
                  <EditOutlined
                    onClick={() =>
                      navigate(
                        `/create-manual-subscription?id=${(item?.subscription_id)
                          .split("/")
                          .at(-1)}&&mode=edit`
                      )
                    }
                  />
                </div>
              </li>
            );
          })}
        </ul>
        </div>
        :
        <Empty/>}
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredList.length}
          onChange={handleChangePage}
          style={{ marginTop: 16, textAlign: "right" }}
        />
      </div>
    </Spin>
  );
};

export default SubscriptionList;
