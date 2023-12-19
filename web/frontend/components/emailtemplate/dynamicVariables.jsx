import React from "react";
import Preview from "./preview";
import { Button, Card,Collapse } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import copy from "clipboard-copy";
import { toast } from "react-toastify";

function DynamicVariables({
  formData,
  templateType,
  textEditorData,
  setFormData,
  setTextEditorData,
}) 


{

  const { Panel } = Collapse;

  const handleCopy=(option)=>{


  copy(option)
  .then(() => {

    toast.success("Copied text to clipboard successfully!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    console.log();
  })
  .catch((error) => {
    toast.error("Failed to copy text to clipboard!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    
  });

//   console.log(copy(option)
// setToast

}


  return (
    <div className="revlytic dynamic-varriable-main">
      <div className="revlytic dynamic-varriable-copied-data">
        <Card>
<Collapse>
<Panel header="Logo" key="1">
<div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p> Logo Image </p>
              <p>{"{{logo_image}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{{logo_image}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Logo Height </p>
              <p>{"{{logo_height}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{logo_height}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Logo Width</p>
              <p>{"{{logo_width}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{logo_width}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Logo Alignment</p>
              <p>{"{{logo_alignment}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{logo_alignment}}")} />
          </div>
  </Panel>
  
  <Panel header="Shipping Address" key="2">

  <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p> Shipping Address Text </p>
              <p>{"{{shiiping_address_text}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{shiiping_address_text}}")} />
          </div>

         
  <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Shipping Full Name</p>
              <p>{"{{shipping_full_name}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{shipping_full_name}}")} />
          </div>
          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Shipping Company</p>
              <p>{"{{shipping_company}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{shipping_company}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Shipping City</p>
              <p>{"{{shipping_city}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{shipping_city}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Shipping Province</p>
              <p>{"{{shipping_province}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{shipping_province}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Shipping Province Code</p>
              <p>{"{{shipping_province_code}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{shipping_province_code}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Shipping Zip</p>
              <p>{"{{shipping_zip}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{shipping_zip}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Shipping Address1</p>
              <p>{"{{shipping_address_1}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{shipping_address_1}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Shipping Country</p>
              <p>{"{{shipping_country}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{shipping_country}}")} />
          </div>

  </Panel>
  
  
  <Panel header="Billing Address" key="3">
  <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p> Billing Address Text </p>
              <p>{"{{billing_address_text}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{billing_address_text}}")} />
          </div>

         
  <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Billing Full Name</p>
              <p>{"{{billing_full_name}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{billing_full_name}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Billing Address1</p>
              <p>{"{{billing_address_1}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{billing_address_1}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Billing City</p>
              <p>{"{{billing_city}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{billing_city}}")} />
          </div>


          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Billing Country</p>
              <p>{"{{billing_country}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{billing_country}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Billing Province</p>
              <p>{"{{billing_province}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{billing_province}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Billing Province Code</p>
              <p>{"{{billing_province_code}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{billing_province_code}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Billing Zip</p>
              <p>{"{{billing_zip}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{billing_zip}}")} />
          </div>
  </Panel>
  

  <Panel header="Customer" key="4">
  <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Customer Email</p>
              <p>{"{{customer_email}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{customer_email}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Customer Name</p>
              <p>{"{{customer_name}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{customer_name}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Customer Id</p>
              <p>{"{{customer_id}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{customer_id}}")} />
          </div>

  </Panel>
  
  <Panel header="Payment Method" key="5">

  <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p> Payment Method Text </p>
              <p>{"{{payment_method_text}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{payment_method_text}}")} />
          </div>

  <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Card Brand Name</p>
              <p>{"{{card_brand_name}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{card_brand_name}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Last Four Digits</p>
              <p>{"{{last_four_digits}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{last_four_digits}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Card Expiry Month</p>
              <p>{"{{card_expiry_month}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{card_expiry_month}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Card Expiry Year</p>
              <p>{"{{card_expiry_year}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{card_expiry_year}}")} />
          </div>

  </Panel>


  <Panel header="Shop" key="6">
  <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Shop Name</p>
              <p>{"{{shop_name}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{shop_name}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Shop Email</p>
              <p>{"{{shop_email}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{shop_email}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Shop Domain</p>
              <p>{"{{shop_domain}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{shop_domain}}")} />
          </div>

  </Panel>
<Panel header="Others" key="7">

{templateType == "subscriptionPurchased" && <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Order Number</p>
              <p>{"{{order_number}}"}</p>
            </div>

            <CopyOutlined onClick={() => handleCopy("{{order_number}}")} />
          </div> }

  <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Subscription ID </p>
              <p>{"{{subscription_id}}"}</p>
            </div>

            <CopyOutlined onClick={() => handleCopy("{{subscription_id}}")} />
          </div>  


<div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Manage Subscription Link</p>
              <p>{"{{manage_subscription_link}}"}</p>
            </div>
            <CopyOutlined
              onClick={() => handleCopy("{{manage_subscription_link}}")}
            />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Email Subject</p>
              <p>{"{{email_subject}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{email_subject}}")} />
          </div>

          <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p> Heading Text </p>
              <p>{"{{heading_text}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{heading_text}}")} />
          </div>


</Panel>

  </Collapse>

          
     

        
      

     
         



     {/* <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Selling Plan Name</p>
              <p>{"{{selling_plan_name}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{selling_plan_name}}")} />
          </div> */}

         
  



          {/* <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Subscription Line Items</p>
              <p>{"{{subscription_line_items}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{subscription_line_items}}")} />
          </div> */}




   {/* <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p>Header Text Color</p>
              <p>{"{{header_text_color}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{header_text_color}}")} />
          </div> */}

          {/* <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p> Text Color</p>
              <p>{"{{text_color}}"}</p>
            </div>
            <CopyOutlined onClick={() => handleCopy("{{text_color}}")} />
          </div> */}




          {/* <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p> Manage Subscription Button Color </p>
              <p>{"{{manage_subscription_button_Color}}"}</p>
            </div>
            <CopyOutlined
              onClick={() => handleCopy("{{manage_subscription_button_Color}}")}
            />
          </div> */}

          {/* <div className="revlytic copied-order-numbers">
            <div className="revlytic copied-order-numbers-inner">
              <p> Manage Subscription Button Text Color </p>
              <p>{"{{manage_subscription_button_text_Color}}"}</p>
            </div>
            <CopyOutlined
              onClick={() => handleCopy("{{manage_subscription_button_text_Color}}")}
            />
          </div> */}

        

       


        </Card>
      </div>
      <div className="revlytic dynamic-varriable-email-template">
        <Card>
          <Preview formData={formData} textEditorData={textEditorData} />
        </Card>
      </div>
    </div>
  );
}

export default DynamicVariables;
