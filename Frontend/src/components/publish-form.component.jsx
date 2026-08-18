import { useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import defaultBanner from "../imgs/blog banner.png";

import Tag from "./tags.component";


const PublishForm = () => {

    let { blog, blog: { banner, title, tags, des }, setBlog, setEditorState } = useContext(EditorContext);

    let characterLimit = 200;
    let tagLimit = 10;


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

                    <button>Publish</button>

                </div>

            </div>

        </section>
        
        </>
    )
}

export default PublishForm