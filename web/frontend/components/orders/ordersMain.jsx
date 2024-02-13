import React, { useEffect, useState } from "react";

import { Tabs, Button, Spin, Empty, Tooltip } from "antd";
import postApi from "../common/postApi";
import { Link, useNavigate } from "react-router-dom";
import { useAPI } from "../common/commonContext";
import { useAppBridge } from "@shopify/app-bridge-react";
import { toast } from "react-toastify";
           
function Orders({ data, upcomingOrders,attemptedOrders ,fetchDataUpcomingOrders,setLoader,storeDetails,setExistingSubscription,setNextBillingDate,pastOrders,skippedOrders,mode,billingPlan}) {
  const navigate = useNavigate();
  const { storeName } = useAPI();
  const app = useAppBridge();

  // const [pastOrders, setPastOrders] = useState([]);
  // const [skippedOrders, setSkippedOrders] = useState([]);
  // const [ordersLoader,setOrdersLoader]=useState(false)
  useEffect(async () => {
    if (data) {
      console.log("usefectdata", data);
    }
  }, []);

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
    const options = { timeZone, year: 'numeric', month: 'long', day: 'numeric' };
    const localDate = utcDate.toLocaleString('en-US', options);

// // Split the date string into parts
// const dateParts = localDate.split(' ');

// // Capitalize the first letter of the month
// dateParts[1] = dateParts[1].charAt(0).toUpperCase() + dateParts[1].slice(1);

// // Join the modified parts back into a single string
// localDate = dateParts.join(' ');

    return localDate;
}


// const timeZone = "America/New_York";         // Replace this with your desired time zone




  const dateChange=(type,originalDate,value)=>{
    console.log("datechange",type,originalDate,)
  
  if (
  type.toLowerCase() ===
  "day"
  ) {
  let nextDate = new Date(originalDate);
  nextDate.setDate(nextDate.getDate() + 1 * parseInt(value));
  
  return nextDate;
  } else if (
  type.toLowerCase() ===
  "month"
  ) {
  let nextDate = new Date(originalDate);
  nextDate.setMonth(nextDate.getMonth() + 1 * parseInt(value));
  console.log("typedtaechekcc",typeof nextDate)
  return nextDate;
  } else if (
  type.toLowerCase() ===
  "week"
  ) {
  let  nextDate = new Date(originalDate);
  nextDate.setDate(nextDate.getDate() + (7  * parseInt(value)));
  return nextDate;
  } else if (
  type.toLowerCase() ===
  "year"
  ) {
  let nextDate = new Date(originalDate);
  nextDate.setFullYear(nextDate.getFullYear() + 1 * parseInt(value)) ;
  return nextDate;
  }
  
  }

  // const handleOrderNow = async (index) => {
  //   console.log("click in handleordernow", index);

  //   let renewalDate = dateChange(
  //     data?.subscription_details?.delivery_billingType,
  //     data?.nextBillingDate,
  //     index,
  //     data?.subscription_details?.delivery_billingValue
  //   );

  //   let response = await postApi(
  //     "/api/admin/orderNow",
  //     { data: data, index: index, renewalDate: renewalDate },
  //     app
  //   );
  // };

  const handleOrderNow = async (renewal_date) => {
    console.log("click in handleordernow", );
setLoader(true)


    if(new Date(data?.nextBillingDate).getTime() === new Date(renewal_date).getTime()){
      console.log("mohalitowerrr")
      let nextDate;
      let value =data.subscription_details.planType=="payAsYouGo" ? data.subscription_details.billingLength :data.subscription_details.delivery_billingValue
      let type=data.subscription_details.delivery_billingType
      
      // console.log(value,data?.nextBillingDate,type)
      
  nextDate= dateChange(type,data?.nextBillingDate,value).toISOString()
       console.log("early",nextDate)
       console.log("attemptedOrders",attemptedOrders)

// console.log("existingAlready",existingAlready)
let flag=false
  while(flag==false) {
    
    console.log("in  while",nextDate)
    let existingAlready=attemptedOrders.find(item=> new Date(item.renewal_date).getTime() === new Date(nextDate).getTime())
       
if(!existingAlready){
     flag=true
}
  else{
      nextDate= dateChange(type,nextDate,value).toISOString()
  }// console.log("nexttdate",nextDate,q=q+1)

  }

 let bodyData={data: data, renewal_date: renewal_date,nextBillingDate:nextDate}
   console.log("hmmmkkkkk",nextDate)
  
   let response = await postApi(
    "/api/admin/orderNow",
   bodyData,
    app
  );

  if(response?.data?.message=='success'){

    fetchDataUpcomingOrders({...data,nextBillingDate:nextDate})
    setExistingSubscription({...data,nextBillingDate:nextDate})
    setNextBillingDate(nextDate)
    }   
  }

  else{
console.log("in elseee")
    let bodyData= { data: data, renewal_date: renewal_date }

  let response = await postApi(
    "/api/admin/orderNow",
   bodyData,
    app
  );

  if(response?.data?.message=='success'){
    fetchDataUpcomingOrders(data)
   
  }



  }


setLoader(false)


}

