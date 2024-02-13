import React,{useEffect,useState,useRef} from 'react';
import {ColorPicker} from 'antd'


function Test() {

    const [buttonColor, setButtonColor] = useState("#000");
    const buttonColorRef = useRef(null);
    const [formatHex, setFormatHex] = useState('hex');
    const handleChange=  (e) => {
 
    //     console.log(e)
       setButtonColor(e.toHexString())
    console.log("buttonvclr",e.toHexString())
      };
  return (
    <div>
 <ColorPicker showText={(color) => <span>{buttonColor}</span>}    format={formatHex} 
              value={buttonColor}
              onChange={handleChange} />

    </div>

  )
}

export default Test