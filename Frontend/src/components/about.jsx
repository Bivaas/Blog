import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";

// bio, social link n join date
const AboutUser = ({ bio, social_links, joinedAt }) => {

    return (

        <div className="md:w-[90%] md:mt-7">

            <p className="text-xl leading-7">
                { bio.length ? bio : "tell us about yourself"}
            </p>

            {/* social link */}
            <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center">
                {
                    Object.keys(social_links).map((key) => {

                        let link = social_links[key];

                        return link ?

                            <Link to={link} key={key} target="_blank">

                                <i className={"fi " + (key != "website" ? "fi-brands-" + key : "fi-rr-globe") + " text-2xl"}></i> 

                            </Link>

                            : "";
                    })
                }

            </div>

            {/* join date */}
            <p className="text-xl leading-7">Joined on { getFullDay(joinedAt) }</p>

        </div>
    )
}


export default AboutUser