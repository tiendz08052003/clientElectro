import * as httpRequest from '~/utils/httpRequest';
import axios from 'axios';


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
        const res = await httpRequest.post("auth/logout", axios.defaults.withCredentials = true
        , {
            headers: {token: `Bearer ${accessToken}`}, 
        }, axiosJWT);
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

export const refreshToken = async () => {
    try {
        const res = await httpRequest.post("auth/refresh", axios.defaults.withCredentials = true)
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
        const res = await httpRequest.patch(`auth/accountForget/recover?email=${data.email}&hashEmail=${data.hashEmail}`, {password: data.password})
        return res;
    }
    catch(err) {
        console.log(err); 
    }
}


