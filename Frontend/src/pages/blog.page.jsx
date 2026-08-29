import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { getDay } from "../common/date";
import Loader from "../components/loader.component";
import BlogContent from "../components/blog-content.component";


// fetch and header for blog page
const BlogPage = () => { 

    let { blog_id } = useParams();

    const [ blog, setBlog ] = useState(null);

    const fetchBlog = () => {

        axios.get(import.meta.env.VITE_DOMAIN + "/get-blog/" + blog_id)
        .then ( ( { data: { blog } }) => {

            setBlog(blog);
        })
        .catch (err => {

            console.log(err);
        })
    }

    useEffect(() => {

        fetchBlog();
    }, [])


    return (

        blog == null ? <Loader />
        :
        <div className="max-w-[-900px] mx-auto py-10 px-[5vw]">

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

            <div className="my-12 font-gelasio blog-page-content">
                {
                    blog.content[0].blocks.map((block, i) => {

                        return <div key={i} className="my-4 md:my-8">
                            <BlogContent block={block} />
                            </div>
                    })
                }
            </div>

        </div>
    )
}



export default BlogPage