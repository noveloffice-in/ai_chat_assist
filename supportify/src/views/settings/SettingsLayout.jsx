import React, { useEffect } from 'react';
import SettingsSidebar from './SettingsSidebar';
import SettingsMain from './SettingsMain';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { resetCurrentSettingChoice } from '../../store/slices/SettingSlice';

const SettingsLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset the settings choice when navigating to a new setting
    return () => {
      dispatch(resetCurrentSettingChoice());
    };
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <SettingsSidebar />
      <Box sx={{ flex: 1, padding: '20px' }}>
        <SettingsMain />
      </Box>
    </Box>
  );
};

export default SettingsLayout;
