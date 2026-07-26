import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import defaultBanner from "../imgs/blog banner.png"


const BlogEditor = () => { 

return (

    <>
    
    <nav>

        <Link to="/">
            <img src={logo} />
        </Link>

        <p>New Blog</p>

        <div>

            <button>Publish</button>
            <button>Save Draft</button>
        </div>

    </nav>


    <section>

        <div>
            <div>

                <label htmlFor="uploadBanner">

                    <img src={defaultBanner} />

                    <input 

                    id="uploadBanner"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    hidden />

                    
                </label>

            </div>
        </div>

    </section>

    </>
)
}

export default BlogEditor