import React from "react";
import { useAPI } from "../common/commonContext";

function Preview({ formData,templateType }) {
  const { currency } = useAPI();

  const getCurrencySymbol = (currency) => {
    const symbol = new Intl.NumberFormat("en", { style: "currency", currency })
      .formatToParts()
      .find((x) => x.type === "currency");
    return symbol && symbol.value;
  };
  console.log("inpreviwe",templateType, formData);
  return (
    <div>
      <>
        <table
          width="100%"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          align="center"
          className="fullTable"
          bgcolor=" #fff"
        >
          <tbody>

            <tr>
              <td>
                <table
                  width={"100%"}
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
                          width={"100%"}
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
                                  width={"100%"}
                                  border={0}
                                  cellPadding={0}
                                  cellSpacing={0}
                                  align="left"
                                  className="col"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        align="left"
                                        style={{
                                          color: formData.headingTextColor,
                                          fontSize: 28,
                                          fontWeight: 400,
                                          letterSpacing: "-0.56px",
                                        }}
                                      >
                                        {formData.headingText}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          width="100%"
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
                            <tr className="visibleMobile">
                              <td height={20} />
                            </tr>
                            <tr>
                              <td style={{ textAlign: formData.logoAlignment }}>
                                <img
                                  src={formData.logoUrl}
                                  width={formData.logoWidth}
                                  height={formData.logoHeight}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td height={10} />
                            </tr>
                            {formData.showOrderNumber && (templateType=="subscriptionPurchased" || templateType=="subscriptionInvoice" )&& (
                              <tr>
                                <td
                                  style={{
                                    fontSize: 12,
                                    color: "#5b5b5b",
                                    fontFamily: '"Poppins", sans-serif',
                                    verticalAlign: "top",
                                    textAlign: "right",
                                  }}
                                >
                                  <strong style={{ color: "#000" }}>
                                    {formData.orderNumberText}
                                  </strong>
                                  <br />
                                  <p style={{ color: "#5b5b5b", margin: 0 }}>
                                    {" "}
                                 {"{{order_number}}"}
                                  </p>
                                </td>
                              </tr>
                            )}
                            {formData.showSubscriptionId && templateType !="subscriptionPurchased" && templateType !="subscriptionInvoice" && (
                              <tr>
                                <td
                                  style={{
                                    fontSize: 12,
                                    color: "#5b5b5b",
                                    fontFamily: '"Poppins", sans-serif',
                                    verticalAlign: "top",
                                    textAlign: "right",
                                  }}
                                >
                                  <strong style={{ color: "#000" }}>
                                    {formData.subscriptionIdText}
                                  </strong>
                                  <br />
                                  <p style={{ color: "#5b5b5b", margin: 0 }}>
                                    {" "}
                                 {"{{subscription_id}}"}
                                  </p>
                                </td>
                              </tr>
                            )}
                            <tr></tr>
                            <tr className="hiddenMobile">
                              <td height={20} />
                            </tr>
                            <tr className="visibleMobile">
                              <td height={20} />
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
        <table
          width="100%"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          align="center"
          className="fullTable"
          bgcolor=" #fff"
        >
          <tbody>
            <tr>
              <td>
                <table
                  width={"100%"}
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
                          width={"100%"}
                          border={0}
                          cellPadding={0}
                          cellSpacing={0}
                          align="center"
                          className="fullPadding"
                        >
                          <tbody>
                            {/* <tr>
                              <td
                                style={{
                                  fontSize: 12,
                                  fontFamily: '"Poppins", sans-serif',
                                  color: "#000",
                                  verticalAlign: "top",
                                  textAlign: "left",
                                }}
                              >
                                <strong>
                                  Hi {"{"}
                                  {"{"}customer_name{"}"}
                                  {"}"} <br />
                                  Thank you for your purchase!
                                </strong>
                              </td>
                            </tr> */}

                            <tr>
                              <td
                                style={{
                                  fontSize: 12,
                                  fontFamily: '"Poppins", sans-serif',
                                  color: formData.textColor,
                                  verticalAlign: "top",
                                  textAlign: "left",
                                }}
                              >
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: formData.contentText,
                                  }}
                                />

                                {/* Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s, */}
                              </td>
                            </tr>

                            <tr className="hiddenMobile">
                              <td height={10} />
                            </tr>
                            <tr className="visibleMobile">
                              <td height={20} />
                            </tr>
                           
                          </tbody>
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
        {/* Order Details */}
        {formData.showLineItems && (
          <div className="revlytic-email-template-table-scroll">
    
          <table
            width="100%"
            border={0}
            cellPadding={0}
            cellSpacing={0}
            align="center"
            className="fullTable"
            bgcolor=" #fff"
            // style={{display:formData.showLineItems ? 'block' : 'none'}}
          >
            <tbody>
              <tr>
                <td>
                  <table
                    width={"100%"}
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
                          
                        <table
                            width={"100%"}
                            border={0}
                            cellPadding={0}
                            cellSpacing={0}
                            align="center"
                            className="revlytic-scroll-table"
                            style={{
                              background:
                                "linear-gradient(0deg, #F0F0F0 0%, #F0F0F0 100%)",
                                borderRadius: "7px 7px 0 0"
                            }}
                          >
                          <thead>
                            <tr>
                              <th style={{verticalAlign: "top", padding: "10px 10px 0 10px",width: "10%", textAlign:"center", fontSize: 13, color:"#666", opacity:"0.6", fontFamily:"inter"}}> Product</th>
                              <th  style={{verticalAlign: "top", padding: "10px 10px 0 10px",width: "20%", textAlign:"left", fontSize: 13, color:"#666", opacity:"0.6", fontFamily:"inter"}}></th>
                              <th  style={{verticalAlign: "top", padding: "10px 8px 0 8px",width: "10%", textAlign:"left", fontSize: 13, color:"#666", opacity:"0.6", fontFamily:"inter"}}>Price</th>
                              <th  style={{verticalAlign: "top",padding: "10px 8px 0 8px", width: "15%", textAlign:"left", fontSize: 13, color:"#666", opacity:"0.6", fontFamily:"inter"}}>Quantity</th>
                              <th style={{verticalAlign: "top", padding: "10px 8px 0 8px",width: "10%", textAlign:"left", fontSize: 13, color:"#666", opacity:"0.6", fontFamily:"inter"}}>Total</th>
                              <th style={{verticalAlign: "top", padding: "10px 8px 0",width: "30%", textAlign:"left", fontSize: 13, color:"#666", opacity:"0.6", fontFamily:"inter"}}>Plan Details</th>
                            </tr>
                          </thead>
                          </table>
                          <table
                            width={"100%"}
                            border={0}
                            cellPadding={0}
                            cellSpacing={0}
                            align="center"
                            className="revlytic-scroll-table"
                            style={{
                              background:
                                "linear-gradient(0deg, #F0F0F0 0%, #F0F0F0 100%)",
                            
                            }}
                          >
                            <tbody>
                              <tr>
                                <td height={5} colSpan={6} />
                              </tr>
                              
                              <tr>
                                <td
                                  style={{
                                    verticalAlign: "top",
                                    padding: "10px 0 10px 0",
                                    width: "10%",
                                    textAlign:"center"
                                  }}
                                >
                                  <img
                                    src="https://cdn.shopify.com/s/files/1/0753/8068/7139/files/download_1_be4b698a-4d71-418e-9827-7455b1d527b1.jpg?v=1684210720"
                                    style={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: 5,
                               
                                    }}
                                  />{" "}
                                </td>
                                <td
                                  style={{
                                    fontSize: 12,
                                    fontFamily: '"Poppins", sans-serif',
                                    color: "#000",
                                    fontWeight: "100%",
                                    verticalAlign: "top",
                                    padding: "10px 0",
                                    width: "20%",
                                  }}
                                  className="article"
                                >
                                  The 3p Fulfilled <br />
                                  Snowboard
                                </td>
                                <td
                                  style={{
                                    fontSize: 11,
                                    fontFamily: '"Poppins", sans-serif',
                                    color: "#000",
                                    verticalAlign: "top",
                                    padding: "10px 10px 0",
                                    width: "10%",
                                  }}
                                >
                                  <strong>
                                    {formData.showCurrency && currency
                                      ? getCurrencySymbol(currency) + "125.00"
                                      : "125.00"}
                                  </strong>
                                </td>
                                <td
                                  style={{
                                    fontSize: 11,
                                    fontFamily: '"Poppins", sans-serif',
                                    color: "#000",
                                    verticalAlign: "top",
                                    padding: "10px 10px 0 10px",
                                    width: "15%",
                                  }}
                                >
                                  <strong>1</strong>
                                </td>
                                <td
                                  style={{
                                    fontSize: 11,
                                    fontFamily: '"Poppins", sans-serif',
                                    color: "#000",
                                    verticalAlign: "top",
                                    padding: "10px 10px 0",
                                    width: "10%",
                                  }}
                                >
                                  <strong>
                                    {formData.showCurrency && currency
                                      ? getCurrencySymbol(currency) + "125.00"
                                      : "125.00"}
                                  </strong>
                                </td>

 

                                <td
                                  style={{
                                    fontSize: 11,
                                    fontFamily: '"Poppins", sans-serif',
                                    color: "#000",
                                    verticalAlign: "top",
                                    padding: "10px 10px 10px",
                                    width: "30%",
                                  }}
                                >
                                  <strong>
                                  {formData.planNameText} 
                                  </strong>
                                : Pay As You Go 
                                 
                                <br/>
                                <strong>
                                  {formData.nextBillingDateText}  
                                  </strong> 
                                 : 28 December 2023       
                                 
                               
                                <br/>
                                <strong>
                                  {formData.billingFrequencyText}  
                                  </strong>
                                 : 1 month(s)       
                                
                                 <br/>
                              <strong>
                                  {formData.deliveryFrequencyText}  
                                  </strong>
                                 : 1 month(s)   

                                </td>

                              </tr>
                              <tr>
                                <td
                                  height={1}
                                  colSpan={6}
                                  style={{ borderBottom: "1px solid #e4e4e4" }}
                                />
                              </tr>

                              <tr>
                                <td
                                  style={{
                                    verticalAlign: "top",
                                    padding: "10px 0 10px 0",
                                    width: "10%",
                                    textAlign:"center"
                                  }}
                                >
                                  <img
                                    src="https://cdn.shopify.com/s/files/1/0753/8068/7139/files/download_1_be4b698a-4d71-418e-9827-7455b1d527b1.jpg?v=1684210720"
                                    style={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: 5,
                               
                                    }}
                                  />{" "}
                                </td>
                                <td
                                  style={{
                                    fontSize: 12,
                                    fontFamily: '"Poppins", sans-serif',
                                    color: "#000",
                                    fontWeight: "100%",
                                    verticalAlign: "top",
                                    padding: "10px 0",
                                    width: "20%",
                                  }}
                                  className="article"
                                >
                                  The 3p Fulfilled <br />
                                  Snowboard
                                </td>
                                <td
                                  style={{
                                    fontSize: 11,
                                    fontFamily: '"Poppins", sans-serif',
                                    color: "#000",
                                    verticalAlign: "top",
                                    padding: "10px 10px 0",
                                    width: "10%",
                                  }}
                                >
                                  <strong>
                                    {formData.showCurrency && currency
                                      ? getCurrencySymbol(currency) + "125.00"
                                      : "125.00"}
                                  </strong>
                                </td>
                                <td
                                  style={{
                                    fontSize: 11,
                                    fontFamily: '"Poppins", sans-serif',
                                    color: "#000",
                                    verticalAlign: "top",
                                    padding: "10px 10px 0 10px",
                                    width: "15%",
                                  }}
                                >
                                  <strong>1</strong>
                                </td>
                                <td
                                  style={{
                                    fontSize: 11,
                                    fontFamily: '"Poppins", sans-serif',
                                    color: "#000",
                                    verticalAlign: "top",
                                    padding: "10px 10px 0",
                                    width: "10%",
                                  }}
                                >
                                  <strong>
                                    {formData.showCurrency && currency
                                      ? getCurrencySymbol(currency) + "125.00"
                                      : "125.00"}
                                  </strong>
                                </td>



                                <td
                                  style={{
                                    fontSize: 11,
                                    fontFamily: '"Poppins", sans-serif',
                                    color: "#000",
                                    verticalAlign: "top",
                                    padding: "10px 10px 10px",
                                    width: "30%",
                                  }}
                                >
                                  <strong>
                                  {formData.planNameText} 
                                  </strong>
                                : Pay As You Go 
                                 
                                <br/>
                                <strong>
                                  {formData.nextBillingDateText}  
                                  </strong> 
                                 : 28 December 2023       
                                 
                               
                                <br/>
                                <strong>
                                  {formData.billingFrequencyText}  
                                  </strong>
                                 : 1 month(s)       
                                
                              <br/>
                              <strong>
                                  {formData.deliveryFrequencyText}  
                                  </strong>
                                 : 1 month(s)   


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

        )}
        {/* /Order Details */}
        {/* Information */}
        <table
          width="100%"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          align="center"
          className="fullTable"
          bgcolor=" #fff"
        >
          <tbody>
            <tr>
              <td>
                <table
                  width={"100%"}
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
                          width={"100%"}
                          border={0}
                          cellPadding={0}
                          cellSpacing={0}
                          align="center"
                          className="fullPadding"
                        >
                          <tbody>
                            <tr>
                              <td>
                                {formData.showShippingAddress && (
                                  <table
                                    width={"50%"}
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                    align="left"
                                    className="col revlytic-billing"
                                    // style={{display:formData.showShippingAddress ? 'block' : 'none'}}
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          style={{
                                            fontSize: 11,
                                            fontFamily: '"Poppins", sans-serif',
                                            color: "#000",
                                            verticalAlign: "top",
                                          }}
                                        >
                                          <strong>
                                            {
                                              formData.subscriptionShippingAddressText
                                            }
                                          </strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td width="100%" height={10} />
                                      </tr>
                                      <tr>
                                        <td
                                          style={{
                                            fontSize: 12,
                                            fontFamily: '"Poppins", sans-serif',
                                            color: "#5b5b5b",
                                            verticalAlign: "top",
                                          }}
                                        >
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                formData.shippingAddress,
                                            }}
                                          />
                                          {/* Akshya Nagar <br />
                                  1st Block 1st Cross, Rammurthy <br /> nagar,
                                  Bangalore-560016 */}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                )}
                                {formData.showBillingAddress && (
                                  <table
                                    width={"50%"}
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                   
                                    className="col revlytic-billing"
                                    // display: formData.showBillingAddress ? 'block' : 'none',
                                    // style={{display:formData.showBillingAddress ? 'block' : 'none'}}
                                  >
                                    <tbody>
                                  
                                      <tr>
                                        <td
                                          style={{
                                            fontSize: 11,
                                            fontFamily: '"Poppins", sans-serif',
                                            color: "#000",
                                            verticalAlign: "top",
                                            textAlign: "right",
                                          }}
                                        >
                                          <strong>
                                            {
                                              formData.subscriptionBillingAddressText
                                            }
                                          </strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td width="100%" height={10} />
                                      </tr>
                                      <tr>
                                        <td
                                          style={{
                                            fontSize: 12,
                                            fontFamily: '"Poppins", sans-serif',
                                            color: "#5b5b5b",
                                            verticalAlign: "top",
                                            textAlign: "right",
                                          }}
                                        >
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                formData.billingAddress,
                                            }}
                                          />
                                          {/* Akshya Nagar <br />
                                  1st Block 1st Cross, Rammurthy <br /> nagar,
                                  Bangalore-560016 */}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td>
                          <table
                            width={"100%"}
                            border={0}
                            cellPadding={0}
                            cellSpacing={0}
                            align="center"
                            className="fullPadding"
                          >
                            <tbody>
                              <tr>
                                <td>
                               { formData.showPaymentMethod &&  <table
                                    width={"50%"}
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                    align="left"
                                    className="col"
                                  >
                                    <tbody>
                                      <tr className="hiddenMobile">
                                        <td height={35} />
                                      </tr>
                                      <tr className="visibleMobile">
                                        <td height={20} />
                                      </tr>
                                      <tr>
                                        <td
                                          style={{
                                            fontSize: 11,
                                            fontFamily: '"Poppins", sans-serif',
                                            color: "#000",
                                            verticalAlign: "top",
                                          }}
                                        >
                                          <strong>
                                            {formData.paymentMethodText}
                                          </strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td width="100%" height={10} />
                                      </tr>
                                      <tr>
                                        <td
                                          style={{
                                            fontSize: 12,
                                            fontFamily: '"Poppins", sans-serif',
                                            color: "#5b5b5b",
                                            verticalAlign: "top",
                                          }}
                                        >
                                          {"{"}
                                          {"{"}card_brand_name{"}"}
                                          {"}"} {formData.endingWithText} {"{"}
                                          {"{"}last_four_digits{"}"}
                                          {"}"}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table> }
                                  { templateType !="subscriptionInvoice" && ( <table
                                    width={"50%"}
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                    align="right"
                                    className="col"
                                    // style={{display:formData.showPaymentMethod ? 'block' : 'none'}}
                                  >
                                    <tbody>
                                      <tr className="hiddenMobile">
                                        <td height={35} />
                                      </tr>
                                      <tr className="visibleMobile">
                                        <td height={20} />
                                      </tr>
                                      <tr className="manage-subscription-button">
                                    
                                    <td
                                      style={{
                                        color: formData.manageSubscriptionTextColor,
                                        cursor: "pointer",
                                        textAlign: "center",
                                        fontSize: 14,
                                        fontWeight: 500,
                                        borderRadius: 5,
                                        background:
                                          formData.manageSubscriptionButtonBackground,
                                        display: "inline-block",
                                        padding: 10,
                                      }}
                                    >
                                      {formData.manageSubscriptionText}
                                    </td>
                                  </tr>
                                      <tr>
                                        <td width="100%" height={10} />
                                      </tr>
                                 
                                    </tbody>
                                  </table>)}
