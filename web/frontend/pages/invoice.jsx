import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Collapse,
  Form,
  Input,
  Spin,
  Switch,
  Tooltip,
} from "antd";
import postApi from "../components/common/postApi";
import { useAppBridge } from "@shopify/app-bridge-react";
import UploadImage from "../components/upload";
import { toast } from "react-toastify";
import { useAPI } from "../components/common/commonContext";
import { Link } from "react-router-dom";
import CalculateBillingUsage from "../components/calculateBillingUsage";
const { Panel } = Collapse;
function invoice() {
  const app = useAppBridge();
  // const { billingPlan } = useAPI();
  const [billingPlan, setBillingPlan] = useState("");

  const [loader, setLoader] = useState(false);
  const [components, setComponents] = useState([
    { label: "Logo", status: true },
    { label: "Bill To", status: true },
    { label: "Invoice Heading", status: true },
    { label: "Invoice Number", status: true },
    { label: "Invoice Number Prefix", status: true },
    { label: "Invoice Billing Date", status: true },

    { label: "Serial Number", status: true },
    { label: "Item Description", status: true },
    { label: "Price", status: true },
    { label: "QTY", status: true },
    { label: "Total", status: true },

    { label: "Subtotal", status: true },
    { label: "Tax", status: true },
    { label: "Shipping", status: true },
    { label: "Discount", status: true },
    { label: "Terms", status: true },
    { label: "Notes", status: true },
    { label: "Signature", status: true },
    { label: "Auto Send on Order Creation", status: true },
  ]);
  const [logo, setLogo] = useState("");
  const [invoiceHeading, setInvoiceHeading] = useState("INVOICE");
  const [billTo, setBillTo] = useState("Bill To");
  const [invoiceNo, setInvoiceNo] = useState("Invoice No");
  const [invoicePrefix, setInvoicePrefix] = useState("RV");
  const [invoiceBillingDate, setInvoiceBillingDate] = useState(
    "Invoice Billing Date"
  );
  const [serialNo, setSerialNo] = useState("LINE NUMBER");
  const [itemDesciption, setItemDesciption] = useState("DESCRIPTION");
  const [price, setPrice] = useState("PRICE");
  const [quantity, setQuantity] = useState("QUANTITY");
  const [total, setTotal] = useState("TOTAL");
  const [terms, setTerms] = useState("Terms");
  const [termsData, setTermsData] = useState("");
  const [notes, setNotes] = useState("Notes");
  const [notesData, setNotesData] = useState("");

  const [subtotal, setSubtotal] = useState("Subtotal");
  const [tax, setTax] = useState("Tax");
  const [shipping, setShipping] = useState("Shipping");
  const [totalPriceLabel, setTotalPriceLabel] = useState("Total");
  const [discount, setDiscount] = useState("Discount");
  const [signature, setSignature] = useState("");
  const [logoData, setLogoData] = useState("");
  const [signatureData, setSignatureData] = useState("");

  const [editMode, setEditMode] = useState(false);
  const onChange = (value, index) => {
    let arr = [...components];
    arr[index].status = value;
    setComponents(arr);
  };

  useEffect(async () => {
    setLoader(true);
    let getData = await postApi("/api/admin/getinvoiceDetails", {}, app);
    setLoader(false);
    if (getData?.data?.message == "success") {
      setComponents(getData?.data?.data?.components);

      setLogo(getData?.data?.data?.invoice_details?.Logo);
      setInvoiceHeading(getData?.data?.data?.invoice_details?.Invoice_Heading);
      setBillTo(getData?.data?.data?.invoice_details?.Bill_To);
      setInvoiceNo(getData?.data?.data?.invoice_details?.Invoice_Number);
      setInvoicePrefix(
        getData?.data?.data?.invoice_details?.Invoice_Number_Prefix
      );
      setInvoiceBillingDate(
        getData?.data?.data?.invoice_details?.Invoice_Billing_Date
      );
      setSerialNo(getData?.data?.data?.invoice_details?.Serial_Number);
      setItemDesciption(getData?.data?.data?.invoice_details?.Item_Description);
      setPrice(getData?.data?.data?.invoice_details?.Price);
      setQuantity(getData?.data?.data?.invoice_details?.QTY);
      setTotal(getData?.data?.data?.invoice_details?.Total);
      setTerms(getData?.data?.data?.invoice_details?.Terms);
      setTermsData(getData?.data?.data?.invoice_details?.TermsData);
      setNotes(getData?.data?.data?.invoice_details?.Notes);
      setNotesData(getData?.data?.data?.invoice_details?.NotesData);
      setSubtotal(getData?.data?.data?.invoice_details?.Subtotal);
      setTax(getData?.data?.data?.invoice_details?.Tax);
      setShipping(getData?.data?.data?.invoice_details?.Shipping);
      setDiscount(getData?.data?.data?.invoice_details?.Discount);
      setSignature(getData?.data?.data?.invoice_details?.Signature);
      setTotalPriceLabel(getData?.data?.data?.invoice_details?.TotalPriceLabel);
    }
  }, []);

  const saveDetails = async () => {
    setLoader(true);
    let updatedLogo = logo;
    let updatedSignature = signature;

    if (logo && logoData) {
      const response = await postApi("/api/admin/delete", { url: logo }, app);
    }
    if (signature && signatureData) {
      const response = await postApi(
        "/api/admin/delete",
        { url: signature },
        app
      );
    }

    if (logoData) {
      try {
        let savelogo = await postApi("/api/admin/upload", logoData, app);
        if (savelogo.data.message == "success") {
          // toast.success("Logo uploaded successfully", {
          //   position: toast.POSITION.TOP_RIGHT,
          // });
          updatedLogo = `https://revlytic.co/images/logo/${savelogo.data.name}`;
          setLogo(`https://revlytic.co/images/logo/${savelogo.data.name}`);
        }
      } catch (error) {
        // toast.success("File upload failed", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
      }
    }

    if (signatureData) {
      try {
        let savesignature = await postApi(
          "/api/admin/upload",
          signatureData,
          app
        );
        if (savesignature.data.message == "success") {
          // toast.success("Signature uploaded successfully", {
          //   position: toast.POSITION.TOP_RIGHT,
          // });
          updatedSignature = `https://revlytic.co/images/signature/${savesignature.data.name}`;
          setSignature(
            `https://revlytic.co/images/signature/${savesignature.data.name}`
          );
        }
      } catch (error) {
        // toast.success("File upload failed", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
      }
    }

    try {
      let saveData = await postApi(
        "/api/admin/saveinvoiceDetails",
        {
          components: components,
          details: {
            Logo: updatedLogo,
            Bill_To: billTo,
            Invoice_Heading: invoiceHeading,
            Invoice_Number: invoiceNo,
            Invoice_Number_Prefix: invoicePrefix,
            Invoice_Billing_Date: invoiceBillingDate,
            Serial_Number: serialNo,
            Item_Description: itemDesciption,
            Price: price,
            QTY: quantity,
            Total: total,
            Terms: terms,
            Notes: notes,
            Subtotal: subtotal,
            Tax: tax,
            Shipping: shipping,
            Discount: discount,
            Signature: updatedSignature,
            NotesData: notesData,
            TermsData: termsData,
            TotalPriceLabel: totalPriceLabel,
          },
        },
        app
      );
    } catch (err) {
      // console.log(err, "hg");
    }
    setEditMode(false);
    setLoader(false);
  };
  return (
    <Spin tip="Loading..." size="large" spinning={loader}>
      <div className="revlytic plan-group-listing-button">
        <h1 className="revlytic-plan-switch-heading">Invoice</h1>
      </div>
      <div
        className={
          editMode
            ? "revlytic invoice-main-container-edit"
            : "revlytic invoice-main-container"
        }
      >
        {editMode && (
          <Card>
            <div className="revlytic invoice-components-label" key={18}>
              <p>{components[18].label}</p>
              <Switch
                checked={components[18].status}
                onChange={(value) => onChange(value, 18)}
              />
            </div>
            <h1>Invoice Fields</h1>

            <Collapse>
              <Panel header="Header" key="1">
                <ul className="revlytic invoice-components">
                  {components.map((el, index) => {
                    if (index < 6) {
                      return (
                        <div
                          className="revlytic invoice-components-label"
                          key={index}
                        >
                          <p>{el.label}</p>
                          <Switch
                            checked={components[index].status}
                            onChange={(value) => onChange(value, index)}
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </ul>
              </Panel>
              <Panel header="Details" key="2">
                <ul className="revlytic invoice-components">
                  {components.map((el, index) => {
                    if (index > 5 && index < 11) {
                      return (
                        <div
                          className="revlytic invoice-components-label"
                          key={index}
                        >
                          <p>{el.label}</p>
                          <Switch
                            checked={components[index].status}
                            onChange={(value) => onChange(value, index)}
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </ul>
              </Panel>
              <Panel header="Summary" key="3">
                <ul className="revlytic invoice-components">
                  {components.map((el, index) => {
                    if (index > 10 && index < 18) {
                      return (
                        <div
                          className="revlytic invoice-components-label"
                          key={index}
                        >
                          <p>{el.label}</p>
                          <Switch
                            checked={components[index].status}
                            onChange={(value) => onChange(value, index)}
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </ul>
              </Panel>
            </Collapse>
          </Card>
        )}
        <div>
          <div className="revlytic invoice-edit-container">
            <div className="revlytic invoice-edit-switch">
              <p> Edit Modes</p>{" "}
              <Tooltip
                color="#ffffff"
                title={
                  billingPlan != "starter" &&
                  billingPlan != "premium" &&
                  billingPlan != "premiere" ? (
                    <Link to={`/billing?option=invoice`}>
                      Upgrade your Plan
                    </Link>
                  ) : (
                    ""
                  )
                }
              >
                {" "}
                <Switch
                  checked={editMode}
                  onChange={(checked) => setEditMode(checked)}
                  disabled={
                    billingPlan != "starter" &&
                    billingPlan != "premium" &&
                    billingPlan != "premiere"
                  }
                />
              </Tooltip>
            </div>
            <div className="revlytic invoice details-save-button">
              {editMode && <Button onClick={saveDetails}>Save</Button>}
              {editMode && (
                <Button onClick={() => setEditMode(false)}>Cancel</Button>
              )}
            </div>
          </div>
          <div
            className={
              editMode
                ? "revlytic invoice-template-edit"
                : "revlytic invoice-template"
            }
          >
            {/* Header */}
            <table
              width="100%"
              border={0}
              cellPadding={0}
              cellSpacing={0}
              align="center"
              className="fullTable"
              bgcolor="#f1f2f4"
            >
              <tbody>
                <tr className="revlytic row-none">
                  <td height={20} />
                </tr>
                <tr>
                  <td>
                    <table
                      width="85%"
                      border={0}
                      cellPadding={0}
                      cellSpacing={0}
                      align="center"
                      className="fullTable"
                      bgcolor="#ffffff"
                      style={{ borderRadius: "10px 10px 0 0" }}
                    >
                      <tbody>
                        <tr className="hiddenMobile">
                          <td height={40} />
                        </tr>
                        <tr className="visibleMobile">
                          <td height={30} />
                        </tr>
                        <tr>
                          <td>
                            <table
                              width="95%"
                              border={0}
                              cellPadding={0}
                              cellSpacing={0}
                              align="center"
                              className="fullPaddingheader"
                            >
                              <tbody>
                                <tr>
                                  <td>
                                    <table
                                      width={300}
                                      border={0}
                                      cellPadding={0}
                                      cellSpacing={0}
                                      align="left"
                                      className="col"
                                    >
                                      <tbody>
                                        <tr>
                                          {components[0].status &&
                                            (!editMode ? (
                                              <td align="left">
                                                {" "}
                                                <img
                                                  src={logo}
                                                  width={216}
                                                  height={43}
                                                  alt="logo"
                                                  border={0}
                                                />
                                              </td>
                                            ) : (
                                              // <input type="file" value={logo} />
                                              // <img src="https://vessel-intervals-click-tight.trycloudflare.com/uploads/1689147506940.jpeg"/>
                                              <UploadImage
                                                setLogo={setLogo}
                                                logo={logo}
                                                setLoader={setLoader}
                                                check={"logo"}
                                                setLogoData={setLogoData}
                                              />
                                            ))}
                                        </tr>
                                        <tr className="hiddenMobile">
                                          <td height={40} />
                                        </tr>
                                        <tr className="visibleMobile">
                                          <td height={20} />
                                        </tr>
                                        <tr>
                                          {components[1].status && (
                                            <td
                                              style={{
                                                fontSize: 14,
                                                color: "#5b5b5b",

                                                verticalAlign: "top",
                                                textAlign: "left",
                                              }}
                                            >
                                              <strong
                                                style={{
                                                  color: "#000",

                                                  fontSize: 15,
                                                  margin: 0,
                                                }}
                                              >
                                                {!editMode ? (
                                                  billTo
                                                ) : (
                                                  <input
                                                    placeholder="Bill to"
                                                    value={billTo}
                                                    onChange={(e) =>
                                                      setBillTo(e.target.value)
                                                    }
                                                  />
                                                )}
                                              </strong>
                                              <p
                                                style={{
                                                  color: "#5b5b5b",

                                                  fontSize: 14,
                                                  fontWeight: 500,
                                                  margin: "2px 0 2px",
                                                }}
                                              >
                                                Akshya Nagar
                                              </p>
                                              1st Block 1st Cross, Rammurthy
                                              nagar, <br />
                                              Bangalore-560016
                                            </td>
                                          )}
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table
                                      width={300}
                                      border={0}
                                      cellPadding={0}
                                      cellSpacing={0}
                                      align="right"
                                      className="col"
                                    >
                                      <tbody>
                                        <tr className="visibleMobile">
                                          <td height={20} />
                                        </tr>
                                        <tr>
                                          <td height={5} />
                                        </tr>
                                        <tr>
                                          {components[2].status && (
                                            <td style={{ textAlign: "right" }}>
                                              <strong
                                                style={{
                                                  color: "#0F550C",

                                                  fontSize: 45,
                                                  fontStyle: "normal",
                                                  fontWeight: 600,

                                                  verticalAlign: "top",
                                                  lineHeight: 1,
                                                }}
                                              >
                                                {!editMode ? (
                                                  invoiceHeading
                                                ) : (
                                                  <input
                                                    placeholder="Invoice Heading"
                                                    value={invoiceHeading}
                                                    onChange={(e) =>
                                                      setInvoiceHeading(
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                )}
                                              </strong>
                                            </td>
                                          )}
                                        </tr>
                                        <tr></tr>
                                        <tr className="hiddenMobile">
                                          <td height={50} />
                                        </tr>
                                        <tr className="visibleMobile">
                                          <td height={20} />
                                        </tr>
                                        <tr>
                                          <td
                                            style={{
                                              fontSize: 14,
                                              color: "#5b5b5b",

                                              verticalAlign: "top",
                                              textAlign: "right",
                                            }}
                                          >
                                            {components[3].status && (
                                              <>
                                                <div className="invoice-no-prefix">
                                                  <b style={{ color: "#000" }}>
                                                    {!editMode ? (
                                                      invoiceNo
                                                    ) : (
                                                      <input
                                                        placeholder="Invoice No"
                                                        value={invoiceNo}
                                                        onChange={(e) =>
                                                          setInvoiceNo(
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                    )}
                                                    :{" "}
                                                    {components[4].status && (
                                                      <>
                                                        {!editMode ? (
                                                          invoicePrefix
                                                        ) : (
                                                          <input
                                                            placeholder="Invoice prefix"
                                                            value={
                                                              invoicePrefix
                                                            }
                                                            onChange={(e) =>
                                                              setInvoicePrefix(
                                                                e.target.value
                                                              )
                                                            }
                                                          />
                                                        )}
                                                      </>
                                                    )}
                                                    -1001
                                                  </b>
                                                </div>
                                              </>
                                            )}
                                            <br />
                                            {components[5].status && (
                                              <>
                                                {" "}
                                                <b style={{ color: "#000" }}>
                                                  {!editMode ? (
                                                    invoiceBillingDate
                                                  ) : (
                                                    <input
                                                      className="Invoice_Billing_Date"
                                                      placeholder="Invoice Billing Date "
                                                      value={invoiceBillingDate}
                                                      onChange={(e) =>
                                                        setInvoiceBillingDate(
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                  )}
                                                  : 06/02/2025
                                                </b>
                                              </>
                                            )}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* /Header */}
            {/* Order Details */}
            <div className="revlytic-email-template-table-scroll">
              <table
                width="100%"
                border={0}
                cellPadding={0}
                cellSpacing={0}
                align="center"
                className="fullTable"
                bgcolor="#f1f2f4"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        width="85%"
                        border={0}
                        cellPadding={0}
                        cellSpacing={0}
                        align="center"
                        className="fullTable"
                        bgcolor="#ffffff"
                      >
                        <tbody>
                          <tr></tr>
                          <tr className="hiddenMobile">
                            <td height={30} />
                          </tr>
                          <tr className="visibleMobile">
                            <td height={40} />
                          </tr>
                          <tr>
                            <td>
                              <table
                                width="95%"
                                border={0}
                                cellPadding={0}
                                cellSpacing={0}
                                align="center"
                                className="fullPadding revlytic-scroll-table"
                              >
                                <tbody>
                                  <tr className="invoice-table-head">
                                    <th
                                      style={{
                                        fontSize: 15,
                                        color: "#fff",
                                        fontWeight: "normal",

                                        verticalAlign: "top",
                                        padding: "10px 0 10px 10px",
                                        width: "10%",
                                      }}
                                      align="left"
                                    >
                                      {components[6].status &&
                                        (!editMode ? (
                                          serialNo
                                        ) : (
                                          <input
                                            placeholder="Serial No. "
                                            value={serialNo}
                                            onChange={(e) =>
                                              setSerialNo(e.target.value)
                                            }
                                          />
                                        ))}
                                    </th>
                                    <th
                                      style={{
                                        fontSize: 15,
                                        color: "#fff",
                                        fontWeight: "normal",

                                        verticalAlign: "top",
                                        padding: "10px",
                                        width: "35%",
                                      }}
                                      align="left"
                                    >
                                      {components[7].status &&
                                        (!editMode ? (
                                          itemDesciption
                                        ) : (
                                          <input
                                            placeholder="Item Description "
                                            value={itemDesciption}
                                            onChange={(e) =>
                                              setItemDesciption(e.target.value)
                                            }
                                          />
                                        ))}
                                    </th>
                                    <th
                                      style={{
                                        fontSize: 15,
                                        color: "#fff",
                                        fontWeight: "normal",

                                        verticalAlign: "top",
                                        padding: "10px 0 10px 0",
                                        width: "16%",
                                        textAlign: "center",
                                      }}
                                      align="left"
                                    >
                                      {components[9].status &&
                                        (!editMode ? (
                                          quantity
                                        ) : (
                                          <input
                                            placeholder="Quantity"
                                            value={quantity}
                                            onChange={(e) =>
                                              setQuantity(e.target.value)
                                            }
                                          />
                                        ))}
                                    </th>
                                    <th
                                      style={{
                                        fontSize: 15,
                                        color: "#fff",
                                        fontWeight: "normal",

                                        verticalAlign: "top",
                                        padding: 10,
                                        width: "20%",
                                      }}
                                      align="center"
                                    >
                                      {components[8].status &&
                                        (!editMode ? (
                                          price
                                        ) : (
                                          <input
                                            placeholder="Price"
                                            value={price}
                                            onChange={(e) =>
                                              setPrice(e.target.value)
                                            }
                                          />
                                        ))}
                                    </th>
                                    <th
                                      style={{
                                        fontSize: 15,
                                        color: "#fff",
                                        fontWeight: "normal",

                                        verticalAlign: "top",
                                        padding: 10,
                                        width: "20%",
                                      }}
                                      align="center"
                                    >
                                      {components[10].status &&
                                        (!editMode ? (
                                          total
                                        ) : (
                                          <input
                                            placeholder="Total"
                                            value={total}
                                            onChange={(e) =>
                                              setTotal(e.target.value)
                                            }
                                          />
                                        ))}
                                    </th>
                                  </tr>
                                  <tr>
                                    <td height={10} colSpan={4} />
                                  </tr>
                                  <tr
                                    style={{
                                      background:
                                        "linear-gradient(0deg, #F0F0F0 0%, #F0F0F0 100%)",
                                    }}
                                  >
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#000",
                                        fontWeight: 600,

                                        verticalAlign: "top",
                                        padding: 10,
                                        textAlign: "left",
                                      }}
                                      className="article"
                                    >
                                      1
                                    </td>
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#000",

                                        verticalAlign: "top",
                                        padding: "10px",
                                      }}
                                    >
                                      <small>
                                        Sed non mauris vel dui aliquam
                                      </small>
                                    </td>
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#000",

                                        verticalAlign: "top",
                                        padding: "10px 0",
                                        textAlign: "center",
                                      }}
                                      align="left"
                                    >
                                      1
                                    </td>
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#1e2b33",

                                        verticalAlign: "top",
                                        padding: "10px 10px 0 0",
                                      }}
                                      align="center"
                                    >
                                      $299.95
                                    </td>
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#1e2b33",

                                        verticalAlign: "top",
                                        padding: "10px 10px 0 0",
                                      }}
                                      align="center"
                                    >
                                      $299.95
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#000",
                                        fontWeight: 600,

                                        verticalAlign: "top",
                                        padding: 10,
                                        textAlign: "left",
                                      }}
                                      className="article"
                                    >
                                      2
                                    </td>
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#000",

                                        verticalAlign: "top",
                                        padding: "10px",
                                      }}
                                    >
                                      <small>
                                        Sed non mauris vel dui aliquam
                                      </small>
                                    </td>
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#000",

                                        verticalAlign: "top",
                                        padding: "10px 0",
                                        textAlign: "center",
                                      }}
                                      align="left"
                                    >
                                      1
                                    </td>
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#1e2b33",

                                        verticalAlign: "top",
                                        padding: "10px 10px 0 0",
                                      }}
                                      align="center"
                                    >
                                      $29.95
                                    </td>
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#1e2b33",

                                        verticalAlign: "top",
                                        padding: "10px 10px 0 0",
                                      }}
                                      align="center"
                                    >
                                      $299.95
                                    </td>
                                  </tr>
                                  <tr
                                    style={{
                                      background:
                                        "linear-gradient(0deg, #F0F0F0 0%, #F0F0F0 100%)",
                                    }}
                                  >
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#000",
                                        fontWeight: 600,

                                        verticalAlign: "top",
                                        padding: 10,
                                        textAlign: "left",
                                      }}
                                      className="article"
                                    >
                                      3
                                    </td>
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#000",

                                        verticalAlign: "top",
                                        padding: "10px",
                                      }}
                                    >
                                      <small>
                                        Sed non mauris vel dui aliquam
                                      </small>
                                    </td>
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#000",

                                        verticalAlign: "top",
                                        padding: "10px 0",
                                        textAlign: "center",
                                      }}
                                      align="left"
                                    >
                                      1
                                    </td>
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#1e2b33",

                                        verticalAlign: "top",
                                        padding: "10px 10px 0 0",
                                      }}
                                      align="center"
                                    >
                                      $299.95
                                    </td>
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#1e2b33",

                                        verticalAlign: "top",
                                        padding: "10px 10px 0 0",
                                      }}
                                      align="center"
                                    >
                                      $299.95
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td height={20} />
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* /Order Details */}
            {/*---custom */}
            <table
              width="100%"
              border={0}
              cellPadding={0}
              cellSpacing={0}
              align="center"
              className="fullTable"
              bgcolor="#f1f2f4"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      width="85%"
                      border={0}
                      cellPadding={0}
                      cellSpacing={0}
                      align="center"
                      className="fullTable"
                      bgcolor="#ffffff"
                    >
                      <tbody>
                        <tr></tr>
                        <tr className="hiddenMobile">
                          <td height={30} />
                        </tr>
                        <tr className="visibleMobile">
                          <td height={40} />
                        </tr>
                        <tr>
                          <td>
                            <table
                              width="95%"
                              border={0}
                              cellPadding={0}
                              cellSpacing={0}
                              align="center"
                              className="fullPadding"
                            >
                              <tbody>
                                <tr>
                                  <td>
                                    <table
                                      width={200}
                                      border={0}
                                      cellPadding={0}
                                      cellSpacing={0}
                                      align="left"
                                      className="col"
                                      style={{ width: "50%" }}
                                    >
                                      {components[15].status && (
                                        <tbody>
                                          <tr>
                                            <td
                                              style={{
                                                fontSize: 15,
                                                color: "#000",

                                                verticalAlign: "top",
                                              }}
                                            >
                                              {!editMode ? (
                                                <strong>{terms}</strong>
                                              ) : (
                                                <input
                                                  placeholder="Terms"
                                                  value={terms}
                                                  onChange={(e) =>
                                                    setTerms(e.target.value)
                                                  }
                                                />
                                              )}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td width="100%" height={10} />
                                          </tr>
                                          <tr>
                                            <td
                                              style={{
                                                fontSize: 14,
                                                color: "#5b5b5b",

                                                verticalAlign: "top",
                                              }}
                                            >
                                              {!editMode ? (
                                                termsData
                                              ) : (
                                                <textarea
                                                  rows="4"
                                                  placeholder="Terms Conditions"
                                                  style={{ width: "100%" }}
                                                  value={termsData}
                                                  onChange={(e) =>
                                                    setTermsData(e.target.value)
                                                  }
                                                />
                                              )}
                                            </td>
                                          </tr>
                                        </tbody>
                                      )}
                                    </table>
                                    <table
                                      width={300}
                                      border={0}
                                      cellPadding={0}
                                      cellSpacing={0}
                                      align="right"
                                      className="col"
                                    >
                                      <tbody>
                                        {components[11].status && (
                                          <tr>
                                            <td
                                              style={{
                                                fontSize: 14,
                                                color: "#000",

                                                verticalAlign: "top",
                                                textAlign: "right",
                                              }}
                                            >
                                              {!editMode ? (
                                                subtotal
                                              ) : (
                                                <input
                                                  placeholder="subtotal"
                                                  value={subtotal}
                                                  onChange={(e) =>
                                                    setSubtotal(e.target.value)
                                                  }
                                                />
                                              )}
                                              :
                                            </td>
                                            <td
                                              style={{
                                                fontSize: 14,
                                                color: "#000",

                                                paddingRight: 10,
                                                verticalAlign: "top",
                                                textAlign: "right",
                                                whiteSpace: "nowrap",
                                              }}
                                              width={80}
                                            >
                                              <b> $329.90</b>
                                            </td>
                                          </tr>
                                        )}
                                        {components[12].status && (
                                          <tr>
                                            <td
                                              style={{
                                                fontSize: 12,
                                                color: "#000",

                                                verticalAlign: "top",
                                                textAlign: "right",
                                              }}
                                            >
                                              {!editMode ? (
                                                tax
                                              ) : (
                                                <input
                                                  placeholder="tax"
                                                  value={tax}
                                                  onChange={(e) =>
                                                    setTax(e.target.value)
                                                  }
                                                />
                                              )}
                                              :
                                            </td>
                                            <td
                                              style={{
                                                fontSize: 12,
                                                paddingRight: 10,
                                                color: "rgb(189 189 189)",

                                                verticalAlign: "top",
                                                textAlign: "right",
                                              }}
                                            >
                                              <b> $72.40</b>
                                            </td>
                                          </tr>
                                        )}
                                        {components[13].status && (
                                          <tr>
                                            <td
                                              style={{
                                                fontSize: 14,
                                                color: "#000",

                                                verticalAlign: "top",
                                                textAlign: "right",
                                              }}
                                            >
                                              {!editMode ? (
                                                shipping
                                              ) : (
                                                <input
                                                  placeholder="shipping"
                                                  value={shipping}
                                                  onChange={(e) =>
                                                    setShipping(e.target.value)
                                                  }
                                                />
                                              )}
                                              :
                                            </td>
                                            <td
                                              style={{
                                                fontSize: 14,
                                                paddingRight: 10,
                                                color: "rgb(189, 189, 189)",

                                                verticalAlign: "top",
                                                textAlign: "right",
                                              }}
                                            >
                                              <b> $15.00</b>
                                            </td>
                                          </tr>
                                        )}
                                        {components[14].status && (
                                          <tr>
                                            <td
                                              style={{
                                                fontSize: 14,
                                                color: "#000",

                                                verticalAlign: "top",
                                                textAlign: "right",
                                              }}
                                            >
                                              {!editMode ? (
                                                discount
                                              ) : (
                                                <input
                                                  placeholder="discount"
                                                  value={discount}
                                                  onChange={(e) =>
                                                    setDiscount(e.target.value)
                                                  }
                                                />
                                              )}
                                              :
                                            </td>
                                            <td
                                              style={{
                                                fontSize: 14,
                                                paddingRight: 10,
                                                color: "#000",

                                                verticalAlign: "top",
                                                textAlign: "right",
                                              }}
                                            >
                                              <strong>$344.90</strong>
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                                <tr className="visibleMobile">
                                  <td height={20} />
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <table
                              width="95%"
                              border={0}
                              cellPadding={0}
                              cellSpacing={0}
                              align="center"
                              className="fullPadding"
                            >
                              <tbody>
                                <tr>
                                  <td>
                                    <table
                                      width={200}
                                      border={0}
                                      cellPadding={0}
                                      cellSpacing={0}
                                      align="left"
                                      className="col"
                                      style={{ width: "50%" }}
                                    >
                                      {components[16].status && (
                                        <tbody>
                                          <tr className="visibleMobile">
                                            <td height={20} />
                                          </tr>
                                          <tr>
                                            <td
                                              style={{
                                                fontSize: 15,
                                                color: "#000",

                                                verticalAlign: "top",
                                              }}
                                            >
                                              {!editMode ? (
                                                <strong>{notes}</strong>
                                              ) : (
                                                <input
                                                  placeholder="Notes"
                                                  value={notes}
                                                  onChange={(e) =>
                                                    setNotes(e.target.value)
                                                  }
                                                />
                                              )}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td width="100%" height={10} />
                                          </tr>
                                          <tr>
                                            <td
                                              style={{
                                                fontSize: 14,
                                                color: "#5b5b5b",

                                                verticalAlign: "top",
                                              }}
                                            >
                                              {!editMode ? (
                                                notesData
                                              ) : (
                                                <textarea
                                                  rows="4"
                                                  style={{ width: "100%" }}
                                                  placeholder="Enter notes"
                                                  value={notesData}
                                                  onChange={(e) =>
                                                    setNotesData(e.target.value)
                                                  }
                                                />
                                              )}
                                            </td>
                                          </tr>
                                        </tbody>
                                      )}
                                    </table>
                                    <table
                                      width={300}
                                      border={0}
                                      cellPadding={0}
                                      cellSpacing={0}
                                      align="right"
                                      className="col"
                                    >
                                      <tbody>
                                        <tr className="visibleMobile">
                                          <td height={20} />
                                        </tr>
                                        <tr>
                                          <td width="100%" height={10} />
                                        </tr>
                                        <tr style={{ textAlign: "right" }}>
                                          <td align="right">
                                            <a
                                              style={{
                                                color: "#fff",

                                                fontSize: 17,
                                                fontStyle: "normal",
                                                fontWeight: 400,
                                                textDecoration: "none",
                                                verticalAlign: "top",
                                                background:
                                                  "linear-gradient(0deg, #0F550C 0%, #0F550C 100%)",
                                                display: "inline-block",
                                                padding: "10px 20px",
                                                borderRadius: 5,
                                              }}
                                            >
                                              {!editMode ? (
                                                totalPriceLabel
                                              ) : (
                                                <input
                                                  className="revlytic invoice-total-price-label"
                                                  value={totalPriceLabel}
                                                  onChange={(e) =>
                                                    setTotalPriceLabel(
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              )}
                                              : <b>$282.00</b>
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* Total */}
            <table
              width="100%"
              border={0}
              cellPadding={0}
              cellSpacing={0}
              align="center"
              className="fullTable"
              bgcolor="#f1f2f4"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      width="85%"
                      border={0}
                      cellPadding={0}
                      cellSpacing={0}
                      align="center"
                      className="fullTable"
                      bgcolor="#ffffff"
                    >
                      <tbody>
                        <tr>
                          <td>
                            {/* Table Total */}
                            <table
                              width="95%"
                              border={0}
                              cellPadding={0}
                              cellSpacing={0}
                              align="center"
                              className="fullPadding"
                            >
                              {components[17].status && (
                                <tbody>
                                  <tr className="visibleMobile">
                                    <td height="20"></td>
                                  </tr>
                                  <tr className="hiddenMobile">
                                    <td height="20"></td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        fontSize: 14,
                                        color: "#000",

                                        verticalAlign: "top",
                                        textAlign: "right",
                                      }}
                                    >
                                      {!editMode ? (
                                        <img
                                          src={signature}
                                          width={216}
                                          height={43}
                                          alt="signature"
                                          border={0}
                                        />
                                      ) : (
                                        <UploadImage
                                          setSignature={setSignature}
                                          signature={signature}
                                          setLoader={setLoader}
                                          check={"signature"}
                                          setSignatureData={setSignatureData}
                                        />
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              )}
                            </table>
                            {/* /Table Total */}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* /Total */}
            {/* Information */}
            {/* /Information */}
            <table
              width="100%"
              border={0}
              cellPadding={0}
              cellSpacing={0}
              align="center"
              className="fullTable"
              bgcolor="#f1f2f4"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      width="85%"
                      border={0}
                      cellPadding={0}
                      cellSpacing={0}
                      align="center"
                      className="fullTable"
                      bgcolor="#ffffff"
                      style={{ borderRadius: "0 0 10px 10px" }}
                    >
                      <tbody>
                        <tr>
                          <td></td>
                        </tr>
                        <tr className="spacer">
                          <td height={40} />
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr className="revlytic row-none">
                  <td height={20} />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <CalculateBillingUsage setBillingPlan={setBillingPlan} />
    </Spin>
  );
}

export default invoice;
