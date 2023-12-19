import { notification} from 'antd';
// let  type =  'success' | 'info' | 'warning' | 'error' ;
  
const Toast = (type,res,placement) => {
        console.log(type,res)
 return( 
  notification[type]({
    message: `Notification ${type}`,
    description: `${res}`,
    placement:`${placement}`,
  })

 )

}
export default Toast;