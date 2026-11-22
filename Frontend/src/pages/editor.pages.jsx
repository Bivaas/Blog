import { useContext, useState, createContext, useEffect } from "react";
import { UserContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/loader.component";

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

    let { blog_id } = useParams();
    const [ loading, setLoading ] = useState(true); 

    // blog fetch in edit
    useEffect(() => {

        if (!blog_id) {

            return setLoading(false);
        }

        axios.post(import.meta.env.VITE_DOMAIN + "/get-blog", { blog_id, draft: true, mode: "edit" } )

        .then(( { data: { blog } }) => {

            setBlog(blog);
            setLoading(false);
        })

        .catch(err => {
            setBlog(null);
            setLoading(false);
        })
    }, [])

    return (

        access_token === null ? <Navigate to="/signin" />
        :
        loading ? <Loader /> :
         <EditorContext.Provider value={{ blog, setBlog, textEditor, setTextEditor, editorState, setEditorState }}>
        
        {

            editorState == "editor" ? <BlogEditor /> : <PublishForm />

        }

        </EditorContext.Provider>

    )
}


export default Editor