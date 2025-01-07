import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Button,
    Switch,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Chip,
    Paper,
    Drawer,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme
} from '@mui/material';
import {
    Settings as SettingsIcon,
    Group as GroupIcon,
    Person as PersonIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { useFrappeGetDocList } from 'frappe-react-sdk';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        color: theme.palette.common.black,
        borderRight: '1px solid #e0e0e0',
        top: 'auto',
        left: 'auto',
        width: '28%',
        zIndex: '0',
    }
}));

const SettingsContainer = styled(Box)({
    display: 'flex',
    overflow: 'auto',
    width: '100%',
});

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
    margin: '4px 8px',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: active ? theme.palette.primary.main : 'transparent',
    color: active ? theme.palette.common.white : theme.palette.common.black,
    '&:hover': {
        backgroundColor: active
            ? theme.palette.primary.dark
            : theme.palette.action.hover,
    },
    '& .MuiListItemIcon-root': {
        color: 'inherit'
    }
}));

const HeaderContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
});

const SettingsComponent = () => {
    const theme = useTheme();
    const [activeSection, setActiveSection] = useState('Agents');

    const agents = [
        {
            name: "Ragul KM",
            email: "developer.ragul@gmail.com",
            accessLevel: "Owner",
            lastLogin: "12/30/2024, 02:55 PM",
            active: true
        },
        {
            name: "reddappareddy18@gma...",
            email: "reddappareddy18@gmail.com",
            accessLevel: "Full access",
            lastLogin: "11/30/2024, 02:28 PM",
            active: true
        },
        {
            name: "tawhid.a@noveloffice.in",
            email: "tawhid.a@noveloffice.in",
            accessLevel: "Full access",
            lastLogin: "9/16/2024, 06:41 PM",
            active: true
        },
        {
            name: "azhar.ferris@frontads.org",
            email: "azhar.ferris@frontads.org",
            accessLevel: "Full access",
            lastLogin: "9/18/2024, 04:36 PM",
            active: true
        },
        {
            name: "prabhudev.a",
            email: "prabhudev.a@noveloffice.in",
            accessLevel: "Full access",
            lastLogin: "1/6/2025, 10:17 AM",
            active: true
        }
    ];

    const { data: agentsData, error, isLoading } = useFrappeGetDocList('Agent Profile', {
        fields: ['*'],
        limit: 1000,
    });
    console.log(agentsData, 'agentsData');


    const menuSections = {
        general: [
            { icon: <SettingsIcon />, text: 'Account settings' },
            { icon: <GroupIcon />, text: 'Agents' },
            { icon: <PersonIcon />, text: 'Profile' },
        ]
    };

    const handleMenuClick = (text) => {
        setActiveSection(text);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'Agents':
                return (
                    <>
                        <HeaderContainer sx={{ borderBottom: '1px solid #e0e0e0' }}>
                            <Typography variant="h5" fontWeight={500}>
                                Agents
                            </Typography>

                        </HeaderContainer>
                        <Paper sx={{ pr: 4, pl: 4, boxShadow: 'none' }}>
                            <Paper elevation={1} sx={{ boxShadow: 'none' }}>
                                <TableContainer >
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ background: '#edeeef', borderTopLeftRadius: '10px' }}>
                                                <TableCell>NAME</TableCell>
                                                <TableCell>ACCESS LEVEL</TableCell>
                                                <TableCell>ACTIVE</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {agents.map((agent, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Avatar>{agent.name[0]}</Avatar>
                                                            <Box>
                                                                <Typography variant="body1">
                                                                    {agent.name}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {agent.email}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={agent.accessLevel}
                                                            sx={{
                                                                bgcolor: agent.accessLevel === 'Owner'
                                                                    ? theme.palette.success.light
                                                                    : theme.palette.warning.light,
                                                                color: agent.accessLevel === 'Owner'
                                                                    ? theme.palette.success.dark
                                                                    : theme.palette.warning.dark
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Switch checked={agent.active} color="primary" />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Paper>
                    </>
                );
            case 'Account settings':
                return (
                    <Typography variant="h5">Account Settings Content</Typography>
                );
            case 'Profile':
                return (
                    <Typography variant="h5">Profile Content</Typography>
                );
            default:
                return null;
        }
    };

    return (
        <SettingsContainer>
            <StyledDrawer variant="permanent" sx={{ width: '30%' }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }} />
                {Object.entries(menuSections).map(([section, items]) => (
                    <Box key={section} sx={{ mb: 3 }}>
                        <List>
                            {items.map((item) => (
                                <StyledListItem
                                    button
                                    key={item.text}
                                    onClick={() => handleMenuClick(item.text)}
                                    active={activeSection === item.text}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: activeSection === item.text
                                                ? 'inherit'
                                                : theme.palette.text.primary
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </StyledListItem>
                            ))}
                        </List>
                    </Box>
                ))}
            </StyledDrawer>

            <Box sx={{ width: '70%', pt: 4, pb: 4 }}>
                {renderContent()}
            </Box>
        </SettingsContainer>
    );
};

export default SettingsComponent;