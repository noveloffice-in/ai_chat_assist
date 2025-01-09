import React, { useState } from "react";
import { styled, Container, Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import getSocketObj from "../../utilities/getSocket";


const MainWrapper = styled("div")(() => ({
    display: "flex",
    minHeight: "100vh",
    width: "100%",
}));

const PageWrapper = styled("div")(() => ({
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    zIndex: 1,
    backgroundColor: "transparent",
}));

const FullLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    // const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
    const socket = getSocketObj();
    socket.emit("join_room", { room: "", username: "Agent" });

    return (
            <MainWrapper className="mainwrapper">
                {/* ------------------------------------------- */}
                {/* Sidebar */}
                {/* ------------------------------------------- */}
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    isMobileSidebarOpen={isMobileSidebarOpen}
                    onSidebarClose={() => setMobileSidebarOpen(false)}
                />
                {/* ------------------------------------------- */}
                {/* Main Wrapper */}
                {/* ------------------------------------------- */}
                <PageWrapper className="page-wrapper">
                    {/* ------------------------------------------- */}
                    {/* Header */}
                    {/* ------------------------------------------- */}
                    <Header
                        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                        toggleMobileSidebar={() => setMobileSidebarOpen(true)}
                    />
                    {/* ------------------------------------------- */}
                    {/* PageContent */}
                    {/* ------------------------------------------- */}
                    <Box
                        sx={{
                            paddingTop: "10px",
                        }}
                    >
                        {/* ------------------------------------------- */}
                        {/* Page Route */}
                        {/* ------------------------------------------- */}
                        <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
                            <Outlet />
                        </Box>
                        {/* ------------------------------------------- */}
                        {/* End Page */}
                        {/* ------------------------------------------- */}
                    </Box>
                </PageWrapper>
            </MainWrapper>
    );
};

export default FullLayout;
