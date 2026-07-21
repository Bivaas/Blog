import InputBox from "../components/input.component";

import axios from "axios";

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;


const UserAuthForm = ({ type }) => {


    // server cell function
    const userAuthThroughServer = (serverRoute, formData) => {

        axios.post(import.meta.env.VITE_DOMAIN + serverRoute, formData)
        .then(( { data }) => {

            console.log(data);
        })

        .catch(({ response }) => {

            console.log(response.data.error);
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

    
    let serverRoute = type == "sign-in" ? "/signin" : "/signup";

    userAuthThroughServer(serverRoute, formData);


    return ( 
        
        <section className="h-cover flex items-center justify-center">

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

                    <button type="submit" onClick={handleSubmit}>

                        {type.replace("-", " ") }
                    </button>


            </form>

        </section>

    )
}



export default UserAuthForm