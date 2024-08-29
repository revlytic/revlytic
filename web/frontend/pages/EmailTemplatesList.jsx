import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Modal,
  Spin,
  Select,
  Switch,
  Form,
  Checkbox,
  Tooltip,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "@shopify/app-bridge-react";
import postApi from "../components/common/postApi";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useForm } from "antd/lib/form/Form";
import { sendMailDefault } from "../components/common/helpers";
import { useAPI } from "../components/common/commonContext";
import CalculateBillingUsage from "../components/calculateBillingUsage";
const EmailTemplatesList = () => {
  const navigate = useNavigate();
  const app = useAppBridge();
  const [form] = useForm();
  const [form2] = useForm();
  const [templatesList, setTemplatesList] = useState([]);
  const [emailTestModal, setEmailTestModal] = useState(false);
  const [emailConfigurationModal, setEmailConfigurationModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState({});
  const [templateType, setTemplateType] = useState(false);
  const [billingPlan, setBillingPlan] = useState("");

  const [invalidEmailError, setInvalidEmailError] = useState(false);
  const [emptyEmailError, setEmptyEmailError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [recipientMail, setRecipientMail] = useState("");
  // const [emailTestRecipientMail, setEmailTestRecipientMail] = useState("");
  const { currency } = useAPI();
  useEffect(async () => {
    // let res= await postApi('/api/admin/orderDetailsCheck',{},app)
    getEmailTemplatesList();
  }, []);

  //   const handleListChange = (e) => {
  //     setSelectedListType(e);
  //     getSubscriptionList(e);
  //   };

  const getEmailTemplatesList = async () => {
    setLoader(true);
    let response = await postApi("/api/admin/getEmailTemplatesList", {}, app);
    if (response?.data?.message == "success") {
      response?.data?.data?.settings &&
        setTemplatesList(Object.entries(response?.data?.data?.settings));
    } else {
      toast.error(response?.data?.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setTemplatesList([]);

      //   setFilteredList([]);
    }
    setLoader(false);
  };

  const handleChange = async (value, type, option, index) => {
    setLoader(true);

    if (option == "adminNotification") {
      value = value?.target?.checked;
    }

    let response = await postApi(
      "/api/admin/emailTemplateStatusOrAdminNotificationUpdate",
      { option, value, type },
      app
    );

    if (response?.data?.message == "success") {
      let duplicate = [...templatesList];
      duplicate[index][1][option] = response.data.data.settings[type][option];

      setTemplatesList(duplicate);
    }

    setLoader(false);
  };

  const handleEmailConfigurationButton = async () => {
    setEmailConfigurationModal(true);
    setLoader(true);
    let response = await postApi(
      "/api/admin/getEmailConfigurationData",
      {},
      app
    );
    if (response.data.message == "success") {
      form.setFieldsValue(response.data.data);
    } else {
      toast.error(response?.data?.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setLoader(false);
  };

  //////////

  const handleTestMailInput = (e) => {
    let errorinput = false;
    setRecipientMail(e.target.value);

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    // if(e.target.value != "" || e.target.value != undefined){
    //   setEmptyEmailError(false)
    // }

    if (e.target.value == "" || e.target.value == undefined) {
      errorinput = true;

      setEmptyEmailError(true);
      setInvalidEmailError(false);
    } else if (!emailRegex.test(e.target.value) && e.target.value.length > 0) {
      errorinput = true;
      setInvalidEmailError(true);
      setEmptyEmailError(false);
    }

    if (errorinput == false) {
      setInvalidEmailError(false);
      setEmptyEmailError(false);
    }
  };

  const handleSaveConfigurationSettings = async (values) => {
    setLoader(true);

    let response = await postApi(
      "/api/admin/emailConfiguration",
      { values, check: "configuration" },
      app
    );
    if (response.data.message == "success") {
      toast.success("Data saved successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (response.data.message == "error") {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    setLoader(false);
  };

  const handleConfigurationSendMailTo = async () => {
    setLoader(true);
    // await (form.validateFields())
    //let errorCheck=form.getFieldsError().some((field) => field.errors.length);
    //console.log("errorcheck",errorCheck)
    // if(errorCheck ){
    //   console.log("in if errorcheck")
    //   return ;
    // }

    // else{
    let values = form.getFieldsValue();
    let encryptionConfig = {};
    if (values.encryption === "ssl") {
      encryptionConfig = {
        secure: true,
        requireTLS: true,
      };
    } else if (values.encryption === "tls") {
      encryptionConfig = {
        secure: false, // For TLS, secure should be set to false
        requireTLS: true,
      };
    }
    //srdvsdnxfmbrduw
    const emailConfig = {
      host: values.host,
      port: parseInt(values.portNumber), // Convert port number to integer
      auth: {
        user: values.userName,
        pass: values.password,
      },
      ...(values.encryption === "none" ? {} : encryptionConfig),
    };

    let options = {
      from: `${values.fromName}<${values.userName}>`,
      to: recipientMail,
      subject: "SMTP Settings Test",
      text: "checking smtp setttings",
    };
    let bodyData = { emailConfig, options };

    let response = await postApi(
      "/api/admin/sendMailCommon",
      { emailConfig, options, check: "smtpTest" },
      app
    );
    if (response.data.message == "success") {
      toast.success("Mail sent successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setLoader(false);
  };

  const handleSubmitSendMailTo = () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (recipientMail == undefined || recipientMail == "") {
      setEmptyEmailError(true);

      setInvalidEmailError(false);
      return false;
    } else if (!emailRegex.test(recipientMail) && recipientMail.length > 0) {
      setInvalidEmailError(true);
      setEmptyEmailError(false);
      return false;
    }

    form
      .validateFields()
      .then(() => {
        handleConfigurationSendMailTo();
      })
      .catch((error) => {
        // console.log("Form validation error:", error);
      });
  };

  const handleEmailTestFinish = async (values) => {
    setLoader(true);

    let others = {
      // subject: "Template check",
      // text: "Plaintext version of the message",
    };

    let extra = {
      selectedTemplate: selectedTemplate[1],
      templateType: selectedTemplate[0],
      currency,
      mode: "demo",
    };

    // const emailContent = ejs.render(emailTemplate, { formData });

    let res = await sendMailDefault(values.receiverMail, others, app, extra);

    if (res.data.message == "success") {
      toast.success("Email sent successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setEmailTestModal(false);
      form2.resetFields();
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    setLoader(false);
  };

  const handleEncryptionChange = (value) => {
    const portNumber = value === "tls" ? 587 : value === "ssl" ? 465 : 25;
    form.setFieldsValue({ portNumber });
  };

  return (
    <Spin spinning={loader} size="large" tip="Loading...">
      <CalculateBillingUsage setBillingPlan={setBillingPlan} />
      <div className="revltic-planlist subscription-list emailtemplate">
        <div className="revlytic-email-temp-config">
          <h3>Email Templates </h3>
          <div>
            <Button onClick={handleEmailConfigurationButton}>
              Email Configuration
            </Button>
          </div>
        </div>
        <div className="responsive-table-forAll-screen">
          <ul className="responsive-table">
            <li className="table-header">
              <div className="status email-temp-h1">Customer Notification</div>
              <div className="name">Name</div>
              <div className="adminNotification">Admin Notification</div>
              <div className="admin-manage ">Manage</div>
            </li>
            {templatesList.map((item, index) => {
              return (
                <li key={index}>
                  <div>
                    <p>
                      <Switch
                        checked={item[1].status}
                        onChange={(value) =>
                          handleChange(value, item[0], "status", index)
                        }
                      />
                    </p>
                  </div>
                  <div className="subscription-email-temp-name">
                    <p>
                      {item[0] == "subscriptionPurchased"
                        ? "Subscription Purchased"
                        : item[0] == "subscriptionCanceled"
                        ? "Subscription Canceled"
                        : item[0] == "subscriptionPaused"
                        ? "Subscription Paused"
                        : item[0] == "subscriptionResumed"
                        ? "Subscription Resumed"
                        : item[0] == "subscriptionProduct(s)Updated"
                        ? "Subscription Product(s) Updated"
                        : item[0] == "paymentFailure"
                        ? "Payment Failure"
                        : item[0] == "shippingAddressUpdated"
                        ? "Shipping Address Updated"
                        : item[0] == "subscriptionInvoice"
                        ? "Subscription Invoice"
                        : item[0] == "upcomingOrderReminder"
                        ? "Upcoming Order Reminder"
                        : item[0] == "standardCourtsyNotice"
                        ? "Standard Courtsy Notice"
                        : item[0] == "standardPastDueNotice1"
                        ? "Standard Past Due Notice1"
                        : item[0] == "standardPastDueNotice2"
                        ? "Standard Past Due Notice2"
                        : item[0] == "standardPastDueNotice3"
                        ? "Standard Past Due Notice3"
                        : item[0] == "standardFinalDemand"
                        ? "Standard Final Demand"
                        : ""}
                    </p>
                  </div>

                  <div className="subscription-email-temp-name checkbox">
                    <p>
                      {/* <Switch
                      checked={item[1].adminNotification}
                      onChange={(value) =>
                        handleChange(value, item[0], "adminNotification", index)
                      }
                    /> */}

                      <Checkbox
                        checked={item[1].adminNotification}
                        onChange={(value) =>
                          handleChange(
                            value,
                            item[0],
                            "adminNotification",
                            index
                          )
                        }
                      />
                    </p>
                  </div>

                  <div className="revlytic list-actions email-temp-actions">
                    <Button
                      onClick={() => navigate(`/emailtemplate?type=${item[0]}`)}
                    >
                      <EditOutlined /> Edit
                    </Button>

                    <Button
                      onClick={() => {
                        setEmailTestModal(true);
                        setSelectedTemplate(item);
                      }}
                      // onClick={()=>handleEmailTestClick(index,item[0],item[1])}
                    >
                      Email Test
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <Modal
          // title="Create Customer "
          maskClosable={false}
          open={emailTestModal}
          onCancel={() => {
            setEmailTestModal(false);
            form2.resetFields();
          }}
          footer={[]}
        >
          {/* <div className="revlytic new-customer-modal">
            <div>
              <p>Send Mail To</p>
              <Input value={emailTestRecipientMail} onChange={handle} />
            </div>

            <Button onClick={handleSubmitEmailTest}>Submit</Button>
          </div> */}

          <Form
            form={form2}
            // name="basic"
            layout="vertical"
            onFinish={handleEmailTestFinish}
            //   onFinishFailed={onFinishFailedproduct}

            autoComplete="off"
          >
            <Form.Item
              label="Send Email To"
              name="receiverMail"
              className="revlytic-email-test-modal-title"
              rules={[
                {
                  required: true,
                  message: "Receiver email is required!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email.",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <div className="revlytic-email-save">
              <Button htmlType="submit">Send</Button>
            </div>
          </Form>
        </Modal>

        <div>
          <Modal
            // title="Create Customer "
            maskClosable={false}
            open={emailConfigurationModal}
            onCancel={() => {
              setEmailConfigurationModal(false);
              form.resetFields();
              setRecipientMail("");
              setEmptyEmailError(false);
              setInvalidEmailError(false);
            }}
            footer={[]}
            className="revlytic email-configuration-main"
          >
            <Spin spinning={loader} size="large" tip="Loading...">
              <div className="revlytic email-configuration-modal">
                <h4> Email Configuration </h4>
                <div className="revlytic-email-configuration-form">
                  <div className="revlytic smtp-content">
                    <h3>SMTP Configuration</h3>
                    <p>
                      Add email configuration settings to send mail from your
                      server.
                      {/* If you are using Gmail then you can set SMTP using gmail app password by going through following
                 <a href="#"> URL: - Email SMTP Settings </a> */}
                    </p>
                  </div>
                  <div className="revlytic-enable-custom-field-mian">
                    <Form
                      form={form}
                      // name="basic"
                      layout="vertical"
                      onFinish={handleSaveConfigurationSettings}
                      //   onFinishFailed={onFinishFailedproduct}

                      autoComplete="off"
                    >
                      <div className="revlytic-email-enable-custom-fields">
                        <div className="revlytic-custom-email-toggle">
                          <Form.Item
                            label="Enable custom email configuration"
                            name="enable"
                            valuePropName="checked"
                            initialValue={false}
                          >
                            <Tooltip
                              color="#ffffff"
                              className="revlytic-upgrade-tooltip"
                              title={
                                billingPlan != "premium" ? (
                                  <Link
                                    to={`/billing?option=enableEmailConfiguration`}
                                  >
                                    Upgrade your Plan
                                  </Link>
                                ) : (
                                  ""
                                )
                              }
                            >
                              <Switch disabled={billingPlan != "premium"} />
                            </Tooltip>
                          </Form.Item>

                          {/* <p>Enable custom email configuration</p>
<Switch/> */}
                        </div>
                        <div className="custom-email-host-inputs">
                          <Form.Item
                            label="Email Host Name"
                            name="host"
                            rules={[
                              {
                                required: true,
                                message: "Host is required!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>

                          {/* <p>Email Host</p>
<Input/> */}
                        </div>
                      </div>

                      <div className="revlytic-email-enable-custom-fields">
                        <div className="custom-email-host-inputs">
                          <Form.Item
                            label="User name"
                            name="userName"
                            rules={[
                              {
                                required: true,
                                message: "User name is required!",
                              },
                              {
                                pattern:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Please enter a valid email address",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>

                          {/* 
     <p>User name</p>
      <Input/> */}
                        </div>
                        <div className="custom-email-host-inputs">
                          <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                              {
                                required: true,
                                message: "Password is required!",
                              },
                            ]}
                          >
                            <Input type="password" />
                          </Form.Item>

                          {/* <p>Password</p>
<Input type="password"/> */}
                        </div>
                      </div>

                      <div className="revlytic-email-enable-custom-fields">
                        <div className="custom-email-host-inputs">
                          <Form.Item
                            label="Sender Name"
                            name="fromName"
                            rules={[
                              {
                                required: true,
                                message: "Sender name is required!",
                              },
                              // {
                              //   pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              //   message: "Please enter a valid email address",
                              // },
                            ]}
                          >
                            <Input />
                          </Form.Item>

                          {/* <p>From name</p>
      <Input/> */}
                        </div>
                        <div className="custom-email-host-inputs">
                          <Form.Item
                            label="Encryption"
                            name="encryption"
                            initialValue="tls"
                          >
                            <Select onChange={handleEncryptionChange}>
                              <Select.Option value="none">None</Select.Option>
                              <Select.Option value="tls">TLS</Select.Option>
                              <Select.Option value="ssl">SSL</Select.Option>
                            </Select>
                          </Form.Item>

                          {/* <p>Encryption</p>
<Select>
<Select.Option value="none">None</Select.Option>
<Select.Option value="ssl">Ssl</Select.Option>
<Select.Option value="ssl">Tls</Select.Option>

</Select> */}
                        </div>
                      </div>

                      <div className="revlytic-email-port-number">
                        {/* <Form.Item
                  label="Port number"
                  name="portNumber"
                  rules={[
                    {
                      required: true,
                      message: "Port number is required!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item> */}

                        <Form.Item
                          label="Port number"
                          name="portNumber"
                          rules={[
                            {
                              required: true,
                              message: "Port number is required!",
                            },
                          ]}
                          initialValue={587}
                        >
                          <Input disabled />
                        </Form.Item>
                      </div>

                      <div className="revlytic-email-save">
                        <Tooltip
                          color="#ffffff"
                          className="revlytic-upgrade-tooltip"
                          title={
                            billingPlan != "premium" ? (
                              <Link
                                to={`/billing?option=enableEmailConfiguration`}
                              >
                                Upgrade your Plan
                              </Link>
                            ) : (
                              ""
                            )
                          }
                        >
                          <Button
                            htmlType="submit"
                            disabled={billingPlan != "premium"}
                          >
                            Save
                          </Button>
                        </Tooltip>
                      </div>
                    </Form>

                    <div className="revlytic test-smtp-content">
                      <h3>Test SMTP Email</h3>
                      <p>Please test SMTP settings by sending a test email.</p>
                    </div>

                    <div className="revlytic-test-mail-column">
                      <p>Test Email Address</p>
                      <Input
                        value={recipientMail}
                        onChange={handleTestMailInput}
                      />
                      {invalidEmailError && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          Please enter a valid email.
                        </p>
                      )}
                      {emptyEmailError && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          {" "}
                          Recipient email is required!
                        </p>
                      )}
                    </div>

                    <div className="revlytic-test-mail-btn">
                      <Button onClick={handleSubmitSendMailTo}>
                        Send Test Email
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Spin>
          </Modal>
        </div>
      </div>
    </Spin>
  );
};

export default EmailTemplatesList;
