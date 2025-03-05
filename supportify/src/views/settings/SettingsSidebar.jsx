import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSettingChoice } from '../../store/slices/SettingSlice';
import { Box, List, ListItem, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { IconSettingsCog, IconUserEdit, IconBrandBluesky, IconUsersGroup, IconTags } from '@tabler/icons-react'
import { useFrappeGetDoc } from 'frappe-react-sdk';
import { setAgentAdminStatus } from '../../store/slices/AgentSlice';

const SettingsSidebar = ({ setViewSetting, isDesktop }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const primaryColor = theme.palette.primary.main;

    const selectedOption = useSelector((state) => state.settingsReducer.currentSettingChoice); // Get selected option from Redux store
    const agent = useSelector((state) => state.agentReducer);
    const { data: agentData } = useFrappeGetDoc("Agent Profile", agent.agentEmail);

    const handleClick = (option) => {
        setViewSetting("settings")
        dispatch(setCurrentSettingChoice(option)); // Dispatch the action
    };

    useEffect(() => {
        if (agentData && agentData.is_admin !== agent.isAdmin) dispatch(setAgentAdminStatus(Boolean(agentData.is_admin)));
    })

    const options = [
        { name: "Profile", icon: <IconUserEdit /> },
        { name: "Shortcuts", icon: <IconSettingsCog /> },
        { name: "General", icon: <IconBrandBluesky /> },
    ];

    if (agentData && agentData.is_admin) {
        options.push({ name: "Agents", icon: <IconUsersGroup /> });
        options.push({ name: "Tags", icon: <IconTags /> });
    }

    return (
        <Box sx={{ width: isDesktop ? '25%' : '100%', backgroundColor: '#f4f4f4', padding: '20px', display: 'flex', flexDirection: 'column' }}>
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
