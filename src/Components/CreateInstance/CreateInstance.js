import axios from "axios";
import jwt_decode from "jwt-decode";
import * as AuthServices  from "~/services/AccountServices";

export const CreateAxios = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create({
        baseURL: "https://be-electro-api.onrender.com/api/",
        withCredentials: true,
    })

    newInstance.interceptors.request.use(
        async (config) => {
            const date = new Date();
            const decodedToken = jwt_decode(user?.accessToken);
            if(decodedToken.exp < date.getTime() / 1000)
            {
                const res = await AuthServices.refreshToken();
                const refreshUser = {
                    ...user,
                    accessToken: res.accessToken
                }
                dispatch(stateSuccess(refreshUser))
                config.headers["Token"] = "Bearer " + res.accessToken;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    )
    return newInstance
} 
