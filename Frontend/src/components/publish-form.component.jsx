import { useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import defaultBanner from "../imgs/blog banner.png";



const PublishForm = () => {

    let { blog, blog: { banner, title, tags, des }, setBlog, setEditorState } = useContext(EditorContext);

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

    // char limit (200)
    const PublishForm = () => {

        let characterLimit = 200;
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

                <h1>{ title }</h1>

                <p>{ des }</p>

            </div>

        </section>
        
        </>
    )
}

export default PublishForm