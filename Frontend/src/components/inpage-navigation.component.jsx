import { useState } from "react";


const InPageNavigation = () => {

    const [ inPageNavigation, setInPageNavIndex ] = useState(0);

    return (

        <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">

            {
                routes.map((route, i) => {

                    return (

                        <button 
                            key={i}
                            className={"p-4 px-5 capitalize" + (inPageNavIndex == i ? "text-black" : "text-dark-grey")}>

                                { route }
                            </button>
                    )
                })
            }

            <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300" />

        </div>

    )
}


export default InPageNavigation

