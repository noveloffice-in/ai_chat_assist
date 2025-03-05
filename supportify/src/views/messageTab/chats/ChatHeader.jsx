import React, { useEffect, useState } from "react";
import { Button, useTheme, Checkbox, FormControlLabel, Stack, Badge, Tooltip, useMediaQuery } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from "react-redux";
import HeaderTags from "./HeaderTags";

export default function ChatHeader({ data, setView, updateResolvedStatus }) {
    const isDesktop = useMediaQuery("(min-width:900px)");

    const agent = useSelector((state) => state.agentReducer);

    const theme = useTheme();
    const badgeBackground = theme.palette.primary[700];

    const handleView = (item) => {
        setView(item);
    }

    const [isResolved, setIsResolved] = useState(false);

    const isClaimed = data && data.current_user;
    const isClamiedBySameAgent = data && data.current_user === agent.agentEmail;

    const handleCheckboxChange = (event) => {
        const status = event.target.checked; // Get the checkbox state (checked/unchecked)
        setIsResolved(status);
        updateResolvedStatus(status); // Trigger debounced function
    };

    useEffect(() => {
        let status = data && data.resolved;
        setIsResolved(Boolean(status));
    }, [data]);

    return (
        data &&
        <>
            <Stack
                sx={{
                    padding: isDesktop ? "0.3rem 0.5rem" : "0.3rem 1rem",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    borderBottom: '1px solid #ddd',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'white',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }
                }
            >
                <Stack flexDirection="row" alignItems='center' gap={1}>
                    {/* Arrow for smaller devices*/}
                    {!isDesktop &&
                        <ArrowBackIcon
                            onClick={() => handleView("list")}
                            sx={{ mr: 2 }}
                        />}
                    <Badge
                        sx={{
                            borderRadius: "8px",
                            px: 1,
                            fontSize: "0.8rem",
                            cursor: isDesktop ? "" : "pointer",
                            bgcolor: isDesktop ? "#fff" : badgeBackground,
                            color: isDesktop ? "#000000" : "#fff"
                        }}
                        onClick={() => handleView("details")}
                    >
                        {data && data.visitor_name ? (isDesktop ? data.visitor_name : `${data.visitor_name.substring(0, 10)}...`) : data.name}
                    </Badge>

                    {data && data.agent_name &&
                        <Tooltip
                            title="Assigned To"
                            placement="bottom"
                            arrow
                            disableInteractive
                        >
                            <Badge
                                sx={{ ml: 1, bgcolor: isDesktop ? badgeBackground : "#fff", color: isDesktop ? "#fff" : "#000000", borderRadius: "8px", px: 1, fontSize: "0.75rem" }}
                            >
                                <span>{!isDesktop ? `${data.agent_name.split("@")[0]}...` : data.agent_name}</span>
                            </Badge>
                        </Tooltip>
                    }

                    {
                        isClaimed ?
                            !isClamiedBySameAgent &&
                            <Button variant="outlined" size="small">
                                Re-claim
                            </Button>
                            :
                            <Button variant="outlined" size="small">
                                Claim
                            </Button>
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
            </Stack >
            <HeaderTags data={data}/>
        </>
    )
}
