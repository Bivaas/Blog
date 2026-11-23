import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

import { UserContext } from "../App";
import { BlogContext } from "../pages/blog.page";


const CommentField = ({ action, index = undefined, replyingTo = undefined, setReplying }) => {

    const [ comment, setComment ] = useState("");

    // blog and author id
    let { blog, blog: { _id, author: { _id: blog_author},
        comments, comments: { results: commentsArr }, activity, activity: { total_comments, total_parent_comments }},
        setBlog, setTotalParentCommentsLoaded } = useContext(BlogContext);  


    let { userAuth: { access_token, username, fullname, profile_img }} = useContext(UserContext);

    // comment auth validation
    const handleComment = () => {

        if (!access_token) {

            return toast.error("login first !");
        }

        if (!comment.length) {

            return toast.error("write something ...");
        }

        axios.post(import.meta.env.VITE_DOMAIN + "/add-comment",

            { _id, blog_author, comment, replying_to: replyingTo },
            { headers: { 'Authorization': `Bearer ${access_token}` }}
        )

        .then (({ data }) => {

            setComment("");

            data.commented_by = {

                personal_info: { username, profile_img, fullname }
            };

            data.childrenLevel = 0;

            // new comment list
            let newCommentArr = [ data, ...commentsArr ];

            let parentCommentIncrementval = 1;

            // blogstate comment
            setBlog({ ...blog, 

                comments: { ...comments, results: newCommentArr },
                activity: { ...activity,
                    total_comments: total_comments + 1,
                    total_parent_comments: total_parent_comments + parentCommentIncrementval
                }
            })

            setTotalParentCommentsLoaded(

                preVal => preVal + parentCommentIncrementval
            );

        })

        .catch(err => console.log(err));
    }


    return (

        <>

        <textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)}
            placeholder="your comment">

        </textarea>

        <button onClick={handleComment}>{ action }</button>

        </>
    )
}


export default CommentField