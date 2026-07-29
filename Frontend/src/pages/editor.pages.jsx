import { useContext, useState, createContext } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";

import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component"; 


const blogStructure = {

    title: '',
    banner: '',
    content: [],
    tags: [],
    des: '',
    author: { personal_info: { }  }
}

export const EditorContext = createContext( { } );

const Editor = () => { 
    
    const [ editorState, setEditorState ] = useState("editor");
    
    const [ blog, setBlog ] = useState(blogStructure);

    const [ textEditor, setTextEditor ] = useState({ isReady: false});

    let { userAuth: { access_token } } = useContext(UserContext);

    return (

        access_token === null ? <Navigate to="/signin" />
        :
         <EditorContext.Provider value={{ blog, setBlog, textEditor, setTextEditor, editorState, setEditorState }}>
        
        {

            editorState == "editor" ? <BlogEditor /> : <PublishForm />

        }

        </EditorContext.Provider>

    )
}


export default Editor