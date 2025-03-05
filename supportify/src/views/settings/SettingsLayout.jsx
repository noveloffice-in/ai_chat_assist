import React, { useEffect, useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useDispatch } from 'react-redux';
import { resetCurrentSettingChoice } from '../../store/slices/SettingSlice';
import SettingsSidebar from './SettingsSidebar';
import SettingsMain from './SettingsMain';

/**
 * SettingsLayout Component - Manages the layout of the settings page.
 * It displays the settings sidebar and main settings content based on screen size and user interaction.
 *
 * @component
 * @returns {JSX.Element} The rendered SettingsLayout component.
 */
const SettingsLayout = () => {
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery("(min-width:900px)");
  const [viewSetting, setViewSetting] = useState("main");

  useEffect(() => {
    /**
     * Cleanup function to reset the current setting choice when the component unmounts.
     */
    return () => {
      dispatch(resetCurrentSettingChoice());
    };
  }, [dispatch]);

  // Determines which sections to display based on screen size and user selection
  const showSidebar = isDesktop || viewSetting === "main";
  const showSettings = isDesktop || viewSetting === "settings";

  return (
    <Box sx={{ display: 'flex', height: isDesktop ? '100vh' : 'auto' }}>
      {/* Sidebar: SettingsSidebar */}
      {showSidebar && <SettingsSidebar isDesktop={isDesktop} setViewSetting={setViewSetting} />}

      {/* Main Settings Section */}
      {showSettings && (
        <Box sx={{ flex: 1, p: 2 }}>
          <SettingsMain isDesktop={isDesktop} setViewSetting={setViewSetting} />
        </Box>
      )}
    </Box>
  );
};

export default SettingsLayout;
