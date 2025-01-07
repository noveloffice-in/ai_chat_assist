// src/components/Login.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';
import { useFrappeAuth } from 'frappe-react-sdk';
import Cookies from 'js-cookie';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const { login, currentUser, getUserCookie } = useFrappeAuth();

    let c = Cookies.set(getUserCookie);

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
                console.log(res.message);
                navigate('/dashboard');
            })
            .catch((err) => {
                console.log(err);
            })
    };

    return (
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
                    Smartsupp Clone Login
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        margin="normal"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
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
    );
};

export default Login;