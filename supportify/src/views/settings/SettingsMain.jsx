import React from 'react';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state
import { Box, Typography } from '@mui/material';

const SettingsMain = () => {
  const selectedOption = useSelector((state) => state.settingsReducer.currentSettingChoice); // Get selectedOption from Redux store

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4">{selectedOption} Settings</Typography>
      <Typography variant="body1">Here are the settings for {selectedOption}.</Typography>
      {/* You can add more detailed content for each option here */}
    </Box>
  );
};

export default SettingsMain;
