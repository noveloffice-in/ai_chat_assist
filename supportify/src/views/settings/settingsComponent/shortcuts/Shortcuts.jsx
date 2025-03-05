import React from 'react'
import CannedMessages from './CannedMessages'
import { Tab, Tabs } from '@mui/material'

export default function Account() {

    const [activeTab, setActiveTab] = React.useState('personal');

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    return (
        <>
            {/* Main Tabs */}
            <Tabs value={activeTab} onChange={handleTabChange} variant="standard">
                <Tab label="Personal" value="personal" />
                <Tab label="Team" value="team" />
            </Tabs>

            <CannedMessages doctype={activeTab} />
        </>
    )
};
