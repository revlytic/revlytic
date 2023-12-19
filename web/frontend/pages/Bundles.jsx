import { Button, Card, Input, Modal, Pagination, Spin, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import { useAPI } from "../components/common/commonContext";
import { useAppBridge } from "@shopify/app-bridge-react";
import { toast } from "react-toastify";
import postApi from "../components/common/postApi";
import { useNavigate } from "@shopify/app-bridge-react";

import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { filter } from 'compression';

function Bundles() {
  const app = useAppBridge();
  const navigate = useNavigate();

  const [filteredBundles, setFilteredBundles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState("");

  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [bundleList, setbundleList] = useState([])

  const paginatedData = filteredBundles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  useEffect(() => {
    filterBundles(searchText);
  }, [searchText]);

  const filterBundles = (value) => {
    const filtered = bundleList.filter(
      (item) =>
        item.bundleDetails.bundleName.toLowerCase().includes(value.toLowerCase())
      // product.plan_group_name.includes(value)
    );
    setFilteredBundles(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

useEffect(() => {
  getBundles()
}, [])
  const getBundles = async() => {
    setLoader(true)
  let data = await postApi("/api/admin/getproductbundle", {}, app);
  console.log(data, "lkj");
  if (data?.data?.message == "success") {
  //     toast.success("Add at least one product !", {
  //   position: toast.POSITION.TOP_RIGHT,
  // });
    setbundleList(data?.data?.data)
    setFilteredBundles(data?.data?.data)
  } else {
    toast.error(data?.data?.data, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  setLoader(false)
  }
  const deleteHandler = async (id) => {
    setLoader(true);
    let data = await postApi("/api/admin/deleteproductbundle", { id: id }, app);
    setLoader(false);
    // console.log(data?.data);
    if (data?.data?.message == "success") {
      // Toast("success", "PlanGroup deleted Successfully");
      toast.success("Bundle deleted Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      getBundles();
    } else {
      // Toast("error", data?.data?.data);
      toast.success(data?.data?.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
const handleOk = () => {
  deleteHandler(selectedId);
  setIsModalOpen(false);
  };
  
  const changeStatus = async (value, index, id) => {
    setLoader(true)
    let data = await postApi("/api/admin/updateproductbundleStatus", { status: value?"Active":"Paused", id: id }, app);
    setLoader(false)
    if (data?.data?.message == "success") {
      // Toast("success", "PlanGroup deleted Successfully");
      toast.success(data?.data?.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
      let arr = [...filteredBundles]
      arr[index].bundleDetails.status = value?"Active":"Paused"
      setFilteredBundles(arr)
    } else {
      // Toast("error", data?.data?.data);
      toast.success(data?.data?.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(value, index, id)
    }
  }
  console.log(filteredBundles);
  return (
    <Spin spinning={loader} size="large" tip="Loading...">
      <div className="revltic-planlist bundle-list">
        <div className="revltic search-create-container">
          <div className="search-container">
            <div className="revlytic show-entries">
            <p>Show Entries</p>
            <Input
              type="number"
              min={1}
              value={pageSize}
              onChange={(e) =>
                e.target.value < 1 ? 1 : setPageSize(e.target.value)
              }
              />
              </div>
            
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search Bundles"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          <div className="revltic create-plangroup-button">
            {" "}
            <Button type="primary"
              onClick={() => navigate(`/productbundle?id=new`)}
            >
              <p className="revlytic create-customer-icon">
                  <PlusCircleOutlined /> Create Bundle
                </p>
            </Button>
          </div>
        </div>
        <div className="responsive-table-forAll-screen">

        <ul className="responsive-table">
          <li className="table-header">
            <div className="col col-1">Bundle  Name</div>
            <div className="col col-3">Manage</div>
          </li>
          {paginatedData.map((item,index) => {
            console.log(item.bundleDetails.status);
            // let pcount = 0;
            // item.product_details.map((el) => {
            //   pcount += el?.variants?.length;
            // });

            return (
              <li className="table-row">
                <div className="col col-1" data-label="Plan  Name">
                  {item.bundleDetails.bundleName}
                </div>
                {/* <div className="col col-2" data-label="Total Products">
                  {pcount}
                </div> */}
                <div className="col col-3" data-label="Manage">
                  <Switch checked={item.bundleDetails.status=="Active"?true:false} onChange={(e)=>changeStatus(e,index,item._id)} />
                  <DeleteOutlined
                    onClick={() => {
                      setIsModalOpen(true), setSelectedId(item._id);
                    }}
                  />
                  <EditOutlined
                    onClick={() => navigate(`/productbundle?id=${item._id}`)}
                  />
                </div>
              </li>
            );
          })}
          </ul>
          </div>
        {/* <Table  bordered={false} columns={columns} rowClassName="rowClassTest" className='revlytic_table' dataSource={paginatedData} rowKey="id" pagination={false} /> */}
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredBundles.length}
          onChange={handleChangePage}
          style={{ marginTop: 16, textAlign: "right" }}
        />

        <Modal
          title="Delete !!"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={() => setIsModalOpen(false)}
        >
          <h1>Are you sure you want to delete this Bundle  ?</h1>
        </Modal>
      </div>
    </Spin>
  )
}

export default Bundles