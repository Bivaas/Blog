import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";


const Tag = ({ tag, tagIndex }) => {

let { blog, blog: { tags }, setBlog } = useContext(EditorContext);


const handleTagDelete = () => {

    tags = tags.filter(t => t != tag);  // array returns all tags which are kept except this one
    setBlog({ ...blog, tags });

}

    return ( 

        <div>
            <p>{ tag }</p>

            <button onClick={handleTagDelete}>
                <i className="fi fi-br-cross"></i>
            </button>
            
        </div>
    )
}


export default Tag