import InputBox from "../components/input.component";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { storeInSession } from "../common/session";

import { useContext } from "react";
import { UserContext } from "../App";
import { Navigate, Link } from "react-router-dom";

import { authWithGoogle } from "../common/firebase";
import googleIcon from "../imgs/google.png";

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;


const UserAuthForm = ({ type }) => {

    let { userAuth: { access_token }, setUserAuth } = useContext(UserContext);

    // server cell function
    const userAuthThroughServer = (serverRoute, formData) => {

        axios.post(import.meta.env.VITE_DOMAIN + serverRoute, formData)
        .then(( { data }) => {

            storeInSession("user", JSON.stringify(data));
            setUserAuth(data);
        })

        .catch(({ response }) => {

            toast.error(response.data.error);
        })
    }


    // google login setup
    const handleGoogleAuth = (e) => {

        e.preventDefault();

        authWithGoogle().then(user => {

            let serverRoute = "/google-auth";
            let formData = { access_token: user.accessToken };

            userAuthThroughServer(serverRoute, formData);
            
        })

        .catch(err => {

            toast.error("could not sign in with google !");
            return console.log(err);
        })
    }


    const handleSubmit = (e) => {

        e.preventDefault();

        let form = new FormData(formElement);
        let formData = {};

        for(let [key, value] of form.entries()) {

            formData[key] = value;
        }

        let { fullname, email, password } = formData;

        //form validation
        if (fullname) {

            if(fullname.length < 3) {

                return toast.error("name should be 3 letters minimum ");
            }

        }

        if(!email.length) {

            return console.log("enter email");
        }

        if (!emailRegex.test(email)) {

            return console.log("invalid email ");
        }

        if (!passwordRegex.test(password)) {

            return console.log("invalid password format..use 6-20 chars, lowercase, uppercase and numbers");
        }

        userAuthThroughServer(serverRoute, formData);

    }

    
    let serverRoute = type == "sign-in" ? "/signin" : "/signup";


    return ( 

        access_token ? 
        <Navigate to="/" /> :
        
        <section className="h-cover flex items-center justify-center">
            <Toaster />
            <form id="formElement" className="w-[80%] max-w-[400px]">

                <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                    {type == "sign-in" ? "Welcome back" : "Join us today" }
                </h1>


                  { 
                   type != "sign-in" ? 
                        <InputBox 
                        name="fullname"
                        type="text"
                        placeholder="Your Full Name.."
                        icon="fi-rr-usr"
                        />
                        : ""
                  }

                    <InputBox
                        name="email"
                        type="email"
                        placeholder="Your email.."
                        icon="fi-rr-envelope"
                    />

                    <InputBox
                    name="password"
                    type="password"
                    placeholder="Your top secret password"
                    icon="fi-rr-key"
                    />


                    <button className="btn-dark center mt-14" type="submit" onClick={handleSubmit}>

                        {type.replace("-", " ") }
                    </button>


                    <div className="relative w-full flex items-center gap-2 my-10 uppercase text-black font-bold">

                        <hr className="w-1/2 border-black" />
                        <p>or</p>
                        <hr className="1-1/2 border-black" />
                    </div>


                    <button className="btn-dark flex items-center justify gap-4 w-[90%] center" type="button" onClick={handleGoogleAuth}>

                    <img src={googleIcon} className="w-5" />
                        Login with Google..
                    </button>


            </form>


            {/* opposite form link depending on the current page */}
            {
                type =="sign-in" ?

                <p className="mt-6 text-dark-grey text-xl text-center">
                    No account ? 
                    <Link to="/signup" className="text-black text-xl ml-1">Sign up</Link>
                </p>

                :

                <p className="mt-6 text-dark-grey text-xl text-center">
                    Got an account ? 
                    <Link to="/signin" className="text-black text-xl ml-1">Sign in</Link>
                </p>
            }


        </section>

    )
}



export default UserAuthForm