const handleSkipOrder=async(renewal_date)=>{

setLoader(true)

    if(new Date(data?.nextBillingDate).getTime() === new Date(renewal_date).getTime()){
      console.log("mohalitowerrr")
      let nextDate;
      let value =data.subscription_details.planType=="payAsYouGo" ? data.subscription_details.billingLength :data.subscription_details.delivery_billingValue
      let type=data.subscription_details.delivery_billingType
      
      // console.log(value,data?.nextBillingDate,type)
      
  nextDate= dateChange(type,data?.nextBillingDate,value).toISOString()
       console.log("early",nextDate)
let existingAlready=attemptedOrders.find(item=> new Date(item.renewal_date).getTime() === new Date(nextDate).getTime())
console.log("existingAlready",existingAlready)



////////////////////////////
let flag=false
  while(flag==false) {
    
    console.log("in  while",nextDate)
    let existingAlready=attemptedOrders.find(item=> new Date(item.renewal_date).getTime() === new Date(nextDate).getTime())
       
if(!existingAlready){
     flag=true
}
  else{
      nextDate= dateChange(type,nextDate,value).toISOString()
  }// console.log("nexttdate",nextDate,q=q+1)

  }




////////////////////////////////
  // while(existingAlready) {

  //   console.log("in  while")
  //   nextDate= dateChange(type,nextDate,value).toISOString()

  // }

 let bodyData={data: data, renewal_date: renewal_date,nextBillingDate:nextDate}
   console.log("hmmmkkkkk",nextDate)
   let response = await postApi(
    "/api/admin/skipOrder",
   bodyData,
    app
  );

  if(response?.data?.message=='success'){
     
   
    setExistingSubscription({...data,nextBillingDate:nextDate})
    fetchDataUpcomingOrders({...data,nextBillingDate:nextDate})
  
    setNextBillingDate(nextDate)
  }
     
  }



  else {
    let bodyData= { data: data, renewal_date: renewal_date };

  let response = await postApi(
    "/api/admin/skipOrder",
   bodyData,
    app
  );

  if(response?.data?.message=='success'){
    console.log("14sept")
    fetchDataUpcomingOrders(data)
  }
  }

setLoader(false)

}


const handleRetry=async(renewal_date,idempotencyKey)=>{
  setLoader(true)
  let response = await postApi('/api/admin/retryFailedOrder',{renewal_date,idempotencyKey,product_details:data?.product_details,subscription_id:data.subscription_id},app)
  
  if(response?.data?.message=='success'){
    console.log("14sept")
    fetchDataUpcomingOrders(data)
  }
setLoader(false) 
}


  // const handleTabChange = async (activeTabKey) => {
   
  //   if (activeTabKey == "2") {
  //     console.log("0baale ballle");
  //       setLoader(true)
  //     let pastOrdersDetail = await postApi(
  //       "/api/admin/getPastOrdersDetail",
  //       { contract_id: data?.subscription_id },
  //       app
  //     );

  //     console.log("getPastOrdersDetail", pastOrdersDetail);
  //     if (pastOrdersDetail?.data?.message == "success") {
  //       setPastOrders(pastOrdersDetail?.data?.data);

  //       console.log("pastOrders", pastOrdersDetail?.data?.data);
  //     }
  //     setLoader(false)
  //   }
  //   if (activeTabKey == "3") {
  //     console.log("skippedordeers");
  //      setLoader(true)
  //     let skippedOrdersDetail = await postApi(
  //       "/api/admin/getSkippedOrdersDetail",
  //       { contract_id: data?.subscription_id },
  //       app
  //     );

  //     console.log("getSkippedOrdersDetail", skippedOrdersDetail);
  //     if (skippedOrdersDetail?.data?.message == "success") {
  //       setSkippedOrders(skippedOrdersDetail?.data?.data);

  //       console.log("skippedOrdersDetail", skippedOrdersDetail?.data?.data);
  //     }
  //     setLoader(false)
  //   }

  // };

