import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography, TextField, Button, Stack, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFrappeGetDoc, useFrappeUpdateDoc } from "frappe-react-sdk";
import { debounce } from "lodash";
import arrowImage from '../../../assets/images/products/arrow.png'
import Typing from "./Typing"
import RenderMessages from "./RenderMessages";
import { setSessionID } from "../../../store/slices/CurrentSessionSlice";
import AlertDialog from "../../../layouts/full/shared/dialog/AlertDialog";
import { setAgentAvailability } from "../../../store/slices/AgentSlice";
import ChatHeader from "./ChatHeader";
import AgentTyping from "./AgentTyping";

/**
 * Chat component for handling chat sessions and messages.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.socketData - Data from the socket.
 * @param {Object} props.socket - Socket connection.
 * @param {Function} props.setRefreshSessionList - Function to refresh the session list.
 * @param {boolean} props.refreshSessionList - Flag to refresh the session list.
 * @param {Function} props.setView - Function to set the current view.
 */
const Chat = ({ socketData, socket, setRefreshSessionList, refreshSessionList, setView }) => {
    const sessionID = useSelector(
        (state) => state.currentSessionReducer.sessionID
    );
    const agent = useSelector((state) => state.agentReducer);

    const [messages, setMessages] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const [dialogMessage, setDialogMessage] = useState("-----");
    const [suggestedMessages, setSuggestedMessages] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isScrollToBottom, setIsScrollToBottom] = useState(false);
    const [guestAvailability, setGuestAvailability] = useState(false);

    const { data, error, mutate } = useFrappeGetDoc("Session Details", sessionID);
    const { updateDoc } = useFrappeUpdateDoc();

    const dispatch = useDispatch();
    const theme = useTheme();
    const chatEndRef = useRef(null);

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
                socket.emit("assignToMe", {
                    sessionId: sessionID,
                    user: agent.agentDisplayName ? agent.agentDisplayName : agent.agentName,
                    agentEmail: agent.agentEmail
                });
                dispatch(setAgentAvailability(1));
                handleSendMessageEvent();
                setShowDialog(false);
            },
        },
    ];

    /**
     * Update the availability status of the agent.
     * 
     * @param {boolean} status - The new availability status.
     */
    const updateResolvedStatus = useCallback(
        debounce(async (status) => {
            try {
                await updateDoc("Session Details", sessionID, { "resolved": status });
                setRefreshSessionList(!refreshSessionList);
                socket.emit("resolvedNotification", {
                    sessionId: sessionID,
                    username: agent.agentDisplayName || agent.agentName,
                    room: sessionID,
                    agentEmail: agent.agentEmail
                });
            } catch (err) {
                console.error("Error updating API with status:", err);
            }
        }, 500),
        [sessionID]
    );

    const handleAgentJoined = (data) => {
        if (data.room === sessionID) {
            setMessages((prevMessages) => [...prevMessages, {
                user: data.username,
                message: `${data.username} joined the chat`,
                message_type: "Activity"
            }]);
        }
    }

    // Auto-scroll to the latest message
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isScrollToBottom]);

    useEffect(() => {
        mutate();
    }, [refreshSessionList]);

    useEffect(() => {
        if (error) dispatch(setSessionID(""));
        if (data?.messages) {
            // data.messages.unshift({ message_type: "Message", message: "Greetings from Novel Office", time_stamp: data.messages[0].time_stamp });
            setMessages(data.messages);
        }
    }, [data, error]);

    useEffect(() => {
        if (socketData.sessionId === sessionID) {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    user: socketData.username,
                    message: socketData.msg,
                    time_stamp: socketData.timeStamp,
                    message_type: socketData.messageType
                },
            ]);
        }
    }, [socketData]);

    /**
     * Handle assigned user details from the socket.
     * 
     * @param {Object} data - The data received from the socket.
     */
    const handleAssignedUserDetails = (data) => {
        if (data.assignedUser === agent.agentEmail) {
            // Automatically send the message
            handleSendMessageEvent(data.message);
        } else {
            // Ask for permission to send the message
            setInputMessage(data.message);
            setDialogMessage(`This chat is being handled by ${data.assignedUser}. 
                If you click "Yes" then it will be assigned to you`);
            setShowDialog(true);
        }
    };

    useEffect(() => {
        socket.on("assignedUserDetails", handleAssignedUserDetails);
        socket.on("agentJoined", handleAgentJoined);
        socket.on("userAvailability", (data) => {
            if (data.room === sessionID) setGuestAvailability(data.isOnline);
        });

        return () => {
            socket.off("assignedUserDetails"); // Clean up the listener
            socket.off("agentJoined");
            socket.off("userAvailability");
            setInputMessage("");
        };
    }, [agent.agentEmail, sessionID]);

    // Emits the message to the socket server
    const handleSendMessageEvent = (message = null) => {
        if (!message) {
            message = inputMessage.trim();
            if (!message) return; // Guard clause
        }

        if (!agent.isAvailable) dispatch(setAgentAvailability(1));
        socket.emit("sendMessage", {
            sessionId: sessionID,
            username: agent.agentDisplayName || agent.agentName,
            msg: message,
            room: sessionID,
            agentEmail: agent.agentEmail,
        });

        setTimeout(() => {
            mutate();
            setRefreshSessionList(prev => !prev);
        }, 2000);

        let agentName = agent.agentDisplayName ? agent.agentDisplayName : agent.agentName;

        setMessages((prevMessages) => [
            ...prevMessages,
            { user: agentName, message: message },
        ]);

        setInputMessage(""); // Clear input
    };

    // Handle sending a message
    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        socket.emit("getAssignedUser", {
            sessionId: sessionID,
            user: agent.agentDisplayName ? agent.agentDisplayName : agent.agentName,
            message: inputMessage.trim(),
            agentEmail: agent.agentEmail,
        });
    };

    const handleInputChange = (e) => {
        let value = e.target.value;
        setInputMessage(value);

        socket.emit("agentTyping", {
            room: sessionID,
            user: agent.agentName
        })

        // Find matching canned messages
        let matches = agent.cannedMessages.filter(item =>
            `/${item.hotWord}`.toLowerCase().includes(value.toLowerCase())
        );

        setSuggestedMessages(matches);
        setSelectedIndex(-1); // Reset selection
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSendMessage();
        }
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            setInputMessage(inputMessage + "\n");
        }
        if (suggestedMessages.length > 0) {
            if (e.key === 'ArrowDown') {
                setSelectedIndex((prevIndex) =>
                    prevIndex < suggestedMessages.length - 1 ? prevIndex + 1 : 0
                );
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                setSelectedIndex((prevIndex) =>
                    prevIndex > 0 ? prevIndex - 1 : suggestedMessages.length - 1
                );
                e.preventDefault();
            } else if (e.key === 'Tab' && selectedIndex >= 0) {
                setInputMessage(suggestedMessages[selectedIndex].message);
                setSuggestedMessages([]); // Clear suggestions
                e.preventDefault();
            }
        }
    };

    const renderMessageSuggestions = () => (
        <Box sx={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            width: "100%",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            borderRadius: "4px",
            maxHeight: "150px",
            overflowY: "auto",
            zIndex: 10,
        }}>
            {suggestedMessages.map((msg, index) => (
                <Box key={msg.hotWord}
                    sx={{
                        padding: "8px",
                        backgroundColor: selectedIndex === index ? "#ddd" : "#fff",
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#eee" }
                    }}
                    onMouseDown={() => {
                        setInputMessage(msg.message);
                        setSuggestedMessages([]);
                    }}
                >
                    {msg.message}
                </Box>
            ))}
        </Box>
    );

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

            {/*Chat Header */}
            <ChatHeader
                data={data}
                setView={setView}
                updateResolvedStatus={updateResolvedStatus}
                guestAvailability={guestAvailability}
            />

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
                    <Stack gap={0.5}>
                        <RenderMessages
                            messages={messages}
                        />
                        {/* Guest Typing Indicator */}
                        <AgentTyping socket={socket} sessionID={sessionID} setIsScrollToBottom={setIsScrollToBottom} />
                    </Stack>
                )}
                {/* Scroll to bottom */}
                <div ref={chatEndRef} />
            </Box>

            {/* Guest Typing Indicator */}
            <Typing socket={socket} sessionID={sessionID} />

            {/* Input Section */}
            {
                true &&
                <Box
                    sx={{
                        padding: 1,
                        display: "flex",
                        bottom: "0px",
                        gap: 2,
                    }}
                >
                    <Box sx={{ position: "relative", width: "100%" }}>
                        {inputMessage.length >= 3 && suggestedMessages.length > 0 && renderMessageSuggestions()}
                        <TextField
                            fullWidth
                            placeholder="Reply to live chat"
                            value={inputMessage}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            multiline
                            minRows={1}
                            maxRows={4}
                            sx={{ resize: 'vertical' }}
                        />
                    </Box>
                    <Button variant="contained" onClick={handleSendMessage}>
                        Send
                    </Button>
                </Box>
            }

            {/* Dialog Box */}
            <AlertDialog
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                title={title}
                message={dialogMessage}
                buttonNameAndFunctions={buttonNameAndFunctions}
            />
        </Box >
    );
};

export default Chat;
