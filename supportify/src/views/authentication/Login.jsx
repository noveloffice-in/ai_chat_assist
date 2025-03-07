// src/components/Login.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Alert, InputAdornment, IconButton, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { useFrappeAuth } from 'frappe-react-sdk';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";
//For password
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const { login, currentUser, getUserCookie } = useFrappeAuth();

    let c = Cookies.set(getUserCookie);

    const notifySuccess = (message) => toast.success(message, { toastId: "success" });
    const notifyError = (message) => toast.error(message, { toastId: "error" });

    // Getting the user details using cookies
    useEffect(() => {
        const handleBackButton = (event) => {
            if (Cookies.get('user_id') !== 'Guest') {
                navigate('/dashboard');
            }
        };

        if (Cookies.get('user_id') !== 'Guest') {
            navigate('/dashboard');
        }

        window.addEventListener('popstate', handleBackButton);

        // Cleanup when component unmounts
        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        login({ username: credentials.email, password: credentials.password })
            .then((res) => {
                notifySuccess('Logged in successfully!');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            })
            .catch((err) => {
                notifyError(err.message);
            });
    };

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                bgcolor="#f5f5f5"
            >
                <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%', mx: 2 }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Supportify
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            margin="normal"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        />

                        {/* <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            margin="normal"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => { setShowPassword(!showPassword) }}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOffIcon size="20" /> : <VisibilityIcon size="20" />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        /> */}

                        <FormControl variant="outlined" fullWidth>
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOffIcon size="20" /> : <VisibilityIcon size="20" />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{ mt: 2 }}
                        >
                            Login
                        </Button>

                        {false && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                    </form>
                </Paper>
            </Box>
            <ToastContainer />
        </>
    );
};

export default Login;