import {io} from "socket.io-client";
export const socket = io("https://be-electro-api.onrender.com", {
    autoConnect: false
});
