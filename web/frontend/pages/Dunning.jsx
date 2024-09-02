import React, { useEffect, useState } from "react";
import { Checkbox, Collapse, Spin, Tooltip, Switch, Button } from "antd";
import {
  QuestionCircleOutlined,
  MinusOutlined,
  PlusOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import postApi from "../components/common/postApi";
import { useAppBridge } from "@shopify/app-bridge-react";
import { toast } from "react-toastify";
import CalculateBillingUsage from "../components/calculateBillingUsage";

function Dunning2() {
  const { Panel } = Collapse;
  const app = useAppBridge();
  const [billingPlan, setBillingPlan] = useState("");
  const [activeKeyArray, setActiveKeyArray] = useState([]);
  const [dunningNoticeType, setDunningNoticeType] = useState("perInvoice");
  const [loading, setLoading] = useState(true);

  const [enableDunningNotices, setEnableDunningNotices] = useState(false);
  const [enablePaymentAttempt, setEnablePaymentAttempt] = useState(false);
  const [statementsInput, setStatementsInput] = useState(2);
  const [showDueDate, setShowDueDate] = useState(false);
  const [showOverdueInvoices, setShowOverdueInvoices] = useState(false);

  // const [attemptNum, setAttemptNum] = useState(1);
  const [attemptList, setAttemptList] = useState([
    { retryAfterDays: 1, selectedTemplate: "standardCourtsyNotice" },
    // { retryAfterDays: 2, selectedTemplate: "standardPastDueNotice1" },
    // { retryAfterDays: 3, selectedTemplate: "standardPastDueNotice2" },
    // { retryAfterDays: 4, selectedTemplate: "standardPastDueNotice3" },
    // { retryAfterDays: 5, selectedTemplate: "standardFinalDemand" },
  ]);

  const retryHeading = ["First Payment", "Second Payment", "Third Payment", "Fourth Payment", "Fifth Payment"];

  useEffect(async () => {
    fetchDunningData();
    getEmailTemplatesCount();
  }, []);

  const getEmailTemplatesCount = async () => {
    let response = await postApi("/api/admin/getEmailTemplatesCount", {}, app);
    if (response?.data?.message == "success") {
      let existingTemplatesLength = response?.data?.templatesLength;

      if (existingTemplatesLength < 9) {
        let templatesData = await postApi(
          "/api/admin/saveDunningTemplates",
          {},
          app
        );
      }
    } else {
    }
  };

  const fetchDunningData = async () => {
    let response = await postApi("api/admin/fetchDunningData", {}, app);
    if (response?.data?.message == "success") {
      setDunningNoticeType(response?.data?.data?.dunningNoticeType);
      setEnableDunningNotices(response?.data?.data?.enableDunningNotices);
      setEnablePaymentAttempt(response?.data?.data?.enablePaymentAttempt);
      setStatementsInput(response?.data?.data?.statementsInput);
      setShowDueDate(response?.data?.data?.showDueDate);
      setShowOverdueInvoices(response?.data?.data?.showOverdueInvoices);
      setAttemptList(response?.data?.data?.attemptList);
    }
    setLoading(false);
  };

  const handleTemplateChange = (e, index) => {
    let arr = [...attemptList];
    arr[index].selectedTemplate = e.target.value;
    setAttemptList(arr);
  };


const checkRange=(index,inputValue)=>{
let flag = false;
switch(attemptList.length){
case 1 :
  flag= inputValue > 10 ? true  : false
  break ;
case 2 :
  flag= inputValue >= 10 && index < 1 ? true  : false
  break ;
case 3 :
 flag= inputValue >= 10  && index < 2 ? true  : false
 break ;
case 4 :
flag= inputValue >= 10  && index < 3 ? true  : false
break ;
case 5 :
flag= inputValue >= 10  && index < 4 ? true  : false
break ;
}
return flag;
}

  const handleRetryAfterDaysChange = (e, index) => {
      let numRegex = /^\d+(\.\d+)?$/;  
    if (
      (numRegex.test(e.target.value) || e.target.value == "") &&
      e.target.value.includes(".") == false
    ) {

      if (e.target.value > 0 && e.target.value <=10) {
        if(checkRange(index,e.target.value)){
            return ;
          }
     
const newValue=parseInt(e.target.value)
const newArray = [...attemptList];
// Ensure the new value is valid and maintain increasing order
if (index > 0 && newValue <= newArray[index - 1].retryAfterDays) {
     newArray[index].retryAfterDays = newArray[index - 1].retryAfterDays + 1;
} else {
   newArray[index].retryAfterDays = newValue;
}
// Adjust subsequent values to maintain increasing order
for (let i = index + 1; i < newArray.length; i++) {
  if ((newArray[i].retryAfterDays <= newArray[i - 1].retryAfterDays)  ) {
    
    if( newArray[newArray.length-1].retryAfterDays==10 ){       
        return ;
        }
    newArray[i].retryAfterDays = newArray[i - 1].retryAfterDays + 1;
  } else {   
       break;
  }
}
setAttemptList(newArray);
      }
    }
  };


  const handleStatementsChange = (e) => {
    let numRegex = /^\d+(\.\d+)?$/;
    if (
      (numRegex.test(e.target.value) || e.target.value == "") &&
      e.target.value.includes(".") == false
    ) {
      if (e.target.value < 6 && e.target.value > 0) {
        setStatementsInput(e.target.value);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    let body = {
      dunningNoticeType,
      enableDunningNotices,
      enablePaymentAttempt,
      statementsInput,
      showDueDate,
      showOverdueInvoices,      
      attemptList,
    };

    let response = await postApi(
      "/api/admin/saveDunningData",
      { ...body },
      app
    );
    if (response?.data?.message == "success") {
      toast.success("Data saved successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setLoading(false);
  };


const handleAddOption=()=>{
 let copy=[...attemptList] ;
 switch (copy.length) {
    case 1:
  copy.push({ retryAfterDays: parseInt(copy[0].retryAfterDays) + 1 , selectedTemplate: "standardPastDueNotice1" });
    break;
  case 2:
    copy.push({ retryAfterDays: parseInt(copy[1].retryAfterDays) + 1, selectedTemplate: "standardPastDueNotice2" });
    break;
  case 3:
    copy.push({ retryAfterDays: parseInt(copy[2].retryAfterDays) + 1, selectedTemplate: "standardPastDueNotice3" });
    break;
  case 4:
    copy.push({ retryAfterDays: parseInt(copy[3].retryAfterDays) + 1, selectedTemplate: "standardFinalDemand" });   
    break; 
  }
  setAttemptList(copy)
}

const deleteOption=(index)=>{
    let copy=[...attemptList];
    copy.splice(index,1);
    setAttemptList(copy);
}

  return (
    <Spin spinning={loading} size="large" tip="Loading...">
      <div className="revlytic dunning-main">
        <h1 className="revlytic-plan-switch-heading">
          Dunning Management Configuration
        </h1>
        <Collapse onChange={(e) => setActiveKeyArray(e)} defaultActiveKey={"1"}>
         
        <Panel
            header={"Upcoming Order Notification"}
            key="1"
            showArrow={false}
            extra={
              <div className="revlytic-dunning-collapseIcon">
                {activeKeyArray?.includes("1") ? (
                  <MinusOutlined />
                ) : (
                  <PlusOutlined />
                )}
              </div>
            }
          >
            <p>
            Please select your Upcoming Order Notification settings below.
            </p>
            {/* start */}
            <div className="revlytic-dunning-section">
              <div className="revlytic-dunning-section-label">
                <h4>Enable  Notification</h4>
                <Tooltip title="Toggle to enable or disable sending email notifications for upcoming orders.">
                  <QuestionCircleOutlined /> 
                </Tooltip>
              </div>
              {/* <div className="revlytic-dunning-section-input">
                <input
                  type="number"
                  onChange={handleAttemptChange}
                  value={attemptNum}               
              
                />
              </div> */}        

              <div className="revlytic-dunning-section-switch">
                {/* <label>Enable/disable</label> */}
                <Switch
                  onChange={(val) => setEnableDunningNotices(val)}
                  checked={enableDunningNotices}
                />
              </div>
            </div>
{/* endd */}

             <div className="revlytic-dunning-section">
              <div className="revlytic-dunning-section-label">
                <h4>Days Before Order</h4>
                <Tooltip title="Days before order date to send notification email. Maximum number of days allowed is 5.">
                  <QuestionCircleOutlined />
                </Tooltip>
              </div>
              <div className="revlytic-dunning-section-input">
                <input
                  type="number"
                  onChange={handleStatementsChange}
                  value={statementsInput}
                />
              </div>
              {/* <div className="revlytic-dunning-section-switch">
              <label>Enable/disable</label>
              <Switch  checked={enablePaymentAttempt} onChange={(val)=>setEnablePaymentAttempt(val) } />
            </div> */}
            </div>

            {/* <div className="revlytic-dunning-stage">
              <div className="revlytic-dunning-stage-item">
                <label>Show Due Date</label>
                <Checkbox
                  checked={showDueDate}
                  onChange={(e) => setShowDueDate(e.target.checked)}
                />
              </div>

              <div className="revlytic-dunning-stage-item">
                <label>Show Overdue Invoice</label>
                <Checkbox
                  checked={showOverdueInvoices}
                  onChange={(e) => setShowOverdueInvoices(e.target.checked)}
                />
              </div>
            </div> */}
          </Panel>
         
         
         
          <Panel
            header={"Dunning Management Settings"}
            key="2"
            showArrow={false}
            extra={
              <div className="revlytic-dunning-collapseIcon">
                {activeKeyArray?.includes("2") ? (
                  <MinusOutlined />
                ) : (
                  <PlusOutlined />
                )}
              </div>
            }
          >
            <p>
            Please select your Dunning settings below.
            </p>
            {/* start */}
            <div className="revlytic-dunning-section">
              <div className="revlytic-dunning-section-label">
                <h4>Auto Payment Retry</h4>
                <Tooltip title="Toggle to enable or disable auto payment retry in case an order fails.">
                  <QuestionCircleOutlined /> 
                </Tooltip>
              </div>
              {/* <div className="revlytic-dunning-section-input">
                <input
                  type="number"
                  onChange={handleAttemptChange}
                  value={attemptNum}               
              
                />
              </div> */}        

              <div className="revlytic-dunning-section-switch">
                {/* <label>Enable/disable</label> */}
                <Switch
                  checked={enablePaymentAttempt}
                  onChange={(val) => setEnablePaymentAttempt(val)}
                />
              </div>
            </div>
{/* endd */}

            <div className="revlytic-dunning-section">
              <div className="revlytic-dunning-section-label">
                <h4>Dunning Notice</h4>
                <Tooltip title="Select 'Per Invoice' to receive a notice for each invoice individually.">
                  <QuestionCircleOutlined />
                </Tooltip>
              </div>
              <div className="revlytic-dunning-section-select">
                <select
                  value={dunningNoticeType}
                  onChange={(e) => setDunningNoticeType(e.target.value)}
                
                >
                  <option value="perInvoice">Per Invoice</option>
                  {/* <option value="consolidated">Consolidated</option> */}
                </select>
              </div>
              {/* <div className="revlytic-dunning-section-switch">
                <label>Enable/disable</label>
                <Switch
                  onChange={(val) => setEnableDunningNotices(val)}
                  checked={enableDunningNotices}
                />
              </div> */}
            </div>

           

            {/* <div className="revlytic-dunning-stage">
              <div className="revlytic-dunning-stage-item">
                <label>Show Due Date</label>
                <Checkbox
                  checked={showDueDate}
                  onChange={(e) => setShowDueDate(e.target.checked)}
                />
              </div>

              <div className="revlytic-dunning-stage-item">
                <label>Show Overdue Invoice</label>
                <Checkbox
                  checked={showOverdueInvoices}
                  onChange={(e) => setShowOverdueInvoices(e.target.checked)}
                />
              </div>
            </div> */}
          </Panel>

          <Panel
            header={"Collection Case Stage"}
            key="3"
            showArrow={false}
            extra={
              <div className="revlytic-dunning-collapseIcon">
                {activeKeyArray?.includes("3") ? (
                  <MinusOutlined />
                ) : (
                  <PlusOutlined />
                )}
              </div>
            }
          >
            <p>
              Below you can add the number of attempts(options) Revlytic will make to
              collect the order payment from your customer in the case that they
              fail to pay. Once you added the options , the number
              of stages will appear below. Next, you can select the number of
              days(Between 1 to 10) after the initial payment faliure you’d like this collection
              attempt to take place. Please note that if the total number of days across all attempts reaches 10, no further options can be added. Finally, you can add and customize the
              Email template that will be sent to your customer when Revlytic
              attempts to retry collection attempt.
            </p>
        

            {attemptList.length > 0 &&
              attemptList?.map((item, index) => (
                <div
                  key={index}
                  // className="revlytic-case-dunning-sec-main"
                  className={
                    !enablePaymentAttempt
                      ? "revlytic-case-dunning-sec-main all-field-disable"
                      : "revlytic-case-dunning-sec-main"
                  }
                >
                  <h4>{retryHeading[index]} Retry</h4>

                  <div className="revlytic-dunning-section revlytic-case-dunning-sec">
                    <div className="revlytic-dunning-section-input case-stage-dunning">
                      <span>
                        <input
                          type="number"
                          value={item?.retryAfterDays}
                           disabled={ !enablePaymentAttempt}
                          pattern="[0-9]"
                          onChange={(e) => handleRetryAfterDaysChange(e, index)}
                        />
                      </span>
                      <h3>Days After Failure:</h3>
                    </div>

                    <div className="revlytic-dunning-section-select">
                      <select
                        name=""
                        id=""
                        value={item?.selectedTemplate}
                        disabled={ !enablePaymentAttempt}
                        onChange={(e) => handleTemplateChange(e, index)}
                      >
                        <option value="standardCourtsyNotice">
                          Standard Courtsy Notice
                        </option>
                        <option value="standardPastDueNotice1">
                          Standard Past Due Notice 1
                        </option>
                        <option value="standardPastDueNotice2">
                          Standard Past Due Notice 2
                        </option>
                        <option value="standardPastDueNotice3">
                          Standard Past Due Notice 3
                        </option>
                        <option value="standardFinalDemand">
                          Standard Final Demand
                        </option>
                      </select>
                    </div>

                    <div className="case-create-template">
                      <span className="case-create-template">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 15 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="7.5"
                            cy="8.5"
                            r="7.5"
                            fill="#0C9F09"
                            className={
                              !enablePaymentAttempt ? "dunning-disabled-svg" : ""
                            }
                          />
                          <path
                            d="M6.6408 11.5653V5.39489H8.35813V11.5653H6.6408ZM4.41211 9.34091V7.62358H10.5826V9.34091H4.41211Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                      <span>
                        <Link
                          to="/emailtemplateslist"
                          className={
                            !enablePaymentAttempt
                              ? "disabled-dunning-templatelink"
                              : ""
                          }
                          disabled={ !enablePaymentAttempt}
                        >
                          Edit Template
                        </Link>
                      </span>
                     {attemptList.length > 1 && <span><button   style={{border:"none",background:"none"}}    disabled={!enablePaymentAttempt}><DeleteOutlined className={!enablePaymentAttempt ? "disabled-deleteicon-dunning" : ""} onClick={()=>deleteOption(index)}/></button></span> }
                    </div>
                  </div>
                </div>
              ))}
              {attemptList.at(-1).retryAfterDays<10 && attemptList.length < 5 && <div> <Button disabled={!enablePaymentAttempt} onClick={handleAddOption}>Additional Payment Retry</Button></div>}
            {/* <div className="revlytic-case-dunning-sec-main">
            <h4>Second Retry</h4>

            <div className="revlytic-dunning-section revlytic-case-dunning-sec">
              <div className="revlytic-dunning-section-input case-stage-dunning">
              <span><input type="text" /></span>
                <h3>Days After Failure:</h3>
              </div>

              <div className="revlytic-dunning-section-select">
                <select name="" id="">
                  <option>dfsdfsdfsdf</option>
                </select>
              </div>

              <div className="case-create-template">
                <span className="case-create-template">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="7.5" cy="8.5" r="7.5" fill="#0C9F09" />
                    <path
                      d="M6.6408 11.5653V5.39489H8.35813V11.5653H6.6408ZM4.41211 9.34091V7.62358H10.5826V9.34091H4.41211Z"
                      fill="white"
                    />
                  </svg>
                </span>
                <span>create new template</span>
              </div>
            </div>
          </div>

          <div className="revlytic-case-dunning-sec-main">
            <h4>Third Retry</h4>
            <div className="revlytic-dunning-section revlytic-case-dunning-sec">
            <div className="revlytic-dunning-section-input case-stage-dunning">
            <span><input type="text" /></span>
                <h3>Days After Failure:</h3>
            </div>

            <div className="revlytic-dunning-section-select">
              <select name="" id="">
                <option>dfsdfsdfsdf</option>
              </select>
            </div>

            <div className="case-create-template">
                <span className="case-create-template">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="7.5" cy="8.5" r="7.5" fill="#0C9F09" />
                    <path
                      d="M6.6408 11.5653V5.39489H8.35813V11.5653H6.6408ZM4.41211 9.34091V7.62358H10.5826V9.34091H4.41211Z"
                      fill="white"
                    />
                  </svg>
                </span>
                <span>create new template</span>
              </div>
</div>

          </div> */}
          </Panel>
        </Collapse>
        <div className="revlytic-dunning-submitBtn">
        <Tooltip
            color="#ffffff"
            title={
              billingPlan != "premium" &&
              billingPlan != "premiere" ? (
                <Link to={`/billing?option=dunning`}>
                  Upgrade your Plan
                </Link>
              ) : (
                ""
              )
            }
          >
          <Button onClick={handleSubmit}  disabled={
                    billingPlan != "premium" &&
                    billingPlan != "premiere"
        }>Submit</Button>
   </Tooltip>
        </div>
      </div>
      <CalculateBillingUsage setBillingPlan={setBillingPlan}/>
    </Spin>
  );
}

export default Dunning2;


// import React, { useEffect, useState } from "react";
// import { Checkbox, Collapse, Spin, Tooltip, Switch, Button } from "antd";
// import {
//   QuestionCircleOutlined,
//   MinusOutlined,
//   PlusOutlined,
// } from "@ant-design/icons";
// import { Link } from "react-router-dom";
// import postApi from "../components/common/postApi";
// import { useAppBridge } from "@shopify/app-bridge-react";
// import { toast } from "react-toastify";
// import CalculateBillingUsage from "../components/calculateBillingUsage";

// function Dunning() {
//   const { Panel } = Collapse;
//   const app = useAppBridge();
//   const [billingPlan, setBillingPlan] = useState("");
//   const [activeKeyArray, setActiveKeyArray] = useState([]);
//   const [dunningNoticeType, setDunningNoticeType] = useState("perInvoice");
//   const [loading, setLoading] = useState(true);

//   const [enableDunningNotices, setEnableDunningNotices] = useState(false);
//   const [enablePaymentAttempt, setEnablePaymentAttempt] = useState(false);
//   const [statementsInput, setStatementsInput] = useState(2);
//   const [showDueDate, setShowDueDate] = useState(false);
//   const [showOverdueInvoices, setShowOverdueInvoices] = useState(false);

//   const [attemptNum, setAttemptNum] = useState(1);
//   const [attemptList, setAttemptList] = useState([
//     { retryAfterDays: 1, selectedTemplate: "standardCourtsyNotice" },
//     { retryAfterDays: 2, selectedTemplate: "standardPastDueNotice1" },
//     { retryAfterDays: 3, selectedTemplate: "standardPastDueNotice2" },
//     { retryAfterDays: 4, selectedTemplate: "standardPastDueNotice3" },
//     { retryAfterDays: 5, selectedTemplate: "standardFinalDemand" },
//   ]);

//   const retryHeading = ["First", "Second", "Third", "Fourth", "Fifth"];

//   useEffect(async () => {
//     fetchDunningData();
//     getEmailTemplatesCount();
//   }, []);

//   const getEmailTemplatesCount = async () => {
//     let response = await postApi("/api/admin/getEmailTemplatesCount", {}, app);
//     if (response?.data?.message == "success") {
//       let existingTemplatesLength = response?.data?.templatesLength;

//       if (existingTemplatesLength < 9) {
//         let templatesData = await postApi(
//           "/api/admin/saveDunningTemplates",
//           {},
//           app
//         );
//       }
//     } else {
//     }
//   };

//   const fetchDunningData = async () => {
//     let response = await postApi("api/admin/fetchDunningData", {}, app);
//     if (response?.data?.message == "success") {
//       setDunningNoticeType(response?.data?.data?.dunningNoticeType);
//       setEnableDunningNotices(response?.data?.data?.enableDunningNotices);
//       setEnablePaymentAttempt(response?.data?.data?.enablePaymentAttempt);
//       setStatementsInput(response?.data?.data?.statementsInput);
//       setShowDueDate(response?.data?.data?.showDueDate);
//       setShowOverdueInvoices(response?.data?.data?.showOverdueInvoices);
//       setAttemptNum(response?.data?.data?.attemptNum);
//       setAttemptList(response?.data?.data?.attemptList);
//     }
//     setLoading(false);
//   };

//   const handleAttemptChange = (e) => {
//     let numRegex = /^\d+(\.\d+)?$/;
//     if (
//       (numRegex.test(e.target.value) || e.target.value == "") &&
//       e.target.value.includes(".") == false
//     ) {
//       if (e.target.value < 6 && e.target.value > 0) {
//         setAttemptNum(e.target.value);
//       }
//     }
//   };

// ///if input  type == 'text'
//   // const handleAttemptChange = (e) => {
//   //   // let numRegex = /^\d+(\.\d+)?$/;
//   //   console.log("etarget",e.target.value)
//   //   const preventChar = [".", "-", "/", "e", "E"];

//   //   if(preventChar.includes(e.target.value)) {
//   //     e.preventDefault();
//   //   }
//   //   let numRegex = /^[1-9]+$/;
//   //   if (
//   //     (numRegex.test(e.target.value) || e.target.value == "")
//   //     // e.target.value.includes(".") == false && e.target.value.includes("-") == false
//   //   ) {         
//   //      if (e.target.value < 6) {
//   //         setAttemptNum(e.target.value);
//   //     }       
//   //   }
    
//   // };

//   const handleTemplateChange = (e, index) => {
//     let arr = [...attemptList];
//     arr[index].selectedTemplate = e.target.value;
//     setAttemptList(arr);
//   };

//   const handleRetryAfterDaysChange = (e, index) => {
//     let numRegex = /^\d+(\.\d+)?$/;
//     if (
//       (numRegex.test(e.target.value) || e.target.value == "") &&
//       e.target.value.includes(".") == false
//     ) {
//       if (e.target.value < 6 && e.target.value > 0) {
//         let arr = [...attemptList];
//         arr[index].retryAfterDays = e.target.value;
//         setAttemptList(arr);
//       }
//     }
//   };

// //   const handleRetryAfterDaysChange = (e, index) => {
 
// //     let numRegex = /^\d+(\.\d+)?$/;
// //     if (
// //       (numRegex.test(e.target.value) || e.target.value == "") &&
// //       e.target.value.includes(".") == false
// //     ) {
// //       if (e.target.value > 0) {
// //         // let arr = [...attemptList];
// //         // arr[index].retryAfterDays = e.target.value;
// //         // setAttemptList(arr);
// // // Create a copy of the array to modify
// // const newValue=parseInt(e.target.value)
// // const newArray = [...attemptList];

// // // Ensure the new value is valid and maintain increasing order
// // if (index > 0 && newValue <= newArray[index - 1].retryAfterDays) {
// //   newArray[index].retryAfterDays = newArray[index - 1].retryAfterDays + 1;
// // } else {
// //    newArray[index].retryAfterDays = newValue;
// // }

// // // Adjust subsequent values to maintain increasing order
// // for (let i = index + 1; i < newArray.length; i++) {
// //   if (newArray[i].retryAfterDays <= newArray[i - 1].retryAfterDays) {
// //     newArray[i].retryAfterDays = newArray[i - 1].retryAfterDays + 1;
// //   } else {
// //        break;
// //   }
// // }
// // setAttemptList(newArray);
// //       }
// //     }
// //   };

 

//   const handleStatementsChange = (e) => {
//     let numRegex = /^\d+(\.\d+)?$/;
//     if (
//       (numRegex.test(e.target.value) || e.target.value == "") &&
//       e.target.value.includes(".") == false
//     ) {
//       if (e.target.value < 6 && e.target.value > 0) {
//         setStatementsInput(e.target.value);
//       }
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     let body = {
//       dunningNoticeType,
//       enableDunningNotices,
//       enablePaymentAttempt,
//       statementsInput,
//       showDueDate,
//       showOverdueInvoices,
//       attemptNum,
//       attemptList,
//     };

//     let response = await postApi(
//       "/api/admin/saveDunningData",
//       { ...body },
//       app
//     );
//     if (response?.data?.message == "success") {
//       toast.success("Data saved successfully", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     } else {
//       toast.error("Something went wrong", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     }
//     setLoading(false);
//   };

//   return (
//     <Spin spinning={loading} size="large" tip="Loading...">
//       <div className="revlytic dunning-main">
//         <h1 className="revlytic-plan-switch-heading">
//           Dunning Management Configuration
//         </h1>
//         <Collapse onChange={(e) => setActiveKeyArray(e)} defaultActiveKey={"1"}>
//           <Panel
//             header={"Dunning Notices  and Statements"}
//             key="1"
//             showArrow={false}
//             extra={
//               <div className="revlytic-dunning-collapseIcon">
//                 {activeKeyArray?.includes("1") ? (
//                   <MinusOutlined />
//                 ) : (
//                   <PlusOutlined />
//                 )}
//               </div>
//             }
//           >
//             <p>
//               Welcome to Dunning Management! This page will allow you to
//               configure settings related to your Dunning Notices
//             </p>
//             <div className="revlytic-dunning-section">
//               <div className="revlytic-dunning-section-label">
//                 <h4>Dunning Notices</h4>
//                 <Tooltip title="Allow customers to place a recurring subscription order immediately.">
//                   <QuestionCircleOutlined />
//                 </Tooltip>
//               </div>
//               <div className="revlytic-dunning-section-select">
//                 <select
//                   value={dunningNoticeType}
//                   onChange={(e) => setDunningNoticeType(e.target.value)}
//                 >
//                   <option value="perInvoice">Per Invoice</option>
//                   <option value="consolidated">Consolidated</option>
//                 </select>
//               </div>
//               <div className="revlytic-dunning-section-switch">
//                 <label>Enable/disable</label>
//                 <Switch
//                   onChange={(val) => setEnableDunningNotices(val)}
//                   checked={enableDunningNotices}
//                 />
//               </div>
//             </div>

//             <div className="revlytic-dunning-section">
//               <div className="revlytic-dunning-section-label">
//                 <h4>Enable Statements</h4>
//                 <Tooltip title="Allow customers to place a recurring subscription order immediately.">
//                   <QuestionCircleOutlined />
//                 </Tooltip>
//               </div>
//               <div className="revlytic-dunning-section-input">
//                 <input
//                   type="number"
//                   onChange={handleStatementsChange}
//                   value={statementsInput}
//                 />
//               </div>
//               {/* <div className="revlytic-dunning-section-switch">
//               <label>Enable/disable</label>
//               <Switch  checked={enablePaymentAttempt} onChange={(val)=>setEnablePaymentAttempt(val) } />
//             </div> */}
//             </div>

//             {/* <div className="revlytic-dunning-stage">
//               <div className="revlytic-dunning-stage-item">
//                 <label>Show Due Date</label>
//                 <Checkbox
//                   checked={showDueDate}
//                   onChange={(e) => setShowDueDate(e.target.checked)}
//                 />
//               </div>

//               <div className="revlytic-dunning-stage-item">
//                 <label>Show Overdue Invoice</label>
//                 <Checkbox
//                   checked={showOverdueInvoices}
//                   onChange={(e) => setShowOverdueInvoices(e.target.checked)}
//                 />
//               </div>
//             </div> */}
//           </Panel>

//           <Panel
//             header={"Collection Case Stage"}
//             key="2"
//             showArrow={false}
//             extra={
//               <div className="revlytic-dunning-collapseIcon">
//                 {activeKeyArray?.includes("2") ? (
//                   <MinusOutlined />
//                 ) : (
//                   <PlusOutlined />
//                 )}
//               </div>
//             }
//           >
//             <p>
//               Below you can enter the number attempts Revlytic will make to
//               collect the order payment from your customer in the case that they
//               fail to pay. Once you enter the number and click “Set”, the number
//               of stages will appear below. Next, you can select the number of
//               days after the initial payment faliure you’d like this collection
//               attempt to take place. Finally, you can add and customize the
//               Email template that will be sent the your customer when Revlytic
//               attempts to retry collection attempt.
//             </p>
//             <div className="revlytic-dunning-section">
//               <div className="revlytic-dunning-section-label">
//                 <h4>No of attempts</h4>
//                 <Tooltip title="Allow customers to place a recurring subscription order immediately.">
//                   <QuestionCircleOutlined />
//                 </Tooltip>
//               </div>
//               <div className="revlytic-dunning-section-input">
//                 <input
//                   type="number"
//                   onChange={handleAttemptChange}
//                   value={attemptNum}               
//                   // min={0}
//                 />
//               </div>
//               {/* <Button>Set</Button> */}

//               <div className="revlytic-dunning-section-switch">
//                 <label>Enable/disable</label>
//                 <Switch
//                   checked={enablePaymentAttempt}
//                   onChange={(val) => setEnablePaymentAttempt(val)}
//                 />
//               </div>
//             </div>

//             {attemptList.length > 0 &&
//               attemptList?.map((item, index) => (
//                 <div
//                   key={index}
//                   className={
//                     index >= attemptNum
//                       ? "revlytic-case-dunning-sec-main all-field-disable"
//                       : "revlytic-case-dunning-sec-main"
//                   }
//                 >
//                   <h4>{retryHeading[index]} Retry</h4>

//                   <div className="revlytic-dunning-section revlytic-case-dunning-sec">
//                     <div className="revlytic-dunning-section-input case-stage-dunning">
//                       <span>
//                         <input
//                           type="number"
//                           value={item?.retryAfterDays}
//                           disabled={index >= attemptNum}
//                           pattern="[0-9]"
//                           onChange={(e) => handleRetryAfterDaysChange(e, index)}
//                         />
//                       </span>
//                       <h3>Days After Failure:</h3>
//                     </div>

//                     <div className="revlytic-dunning-section-select">
//                       <select
//                         name=""
//                         id=""
//                         value={item?.selectedTemplate}
//                         disabled={index >= attemptNum}
//                         onChange={(e) => handleTemplateChange(e, index)}
//                       >
//                         <option value="standardCourtsyNotice">
//                           Standard Courtsy Notice
//                         </option>
//                         <option value="standardPastDueNotice1">
//                           Standard Past Due Notice 1
//                         </option>
//                         <option value="standardPastDueNotice2">
//                           Standard Past Due Notice 2
//                         </option>
//                         <option value="standardPastDueNotice3">
//                           Standard Past Due Notice 3
//                         </option>
//                         <option value="standardFinalDemand">
//                           Standard Final Demand
//                         </option>
//                       </select>
//                     </div>

//                     <div className="case-create-template">
//                       <span className="case-create-template">
//                         <svg
//                           width="20"
//                           height="20"
//                           viewBox="0 0 15 16"
//                           fill="none"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <circle
//                             cx="7.5"
//                             cy="8.5"
//                             r="7.5"
//                             fill="#0C9F09"
//                             className={
//                               index >= attemptNum ? "dunning-disabled-svg" : ""
//                             }
//                           />
//                           <path
//                             d="M6.6408 11.5653V5.39489H8.35813V11.5653H6.6408ZM4.41211 9.34091V7.62358H10.5826V9.34091H4.41211Z"
//                             fill="white"
//                           />
//                         </svg>
//                       </span>
//                       <span>
//                         <Link
//                           className={
//                             index >= attemptNum
//                               ? "disabled-dunning-templatelink"
//                               : ""
//                           }
//                           disabled={index >= attemptNum}
//                           to="/emailtemplateslist"
//                           // onClick={(e) =>
//                           //   index >= attemptNum && e.preventDefault()
//                           // }
//                         >
//                           Edit Template
//                         </Link>
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             {/* <div className="revlytic-case-dunning-sec-main">
//             <h4>Second Retry</h4>

//             <div className="revlytic-dunning-section revlytic-case-dunning-sec">
//               <div className="revlytic-dunning-section-input case-stage-dunning">
//               <span><input type="text" /></span>
//                 <h3>Days After Failure:</h3>
//               </div>

//               <div className="revlytic-dunning-section-select">
//                 <select name="" id="">
//                   <option>dfsdfsdfsdf</option>
//                 </select>
//               </div>

//               <div className="case-create-template">
//                 <span className="case-create-template">
//                   <svg
//                     width="20"
//                     height="20"
//                     viewBox="0 0 15 16"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <circle cx="7.5" cy="8.5" r="7.5" fill="#0C9F09" />
//                     <path
//                       d="M6.6408 11.5653V5.39489H8.35813V11.5653H6.6408ZM4.41211 9.34091V7.62358H10.5826V9.34091H4.41211Z"
//                       fill="white"
//                     />
//                   </svg>
//                 </span>
//                 <span>create new template</span>
//               </div>
//             </div>
//           </div>

//           <div className="revlytic-case-dunning-sec-main">
//             <h4>Third Retry</h4>
//             <div className="revlytic-dunning-section revlytic-case-dunning-sec">
//             <div className="revlytic-dunning-section-input case-stage-dunning">
//             <span><input type="text" /></span>
//                 <h3>Days After Failure:</h3>
//             </div>

//             <div className="revlytic-dunning-section-select">
//               <select name="" id="">
//                 <option>dfsdfsdfsdf</option>
//               </select>
//             </div>

//             <div className="case-create-template">
//                 <span className="case-create-template">
//                   <svg
//                     width="20"
//                     height="20"
//                     viewBox="0 0 15 16"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <circle cx="7.5" cy="8.5" r="7.5" fill="#0C9F09" />
//                     <path
//                       d="M6.6408 11.5653V5.39489H8.35813V11.5653H6.6408ZM4.41211 9.34091V7.62358H10.5826V9.34091H4.41211Z"
//                       fill="white"
//                     />
//                   </svg>
//                 </span>
//                 <span>create new template</span>
//               </div>
// </div>

//           </div> */}
//           </Panel>
//         </Collapse>
//         <div className="revlytic-dunning-submitBtn">
//           <Button onClick={handleSubmit}>Submit</Button>
//         </div>
//       </div>
//       <CalculateBillingUsage setBillingPlan={setBillingPlan}/>
//     </Spin>
//   );
// }

// export default Dunning;
