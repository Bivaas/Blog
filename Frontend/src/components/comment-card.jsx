import { getDay } from "../common/date";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

import { UserContext } from "../App";
import CommentField from "./comment-field";
import { BlogContext } from "../pages/blog.page";


const CommentCard = ({ index, leftVal, commentData }) => {

    let { commented_by: { personal_info: 
        {profile_img, fullname, username: commented_by_username }}, commentedAt, comment, _id, children } = commentData;

    let { userAuth: { access_token, username }} = useContext(UserContext);

    let { blog, blog: { comments, comments: { results: commentsArr},
        activity, activity: { total_parent_comments },
        author: { personal_info: { username: blog_author }} },
        setBlog, setTotalParentCommentsLoaded } = useContext(BlogContext); 

    const [ isReplying, setReplying ] = useState(false);

    // get reply parent
    const getParentIndex = () => {

        let startingPoint = index - 1;

        try {

            while (commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel) {

                startingPoint--;
            }

        } catch {

            startingPoint = undefined;
        }

        return startingPoint;
    }

    // rm replycards below
    const removeCommentsCards = (startingPoint) => {

        if (commentsArr[startingPoint]) {

            while (commentsArr[startingPoint].childrenLevel > commentData.childrenLevel) {

                commentsArr.splice(startingPoint, 1);

                if (!commentsArr[startingPoint]) {

                    Break;
                }

            }
        }

        // del in end
        if (isDelete) {

            let parentIndex = getParentIndex();

            if (parentIndex != undefined) {

                commentsArr[parentIndex].children = commentsArr[parentIndex].children
                 .filter(child => child != _id )

                if (!commentsArr[parentIndex].children.length) {

                    commentsArr[parentIndex].isReplyLoaded = false;
                }
            }

            commentsArr.splice(index, 1);

        }

        if (commentData.childrenLevel == 0 && isDelete) {

            setTotalParentCommentsLoaded(preVal => preVal - 1);
        }

        setBlog ({ ...blog,
            
            comments: { ...comments, results: commentsArr },
            activity: { ...activity, 
                total_parent_comments: total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1 : 0 )
            }    
        });
    }

    // del on server
    const deleteComment = (e) => {

        e.target.setAttribute("disabled", true);

        axios.post(import.meta.env.VITE_DOMAIN + "/delete-comment",

            { _id },
            { headers: { 'Authorization': `Bearer ${access_token}`} }
        )

        .then(() => {

            e.target.removeAttribute("disabled");
            removeCommentsCard(index + 1, true);
        })

        .catch(err => {

            e.target.removeAttribute("disabled");
            toast.error("unable to delete :(");
        });
    }

    // comment reply fetch
    const loadReplies = ({ skip = 0 }) => {

        if (children.length) {

            hideReplies();

            axios.post(import.meta.env.VITE_DOMAIN + "/get-replies", { _id, skip})

            .then(({ data: {replies} }) => {

                commentData.isReplyLoaded = true;

                for (let i = 0; i < replies.length; i++) {

                    replies[i].childrenLevel = commentData.childrenLevel + 1;

                    commentsArr.splice(index + 1 + 1 + skip, 0, replies[i]);
                }

                setBlog({ ...blog, comments: { ...comments, results: commentsArr } });
            })

            .catch(err => console.log(err));
        }
    }

    const hideReplies = () => {

        commentData.isReplyLoaded = false;
        removeCommentsCards(index + 1);
    }

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
                    <p>{ fullname } @{ commented_by_username}</p>
                    <p>{ getDay(commentedAt) }</p>

                </div>

                <p>{ comment }</p>

                {/* reply btn and hide */}
                <div>

                    {
                        commentData.isReplyLoaded ?
                        <button onClick={hideReplies}>

                            <i className="fi fi-rr-comment-dots"></i>
                            Hide Reply
                        </button>

                        : 
                        // btn hide and N show
                        <button onClick={loadReplies}>

                            <i className="fi fi-rr-comment-data"></i>
                            { children.length } Reply
                        </button>
                    }

                    <button onClick={handleReplyClick}>Reply</button>

                    {
                        username == commented_by_username || username == blog_author
                            ? <button onClick={deleteComment}>

                                    <i className="fi fi-rr-trash pointer-events-none"></i> 
                                </button>
                            : ""
                    }

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