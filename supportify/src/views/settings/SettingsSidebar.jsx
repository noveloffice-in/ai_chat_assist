import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSettingChoice } from '../../store/slices/SettingSlice';
import { Box, Button, List, ListItem, ListItemText, useTheme } from '@mui/material';

const SettingsSidebar = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const primaryColor = theme.palette.primary.main;
    
    const selectedOption = useSelector((state) => state.settingsReducer.currentSettingChoice); // Get selected option from Redux store

    const handleClick = (option) => {
        dispatch(setCurrentSettingChoice(option)); // Dispatch the action
    };

    const options = ["Profile", "Account", "General", "Agents"];

    return (
        <Box sx={{ width: '25%', backgroundColor: '#f4f4f4', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <h3>Settings</h3>
            <List sx={{ padding: 0 }}>
                {options.map((option) => (
                    <ListItem
                        key={option}
                        sx={{
                            backgroundColor: selectedOption === option ?  primaryColor: 'transparent',
                            color: selectedOption === option ? 'white' : 'black',
                            marginBottom: '10px',
                            borderRadius: '5px',
                            cursor: "pointer"
                            //   '&:hover': {
                            //     backgroundColor: selectedOption === option ? '#1976d2' : '#e0e0e0',
                            //   },
                        }}
                        onClick={() => handleClick(option)}
                    >
                        <ListItemText
                            primary={option}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SettingsSidebar;
