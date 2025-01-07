import React, { useState } from 'react';
import { Box, Tabs, Tab, List, ListItem, ListItemText, Typography } from '@mui/material';

const SessionList = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [subTab, setSubTab] = useState('all');

  const handleTabChange = (event, newValue) => setActiveTab(newValue);
  const handleSubTabChange = (event, newValue) => setSubTab(newValue);

  const sessions = {
    open: {
      all: ['Session 1', 'Session 2', 'Session 3'],
      mine: ['Session 1'],
    },
    resolved: {
      all: ['Session 4', 'Session 5'],
      mine: ['Session 4'],
    },
  };

  return (
    <Box>
      {/* Main Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Open" value="open" />
        <Tab label="Resolved" value="resolved" />
      </Tabs>

      {/* Sub Tabs */}
      <Tabs value={subTab} onChange={handleSubTabChange} variant="fullWidth" sx={{ borderBottom: '1px solid #ddd' }}>
        <Tab label="All" value="all" />
        <Tab label="Mine" value="mine" />
      </Tabs>

      {/* Session List */}
      <List>
        {sessions[activeTab][subTab].map((session, index) => (
          <ListItem button key={index}>
            <ListItemText primary={session} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SessionList;
