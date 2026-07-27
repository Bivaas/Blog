import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import defaultBanner from "../imgs/blog banner.png"

import { Toaster, toast } from "react-hot-toast";
import { uploadImage } from "../common/upload";

import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";


const BlogEditor = () => { 

const handleBannerUpload = (e) => {

    let img = e.target.file[0];

    if(img) {

        let loadingToast = toast.loading("uploading....");

        uploadImage(img).then((url) => {

            if (url) {

                toast.dismiss(loadingToast);
                toast.success("uploaded !!!");
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

let { blog, blog: { title }, setBlog } = useContext(EditorContext);

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

                    <img src={defaultBanner} />

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

        </div>

    </section>

    </>
)
}

export default BlogEditor