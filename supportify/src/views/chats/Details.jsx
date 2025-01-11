import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const Details = () => {
  const details = [
    { label: 'Visits', value: '1' },
    { label: 'Chats', value: '1' },
    { label: 'Browser', value: 'Linux x86_64, Brave 131.0.0.0' },
  ];

  return (
    <Box>
      <Box sx={{ padding: "0.9rem 1rem", borderBottom: '1px solid #ddd' }}>
        <Typography variant="h6">Client Details</Typography>
      </Box>
      <List>
        {details.map((detail, index) => (
          <ListItem key={index}>
            <ListItemText primary={detail.label} secondary={detail.value} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Details;
