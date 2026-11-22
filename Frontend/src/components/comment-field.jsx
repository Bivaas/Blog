import { useState } from "react";


const CommentField = ({ action }) => {

    const [ comment, setComment ] = useState("");

    return (

        <>

        <textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)}
            placeholder="your comment">

        </textarea>

        <button>{ action }</button>

        </>
    )
}


export default CommentField