const pastAndSkippedItems =[

  {
    key: "1",
    label: `Completed Orders`,
    children: 
    <section id="PastOrders" className="tab-panel">
     <div className="revlytic upcoming-orders-main">
     <h4 className="revlytic completed-orders-header">Order Date</h4>
     <h4 className="revlytic completed-orders-header">Order Number</h4>
     </div>
   {pastOrders.length >0 ? pastOrders.map((item, index) => {
      return (
        <div className="order-conformation-inner" key={index}>
            <div className="order-date">
          
            <h5>{convertUTCToTimeZone(item.renewal_date,storeDetails?.timeZone)}</h5>
        </div>
       
        <div className="order-status"> 
           
            {/* <Button type="link" onClick={()=>navigate(``)}> </Button> */}
            {/* https://admin.shopify.com/store/sahil-shine/orders/5428243366192 */}
            <a
              target="_blank"
              href={
                `https://admin.shopify.com/store/${storeName}/orders/`+item?.order_id?.split("/").at(-1)
              }
            >
         {item?.order_no}
            </a>
          </div> 
        </div>
      );
    }) :<Empty/> }
    </section>
  },
  {
    key: "2",
    label: `Skipped Orders`,
    children:  <section id="PastOrders" className="tab-panel">
     <div className="revlytic upcoming-orders-main">
     <h4 className="revlytic skipped-orders-header">Order Date</h4>
     </div>
    {skippedOrders.length >0 ? skippedOrders.map((item, index) => {
      
       return (
         <div className="order-conformation-inner" key={index}>
             <div className="order-date">
           
             <h5>{convertUTCToTimeZone(item.renewal_date,storeDetails?.timeZone)}</h5>
         </div>
        
         </div>
       );
     }): <Empty/>}
     </section>,
  },

]



  const items = [
   
    {
      key: "1",
      label: `Upcoming Orders`,
      children:  data != {} && data.subscription_details
      ? data.subscription_details.planType == "payAsYouGo" ?  <section id="UpcomingOrders" className="tab-panel">
       <div className="revlytic upcoming-orders-main">
       <h4 className="revlytic upcoming-orders-header">Order Date</h4> 
       <h4 className="revlytic upcoming-orders-status">Status</h4>
       <h4 className="revlytic upcoming-orders-manage">Manage</h4>
       </div>
 {  upcomingOrders.length > 0  ?  upcomingOrders.map((item, index) => {
               return<div className="order-conformation-inner" key={index}>
          <div className="order-date">
             {console.log(item)}
              <h5>{convertUTCToTimeZone(item.renewal_date,storeDetails?.timeZone)}</h5>
          </div>
          <div className="order-status">
              
              <h5>
                {item.status=='success' || item.status=='initial' ? <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"
                      fill="none">
                      <circle cx="3.85848" cy="3.88357" r="3.74715" fill="#3EBE62" />
                  </svg> : item.status=='pending' ? <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"
                      fill="none">
                      <circle cx="3.85848" cy="3.88357" r="3.74715" fill="#F39C44" />
                  </svg>  :  item.status=='upcoming'  ? <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"
                      fill="none">
                      <circle cx="3.85848" cy="3.88357" r="3.74715" fill="#00a49c" />
                  </svg>   : item.status=='skipped' ? <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"
                      fill="none">
                      <circle cx="3.85848" cy="3.88357" r="3.74715" fill="#2b90ae" />
                  </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"
                      fill="none">
                      <circle cx="3.85848" cy="3.88357" r="3.74715" fill="#FF0000" />
                  </svg> }
            
                  {item.status=='upcoming' ? 'Queued' : item.status=='pending' ? 'Pending' : item.status=='failed' ? 'Failed'   :""}
              </h5>
          </div>
          <div className="order-now-and-skip">
            
          {item.status == "upcoming" ? (
                      <div className="order-inner">
                       <Tooltip color= "#ffffff" title={billingPlan !="starter" && billingPlan !="premium" && billingPlan !="premiere" ? <Link  to={(`/billing?option=earlyAttempt`)}>Upgrade your Plan</Link> :""}> 
                       <Button onClick={() => handleOrderNow(item.renewal_date)} disabled={(billingPlan !='starter' && billingPlan !="premium" && billingPlan !="premiere")|| mode=='view'}>
                          Order Now
                        </Button></Tooltip>
                        <Tooltip color= "#ffffff" title={billingPlan !="starter" && billingPlan !="premium" && billingPlan !="premiere" ? <Link to={(`/billing?option=skipOrders`)}>Upgrade your Plan</Link> :""}> 
                          <Button  onClick={() => handleSkipOrder(item.renewal_date)} disabled={(billingPlan !='starter' && billingPlan !="premium" && billingPlan !="premiere") || mode=='view'}>Skip Order</Button>
                          </Tooltip>
                      </div>
                    ) : item.status == "failed" ? 
                      <Button onClick={()=>handleRetry(item.renewal_date,item.idempotencyKey)} disabled={(billingPlan !='starter' && billingPlan !="premium" && billingPlan !="premiere") || mode=='view'}>Retry</Button>
                      : ""
                     }
          </div>
      </div>
   

      })
      :<Empty />}
    </section> :"" :"" 
    
  
  }
  

  
  ,
  {
    key: "2",
    label: `Completed Orders`,
    children: 
    <section id="PastOrders" className="tab-panel">
     <div className="revlytic upcoming-orders-main">
     <h4 className="revlytic completed-orders-header">Order Date</h4>
     <h4 className="revlytic completed-orders-header">Order Number</h4>
     </div>
   {pastOrders.length >0 ? pastOrders.map((item, index) => {
      return (
        <div className="order-conformation-inner" key={index}>
            <div className="order-date">
          
            <h5>{convertUTCToTimeZone(item.renewal_date,storeDetails?.timeZone)}</h5>
        </div>
       
        <div className="order-status"> 
           
            {/* <Button type="link" onClick={()=>navigate(``)}> </Button> */}
            {/* https://admin.shopify.com/store/sahil-shine/orders/5428243366192 */}
            <a
              target="_blank"
              href={
                `https://admin.shopify.com/store/${storeName}/orders/`+item?.order_id?.split("/").at(-1)
              }
            >
         {item?.order_no}
            </a>
          </div> 
        </div>
      );
    }) :<Empty/> }
    </section>
  },
  {
    key: "3",
    label: `Skipped Orders`,
    children:  <section id="PastOrders" className="tab-panel">
     <div className="revlytic upcoming-orders-main">
     <h4 className="revlytic skipped-orders-header">Order Date</h4>
     </div>
    {skippedOrders.length >0 ? skippedOrders.map((item, index) => {
      
       return (
         <div className="order-conformation-inner" key={index}>
             <div className="order-date">
           
             <h5>{convertUTCToTimeZone(item.renewal_date,storeDetails?.timeZone)}</h5>
         </div>
        
         </div>
       );
     }): <Empty/>}
     </section>,
  },
   
  ];

  return <Tabs className="revlytic order-main-tabs" defaultActiveKey="1"  items={data?.status?.toLowerCase() == 'active' ? items :  pastAndSkippedItems } />;
}

