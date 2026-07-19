const UserAuthForm = ({ type }) => {

    return ( 
        
        <section className="h-cover flex itemms-center justify-center">

            <form className="w-[80%] max-w-[400px]">

                <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                    {type == "sign-in" ? "Welcome back" : "Join us today" }
                </h1>
                
            </form>

        </section>

    )
}



export default UserAuthForm