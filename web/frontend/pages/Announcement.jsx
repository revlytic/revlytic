
import React, { useEffect, useState, useRef } from "react";
import {
    Card,
    Button,
    Form,
    Checkbox,
    Input,
    Modal,
    Spin,
    Select,
    Radio,
    Tooltip,
    // TextArea
  } from "antd";
import TextArea from "antd/es/input/TextArea";
  
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};




function Announcement() {

  const [data,setData]=useState([{image:"",
title:"",
description:"",
buttonText:"",
buttonUrl:""
}])
const [loading, setLoading] = useState(false);
const [imageUrl, setImageUrl] = useState();
const handleChange = (info) => {
    console.log(info)
    const url = URL.createObjectURL(info)
    setImageUrl(url);

//   if (info.file.status === 'uploading') {
//     setLoading(true);
//     return;
//   }
//   if (info.file.status === 'done') {
//     // Get this url from response in real world.
//     getBase64(info.file.originFileObj, (url) => {
//       setLoading(false);
//       setImageUrl(url);
//     });
//   }
};

const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

const handleAdd=()=>{
    let item={image:"",
    title:"",
    description:"",
    buttonText:"",
    buttonUrl:""
    }
    console.log("add",[...data,item])
    setData([...data,item])
}

const  handleDelete=(index)=>{
console.log("index",index)
let copy=[...data];
copy.splice(index,1)
console.log("ccc",copy)
// setData([...copy])
setData(copy)

}

const handleInput =(index,item,value)=>{


if (item=="image"){



}
else{
let copy=[...data]

copy[index][item]=value
setData(copy)

}


console.log("ddd",data)

}


  return (<div>
<Button onClick={handleAdd}>Add  Announcement</Button>
{data.map((item,index)=>  <div style={{border:"1px solid"}}>
        
        <div>
       {data.length  > 1 && <Button style={{float:"right"}}  onClick={()=>handleDelete(index)}>Delete</Button>}
    <div>
        <p>upload Image: </p>
        <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        beforeUpload={beforeUpload}
        customRequest={({ file }) => handleChange(file)}
        accept="image/*"
        >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: '100%',
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
               
    </div>

    <div>
        <p>Add Title: </p>
        <Input type='text' onChange={(e)=>handleInput(index,"title",e.target.value)}/>
               
    </div>

    <div>
        <p> Add Description: </p>
        <TextArea  onChange={(e)=>handleInput(index,"description",e.target.value)} />
               
    </div>

    <div>
        <p> Button Text: </p>
        <Input type='text'  onChange={(e)=>handleInput(index,"buttonText",e.target.value)}/>
               
    </div>

    <div>
        <p> Button Url: </p>
        <Input type='text' onChange={(e)=>handleInput(index,"buttonUrl",e.target.value)}/>
               
    </div>

</div>



</div>)}

  </div>
 
  )
}

export default Announcement