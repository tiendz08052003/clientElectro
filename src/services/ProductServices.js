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