import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography, TextField, Button, Skeleton, useTheme, Checkbox, FormControlLabel, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFrappeGetDoc, useFrappeUpdateDoc } from "frappe-react-sdk";
import { debounce } from "lodash";
import { setSessionID } from "../../store/slices/CurrentSessionSlice"
import arrowImage from '../../assets/images/products/arrow.png'
import getSocketObj from "../../utilities/getSocket";
import AlertDialog from "../../layouts/full/shared/dialog/AlertDialog";

const Chat = ({ socketData, socket, setRefreshSessionList, refreshSessionList }) => {
    const sessionID = useSelector(
        (state) => state.currentSessionReducer.sessionID
    );
    const agent = useSelector((state) => state.agentReducer);

    const [messages, setMessages] = useState([]);
    const [isResolved, setIsResolved] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const [dialogMessage, setDialogMessage] = useState("-----");

    const { data, error } = useFrappeGetDoc("Session Details", sessionID);
    const { updateDoc } = useFrappeUpdateDoc();

    const theme = useTheme();
    const dispatch = useDispatch();
    const chatEndRef = useRef(null);

    const primaryColor = theme.palette.primary.main;

    let title = "Do you want to claim this chat?";

    let buttonNameAndFunctions = [
        {
            name: "No",
            color: "error",
            variant: "outlined",
            function: () => {
                setShowDialog(false);
                setInputMessage(""); // Clear the input field
            },
        },
        {
            name: "Yes",
            color: "primary",
            variant: "outlined",
            function: () => {
                socket.emit("assignToMe", { sessionId: sessionID, user: agent.agentEmail });
                handleSendMessageEvent();
                setShowDialog(false);
            },
        },
    ];


    const updateAvailability = useCallback(
        debounce(async (status) => {
            try {
                await updateDoc("Session Details", sessionID, { "resolved": status });
                setRefreshSessionList(!refreshSessionList);
                console.log("API successfully updated with status:", status, "and session id is", sessionID);
            } catch (err) {
                console.error("Error updating API with status:", err);
            }
        }, 500),
        [sessionID]
    );

    const handleCheckboxChange = (event) => {
        const status = event.target.checked; // Get the checkbox state (checked/unchecked)
        setIsResolved(status);
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
            let status = data.resolved ? true : false;
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
            if (socketData.username === "Guest" && isResolved) {
                updateAvailability(false);
            }
        }
    }, [socketData]);

    const handleAssignedUserDetails = (data) => {
        console.log("assignedUserDetails", data.message);

        if (data.assignedUser === agent.agentEmail) {
            // Automatically send the message
            handleSendMessageEvent(data.message);
        } else {
            // Ask for permission to send the message
            setInputMessage(data.message);
            setDialogMessage(`This chat is being handled by ${data.assignedUser}. 
                If you click "Yes" then it will be assigned to you`)
            setShowDialog(true);
        }
    };

    useEffect(() => {
        socket.on("assignedUserDetails", handleAssignedUserDetails);

        return () => {
            socket.off("assignedUserDetails", handleAssignedUserDetails); // Clean up the listener
        };
    }, [agent.agentEmail, sessionID]);

    // Emits the message to the socket server
    const handleSendMessageEvent = (message = null) => {
        if (!message) {
            message = inputMessage.trim();
            if (!message) return; // Guard clause
        }

        socket.emit("sendMessage", {
            sessionId: sessionID,
            username: agent.agentDisplayName || agent.agentName,
            msg: message,
            room: sessionID,
        });

        setMessages((prevMessages) => [
            ...prevMessages,
            { user: agent.agentName, message: message },
        ]);

        setInputMessage(""); // Clear input
    };

    // Handle sending a message
    const handleSendMessage = () => {
        if (!inputMessage.trim()) return; // Prevent sending empty messages

        socket.emit("getAssignedUser", {
            sessionId: sessionID,
            user: agent.agentEmail,
            message: inputMessage.trim(),
        });
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

            {/* Dialog Box */}
            <AlertDialog
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                title={title}
                message={dialogMessage}
                buttonNameAndFunctions={buttonNameAndFunctions}
            />
        </Box>
    );
};

export default Chat;
