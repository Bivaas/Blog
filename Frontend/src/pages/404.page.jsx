import { Link } from "react-router-dom";
import pageNotFoundImage from "../imgs/404.png";
import fullLogo from "../imgs/logo.png";


const PageNotFound = () => {

    return (

        <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">

            <h1 className="text-6xl leading-7 mt-12">page not found !</h1>

            <img src={pageNotFoundImage} className="select-none border-2 border-grey w-72 aspect-square object-cover rounded" />

            <p className="text-xl leading-7 -mt-8">
                You are at the wrong place. 
                Go back to: {" "}

                <Link to="/" className="font-l underline">Homepage</Link>
            </p>

        </section>
    )
}

export default PageNotFound;

