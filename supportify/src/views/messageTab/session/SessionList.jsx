import React, { useEffect, useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    List,
    useTheme,
    Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSessionID } from "../../../store/slices/CurrentSessionSlice";
import { useFrappeGetDocList } from "frappe-react-sdk";
import Scrollbar from "../../../components/custom-scroll/Scrollbar";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import RenderSessionList from "./RenderSessionList";
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
            <Scrollbar sx={{ maxHeight: "80dvh" }}>
                <List>
                    {sessions.length ?
                        <RenderSessionList
                            sessions={sessions}
                            handleSessionClick={handleSessionClick}
                        />
                        :
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "500px" }}>
                            <Typography variant="h5">No sessions found.</Typography>
                        </Box>
                    }
                </List>
            </Scrollbar>
        </Box>
    );
};

export default SessionList;
