import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography, TextField, Button, Skeleton, useTheme, Checkbox, FormControlLabel } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFrappeGetDoc, useFrappeUpdateDoc } from "frappe-react-sdk";
import { debounce } from "lodash";
import { setSessionID } from "../../store/slices/CurrentSessionSlice"
import arrowImage from '../../assets/images/products/arrow.png'

const Chat = ({ socketData, socket }) => {
    const sessionID = useSelector(
        (state) => state.currentSessionReducer.sessionID
    );
    const agent = useSelector((state) => state.agentReducer);

    const [messages, setMessages] = useState([]);
    const [isResolved, setIsResolved] = useState(false);
    const [inputMessage, setInputMessage] = useState("");

    const { data, error } = useFrappeGetDoc("Session Details", sessionID);
    const { updateDoc } = useFrappeUpdateDoc();

    const theme = useTheme();
    const dispatch = useDispatch();
    const chatEndRef = useRef(null);

    const primaryColor = theme.palette.primary.main;
    const grey = theme.palette;

    const updateAvailability = useCallback(
        debounce(async (status) => {
            try {
                if (typeof (status) === 'boolean') setIsResolved(status);
                await updateDoc("Session Details", sessionID, { "resolved": status });
                console.log("API successfully updated with status:", status);
            } catch (err) {
                console.error("Error updating API with status:", err);
            }
        }, 1000),
        []
    );

    const handleCheckboxChange = (event) => {
        const status = event.target.checked; // Get the checkbox state (checked/unchecked)
        updateAvailability(status); // Trigger debounced function
    };

    // Auto-scroll to the latest message
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (error) dispatch(setSessionID(""));
        if (data?.messages) {
            setMessages(data.messages);
            console.log("data", data);
            let status = data?.resolved ? true : false;
            setIsResolved(status);
        }
    }, [data, error]);

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
        if (socketData.username === "Guest" && isResolved) {
            updateAvailability(false);
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
                    Ready to chat? Click on a session to begin messaging. <br />
                    <img src={arrowImage} alt="" style={{
                        width: '16rem',
                        height: '14rem',
                        marginTop: '1rem'
                    }} />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            {/* Chat Header */}
            <Box
                sx={{
                    padding: "0.3rem 2rem",
                    borderBottom: '1px solid #ddd',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6">{sessionID}</Typography>

                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={handleCheckboxChange}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                            checked={isResolved}
                        />
                    }
                    label="Resolved"
                    sx={{ marginLeft: 0 }}
                />
            </Box>

            {/* Chat Messages */}
            <Box
                sx={{
                    flexGrow: 1,
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    overflowY: "scroll",
                    height: '0rem'
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
                                        : primaryColor,
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
                    bottom: "0px",
                    gap: 2,
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
