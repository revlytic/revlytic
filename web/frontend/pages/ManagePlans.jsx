import React, { useState, useEffect } from "react";
import { Table, Input, Pagination, Button, Modal, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "@shopify/app-bridge-react";
import postApi from "../components/common/postApi";
import { toast } from "react-toastify";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Empty } from "antd";
import CalculateBillingUsage from "../components/calculateBillingUsage";

const ManagePlans = () => {
  const navigate = useNavigate();
  const app = useAppBridge();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [billingPlan,setBillingPlan]=useState('')


  useEffect(() => {
    filterProducts(searchText);
  }, [searchText]);
  useEffect(() => {
    getAllPlanGroups();
  }, []);

  const getAllPlanGroups = async () => {
    setLoader(true);
    let data = await postApi("/api/admin/getPlanGroups", {}, app);

    setLoader(false);

    setProducts(data?.data?.data);
    setFilteredProducts(data?.data?.data);
  };
  const filterProducts = (value) => {
    const filtered = products.filter((product) =>
      product.plan_group_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "ID",
      dataIndex: "id",
    },

    {
      title: "Price",
      dataIndex: "code",
    },
  ];

  const paginatedData = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const editHandler = (id) => {
    navigate(`/plans?id=${id}`);
  };
  const handleOk = () => {
    deleteHandler(selectedId);
    setIsModalOpen(false);
  };
  const deleteHandler = async (id) => {
    setLoader(true);
    let data = await postApi("/api/admin/deleteSellingPlan", { id: id }, app);
    setLoader(false);

    if (data?.data?.message == "success") {
      toast.success("PlanGroup deleted Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      getAllPlanGroups();
    } else if (data?.data?.message == "userError") {
      data?.data?.data?.map((element) => {
        toast.error(element.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
    } else if (data?.data?.message == "error") {
      toast.success(data?.data?.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  return (
    <Spin spinning={loader} size="large" tip="Loading...">
      <div className="revlytic plan-group-listing-button">
        <h1 className="revlytic-plan-switch-heading">Manage Plans</h1>

        {/* <a onClick={() => setIsModalOpen(true)}> </a> */}
      </div>
      <p className="revlytic-notes">
        {" "}
        <strong>Note:</strong> This page shows a listing of Subscriptions Plans
        that you have created and assigned to Products. These Subscription Plans
        can be edited or you can create new ones, simply by clicking “Add New
        Plan” to the top right of the screen.
      </p>

      <div className="revltic-planlist">
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
              placeholder="Search Plans"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          <div className="revltic create-plangroup-button">
            <Button
              type="primary"
              onClick={() => navigate(`/createsubscription`)}
            >
              Add New Plan
            </Button>
          </div>
        </div>
        <div className="responsive-table-forAll-screen">
          <ul className="responsive-table">
            <li className="table-header">
              <div className="col col-1">Plan Name</div>
              <div className="col col-2">Total Frequency Plans</div>
              <div className="col col-3">Total Products</div>
              <div className="col col-4">Plan Type</div>
              <div className="col col-5">Manage</div>
            </li>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => {
                let pcount = 0;
                let planTypes = [];

                item.product_details.map((el) => {
                  pcount += el?.variants?.length;
                });
                item?.plans?.map((el) => {
                  planTypes.push(el.planType);
                });

                const uniqueArray = [...new Set(planTypes)];

                // Function to format an individual item
                function formatItem(item) {
                  // Convert to title case (e.g., "payAsYouGo" to "Pay As You Go")
                  return item
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());
                }

                // Format each item and join them with commas
                const formattedArray = uniqueArray.map(formatItem);
                const result = formattedArray.join(", ");

                return (
                  <li className="table-row">
                    <div className="col col-1" data-label="Plan  Name">
                      {item.plan_group_name}
                    </div>
                    <div className="col col-2" data-label="Total Products">
                      {item?.plans?.length}
                    </div>
                    <div className="col col-3" data-label="Total Products">
                      {pcount}
                    </div>
                    <div className="col col-4" data-label="Total Products">
                      {result}
                    </div>
                    <div className="col col-5" data-label="Manage">
                      <DeleteOutlined
                        onClick={() => {
                          setIsModalOpen(true),
                            setSelectedId(item.plan_group_id);
                        }}
                      />
                      <EditOutlined
                        onClick={() => editHandler(item.plan_group_id)}
                      />
                    </div>
                  </li>
                );
              })
            ) : (
              <Empty description={<span>No Plans</span>} />
            )}
          </ul>
        </div>
        {/* <Table  bordered={false} columns={columns} rowClassName="rowClassTest" className='revlytic_table' dataSource={paginatedData} rowKey="id" pagination={false} /> */}
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredProducts.length}
          onChange={handleChangePage}
          style={{ marginTop: 16, textAlign: "right" }}
        />

        <Modal
          title="Delete Plan?"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={() => setIsModalOpen(false)}
        >
          <h1>Are you sure you want to delete this plan?</h1>
        </Modal>
      </div>
      <CalculateBillingUsage setBillingPlan={setBillingPlan}/>

    </Spin>
  );
};

export default ManagePlans;
