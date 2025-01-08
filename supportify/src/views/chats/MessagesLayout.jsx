import React from 'react';
import SessionList from './SessionList';
import Chat from './Chat';
import Details from './Details';
import { Box, Grid } from '@mui/material';

const MessagesLayout = () => {
  // console.log(socket);
  
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar: SessionList */}
      <Box sx={{ width: '25%', border: '1px solid #ddd', overflowY: 'auto' }}>
        <SessionList />
      </Box>

      {/* Chat Section */}
      <Box sx={{ width: '50%', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
        <Chat />
      </Box>

      {/* Details Section */}
      <Box sx={{ width: '25%', border: '1px solid #ddd', overflowY: 'auto' }}>
        <Details />
      </Box>
    </Box>
  );
};

export default MessagesLayout;
