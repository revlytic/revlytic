import React,{useEffect,useState} from 'react'
import {Spin} from 'antd'
import postApi from './common/postApi';
import { useAppBridge } from '@shopify/app-bridge-react';
import {  useNavigate } from "react-router-dom";

import axios from "axios"
function CalculateBillingUsage(props) {

const app = useAppBridge()
const navigate = useNavigate();

const[next_billing , setNextBilling]=useState('')
const[charge_id ,setChargeId] = useState('')

let billingPlan ;
let planBuyDate ; 
    useEffect(async () => {
        //  console.log("ewyewye",billingPlan,planBuyDate)
        let billingPlanData=await postApi("api/admin/getBillingPlanData",{},app);
        if(billingPlanData && billingPlanData?.data?.message=='success') {
          console.log("incalculatebillingusage",billingPlanData)
          props.setBillingPlan(billingPlanData?.data?.planData?.plan)
          setNextBilling(billingPlanData?.data?.planData?.next_billing)
        //   setPlanBuyDate(billingPlanData?.data?.planData?.activated_on)
          setChargeId(billingPlanData?.data?.planData?.charge_id)

          billingPlan=billingPlanData?.data?.planData?.plan;
          planBuyDate =billingPlanData?.data?.planData?.activated_on;

          let data = await axios.get(
            "https://cdn.shopify.com/s/javascripts/currencies.js"
          );
    
          let filtered = await eval(
            new Function(`
               
               ${data?.data}
               
               return Currency;
               
               `)
          )();
    
         if (filtered) {
             let range =
              (!billingPlan || billingPlan == "")
                ? new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
                : billingPlan == "free"
                ? getFreePlanDate(new Date(), new Date(planBuyDate))
                : planBuyDate;
             console.log("inclculatebllin range",range)
    
            let response = await getData({ range }, filtered?.rates) ;
              
            // count.current = count.current + 1;
          }           

        }
     
        // setLoader(false);
      }, []);
    
      const getData = async (body, rates) => {
        // console.log("getData--->", body);
    
        const response = await postApi("/api/admin/calculateRevenue", body, app);
    
        // console.log("response", response);
    
        if (response?.data?.message === "success") {
          // console.log("dfdfd", response?.data?.data);
    
          // console.log("trates", rates);
    
          let arr = response?.data?.data;
          let sum = 0;
    
          if (arr.length > 0) {
            arr.map((item) => {
              sum =
                sum +
                parseFloat(item.total_amount) *
                  parseFloat(rates[item?.currency] / rates["USD"]);
              // console.log("checkitemsrev", sum);
            });
          }
    
          // console.log("insidebarrr--sum", sum,typeof undefined);
          //  sum =100000;
         if(props?.setRevenue)
         {
             console.log("inifprops")
            props.setRevenue(sum)
        };
           // Billing plan is available, update the state
        
      
            if (billingPlan == "starter" && sum >= 5000) {
        
              navigate("/billing?upgrade=true")
             
          
            } else if (billingPlan === "premium" && sum >= 30000) {
            
              navigate("/billing?upgrade=true")
      
    
           
            } else if (billingPlan === "premiere" && sum >= 100000) {
              
              navigate("/billing?upgrade=true")
             } else {
              // if ((billingPlan == "" || billingPlan == "free") && sum >= 750) {
                if (( billingPlan == "free" || billingPlan== "" || billingPlan== undefined) && sum >= 750) {
                navigate("/billing?upgrade=true")
              } else {
                // console.log("262783939",billingPlan)
                
              }
            }
          
        }
      };
    
      function getFreePlanDate(endDate, startDate) {
        const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    
        // console.log("endDate, startDate", endDate, startDate);
        const timeDifference = Math.abs(endDate - startDate);
      
        let daysDifference = Math.floor(timeDifference / oneDay);
        const today = new Date();
        // today.setHours(0, 0, 0, 0);
        // console.log("sdsdsd",daysDifference)
        if (daysDifference > 30) {
          let remaining = parseInt(daysDifference / 30);
          //  console.log("dsdasa",daysDifference)
          const finaldate = new Date(
            today.getTime() - remaining * 24 * 60 * 60 * 1000
          );
          // console.log("jkkkk",finaldate)
          return finaldate;
        } else {
          const finaldate = new Date(
            today.getTime() - daysDifference * 24 * 60 * 60 * 1000
          );
          return finaldate;
        }
      }
    
  return  null ;
  
}

export default CalculateBillingUsage