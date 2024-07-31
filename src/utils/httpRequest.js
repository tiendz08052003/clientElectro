import axios from "axios";

const httpRequest = axios.create({
    baseURL: "https://be-electro-api.onrender.com/api/",
    withCredentials: true,
})

export const get = async (path, data, axiosJWT) => {
    const res = await (axiosJWT ? axiosJWT : httpRequest).get(path, data);
    return res.data;
}

export const post = async (path, data, options, axiosJWT) => {
    const res = await (axiosJWT ? axiosJWT : httpRequest).post(path, data, options);
    return res.data;
}

export const patch = async (path, data, options, axiosJWT) => {
    const res = await (axiosJWT ? axiosJWT : httpRequest).patch(path, data, options);
    return res.data;
    
}

export const put = async (path, data, options, axiosJWT) => {
    const res = await (axiosJWT ? axiosJWT : httpRequest).put(path, data, options);
    return res.data;
    
}

export const deleteSingle = async (path, options, axiosJWT) => {
    const res = await (axiosJWT ? axiosJWT : httpRequest).delete(path, options);
    return res.data;
}

export default httpRequest;