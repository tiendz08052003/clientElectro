import * as httpRequest from '~/utils/httpRequest';

export const getColor = async () => {
    try {
        const res =  await httpRequest.get("color")
        return res;
    }
    catch(err) {
        console.log(err);
    }
}