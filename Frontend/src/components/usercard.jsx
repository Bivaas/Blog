import { Link } from "react-router-dom";


const UserCard = ({ user }) => {

    let { personal_info: { fullname, username, profile_img } } = user;

    return (

        <Link to={`/user/${username}`} className="flex gap-5 items-center mb-5">

            <img src={profile_img} className="flex gap-5 items-center mb-5">
            
            <div>

                <h1 className="font-medium text-xl line-clamp-2">{ fullname }</h1>

                <p>@{ username }</p>

            </div>
            
            </img>

        </Link>
    )
}


export default UserCard