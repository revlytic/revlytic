import { Button, Card, Checkbox, ColorPicker, Form, Select, Spin } from "antd";
import React, { useState } from "react";

function bundleSettings() {
  const [form] = Form.useForm();

  const [loader, setLoader] = useState(false); // for loader
  const [color, setColor] = useState("#39ff12");
  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <Spin tip="Loading..." size="large" spinning={loader}>
      {/* <div><h1>Bundle Settings</h1><Button>Save</Button></div> */}

      <Form
        layout="vertical"
        form={form}
        name="control-hooks"
        onFinish={onFinish}
      >
        <div className="revlytic create-bundle-button">
          <h2>Bundle Settings</h2>
          <Button htmlType="submit">{"Save"}</Button>
        </div>
          <div >
            <Card>
              <Form.Item
                name="redirect"
                label="Redirect To"
                initialValue={"cart"}
              >
                <Select
                  //   placeholder="Select a option and change input text above"
                  allowClear
                >
                  <Option value="cart">CART</Option>
                  <Option value="checkout">CHECKOUT</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="showOnProductPage"
                className="create-bundle-default-check"
                valuePropName="checked"
                wrapperCol={{
                  span: 16,
                }}
              >
                <Checkbox>Show On Product Page</Checkbox>
              </Form.Item>
              <Form.Item
                name="multipleOnProductPage"
                className="create-bundle-default-check"
                valuePropName="checked"
                wrapperCol={{
                  span: 16,
                }}
              >
                <Checkbox>Show Multiple On Product Page</Checkbox>
              </Form.Item>
              <Form.Item
                name="showDiscountOnCArt"
                className="create-bundle-default-check"
                valuePropName="checked"
                wrapperCol={{
                  span: 16,
                }}
              >
                <Checkbox>Show Discount In Cart</Checkbox>
              </Form.Item>
              <Form.Item
                name="cartButtonColor"
                label="Checkout Button Cart Color"
              >
                <ColorPicker />
              </Form.Item>
            </Card>
          </div>
      </Form>
    </Spin>
  );
}

export default bundleSettings;
