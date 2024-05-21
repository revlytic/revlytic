import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom'; 
import postApi from '../components/common/postApi';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useAPI } from '../components/common/commonContext';
import {Button, Card} from 'antd';
const Setup=()=>{
const {shop}=useAPI()
const app=useAppBridge()
const [plan, setPlan] = useState(false)
const [activeStep,setActiveStep]=useState(2)
const navigate = useNavigate();

console.log("process",process.env)
async function checkAppBlockEmbed() {
    let response = await postApi("/api/admin/checkAppBlockEmbed", {}, app);

    if (response?.data?.message == "success") {
        return (response?.data?.data?.disabled);
    } else if (response?.data?.message == "noData") {
        console.log("inelsee20mayt")
        return false;
    }
  }

  async function checkAppBlock() {
    let response = await postApi("/api/admin/checkAppBlock", {}, app);
    if (response?.data?.message == "success") {
        return (response?.data?.data?.active);
    } 
  }

const handleNext=()=>{

if(activeStep==1){
    console.log("sdwede")
   let check= checkAppBlockEmbed()
   if(check==true){
    console.log("in iffactive1")
    setActiveStep(2)
   }
}
else if(activeStep==2){
    let check= checkAppBlock()
    if(check==true){
     setActiveStep(3)
    }

}
else if(activeStep==3){


}


}
console.log("shop",shop)
return( 
    <Card style={{}}>
    
   {activeStep==1  && <div>
    <p>appembed</p>
    <Button onClick={()=> open(`https://${shop}/admin/themes/current/editor?context=apps&template=settings_data&activateAppId=02743a62-f002-483e-9249-db21ddf2fb51/revlytic`, "_blank")}>check appembed</Button>
    </div>}
    {activeStep==2  && <div>
    <p>appblock</p>
    <Button  onClick={()=> open(`https://${shop}/admin/themes/current/editor?template=product&addAppBlockId=02743a62-f002-483e-9249-db21ddf2fb51/revlytic_app_bock&target=aside
` , "_blank")}>check appblock</Button>
   </div>}
   
    {activeStep==3  && <div>
    <div onClick={()=>navigate('/createSubscription?setup=true')}>create plan</div>
        </div>}
    <div onClick={()=>console.log("skip")}>Skip</div>
    {activeStep >1 && <div onClick={()=>setActiveStep(prev=>prev-1)}>back</div>}
    <div onClick={handleNext}>Next</div>

    </Card>
)

}  

export default Setup; 