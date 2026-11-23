import { useContext } from "react";
import axios from "axios";

import { BlogContext } from "../pages/blog.page";
import CommentField from "./comment-field";
import CommentCard from "./comment-card";
import NoDataMessage from "./nodata";


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

    let { blog, blog: { _id, title, comments: { results: commentsArr }, activity: { total_parent_comments } }, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded, setBlog } = useContext(BlogContext);

    // 5 comment fetch
    const loadMoreComments = async () => {

        let newCommentsArr = await fetchComments({ 

            skip: totalParentCommentsLoaded,
            blog_id: _id,
            setParentCommentCountFun: setTotalParentCommentsLoaded,
            comment_array: commentsArr
        });

        setBlog ({ ...blog, comments: newCommentsArr });
    }

    return (

        commentsWrapper ? 
        <div className="fixed top-0 right-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden">

            {/* label, blog title, close button */}
            <div className="relative">

                <h1 className="text-xl font-medium">Comments</h1>
                <p className="text-lg mt-2 w-[70%] line-clamp-1">{ title }</p>

                <button onClick={() => 

                    setCommentsWrapper(preVal => !preVal )} className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full " >

                    <i className="fi fi-br-cross"></i>

                </button>

            </div>

            <hr className="my-8 w-[120%] -ml-10" />

            {/* new comment */}
            <CommentField action="comment" />

            {/* comment or empty */}
            {
                commentsArr && commentsArr.length ? commentsArr.map ((comment, i) => {

                    return <CommentCard key={i} index={i} leftVal={comment.childrenLevel * 4} commentData={comment} />
            })

            : <NoDataMessage message="no comments" />
        }

        {/* more comments on DB than shown */}
        {
            total_parent_comments > totalParentCommentsLoaded

            ? <Button onClick={loadMoreComments} className="p-2 px-3 rounded-md flex items-center gap-2">load more..</Button>
            
            : ""
        }
        
        </div>

        : ""
    )
}

export default CommentsContainer

