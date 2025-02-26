import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography, TextField, Button, Skeleton, useTheme, Checkbox, FormControlLabel, Stack, Badge, Tooltip } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from "react-redux";
import { useFrappeGetDoc, useFrappeUpdateDoc } from "frappe-react-sdk";
import { debounce } from "lodash";
import { setSessionID } from "../../store/slices/CurrentSessionSlice"
import arrowImage from '../../assets/images/products/arrow.png'
import AlertDialog from "../../layouts/full/shared/dialog/AlertDialog";
import Typing from "./Typing"

/**
 * Chat component for handling chat sessions and messages.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.socketData - Data from the socket.
 * @param {Object} props.socket - Socket connection.
 * @param {Function} props.setRefreshSessionList - Function to refresh the session list.
 * @param {boolean} props.refreshSessionList - Flag to refresh the session list.
 * @param {Function} props.setView - Function to set the current view.
 * @param {boolean} props.isDesktop - Flag indicating if the view is desktop.
 */
const Chat = ({ socketData, socket, setRefreshSessionList, refreshSessionList, setView, isDesktop }) => {
    const sessionID = useSelector(
        (state) => state.currentSessionReducer.sessionID
    );
    const agent = useSelector((state) => state.agentReducer);

    const [messages, setMessages] = useState([]);
    const [isResolved, setIsResolved] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const [dialogMessage, setDialogMessage] = useState("-----");
    const [suggestedMessages, setSuggestedMessages] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const { data, error, mutate } = useFrappeGetDoc("Session Details", sessionID);
    const { updateDoc } = useFrappeUpdateDoc();

    const theme = useTheme();
    const dispatch = useDispatch();
    const chatEndRef = useRef(null);

    const primaryColor = theme.palette.primary.main;
    const badgeBackground = theme.palette.primary[700];

    const HandleView = (item) => {
        setView(item);
    }

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
    const updateAvailability = useCallback(
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
        mutate();
    }, [refreshSessionList]);

    useEffect(() => {
        if (error) dispatch(setSessionID(""));
        if (data?.messages) {
            setMessages(data.messages);
            let status = data.resolved ? true : false;
            setIsResolved(status);
        }
    }, [data, error]);

    useEffect(() => {
        if (socketData.sessionId === sessionID && socketData.status !== "resolved") {
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
            room: sessionID
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
            {/* Chat Header */}
            <Box
                sx={{
                    padding: isDesktop ? "0.3rem 2rem" : "0.3rem 1rem",
                    borderBottom: '1px solid #ddd',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Stack flexDirection="row" alignItems={'center'}>
                    {/* Arrow for smaller devices*/}
                    {!isDesktop &&
                        <ArrowBackIcon
                            onClick={() => HandleView("list")}
                            sx={{ mr: 2 }}
                        />}
                    <Typography
                        variant="h6"
                        bgcolor={isDesktop ? "#fff" : badgeBackground}
                        color={isDesktop ? "#000000" : "#ffffff"}
                        width={isDesktop ? "200px" : "90px"}
                        overflow={'hidden'}
                        textOverflow={"ellipsis"}
                        sx={{ borderRadius: "8px", px: 1, fontSize: "0.75rem" }}
                        onClick={() => HandleView("details")}
                    >
                        {data && data.visitor_name ? data.visitor_name : sessionID}
                    </Typography>

                    {data && data.current_user &&
                        <Tooltip
                            title="Assigned To"
                            placement="right"
                            arrow
                            disableInteractive
                        >
                            <Badge
                                sx={{ ml: 1, bgcolor: isDesktop ? badgeBackground : "#fff", color: isDesktop ? "#fff" : "#000000", borderRadius: "8px", px: 1, fontSize: "0.75rem" }}
                            >
                                <span>{data.current_user}</span>
                            </Badge>
                        </Tooltip>
                    }
                </Stack>
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
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                {message.user !== "Guest" && (
                                    <Typography variant="caption" sx={{ color: message.user === "Guest" ? '#666' : '#fff', opacity: 0.7, fontSize: '0.7rem' }}>
                                        {message.user}
                                    </Typography>
                                )}
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: "break-all" }}>
                                    {message.message}
                                </Typography>
                            </Box>
                        </Box>
                    ))
                )}
                {/* Scroll to bottom */}
                <div ref={chatEndRef} />
            </Box>

            <Typing socket={socket}/>

            {/* Input Section */}
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
