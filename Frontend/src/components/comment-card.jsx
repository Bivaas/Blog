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
    const removeCommentsCards = (startingPoint, isDelete = false) => {

        if (commentsArr[startingPoint]) {

            while (commentsArr[startingPoint].childrenLevel > commentData.childrenLevel) {

                commentsArr.splice(startingPoint, 1);

                if (!commentsArr[startingPoint]) {

                    break;
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
            removeCommentsCards(index + 1, true);
        })

        .catch(err => {

            e.target.removeAttribute("disabled");
            toast.error("unable to delete :(");
        });
    }

    // comment reply fetch
    const loadReplies = ({ skip = 0, currentIndex = index }) => {

        if (commentsArr[currentIndex].children.length) {

            hideReplies();

            axios.post(import.meta.env.VITE_DOMAIN + "/get-replies", { _id: commentsArr[currentIndex]._id, skip})

            .then(({ data: {replies} }) => {

                commentsArr[currentIndex].isReplyLoaded = true;

                for (let i = 0; i < replies.length; i++) {

                    replies[i].childrenLevel = commentsArr[currentIndex].childrenLevel + 1;

                    commentsArr.splice(currentIndex + 1 + i + skip, 0, replies[i]);
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

    // load more replies btn
    const LoadMoreRepliesButton = () => {

        let parentIndex = getParentIndex();

        let button = <button onClick={ () => loadReplies({ 

            skip: index - parentIndex, currentIndex: parentIndex 
        })} className="p-2 px-3 rounded-md flex items-center gap-2">

            load more replies
        </button>
    

    if (commentsArr[index + 1]) {

        if (commentsArr[index + 1].childrenLevel < commentsArr[index].childrenLevel) {

            if ( (index - parentIndex) < commentsArr[parentIndex].children.length) {

                return button;
            }
        }
    } 

    else {

        if (parentIndex != undefined) {

            if ( (index - parentIndex) < commentsArr[parentIndex].children.length) {

                return button;
            }
        }
    }
    }


    return (

        // indent replies with name, time
        <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>

            <div className="my-5 p-6 rounded-md border">

                <div className="flex gap-3 items-center mb-8">

                    <img src={profile_img} className="w-6 h-6 rounded-full "/>
                    <p className="line-clamp-1">{ fullname } @{ commented_by_username}</p>
                    <p className="min-w-fit">{ getDay(commentedAt) }</p>

                </div>

                <p className="text-xl ml-3">{ comment }</p>

                {/* reply btn and hide */}
                <div className="flex gap-5 items-center mt-5">

                    {
                        commentData.isReplyLoaded ?
                        <button className="p-2 px-3 rounded-md flex items-center gap-2" onClick={hideReplies}>

                            <i className="fi fi-rr-comment-dots"></i>
                            Hide Reply
                        </button>

                        : 
                        // btn hide and N show
                        <button className="p-2 px-3 rounded-md flex items-center gap-2" onClick={loadReplies}>

                            <i className="fi fi-rr-comment-dots"></i>
                            { children.length } Reply
                        </button>
                    }

                    <button className="underline" onClick={handleReplyClick}>Reply</button>

                    {
                        username == commented_by_username || username == blog_author
                            ? <button className="p-2 px-3 rounded-md border  ml-auto hover:text-red-800 flex items-center" onClick={deleteComment}>

                                    <i className="fi fi-rr-trash pointer-events-none"></i> 
                                </button>
                            : ""
                    }

                </div>

            </div>

            {/* reply box */}
            {
                isReplying ?
                <div className="mt-8">
                    <CommentField action="reply" index={index} replyingTo={_id} setReplying={setReplying} />
                </div>

                : ""
            }

            <LoadMoreRepliesButton />

        </div>
    )
}


export default CommentCard