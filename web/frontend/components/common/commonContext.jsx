import React, { useContext, useState, createContext,useEffect } from "react";
import postApi from "./postApi";
import { useAppBridge } from "@shopify/app-bridge-react";
const APIContext = createContext();

 function ContextProvider({ children }) {
   const [currency,setCurrency]=useState("") ;
   const [currencyCode,setCurrencyCode]=useState("") ;
   const [storeName,setStoreName]=useState("") ;
   const [storeDetails,setStoreDetails]=useState({}) ;
   const [billingPlan,setBillingPlan]=useState("") ;
   const [billingPlanDate,setBillingPlanDate]=useState() ;
   const [recurringRevenue,setRecurringRevenue]=useState(0) ;
   const [planBuyDate,setPlanBuyDate]=useState() ;
   const [chargeId,setChargeId]=useState() ;
   const app=useAppBridge();
  const [getShop, setGetShop] = useState(new URL(location.href).searchParams.get("shop"));
     useEffect(async()=>{
      let result = await postApi("api/admin/getCurrencyCode", {}, app);
      
      if (result?.data?.data) {
      
         let getStoreName=result?.data?.data?.shop.split(".myshopify.com")[0];
         
        setCurrency(result?.data?.data?.currency);
        setCurrencyCode(result?.data?.data?.currency_code);
        setStoreName(getStoreName)
        setStoreDetails(result?.data?.data)
       }

    let billingPlanData=await postApi("api/admin/getBillingPlanData",{},app);
    if(billingPlanData && billingPlanData?.data?.message=='success') {
      console.log(billingPlanData?.data?.planData?.next_billing,"ksjaisa",billingPlanData)
      setBillingPlan(billingPlanData?.data?.planData?.plan)
      setBillingPlanDate(billingPlanData?.data?.planData?.next_billing)
      setPlanBuyDate(billingPlanData?.data?.planData?.activated_on)
      setChargeId(billingPlanData?.data?.planData?.charge_id)
    }else{
      setBillingPlan("free")
    }



       
   },[])
 
  return (

    <APIContext.Provider value={{ shop: getShop,currency:currency,storeName:storeName,storeDetails:storeDetails,check:true,chargeId,setChargeId,billingPlan,planBuyDate,nextBillingDate:billingPlanDate ,recurringRevenue,setRecurringRevenue:setRecurringRevenue,setBillingPlan:setBillingPlan}}>

      {children}

    </APIContext.Provider>

 );

}


export default ContextProvider;


export function useAPI() {

  const context = useContext(APIContext);

  if (context === undefined) {

    throw new Error("Context must be used within a Provider");

  }

  return context;
}