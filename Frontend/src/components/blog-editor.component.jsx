import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import defaultBanner from "../imgs/blog banner.png"

import { Toaster, toast } from "react-hot-toast";
import { uploadImage } from "../common/upload";


const BlogEditor = () => { 

const handleBannerUpload = (e) => {

    let img = e.target.file[0];

    if(img) {

        let loadingToast = toast.loading("uploading....");

        uploadImage(img).then((url) => {

            if (url) {

                toast.dismiss(loadingToast);
                toast.success("uploaded !!!");
            }

        })
        .catch (err => {

            toast.dismiss(loadingToast);
            return toast.error(err);
        })
    }

}

return (

    <>

    <Toaster />
    
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
                    hidden
                    onChange={handleBannerUpload} />

                    
                </label>

            </div>
        </div>

    </section>

    </>
)
}

export default BlogEditor