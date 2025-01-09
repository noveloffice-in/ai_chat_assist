import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_NODE_SOCKET;
let socket = null;

const getSocketObj = () => {
    if (socket) {
        return socket;
    } else {
        socket = io(SOCKET_URL);
        return socket;
    }
};

export default getSocketObj;
