import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";


const Tag = ({ tag, tagIndex }) => {

let { blog, blog: { tags }, setBlog } = useContext(EditorContext);


const handleTagDelete = () => {

    tags = tags.filter(t => t != tag);  // array returns all tags which are kept except this one
    setBlog({ ...blog, tags });

}


const addEditable = (e) => {

    e.target.setAttribute("contentEditable", true);
    e.target.focus();
}

const handleTagEdit = (e) => {

    if (e.keyCode == 13 || e.keyCode == 188) {

        e.preventDefault();

        let currentTag = e.target.innerText;
        tags[tagIndex] = currentTag;

        setBlog ({ ...blog, tags });

        e.target.setAttribute("contentEditable", false);

    }
}

    return ( 

        <div>
            
            <p contentEditable="true" onKeyDown={handleTagEdit} onClick={addEditable}>{ tag }</p>

            <button onClick={handleTagDelete}>
                <i className="fi fi-br-cross"></i>
            </button>

        </div>
    )
}


export default Tag