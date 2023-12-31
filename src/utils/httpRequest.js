import axios from "axios";

const httpRequest = axios.create({
    baseURL: "https://be-electro-api.onrender.com/api/",
    withCredentials: true,
})

export const get = async (path, options, axiosJWT) => {
    if(axiosJWT === undefined)
    {
        const res = await httpRequest.get(path, options);
        return res.data;
    }
    const res = await axiosJWT.get(path, options);
    return res.data;
}

export const post = async (path, data, options, axiosJWT) => {
    if(axiosJWT === undefined)
    {
        const res = await httpRequest.post(path, data, options);
        return res.data;
    }
    const res = await axiosJWT.post(path, data, options);
    return res.data;
}

export const patch = async (path, data, options, axiosJWT) => {
    if(axiosJWT === undefined)
    {
        const res = await httpRequest.patch(path, data, options);
        return res.data;
    }
    const res = await axiosJWT.patch(path, data, options);
    return res.data;
    
}

export const put = async (path, data, options, axiosJWT) => {
    if(axiosJWT === undefined)
    {
        const res = await httpRequest.put(path, data, options);
        return res.data;
    }
    const res = await axiosJWT.put(path, data, options);
    return res.data;
    
}

export const deleteSingle = async (path, options, axiosJWT) => {
    if(axiosJWT === undefined)
    {
        const res = await httpRequest.delete(path, options);
        return res.data;
    }
    const res = await axiosJWT.delete(path, options);
    return res.data;
}

export default httpRequest;