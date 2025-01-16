import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';

// Import your components
import Profile from './settingsComponent/Profile';
import Account from './settingsComponent/Account';
import General from './settingsComponent/General';
import Agents from './settingsComponent/Agents';

const SettingsMain = () => {
  const selectedOption = useSelector((state) => state.settingsReducer.currentSettingChoice);

  // Map options to components
  const componentMap = {
    Profile: <Profile />,
    Account: <Account />,
    General: <General />,
    Agents: <Agents />,
  };

  return (
    <Box>
      <Typography variant="h4">{selectedOption} Settings</Typography>
      <Box sx={{ marginTop: '1rem' }}>
        {/* Render the appropriate component based on the selectedOption */}
        {componentMap[selectedOption] || (
          <Typography variant="body1">Please select a valid option.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default SettingsMain;
