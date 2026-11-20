import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import { useEffect, useState } from "react";

import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";

const HomePage = () => {

    const [ blogs, setBlogs ] = useState(null);
    const [ trendingBlogs, setTrendingBlogs ] = useState(null);

    const fetchLatestBlogs = () => {

        axios.get(import.meta.env.VITE_DOMAIN + "/latest-blogs")
        .then (( { data }) => {

            setBlogs(data.blogs);
        }) 
        .catch (err => {

            console.log(err);
        })
    }

    // fetch function
    const fetchTrendingBlogs = () => {

        axios.get(import.meta.env.VITE_DOMAIN + "/trending-blogs")

        .then(({ data }) => {

            setTrendingBlogs(data.blogs);
        })

        .catch(err => {

            console.log(err);
        })
    }


    useEffect(() => {

        fetchLatestBlogs();
        fetchTrendingBlogs();
    }, [])


    return (

        <section className="h-cover flex justify-center gap-10">

            {/* latest blogs */}
            <div className="w-full">

                <InPageNavigation routes={["home", "trending blogs"]} defaultHidden={["trending blogs"]}>


                    {/* Latest blogs */}
                    {
                        blogs == null ? (
                            <Loader />
                        ) : (

                            blogs.map((blog, i) => {

                               return <BlogPostCard key={i} content={blog} author={blog.author.personal_info} />
                            })
                        )
                    }

                    {/* trending blogs here */}
                    {
                        trendingBlogs == null ? (
                            <Loader />

                        ) : (
                            trendingBlogs.map((blog, i) => {

                                return <MinimalBlogPost key={i} blog={blog} index={i} />
                            })
                        )
                    }

                </InPageNavigation>

            </div>

            {/* filters and trending ones */}
            <div>

            </div>


        </section>
    )
}


export default HomePage