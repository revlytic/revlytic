import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Radio,
  Select,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import { useAPI } from "../components/common/commonContext";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { ResourcePicker,useAppBridge } from "@shopify/app-bridge-react";
import { toast } from "react-toastify";
import postApi from "../components/common/postApi";
import { useNavigate } from "@shopify/app-bridge-react";
import { useLocation } from "react-router-dom";




const { Option } = Select;

function createProductBundle() {

  const location = useLocation();
  const queryParams = location.search;
  const params = new URLSearchParams(queryParams);
  const param1 = params.get("id"); // get the value of param1
  const app = useAppBridge();
  const navigate = useNavigate();

  const { currency, storeName } = useAPI();

  const [form] = Form.useForm();
  const [modal, setModal] = useState(false); //// mmodal state for resourcepicker
  const [products, setProducts] = useState([]); //// listof product to be displayed in ui
  const [checkedIds, setCheckedIds] = useState([]); ///// pre selected products passed to resourcepicker
  const [loader, setLoader] = useState(false); // for loader
  const [allNames, setAllNames] = useState([])






useEffect(() => {
  if (param1 != "new")
  {
    getBundleDetails()
  }
  else {
    getBundles("new")
  }
}, [])

const getBundles = async(flag,name) => {
  setLoader(true)
let data = await postApi("/api/admin/getproductbundle", {}, app);
console.log(data, "lkj");
if (data?.data?.message == "success") {
//     toast.success("Add at least one product !", {
//   position: toast.POSITION.TOP_RIGHT,
// });
  let res = data?.data?.data
  let arr=[]
  res?.map((item) => {
    arr.push(item?.bundleDetails?.bundleName)

  })
  if (flag == "old") {
    arr = arr.filter((item) => item !== name.toLowerCase());
  }
  setAllNames(arr)
} else {
  toast.error(data?.data?.data, {
    position: toast.POSITION.TOP_RIGHT,
  });
}
setLoader(false)
}
  const getBundleDetails = async() => {
    setLoader(true)
    let data = await postApi("/api/admin/getproductBundleDetails", { id: param1 }, app);
    setLoader(false)
    if (data?.data?.message == "success")
    {
      console.log(data?.data?.data)
      setProducts(data?.data?.data?.products)
      form.setFieldsValue(data?.data?.data?.bundleDetails)
      getBundles("old",data?.data?.data?.bundleDetails?.bundleName)
    }
    else {
      toast.error(data?.data?.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }


}

const nameValidator = (rule, value) => {
    const isDuplicate =
      allNames.length > 0
        ? allNames.some(
            (name) => name.toLowerCase() === value.toLowerCase()
          )
        : false;
    if (isDuplicate) {
      return Promise.reject("Bundle Name should be unique!");
    }
    return Promise.resolve();
};

  const getCurrencySymbol = (currency) => {
    const symbol = new Intl.NumberFormat("en", { style: "currency", currency })
      .formatToParts()
      .find((x) => x.type === "currency");
    return symbol && symbol.value;
  };
  const onFinish = async(values) => {
    if (products.length < 1) {
      toast.warn("Add at least one product !", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    else {
      if (param1 != "new") {
        setLoader(true)
        let data = await postApi("/api/admin/updateproductbundleDetails", { data: values, products: products, id: param1 }, app);
        setLoader(false)
        if (data?.data?.message == "success") {
          toast.success(data?.data?.data, {
            position: toast.POSITION.TOP_RIGHT,
          });
          navigate("/bundles")
        } else {
          toast.error(data?.data?.data, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } else {
        setLoader(true)
        let data = await postApi("/api/admin/saveproductbundleDetails", { data: values, products: products  }, app);
        
        console.log(data, "lkj");
        if (data?.data?.message == "success") {
          toast.success(data?.data?.data, {
            position: toast.POSITION.TOP_RIGHT,
          });
          navigate("/bundles")
        } else {
          toast.error(data?.data?.data, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        setLoader(false)
      }
    }
  };
  const onReset = () => {
    form.resetFields();
  };

  const handleProducts = async (e) => {
    console.log(form.getFieldValue("bundleProductLevel"),"kl");
    // setLoader(true);
    console.log(e.selection,"ggggggggggggg");
    let sendData = [];

    e.selection.map((item) => {
      // let id = item.id.split("/");
      // let p_id = id[id.length - 1];
      let p_id = item.id;
      let variants = [];
      item.variants.map((itm) => {
        // let id = itm.id.split("/");
        // let v_id = id[id.length - 1];
        let v_id = itm.id;
        variants.push({
          id: v_id,
          title: itm.title,
          image: itm?.image?.originalSrc ? itm.image.originalSrc : "",
          price: itm.price,
        });
      });

      sendData.push({
        product_id: p_id,
        product_name: item.title,
        product_image:
        item?.images.length > 0 ? item.images[0].originalSrc : "",
        hasOnlyDefaultVariant: item.hasOnlyDefaultVariant,
        variants: variants,
        subscription_type: "inactive",
      });
    });
    console.log(sendData, "sebddayta");
    setProducts(sendData);

    let ids = [];
    sendData.map((item) => {
      let variants = [];
      item.variants.map((itm) => {
        variants.push({ id: itm.id });
      });
      ids.push({
        id: item.product_id,
        variants: variants,
      });
    });
    setCheckedIds(ids);

    setModal(false);
  };
  const handleVarientDelete = (index, varientIndex) => {
    let arr = [...products];
    if (arr[index].variants.length == 1) {
      arr.splice(index, 1);
      setProducts(arr);
    } else {
      arr[index].variants.splice(varientIndex, 1);
      setProducts(arr);
    }

    let ids = [];
    arr.map((item) => {
      let variants = [];
      item.variants.map((itm) => {
        variants.push({ id: itm.id });
      });
      ids.push({
        id: item.product_id,
        variants: variants,
      });
    });
    setCheckedIds(ids);
  };
  const handleProductDelete = (index) => {
    let arr = [...products];
    arr.splice(index,1)
    setProducts(arr)

    let ids = [];
    arr.map((item) => {
      ids.push({
        id: item.product_id,
      });
    });
    setCheckedIds(ids);

  }
  const selectedProductHandler = () => {
    console.log(form.getFieldValue("bundleProductLevel"),"lkj")
    return (
      <Card
        style={{
          width: "100%",
        }}
      >
        <div className="revlytic pricing">
          <p>Products</p>
          <div className="add-and-create-buttons">
            <Button
              className="add"
              type="primary"
              onClick={() => {
                setModal(true);
              }}
            >
              Add Products
            </Button>
          </div>
        </div>
      { form.getFieldValue("bundleProductLevel")=="Variant"? <div className="product-section">
          {products.length > 0 ? (
            products.map((el, productIndex) =>
              el?.variants?.map((item, varientIndex) => (
                <div className="revlytic product-container" key={varientIndex}>
                  <div className="revlytic product-image-title">
                    <img
                      src={
                        item?.image
                          ? item?.image
                          : el?.product_image
                          ? el?.product_image
                          : pic
                      }
                    />
                    <div className="revlytic product-name">
                      {/* <p>{item.product_name}</p> */}
                      {/* {console.log(item.hasOnlyDefaultVariant);} */}
                      <p>
                        {console.log(el, "bv")}
                        <a
                          target="_blank"
                          href={
                            `https://admin.shopify.com/store/${storeName}/products/` +
                            el?.product_id?.split("/").at(-1)
                          }
                        >
                          {" "}
                          {el.product_name}
                        </a>
                        <p>{el.hasOnlyDefaultVariant ? "" : item.title}</p>
                      </p>
                      {/* <p>{currencyCode} {item.price} (perUnit)</p> */}
                    </div>
                  </div>
                  {/* <div>{currencyCode} {item.price} (perUnit)</div> */}
                  <div className="revlytic product-price">
                    <p>Price</p>
                    <p>
                      {currency &&
                        getCurrencySymbol(currency) + " " + item.price}
                    </p>
                  </div>
                  <div className="revlytic product-delete-icon">
                    <DeleteOutlined
                      onClick={() =>
                        handleVarientDelete(productIndex, varientIndex)
                      }
                    />
                  </div>
                </div>
              ))
            )
          ) : (
            <h4>No products </h4>
          )}
          {modal && (
            <ResourcePicker
              resourceType="Product"
              open={modal}
              onSelection={handleProducts}
              initialSelectionIds={checkedIds}
              onCancel={() => setModal(false)}
              showHidden={false}
              showVariants={form.getFieldValue("bundleProductLevel")=="Product"?false:true}
            />
          )}
        </div>:<div className="product-section">
          {products.length > 0 ? (
            products.map((el, productIndex) =>
                <div className="revlytic product-container" key={productIndex}>
                  <div className="revlytic product-image-title">
                    <img
                      src={ el?.product_image
                          ? el?.product_image
                          : pic
                      }
                    />
                    <div className="revlytic product-name">
                      {/* <p>{item.product_name}</p> */}
                      {/* {console.log(item.hasOnlyDefaultVariant);} */}
                      <p>
                        {console.log(el, "bv")}
                        <a
                          target="_blank"
                          href={
                            `https://admin.shopify.com/store/${storeName}/products/` +
                            el?.product_id?.split("/").at(-1)
                          }
                        >
                          {" "}
                          {el.product_name}
                        </a>
                        {/* <p>{el.hasOnlyDefaultVariant ? "" : item.title}</p> */}
                      </p>
                      {/* <p>{currencyCode} {item.price} (perUnit)</p> */}
                    </div>
                  </div>
                  {/* <div>{currencyCode} {item.price} (perUnit)</div> */}
                  <div className="revlytic product-price">
                    <p>Price</p>
                    <p>
                      {currency &&
                        getCurrencySymbol(currency) + " " + el.variants[0].price}
                    </p>
                  </div>
                  <div className="revlytic product-delete-icon">
                    <DeleteOutlined
                      onClick={() =>
                        handleProductDelete(productIndex)
                      }
                    />
                  </div>
                </div>
            )
          ) : (
            <h4>No products </h4>
          )}
          {modal && (
            <ResourcePicker
              resourceType="Product"
              open={modal}
              onSelection={handleProducts}
              initialSelectionIds={checkedIds}
              onCancel={() => setModal(false)}
              showHidden={false}
              showVariants={form.getFieldValue("bundleProductLevel")=="Product"?false:true}
            />
          )}
        </div>}
      </Card>
    );
  };
  console.log(allNames,"alll");
  return (
    <Spin tip="Loading..." size="large" spinning={loader}>
 <div className="revlytic plan-group-listing-button">
<Button type="link"  onClick={() => navigate("/bundles")}>
<ArrowLeftOutlined />Bundles
</Button>
</div>
    <div className="revlytic create-bundle-container">
      <Form
        layout="vertical"
        form={form}
        name="control-hooks"
        onFinish={onFinish}
      >
        <div className="revlytic create-bundle-button">
          <h2>Add a Bundle</h2>
          <Button htmlType="submit">{param1 != "new"?"Update":"Save"}</Button>
        </div>
        <div className="revlytic create-bundle-form">
          <div className="revlytic create-bundle-form1">
              <Card>
              <Form.Item
                name="bundleName"
                label="Bundle name"
                rules={[{ required: true,message:"Bundle Type is required !" }, {
                  validator: (rule, value) =>
                    nameValidator(rule, value),
                },]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true,message:"Title is required !" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="actionButtonText"
                label="Action Button Text"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="textUnderButton"
                label="Text under Button"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="status"
                label="Status"
                initialValue={"Active"}
              >
                <Select
                  placeholder="Select a option and change input text above"
                  allowClear
                >
                  <Option value="Active">Active</Option>
                  <Option value="Paused">Paused</Option>
                </Select>
              </Form.Item>
            </Card>
          </div>
          <div className="revlytic create-bundle-form2">
            <Card>
              <label>Bundle Type</label>
              <Divider />
              <Form.Item
                name="byDefault"
                className="create-bundle-default-check"
                valuePropName="checked"
                wrapperCol={{
                  span: 16,
                }}
              >
                <Checkbox>Select Subscription By Default</Checkbox>
              </Form.Item>
              <Form.Item
                name="combined"
                className="create-bundle-default-check"
                valuePropName="checked"
                wrapperCol={{
                  span: 16,
                }}
              >
                <Checkbox className="show-celling-plan">
                  Show Combined Selling Plan
                </Checkbox>
              </Form.Item>
              <Form.Item
                name="bundleType"
                label="Bundle Type"
                initialValue={"Classic"}
              >
                <Select
                  placeholder="Select a option and change input text above"
                  allowClear
                >
                  <Option value="Classic">Classic</Option>
                  <Option value="MixandMatch">Mix and Match</Option>
                </Select>
              </Form.Item>
            </Card>
            <Card>
              <label htmlFor="">Discounts</label>
              <Divider />
              <div className="crate-bundle-discount-column">
                <Form.Item
                  name="Discount"
                  label="Discount"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="DiscountType"
                  initialValue={"Percentage"}
                  className="percentage-bundle-none"
                  label="percentage"
                >
                  <Select
                    placeholder="Select a option and change input text above"
                    allowClear
                  >
                    <Option value="Percentage">Percentage</Option>
                    <Option value="Fixed">Fixed Amount</Option>
                  </Select>
                </Form.Item>
              </div>
            </Card>
            <Card>
              <label>Bundle Product Level</label>
              <Divider />
              <Form.Item name="bundleProductLevel" initialValue={"Product"}>
                <Radio.Group onChange={()=>setProducts([])}>
                  <Radio value="Product">Product</Radio>
                  <p className="produc-label-desc">
                    Selected variants will be displayed in dropdown under
                    products in bundle.
                  </p>
                  <Radio value="Variant">Variant</Radio>
                  <p className="produc-label-desc2">
                    Selected variants will be displayed as a standalone products
                    in bundle..
                  </p>
                </Radio.Group>
              </Form.Item>
            </Card>
          </div>
        </div>
      </Form>
      {selectedProductHandler()}
      </div>
      </Spin>

  );
}

export default createProductBundle;