</td>
</tr> 

                                          
                         
                          
                            </tbody>
                          </table>
                     
                        
                     
                        
                      </td>
                    </tr>

                    <tr className="hiddenMobile">
                      <td height={30} />
                    </tr>
                    <tr className="visibleMobile">
                      <td height={30} />
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        {/* /Information */}
        <table
          width="100%"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          align="center"
          className="fullTable"
          bgcolor=" #fff"
        >
          <tbody>
            <tr>
              <td>
                <table
                  width={"100%"}
                  border={0}
                  cellPadding={0}
                  cellSpacing={0}
                  align="center"
                  className="fullTable"
                  bgcolor="#ffffff"
                >
                  <tbody>
                    <tr>
                      <td
                        height={1}
                        colSpan={5}
                        style={{ borderBottom: "1px solid #e4e4e4" }}
                      />
                    </tr>
                    <tr className="spacer">
                      <td height={20} />
                    </tr>
                  </tbody>
                </table>
                <table
                  width="100%"
                  border={0}
                  cellPadding={0}
                  cellSpacing={0}
                  align="center"
                  className="fullTable"
                  bgcolor=" #fff"
                >
                  <tbody>
                    <tr>
                      <td>
                        <table
                          width={"100%"}
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
                              <td>
                                <table
                                  width={"100%"}
                                  border={0}
                                  cellPadding={0}
                                  cellSpacing={0}
                                  align="center"
                                  className="fullPadding"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style={{
                                          fontSize: 12,
                                          color: "#5b5b5b",
                                          fontFamily: '"Poppins", sans-serif',
                                          verticalAlign: "top",
                                          textAlign: "left",
                                        }}
                                      >
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: formData.footerText,
                                          }}
                                        />
                                        {/* {formData.footerText} */}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr className="spacer">
                              <td height={20} />
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
      </>
    </div>
  );
}

export default Preview;
