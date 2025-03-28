import { Badge, Box, Chip, ListItem, Stack, Typography } from '@mui/material'
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import { useSelector } from 'react-redux';
dayjs.extend(isToday);

export default function RenderSessionList({ sessions, handleSessionClick }) {

    const sessionID = useSelector(
        (state) => state.currentSessionReducer.sessionID
    );

    return (
        <>
            {sessions.map((session, index) => (
                <ListItem
                    button
                    key={index}
                    onClick={() => handleSessionClick(session.name)}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: session.name === sessionID ? "#e4e4e4" : "transparent",
                        "&:hover": {
                            backgroundColor: "#d0cfcf",
                        }
                    }}
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
                                fontWeight={session.last_message_by === "Guest" ? "bold" : "normal"}
                            >
                                {session.last_message_by && `${session.last_message_by}: `}
                                {session.last_message.length > 20
                                    ? `${session.last_message.substring(0, 20)}...`
                                    : session.last_message}
                            </Typography>
                        )}

                        {/* Agent Name Chip */}
                        <Box>
                            {session.agent_name && (
                                <Chip
                                    sx={{ height: "1.1rem" }}
                                    label={session.agent_name}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            )}
                        </Box>
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
                            <Badge badgeContent={"1"} color="error" sx={{ marginTop: "auto" }} />
                        )}
                    </Stack>
                </ListItem>
            ))}
        </>
    )
}
