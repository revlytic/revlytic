import React, { useEffect, useState } from "react";
import { Card, Button, Form, Input, Spin } from "antd";
import { toast } from "react-toastify";
import { useForm } from "antd/lib/form/Form";
import postApi from "../components/common/postApi";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useAPI } from "../components/common/commonContext";
function ContactUs() {
  const [form] = useForm();
  const app = useAppBridge();
  const [loader, setLoader] = useState(false);
  const { storeDetails } = useAPI();


  const onFinish = async (values) => {
    console.log("onfinish", values);
    setLoader(true);

    let options = {
      to: "support@revlytic.co",
      subject: "Revlytic Customer Enquiry",
      html: `<div>Name :  <strong> ${values?.name?.trim()}</strong> <div>
    <div>Email :  <strong> ${values?.email?.trim()}</strong> <div>
    <div>Message :  <strong> ${values?.message?.trim()}</strong> <div>
    <div>Store :  <strong> ${storeDetails?.shop}</strong> <div>
    <div>Store Password :  <strong> ${values.storepassword}</strong> <div>
    `,
    };

    let response = await postApi(
      "/api/admin/sendMail",
      { options: options },
      app
    );

    setLoader(false);
    if (response.data.message == "success") {
      toast.success(response.data.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
      form.resetFields();
    } else {
      toast.error(response.data.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const validateNoEmptySpaces = (data, value) => {
    
    if (!value || value.trim() === '') {
      if(data.field=='name'){
      return Promise.reject(new Error('Name is required!'));
    }
    else{
      return Promise.reject(new Error('Message is required!'));
    }
  }
    return Promise.resolve();
  }; 

  return (
    <Spin spinning={loader} size="large" tip="Loading...">
      <Form
        form={form}
        layout="vertical"
        // requiredMark={!(existingSubscription != {} && mode == "view")}
        requiredMark={false}
        onFinish={onFinish}
        scrollToFirstError={true}
      >
        <div className="revlytic plan-group-listing-button">
          <h1 className="revlytic-plan-switch-heading">Contact Us</h1>
        </div>

        <Card>
          <Form.Item
            label={<p className="revlytic required">Name</p>}
            name={"name"}
            rules={[
              {
                required: true,
                message: "",
              },
              { validator: validateNoEmptySpaces }
            ]}
          >
            <Input
            // placeholder="Plan Name"
            />
          </Form.Item>
          <Form.Item
            label={<p className="revlytic required">Email</p>}
            name={"email"}
            rules={[
              {
                required: true,
                message: "Email is required!",
              },
              {
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            ]}
          >
            <Input
            // placeholder="Plan Name"
            />
          </Form.Item>

          <Form.Item
            label={
              <p className="revlytic contactus-password">Store Password</p>
            }
            name={"storepassword"}
          >
            <Input
            // placeholder="Plan Name"
            />
          </Form.Item>
          <Form.Item
            label={<p className="revlytic required">Message</p>}
            name="message"
            rules={[
              {
                required: true,
                message: "",
              },
              { validator: validateNoEmptySpaces }
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button className="revlytic-save-subscription" htmlType="submit">
            Send
          </Button>
        </Card>
      </Form>
      
      {/* <Button onClick={()=> open("https://sahil-shine.myshopify.com/admin/themes/current/editor?context=apps&template=settings_data&activateAppId=02743a62-f002-483e-9249-db21ddf2fb51/revlytic", "_blank")}></Button>  */}
      {/* <Button onClick={()=> open("https://sahil-shine.myshopify.com/admin/themes/current/editor?template=product&addAppBlockId=02743a62-f002-483e-9249-db21ddf2fb51/revlytic_app_bock", "_blank")}></Button> */}
     

    </Spin>
  );
}

export default ContactUs;
