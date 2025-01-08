import React, { useEffect } from 'react'
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_NODE_SOCKET;
let socket;

export default function SocketConnection({children}) {
    useEffect(() => {
        // Initialize the socket connection when the component mounts
        socket = io(SOCKET_URL);

        // Listen for messages from the server
        socket.on("message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.emit("join_room", { room: "", username: "Agent" });

        // Clean up the socket connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <>
            {children}
        </>
    )
}