export default Orders;

// import React, { useEffect, useState } from 'react'

// import { Tabs, Button,Spin ,Empty} from "antd";
// import postApi from '../common/postApi';
// import { useNavigate } from 'react-router-dom';
// import { useAPI } from '../common/commonContext';
// import { useAppBridge } from '@shopify/app-bridge-react';
// function Orders({data}) {

//   const navigate=useNavigate()
//  const {storeName}=useAPI();
//  const app=useAppBridge();

//  const [pastOrders,setPastOrders]=useState([])
// // const [ordersLoader,setOrdersLoader]=useState(false)
// useEffect(async()=>{
// if(data){

// console.log("usefectdata",data)
// }
// },[])

//   function dateConversion(date) {
//     const dateString = date;
//     const dateObj = new Date(dateString);
//     const formattedDate = dateObj.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//     // console.log(formattedDate);
//     return formattedDate;
//   }

//  const dateChange=(type,originalDate,index,value)=>{
//        console.log("firstdatechange",type,originalDate,index)

//   if (
//    type.toLowerCase() ===
//     "day"
//   ) {
//    let nextDate = new Date(originalDate);
//     nextDate.setDate(nextDate.getDate() + index * parseInt(value));

//     return nextDate;
//   } else if (
//     type.toLowerCase() ===
//     "month"
//   ) {
//     let nextDate = new Date(originalDate);
//     nextDate.setMonth(nextDate.getMonth() + index * parseInt(value));
//     console.log("typedtaechekcc",typeof nextDate)
//     return nextDate;
//   } else if (
//     type.toLowerCase() ===
//     "week"
//   ) {
//    let  nextDate = new Date(originalDate);
//     nextDate.setDate(nextDate.getDate() + (7 * index * parseInt(value)));
//     // return nextDate;
//   } else if (
//     type.toLowerCase() ===
//     "year"
//   ) {
//     let nextDate = new Date(originalDate);
//     nextDate.setFullYear(nextDate.getFullYear() + index * parseInt(value)) ;
//     return nextDate;
//   }

