import { useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import defaultBanner from "../imgs/blog banner.png";

import Tag from "./tags.component";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";


const PublishForm = () => {

    let characterLimit = 200;
    let tagLimit = 10;

    let { blog, blog: { banner, title, tags, des, content }, setBlog, setEditorState } = useContext(EditorContext);
    
    let { userAuth: { access_token } } = useContext(UserContext);

    let navigate = useNavigate();


    const handleCloseEvent = () => {

        // back to writing view 
        setEditorState("editor");
    }

    // new title change
    const handleBlogTitleChange = (e) => {

        let input = e.target;
        setBlog({ ...blog, title: input.value });
    }

    // disabled enter like in editor
    const handleTitleKeyDown = (e) => {

        // (enter code) 
        if (e.keyCode == 13) { 

            e.preventDefault();
        }
    }

    // new description update
    const handleBlogDesChange = (e) => {

        let input = e.target;
        setBlog({ ...blog, des: input.value });
    }


    //tag input handler and validation to not let key to input
    const handleKeyDown = (e) => {

        if(e.keyCode == 13 || e.keyCode == 188){

            e.preventDefault();

            let tag = e.target.value 

            if(tags.length < tagLimit) {

                if(!tags.includes(tag) && tag.length) {

                    setBlog({ ...blog, tags: [ ...tags, tag ] });
                }

            } else {

                toast.error(`You can add only max ${tagLimit} tags`);
            }

            e.target.value = "";
        }
    }


    // publish frontend side with re-validation and toasts setup
    const publishBlog = (e) => {

        if (e.target.className.includes("disable")) {

            return;
        }

        if (!title.length) {

            return toast.error("Write blog title before publishing !!");
        }

        if (!des.length || des.length > characterLimit) {

            return toast.error(`Write des under ${characterLimit} characters`);
        }

        if (!tags.length) { 

            return toast.error("Add at least 1 tag (and maximum 10) to rank your blog");
        }

        let loadingToast = toast.loading("Publishing....");

        e.target.classList.add("disable");

        let blogObj = {

            title, banner, des, content, tags
        }

        // jwt verification and req to server
        axios.post (import.meta.env.VITE_DOMAIN + "/create-blog", blogObj, {

            headers: {

                'Authorization': `Bearer ${access_token}`
            }
        })

        .then(() => {

            e.target.classList.remove("disable");

            toast.dismiss(loadingToast);
            toast.success("Published :)");

            setTimeout(() => { 

                navigate("/");
            }, 500);

        })

        .catch((err) => {

            e.target.classList.remove("disable");

            toast.dismiss(loadingToast);

            let msg = err.response ? err.response.data.error : "Server unreachable, is the backend running ?";
            return toast.error(msg);

        })
    }

    

    return ( 

        <>
        
        <Toaster />

        <section className="w-screen min-h-screen grid items-center lg:grid-cols py-16 lg:gap-4">


            <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]" onClick={handleCloseEvent}>
                <i className="fi fi-br-cross"></i>
            </button>

            {/* blog preview section */}

            <div className="max-w-[550px] center">

                <p className="text-dark-grey mb-1">preview</p>

                <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4"> 
                    <img src={banner} />
                </div>


                <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{ title }</h1>

                <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{ des }</p>


                </div>

                {/* form section */}

                <div className="border-grey lg:border-1 lg:pl-8">

                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>

                    <input type="text" placeholder="Title.." defaultValue={title} className="input-box pl-4" onChange={handleBlogTitleChange} />


                    <p className="text-dark-grey mb-2 mt-9">write a short description about your blog</p>

                    <textarea maxLength={characterLimit} defaultValue={des} placeholder="Short description about your blog" className="h-40 resize-none leading-7 imput-box pl-4" onChange={handleBlogDesChange} onKeyDown={handleTitleKeyDown}>
                    </textarea>

                    <p className="mt-1 tet-dark-grey text-sm text-right">{ characterLimit - des.length } characters left</p>

                    <p className="text-dark-grey mb-2 mt-9">Topics (for searching and ranking)</p>

                    {/* tag input field setup */}
                    <div className="relative input-box pl-2 py-2 pb-4">

                        <input type="text" placeholder="Topics" 
                        className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white" onKeyDown={handleKeyDown} />

                        {
                            tags.map((tag, i) => {

                                return <Tag tag={tag} tagIndex={i} key={i} />
                            })
                        }

                    </div>

                    <p className="mt-1 mb-4 text-dark-grey text-right">{ tagLimit - tags.length } Tags Left</p>

                    <button className="btn-dark px-8" onClick={publishBlog}>Publish</button>

                </div>

        </section>
        
        </>
    )
}

export default PublishForm