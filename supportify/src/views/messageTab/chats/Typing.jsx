import { Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const typingAnimation = `
  @keyframes wave {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }
`;

export default function Typing({ socket, sessionID }) {
    const [typingMessage, setTypingMessage] = useState("");

    useEffect(() => {
        socket.on("guestTyping", (data) => { if(sessionID === data.room) setTypingMessage(data.msg) });

        return () => {
            setTypingMessage("");
            socket.off("guestTyping");
        };
    }, [sessionID]);

    return (
        <>
            {typingMessage &&
                <>
                    <style>{typingAnimation}</style>
                    <Stack
                        sx={{
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#cfcfcf",
                            borderRadius: "1rem",
                            margin: "0rem 1rem",
                            padding: "0.5rem",
                            wordBreak: "break-word",
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'break-word',
                            overflow: 'auto',
                            maxHeight: '6rem',
                            animation: "wave 1.5s infinite ease-in-out",
                        }}
                    >
                        <Typography variant="caption">{typingMessage}</Typography>
                    </Stack>
                </>
            }
        </>
    )
}
