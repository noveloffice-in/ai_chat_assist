import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, TextField, Button, Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { useFrappeGetDoc } from "frappe-react-sdk";


const Chat = ({ socketData, socket }) => {
    const sessionID = useSelector(
        (state) => state.currentSessionReducer.sessionID
    );

    const agent = useSelector((state) => state.agentReducer);

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState(""); // State for message input
    const { data, error } = useFrappeGetDoc("Session Details", sessionID);
    const chatEndRef = useRef(null);

    // Auto-scroll to the latest message
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (data?.messages) {
            setMessages(data.messages);
        }
    }, [data]);

    useEffect(() => {
        if (socketData.sessionId === sessionID) {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    user: socketData.username,
                    message: socketData.msg,
                },
            ]);
        }
    }, [socketData]);

    // Handle sending a message
    const handleSendMessage = () => {
        if (!inputMessage.trim()) {
            return; // Prevent sending empty messages
        }

        const newMessage = {
            user: agent.agentName, // Can replace this with actual user info
            message: inputMessage.trim(),
        };

        // Add the new message to the local state
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Emit the message to the socket server
        socket.emit("sendMessage", {
            sessionId: sessionID,
            username: agent.agentName, // Replace with actual username
            msg: inputMessage.trim(),
            room: sessionID,
        });

        // Clear the input field after sending
        setInputMessage("");
    };

    // Render skeleton when sessionID is not available or loading
    if (!sessionID) {
        return (
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={{ padding: 2, borderBottom: "1px solid #ddd" }}>
                    <Typography variant="h6">Chat</Typography>
                </Box>
                <Box sx={{ flexGrow: 1, padding: 2, overflowY: "auto" }}>
                    <Skeleton variant="text" width="100%" height={30} />
                    <Skeleton variant="text" width="100%" height={30} />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            {/* Chat Header */}
            <Box sx={{ padding: 2, borderBottom: "1px solid #ddd" }}>
                <Typography variant="h6">{sessionID}</Typography>
            </Box>

            {/* Chat Messages */}
            <Box
                sx={{
                    flexGrow: 1,
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                {messages.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                        No messages yet...
                    </Typography>
                ) : (
                    messages.map((message, index) => (
                        <Box
                            key={index}
                            sx={{
                                alignSelf:
                                    message.user === "Guest"
                                        ? "flex-start"
                                        : "flex-end",
                                backgroundColor:
                                    message.user === "Guest"
                                        ? "#f0f0f0"
                                        : "#1976d2",
                                color:
                                    message.user === "Guest" ? "#000" : "#fff",
                                padding: 1,
                                borderRadius: 1,
                                maxWidth: "70%",
                            }}
                        >
                            <Typography variant="body2">
                                {message.message}
                            </Typography>
                        </Box>
                    ))
                )}
                {/* Scroll to bottom */}
                <div ref={chatEndRef} />
            </Box>

            {/* Input Section */}
            <Box
                sx={{
                    padding: 2,
                    borderTop: "1px solid #ddd",
                    display: "flex",
                    position: "absolute",
                    bottom: "0px",
                    gap: 2,
                    width: "46%",
                }}
            >
                <TextField
                    fullWidth
                    placeholder="Reply to live chat"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)} // Update input state on change
                />
                <Button variant="contained" onClick={handleSendMessage}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default Chat;
