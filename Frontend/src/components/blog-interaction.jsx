import { useContext } from "react";
import { BlogContext } from  "../pages/blog.page";
 
// like, comment, share, edit
const BlogInteraction = () => {

    let { blog: { blog_id, activity,
         activity: { total_likes, total_comments },
         author: { personal_info: { username: author_username } }},

        setBlog } = useContext(BlogContext);

    return (


        <>
            <hr />

            <div>
                <div>
                    {/* like n count */}
                    <button>

                        <i className="fi fi-rr-heart"></i>
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

            <hr />
        
        </>
    ) 
}


export default BlogInteraction