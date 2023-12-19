import React from 'react'
 import dayjs from "dayjs";
 import { Tabs, Button, Spin, Empty,Modal,DatePicker,Form } from "antd";
 import { useForm } from "antd/lib/form/Form";


function Demo() {
const [form]=useForm()

const onFinish=(values)=>{
console.log("values",values)

}

  return (
    <div> 
        
        <Form
        form={form}
        layout="vertical"
        // requiredMark={!(existingSubscription != {} && mode == "view")}
        requiredMark={false}
        onFinish={onFinish}

        scrollToFirstError={true}
      >


<Form.Item
                      
                      name="startDate"
                      initialValue={dayjs(
                        new Date().getTime() + 1 * 24 * 60 * 60 * 1000
                      )}
                      tooltip="Date when subscription starts(* Valid for existing customers only)"
                      rules={[
                        {
                          required: true,
                          message: "Please select start date!",
                        },
                      ]}
                      // extra="Valid for existing customers only"
                    >
                      <DatePicker
                        allowClear={false}
                        showTime={false}
                        showToday={false}
                        // disabledDate={handleDisableDate}
                        // showTime={{
                        //   hideDisabledOptions: true,
                        //   defaultValue: [dayjs("00:00:00", "HH:mm:ss")],
                        // }}
                        format="YYYY-MM-DD"
                        // disabled={
                        //   existingSubscription != {} &&
                        //   (mode == "view" ||
                        //     (mode == "edit" &&
                        //       edit["subscriptionDetails"] == false))
                        // }
onChange={(a,b)=>console.log(a,b)}

                      />
                    </Form.Item>
      <Button  htmlType="submit">sdfesd</Button>


      </Form>
        
     
        {/* <DatePicker
    allowClear={false}
    showTime={false}
    showToday={false}
    // disabledDate={handleDisableDate}
    // showTime={{
    //   hideDisabledOptions: true,
    //   defaultValue: [dayjs("00:00:00", "HH:mm:ss")],
    // }}
    format="YYYY-MM-DD"
  //  defaultValue={}
//   onChange={handleDateChange}
//   value={dayjs(selected?.fulfill_at)}
  /> */}
  
  
  
  </div>
  )
}

export default Demo