//  }

//  const handleOrderNow=async(index)=>{
//    console.log("click in handleordernow",index)

//  let renewalDate=  dateChange(data?.subscription_details?.delivery_billingType,data?.nextBillingDate,index,data?.subscription_details?.delivery_billingValue)

//   let response=await postApi("/api/admin/orderNow",{data:data,index:index,renewalDate:renewalDate},app)

//  }

//  const handleTabChange=async(activeTabKey)=>{
//   if(activeTabKey=='2'){
//     console.log("0baale ballle")

//     let pastOrdersDetail=await postApi("/api/admin/getPastOrdersDetail",{contract_id:data?.subscription_id},app)

//     console.log("getPastOrdersDetail",pastOrdersDetail)
// if(pastOrdersDetail?.data?.message=="success"){
//     setPastOrders(pastOrdersDetail?.data?.data)

//   console.log("pastOrders",pastOrdersDetail?.data?.data)
// }

//   }

//   }

//       const items = [
//         {
//           key: "1",
//           label: `Upcoming`,
//           children: (

//                data !={} && data.subscription_details  ? data.subscription_details.planType=="payAsYouGo" ?

//                   Array.from({ length: 4 }, (_, index) => {
//                    ;
//         return <div style={{display:"flex",justifyContent:'space-between',alignItems:'center'}}>
//             <div>
//            <p>Order Date</p>
//          {data && data.subscription_details?.delivery_billingType && <p>{dateConversion(dateChange(data?.subscription_details?.delivery_billingType,data?.nextBillingDate,index,data?.subscription_details?.billingLength))}</p>}
//            </div>
//            <div>
//            <p>Status</p>
//            <p> In Queue</p>
//            </div>

//         <div><Button onClick={()=>handleOrderNow(index)}>Order Now</Button><Button>Skip Order</Button></div>
//         </div>
//          })

//                :

//                  Array.from({ length: data.subscription_details?.billingMaxValue ? data.subscription_details?.billingMaxValue : 4 }, (_, index) => {
//                   //  let date= data?.nextBillingDate ;
//         return <div style={{display:"flex",justifyContent:'space-between',alignItems:'center'}}>
//             <div>
//            <p>Order Date</p>
//          {data && data.subscription_details?.delivery_billingType && <p>{dateConversion(dateChange(data?.subscription_details?.delivery_billingType,data?.nextBillingDate,index,data?.subscription_details?.delivery_billingValue))}</p>}
//            </div>
//            <div>
//            <p>Status</p>
//            <p> In Queue</p>
//            </div>

//         <div><Button onClick={()=>handleOrderNow(index)}>Order Now</Button><Button>Skip Order</Button></div>
//         </div>
//          })

//                : ""

//           ),
//         },

//         {
//           key: "2",
//           label: `Past`,
//           children: (
//             pastOrders.map((item,index)=>{
//            return <div>
//             <div>
//            <p>Order Date</p>
//          {<p>{dateConversion(item?.updatedAt)}</p>}
//            </div>
//            <div>
//            <p>Order Number</p>
//            {/* <Button type="link" onClick={()=>navigate(``)}> </Button> */}
//            {/* https://admin.shopify.com/store/sahil-shine/orders/5428243366192 */}
//            <a
//                       target="_blank"
//                       href={
//                         `https://admin.shopify.com/store/${storeName}/orders/` +
//                         item?.order_id?.split("/").at(-1)
//                       }
//                     >

// {item?.order_no}
// </a>

//            </div>
//             </div>
//           })
//           ),
//         },
//         {
//             key: "3",
//             label: `Skipped`,
//             children: (
//              <>skipped</>
//             ),
//           },
//       ];

//   return (
//     <Tabs defaultActiveKey="1" onChange={handleTabChange} items={items} />

//   )

// }

// export default Orders
