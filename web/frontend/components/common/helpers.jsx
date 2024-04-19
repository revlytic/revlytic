import postApi from "./postApi";

export async function sendMailDefault(recipientMail, others, app, extra) {
  
  let getEmailConfigData = await postApi(
    "/api/admin/getEmailConfigurationData",
    {},
    app
  );

  if (getEmailConfigData.data.message == "success") {
    let data = getEmailConfigData.data?.data;
    if (data && data.enable == true) {
      let encryptionConfig = {};
      if (data.encryption === "ssl") {
        encryptionConfig = {
          secure: true,
          requireTLS: true,
        };
      } else if (data.encryption === "tls") {
        encryptionConfig = {
          secure: false,
          requireTLS: true,
        };
      }

      const emailConfig = {
        host: data.host,
        port: parseInt(data.portNumber),
        auth: {
          user: data.userName,
          pass: data.password,
        },
        ...(data.encryption === "none" ? {} : encryptionConfig),
      };

      let options = {
        from: `${data.fromName}<${data.userName}>`,
        to: recipientMail,
        subject: extra?.selectedTemplate?.emailSetting?.subject,
        cc: extra?.selectedTemplate?.emailSetting?.cc,
        bcc: extra?.selectedTemplate?.emailSetting?.bcc,
        replyTo: extra?.selectedTemplate?.emailSetting?.replyTo,
      };

      let response = await postApi(
        "/api/admin/sendMailCommon",
        { emailConfig, options, extra },
        app
      );

      return response;
    } else {
      const emailConfig = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "sahilagnihotri7@gmail.com",
          pass: "srdvsdnxfmvbrduw",
        },
        secure: false,
      };

      let options = {
        from: "sahilagnihotri7@gmail.com",
        to: recipientMail,
        subject: extra?.selectedTemplate?.emailSetting?.subject,
        cc: extra?.selectedTemplate?.emailSetting?.cc,
        bcc: extra?.selectedTemplate?.emailSetting?.bcc,
        replyTo: extra?.selectedTemplate?.emailSetting?.replyTo,
      };

      let response = await postApi(
        "/api/admin/sendMailCommon",
        { emailConfig, options, extra },
        app
      );

      return response;
    }
  } else {
    toast.error("Something went wrong", {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
}

export async function sendMailOnUpdate(others, app, extra) {
  let getEmailTemplateAndConfigData = await postApi(
    "/api/admin/getEmailTemplateAndConfigData",
    { templateType: extra?.templateType },
    app
  );

  let templateType = extra?.templateType;

  if (getEmailTemplateAndConfigData.data.message == "success") {
    let getData = getEmailTemplateAndConfigData?.data?.data;

    let sendMailToCustomer = getData?.settings[templateType].status;
    let sendMailToMerchant = getData?.settings[templateType].adminNotification;

    if (sendMailToCustomer || sendMailToMerchant) {
      let recipientMails = [];

      if (sendMailToMerchant) {
        let shopEmail = extra?.shop_email;

        recipientMails.push(shopEmail);
      }
      if (sendMailToCustomer) {
        recipientMails.push(extra?.data?.customer_details?.email);
      }

      let configurationData = getData?.configuration;
      let selectedTemplate = getData?.settings[templateType];

      let options = {};
      let emailConfig = {};

      if (configurationData && configurationData.enable == true) {
        let encryptionConfig = {};
        if (configurationData.encryption === "ssl") {
          encryptionConfig = {
            secure: true,
            requireTLS: true,
          };
        } else if (configurationData.encryption === "tls") {
          encryptionConfig = {
            secure: false,
            requireTLS: true,
          };
        }

        emailConfig = {
          host: configurationData.host,
          port: parseInt(configurationData.portNumber),
          auth: {
            user: configurationData.userName,
            pass: configurationData.password,
          },
          ...(configurationData.encryption === "none" ? {} : encryptionConfig),
        };

        options = {
          from: `${configurationData.fromName}<${configurationData.userName}>`,
          to: recipientMails,
          subject: selectedTemplate?.emailSetting?.subject,
          cc: selectedTemplate?.emailSetting?.cc,
          bcc: selectedTemplate?.emailSetting?.bcc,
          replyTo: selectedTemplate?.emailSetting?.replyTo,
          ...others,
        };
      } else {
        emailConfig = {
          host: "smtp.gmail.com",
          port: 587,
          auth: {
            user: "sahilagnihotri7@gmail.com",
            pass: "srdvsdnxfmvbrduw",
          },
          secure: false,
        };

        options = {
          from: "sahilagnihotri7@gmail.com",
          to: recipientMails,
          subject: selectedTemplate?.emailSetting?.subject,
          cc: selectedTemplate?.emailSetting?.cc,
          bcc: selectedTemplate?.emailSetting?.bcc,
          replyTo: selectedTemplate?.emailSetting?.replyTo,
          ...others,
        };
      }

      let finalResponse = await postApi(
        "/api/admin/sendMailOnUpdate",
        { recipientMails, emailConfig, options, selectedTemplate, extra },
        app
      );
      return finalResponse;
    }
  } else {
    return { message: "error" };
  }
}
