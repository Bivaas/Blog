import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata";
import LoadMoreDataBtn from "../components/loadmore.component";
import { filterPaginationData } from "../common/filter-pg-data";
import UserCard from "../components/usercard";


const SearchPage = () => {

    let { query } = useParams();
    let [ blogs, setBlogs ] = useState(null);
    let [ users, setUsers ] = useState(null);

    const searchBlogs = ({ page = 1, create_new_arr = false }) => {

        axios.post(import.meta.env.VITE_DOMAIN + "/search-blogs", { query, page} )
        .then(async ({ data }) => {

            let formatedData = await filterPaginationData({ 

                state: blogs,
                date: data.blogs, page,
                countRoute: "/search-blogs-count",
                data_to_send: { query }, create_new_arr

            })

            setBlogs(formatedData);
        } )

        .catch(err => console.log(err));
    }

    const fetchUsers = () => {

        axios.post(import.meta.env.VITE_DOMAIN + "/search-users", { query })

        .then(({ data: { users } }) => {

            setUsers(users);
        })
    }

    // reset function for after search
    const resetState = () => {
        
        setBlogs(null);
        setUsers(null);
    }


    useEffect(() => {

        resetState();
        searchBlogs({ page: 1, create_new_arr: true });
        fetchUsers();
    }, [query])


    // render users
    const UserCardWrapper = () => {

        return (
            <>
            {
                users == null ? (
                    <Loader /> 
                ) : (

                    users.length ? users.map((user, i) => {

                        return <UserCard key={i} user={user} />
                
            })

            : <NoDataMessage message="no user found !" />
                )    
            }
            </>
        )
    }


    return (

        <section className="h-cover flex justify-center gap-10">

            <div className="w-full">

                <inPageNavigation routes={[ `result for: "${query}`, "matched"]} defaultHidden={["matched"]}>

                <>

                {
                    blogs == null ? (
                        <Loader/>
                     ) : (
                        blogs.results.length ? blogs.results.map((blog, i) => {

                            return <BlogPostCard key={i} content={blog} author={blog.author.personal_info} />

                        })

                : <NoDataMessage message="no blogs here :)"/>

            )
        }

        <LoadMoreDataBtn 
            state={blogs}
            fetchDataFun={searchBlogs} 
        />

                </>

                <UserCardWrapper/>

                </inPageNavigation>

            </div>

            {/* right column */}
            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 pl-8 pt-3 max-md:hidden">

                <h1 className="font-medium text-xl mb-8">

                    user related to search
                    <i className="fi fi-rr-user mt-1 ml-2"></i>
                </h1>

                <UserCardWrapper />

            </div>

        </section>


    )
}


export default SearchPage