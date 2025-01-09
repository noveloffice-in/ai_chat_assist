import React, { useEffect, useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSessionID } from "../../store/slices/CurrentSessionSlice";
import { useFrappeGetDocList } from "frappe-react-sdk";

const SessionList = ({ socketData }) => {
    const [activeTab, setActiveTab] = useState("open");
    const [subTab, setSubTab] = useState("all");

    const agent = useSelector((state) => state.agentReducer);

    const [sessions, setSessions] = useState([]);

    const filters = [["resolved", "=", activeTab === "open" ? 0 : 1]];
    if (subTab !== "all") filters.push(["current_user", "=", agent.agentEmail]);

    const { data, error, isLoading } = useFrappeGetDocList("Session Details", {
        filters: filters,
    });


    useEffect(() => {
        if (data) {
            setSessions(data);
        }
        //     console.log("SessionList", socketData);
        //     // Check if the session is already in 'open.all' list
        //     setSessions((prevSessions) => {
        //         if (
        //             socketData.sessionId &&
        //             !prevSessions.open.all.includes(socketData.sessionId)
        //         ) {
        //             // Append new sessionId to the 'open.all' list
        //             return {
        //                 ...prevSessions,
        //                 open: {
        //                     ...prevSessions.open,
        //                     all: [...prevSessions.open.all, socketData.sessionId],
        //                 },
        //             };
        //         }
        //         return prevSessions;
        //     });
    }, [socketData, data]);

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

            {/* Sub Tabs */}
            <Tabs
                value={subTab}
                onChange={handleSubTabChange}
                variant="fullWidth"
                sx={{ borderBottom: "1px solid #ddd" }}
            >
                <Tab label="All" value="all" />
                <Tab label="Mine" value="mine" />
            </Tabs>

            {/* Session List */}
            <List>
                {sessions.length > 0 && sessions.map((session, index) => (
                    <ListItem button key={index}>
                        <ListItemText
                            primary={session.name}
                            onClick={() => {
                                handleSessionClick(session.name);
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SessionList;
