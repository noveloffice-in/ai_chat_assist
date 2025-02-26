import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Import your components
import Profile from './settingsComponent/Profile';
import Account from './settingsComponent/Account';
import General from './settingsComponent/General';
import Agents from './settingsComponent/Agents';

const SettingsMain = ({setViewSetting,isDesktop}) => {
  const selectedOption = useSelector((state) => state.settingsReducer.currentSettingChoice);

  // Map options to components
  const componentMap = {
    Profile: <Profile isDesktop={isDesktop} setViewSetting={setViewSetting}/>,
    Account: <Account isDesktop={isDesktop} setViewSetting={setViewSetting}/>,
    General: <General isDesktop={isDesktop} setViewSetting={setViewSetting}/>,
    Agents: <Agents isDesktop={isDesktop} />,
  };

  return (
    <Box sx={{ width: !isDesktop ? 'calc(100vw - 42px)' : 'auto' }}>
      <Stack direction={'row'}>
      {!isDesktop && 
                    <ArrowBackIcon 
                    onClick={() => setViewSetting("main")} 
                    sx={{mr:2}}
                    />}
      <Typography variant="h4">{selectedOption} Settings</Typography>
      </Stack>
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
