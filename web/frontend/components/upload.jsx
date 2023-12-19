import React, { useState } from "react";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppBridge } from "@shopify/app-bridge-react";
import { toast } from "react-toastify";


const UploadImage = (props) => {
  const app = useAppBridge();

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoView, setLogoView] = useState(props.logo)
  const [signatureView, setSignatureView] = useState(props.signature)

  const handleUpload = async (file) => {
    
    const formData = new FormData();
    formData.append("image", file);
    formData.append("flag", props.check);
    if (props.check == "logo") {
      props.setLogoData(formData)
      const url = URL.createObjectURL(file)
      setLogoView(url)
      console.log("checkkk karr",signatureView)
    } else {
      props.setSignatureData(formData)
      const url = URL.createObjectURL(file)
      setSignatureView(url)
      console.log("karr checkkk ",logoView)

    }
  };
const beforeUpload = async (file) => {
  const isImage = file.type.startsWith('image/');

  if (!isImage) {
    message.error('You can only upload image files!');
    return false; // Prevent upload if the file is not an image
  } 

  return true; // Allow upload if the file is an image and no deletion was needed
};


  const uploadButton = (
    <div className="invoice_uploadMain">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="logoText">Upload <div className="logoText"> {props.check == "signature"?"Signature":"Logo"}</div> </div>
    </div>
  );

  return (
    <Upload
      name="image"
      listType="picture-card"
      showUploadList={false}
      beforeUpload={beforeUpload}
      customRequest={({ file }) => handleUpload(file)}
      accept="image/*"
      className={props.check == "signature"?"revlytic upload-signature":"revlytic upload-logo"}
    >
      { props.check == "logo" && logoView ? (
        <img src={logoView} alt="uploaded" width={216} height={43} />
      ) : props.check == "signature" && signatureView? (
        <img src={signatureView} alt="uploaded" width={216} height={43} />
      ) : (
        <div className="invoice-upload-box">
        {/* <div className="logoText">{props.check == "signature"?"signature":"Logo"}</div> */}
        {uploadButton}
      </div>
      )}
    </Upload>
    // <input type="file" onchange/>
  );
};

export default UploadImage;
