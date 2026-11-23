import { getDay } from "../common/date";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";

import { UserContext } from "../App";
import CommentField from "./comment-field";


const CommentCard = ({ index, leftVal, commentData }) => {

    let { commented_by: { personal_info: 
        {profile_img, fullname, username }}, commentedAt, comment, _id } = commentData;

    let { userAuth: { access_token }} = useContext(UserContext);

    const [ isReplying, setReplying ] = useState(false);

    // reply box open/close
    const handleReplyClick = () => {

        if (!access_token) {

            return toast.error("login first !");
        }

        setReplying(preVal => !preVal);
    }


    return (

        // indent replies with name, time
        <div style={{ paddingLeft: `${leftVal * 10}px` }}>

            <div>

                <div>

                    <img src={profile_img} />
                    <p>{ fullname } @{ username}</p>
                    <p>{ getDay(commentedAt) }</p>

                </div>

                <p>{ comment }</p>

                {/* reply btn */}
                <div>

                    <button onClick={handleReplyClick}>Reply</button>

                </div>

            </div>

            {/* reply box */}
            {
                isReplying ?
                <div>
                    <CommentField action="reply" index={index} replyingTo={_id} setReplying={setReplying} />
                </div>

                : ""
            }

        </div>
    )
}


export default CommentCard