import React, { useEffect, useState } from "react";
import { useFrappeGetDoc, useFrappeUpdateDoc } from "frappe-react-sdk";
import { TextField, Button, Box, Stack, Typography, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";

export default function WidgetSettings() {
    const { data: widgetSettingsDoc, isLoading, error: errorGetDoc } = useFrappeGetDoc("Widget Settings", "Widget Settings");
    const { updateDoc } = useFrappeUpdateDoc();

    const [formData, setFormData] = useState({
        welcome_message: "",
        returning_message: "",
        allowed_origins: [],
        restricted_paths: []
    });
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        if (widgetSettingsDoc) {
            setFormData({
                welcome_message: widgetSettingsDoc.welcome_message || "",
                returning_message: widgetSettingsDoc.returning_message || "",
                allowed_origins: widgetSettingsDoc.allowed_origins || [],
                restricted_paths: widgetSettingsDoc.restricted_paths || []
            });
        }
    }, [widgetSettingsDoc]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsChanged(true);
    };

    const handleTableChange = (table, index, value) => {
        const updatedTable = [...formData[table]];
        updatedTable[index].path = value;
        setFormData(prev => ({ ...prev, [table]: updatedTable }));
        setIsChanged(true);
    };

    const handleAddRow = (table) => {
        setFormData(prev => ({ ...prev, [table]: [...prev[table], { path: "" }] }));
        setIsChanged(true);
    };

    const handleDeleteRow = (table, index) => {
        const updatedTable = formData[table].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [table]: updatedTable }));
        setIsChanged(true);
    };

    const handleSave = async () => {
        try {
            await updateDoc(
                "Widget Settings",
                "Widget Settings",
                formData
            );
            toast.success("Settings saved successfully");
            setIsChanged(false);
        } catch (error) {
            toast.error("Failed to save settings");
        }
    };

    return (
        <>
            <Box px={1} width="100%">
                <Stack direction="row" justifyContent="flex-end" mb={2}>
                    <Button variant="contained" color="primary" onClick={handleSave} disabled={!isChanged}>
                        Save
                    </Button>
                </Stack>
                <Stack direction="row" spacing={2} mb={2}>
                    <TextField
                        label="Welcome Message"
                        multiline
                        minRows={4}
                        fullWidth
                        value={formData.welcome_message}
                        onChange={(e) => handleChange("welcome_message", e.target.value)}
                    />
                    <TextField
                        label="Returning Message"
                        multiline
                        minRows={4}
                        fullWidth
                        value={formData.returning_message}
                        onChange={(e) => handleChange("returning_message", e.target.value)}
                    />
                </Stack>

                <Stack direction="row" spacing={2}>
                    <TableSection title="Allowed Domains" tableKey="allowed_origins" data={formData.allowed_origins} handleTableChange={handleTableChange} handleAddRow={handleAddRow} handleDeleteRow={handleDeleteRow} />
                    <TableSection title="Restricted Pages" tableKey="restricted_paths" data={formData.restricted_paths} handleTableChange={handleTableChange} handleAddRow={handleAddRow} handleDeleteRow={handleDeleteRow} />
                </Stack>
            </Box>
            <ToastContainer />
        </>
    );
}

function TableSection({ title, tableKey, data, handleTableChange, handleAddRow, handleDeleteRow }) {
    return (
        <Box flex={1}>
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Path</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={row.path}
                                        onChange={(e) => handleTableChange(tableKey, index, e.target.value)}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => handleDeleteRow(tableKey, index)}>
                                        <Delete fontSize="small" color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Stack direction="row" justifyContent="flex-start" pl={2} py={1}>
                    <Button variant="outlined" size="small" startIcon={<Add />} onClick={() => handleAddRow(tableKey)}>
                        Add Row
                    </Button>
                </Stack>
            </TableContainer>
        </Box>
    );
}
