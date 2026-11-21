import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";

// bio, social link n join date
const AboutUser = ({ bio, social_links, }) => {

    return (

        <div>

            <p>
                { bio.length ? bio : "tell us about yourself"}
            </p>

            {/* social link */}
            <div>
                {
                    Object.keys(social_links).map((key) => {

                        let link = social_links[key];

                        return link ?

                            <Link to={link} key={key} target="_blank">

                                <i className={"fi " + (key != "website" ? "fi-brands-" + key : "fi-rr-blobe")}></i> 

                            </Link>

                            : "";
                    })
                }

            </div>

            {/* join date */}
            <p>Joined on { getFullDay(joinedAt) }</p>

        </div>
    )
}


export default AboutUser