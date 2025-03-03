import React, { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import SessionList from "./SessionList";
import Chat from "./Chat";
import Details from "./Details";
// Utilities
import getSocketObj from "../../utilities/getSocket";
import showNotification from "../../utilities/notification";

/**
 * MessagesLayout Component - Manages the layout of the messaging system.
 * It displays the session list, chat window, and details section based on screen size and user interaction.
 *
 * @component
 * @returns {JSX.Element} The rendered MessagesLayout component.
 */
const MessagesLayout = () => {
    const socket = getSocketObj();
    const [socketData, setSocketData] = useState({});
    const [refreshSessionList, setRefreshSessionList] = useState(false);
    const isDesktop = useMediaQuery("(min-width:900px)");
    const [view, setView] = useState("list"); // Mobile view state

    /**
     * Handles receiving a new message via socket connection.
     * Updates state and triggers a notification.
     *
     * @param {Object} data - The received message data.
     * @param {string} data.sessionId - The session ID of the message sender.
     */
    const handleReceiveMessage = (data) => {
        setSocketData(data);
        setTimeout(() => setRefreshSessionList((prev) => !prev), 2000);
        showNotification("New Message", `Message from ${data.sessionId || "Unknown"}`);
    };

    /**
     * Handles resolved notifications received from the socket.
     *
     * @param {Object} data - The notification data.
     */
    const handleResolvedNotification = (data) => {
        setSocketData(data);
    };

    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission().then((permission) =>
                console.log("Notification permission:", permission)
            );
        }

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("resolvedNotification", handleResolvedNotification);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("resolvedNotification", handleResolvedNotification);
        };
    }, []);

    // Determines which sections to display based on screen size and user selection
    const showSessionList = isDesktop || view === "list";
    const showChat = isDesktop || view === "chat";
    const showDetails = isDesktop || view === "details";

    return (
        <Box sx={{ display: "flex", height: 'calc(100vh - 75px)' }}>
            {/* Sidebar: SessionList */}
            {showSessionList && (
                <Box sx={{ width: { xs: "100%", md: "22%" }, border: 1, borderColor: "divider", overflowY: "hidden" }}>
                    <SessionList socketData={socketData} refreshSessionList={refreshSessionList} setView={setView} />
                </Box>
            )}

            {/* Chat Section */}
            {showChat && (
                <Box sx={{ width: isDesktop ? "53%" : "100vw", border: 1, borderColor: "divider", display: "flex", flexDirection: "column" }}>
                    <Chat
                        socketData={socketData}
                        socket={socket}
                        refreshSessionList={refreshSessionList}
                        setRefreshSessionList={setRefreshSessionList}
                        setView={setView}
                        isDesktop={isDesktop}
                    />
                </Box>
            )}

            {/* Details Section */}
            {showDetails && (
                <Box sx={{ width: isDesktop ? "25%" : "100%", border: 1, borderColor: "divider", overflowY: "auto" }}>
                    <Details setRefreshSessionList={setRefreshSessionList} setView={setView} isDesktop={isDesktop} />
                </Box>
            )}
        </Box>
    );
};

export default MessagesLayout;
