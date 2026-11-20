import axios from "axios";

export const filterPaginationData = async ({ 

    create_new_err = false, state, data, page, countRoute, data_to_send = {} }) => {

        let obj;

        if (state != null && !create_new_arr ) {

            // new blogs added
            obj = {

                ...state,
                results: [ ...state.results, ...data ],
                page: page
            }
        }
        else {

            // blog and fetch
            await axios.post(import.meta.env.VITE_DOMAIN + countRoute, data_to_send)

            .then(({ data: { totalDocs } }) => {

                obj = { results: data, page: 1, totalDocs }
            
        })

        .catch(err => console.log(err));
    }

    return obj;
        
}
