// import React, { useEffect, useState } from "react";
// import dayjs from "dayjs";
// import { Tabs, Button, Spin, Empty,Modal,DatePicker } from "antd";
// import postApi from "../common/postApi";
// import { useNavigate } from "react-router-dom";
// import { useAPI } from "../common/commonContext";
// import { useAppBridge } from "@shopify/app-bridge-react";
// import { toast } from "react-toastify";
// function Fulfillments({ data,upcomingFullfillment,setUpcomingFullfillment,setLoader,setExistingSubscription,storeDetails,setNextBillingDate}) {
//   const navigate = useNavigate();
//   const { storeName } = useAPI();
//   const app = useAppBridge();

//   const[datePickerModal,setDatePickerModal]=useState(false)
//   const [fulfillmentData, setFulfillmentData] = useState([]);
//   const[selected,setSelected]=useState({})
//   // const [ordersLoader,setOrdersLoader]=useState(false)
//   useEffect(async () => {
//    //console.log("upcomingFullfillment",upcomingFullfillment)
// if(upcomingFullfillment?.fulfillmentIdAndLineItemsData?.length > 0 ){

//     //console.log("length>000")

//     let result = {};
//    upcomingFullfillment?.contractIdAndLineItemsData.forEach((item,index)=>{
//      let id = item?.node?.contract?.id?.split('/').at(-1);
//      if (!result[id]) {
//          result[id] = [item?.node?.id?.split('/').at(-1)];
//      }
//    else{
//      result[id].push(item?.node?.id?.split('/').at(-1))
//    } 
   
   
//     })
//    //console.log("resulttt",result)

// let contractLineItems=result[(data["subscription_id"]).split('/').at(-1)];

// //console.log("contractLineItems",contractLineItems)

//     let result2=[]

//     upcomingFullfillment?.fulfillmentIdAndLineItemsData?.forEach(item=>{
//       let arr=[]
//     item?.line_items.forEach(line=>{
//           arr.push(line?.line_item_id)
//     })
//     let id=item?.id
//     let obj={[id]:{lineItems:arr,fulfill_at:item?.fulfill_at,status:item.status}}
//     result2.push(obj)
//     })
    
//     //console.log("result2",result2)
    
// if(result2.length >0){

//   let filtered = result2.filter(item => Object.values(item)[0].lineItems.some(lineItem => contractLineItems.includes(String(lineItem))));
//   // //console.log(filtered.sort((a, b) => new Date(a.fulfill_at) - new Date(b.fulfill_at)));
//   //console.log(filtered.sort((obj1, obj2) => {
//     const date1 = new Date(Object.values(obj1)[0].fulfill_at);
//     const date2 = new Date(Object.values(obj2)[0].fulfill_at);
//     //console.log("sddfdf",Object.values(obj2))
//     return date1 - date2;
//   }));
//   //console.log('filterd',filtered)
//   setFulfillmentData(filtered)

// }

// }

//   }, [upcomingFullfillment]);

//   function dateConversion(date) {
//     const dateString = date;
//     const dateObj = new Date(dateString);
//     const formattedDate = dateObj.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//     // //console.log(formattedDate);
//     return formattedDate;
//   }

//   function convertUTCToTimeZone(utcDateTime, timeZone) {
//     const utcDate = new Date(utcDateTime);
//     const options = { timeZone, year: 'numeric', month: 'long', day: 'numeric' };
//     const localDate = utcDate.toLocaleString('en-US', options);
//     return localDate;
// }


//   const dateChange=(type,originalDate,value)=>{
//     //console.log("datechange",type,originalDate,)
  
//   if (
//   type.toLowerCase() ===
//   "day"
//   ) {
//   let nextDate = new Date(originalDate);
//   nextDate.setDate(nextDate.getDate() + 1 * parseInt(value));
  
//   return nextDate;
//   } else if (
//   type.toLowerCase() ===
//   "month"
//   ) {
//   let nextDate = new Date(originalDate);
//   nextDate.setMonth(nextDate.getMonth() + 1 * parseInt(value));
//   //console.log("typedtaechekcc",typeof nextDate)
//   return nextDate;
//   } else if (
//   type.toLowerCase() ===
//   "week"
//   ) {
//   let  nextDate = new Date(originalDate);
//   nextDate.setDate(nextDate.getDate() + (7  * parseInt(value)));
//   // return nextDate;
//   } else if (
//   type.toLowerCase() ===
//   "year"
//   ) {
//   let nextDate = new Date(originalDate);
//   nextDate.setFullYear(nextDate.getFullYear() + 1 * parseInt(value)) ;
//   return nextDate;
//   }
  
