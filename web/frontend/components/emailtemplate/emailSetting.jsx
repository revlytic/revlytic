import React from 'react'
import {Card,Input} from 'antd'
import Preview from './preview'
function EmailSetting({formData,textEditorData,setFormData,setTextEditorData}) {
  return (
    <div style={{display:"flex"}}>
        <Card>
        <div><p>Subject</p><Input/></div>   
          <div><p>CCC Email</p><Input/></div>   
          <div><p>Bcc Email</p><Input/></div>   
          <div><p>Reply To</p><Input/></div>   
   </Card>

        <Card><Preview  formData={formData} textEditorData={textEditorData}/></Card>

    </div>
  )
}

export default EmailSetting