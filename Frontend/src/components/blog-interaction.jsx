import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

import { BlogContext } from  "../pages/blog.page";
import { UserContext } from "../App";


// like, comment, share, edit
const BlogInteraction = () => {

    let { blog, blog: { _id, title, blog_id, activity,
         activity: { total_likes, total_comments },
         author: { personal_info: { username: author_username } }},

        setBlog, isLikedByUser, setLikedByUser, setCommentsWrapper } = useContext(BlogContext);

        // logged in check
        let { userAuth: { username, access_token }} = useContext(UserContext);

        // relike check
        useEffect(() => {

            if (access_token) {

                axios.post(import.meta.env.VITE_DOMAIN + "/isliked-by-user", 
                    
                { _id },
                { headers: { 'Authorization': `Bearer ${access_token}` }} )

                .then(( { data: { result } }) => {

                    setLikedByUser(Boolean(result));
                })

                .catch(err => console.log(err));

            }
        }, [])

        // like toggle
        const handleLike = () => {

            if (access_token) {

                setLikedByUser(preVal => !preVal);

                !isLikedByUser ? total_likes++ : total_likes--;

                setBlog({ ...blog, activity: { ...activity, total_likes } });

                // server like save
                axios.post(import.meta.env.VITE_DOMAIN + "/like-blog",

                    { _id, isLikedByUser },
                    { headers: { 'Authorization': `Bearer ${access_token}` }}
                )

                .catch (err => console.log(err) );
            }

            else {

                toast.error("login first !")
            }
        }

    return (


        <>
            <hr />

            <div>

                <div>

                <div>
                    {/* like n count */}
                    <button onClick={handleLike}>

                        <i className={"fi " + (isLikedByUser 
                            ? "fi-sr-heart"
                            : "fi-rr-heart"
                        )}></i>

                    </button>

                    <p>{ total_likes }</p>

                </div>

                <div>
                    {/* comment n count */}
                    <button onClick={() => setCommentsWrapper(preVal => !preVal)}>

                        <i className="fi fi-rr-comment-dots"></i>

                    </button>

                    <p>{ total_comments }</p>

                </div>

                </div>

                {/* edit link */}
                <div>

                    {
                        username == author_username ?
                            <Link to={`/editor/${blog_id}`}>
                                Edit
                            </Link>

                        : ""
                    }

                    

                </div>

            </div>

            <hr />
        
        </>
    ) 
}


export default BlogInteraction