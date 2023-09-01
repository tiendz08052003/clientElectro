import * as httpRequest from '~/utils/httpRequest';

export const getBrand = async () => {
    try {
        const res =  await httpRequest.get("brand")
        return res;
    }
    catch(err) {
        console.log(err);
    }
}