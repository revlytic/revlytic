import React, { useState,useEffect} from "react";
import { Tabs, Button,Spin } from "antd";
import Default from "../components/emailtemplate/default";
import EmailSetting from "../components/emailtemplate/emailSetting";
import Custom from "../components/emailtemplate/custom";
import DefaultTemp from "../components/emailtemplate/default2";
import DynamicVariables from "../components/emailtemplate/dynamicVariables";
import postApi from "../components/common/postApi";
import { useLocation } from "react-router-dom";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "@shopify/app-bridge-react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";


const EmailTemplate = () => {
 const [loader,setLoader]=useState(false)
  // const [templateType,setTemplateType]=useState("");
   const location = useLocation();
   const queryParams = location.search;
   const params = new URLSearchParams(queryParams);
   const templateType = params.get("type");
   const app=useAppBridge();
  const navigate= useNavigate()
console.log("checkingType",templateType)

const [formData, setFormData] = useState({})
// const [editorState, setEditorState] = useState(null);

const [editorStateContentText, setEditorStateContentText] = useState(
  EditorState.createEmpty()
);
const [editorStateShippingAddress, setEditorStateShippingAddress] = useState(
  EditorState.createEmpty()
);
const [editorStateBillingAddress, setEditorStateBillingAddress] = useState(
  EditorState.createEmpty()
);
const [editorStateFooterText, setEditorStateFooterText] = useState(
  EditorState.createEmpty()
);
  useEffect(async () => {
    setLoader(true);
    let res = await postApi("/api/admin/getEmailTemplateAndConfigData", {templateType:templateType}, app);
    let response = await postApi("/api/admin/getEmailTemplateData", {templateType:templateType}, app);
    if (response?.data?.message == "success") {
    let result=response.data.data

      console.log("result",result)
       setFormData(result);

       setInitialEditorState("contentText", result.contentText);
       setInitialEditorState("shippingAddress", result.shippingAddress);
       setInitialEditorState("billingAddress", result.billingAddress);
       setInitialEditorState("footerText", result.footerText);

      console.log("dddddd",result)
    } else {
    }

    setLoader(false);
  }, []);


  // const contentState = editorState.getCurrentContent();
  // const contentStateWithEntity = contentState.createEntity(
  //     type,
  //     'IMMUTABLE',
  //     {}
  // )
  // const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  // const newEditorState = EditorState.set(editorState,{currentContent:contentStateWithEntity})
  // this.setState({
  //     editorState:AtomicBlockUtils.insertAtomicBlock(
  //         newEditorState,
  //         entityKey,
  //         ''
  //     )



  const setInitialEditorState = (editorName, initialValue) => {
    if (initialValue) {
      console.log(" in initial statteeeditooo",initialValue)
      const blocksFromHTML = convertFromHTML(initialValue);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      switch (editorName) {
        case "contentText":
          setEditorStateContentText(
            EditorState.createWithContent(contentState)
          );
          break;
        case "shippingAddress":
          setEditorStateShippingAddress(
            EditorState.createWithContent(contentState)
          );
          break;
        case "billingAddress":
          setEditorStateBillingAddress(
            EditorState.createWithContent(contentState)
          );
          break;
        case "footerText":
          setEditorStateFooterText(EditorState.createWithContent(contentState));
          break;
        default:
          break;
      }
    }
  };



  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: `Default`,
      children: (
        <DefaultTemp
          formData={formData}
          setFormData={setFormData}
          templateType={templateType}
          loader={loader}
          setLoader={setLoader}
          editorStateContentText={editorStateContentText}
          setEditorStateContentText={setEditorStateContentText}
          editorStateShippingAddress={editorStateShippingAddress}
          setEditorStateShippingAddress={setEditorStateShippingAddress}
          editorStateFooterText={editorStateFooterText}
          setEditorStateFooterText={setEditorStateFooterText}
          editorStateBillingAddress={editorStateBillingAddress}

          setEditorStateBillingAddress={setEditorStateBillingAddress}
        />
      ),
    },
    // {
    //   key: '2',
    //   label: `Email Setting`,
    //   children: <EmailSetting formData={formData} setFormData={setFormData} textEditorData={textEditorData} setTextEditorData={setTextEditorData}/>,
    // },

    // {
    //   key: "2",
    //   label: `Custom`,
    //   children: (
    //     <Custom
    //       formData={formData}
    //       setFormData={setFormData}
    //       textEditorData={textEditorData}
    //       setTextEditorData={setTextEditorData}
    //       templateType={templateType}

    //     />
    //   ),
    // },
    {
      key: "3",
      label: `Dynamic Variables`,
      children: (
        <DynamicVariables
          formData={formData}
          setFormData={setFormData}
          templateType={templateType}
          // textEditorData={textEditorData}
          // setTextEditorData={setTextEditorData}
        />
      ),
    },
  ];





  return (
   <>
 
    <Spin spinning={loader} size="large" tip="Loading...">
    <Button
          type="link"
          style={{ color: "#000000" }}
          onClick={() => navigate("/emailtemplatesList")}
        >
          <ArrowLeftOutlined /> Email Templates
        </Button>
    <div className="revlytic default-and-dynamic-Varriables">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
     </Spin>
  
     </>
  );
};

