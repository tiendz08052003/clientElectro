//Thư viện request
import * as httpRequest from '~/utils/httpRequest';

export const shop = async () => {
    try {
        const res = await httpRequest.get('product');
        return res;
    }
    catch (error) {
        console.log(error)
    }
}

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