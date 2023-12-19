import React,{useState} from 'react'
import Preview from './preview'
import {Card, Input} from 'antd'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { EditorState, convertToRaw, convertFromRaw ,ContentState,convertFromHTML } from 'draft-js';
import draftToHtml from "draftjs-to-html";
function Custom({templateType}) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [customData,setCustomData]=useState("")
  
  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const html = draftToHtml(rawContentState);
    setCustomData(html);
    const text = convertFromRaw(rawContentState).getPlainText();
    // if (text.length < 50) {
    //   setInputError("Message must be at least 50 characters.");
    // } else {
    //   setInputError("");
    // }
  };
  

  return (
<div style={{display:"flex"}}>
        <Card>
        <Editor
  editorState={editorState}
  toolbarClassName="toolbarClassName"
  wrapperClassName="wrapperClassName"
  editorClassName="editorClassName"
   onEditorStateChange={(newEditorState)=>handleEditorStateChange(newEditorState)}
/> 
        </Card>
        <Card>
        <div dangerouslySetInnerHTML={{__html: customData}} />

          </Card>

    </div>
  )
}

export default Custom;