import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import defaultBanner from "../imgs/blog banner.png"

import { Toaster, toast } from "react-hot-toast";
import { uploadImage } from "../common/upload";

import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";

import { useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";


const BlogEditor = () => { 

const handleBannerUpload = (e) => {

    let img = e.target.files[0];

    if(img) {

        let loadingToast = toast.loading("uploading....");

        uploadImage(img).then((url) => {

            if (url) {

                toast.dismiss(loadingToast);
                toast.success("uploaded !!!");

                setBlog({ ...blog, banner: url });
            }

        })
        .catch (err => {

            toast.dismiss(loadingToast);
            return toast.error(err);
        })
    }

}

// enter key block and title stays one line
const handleTitleKeyDown = (e) => {

    if (e.keyCode == 13) {

        e.preventDefault();
    }
}

// just copies the current blog object and overwrites title
const handleTitleChange = (e) => {

    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
}

// sets def banner 
const handleError = (e) => {

    let img = e.target;
    img.src = defaultBanner;
}

// publish handler to check content length and if ready to publish
const handlePublishEvent = () => { 

    if(!banner.length) {

        return toast.error("you need a banner compulsarily !");
    }

    if (!title.lenth) {

        return toast.error("you must have a title to publish !");
    }

    if (textEditor.isReady) {

        textEditor.save().then(data => {

            if (data.blocks.length) {

                setBlog({ ...blog, content: data });
                setEditorState("publish");
            }
            else {

                return toast.error("write something in content to publish !!");
            }
        })

        .catch((err) => {

            console.log(err);
        })
    }
}


let { blog, blog: { title, banner }, setBlog, textEditor, setEditorState } = useContext(EditorContext);



// to point to id, starting empty data and runs once when the component && skips creation if editor already exists
useEffect(() => {

    if(!textEditor.isReady) {

        setTextEditor(new EditorJS ({

            holder: "textEditor",
            data: '',
            tools: tools,
            placeholder: "write a crazy story..."
        }))
    }
}, [])


return (

    <>

    <Toaster />
    
    <nav>

        <Link to="/">
            <img src={logo} />
        </Link>

        <p>{ title.length ? title: "New Blog" }</p>

        <div>

            <button onClick={handlePublishEvent}>Publish</button>
            <button>Save Draft</button>
        </div>

    </nav>


    <section>

        <div>
            <div>

                <label htmlFor="uploadBanner">

                    <img src={banner} onError={handleError} />

                    <input 

                    id="uploadBanner"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    hidden
                    onChange={handleBannerUpload} />

                    
                </label>

            </div>

            <textarea placeholder="Blog Title"
                      onKeyDown={handleTitleKeyDown}
                      onChange={handleTitleChange} >

                      </textarea>

                      <hr />
                      <div id="textEditor"></div>

        </div>

    </section>

    </>
)
}

export default BlogEditor