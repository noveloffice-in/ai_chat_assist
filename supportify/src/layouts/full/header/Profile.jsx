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
import { useFrappeAuth } from 'frappe-react-sdk';
import { useDispatch } from 'react-redux';
import { resetCurrentSessionState } from '../../../store/slices/CurrentSessionSlice';

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

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = () => {
    logout();
    Cookies.remove(getUserCookie);
    localStorage.clear();
    dispatch(resetCurrentSessionState())
    setTimeout(() => {
      navigate("/login");
      //,uncomment this if you want permissions to apply without user refresh
      // window.location.reload(true);
    }, 500);
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
        <MenuItem>
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
