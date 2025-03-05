import React, { useEffect, useState } from 'react';
import { Typography, Stack } from '@mui/material';
import { useSelector } from 'react-redux';

export default function AgentTyping({ socket, sessionID, setIsScrollToBottom }) {

    const [isTyping, setIsTyping] = useState(false);
    const agent = useSelector((state) => state.agentReducer);
    let timeoutId = null;

    const handleAgentTyping = (data) => {
        if (data.room === sessionID && agent.agentName !== data.username) {
            if(!timeoutId) setIsScrollToBottom(true);
            if (timeoutId) clearTimeout(timeoutId);
            setIsTyping(data.username);
            timeoutId = setTimeout(() => {
                setIsTyping(false);
                setIsScrollToBottom(false);
                timeoutId = null;
            }, 2000);
        }
    }

    useEffect(() => {
        socket.on("agentTyping", handleAgentTyping);

        return () => {
            setIsTyping(false);
            socket.off("agentTyping");
        };
    }, [sessionID])

    return (
        isTyping &&
        <Stack alignItems="end" justifyContent="flex-end" mt={1}>
            <Typography
                sx={{
                    backgroundColor: (theme) => theme.palette.primary.main,
                    color: "#fff",
                    padding: "4px 16px",
                    borderRadius: "4px",
                    display: "inline-block",
                    fontWeight: 500,
                    fontSize: '16px', // Set font size for the text
                }}
            >
                {isTyping} Typing
                <span
                    style={{
                        display: "inline-block",
                        fontSize: "30px", // Dot size
                        animation: "wave 1.6s ease-out infinite",
                        animationDelay: "0s",
                    }}
                >
                    .
                </span>
                <span
                    style={{
                        display: "inline-block",
                        fontSize: "30px", // Dot size
                        animation: "wave 1.6s ease-out infinite",
                        animationDelay: "0.3s",
                    }}
                >
                    .
                </span>
                <span
                    style={{
                        display: "inline-block",
                        fontSize: "30px", // Dot size
                        animation: "wave 1.6s ease-out infinite",
                        animationDelay: "0.6s",
                    }}
                >
                    .
                </span>
            </Typography>

            <style>
                {`
                    @keyframes wave {
                    0% {
                        transform: translateY(0);
                    }
                    25% {
                        transform: translateY(-4px); 
                    }
                    50% {
                        transform: translateY(0);
                    }
                    75% {
                        transform: translateY(4px);
                    }
                    100% {
                        transform: translateY(0);
                    }
                    }
                `}
            </style>
        </Stack>
    )
}
