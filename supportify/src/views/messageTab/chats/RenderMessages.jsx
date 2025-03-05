import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

import dayjs from "dayjs";

export default function RenderMessages({ messages, socket, sessionID }) {
    let lastDate = null;
    const theme = useTheme();
    const primaryColor = theme.palette.primary.main;

    return messages.map((message, index) => {
        const messageDate = dayjs(message.time_stamp).format("YYYY-MM-DD");
        const messageTime = dayjs(message.time_stamp).format("hh:mm A"); // WhatsApp-style time

        let showDateHeader = lastDate !== messageDate;
        lastDate = messageDate;

        return (
            <>
                <React.Fragment key={index}>
                    {/* Date Tag (only once per day) */}
                    {showDateHeader && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                my: 1
                            }}
                        >
                            <Typography
                                sx={{
                                    backgroundColor: "#d3d3d3",
                                    color: "#333",
                                    padding: "0px 8px",
                                    borderRadius: "16px",
                                    fontSize: "0.7rem",
                                    fontWeight: "300",
                                    textAlign: "center"
                                }}
                            >
                                {dayjs(message.time_stamp).format("MMMM D, YYYY")}
                                {message.message_type === "Activity" && ` - ${message.message}`}
                            </Typography>
                        </Box>
                    )}

                    {/* Activity Message */}
                    {message.message_type === "Activity" && !showDateHeader && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                my: 1
                            }}
                        >
                            <Typography
                                sx={{
                                    backgroundColor: "#d3d3d3",
                                    color: "#333",
                                    padding: "0px 8px",
                                    borderRadius: "16px",
                                    fontSize: "0.7rem",
                                    fontWeight: "300",
                                    textAlign: "center"
                                }}
                            >
                                {message.message}
                            </Typography>
                        </Box>
                    )}

                    {/* Regular Chat Message */}
                    {message.message_type === "Message" && (
                        <Box
                            sx={{
                                alignSelf: message.user === "Guest" ? "flex-start" : "flex-end",
                                backgroundColor: message.user === "Guest" ? "#f0f0f0" : primaryColor,
                                color: message.user === "Guest" ? "#000" : "#fff",
                                padding: 1,
                                borderRadius: 1,
                                maxWidth: "70%",
                                display: "flex",
                                flexDirection: "column",
                                position: "relative",
                                wordBreak: "break-word",
                                whiteSpace: 'pre-wrap',
                                overflowWrap: 'break-word',
                            }}
                        >
                            {message.user !== "Guest" && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: message.user === "Guest" ? "#666" : "#fff",
                                        opacity: 0.7,
                                        fontSize: "0.7rem"
                                    }}
                                >
                                    {message.user}
                                </Typography>
                            )}
                            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                {message.message}
                            </Typography>
                            {/* Time Stamp */}
                            <Typography
                                variant="caption"
                                sx={{
                                    alignSelf: "flex-end",
                                    fontSize: "0.7rem",
                                    opacity: 0.7,
                                    marginTop: "2px"
                                }}
                            >
                                {messageTime}
                            </Typography>
                        </Box>
                    )}
                </React.Fragment>
            </>
        );
    });
}
