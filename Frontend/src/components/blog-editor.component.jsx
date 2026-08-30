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

    if (!title.length) {

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


let { blog, blog: { title, banner }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);



// to point to id, starting empty data and runs once when the component && skips creation if editor already exists
useEffect(() => {

    if(!textEditor.isReady) {

        setTextEditor(new EditorJS ({

            holder: "textEditor",
            data: { blocks: [] },
            tools: tools,
            placeholder: "write a crazy story..."
        }))
    }
}, [])


return (

    <>

    <Toaster />
    
    <nav className="navbar">

        <Link to="/" className="flex-none w-10">
            <img src={logo} />
        </Link>

        <p className="max-md:hidden text-black line-clamp-1 w-full">{ title.length ? title: "New Blog" }</p>

        <div className="flex gap-4 ml-auto">

            <button className="btn-dark py-2" onClick={handlePublishEvent}>Publish</button>
            <button className="btn-light py-2">Save Draft</button>
        </div>

    </nav>


    <section className="h-cover">
        

        <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">

                <label htmlFor="uploadBanner" className="block w-full h-full cursor-pointer">

                    <img src={banner} onError={handleError} className="z-20" />

                    <input 

                    id="uploadBanner"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    hidden
                    onChange={handleBannerUpload} />

                    
                </label>

            </div>

            <textarea defaultValue={title}
                      placeholder="Blog Title.."
                      className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                      onKeyDown={handleTitleKeyDown}
                      onChange={handleTitleChange} >

                      </textarea>

                      <hr className="w-full opacity-10 my-5" />
                      <div id="textEditor" className="font-gelasio"></div>

        </div>

    </section>

    </>
)
}

export default BlogEditor