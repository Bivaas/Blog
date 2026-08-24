import InPageNavigation from "../components/inpage-navigation.component";

const HomePage = () => {

    return (

        <section className="h-cover flex justify-center gap-10">

            {/* latest blogs */}
            <div className="w-full">

                <InPageNavigation routes={["home", "trending blogs"]}>

                </InPageNavigation>

            </div>

            {/* filters and trending ones */}
            <div>

            </div>


        </section>
    )
}


export default HomePage