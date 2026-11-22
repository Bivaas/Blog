import { getDay } from "../common/dates";


const CommentCard = ({ index, leftVal, commentData }) => {

    let { commented_by: { personal_info: 
        {profile_img, fullname, username }}, commentedAt, comment } = commentData;

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

                <div>

                </div>

            </div>

        </div>
    )
}


export default CommentCard