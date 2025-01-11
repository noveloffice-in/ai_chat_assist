import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSettingChoice } from '../../store/slices/SettingSlice';
import { Box, List, ListItem, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { IconSettingsCog, IconUserEdit, IconBrandBluesky, IconUsersGroup } from '@tabler/icons-react'

const SettingsSidebar = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const primaryColor = theme.palette.primary.main;

    const selectedOption = useSelector((state) => state.settingsReducer.currentSettingChoice); // Get selected option from Redux store

    const handleClick = (option) => {
        dispatch(setCurrentSettingChoice(option)); // Dispatch the action
    };

    const options = [
        { name: "Profile", icon: <IconUserEdit /> },
        { name: "Account", icon: <IconSettingsCog /> },
        { name: "General", icon: <IconBrandBluesky /> },
        { name: "Agents", icon: <IconUsersGroup /> },
    ];

    return (
        <Box sx={{ width: '25%', backgroundColor: '#f4f4f4', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <h3>Settings</h3>
            <List sx={{ padding: 0 }}>
                {options.map((option) => (
                    <ListItem
                        key={option.name}
                        sx={{
                            backgroundColor: selectedOption === option.name ? primaryColor : 'transparent',
                            color: selectedOption === option.name ? 'white' : 'black',
                            marginBottom: '10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: selectedOption === option.name ? primaryColor : '#f0f0f0', // Light hover effect
                            },
                        }}
                        onClick={() => handleClick(option.name)}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: '36px',
                                p: '3px 2px',
                                color: 'inherit',
                            }}
                        >
                            {option.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={option.name}
                            sx={{
                                fontWeight: selectedOption === option.name ? 'bold' : 'normal', // Add bold styling when selected
                            }}
                        />
                    </ListItem>
                ))}
            </List>

        </Box>
    );
};

export default SettingsSidebar;
