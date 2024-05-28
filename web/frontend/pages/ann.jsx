
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
    Empty,
    
    // TextArea
  } from "antd";
import TextArea from "antd/es/input/TextArea";
import postApi from "../components/common/postApi";  
import { LoadingOutlined, PlusOutlined,DeleteOutlined ,SoundOutlined} from '@ant-design/icons';
import { useAppBridge } from "@shopify/app-bridge-react";
import { message, Upload } from 'antd';
import { commonVariables } from "../components/common/helpers";
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


function Ann() {

const [announcementList,setAnnouncementList]=useState([])
const [addMore,setAddMore]=useState(false)
const[selectedItem,setSelectedItem]=useState({})
const app=useAppBridge()
const [loading, setLoading] = useState(false);
const [loader, setLoader] = useState(false);
const [mainLoader, setMainLoader] = useState(false);
const [imageUrl, setImageUrl] = useState();
const [imageData, setImageData] = useState();
const [title, setTitle] = useState();
const [description, setDescription] = useState();
const [buttonText, setButtonText] = useState();
const [buttonUrl, setButtonUrl] = useState();
const [mode, setMode] = useState();
const [error,setError]=useState({
   title:false,
   buttonText:false,
   buttonUrl:false,
   description:false

})

useEffect(async()=>{
 await getAnnouncements()

},[])


const getAnnouncements=async()=>{

  let fetchAnnouncements=await postApi("/api/admin/getAnnouncements",{},app)

  if(fetchAnnouncements?.data?.message=='success'){
  
    setAnnouncementList(fetchAnnouncements?.data?.data)
  }

}



const handleChange = (file) => {

    const formData = new FormData();
    formData.append("image", file);
    formData.append("flag", "announcement");
    setImageData(formData)
    console.log(file)
    const url = URL.createObjectURL(file)
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

const  handleDelete=async(index)=>{
  setMainLoader(true)
if(announcementList[index]?.image){
 console.log("3oct")
  const response = await postApi(
    "/api/admin/delete",
    { url: `${commonVariables?.url}/images/announcement/${announcementList[index]?.image}`  },
    app
  );

  let data = await postApi("/api/admin/deleteAnnouncement", {_id:announcementList[index]?._id},app)
  if(data?.data?.message=='success'){

    await  getAnnouncements()

  }

}
else{

console.log("hello")
let data = await postApi("/api/admin/deleteAnnouncement", {_id:announcementList[index]?._id},app)
if(data?.data?.message=='success'){

  await  getAnnouncements()

}

}

setMainLoader(false)

}

const handleInput =(item,value)=>{

item

}

const handleCancel=() => {
    setAddMore(false)
    setImageUrl()
    setButtonUrl("")
    setButtonText("")
    setDescription("")
    setTitle("")
    setError({
       title:false,
       description:false,
       buttonText:false,
       buttonUrl:false 
    })

}

const saveAnnouncement=async(filename)=>{


if(mode=='add'){

  let data = await postApi(
    "/api/admin/addAnnouncement",
    {
      
      image: filename,
      title,
      description,
      buttonUrl,
      buttonText  
          },
      app)

if(data?.data?.message=='success'){
  setImageUrl()
  setImageData()
  setButtonUrl()
  setButtonText()
  setDescription()
  setTitle() 
  setAddMore(false)
  
await getAnnouncements()

}
}
else{

  let data = await postApi(
    "/api/admin/updateAnnouncement",
    {
      _id:selectedItem?._id,
      image: filename,
      title,
      description,
      buttonUrl,
      buttonText  
          },
      app)

if(data?.data?.message=='success'){
  setImageUrl()
  setImageData()
  setButtonUrl()
  setButtonText()
  setDescription()
  setTitle() 
  setAddMore(false)
  setSelectedItem({})
  
await getAnnouncements()

}

}

}


const handleSubmit=async()=>{
  try{
    console.log("checkkkkk")
    
    let flag=false;
    
    if (!buttonUrl) {
    setError(prevError => ({ ...prevError, buttonUrl: true }));
     flag=true
 }


   if (!title) {
    setError(prevError => ({ ...prevError, title: true }));
    flag=true
  }
  
  if (!buttonText) {
    setError(prevError => ({ ...prevError, buttonText: true }));
    flag=true
  }
  
  if (!description) {
    setError(prevError => ({ ...prevError, description: true }));
    flag=true
  }
  
if(flag==false){
  console.log("tiktokk")
  setLoader(true)
setError({
  title:false,
  buttonText:false,
  buttonUrl:false,
  description:false,

})

     if(mode=="add"){
       

    if(imageUrl){

   let  imageResponse=  await postApi("/api/admin/upload", imageData, app);

   if (imageResponse.data.message == "success") {
   
  setImageUrl(
     `${commonVariables?.url}/images/announcement/${imageResponse?.data?.name}`
  );

await saveAnnouncement(imageResponse?.data?.name)

  }
 
}

else{

  await saveAnnouncement("")

}

  }
  else if(mode=='edit'){
console.log("start")
   if(imageUrl){
   
   if(`${commonVariables?.url}/images/announcement/${selectedItem?.image}` != imageUrl){
    

    console.log("mid")
    const response = await postApi(
      "/api/admin/delete",
      { url: `${commonVariables?.url}/images/announcement/${selectedItem?.image}`  },
      app
    );
  

   }
   
   let  imageResponse=  await postApi("/api/admin/upload", imageData, app);
   console.log(imageData)
    if (imageResponse.data.message == "success") {
   
      setImageUrl(
         `${commonVariables?.url}/images/announcement/${imageResponse?.data?.name}`
      );
    
    await saveAnnouncement(imageResponse?.data?.name)
   }
   
   else{

    await saveAnnouncement(selectedItem?.image)



   }

  }

else{

  if(selectedItem?.image){
    const response = await postApi(
      "/api/admin/delete",
      { url: `${commonVariables?.url}/images/announcement/${selectedItem?.image}`  },
      app
    );

}

await saveAnnouncement("")


}


  }

setLoader(false)

}

} 

catch (error) {
  setLoader(false)
  console.log("error",error)
}

}



// const handleSubmit=async()=>{
//   try{
//     console.log("checkkkkk")
    
//     let flag=false;
//   if(error.title==true || error.description==true || error.buttonText==true || error.buttonUrl==true){
//    flag==true
// return ;
//   }
//   console.log("ahil")
// if(flag==false){
//   console.log("tiktokk")
//   setLoader(true)
// setError({
//   title:false,
//   buttonText:false,
//   buttonUrl:false,
//   description:false,

// })

// //      if(mode=="add"){
       

// //     if(imageUrl){

// //    let  imageResponse=  await postApi("/api/admin/upload", imageData, app);

// //    if (imageResponse.data.message == "success") {
   
// //   setImageUrl(
// //      `https://revlytic.shinedezign.pro/images/announcement/${imageResponse?.data?.name}`
// //   );

// // await saveAnnouncement(imageResponse?.data?.name)

// //   }
 
// // }

// // else{

// //   await saveAnnouncement("")

// // }

// //   }
// //   else if(mode=='edit'){
// // console.log("start")
// //    if(imageUrl){
   
// //    if(`https://revlytic.shinedezign.pro/images/announcement/${selectedItem?.image}` != imageUrl){
    

// //     console.log("mid")
// //     const response = await postApi(
// //       "/api/admin/delete",
// //       { url: `https://revlytic.shinedezign.pro/images/announcement/${selectedItem?.image}`  },
// //       app
// //     );
  

// //    }
   
// //    let  imageResponse=  await postApi("/api/admin/upload", imageData, app);
// //    console.log(imageData)
// //     if (imageResponse.data.message == "success") {
   
// //       setImageUrl(
// //          `https://revlytic.shinedezign.pro/images/announcement/${imageResponse?.data?.name}`
// //       );
    
// //     await saveAnnouncement(imageResponse?.data?.name)
// //    }
   
// //    else{

// //     await saveAnnouncement(selectedItem?.image)



// //    }

// //   }

// // else{

// //   if(selectedItem?.image){
// //     const response = await postApi(
// //       "/api/admin/delete",
// //       { url: `https://revlytic.shinedezign.pro/images/announcement/${selectedItem?.image}`  },
// //       app
// //     );

// // }

// // await saveAnnouncement("")


// // }


// //   }

// setLoader(false)

// }

// } 

// catch (error) {
//   setLoader(false)
//   console.log("error",error)
// }

// }


const handleSubmitEdit=async()=>{








}


const handleEdit=(index)=>{


  setMode("edit")
let item={...announcementList[index]}

setSelectedItem(item)
setAddMore(true)
item?.image  ? setImageUrl( `${commonVariables?.url}/images/announcement/${item?.image}`) : setImageUrl()
setButtonText(item?.buttonText)
setButtonUrl(item?.buttonUrl)
setTitle(item?.title)
setDescription(item?.description)

}


return (<Spin spinning={mainLoader} size="large" tip="Loading...">
<div className="revlytic-annoucments-section"> 
<div className="revlytic plan-group-listing-button">   <h1 className="revlytic-plan-switch-heading">Announcement</h1></div>

  <div className="revlytic-annoucments-content"> 
    <p>Manage  your announcements for Revlytic app. Add  new  announcements, update the existing ones. Announcements can be seen on the homepage of Revlytic app.</p>
    <Button onClick={()=>{setAddMore(true)
      setMode("add")
    }}>Add  Announcement</Button>
  </div>

</div>

<div className="revlytic-annoucments-inner-section-main">
  {announcementList.length > 0 ?  announcementList.map((item,index)=>  
  <div key={index} className="revlytic-annoucments-inner-section"> 
       <div className="revlytic-annoucments-inner-row">
       <div className="revlytic-annoucments-inner-column">
        <img src={`${commonVariables?.url}/images/announcement/${item?.image}`} width="100" height="100"  />
        <div className="revlyticannoucments-inner-content">
          <h3>{item?.title}</h3>  
          <p>{item?.description}</p>
          <Button><a href={item?.buttonUrl}>{item?.buttonText}</a></Button>
        </div>
        </div>

        <div className="revlytiuc-annoucments-inner-buttons">
        <Button   onClick={()=>handleEdit(index)}>Edit</Button>
        <Button   onClick={()=>handleDelete(index)}>Delete</Button>
       </div>

       </div>
    </div>)
  :
  <Empty/>  
  
  
  }

    </div> 


 <Modal className="revlytic email-configuration-main annoucments" title={mode=="add" ? "Add Announcement" : "Edit Announcement" }
        open={addMore}
        onCancel={handleCancel}
        footer={[]}
        >
        <Spin spinning={loader} size="large" tip="Loading...">
        <div className="revlytic-annImg-upload">
        <p>upload Image: </p>
        <div className="revlytic-Imgupload-main">
        <Upload
        name="avatar"
        
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
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
    
    { imageUrl && <DeleteOutlined className="revlytic-annUpload-delete" onClick={()=>setImageUrl()}/>}
    </div>
       </div>

    <div className="revlytic-annInput">
        <p>Add Title: </p>
        <Input type='text' value={title} onChange={(e)=>{setTitle(e.target.value)
            if(e.target.value.trim()==''){
                
              setError(prevError => ({ ...prevError, title: true }));

            }
             else{
              setError(prevError => ({ ...prevError, title: false }));

             }
          
          }
        }/>
        {error.title==true && <p  className="revlytic announcement-error-text">Title is required!</p>}      
    </div>

    <div className="revlytic-annInput">
        <p> Add Description: </p>
        <TextArea  value={description} onChange={(e)=>{setDescription(e.target.value)
        
        if(e.target.value.trim()==''){
                
          setError(prevError => ({ ...prevError, description: true }));

        }
         else{
          setError(prevError => ({ ...prevError, description: false }));

         }
      
      
      } 
      
      
      
      }/>
        {error.description==true && <p  className="revlytic announcement-error-text">Description is required!</p>}      
    </div>

    <div className="revlytic-annInput">
        <p> Button Text: </p>
        <Input type='text'  value={buttonText} onChange={(e)=>{e.target.value.length < 30 && setButtonText(e.target.value)
        
        if(e.target.value.trim()==''){
                
          setError(prevError => ({ ...prevError, buttonText: true }));

        }
         else{
          setError(prevError => ({ ...prevError, buttonText: false }));

         }
        
        }}/>
        {error.buttonText==true && <p className="revlytic announcement-error-text">Button Text is required!</p>}        
    </div>

    <div className="revlytic-annInput">
        <p> Button Url: </p>
        <Input type='text' value={buttonUrl} onChange={(e)=>{setButtonUrl(e.target.value)  
        
        if(e.target.value.trim()==''){
                
          setError(prevError => ({ ...prevError, buttonUrl: true }));

        }
         else{
         
          setError(prevError => ({ ...prevError, buttonUrl: false }));

         }
        }}/>
        {error.buttonUrl==true && <p  className="revlytic announcement-error-text">Button Url is required!</p>}       
    </div>
    <div className="revlytic-annoucments-submit-button">
    <Button onClick={handleSubmit}>Submit</Button>
    
    </div>
    </Spin>
</Modal>


  </Spin>
 

  )
}

export default Ann