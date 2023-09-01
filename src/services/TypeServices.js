import * as httpRequest from '../utils/httpRequest'

export const getType = async () => {
    try {
        const res = httpRequest.get("type")
        return res;
    }
    catch(err) {
        console.log(err);
    }
}