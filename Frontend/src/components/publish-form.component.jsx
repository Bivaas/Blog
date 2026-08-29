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

        .catch(( { response } ) => {

            e.target.classList.remove("disable");

            toast.dismiss(loadingToast);
            return toast.error(response.data.error);

        })
    }

    

    return ( 

        <>
        
        <Toaster />

        <section>


            <button onClick={handleCloseEvent}>
                <i className="fi fi-br-cross"></i>
            </button>

            <div>

                <p>preview</p>

                <div> 
                    <img src={banner} />
                </div>


                <div>

                    <p>Blog Title</p>

                    <input type="text" placeholder="Title.." defaultValue={title} onChange={handleBlogTitleChange} />


                    <p>write a short description about your blog</p>

                    <textarea maxLength={characterLimit} defaultValue={des} placeholder="Short description about your blog" onChange={handleBlogDesChange} onKeyDown={handleTitleKeyDown}>
                    </textarea>

                    <p>{ characterLimit - des.length } characters left</p>

                    {/* tag input field setup */}
                    <div>

                        <input type="text" placeholder="Topics" onKeyDown={handleKeyDown} />

                        {
                            tags.map((tag, i) => {

                                return <Tag tag={tag} tagIndex={i} key={i} />
                            })
                        }

                    </div>

                    <p>{ tagLimit - tags.length } Tags Left</p>

                    <button onClick={publishBlog}>Publish</button>

                </div>

            </div>

        </section>
        
        </>
    )
}

export default PublishForm