import * as httpRequest from '~/utils/httpRequest'

export const getMenu = async () => {
    try {
        const res = await httpRequest.get("menu");
        return res;
    }
    catch(err) {
        console.log(err);
    }
}