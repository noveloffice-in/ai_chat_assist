import React, { useEffect, useState } from "react";
import SessionList from "./SessionList";
import Chat from "./Chat";
import Details from "./Details";
import { Box } from "@mui/material";
//Utilities
import getSocketObj from "../../utilities/getSocket";
import showNotification from "../../utilities/notification";

const MessagesLayout = () => {
    const socket = getSocketObj();
    const [socketData, setSocketData] = useState({});
    const [refreshSessionList, setRefreshSessionList] = useState(false);

    useEffect(() => {
        // Request permission for desktop notifications
        if (Notification.permission !== "granted") {
            Notification.requestPermission().then((permission) => {
                console.log("Notification permission:", permission);
            });
        }

        // Event listener for receiving messages
        socket.on("receiveMessage", (data) => {
            setSocketData(data);
            setTimeout(() => {
                setRefreshSessionList(prev => !prev);
            }, 2000);
            showNotification("New Message", `Message from ${data.sessionId || "Unknown"}`);
        });

        socket.on("resolvedNotification", (data) => {
            setSocketData(data);
        });

        // Cleanup the event listener when component unmounts or socket changes
        return () => {
            socket.off("receiveMessage");
            socket.off("resolvedNotification");
            setSocketData({});
        };
    }, []);

    return (
        <Box sx={{ display: "flex", height: '87dvh' }}>
            {/* Sidebar: SessionList */}
            <Box
                sx={{
                    width: "22%",
                    border: "1px solid #ddd",
                    overflowY: "auto",
                }}
            >
                <SessionList socketData={socketData} refreshSessionList={refreshSessionList} />
            </Box>

            {/* Chat Section */}
            <Box
                sx={{
                    width: "53%",
                    border: "1px solid #ddd",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Chat
                    socketData={socketData}
                    socket={socket}
                    refreshSessionList={refreshSessionList}
                    setRefreshSessionList={setRefreshSessionList}
                />
            </Box>

            {/* Details Section */}
            <Box
                sx={{
                    width: "25%",
                    border: "1px solid #ddd",
                    overflowY: "auto",
                }}
            >
                <Details
                    setRefreshSessionList={setRefreshSessionList}
                />
            </Box>
        </Box>
    );
};

export default MessagesLayout;
