import React, { useState } from "react";
import { Button, Checkbox, Collapse, Select, Switch, Tooltip } from "antd";
import {
  QuestionCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";

function Dunning() {
  const { Panel } = Collapse;
  const [activeKeyArray, setActiveKeyArray] = useState([]);
  const [attemptNum, setAttemptNum] = useState(3);

  const[enableDunningNotices,setEnableDunningNotices]=useState(false)
  const[enableStatements,setEnableStatements]=useState(false)
  const[statementsInput,setStatementsInput]=useState(1)
  const[showDueDate , setShowDueDate] = useState(false)
  const[showOverdueInvoices ,setShowOverdueInvoices] = useState(false)
  const [dunningNoticeType,setDunningNoticeType]=useState('perInvoice')

  const [attemptList, setAttemptList] = useState([ { retryAfterDays: 2, selectedTemplate: "standardCourtsyNotice" },
  { retryAfterDays: 2, selectedTemplate: "standardPastDueNotice1" },
  { retryAfterDays: 2, selectedTemplate: "standardPastDueNotice2" },
  { retryAfterDays: 2, selectedTemplate: "standardPastDueNotice3" },
  { retryAfterDays: 2, selectedTemplate: "standardFinalDemand" }]);

   
  const retryHeading = ["First", "Second", "Third", "Fourth", "Fifth"];
  const defaultAttemptValues = [
    { retryAfterDays: 2, selectedTemplate: "standardCourtsyNotice" },
    { retryAfterDays: 2, selectedTemplate: "standardPastDueNotice1" },
    { retryAfterDays: 2, selectedTemplate: "standardPastDueNotice2" },
    { retryAfterDays: 2, selectedTemplate: "standardPastDueNotice3" },
    { retryAfterDays: 2, selectedTemplate: "standardFinalDemand" },
  ];

  const handleAttemptChange = (e) => {
    let numRegex = /^\d+(\.\d+)?$/;
    if ( ((numRegex.test(e.target.value) || e.target.value == "") && e.target.value.includes('.')==false )) {
      if (e.target.value < 6) {
        setAttemptNum(e.target.value);
         }
    }
  };

 const handleTemplateChange=(e,index)=>{

   let arr=[...attemptList];
   arr[index].selectedTemplate=e.target.value;
   setAttemptList(arr)

  }

  const handleRetryAfterDaysChange=(e,index)=>{

    let numRegex = /^\d+(\.\d+)?$/;
    if ((numRegex.test(e.target.value) || e.target.value == "") && e.target.value.includes('.')==false ) {
      if (e.target.value < 6 && e.target.value >0 ) {
          let arr=[...attemptList];
          arr[index].retryAfterDays=e.target.value;
          setAttemptList(arr)
}

  }
  }

  const handleStatementsChange=(e)=> {

    let numRegex = /^\d+(\.\d+)?$/;
    if ((numRegex.test(e.target.value) || e.target.value == "") && e.target.value.includes('.')==false ) {
      if (e.target.value < 6 && e.target.value >0 ) {
          setStatementsInput(e.target.value)
      }

  }
  }

const handleSubmit=()=>{

let body={
  enableDunningNotices,
  enableStatements,
  statementsInput,
  showDueDate,
  showOverdueInvoices,
  attemptNum,
  attemptList
}
console.log("body",body)
}

console.log("piopere",enableStatements)

  return (
    <div className="revlytic dunning-main">
      <h1 class="revlytic-plan-switch-heading">
        Dunning Management Configuration
      </h1>
      <Collapse onChange={(e) => setActiveKeyArray(e)} defaultActiveKey={"1"}>
        <Panel
          header={"Dunning Notices  and Statements"}
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
            Welcome to Dunning Management! This page will allow you to configure
            settings related to your Dunning Notices
          </p>
          <div className="revlytic-dunning-section">
            <div className="revlytic-dunning-section-label">
              <h4>Dunning Notices</h4>
              <Tooltip title="Allow customers to place a recurring subscription order immediately.">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <div className="revlytic-dunning-section-select">
              <select value={dunningNoticeType} onChange={(e)=>setDunningNoticeType(e.target.value)}>
                <option value='perInvoice'>Per Invoice</option>
                <option value='consolidated'>Consolidated</option>
              </select>
            </div>
            <div className="revlytic-dunning-section-switch">
              <label>Enable/disable</label>
              <Switch onChange={(val)=>setEnableDunningNotices(val)} checked={enableDunningNotices} />
            </div>
          </div>

          <div className="revlytic-dunning-section">
            <div className="revlytic-dunning-section-label">
              <h4>Enable Statements</h4>
              <Tooltip title="Allow customers to place a recurring subscription order immediately.">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <div className="revlytic-dunning-section-input">
              <input type="number"  onChange={handleStatementsChange} value={statementsInput}/>
            </div>
            <div className="revlytic-dunning-section-switch">
              <label>Enable/disable</label>
              <Switch  checked={enableStatements} onChange={(val)=>setEnableStatements(val) } />
            </div>
          </div>

          <div className="revlytic-dunning-stage">
            <div className="revlytic-dunning-stage-item">
              <label>Show case stage</label>
              <Checkbox
              // onChange={(e) =>
              //   handleInputChange(
              //     "showPredefinedDeliveryFrequencies",
              //     e.target.checked
              //   )
              // }
              />
            </div>

            <div className="revlytic-dunning-stage-item">
              <label>Show Secondary stage</label>
              <Checkbox />
            </div>

            <div className="revlytic-dunning-stage-item">
              <label>Show Due Date</label>
              <Checkbox  checked={showDueDate} onChange={(e)=>setShowDueDate(e.target.checked)}/>
            </div>

            <div className="revlytic-dunning-stage-item">
              <label>Show Overdue Invoice</label>
              <Checkbox checked={showOverdueInvoices} onChange={(e)=>setShowOverdueInvoices(e.target.checked)} />
            </div>
          </div>
        </Panel>

        <Panel
          header={"Collection Case Stage"}
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
            Below you can enter the number attempts Revlytic will make to
            collect the order payment from your customer in the case that they
            fail to pay. Once you enter the number and click “Set”, the number
            of stages will appear below. Next, you can select the number of days
            after the initial payment faliure you’d like this collection attempt
            to take place. Finally, you can add and customize the Email template
            that will be sent the your customer when Revlytic attempts to retry
            collection attempt.
          </p>
          <div className="revlytic-dunning-section">
            <div className="revlytic-dunning-section-label">
              <h4>No of attempts</h4>
              <Tooltip title="Allow customers to place a recurring subscription order immediately.">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <div className="revlytic-dunning-section-input">
              <input
                type="number"
                onChange={handleAttemptChange}
                value={attemptNum}
              />
            </div>
            {/* <Button>Set</Button> */}
          </div>


         {attemptList.length > 0  && attemptList?.map((item,index)=>


<div className="revlytic-case-dunning-sec-main">
<h4>{retryHeading[index]} Retry</h4>

<div className="revlytic-dunning-section revlytic-case-dunning-sec">
  <div className="revlytic-dunning-section-input case-stage-dunning">
    <span>
      <input type="number" value={item?.retryAfterDays}  pattern="[0-9]" onChange={(e)=>handleRetryAfterDaysChange(e,index)} />
    </span>
    <h3>Days After Failure:</h3>
  </div>

  <div className="revlytic-dunning-section-select">
    <select name="" id=""  value={item?.selectedTemplate} onChange={(e)=>handleTemplateChange(e,index)}>
      <option value="standardCourtsyNotice">Standard Courtsy Notice</option>
      <option value="standardPastDueNotice1">Standard Past Due Notice 1</option>
      <option value="standardPastDueNotice2">Standard Past Due Notice 2</option>
      <option value="standardPastDueNotice3">Standard Past Due Notice 3</option>
      <option value="standardFinalDemand">Standard Final Demand</option>
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
)
}
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
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
}

export default Dunning;