//   }

//   const handleDisableDate = (current) => {
//     return current && current < new Date(); //for disabling till yesterday,just do ---->  current && current < new Date().getTime() - 1 * 24 * 60 * 60 * 1000
//   };

// const rescheduleButtonClick=(fulfill_id,fulfill_at)=>{
// //console.log(fulfill_at,fulfill_id,)
// setSelected({fulfill_at,fulfill_id})
// setDatePickerModal(true)

// }

// // const skipButtonClick=(fulfill_id,fulfill_at)=>{

// //   //console.log(fulfill_at,fulfill_id)
// //   setSelected({fulfill_at,fulfill_id})
// //   setDatePickerModal(true)


// // }

// const handleDateChange = (dateobj,date) => {
//   setSelected({...selected,fulfill_at:new Date(date)?.toISOString()});
//   //console.log(new Date(date)?.toISOString(),'Selected date:', date);


// };

// const handleOk=()=>{
      
//   handleRescheduleFulfillment()

    
     
// }



//   const handleTabChange=()=>{


//   }

//   const handleRescheduleFulfillment=async()=>{

// //console.log(selected)
// setLoader(true)
//            let response = await postApi(
//             "/api/admin/fulfillmentOrderRescheduleOrSkip",
//             {fulfill_at:selected?.fulfill_at,id:selected?.fulfill_id},
//             app
//           );
  
  
//           if (response?.data?.message == "success") {
                        
//         setDatePickerModal(false)

//         let upcomingFulfillmentdData = await postApi(
//           "/api/admin/upcomingFulfillment",
//           { id:data?.subscription_id},
//           app
//         );
        
//         if(upcomingFulfillmentdData?.data?.message=='success'){
        
//         setUpcomingFullfillment(upcomingFulfillmentdData?.data?.data)
      
//         }

//   }
//   setLoader(false)
//   }


//   const handleSkipFulfillment=async(fulfill_id)=>{
    
//     setLoader(true)
//     //console.log(selected)
  
//     let value =data?.subscription_details?.delivery_billingValue
//     let type=data.subscription_details.delivery_billingType
    
//     //console.log(data?.nextBillingDate,"eeeesdasdasww",typeof data?.nextBillingDate)
    
//     let nextBillingDate= dateChange(type,data?.nextBillingDate,value).toISOString()

//    //console.log("nextBillingDate",nextBillingDate)
//    //console.log("data?.nextBillingDate",data?.nextBillingDate)
   

//                let response = await postApi(
//                 "/api/admin/fulfillmentOrderRescheduleOrSkip",
//                 {fulfill_at: data?.nextBillingDate,id:fulfill_id,nextBillingDate : nextBillingDate,subscription_id:data?.subscription_id},
//                 app
//               );
//               if (response?.data?.message == "success") {
       
//               // setDatePickerModal(false)

//               let upcomingFulfillmentdData = await postApi(
//                 "/api/admin/upcomingFulfillment",
//                 { id:data?.subscription_id},
//                 app
//               );
              
//               if(upcomingFulfillmentdData?.data?.message=='success'){
//               //console.log("atlaassssssst")
//               setUpcomingFullfillment(upcomingFulfillmentdData?.data?.data)
//               setExistingSubscription({...data,nextBillingDate:response?.data?.date})
//               setNextBillingDate(response?.data?.date) 
//               //console.log("popijui",{...data,nextBillingDate:response?.data?.date})
//               }

                
//               }
    

//               setLoader(false)
//       }


//   const items = [
    
//     {
//       key: "1",
//       label: `Upcoming Fulfillments`,
//       children: <section id="UpcomingOrders" class="tab-panel">
        
           
//         {fulfillmentData?.length > 0 ? fulfillmentData?.map((item,index)=>   Object.values(item)[0].status=="scheduled" && <div class="order-conformation-inner" key={index}>
//                             <div class="order-date">
//               <h4>Fulfillment Date</h4>
//               <h5>{convertUTCToTimeZone(Object.values(item)[0].fulfill_at,storeDetails?.timeZone)}
// </h5>
// {/* handleReschedule(Object.keys(item)[0],Object.values(item)[0].fulfill_at) */}
//           </div>
//           <div className="order-now-and-skip order-inner">
//                 <Button onClick={() =>rescheduleButtonClick(Object.keys(item)[0],Object.values(item)[0].fulfill_at) }>
//                Reschedule
//                 </Button>
//                 <Button  onClick={() => handleSkipFulfillment(Object.keys(item)[0],Object.values(item)[0].fulfill_at)}>Skip </Button>
//               </div>

