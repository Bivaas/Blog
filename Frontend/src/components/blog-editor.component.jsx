import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import defaultBanner from "../imgs/blog banner.png"

import { Toaster, toast } from "react-hot-toast";
import { uploadImage } from "../common/upload";

import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";

import { useEffect } from "react";
import EditorJs from "@editorjs/editorjs";


const BlogEditor = () => { 

const handleBannerUpload = (e) => {

    let img = e.target.file[0];

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

    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight = "px";
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

let { blog, blog: { title, banner }, setBlog } = useContext(EditorContext);


// to point to id, starting empty data and runs once when the component
useEffect(() => {

    let editor = new EditorJS ({ 

        holder: "textEditor",
        data: '',
        placeholder: "Write a crazzy story ...."
    })
 
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

            <button>Publish</button>
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