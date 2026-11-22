import InPageNavigation, { activeTabRef } from "../components/inpage-navigation.component";
import axios from "axios";
import { useEffect, useState } from "react";

import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import NoDataMessage from "../components/nodata";
import { filterPaginationData } from "../common/filter-pg-data";

import LoadMoreDataBtn from "../components/loadmore.component";


const HomePage = () => {

    let categories = [ "programming", "hollywood", "film making", "social media", "cooking", "tech", "aviation", "finances", "travel" ];

    const [ blogs, setBlogs ] = useState(null);
    const [ trendingBlogs, setTrendingBlogs ] = useState(null);
    const [ pageState, setPageState ] = useState("home");

    const fetchLatestBlogs = ({ page = 1 }) => {

        axios.post(import.meta.env.VITE_DOMAIN + "/latest-blogs", { page })

        .then (async({ data }) => {

            let formatedData = await filterPaginationData ({ 

                state: blogs,
                data: data.blogs, page,
                countRoute: "/all-latest-blogs-count"
            })

            setBlogs(formatedData);
        })
    }

    // post req to search-blogs
    const fetchBlogsByCategory = ({ page = 1 }) => {

        axios.post(import.meta.env.VITE_DOMAIN + "/search-blogs", { tag: pageState, page } )

        .then(async ({ data}) => {
            
            let formatedData = await filterPaginationData({ 

                state: blogs,
                data: data.blogs, page,
                countRoute: "/search-blogs-count",
                data_to_send: { tag: pageState }
            })

            setBlogs(formatedData);
        })

        .catch(err => {

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

    // cat click
    const loadBlogByCategory = (e) => {

        let category = e.target.innerText.toLowerCase();

        setBlogs(null);

        if (pageState == category) {

            setPageState("home");
            return;
        }

        setPageState(category);
    }

    useEffect(() => {

        activeTabRef.current.click();

        if (pageState == "home") {

            fetchLatestBlogs({ page: 1 });
        }
        else {
            fetchBlogsByCategory( { page: 1 } );
        }

        if (!trendingBlogs) {

            fetchTrendingBlogs();
        }

    }, [pageState])


    return (

        <section className="h-cover flex justify-center gap-10">

            {/* latest blogs */}
            <div className="w-full">

                <InPageNavigation routes={[ pageState, "trending blogs" ]} defaultHidden={[ "trending blogs" ]}>

                    {/* Latest blogs */}
                    <>
                    {
                        blogs == null ? (
                            <Loader />
                        ) : (

                            blogs.results.length ? blogs.results.map((blog, i) => {

                                return <BlogPostCard key={i} content={blog} author={blog.author.personal_info} />
                                })
                            : <NoDataMessage message="no blogs found !" />
                        )
                    }

                    <LoadMoreDataBtn state={blogs} fetchDataFun={pageState == "home"
                        ? fetchLatestBlogs
                        : fetchBlogsByCategory
                    } />

                    </>

                    {/* trending blogs here */}
                    {
                        trendingBlogs == null ? (
                            <Loader />

                        ) : (
                            trendingBlogs.length ? trendingBlogs.map((blog, i) => {

                                return <MinimalBlogPost key={i} blog={blog} index={i} />
                            })
                        : <NoDataMessage message="No trending blogs" />
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
                                categories.map((category, i) => {

                                    return <button key={i} onClick={loadBlogByCategory} className={"tag " + (pageState == category 
                                        ? "bg-black text-white"
                                        : "")}>
                                    { category }</button>
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