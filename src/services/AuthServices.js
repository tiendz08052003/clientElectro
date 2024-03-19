import * as httpRequest from '~/utils/httpRequest';


export const getAuth = async () => {
    try {
        const res = await httpRequest.get("auth");
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

export const createAuth = async (data) => {
    try {
        const res = await httpRequest.post("auth/create/store", data);
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

export const loginAuth = async (data) => {
    try {
        const res = await httpRequest.post("auth/login", data);
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

export const logoutAuth = async (accessToken, axiosJWT) => {
    try {
        const res = await httpRequest.post("auth/logout", {}
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
        const res = await httpRequest.post("auth/refresh")
        return res;
    }
    catch(err) {
        console.log(err); 
    }
}

export const getEmail = async (email) => {
    try {
        const res = await httpRequest.get(`auth/accountForget?email=${email}`)
        return res;
    }
    catch (err) {
        console.log(err); 
    }
}

export const recoverPassword = async (data) => {
    try {
        const res = await httpRequest.patch(`auth/accountForget/recover?email=${data.email}&hashEmail=${data.hashEmail}`, {
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
        const res = await httpRequest.patch(`/auth/account/submitChangePassword?id=${data.id}`, {
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
        const res = await httpRequest.get(`/auth/account/checkPassword/${data.id}`, {
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

export const deleteAccount = async (data, accessToken, axiosJWT) => {
    try {
        const res = await httpRequest.deleteSingle(`/auth/delete/${data.id}`, {
            headers: {
                token: `Bearer ${accessToken}`,
                admin: data.admin
            }
        }, axiosJWT)
        return res;
    }
    catch(err) {
        console.log(err); 
    }
}


