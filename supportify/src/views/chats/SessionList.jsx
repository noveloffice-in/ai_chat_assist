import React, { useEffect, useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    List,
    ListItem,
    Typography,
    Badge,
    useTheme,
    Chip,
    Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSessionID } from "../../store/slices/CurrentSessionSlice";
import { useFrappeGetDocList } from "frappe-react-sdk";
import Scrollbar from "../../components/custom-scroll/Scrollbar";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
dayjs.extend(isToday);

/**
 * SessionList Component - Displays a list of chat sessions with filtering and sorting options.
 * Users can switch between "Open" and "Resolved" sessions, as well as filter by "All" or "Mine."
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.socketData - Data received from the socket connection.
 * @param {boolean} props.refreshSessionList - Boolean to trigger session list refresh.
 * @param {Function} props.setView - Function to set the view (list, chat, details).
 * @returns {JSX.Element} The rendered SessionList component.
 */
const SessionList = ({ socketData, refreshSessionList, setView }) => {
    const [activeTab, setActiveTab] = useState("open");
    const [subTab, setSubTab] = useState("all");

    const agent = useSelector((state) => state.agentReducer);
    const [sessions, setSessions] = useState([]);

    const theme = useTheme();
    const badgeBackground = theme.palette.primary[200];
    const badgeHover = theme.palette.primary[400];

    const dispatch = useDispatch();

    // Filters for fetching session data
    const filters = [["resolved", "=", activeTab === "open" ? 0 : 1]];
    filters.push(["last_message", "!=", ""]);
    if (subTab !== "all") filters.push(["current_user", "=", agent.agentEmail]);

    // Fetch sessions from the database
    const { data, error, isLoading, mutate } = useFrappeGetDocList(
        "Session Details",
        {
            filters,
            fields: [
                "name",
                "visitor_name",
                "last_message_by",
                "last_message",
                "last_message_at",
                "current_user",
                "agent_name",
            ],
            orderBy: { field: "modified", order: "desc" },
        },
        [refreshSessionList, activeTab, subTab]
    );

    // Update session list when data changes
    useEffect(() => {
        if (data) {
            setSessions(data);
        }
    }, [data]);

    // Refresh session list when a new message arrives
    useEffect(() => {
        if (socketData.sessionId) {
            mutate();
        }
    }, [socketData]);

    /**
     * Handles tab change for Open/Resolved sessions.
     * @param {React.SyntheticEvent} event - The event object.
     * @param {string} newValue - The new tab value.
     */
    const handleTabChange = (event, newValue) => setActiveTab(newValue);

    /**
     * Handles sub-tab change for filtering by All or Mine.
     * @param {React.SyntheticEvent} event - The event object.
     * @param {string} newValue - The new sub-tab value.
     */
    const handleSubTabChange = (event, newValue) => setSubTab(newValue);

    /**
     * Handles session selection and navigates to the chat view.
     * @param {string} sessionID - The selected session ID.
     */
    const handleSessionClick = (sessionID) => {
        setView("chat");
        dispatch(setSessionID(sessionID));
    };

    return (
        <Box>
            {/* Main Tabs */}
            <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                <Tab label="Open" value="open" />
                <Tab label="Resolved" value="resolved" />
            </Tabs>

            {/* Sub Tabs */}
            <Tabs
                value={subTab}
                onChange={handleSubTabChange}
                sx={{
                    minHeight: "32px",
                    padding: "5px 12px",
                    gap: "10px",
                    '& .css-heg063-MuiTabs-flexContainer': { justifyContent: 'center' }
                }}
                TabIndicatorProps={{ style: { display: "none" } }}
            >
                {["all", "mine"].map((tab) => (
                    <Tab
                        key={tab}
                        label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                        value={tab}
                        sx={{
                            textTransform: "none",
                            backgroundColor: subTab === tab ? badgeBackground : "#f0f0f0",
                            color: subTab === tab ? "#ffffff" : "#333",
                            borderRadius: "16px",
                            padding: "4px 12px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            minHeight: "28px",
                            marginRight: "10px",
                            width: { xs: "40%" },
                            "&:hover": { backgroundColor: badgeHover, color: "#fff" },
                        }}
                    />
                ))}
            </Tabs>

            {/* Scrollable Session List */}
            <Scrollbar sx={{ height: "650px", maxHeight: "800px" }}>
                <List>
                    {sessions.length > 0 &&
                        sessions.map((session, index) => (
                            <ListItem
                                button
                                key={index}
                                onClick={() => handleSessionClick(session.name)}
                                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                            >
                                {/* Left Section: Visitor Name */}
                                <Stack gap={0.5} justifyContent="center">
                                    <Typography variant="body1" fontWeight="bold">
                                        {session.visitor_name || session.name}
                                    </Typography>

                                    {/* Last Message */}
                                    {session.last_message && (
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{ fontWeight: session.last_message_by === "Guest" ? "bold" : "normal" }}
                                        >
                                            {session.last_message_by && `${session.last_message_by}: `}
                                            {session.last_message.length > 20
                                                ? `${session.last_message.substring(0, 20)}...`
                                                : session.last_message}
                                        </Typography>
                                    )}

                                    {/* Agent Name Chip */}
                                    {session.agent_name && (
                                        <Chip
                                            sx={{ height: "1.1rem" }}
                                            label={session.agent_name}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    )}
                                </Stack>

                                {/* Right Section: Time & Badge */}
                                <Stack minHeight="2rem" alignItems="flex-end" justifyContent="space-between">
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: session.last_message_by === "Guest" ? "bold" : "normal" }}
                                    >
                                        {session.last_message_at
                                            ? dayjs(session.last_message_at).isToday()
                                                ? dayjs(session.last_message_at).format("h:mm A")
                                                : dayjs(session.last_message_at).format("ddd")
                                            : ""}
                                    </Typography>

                                    {/* Red Badge for Unread Messages */}
                                    {session.last_message_by === "Guest" && (
                                        <Badge badgeContent={""} color="error" sx={{ marginTop: "auto" }} />
                                    )}
                                </Stack>
                            </ListItem>
                        ))}
                </List>
            </Scrollbar>
        </Box>
    );
};

export default SessionList;
