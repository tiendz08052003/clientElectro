import * as httpRequest from "~/utils/httpRequest"

export const getWishlist = async () => {
    try {
        const res = await httpRequest.get("wishlist");
        return res;
    } catch(err) {
        console.log(err);
    }
}

export const addWishlist = async (data, accessToken, axiosJWT) => {
    try {
        const res = await httpRequest.post("wishlist/create/store", data, {
            headers: {token: `Bearer ${accessToken}`}
        }, axiosJWT);
        return res;
    } catch(err) {
        console.log(err);
    }
}

export const deleteWishlist = async (id, accessToken, axiosJWT) => {
    try {
        const res = await httpRequest.deleteSingle("wishlist/delete/" + id, {
            headers: {token: `Bearer ${accessToken}`}
        }, axiosJWT);
        return res;
    } catch(err) {
        console.log(err);
    }
}


