import React, { useEffect, useState } from "react";
import SessionList from "./SessionList";
import Chat from "./Chat";
import Details from "./Details";
import { Box, Grid } from "@mui/material";

import getSocketObj from "../../utilities/getSocket";

const MessagesLayout = () => {
    const socket = getSocketObj();
    const [socketData, setSocketData] = useState({});

    useEffect(() => {
        // Event listener for receiving messages
        socket.on("receiveMessage", (data) => {
            console.log("MessagesLayout", data);
            setSocketData(data);
        });

        // Cleanup the event listener when component unmounts or socket changes
        return () => {
            socket.off("receiveMessage");
            setSocketData({});
        };
    }, []);

    return (
        <Box sx={{ display: "flex", height: "90vh" }}>
            {/* Sidebar: SessionList */}
            <Box
                sx={{
                    width: "25%",
                    border: "1px solid #ddd",
                    overflowY: "auto",
                }}
            >
                <SessionList socketData={socketData} />
            </Box>

            {/* Chat Section */}
            <Box
                sx={{
                    width: "50%",
                    border: "1px solid #ddd",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "85%",
                    overflowY: "scroll",
                }}
            >
                <Chat socketData={socketData} socket={socket} />
            </Box>

            {/* Details Section */}
            <Box
                sx={{
                    width: "25%",
                    border: "1px solid #ddd",
                    overflowY: "auto",
                }}
            >
                <Details />
            </Box>
        </Box>
    );
};

export default MessagesLayout;
