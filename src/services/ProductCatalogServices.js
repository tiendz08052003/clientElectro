import * as httpRequest from '~/utils/httpRequest'

export const getProductCatalog= async () => {
    try {
        const res = await httpRequest.get("productCatalog");
        return res;
    }
    catch(err) {
        console.log(err);
    }
}