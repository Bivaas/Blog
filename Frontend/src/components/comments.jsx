import { useContext } from "react";

import { BlogContext } from "../pages/blog.page";
import CommentField from "./comment-field";


// sidepanel
const CommentsContainer = () => {

    let { blog: { title }, commentsWrapper, setCommentsWrapper } = useContext(BlogContext);

    return (

        commentsWrapper ? 
        <div>

            {/* label, blog title, close button */}
            <div>

                <h1>Comments</h1>
                <p>{ title }</p>

                <button onClick={() => 

                    setCommentsWrapper(preVal => !preVal )}>
                    <i className="fi fi-br-cross"></i>

                </button>

            </div>

            <hr />

            {/* new comment */}
            <CommentField action="comment" />

        </div>

        : ""
    )
}

export default CommentsContainer

