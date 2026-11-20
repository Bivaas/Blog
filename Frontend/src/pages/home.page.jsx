import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import { useEffect, useState } from "react";

import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";


const HomePage = () => {

    let categories = [ "programming", "hollywood", "film making", "social media", "cooking", "tech", "aviation", "finances", "travel" ];

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

            {/* filters and trending  */}
            <div className = "min-w-[40%] lg:min-w-[400px] max-w-min border-1 pl-8 pt-3 max-md:hidden">

                <div className="flex flex-col gap-10">

                    {/* category */}
                    <div>
                        <h1 className="font-medium text-xl mb-8">Interests</h1>

                        <div className="flex gap-3 flex-wrap">

                            {
                                categoties.map((category, i) => {

                                    return 
                                    <button key={i} className="tag">{ category }</button>
                                })
                            }
                        </div>

                    </div>

                        {/* trending */}
                        <div>
                            <h1 className="font-medium text-xl mb-8">Trending
                                <i className="fi fi-rr-arrow-trend-up ml-2"></i>
                            </h1>

                            {
                                trendingBlogs == null ? (
                                    <Loader/>

                                ) : (
                                    trendingBlogs.map((blog, i) => {

                                        return <MinimalBlogPost key={i} blog={blog} index={i} />
                                    })
                                )
                            }

                        </div>

                </div>

            </div>


        </section>
    )
}


export default HomePage