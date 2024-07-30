import * as httpRequest from '~/utils/httpRequest';


export const getAccount = async () => {
    try {
        const res = await httpRequest.get("account");
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

export const createAccount = async (data) => {
    try {
        const res = await httpRequest.post("account/create/store", data);
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

export const loginAccount = async (data) => {
    try {
        const res = await httpRequest.post("account/login", data);
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

export const logoutAccount = async (accessToken, axiosJWT) => {
    try {
        const res = await httpRequest.post("account/logout", {}
        , {
            headers: {token: `Bearer ${accessToken}`}
        }, axiosJWT);
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

export const refreshToken = async () => {
    try {
        const res = await httpRequest.post("account/refresh")
        return res;
    }
    catch(err) {
        console.log(err); 
    }
}

export const getEmail = async (email) => {
    try {
        const res = await httpRequest.get(`account/accountForget?email=${email}`)
        return res;
    }
    catch (err) {
        console.log(err); 
    }
}

export const recoverPassword = async (data) => {
    try {
        const res = await httpRequest.patch(`account/accountForget/recover?email=${data.email}&hashEmail=${data.hashEmail}`, {
            password: data.password
        })
        return res;
    }
    catch(err) {
        console.log(err); 
    }
}

export const changePassword = async (data, accessToken, axiosJWT) => {
    try {
        const res = await httpRequest.patch(`/account/submitChangePassword?id=${data.id}`, {
            password: data.password
        }, {
            headers: {token: `Bearer ${accessToken}`}
        }, axiosJWT)
        return res;
    }
    catch(err) {
        console.log(err); 
    }
}

export const verifyPasswordAccount = async (data, accessToken, axiosJWT) => {
    try {
        const res = await httpRequest.get(`/account/checkPassword/${data.id}`, {
            headers: {
                token: `Bearer ${accessToken}`,
                password: data.password
            }
        }, axiosJWT)
        return res;
    }
    catch(err) {
        console.log(err); 
    }
}

export const deleteAccount = async (accessToken, axiosJWT) => {
    try {
        const res = await httpRequest.deleteSingle(`/account/delete`, {
            headers: {
                token: `Bearer ${accessToken}`
            }
        }, axiosJWT)
        return res;
    }
    catch(err) {
        console.log(err); 
    }
}


