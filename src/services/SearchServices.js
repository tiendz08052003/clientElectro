import * as httpRequest from '~/utils/httpRequest';

export const search = async (q, type = "less") => {
    try {
        const res = await httpRequest.get("product/search", { 
            params: {
                q,
                type
            },
        })
        return res;
    }
    catch(err) {
        console.log(err)
    }
}