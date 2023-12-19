import React, { useEffect, useState } from "react";
import { ResourcePicker } from "@shopify/app-bridge-react";
import postApi from "../components/common/postApi";
import { useAppBridge } from "@shopify/app-bridge-react";
import pic from "../assets/images/image2.png";
import toastNotification from "../components/notification/Toast";
import { Button, Spin, Avatar, List } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
// import { CSVLink } from "react-csv";
import { useNavigate } from "@shopify/app-bridge-react";

const AddProduct = (props) => {
  const navigate = useNavigate();
  const app = useAppBridge();

  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [products, setProducts] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [dataCount, setDataCount] = useState(0);
  const headers = [
    { label: "product_id", key: "product_id" },
    { label: "product_image", key: "product_image" },
    { label: "subscription_type", key: "subscription_type" },
  ];

  useEffect(() => {
    setProducts(products);
    // props.setProductList(products)
  }, [products]);

  const handleAddButton = async () => {};

  const handleProducts = async (e) => {
    console.log(e.selection);
    // setLoader(true);
    let sendData = [];

    e.selection.map((item) => {
      let id = item.id.split("/");
      let p_id = id[id.length - 1];

      let variants = [];
      item.variants.map((itm) => {
        let id = itm.id.split("/");
        let v_id = id[id.length - 1];
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
    setProducts(sendData);

    let ids = [];
    sendData.map((item) => {
      let variants = [];
      item.variants.map((itm) => {
        variants.push({ id: "gid://shopify/ProductVariant/" + itm.id });
      });
      ids.push({
        id: "gid://shopify/Product/" + item.product_id,
        variants: variants,
      });
    });
    setCheckedIds(ids);

    setModal(false);
  };
  console.log(checkedIds);
  //   console.log("in handleSearch");
  //   setSearchProduct(e.target.value);
  //   setPageCount(1);

  //   getSearchProducts(e.target.value, 1);
  // };

  // const getSearchProducts = async (searchval, pagecount) => {
  //   setLoader(true);

  //   console.log("ingetSearchProduct");
  //   let results = await postApi(
  //     "/api/admin/searchProduct",
  //     { searchProduct: searchval, pageCount: pagecount },
  //     app
  //   );

  //   if (results.data.message == "success") {
  //     console.log("in success");
  //     setDataCount(results.data?.products_length);
  //     setProducts(results.data.data);
  //   } else if (results.data.message == "no_data_found") {
  //     setProducts([]);
  //     console.log("noddatafound");
  //   } else if (results?.data == {}) {
  //     console.log("error");
  //   }

  //   setLoader(false);
  //   console.log(results);
  // };

  const handleCancel = () => {
    setModal(false);
  };

  const handleProductDelete = (index) => {
    let arr = [...products];
    arr.splice(index, 1);
    setProducts(arr);

    let ids = [];
    arr.map((item) => {
      let variants = [];
      item.variants.map((itm) => {
        variants.push({ id: "gid://shopify/ProductVariant/" + itm.id });
      });
      ids.push({
        id: "gid://shopify/Product/" + item.product_id,
        variants: variants,
      });
    });
    setCheckedIds(ids);
  };

  const handleVarientDelete = (index, varientIndex) => {
    // console.log(products[index].variants)
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
        variants.push({ id: "gid://shopify/ProductVariant/" + itm.id });
      });
      ids.push({
        id: "gid://shopify/Product/" + item.product_id,
        variants: variants,
      });
    });
    setCheckedIds(ids);
  };
  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          handleAddButton(), setModal(true);
        }}
      >
        Add Products
      </Button>
      <List>
        {console.log(products)}
        {products.map((item, productIndex) => (
          <>
            <List.Item
              actions={[
                <a
                  key="list-loadmore-edit"
                  onClick={() => {
                    handleProductDelete(productIndex);
                  }}
                >
                  delete
                </a>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={item?.product_image ? item?.product_image : pic}
                  />
                }
                title={item.product_name}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
            </List.Item>
            {!item.hasOnlyDefaultVariant &&
              item.variants.map((ele, varientIndex) => {
                return (
                  <div style={{ marginLeft: "20px" }}>
                    <List.Item
                      actions={[
                        <a
                          key="list-loadmore-edit"
                          onClick={() => {
                            handleVarientDelete(productIndex, varientIndex);
                          }}
                        >
                          delete
                        </a>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={ele?.product_image ? ele?.product_image : pic}
                          />
                        }
                        title={ele.title}
                        description={ele.price}
                      />
                    </List.Item>
                  </div>
                );
              })}
          </>
        ))}
      </List>

      {modal && (
        <ResourcePicker
          resourceType="Product"
          open={modal}
          onSelection={handleProducts}
          initialSelectionIds={checkedIds}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default AddProduct;
