import InPageNavigation from "../components/inpage-navigation.component";

const HomePage = () => {

    return (

        <section className="h-cover flex justify-center gap-10">

            {/* latest blogs */}
            <div className="w-full">

                <InPageNavigation routes={["home", "trending blogs"]} defaultHidden={["trending blogs"]}>

                    <h1> Latest Blogs here</h1>

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