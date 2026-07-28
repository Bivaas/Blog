import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

import { uploadImage } from "../common/upload";



// upload img with url checker gate
const uploadImageByURL = (e) => {

    let link = new Promise((resolve, reject) => {

        try {
            // if its alr valid url
            resolve(e);
        }

        catch(err) {

            reject(err);
        }
    })

    return link.then (url => {

        return {

            success: 1,
            file: { url }
        }
    })
}

// uses imgbb to host uploaded img with url
const uploadImageByFile = (e) => {

    return uploadImage(e).then(url => {

        if (url) {

            return {

                success: 1,
                file: { url }
            }
        }
    })
}


export const tools = {

    embed: Embed, 
    list: {

        class: List,
        inlineToolbar: true
    },

    image: {

        class: Image,
        config: {

            // for img link and manual file from system
            uploader: {

                uploadByUrl: uploadImageByURL, 
                uploadByFile: uploadImageByFile
            }
        }
    },

    header: {
        class: Header,
        config: {

            placeholder: "your heading...",
            levels: [2, 3],
            defaultLevel: 2
        }
    },

    quote: {

        class: Quote,
        inlineToolbar: true
    },
    marker: Marker,
    inlineCode: InlineCode
}