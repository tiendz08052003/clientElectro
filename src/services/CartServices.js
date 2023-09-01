import * as httpRequest from '~/utils/httpRequest';

export const getCart = async () => {
    try {
        const res =  await httpRequest.get("cart")
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

export const addCart = async (accessToken, data, axiosJWT) => {
    try {
        const res = await httpRequest.post("cart/create", data, {
            headers: {token: `Bearer ${accessToken}`}
        }, axiosJWT);
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

export const updateCart = async (accessToken, id, count, axiosJWT) => {
    try {
        const res = await httpRequest.patch(`/cart/update/${id}/${count}`, {}, {
            headers: {token: `Bearer ${accessToken}`}
        }, axiosJWT)
        return res;
    }
    catch(err) {
        console.log(err);
    }

}

export const deleteCart = async (accessToken, id, axiosJWT) => {
    try {
        const res = await httpRequest.deleteSingle("/cart/delete/" + id, {
            headers: {token: `Bearer ${accessToken}`}
        }, axiosJWT);
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

