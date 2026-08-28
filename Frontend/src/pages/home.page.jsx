import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import { useEffect, useState } from "react";

import Loader from "../components/loader.component";

const HomePage = () => {

    const [ blogs, setBlogs ] = useState(null);

    const fetchLatestBlogs = () => {

        axios.geet(import.meta.env.VITE_DOMAIN + "/latest-blogs")
        .then (( { data }) => {

            console.log(data.blogs);
        }) 
        .catch (err => {

            console.log(err);
        })
    }


    useEffect(() => {

        fetchLatestBlogs();
    }, [])


    return (

        <section className="h-cover flex justify-center gap-10">

            {/* latest blogs */}
            <div className="w-full">

                <InPageNavigation routes={["home", "trending blogs"]} defaultHidden={["trending blogs"]}>


                    {/* Latest blogs */}
                    {
                        blogs == null ? (
                            <loader />
                        ) : (

                            blogs.map((blog, i) => {

                                return <h1 key={i}>{ blog.title }</h1>
                            })
                        )
                    }

                    <h1> Trending Blogs here</h1>

                </InPageNavigation>

            </div>

            {/* filters and trending ones */}
            <div>

            </div>


        </section>
    )
}


export default HomePage