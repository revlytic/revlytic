import React, { useContext, useState, createContext,useEffect } from "react";
import postApi from "./postApi";
import { useAppBridge } from "@shopify/app-bridge-react";
const APIContext = createContext();

 function ContextProvider({ children }) {
   const [currency,setCurrency]=useState("") ;
   const [currencyCode,setCurrencyCode]=useState("") ;
   const [storeName,setStoreName]=useState("") ;
   const [storeDetails,setStoreDetails]=useState({}) ;
   const app=useAppBridge();
  const [getShop, setGetShop] = useState(new URL(location.href).searchParams.get("shop"));
  console.log("shop",getShop);
     useEffect(async()=>{
      let result = await postApi("api/admin/getCurrencyCode", {}, app);
      
      if (result?.data?.data) {
      
         let getStoreName=result?.data?.data?.shop.split(".myshopify.com")[0];
         
   

        setCurrency(result?.data?.data?.currency);
        setCurrencyCode(result?.data?.data?.currency_code);
        setStoreName(getStoreName)
        setStoreDetails(result?.data?.data)
                
       }
       
   },[])
 
  return (

    <APIContext.Provider value={{ shop: getShop,currency:currency,storeName:storeName,storeDetails:storeDetails}}>

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