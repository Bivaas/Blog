import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";

import { removeFromSession } from "../common/session";


const UserNavigationPanel = () => {

    const { userAuth: { username }, setUserAuth } = useContext(UserContext);

    const signOutUser = () => {

        removeFromSession("user");
        setUserAuth({ access_token: null });

    }

    return (

        <div> 

            <Link to={`/user/${username}`}>Profile</Link>
            <Link to="/dashboard/blogs">Dashboard</Link>
            <Link to="/settings/edit-profile">Settings</Link>

            <button onClick={signOutUser}>

                <h1>Sign Out</h1>
                <p>@{username}</p>
            </button>

        </div>
    )
}


export default UserNavigationPanel