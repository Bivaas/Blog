import { useContext } from "react";
import axios from "axios";

import { BlogContext } from "../pages/blog.page";
import CommentField from "./comment-field";


// comment page with count
export const fetchComments = async ({ skip = 0, blog_id, setParentCommentCountFun, comment_array = null }) => {

    let res;

    await axios.post(import.meta.env.VITE_DOMAIN + "/get-blog-comments", { blog_id, skip })

    .then(({ data}) => {

        data.map(comment => {

            comment.childrenLevel = 0;
        })

        setParentCommentCountFun(preVal => preVal + data.length );

        if (comment_array == null) {

            res = { results: data };
        }
        else {

            res = { results: [ ...comment_array, ...data ] };
        }

    })

    return res;
}

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

