import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import Cookies from 'js-cookie';

import { IconListCheck, IconMail, IconUser } from '@tabler/icons-react';

import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import { useFrappeAuth, useFrappeUpdateDoc } from 'frappe-react-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { resetCurrentSessionState } from '../../../store/slices/CurrentSessionSlice';
import { setCurrentSettingChoice, resetTheme } from '../../../store/slices/SettingSlice';

const Profile = () => {

  const [anchorEl2, setAnchorEl2] = useState(null);
  const navigate = useNavigate();
  const {
    currentUser,
    isValidating,
    isLoading,
    login,
    logout,
    error,
    updateCurrentUser,
    getUserCookie,
  } = useFrappeAuth();

  const dispatch = useDispatch();

  const { updateDoc } = useFrappeUpdateDoc();

  const agentDetails = useSelector((state) => state.agentReducer);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = () => {
    updateDoc("Agent Profile", agentDetails.agentEmail, { is_available: 0 })
    Cookies.remove(getUserCookie);
    localStorage.clear();
    dispatch(resetCurrentSessionState());
    dispatch(resetTheme());
    logout();
    setTimeout(() => {
      navigate("/login");
      //,uncomment this if you want permissions to apply without user refresh
      // window.location.reload(true);
    }, 500);
  }

  const handleProfileClick = () => {
    dispatch(setCurrentSettingChoice('Profile'));
    navigate('/settings');
    setAnchorEl2(null);
  }

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        style={{
          left: '75px',
          top: '-45px'
        }}
        elevation={7}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '200px',
          },
        }}
      >
        <MenuItem disabled>
          <ListItemText>{currentUser}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button onClick={handleLogout} variant="outlined" color="primary" component={Link} fullWidth>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
