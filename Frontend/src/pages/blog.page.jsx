import { useEffect, useState, createContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";

import { getDay } from "../common/date";
import Loader from "../components/loader.component";
import BlogContent from "../components/blog-content.component";
import BlogInteraction from "../components/blog-interaction";

import BlogPostCard from "../components/blog-post.component";
import CommentsContainer from "../components/comments";

export const BlogContext = createContext({ });

// fetch and header for blog page
const BlogPage = () => { 

    let { blog_id } = useParams();

    const [ blog, setBlog ] = useState(null);
    const [ notFound, setNotFound ] = useState(false);
    const [ similarBlogs, setSimilarBlogs ] = useState(null);
    const [ isLikedByUser, setLikedByUser ] = useState(false);

    const [ commentsWrapper, setCommentsWrapper ] = useState(false);
    const [ totalParentCommentsLoaded, setTotalParentCommentsLoaded ] = useState(0);

    const fetchBlog = () => {

        axios.post(import.meta.env.VITE_DOMAIN + "/get-blog/" + { blog_id } )
        .then ( ( { data: { blog } }) => {

            if (!blog) {

                return setNotFound(true);
            }

            // upto 6 limit with first tag
            axios.post(import.meta.env.VITE_DOMAIN + "/search-blogs",

                { tag: blog.tags[0], limit: 6, eliminate_blog: blog_id }
            )
            .then(( { data }) => {

                setSimilarBlogs
            })


            setBlog(blog);
        })
        .catch (err => {

            console.log(err);
            setNotFound(true);
        })
    }

    useEffect(() => {

        setBlog(null);
        setNotFound(false);
        setSimilarBlogs(null);
        setLikedByUser(false);

        setCommentsWrapper(false);
        setTotalParentCommentsLoaded(0);

        fetchBlog();
    }, [blog_id])


    return (

        notFound ? <h1 className="max-w-[900px] mx-auto py-10 px-[5vw] text-2xl">Blog not found</h1>
        :
        blog == null ? <Loader />
        :
        <BlogContext.Provider value={{ blog, setBlog, isLikedByUser, setLikedByUser, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded  }}>

            <Toaster />
            <CommentsContainer />

        <div className="max-w-[900px] mx-auto py-10 px-[5vw]">

            <img src={blog.banner} className="aspect-video w-full" />

            <div className="mt-12">

                <h1 className="text-4xl font-medium leading-tight">{ blog.title }</h1>

                <div className="flex gap-4 items-center my-8">

                    <img src={blog.author.personal_info.profile_img} className="w-12 h-12 rounded-full" />

                    <p className="capitalize">
                        { blog.author.personal_info.fullname }
                        <br />
                        @{ blog.author.personal_info.username }
                    </p>

                    <p className="text-dark-grey ml-auto"> Published on { getDay(blog.publishedAt) }</p>

                </div>

            </div>

            {/* like, comment, share, edit bar */}
            <BlogInteraction />

            <div className="my-12 font-gelasio blog-page-content">
                {
                    (blog.content?.[0]?.blocks ?? []).map((block, i) => {

                        return <div key={i} className="my-4 md:my-8">
                            <BlogContent block={block} />
                            </div>
                    })
                }
            </div>

            <BlogInteraction />

            {
                similarBlogs != null & similarBlogs.length ? 

                <>
                    <h2>Similar Blogs:</h2>

                    {
                        similarBlogs.map((similarBlog, i) => {

                            return <BlogPostCard key={i} content={similarBlog} author={similarBlog.author.personal_info} />

                            })
                    }
                </>

                : ""
            }

        </div>

        </BlogContext.Provider>
    )
}



export default BlogPage