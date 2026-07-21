import InputBox from "../components/input.component";
import { useRef } from "react";

import axios from "axios";

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;


const UserAuthForm = ({ type }) => {

    let authForm = useRef();

    const handleSubmit = (e) => {

        e.preventDefault();

        let form = new FormData(authForm.current);
        let formData = {};

        for(let [key, value] of form.entries()) {

            formData[key] = value;
        }

        let { fullname, email, password } = formData;

        //form validation
        if (fullname) {

            if(fullname.length < 3) {

                return console.log("name should be 3 letters minimum ");
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
    }


    return ( 
        
        <section className="h-cover flex items-center justify-center">

            <form ref={authForm} className="w-[80%] max-w-[400px]">

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

                    <button type="submit" onClick={handleSubmit}>

                        {type.replace("-", " ") }
                    </button>


            </form>

        </section>

    )
}



export default UserAuthForm