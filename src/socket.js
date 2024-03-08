import { io } from 'socket.io-client';
export const socket = io('http://localhost:3001', {
    path: '/',
    autoConnect: false,
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd"
    }
});
