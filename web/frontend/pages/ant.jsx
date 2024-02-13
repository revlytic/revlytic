// import React, { useState, useEffect } from "react";
// import { Table, Input, Pagination,Button,Modal } from "antd";
// import { SearchOutlined } from "@ant-design/icons";
// import { useAppBridge } from "@shopify/app-bridge-react";
// import { useNavigate } from "@shopify/app-bridge-react";
// import postApi from "../components/common/postApi";
// import { toast } from "react-toastify";
// import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

// const ProductList = () => {
//   const navigate = useNavigate();
//   const app = useAppBridge();
//   const [products, setProducts] = useState([])
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;


//   const [loader, setLoader] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState("");

//   useEffect(() => {
//     filterProducts(searchText);
//   }, [searchText]);
// useEffect(() => {
//   getAllPlanGroups()
// }, [])


//   const getAllPlanGroups = async () => {
//     setLoader(true);
//     let data = await postApi("/api/admin/getPlanGroups", {}, app);

//     setLoader(false);
//     console.log(data);
//     // setPlanGroupList(data?.data?.data);
//     setProducts(data?.data?.data)
//     setFilteredProducts(data?.data?.data)
//   };
//   const filterProducts = (value) => {
//     const filtered = products.filter((product) =>
//       // console.log(product.plan_group_name)
//       // product.plan_group_name.toLowerCase().includes(value.toLowerCase())
//         product.plan_group_name.includes(value)

//     );
//     setFilteredProducts(filtered);
//     setCurrentPage(1);
//   };

//   const handleSearch = (e) => {
//     setSearchText(e.target.value);
//   };

//   const handleChangePage = (page) => {
//     setCurrentPage(page);
//   };

//   const columns = [
//     {
//       title: "Name",
//       dataIndex: "name",
//     },
//     {
//       title: "ID",
//       dataIndex: "id",
//     },

//     {
//       title: "Price",
//       dataIndex: "code",
//     },
//   ];

//   const paginatedData = filteredProducts.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const editHandler = (id) => {
//     navigate(`/plans?id=${id}`);
//   };
//   const handleOk = () => {
//     deleteHandler(selectedId);
//     setIsModalOpen(false);
//   };
//   const deleteHandler = async (id) => {
//     console.log(id);
//     setLoader(true);
//     let data = await postApi("/api/admin/deleteSellingPlan", { id: id }, app);
//     setLoader(false);
//     console.log(data?.data);
//     if (data?.data?.message == "success") {
//       // Toast("success", "PlanGroup deleted Successfully");
//       toast.success("PlanGroup deleted Successfully", {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//       getAllPlanGroups();
//     } else if (data?.data?.message == "userError") {
//       data?.data?.data?.map((element) => {
//         // Toast("error", element.message);
//         toast.error(element.message, {
//           position: toast.POSITION.TOP_RIGHT,
//         });
//       });
//     } else if (data?.data?.message == "error") {
//       // Toast("error", data?.data?.data);
//       toast.success(data?.data?.data, {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     }
//   };
//   return (
//     <Spin spinning={loader} size="large" tip="Loading...">
//     <div className="revltic-planlist">
//       <div className="search-container">
//         <Button type="primary" onClick={() => navigate(`/plans?id=new`)}>
//           Create new Plan
//         </Button>
//       <Input
//         prefix={<SearchOutlined />}
//         placeholder="Search Products"
//         value={searchText}
//         onChange={handleSearch}
//         style={{ marginBottom: 16 }}
//         />
//         </div>

//       <ul className="responsive-table">
//         <li className="table-header">
//           <div className="col col-1">Plan  Name</div>
//           <div className="col col-2">Total Products</div>    
//           <div className="col col-3">Action</div>           
//         </li>
//         {paginatedData.map((item) => {
//           console.log(item);
//           return (
//             <li className="table-row">
//               <div className="col col-1" data-label="Plan  Name">
//                 {item.plan_group_name}
//               </div>
//               <div className="col col-2" data-label="Total Products">
//                 {item.product_details.length}
//               </div>
//               <div className="col col-3" data-label="Action">
//                 <DeleteOutlined
//                   onClick={() => {
//                     setIsModalOpen(true), setSelectedId(item.plan_group_id);
//                   }}
//                 />
//                 <EditOutlined onClick={() => editHandler(item.plan_group_id)} />
//               </div>
//             </li>
//           );
//         })}
//       </ul>
//       {/* <Table  bordered={false} columns={columns} rowClassName="rowClassTest" className='revlytic_table' dataSource={paginatedData} rowKey="id" pagination={false} /> */}
//       <Pagination
//         current={currentPage}
//         pageSize={pageSize}
//         total={filteredProducts.length}
//         onChange={handleChangePage}
//         style={{ marginTop: 16, textAlign: "right" }}
//       />

//       <Modal
//         title="Delete !!"
//         open={isModalOpen}
//         onOk={handleOk}
//         onCancel={() => setIsModalOpen(false)}
//       >
//         <h1>Are you sure you want to delete this plan group ?</h1>
//       </Modal>
//       </div>
//       </Spin>
//   );
// };

// export default ProductList;
