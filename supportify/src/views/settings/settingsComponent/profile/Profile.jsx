import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';
import { useFrappeGetDoc, useFrappeUpdateDoc } from 'frappe-react-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { setAgentDisplayName, setAgentName } from '../../../../store/slices/AgentSlice';

export default function Profile() {
    const agentDetails = useSelector((state) => state.agentReducer);

    // Fetch data using useFrappeGetDoc
    const { data, error, isLoading } = useFrappeGetDoc('Agent Profile', agentDetails.agentEmail);
    const { updateDoc } = useFrappeUpdateDoc();

    const dispatch = useDispatch();

    // State for form fields and original data
    const [formData, setFormData] = useState({ agentName: '', agentDisplayName: '' });
    const [originalData, setOriginalData] = useState({ agentName: '', agentDisplayName: '' });
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);

    // Initialize form data with fetched data
    useEffect(() => {
        if (data) {
            const fetchedData = {
                agentName: data.agent_name || '',
                agentDisplayName: data.agent_display_name || '',
            };
            setFormData(fetchedData);
            setOriginalData(fetchedData);
        }
    }, [data]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Check if any field has changed
    useEffect(() => {
        const hasChanges =
            formData.agentName !== originalData.agentName ||
            formData.agentDisplayName !== originalData.agentDisplayName;
        setIsSaveEnabled(hasChanges);
    }, [formData, originalData]);

    // Handle Save button click
    const handleSave = async () => {
        // Simulate saving data
        const response = await updateDoc("Agent Profile", agentDetails.agentEmail, { "agent_name": formData.agentName, "agent_display_name": formData.agentDisplayName });
        if (response) {
            dispatch(setAgentName(response.agent_name));
            dispatch(setAgentDisplayName(response.agent_display_name));
        }
        setOriginalData(formData); // Update original data to match saved data
        setIsSaveEnabled(false); // Disable save button
    };

    return (
        <Box
            sx={{
                padding: '20px',
                maxWidth: '600px',
                margin: '0 auto',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                boxShadow: 5,
            }}
        >
            <Typography variant="h5" sx={{ marginBottom: '20px', textAlign: 'center' }}>
                Agent Profile
            </Typography>
            {isLoading && <Typography>Loading...</Typography>}
            {error && <Typography color="error">Failed to load data</Typography>}
            {!isLoading && !error && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Agent Name"
                            name="agentName"
                            value={formData.agentName}
                            // onChange={handleInputChange}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Agent Display Name"
                            name="agentDisplayName"
                            value={formData.agentDisplayName}
                            onChange={handleInputChange}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            disabled={!isSaveEnabled}
                            sx={{
                                backgroundColor: isSaveEnabled ? '#1976d2' : '#b0bec5',
                                '&:hover': { backgroundColor: isSaveEnabled ? '#1565c0' : '#b0bec5' },
                            }}
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}