// </div>   )
// :
// <Empty/>
// }
//     </section>
//     },
//     {
//       key: "2",
//       label: `Completed`,
//       children: <section id="UpcomingOrders" class="tab-panel">
        
           
//         {fulfillmentData?.length > 0 ? fulfillmentData?.map((item,index)=>    Object.values(item)[0].status=="closed" && <div class="order-conformation-inner" key={index}>
//                             <div class="order-date">
//               <h4>Fulfillment Date</h4>
//               <h5>{convertUTCToTimeZone(Object.values(item)[0].fulfill_at,storeDetails?.timeZone)}
// </h5>

//           </div>
         

// </div>)
// :
// <Empty/>
// }
//     </section>
//     },
//     {
//       key: "3",
//       label: `Active`,
//       children: <section id="UpcomingOrders" class="tab-panel">
        
           
//         {fulfillmentData?.length > 0 ? fulfillmentData?.map((item,index)=>    Object.values(item)[0].status=="open" && <div class="order-conformation-inner" key={index}>
//                             <div class="order-date">
//               <h4>Fulfillment Date</h4>
//               <h5>{convertUTCToTimeZone(Object.values(item)[0].fulfill_at,storeDetails?.timeZone)}
// </h5>

//           </div>
         

// </div>)
// :
// <Empty/>
// }
//     </section>
//     },
// ]


//   return <div><Tabs className="revlytic order-main-tabs" defaultActiveKey="1" onChange={handleTabChange} items={items} />
  
//   <Modal
//           className="revlytic fullfilment-modal"
//           maskClosable={false}
//           open={datePickerModal}
//           onCancel={() => {
//             setDatePickerModal(false);
//           }}
      
//          onOk={handleOk}
//           // footer={[]}
//         >
// <h3>Reschedule Order</h3>
// <DatePicker
//                         allowClear={false}
//                         showTime={false}
//                         showToday={false}
//                         disabledDate={handleDisableDate}
//                         // showTime={{
//                         //   hideDisabledOptions: true,
//                         //   defaultValue: [dayjs("00:00:00", "HH:mm:ss")],
//                         // }}
//                         format="YYYY-MM-DD"
//                       //  defaultValue={}
//                       onChange={handleDateChange}
//                       value={dayjs(selected?.fulfill_at)}
//                       />
//         </Modal>
//   </div>
// }

