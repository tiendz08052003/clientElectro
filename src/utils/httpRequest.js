import axios from "axios";

const httpRequest = axios.create({
    baseURL: "http://localhost:3001/api/",
    withCredentials: true,
})

export const get = async (path, data, axiosJWT) => {
    if(axiosJWT === undefined)
    {
        const res = await httpRequest.get(path, data);
        return res.data;
    }
    const res = await axiosJWT.get(path, data);
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

export const deleteSingle = async (path, data, axiosJWT) => {
    if(axiosJWT === undefined)
    {
        const res = await httpRequest.delete(path, data);
        return res.data;
    }
    const res = await axiosJWT.delete(path, data);
    return res.data;
}

export default httpRequest;