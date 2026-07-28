import axios from "axios";


export const uploadImage = async (img) => {

    let imageUrl = null;

    let formData = new FormData();
    formData.append("image", img);

    await axios.post(

        "https://api.imgbb.com/1/upload?key=" + import.meta.env.VITE_IMGBB_KEY,
        formData
    )

    .then( ({ data }) => {

        imageUrl = data.data.url;
    })

    .catch(err => {

        console.log(err);
    })

    return imageUrl;
    
}