// export default Fulfillments;
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Tabs, Button, Spin, Empty,Modal,DatePicker } from "antd";
import postApi from "../common/postApi";
import { useNavigate } from "react-router-dom";
import { useAPI } from "../common/commonContext";
import { useAppBridge } from "@shopify/app-bridge-react";
import { toast } from "react-toastify";
function Fulfillments({ data,fullfillmentDataMain,setFullfillmentDataMain,setLoader,setExistingSubscription,storeDetails,setNextBillingDate,pastOrders}) {
  const navigate = useNavigate();
  const { storeName } = useAPI();
  const app = useAppBridge();

  const[datePickerModal,setDatePickerModal]=useState(false)
  const [upcomingFulfillments, setUpcomingFulfillments] = useState([]);
  const [completedFulfillments, setCompletedFulfillments] = useState([]);
  const [activeFulfillments, setActiveFulfillments] = useState([]);
  const [orderNumber, setOrderNumber] = useState('');
  const[selected,setSelected]=useState({})
  // const [ordersLoader,setOrdersLoader]=useState(false)
  useEffect(async () => {
  
if(fullfillmentDataMain?.fulfillmentIdAndLineItemsData?.length > 0 ){
setOrderNumber(fullfillmentDataMain?.orderNumber)
    console.log(fullfillmentDataMain)

    let result = {};
    fullfillmentDataMain?.contractIdAndLineItemsData.forEach((item,index)=>{
     let id = item?.node?.contract?.id?.split('/').at(-1);
     if (!result[id]) {
         result[id] = [item?.node?.id?.split('/').at(-1)];
     }
   else{
     result[id].push(item?.node?.id?.split('/').at(-1))
   } 
   
   
    })
   //console.log("resulttt",result)

let contractLineItems=result[(data["subscription_id"]).split('/').at(-1)];

//console.log("contractLineItems",contractLineItems)

    let upcoming=[]
    let completed=[]
    let active=[]

    fullfillmentDataMain?.fulfillmentIdAndLineItemsData?.forEach(item=>{
      let arr=[]
    item?.line_items.forEach(line=>{
          arr.push(line?.line_item_id)
    })
    let id=item?.id
    let obj={[id]:{lineItems:arr,fulfill_at:item?.fulfill_at,status:item.status,order_id:item.order_id}}
if(item.status=="scheduled"){
  upcoming.push(obj)
}
else if(item.status=='open')
{
  active.push(obj)
} 
else if(item.status=='closed'){
  completed.push(obj)
}

})
    
 
if(upcoming.length >0){

  let filtered = upcoming.filter(item => Object.values(item)[0].lineItems.some(lineItem => contractLineItems.includes(String(lineItem))));
  // //console.log(filtered.sort((a, b) => new Date(a.fulfill_at) - new Date(b.fulfill_at)));
  filtered.sort((obj1, obj2) => {
    const date1 = new Date(Object.values(obj1)[0].fulfill_at);
    const date2 = new Date(Object.values(obj2)[0].fulfill_at);
    //console.log("sddfdf",Object.values(obj2))
    return date1 - date2;
  });
  console.log('filterd',filtered)
  setUpcomingFulfillments(filtered)

}
if(completed.length >0){

  let filtered = completed.filter(item => Object.values(item)[0].lineItems.some(lineItem => contractLineItems.includes(String(lineItem))));
  // //console.log(filtered.sort((a, b) => new Date(a.fulfill_at) - new Date(b.fulfill_at)));
  filtered.sort((obj1, obj2) => {
    const date1 = new Date(Object.values(obj1)[0].fulfill_at);
    const date2 = new Date(Object.values(obj2)[0].fulfill_at); 

    //console.log("sddfdf",Object.values(obj2))
    return date1 - date2;
  });
  //console.log('filterd',filtered)
  setCompletedFulfillments(filtered)

}

if(active.length >0){

  let filtered = active.filter(item => Object.values(item)[0].lineItems.some(lineItem => contractLineItems.includes(String(lineItem))));
  // //console.log(filtered.sort((a, b) => new Date(a.fulfill_at) - new Date(b.fulfill_at)));
  filtered.sort((obj1, obj2) => {
    const date1 = new Date(Object.values(obj1)[0].fulfill_at);
    const date2 = new Date(Object.values(obj2)[0].fulfill_at);
    //console.log("sddfdf",Object.values(obj2))
    return date1 - date2;
  });
  //console.log('filterd',filtered)
  setActiveFulfillments(filtered)

}


}

  }, [fullfillmentDataMain]);

  function dateConversion(date) {
    const dateString = date;
    const dateObj = new Date(dateString);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    // //console.log(formattedDate);
    return formattedDate;
  }

  
  function convertUTCToTimeZone(utcDateTime, timeZone) {
    const utcDate = new Date(utcDateTime);
    const options = { timeZone, year: 'numeric', month: 'long', day: 'numeric' };
    const localDate = utcDate.toLocaleString('en-US', options);
    return localDate;
}


  const dateChange=(type,originalDate,value)=>{
    //console.log("datechange",type,originalDate,)
  
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
  //console.log("typedtaechekcc",typeof nextDate)
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

  const handleDisableDate = (current) => {
    return current && current < new Date(); //for disabling till yesterday,just do ---->  current && current < new Date().getTime() - 1 * 24 * 60 * 60 * 1000
  };

 const rescheduleButtonClick=(fulfill_id,fulfill_at)=>{
//console.log(fulfill_at,fulfill_id,)
setSelected({fulfill_at,fulfill_id})
setDatePickerModal(true)

 }

// const skipButtonClick=(fulfill_id,fulfill_at)=>{

//   //console.log(fulfill_at,fulfill_id)
//   setSelected({fulfill_at,fulfill_id})
//   setDatePickerModal(true)


// }

const handleDateChange = (dateobj,date) => {
  // setSelected({...selected,fulfill_at:new Date(date)?.toISOString()});
  setSelected({...selected,fulfill_at:dateobj});
  //console.log(new Date(date)?.toISOString(),'Selected date:', date);


};


const handleOk=()=>{
      
  handleRescheduleFulfillment()

    
     
}

  const handleTabChange=()=>{


  }

  const handleRescheduleFulfillment=async()=>{

//console.log(selected)
setLoader(true)
           let response = await postApi(
            "/api/admin/fulfillmentOrderRescheduleOrSkip",
            {fulfill_at:selected?.fulfill_at,id:selected?.fulfill_id},
            app
          );
  
  
          if (response?.data?.message == "success") {
                        
        setDatePickerModal(false)

        let upcomingFulfillmentdData = await postApi(
          "/api/admin/upcomingFulfillment",
          { id:data?.subscription_id},
          app
        );
        
        if(upcomingFulfillmentdData?.data?.message=='success'){
        
          setFullfillmentDataMain(upcomingFulfillmentdData?.data?.data)
      
        }

  }
  setLoader(false)
  }


  const handleSkipFulfillment=async(fulfill_id)=>{
    
    setLoader(true)
    //console.log(selected)
  
    let value =data?.subscription_details?.delivery_billingValue
    let type=data.subscription_details.delivery_billingType
    
    //console.log(data?.nextBillingDate,"eeeesdasdasww",typeof data?.nextBillingDate)
    
    let nextBillingDate= dateChange(type,data?.nextBillingDate,value).toISOString()

   //console.log("nextBillingDate",nextBillingDate)
   //console.log("data?.nextBillingDate",data?.nextBillingDate)
   

               let response = await postApi(
                "/api/admin/fulfillmentOrderRescheduleOrSkip",
                {fulfill_at: data?.nextBillingDate,id:fulfill_id,nextBillingDate : nextBillingDate,subscription_id:data?.subscription_id},
                app
              );
              if (response?.data?.message == "success") {
       
              // setDatePickerModal(false)

              let upcomingFulfillmentdData = await postApi(
                "/api/admin/upcomingFulfillment",
                { id:data?.subscription_id},
                app
              );
              
              if(upcomingFulfillmentdData?.data?.message=='success'){
              //console.log("atlaassssssst")
              setFullfillmentDataMain(upcomingFulfillmentdData?.data?.data)
              setExistingSubscription({...data,nextBillingDate:response?.data?.date})
              setNextBillingDate(response?.data?.date) 
              //console.log("popijui",{...data,nextBillingDate:response?.data?.date})
              }

                
              }
    

              setLoader(false)
      }


  const items = [
    
    {
      key: "1",
      label: `Scheduled`,
      children: <section id="UpcomingOrders" className="tab-panel">
        <div className="revlytic upcoming-orders-main">
        <h4 className="revlytic upcoming-orders-header">Fulfillment Date</h4>
        <h4 className="revlytic completed-orders-header upcoming-specific">Order Number</h4>
   <h4 className="revlytic upcoming-orders-manage">Manage</h4>

       {/* <h4>Order Number</h4> */}
       </div>
           
        {upcomingFulfillments?.length > 0 ? upcomingFulfillments?.map((item,index)=>   Object.values(item)[0].status=="scheduled" && <div className="order-conformation-inner" key={index}>
                            <div className="order-date">
              {/* <h4>Fulfillment Date</h4> */}
              <h5>{convertUTCToTimeZone(Object.values(item)[0].fulfill_at,storeDetails?.timeZone)}
</h5>
{/* handleReschedule(Object.keys(item)[0],Object.values(item)[0].fulfill_at) */}
          </div>

          <div className="order-status"> 
           
           {/* <Button type="link" onClick={()=>navigate(``)}> </Button> */}
           {/* https://admin.shopify.com/store/sahil-shine/orders/5428243366192 */}
           <a
             target="_blank"
             href={
               `https://admin.shopify.com/store/${storeName}/orders/${Object.values(item)[0]?.order_id}`
             }
           >
        {orderNumber}
           </a>
         </div> 
          
          <div className="order-now-and-skip order-inner">
                <Button onClick={() =>rescheduleButtonClick(Object.keys(item)[0],Object.values(item)[0].fulfill_at) }>
               Reschedule
                </Button>
                <Button  onClick={() => handleSkipFulfillment(Object.keys(item)[0],Object.values(item)[0].fulfill_at)}>Postpone</Button>
              </div>

</div>   )
:
<Empty/>
}
    </section>
    },
 
    {
      key: "2",
      label: `Open`,
      children: <section id="UpcomingOrders" className="tab-panel">
        <div className="revlytic upcoming-orders-main">
        <h4 className="revlytic completed-orders-header">Fulfillment Date</h4>
        <h4 className="revlytic completed-orders-header">Order Number</h4>
  
       </div>
           
        {activeFulfillments?.length > 0 ? activeFulfillments?.map((item,index)=>    Object.values(item)[0].status=="open" && <div className="order-conformation-inner" key={index}>
                            <div className="order-date">
              {/* <h4>Fulfillment Date</h4> */}
              <h5>{convertUTCToTimeZone(Object.values(item)[0].fulfill_at,storeDetails?.timeZone)}
</h5>

          </div>
          <div className="order-status"> 
           
           {/* <Button type="link" onClick={()=>navigate(``)}> </Button> */}
           {/* https://admin.shopify.com/store/sahil-shine/orders/5428243366192 */}
           <a
             target="_blank"
             href={
               `https://admin.shopify.com/store/${storeName}/orders/${Object.values(item)[0]?.order_id}`
             }
           >
        {orderNumber}
           </a>
         </div> 
          
         

</div>)
:
<Empty/>
}
    </section>
    },
    {
      key: "3",
      label: `Closed`,
      children: <section id="UpcomingOrders" className="tab-panel">
        
        <div className="revlytic upcoming-orders-main">
        <h4 className="revlytic completed-orders-header">Fulfillment Date</h4>
        <h4 className="revlytic completed-orders-header">Order Number</h4>
       
 
       </div>
        {completedFulfillments?.length > 0 ? completedFulfillments?.map((item,index)=>    Object.values(item)[0].status=="closed" && <div className="order-conformation-inner" key={index}>
                            <div className="order-date">
              {/* <h4>Fulfillment Date</h4> */}
              <h5>{convertUTCToTimeZone(Object.values(item)[0].fulfill_at,storeDetails?.timeZone)}
</h5>

          </div>
          <div className="order-status"> 
           
           {/* <Button type="link" onClick={()=>navigate(``)}> </Button> */}
           {/* https://admin.shopify.com/store/sahil-shine/orders/5428243366192 */}
           <a
             target="_blank"
             href={
               `https://admin.shopify.com/store/${storeName}/orders/${Object.values(item)[0]?.order_id}`
             }
           >
        {orderNumber}
           </a>
         </div> 
          

</div>)
:
<Empty/>
}
    </section>
    },
    {
      key: "4",
      label: `Past Orders`,
      children: <section id="UpcomingOrders" className="tab-panel">
        
        <div className="revlytic upcoming-orders-main">
        <h4 className="revlytic completed-orders-header"> Date</h4>
        <h4 className="revlytic completed-orders-header">Order Number</h4>
       
 
       </div>
        {pastOrders?.length > 0 ? pastOrders?.reverse()?.map((item,index)=>  <div className="order-conformation-inner" key={index}>
                            <div className="order-date">
              {/* <h4>Fulfillment Date</h4> */}
              <h5>{convertUTCToTimeZone(item.renewal_date,storeDetails?.timeZone)}
</h5>

          </div>
          <div className="order-status"> 
           
           {/* <Button type="link" onClick={()=>navigate(``)}> </Button> */}
           {/* https://admin.shopify.com/store/sahil-shine/orders/5428243366192 */}
           <a
             target="_blank"
             href={
               `https://admin.shopify.com/store/${storeName}/orders/${item.order_id?.split('/')?.at(-1)}`
             }
           >
        {item.order_no}
           </a>
         </div> 
          

</div>)
:
<Empty/>
}
    </section>
    },
]


  return <div><Tabs className="revlytic order-main-tabs" defaultActiveKey="1" onChange={handleTabChange} items={items} />
  
  <Modal
          className="revlytic fullfilment-modal"
          maskClosable={false}
          open={datePickerModal}
          onCancel={() => {
            setDatePickerModal(false);
          }}
      
        //  onOk={handleOk}
          footer={[]}
        >
<h3>Reschedule Order</h3>
              <div className="revlytic fulfillment-datePicker-submit">
                 <DatePicker
                        allowClear={false}
                        showTime={false}
                        showToday={false}
                        disabledDate={handleDisableDate}
                        // showTime={{
                        //   hideDisabledOptions: true,
                        //   defaultValue: [dayjs("00:00:00", "HH:mm:ss")],
                        // }}
                        format="YYYY-MM-DD"
                      //  defaultValue={}
                      onChange={handleDateChange}
                      value={dayjs(selected?.fulfill_at)}
                      />

                      <Button onClick={handleOk}>Submit</Button>
                      </div>
        </Modal>
  </div>
}

export default Fulfillments;
