import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const Chat = () => {
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Box sx={{ padding: 2, borderBottom: '1px solid #ddd' }}>
        <Typography variant="h6">Chat</Typography>
      </Box>

      {/* Chat Messages */}
      <Box sx={{ flexGrow: 1, padding: 2, overflowY: 'auto' }}>
        <Typography variant="body1">Hello</Typography>
        <Typography variant="body2" color="textSecondary">We’re busy at the moment...</Typography>
      </Box>

      {/* Input Section */}
      <Box sx={{ padding: 2, borderTop: '1px solid #ddd', display: 'flex', gap: 2 }}>
        <TextField fullWidth placeholder="Reply to live chat" />
        <Button variant="contained">Send</Button>
      </Box>
    </Box>
  );
};

export default Chat;