export default EmailTemplate;








// import React, { useState,useEffect} from "react";
// import { Tabs, Button,Spin } from "antd";
// import Default from "../components/emailtemplate/default";
// import EmailSetting from "../components/emailtemplate/emailSetting";
// import Custom from "../components/emailtemplate/custom";
// import DynamicVariables from "../components/emailtemplate/dynamicVariables";
// import postApi from "../components/common/postApi";
// import { useLocation } from "react-router-dom";
// import { useAppBridge } from "@shopify/app-bridge-react";
// import DefaultTemp from "../components/emailtemplate/default2";

// const EmailTemplate = () => {
//  const [loader,setLoader]=useState(false)
//   // const [templateType,setTemplateType]=useState("");
//    const location = useLocation();
   
 
//    const queryParams = location.search;
//    const params = new URLSearchParams(queryParams);
//    const templateType = params.get("type");
//    const app=useAppBridge();
  
// console.log("checkingType",templateType)


//   const [formData, setFormData] = useState({
//     showCurrency: true,
//     showShippingAddress: true,
//     showBillingAddress: true,
//     showPaymentMethod: true,
//     showOrderNumber: true,
//     showLineItems: true,
//     logoUrl: "",
//     logoHeight: "50",
//     logoWidth: "170",
//     logoAlignment: "right",
//     headingText: "Welcome",
//     headingTextColor: "#1B1B1B",
//     // contentText:"content",
//     textColor: "#767676",
//     manageSubscriptionText: "Manage Subscription",
//     manageSubscriptionTextColor: "#FFFFFF",
//     // manageubscriptionUrl:
//     manageSubscriptionButtonBackground: "#0F550C",
//     subscriptionShippingAddressText: "Shipping Address",
//     //  subscriptionShippingAddress:"Shipping Address Details" ,
//     subscriptionBillingAddressText: "Billing Address",
//     // subscriptionBillingAddress:"Billing Adddress Details",
//     deliveryFrequencyText: "Delivery Frequency",
//     nextBillingDateText: "Next Billing Date",
//     planNameText: "Plan Name",
//     billingFrequencyText: "Billing Frequency",
//     orderNumberText: "Order Number",
//     paymentMethodText: "Payment Method",
//     endingWithText: "ending with",
   
//     // footerText:"Thank You",

//      emailSetting:{
//       subject:"sdsdsdfs",
//        bcc:"sdd",
//       ccc:"dsd",
//       replyTo:"sdsd"
//  },
//  contentText:
//  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
// shippingAddress: "St. Louis Road, Venice,Italy",
// billingAddress: "St. Louis Road, Venice,Italy",
// footerText: "Thank yOu",
//    });

//   const [textEditorData, setTextEditorData] = useState({});


// useEffect(() => {
// if(location.state?.data){
//   setFormData(location.state?.data)
// }
// }, [])


// //   useEffect(async () => {
// //     setLoader(true);
// //     let response = await postApi("/api/admin/getEmailTemplateData", {templateType:templateType}, app);
// //     if (response?.data?.message == "success") {
// // let result=response.data.data

    
// //       console.log("result",result)
// //        setFormData(result);
      
// //     } else {
// //     }
// //     setLoader(false);
// //   }, []);



//   const onChange = (key) => {
//     console.log(key);
//   };
//   const items = [
//     {
//       key: "1",
//       label: `Default`,
//       children: (
//         <DefaultTemp
//           formData={formData}
//           setFormData={setFormData}
//           textEditorData={textEditorData}
//           setTextEditorData={setTextEditorData}
//           templateType={templateType}
//           loader={loader}
//           setLoader={setLoader}
//         />
//       ),
//     },
//     // {
//     //   key: '2',
//     //   label: `Email Setting`,
//     //   children: <EmailSetting formData={formData} setFormData={setFormData} textEditorData={textEditorData} setTextEditorData={setTextEditorData}/>,
//     // },

//     // {
//     //   key: "2",
//     //   label: `Custom`,
//     //   children: (
//     //     <Custom
//     //       formData={formData}
//     //       setFormData={setFormData}
//     //       textEditorData={textEditorData}
//     //       setTextEditorData={setTextEditorData}
//     //       templateType={templateType}

//     //     />
//     //   ),
//     // },
//     {
//       key: "3",
//       label: `Dynamic Variables`,
//       children: (
//         <DynamicVariables
//           formData={formData}
//           setFormData={setFormData}
//           textEditorData={textEditorData}
//           setTextEditorData={setTextEditorData}
//         />
//       ),
//     },
//   ];





//   return (
//     <Spin spinning={loader} size="large" tip="Loading...">
//       <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

//      </Spin>
    
//   );
// };

// export default EmailTemplate;
