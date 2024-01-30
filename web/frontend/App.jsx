import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import "./assets/style/main.css"
import { ToastContainer, toast } from "react-toastify"
import ContextProvider from "./components/common/commonContext";
import "react-toastify/dist/ReactToastify.css"

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
// import { useAPI } from "./components/common/commonContext";
export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
//   const {billingPlan}=useAPI();
  
// console.log("urgencyyyy",billingPlan)
  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
          <ContextProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: "Create Subscription",
                  destination: "/createsubscription",
                },
              ]}
              />
            <Routes pages={pages} />
            </ContextProvider>
          </QueryProvider>
        </AppBridgeProvider>
        <ToastContainer closeButton={false} limit={5} />
      </BrowserRouter>
    </PolarisProvider>
  );
}
