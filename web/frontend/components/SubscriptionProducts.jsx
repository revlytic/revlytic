import React, { useEffect, useState } from "react";
import { Card, Button, Form, Checkbox, Input, Modal, Select, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { ResourcePicker } from "@shopify/app-bridge-react";
import pic from "../assets/images/image2.png";
import postApi from "./common/postApi";
import { useAppBridge, useNavigate } from "@shopify/app-bridge-react";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import { useAPI } from "./common/commonContext";
const SubscriptionProducts = ({
  products,
  setProducts,
  
  setLoader,
  mode,
  edit,
  
  checkedIds,
  setCheckedIds,
  customerPaymentsDataLength,
  subscription_details
}) => {
  const [form] = useForm();
  const [addProductModal, setAddProductModal] = useState(false);
  const navigate = useNavigate();
  const app = useAppBridge();
  const [createProductModal, setCreateProductModal] = useState(false);

  // useEffect(async () => {
  //   let response = await postApi("/api/admin/getCurrencyCode", {}, app);
  //   if (response?.data?.message == "success") {
  //     setCurrencyCode(response?.data?.data?.currency_code);
  //   } else {
  //   }
  // }, []);

  const { currency, storeName,storeDetails } = useAPI();
  const handleAddButton = () => {
    setAddProductModal(true);
  };
  const deliveryCheck = (arr) => {
    let flag = false;
    arr.map((item) => {
      item.variants.map((itm) => {
        if (itm.requiresShipping == true) {
          flag = true;
        }
      });
    });
    return flag;
  };
  const getCurrencySymbol = (currency) => {
    const symbol = new Intl.NumberFormat("en", { style: "currency", currency })
      .formatToParts()
      .find((x) => x.type === "currency");
    return symbol && symbol.value;
  };
console.log("checkkinggggg",subscription_details)
  //   const handleProducts = async (e) => {
  //  //console.log("kfjsdfjklsd",e.selection)
  //     let obj={};
  //    products.map((item) => {
  //     item.variants.map(itm=>

  //       obj[itm.id] = itm?.quantity
  //       )

  //     });
  //  //console.log("checkinggggggg",obj)
  //     let sendData = [];
  //     e.selection.map((item) => {
  //       let variants = [];
  //       item.variants.map((itm) => {
  //         variants.push({
  //           id: itm.id,
  //           title: itm.title,
  //           image: itm?.image?.originalSrc ? itm.image.originalSrc : "",
  //           price: itm.price,
  //           quantity:obj[itm.id] ? obj[itm.id]: 1,
  //           requiresShipping:itm.requiresShipping
  //         });

  //       });
  //       sendData.push({
  //         product_id: item.id,

  //         product_name: item.title,
  //         product_image:
  //           item?.images.length > 0 ? item.images[0].originalSrc : "",
  //         hasOnlyDefaultVariant: item.hasOnlyDefaultVariant,
  //         variants: variants,
  //       });

  //     });

  // //  let checkDeliveryPrice=deliveryCheck(sendData)
  // //  //console.log("sdkjkldnksndkaq",checkDeliveryPrice)
  // //  if(checkDeliveryPrice==true){

  // //    setShowDeliveryPrice(true)
  // //  }

  //     setProducts(sendData)
  //     let ids = [];

  //     sendData.map((item) => {
  //       let variants = [];
  //       item.variants.map((itm) => {
  //         variants.push({ id: itm.id });
  //       });

  //       ids.push({
  //         id:  item.product_id,
  //         variants: variants,
  //       });
  //     });

  //     setCheckedIds(ids);

  //     setAddProductModal(false);
  //   };

  const handleProducts = async (e) => {
    //console.log("kfjsdfjklsd", e.selection);
    let obj = {};
    products?.map((item) => {
      obj[item.id] = { quantity: item?.quantity, price: item?.price };
    });

    //console.log("checking", obj);
    let sendData = [];
    let ids = [];
    e.selection.map((item) => {
      item.variants.map((itm) => {
        sendData.push({
          id: itm.id,
          title: itm.title,
          image: itm?.image?.originalSrc ? itm.image.originalSrc : "",
          price: obj[itm.id] ? obj[itm.id]["price"] : itm.price,
          quantity: obj[itm.id] ? obj[itm.id]["quantity"] : 1,
          requiresShipping: itm.requiresShipping,
          product_id: item.id,
          product_name: item.title,
          product_image:
            item?.images.length > 0 ? item.images[0].originalSrc : "",
          hasOnlyDefaultVariant: item.hasOnlyDefaultVariant,
          originalPrice:itm.price
        });

        ids.push({
          id: item.id,
          variants: [{ id: itm.id }],
        });
      });
    });
    //console.log(ids, sendData);

    setProducts(sendData);

    setCheckedIds(ids);

    setAddProductModal(false);
  };
  //console.log(products);

  const handleCancel = () => {
    setAddProductModal(false);
  };
  //   const handleQuantity=(e,p_index,v_index)=>{

  //      let copy=[...products]
  //    let numbers=/^[0-9]+$/;
  // if ( e.target.value.match(numbers)&& e.target.value >0 ) {
  //   let newvalue = String(e.target.value);
  //   newvalue = newvalue.replace(/^0/, "");

  //   copy[p_index]["variants"][v_index]["quantity"]=parseInt(newvalue)
  //   //console.log(copy)
  //  setProducts(copy)
  //   }
  //   }
  //   //console.log(products)

  //   const handleDeleteVariant=(index,var_index)=>{
  //     let copy=[...products]

  //     if(copy[index].variants.length==1){
  //      copy.splice(index,1)

  //   }
  //   else{
  //     copy[index]["variants"].splice(var_index,1)
  //   }

  // // //  let checkDeliveryPrice=deliveryCheck(copy)
  // //  if(checkDeliveryPrice==true){
  // //   //console.log("up")
  // //    setShowDeliveryPrice(true)
  // //  }
  // //  else{
  // //   //console.log("down")
  // //   setShowDeliveryPrice(false)
  // //  }

  //  setProducts(copy)
  //  let ids = [];

  //      copy.map((item) => {
  //        let variants = [];
  //        item.variants.map((itm) => {
  //          variants.push({ id: itm.id });
  //        });

  //        ids.push({
  //          id:  item.product_id,
  //          variants: variants,
  //        });
  //      });

  //      setCheckedIds(ids);
  // }

  const handleQuantity = (e, index) => {
    ///before 06 oct start
    // let copy = [...products];
    // let numbers = /^[0-9]+$/;
    // if (e.target.value.match(numbers) && e.target.value > 0) {
    //   let newvalue = String(e.target.value);
    //   newvalue = newvalue.replace(/^0/, "");

    //   copy[index]["quantity"] = parseInt(newvalue);
    //   //console.log(copy);
    //   setProducts(copy);
    // }

    /////end///////////////

    ///on 06 oct   start  update/////
 let copy = [...products];
    let numbers = /^[0-9]+$/;
    if (e.target.value.length > 0 ) {
      if (numbers.test(e.target.value) && e.target.value > 0) {
        
           copy[index]["quantity"] = parseInt(e.target.value);     
          //console.log(copy);
      setProducts(copy);
     
      }
    } else {
      copy[index]["quantity"] = parseInt(1);  
      //console.log(copy);
      setProducts(copy);
  };

  /////////06 oct  endd /////
  };
  //console.log(products);

  const handlePrice = (e, index) => {
    let copy = [...products];
    // let numbers = /^[0-9]+(\.[0-9]+)?$/;

    const inputValue = e.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (e.target.value.length > 0) {
      if (regex.test(inputValue)) {
        copy[index]["price"] = parseFloat(inputValue);
        //console.log("copy",copy);
        setProducts(copy);
      }
    } else {
      copy[index]["price"] = 0;
      //console.log(copy);
      setProducts(copy);
    }

    // let numbers = /^\d+(\.\d+)?$/;
    // if (e.target.value.match(numbers) ) {
    //   let newvalue = String(e.target.value);
    //   // newvalue = newvalue.replace(/^0/, "");

    //   copy[index]["price"] = parseFloat(newvalue);
    //   //console.log(copy);
    //   setProducts(copy);
    // }
  };
//console.log("check4oct",products)
  const handleDeleteVariant = (index) => {
    let copy = [...products];

    copy.splice(index, 1);

    //  let checkDeliveryPrice=deliveryCheck(copy)
    //  if(checkDeliveryPrice==true){
    //   //console.log("up")
    //    setShowDeliveryPrice(true)
    //  }
    //  else{
    //   //console.log("down")
    //   setShowDeliveryPrice(false)
    //  }

    setProducts(copy);
    let ids = [];

    copy.map((item) => {
      ids.push({
        id: item.product_id,
        variants: [{ id: item.id }],
      });
    });

    setCheckedIds(ids);
  };

  const onFinish = async (values) => {
    //console.log("Successssdssss:", values);
    setCreateProductModal(false);

    setLoader(true);

    let data = await postApi(
      "/api/admin/createProduct",

      {
        name: values.productName,

        price: values.price,

        check: values.requireShipping == "physical" ? true : false,
        quantity: values.quantity,
      },

      app
    );

    if (data?.data?.message == "success") {
      toast.success("Product created succesfully", {
        position: toast.POSITION.TOP_RIGHT,
      });

      //console.log(data.data.data);

      let pid = data.data.data.admin_graphql_api_id;

      let vid = data.data.data.variants[0].admin_graphql_api_id;

      let arr = [...checkedIds];

      arr.push({
        id: pid,

        variants: [{ id: vid }],
      });

      setCheckedIds(arr);

      let arr1 = [...products];

      arr1.push({
        product_id: pid,

        product_name: data.data.data.title,

        product_image:
          data.data.data?.images.length > 0
            ? data.data.data.images[0].originalSrc
            : "",

        hasOnlyDefaultVariant: true,
        requiresShipping: data.data.data.variants[0].requires_shipping,
        id: vid,
        image: "",
        price: data.data.data.variants[0].price,

        title: data.data.data.variants[0].title,
        quantity: data.data.data.variants[0].inventory_quantity,
      });
      setProducts(arr1);
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    setLoader(false);

    //console.log(data);

    form.resetFields();
  };

  //console.log(products);


  // //console.log("25sept,ordercurrency",orderCurrency)


  const calculateSubTotal=()=>{
let sum=0;
products.map(item=>{
 if(mode && mode=="view"){
 sum= sum + parseFloat( (item.quantity * item.price).toFixed(2))
//console.log(sum,"sssumm",parseFloat( (item.quantity * item.price).toFixed(2)))
 }
 else{
  //console.log("in elsesubttoal")
  sum= sum + (customerPaymentsDataLength > 0  ? parseFloat( (item.quantity * item.price).toFixed(2)) : parseFloat( (item.quantity * item.originalPrice).toFixed(2)))
  //console.log(sum,"sssumm",parseFloat( (item.quantity * item.price).toFixed(2)))
 }

}

)
   
return sum?.toFixed(2)
  }


  return (
    <>
      <Card
        style={{
          width: "100%",
        }}
        className="revlytic sub-products-list"
      >
        <div className="revlytic pricing">
          <p>Products</p>
          {mode && mode == "view" ? null : (
            <div>
              
               <Tooltip title='Add products to your Subscription Plan. You can either add all variants of a Product or a specific Product variant as selected.'>
              <Button
                className="revlytic pricing-add-product"
                onClick={handleAddButton}
              >
                Add Products
              </Button>
              </Tooltip>
              <Tooltip title='This feature allows you to create a new Product directly from within Revlytic! So you never have to log out and back in. You can always go back into Shopify to add additional details if necessary.'>
              <Button
                className="revlytic pricing-create-product"
                onClick={() => setCreateProductModal(true)}
              >
                Create a Product
              </Button>
              </Tooltip>
            </div>
          )}
        </div>
        <div className="product-section">
        { products.length > 0 &&<div className="revlytic-product-listing-header manual-list">
        <h5>Product</h5>
            <h5>Price</h5>
            <h5>Quantity</h5>
            <h5>Total</h5>
         {mode !='view' &&  <h5>Manage</h5> }

          </div>}
          { 
          products?.map((item, index) => (
              <div key={index}>
            <div className="revlytic product-container" >
             
              <div>
                {/* {index == 0 && (
                  <p className="revlytic-product-header-product">Product</p>
                )} */}
                <div className="revlytic product-image-title">
                  <img
                    src={
                      item?.image
                        ? item?.image
                        : item?.product_image
                        ? item?.product_image
                        : pic
                    }
                  />
                  <div className="revlytic product-name">
                    <a
                      target="_blank"
                      href={
                        `https://admin.shopify.com/store/${storeDetails?.shop?.split(".myshopify.com")[0]}/products/` +
                        item?.product_id?.split("/").at(-1)
                      }
                      title={item?.product_name}
                    >
                      {item?.product_name}
                    </a>

                    <p>
                      {item.hasOnlyDefaultVariant == false ? item.title : ""}
                    </p>
                    {/* <p>{currencyCode} {item.price} (perUnit)</p> */}
                  </div>
                </div>
              </div>
              {/* <div>{currencyCode} {item.price} (perUnit)</div> */}
              <div className="revlytic product-price">
                {/* {index == 0 && <p className="revlytic-product-header">Price</p>} */}

                {(mode && mode == "view") ? (
                  subscription_details?.currency && getCurrencySymbol(subscription_details?.currency) + parseFloat(item?.price)?.toFixed(2)
                ) :  customerPaymentsDataLength==0  ?
                
                currency && getCurrencySymbol(currency) +  parseFloat(item?.originalPrice)?.toFixed(2)
                
                :(
                  <Input
                    type="number"
                    prefix={currency && getCurrencySymbol(currency)}
                    value={item?.price}
                    onChange={(e) => handlePrice(e, index)}
                  />
                )}
              </div>
              <div className="revlytic product-quantity">
                {/* {index == 0 && (
                  <p className="revlytic-product-header">Quantity</p>
                )} */}

                {mode &&
                (mode == "view" ||
                  (mode == "edit" && !edit?.productDetails)) ? (
                  item?.quantity
                ) : (
                  <Input
                    type="number"
                    value={item?.quantity}
                    onChange={(e) => handleQuantity(e, index)}
                  />
                )}
              </div>

              <div className="revlytic price-total">
                {/* {index == 0 && <p className="revlytic-product-header">Total</p>} */}

              {mode && mode == "view" ?  <p>
                  {   subscription_details?.currency &&
                     getCurrencySymbol(subscription_details?.currency) +
                     
                        (item.quantity * item.price).toFixed(2)}
                </p>    : customerPaymentsDataLength==0 ? <p>
                  {   currency &&
                     getCurrencySymbol(currency) + 
                     
                        (item.quantity * item.originalPrice).toFixed(2)}
                </p> 
                :
                <p>
                  {   currency &&
                     getCurrencySymbol(currency) +
                     
                        (item.quantity * item.price).toFixed(2)}
                </p>}
              </div>
              {mode && mode == "view" ? null : (
                <div className="revlytic product-delete-icon">
                  {/* {index == 0 && (
                    <p className="revlytic-product-header">Manage</p>
                  )} */}

                  <DeleteOutlined onClick={() => handleDeleteVariant(index)} />
                </div>
              )}
            </div>
           {index==products.length-1 && (mode=='view' ?  subscription_details?.currency : currency) &&  <div className="rev-subtotal" ><p >Subtotal:</p><span> {getCurrencySymbol(mode=='view' ?  subscription_details?.currency  : currency) +(subscription_details.planType=='prepaid' ? parseFloat(calculateSubTotal() * (parseInt(subscription_details?.billingLength)/parseInt(subscription_details?.delivery_billingValue)))?.toFixed(2): parseFloat(calculateSubTotal())?.toFixed(2))}</span></div>}  
            </div>
          ))}
        </div>
      </Card>

      <ResourcePicker
        resourceType="Product"
        open={addProductModal}
        onSelection={handleProducts}
        initialSelectionIds={checkedIds}
        onCancel={handleCancel}
        showHidden={false}
      />

      <Modal
        className="rev-create-product"
        // title=""
        open={createProductModal}
        onCancel={() =>{ setCreateProductModal(false)
          form.resetFields()
        }}
        footer={
          [
            // <Button key="cancel" onClick={() => setCreateProductModal(false)}>
            //   Cancel
            // </Button>,
          ]
        }
      >
        <div className="revlytic new-customer-modal">
          <div className="revlytic new-customer-modal-title">
            Create a Product
          </div>
          <Form
            form={form}
            className="create-product-form"

            name="basic"
            requiredMark={false}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            //   onFinishFailed={onFinishFailedproduct}
            autoComplete="off"
          >
            <div className="revlytic customer-modal-name">
              <Form.Item
                label={<p className="revlytic required">Product Name</p>}
                name="productName"
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                  {
                    validator: (rule, value) => {
                      if (!value) {
                        return Promise.reject("Product Name is required!");
                      } else if (value.trim() === "") {
                        return Promise.reject("Product Name is required!");
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<p className="revlytic required">Price</p>}
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Price is required!",
                  },
                  {
                    pattern: /^-?\d*(\.\d+)?$/,
                    message: "Price must be a number",
                  },
                  {
                    validator: (rule, value) => {
                      if (parseInt(value, 10) <= 0) {
                        return Promise.reject(
                          "Price must be greater than zero"
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input  prefix={currency && getCurrencySymbol(currency)}/>
              </Form.Item>
            </div>
            <div className="revlytic customer-modal-email-phone">
              <Form.Item
                label={<p className="revlytic required">Quantity</p>}
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Quantity is required!",
                  },
                  {
                    pattern: /^\d+$/,
                    message: "Quantity must be a number",
                  },
                  {
                    validator: (rule, value) => {
                      if (parseInt(value, 10) <= 0) {
                        return Promise.reject(
                          "Quantity must be greater than zero"
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Product Type"
                name="requireShipping"
                // valuePropName="checked"
                initialValue="physical"
              >
                <Select
                  options={[
                    { value: "physical", label: "Physical product" },
                    { value: "digital", label: "Digital product or service" },
                  ]}
                />
              </Form.Item>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                <p className="revlytic create-customer-icon">
                  <PlusCircleOutlined /> Submit
                </p>
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
export default SubscriptionProducts;
