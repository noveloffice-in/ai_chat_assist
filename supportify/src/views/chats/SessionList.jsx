import React, { useEffect, useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    Typography,
    Badge,
    useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSessionID } from "../../store/slices/CurrentSessionSlice";
import { useFrappeGetDocList } from "frappe-react-sdk";

const SessionList = ({ socketData, refreshSessionList }) => {
    const [activeTab, setActiveTab] = useState("open");
    const [subTab, setSubTab] = useState("all");

    const agent = useSelector((state) => state.agentReducer);

    const [sessions, setSessions] = useState([]);

    const theme = useTheme();
    const badgeBackground = theme.palette.primary[200];
    const badgeHover = theme.palette.primary[400];

    const filters = [["resolved", "=", activeTab === "open" ? 0 : 1]];
    filters.push(["last_message", "!=", ""]);
    if (subTab !== "all") filters.push(["current_user", "=", agent.agentEmail]);

    const { data, error, isLoading, mutate } = useFrappeGetDocList("Session Details", {
        filters: filters,
        fields: ["name", "visitor_name", "last_message_by", "last_message"],
        orderBy: {
            field: "modified",
            order: "desc"
        }
    }, [refreshSessionList, activeTab, subTab]);

    useEffect(() => {
        if (data) {
            setSessions(data);
        }
    }, [data]);

    useEffect(() => {
        if (socketData.sessionId) {
            mutate();
        }
    }, [socketData]);

    const handleTabChange = (event, newValue) => setActiveTab(newValue);
    const handleSubTabChange = (event, newValue) => setSubTab(newValue);

    const dispatch = useDispatch();

    const handleSessionClick = (session) => {
        dispatch(setSessionID(session));
    };

    return (
        <Box>
            {/* Main Tabs */}
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
            >
                <Tab label="Open" value="open" />
                <Tab label="Resolved" value="resolved" />
            </Tabs>

            <Tabs
                value={subTab}
                onChange={handleSubTabChange}
                sx={{
                    minHeight: "32px", // Reduce overall height
                    padding: "5px 12px", // Adjust padding
                    gap: "10px"
                }}
                TabIndicatorProps={{ style: { display: "none" } }} // Remove underline
            >
                <Tab
                    label="All"
                    value="all"
                    sx={{
                        textTransform: "none",
                        backgroundColor: subTab === "all" ? badgeBackground : "#f0f0f0",
                        color: subTab === "all" ? "#ffffff" : "#333",
                        borderRadius: "16px",
                        padding: "4px 12px", // Smaller padding
                        fontSize: "0.75rem", // Make text smaller
                        fontWeight: 500,
                        minHeight: "28px", // Smaller height
                        marginRight: "10px", // Space between tabs
                        width: "1rem",
                        "&:hover": { backgroundColor: badgeHover, color: "#fff" },
                    }}
                />
                <Tab
                    label="Mine"
                    value="mine"
                    sx={{
                        textTransform: "none",
                        backgroundColor: subTab === "mine" ? badgeBackground : "#f0f0f0",
                        color: subTab === "mine" ? "#ffffff" : "#333",
                        borderRadius: "16px",
                        padding: "4px 12px",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        minHeight: "28px",
                        marginRight: "10px", // Space between tabs
                        "&:hover": { backgroundColor: badgeHover, color: "#fff" },
                    }}
                />
            </Tabs>

            <List>
                {sessions.length > 0 && sessions.map((session, index) => (
                    <ListItem
                        button
                        key={index}
                        onClick={() => handleSessionClick(session.name)}
                        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                        {/* Left Section: Visitor Name */}
                        <Box>
                            <Typography variant="body1" fontWeight="bold">
                                {session.visitor_name ? session.visitor_name : session.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ fontWeight: session.last_message_by === "Guest" ? "bold" : "normal" }}
                            >
                                {session.last_message_by && session.last_message_by}: {session.last_message && session.last_message.length > 20
                                    ? `${session.last_message.substring(0, 20)}...`
                                    : session.last_message}
                            </Typography>

                        </Box>

                        {/* Right Section: Red Badge if last_message_by is "Guest" */}
                        {session.last_message_by === "Guest" && (
                            <Badge
                                badgeContent={""}
                                color="success"
                                sx={{ ml: 2 }} // Adds some margin to the left
                            />
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SessionList;
