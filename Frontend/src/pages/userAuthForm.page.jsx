import InputBox from "../components/input.component";

const UserAuthForm = ({ type }) => {

    return ( 
        
        <section className="h-cover flex itemms-center justify-center">

            <form className="w-[80%] max-w-[400px]">

                <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                    {type == "sign-in" ? "Welcome back" : "Join us today" }
                </h1>


                  { 
                   type != "sign-up" ? 
                        <InputBox 
                        name="fullname"
                        type="text"
                        placeholder="Your Full Name.."
                        icon="fr-rr-usr"
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


            </form>

        </section>

    )
}



export default UserAuthForm