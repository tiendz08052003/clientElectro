import * as httpRequest from '../utils/httpRequest'

export const getDetailsCatalog = async () => {
    try {
        const res = await httpRequest.get("detailsCatalog")
        return res;
    }
    catch(err) {
        console.log(err);
    }
}