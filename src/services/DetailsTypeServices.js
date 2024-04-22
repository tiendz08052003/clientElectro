import * as httpRequest from '../utils/httpRequest'

export const getDetailsType = async () => {
    try {
        const res = await httpRequest.get("detailsType")
        return res;
    }
    catch(err) {
        console.log(err);
    }
}