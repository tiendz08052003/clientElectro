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

export const addManyMultipleCart = async (accessToken, data) => {
    try {
        const res = await httpRequest.post("cart/createMultiple", data, {
            headers: {token: `Bearer ${accessToken}`}
        });
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

export const updateCart = async (accessToken, id, count, axiosJWT = undefined) => {
    console.log(accessToken, id, count, axiosJWT)
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

export const addCartNoLogin = async (id, body) => {
    try {
        const res = await httpRequest.post("/cart/createCartRedis", {
            key: id,
            payload: body
        });
        return res;
    }
    catch(err) {
        console.log(err);
    }
}


export const getCartNoLogin = async (id) => {
    try {
        const res = await httpRequest.post("/cart/cartRedis", {
            key: id
        });
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

export const updateCartNoLogin = async (id, body, index) => {
    try {
        const res = await httpRequest.patch("/cart/updateCartRedis", {
            key: id,
            payload: body,
            index
        });
        return res;
    }
    catch(err) {
        console.log(err);
    }
}


export const deleteCartNoLogin = async (id, body) => {
    try {
        const res = await httpRequest.patch("/cart/deleteCartRedis", {
            key: id,
            payload: body
        });
        return res;
    }
    catch(err) {
        console.log(err);
    }
}


export const deleteKeyCartNoLogin = async (id) => {
    try {
        const res = await httpRequest.patch("/cart/deleteKeyCartRedis", {key: id});
        return res;
    }
    catch(err) {
        console.log(err);
    }
}


