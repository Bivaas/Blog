import { useContext } from "react";
import { BlogContext } from  "../pages/blog.page";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
  
// like, comment, share, edit
const BlogInteraction = () => {

    let { blog: { title, blog_id, activity,
         activity: { total_likes, total_comments },
         author: { personal_info: { username: author_username } }},

        setBlog, isLikedByUser, setLikedByUser } = useContext(BlogContext);

        // logged in check
        let { userAuth: { username, access_token }} = useContext(UserContext);

        // like toggle
        const handleLike = () => {

            if (access_token) {

                setLikedByUser(preVal => !preVal);

                !isLikedByUser ? total_likes++ : total_likes--;

                setBlog({ ...blog, activity: { ...activity, total_likes } });
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
                    <button>

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