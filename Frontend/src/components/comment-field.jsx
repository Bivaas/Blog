import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

import { UserContext } from "../App";
import { BlogContext } from "../pages.blog.page";


const CommentField = ({ action }) => {

    const [ comment, setComment ] = useState("");

    // blog and author id
    let { blog: { _id, author: { _id: blog_author } }} = useContext(BlogContext);

    let { userAuth: { access_token }} = useContext(UserContext);

    // comment auth validation
    const handleComment = () => {

        if (!access_token) {

            return toast.error("login first !");
        }

        if (!comment.length) {

            return toast.error("write something ...");
        }

        axios.post(import.meta.env.VITE_DOMAIN + "/add-component",

            { _id, blog_author, comment },
            { headers: { 'Authorization': `Bearer ${access_token}` }}
        )

        .then (({ data }) => {

            console.log(data);
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